"use client";

import { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane, FaCommentDots, FaUserTie } from "react-icons/fa";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  role: "user" | "bot" | "admin";
  content: string;
};

export const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "intro", role: "bot", content: "Halo! Selamat datang di SAYA.GGH. Ada yang bisa saya bantu?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isHumanMode, setIsHumanMode] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Initialize Session
  useEffect(() => {
    // Cek localStorage kalau user refresh halaman agar sesi tidak hilang
    const existingSession = localStorage.getItem("chat_session_id");
    if (existingSession) {
      setSessionId(existingSession);
      fetchHistory(existingSession);
    }
  }, []);

  // 2. Realtime Listener (Dengarkan pesan Admin atau status berubah)
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`session:${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` }, (payload) => {
        // Jika pesan dari Admin, tambahkan ke UI
        if (payload.new.role === 'admin') {
          setMessages((prev) => [...prev, { id: payload.new.id.toString(), role: 'admin', content: payload.new.content }]);
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_sessions', filter: `id=eq.${sessionId}` }, (payload) => {
        // Jika status berubah jadi 'human'
        if (payload.new.status === 'human') setIsHumanMode(true);
        if (payload.new.status === 'ai') setIsHumanMode(false);
        
        // Jika status berubah jadi 'closed'
        if (payload.new.status === 'closed') {
          // Hapus sesi dari storage agar refresh berikutnya mulai baru
          localStorage.removeItem("chat_session_id");
          setSessionId(null);
          setMessages((prev) => [...prev, { id: "closed", role: "bot", content: "--- Sesi chat telah diakhiri oleh admin. Terima kasih telah menghubungi SAYA.GGH. ---" }]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  const fetchHistory = async (id: string) => {
    const { data: session } = await supabase.from('chat_sessions').select('status').eq('id', id).single();
    if (session?.status === 'human') setIsHumanMode(true);

    const { data: msgs } = await supabase.from('chat_messages').select('*').eq('session_id', id).order('created_at', { ascending: true });
    if (msgs && msgs.length > 0) {
      setMessages(msgs.map(m => ({ id: m.id.toString(), role: m.role as any, content: m.content })));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    
    // Optimistic Update
    const tempId = Date.now().toString();
    setMessages((prev) => [...prev, { id: tempId, role: "user", content: userText }]);
    setIsLoading(true);

    try {
      let currentSessionId = sessionId;

      // Buat Sesi Baru jika belum ada
      if (!currentSessionId) {
        const { data, error } = await supabase.from('chat_sessions').insert([{ status: 'ai' }]).select().single();
        if (data) {
          currentSessionId = data.id;
          setSessionId(data.id);
          localStorage.setItem("chat_session_id", data.id);
        }
      }

      // Kirim ke API (Backend akan handle simpan ke DB & reply AI)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, sessionId: currentSessionId }),
      });

      const data = await response.json();

      // Jika ada balasan AI (artinya mode masih AI), tambahkan ke UI
      if (data.reply) {
         setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "bot", content: data.reply }]);
      } 
      // Jika tidak ada reply, berarti Human Mode (tunggu admin balas via Realtime)

    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <div 
        className={`
          mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right border border-gray-100
          ${isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-10 pointer-events-none"}
        `}
      >
        {/* Header */}
        <div className={`p-4 flex justify-between items-center text-white transition-colors ${isHumanMode ? 'bg-blue-600' : 'bg-gray-900'}`}>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-full">
              {isHumanMode ? <FaUserTie className="text-xl" /> : <FaRobot className="text-xl" />}
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">
                {isHumanMode ? "Admin Support" : "AI Assistant"}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-gray-300 uppercase tracking-wider">Online</p>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
            <FaTimes />
          </button>
        </div>

        {/* Messages Area */}
        <div className="h-80 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gray-900 text-white self-end rounded-tr-sm"
                  : msg.role === "admin"
                  ? "bg-blue-600 text-white self-start rounded-tl-sm shadow-md"
                  : "bg-white text-gray-700 shadow-sm border border-gray-100 self-start rounded-tl-sm"
              }`}
            >
              {msg.role === "admin" && <span className="block text-[10px] uppercase mb-1 font-bold text-blue-200">Admin</span>}
              {msg.content}
            </div>
          ))}
          {isLoading && !isHumanMode && (
            <div className="self-start bg-white text-gray-500 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 text-xs flex items-center gap-1">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-75">●</span>
              <span className="animate-bounce delay-150">●</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isHumanMode ? "Chat dengan admin..." : "Tanya AI sesuatu..."}
            className="flex-1 bg-gray-50 border-0 focus:ring-1 focus:ring-gray-200 rounded-full px-4 py-2 text-sm text-gray-800 placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`${isHumanMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-black'} text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          >
            <FaPaperPlane className="text-xs" />
          </button>
        </form>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center justify-center w-14 h-14 ${isHumanMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-black'} text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95`}
      >
        <span className={`absolute transition-transform duration-300 ${isOpen ? "rotate-90 scale-0" : "rotate-0 scale-100"}`}>
          <FaCommentDots className="text-2xl" />
        </span>
        <span className={`absolute transition-transform duration-300 ${isOpen ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`}>
          <FaTimes className="text-xl" />
        </span>
      </button>
    </div>
  );
};
