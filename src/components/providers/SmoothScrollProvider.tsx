"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const LenisRoot = ReactLenis as unknown as React.ComponentType<{
    root: boolean;
    options: { lerp: number; smoothWheel: boolean };
    children: React.ReactNode;
  }>;
  return (
    <LenisRoot root options={{ lerp: 0.09, smoothWheel: true }}>
      {children}
    </LenisRoot>
  );
}
