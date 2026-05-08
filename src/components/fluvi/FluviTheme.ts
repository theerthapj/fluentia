// STEP 2: Fluvi Theme System
// Level-based visual theme tokens — cascades to SVG via CSS variables

import type { FluviTheme, UserLevel } from '@/types/fluvi.types';

const THEMES: Record<UserLevel, FluviTheme> = {
  beginner: {
    primaryColor: '#14B8A6',      // Soft teal
    featherColor: '#0D9488',
    eyeColor: '#5EEAD4',
    glowColor: 'rgba(20, 184, 166, 0.3)',
    featherSpread: 0.3,           // Minimal spread
    saturation: 0.7,
    brightness: 0.85,
  },
  intermediate: {
    primaryColor: '#3B82F6',      // Brighter blue-teal
    featherColor: '#14B8A6',
    eyeColor: '#93C5FD',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    featherSpread: 0.65,
    saturation: 0.9,
    brightness: 1.0,
  },
  advanced: {
    primaryColor: '#818CF8',      // Rich indigo-violet
    featherColor: '#6366F1',
    eyeColor: '#C4B5FD',
    glowColor: 'rgba(129, 140, 248, 0.5)',
    featherSpread: 1.0,           // Full display
    saturation: 1.2,
    brightness: 1.15,
  },
};

export function getFluviTheme(level: UserLevel): FluviTheme {
  return THEMES[level];
}

export function getFluviCSSVars(theme: FluviTheme): Record<string, string> {
  return {
    '--fluvi-primary': theme.primaryColor,
    '--fluvi-feather': theme.featherColor,
    '--fluvi-eye': theme.eyeColor,
    '--fluvi-glow': theme.glowColor,
    '--fluvi-spread': String(theme.featherSpread),
    '--fluvi-saturation': String(theme.saturation),
    '--fluvi-brightness': String(theme.brightness),
  };
}
