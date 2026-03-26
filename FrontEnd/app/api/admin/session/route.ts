import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
  getAdminCookieOptions,
} from "@/lib/adminSessionCookies";

const requireEnv = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const createServerSupabaseClient = () => {
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { accessToken?: unknown; refreshToken?: unknown }
      | null;
    const accessToken =
      typeof body?.accessToken === "string" ? body.accessToken : "";
    const refreshToken =
      typeof body?.refreshToken === "string" ? body.refreshToken : "";

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { message: "Missing accessToken or refreshToken" },
        { status: 400 },
      );
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      return NextResponse.json({ message: "Invalid auth session" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    const options = getAdminCookieOptions();
    response.cookies.set(ADMIN_ACCESS_TOKEN_COOKIE, accessToken, options);
    response.cookies.set(ADMIN_REFRESH_TOKEN_COOKIE, refreshToken, options);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to persist auth session";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_ACCESS_TOKEN_COOKIE, "", {
    path: "/",
    maxAge: 0,
  });
  response.cookies.set(ADMIN_REFRESH_TOKEN_COOKIE, "", {
    path: "/",
    maxAge: 0,
  });
  return response;
}
