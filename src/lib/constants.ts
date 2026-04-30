import {
  Briefcase,
  Coffee,
  GraduationCap,
  HelpCircle,
  MessageCircle,
  Presentation,
  UserPlus,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import type { AssessmentAnswer, Difficulty, Level, Mode, ScenarioWithIcon } from "@/types";

export const STORAGE_KEY = "fluentia_app_state";
export const WARNINGS_KEY = "fluentia_warnings";

export const assessmentQuestions = [
  {
    id: "grammar",
    kind: "mcq",
    category: "Grammar",
    prompt: "Choose the correct sentence",
    options: [
      "She go to school every day.",
      "She goes to school every day.",
      "She going to school every day.",
      "She gone to school every day.",
    ],
    correct: "She goes to school every day.",
  },
  {
    id: "vocabulary",
    kind: "mcq",
    category: "Vocabulary",
    prompt: "Which word best fits? I am very _____ for your help.",
    options: ["angry", "grateful", "late", "heavy"],
    correct: "grateful",
  },
  {
    id: "fluency",
    kind: "text",
    category: "Fluency",
    prompt: "Describe your morning routine in 2-3 sentences.",
  },
  {
    id: "pronunciation",
    kind: "choice",
    category: "Pronunciation Confidence",
    prompt: "How confident are you speaking English aloud?",
    options: ["Not very", "Somewhat", "Very confident"],
  },
  {
    id: "composition",
    kind: "text",
    category: "Composition",
    prompt: "Introduce yourself as if meeting a new colleague.",
  },
] as const;

export const scenarios: ScenarioWithIcon[] = [
  {
    id: "job-interview",
    title: "Job Interview",
    Icon: Briefcase,
    iconName: "Briefcase",
    difficulty: "Intermediate",
    modes: ["formal"],
    openingPrompt: "Welcome. I am your interviewer today. Please tell me about yourself and one strength you would bring to the role.",
    openingPromptAdvanced: "Welcome back. This time, answer like you are interviewing for a competitive role: connect your experience to measurable impact.",
    culturalNote: "In many professional English interviews, 'I am passionate about' can sound overused. Try 'I find this work genuinely engaging.'",
  },
  {
    id: "classroom-answer",
    title: "Classroom Answer",
    Icon: GraduationCap,
    iconName: "GraduationCap",
    difficulty: "Beginner",
    modes: ["formal"],
    openingPrompt: "Imagine your teacher has asked you to explain an idea from today's class. Share your answer clearly.",
    openingPromptAdvanced: "Your teacher asks a follow-up question. Explain your answer with one example and one reason.",
    culturalNote: "In classrooms, English speakers often signal uncertainty politely with phrases like 'I think' or 'From my understanding.'",
  },
  {
    id: "daily-communication",
    title: "Daily Communication",
    Icon: MessageCircle,
    iconName: "MessageCircle",
    difficulty: "Beginner",
    modes: ["both"],
    openingPrompt: "Let's practice a daily conversation. Tell me about something you need to do today.",
    openingPromptAdvanced: "Let's make this more natural. Describe your day, then ask one follow-up question to keep the conversation moving.",
    culturalNote: "Everyday English often uses short connectors like 'then', 'after that', and 'so' to make simple plans sound smooth.",
  },
  {
    id: "friends-chat",
    title: "Friends Chat",
    Icon: Users,
    iconName: "Users",
    difficulty: "Beginner",
    modes: ["casual"],
    openingPrompt: "Hey, good to see you. Tell me what you have been up to lately.",
    openingPromptAdvanced: "Hey, good to see you again. Share a quick update and add a relaxed question back to your friend.",
    culturalNote: "English native speakers often use softeners like 'kind of', 'sort of', and 'I guess' to sound relaxed and informal.",
  },
  {
    id: "ordering-food",
    title: "Ordering Food",
    Icon: UtensilsCrossed,
    iconName: "UtensilsCrossed",
    difficulty: "Beginner",
    modes: ["casual"],
    openingPrompt: "Hi, welcome in. What would you like to order today?",
    openingPromptAdvanced: "Hi again. Order clearly, ask one polite question about the menu, and confirm one preference.",
    culturalNote: "In the UK and US, 'Could I have...' is preferred over 'Give me...' because it sounds natural and polite.",
  },
  {
    id: "asking-for-help",
    title: "Asking for Help",
    Icon: HelpCircle,
    iconName: "HelpCircle",
    difficulty: "Beginner",
    modes: ["both"],
    openingPrompt: "You need help with a task. Explain what you need and ask politely.",
    openingPromptAdvanced: "Ask for help with more detail: explain what you tried, where you got stuck, and what you need next.",
    culturalNote: "When asking for help in English, saying 'Could you help me with...' sounds more respectful than a direct command.",
  },
  {
    id: "self-introduction",
    title: "Self-Introduction",
    Icon: UserPlus,
    iconName: "UserPlus",
    difficulty: "Intermediate",
    modes: ["both"],
    openingPrompt: "Please introduce yourself in a confident and natural way.",
    openingPromptAdvanced: "Introduce yourself with a stronger personal angle: include your background, interest, and what you hope to contribute.",
    culturalNote: "A strong English self-introduction often balances confidence with modesty: clear facts, not exaggerated claims.",
  },
  {
    id: "presentation-practice",
    title: "Presentation Practice",
    Icon: Presentation,
    iconName: "Presentation",
    difficulty: "Advanced",
    modes: ["formal"],
    openingPrompt: "You are opening a short presentation. Introduce your topic and why it matters.",
    openingPromptAdvanced: "Open your presentation with a sharper hook, state the audience benefit, and preview your structure.",
    culturalNote: "In English presentations, audiences expect a clear preview such as 'I'll cover three points today.'",
  },
];

export const modeCards: Array<{ id: Mode; title: string; examples: string; Icon: typeof Briefcase }> = [
  { id: "formal", title: "Formal", examples: "Job interview • Presentation • Professional email", Icon: Briefcase },
  { id: "casual", title: "Casual", examples: "Friends chat • Ordering food • Daily conversation", Icon: Coffee },
];

export const difficultyColor: Record<Difficulty, string> = {
  Beginner: "bg-success/15 text-success border-success/30",
  Intermediate: "bg-accent-secondary/15 text-blue-300 border-accent-secondary/30",
  Advanced: "bg-purple-500/15 text-purple-300 border-purple-400/30",
};

export const levelCopy: Record<Level, string> = {
  beginner: "You are ready to build clear everyday sentences with patient practice.",
  intermediate: "You can express ideas well and are ready to polish tone and structure.",
  advanced: "You are ready for nuanced expression, stronger vocabulary, and confident delivery.",
};

export const voiceSamples: Record<string, string> = {
  "job-interview": "Thank you for meeting with me. I am a motivated learner, and I enjoy solving problems with a calm and organized approach.",
  "classroom-answer": "I think the main idea is that practice helps us understand the topic better and remember it for a longer time.",
  "daily-communication": "Today I need to finish my work, call a friend, and prepare for tomorrow, so I am trying to manage my time well.",
  "friends-chat": "I have been busy this week, but I am happy because I learned something new and spent time with my family.",
  "ordering-food": "Hi, I would like to order a vegetable sandwich and a fresh juice, please. Could you make it less spicy?",
  "asking-for-help": "Excuse me, could you please help me understand this step? I tried it once, but I am still a little confused.",
  "self-introduction": "Hello, my name is Alex. I am interested in learning new skills, meeting people, and improving my communication every day.",
  "presentation-practice": "Good morning everyone. Today I will talk about why communication skills matter and how small daily practice can create real progress.",
};

export function getScenario(id?: string | null) {
  return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
}

export function levelFromScore(total: number): Level {
  if (total <= 3) return "beginner";
  if (total <= 6) return "intermediate";
  return "advanced";
}

export function scoreText(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const total = words.length;
  if (total < 5) return 0;

  const uniqueRatio = new Set(words.map((w) => w.toLowerCase())).size / total;
  if (uniqueRatio < 0.3) return 0; // hard fail for repetitive input

  const lengthScore = total > 20 ? 1.0 : total > 10 ? 0.5 : 0.0;
  const varietyScore = uniqueRatio > 0.7 ? 1.0 : uniqueRatio > 0.4 ? 0.5 : 0.0;
  return Math.round(lengthScore + varietyScore); // 0, 1, or 2
}

export function scoreAssessment(answers: AssessmentAnswer[]) {
  const byId = new Map(answers.map((answer) => [answer.questionId, answer.value]));
  const grammar = byId.get("grammar") === assessmentQuestions[0].correct ? 2 : 0;
  const vocabulary = byId.get("vocabulary") === assessmentQuestions[1].correct ? 2 : 0;
  const fluency = scoreText(byId.get("fluency") ?? "");
  const pronunciationValue = byId.get("pronunciation");
  const pronunciation = pronunciationValue === "Very confident" ? 2 : pronunciationValue === "Somewhat" ? 1 : 0;
  const composition = scoreText(byId.get("composition") ?? "");
  const total = grammar + vocabulary + fluency + pronunciation + composition;
  return {
    level: levelFromScore(total),
    scores: { grammar, vocabulary, fluency, pronunciation, composition, total },
  };
}
