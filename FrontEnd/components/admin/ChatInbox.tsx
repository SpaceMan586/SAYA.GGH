"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaArchive,
  FaCheckCircle,
  FaPaperPlane,
  FaRobot,
  FaTrash,
  FaUserTie,
} from "react-icons/fa";
import { decodeChatContent } from "@/lib/chatMessage";

type ChatSessionStatus = "ai" | "human" | "closed";

type ChatSession = {
  id: string;
  status: ChatSessionStatus;
  created_at: string | null;
};

type ChatMessageRecord = {
  id: number;
  session_id: string | null;
  content: string;
  created_at: string | null;
};

type ChatMessage = ChatMessageRecord & {
  role: "user" | "bot" | "admin";
};

const fetchJson = async <T,>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: unknown;
    } | null;
    const message =
      typeof body?.message === "string"
        ? body.message
        : `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
};

const decodeMessage = (message: ChatMessageRecord): ChatMessage => {
  const decoded = decodeChatContent(message.content || "");
  return { ...message, role: decoded.role, content: decoded.content };
};

export default function ChatInbox() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  }, []);

  const fetchSessions = useCallback(async () => {
    try {
      const data = await fetchJson<{ sessions: ChatSession[] }>(
        "/api/admin/chat/sessions",
      );
      setErrorMessage("");
      setSessions(data.sessions);
      setActiveSessionId((current) => {
        if (!current) return current;
        return data.sessions.some((session) => session.id === current)
          ? current
          : null;
      });
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setErrorMessage(
        error instanceof Error
          ? `Gagal memuat inbox: ${error.message}`
          : "Gagal memuat inbox.",
      );
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  const fetchMessages = useCallback(
    async (sessionId: string) => {
      try {
        setIsLoadingMessages(true);
        const data = await fetchJson<{ messages: ChatMessageRecord[] }>(
          `/api/admin/chat/sessions/${sessionId}/messages`,
        );
        setErrorMessage("");
        setMessages(data.messages.map(decodeMessage));
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
        setErrorMessage(
          error instanceof Error
            ? `Gagal memuat isi chat: ${error.message}`
            : "Gagal memuat isi chat.",
        );
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [scrollToBottom],
  );

  useEffect(() => {
    fetchSessions();
    const intervalId = window.setInterval(fetchSessions, 3000);
    return () => window.clearInterval(intervalId);
  }, [fetchSessions]);

  useEffect(() => {
    if (!activeSessionId) {
      setMessages([]);
      return;
    }

    fetchMessages(activeSessionId);
    const intervalId = window.setInterval(
      () => fetchMessages(activeSessionId),
      2500,
    );
    return () => window.clearInterval(intervalId);
  }, [activeSessionId, fetchMessages]);

  const refreshActiveSession = async () => {
    await fetchSessions();
    if (activeSessionId) {
      await fetchMessages(activeSessionId);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeSessionId) return;

    try {
      await fetchJson(`/api/admin/chat/sessions/${activeSessionId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content: inputText }),
      });

      setErrorMessage("");
      setInputText("");
      await fetchMessages(activeSessionId);
    } catch (error) {
      console.error("Error sending admin message:", error);
      setErrorMessage(
        error instanceof Error
          ? `Gagal mengirim balasan: ${error.message}`
          : "Gagal mengirim balasan.",
      );
    }
  };

  const setMode = async (nextStatus: "ai" | "human") => {
    if (!activeSessionId) return;

    try {
      await fetchJson(`/api/admin/chat/sessions/${activeSessionId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });

      setErrorMessage("");
      await refreshActiveSession();
    } catch (error) {
      console.error("Error updating chat mode:", error);
      setErrorMessage(
        error instanceof Error
          ? `Gagal mengganti mode chat: ${error.message}`
          : "Gagal mengganti mode chat.",
      );
    }
  };

  const handleEndSession = async () => {
    if (!activeSessionId) return;
    if (
      !confirm(
        "Akhiri sesi chat ini? Pengunjung akan melihat notifikasi selesai.",
      )
    ) {
      return;
    }

    try {
      await fetchJson(`/api/admin/chat/sessions/${activeSessionId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "closed" }),
      });

      setErrorMessage("");
      await refreshActiveSession();
    } catch (error) {
      console.error("Error ending chat session:", error);
      setErrorMessage(
        error instanceof Error
          ? `Gagal mengakhiri chat: ${error.message}`
          : "Gagal mengakhiri chat.",
      );
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Hapus sesi chat ini dari Inbox?")) {
      return;
    }

    try {
      await fetchJson(`/api/admin/chat/sessions/${id}`, { method: "DELETE" });
      setErrorMessage("");
      if (activeSessionId === id) setActiveSessionId(null);
      await fetchSessions();
    } catch (error) {
      console.error("Error deleting chat session:", error);
      setErrorMessage(
        error instanceof Error
          ? `Gagal menghapus chat: ${error.message}`
          : "Gagal menghapus chat.",
      );
    }
  };

  const handleClearAllSessions = async () => {
    if (sessions.length === 0) return;
    if (
      !confirm(
        `Hapus semua ${sessions.length} sesi chat dari Inbox? Data chat tidak bisa dikembalikan.`,
      )
    ) {
      return;
    }

    setIsClearing(true);
    try {
      await fetchJson("/api/admin/chat/sessions", { method: "DELETE" });
      setErrorMessage("");
      setActiveSessionId(null);
      setMessages([]);
      await fetchSessions();
    } catch (error) {
      console.error("Error clearing chat inbox:", error);
      setErrorMessage(
        error instanceof Error
          ? `Gagal menghapus semua chat: ${error.message}`
          : "Gagal menghapus semua chat.",
      );
    } finally {
      setIsClearing(false);
    }
  };

  const activeSessionData = sessions.find((s) => s.id === activeSessionId);
  const canReply = activeSessionData?.status === "human";

  return (
    <div className="flex h-[calc(100vh-100px)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm animate-in fade-in">
      <div className="flex w-1/3 flex-col border-r border-gray-200 bg-gray-50">
        <div className="border-b border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Inbox</h2>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {sessions.length} sesi chat
              </p>
            </div>
            <button
              onClick={handleClearAllSessions}
              disabled={isClearing || sessions.length === 0}
              className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isClearing ? "Menghapus..." : "Hapus Semua"}
            </button>
          </div>
          <button
            onClick={() => fetchSessions()}
            className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
          >
            Refresh
          </button>
          {errorMessage && (
            <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoadingSessions ? (
            <div className="p-6 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
              Memuat inbox...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-6 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
              Inbox bersih.
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={`group relative cursor-pointer border-b border-gray-100 p-4 transition-colors hover:bg-white ${
                  activeSessionId === session.id
                    ? "border-l-4 border-l-black bg-white"
                    : ""
                } ${session.status === "closed" ? "bg-gray-100 opacity-60" : ""}`}
              >
                <div className="mb-1 flex items-center justify-between pr-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Visitor {session.id.slice(0, 4)}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${
                      session.status === "human"
                        ? "border-blue-200 bg-blue-50 text-blue-600"
                        : session.status === "closed"
                          ? "border-gray-300 bg-gray-200 text-gray-500"
                          : "border-green-200 bg-green-50 text-green-600"
                    }`}
                  >
                    {session.status === "human"
                      ? "MANUSIA"
                      : session.status === "ai"
                        ? "AI"
                        : "SELESAI"}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {session.created_at
                    ? new Date(session.created_at).toLocaleString()
                    : "Waktu tidak tersedia"}
                </p>

                <button
                  onClick={(e) => handleDeleteSession(e, session.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-300 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
                  title="Hapus sesi chat"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex w-2/3 flex-col bg-white">
        {activeSessionId && activeSessionData ? (
          <>
            <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4">
              <div>
                <h3 className="flex items-center gap-2 font-bold">
                  Live Chat
                  {activeSessionData.status === "closed" && (
                    <span className="text-xs font-normal text-red-500">
                      (Selesai)
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-400">ID: {activeSessionId}</p>
              </div>

              <div className="flex items-center gap-2">
                {activeSessionData.status !== "closed" ? (
                  <>
                    <div className="flex overflow-hidden rounded-lg border border-gray-200">
                      <button
                        onClick={() => setMode("ai")}
                        className={`flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                          activeSessionData.status === "ai"
                            ? "bg-black text-white"
                            : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <FaRobot /> AI
                      </button>
                      <button
                        onClick={() => setMode("human")}
                        className={`flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                          activeSessionData.status === "human"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <FaUserTie /> Manusia
                      </button>
                    </div>

                    <button
                      onClick={handleEndSession}
                      className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-100"
                    >
                      <FaCheckCircle /> End
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => handleDeleteSession(e, activeSessionId)}
                    className="flex items-center gap-2 p-2 text-sm text-red-500 hover:text-red-700"
                  >
                    <FaTrash /> Hapus
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-6">
              {isLoadingMessages && messages.length === 0 ? (
                <p className="py-8 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                  Memuat pesan...
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                        msg.role === "admin"
                          ? "rounded-tr-sm bg-blue-600 text-white"
                          : msg.role === "user"
                            ? "rounded-tl-sm border border-gray-200 bg-white text-gray-800 shadow-sm"
                            : "rounded-tl-sm border border-green-100 bg-green-50 text-xs italic text-green-800"
                      } ${
                        msg.content.includes("--- Sesi chat diakhiri")
                          ? "w-full border-0 bg-transparent text-center text-xs italic text-gray-400 shadow-none"
                          : ""
                      }`}
                    >
                      {msg.role === "bot" && !msg.content.includes("---") && (
                        <strong className="mb-1 block text-[10px] uppercase not-italic">
                          AI Assistant
                        </strong>
                      )}
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {activeSessionData.status !== "closed" ? (
              <form
                onSubmit={handleSend}
                className="flex gap-2 border-t border-gray-200 bg-white p-4"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    canReply
                      ? "Ketik balasan admin..."
                      : "Aktifkan mode MANUSIA untuk membalas pengunjung."
                  }
                  disabled={!canReply}
                  className="flex-1 rounded-lg border-0 bg-gray-50 px-4 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!canReply || !inputText.trim()}
                  className="rounded-lg bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaPaperPlane />
                </button>
              </form>
            ) : (
              <div className="border-t border-gray-200 bg-gray-100 p-4 text-center text-xs font-bold uppercase tracking-widest text-gray-500">
                Sesi ini telah selesai
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-gray-300">
            <FaArchive className="mb-4 text-6xl opacity-20" />
            <p>Pilih percakapan dari Inbox.</p>
          </div>
        )}
      </div>
    </div>
  );
}
