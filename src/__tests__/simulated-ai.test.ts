import { describe, expect, it } from "vitest";
import { FeedbackPayloadSchema } from "@/lib/ai/schemas";
import { generateFeedback } from "@/lib/ai/simulated";

describe("simulated AI", () => {
  it("returns valid populated feedback", () => {
    const feedback = generateFeedback({
      message: "Thank you for meeting with me. I enjoy solving problems and communicating clearly with my team.",
      kind: "scenario",
      scenarioId: "formal-intermediate-panel-interview",
      mode: "formal",
      level: "intermediate",
      history: [],
    });
    expect(() => FeedbackPayloadSchema.parse(feedback)).not.toThrow();
    expect(feedback.fluencyScore).toBeGreaterThanOrEqual(3);
    expect(feedback.fluencyScore).toBeLessThanOrEqual(10);
    expect(feedback.strengths.length).toBeGreaterThanOrEqual(2);
  });

  it("supports pronunciation coaching flows", () => {
    const feedback = generateFeedback({
      message: "Three thoughtful thinkers thanked Theo on Thursday.",
      kind: "pronunciation",
      exerciseId: "pron-beginner-soft-th",
      mode: null,
      level: "beginner",
      history: [],
    });
    expect(() => FeedbackPayloadSchema.parse(feedback)).not.toThrow();
    expect(feedback.toneLabel).toBe("Clear and Controlled");
  });
});
