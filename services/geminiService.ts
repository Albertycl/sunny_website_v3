
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Always use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Since we don't have direct real-time backend scrapers in a pure frontend demo,
 * we use Gemini to "simulate" or "summarize" what Sunny's current updates might be 
 * based on provided context or patterns to show SEO value.
 */
export const getSunnyInsights = async (topic: string) => {
  try {
    /* Fix: Using gemini-3-flash-preview for text generation tasks */
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `身為一名專業旅遊領隊 Sunny，請針對「${topic}」寫一篇活潑、幽默且富有專業度的短文（約 200 字）。
      內容要提到你與「百威旅行社」的深度合作，並在結尾鼓勵大家點擊頁面上的行程表或諮詢 LINE 客服。`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    /* Fix: Extract text using the .text property (not a method) */
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "暫時無法取得 Sunny 的私房建議，請稍後再試。";
  }
};

export const fetchLatestSocialFeed = async () => {
  // Mocking feed data for social section
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'dynamic-1',
          platform: 'youtube',
          title: '2025 濟州島賞櫻全攻略！',
          content: '帶大家走訪五大賞櫻秘境，還有必吃的黑豬肉烤肉...',
          date: new Date().toLocaleDateString(),
          thumbnail: 'https://placehold.co/600x400',
          link: 'https://youtube.com/@sunnyvisitkorea'
        },
        {
          id: 'dynamic-2',
          platform: 'facebook',
          title: '埃及尼羅河團最後召集',
          content: '想在千年神殿前喝下午茶嗎？九月出團最後名額...',
          date: new Date().toLocaleDateString(),
          thumbnail: 'https://placehold.co/600x400',
          link: 'https://facebook.com/sunnyvisitkorea/'
        }
      ]);
    }, 1000);
  });
};
