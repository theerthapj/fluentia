import type { Metadata } from "next";
import { LandingPageClient } from "@/components/landing/LandingPageClient";

export const metadata: Metadata = {
  title: "Speak English with Real Confidence",
  description: "Fluentia is an AI speaking coach for real-world English practice, instant feedback, and confidence building.",
};

export default function LandingPage() {
  return <LandingPageClient />;
}
