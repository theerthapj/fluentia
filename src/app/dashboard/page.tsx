import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Track Fluentia practice sessions, fluency scores, and suggested English speaking scenarios.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
