"use client";

import { motion } from "framer-motion";
import type { ConfidenceLevel } from "@/types";

export function ConfidenceMeter({ value, label }: { value: number; label: ConfidenceLevel }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-text-secondary">Confidence</span>
        <strong className="capitalize">{label}</strong>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10" role="meter" aria-label="Confidence meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
        <motion.div className="h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary" initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8 }} />
      </div>
    </div>
  );
}
