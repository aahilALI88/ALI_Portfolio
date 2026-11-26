"use client";

import { CuboidCollider, CylinderCollider, RigidBody } from "@react-three/rapier";
import type { Palette } from "../three/palette";
import FloorText from "./FloorText";

/** Pyramid of "bit" crates that the rover can smash through. */
export function BitCrates({ p, origin, paint }: { p: Palette; origin: [number, number]; paint: string }) {
  const crates: { pos: [number, number, number]; color: string }[] = [];
  const size = 1;
  const rows = 4;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < rows - r; c++) {
      const x = origin[0] + (c - (rows - r - 1) / 2) * (size + 0.04);
      const y = size / 2 + r * size;
      crates.push({ pos: [x, y + 0.01, origin[1]], color: (r + c) % 2 ? p.amber : p.cyan });
    }
  }
  return (
    <group>
      {crates.map((k, i) => (
        <RigidBody key={i} colliders="cuboid" position={k.pos} mass={0.6} friction={0.8} restitution={0.15} linearDamping={0.3} angularDamping={0.4}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[size, size, size]} />
            <meshStandardMaterial color={k.color} roughness={0.5} />
          </mesh>
          <mesh>
            <boxGeometry args={[size * 1.002, size * 1.002, size * 1.002]} />
            <meshBasicMaterial color={p.bg} wireframe transparent opacity={0.35} />
          </mesh>
        </RigidBody>
      ))}
      <FloorText text="SMASH THE BITS" position={[origin[0] + 4.2, 0.03, origin[1]]} size={0.5} font="mono" weight={700} color={paint} rotation={Math.PI / 2} />
    </group>
  );
}

/** Ten bowling pins in a triangle: a nod to playful 3D portfolios. */
export function BowlingPins({ p, origin, paint }: { p: Palette; origin: [number, number]; paint: string }) {
  const pins: [number, number][] = [];
  const gap = 1.1;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c <= r; c++) {
      pins.push([origin[0] + (c - r / 2) * gap, origin[1] - r * gap * 0.9]);
    }
  }
  return (
    <group>
      {pins.map(([x, z], i) => (
        <RigidBody key={i} colliders={false} position={[x, 0.8, z]} mass={0.25} restitution={0.3} angularDamping={0.2}>
          <CylinderCollider args={[0.75, 0.24]} />
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.24, 1.2, 14]} />
            <meshStandardMaterial color={p.fg} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.66, 0]} castShadow>
            <sphereGeometry args={[0.15, 14, 14]} />
            <meshStandardMaterial color={p.fg} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.165, 0.18, 0.1, 14]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </RigidBody>
      ))}
      <FloorText text="STRIKE?" position={[origin[0], 0.03, origin[1] + 2.2]} size={0.7} font="mono" weight={700} color={paint} />
    </group>
  );
}

/** Loose barrels scattered near the research area: solar-battery packs you can roll. */
export function Batteries({ p, spots }: { p: Palette; spots: [number, number][] }) {
  return (
    <group>
      {spots.map(([x, z], i) => (
        <RigidBody key={i} colliders={false} position={[x, 0.65, z]} rotation={[0, i, Math.PI / 2]} mass={0.8} angularDamping={0.6} linearDamping={0.4}>
          <CylinderCollider args={[0.65, 0.42]} />
          <mesh castShadow>
            <cylinderGeometry args={[0.42, 0.42, 1.3, 16]} />
            <meshStandardMaterial color={p.surface} metalness={0.5} roughness={0.35} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.43, 0.43, 0.35, 16]} />
            <meshStandardMaterial color={p.amber} />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}

/** Small static ramp to jump-free "bump" over. Purely visual collider. */
export function Ramp({ p, position, rotation = 0 }: { p: Palette; position: [number, number, number]; rotation?: number }) {
  return (
    <RigidBody type="fixed" colliders={false} position={position} rotation={[0, rotation, 0]}>
      <CuboidCollider args={[2, 0.25, 1.5]} />
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, 0.5, 3]} />
        <meshStandardMaterial color={p.surface} />
      </mesh>
    </RigidBody>
  );
}
