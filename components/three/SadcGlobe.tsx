"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, QuadraticBezierLine } from "@react-three/drei";
import * as THREE from "three";
import { usePalette } from "./palette";
import { SADC_NODES } from "./geo";

const R = 2;

function toVec(lat: number, lon: number, r = R): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

const PLACES = [
  ...SADC_NODES.map((n) => ({ ...n, kind: n.name === "Botswana" ? "home" : "sadc" })),
  { name: "IAEA · Vienna", lat: 48.21, lon: 16.37, kind: "iaea" },
  { name: "USW · Wales, UK", lat: 51.6, lon: -3.34, kind: "edu" },
] as const;

function Arc({ from, to, color }: { from: THREE.Vector3; to: THREE.Vector3; color: string }) {
  const mid = useMemo(() => from.clone().add(to).multiplyScalar(0.5).normalize().multiplyScalar(R + from.distanceTo(to) * 0.45), [from, to]);
  const ref = useRef<{ material: { dashOffset: number } } | null>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.material.dashOffset -= d * 0.6;
  });
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <QuadraticBezierLine ref={ref as any} start={from} end={to} mid={mid} color={color} lineWidth={1.5} dashed dashScale={8} dashSize={0.5} gapSize={0.3} />
  );
}

/** Dotted globe with Gaborone linked to SADC partners, IAEA (Vienna) and the UK. */
export default function SadcGlobe() {
  const p = usePalette();
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<string | null>(null);

  const dots = useMemo(() => {
    const n = 2600;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = Math.PI * (3 - Math.sqrt(5)) * i;
      arr.set([Math.cos(t) * r * R, y * R, Math.sin(t) * r * R], i * 3);
    }
    return arr;
  }, []);

  const home = toVec(-24.65, 25.91);
  // Start facing southern Africa
  const initialY = -(25.91 + 90) * (Math.PI / 180);

  useFrame((_, d) => {
    if (group.current && !hover) group.current.rotation.y += d * 0.05;
  });

  return (
    <group ref={group} rotation={[-0.45, initialY, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dots, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.018} color={p.muted} transparent opacity={0.55} />
      </points>
      <mesh>
        <sphereGeometry args={[R * 0.985, 48, 48]} />
        <meshBasicMaterial color={p.bg} transparent opacity={0.85} />
      </mesh>
      {PLACES.map((pl) => {
        const v = toVec(pl.lat, pl.lon);
        const color = pl.kind === "home" ? p.amber : pl.kind === "sadc" ? p.cyan : p.fg;
        return (
          <group key={pl.name}>
            {pl.kind !== "home" && <Arc from={home} to={v} color={color} />}
            <mesh
              position={v}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHover(pl.name);
              }}
              onPointerOut={() => setHover(null)}
            >
              <sphereGeometry args={[pl.kind === "home" ? 0.07 : 0.045, 16, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>
            {(pl.kind === "home" || hover === pl.name) && (
              <Html position={v.clone().multiplyScalar(1.08)} center distanceFactor={6} zIndexRange={[10, 0]}>
                <span
                  className="pointer-events-none whitespace-nowrap rounded border border-line bg-surface/95 px-1.5 py-0.5 font-mono text-[10px]"
                  style={{ color }}
                >
                  {pl.kind === "home" ? "Gaborone · Botswana" : pl.name}
                </span>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
