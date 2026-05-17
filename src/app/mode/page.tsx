import type { Metadata } from "next";
import { SkillStudioClient } from "@/components/skill-studio/SkillStudioClient";

export const metadata: Metadata = {
  title: "Skill Studio",
  description: "Practice pronunciation, vocabulary, grammar, and sentence formation with focused Fluentia coaching.",
};

export default function ModePage() {
  return <SkillStudioClient />;
}
