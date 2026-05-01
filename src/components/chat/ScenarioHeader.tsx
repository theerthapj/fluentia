"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ConversationKind, Mode, Scenario } from "@/types";

export function ScenarioHeader({
  scenario,
  mode,
  advanced,
  kind,
  title,
}: {
  scenario: Scenario | null;
  mode: Mode | null;
  advanced?: boolean;
  kind: ConversationKind;
  title: string;
}) {
  const router = useRouter();

  const backTarget = kind === "scenario" ? "/scenarios" : kind === "pronunciation" ? "/pronunciation" : "/free-chat";

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg-primary/86 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center gap-3">
        <button
          id="chat-back-button"
          aria-label="Back"
          onClick={() => router.push(backTarget)}
          className="rounded-full border border-border p-2 text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold">{title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent-primary">
            <span>{kind.replace("-", " ")}</span>
            {mode ? <span>{mode} mode</span> : null}
            {scenario ? <span>{scenario.level}</span> : null}
          </div>
          {advanced ? (
            <span className="mt-2 inline-flex rounded-full border border-warning/30 bg-warning/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-warning">
              Advanced Follow-Up
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}
