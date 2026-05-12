import { describe, expect, it } from "vitest";
import { getConversationProvider } from "@/lib/ai/provider";

describe("conversation provider selection", () => {
  it("always uses the live OpenAI provider", () => {
    expect(getConversationProvider().kind).toBe("live");
  });
});
