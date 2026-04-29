import { describe, expect, it } from "vitest";
import { FeedbackPayloadSchema } from "@/lib/ai/schemas";
import { generateFeedback } from "@/lib/ai/simulated";

describe("simulated AI", () => {
  it("returns valid populated feedback", () => {
    const feedback = generateFeedback({
      message: "Thank you for meeting with me. I enjoy solving problems and communicating clearly with my team.",
      scenarioId: "job-interview",
      mode: "formal",
      level: "intermediate",
      history: [],
    });
    expect(() => FeedbackPayloadSchema.parse(feedback)).not.toThrow();
    expect(feedback.fluencyScore).toBeGreaterThanOrEqual(3);
    expect(feedback.fluencyScore).toBeLessThanOrEqual(10);
    expect(feedback.strengths.length).toBeGreaterThanOrEqual(2);
  });
});
