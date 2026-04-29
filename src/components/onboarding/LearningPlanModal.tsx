"use client";

import { CheckCircle2 } from "lucide-react";
import { LevelBadge } from "@/components/assessment/LevelBadge";
import { Button } from "@/components/shared/Button";
import type { Level } from "@/types";

export function LearningPlanModal({ level, onBegin }: { level: Level; onBegin: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-bg-primary/80 px-5 backdrop-blur">
      <section className="glass-card max-w-lg p-7 text-center">
        <LevelBadge level={level} />
        <h2 className="mt-5 text-3xl font-bold">Your Learning Plan</h2>
        <ul className="mt-6 grid gap-3 text-left text-text-secondary">
          {["Scenario-based conversation practice", "AI feedback on every response", "Track your progress over time"].map((item) => (
            <li key={item} className="flex gap-3">
              <CheckCircle2 aria-hidden className="h-5 w-5 shrink-0 text-success" />
              {item}
            </li>
          ))}
        </ul>
        <Button id="learning-plan-begin" className="mt-7 w-full" size="lg" onClick={onBegin}>Let&apos;s Begin</Button>
      </section>
    </div>
  );
}
