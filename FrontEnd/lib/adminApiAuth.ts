import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
  isJwtExpired,
} from "@/lib/adminSessionCookies";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const createAuthClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase public environment variables");
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
};

export const requireAdminApiSession = async (req: NextRequest) => {
  const accessToken = req.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value || "";

  if (accessToken && !isJwtExpired(accessToken)) {
    const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
    if (!error && data.user) {
      return null;
    }
  }

  const refreshToken = req.cookies.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value || "";
  if (!refreshToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAuthClient();
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (!error && data.user) {
      return null;
    }
  } catch (error) {
    console.error("Admin API refresh session failed:", error);
  }

  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
};
