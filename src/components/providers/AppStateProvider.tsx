"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { STORAGE_KEY, WARNINGS_KEY } from "@/lib/constants";
import { getAppStateStorageKey } from "@/lib/assessment-state";
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
} from "@/types";

const defaultPreferences: AppPreferences = {
  listeningEnabled: true,
  playbackSpeed: "normal",
  preferredInputMode: "text",
};

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
};

const STORAGE_VERSION = 2;
const MAX_SESSIONS = 30;
const MAX_CONVERSATION_MESSAGES = 80;

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

function trimMessages(messages: Message[]) {
  return messages.slice(-MAX_CONVERSATION_MESSAGES);
}

function createInitialState(userId: string | null = null): AppState {
  return {
    ...initialState,
    userId,
    preferences: { ...defaultPreferences },
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
  resetDemo: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children, userId = null }: { children: React.ReactNode; userId?: string | null }) {
  const storageKey = useMemo(() => getAppStateStorageKey(userId), [userId]);
  const [state, setState] = useState<AppState>(() => createInitialState(userId));
  const [hydratedStorageKey, setHydratedStorageKey] = useState<string | null>(null);
  const hydrated = hydratedStorageKey === storageKey;

  const persistState = useCallback((nextState: AppState) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(toPersistedState(nextState)));
    } catch (error) {
      console.warn("Unable to persist Fluentia state.", error);
    }
  }, [storageKey]);

  useEffect(() => {
    let cancelled = false;
    let nextState: AppState = createInitialState(userId);
    try {
      const stored = window.localStorage.getItem(storageKey) ?? (!userId ? window.localStorage.getItem(STORAGE_KEY) : null);
      if (stored) {
        nextState = normalizeStoredState(JSON.parse(stored), userId);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }

    window.setTimeout(() => {
      if (cancelled) return;
      flushSync(() => setState(nextState));
      setHydratedStorageKey(storageKey);
    }, 0);

    return () => {
      cancelled = true;
    };
  }, [storageKey, userId]);

  useEffect(() => {
    if (!hydrated) return;
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
      resetDemo: () => {
        window.localStorage.removeItem(storageKey);
        if (!userId) window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(WARNINGS_KEY);
        const nextState = createInitialState(userId);
        persistState(nextState);
        setState(nextState);
      },
    }),
    [hydrated, patch, persistState, state, storageKey, updatePreferences, userId],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used within AppStateProvider");
  return context;
}
