'use client';

// STEP 5: Fluvi Global Context Provider
// All Fluvi state lives here. Do not merge with AppStateProvider.

import React, { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import type { FluviState, FluviAction, UserLevel, CorrectVariant } from '@/types/fluvi.types';
import { getFluviTheme } from '@/components/fluvi/FluviTheme';
import { buildVariantQueue, getNextVariant } from '@/components/fluvi/FluviAnimations';
import {
  getRandomMessage,
  GRAMMAR_SUCCESS_MESSAGES,
  PRONUNCIATION_SUCCESS_MESSAGES,
  THINKING_MESSAGES,
  TRY_AGAIN_MESSAGES,
  WARNING_MESSAGES,
} from '@/components/fluvi/FluviMessages';

export const FLUVI_STORAGE_KEY = 'fluvi_state';

const INITIAL_STATE: FluviState = {
  mode: 'idle',
  correctVariantQueue: buildVariantQueue(),
  activeCorrectVariant: 'feather_spread',
  reactionMessage: null,
  reactionKey: 0,
  consecutiveCorrect: 0,
  consecutiveErrors: 0,
  hasSeenIntro: false,
  introReplayKey: 0,
  userLevel: 'beginner',
  theme: getFluviTheme('beginner'),
  energy: 0,
  isVoiceActive: false,
  voiceAmplitude: 0,
};

function fluviReducer(state: FluviState, action: FluviAction): FluviState {
  switch (action.type) {
    case 'TRIGGER_CORRECT': {
      const payload = action.payload as { message?: string } | undefined;
      const newConsecutive = state.consecutiveCorrect + 1;
      const isDanceMoment = newConsecutive > 0 && newConsecutive % 5 === 0;
      const variant: CorrectVariant = isDanceMoment
        ? 'dance_moment'
        : getNextVariant(state.correctVariantQueue);
      return {
        ...state,
        mode: 'correct_feedback',
        activeCorrectVariant: variant,
        reactionMessage: payload?.message ?? null,
        reactionKey: state.reactionKey + 1,
        consecutiveCorrect: newConsecutive,
        consecutiveErrors: 0,
        correctVariantQueue: buildVariantQueue(variant),
      };
    }

    case 'TRIGGER_INCORRECT': {
      const payload = action.payload as { message?: string } | undefined;
      const newErrors = state.consecutiveErrors + 1;
      return {
        ...state,
        mode: 'incorrect_feedback',
        reactionMessage: payload?.message ?? getRandomMessage(TRY_AGAIN_MESSAGES, 'try-again'),
        reactionKey: state.reactionKey + 1,
        consecutiveErrors: newErrors,
        consecutiveCorrect: 0,
      };
    }

    case 'TRIGGER_PRONUNCIATION_SUCCESS':
      return {
        ...state,
        mode: 'pronunciation_success',
        reactionMessage: getRandomMessage(PRONUNCIATION_SUCCESS_MESSAGES, 'pronunciation-success'),
        reactionKey: state.reactionKey + 1,
        consecutiveErrors: 0,
      };

    case 'TRIGGER_GRAMMAR_SUCCESS':
      return {
        ...state,
        mode: 'grammar_success',
        reactionMessage: getRandomMessage(GRAMMAR_SUCCESS_MESSAGES, 'grammar-success'),
        reactionKey: state.reactionKey + 1,
        consecutiveErrors: 0,
      };

    case 'TRIGGER_WARNING':
      return {
        ...state,
        mode: 'warning',
        reactionMessage: getRandomMessage(WARNING_MESSAGES, 'warning'),
        reactionKey: state.reactionKey + 1,
      };

    case 'TRIGGER_CELEBRATION':
      return { ...state, mode: 'celebration', reactionMessage: null, reactionKey: state.reactionKey + 1 };

    case 'START_SPEAKING':
      return { ...state, mode: 'speaking', reactionMessage: null, isVoiceActive: true };

    case 'STOP_SPEAKING':
      return { ...state, mode: 'idle', reactionMessage: null, isVoiceActive: false, voiceAmplitude: 0 };

    case 'START_THINKING':
      return { ...state, mode: 'thinking', reactionMessage: getRandomMessage(THINKING_MESSAGES, 'thinking-bubble') };

    case 'STOP_THINKING':
      return { ...state, mode: 'idle', reactionMessage: null };

    case 'SET_VOICE_AMPLITUDE':
      return { ...state, voiceAmplitude: action.payload as number };

    case 'COMPLETE_INTRO':
      return { ...state, hasSeenIntro: true };

    case 'REPLAY_INTRO':
      return { ...state, hasSeenIntro: false, introReplayKey: state.introReplayKey + 1 };

    case 'HYDRATE_PERSISTED': {
      const payload = action.payload as Partial<Pick<FluviState, 'hasSeenIntro' | 'userLevel' | 'energy'>> | undefined;
      const level = payload?.userLevel ?? state.userLevel;
      const energy = Math.max(0, Math.min(1, Number(payload?.energy) || 0));
      return {
        ...state,
        hasSeenIntro: payload?.hasSeenIntro ?? state.hasSeenIntro,
        userLevel: level,
        energy,
        theme: getFluviTheme(level, energy),
      };
    }

    case 'SET_LEVEL': {
      const level = action.payload as UserLevel;
      return { ...state, userLevel: level, theme: getFluviTheme(level, state.energy) };
    }

    case 'SET_ENERGY': {
      const energy = Math.max(0, Math.min(1, Number(action.payload) || 0));
      return { ...state, energy, theme: getFluviTheme(state.userLevel, energy) };
    }

    case 'RESET_TO_IDLE':
      return { ...state, mode: 'idle', reactionMessage: null };

    case 'RESET_ALL':
      return { ...INITIAL_STATE, introReplayKey: state.introReplayKey + 1 };

    default:
      return state;
  }
}

interface FluviContextValue {
  state: FluviState;
  dispatch: React.Dispatch<FluviAction>;
  triggerCorrect: () => void;
  triggerIncorrect: (message?: string) => void;
  triggerPronunciationSuccess: () => void;
  triggerGrammarSuccess: () => void;
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
  const [state, dispatch] = useReducer(fluviReducer, INITIAL_STATE);
  const [storageHydrated, setStorageHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FLUVI_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FluviState>;
        const userLevel: UserLevel =
          parsed.userLevel === 'advanced' || parsed.userLevel === 'intermediate' ? parsed.userLevel : 'beginner';
        dispatch({
          type: 'HYDRATE_PERSISTED',
          payload: {
            hasSeenIntro: parsed.hasSeenIntro,
            userLevel,
            energy: typeof parsed.energy === 'number' ? parsed.energy : INITIAL_STATE.energy,
          },
        });
      }
    } catch {
      localStorage.removeItem(FLUVI_STORAGE_KEY);
    } finally {
      setStorageHydrated(true);
    }
  }, []);

  // Persist only the fields that should survive page reloads
  useEffect(() => {
    if (!storageHydrated) return;
    try {
      localStorage.setItem(
        FLUVI_STORAGE_KEY,
        JSON.stringify({ hasSeenIntro: state.hasSeenIntro, userLevel: state.userLevel, energy: state.energy }),
      );
    } catch {
      // localStorage may not be available; fail silently
    }
  }, [state.energy, state.hasSeenIntro, state.userLevel, storageHydrated]);

  // Auto-reset transient states after their display duration
  useEffect(() => {
    const transientModes = [
      'correct_feedback',
      'warning',
      'incorrect_feedback',
      'celebration',
      'pronunciation_success',
      'grammar_success',
    ];
    if (!transientModes.includes(state.mode)) return;

    const duration =
      state.mode === 'correct_feedback' ? 1800
      : state.mode === 'warning' ? 2500
      : state.mode === 'celebration' ? 2400
      : state.mode === 'pronunciation_success' ? 1600
      : state.mode === 'grammar_success' ? 1600
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
  }, [state.mode, state.reactionKey]);

  const triggerCorrect = useCallback(() => dispatch({ type: 'TRIGGER_CORRECT' }), []);
  const triggerIncorrect = useCallback(
    (message?: string) => dispatch({ type: 'TRIGGER_INCORRECT', payload: { message } }),
    [],
  );
  const triggerPronunciationSuccess = useCallback(
    () => dispatch({ type: 'TRIGGER_PRONUNCIATION_SUCCESS' }),
    [],
  );
  const triggerGrammarSuccess = useCallback(() => dispatch({ type: 'TRIGGER_GRAMMAR_SUCCESS' }), []);
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
        triggerPronunciationSuccess,
        triggerGrammarSuccess,
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
