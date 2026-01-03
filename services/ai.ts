
import { GoogleGenAI, Modality } from "@google/genai";

export class GeminiService {
  private static ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  /**
   * 解析医疗报告图片
   */
  static async parseReport(fileBase64: string, mimeType: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [
          { text: "作为医疗数据专家，请提取化验单指标。必须返回标准JSON：{indicators: {[key: string]: number}, type: string, date: string}。注意：Tumor, Blood, Liver等类型分类。" },
          { inlineData: { data: fileBase64, mimeType } }
        ]
      }],
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  }

  /**
   * 获取实时语音对话连接
   */
  static async connectLive(callbacks: any, systemInstruction: string, voice: 'Kore' | 'Puck' | 'Zephyr' = 'Kore') {
    return this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } }
        },
        systemInstruction,
      }
    });
  }
}
