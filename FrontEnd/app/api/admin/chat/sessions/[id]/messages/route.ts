import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/adminApiAuth";
import { encodeChatContent } from "@/lib/chatMessage";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const SESSION_ID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdminApiSession(req);
  if (authError) return authError;

  const { id } = await params;
  if (!SESSION_ID_REGEX.test(id)) {
    return NextResponse.json({ message: "Invalid session id" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("chat_messages")
    .select("*")
    .eq("session_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { message: "Failed to fetch chat messages" },
      { status: 500 },
    );
  }

  return NextResponse.json({ messages: data || [] });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdminApiSession(req);
  if (authError) return authError;

  const { id } = await params;
  if (!SESSION_ID_REGEX.test(id)) {
    return NextResponse.json({ message: "Invalid session id" }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as { content?: unknown } | null;
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!content) {
    return NextResponse.json({ message: "Message is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("chat_messages")
    .insert([
      {
        session_id: id,
        content: encodeChatContent("admin", content),
      },
    ])
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { message: "Failed to send chat message" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: data });
}
