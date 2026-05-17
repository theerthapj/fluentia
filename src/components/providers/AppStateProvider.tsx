"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { STORAGE_KEY, WARNINGS_KEY } from "@/lib/constants";
import { getAppStateStorageKey, getAssessmentProgressStorageKey } from "@/lib/assessment-state";
import type {
  AppPreferences,
  AppState,
  AssessmentScores,
  ConversationKind,
  FeedbackPayload,
  Level,
  Message,
  Mode,
  PlaybackSpeed,
  PreferredInputMode,
  Scenario,
  SessionRecord,
  SkillPracticeAttempt,
  SkillPracticeMode,
  SkillPracticeProgress,
} from "@/types";

const defaultPreferences: AppPreferences = {
  listeningEnabled: true,
  playbackSpeed: "normal",
  preferredInputMode: "text",
};

const skillPracticeModes: SkillPracticeMode[] = ["pronunciation", "vocabulary", "grammar", "sentence-formation"];

function createSkillProgress(skill: SkillPracticeMode, adaptiveLevel: Level = "beginner"): SkillPracticeProgress {
  return {
    skill,
    attempts: 0,
    averageScore: 0,
    bestScore: 0,
    streak: 0,
    adaptiveLevel,
    weakAreas: [],
    revisionQueue: [],
    lastPracticedAt: null,
  };
}

function createDefaultSkillProgress(level: Level = "beginner"): Record<SkillPracticeMode, SkillPracticeProgress> {
  return skillPracticeModes.reduce(
    (progress, skill) => {
      progress[skill] = createSkillProgress(skill, level);
      return progress;
    },
    {} as Record<SkillPracticeMode, SkillPracticeProgress>,
  );
}

const initialState: AppState = {
  userId: null,
  level: null,
  assessmentCompleted: false,
  assessmentCompletedAt: null,
  assessmentSource: null,
  assessmentScores: null,
  selectedMode: null,
  selectedScenario: null,
  selectedExerciseId: null,
  activeConversationKind: "scenario",
  conversationHistory: [],
  lastFeedback: null,
  sessions: [],
  warningCount: 0,
  cooldownUntil: null,
  preferences: defaultPreferences,
  skillProgress: createDefaultSkillProgress(),
};

const STORAGE_VERSION = 3;
const MAX_SESSIONS = 30;
const MAX_CONVERSATION_MESSAGES = 80;
const REMOTE_PROGRESS_ENDPOINT = "/api/progress";

type PersistedAppState = {
  version: number;
  state: Partial<AppState>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}

function isMessage(value: unknown): value is Message {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    (value.role === "user" || value.role === "ai" || value.role === "system") &&
    typeof value.content === "string" &&
    typeof value.createdAt === "string"
  );
}

function isSession(value: unknown): value is SessionRecord {
  if (!isRecord(value)) return false;
  return typeof value.id === "string" && typeof value.scenarioTitle === "string" && Array.isArray(value.messages);
}

function isLevel(value: unknown): value is Level {
  return value === "beginner" || value === "intermediate" || value === "advanced";
}

function isSkillPracticeMode(value: unknown): value is SkillPracticeMode {
  return value === "pronunciation" || value === "vocabulary" || value === "grammar" || value === "sentence-formation";
}

function clampScore(value: unknown) {
  const score = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(100, score));
}

function normalizeStringList(value: unknown, limit: number) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).slice(0, limit) : [];
}

function normalizeSkillProgress(value: unknown, defaultLevel: Level): Record<SkillPracticeMode, SkillPracticeProgress> {
  const source = isRecord(value) ? value : {};
  return skillPracticeModes.reduce(
    (progress, skill) => {
      const stored = source[skill];
      if (!isRecord(stored) || !isSkillPracticeMode(stored.skill)) {
        progress[skill] = createSkillProgress(skill, defaultLevel);
        return progress;
      }

      const attempts = typeof stored.attempts === "number" && Number.isFinite(stored.attempts) ? Math.max(0, Math.floor(stored.attempts)) : 0;
      progress[skill] = {
        skill,
        attempts,
        averageScore: clampScore(stored.averageScore),
        bestScore: clampScore(stored.bestScore),
        streak: typeof stored.streak === "number" && Number.isFinite(stored.streak) ? Math.max(0, Math.floor(stored.streak)) : 0,
        adaptiveLevel: isLevel(stored.adaptiveLevel) ? stored.adaptiveLevel : defaultLevel,
        weakAreas: normalizeStringList(stored.weakAreas, 6),
        revisionQueue: normalizeStringList(stored.revisionQueue, 8),
        lastPracticedAt: typeof stored.lastPracticedAt === "string" ? stored.lastPracticedAt : null,
      };
      return progress;
    },
    {} as Record<SkillPracticeMode, SkillPracticeProgress>,
  );
}

