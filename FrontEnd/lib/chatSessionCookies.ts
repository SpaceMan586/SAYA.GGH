import "server-only";
import crypto from "node:crypto";

export const CHAT_SESSION_ID_COOKIE = "chat_session_id";
export const CHAT_SESSION_SIG_COOKIE = "chat_session_sig";
export const CHAT_SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const getChatSessionSecret = () => {
  const secret = process.env.CHAT_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing required environment variable: CHAT_SESSION_SECRET");
  }
  return secret;
};

export const signChatSessionId = (sessionId: string) => {
  return crypto
    .createHmac("sha256", getChatSessionSecret())
    .update(sessionId)
    .digest("hex");
};

export const verifyChatSessionSignature = (
  sessionId: string,
  signature: string,
) => {
  if (!signature) return false;
  const expected = signChatSessionId(sessionId);
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== actualBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
};

export const getChatCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: CHAT_SESSION_COOKIE_MAX_AGE,
});
