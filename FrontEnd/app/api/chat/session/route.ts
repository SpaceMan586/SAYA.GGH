import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  CHAT_SESSION_ID_COOKIE,
  CHAT_SESSION_SIG_COOKIE,
  getChatCookieOptions,
  signChatSessionId,
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

const setSessionCookies = (response: NextResponse, sessionId: string) => {
  const options = getChatCookieOptions();
  response.cookies.set(CHAT_SESSION_ID_COOKIE, sessionId, options);
  response.cookies.set(CHAT_SESSION_SIG_COOKIE, signChatSessionId(sessionId), options);
};

const isCookieBoundToSession = (req: NextRequest, sessionId: string) => {
  const cookieSessionId = req.cookies.get(CHAT_SESSION_ID_COOKIE)?.value || "";
  const cookieSessionSig = req.cookies.get(CHAT_SESSION_SIG_COOKIE)?.value || "";

  return (
    cookieSessionId === sessionId &&
    verifyChatSessionSignature(sessionId, cookieSessionSig)
  );
};

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId")?.trim() || "";
  if (!SESSION_ID_REGEX.test(sessionId)) {
    return NextResponse.json({ message: "Invalid sessionId format" }, { status: 400 });
  }

  if (!isCookieBoundToSession(req, sessionId)) {
    return NextResponse.json({ message: "Invalid chat session" }, { status: 403 });
  }

  const [{ data: session, error: sessionError }, { data: messages, error: messagesError }] =
    await Promise.all([
      supabaseAdmin
        .from("chat_sessions")
        .select("id, status, created_at")
        .eq("id", sessionId)
        .maybeSingle(),
      supabaseAdmin
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true }),
    ]);

  if (sessionError || messagesError) {
    return NextResponse.json(
      { message: "Failed to fetch chat session" },
      { status: 500 },
    );
  }

  if (!session) {
    return NextResponse.json({ message: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({ session, messages: messages || [] });
}

export async function POST(req: NextRequest) {
  try {
    const ip = getRequesterIp(req);
    const rateLimit = checkServerRateLimit({
      namespace: "chat-session-create",
      key: ip,
      windowMs: 60 * 1000,
      max: toPositiveInt(process.env.CHAT_SESSION_CREATE_MAX_PER_MINUTE, 20),
    });

    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        { message: "Too many session requests. Please try again later." },
        { status: 429 },
      );
      response.headers.set("Retry-After", String(rateLimit.retryAfterSec));
      return response;
    }

    const payload = (await req.json().catch(() => null)) as
      | { sessionId?: unknown }
      | null;
    const incomingSessionId =
      typeof payload?.sessionId === "string" ? payload.sessionId.trim() : "";

    let sessionId = incomingSessionId;

    if (sessionId) {
      if (!SESSION_ID_REGEX.test(sessionId)) {
        return NextResponse.json({ message: "Invalid sessionId format" }, { status: 400 });
      }

      const { data: existingSession, error } = await supabaseAdmin
        .from("chat_sessions")
        .select("id")
        .eq("id", sessionId)
        .maybeSingle();

      if (error || !existingSession) {
        return NextResponse.json({ message: "Session not found" }, { status: 404 });
      }
    } else {
      const { data, error } = await supabaseAdmin
        .from("chat_sessions")
        .insert([{ status: "ai" }])
        .select("id")
        .single();

      if (error || !data?.id) {
        return NextResponse.json(
          { message: "Unable to create chat session" },
          { status: 500 },
        );
      }

      sessionId = data.id;
    }

    const response = NextResponse.json({ sessionId });
    setSessionCookies(response, sessionId);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to establish chat session";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CHAT_SESSION_ID_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(CHAT_SESSION_SIG_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
