import { GlassCard } from "@/components/shared/GlassCard";

export default function PrivacyPage() {
  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <GlassCard className="p-8">
          <h1 className="text-4xl font-bold">Privacy</h1>
          <p className="mt-4 leading-8 text-text-secondary">
            Fluentia stores demo state, preferences, and practice history locally in your browser for this version of the product. Voice recordings are only sent to the configured transcription provider when voice capture is used and a live provider is enabled.
          </p>
        </GlassCard>
      </div>
    </main>
  );
}
