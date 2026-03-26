import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
  }
  return new GoogleGenerativeAI(apiKey);
};

export async function generateProjectDescription(title: string) {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Versi cepat & gratis

  const prompt = `Tuliskan deskripsi arsitektur singkat dan profesional untuk proyek bernama "${title}" dalam Bahasa Indonesia. Fokus pada estetika dan fungsi.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
