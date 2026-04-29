import type { ConversationRequest, FeedbackPayload } from "@/types";

export interface AiProvider {
  analyzeTurn(request: ConversationRequest): Promise<FeedbackPayload>;
}
