"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface FluentiaTextCycleProps {
  words: string[];
  interval?: number;
  className?: string;
  useGradient?: boolean;
}

export function FluentiaTextCycle({
  words,
  interval = 4000,
  className = "",
  useGradient = true,
}: FluentiaTextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState("auto");
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = measureRef.current?.children[currentIndex];
    if (element) setWidth(`${element.getBoundingClientRect().width}px`);
  }, [currentIndex, words]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIndex((current) => (current + 1) % words.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [interval, words.length]);

  const variants: Variants = {
    hidden: { y: 12, opacity: 0, filter: "blur(4px)" },
    visible: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const } },
    exit: { y: -12, opacity: 0, filter: "blur(4px)", transition: { duration: 0.4 } },
  };

  if (!words.length) return null;

  return (
    <>
      <div ref={measureRef} aria-hidden="true" className="pointer-events-none invisible absolute opacity-0">
        {words.map((word) => (
          <span key={word} className={cn("px-1 font-bold", className)}>
            {word}
          </span>
        ))}
      </div>

      <motion.span
        className="relative inline-block max-w-full align-bottom"
        animate={{ width, transition: { type: "spring", stiffness: 200, damping: 20 } }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[currentIndex]}
            className={cn("inline-block max-w-full whitespace-nowrap px-1 font-bold", useGradient ? "gradient-text" : "text-accent-primary", className)}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}
