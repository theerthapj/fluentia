import { describe, expect, it } from "vitest";
import { AssessmentRequestSchema, ConversationRequestSchema, ModerationRequestSchema } from "@/lib/ai/schemas";

describe("schemas", () => {
  it("validates moderation requests", () => {
    expect(ModerationRequestSchema.parse({ text: "hello there" }).text).toBe("hello there");
  });

  it("validates assessment requests", () => {
    expect(AssessmentRequestSchema.safeParse({ answers: [{ questionId: "grammar", value: "x" }] }).success).toBe(true);
  });

  it("rejects incomplete conversation requests", () => {
    expect(ConversationRequestSchema.safeParse({ message: "hello" }).success).toBe(false);
  });

  it("accepts structured conversation requests", () => {
    expect(
      ConversationRequestSchema.safeParse({
        message: "I would like to introduce myself clearly.",
        kind: "scenario",
        scenarioId: "formal-beginner-job-intro",
        mode: "formal",
        level: "beginner",
        history: [],
      }).success,
    ).toBe(true);
  });
});
