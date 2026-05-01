"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEY, WARNINGS_KEY } from "@/lib/constants";
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
  level: null,
  assessmentCompleted: false,
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

interface AppStateContextValue {
  state: AppState;
  hydrated: boolean;
  setAssessment: (level: Level, scores: AssessmentScores) => void;
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

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AppState>;
        setState({
          ...initialState,
          ...parsed,
          preferences: { ...defaultPreferences, ...parsed.preferences },
        });
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const patch = useCallback(
    (next: Partial<AppState>) =>
      setState((current) => {
        const keys = Object.keys(next) as Array<keyof AppState>;
        const hasChanges = keys.some((key) => current[key] !== next[key]);
        return hasChanges ? { ...current, ...next } : current;
      }),
    [],
  );

  const updatePreferences = useCallback(
    (next: Partial<AppPreferences>) =>
      setState((current) => {
        const keys = Object.keys(next) as Array<keyof AppPreferences>;
        const hasChanges = keys.some((key) => current.preferences[key] !== next[key]);
        return hasChanges
          ? {
              ...current,
              preferences: { ...current.preferences, ...next },
            }
          : current;
      }),
    [],
  );

  const value = useMemo<AppStateContextValue>(
    () => ({
      state,
      hydrated,
      setAssessment: (level, scores) => patch({ level, assessmentScores: scores, assessmentCompleted: true }),
      setMode: (selectedMode) => patch({ selectedMode }),
      setScenario: (selectedScenario) => patch({ selectedScenario }),
      setExercise: (selectedExerciseId) => patch({ selectedExerciseId }),
      setConversationKind: (activeConversationKind) => patch({ activeConversationKind }),
      setConversationHistory: (conversationHistory) => patch({ conversationHistory }),
      setLastFeedback: (lastFeedback) => patch({ lastFeedback }),
      addSession: (session) => {
        let added = false;
        setState((current) => {
          if (current.sessions.some((item) => item.id === session.id)) return current;
          added = true;
          return { ...current, sessions: [session, ...current.sessions].slice(0, 30) };
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
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(WARNINGS_KEY);
        setState(initialState);
      },
    }),
    [hydrated, patch, state, updatePreferences],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used within AppStateProvider");
  return context;
}
