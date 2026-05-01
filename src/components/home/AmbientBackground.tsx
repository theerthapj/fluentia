"use client";

import { Float, Sphere } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

function seededValue(seed: number) {
  const raw = Math.sin(seed * 999) * 10000;
  return raw - Math.floor(raw);
}

function Particles({ paused }: { paused: boolean }) {
  const points = useMemo(
    () =>
      Array.from({ length: 50 }, (_, index) => ({
        id: index,
        position: [
          (seededValue(index + 1) - 0.5) * 12,
          (seededValue(index + 11) - 0.5) * 8,
          (seededValue(index + 21) - 0.5) * 8,
        ] as [number, number, number],
        scale: seededValue(index + 31) * 0.06 + 0.025,
        color: index % 2 === 0 ? "#14B8A6" : "#3B82F6",
      })),
    [],
  );
  return (
    <>
      {points.map((point) => (
        <Float key={point.id} speed={paused ? 0 : 0.7} rotationIntensity={paused ? 0 : 0.2} floatIntensity={paused ? 0 : 0.8}>
          <Sphere args={[1, 12, 12]} position={point.position} scale={point.scale}>
            <meshBasicMaterial color={point.color} transparent opacity={0.34} />
          </Sphere>
        </Float>
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
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700"
      style={{ opacity: isFocusMode ? 0 : 0.08 }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <Particles paused={isFocusMode} />
      </Canvas>
    </div>
  );
}
