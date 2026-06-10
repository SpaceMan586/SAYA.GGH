import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/adminApiAuth";
import { encodeChatContent } from "@/lib/chatMessage";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const SESSION_ID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isSessionStatus = (value: unknown): value is "ai" | "human" | "closed" =>
  value === "ai" || value === "human" || value === "closed";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdminApiSession(req);
  if (authError) return authError;

  const { id } = await params;
  if (!SESSION_ID_REGEX.test(id)) {
    return NextResponse.json({ message: "Invalid session id" }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as { status?: unknown } | null;
  if (!isSessionStatus(body?.status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("chat_sessions")
    .update({ status: body.status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { message: "Failed to update chat session" },
      { status: 500 },
    );
  }

  if (body.status === "closed") {
    await supabaseAdmin.from("chat_messages").insert([
      {
        session_id: id,
        content: encodeChatContent("admin", "--- Sesi chat diakhiri oleh Admin ---"),
      },
    ]);
  }

  return NextResponse.json({ session: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdminApiSession(req);
  if (authError) return authError;

  const { id } = await params;
  if (!SESSION_ID_REGEX.test(id)) {
    return NextResponse.json({ message: "Invalid session id" }, { status: 400 });
  }

  await supabaseAdmin.from("chat_messages").delete().eq("session_id", id);
  const { error } = await supabaseAdmin.from("chat_sessions").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { message: "Failed to delete chat session" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
