"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { hasCompletedAssessment } from "@/lib/assessment-state";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Assessment", href: "/assessment" },
  { label: "Choose Mode", href: "/mode" },
  { label: "Pick Scenario", href: "/scenarios" },
  { label: "Chat", href: "/chat" },
  { label: "Feedback", href: "/feedback" },
] as const;

export type FlowStep = (typeof steps)[number]["label"];

export function Breadcrumb({ current }: { current: FlowStep }) {
  const currentIndex = steps.findIndex((step) => step.label === current);
  const { state } = useAppState();
  const assessmentReady = hasCompletedAssessment(state);

  return (
    <nav aria-label="Practice flow" className="mb-6 overflow-x-auto">
      <ol className="flex min-w-max items-center gap-2 rounded-full border border-border bg-surface/60 p-2">
        {steps.map((step, index) => {
          const complete = index < currentIndex;
          const active = index === currentIndex;
          const enabled =
            step.label === "Assessment" ||
            (step.label === "Choose Mode" && assessmentReady) ||
            (step.label === "Pick Scenario" && assessmentReady) ||
            (step.label === "Chat" && Boolean(state.selectedScenario || state.activeConversationKind !== "scenario")) ||
            (step.label === "Feedback" && Boolean(state.lastFeedback));

          return (
            <li key={step.label} className="flex items-center gap-2">
              {enabled && !active ? (
                <Link
                  href={step.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-text-secondary transition hover:text-text-primary",
                    complete && "text-success",
                  )}
                >
                  {complete ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : null}
                  {step.label}
                </Link>
              ) : (
                <span
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-text-secondary",
                    active && "bg-accent-primary/15 text-accent-primary",
                    complete && "text-success",
                    !enabled && "opacity-60",
                  )}
                >
                  {complete ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : null}
                  {step.label}
                </span>
              )}
              {index < steps.length - 1 ? <span aria-hidden="true" className="h-px w-5 bg-border" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
