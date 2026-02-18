"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  FaUser,
  FaRobot,
  FaPaperPlane,
  FaUserTie,
  FaCheckCircle,
  FaTrash,
  FaArchive,
} from "react-icons/fa";
import { decodeChatContent, encodeChatContent } from "@/lib/chatMessage";

export default function ChatInbox() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Load Sessions
  useEffect(() => {
    fetchSessions();

    const channel = supabase
      .channel("public:chat_sessions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_sessions" },
        () => {
          fetchSessions();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching sessions:", error);
      } else {
        setSessions(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // 2. Load Messages
  useEffect(() => {
    if (!activeSessionId) return;

    fetchMessages(activeSessionId);

    const channel = supabase
      .channel(`session:${activeSessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${activeSessionId}`,
        },
        (payload) => {
          const decoded = decodeChatContent(payload.new.content || "");
          setMessages((prev) => [
            ...prev,
            { ...payload.new, role: decoded.role, content: decoded.content },
          ]);
          scrollToBottom();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId]);

  const fetchMessages = async (sessionId: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });
    setMessages(
      (data || []).map((m) => {
        const decoded = decodeChatContent(m.content || "");
        return { ...m, role: decoded.role, content: decoded.content };
      }),
    );
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  // 3. Actions
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeSessionId) return;

    await supabase.from("chat_messages").insert([
      {
        session_id: activeSessionId,
        content: encodeChatContent("admin", inputText),
      },
    ]);

    setInputText("");
  };

  const toggleMode = async (currentStatus: string) => {
    if (!activeSessionId) return;
    // Jika status closed, buka kembali jadi human
    const newStatus = currentStatus === "ai" ? "human" : "ai";
    await supabase
      .from("chat_sessions")
      .update({ status: newStatus })
      .eq("id", activeSessionId);
  };

  const handleEndSession = async () => {
    if (!activeSessionId) return;
    if (
      !confirm(
        "Akhiri sesi chat ini? Pengunjung akan melihat notifikasi selesai.",
      )
    )
      return;

    await supabase
      .from("chat_sessions")
      .update({ status: "closed" })
      .eq("id", activeSessionId);

    // Kirim pesan sistem penutup
    await supabase.from("chat_messages").insert([
      {
        session_id: activeSessionId,
        content: encodeChatContent("admin", "--- Sesi chat diakhiri oleh Admin ---"),
      },
    ]);
  };

  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Mencegah klik parent (pilih sesi)
    if (!confirm("Hapus permanen sesi chat ini? Data tidak bisa dikembalikan."))
      return;

    await supabase.from("chat_sessions").delete().eq("id", id);
    if (activeSessionId === id) setActiveSessionId(null);
    fetchSessions();
  };

  const activeSessionData = sessions.find((s) => s.id === activeSessionId);

  return (
    <div className="flex h-[calc(100vh-100px)] border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm animate-in fade-in">
      {/* LEFT: SESSIONS LIST */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <h2 className="font-bold text-lg">Inbox</h2>
          <button
            onClick={() => fetchSessions()}
            className="text-xs text-blue-600 hover:underline"
          >
            Refresh
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`group p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-white relative ${
                activeSessionId === session.id
                  ? "bg-white border-l-4 border-l-black"
                  : ""
              } ${session.status === "closed" ? "opacity-60 bg-gray-100" : ""}`}
            >
              <div className="flex justify-between items-center mb-1 pr-6">
                <span className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Visitor {session.id.slice(0, 4)}
                </span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                    session.status === "human"
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : session.status === "closed"
                        ? "bg-gray-200 text-gray-500 border-gray-300"
                        : "bg-green-50 text-green-600 border-green-200"
                  }`}
                >
                  {session.status}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {new Date(session.created_at).toLocaleString()}
              </p>

              {/* Delete Button (Hover Only) */}
              <button
                onClick={(e) => handleDeleteSession(e, session.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"
                title="Hapus Chat"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: CHAT AREA */}
      <div className="w-2/3 flex flex-col bg-white">
        {activeSessionId ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-bold flex items-center gap-2">
                    Live Chat
                    {activeSessionData?.status === "closed" && (
                      <span className="text-xs font-normal text-red-500">
                        (Selesai)
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-400">ID: {activeSessionId}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {activeSessionData?.status !== "closed" && (
                  <>
                    <button
                      onClick={() => toggleMode(activeSessionData?.status)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                        activeSessionData?.status === "human"
                          ? "bg-white text-black border-black hover:bg-gray-100"
                          : "bg-black text-white border-black hover:bg-gray-800"
                      }`}
                    >
                      {activeSessionData?.status === "human" ? (
                        <>
                          <FaRobot /> AI Mode
                        </>
                      ) : (
                        <>
                          <FaUserTie /> Take Over
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleEndSession}
                      className="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 flex items-center gap-2"
                    >
                      <FaCheckCircle /> End
                    </button>
                  </>
                )}

                {activeSessionData?.status === "closed" && (
                  <button
                    onClick={(e) => handleDeleteSession(e, activeSessionId)}
                    className="text-red-500 hover:text-red-700 p-2 text-sm"
                  >
                    <FaTrash /> Hapus
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                      msg.role === "admin"
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : msg.role === "user"
                          ? "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
                          : "bg-green-50 border border-green-100 text-green-800 rounded-tl-sm text-xs italic"
                    } ${msg.content.includes("--- Sesi chat diakhiri") ? "w-full text-center bg-transparent text-gray-400 italic text-xs shadow-none border-0" : ""}`}
                  >
                    {msg.role === "bot" && !msg.content.includes("---") && (
                      <strong className="block text-[10px] uppercase mb-1 not-italic">
                        AI Assistant
                      </strong>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {activeSessionData?.status !== "closed" ? (
              <form
                onSubmit={handleSend}
                className="p-4 border-t border-gray-200 bg-white flex gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    activeSessionData?.status === "ai"
                      ? "Mode AI Aktif. Switch ke Human untuk membalas..."
                      : "Ketik balasan..."
                  }
                  disabled={activeSessionData?.status === "ai"}
                  className="flex-1 bg-gray-50 border-0 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={
                    activeSessionData?.status === "ai" || !inputText.trim()
                  }
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaPaperPlane />
                </button>
              </form>
            ) : (
              <div className="p-4 bg-gray-100 text-center text-xs text-gray-500 font-bold uppercase tracking-widest border-t border-gray-200">
                Sesi ini telah selesai
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
            <FaArchive className="text-6xl mb-4 opacity-20" />
            <p>Pilih percakapan dari Inbox.</p>
          </div>
        )}
      </div>
    </div>
  );
}
