'use client';

// STEP 7: FluviCharacter.tsx — Animated peacock SVG component
// All animatable parts have unique IDs. SVG viewBox is exactly "0 0 200 220".
// Colors use CSS variables from FluviTheme — no hardcoded hex inside fills.

import { AnimatePresence, motion, useAnimation, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFluvi } from '@/context/FluviContext';
import { getFluviCSSVars } from './FluviTheme';
import { getRandomMessage, HOVER_GREETING_MESSAGES } from './FluviMessages';
import type { CorrectVariant } from '@/types/fluvi.types';

interface FluviCharacterProps {
  size?: number;
  className?: string;
  showLabel?: boolean;
}

export function FluviCharacter({ size = 200, className = '', showLabel = false }: FluviCharacterProps) {
  const { state } = useFluvi();
  const { mode, theme, energy, voiceAmplitude, consecutiveErrors, reactionMessage, reactionKey } = state;
  const prefersReducedMotion = useReducedMotion();
  const [localBubble, setLocalBubble] = useState<string | null>(null);
  const [bubbleAlign, setBubbleAlign] = useState<'left' | 'center' | 'right'>('center');

  const headControls = useAnimation();
  const beakUpperControls = useAnimation();
  const beakLowerControls = useAnimation();
  const eyeControls = useAnimation();
  const pupilControls = useAnimation();
  const featherControls = useAnimation();
  const bodyControls = useAnimation();
  const glowControls = useAnimation();
  const sparkleControls = useAnimation();

  const blinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const breatheTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const activeBubble = localBubble ?? (size >= 72 ? reactionMessage : null);
  const shouldShowThinkingDots = mode === 'thinking' && !localBubble;

  const placeBubble = useCallback(() => {
    if (typeof window === 'undefined') return;
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (rect.left < 120) setBubbleAlign('left');
    else if (window.innerWidth - rect.right < 120) setBubbleAlign('right');
    else setBubbleAlign('center');
  }, []);

  const showGreeting = useCallback(() => {
    placeBubble();
    setLocalBubble(getRandomMessage(HOVER_GREETING_MESSAGES, 'hover-greeting'));
    if (!prefersReducedMotion) {
      void headControls.start({
        rotate: [0, -5, 3, 0],
        transition: { duration: 0.6, ease: 'easeInOut' },
      });
      void bodyControls.start({
        y: [0, -3, 0],
        transition: { duration: 0.55, ease: 'easeOut' },
      });
      void eyeControls.start({
        scaleY: [1, 0.12, 1],
        transition: { duration: 0.22, ease: 'easeInOut' },
      });
    }
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setLocalBubble(null), 2200);
  }, [bodyControls, eyeControls, headControls, placeBubble, prefersReducedMotion]);

  useEffect(() => {
    if (!reactionMessage) return;
    placeBubble();
  }, [placeBubble, reactionKey, reactionMessage]);

  useEffect(() => {
    return () => {
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    };
  }, []);

  // ── IDLE: breathing + random blink ────────────────────────────
  useEffect(() => {
    if (mode !== 'idle') return;
    if (prefersReducedMotion) return;
    let active = true;

    breatheTimer.current = setInterval(() => {
      void bodyControls.start({
        scaleY: [1, 1.015, 1],
        transition: { duration: 3, ease: 'easeInOut' },
      });
      void featherControls.start({
        y: [0, -1.5, 0],
        transition: { duration: 3, ease: 'easeInOut' },
      });
    }, 3500);

    const scheduleBlink = () => {
      const delay = 3500 + Math.random() * 4500;
      blinkTimer.current = setTimeout(async () => {
        if (!active) return;
        try {
          await eyeControls.start({ scaleY: 0.1, transition: { duration: 0.1, ease: 'easeInOut' } });
          if (!active) return;
          await eyeControls.start({ scaleY: 1, transition: { duration: 0.15, ease: 'easeInOut' } });
          if (active) scheduleBlink();
        } catch {}
      }, delay);
    };
    scheduleBlink();

    return () => {
      active = false;
      if (breatheTimer.current) clearInterval(breatheTimer.current);
      if (blinkTimer.current) clearTimeout(blinkTimer.current);
    };
  }, [mode, bodyControls, featherControls, eyeControls, prefersReducedMotion]);

  // ── SPEAKING: beak + head sway + glow ripple ──────────────────
  useEffect(() => {
    if (mode !== 'speaking') return;
    if (prefersReducedMotion) return;

    const amplitude = Math.min(voiceAmplitude, 1);
    void beakUpperControls.start({ rotateX: -amplitude * 8, transition: { duration: 0.1, ease: 'easeInOut' } });
    void beakLowerControls.start({ rotateX: amplitude * 8, transition: { duration: 0.1, ease: 'easeInOut' } });

    void glowControls.start({
      scale: [1, 1.2 + amplitude * 0.15],
      opacity: [0.4, 0],
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
    });

    void headControls.start({
      x: [0, 1.5, -1.5, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    });
  }, [mode, voiceAmplitude, beakUpperControls, beakLowerControls, glowControls, headControls, prefersReducedMotion]);

  useEffect(() => {
    if (mode !== 'speaking') return;
    if (prefersReducedMotion) return;
    const blink = window.setInterval(() => {
      void eyeControls.start({
        scaleY: [1, 0.14, 1],
        transition: { duration: 0.22, ease: 'easeInOut' },
      });
    }, 2600);
    return () => window.clearInterval(blink);
  }, [mode, eyeControls, prefersReducedMotion]);

  // ── THINKING: look up/sideways ─────────────────────────────────
  useEffect(() => {
    if (mode !== 'thinking') return;
    if (prefersReducedMotion) return;
    void headControls.start({
      rotate: [-3, 3, -3],
      x: [1, 3, 1],
      transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
    });
    void pupilControls.start({
      x: [2, -1, 2],
      y: [-2, -1, -2],
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
    });
  }, [mode, reactionKey, headControls, pupilControls, prefersReducedMotion]);

  async function runCorrectVariant(variant: CorrectVariant) {
    if (prefersReducedMotion) return;
    void bodyControls.start({
      x: [0, -4, 4, -2, 0],
      rotate: [0, -3, 3, -1, 0],
      transition: { duration: 1.1, ease: 'easeInOut' },
    });
    void featherControls.start({
      rotate: [-2, 7, -2],
      scale: [1, 1.1, 1],
      transition: { duration: 1.1, ease: 'easeInOut' },
    });
    void glowControls.start({
      opacity: [0, 0.45, 0],
      scale: [0.9, 1.18, 1],
      transition: { duration: 1.2, ease: 'easeOut' },
    });
    void sparkleControls.start({
      opacity: [0, 0.9, 0],
      y: [0, -8],
      scale: [0.8, 1.1, 0],
      transition: { duration: 1.2, ease: 'easeInOut' },
    });
    switch (variant) {
      case 'feather_spread':
        await featherControls.start({
          rotate: [-3, 8, -3],
          scale: [1, 1.05, 1],
          transition: { duration: 2, ease: 'easeInOut' },
        });
        break;
      case 'shimmer_sweep':
        await featherControls.start({
          filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'],
          transition: { duration: 1.5, ease: 'easeInOut' },
        });
        break;
      case 'light_wave':
        await featherControls.start((i) => ({
          y: [0, -4, 0],
          transition: { duration: 1, delay: (i as number) * 0.1, ease: 'easeInOut' },
        }));
        break;
      case 'sparkle_drop':
        await sparkleControls.start({
          opacity: [0, 0.8, 0],
          y: [0, -10],
          scale: [0.8, 1.1, 0],
          transition: { duration: 1.5, ease: 'easeInOut' },
        });
        break;
      case 'smooth_spin':
        await bodyControls.start({
          rotate: [0, 4, -4, 0],
          transition: { duration: 1.5, ease: 'easeInOut' },
        });
        break;
      case 'elegant_bounce':
        await bodyControls.start({
          y: [0, -6, 0],
          transition: { duration: 1.2, ease: 'easeInOut' },
        });
        break;
      case 'dance_moment':
        await bodyControls.start({
          x: [0, 4, -4, 4, 0],
          y: [0, -3, 0, -3, 0],
          rotate: [0, 3, -3, 3, 0],
          transition: { duration: 2, ease: 'easeInOut' },
        });
        break;
    }
    // Head nod after any correct
    void headControls.start({ rotate: [0, 3, 0], transition: { duration: 0.8, ease: 'easeInOut' } });
  }

  // ── CORRECT FEEDBACK: variant-based ───────────────────────────
  useEffect(() => {
    if (mode !== 'correct_feedback') return;
    const variant = state.activeCorrectVariant;
    void runCorrectVariant(variant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, reactionKey]);

  // ── INCORRECT: mild sadness → encouragement ───────────────────
  useEffect(() => {
    if (mode !== 'incorrect_feedback') return;
    if (prefersReducedMotion) return;

    void headControls.start({ rotate: 5, y: 3, transition: { duration: 0.8, ease: 'easeInOut' } });
    void eyeControls.start({ scaleY: 0.85, transition: { duration: 0.6, ease: 'easeInOut' } });

    const t = setTimeout(() => {
      void headControls.start({ rotate: -3, y: 0, transition: { duration: 0.8, ease: 'easeInOut' } });
      void eyeControls.start({ scaleY: 1, transition: { duration: 0.6, ease: 'easeInOut' } });
    }, 1200);

    if (consecutiveErrors >= 3) {
      void headControls.start({ rotate: 8, transition: { duration: 1, ease: 'easeInOut' } });
    }

    return () => clearTimeout(t);
  }, [mode, reactionKey, consecutiveErrors, headControls, eyeControls, prefersReducedMotion]);

  // ── PRONUNCIATION SUCCESS: nod + beak pop ─────────────────────
  useEffect(() => {
    if (mode !== 'pronunciation_success') return;
    if (prefersReducedMotion) return;

    void headControls.start({
      rotate: [0, 5, -2, 0],
      y: [0, 2, -1, 0],
      transition: { duration: 0.9, ease: 'easeInOut' },
    });
    void beakUpperControls.start({
      rotateX: [0, -8, 0],
      transition: { duration: 0.35, repeat: 1, ease: 'easeInOut' },
    });
    void beakLowerControls.start({
      rotateX: [0, 10, 0],
      transition: { duration: 0.35, repeat: 1, ease: 'easeInOut' },
    });
    void glowControls.start({
      opacity: [0, 0.28, 0],
      scale: [0.95, 1.12, 1],
      transition: { duration: 1, ease: 'easeOut' },
    });
  }, [
    mode,
    reactionKey,
    headControls,
    beakUpperControls,
    beakLowerControls,
    glowControls,
    prefersReducedMotion,
  ]);

  // ── GRAMMAR SUCCESS: polished feather shimmer ─────────────────
  useEffect(() => {
    if (mode !== 'grammar_success') return;
    if (prefersReducedMotion) return;

    void featherControls.start({
      filter: ['brightness(1)', 'brightness(1.28)', 'brightness(1)'],
      scale: [1, 1.04, 1],
      transition: { duration: 1.1, ease: 'easeInOut' },
    });
    void sparkleControls.start({
      opacity: [0, 0.75, 0],
      x: [-6, 6],
      scale: [0.6, 1, 0.8],
      transition: { duration: 1.1, ease: 'easeInOut' },
    });
  }, [mode, reactionKey, featherControls, sparkleControls, prefersReducedMotion]);

  // ── WARNING: still, composed ───────────────────────────────────
  useEffect(() => {
    if (mode !== 'warning') return;
    if (prefersReducedMotion) return;

    void headControls.start({ rotate: 0, x: 0, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } });
    void featherControls.start({ rotate: 0, scale: 0.98, transition: { duration: 0.6, ease: 'easeInOut' } });
    void eyeControls.start({ scaleY: 0.9, transition: { duration: 0.5, ease: 'easeInOut' } });

    const t = setTimeout(() => {
      void eyeControls.start({ scaleY: 1, transition: { duration: 0.5, ease: 'easeInOut' } });
    }, 1500);

    return () => clearTimeout(t);
  }, [mode, reactionKey, headControls, featherControls, eyeControls, prefersReducedMotion]);

  // ── CELEBRATION ────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'celebration') return;
    if (prefersReducedMotion) return;

    void featherControls.start({
      rotate: [-4, 12, -5, 0],
      scale: [1, 1.12, 1.04, 1],
      transition: { duration: 1.6, ease: 'easeInOut' },
    });
    void bodyControls.start({
      x: [0, -5, 5, -3, 0],
      y: [0, -5, 0, -3, 0],
      rotate: [0, -4, 4, -2, 0],
      transition: { duration: 1.4, ease: 'easeInOut' },
    });
    void glowControls.start({
      opacity: [0, 0.5, 0],
      scale: [0.9, 1.25, 1],
      transition: { duration: 1.4, ease: 'easeOut' },
    });
    void sparkleControls.start({
      opacity: [0, 0.95, 0],
      y: [0, -12],
      scale: [0.7, 1.15, 0],
      transition: { duration: 1.4, ease: 'easeInOut' },
    });
  }, [mode, reactionKey, featherControls, bodyControls, glowControls, sparkleControls, prefersReducedMotion]);

  // ── RESET to idle ──────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'idle') return;
    void headControls.start({ rotate: 0, x: 0, y: 0, transition: { duration: 0.8, ease: 'easeInOut' } });
    void beakUpperControls.start({ rotateX: 0, transition: { duration: 0.4, ease: 'easeInOut' } });
    void beakLowerControls.start({ rotateX: 0, transition: { duration: 0.4, ease: 'easeInOut' } });
    void pupilControls.start({ x: 0, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } });
    void glowControls.start({ opacity: 0, scale: 1, transition: { duration: 0.6, ease: 'easeInOut' } });
    void featherControls.start({ scale: 1, rotate: 0, filter: 'brightness(1)', transition: { duration: 0.8, ease: 'easeInOut' } });
    void eyeControls.start({ scaleY: 1, transition: { duration: 0.4, ease: 'easeInOut' } });
    void sparkleControls.start({ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } });
  }, [mode, headControls, beakUpperControls, beakLowerControls, pupilControls, glowControls, featherControls, eyeControls, sparkleControls]);

  const cssVars = getFluviCSSVars(theme);
  const bubblePosition = useMemo(() => {
    if (bubbleAlign === 'left') return { left: 0, transform: 'translateY(-100%)' };
    if (bubbleAlign === 'right') return { right: 0, transform: 'translateY(-100%)' };
    return { left: '50%', transform: 'translate(-50%, -100%)' };
  }, [bubbleAlign]);

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      aria-label="Say hello to Fluvi"
      onMouseEnter={showGreeting}
      onClick={showGreeting}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          showGreeting();
        }
      }}
      className={`relative flex flex-col items-center ${className}`}
      style={{
        width: size,
        height: size + 24,
        cursor: 'pointer',
        pointerEvents: 'auto',
        ...(cssVars as React.CSSProperties),
      }}
    >
      <AnimatePresence>
        {activeBubble && (
          <motion.div
            key={`${activeBubble}-${localBubble ? 'local' : reactionKey}`}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.18, ease: 'easeOut' }}
            className="pointer-events-none absolute top-0 z-20 min-w-36 max-w-[min(220px,calc(100vw-32px))] rounded-xl px-3 py-2 text-center text-xs font-semibold leading-snug shadow-xl"
            style={{
              ...bubblePosition,
              color: '#F8FAFC',
              background: 'rgba(15,23,42,0.94)',
              border: '1px solid rgba(94,234,212,0.32)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.28)',
            }}
          >
            {activeBubble}
            {shouldShowThinkingDots ? <FluviThinkingDots compact /> : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow ring (speaking) */}
      <motion.div
        animate={glowControls}
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--fluvi-glow) 0%, transparent 70%)',
          opacity: 0,
        }}
      />

      {/* Main SVG — viewBox exactly "0 0 200 220" as required */}
      <svg
        viewBox="0 0 200 220"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Fluvi the peacock learning companion"
        role="img"
        className="transition-[filter] duration-700"
        style={{
          width: size,
          height: size,
          filter: `saturate(${theme.saturation}) brightness(${theme.brightness}) drop-shadow(0 0 ${8 + energy * 14}px var(--fluvi-glow))`,
        }}
      >
        <defs>
          <radialGradient id="fluvi-bodyGrad" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="white" stopOpacity="0.3" />
            <stop offset="40%" stopColor="var(--fluvi-primary)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--fluvi-feather)" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="fluvi-eyeGrad" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="var(--fluvi-eye)" />
          </radialGradient>
          <filter id="fluvi-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── FEATHERS (Detailed multi-layer fanned behind body) ── */}
        <motion.g
          id="fluvi-feathers"
          animate={featherControls}
          style={{ originX: '100px', originY: '150px' }}
        >
          {/* Outer Ring of Feathers */}
          {Array.from({ length: 15 }, (_, i) => {
            const angle = -105 + i * (210 / 14); // spread
            const spread = theme.featherSpread;
            const actualAngle = angle * spread;
            const featherLength = 95 - Math.abs(i - 7) * 3;
            return (
              <motion.g
                key={`outer-${i}`}
                id={`fluvi-feather-outer-${i + 1}`}
                animate={featherControls}
                custom={i}
                style={{
                  transformOrigin: '100px 150px',
                  transform: `rotate(${actualAngle}deg)`,
                }}
              >
                {/* Main green leaf */}
                <path
                  d={`M 100 150 C ${100 - featherLength*0.3} ${150 - featherLength*0.4}, ${100 - featherLength*0.4} ${150 - featherLength*0.8}, 100 ${150 - featherLength} C ${100 + featherLength*0.4} ${150 - featherLength*0.8}, ${100 + featherLength*0.3} ${150 - featherLength*0.4}, 100 150`}
                  fill="#10B981"
                  stroke="none"
                />
                {/* Peacock Eye Pattern */}
                <ellipse cx={100} cy={150 - featherLength * 0.85} rx={10} ry={13} fill="#FBBF24" />
                <ellipse cx={100} cy={150 - featherLength * 0.85} rx={7.5} ry={10} fill="#38BDF8" />
                <ellipse cx={100} cy={150 - featherLength * 0.82} rx={4.5} ry={6.5} fill="#1E3A8A" />
              </motion.g>
            );
          })}

          {/* Inner Ring of Feathers */}
          {Array.from({ length: 11 }, (_, i) => {
            const angle = -80 + i * (160 / 10);
            const spread = theme.featherSpread;
            const actualAngle = angle * spread;
            const featherLength = 65 - Math.abs(i - 5) * 2;
            return (
              <motion.g
                key={`inner-${i}`}
                id={`fluvi-feather-inner-${i + 1}`}
                animate={featherControls}
                custom={i + 15} // offset custom for staggered animations
                style={{
                  transformOrigin: '100px 150px',
                  transform: `rotate(${actualAngle}deg)`,
                }}
              >
                <path
                  d={`M 100 150 C ${100 - featherLength*0.4} ${150 - featherLength*0.4}, ${100 - featherLength*0.5} ${150 - featherLength*0.8}, 100 ${150 - featherLength} C ${100 + featherLength*0.5} ${150 - featherLength*0.8}, ${100 + featherLength*0.4} ${150 - featherLength*0.4}, 100 150`}
                  fill="#34D399"
                  stroke="none"
                />
                <ellipse cx={100} cy={150 - featherLength * 0.8} rx={7} ry={9} fill="#FBBF24" />
                <ellipse cx={100} cy={150 - featherLength * 0.8} rx={5} ry={7} fill="#38BDF8" />
                <ellipse cx={100} cy={150 - featherLength * 0.77} rx={3.5} ry={5} fill="#1E3A8A" />
              </motion.g>
            );
          })}
        </motion.g>

        {/* ── BODY ── */}
        <motion.g
          id="fluvi-body"
          animate={bodyControls}
          style={{ originX: '100px', originY: '150px' }}
        >
          {/* LEGS */}
          <g id="fluvi-legs">
            <path d="M 90 180 L 85 200 L 80 205 M 85 200 L 88 205 M 85 200 L 82 205" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 110 180 L 115 200 L 120 205 M 115 200 L 112 205 M 115 200 L 118 205" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* SCALLOPED WINGS (Back layer) */}
          <g fill="#2DD4BF" stroke="none">
            <ellipse cx={68} cy={140} rx={12} ry={18} transform="rotate(20 68 140)" />
            <ellipse cx={65} cy={155} rx={10} ry={16} transform="rotate(30 65 155)" />
            <ellipse cx={70} cy={168} rx={8} ry={12} transform="rotate(40 70 168)" />
            
            <ellipse cx={132} cy={140} rx={12} ry={18} transform="rotate(-20 132 140)" />
            <ellipse cx={135} cy={155} rx={10} ry={16} transform="rotate(-30 135 155)" />
            <ellipse cx={130} cy={168} rx={8} ry={12} transform="rotate(-40 130 168)" />
          </g>

          {/* MAIN FAT BODY */}
          <path d="M 80 120 C 55 140, 55 185, 100 185 C 145 185, 145 140, 120 120 C 110 110, 90 110, 80 120" fill="url(#fluvi-bodyGrad)" />
          
          {/* BELLY HIGHLIGHT */}
          <path d="M 85 130 C 70 145, 70 175, 100 175 C 130 175, 130 145, 115 130 C 105 120, 95 120, 85 130" fill="white" opacity="0.1" />
        </motion.g>

        {/* ── HEAD ── */}
        <motion.g
          id="fluvi-head"
          animate={headControls}
          style={{ originX: '100px', originY: '95px' }}
        >
          {/* Head circle */}
          <circle cx={100} cy={95} r={32} fill="url(#fluvi-bodyGrad)" />

          {/* Detailed Crest */}
          <motion.g id="fluvi-crest">
            <path d="M 100 63 Q 90 45 80 50" fill="none" stroke="var(--fluvi-feather)" strokeWidth="2" strokeLinecap="round" />
            <circle cx={80} cy={50} r={5} fill="#1D4ED8" stroke="none" />
            
            <path d="M 100 63 Q 95 40 92 42" fill="none" stroke="var(--fluvi-feather)" strokeWidth="2" strokeLinecap="round" />
            <circle cx={92} cy={42} r={5.5} fill="#1D4ED8" stroke="none" />
            
            <path d="M 100 63 Q 105 40 108 42" fill="none" stroke="var(--fluvi-feather)" strokeWidth="2" strokeLinecap="round" />
            <circle cx={108} cy={42} r={5.5} fill="#1D4ED8" stroke="none" />
            
            <path d="M 100 63 Q 110 45 120 50" fill="none" stroke="var(--fluvi-feather)" strokeWidth="2" strokeLinecap="round" />
            <circle cx={120} cy={50} r={5} fill="#1D4ED8" stroke="none" />
          </motion.g>

          {/* Expressive Anime Eyes */}
          <motion.g animate={eyeControls} style={{ originY: '95px' }}>
            {/* LEFT EYE */}
            <g id="fluvi-eye-left">
              <ellipse cx={85} cy={95} rx={13} ry={16} fill="white" />
              <motion.g id="fluvi-pupil-left" animate={pupilControls}>
                <ellipse cx={87} cy={95} rx={9} ry={12} fill="#0F172A" />
                <ellipse cx={87} cy={96} rx={8} ry={11} fill="#1E3A8A" />
                <ellipse cx={87} cy={94} rx={6} ry={9} fill="#020617" />
                <circle cx={84} cy={89} r={3.5} fill="white" />
                <circle cx={90} cy={98} r={1.5} fill="white" />
              </motion.g>
              <path d="M 70 90 Q 85 78 99 90" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 72 87 L 68 81 M 97 87 L 101 81" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx={73} cy={106} rx={6} ry={3} fill="#FDA4AF" opacity={0.7} />
            </g>
            
            {/* RIGHT EYE */}
            <g id="fluvi-eye-right">
              <ellipse cx={115} cy={95} rx={13} ry={16} fill="white" />
              <motion.g id="fluvi-pupil-right" animate={pupilControls}>
                <ellipse cx={113} cy={95} rx={9} ry={12} fill="#0F172A" />
                <ellipse cx={113} cy={96} rx={8} ry={11} fill="#1E3A8A" />
                <ellipse cx={113} cy={94} rx={6} ry={9} fill="#020617" />
                <circle cx={110} cy={89} r={3.5} fill="white" />
                <circle cx={116} cy={98} r={1.5} fill="white" />
              </motion.g>
              <path d="M 101 90 Q 115 78 130 90" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 128 87 L 132 81 M 103 87 L 99 81" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx={127} cy={106} rx={6} ry={3} fill="#FDA4AF" opacity={0.7} />
            </g>
          </motion.g>

          {/* Beak */}
          <motion.path
            id="fluvi-beak-upper"
            animate={beakUpperControls}
            d="M 91 107 Q 100 100 109 107 Q 100 114 91 107 Z"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="0.5"
            strokeLinejoin="round"
            style={{ originY: '107px' }}
          />
          <motion.path
            id="fluvi-beak-lower"
            animate={beakLowerControls}
            d="M 94 110 Q 100 118 106 110 Z"
            fill="#D97706"
            stroke="#B45309"
            strokeWidth="0.5"
            strokeLinejoin="round"
            style={{ originY: '110px' }}
          />
        </motion.g>

        {/* ── SPARKLES (correct feedback) ── */}
        <motion.g id="fluvi-sparkles" animate={sparkleControls} initial={{ opacity: 0 }}>
          {[
            { x: 70, y: 70 }, { x: 130, y: 65 }, { x: 155, y: 100 },
            { x: 50, y: 110 }, { x: 140, y: 130 }, { x: 80, y: 55 },
          ].map((pos, i) => (
            <motion.g key={i} custom={i}>
              <circle cx={pos.x} cy={pos.y} r={3} fill="var(--fluvi-eye)" opacity={0.9} />
              <line x1={pos.x - 6} y1={pos.y} x2={pos.x + 6} y2={pos.y} stroke="var(--fluvi-eye)" strokeWidth={1.5} />
              <line x1={pos.x} y1={pos.y - 6} x2={pos.x} y2={pos.y + 6} stroke="var(--fluvi-eye)" strokeWidth={1.5} />
            </motion.g>
          ))}
        </motion.g>

        {/* ── GLOW RING ID (for SVG accessibility) ── */}
        <circle id="fluvi-glow-ring" cx={100} cy={110} r={50} fill="none" />
      </svg>

      {/* Character name label */}
      {showLabel && (
        <span
          className="mt-2 text-sm font-medium"
          style={{ color: 'var(--fluvi-primary)', fontFamily: 'Syne, sans-serif' }}
        >
          Fluvi 🦚
        </span>
      )}
    </div>
  );
}

// ── Thinking Dots ──────────────────────────────────────────────────────────
export function FluviThinkingDots({ compact = false }: { compact?: boolean }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`flex gap-1 items-center ${compact ? 'mt-1 justify-center' : 'mt-2'}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${compact ? 'h-1 w-1' : 'h-1.5 w-1.5'} rounded-full`}
          style={{ background: '#14B8A6' }}
          animate={prefersReducedMotion ? { opacity: 0.7 } : { y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: prefersReducedMotion ? 0 : Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
