import { describe, expect, it, beforeEach, vi } from "vitest";
import { checkModeration } from "@/lib/moderation/checker";
import { registerViolation } from "@/lib/moderation/escalation";

describe("moderation", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.setSystemTime(new Date("2026-04-29T12:00:00Z"));
  });

  it("blocks empty and short input", () => {
    expect(checkModeration("").safe).toBe(false);
    expect(checkModeration("hello").safe).toBe(false);
  });

  it("blocks unsafe categories", () => {
    expect(checkModeration("you are stupid and rude").category).toBe("abusive");
    expect(checkModeration("I want to kill them now").category).toBe("violent");
  });

  it("blocks spam patterns", () => {
    expect(checkModeration("THIS IS A VERY LOUD MESSAGE").category).toBe("spam");
    expect(checkModeration("hello!!!!!! friend today").category).toBe("spam");
  });

  it("allows safe English practice", () => {
    expect(checkModeration("I would like to practice speaking politely.").safe).toBe(true);
  });

  it("escalates to cooldown on third violation", () => {
    expect(registerViolation().warningCount).toBe(1);
    expect(registerViolation().warningCount).toBe(2);
    const third = registerViolation();
    expect(third.warningCount).toBe(3);
    expect(third.cooldownUntil).toBeGreaterThan(Date.now());
  });
});
