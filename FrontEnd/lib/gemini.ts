import { GoogleGenerativeAI } from "@google/generative-ai";

// Ambil API Key dari .env.local
const genAI = new GoogleGenerativeAI(
  process.env.AIzaSyDBlYXJx1AY17XVInOQu_TQ9C6jIjcmFuc || "",
);

export async function generateProjectDescription(title: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Versi cepat & gratis

  const prompt = `Tuliskan deskripsi arsitektur singkat dan profesional untuk proyek bernama "${title}" dalam Bahasa Indonesia. Fokus pada estetika dan fungsi.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
