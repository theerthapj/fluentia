'use client';

// STEP 16: FluviDebugPanel — Development only, hidden in production
// Add this to layout.tsx only in development (guarded by NODE_ENV check inside component)

import { motion } from 'framer-motion';
import { useFluvi } from '@/context/FluviContext';

export function FluviDebugPanel() {
  // Guard: renders only when explicitly enabled for local visual testing.
  if (process.env.NEXT_PUBLIC_FLUVI_DEBUG !== 'true') return null;

  return <FluviDebugPanelInner />;
}

function FluviDebugPanelInner() {
  const {
    state,
    triggerCorrect,
    triggerIncorrect,
    triggerWarning,
    triggerCelebration,
    startSpeaking,
    stopSpeaking,
    startThinking,
    dispatch,
  } = useFluvi();

  const buttons: [string, () => void][] = [
    ['✓ Correct', triggerCorrect],
    ['✗ Incorrect', triggerIncorrect],
    ['⚠ Warning', triggerWarning],
    ['🎉 Celebrate', triggerCelebration],
    ['🎤 Speaking', startSpeaking],
    ['⏹ Stop', stopSpeaking],
    ['💭 Thinking', startThinking],
    ['🔄 Reset Intro', () => dispatch({ type: 'COMPLETE_INTRO' })],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.3, ease: 'easeOut' }}
      className="fixed bottom-4 left-4 z-[9999] rounded-xl text-xs font-mono space-y-2 p-4"
      style={{
        background: 'rgba(0,0,0,0.92)',
        border: '1px solid #334155',
        minWidth: 220,
        boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
      }}
    >
      <div className="font-bold" style={{ color: '#14B8A6' }}>🦚 Fluvi Debug</div>

      <div style={{ color: '#94A3B8' }}>
        Mode: <span style={{ color: '#F1F5F9' }}>{state.mode}</span>
      </div>
      <div style={{ color: '#94A3B8' }}>
        Level: <span style={{ color: '#F1F5F9' }}>{state.userLevel}</span>
      </div>
      <div style={{ color: '#94A3B8' }}>
        Consecutive ✓: <span style={{ color: '#4ADE80' }}>{state.consecutiveCorrect}</span>
      </div>
      <div style={{ color: '#94A3B8' }}>
        Consecutive ✗: <span style={{ color: '#F87171' }}>{state.consecutiveErrors}</span>
      </div>
      <div style={{ color: '#94A3B8' }}>
        Voice Amp: <span style={{ color: '#F1F5F9' }}>{state.voiceAmplitude.toFixed(2)}</span>
      </div>
      <div style={{ color: '#94A3B8' }}>
        Intro seen: <span style={{ color: '#F1F5F9' }}>{String(state.hasSeenIntro)}</span>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-1 pt-2">
        {buttons.map(([label, fn]) => (
          <button
            key={label}
            onClick={fn}
            className="px-2 py-1 rounded text-xs transition-colors"
            style={{
              background: '#1E293B',
              border: '1px solid #334155',
              color: '#F1F5F9',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#334155')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#1E293B')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Level switcher */}
      <div className="grid grid-cols-3 gap-1">
        {(['beginner', 'intermediate', 'advanced'] as const).map((l) => (
          <button
            key={l}
            onClick={() => dispatch({ type: 'SET_LEVEL', payload: l })}
            className="px-1 py-0.5 rounded text-xs transition-colors"
            style={{
              background: state.userLevel === l ? '#14B8A6' : '#1E293B',
              border: '1px solid #334155',
              color: '#F1F5F9',
            }}
          >
            {l[0].toUpperCase() + l.slice(1, 3)}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
