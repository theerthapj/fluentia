'use client';

// STEP 5: Fluvi Global Context Provider
// All Fluvi state lives here. Do not merge with AppStateProvider.

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { FluviState, FluviAction, UserLevel, CorrectVariant } from '@/types/fluvi.types';
import { getFluviTheme } from '@/components/fluvi/FluviTheme';
import { buildVariantQueue, getNextVariant } from '@/components/fluvi/FluviAnimations';

const FLUVI_STORAGE_KEY = 'fluvi_state';

const INITIAL_STATE: FluviState = {
  mode: 'idle',
  correctVariantQueue: buildVariantQueue(),
  consecutiveCorrect: 0,
  consecutiveErrors: 0,
  hasSeenIntro: true,
  userLevel: 'beginner',
  theme: getFluviTheme('beginner'),
  isVoiceActive: false,
  voiceAmplitude: 0,
};

function fluviReducer(state: FluviState, action: FluviAction): FluviState {
  switch (action.type) {
    case 'TRIGGER_CORRECT': {
      const newConsecutive = state.consecutiveCorrect + 1;
      const isDanceMoment = newConsecutive > 0 && newConsecutive % 5 === 0;
      const variant: CorrectVariant = isDanceMoment
        ? 'dance_moment'
        : getNextVariant(state.correctVariantQueue);
      return {
        ...state,
        mode: 'correct_feedback',
        consecutiveCorrect: newConsecutive,
        consecutiveErrors: 0,
        correctVariantQueue: buildVariantQueue(variant),
      };
    }

    case 'TRIGGER_INCORRECT': {
      const newErrors = state.consecutiveErrors + 1;
      return {
        ...state,
        mode: 'incorrect_feedback',
        consecutiveErrors: newErrors,
        consecutiveCorrect: 0,
      };
    }

    case 'TRIGGER_WARNING':
      return { ...state, mode: 'warning' };

    case 'TRIGGER_CELEBRATION':
      return { ...state, mode: 'celebration' };

    case 'START_SPEAKING':
      return { ...state, mode: 'speaking', isVoiceActive: true };

    case 'STOP_SPEAKING':
      return { ...state, mode: 'idle', isVoiceActive: false, voiceAmplitude: 0 };

    case 'START_THINKING':
      return { ...state, mode: 'thinking' };

    case 'STOP_THINKING':
      return { ...state, mode: 'idle' };

    case 'SET_VOICE_AMPLITUDE':
      return { ...state, voiceAmplitude: action.payload as number };

    case 'COMPLETE_INTRO':
      return { ...state, hasSeenIntro: true };

    case 'SET_LEVEL': {
      const level = action.payload as UserLevel;
      return { ...state, userLevel: level, theme: getFluviTheme(level) };
    }

    case 'RESET_TO_IDLE':
      return { ...state, mode: 'idle' };

    default:
      return state;
  }
}

interface FluviContextValue {
  state: FluviState;
  dispatch: React.Dispatch<FluviAction>;
  triggerCorrect: () => void;
  triggerIncorrect: () => void;
  triggerWarning: () => void;
  triggerCelebration: () => void;
  startSpeaking: () => void;
  stopSpeaking: () => void;
  startThinking: () => void;
  stopThinking: () => void;
  setVoiceAmplitude: (amp: number) => void;
}

const FluviContext = createContext<FluviContextValue | null>(null);

export function FluviProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    fluviReducer,
    INITIAL_STATE,
    (init): FluviState => {
      // Server-side render guard
      if (typeof window === 'undefined') return init;
      try {
        const saved = localStorage.getItem(FLUVI_STORAGE_KEY);
        if (!saved) return init;
        const parsed = JSON.parse(saved) as Partial<FluviState>;
        const level: UserLevel = parsed.userLevel ?? 'beginner';
        return {
          ...init,
          hasSeenIntro: true,
          userLevel: level,
          theme: getFluviTheme(level),
        };
      } catch {
        return init;
      }
    },
  );

  // Persist only the fields that should survive page reloads
  useEffect(() => {
    try {
      localStorage.setItem(
        FLUVI_STORAGE_KEY,
        JSON.stringify({ hasSeenIntro: state.hasSeenIntro, userLevel: state.userLevel }),
      );
    } catch {
      // localStorage may not be available; fail silently
    }
  }, [state.hasSeenIntro, state.userLevel]);

  // Auto-reset transient states after their display duration
  useEffect(() => {
    const transientModes = ['correct_feedback', 'warning', 'incorrect_feedback', 'celebration'];
    if (!transientModes.includes(state.mode)) return;

    const duration =
      state.mode === 'correct_feedback' ? 2000
      : state.mode === 'warning' ? 2500
      : state.mode === 'celebration' ? 3000
      : 1800; // incorrect_feedback

    const timer = setTimeout(() => {
      if (state.mode === 'incorrect_feedback') {
        // Brief encouragement posture before full idle
        setTimeout(() => dispatch({ type: 'RESET_TO_IDLE' }), 1000);
      } else {
        dispatch({ type: 'RESET_TO_IDLE' });
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [state.mode]);

  const triggerCorrect = useCallback(() => dispatch({ type: 'TRIGGER_CORRECT' }), []);
  const triggerIncorrect = useCallback(() => dispatch({ type: 'TRIGGER_INCORRECT' }), []);
  const triggerWarning = useCallback(() => dispatch({ type: 'TRIGGER_WARNING' }), []);
  const triggerCelebration = useCallback(() => dispatch({ type: 'TRIGGER_CELEBRATION' }), []);
  const startSpeaking = useCallback(() => dispatch({ type: 'START_SPEAKING' }), []);
  const stopSpeaking = useCallback(() => dispatch({ type: 'STOP_SPEAKING' }), []);
  const startThinking = useCallback(() => dispatch({ type: 'START_THINKING' }), []);
  const stopThinking = useCallback(() => dispatch({ type: 'STOP_THINKING' }), []);
  const setVoiceAmplitude = useCallback(
    (amp: number) => dispatch({ type: 'SET_VOICE_AMPLITUDE', payload: amp }),
    [],
  );

  return (
    <FluviContext.Provider
      value={{
        state,
        dispatch,
        triggerCorrect,
        triggerIncorrect,
        triggerWarning,
        triggerCelebration,
        startSpeaking,
        stopSpeaking,
        startThinking,
        stopThinking,
        setVoiceAmplitude,
      }}
    >
      {children}
    </FluviContext.Provider>
  );
}

export function useFluvi() {
  const ctx = useContext(FluviContext);
  if (!ctx) throw new Error('useFluvi must be used within FluviProvider');
  return ctx;
}
