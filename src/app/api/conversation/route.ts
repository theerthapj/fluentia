import { NextResponse } from "next/server";
import { getConversationProvider } from "@/lib/ai/provider";
import { ConversationRequestSchema } from "@/lib/ai/schemas";
import { checkModeration } from "@/lib/moderation/checker";
import {
  API_GUARD_LIMITS,
  checkContentLength,
  checkRateLimit,
  clearServerViolations,
  getClientKey,
  getServerCooldown,
  rateLimitHeaders,
  registerServerViolation,
} from "@/lib/server/request-guards";
import { uid } from "@/lib/utils";

export async function POST(request: Request) {
  const clientKey = getClientKey(request, "conversation");
  const rate = checkRateLimit(clientKey, API_GUARD_LIMITS.conversationRateLimit, API_GUARD_LIMITS.conversationRateWindowMs);
  if (!rate.allowed) {
    return NextResponse.json(
      { safe: false, category: "rate-limit", warning: "Too many practice requests. Please wait a moment before trying again." },
      { status: 429, headers: rateLimitHeaders(rate) },
    );
  }

  const size = checkContentLength(request, API_GUARD_LIMITS.conversationBodyBytes);
  if (!size.ok) {
    return NextResponse.json({ safe: false, category: "validation", warning: size.message }, { status: size.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ safe: false, category: "validation", warning: "Invalid conversation request." }, { status: 400 });
  }

  const parsed = ConversationRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ safe: false, category: "validation", warning: "Invalid conversation request." }, { status: 400 });
  }

  const cooldown = getServerCooldown(clientKey);
  if (cooldown.active) {
    return NextResponse.json(
      {
        safe: false,
        category: "cooldown",
        warning: `${cooldown.message} ${cooldown.remainingSeconds}s remaining.`,
      },
      { status: 429, headers: { "Retry-After": String(cooldown.remainingSeconds) } },
    );
  }

  const moderation = checkModeration(parsed.data.message);
  if (!moderation.safe) {
    const escalation = registerServerViolation(clientKey);
    return NextResponse.json(
      {
        ...moderation,
        warning: escalation.message || moderation.warning,
      },
      escalation.cooldownUntil ? { status: 429, headers: { "Retry-After": String(escalation.remainingSeconds) } } : undefined,
    );
  }
  clearServerViolations(clientKey);

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
    return NextResponse.json(
      {
        safe: false,
        category: "provider",
        warning: "OpenAI is temporarily unavailable. Please check your API key, billing, and model settings.",
        provider: kind,
      },
      { status: 502 },
    );
  }
}
