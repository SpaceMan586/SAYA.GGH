"use client";

import { useState, useRef, useEffect } from "react";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaCommentDots,
  FaUserTie,
} from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import { decodeChatContent } from "@/lib/chatMessage";

type Message = {
  id: string;
  role: "user" | "bot" | "admin";
  content: string;
};

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveChat = ({ isOpen, onClose }: LiveChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "bot",
      content: "Halo! Selamat datang di SAYA.GGH. Ada yang bisa saya bantu?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isHumanMode, setIsHumanMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ===================== INIT SESSION ===================== */
  useEffect(() => {
    if (!isOpen) return; // Only initialize if chat is open

    const existingSession = localStorage.getItem("chat_session_id");
    if (existingSession) {
      setSessionId(existingSession);
      fetchHistory(existingSession);
    }
  }, [isOpen]); // Depend on isOpen

  /* ===================== REALTIME LISTENER ===================== */
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`session:${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const decoded = decodeChatContent(payload.new.content || "");
          if (decoded.role === "admin") {
            setMessages((prev) => [
              ...prev,
              {
                id: payload.new.id.toString(),
                role: "admin",
                content: decoded.content,
              },
            ]);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_sessions",
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.new.status === "human") setIsHumanMode(true);
          if (payload.new.status === "ai") setIsHumanMode(false);

          if (payload.new.status === "closed") {
            localStorage.removeItem("chat_session_id");
            setSessionId(null);
            setMessages((prev) => [
              ...prev,
              {
                id: "closed",
                role: "bot",
                content:
                  "--- Sesi chat telah diakhiri oleh admin. Terima kasih telah menghubungi SAYA.GGH. ---",
              },
            ]);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const fetchHistory = async (id: string) => {
    const { data: session } = await supabase
      .from("chat_sessions")
      .select("status")
      .eq("id", id)
      .maybeSingle();

    if (!session) {
      localStorage.removeItem("chat_session_id");
      setSessionId(null);
      return;
    }

    if (session.status === "human") setIsHumanMode(true);

    const { data: msgs } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", id)
      .order("created_at", { ascending: true });

    if (msgs) {
      setMessages(
        msgs.map((m) => {
          const decoded = decodeChatContent(m.content || "");
          return {
            id: m.id.toString(),
            role: decoded.role,
            content: decoded.content,
          };
        }),
      );
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: userText },
    ]);
    setIsLoading(true);

    try {
      let currentSessionId = sessionId;

      if (!currentSessionId) {
        const { data } = await supabase
          .from("chat_sessions")
          .insert([{ status: "ai" }])
          .select()
          .single();

        if (data) {
          currentSessionId = data.id;
          setSessionId(data.id);
          localStorage.setItem("chat_session_id", data.id);
        }
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          sessionId: currentSessionId,
        }),
      });

      const data = await response.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            content: data.reply,
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed bottom-24 right-6 z-50 flex flex-col items-end pointer-events-none ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div
        className={`
          pointer-events-auto
          mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden
          transition-all duration-300 origin-bottom-right border border-gray-100
          ${
            isOpen
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-0 opacity-0 translate-y-10"
          }
        `}
      >
        {/* HEADER */}
        <div
          className={`p-4 flex justify-between items-center text-white ${
            isHumanMode ? "bg-blue-600" : "bg-gray-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-full">
              {isHumanMode ? (
                <FaUserTie className="text-xl" />
              ) : (
                <FaRobot className="text-xl" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {isHumanMode ? "Admin Support" : "AI Assistant"}
              </h3>
              <p className="text-[10px] uppercase tracking-wider text-gray-300">
                Online
              </p>
            </div>
          </div>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* MESSAGES */}
        <div className="h-80 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-gray-900 text-white self-end"
                  : msg.role === "admin"
                    ? "bg-blue-600 text-white self-start"
                    : "bg-white text-gray-700 self-start border"
              }`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-white border-t flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-full px-4 py-2 bg-gray-50 text-sm"
            placeholder="Tulis pesan..."
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-gray-900 text-white p-3 rounded-full"
          >
            <FaPaperPlane className="text-xs" />
          </button>
        </form>
      </div>
    </div>
  );
};
