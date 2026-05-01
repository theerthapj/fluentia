import { GlassCard } from "@/components/shared/GlassCard";

export default function AboutPage() {
  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <GlassCard className="p-8">
          <h1 className="text-4xl font-bold">About Fluentia</h1>
          <p className="mt-4 leading-8 text-text-secondary">
            Fluentia is an AI speaking coach designed to help English learners practice real conversations, receive supportive feedback, and build confidence across formal, casual, and pronunciation-focused situations.
          </p>
        </GlassCard>
      </div>
    </main>
  );
}
