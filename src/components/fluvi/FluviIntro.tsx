'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFluvi } from '@/context/FluviContext';
import { FluviCharacter } from './FluviCharacter';

const FLUVI_STORAGE_KEY = 'fluvi_state';
const INTRO_TEXT =
  "Hi, I'm Fluvi 🦚. I'm here to help you speak English with confidence. Let's learn together!";
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function FluviIntroGate({ onVisibilityChange }: { onVisibilityChange?: (visible: boolean) => void }) {
  const { state, dispatch } = useFluvi();
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [compactReveal, setCompactReveal] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const revealVisible = visible && !state.hasSeenIntro;
  const characterSize = compactReveal ? 112 : 230;

  const handleDismiss = useCallback(() => {
    setVisible(false);
    dispatch({ type: 'COMPLETE_INTRO' });
    dispatch({ type: 'RESET_TO_IDLE' });
  }, [dispatch]);

  useEffect(() => {
    const timer = window.setTimeout(
      () => {
        if (state.hasSeenIntro) {
          setVisible(false);
          return;
        }

        try {
          const saved = window.localStorage.getItem(FLUVI_STORAGE_KEY);
          const parsed = saved ? (JSON.parse(saved) as { hasSeenIntro?: unknown }) : null;
          if (parsed?.hasSeenIntro === true && state.introReplayKey === 0) return;
        } catch {}

        setTextVisible(false);
        setCharIndex(0);
        setVisible(true);
      },
      state.hasSeenIntro ? 0 : state.introReplayKey > 0 ? 80 : 420,
    );
    return () => window.clearTimeout(timer);
  }, [state.hasSeenIntro, state.introReplayKey]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px), (max-height: 720px)');
    const updateCompactReveal = () => setCompactReveal(media.matches);

    updateCompactReveal();
    media.addEventListener('change', updateCompactReveal);
    return () => media.removeEventListener('change', updateCompactReveal);
  }, []);

  useEffect(() => {
    onVisibilityChange?.(visible && !state.hasSeenIntro);
    return () => onVisibilityChange?.(false);
  }, [onVisibilityChange, state.hasSeenIntro, visible]);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setTextVisible(true), prefersReducedMotion ? 80 : 700);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion, visible]);

  useEffect(() => {
    if (!textVisible) return;
    if (prefersReducedMotion) {
      const timer = window.setTimeout(() => setCharIndex(INTRO_TEXT.length), 0);
      return () => window.clearTimeout(timer);
    }

    const startedAt = window.performance.now();
    const duration = 2600;
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const nextIndex = Math.max(1, Math.round(INTRO_TEXT.length * progress));
      setCharIndex(nextIndex);

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [prefersReducedMotion, textVisible]);

  useEffect(() => {
    if (!revealVisible) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => dialogRef.current?.focus({ preventScroll: true }));

    return () => {
      window.cancelAnimationFrame(frame);
      previousFocusRef.current?.focus({ preventScroll: true });
      previousFocusRef.current = null;
    };
  }, [revealVisible, state.introReplayKey]);

  useEffect(() => {
    if (!revealVisible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && charIndex >= INTRO_TEXT.length) {
        handleDismiss();
        return;
      }

      if (event.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => element.offsetParent !== null,
      );

      if (!focusable.length) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === first || activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [charIndex, handleDismiss, revealVisible]);

  return (
    <AnimatePresence>
      {revealVisible && (
        <motion.div
          ref={dialogRef}
          key={`fluvi-intro-${state.introReplayKey}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="fluvi-intro-title"
          aria-describedby={textVisible ? 'fluvi-intro-message' : undefined}
          data-testid="fluvi-intro-dialog"
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeIn' } }}
          className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden px-5 py-8 outline-none"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(160,196,255,0.5), rgba(238,246,255,0.96) 52%, rgba(247,250,252,0.99))',
            backdropFilter: 'blur(16px)',
          }}
        >
          <h2 id="fluvi-intro-title" className="sr-only">
            Meet Fluvi
          </h2>

          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              aria-hidden="true"
              className="absolute rounded-full border border-teal-200/20"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                prefersReducedMotion
                  ? { opacity: 0.16, scale: 1.1 }
                  : { opacity: [0, 0.38, 0], scale: [0.55, 1.45, 2.25] }
              }
              transition={{
                duration: 3.6,
                delay: index * 0.5,
                repeat: prefersReducedMotion ? 0 : Infinity,
                ease: 'easeOut',
              }}
              style={{
                width: 'min(70vw, 520px)',
                height: 'min(70vw, 520px)',
                boxShadow: '0 0 80px rgba(20,184,166,0.16)',
              }}
            />
          ))}

          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            initial={{ opacity: 0, x: '-18%' }}
            animate={prefersReducedMotion ? { opacity: 0.18, x: '0%' } : { opacity: [0, 0.55, 0.18], x: ['-18%', '18%', '0%'] }}
            transition={{ duration: 3.4, ease: 'easeOut' }}
            style={{
              background:
                'linear-gradient(115deg, transparent 0%, rgba(74,144,226,0.08) 42%, rgba(255,255,255,0.75) 49%, rgba(52,199,89,0.08) 56%, transparent 100%)',
            }}
          />

          <div className="relative flex w-full min-w-0 max-w-xl flex-col items-center gap-5 text-center sm:gap-7">
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: prefersReducedMotion ? 0.18 : [0, 0.34, 0.22], scale: prefersReducedMotion ? 1.5 : [0.7, 2.45, 2.15] }}
              transition={{ duration: 2.8, ease: 'easeOut' }}
              className="absolute top-8 rounded-full pointer-events-none"
              style={{
                width: 180,
                height: 180,
                background: 'radial-gradient(circle, rgba(74,144,226,0.45), transparent 70%)',
              }}
            />

            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 28, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-0"
            >
              <FluviCharacter size={characterSize} showLabel={false} introReveal />
            </motion.div>

            <AnimatePresence>
              {textVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="relative z-10 w-full min-w-0 max-w-[34rem] px-2"
                >
                  <p
                    id="fluvi-intro-message"
                    className="text-xl leading-relaxed"
                    style={{ color: '#1F3A5F', fontFamily: 'Syne, sans-serif' }}
                  >
                    {INTRO_TEXT.slice(0, charIndex)}
                    {charIndex < INTRO_TEXT.length && (
                      <motion.span
                        aria-hidden="true"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        |
                      </motion.span>
                    )}
                  </p>

                  <AnimatePresence>
                    {charIndex >= INTRO_TEXT.length && (
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: prefersReducedMotion ? 0 : 0.22, ease: 'easeOut' }}
                        onClick={handleDismiss}
                        className="mt-7 rounded-xl px-8 py-3 font-semibold text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-white"
                        style={{
                          background: 'linear-gradient(135deg, #4A90E2, #357ABD)',
                          boxShadow: '0 8px 32px rgba(74,144,226,0.28)',
                        }}
                        whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
                        whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                      >
                        Let&apos;s start
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
