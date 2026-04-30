import type { ModerationResult } from "@/types";
import { wordCount } from "@/lib/utils";

type Category = "sexual" | "violent" | "hateful" | "abusive";

const blocklist: Record<Category, string[]> = {
  sexual: [
    "porn", "sex", "nude", "nudes", "explicit", "xxx", "fetish", "orgasm", "rape", "molest",
    "prostitute", "hooker",
  ],
  violent: [
    "kill", "murder", "stab", "shoot", "bomb", "terrorist", "bloodbath", "massacre", "weapon",
    "suicide", "behead", "assault",
  ],
  hateful: [
    "racist", "nazi", "genocide", "slave", "subhuman", "bigot", "terror race", "hate speech",
    "ethnic cleansing", "supremacist",
  ],
  abusive: [
    "idiot", "stupid", "dumb", "moron", "loser", "shut up", "trash", "worthless", "fool",
    "jerk", "hate you", "go away", "ugly", "pathetic", "nonsense", "screw you",
  ],
};

const categoryWarnings: Record<Category, string> = {
  sexual: "Please keep the conversation age-appropriate and focused on English practice.",
  violent: "Please avoid violent language. Try rephrasing your sentence calmly.",
  hateful: "Please use respectful language. Try rephrasing without hateful terms.",
  abusive: "Please use respectful language. Try rephrasing.",
};

export function checkModeration(text: string): ModerationResult {
  const normalized = text.toLowerCase().replace(/[^\p{L}\p{N}\s!?]/gu, " ").replace(/\s+/g, " ").trim();

  if (!normalized) {
    return { safe: false, category: "validation", warning: "Please enter a sentence." };
  }

  if (wordCount(normalized) < 3) {
    return { safe: false, category: "validation", warning: "Please add more detail so I can coach your English." };
  }

  if (text.length > 1200) {
    return { safe: false, category: "validation", warning: "Please keep your response under 1200 characters." };
  }

  if (/([a-z!?])\1{5,}/i.test(text)) {
    return { safe: false, category: "spam", warning: "Please avoid repeated characters and write a clear sentence." };
  }

  const lettersOnly = text.replace(/[^A-Za-z]/g, "");
  if (lettersOnly.length > 16 && lettersOnly === lettersOnly.toUpperCase()) {
    return { safe: false, category: "spam", warning: "Please avoid all-caps messages. Try a calm sentence." };
  }

  for (const [category, terms] of Object.entries(blocklist) as Array<[Category, string[]]>) {
    if (terms.some((term) => new RegExp(`\\b${term.replace(/\s+/g, "\\s+")}\\b`, "i").test(normalized))) {
      return { safe: false, category, warning: categoryWarnings[category] };
    }
  }

  return { safe: true };
}

export interface RelevanceResult {
  relevant: boolean;
  warning?: string;
}

/**
 * Softer than moderation — returns coaching nudges for low-effort input
 * rather than hard-blocking. Used in assessment and chat.
 */
export function checkRelevance(text: string): RelevanceResult {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);

  if (words.length < 3) {
    return { relevant: false, warning: "Try writing a complete sentence so I can give you better feedback." };
  }

  // Check for minimal sentence structure (at least one punctuation mark or 6+ words)
  const hasPunctuation = /[.!?]/.test(trimmed);
  if (!hasPunctuation && words.length < 6) {
    return { relevant: false, warning: "Add a bit more detail — try ending with a period to form a complete thought." };
  }

  // Check for very low word variety
  const uniqueRatio = new Set(words.map((w) => w.toLowerCase())).size / words.length;
  if (words.length >= 5 && uniqueRatio < 0.3) {
    return { relevant: false, warning: "Try using more varied words to express your idea clearly." };
  }

  return { relevant: true };
}

export { blocklist };
