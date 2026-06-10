import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { encodeChatContent } from "@/lib/chatMessage";
import {
  getTranslation,
  isLanguage,
  localizeContent,
  type Language,
  type TranslationKey,
} from "@/lib/i18n";
import {
  CHAT_SESSION_ID_COOKIE,
  CHAT_SESSION_SIG_COOKIE,
  verifyChatSessionSignature,
} from "@/lib/chatSessionCookies";
import { checkServerRateLimit } from "@/lib/serverRateLimit";

const SESSION_ID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const toPositiveInt = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
};

const getRequesterIp = (req: NextRequest) => {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
};

const safeString = (value: unknown) => {
  return typeof value === "string" ? value.trim() : "";
};

const translate = (language: Language, key: TranslationKey) =>
  getTranslation(language, key);

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const getTokens = (value: string) =>
  normalizeText(value)
    .split(" ")
    .filter((word) => word.length > 2);

const includesAny = (text: string, phrases: string[]) =>
  phrases.some((phrase) => text.includes(normalizeText(phrase)));

const conversationalReplies = {
  id: {
    greeting:
      "Halo, senang bertemu kamu. Saya bisa bantu soal studio, proyek, layanan desain, budget awal, atau kontak SAYA.GGH. Mau mulai dari mana?",
    test:
      "Tes masuk. Chat AI SAYA.GGH aktif dan siap bantu. Kamu bisa tanya soal lokasi, layanan, budget, portfolio, atau jadwal konsultasi.",
    thanks:
      "Sama-sama. Kalau masih ada yang ingin dicari, tinggal tulis saja. Saya bantu arahkan.",
    contact:
      "Bisa. Untuk respons paling cepat, kamu bisa hubungi SAYA.GGH lewat tombol WhatsApp di bawah. Kalau mau, tuliskan juga kebutuhan proyekmu di sini supaya saya bantu rangkum dulu.",
    fallback:
      "Bisa saya bantu, tapi saya perlu sedikit konteks lagi. Kamu ingin tanya soal lokasi, layanan desain, budget, portfolio, atau jadwal konsultasi?",
    knowledgePrefix: "Bisa. Ini info yang saya punya:",
  },
  en: {
    greeting:
      "Hi, nice to meet you. I can help with the studio, projects, design services, starting budget, or SAYA.GGH contact details. Where would you like to start?",
    test:
      "Test received. SAYA.GGH chat is active and ready. You can ask about location, services, budget, portfolio, or consultation schedule.",
    thanks:
      "You're welcome. If you want to look for anything else, just send it here and I'll help guide you.",
    contact:
      "Sure. For the quickest response, use the WhatsApp button below. You can also describe your project here and I'll help summarize what you need.",
    fallback:
      "I can help, but I need a little more context. Are you asking about location, design services, budget, portfolio, or consultation schedule?",
    knowledgePrefix: "Sure. Here's what I have:",
  },
} satisfies Record<
  Language,
  Record<
    "greeting" | "test" | "thanks" | "contact" | "fallback" | "knowledgePrefix",
    string
  >
>;

const getConversationalReply = (message: string, language: Language) => {
  const text = normalizeText(message);
  const tokens = getTokens(text);
  const shortMessage = tokens.length <= 3;

  if (
    shortMessage &&
    includesAny(text, [
      "halo",
      "hai",
      "hi",
      "hello",
      "hey",
      "pagi",
      "siang",
      "sore",
      "malam",
    ])
  ) {
    return conversationalReplies[language].greeting;
  }

  if (
    shortMessage &&
    includesAny(text, ["test", "tes", "testing", "cek", "check", "ping"])
  ) {
    return conversationalReplies[language].test;
  }

  if (
    shortMessage &&
    includesAny(text, ["thanks", "thank you", "terima kasih", "makasih", "thx"])
  ) {
    return conversationalReplies[language].thanks;
  }

  if (
    includesAny(text, [
      "whatsapp",
      "wa",
      "contact",
      "kontak",
      "hubungi",
      "phone",
      "telepon",
      "nomor",
      "email",
    ])
  ) {
    return conversationalReplies[language].contact;
  }

  return "";
};

const synonymGroups = [
  ["lokasi", "alamat", "tempat", "dimana", "posisi", "kantor", "studio"],
  ["location", "address", "where", "place", "office", "studio"],
  ["harga", "biaya", "tarif", "budget", "anggaran", "mahal", "murah", "rate"],
  ["price", "cost", "fee", "rate", "budget", "expensive", "cheap"],
  ["kontak", "hubungi", "wa", "whatsapp", "telpon", "telepon", "email", "nomor"],
  ["contact", "whatsapp", "phone", "email", "number", "reach"],
  ["layanan", "jasa", "bikin", "buat", "desain", "bangun", "renovasi"],
  ["service", "design", "build", "renovation", "interior", "architecture"],
  ["portfolio", "karya", "proyek", "hasil", "contoh", "gambar"],
  ["project", "portfolio", "work", "example", "image", "gallery"],
];

const formatKnowledgeReply = (content: string, language: Language) => {
  const trimmed = content.trim();
  if (!trimmed) return conversationalReplies[language].fallback;
  return `${conversationalReplies[language].knowledgePrefix}\n\n${trimmed}`;
};

