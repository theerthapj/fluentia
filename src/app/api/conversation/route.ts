import { NextResponse } from "next/server";
import { getConversationProvider } from "@/lib/ai/provider";
import { ConversationRequestSchema } from "@/lib/ai/schemas";
import { checkModeration } from "@/lib/moderation/checker";
import { uid } from "@/lib/utils";

export async function POST(request: Request) {
  const parsed = ConversationRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ safe: false, category: "validation", warning: "Invalid conversation request." }, { status: 400 });
  }

  const moderation = checkModeration(parsed.data.message);
  if (!moderation.safe) return NextResponse.json(moderation);

  const { provider, kind } = getConversationProvider();

  try {
    const feedback = await provider.analyzeTurn(parsed.data);
    const aiMessage = {
      id: uid("ai"),
      role: "ai" as const,
      content: feedback.aiReply,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ safe: true, aiMessage, feedback, provider: kind });
  } catch {
    if (kind === "simulated") {
      return NextResponse.json({ safe: false, category: "provider", warning: "The conversation provider is temporarily unavailable." }, { status: 503 });
    }

    const fallback = await (await import("@/lib/ai/simulated")).simulatedProvider.analyzeTurn(parsed.data);
    const aiMessage = {
      id: uid("ai"),
      role: "ai" as const,
      content: fallback.aiReply,
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json({ safe: true, aiMessage, feedback: fallback, provider: "simulated" });
  }
}
