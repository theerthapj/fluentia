"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Mode, Scenario } from "@/types";

export function ScenarioHeader({ scenario, mode, advanced }: { scenario: Scenario; mode: Mode; advanced?: boolean }) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg-primary/86 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center gap-3">
        <button id="chat-back-button" aria-label="Back to scenarios" onClick={() => router.push("/scenarios")} className="rounded-full border border-border p-2 text-text-secondary hover:text-text-primary">
          <ArrowLeft aria-hidden className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold">{scenario.title}</h1>
          <span className="text-xs uppercase tracking-[0.18em] text-accent-primary">{mode} mode</span>
          {advanced ? <span className="ml-3 rounded-full border border-warning/30 bg-warning/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-warning">Advanced Mode</span> : null}
        </div>
      </div>
    </header>
  );
}
