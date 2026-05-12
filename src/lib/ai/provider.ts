import type { ConversationRequest, FeedbackPayload } from "@/types";
import { liveProvider } from "@/lib/ai/live";
import { simulatedProvider } from "@/lib/ai/simulated";

export interface AiProvider {
  analyzeTurn(request: ConversationRequest): Promise<FeedbackPayload>;
}

export function getConversationProvider() {
  if (process.env.FLUENTIA_AI_PROVIDER === "simulated") {
    return { kind: "simulated" as const, provider: simulatedProvider };
  }

  return { kind: "live" as const, provider: liveProvider };
}
