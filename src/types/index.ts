import type { LucideIcon } from "lucide-react";

export type Level = "beginner" | "intermediate" | "advanced";
export type Mode = "formal" | "casual";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type MessageRole = "user" | "ai" | "system";
export type ConfidenceLevel = "low" | "medium" | "high";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface Scenario {
  id: string;
  title: string;
  difficulty: Difficulty;
  modes: Array<Mode | "both">;
  iconName: string;
  openingPrompt: string;
  openingPromptAdvanced: string;
  culturalNote: string;
}

export interface ScenarioWithIcon extends Scenario {
  Icon: LucideIcon;
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
  scenarioId: string;
  mode: Mode;
  level: Level;
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

export interface ConversationRequest {
  message: string;
  scenarioId: string;
  mode: Mode;
  level: Level;
  history: Message[];
}

export interface ConversationResponse {
  safe: boolean;
  aiMessage?: Message;
  feedback?: FeedbackPayload;
  warning?: string;
  category?: string;
}

export interface AppState {
  level: Level | null;
  assessmentCompleted: boolean;
  assessmentScores: AssessmentScores | null;
  selectedMode: Mode | null;
  selectedScenario: Scenario | null;
  conversationHistory: Message[];
  lastFeedback: FeedbackPayload | null;
  sessions: SessionRecord[];
  warningCount: number;
  cooldownUntil: number | null;
}
