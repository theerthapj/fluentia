import { NextResponse } from "next/server";
import { ConversationRequestSchema } from "@/lib/ai/schemas";
import { simulatedProvider } from "@/lib/ai/simulated";
import { checkModeration } from "@/lib/moderation/checker";
import { uid } from "@/lib/utils";

export async function POST(request: Request) {
  const parsed = ConversationRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ safe: false, category: "validation", warning: "Invalid conversation request." }, { status: 400 });
  }

  const moderation = checkModeration(parsed.data.message);
  if (!moderation.safe) return NextResponse.json(moderation);

  const provider = simulatedProvider;
  const feedback = await provider.analyzeTurn(parsed.data);
  const aiMessage = {
    id: uid("ai"),
    role: "ai" as const,
    content: `Good attempt. Your tone is ${feedback.toneLabel.toLowerCase()}, and your fluency score is ${feedback.fluencyScore.toFixed(1)} out of 10. ${feedback.improvements[0]}`,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ safe: true, aiMessage, feedback });
}
