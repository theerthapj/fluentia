"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

function seededValue(seed: number) {
  const raw = Math.sin(seed * 999) * 10000;
  return raw - Math.floor(raw);
}

function Particles() {
  const points = useMemo(
    () =>
      Array.from({ length: 50 }, (_, index) => ({
        id: index,
        left: `${(seededValue(index + 1) * 100).toFixed(3)}%`,
        top: `${(seededValue(index + 11) * 100).toFixed(3)}%`,
        size: `${(seededValue(index + 31) * 18 + 6).toFixed(3)}px`,
        delay: `${(seededValue(index + 41) * -12).toFixed(3)}s`,
        duration: `${(seededValue(index + 51) * 8 + 10).toFixed(3)}s`,
        color: index % 2 === 0 ? "#14B8A6" : "#3B82F6",
      })),
    [],
  );

  return (
    <>
      {points.map((point) => (
        <span
          key={point.id}
          className="ambient-particle"
          style={{
            "--ambient-left": point.left,
            "--ambient-top": point.top,
            "--ambient-size": point.size,
            "--ambient-color": point.color,
            "--ambient-duration": point.duration,
            "--ambient-delay": point.delay,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

export function AmbientBackground() {
  const pathname = usePathname();
  const isFocusMode = pathname.startsWith("/chat");

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-700"
      style={{ opacity: isFocusMode ? 0 : 0.08 }}
    >
      <Particles />
    </div>
  );
}
