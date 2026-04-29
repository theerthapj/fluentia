"use client";

import { Eye } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { getScenario } from "@/lib/constants";
import { relativeTime } from "@/lib/utils";
import type { SessionRecord } from "@/types";

export function SessionRow({ session, onView }: { session: SessionRecord; onView: () => void }) {
  const scenario = getScenario(session.scenarioId);
  const Icon = scenario.Icon;
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white/5 p-4 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-primary/15 text-accent-primary">
          <Icon aria-hidden className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-semibold">{scenario.title}</h3>
          <p className="text-sm text-text-secondary">
            <span className="capitalize">{session.mode}</span> • {relativeTime(session.completedAt)}
          </p>
        </div>
      </div>
      <p className="text-sm font-semibold text-accent-primary">{session.fluencyScore.toFixed(1)}/10</p>
      <Button id={`session-view-${session.id}`} size="sm" variant="secondary" onClick={onView}>
        <Eye aria-hidden className="h-4 w-4" />
        View Feedback
      </Button>
    </div>
  );
}
