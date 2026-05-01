"use client";

import { AlertTriangle, X } from "lucide-react";

export function SafetyBanner({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-amber-100" role="alert">
      <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
      <p className="flex-1">{message}</p>
      {onDismiss ? (
        <button id="safety-dismiss" aria-label="Dismiss safety warning" onClick={onDismiss} className="rounded-full p-1 text-amber-100 hover:bg-white/10">
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
