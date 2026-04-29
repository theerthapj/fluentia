import { NextResponse } from "next/server";
import { ModerationRequestSchema } from "@/lib/ai/schemas";
import { checkModeration } from "@/lib/moderation/checker";

export async function POST(request: Request) {
  const parsed = ModerationRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ safe: false, category: "validation", warning: "Invalid moderation request." }, { status: 400 });
  }
  return NextResponse.json(checkModeration(parsed.data.text));
}
