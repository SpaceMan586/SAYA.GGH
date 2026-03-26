import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { encodeChatContent } from "@/lib/chatMessage";
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

export async function POST(req: NextRequest) {
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
          reply: "Terlalu banyak permintaan. Coba lagi sebentar.",
        },
        { status: 429 },
      );
      response.headers.set("Retry-After", String(rateLimit.retryAfterSec));
      return response;
    }

    const payload = (await req.json().catch(() => null)) as
      | { message?: unknown; sessionId?: unknown }
      | null;
    const message = safeString(payload?.message);
    const sessionId = safeString(payload?.sessionId);

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
        { reply: "Sesi chat tidak valid. Silakan mulai ulang chat." },
        { status: 403 },
      );
    }

    const userMessage = message.toLowerCase();

    // 1. Pastikan sesi ada lalu simpan pesan user
    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .select("status")
      .eq("id", sessionId)
      .maybeSingle();

    if (sessionError || !session) {
      return NextResponse.json(
        { reply: "Sesi chat tidak ditemukan. Silakan mulai ulang chat." },
        { status: 404 },
      );
    }

    const { error: userMessageError } = await supabase.from("chat_messages").insert([
      {
        session_id: sessionId,
        content: encodeChatContent("user", message),
      },
    ]);
    if (userMessageError) {
      return NextResponse.json(
        { reply: "Gagal menyimpan pesan. Coba lagi." },
        { status: 500 },
      );
    }

    // 2. Cek Mode Manual (Human)
    const isHumanMode = session.status === "human";
    if (isHumanMode) return NextResponse.json({ reply: null, mode: "human" });

    // 3. LOGIKA "SMART KEYWORD MATCHING" (AI LOKAL SEDERHANA)
    // Ambil semua data pengetahuan dari database
    const { data: knowledgeBase } = await supabase
      .from("ai_knowledge")
      .select("topic, content");

    let bestMatchContent = "";
    let highestScore = 0;

    if (knowledgeBase && knowledgeBase.length > 0) {
      // Normalisasi & Sinonim Dasar
      // Mapping kata user -> topik yang mungkin dimaksud
      const synonyms: Record<string, string[]> = {
        lokasi: ["alamat", "tempat", "dimana", "posisi", "kantor", "studio"],
        harga: ["biaya", "fee", "tarif", "budget", "mahal", "murah", "rate"],
        kontak: ["hubungi", "wa", "whatsapp", "telpon", "email", "nomor"],
        layanan: ["jasa", "bikin", "buat", "desain", "bangun", "renovasi"],
        portfolio: ["karya", "proyek", "hasil", "contoh", "gambar"],
      };

      for (const item of knowledgeBase) {
        const topic = safeString(item.topic);
        const content = safeString(item.content);
        if (!topic || !content) continue;

        const topicLower = topic.toLowerCase();
        let score = 0;

        // A. Cek kecocokan langsung dengan Topik
        if (userMessage.includes(topicLower)) score += 10;

        // B. Cek kecocokan dengan Isi Konten (keyword penting)
        // Kita pecah topik jadi kata-kata kunci
        const topicWords = topicLower.split(" ");
        for (const word of topicWords) {
          if (word.length > 3 && userMessage.includes(word)) score += 3;
        }

        // C. Cek Sinonim (Logika Cerdas)
        // Jika topik database adalah "Lokasi", tapi user tanya "Alamat", kita kasih poin.
        for (const [key, words] of Object.entries(synonyms)) {
          // Jika topik mengandung key (misal topik="Info Lokasi")
          if (topicLower.includes(key)) {
            // Dan pesan user mengandung salah satu sinonim (misal "alamat")
            if (words.some((w) => userMessage.includes(w))) score += 5;
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
    if (bestMatchContent && highestScore >= 3) {
      botReply = bestMatchContent;
    } else {
      // Fallback Default jika tidak mengerti
      botReply =
        "Maaf, saya belum diajari tentang hal itu. Silakan tanya tentang Lokasi, Harga, atau Layanan kami, atau hubungi via WhatsApp untuk detailnya.";
    }

    // 5. Simpan Jawaban Bot
    await supabase.from("chat_messages").insert([
      {
        session_id: sessionId,
        content: encodeChatContent("bot", botReply),
      },
    ]);

    return NextResponse.json({ reply: botReply });
  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json(
      { reply: "Terjadi kesalahan sistem." },
      { status: 500 },
    );
  }
}
