"use client";

import { Button } from "@/components/shared/Button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="mesh-gradient grid min-h-screen place-items-center px-5">
      <section className="glass-card max-w-md p-7 text-center">
        <h1 className="text-3xl font-bold">Something needs a quick retry</h1>
        <p className="mt-3 text-text-secondary">Fluentia hit a temporary issue while loading this screen.</p>
        <Button id="error-retry" className="mt-6" onClick={reset}>Try again</Button>
      </section>
    </main>
  );
}
