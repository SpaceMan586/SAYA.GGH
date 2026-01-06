import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();
    const msg = message.toLowerCase();

    // 1. Simpan Pesan User ke Database
    if (sessionId) {
      await supabase.from('chat_messages').insert([{
        session_id: sessionId,
        role: 'user',
        content: message
      }]);
    }

    // 2. Cek Status Sesi (Human vs AI)
    let isHumanMode = false;
    if (sessionId) {
      const { data: session } = await supabase.from('chat_sessions').select('status').eq('id', sessionId).single();
      if (session?.status === 'human') {
        isHumanMode = true;
      }
    }

    // JIKA MODE HUMAN: Stop di sini, jangan biarkan AI menjawab.
    if (isHumanMode) {
      return NextResponse.json({ reply: null, mode: 'human' });
    }

    // --- LOGIKA AI DI BAWAH INI ---

    // 3. (Hapus Fallback Hardcoded agar Knowledge Base terbaca)
    // Sekarang semua pertanyaan akan diproses oleh Gemini yang sudah dibekali Data Training.

    // 4. Cek API Key
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      const reply = "Halo! Saya asisten SAYA.GGH. (Catatan: AI belum terkonfigurasi sepenuhnya, silakan hubungi kami langsung via WhatsApp untuk pertanyaan detail).";
      if (sessionId) await saveBotReply(sessionId, reply);
      return NextResponse.json({ reply });
    }

    // 5. Fetch "Otak" Tambahan dari Supabase (Knowledge Base)
    const { data: knowledgeData } = await supabase.from('ai_knowledge').select('topic, content');
    const knowledgeString = knowledgeData?.map(k => `FAKTA PENTING [${k.topic}]: ${k.content}`).join("\n") || "";

    // 6. Proses dengan Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Anda adalah asisten virtual untuk SAYA.GGH (Studio Arsitektur).

      DATA KHUSUS DARI PEMILIK STUDIO (WAJIB DIGUNAKAN):
      ${knowledgeString}
      --------------------------------------------------
      
      Informasi Default (Gunakan HANYA jika TIDAK ada info di Data Khusus):
      - Lokasi Umum: Jakarta, Indonesia.
      - Layanan: Arsitektur & Interior.
      
      Instruksi PENTING:
      1. Jika pertanyaan user terjawab di "DATA KHUSUS", abaikan informasi default. (Contoh: Jika Data Khusus bilang lokasi di "Condet", JANGAN jawab "Jakarta").
      2. Jawablah dengan ramah, sopan, dan singkat (maks 3 kalimat).
      3. Jangan mengarang fakta yang tidak ada.
      
      Pertanyaan User: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Simpan balasan AI ke database
    if (sessionId) await saveBotReply(sessionId, text);

    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ reply: "Maaf, sedang ada gangguan. Silakan hubungi WhatsApp kami." }, { status: 500 });
  }
}

// Helper untuk simpan balasan bot
async function saveBotReply(sessionId: string, content: string) {
  await supabase.from('chat_messages').insert([{
    session_id: sessionId,
    role: 'bot',
    content: content
  }]);
}
