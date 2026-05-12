import { describe, expect, it } from "vitest";
import { levelFromScore, scoreAssessment, scoreText } from "@/lib/constants";

describe("assessment scoring", () => {
  it("scores text by grammar, coherence, fluency, and sentence correctness", () => {
    expect(scoreText("short answer")).toBe(0);
    expect(scoreText("I wake up early, then I prepare breakfast before I start studying.")).toBe(2);
    expect(scoreText("I wake up early and make tea before work")).toBe(1);
    expect(scoreText("I is morning routine because breakfast office quickly meeting phone travel calendar.")).toBe(0);
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

  it("does not classify long but weak grammar as advanced", () => {
    const result = scoreAssessment([
      { questionId: "grammar", value: "She goes to school every day." },
      { questionId: "vocabulary", value: "grateful" },
      {
        questionId: "fluency",
        value: "I is morning routine because breakfast office quickly meeting phone travel calendar.",
      },
      { questionId: "pronunciation", value: "Very confident" },
      {
        questionId: "composition",
        value: "Me go colleague introduction because professional friendly confident project office today.",
      },
    ]);

    expect(result.scores.fluency).toBe(0);
    expect(result.scores.composition).toBe(0);
    expect(result.level).toBe("intermediate");
  });

  it("separates weak, moderate, and advanced written responses", () => {
    expect(scoreText("go school because morning teacher help lesson friend market")).toBe(0);
    expect(scoreText("I go to school in the morning and talk with my teacher")).toBe(1);
    expect(scoreText("I usually arrive early, greet my teacher, and review my notes before class starts.")).toBe(2);
  });
});