function nextAdaptiveLevel(progress: SkillPracticeProgress, nextAverage: number, score: number): Level {
  if (progress.attempts >= 2 && (nextAverage >= 84 || score >= 92)) return "advanced";
  if (progress.attempts >= 1 && (nextAverage >= 66 || score >= 76)) return "intermediate";
  if (score < 48) return "beginner";
  return progress.adaptiveLevel;
}

function uniqueLimited(items: string[], limit: number) {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const item of items) {
    const cleaned = item.trim();
    if (!cleaned || seen.has(cleaned.toLowerCase())) continue;
    seen.add(cleaned.toLowerCase());
    output.push(cleaned);
    if (output.length >= limit) break;
  }
  return output;
}

function alignEmptySkillProgressToLevel(progress: Record<SkillPracticeMode, SkillPracticeProgress>, level: Level) {
  return skillPracticeModes.reduce(
    (next, skill) => {
      const current = progress[skill] ?? createSkillProgress(skill, level);
      next[skill] = current.attempts ? current : { ...current, adaptiveLevel: level };
      return next;
    },
    {} as Record<SkillPracticeMode, SkillPracticeProgress>,
  );
}

function trimMessages(messages: Message[]) {
  return messages.slice(-MAX_CONVERSATION_MESSAGES);
}

function createInitialState(userId: string | null = null): AppState {
  return {
    ...initialState,
    userId,
    preferences: { ...defaultPreferences },
    skillProgress: createDefaultSkillProgress(),
  };
}

function normalizeStoredState(value: unknown, userId: string | null = null): AppState {
  const source = isRecord(value) && "version" in value && isRecord((value as PersistedAppState).state)
    ? (value as PersistedAppState).state
    : isRecord(value)
      ? (value as Partial<AppState>)
      : {};

  const preferences = isRecord(source.preferences)
    ? {
        ...defaultPreferences,
        ...source.preferences,
      }
      : defaultPreferences;
  const savedLevel = isLevel(source.level) ? source.level : null;
  const assessmentCompleted = source.assessmentCompleted === true || Boolean(savedLevel);
  const assessmentCompletedAt = typeof source.assessmentCompletedAt === "string" ? source.assessmentCompletedAt : null;
  const assessmentSource =
    source.assessmentSource === "assessment" || source.assessmentSource === "manual"
      ? source.assessmentSource
      : assessmentCompleted
        ? source.assessmentScores
          ? "assessment"
          : "manual"
        : null;

  return {
    ...createInitialState(userId),
    ...source,
    userId,
    level: savedLevel,
    assessmentCompleted,
    assessmentCompletedAt,
    assessmentSource,
    conversationHistory: Array.isArray(source.conversationHistory) ? trimMessages(source.conversationHistory.filter(isMessage)) : [],
    sessions: Array.isArray(source.sessions) ? source.sessions.filter(isSession).slice(0, MAX_SESSIONS) : [],
    preferences: {
      listeningEnabled: typeof preferences.listeningEnabled === "boolean" ? preferences.listeningEnabled : defaultPreferences.listeningEnabled,
      playbackSpeed: preferences.playbackSpeed === "slow" || preferences.playbackSpeed === "fast" ? preferences.playbackSpeed : "normal",
      preferredInputMode: preferences.preferredInputMode === "voice" ? "voice" : "text",
    },
    skillProgress: normalizeSkillProgress(source.skillProgress, savedLevel ?? "beginner"),
  };
}

function toPersistedState(state: AppState): PersistedAppState {
  return {
    version: STORAGE_VERSION,
    state: {
      ...state,
      conversationHistory: trimMessages(state.conversationHistory),
      sessions: state.sessions.slice(0, MAX_SESSIONS),
    },
  };
}

