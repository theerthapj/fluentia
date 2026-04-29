"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SplashPage() {
  const router = useRouter();
  useEffect(() => {
    const timer = window.setTimeout(() => router.push("/home"), 2500);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="mesh-gradient grid min-h-screen place-items-center px-5">
      <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center">
        <h1 className="gradient-text text-5xl font-bold sm:text-6xl">Fluentia</h1>
        <p className="mt-4 text-lg text-text-secondary">Your AI Speaking Coach</p>
      </motion.section>
    </main>
  );
}
