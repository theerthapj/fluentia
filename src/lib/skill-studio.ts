import type { Level, PronunciationExercise, SkillPracticeMode, SkillPracticeProgress } from "@/types";

export const skillModeOrder: SkillPracticeMode[] = ["pronunciation", "vocabulary", "grammar", "sentence-formation"];

export const skillModeLabels: Record<SkillPracticeMode, string> = {
  pronunciation: "Pronunciation",
  vocabulary: "Vocabulary",
  grammar: "Grammar",
  "sentence-formation": "Sentence Formation",
};

export const levelLabels: Record<Level, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export type SkillAnalysis = {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  weakAreas: string[];
  revisionItems: string[];
};

export type PronunciationAnalysis = SkillAnalysis & {
  clarity: number;
  stress: number;
  tone: number;
  accuracy: number;
  britishScore: number;
  indianScore: number;
  highlightedWords: string[];
  britishTips: string[];
  indianEnglishTips: string[];
};

export type VocabularyWord = {
  word: string;
  level: Level;
  meaning: string;
  synonyms: string[];
  antonyms: string[];
  example: string;
};

export type VocabularyUpgrade = {
  original: string;
  replacement: string;
  advanced: string;
  reason: string;
};

export type VocabularyAnalysis = SkillAnalysis & {
  focusWord: VocabularyWord;
  upgrades: VocabularyUpgrade[];
  exampleRewrite: string;
};

export type GrammarAnalysis = SkillAnalysis & {
  corrected: string;
  enhanced: string;
  rules: Array<{ title: string; explanation: string }>;
};

export type SentenceChallenge = {
  id: string;
  level: Level;
  jumbled: string[];
  correct: string;
  focus: string;
  tip: string;
};

export type SentenceFormationAnalysis = SkillAnalysis & {
  corrected: string;
  professionalVersion: string;
  structure: Array<{ label: string; value: string }>;
  tips: string[];
};

const vocabularyWords: VocabularyWord[] = [
  {
    word: "clear",
    level: "beginner",
    meaning: "easy to understand or see",
    synonyms: ["simple", "direct", "plain"],
    antonyms: ["confusing", "unclear", "vague"],
    example: "Please give me clear instructions before I start.",
  },
  {
    word: "confident",
    level: "beginner",
    meaning: "feeling sure about your ability",
    synonyms: ["sure", "positive", "brave"],
    antonyms: ["nervous", "unsure", "hesitant"],
    example: "I feel confident when I prepare before speaking.",
  },
  {
    word: "improve",
    level: "beginner",
    meaning: "to become better",
    synonyms: ["grow", "upgrade", "develop"],
    antonyms: ["worsen", "decline", "weaken"],
    example: "I practice every day to improve my English.",
  },
  {
    word: "precise",
    level: "intermediate",
    meaning: "exact and careful",
    synonyms: ["accurate", "specific", "exact"],
    antonyms: ["rough", "unclear", "general"],
    example: "A precise answer helps the listener trust your point.",
  },
  {
    word: "thoughtful",
    level: "intermediate",
    meaning: "careful, kind, and well considered",
    synonyms: ["considerate", "careful", "reflective"],
    antonyms: ["careless", "rude", "thoughtless"],
    example: "Her thoughtful response made the meeting calmer.",
  },
  {
    word: "articulate",
    level: "intermediate",
    meaning: "able to express ideas clearly",
    synonyms: ["eloquent", "fluent", "expressive"],
    antonyms: ["unclear", "inarticulate", "mumbled"],
    example: "An articulate speaker explains complex ideas simply.",
  },
  {
    word: "nuanced",
    level: "advanced",
    meaning: "showing small but important differences",
    synonyms: ["subtle", "refined", "layered"],
    antonyms: ["basic", "simple", "one-sided"],
    example: "A nuanced answer shows both confidence and maturity.",
  },
  {
    word: "compelling",
    level: "advanced",
    meaning: "strong enough to hold attention or persuade",
    synonyms: ["persuasive", "convincing", "powerful"],
    antonyms: ["weak", "unconvincing", "dull"],
    example: "She gave a compelling explanation for the new plan.",
  },
  {
    word: "succinct",
    level: "advanced",
    meaning: "clear and brief, without extra words",
    synonyms: ["concise", "brief", "compact"],
    antonyms: ["wordy", "long-winded", "rambling"],
    example: "A succinct summary is useful at the end of a call.",
  },
];

