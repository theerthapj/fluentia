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
      className="glass-card min-h-56 rounded-2xl p-5 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-accent-primary"
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary text-bg-primary">
        <Icon aria-hidden="true" className="h-6 w-6" />
      </span>
      <div className="mt-5 flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold">{scenario.title}</h2>
        <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", difficultyColor[scenario.difficulty])}>
          {scenario.difficulty}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-text-secondary">{scenario.description}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-accent-primary">{scenario.category}</p>
      <ul className="mt-3 grid gap-2 text-sm text-text-secondary">
        {scenario.goals.slice(0, 2).map((goal) => (
          <li key={goal}>• {goal}</li>
        ))}
      </ul>
    </motion.button>
  );
}
