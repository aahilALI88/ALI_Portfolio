"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, CylinderCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import type { Palette } from "../three/palette";
import AtomsBitsCore from "../three/AtomsBitsCore";
import SadcGlobe from "../three/SadcGlobe";
import FloorText from "./FloorText";
import { AREAS, PEDESTALS } from "./worldData";
import { neusEnergyMix } from "@/data/portfolioData";

const area = (id: string) => AREAS.find((a) => a.id === id)!;

/** A different abstract totem per project, floating above its pedestal. */
function Totem({ shape, color, active }: { shape: number; color: string; active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, d) => {
    const m = ref.current;
    if (!m) return;
    m.rotation.y += d * (active ? 2.2 : 0.6);
    m.position.y = 2.4 + Math.sin(clock.getElapsedTime() * 1.6 + shape) * 0.15;
    const s = THREE.MathUtils.damp(m.scale.x, active ? 1.35 : 1, 6, d);
    m.scale.setScalar(s);
  });
  const geo = [
    <icosahedronGeometry key="g" args={[0.6, 1]} />, // BCI (brain)
    <octahedronGeometry key="g" args={[0.65]} />, // drone
    <coneGeometry key="g" args={[0.55, 1.1, 6]} />, // sprout / soil
    <torusGeometry key="g" args={[0.45, 0.16, 12, 32]} />, // ultrasonic ring
    <capsuleGeometry key="g" args={[0.35, 0.6, 6, 16]} />, // ventilator bag
    <torusKnotGeometry key="g" args={[0.38, 0.12, 64, 10]} />, // CLEWS nexus
    <dodecahedronGeometry key="g" args={[0.62]} />, // grid
    <boxGeometry key="g" args={[0.3, 1.1, 0.3]} />, // survey bars
  ][shape % 8];
  return (
    <mesh ref={ref} position={[0, 2.4, 0]} castShadow>
      {geo}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 0.6 : 0.15} flatShading />
    </mesh>
  );
}

export function ProjectPedestals({ p, activeId, paint }: { p: Palette; activeId: string | null; paint: string }) {
  const hub = area("projects");
  return (
    <group>
      {PEDESTALS.map((z) => {
        const color = z.accent === "amber" ? p.amber : p.cyan;
        return (
          <group key={z.id} position={[z.pos[0], 0, z.pos[1]]}>
            <RigidBody type="fixed" colliders={false}>
              <CylinderCollider args={[0.75, 0.7]} position={[0, 0.75, 0]} />
            </RigidBody>
            <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.7, 0.85, 1.5, 8]} />
              <meshStandardMaterial color={p.surface} metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 1.52, 0]}>
              <cylinderGeometry args={[0.72, 0.72, 0.05, 8]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
            </mesh>
            <Totem shape={z.shape} color={color} active={activeId === z.id} />
            <FloorText text={z.label} position={[0, 0.03, 3.1]} size={0.7} font="mono" weight={700} color={paint} />
          </group>
        );
      })}
      {/* Hub monument */}
      <group position={[hub.pos[0], 0, hub.pos[1]]}>
        <mesh position={[0, 0.15, 0]} receiveShadow>
          <cylinderGeometry args={[3.4, 3.6, 0.3, 32]} />
          <meshStandardMaterial color={p.surface} />
        </mesh>
      </group>
    </group>
  );
}

