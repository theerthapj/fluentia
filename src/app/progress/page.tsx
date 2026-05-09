import type { Metadata } from "next";
import { ProgressClient } from "@/components/dashboard/ProgressClient";

export const metadata: Metadata = {
  title: "Progress",
  description: "Review Fluentia practice volume, fluency scores, and recent speaking sessions.",
};

export default function ProgressPage() {
  return <ProgressClient />;
}
