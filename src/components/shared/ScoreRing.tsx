"use client";

import { motion } from "framer-motion";

export function ScoreRing({ score, size = 148, color = "#14B8A6" }: { score: number; size?: number; color?: string }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(10, score)) / 10) * circumference;
  return (
    <div
      className="relative grid place-items-center"
      role="meter"
      aria-label="Fluency score"
      aria-valuemin={0}
      aria-valuemax={10}
      aria-valuenow={score}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeWidth="10"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute text-center">
        <strong className="block text-4xl">{score.toFixed(1)}</strong>
        <span className="text-xs text-text-secondary">/10 fluency</span>
      </div>
    </div>
  );
}
