import type { AiProvider } from "@/lib/ai/provider";
import { getScenario } from "@/lib/constants";
import { sentenceCount, wordCount } from "@/lib/utils";
import type { ConversationRequest, FeedbackPayload, Level, Mode } from "@/types";

const strengths = [
  "You communicated your main idea clearly.",
  "Your response had a friendly, confident opening.",
  "You used practical vocabulary that fits the situation.",
  "Your sentence order was easy to follow.",
  "You gave enough context for the listener to understand you.",
  "You used polite phrasing that creates a positive impression.",
  "Your answer sounded natural for the scenario.",
  "You stayed focused on the question.",
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
  "Try replacing repeated simple words with precise alternatives.",
  "End with a confident closing sentence.",
  "Keep verb tense consistent throughout the response.",
  "Use a short pause after important phrases when speaking aloud.",
  "Make the first sentence more direct.",
  "Add a polite phrase to soften the request.",
  "Use fewer filler words and move straight to the key point.",
  "Connect your reason to the scenario more explicitly.",
  "Try one compound sentence to sound more fluent.",
  "Use active verbs to make the answer stronger.",
  "Avoid translating word-for-word from your first language.",
  "Make the final idea sound complete.",
  "Choose a tone that matches the situation more closely.",
];

const encouragement = [
  "Nice work. You are building the kind of confidence that comes from steady practice.",
  "That was a solid response. A little more structure will make it sound even more natural.",
  "You are on the right track. Keep practicing one clear idea at a time.",
  "Good progress. Your message is understandable, and now we can polish the delivery.",
  "You handled the scenario well. Small vocabulary upgrades will make a big difference.",
  "This is exactly the kind of practice that improves real speaking confidence.",
  "Your effort is visible. Keep your tone calm and your sentences complete.",
  "Strong attempt. Try saying the improved version aloud once or twice.",
  "You are getting clearer. The next step is making your response flow smoothly.",
  "Well done. Your confidence will grow as these patterns become automatic.",
];

const scenarioVocabulary: Record<string, Array<[string, string, string]>> = {
  "job-interview": [
    ["good", "well-suited", "Use this when explaining why you fit a role."],
    ["work", "contribute", "A stronger verb for professional impact."],
    ["help", "support", "Sounds polished in formal workplace contexts."],
  ],
  "ordering-food": [
    ["want", "would like", "More polite when ordering."],
    ["give me", "could I have", "Softer and more natural with service staff."],
    ["less hot", "mild", "A concise food-ordering word."],
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
  return [{ original: text.split(/[.!?]/)[0]?.slice(0, 70) || "My answer is good", corrected: "My answer is clear and relevant.", explanation: "Use a complete sentence with a clear subject, verb, and idea." }];
}

function rewrite(text: string, mode: Mode, level: Level) {
  const scenarioPhrase = mode === "formal" ? "Thank you for the opportunity." : "Thanks for asking.";
  const simple = `${scenarioPhrase} ${text.trim().replace(/\s+/g, " ")}${/[.!?]$/.test(text.trim()) ? "" : "."}`;
  const advanced =
    level === "advanced"
      ? `${scenarioPhrase} I would be glad to share my perspective clearly and confidently: ${text.trim().replace(/\s+/g, " ")}`
      : `${scenarioPhrase} I want to explain this clearly: ${text.trim().replace(/\s+/g, " ")}`;
  return { simple, advanced: /[.!?]$/.test(advanced) ? advanced : `${advanced}.` };
}

export function generateFeedback(request: ConversationRequest): FeedbackPayload {
  const scenario = getScenario(request.scenarioId);
  const fluencyScore = score(request.message);
  const confidenceResult = confidence(fluencyScore, request.message);
  const seed = request.message.length + request.history.length + scenario.title.length;
  const vocab = scenarioVocabulary[scenario.id] ?? scenarioVocabulary.default;
  const rewrites = rewrite(request.message, request.mode, request.level);
  
  const grammarCorrectionsList = grammar(request.message);
  const isGenericGrammar = grammarCorrectionsList[0]?.explanation === "Use a complete sentence with a clear subject, verb, and idea.";
  const hasGrammarIssue = !isGenericGrammar;
  const topTip = grammarCorrectionsList[0]?.explanation ?? "Add one specific example to make your answer stronger.";

  // Detect if previous AI message was a coaching request
  const aiMessages = request.history.filter(m => m.role === "ai");
  const lastAiMessage = aiMessages[aiMessages.length - 1];
  const isRetryTurn = lastAiMessage?.content.includes("try rephrasing") || lastAiMessage?.content.includes("try again");

  // Simulated simple contextual response
  let nextQuestion = "I understand. Let's explore that further. Could you give me another example?";
  const lowerMsg = request.message.toLowerCase();
  if (lowerMsg.includes("specials") || lowerMsg.includes("menu")) nextQuestion = "Our specials today are the grilled salmon and the vegetarian pasta. Does either of those sound good?";
  else if (lowerMsg.includes("price") || lowerMsg.includes("cost")) nextQuestion = "The price depends on the specific options you choose, but it generally ranges from $15 to $25.";
  else if (scenario.id === "job-interview" && lowerMsg.includes("experience")) nextQuestion = "That sounds like relevant experience. How did you handle any challenges during that time?";
  else if (scenario.id === "friends-chat") nextQuestion = "Oh wow, that sounds really interesting! Tell me more about how that went.";

  let aiReply = nextQuestion;

  if (isRetryTurn) {
    const previousUserMessages = request.history.filter(m => m.role === "user");
    const previousUserMessage = previousUserMessages[previousUserMessages.length - 1];
    const prevScore = previousUserMessage ? score(previousUserMessage.content) : 0;
    
    if (fluencyScore > prevScore || !hasGrammarIssue) {
       aiReply = `Excellent improvement! Your response sounds much more ${request.mode === "formal" ? "professional" : "natural"} now. ${nextQuestion}`;
    } else {
       aiReply = `Good effort! You're getting closer. Let's keep practicing. ${nextQuestion}`;
    }
  } else if (fluencyScore < 6.5 || hasGrammarIssue) {
     aiReply = `I understand. I've shared a quick tip above. Would you like to try rephrasing your response to see how it sounds, or should we continue?`;
  }

  return {
    aiReply,
    quickTip: `Tip: ${topTip}`,
    fluencyScore,
    ...confidenceResult,
    toneLabel: request.mode === "formal" ? "Polite and Professional" : "Friendly and Natural",
    strengths: pick(strengths.map((item) => `${item} (${scenario.title})`), seed, 3),
    improvements: pick(improvements, seed + 3, 3),
    grammarCorrections: grammarCorrectionsList,
    pronunciationNotes: [
      "Slow down slightly on important nouns so your listener catches the key idea.",
      request.mode === "formal" ? "Keep a steady pace and lower your tone at the end of confident statements." : "Use natural stress on friendly words so the sentence sounds relaxed.",
    ],
    vocabularySuggestions: vocab.map(([word, alternative, context]) => ({ word, alternative, context })),
    simpleRewrite: rewrites.simple,
    advancedRewrite: rewrites.advanced,
    encouragementMessage: encouragement[seed % encouragement.length],
    safetyStatus: "safe",
  };
}

export const simulatedProvider: AiProvider = {
  async analyzeTurn(request) {
    return generateFeedback(request);
  },
};
