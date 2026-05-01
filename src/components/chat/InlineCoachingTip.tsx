"use client";

import { motion } from "framer-motion";
import { Lightbulb, X } from "lucide-react";

export function InlineCoachingTip({ tip, onDismiss }: { tip: string; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card border-l-2 border-l-accent-primary p-4 text-sm text-text-secondary"
    >
      <div className="flex items-start gap-3">
        <Lightbulb aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent-primary" />
        <p className="flex-1">{tip}</p>
        <button id="inline-coaching-dismiss" aria-label="Dismiss coaching tip" onClick={onDismiss} className="rounded-full p-1 hover:bg-white/10">
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
