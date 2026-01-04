import { GoogleGenAI } from "@google/genai";
import { UserProfile, ChatMessage } from "../types";

/**
 * 带有指数退避的简易重试函数，处理网络抖动导致的 Failed to fetch
 */
async function retry<T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isNetworkError = error.message?.includes('fetch') || error.name === 'TypeError';
    if (retries > 0 && isNetworkError) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * 生成 AI 助手回复
 */
export const getAssistantResponse = async (
  query: string,
  category: string,
  userProfile: UserProfile,
  history: ChatMessage[]
): Promise<{ text: string; sources: Array<{ title: string; uri: string }> }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const userContext = `患者姓名: ${userProfile.name}, 诊断: ${userProfile.diagnosis || '未知'}, 病史: ${userProfile.medical_history || '未知'}`;

    const response = await retry(async () => {
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ text: `${userContext}\n\n当前提问: ${query}` }] },
        config: {
          systemInstruction: `你是一位专业且充满同理心的抗癌管家。请始终使用中文回复。

回复格式必须严格遵守以下结构，各部分之间使用双换行符分隔：

【核心结论】
用1-2句最简洁的话告诉用户目前的病情状况或问题的核心答案。

【深度解析】
1. 结合病史和数据进行科学解释。
2. 解释指标波动的可能原因。
3. 语言要通俗易懂，避免堆砌医学黑话。

【温馨提醒与关怀】
1. 提供具体的日常护理、饮食或心态建议。
2. 给用户一段鼓励，体现人文关怀。
3. 提示下次就诊可以咨询医生的重点。

重要原则：
- 严禁使用任何 Markdown 语法（如 #, **, > 等）。
- 仅使用纯文本、换行、数字编号。
- 确保段落清晰，不要文字堆叠。
- 始终保持温暖、耐心的语气。`,
          temperature: 0.7,
        },
      });
    });

    return {
      text: response.text || "抱歉，我现在无法生成回复，请稍后再试。",
      sources: []
    };
  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    const isFetchError = error.message?.includes('fetch') || error.name === 'TypeError';
    return { 
      text: isFetchError 
        ? "【核心结论】\n连接服务失败。\n\n【深度解析】\n由于网络环境不稳定，未能成功从云端获取分析建议。这通常是临时的连接问题。\n\n【温馨提醒与关怀】\n请检查您的网络设置，或稍后点击发送按钮重试。我会一直在这里等您。" 
        : "【核心结论】\n服务暂时不可用。\n\n【深度解析】\nAI 模块在处理您的请求时遇到了意外波动。\n\n【温馨提醒与关怀】\n别担心，建议您先喝口水休息一下，稍后再来找我聊天。", 
      sources: [] 
    };
  }
};