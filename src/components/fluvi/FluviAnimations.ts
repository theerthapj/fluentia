// STEP 4: Fluvi Animations — Variant Queue System + Motion Variant Definitions

import type { CorrectVariant } from '@/types/fluvi.types';

// ── Variant Queue ─────────────────────────────────────────────────────────────

const ALL_VARIANTS: CorrectVariant[] = [
  'feather_spread',
  'shimmer_sweep',
  'light_wave',
  'sparkle_drop',
  'smooth_spin',
  'elegant_bounce',
];

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a new randomized queue of correct variants.
 * If excludeFirst is provided, that variant won't appear at position 0
 * (prevents the same animation repeating consecutively).
 */
export function buildVariantQueue(excludeFirst?: CorrectVariant): CorrectVariant[] {
  const pool = excludeFirst
    ? ALL_VARIANTS.filter((v) => v !== excludeFirst)
    : ALL_VARIANTS;
  return shuffle(pool);
}

/**
 * Peek at the next variant without mutating state —
 * the reducer handles queue rotation.
 */
export function getNextVariant(queue: CorrectVariant[]): CorrectVariant {
  return queue[0] ?? 'feather_spread';
}

// ── Framer Motion Variant Definitions ────────────────────────────────────────
// Used as reference values in FluviCharacter.tsx

export const idleBreathVariant = {
  animate: {
    scaleY: [1, 1.02, 1],
    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

export const speakingGlowVariant = {
  animate: {
    scale: [1, 1.5],
    opacity: [0.7, 0],
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeOut' as const },
  },
};

export const thinkingVariant = {
  animate: {
    rotate: -8,
    x: 5,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export const warningStillnessVariant = {
  animate: {
    scale: 0.97,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
};

export const celebrationVariant = {
  animate: {
    scale: [1, 1.15, 1],
    rotate: [0, 10, -10, 0],
    transition: { duration: 1.2, ease: 'backOut' as const },
  },
};
