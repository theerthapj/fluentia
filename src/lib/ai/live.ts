import { generateFeedback } from "@/lib/ai/simulated";
import type { ConversationRequest } from "@/types";

export function shouldUseLiveProvider() {
  return Boolean(process.env.OPENAI_API_KEY);
}

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
    "Return strict JSON with keys: aiReply, quickTip, strengths, improvements, pronunciationNotes, vocabularySuggestions, simpleRewrite, advancedRewrite, encouragementMessage.",
    "Keep strengths and improvements to 3 items each.",
    "Do not include markdown.",
  ].join(" ");
}

export const liveProvider = {
  async analyzeTurn(request: ConversationRequest) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return generateFeedback(request);

    const baseFeedback = generateFeedback(request);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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
    });

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

    const parsed = JSON.parse(content) as Partial<ReturnType<typeof generateFeedback>>;

    return {
      ...baseFeedback,
      aiReply: parsed.aiReply ?? baseFeedback.aiReply,
      quickTip: parsed.quickTip ?? baseFeedback.quickTip,
      strengths: parsed.strengths?.length ? parsed.strengths.slice(0, 3) : baseFeedback.strengths,
      improvements: parsed.improvements?.length ? parsed.improvements.slice(0, 3) : baseFeedback.improvements,
      pronunciationNotes: parsed.pronunciationNotes?.length ? parsed.pronunciationNotes : baseFeedback.pronunciationNotes,
      vocabularySuggestions: parsed.vocabularySuggestions?.length ? parsed.vocabularySuggestions : baseFeedback.vocabularySuggestions,
      simpleRewrite: parsed.simpleRewrite ?? baseFeedback.simpleRewrite,
      advancedRewrite: parsed.advancedRewrite ?? baseFeedback.advancedRewrite,
      encouragementMessage: parsed.encouragementMessage ?? baseFeedback.encouragementMessage,
    };
  },
};
