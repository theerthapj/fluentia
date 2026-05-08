// STEP 1: Fluvi TypeScript Types
// All Fluvi-specific types — do not merge with src/types/index.ts

export type FluviMode =
  | 'idle'
  | 'speaking'
  | 'thinking'
  | 'correct_feedback'
  | 'incorrect_feedback'
  | 'pronunciation_success'
  | 'grammar_success'
  | 'encouragement'
  | 'warning'
  | 'celebration';

export type CorrectVariant =
  | 'feather_spread'
  | 'shimmer_sweep'
  | 'light_wave'
  | 'sparkle_drop'
  | 'smooth_spin'
  | 'elegant_bounce'
  | 'dance_moment';

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export interface FluviTheme {
  primaryColor: string;
  featherColor: string;
  eyeColor: string;
  glowColor: string;
  featherSpread: number;  // 0–1, controls feather openness
  saturation: number;     // CSS filter value
  brightness: number;
}

export interface FluviState {
  mode: FluviMode;
  correctVariantQueue: CorrectVariant[];
  activeCorrectVariant: CorrectVariant;
  reactionMessage: string | null;
  reactionKey: number;
  consecutiveCorrect: number;
  consecutiveErrors: number;
  hasSeenIntro: boolean;
  userLevel: UserLevel;
  theme: FluviTheme;
  isVoiceActive: boolean;
  voiceAmplitude: number;  // 0–1, real-time
}

export interface FluviAction {
  type:
    | 'TRIGGER_CORRECT'
    | 'TRIGGER_INCORRECT'
    | 'TRIGGER_PRONUNCIATION_SUCCESS'
    | 'TRIGGER_GRAMMAR_SUCCESS'
    | 'TRIGGER_WARNING'
    | 'TRIGGER_CELEBRATION'
    | 'START_SPEAKING'
    | 'STOP_SPEAKING'
    | 'START_THINKING'
    | 'STOP_THINKING'
    | 'SET_VOICE_AMPLITUDE'
    | 'COMPLETE_INTRO'
    | 'SET_LEVEL'
    | 'RESET_TO_IDLE';
  payload?: unknown;
}

export interface SessionMetrics {
  totalCorrect: number;
  totalIncorrect: number;
  consecutiveCorrect: number;
  consecutiveErrors: number;
  improvementDelta: number;  // positive = improving, negative = declining
  lastActionTimestamp: number;
}

/**
 * FeedbackResult is the structured data shape that FluviFeedbackPanel
 * consumes. It maps from the app's existing FeedbackPayload fields.
 */
export interface FeedbackResult {
  fluency_score: number;           // 0.0–10.0
  confidence_level: 'Low' | 'Medium' | 'High';
  tone_assessment: {
    label: string;
    appropriate: boolean;
    explanation: string;
  };
  strengths: string[];
  suggestions: string[];
  grammar_corrections: {
    original: string;
    corrected: string;
    explanation: string;
  }[];
  vocabulary_suggestions: {
    word: string;
    alternatives: string[];
    definition: string;
  }[];
  simple_version: string;
  advanced_version: string;
  encouragement: string;
  fluvi_note?: string;
}