export async function POST(req: NextRequest) {
  let responseLanguage: Language = "id";

  try {
    const ip = getRequesterIp(req);
    const rateLimit = checkServerRateLimit({
      namespace: "api-chat-message",
      key: ip,
      windowMs: 60 * 1000,
      max: toPositiveInt(process.env.CHAT_MAX_REQUESTS_PER_MINUTE, 30),
    });

    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        {
          reply: translate(responseLanguage, "chat.tooMany"),
        },
        { status: 429 },
      );
      response.headers.set("Retry-After", String(rateLimit.retryAfterSec));
      return response;
    }

    const payload = (await req.json().catch(() => null)) as
      | { message?: unknown; sessionId?: unknown; language?: unknown }
      | null;
    const message = safeString(payload?.message);
    const sessionId = safeString(payload?.sessionId);
    responseLanguage = isLanguage(payload?.language) ? payload.language : "id";

    if (!message) {
      return NextResponse.json({ message: "Message is required" }, { status: 400 });
    }

    if (message.length > toPositiveInt(process.env.CHAT_MAX_MESSAGE_LENGTH, 2000)) {
      return NextResponse.json({ message: "Message is too long" }, { status: 400 });
    }

    if (!SESSION_ID_REGEX.test(sessionId)) {
      return NextResponse.json({ message: "Invalid sessionId format" }, { status: 400 });
    }

    const cookieSessionId = req.cookies.get(CHAT_SESSION_ID_COOKIE)?.value || "";
    const cookieSessionSig = req.cookies.get(CHAT_SESSION_SIG_COOKIE)?.value || "";
    const isCookieMatch =
      cookieSessionId === sessionId &&
      verifyChatSessionSignature(sessionId, cookieSessionSig);

    if (!isCookieMatch) {
      return NextResponse.json(
        { reply: translate(responseLanguage, "chat.invalidSession") },
        { status: 403 },
      );
    }

    const userMessage = normalizeText(message);

    // 1. Pastikan sesi ada lalu simpan pesan user
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("chat_sessions")
      .select("status")
      .eq("id", sessionId)
      .maybeSingle();

    if (sessionError || !session) {
      return NextResponse.json(
        { reply: translate(responseLanguage, "chat.sessionNotFound") },
        { status: 404 },
      );
    }

    const { error: userMessageError } = await supabaseAdmin.from("chat_messages").insert([
      {
        session_id: sessionId,
        content: encodeChatContent("user", message),
      },
    ]);
    if (userMessageError) {
      return NextResponse.json(
        { reply: translate(responseLanguage, "chat.saveFailed") },
        { status: 500 },
      );
    }

    // 2. Cek Mode Manual (Human)
    const isHumanMode = session.status === "human";
    if (isHumanMode) return NextResponse.json({ reply: null, mode: "human" });

    const conversationalReply = getConversationalReply(message, responseLanguage);

    // 3. LOGIKA "SMART KEYWORD MATCHING" (AI LOKAL SEDERHANA)
    // Ambil semua data pengetahuan dari database
    const { data: knowledgeBase } = await supabaseAdmin
      .from("ai_knowledge")
      .select("topic, content");

    let bestMatchContent = "";
    let highestScore = 0;

    if (knowledgeBase && knowledgeBase.length > 0) {
      const userTokens = getTokens(userMessage);
      for (const item of knowledgeBase) {
        const topic = safeString(localizeContent(item.topic, responseLanguage));
        const content = safeString(
          localizeContent(item.content, responseLanguage),
        );
        if (!topic || !content) continue;

        const topicLower = normalizeText(topic);
        const contentLower = normalizeText(content);
        const searchableText = `${topicLower} ${contentLower}`;
        let score = 0;

        if (topicLower && userMessage.includes(topicLower)) score += 12;

        const topicWords = getTokens(topicLower);
        for (const word of userTokens) {
          if (topicWords.includes(word)) score += 5;
          if (contentLower.includes(word)) score += 2;
        }

        for (const group of synonymGroups) {
          const userHasIntent = group.some((word) =>
            userMessage.includes(normalizeText(word)),
          );
          const knowledgeHasIntent = group.some((word) =>
            searchableText.includes(normalizeText(word)),
          );
          if (userHasIntent && knowledgeHasIntent) {
            score += 6;
          }
        }

        if (score > highestScore) {
          highestScore = score;
          bestMatchContent = content;
        }
      }
    }

    // 4. Tentukan Jawaban
    let botReply = "";

    // Ambang batas skor agar tidak asal jawab (threshold)
    if (bestMatchContent && highestScore >= 4) {
      botReply = formatKnowledgeReply(bestMatchContent, responseLanguage);
    } else if (conversationalReply) {
      botReply = conversationalReply;
    } else {
      botReply = conversationalReplies[responseLanguage].fallback;
    }

    // 5. Simpan Jawaban Bot
    await supabaseAdmin.from("chat_messages").insert([
      {
        session_id: sessionId,
        content: encodeChatContent("bot", botReply),
      },
    ]);

    return NextResponse.json({ reply: botReply });
  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json(
      { reply: translate(responseLanguage, "chat.systemError") },
      { status: 500 },
    );
  }
}
