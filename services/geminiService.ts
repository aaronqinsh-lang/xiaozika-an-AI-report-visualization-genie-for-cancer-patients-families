import { GoogleGenAI } from "https://esm.sh/@google/genai@1.34.0";
import { UserProfile, ChatMessage } from "../types";

/**
 * Generates a response from the Gemini assistant based on user query and profile.
 */
export const getAssistantResponse = async (
  query: string,
  category: string,
  userProfile: UserProfile,
  history: ChatMessage[]
): Promise<{ text: string; sources: Array<{ title: string; uri: string }> }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const userContext = `用户姓名: ${userProfile.name}, 诊断: ${userProfile.diagnosis || '未知'}, 病史: ${userProfile.medical_history || '未知'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: `${userContext}\n\n当前提问: ${query}` }] },
      config: {
        systemInstruction: `你是一位专业且充满同理心的抗癌管家。请始终使用中文回复。

回复格式必须满足以下要求：
1. 严禁使用任何 Markdown 语法（如 #, **, > 等）。
2. 使用双换行符严格区分以下三个模块：

【核心结论】
直接回答用户问题的关键。例如：“张老伯，您目前的指标在安全范围内，请放心。”

【深度解析】
结合病史解释原因。例如：
1. 白细胞数值虽有波动但符合化疗后的正常反应。
2. 相比上周，指标正趋于平稳。

【温馨提醒与关怀】
提供生活或就医建议。例如：
1. 建议补充优质蛋白，多吃鱼虾。
2. 保持室内空气流通。
3. 别太担心，我们会一直陪着您。

注意：每段话保持简短（不超过4行），语言要像家人聊天一样温暖，避免堆砌专业名词。`,
        temperature: 0.7,
      },
    });

    return {
      text: response.text || "抱歉，我的思绪断了，能请您重新问一下吗？",
      sources: []
    };
  } catch (error: any) {
    console.error("Gemini Assistant Error:", error);
    return { text: "由于网络波动，我暂时没能连上云端，请稍后再次发送消息。", sources: [] };
  }
};