function shouldUseRemoteSync(userId: string | null) {
  return Boolean(userId && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

interface AppStateContextValue {
  state: AppState;
  hydrated: boolean;
  setAssessment: (level: Level, scores: AssessmentScores) => void;
  setPreferredLevel: (level: Level) => void;
  setMode: (mode: Mode) => void;
  setScenario: (scenario: Scenario | null) => void;
  setExercise: (exerciseId: string | null) => void;
  setConversationKind: (kind: ConversationKind) => void;
  setConversationHistory: (messages: Message[]) => void;
  setLastFeedback: (feedback: FeedbackPayload | null) => void;
  addSession: (session: SessionRecord) => boolean;
  restoreSession: (session: SessionRecord) => void;
  setWarnings: (warningCount: number, cooldownUntil: number | null) => void;
  updatePreferences: (next: Partial<AppPreferences>) => void;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
  setPreferredInputMode: (mode: PreferredInputMode) => void;
  updateSkillProgress: (skill: SkillPracticeMode, attempt: SkillPracticeAttempt) => void;
  resetDemo: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children, userId = null }: { children: React.ReactNode; userId?: string | null }) {
  const storageKey = useMemo(() => getAppStateStorageKey(userId), [userId]);
  const assessmentProgressKey = useMemo(() => getAssessmentProgressStorageKey(userId), [userId]);
  const [state, setState] = useState<AppState>(() => createInitialState(userId));
  const [hydratedStorageKey, setHydratedStorageKey] = useState<string | null>(null);
  const skipNextLocalPersistRef = useRef(false);
  const hydrated = hydratedStorageKey === storageKey;
  const remoteSyncEnabled = shouldUseRemoteSync(userId);

  const persistRemoteState = useCallback((nextState: AppState) => {
    if (!remoteSyncEnabled) return;
    const payload = JSON.stringify(toPersistedState(nextState));
    window
      .fetch(REMOTE_PROGRESS_ENDPOINT, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: payload.length < 60_000,
      })
      .catch((error) => {
        console.warn("Unable to sync Fluentia progress to the account backend.", error);
      });
  }, [remoteSyncEnabled]);

  const persistState = useCallback((nextState: AppState) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(toPersistedState(nextState)));
    } catch (error) {
      console.warn("Unable to persist Fluentia state.", error);
    }
    persistRemoteState(nextState);
  }, [persistRemoteState, storageKey]);

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      let nextState: AppState = createInitialState(userId);
      try {
        const stored = window.localStorage.getItem(storageKey) ?? (!userId ? window.localStorage.getItem(STORAGE_KEY) : null);
        if (stored) {
          nextState = normalizeStoredState(JSON.parse(stored), userId);
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }

      if (remoteSyncEnabled) {
        try {
          const response = await window.fetch(REMOTE_PROGRESS_ENDPOINT, { cache: "no-store" });
          if (response.ok) {
            const remote = (await response.json()) as { state?: unknown };
            if (remote.state) nextState = normalizeStoredState(remote.state, userId);
          }
        } catch (error) {
          console.warn("Using local Fluentia progress because account sync is unavailable.", error);
        }
      }

      window.setTimeout(() => {
        if (cancelled) return;
        flushSync(() => setState(nextState));
        setHydratedStorageKey(storageKey);
      }, 0);
    };

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [remoteSyncEnabled, storageKey, userId]);

  useEffect(() => {
    if (!hydrated) return;
    if (skipNextLocalPersistRef.current) {
      skipNextLocalPersistRef.current = false;
      return;
    }
    persistState(state);
  }, [hydrated, persistState, state]);

  const patch = useCallback(
    (next: Partial<AppState>) =>
      setState((current) => {
        const keys = Object.keys(next) as Array<keyof AppState>;
        const hasChanges = keys.some((key) => current[key] !== next[key]);
        if (!hasChanges) return current;
        const nextState = { ...current, ...next };
        persistState(nextState);
        return nextState;
      }),
    [persistState],
  );

  const updatePreferences = useCallback(
    (next: Partial<AppPreferences>) =>
      setState((current) => {
        const keys = Object.keys(next) as Array<keyof AppPreferences>;
        const hasChanges = keys.some((key) => current.preferences[key] !== next[key]);
        if (!hasChanges) return current;
        const nextState = {
          ...current,
          preferences: { ...current.preferences, ...next },
        };
        persistState(nextState);
        return nextState;
      }),
    [persistState],
  );

  const value = useMemo<AppStateContextValue>(
    () => ({
      state,
      hydrated,
      setAssessment: (level, scores) =>
        patch({
          level,
          assessmentScores: scores,
          assessmentCompleted: true,
          assessmentCompletedAt: new Date().toISOString(),
          assessmentSource: "assessment",
          skillProgress: alignEmptySkillProgressToLevel(state.skillProgress, level),
        }),
      setPreferredLevel: (level) =>
        patch({
          level,
          assessmentScores: null,
          assessmentCompleted: true,
          assessmentCompletedAt: new Date().toISOString(),
          assessmentSource: "manual",
          selectedScenario: null,
          selectedExerciseId: null,
          skillProgress: alignEmptySkillProgressToLevel(state.skillProgress, level),
        }),
      setMode: (selectedMode) => patch({ selectedMode }),
      setScenario: (selectedScenario) => patch({ selectedScenario }),
      setExercise: (selectedExerciseId) => patch({ selectedExerciseId }),
      setConversationKind: (activeConversationKind) => patch({ activeConversationKind }),
      setConversationHistory: (conversationHistory) => patch({ conversationHistory: trimMessages(conversationHistory) }),
      setLastFeedback: (lastFeedback) => patch({ lastFeedback }),
      addSession: (session) => {
        let added = false;
        setState((current) => {
          if (current.sessions.some((item) => item.id === session.id)) return current;
          added = true;
          const nextState = { ...current, sessions: [session, ...current.sessions].slice(0, MAX_SESSIONS) };
          persistState(nextState);
          return nextState;
        });
        return added;
      },
      restoreSession: (session) =>
        patch({
          activeConversationKind: session.kind,
          lastFeedback: session.feedback,
          conversationHistory: session.messages,
        }),
      setWarnings: (warningCount, cooldownUntil) => patch({ warningCount, cooldownUntil }),
      updatePreferences,
      setPlaybackSpeed: (playbackSpeed) => updatePreferences({ playbackSpeed }),
      setPreferredInputMode: (preferredInputMode) => updatePreferences({ preferredInputMode }),
      updateSkillProgress: (skill, attempt) => {
        setState((current) => {
          const currentProgress = current.skillProgress[skill] ?? createSkillProgress(skill, current.level ?? "beginner");
          const score = clampScore(attempt.score);
          const attempts = currentProgress.attempts + 1;
          const averageScore = ((currentProgress.averageScore * currentProgress.attempts) + score) / attempts;
          const nextProgress: SkillPracticeProgress = {
            ...currentProgress,
            attempts,
            averageScore,
            bestScore: Math.max(currentProgress.bestScore, score),
            streak: score >= 72 ? currentProgress.streak + 1 : 0,
            adaptiveLevel: nextAdaptiveLevel(currentProgress, averageScore, score),
            weakAreas: uniqueLimited([...attempt.weakAreas, ...currentProgress.weakAreas], 6),
            revisionQueue: uniqueLimited([...attempt.revisionItems, ...attempt.weakAreas, ...currentProgress.revisionQueue], 8),
            lastPracticedAt: new Date().toISOString(),
          };
          const nextState = {
            ...current,
            skillProgress: {
              ...current.skillProgress,
              [skill]: nextProgress,
            },
          };
          persistState(nextState);
          return nextState;
        });
      },
      resetDemo: () => {
        window.localStorage.removeItem(storageKey);
        window.localStorage.removeItem(assessmentProgressKey);
        if (!userId) window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(WARNINGS_KEY);
        const nextState = createInitialState(userId);
        skipNextLocalPersistRef.current = true;
        persistRemoteState(nextState);
        setState(nextState);
      },
    }),
    [assessmentProgressKey, hydrated, patch, persistRemoteState, persistState, state, storageKey, updatePreferences, userId],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used within AppStateProvider");
  return context;
}
