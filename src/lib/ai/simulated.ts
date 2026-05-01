import { getPronunciationExercise, getScenario } from "@/lib/constants";
import { sentenceCount, wordCount } from "@/lib/utils";
import type { ConversationRequest, FeedbackPayload, Level, Mode } from "@/types";

const strengths = [
  "You communicated your main idea clearly.",
  "Your response had a friendly, confident opening.",
  "You used practical vocabulary that fits the situation.",
  "Your sentence order was easy to follow.",
  "You gave enough context for the listener to understand you.",
  "You used polite phrasing that creates a positive impression.",
  "Your answer sounded natural for the situation.",
  "You stayed focused on the prompt.",
  "You included a clear reason or example.",
  "Your tone felt calm and respectful.",
  "You showed good awareness of the listener.",
  "You used complete sentences instead of isolated words.",
  "Your response has a good conversational rhythm.",
  "You expressed intent without sounding abrupt.",
  "You chose a useful real-world phrase.",
];

const improvements = [
  "Add one specific example to make the answer more memorable.",
  "Use a smoother transition between ideas.",
  "Try replacing repeated simple words with more precise alternatives.",
  "End with a confident closing sentence.",
  "Keep verb tense consistent throughout the response.",
  "Use a short pause after important phrases when speaking aloud.",
  "Make the first sentence more direct.",
  "Add a polite phrase to soften the request.",
  "Use fewer filler words and move straight to the key point.",
  "Connect your reason to the situation more explicitly.",
  "Try one compound sentence to sound more fluent.",
  "Use active verbs to make the answer stronger.",
  "Avoid translating word-for-word from your first language.",
  "Make the final idea sound complete.",
  "Choose a tone that matches the situation more closely.",
];

const encouragement = [
  "Nice work. You are building confidence through steady practice.",
  "That was a solid response. A little more structure will make it sound even more natural.",
  "You are on the right track. Keep practicing one clear idea at a time.",
  "Good progress. Your message is understandable, and now we can polish the delivery.",
  "You handled the situation well. Small vocabulary upgrades will make a big difference.",
  "This is exactly the kind of practice that improves real speaking confidence.",
  "Your effort is visible. Keep your tone calm and your sentences complete.",
  "Strong attempt. Try saying the improved version aloud once or twice.",
  "You are getting clearer. The next step is making your response flow smoothly.",
  "Well done. Your confidence will grow as these patterns become automatic.",
];

const scenarioVocabulary: Record<string, Array<[string, string, string]>> = {
  "formal-beginner-job-intro": [
    ["good", "reliable", "Useful for describing a professional strength."],
    ["work", "role", "A more specific word in workplace contexts."],
    ["help", "support", "Sounds natural and collaborative in formal settings."],
  ],
  "casual-beginner-ordering-food": [
    ["want", "would like", "More polite when ordering food."],
    ["give me", "could I have", "Sounds softer and more natural with service staff."],
    ["less hot", "mild", "A concise word for spice preference."],
  ],
  pronunciation: [
    ["say", "stress", "Useful when talking about pronunciation focus."],
    ["sound", "syllable", "Helps explain where to pay attention in a word."],
    ["slow", "pace", "A more coaching-friendly word for speaking speed."],
  ],
  freeChat: [
    ["good", "thoughtful", "A more expressive adjective in open conversation."],
    ["tell", "explain", "Useful when expanding a point with more clarity."],
    ["very", "really", "A small upgrade that often sounds more natural in speech."],
  ],
  default: [
    ["very good", "excellent", "A concise upgrade for positive descriptions."],
    ["tell", "explain", "Clearer when presenting an idea."],
    ["need", "would appreciate", "A more polite phrase for requests."],
  ],
};

function pick<T>(items: T[], seed: number, count: number) {
  const rotated = [...items.slice(seed % items.length), ...items.slice(0, seed % items.length)];
  return rotated.slice(0, count);
}

function score(text: string) {
  const words = wordCount(text);
  const sentences = sentenceCount(text);
  const base = words > 30 ? 7.5 : words >= 15 ? 5.8 : 4.1;
  const sentenceBonus = sentences > 1 ? 0.7 : 0;
  const varietyBonus = new Set(text.toLowerCase().split(/\s+/)).size > words * 0.75 ? 0.5 : 0;
  return Math.max(3, Math.min(9.5, Number((base + sentenceBonus + varietyBonus + Math.random() * 0.6).toFixed(1))));
}

