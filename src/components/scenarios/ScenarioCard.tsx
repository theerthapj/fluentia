"use client";

import { motion } from "framer-motion";
import { difficultyColor } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ScenarioWithIcon } from "@/types";

export function ScenarioCard({ scenario, onSelect }: { scenario: ScenarioWithIcon; onSelect: () => void }) {
  const Icon = scenario.Icon;
  return (
    <motion.button
      id={`scenario-${scenario.id}`}
      type="button"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="glass-card min-h-44 rounded-2xl p-5 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-accent-primary"
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary text-bg-primary">
        <Icon aria-hidden className="h-6 w-6" />
      </span>
      <h2 className="mt-5 text-xl font-semibold">{scenario.title}</h2>
      <span className={cn("mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold", difficultyColor[scenario.difficulty])}>
        {scenario.difficulty}
      </span>
    </motion.button>
  );
}
