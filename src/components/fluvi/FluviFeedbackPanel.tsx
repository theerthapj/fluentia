'use client';

// STEP 9: FluviFeedbackPanel.tsx
// Renders structured AI feedback with Fluvi character, scores, grammar, and suggestions.
// Consumes FeedbackResult from fluvi.types.ts — NOT FeedbackPayload from the main types.

import { motion } from 'framer-motion';
import { FluviCharacter } from './FluviCharacter';
import { useFluvi } from '@/context/FluviContext';
import {
  getRandomMessage,
  CORRECT_MESSAGES,
  INCORRECT_MESSAGES,
} from './FluviMessages';
import type { FeedbackResult } from '@/types/fluvi.types';

interface FluviFeedbackPanelProps {
  feedback: FeedbackResult;
  isCorrect: boolean;
  message?: string;
}

export function FluviFeedbackPanel({ feedback, isCorrect, message }: FluviFeedbackPanelProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { state } = useFluvi();

  const displayMessage =
    message ??
    (isCorrect
      ? getRandomMessage(CORRECT_MESSAGES, 'correct')
      : getRandomMessage(INCORRECT_MESSAGES, 'incorrect'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-2xl p-6 space-y-6"
      style={{
        background: 'rgba(30,41,59,0.85)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Fluvi + Message bubble */}
      <div className="flex items-center gap-4">
        <FluviCharacter size={72} />
        <div
          className="flex-1 rounded-xl px-4 py-3 text-sm font-medium"
          style={{
            color: '#F1F5F9',
            background: isCorrect ? 'rgba(20,184,166,0.15)' : 'rgba(59,130,246,0.12)',
            border: `1px solid ${isCorrect ? 'rgba(20,184,166,0.3)' : 'rgba(59,130,246,0.25)'}`,
          }}
        >
          {displayMessage}
        </div>
      </div>

      {/* Score row */}
      <div className="grid grid-cols-3 gap-3">
        <ScoreCard label="Fluency" value={`${feedback.fluency_score}/10`} color="#14B8A6" />
        <ScoreCard label="Confidence" value={feedback.confidence_level} color="#3B82F6" />
        <ScoreCard label="Tone" value={feedback.tone_assessment.label} color="#818CF8" />
      </div>

      {/* Tone explanation */}
      {feedback.tone_assessment.explanation && (
        <p className="text-xs" style={{ color: '#94A3B8' }}>
          {feedback.tone_assessment.explanation}
        </p>
      )}

      {/* Strengths */}
      {feedback.strengths.length > 0 && (
        <div className="space-y-2">
          <h4
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: '#4ADE80' }}
          >
            What you did well ✓
          </h4>
          {feedback.strengths.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, ease: 'easeOut' }}
              className="flex items-start gap-2 text-sm"
              style={{ color: '#E2E8F0' }}
            >
              <span style={{ color: '#4ADE80' }} className="mt-0.5">✓</span>
              <span>{s}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {feedback.suggestions.length > 0 && (
        <div className="space-y-2">
          <h4
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: '#14B8A6' }}
          >
            Fluvi suggests 💡
          </h4>
          {feedback.suggestions.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.2, ease: 'easeOut' }}
              className="text-sm pl-3"
              style={{
                color: '#E2E8F0',
                borderLeft: '2px solid rgba(20,184,166,0.5)',
              }}
            >
              {s}
            </motion.div>
          ))}
        </div>
      )}

      {/* Grammar corrections */}
      {feedback.grammar_corrections.length > 0 && (
        <div className="space-y-2">
          <h4
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: '#FBBF24' }}
          >
            Grammar
          </h4>
          {feedback.grammar_corrections.map((g, i) => (
            <div key={i} className="text-sm space-y-0.5">
              <span className="line-through mr-2" style={{ color: 'rgba(248,113,113,0.7)' }}>
                {g.original}
              </span>
              <span style={{ color: '#4ADE80' }}>→ {g.corrected}</span>
              <p className="text-xs" style={{ color: '#94A3B8' }}>{g.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {/* Improved versions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <VersionCard label="Simple Version 💡" content={feedback.simple_version} color="teal" />
        <VersionCard label="Advanced Version 🚀" content={feedback.advanced_version} color="indigo" />
      </div>

      {/* Encouragement */}
      <blockquote
        className="text-base italic pl-4"
        style={{
          color: '#E2E8F0',
          borderLeft: '3px solid #14B8A6',
        }}
      >
        {feedback.encouragement}
      </blockquote>

      {/* Optional Fluvi note */}
      {feedback.fluvi_note && (
        <p className="text-sm" style={{ color: 'var(--fluvi-primary, #14B8A6)' }}>
          {feedback.fluvi_note}
        </p>
      )}
    </motion.div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ScoreCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{
        background: `${color}14`,
        border: `1px solid ${color}33`,
      }}
    >
      <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>{label}</div>
      <div className="font-mono font-semibold text-sm" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function VersionCard({
  label,
  content,
  color,
}: {
  label: string;
  content: string;
  color: 'teal' | 'indigo';
}) {
  const borderColor = color === 'teal' ? '#14B8A6' : '#818CF8';
  const bgColor =
    color === 'teal' ? 'rgba(20,184,166,0.08)' : 'rgba(129,140,248,0.08)';
  return (
    <div
      className="rounded-xl p-4 space-y-2"
      style={{ background: bgColor, border: `1px solid ${borderColor}33` }}
    >
      <div className="text-xs font-semibold" style={{ color: borderColor }}>
        {label}
      </div>
      <p className="text-sm leading-relaxed" style={{ color: '#E2E8F0' }}>
        {content}
      </p>
      <button
        className="text-xs transition-colors"
        style={{ color: '#94A3B8' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#F1F5F9')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
        onClick={() => navigator.clipboard?.writeText(content)}
      >
        Copy ↗
      </button>
    </div>
  );
}
