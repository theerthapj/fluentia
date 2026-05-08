// STEP 3: Fluvi Message Pools
// Randomized, non-repeating messages for each Fluvi state

export const CORRECT_MESSAGES = [
  "Great job! 🎉",
  "Nice improvement ✨",
  "Fluvi says: Well done! 🦚",
  "That was excellent! Keep it up 💫",
  "You nailed it! 🌟",
  "Perfect response! 🎊",
  "Fluvi is proud of you! ✨",
  "Outstanding! 🔥",
];

export const INCORRECT_MESSAGES = [
  "That's okay, let's improve it 😊",
  "You're close. Try this.",
  "Good attempt! Here's a better way.",
  "Almost there — Fluvi believes in you 🦚",
  "Every mistake is a step forward. Let's try again.",
  "Don't worry, this is how we learn!",
];

export const ENCOURAGEMENT_MESSAGES = [
  "You're making real progress 💪",
  "Fluvi sees you improving every session ✨",
  "One step at a time — you've got this!",
];

export const WARNING_MESSAGES = [
  "Let's keep it respectful 😊",
  "Fluvi learns best with kind words 🦚",
  "Let's try a more appropriate phrase.",
];

export const THINKING_MESSAGES = [
  "Analyzing your tone…",
  "Checking fluency…",
  "Fluvi is thinking…",
  "Almost ready…",
];

export const HOVER_GREETING_MESSAGES = [
  "Hi, I'm Fluvi!",
  "Ready to practice?",
  "You're doing great.",
  "Let's speak with confidence.",
];

export const TRY_AGAIN_MESSAGES = [
  "Try again, you're close.",
  "Good effort. One more try.",
  "Let's fix it together.",
];

export const PRONUNCIATION_SUCCESS_MESSAGES = [
  "That sounded clearer.",
  "Nice pronunciation!",
  "Great voice control.",
];

export const GRAMMAR_SUCCESS_MESSAGES = [
  "Clean grammar move.",
  "That sentence shines.",
  "Nice grammar polish.",
];

// Returns a random message, avoiding the last used one
const lastIndex: Record<string, number> = {};

export function getRandomMessage(pool: string[], key: string): string {
  let idx: number;
  do {
    idx = Math.floor(Math.random() * pool.length);
  } while (idx === lastIndex[key] && pool.length > 1);
  lastIndex[key] = idx;
  return pool[idx];
}
