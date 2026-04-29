import { TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";

export function StatCard({ id, value, label }: { id: string; value: string | number; label: string }) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p id={id} className="gradient-text text-4xl font-bold">{value}</p>
          <p className="mt-2 text-sm text-text-secondary">{label}</p>
        </div>
        <TrendingUp aria-hidden className="h-5 w-5 text-accent-primary" />
      </div>
    </GlassCard>
  );
}
