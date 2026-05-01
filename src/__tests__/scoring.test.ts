import { describe, expect, it } from "vitest";
import { levelFromScore, scoreAssessment, scoreText } from "@/lib/constants";

describe("assessment scoring", () => {
  it("scores text by word-count complexity", () => {
    expect(scoreText("short answer")).toBe(0);
    expect(scoreText("one two three four five six seven eight nine ten eleven")).toBe(2);
    expect(scoreText("one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twentyone")).toBe(2);
  });

  it("assigns level boundaries", () => {
    expect(levelFromScore(3)).toBe("beginner");
    expect(levelFromScore(4)).toBe("intermediate");
    expect(levelFromScore(7)).toBe("advanced");
  });

  it("scores a full assessment", () => {
    const result = scoreAssessment([
      { questionId: "grammar", value: "She goes to school every day." },
      { questionId: "vocabulary", value: "grateful" },
      { questionId: "fluency", value: "I wake up early and prepare breakfast before I start studying for the day." },
      { questionId: "pronunciation", value: "Very confident" },
      { questionId: "composition", value: "Hello, I am Alex. I enjoy learning new skills and working with kind people every day." },
    ]);
    expect(result.scores.total).toBeGreaterThanOrEqual(7);
    expect(result.level).toBe("advanced");
  });
});
