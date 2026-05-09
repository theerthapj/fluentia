'use client';

// STEP 8: FluviIntro.tsx — One-time signature reveal + typewriter intro
// Gated by hasSeenIntro in FluviContext. Uses AnimatePresence for unmount animation.

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FluviCharacter } from './FluviCharacter';
import { useFluvi } from '@/context/FluviContext';

const INTRO_TEXT = "Hi, I'm Fluvi 🦚. I'm here to help you speak English with confidence. Let's learn together!";

export function FluviIntroGate() {
  const { state, dispatch } = useFluvi();
  const [visible, setVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  // Only show if the user hasn't seen the intro yet
  useEffect(() => {
    if (state.hasSeenIntro) return;
    const timer = window.setTimeout(() => setVisible(true), 0);
    return () => window.clearTimeout(timer);
  }, [state.hasSeenIntro]);

  // Text appears after the character reveal so the first-run moment stays brisk.
  useEffect(() => {
    if (!textVisible) return;
    const t = setTimeout(() => setCharIndex(INTRO_TEXT.length), 300);
    return () => clearTimeout(t);
  }, [textVisible]);

  function handleDismiss() {
    setVisible(false);
    dispatch({ type: 'COMPLETE_INTRO' });
    // Brief speaking animation then back to idle
    dispatch({ type: 'START_SPEAKING' });
    setTimeout(() => dispatch({ type: 'RESET_TO_IDLE' }), 2000);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'rgba(15, 23, 42, 0.96)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex flex-col items-center gap-8 max-w-sm px-6 text-center">

            {/* Teal glow halo behind character */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.3, scale: 1.5 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 180,
                height: 180,
                background: 'radial-gradient(circle, #14B8A6, transparent 70%)',
              }}
            />

            {/* Signature reveal: feathers open slowly with a spring */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.8, ease: [0.34, 1.56, 0.64, 1] }}
              onAnimationComplete={() => setTextVisible(true)}
            >
              <FluviCharacter size={180} showLabel={false} />
            </motion.div>

            {/* Typewriter intro text — appears after character is fully revealed */}
            <AnimatePresence>
              {textVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  <p
                    className="text-xl leading-relaxed"
                    style={{ color: '#F1F5F9', fontFamily: 'Syne, sans-serif' }}
                  >
                    {INTRO_TEXT.slice(0, charIndex)}
                    {charIndex < INTRO_TEXT.length && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        |
                      </motion.span>
                    )}
                  </p>

                  {/* "Let's Start" button — appears only after typewriter finishes */}
                  {charIndex >= INTRO_TEXT.length && (
                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, ease: 'easeOut' }}
                      onClick={handleDismiss}
                      className="px-8 py-3 font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(20,184,166,0.4)',
                        color: '#fff',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Let&apos;s Start! 🚀
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
