
import { MEMOS_CONFIG } from "../constants";

export class MemoryService {
  static async saveToMemory(content: string) {
    try {
      await fetch(`${MEMOS_CONFIG.BASE_URL}/add/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${MEMOS_CONFIG.API_KEY}`
        },
        body: JSON.stringify({
          user_id: MEMOS_CONFIG.USER_ID,
          conversation_id: "health_context",
          messages: [{ role: "user", content }]
        })
      });
    } catch (e) { console.error("Memory Save Error", e); }
  }

  static async searchContext(query: string): Promise<string> {
    try {
      const res = await fetch(`${MEMOS_CONFIG.BASE_URL}/search/memory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${MEMOS_CONFIG.API_KEY}`
        },
        body: JSON.stringify({ query, user_id: MEMOS_CONFIG.USER_ID, conversation_id: "global" })
      });
      const data = await res.json();
      return data?.memory || "尚无历史病情记录";
    } catch (e) { return "记忆检索异常"; }
  }
}
