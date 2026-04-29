import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mesh-gradient grid min-h-screen place-items-center px-5">
      <section className="glass-card max-w-md p-7 text-center">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-text-secondary">This practice path does not exist.</p>
        <Link id="not-found-home" href="/home" className="mt-6 inline-flex rounded-full bg-accent-primary px-5 py-3 font-semibold text-bg-primary">
          Return home
        </Link>
      </section>
    </main>
  );
}
