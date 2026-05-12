import type { ConversationRequest, FeedbackPayload } from "@/types";
import { liveProvider } from "@/lib/ai/live";

export interface AiProvider {
  analyzeTurn(request: ConversationRequest): Promise<FeedbackPayload>;
}

export function getConversationProvider() {
  return { kind: "live" as const, provider: liveProvider };
}
