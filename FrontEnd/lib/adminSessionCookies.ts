export const ADMIN_ACCESS_TOKEN_COOKIE = "admin_access_token";
export const ADMIN_REFRESH_TOKEN_COOKIE = "admin_refresh_token";
export const ADMIN_SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const decodeBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = `${base64}${"=".repeat((4 - (base64.length % 4)) % 4)}`;

  if (typeof atob === "function") {
    return atob(padded);
  }

  return Buffer.from(padded, "base64").toString("utf8");
};

const parseJwtExp = (token: string): number | null => {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payloadRaw = decodeBase64Url(parts[1]);
    const payload = JSON.parse(payloadRaw) as { exp?: unknown };
    if (typeof payload.exp !== "number") return null;
    return payload.exp;
  } catch {
    return null;
  }
};

export const isJwtExpired = (token: string) => {
  const exp = parseJwtExp(token);
  if (!exp) return true;

  const nowSeconds = Math.floor(Date.now() / 1000);
  return exp <= nowSeconds;
};

export const getAdminCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: ADMIN_SESSION_COOKIE_MAX_AGE,
});
