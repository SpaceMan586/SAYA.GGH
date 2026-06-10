import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/adminApiAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  const authError = await requireAdminApiSession(req);
  if (authError) return authError;

  const { data, error } = await supabaseAdmin
    .from("chat_sessions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { message: "Failed to fetch chat sessions" },
      { status: 500 },
    );
  }

  return NextResponse.json({ sessions: data || [] });
}

export async function DELETE(req: NextRequest) {
  const authError = await requireAdminApiSession(req);
  if (authError) return authError;

  const { error: messageError } = await supabaseAdmin
    .from("chat_messages")
    .delete()
    .not("id", "is", null);

  if (messageError) {
    return NextResponse.json(
      { message: "Failed to clear chat messages" },
      { status: 500 },
    );
  }

  const { error: sessionError } = await supabaseAdmin
    .from("chat_sessions")
    .delete()
    .not("id", "is", null);

  if (sessionError) {
    return NextResponse.json(
      { message: "Failed to clear chat sessions" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
