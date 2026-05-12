import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PROGRESS_TABLE = "fluentia_user_progress";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, userId: null };
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return { supabase, userId: null };
  return { supabase, userId: user.id };
}

export async function GET() {
  const { supabase, userId } = await getAuthenticatedUser();
  if (!supabase) return NextResponse.json({ error: "Progress sync is not configured." }, { status: 503 });
  if (!userId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { data, error } = await supabase
    .from(PROGRESS_TABLE)
    .select("state, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Progress sync is unavailable." }, { status: 503 });
  return NextResponse.json({ state: data?.state ?? null, updatedAt: data?.updated_at ?? null });
}

export async function PATCH(request: Request) {
  const { supabase, userId } = await getAuthenticatedUser();
  if (!supabase) return NextResponse.json({ error: "Progress sync is not configured." }, { status: 503 });
  if (!userId) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const payload = (await request.json()) as unknown;
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid progress payload." }, { status: 400 });
  }

  const { error } = await supabase.from(PROGRESS_TABLE).upsert({
    user_id: userId,
    state: payload,
    updated_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: "Could not sync progress." }, { status: 503 });
  return NextResponse.json({ ok: true });
}
