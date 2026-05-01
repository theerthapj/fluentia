import { GlassCard } from "@/components/shared/GlassCard";

export default function ContactPage() {
  return (
    <main className="mesh-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-4xl">
        <GlassCard className="p-8">
          <h1 className="text-4xl font-bold">Contact</h1>
          <p className="mt-4 leading-8 text-text-secondary">
            For feedback about Fluentia, feature requests, or support, contact the product team through your configured support channel for this deployment.
          </p>
        </GlassCard>
      </div>
    </main>
  );
}
