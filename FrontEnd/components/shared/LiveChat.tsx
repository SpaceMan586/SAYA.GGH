"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaUserTie,
} from "react-icons/fa";
import { decodeChatContent } from "@/lib/chatMessage";
import { useLanguage } from "@/components/shared/LanguageProvider";

type Message = {
  id: string;
  role: "user" | "bot" | "admin";
  content: string;
};

type ChatHistoryMessage = {
  id: number;
  content: string;
};

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveChat = ({ isOpen, onClose }: LiveChatProps) => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "bot",
      content: t("chat.intro"),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isHumanMode, setIsHumanMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages((prev) =>
      prev.length === 1 && prev[0]?.id === "intro"
        ? [{ ...prev[0], content: t("chat.intro") }]
        : prev,
    );
  }, [t]);

  const createIntroMessage = useCallback(
    (): Message => ({
      id: "intro",
      role: "bot",
      content: t("chat.intro"),
    }),
    [t],
  );

  const upsertSessionCookie = useCallback(async (existingSessionId?: string | null) => {
    const response = await fetch("/api/chat/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        existingSessionId ? { sessionId: existingSessionId } : {},
      ),
    });

    if (!response.ok) {
      throw new Error("Failed to establish chat session");
    }

    const data = (await response.json()) as { sessionId?: string };
    if (!data.sessionId) {
      throw new Error("Missing chat session id");
    }
    return data.sessionId;
  }, []);

  const fetchHistory = useCallback(
    async (id: string) => {
      const response = await fetch(
        `/api/chat/session?sessionId=${encodeURIComponent(id)}`,
        { cache: "no-store" },
      );

      if (!response.ok) {
        localStorage.removeItem("chat_session_id");
        setSessionId(null);
        return;
      }

      const data = (await response.json()) as {
        session: { status: "ai" | "human" | "closed" };
        messages: ChatHistoryMessage[];
      };

      if (data.session.status === "closed") {
        localStorage.removeItem("chat_session_id");
        setSessionId(null);
        await fetch("/api/chat/session", { method: "DELETE" }).catch(() => {});
        setMessages((prev) => [
          ...prev,
          {
            id: "closed",
            role: "bot",
            content: t("chat.closed"),
          },
        ]);
        return;
      }

      setIsHumanMode(data.session.status === "human");
      const decodedMessages = data.messages.map((message) => {
        const decoded = decodeChatContent(message.content || "");
        return {
          id: message.id.toString(),
          role: decoded.role,
          content: decoded.content,
        };
      });

      setMessages(decodedMessages.length > 0 ? decodedMessages : [createIntroMessage()]);
    },
    [createIntroMessage, t],
  );

  /* ===================== INIT SESSION ===================== */
  useEffect(() => {
    if (!isOpen) return; // Only initialize if chat is open

    const existingSession = localStorage.getItem("chat_session_id");
    if (!existingSession) return;

    upsertSessionCookie(existingSession)
      .then((boundSessionId) => {
        setSessionId(boundSessionId);
        localStorage.setItem("chat_session_id", boundSessionId);
        fetchHistory(boundSessionId);
      })
      .catch(() => {
        localStorage.removeItem("chat_session_id");
        setSessionId(null);
      });
  }, [fetchHistory, isOpen, upsertSessionCookie]);

  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const intervalId = window.setInterval(() => {
      fetchHistory(sessionId);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, [fetchHistory, isOpen, sessionId]);

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
        currentSessionId = await upsertSessionCookie();
        setSessionId(currentSessionId);
        localStorage.setItem("chat_session_id", currentSessionId);
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          sessionId: currentSessionId,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

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
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: "bot",
          content: t("chat.error"),
        },
      ]);
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
                {isHumanMode ? t("chat.adminSupport") : t("chat.aiAssistant")}
              </h3>
              <p className="text-[10px] uppercase tracking-wider text-gray-300">
                {t("chat.online")}
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
            placeholder={t("chat.placeholder")}
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
