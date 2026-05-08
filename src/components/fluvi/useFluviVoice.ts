'use client';

// STEP 6: useFluviVoice — Web Audio API amplitude → beak sync hook
// All localStorage for Fluvi is in FluviContext; this hook only handles audio.

import { useRef } from 'react';
import { useFluvi } from '@/context/FluviContext';

export function useFluviVoice() {
  const { startSpeaking, stopSpeaking, setVoiceAmplitude } = useFluvi();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const startVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteTimeDomainData(data);
        // RMS amplitude calculation
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const norm = (data[i] - 128) / 128;
          sum += norm * norm;
        }
        const rms = Math.sqrt(sum / data.length);
        setVoiceAmplitude(Math.min(rms * 5, 1)); // scale up for visible beak movement
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
      startSpeaking();
    } catch {
      // Mic access denied or unavailable — simulate speaking without amplitude
      startSpeaking();
    }
  };

  const stopVoice = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      void audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setVoiceAmplitude(0);
    stopSpeaking();
  };

  return { startVoice, stopVoice };
}
