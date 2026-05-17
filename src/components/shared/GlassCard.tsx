"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, borderColor: "rgba(74,144,226,0.45)" } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn("glass-card", className)}
    >
      {children}
    </motion.div>
  );
}