/** Research area: solar PV array, transmission pylons and NEUS energy-mix bars. */
export function ResearchExhibit({ p, paint }: { p: Palette; paint: string }) {
  const a = area("research");
  const [cx, cz] = a.pos;
  const panels: [number, number][] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) panels.push([cx - 12 + c * 2.4, cz - 7 + r * 2.6]);
  const max = neusEnergyMix[0].tj;
  return (
    <group>
      {panels.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 1, 6]} />
            <meshStandardMaterial color={p.muted} />
          </mesh>
          <mesh position={[0, 1.05, 0]} rotation={[-0.55, 0, 0]} castShadow>
            <boxGeometry args={[2, 0.06, 1.4]} />
            <meshStandardMaterial color="#1e3a8a" metalness={0.6} roughness={0.25} emissive={p.cyan} emissiveIntensity={0.08} />
          </mesh>
        </group>
      ))}
      <RigidBody type="fixed" colliders={false} position={[cx - 8.4, 0, cz - 4.4]}>
        <CuboidCollider args={[5, 1, 4]} position={[0, 1, 0]} />
      </RigidBody>
      <FloorText text="SOLAR PV" position={[cx - 8.4, 0.03, cz + 0.6]} size={0.5} font="mono" weight={700} color={paint} />

      {/* NEUS household energy mix, as solid bars */}
      <group position={[cx + 6, 0, cz - 6]}>
        {neusEnergyMix.map((d, i) => {
          const h = (d.tj / max) * 6 + 0.2;
          const color = [p.amber, p.cyan, p.fg, p.muted][i];
          return (
            <group key={d.fuel} position={[i * 1.6 - 2.4, 0, 0]}>
              <RigidBody type="fixed" colliders={false}>
                <CuboidCollider args={[0.55, h / 2, 0.55]} position={[0, h / 2, 0]} />
              </RigidBody>
              <mesh position={[0, h / 2, 0]} castShadow>
                <boxGeometry args={[1.1, h, 1.1]} />
                <meshStandardMaterial color={color} roughness={0.4} />
              </mesh>
              <FloorText text={`${d.share.toFixed(0)}%`} position={[0, 0.03, 1.3]} size={0.42} font="mono" weight={700} color={paint} />
            </group>
          );
        })}
        <FloorText text="NEUS 2022/23 · HOUSEHOLD ENERGY BY FUEL" position={[0, 0.03, 2.4]} size={0.32} font="mono" weight={600} color={paint} />
      </group>

      {/* Pylons from research towards the projects hub */}
      {[0, 1, 2].map((i) => {
        const x = cx + 4 + i * 7;
        const z = cz - 14 - i * 3;
        return (
          <group key={i} position={[x, 0, z]}>
            <RigidBody type="fixed" colliders={false}>
              <CuboidCollider args={[0.5, 3, 0.5]} position={[0, 3, 0]} />
            </RigidBody>
            <mesh position={[0, 3, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.5, 6, 4]} />
              <meshStandardMaterial color={p.muted} wireframe />
            </mesh>
            <mesh position={[0, 5.6, 0]}>
              <boxGeometry args={[2.4, 0.12, 0.12]} />
              <meshStandardMaterial color={p.muted} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** Experience: the SADC globe on a plinth. */
export function ExperienceExhibit({ p }: { p: Palette }) {
  const a = area("experience");
  return (
    <group position={[a.pos[0], 0, a.pos[1] - 9]}>
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[0.6, 2.2]} position={[0, 0.6, 0]} />
      </RigidBody>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.6, 1.2, 24]} />
        <meshStandardMaterial color={p.surface} />
      </mesh>
      <group position={[0, 4.4, 0]} scale={1.5}>
        <SadcGlobe />
      </group>
    </group>
  );
}

/** Education: three stacked hex plates (BEng → MBA → PhD). */
export function EducationExhibit({ p }: { p: Palette }) {
  const a = area("education");
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    ref.current?.children.forEach((c, i) => (c.rotation.y = clock.getElapsedTime() * (0.3 + i * 0.1) * (i % 2 ? -1 : 1)));
  });
  return (
    <group position={[a.pos[0], 0, a.pos[1] - 9]}>
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[1.6, 2.3]} position={[0, 1.6, 0]} />
      </RigidBody>
      <group ref={ref}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0.5 + i * 1.1, 0]} castShadow>
            <cylinderGeometry args={[2.3 - i * 0.45, 2.3 - i * 0.45, 0.5, 6]} />
            <meshStandardMaterial color={i === 2 ? p.amber : p.cyan} roughness={0.4} />
          </mesh>
        ))}
      </group>
      {/* mortarboard */}
      <group position={[0, 4.1, 0]}>
        <mesh>
          <boxGeometry args={[1.8, 0.1, 1.8]} />
          <meshStandardMaterial color={p.fg} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.55, 0.6, 0.4, 16]} />
          <meshStandardMaterial color={p.fg} />
        </mesh>
      </group>
    </group>
  );
}

/** Atoms and Bits: the giant signature atom hovering over the company area. */
export function CompanyExhibit({ p }: { p: Palette }) {
  const a = area("company");
  return (
    <group position={[a.pos[0], 6, a.pos[1] - 10]}>
      <AtomsBitsCore scale={1.6} />
      <mesh position={[0, -5.6, 0]} receiveShadow>
        <cylinderGeometry args={[3, 3.4, 0.6, 32]} />
        <meshStandardMaterial color={p.surface} />
      </mesh>
      <RigidBody type="fixed" colliders={false} position={[0, -5.6, 0]}>
        <CylinderCollider args={[0.3, 3]} />
      </RigidBody>
    </group>
  );
}

/** Contact: a postbox. */
export function ContactExhibit({ p, paint, email }: { p: Palette; paint: string; email: string }) {
  const a = area("contact");
  const flag = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (flag.current) flag.current.rotation.z = -0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.25;
  });
  return (
    <group position={[a.pos[0] + 7, 0, a.pos[1]]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.7, 1.2, 0.5]} position={[0, 1.2, 0]} />
      </RigidBody>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 1.4, 8]} />
        <meshStandardMaterial color={p.muted} />
      </mesh>
      <mesh position={[0, 1.65, 0]} castShadow>
        <boxGeometry args={[1.3, 0.8, 0.9]} />
        <meshStandardMaterial color={p.cyan} />
      </mesh>
      <mesh ref={flag} position={[0.7, 1.95, 0]}>
        <boxGeometry args={[0.08, 0.6, 0.3]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <FloorText text={email} position={[-7, 0.03, -7.8]} size={0.7} font="mono" weight={700} color={paint} />
    </group>
  );
}
