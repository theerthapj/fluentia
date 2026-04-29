import { GlassCard } from "@/components/shared/GlassCard";

export function RewriteCard({ title, text }: { title: string; text: string }) {
  return (
    <GlassCard className="p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 leading-7 text-text-secondary">{text}</p>
    </GlassCard>
  );
}
