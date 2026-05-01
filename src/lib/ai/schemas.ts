import { z } from "zod";

export const LevelSchema = z.enum(["beginner", "intermediate", "advanced"]);
export const ModeSchema = z.enum(["formal", "casual"]);
export const ConversationKindSchema = z.enum(["scenario", "free-chat", "pronunciation"]);
export const PlaybackSpeedSchema = z.enum(["slow", "normal", "fast"]);
export const PreferredInputModeSchema = z.enum(["text", "voice"]);

export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "ai", "system"]),
  content: z.string().min(1),
  createdAt: z.string(),
});

export const ModerationRequestSchema = z.object({
  text: z.string(),
});

export const ModerationResponseSchema = z.object({
  safe: z.boolean(),
  category: z.string().optional(),
  warning: z.string().optional(),
});

export const AssessmentAnswerSchema = z.object({
  questionId: z.string(),
  value: z.string(),
});

export const AssessmentRequestSchema = z.object({
  answers: z.array(AssessmentAnswerSchema).min(1),
});

export const AssessmentScoresSchema = z.object({
  grammar: z.number().min(0).max(2),
  vocabulary: z.number().min(0).max(2),
  fluency: z.number().min(0).max(2),
  pronunciation: z.number().min(0).max(2),
  composition: z.number().min(0).max(2),
  total: z.number().min(0).max(10),
});

export const AssessmentResponseSchema = z.object({
  level: LevelSchema,
  scores: AssessmentScoresSchema,
});

export const FeedbackPayloadSchema = z.object({
  aiReply: z.string().min(1),
  quickTip: z.string().min(1),
  fluencyScore: z.number().min(0).max(10),
  confidenceLevel: z.enum(["low", "medium", "high"]),
  confidencePercent: z.number().min(0).max(100),
  toneLabel: z.string().min(1),
  strengths: z.array(z.string().min(1)).min(2),
  improvements: z.array(z.string().min(1)).min(2),
  grammarCorrections: z
    .array(
      z.object({
        original: z.string().min(1),
        corrected: z.string().min(1),
        explanation: z.string().min(1),
      }),
    )
    .min(1),
  pronunciationNotes: z.array(z.string().min(1)).min(1),
  vocabularySuggestions: z
    .array(
      z.object({
        word: z.string().min(1),
        alternative: z.string().min(1),
        context: z.string().min(1),
      }),
    )
    .min(2),
  simpleRewrite: z.string().min(1),
  advancedRewrite: z.string().min(1),
  encouragementMessage: z.string().min(1),
  safetyStatus: z.enum(["safe", "blocked"]),
});

export const AppPreferencesSchema = z.object({
  listeningEnabled: z.boolean(),
  playbackSpeed: PlaybackSpeedSchema,
  preferredInputMode: PreferredInputModeSchema,
});

export const ConversationRequestSchema = z.object({
  message: z.string().min(1).max(1200),
  kind: ConversationKindSchema,
  scenarioId: z.string().optional().nullable(),
  exerciseId: z.string().optional().nullable(),
  mode: ModeSchema.nullable(),
  level: LevelSchema,
  history: z.array(MessageSchema),
  requestWrapUp: z.boolean().optional(),
});

export const ConversationResponseSchema = z.object({
  safe: z.boolean(),
  aiMessage: MessageSchema.optional(),
  feedback: FeedbackPayloadSchema.optional(),
  warning: z.string().optional(),
  category: z.string().optional(),
  provider: z.enum(["live", "simulated"]).optional(),
});

export type ConversationRequestInput = z.infer<typeof ConversationRequestSchema>;
export type ConversationResponseInput = z.infer<typeof ConversationResponseSchema>;
