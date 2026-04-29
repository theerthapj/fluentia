"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = ["Assessment", "Choose Mode", "Pick Scenario", "Chat", "Feedback"] as const;

export type FlowStep = (typeof steps)[number];

export function Breadcrumb({ current }: { current: FlowStep }) {
  const currentIndex = steps.indexOf(current);
  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex min-w-max items-center gap-2 rounded-full border border-border bg-surface/60 p-2">
        {steps.map((step, index) => {
          const complete = index < currentIndex;
          const active = index === currentIndex;
          return (
            <div key={step} className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-text-secondary",
                  active && "bg-accent-primary/15 text-accent-primary",
                  complete && "text-success",
                )}
              >
                {complete ? <Check aria-hidden className="h-3.5 w-3.5" /> : null}
                {step}
              </span>
              {index < steps.length - 1 ? <span className="h-px w-5 bg-border" /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
