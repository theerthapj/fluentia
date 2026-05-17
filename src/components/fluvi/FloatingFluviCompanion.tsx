"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { FluviCharacter } from "@/components/fluvi/FluviCharacter";
import { cn } from "@/lib/utils";

const LARGE_PAGES = new Set(["/", "/home", "/dashboard", "/brain-boost", "/free-chat", "/progress", "/settings"]);

export function FloatingFluviCompanion() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const isChat = pathname?.startsWith("/chat");
  const isQuiz = pathname?.startsWith("/brain-boost/quiz");
  const isSkillStudio = pathname?.startsWith("/mode");
  if (isSkillStudio) return null;

  const compact = isChat || isQuiz || !LARGE_PAGES.has(pathname ?? "");

  return (
    <motion.aside
      aria-label="Fluvi companion"
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.78, y: 18 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "pointer-events-none fixed right-2 z-40 sm:right-3",
        isChat ? "bottom-44 lg:bottom-28" : "bottom-24 lg:bottom-6",
      )}
    >
      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                y: [0, -4, 0],
                rotate: [0, 0.8, 0],
              }
        }
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-auto rounded-full border border-white/10 bg-bg-primary/45 p-2 shadow-[0_18px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl"
      >
        <FluviCharacter size={compact ? 76 : 104} />
      </motion.div>
    </motion.aside>
  );
}
