import { cn } from "@/lib/utils";

export function ProgressStepper({ total, current }: { total: number; current: number }) {
  return (
    <div aria-label={`Step ${current + 1} of ${total}`} className="flex items-center justify-center gap-3">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "h-2.5 rounded-full transition-all",
            index === current ? "w-10 bg-accent-primary" : index < current ? "w-2.5 bg-accent-secondary" : "w-2.5 bg-white/15",
          )}
        />
      ))}
    </div>
  );
}
