export interface ValidationResult {
  valid: boolean;
  reason?: string;
  checklist: {
    hasEnoughWords: boolean;
    hasEnoughDetail: boolean;
    hasSentenceShape: boolean;
  };
}

export function validateTextInput(text: string): ValidationResult {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const hasEnoughWords = words.length >= 5;
  const hasEnoughDetail = trimmed.length >= 24;
  const hasSentenceShape = /[.!?]/.test(trimmed) || words.length >= 8;

  if (!trimmed) {
    return {
      valid: false,
      reason: "Write 1-3 clear sentences so Fluentia can assess your English.",
      checklist: { hasEnoughWords, hasEnoughDetail, hasSentenceShape },
    };
  }

  if (/([a-z!?])\1{3,}/i.test(trimmed)) {
    return {
      valid: false,
      reason: "Please avoid repeated characters and write a clear sentence.",
      checklist: { hasEnoughWords, hasEnoughDetail, hasSentenceShape },
    };
  }

  const letters = trimmed.replace(/[^a-zA-Z]/g, "");
  if (letters.length > 0 && !/[aeiouAEIOU]/.test(letters)) {
    return {
      valid: false,
      reason: "Please write your response in English.",
      checklist: { hasEnoughWords, hasEnoughDetail, hasSentenceShape },
    };
  }

  const uniqueRatio = words.length ? new Set(words.map((word) => word.toLowerCase())).size / words.length : 0;
  if (words.length >= 5 && uniqueRatio < 0.3) {
    return {
      valid: false,
      reason: "Please use more varied words in your response.",
      checklist: { hasEnoughWords, hasEnoughDetail, hasSentenceShape },
    };
  }

  const valid = hasEnoughWords && hasEnoughDetail && hasSentenceShape;
  const reason = valid ? undefined : "Aim for at least 5 words, a little detail, and one complete sentence.";
  return { valid, reason, checklist: { hasEnoughWords, hasEnoughDetail, hasSentenceShape } };
}
