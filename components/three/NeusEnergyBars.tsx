"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { neusEnergyMix } from "@/data/portfolioData";
import { usePalette } from "./palette";

const MAX_HEIGHT = 3;

function Bar({
  index,
  fuel,
  tj,
  share,
  color,
  active,
  onHover,
}: {
  index: number;
  fuel: string;
  tj: number;
  share: number;
  color: string;
  active: boolean;
  onHover: (i: number | null) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const target = (tj / neusEnergyMix[0].tj) * MAX_HEIGHT;
  const p = usePalette();

  // Bars grow in on mount, then lift slightly when hovered.
  useFrame((_, delta) => {
    const m = ref.current;
    if (!m) return;
    const h = THREE.MathUtils.damp(m.scale.y, target, 3, delta);
    m.scale.y = Math.max(h, 0.001);
    m.position.y = m.scale.y / 2;
    const lift = THREE.MathUtils.damp(m.position.z, active ? 0.25 : 0, 6, delta);
    m.position.z = lift;
  });

  const x = (index - (neusEnergyMix.length - 1) / 2) * 1.15;

  return (
    <group position={[x, -1.4, 0]}>
      <mesh
        ref={ref}
        scale={[1, 0.001, 1]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(index);
        }}
        onPointerOut={() => onHover(null)}
      >
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.5 : p.glow ? 0.12 : 0}
          roughness={0.4}
        />
      </mesh>
      <Html position={[0, target + 0.35, 0]} center distanceFactor={6} zIndexRange={[10, 0]}>
        <div
          className={`pointer-events-none whitespace-nowrap rounded-md border border-line bg-surface/95 px-2 py-1 text-center font-mono text-[10px] text-fg transition-opacity ${
            active ? "opacity-100" : "opacity-80"
          }`}
        >
          <div className="font-semibold" style={{ color }}>{share.toFixed(1)}%</div>
          {active && <div>{tj.toLocaleString("en-US", { maximumFractionDigits: 1 })} TJ</div>}
        </div>
      </Html>
      <Html position={[0, -0.25, 0.5]} center distanceFactor={6} zIndexRange={[10, 0]}>
        <span className="pointer-events-none whitespace-nowrap font-mono text-[10px] text-muted">{fuel}</span>
      </Html>
    </group>
  );
}

/** 3D bar chart of household Total Final Consumption by fuel (NEUS 2022/23). */
export default function NeusEnergyBars() {
  const p = usePalette();
  const [hover, setHover] = useState<number | null>(0);
  const colors = [p.amber, p.cyan, p.fg, p.muted];
  return (
    <group rotation={[0, -0.25, 0]}>
      {neusEnergyMix.map((d, i) => (
        <Bar key={d.fuel} index={i} {...d} color={colors[i]} active={hover === i} onHover={setHover} />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.41, 0]}>
        <planeGeometry args={[5.6, 2]} />
        <meshStandardMaterial color={p.surface} transparent opacity={0.6} />
      </mesh>
      <gridHelper args={[5.6, 14, p.line, p.line]} position={[0, -1.4, 0]} />
    </group>
  );
}
