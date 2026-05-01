import { describe, expect, it } from "vitest";
import { getScenariosForTrack, pronunciationExercises, scenarios } from "@/lib/constants";

describe("scenario catalog", () => {
  it("contains exactly 60 scenarios", () => {
    expect(scenarios).toHaveLength(60);
  });

  it("contains 10 scenarios for each mode and level track", () => {
    for (const mode of ["formal", "casual"] as const) {
      for (const level of ["beginner", "intermediate", "advanced"] as const) {
        expect(getScenariosForTrack(mode, level)).toHaveLength(10);
      }
    }
  });

  it("has unique ids and required prompt content", () => {
    const ids = new Set(scenarios.map((scenario) => scenario.id));
    expect(ids.size).toBe(scenarios.length);
    for (const scenario of scenarios) {
      expect(scenario.starterPrompts.length).toBeGreaterThan(0);
      expect(scenario.followUpPrompts.length).toBeGreaterThan(0);
      expect(scenario.culturalNotes.length).toBeGreaterThan(0);
      expect(scenario.goals.length).toBeGreaterThan(0);
      expect(scenario.voiceSample.length).toBeGreaterThan(0);
    }
  });

  it("includes pronunciation exercises for each level", () => {
    for (const level of ["beginner", "intermediate", "advanced"] as const) {
      expect(pronunciationExercises.some((exercise) => exercise.level === level)).toBe(true);
    }
  });
});
