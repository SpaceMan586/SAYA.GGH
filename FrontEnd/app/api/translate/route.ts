import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import {
  getKnownLocalizedContent,
  isLanguage,
  type Language,
} from "@/lib/i18n";

export const dynamic = "force-dynamic";

const MAX_TEXT_LENGTH = 4000;

const languageName: Record<Language, string> = {
  en: "English",
  id: "Indonesian",
};

const cleanTranslation = (value: string) =>
  value
    .trim()
    .replace(/^```(?:text)?/i, "")
    .replace(/```$/i, "")
    .trim()
    .replace(/^["']|["']$/g, "");

const translateWithGemini = async (
  text: string,
  targetLanguage: Language,
  sourceLanguage?: Language,
) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const source = sourceLanguage ? languageName[sourceLanguage] : "the detected language";

  const prompt = [
    `Translate this text from ${source} to ${languageName[targetLanguage]}.`,
    "Return only the translated text.",
    "Preserve names, numbers, URLs, punctuation, and line breaks.",
    "",
    text,
  ].join("\n");

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return cleanTranslation(response.text());
};

const translateWithGoogleFallback = async (
  text: string,
  targetLanguage: Language,
  sourceLanguage?: Language,
) => {
  const params = new URLSearchParams({
    client: "gtx",
    sl: sourceLanguage ?? "auto",
    tl: targetLanguage,
    dt: "t",
    q: text,
  });

  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?${params.toString()}`,
    { cache: "no-store" },
  );

  if (!response.ok) return null;

  const payload = (await response.json()) as unknown;
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) return null;

  const translated = payload[0]
    .map((entry) => (Array.isArray(entry) && typeof entry[0] === "string" ? entry[0] : ""))
    .join("");

  return cleanTranslation(translated);
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      text?: unknown;
      targetLanguage?: unknown;
      sourceLanguage?: unknown;
    } | null;

    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const targetLanguage = body?.targetLanguage;
    const sourceLanguage = body?.sourceLanguage;

    if (!text) {
      return NextResponse.json({ translation: "" });
    }

    if (!isLanguage(targetLanguage)) {
      return NextResponse.json(
        { message: "Invalid target language" },
        { status: 400 },
      );
    }

    const normalizedSourceLanguage = isLanguage(sourceLanguage)
      ? sourceLanguage
      : undefined;

    const knownTranslation = getKnownLocalizedContent(text, targetLanguage);
    if (knownTranslation) {
      return NextResponse.json({ translation: knownTranslation });
    }

    const safeText = text.slice(0, MAX_TEXT_LENGTH);

    const translation =
      (await translateWithGemini(
        safeText,
        targetLanguage,
        normalizedSourceLanguage,
      ).catch(() => null)) ||
      (await translateWithGoogleFallback(
        safeText,
        targetLanguage,
        normalizedSourceLanguage,
      ).catch(() => null)) ||
      safeText;

    return NextResponse.json({ translation });
  } catch {
    return NextResponse.json(
      { message: "Translation failed" },
      { status: 500 },
    );
  }
}
