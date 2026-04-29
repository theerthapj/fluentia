"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";

export function OnboardingBanner() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-accent-primary/25 bg-accent-primary/10 p-4 sm:flex-row sm:items-center">
      <p className="flex-1 text-sm text-teal-50">New here? Take a quick 2-minute assessment to get your personalized practice plan.</p>
      <div className="flex items-center gap-2">
        <Button id="onboarding-take-assessment" size="sm" onClick={() => router.push("/assessment")}>Take Assessment</Button>
        <button id="onboarding-dismiss" aria-label="Dismiss onboarding banner" onClick={() => setDismissed(true)} className="rounded-full p-2 text-text-secondary hover:bg-white/10 hover:text-text-primary">
          <X aria-hidden className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
