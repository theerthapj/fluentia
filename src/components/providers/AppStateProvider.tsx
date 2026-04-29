"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEY, WARNINGS_KEY } from "@/lib/constants";
import type { AppState, AssessmentScores, FeedbackPayload, Level, Message, Mode, Scenario } from "@/types";

const initialState: AppState = {
  level: null,
  assessmentCompleted: false,
  assessmentScores: null,
  selectedMode: null,
  selectedScenario: null,
  conversationHistory: [],
  lastFeedback: null,
  warningCount: 0,
  cooldownUntil: null,
};

interface AppStateContextValue {
  state: AppState;
  hydrated: boolean;
  setAssessment: (level: Level, scores: AssessmentScores) => void;
  setMode: (mode: Mode) => void;
  setScenario: (scenario: Scenario) => void;
  setConversationHistory: (messages: Message[]) => void;
  setLastFeedback: (feedback: FeedbackPayload | null) => void;
  setWarnings: (warningCount: number, cooldownUntil: number | null) => void;
  resetDemo: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setState({ ...initialState, ...(JSON.parse(stored) as Partial<AppState>) });
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const patch = useCallback((next: Partial<AppState>) => setState((current) => ({ ...current, ...next })), []);

  const value = useMemo<AppStateContextValue>(
    () => ({
      state,
      hydrated,
      setAssessment: (level, scores) => patch({ level, assessmentScores: scores, assessmentCompleted: true }),
      setMode: (selectedMode) => patch({ selectedMode }),
      setScenario: (selectedScenario) => patch({ selectedScenario }),
      setConversationHistory: (conversationHistory) => patch({ conversationHistory }),
      setLastFeedback: (lastFeedback) => patch({ lastFeedback }),
      setWarnings: (warningCount, cooldownUntil) => patch({ warningCount, cooldownUntil }),
      resetDemo: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(WARNINGS_KEY);
        setState(initialState);
      },
    }),
    [hydrated, patch, state],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used within AppStateProvider");
  return context;
}
