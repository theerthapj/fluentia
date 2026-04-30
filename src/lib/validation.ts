import { wordCount } from "@/lib/utils";

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validates text input for assessment and practice prompts.
 * Enforces minimum quality thresholds to prevent gaming.
 */
export function validateTextInput(text: string): ValidationResult {
  const trimmed = text.trim();

  if (trimmed.length < 40) {
    return { valid: false, reason: "Please write at least 2–3 complete sentences (minimum 40 characters)." };
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 5) {
    return { valid: false, reason: "Please use at least 5 words in your response." };
  }

  // Block strings with high single-character repetition (e.g. "aaaaa", "!!!!!")
  if (/([a-z!?])\1{3,}/i.test(trimmed)) {
    return { valid: false, reason: "Please avoid repeated characters and write a clear sentence." };
  }

  // Require at least one English vowel (catches non-Latin gibberish)
  const letters = trimmed.replace(/[^a-zA-Z]/g, "");
  if (letters.length > 0 && !/[aeiouAEIOU]/.test(letters)) {
    return { valid: false, reason: "Please write your response in English." };
  }

  // Block low word variety (catches "banana banana banana…")
  const uniqueRatio = new Set(words.map((w) => w.toLowerCase())).size / words.length;
  if (uniqueRatio < 0.3) {
    return { valid: false, reason: "Please use more varied words in your response." };
  }

  return { valid: true };
}
