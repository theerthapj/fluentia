import type { Level } from "@/types";
import { cn } from "@/lib/utils";

const labels: Record<Level, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function LevelBadge({ level, className }: { level: Level; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]",
        level === "beginner" && "border-success/30 bg-success/15 text-success",
        level === "intermediate" && "border-accent-primary/30 bg-accent-primary/12 text-[#357ABD]",
        level === "advanced" && "border-[#8E63E6]/30 bg-[#8E63E6]/12 text-[#5F3DB5]",
        className,
      )}
    >
      {labels[level]}
    </span>
  );
}