function confidence(scoreValue: number, text: string) {
  const confidentWords = /\b(can|will|confident|ready|enjoy|able|would like|thank you)\b/i.test(text);
  if (scoreValue >= 7.5 || confidentWords) return { confidenceLevel: "high" as const, confidencePercent: 86 };
  if (scoreValue >= 5.5) return { confidenceLevel: "medium" as const, confidencePercent: 68 };
  return { confidenceLevel: "low" as const, confidencePercent: 42 };
}

function grammar(text: string) {
  const lower = text.toLowerCase();

  if (/\bi am go\b/.test(lower)) {
    return [{ original: "I am go", corrected: "I am going", explanation: "Use the -ing form after 'am' for present continuous actions." }];
  }
  if (/\bshe go\b/.test(lower)) {
    return [{ original: "she go", corrected: "she goes", explanation: "Use 'goes' with he, she, or it in the present simple tense." }];
  }
  if (/\bi want\b/.test(lower)) {
    return [{ original: "I want", corrected: "I would like", explanation: "In polite or service situations, 'I would like' sounds softer and more natural." }];
  }
  if (/\b(they|we)\s+is\b/.test(lower)) {
    const subject = lower.match(/\b(they|we)\s+is\b/)?.[1] ?? "they";
    return [{ original: `${subject} is`, corrected: `${subject} are`, explanation: `Use 'are' with plural pronouns like '${subject}'.` }];
  }
  if (/\b(he|she|it)\s+don'?t\b/.test(lower)) {
    const subject = lower.match(/\b(he|she|it)\s+don'?t\b/)?.[1] ?? "he";
    return [{ original: `${subject} don't`, corrected: `${subject} doesn't`, explanation: `Use 'doesn't' (not 'don't') with ${subject} in present tense negatives.` }];
  }
  if (/\bi has\b/.test(lower)) {
    return [{ original: "I has", corrected: "I have", explanation: "Use 'have' with I, you, we, and they. 'Has' is only for he, she, it." }];
  }
  if (/\b(he|she|it)\s+have\b/.test(lower)) {
    const subject = lower.match(/\b(he|she|it)\s+have\b/)?.[1] ?? "he";
    return [{ original: `${subject} have`, corrected: `${subject} has`, explanation: `Use 'has' with ${subject} in the present tense.` }];
  }
  if (/\bmore (better|bigger|smaller|faster|slower|easier|harder|worse)\b/.test(lower)) {
    const adjective = lower.match(/\bmore (better|bigger|smaller|faster|slower|easier|harder|worse)\b/)?.[1] ?? "better";
    return [{ original: `more ${adjective}`, corrected: adjective, explanation: `'${adjective}' is already a comparative form. Do not add 'more' before it.` }];
  }
  if (/\byesterday i go\b/.test(lower)) {
    return [{ original: "yesterday I go", corrected: "yesterday I went", explanation: "Use the past tense ('went') for actions that already happened." }];
  }
  if (/\bthere is many\b/.test(lower)) {
    return [{ original: "there is many", corrected: "there are many", explanation: "Use 'there are' before plural nouns." }];
  }
  if (/\bi am agree\b/.test(lower)) {
    return [{ original: "I am agree", corrected: "I agree", explanation: "'Agree' is a verb, so say 'I agree' directly." }];
  }

  const firstSentence = text.split(/[.!?]/)[0]?.trim().slice(0, 70) || "My answer is good";
  return [{ original: firstSentence, corrected: `${firstSentence}.`, explanation: "Make sure every sentence has a clear subject, verb, and ending punctuation." }];
}

function rewrite(text: string, mode: Mode | null, level: Level, kind: ConversationRequest["kind"]) {
  const intro =
    kind === "pronunciation"
      ? "Try this spoken version:"
      : mode === "formal"
        ? "Thank you for the opportunity."
        : "Thanks for asking.";
  const cleaned = text.trim().replace(/\s+/g, " ");
  const simple = `${intro} ${cleaned}${/[.!?]$/.test(cleaned) ? "" : "."}`;
  const advanced =
    level === "advanced"
      ? `${intro} I would express it this way: ${cleaned}`
      : `${intro} I want to say this more clearly: ${cleaned}`;
  return { simple, advanced: /[.!?]$/.test(advanced) ? advanced : `${advanced}.` };
}

function getContextLabel(request: ConversationRequest) {
  if (request.kind === "free-chat") return "Free Chat";
  if (request.kind === "pronunciation") return getPronunciationExercise(request.exerciseId).title;
  return getScenario(request.scenarioId).title;
}

function getVocabularySet(request: ConversationRequest) {
  if (request.kind === "pronunciation") return scenarioVocabulary.pronunciation;
  if (request.kind === "free-chat") return scenarioVocabulary.freeChat;
  return scenarioVocabulary[request.scenarioId ?? ""] ?? scenarioVocabulary.default;
}

function nextQuestion(request: ConversationRequest) {
  const lowerMsg = request.message.toLowerCase();
  if (request.kind === "pronunciation") {
    const exercise = getPronunciationExercise(request.exerciseId);
    return `Nice. Try it once more and give extra stress to these focus words: ${exercise.targetWords.slice(0, 3).join(", ")}.`;
  }
  if (request.kind === "free-chat") {
    return "That is a thoughtful answer. What part of that experience feels most important to you now?";
  }
  if (lowerMsg.includes("specials") || lowerMsg.includes("menu")) {
    return "Our specials today are grilled salmon and vegetarian pasta. Does either of those sound good?";
  }
  if (lowerMsg.includes("price") || lowerMsg.includes("cost")) {
    return "The price depends on the option you choose, but it usually falls within a moderate range.";
  }
  return "I understand. Could you give me one more detail or example so we can make your answer even stronger?";
}

export function generateFeedback(request: ConversationRequest): FeedbackPayload {
  const label = getContextLabel(request);
  const fluencyScore = score(request.message);
  const confidenceResult = confidence(fluencyScore, request.message);
  const seed = request.message.length + request.history.length + label.length;
  const vocab = getVocabularySet(request);
  const rewrites = rewrite(request.message, request.mode, request.level, request.kind);
  const grammarCorrectionsList = grammar(request.message);
  const topTip = grammarCorrectionsList[0]?.explanation ?? "Add one specific example to make your answer stronger.";

  const aiMessages = request.history.filter((message) => message.role === "ai");
  const lastAiMessage = aiMessages[aiMessages.length - 1];
  const isRetryTurn = lastAiMessage?.content.toLowerCase().includes("try");
  let aiReply = nextQuestion(request);

  if (request.requestWrapUp) {
    aiReply = request.kind === "pronunciation"
      ? "You can stop here and review the pronunciation notes, or repeat the line once more for extra fluency."
      : "You have enough material for a detailed review now. If you want, you can head to feedback or give one final answer first.";
  } else if (isRetryTurn && fluencyScore >= 6.5) {
    aiReply = `Excellent improvement. Your response sounds more ${request.mode === "formal" ? "polished" : "natural"} now. ${nextQuestion(request)}`;
  } else if (fluencyScore < 6.5) {
    aiReply = `I shared a quick tip above. Would you like to try rephrasing your answer, or should we move forward?`;
  }

  return {
    aiReply,
    quickTip: `Tip: ${topTip}`,
    fluencyScore,
    ...confidenceResult,
    toneLabel:
      request.kind === "pronunciation"
        ? "Clear and Controlled"
        : request.kind === "free-chat"
          ? "Friendly and Natural"
          : request.mode === "formal"
            ? "Polite and Professional"
            : "Friendly and Natural",
    strengths: pick(strengths.map((item) => `${item} (${label})`), seed, 3),
    improvements: pick(improvements, seed + 3, 3),
    grammarCorrections: grammarCorrectionsList,
    pronunciationNotes: request.kind === "pronunciation"
      ? [
          `${getPronunciationExercise(request.exerciseId).coachNote}`,
          "Repeat the line once slowly, once at a natural pace, and once with stronger word stress.",
        ]
      : [
          "Slow down slightly on important nouns so your listener catches the key idea.",
          request.mode === "formal"
            ? "Keep a steady pace and lower your tone at the end of confident statements."
            : "Use natural stress on friendly words so the sentence sounds relaxed.",
        ],
    vocabularySuggestions: vocab.map(([word, alternative, context]) => ({ word, alternative, context })),
    simpleRewrite: rewrites.simple,
    advancedRewrite: rewrites.advanced,
    encouragementMessage: encouragement[seed % encouragement.length],
    safetyStatus: "safe",
  };
}

export const simulatedProvider = {
  async analyzeTurn(request: ConversationRequest) {
    return generateFeedback(request);
  },
};
