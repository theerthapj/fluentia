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
        level === "intermediate" && "border-accent-secondary/30 bg-accent-secondary/15 text-blue-300",
        level === "advanced" && "border-purple-400/30 bg-purple-500/15 text-purple-300",
        className,
      )}
    >
      {labels[level]}
    </span>
  );
}
