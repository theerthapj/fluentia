import type { ConversationRequest, FeedbackPayload } from "@/types";
import { liveProvider, shouldUseLiveProvider } from "@/lib/ai/live";
import { simulatedProvider } from "@/lib/ai/simulated";

export interface AiProvider {
  analyzeTurn(request: ConversationRequest): Promise<FeedbackPayload>;
}

export function getConversationProvider() {
  return shouldUseLiveProvider() ? { kind: "live" as const, provider: liveProvider } : { kind: "simulated" as const, provider: simulatedProvider };
}
