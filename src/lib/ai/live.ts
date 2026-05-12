import { FeedbackPayloadSchema } from "@/lib/ai/schemas";
import { API_GUARD_LIMITS, fetchWithTimeout } from "@/lib/server/request-guards";
import type { ConversationRequest, FeedbackPayload } from "@/types";

function buildSystemPrompt(request: ConversationRequest) {
  const practiceLabel =
    request.kind === "free-chat"
      ? "a supportive free-chat English coach"
      : request.kind === "pronunciation"
        ? "a supportive pronunciation coach"
        : "a supportive scenario-based English coach";

  return [
    `You are ${practiceLabel}.`,
    `User level: ${request.level}.`,
    `Mode: ${request.mode ?? "none"}.`,
    `Conversation kind: ${request.kind}.`,
    "Reply in a warm, encouraging tone.",
    "Return strict JSON matching this shape: aiReply string, quickTip string, fluencyScore number 0-10, confidenceLevel one of low/medium/high, confidencePercent number 0-100, toneLabel string, strengths string array, improvements string array, grammarCorrections array of objects with original/corrected/explanation, pronunciationNotes string array, vocabularySuggestions array of objects with word/alternative/context, simpleRewrite string, advancedRewrite string, encouragementMessage string, safetyStatus safe.",
    "Use at least 2 strengths, 2 improvements, 1 grammar correction, 1 pronunciation note, and 2 vocabulary suggestions.",
    "Keep aiReply concise and continue the practice conversation.",
    "Do not include markdown.",
  ].join(" ");
}

export const liveProvider = {
  async analyzeTurn(request: ConversationRequest) {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

    const response = await fetchWithTimeout("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL?.trim() || "gpt-4o-mini",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildSystemPrompt(request) },
          {
            role: "user",
            content: JSON.stringify({
              message: request.message,
              requestWrapUp: Boolean(request.requestWrapUp),
              history: request.history.slice(-6),
            }),
          },
        ],
      }),
    }, API_GUARD_LIMITS.conversationTimeoutMs);

    if (!response.ok) {
      throw new Error(`Live provider failed with status ${response.status}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Live provider returned no content");
    }

    const parsed = JSON.parse(content) as FeedbackPayload;
    return FeedbackPayloadSchema.parse(parsed);
  },
};
