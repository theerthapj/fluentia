"use client";

import { Globe } from "lucide-react";
import { useState } from "react";

export function CulturalNote({ note }: { note: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="glass-card border-l-2 border-l-warning p-4 text-sm text-text-secondary">
      <div className="flex items-start gap-3">
        <Globe aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p className="flex-1">{note}</p>
        <button id="cultural-note-dismiss" onClick={() => setVisible(false)} className="rounded-full px-3 py-1 text-xs font-semibold text-warning hover:bg-warning/10">
          Got it
        </button>
      </div>
    </div>
  );
}
