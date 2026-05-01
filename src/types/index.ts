import type { LucideIcon } from "lucide-react";

export type Level = "beginner" | "intermediate" | "advanced";
export type Mode = "formal" | "casual";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type MessageRole = "user" | "ai" | "system";
export type ConfidenceLevel = "low" | "medium" | "high";
export type ConversationKind = "scenario" | "free-chat" | "pronunciation";
export type PlaybackSpeed = "slow" | "normal" | "fast";
export type PreferredInputMode = "text" | "voice";
export type PronunciationExerciseType = "tongue-twister" | "minimal-pair" | "fluency-line";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  mode: Mode;
  level: Level;
  difficulty: Difficulty;
  category: string;
  goals: string[];
  starterPrompts: string[];
  followUpPrompts: string[];
  culturalNotes: string[];
  voiceSample: string;
  iconName: string;
}

export interface ScenarioWithIcon extends Scenario {
  Icon: LucideIcon;
}

export interface PronunciationExercise {
  id: string;
  title: string;
  type: PronunciationExerciseType;
  level: Level;
  focus: string;
  prompt: string;
  targetWords: string[];
  coachNote: string;
}

export interface AssessmentAnswer {
  questionId: string;
  value: string;
}

export interface AssessmentScores {
  grammar: number;
  vocabulary: number;
  fluency: number;
  pronunciation: number;
  composition: number;
  total: number;
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface VocabularySuggestion {
  word: string;
  alternative: string;
  context: string;
}

export interface FeedbackPayload {
  aiReply: string;
  quickTip: string;
  fluencyScore: number;
  confidenceLevel: ConfidenceLevel;
  confidencePercent: number;
  toneLabel: string;
  strengths: string[];
  improvements: string[];
  grammarCorrections: GrammarCorrection[];
  pronunciationNotes: string[];
  vocabularySuggestions: VocabularySuggestion[];
  simpleRewrite: string;
  advancedRewrite: string;
  encouragementMessage: string;
  safetyStatus: "safe" | "blocked";
}

export interface SessionRecord {
  id: string;
  scenarioId: string | null;
  scenarioTitle: string;
  mode: Mode | null;
  level: Level;
  kind: ConversationKind;
  fluencyScore: number;
  feedback: FeedbackPayload;
  messages: Message[];
  completedAt: string;
}

export interface ModerationResult {
  safe: boolean;
  category?: string;
  warning?: string;
}

export interface AppPreferences {
  listeningEnabled: boolean;
  playbackSpeed: PlaybackSpeed;
  preferredInputMode: PreferredInputMode;
}

export interface ConversationRequest {
  message: string;
  kind: ConversationKind;
  scenarioId?: string | null;
  exerciseId?: string | null;
  mode: Mode | null;
  level: Level;
  history: Message[];
  requestWrapUp?: boolean;
}

export interface ConversationResponse {
  safe: boolean;
  aiMessage?: Message;
  feedback?: FeedbackPayload;
  warning?: string;
  category?: string;
  provider?: "live" | "simulated";
}

export interface AppState {
  level: Level | null;
  assessmentCompleted: boolean;
  assessmentScores: AssessmentScores | null;
  selectedMode: Mode | null;
  selectedScenario: Scenario | null;
  selectedExerciseId: string | null;
  activeConversationKind: ConversationKind;
  conversationHistory: Message[];
  lastFeedback: FeedbackPayload | null;
  sessions: SessionRecord[];
  warningCount: number;
  cooldownUntil: number | null;
  preferences: AppPreferences;
}