const vocabularyUpgradeBank: VocabularyUpgrade[] = [
  { original: "good", replacement: "strong", advanced: "compelling", reason: "Adds more confidence than a general positive word." },
  { original: "bad", replacement: "weak", advanced: "ineffective", reason: "Sounds more specific and professional." },
  { original: "very good", replacement: "excellent", advanced: "outstanding", reason: "Replaces two common words with one sharper adjective." },
  { original: "very important", replacement: "essential", advanced: "crucial", reason: "Makes the priority sound clearer." },
  { original: "help", replacement: "support", advanced: "assist", reason: "Works well in polite and professional sentences." },
  { original: "tell", replacement: "explain", advanced: "clarify", reason: "Shows a clearer communication purpose." },
  { original: "show", replacement: "demonstrate", advanced: "illustrate", reason: "Sounds more expressive in learning or work contexts." },
  { original: "use", replacement: "apply", advanced: "utilize", reason: "Makes the action more purposeful." },
  { original: "make better", replacement: "improve", advanced: "refine", reason: "Turns a phrase into a stronger verb." },
  { original: "a lot", replacement: "many", advanced: "substantial", reason: "Avoids vague wording." },
  { original: "nice", replacement: "pleasant", advanced: "impressive", reason: "Gives the listener a clearer feeling." },
  { original: "think", replacement: "believe", advanced: "consider", reason: "Sounds more deliberate when sharing an opinion." },
];

export const sentenceChallenges: SentenceChallenge[] = [
  {
    id: "sentence-beginner-daily",
    level: "beginner",
    jumbled: ["I", "English", "every", "practice", "day"],
    correct: "I practice English every day.",
    focus: "Subject + verb + object + time",
    tip: "Start with who is doing the action, then add the action and the detail.",
  },
  {
    id: "sentence-beginner-request",
    level: "beginner",
    jumbled: ["Could", "repeat", "please", "you", "that"],
    correct: "Could you please repeat that?",
    focus: "Polite question order",
    tip: "For polite requests, use Could + subject + please + verb.",
  },
  {
    id: "sentence-intermediate-meeting",
    level: "intermediate",
    jumbled: ["I", "the", "before", "will", "meeting", "notes", "review"],
    correct: "I will review the notes before the meeting.",
    focus: "Future action with time detail",
    tip: "Put the future helper before the main verb, then add the time phrase at the end.",
  },
  {
    id: "sentence-intermediate-reason",
    level: "intermediate",
    jumbled: ["because", "prepared", "confident", "I", "I", "feel", "am"],
    correct: "I feel confident because I am prepared.",
    focus: "Reason connector",
    tip: "Use because to join the result with the reason.",
  },
  {
    id: "sentence-advanced-perspective",
    level: "advanced",
    jumbled: ["approach", "could", "a", "more", "balanced", "we", "consider"],
    correct: "We could consider a more balanced approach.",
    focus: "Diplomatic suggestion",
    tip: "Use could consider to sound professional without sounding forceful.",
  },
  {
    id: "sentence-advanced-contrast",
    level: "advanced",
    jumbled: ["the", "promising", "needs", "idea", "however", "more", "evidence"],
    correct: "The idea is promising; however, it needs more evidence.",
    focus: "Contrast with however",
    tip: "Use however after a complete idea when you want to add a thoughtful contrast.",
  },
];

