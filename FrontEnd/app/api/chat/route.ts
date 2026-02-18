import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { encodeChatContent } from "@/lib/chatMessage";

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();
    const userMessage = message.toLowerCase().trim();

    // 1. Simpan Pesan User
    if (sessionId) {
      await supabase.from("chat_messages").insert([
        {
          session_id: sessionId,
          content: encodeChatContent("user", message),
        },
      ]);
    }

    // 2. Cek Mode Manual (Human)
    let isHumanMode = false;
    if (sessionId) {
      const { data: session } = await supabase
        .from("chat_sessions")
        .select("status")
        .eq("id", sessionId)
        .maybeSingle();
      if (session?.status === "human") isHumanMode = true;
    }
    if (isHumanMode) return NextResponse.json({ reply: null, mode: "human" });

    // 3. LOGIKA "SMART KEYWORD MATCHING" (AI LOKAL SEDERHANA)
    // Ambil semua data pengetahuan dari database
    const { data: knowledgeBase } = await supabase
      .from("ai_knowledge")
      .select("topic, content");

    let bestMatch = null;
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
        const topicLower = item.topic.toLowerCase();
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
          bestMatch = item;
        }
      }
    }

    // 4. Tentukan Jawaban
    let botReply = "";

    // Ambang batas skor agar tidak asal jawab (threshold)
    if (bestMatch && highestScore >= 3) {
      botReply = bestMatch.content;
    } else {
      // Fallback Default jika tidak mengerti
      botReply =
        "Maaf, saya belum diajari tentang hal itu. Silakan tanya tentang Lokasi, Harga, atau Layanan kami, atau hubungi via WhatsApp untuk detailnya.";
    }

    // 5. Simpan Jawaban Bot
    if (sessionId) {
      await supabase.from("chat_messages").insert([
        {
          session_id: sessionId,
          content: encodeChatContent("bot", botReply),
        },
      ]);
    }

    return NextResponse.json({ reply: botReply });
  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json(
      { reply: "Terjadi kesalahan sistem." },
      { status: 500 },
    );
  }
}
