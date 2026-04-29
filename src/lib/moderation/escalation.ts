import { WARNINGS_KEY } from "@/lib/constants";

export interface EscalationState {
  warningCount: number;
  cooldownUntil: number | null;
  message: string;
}

const messages = [
  "Please use respectful language. Try rephrasing.",
  "Repeated inappropriate language detected. Please keep this a safe learning space.",
  "Input is paused for 60 seconds. Please return with a respectful English practice sentence.",
];

export function getStoredWarnings(): EscalationState {
  if (typeof window === "undefined") return { warningCount: 0, cooldownUntil: null, message: messages[0] };
  try {
    const parsed = JSON.parse(window.localStorage.getItem(WARNINGS_KEY) ?? "{}") as Partial<EscalationState>;
    return {
      warningCount: parsed.warningCount ?? 0,
      cooldownUntil: parsed.cooldownUntil ?? null,
      message: parsed.message ?? messages[0],
    };
  } catch {
    return { warningCount: 0, cooldownUntil: null, message: messages[0] };
  }
}

export function registerViolation(now = Date.now()): EscalationState {
  const current = getStoredWarnings();
  const nextCount = current.warningCount + 1;
  const cooldownUntil = nextCount >= 3 ? now + 60_000 : null;
  const state = {
    warningCount: nextCount,
    cooldownUntil,
    message: messages[Math.min(nextCount - 1, messages.length - 1)],
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(WARNINGS_KEY, JSON.stringify(state));
  }
  return state;
}

export function clearWarnings() {
  if (typeof window !== "undefined") window.localStorage.removeItem(WARNINGS_KEY);
}