const commonCorrections: Array<{ pattern: RegExp; replacement: string; title: string; explanation: string }> = [
  {
    pattern: /\bi am agree\b/gi,
    replacement: "I agree",
    title: "Use agree as the main verb",
    explanation: "Agree already works as an action, so it does not need am before it.",
  },
  {
    pattern: /\b(she|he|it)\s+go\b/gi,
    replacement: "$1 goes",
    title: "Match the verb with he, she, or it",
    explanation: "In the present simple, he, she, and it usually take an s on the verb.",
  },
  {
    pattern: /\b(she|he|it)\s+have\b/gi,
    replacement: "$1 has",
    title: "Use has after he, she, or it",
    explanation: "Have changes to has with singular subjects.",
  },
  {
    pattern: /\bi\s+has\b/gi,
    replacement: "I have",
    title: "Use have with I",
    explanation: "I pairs with have, not has.",
  },
  {
    pattern: /\bi\s+are\b/gi,
    replacement: "I am",
    title: "Use am with I",
    explanation: "I uses am when you describe a state or feeling.",
  },
  {
    pattern: /\bmore better\b/gi,
    replacement: "better",
    title: "Avoid double comparatives",
    explanation: "Better already means more good, so more better repeats the same idea.",
  },
  {
    pattern: /\bdont\b/gi,
    replacement: "don't",
    title: "Add the missing apostrophe",
    explanation: "Contractions need an apostrophe to show the missing letter.",
  },
  {
    pattern: /\bcant\b/gi,
    replacement: "can't",
    title: "Add the missing apostrophe",
    explanation: "Can't is the short form of cannot.",
  },
  {
    pattern: /\bwont\b/gi,
    replacement: "won't",
    title: "Use the correct contraction",
    explanation: "Won't is the accepted short form of will not.",
  },
  {
    pattern: /\bteh\b/gi,
    replacement: "the",
    title: "Fix a common spelling slip",
    explanation: "The letters in the are easy to reverse when typing quickly.",
  },
  {
    pattern: /\brecieve\b/gi,
    replacement: "receive",
    title: "Remember receive",
    explanation: "After c, English usually uses ei in receive.",
  },
  {
    pattern: /\bdefinately\b/gi,
    replacement: "definitely",
    title: "Spell definitely with finite",
    explanation: "Definitely contains finite in the middle.",
  },
  {
    pattern: /\balot\b/gi,
    replacement: "a lot",
    title: "Split a lot into two words",
    explanation: "A lot is written as two words in standard English.",
  },
  {
    pattern: /\bseperate\b/gi,
    replacement: "separate",
    title: "Spell separate with a",
    explanation: "Separate has a in the middle: sep-a-rate.",
  },
  {
    pattern: /\bto office\b/gi,
    replacement: "to the office",
    title: "Add the article",
    explanation: "For a specific common place, English often needs the before the noun.",
  },
  {
    pattern: /\beveryday\b/gi,
    replacement: "every day",
    title: "Separate every day",
    explanation: "Every day means each day. Everyday is an adjective, as in everyday clothes.",
  },
  {
    pattern: /\bspeak confident\b/gi,
    replacement: "speak confidently",
    title: "Use an adverb after speak",
    explanation: "Confidently describes how someone speaks, so it needs the -ly form.",
  },
  {
    pattern: /\b(she|he|it)([^.!?]{0,80})\band don't\b/gi,
    replacement: "$1$2and doesn't",
    title: "Keep the helping verb consistent",
    explanation: "When the subject is he, she, or it, don't becomes doesn't in the present simple.",
  },
  {
    pattern: /\s+([,.!?;:])/g,
    replacement: "$1",
    title: "Tidy punctuation spacing",
    explanation: "Punctuation attaches to the word before it.",
  },
];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function normalizeText(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z'\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function capitalizeSentence(text: string) {
  const trimmed = normalizeText(text);
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function ensureEndingPunctuation(text: string) {
  if (!text) return text;
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function preserveReplacementCase(match: string, replacement: string) {
  return match.charAt(0) === match.charAt(0).toUpperCase()
    ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
    : replacement;
}

function orderedMatchRatio(source: string[], target: string[]) {
  let cursor = 0;
  let matches = 0;
  for (const word of source) {
    if (word === target[cursor]) {
      matches += 1;
      cursor += 1;
    }
    if (cursor >= target.length) break;
  }
  return target.length ? matches / target.length : 0;
}

function extractPromptText(exercise: PronunciationExercise) {
  return exercise.prompt.replace(/^(repeat|say):\s*/i, "").trim();
}

function targetTokensForExercise(exercise: PronunciationExercise) {
  return tokenize(extractPromptText(exercise));
}

function uniqueWords(words: string[]) {
  return Array.from(new Set(words.map((word) => word.toLowerCase()).filter(Boolean)));
}

export function levelFromProgress(baseLevel: Level | null, progress?: SkillPracticeProgress): Level {
  return progress?.adaptiveLevel ?? baseLevel ?? "beginner";
}

export function getVocabularyWordsForLevel(level: Level) {
  return vocabularyWords.filter((word) => word.level === level);
}

export function getVocabularyWord(level: Level, attempts = 0) {
  const words = getVocabularyWordsForLevel(level);
  return words[attempts % words.length] ?? vocabularyWords[0];
}

export function getSentenceChallenge(level: Level, attempts = 0) {
  const challenges = sentenceChallenges.filter((challenge) => challenge.level === level);
  return challenges[attempts % challenges.length] ?? sentenceChallenges[0];
}

export function analyzePronunciation(input: string, exercise: PronunciationExercise): PronunciationAnalysis {
  const transcriptWords = tokenize(input);
  const targetWords = targetTokensForExercise(exercise);
  const importantWords = uniqueWords(exercise.targetWords.flatMap((word) => tokenize(word)));
  const matchedImportant = importantWords.filter((word) => transcriptWords.includes(word));
  const highlightedWords = importantWords.filter((word) => !transcriptWords.includes(word));
  const matchRatio = importantWords.length ? matchedImportant.length / importantWords.length : orderedMatchRatio(transcriptWords, targetWords);
  const orderRatio = orderedMatchRatio(transcriptWords, targetWords);
  const lengthRatio = targetWords.length ? clamp(transcriptWords.length / targetWords.length, 0, 1.15) : 0;

  const clarity = Math.round(clamp(matchRatio * 100));
  const accuracy = Math.round(clamp((matchRatio * 0.72 + orderRatio * 0.28) * 100));
  const stress = Math.round(clamp(58 + matchRatio * 30 + (lengthRatio > 0.75 ? 8 : 0) - highlightedWords.length * 3));
  const tone = Math.round(clamp(60 + matchRatio * 22 + (input.includes(",") || input.includes(".") ? 8 : 0)));
  const score = Math.round(clamp((clarity * 0.34) + (accuracy * 0.34) + (stress * 0.18) + (tone * 0.14)));
  const britishPenalty = highlightedWords.some((word) => /r|th|v|w/.test(word)) ? 5 : 0;
  const indianPenalty = highlightedWords.some((word) => /th|v|w|z/.test(word)) ? 4 : 0;
  const britishScore = Math.round(clamp(score - britishPenalty + (orderRatio > 0.8 ? 3 : 0)));
  const indianScore = Math.round(clamp(score - indianPenalty + (clarity > 70 ? 4 : 0)));

  const weakAreas = [
    clarity < 72 ? "Target word clarity" : "",
    stress < 72 ? "Sentence stress" : "",
    tone < 72 ? "Natural tone" : "",
    highlightedWords.length ? `Repeat: ${highlightedWords.slice(0, 3).join(", ")}` : "",
  ].filter(Boolean);

  return {
    score,
    clarity,
    stress,
    tone,
    accuracy,
    britishScore,
    indianScore,
    highlightedWords,
    britishTips: [
      "Keep stressed words slightly longer and let small joining words stay lighter.",
      "For broad British English, avoid adding a heavy r sound after vowels unless the next word begins with a vowel.",
      highlightedWords.length ? `Repeat ${highlightedWords[0]} slowly, then place it back into the full sentence.` : "Your target words are landing clearly.",
    ],
    indianEnglishTips: [
      "For clear Indian English, keep word endings crisp without rushing the final consonant.",
      "Separate v and w gently: v uses the teeth and lower lip, while w begins with rounded lips.",
      highlightedWords.length ? `Use a slower first attempt for ${highlightedWords.slice(0, 2).join(" and ")}.` : "Your delivery is easy to follow.",
    ],
    summary: score >= 78 ? "Clear delivery with a strong base to polish." : "Good start. Slow down and repeat the highlighted words first.",
    strengths: [
      matchedImportant.length ? `${matchedImportant.length} target words were captured clearly.` : "You started the line and created a practice sample.",
      orderRatio > 0.7 ? "The sentence order stayed close to the model." : "You have a focused line to repeat and compare.",
    ],
    improvements: [
      highlightedWords.length ? `Repeat these words: ${highlightedWords.join(", ")}.` : "Try a second pass with smoother linking.",
      stress < 75 ? "Stress the content words and make the smaller words lighter." : "Keep the same rhythm and add a warmer ending tone.",
    ],
    weakAreas,
    revisionItems: highlightedWords.length ? highlightedWords : exercise.targetWords.slice(0, 3),
  };
}

function applyVocabularyUpgrade(sentence: string, upgrade: VocabularyUpgrade) {
  const pattern = new RegExp(`\\b${upgrade.original.replace(/\s+/g, "\\s+")}\\b`, "i");
  return sentence.replace(pattern, (match) => preserveReplacementCase(match, upgrade.advanced));
}

export function analyzeVocabulary(input: string, focusWord: VocabularyWord): VocabularyAnalysis {
  const sentence = normalizeText(input);
  const upgrades = vocabularyUpgradeBank.filter((upgrade) => new RegExp(`\\b${upgrade.original.replace(/\s+/g, "\\s+")}\\b`, "i").test(sentence));
  const suggested = upgrades.length ? upgrades : vocabularyUpgradeBank.slice(0, 3);
  const exampleRewrite = upgrades.reduce((current, upgrade) => applyVocabularyUpgrade(current, upgrade), sentence || focusWord.example);
  const hasFocusWord = new RegExp(`\\b${focusWord.word}\\b`, "i").test(sentence);
  const score = clamp(58 + Math.min(upgrades.length, 3) * 12 + (hasFocusWord ? 14 : 0) + (sentence.split(/\s+/).length >= 7 ? 8 : 0));
  const weakAreas = [
    upgrades.length ? "" : "Use more specific words",
    hasFocusWord ? "" : `Try using ${focusWord.word}`,
    sentence.length < 35 ? "Build a fuller sentence" : "",
  ].filter(Boolean);

  return {
    score: Math.round(score),
    focusWord,
    upgrades: suggested,
    exampleRewrite,
    summary: upgrades.length ? "Your sentence has clear upgrade opportunities." : `Try using ${focusWord.word} or another precise word in your sentence.`,
    strengths: [
      sentence ? "You gave Fluentia a real sentence to improve." : "The focus word card gives you a ready starting point.",
      hasFocusWord ? `You used ${focusWord.word} in context.` : "You can now replace plain words with richer choices.",
    ],
    improvements: [
      suggested[0] ? `Replace "${suggested[0].original}" with "${suggested[0].advanced}" when the context fits.` : `Use ${focusWord.word} in a personal sentence.`,
      "Read the example aloud once so the word feels natural in speech.",
    ],
    weakAreas,
    revisionItems: [focusWord.word, ...suggested.slice(0, 3).map((item) => item.advanced)],
  };
}

export function analyzeGrammar(input: string): GrammarAnalysis {
  const original = normalizeText(input);
  let corrected = original;
  const rules: GrammarAnalysis["rules"] = [];

  for (const correction of commonCorrections) {
    if (correction.pattern.test(corrected)) {
      corrected = corrected.replace(correction.pattern, correction.replacement);
      rules.push({ title: correction.title, explanation: correction.explanation });
    }
    correction.pattern.lastIndex = 0;
  }

  corrected = corrected.replace(/\bi\b/g, "I").replace(/\s{2,}/g, " ");
  corrected = ensureEndingPunctuation(capitalizeSentence(corrected));

  if (original && !/[.!?]$/.test(original)) {
    rules.push({
      title: "Finish the thought",
      explanation: "A final full stop, question mark, or exclamation mark tells the reader the idea is complete.",
    });
  }

  if (original && original[0] === original[0]?.toLowerCase()) {
    rules.push({
      title: "Start with a capital letter",
      explanation: "The first word gets a capital letter because it opens the sentence.",
    });
  }

  const enhanced = corrected
    .replace(/^Send me\b/i, "Could you please send me")
    .replace(/^Give me\b/i, "Could you please give me")
    .replace(/\bI want to\b/i, "I would like to")
    .replace(/\bneed\b/i, "would benefit from");

  const changed = corrected !== ensureEndingPunctuation(capitalizeSentence(original));
  const score = clamp(88 - rules.length * 9 + (original.length > 60 ? 5 : 0));
  const weakAreas = [
    rules.some((rule) => /verb|has|have|agree/i.test(rule.title)) ? "Subject-verb agreement" : "",
    rules.some((rule) => /punctuation|full stop|apostrophe|contraction/i.test(`${rule.title} ${rule.explanation}`)) ? "Punctuation" : "",
    changed ? "Sentence accuracy" : "",
  ].filter(Boolean);

  return {
    score: Math.round(score),
    corrected,
    enhanced: ensureEndingPunctuation(capitalizeSentence(enhanced)),
    rules: rules.length
      ? rules.slice(0, 4)
      : [{ title: "Polish pass", explanation: "Your basics look steady. Now focus on smoother word choice and tone." }],
    summary: rules.length ? "Fluvi cleaned the sentence and found a few fixable patterns." : "The grammar looks steady. The next step is style and tone.",
    strengths: [
      original.split(/\s+/).filter(Boolean).length >= 6 ? "You gave enough context for a meaningful correction." : "The core idea is visible.",
      rules.length <= 1 ? "The sentence is already easy to follow." : "The sentence becomes much clearer after small rule fixes.",
    ],
    improvements: [
      "Read the corrected version once, then say it without looking.",
      "Notice the rule title first, then the example. This keeps grammar quick and memorable.",
    ],
    weakAreas,
    revisionItems: rules.slice(0, 3).map((rule) => rule.title),
  };
}

function buildProfessionalVersion(sentence: string) {
  return sentence
    .replace(/\bI think\b/i, "I believe")
    .replace(/\bgood\b/i, "effective")
    .replace(/\bhelp\b/i, "support")
    .replace(/\btry\b/i, "aim");
}

export function analyzeSentenceFormation(input: string, challenge?: SentenceChallenge): SentenceFormationAnalysis {
  const raw = normalizeText(input);
  const grammar = analyzeGrammar(raw);
  const inputWords = tokenize(raw);
  const challengeWords = challenge ? tokenize(challenge.correct) : [];
  const orderRatio = challenge ? orderedMatchRatio(inputWords, challengeWords) : 0;
  const hasSubject = /\b(i|you|he|she|it|we|they|people|team|student|manager|idea)\b/i.test(raw);
  const hasVerb = /\b(am|is|are|was|were|be|have|has|do|does|can|could|will|would|practice|learn|speak|review|feel|consider|need|work|help|support|explain)\b/i.test(raw);
  const corrected = challenge ? challenge.correct : grammar.corrected;
  const professionalVersion = ensureEndingPunctuation(capitalizeSentence(buildProfessionalVersion(corrected)));
  const score = challenge
    ? clamp(42 + orderRatio * 48 + (raw === challenge.correct ? 10 : 0))
    : clamp(48 + (hasSubject ? 16 : 0) + (hasVerb ? 16 : 0) + (/[.!?]$/.test(raw) ? 10 : 0) + (inputWords.length >= 6 ? 8 : 0));
  const weakAreas = [
    hasSubject ? "" : "Add a clear subject",
    hasVerb ? "" : "Add a clear action",
    /[.!?]$/.test(raw) ? "" : "Finish with punctuation",
    challenge && orderRatio < 0.72 ? "Word order" : "",
  ].filter(Boolean);

  return {
    score: Math.round(score),
    corrected,
    professionalVersion,
    structure: [
      { label: "Subject", value: hasSubject ? "Present" : "Needs a clear who or what" },
      { label: "Action", value: hasVerb ? "Present" : "Needs a main verb" },
      { label: "Detail", value: inputWords.length >= 6 ? "Enough context" : "Add time, place, reason, or object" },
    ],
    tips: [
      challenge?.tip ?? "Build in this order: subject, verb, object, then time or reason.",
      "Keep one main idea in one sentence before adding advanced connectors.",
      "For professional tone, use could, would, or I believe when you need a softer expression.",
    ],
    summary: score >= 78 ? "The sentence structure is clear and ready to polish." : "The idea is there. Now put the subject and action in a cleaner order.",
    strengths: [
      hasSubject ? "The sentence has a clear subject." : "You have useful words to build from.",
      hasVerb ? "The sentence includes an action." : "The exercise makes the missing action easy to spot.",
    ],
    improvements: [
      challenge && orderRatio < 1 ? `Model answer: ${challenge.correct}` : "Try adding a reason or time detail.",
      "Say the final version aloud to check whether it flows naturally.",
    ],
    weakAreas,
    revisionItems: challenge ? [challenge.focus, challenge.correct] : weakAreas,
  };
}
