"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { usePalette } from "./palette";

export interface StackLevel {
  short: string;
  year: string;
}

function Plate({
  level,
  index,
  total,
  active,
  onSelect,
}: {
  level: StackLevel;
  index: number;
  total: number;
  active: boolean;
  onSelect: (i: number | null) => void;
}) {
  const p = usePalette();
  const ref = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const baseY = (index - (total - 1) / 2) * 0.95;
  const color = index === total - 1 ? p.amber : p.cyan;

  useFrame(({ clock }, d) => {
    const g = ref.current;
    if (!g) return;
    if (spin.current) spin.current.rotation.y = clock.getElapsedTime() * (0.25 + index * 0.08) * (index % 2 ? -1 : 1);
    g.position.y = THREE.MathUtils.damp(g.position.y, baseY + (active ? 0.25 : 0), 6, d);
    const s = THREE.MathUtils.damp(g.scale.x, active ? 1.12 : 1, 6, d);
    g.scale.setScalar(s);
  });

  return (
    <group
      ref={ref}
      position={[0, baseY, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
      onPointerOut={() => onSelect(null)}
    >
      <group ref={spin}>
      <mesh>
        <cylinderGeometry args={[1.5 - index * 0.25, 1.5 - index * 0.25, 0.22, 6]} />
        <meshStandardMaterial
          color={active ? color : p.surface}
          emissive={color}
          emissiveIntensity={active ? 0.35 : p.glow ? 0.08 : 0}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>
      <mesh>
        <cylinderGeometry args={[1.52 - index * 0.25, 1.52 - index * 0.25, 0.24, 6]} />
        <meshBasicMaterial color={color} wireframe />
      </mesh>
      </group>
      <Html position={[1.75 - index * 0.25, 0.05, 0]} center distanceFactor={6} zIndexRange={[10, 0]}>
        <span
          className="pointer-events-none whitespace-nowrap rounded border border-line bg-surface/95 px-1.5 py-0.5 font-mono text-[10px]"
          style={{ color }}
        >
          {level.short} · {level.year}
        </span>
      </Html>
    </group>
  );
}

/** Three stacked hex plates (BEng → MBA → PhD), linked to the list beside it. */
export default function EducationStack({
  levels,
  active,
  onSelect,
}: {
  levels: StackLevel[];
  active: number | null;
  onSelect: (i: number | null) => void;
}) {
  return (
    <group rotation={[0.35, 0, 0]}>
      {levels.map((l, i) => (
        <Plate key={l.short} level={l} index={i} total={levels.length} active={active === i} onSelect={onSelect} />
      ))}
    </group>
  );
}
