"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { useFluvi } from "@/context/FluviContext";
import type { Level } from "@/types";
import type { UserLevel } from "@/types/fluvi.types";

function toFluviLevel(level: Level | null): UserLevel {
  if (level === "advanced" || level === "intermediate") return level;
  return "beginner";
}

function clampEnergy(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function FluviAppBridge() {
  const { state: appState, hydrated } = useAppState();
  const { dispatch, triggerCelebration, triggerWarning } = useFluvi();
  const previousLatestSessionId = useRef<string | null>(null);
  const previousWarningCount = useRef<number | null>(null);

  const fluviLevel = toFluviLevel(appState.level ?? null);
  const energy = useMemo(() => {
    const sessions = appState.sessions ?? [];
    if (!sessions.length) return 0;
    const recent = sessions.slice(0, 5);
    const averageScore = recent.reduce((sum, session) => sum + session.fluencyScore, 0) / recent.length;
    return clampEnergy((averageScore - 4) / 6);
  }, [appState.sessions]);

  useEffect(() => {
    if (!hydrated) return;
    dispatch({ type: "SET_LEVEL", payload: fluviLevel });
  }, [dispatch, fluviLevel, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    dispatch({ type: "SET_ENERGY", payload: energy });
  }, [dispatch, energy, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const latest = appState.sessions?.[0];
    if (!latest) return;

    if (previousLatestSessionId.current === null) {
      previousLatestSessionId.current = latest.id;
      return;
    }
    if (previousLatestSessionId.current === latest.id) return;

    const previous = appState.sessions?.[1];
    previousLatestSessionId.current = latest.id;
    if (previous && latest.fluencyScore > previous.fluencyScore) {
      triggerCelebration();
    }
  }, [appState.sessions, hydrated, triggerCelebration]);

  useEffect(() => {
    if (!hydrated) return;
    if (previousWarningCount.current === null) {
      previousWarningCount.current = appState.warningCount;
      return;
    }
    if (appState.warningCount > previousWarningCount.current) {
      triggerWarning();
    }
    previousWarningCount.current = appState.warningCount;
  }, [appState.warningCount, hydrated, triggerWarning]);

  return null;
}
