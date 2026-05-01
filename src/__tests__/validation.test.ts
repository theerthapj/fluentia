import { describe, expect, it } from "vitest";
import { validateTextInput } from "@/lib/validation";

describe("text validation", () => {
  it("accepts concise but valid complete answers", () => {
    const result = validateTextInput("I study every morning before work.");
    expect(result.valid).toBe(true);
  });

  it("rejects vague or too-short input", () => {
    const result = validateTextInput("Too short");
    expect(result.valid).toBe(false);
    expect(result.reason).toBeTruthy();
  });

  it("rejects repetitive spam", () => {
    const result = validateTextInput("aaaaaa!!!!");
    expect(result.valid).toBe(false);
  });
});
