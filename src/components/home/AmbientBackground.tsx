"use client";

import { Float, Sphere } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";

function Particles() {
  const points = useMemo(
    () =>
      Array.from({ length: 50 }, (_, index) => ({
        id: index,
        position: [(Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8] as [number, number, number],
        scale: Math.random() * 0.06 + 0.025,
        color: index % 2 === 0 ? "#14B8A6" : "#3B82F6",
      })),
    [],
  );
  return (
    <>
      {points.map((point) => (
        <Float key={point.id} speed={0.7} rotationIntensity={0.2} floatIntensity={0.8}>
          <Sphere args={[1, 12, 12]} position={point.position} scale={point.scale}>
            <meshBasicMaterial color={point.color} transparent opacity={0.34} />
          </Sphere>
        </Float>
      ))}
    </>
  );
}

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-80" aria-hidden>
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <Particles />
      </Canvas>
    </div>
  );
}
