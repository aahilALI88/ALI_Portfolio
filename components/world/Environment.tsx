"use client";

import { useMemo } from "react";
import { CuboidCollider, CylinderCollider, RigidBody } from "@react-three/rapier";
import type { Palette } from "../three/palette";
import FloorText from "./FloorText";
import { AREAS, PEDESTALS, ROCKS, SPAWN, TREES, WORLD_HALF, type WorldZone } from "./worldData";
import { profile } from "@/data/portfolioData";

export interface WorldColors {
  ground: string;
  groundLine: string;
  road: string;
  tree: string;
  trunk: string;
  rock: string;
  paint: string;
  paintMuted: string;
}

export function worldColors(theme: "dark" | "light" | "contrast", p: Palette): WorldColors {
  if (theme === "light")
    return { ground: "#efe3cf", groundLine: "#e2d3b8", road: "#e4d3b4", tree: "#6b8f3e", trunk: "#7c5a3a", rock: "#c8b597", paint: "#0f172a", paintMuted: "#7c6a4f" };
  if (theme === "contrast")
    return { ground: "#000000", groundLine: "#2a2a2a", road: "#111111", tree: "#ffffff", trunk: "#bdbdbd", rock: "#9e9e9e", paint: "#ffffff", paintMuted: "#bdbdbd" };
  return { ground: "#121b2c", groundLine: "#1d2a44", road: "#18243a", tree: "#3f7d4f", trunk: "#5b4632", rock: "#334155", paint: p.fg, paintMuted: p.muted };
}

function accentColor(p: Palette, a: WorldZone["accent"]) {
  return a === "amber" ? p.amber : p.cyan;
}

/** Ground, painted titles, roads, trees, rocks and invisible boundary walls. */
export default function Environment({ p, c }: { p: Palette; c: WorldColors }) {
  const roads = useMemo(
    () =>
      AREAS.map((a) => {
        const dx = a.pos[0] - SPAWN[0];
        const dz = a.pos[1] - SPAWN[1];
        const len = Math.hypot(dx, dz);
        return { key: a.id, len, mid: [(a.pos[0] + SPAWN[0]) / 2, (a.pos[1] + SPAWN[1]) / 2] as const, angle: Math.atan2(dx, dz) };
      }),
    []
  );

  return (
    <group>
      {/* Ground */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[WORLD_HALF + 10, 0.5, WORLD_HALF + 10]} position={[0, -0.5, 0]} />
        {/* walls */}
        <CuboidCollider args={[WORLD_HALF, 3, 0.5]} position={[0, 3, -WORLD_HALF]} />
        <CuboidCollider args={[WORLD_HALF, 3, 0.5]} position={[0, 3, WORLD_HALF]} />
        <CuboidCollider args={[0.5, 3, WORLD_HALF]} position={[-WORLD_HALF, 3, 0]} />
        <CuboidCollider args={[0.5, 3, WORLD_HALF]} position={[WORLD_HALF, 3, 0]} />
      </RigidBody>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[WORLD_HALF * 4, WORLD_HALF * 4]} />
        <meshStandardMaterial color={c.ground} roughness={1} />
      </mesh>
      <gridHelper args={[WORLD_HALF * 2, WORLD_HALF / 2, c.groundLine, c.groundLine]} position={[0, 0.01, 0]} />
      {/* Boundary marker */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[WORLD_HALF * 1.38, WORLD_HALF * 1.42, 4, 1]} />
        <meshBasicMaterial color={c.paintMuted} transparent opacity={0.4} />
      </mesh>

      {/* Dirt roads from the spawn to each area */}
      {roads.map((r) => (
        <mesh key={r.key} rotation={[-Math.PI / 2, 0, r.angle]} position={[r.mid[0], 0.02, r.mid[1]]} receiveShadow>
          <planeGeometry args={[3.2, r.len]} />
          <meshStandardMaterial color={c.road} roughness={1} />
        </mesh>
      ))}

      {/* Painted name at the spawn, Bruno-style */}
      <FloorText text={profile.name.toUpperCase()} position={[SPAWN[0], 0.03, SPAWN[1] - 7]} size={2.6} color={c.paint} />
      <FloorText
        text="COMPUTER ENGINEER · ENERGY SYSTEMS MODELLER · FOUNDER, ATOMS AND BITS"
        position={[SPAWN[0], 0.03, SPAWN[1] - 3.6]}
        size={0.55}
        font="mono"
        weight={600}
        color={c.paintMuted}
      />
      <FloorText text="W A S D  /  ARROWS TO DRIVE" position={[SPAWN[0], 0.03, SPAWN[1] + 5]} size={0.5} font="mono" weight={600} color={c.paintMuted} />

      {/* Area pads + labels */}
      {AREAS.map((a) => (
        <group key={a.id}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[a.pos[0], 0.025, a.pos[1]]}>
            <ringGeometry args={[a.radius - 0.25, a.radius, 64]} />
            <meshBasicMaterial color={accentColor(p, a.accent)} transparent opacity={0.9} />
          </mesh>
          <FloorText
            text={a.label}
            position={[a.pos[0], 0.03, a.pos[1] + a.radius + 1.8]}
            size={1.4}
            color={a.accent === "brand" ? p.amber : accentColor(p, a.accent)}
          />
        </group>
      ))}

      {/* Pedestal pads */}
      {PEDESTALS.map((z) => (
        <mesh key={z.id} rotation={[-Math.PI / 2, 0, 0]} position={[z.pos[0], 0.025, z.pos[1]]}>
          <ringGeometry args={[z.radius - 0.15, z.radius, 48]} />
          <meshBasicMaterial color={accentColor(p, z.accent)} transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Acacia trees: flat-topped canopies */}
      {TREES.map(([x, z], i) => {
        const s = 0.85 + ((i * 37) % 10) / 25;
        return (
          <RigidBody key={`t${i}`} type="fixed" colliders={false} position={[x, 0, z]}>
            <CylinderCollider args={[1.5, 0.35 * s]} position={[0, 1.5, 0]} />
            <mesh position={[0, 1.4 * s, 0]} castShadow>
              <cylinderGeometry args={[0.18 * s, 0.32 * s, 2.8 * s, 7]} />
              <meshStandardMaterial color={c.trunk} roughness={1} flatShading />
            </mesh>
            <mesh position={[0, 3 * s, 0]} castShadow>
              <cylinderGeometry args={[2.4 * s, 1.6 * s, 0.7 * s, 9]} />
              <meshStandardMaterial color={c.tree} roughness={1} flatShading />
            </mesh>
          </RigidBody>
        );
      })}

      {/* Rocks */}
      {ROCKS.map(([x, z], i) => (
        <RigidBody key={`r${i}`} type="fixed" colliders="hull" position={[x, 0.4, z]} rotation={[0, i, 0]}>
          <mesh castShadow scale={[1.4 + (i % 3) * 0.3, 0.9, 1.1]}>
            <dodecahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial color={c.rock} roughness={1} flatShading />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}

