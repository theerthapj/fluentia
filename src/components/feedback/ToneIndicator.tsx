import { Sparkles } from "lucide-react";

export function ToneIndicator({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-accent-primary/30 bg-accent-primary/10 px-4 py-2 text-sm font-semibold text-[#357ABD]">
      <Sparkles aria-hidden className="h-4 w-4 text-accent-primary" />
      {label}
    </span>
  );
}
