"use client";

import { useState } from "react";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function VoiceSimButton({ id, onCapture }: { id: string; onCapture: () => void }) {
  const [active, setActive] = useState(false);
  return (
    <button
      id={id}
      aria-label="Capture simulated voice"
      type="button"
      onClick={() => {
        setActive(true);
        window.setTimeout(() => {
          onCapture();
          setActive(false);
          toast.success("Voice captured (simulated)");
        }, 900);
      }}
      className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent-primary text-bg-primary transition hover:bg-teal-300", active && "pulse-teal")}
    >
      <Mic aria-hidden className="h-5 w-5" />
    </button>
  );
}
