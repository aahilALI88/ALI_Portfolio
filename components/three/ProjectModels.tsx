"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { usePalette, type Palette } from "./palette";
import NeusEnergyBars from "./NeusEnergyBars";
import { SADC_NODES } from "./geo";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function Label({ children, position, color }: { children: React.ReactNode; position: [number, number, number]; color: string }) {
  return (
    <Html position={position} center distanceFactor={6} zIndexRange={[10, 0]}>
      <span
        className="pointer-events-none whitespace-nowrap rounded border border-line bg-surface/90 px-1.5 py-0.5 font-mono text-[10px] backdrop-blur"
        style={{ color }}
      >
        {children}
      </span>
    </Html>
  );
}

function GroundGrid({ p, y = -1.6 }: { p: Palette; y?: number }) {
  return <gridHelper args={[10, 20, p.line, p.line]} position={[0, y, 0]} />;
}

/* ------------------------------------------------------------------ */
/* 1. BCI exoskeleton: EEG intent drives a walking gait                */
/* ------------------------------------------------------------------ */

function Leg({ side, p, phase }: { side: 1 | -1; p: Palette; phase: number }) {
  const hip = useRef<THREE.Group>(null);
  const knee = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 2.2 + phase;
    if (hip.current) hip.current.rotation.x = Math.sin(t) * 0.45;
    if (knee.current) knee.current.rotation.x = Math.max(0, -Math.cos(t)) * 0.8;
  });
  return (
    <group ref={hip} position={[0.32 * side, 0.4, 0]}>
      <mesh>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshStandardMaterial color={p.cyan} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[0.16, 1, 0.16]} />
        <meshStandardMaterial color={p.muted} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[0.2, 0.9, 0.04]} />
        <meshStandardMaterial color={p.cyan} />
      </mesh>
      <group ref={knee} position={[0, -1.1, 0]}>
        <mesh>
          <sphereGeometry args={[0.11, 20, 20]} />
          <meshStandardMaterial color={p.amber} emissive={p.amber} emissiveIntensity={p.glow ? 0.4 : 0} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[0.14, 0.95, 0.14]} />
          <meshStandardMaterial color={p.muted} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, -1.02, 0.1]}>
          <boxGeometry args={[0.22, 0.08, 0.42]} />
          <meshStandardMaterial color={p.cyan} />
        </mesh>
      </group>
    </group>
  );
}

function Exoskeleton() {
  const p = usePalette();
  const eeg = useRef<THREE.Mesh>(null);
  const signal = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (eeg.current) eeg.current.scale.setScalar(1 + Math.sin(t * 4.4) * 0.06);
    if (signal.current) signal.current.position.y = 2.1 - ((t * 1.2) % 1) * 1.6;
  });
  return (
    <group position={[0, -0.35, 0]}>
      {/* EEG cap / brain */}
      <mesh ref={eeg} position={[0, 2.2, 0]}>
        <icosahedronGeometry args={[0.42, 2]} />
        <meshBasicMaterial color={p.cyan} wireframe />
      </mesh>
      <Label position={[0.85, 2.3, 0]} color={p.cyan}>EEG intent</Label>
      {/* Decoded intent travelling down to the controller */}
      <mesh ref={signal} position={[0, 2, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color={p.amber} />
      </mesh>
      <Line points={[[0, 1.8, 0], [0, 0.6, 0]]} color={p.muted} dashed dashSize={0.08} gapSize={0.06} lineWidth={1} />
      {/* Hip frame + embedded controller */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.9, 0.18, 0.3]} />
        <meshStandardMaterial color={p.muted} metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.5, -0.2]}>
        <boxGeometry args={[0.4, 0.3, 0.12]} />
        <meshStandardMaterial color={p.amber} />
      </mesh>
      <Label position={[-1.05, 0.55, 0]} color={p.amber}>ML decoder → control</Label>
      <Leg side={1} p={p} phase={0} />
      <Leg side={-1} p={p} phase={Math.PI} />
      <GroundGrid p={p} y={-1.25} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Anti-poaching drone: hover, spinning rotors, scanning cone       */
/* ------------------------------------------------------------------ */

function Rotor({ position, p }: { position: [number, number, number]; p: Palette }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 28;
  });
  return (
    <group position={position}>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.12, 12]} />
        <meshStandardMaterial color={p.fg} />
      </mesh>
      <mesh ref={ref} position={[0, 0.03, 0]}>
        <boxGeometry args={[0.9, 0.015, 0.07]} />
        <meshStandardMaterial color={p.cyan} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <torusGeometry args={[0.47, 0.012, 6, 48]} />
        <meshBasicMaterial color={p.cyan} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Drone() {
  const p = usePalette();
  const body = useRef<THREE.Group>(null);
  const cone = useRef<THREE.Group>(null);
  const targets = useMemo(
    () => [
      [-1.6, -1.58, 0.8],
      [1.2, -1.58, -1.1],
      [0.4, -1.58, 1.6],
    ] as [number, number, number][],
    []
  );
  const [hit, setHit] = useState(0);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (body.current) {
      body.current.position.y = 0.6 + Math.sin(t * 1.3) * 0.12;
      body.current.rotation.z = Math.sin(t * 0.9) * 0.05;
    }
    if (cone.current) cone.current.rotation.y = t * 0.8;
    const idx = Math.floor(t / 1.6) % targets.length;
    if (idx !== hit) setHit(idx);
  });
  const arms: [number, number, number][] = [
    [0.8, 0, 0.8],
    [-0.8, 0, 0.8],
    [0.8, 0, -0.8],
    [-0.8, 0, -0.8],
  ];
  return (
    <group>
      <group ref={body}>
        <mesh>
          <boxGeometry args={[0.7, 0.22, 0.7]} />
          <meshStandardMaterial color={p.muted} metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.4, 0.08, 0.4]} />
          <meshStandardMaterial color={p.cyan} emissive={p.cyan} emissiveIntensity={p.glow ? 0.3 : 0} />
        </mesh>
        {/* camera gimbal */}
        <mesh position={[0, -0.2, 0.2]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial color={p.amber} />
        </mesh>
        {arms.map((a, i) => (
          <group key={i}>
            <Line points={[[0, 0, 0], a]} color={p.fg} lineWidth={3} />
            <Rotor position={[a[0], 0.08, a[2]]} p={p} />
          </group>
        ))}
        {/* scanning cone */}
        <group ref={cone} position={[0, -0.25, 0]}>
          <mesh position={[0.35, -0.95, 0]} rotation={[0, 0, 0.35]}>
            <coneGeometry args={[0.75, 1.9, 32, 1, true]} />
            <meshBasicMaterial color={p.amber} transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </group>
        <Label position={[1.25, 0.55, 0]} color={p.cyan}>Edge-AI vision</Label>
      </group>
      {targets.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.16, 0.22, 32]} />
            <meshBasicMaterial color={i === hit ? p.amber : p.muted} transparent opacity={i === hit ? 1 : 0.35} />
          </mesh>
          {i === hit && <Label position={[0, 0.35, 0]} color={p.amber}>threat flagged · geotagged</Label>}
        </group>
      ))}
      <GroundGrid p={p} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Molemisi: soil probe → data packets → crop recommendation        */
/* ------------------------------------------------------------------ */

function Molemisi() {
  const p = usePalette();
  const packets = useRef<THREE.Group>(null);
  const sprout = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    packets.current?.children.forEach((c, i) => {
      const k = (t * 0.6 + i / 4) % 1;
      c.position.set(0.45 + k * 0.9, 0.1 + k * 1.7, 0);
      (c as THREE.Mesh).scale.setScalar(1 - k * 0.5);
    });
    if (sprout.current) sprout.current.scale.setScalar(0.85 + Math.sin(t * 1.5) * 0.08);
  });
  const layers = [
    { h: 0.35, color: "#8b5e34" },
    { h: 0.45, color: "#6b4426" },
    { h: 0.5, color: "#4a2f1b" },
  ];
  let y = 0;
  return (
    <group position={[-0.4, -0.3, 0]}>
      {layers.map((l, i) => {
        const cy = -y - l.h / 2;
        y += l.h;
        return (
          <mesh key={i} position={[0, cy, 0]}>
            <cylinderGeometry args={[1.3, 1.3, l.h, 48]} />
            <meshStandardMaterial color={l.color} roughness={1} transparent opacity={0.92} />
          </mesh>
        );
      })}
      {/* probe */}
      <mesh position={[0.3, 0.05, 0.4]}>
        <cylinderGeometry args={[0.04, 0.04, 1.9, 12]} />
        <meshStandardMaterial color={p.fg} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.3, 1.05, 0.4]}>
        <boxGeometry args={[0.4, 0.28, 0.22]} />
        <meshStandardMaterial color={p.cyan} />
      </mesh>
      <Label position={[0.3, 1.45, 0.4]} color={p.cyan}>NPK · pH · moisture</Label>
      <group ref={packets} position={[0, 0, 0.4]}>
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh key={i}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color={p.cyan} />
          </mesh>
        ))}
      </group>
      {/* recommender node */}
      <Float speed={2} floatIntensity={0.4}>
        <mesh position={[1.5, 2, 0.4]}>
          <octahedronGeometry args={[0.28]} />
          <meshStandardMaterial color={p.amber} emissive={p.amber} emissiveIntensity={p.glow ? 0.4 : 0} flatShading />
        </mesh>
        <Label position={[1.5, 2.5, 0.4]} color={p.amber}>ML + GIS → best crop</Label>
      </Float>
      {/* crop sprout */}
      <group ref={sprout} position={[-0.6, 0, -0.2]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.6, 8]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
        <mesh position={[0.15, 0.55, 0]} rotation={[0, 0, -0.8]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
        <mesh position={[-0.15, 0.45, 0]} rotation={[0, 0, 0.8]}>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial color="#16a34a" />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Montsamaisa: ultrasonic rings detect obstacle → haptic pulse     */
/* ------------------------------------------------------------------ */

function WalkingStick() {
  const p = usePalette();
  const rings = useRef<THREE.Group>(null);
  const obstacle = useRef<THREE.MeshStandardMaterial>(null);
  const handle = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    let hitting = false;
    rings.current?.children.forEach((c, i) => {
      const k = (t * 0.7 + i / 3) % 1;
      c.position.z = 0.2 + k * 2.6;
      c.scale.setScalar(0.3 + k * 1.4);
      ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - k);
      if (k > 0.85) hitting = true;
    });
    if (obstacle.current) obstacle.current.emissiveIntensity = hitting ? 0.8 : 0.05;
    if (handle.current) handle.current.position.x = hitting ? Math.sin(t * 80) * 0.015 : 0;
  });
  return (
    <group rotation={[0, -0.6, 0]} position={[-0.6, 0, 0]}>
      {/* cane */}
      <group rotation={[0.35, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 3.2, 16]} />
          <meshStandardMaterial color={p.fg} />
        </mesh>
        <mesh ref={handle} position={[0, 1.65, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.06, 12, 24, Math.PI]} />
          <meshStandardMaterial color={p.cyan} />
        </mesh>
        <Label position={[0.6, 1.7, 0]} color={p.cyan}>haptic + audio</Label>
        {/* sensor head */}
        <mesh position={[0, 0.4, 0.07]}>
          <boxGeometry args={[0.22, 0.3, 0.16]} />
          <meshStandardMaterial color={p.amber} />
        </mesh>
        <group ref={rings} position={[0, 0.4, 0]}>
          {Array.from({ length: 3 }).map((_, i) => (
            <mesh key={i}>
              <torusGeometry args={[0.25, 0.015, 8, 48]} />
              <meshBasicMaterial color={p.amber} transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      </group>
      {/* head-level obstacle a normal cane misses */}
      <mesh position={[0, 1.1, 2.9]}>
        <boxGeometry args={[1.3, 0.25, 0.25]} />
        <meshStandardMaterial ref={obstacle} color={p.muted} emissive={p.amber} emissiveIntensity={0.05} />
      </mesh>
      <Label position={[0, 1.55, 2.9]} color={p.amber}>head-level obstacle</Label>
      <GroundGrid p={p} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Ventilator: MIT eVent-style bag compression cycle                */
/* ------------------------------------------------------------------ */

function Ventilator() {
  const p = usePalette();
  const bag = useRef<THREE.Mesh>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const flow = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // inspiration (compress) ~1/3 of the cycle, expiration ~2/3 → 1:2 I:E
    const cycle = (t % 3) / 3;
    const squeeze = cycle < 1 / 3 ? Math.sin((cycle * 3 * Math.PI) / 2) : Math.cos(((cycle - 1 / 3) * 1.5 * Math.PI) / 2);
    const s = Math.max(0, squeeze);
    if (bag.current) bag.current.scale.set(1 - s * 0.35, 1, 1);
    if (leftArm.current) leftArm.current.rotation.z = -0.5 + s * 0.4;
    if (rightArm.current) rightArm.current.rotation.z = 0.5 - s * 0.4;
    if (flow.current) {
      flow.current.visible = cycle < 1 / 3;
      flow.current.position.x = 1.05 + ((t * 2) % 1) * 1.1;
    }
  });
  return (
    <group position={[-0.3, 0, 0]}>
      {/* frame */}
      <mesh>
        <boxGeometry args={[2.2, 1.8, 1.3]} />
        <meshBasicMaterial color={p.cyan} wireframe transparent opacity={0.35} />
      </mesh>
      {/* resuscitator bag */}
      <mesh ref={bag} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.35, 0.8, 8, 24]} />
        <meshStandardMaterial color={p.amber} roughness={0.5} />
      </mesh>
      {/* paddles */}
      <group ref={leftArm} position={[-0.2, 0.75, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.9, 0.06, 0.7]} />
          <meshStandardMaterial color={p.fg} metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
      <group ref={rightArm} position={[-0.2, -0.75, 0]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.9, 0.06, 0.7]} />
          <meshStandardMaterial color={p.fg} metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
      {/* controller */}
      <mesh position={[-0.7, -0.6, 0.66]}>
        <boxGeometry args={[0.6, 0.35, 0.05]} />
        <meshStandardMaterial color={p.cyan} emissive={p.cyan} emissiveIntensity={p.glow ? 0.4 : 0} />
      </mesh>
      <Label position={[-0.7, -1.1, 0.7]} color={p.cyan}>closed-loop µC · rate · I:E</Label>
      {/* patient circuit */}
      <mesh position={[1.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 1.3, 12]} />
        <meshStandardMaterial color={p.muted} transparent opacity={0.6} />
      </mesh>
      <mesh ref={flow} position={[1.1, 0, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color={p.cyan} />
      </mesh>
      <Label position={[1.6, 0.45, 0]} color={p.amber}>breath delivered</Label>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* 6. CLEWS nexus: Climate · Land · Energy · Water with flowing links  */
/* ------------------------------------------------------------------ */

function FlowLink({ from, to, color, speed = 0.5, offset = 0 }: { from: THREE.Vector3; to: THREE.Vector3; color: string; speed?: number; offset?: number }) {
  const dot = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const k = (clock.getElapsedTime() * speed + offset) % 1;
    dot.current?.position.lerpVectors(from, to, k);
  });
  return (
    <group>
      <Line points={[from, to]} color={color} lineWidth={1.2} transparent opacity={0.5} />
      <mesh ref={dot}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function ClewsNexus() {
  const p = usePalette();
  const nodes = useMemo(
    () => [
      { name: "Climate", pos: new THREE.Vector3(0, 1.6, 0), color: p.muted },
      { name: "Land", pos: new THREE.Vector3(-1.6, -0.8, 0.9), color: "#22c55e" },
      { name: "Energy", pos: new THREE.Vector3(1.6, -0.8, 0.9), color: p.amber },
      { name: "Water", pos: new THREE.Vector3(0, -0.8, -1.6), color: p.cyan },
    ],
    [p]
  );
  const pairs: [number, number][] = [
    [0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1],
  ];
  const core = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (core.current) core.current.rotation.y = clock.getElapsedTime() * 0.6;
  });
  return (
    <group>
      {pairs.map(([a, b], i) => (
        <FlowLink key={i} from={nodes[a].pos} to={nodes[b].pos} color={nodes[b].color} offset={i * 0.17} />
      ))}
      {nodes.map((n) => (
        <Float key={n.name} speed={1.5} floatIntensity={0.3}>
          <mesh position={n.pos}>
            <sphereGeometry args={[0.32, 32, 32]} />
            <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={p.glow ? 0.25 : 0} />
          </mesh>
          <Label position={[n.pos.x, n.pos.y + 0.6, n.pos.z]} color={n.color}>{n.name}</Label>
        </Float>
      ))}
      <mesh ref={core}>
        <torusKnotGeometry args={[0.32, 0.07, 96, 12]} />
        <meshStandardMaterial color={p.amber} metalness={0.4} roughness={0.3} />
      </mesh>
      <Label position={[0, -0.05, 0.9]} color={p.fg}>1,000 MW export · FX per m³ water</Label>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* 7. IRP & SADC: interconnected regional power network                */
/* ------------------------------------------------------------------ */



function SadcGrid() {
  const p = usePalette();
  const pts = useMemo(
    () => SADC_NODES.map((n) => ({ ...n, v: new THREE.Vector3((n.lon - 27) * 0.17, 0, (n.lat + 18) * 0.17) })),
    []
  );
  const links: [number, number][] = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 7], [3, 2], [3, 4], [2, 5], [5, 6], [2, 8], [4, 7], [2, 6],
  ];
  const [hover, setHover] = useState<number | null>(null);
  const towers = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    towers.current?.children.forEach((c, i) => {
      c.scale.y = 1 + Math.sin(clock.getElapsedTime() * 2 + i) * 0.15;
    });
  });
  return (
    <group rotation={[0.15, 0, 0]}>
      {links.map(([a, b], i) => (
        <FlowLink key={i} from={pts[a].v} to={pts[b].v} color={a === 0 || b === 0 ? p.amber : p.cyan} speed={0.35} offset={i * 0.13} />
      ))}
      <group ref={towers}>
        {pts.map((n, i) => (
          <mesh
            key={n.name}
            position={[n.v.x, 0.25, n.v.z]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHover(i);
            }}
            onPointerOut={() => setHover(null)}
          >
            <cylinderGeometry args={[0.09, 0.12, i === 0 ? 0.8 : 0.5, 12]} />
            <meshStandardMaterial
              color={i === 0 ? p.amber : p.cyan}
              emissive={i === 0 ? p.amber : p.cyan}
              emissiveIntensity={hover === i ? 0.8 : p.glow ? 0.2 : 0}
            />
          </mesh>
        ))}
      </group>
      {pts.map((n, i) =>
        i === 0 || hover === i ? (
          <Label key={n.name} position={[n.v.x, i === 0 ? 0.95 : 0.75, n.v.z]} color={i === 0 ? p.amber : p.cyan}>
            {n.name}
          </Label>
        ) : null
      )}
      <GroundGrid p={p} y={0} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

export interface ModelConfig {
  component: () => React.ReactElement;
  camera: [number, number, number];
  hint: string;
}

export const projectModels: Record<string, ModelConfig> = {
  "bci-lower-limb-exoskeleton": { component: Exoskeleton, camera: [4.6, 1.3, 6.4], hint: "EEG intent → ML decoder → gait actuation" },
  "anti-poaching-autonomous-drone": { component: Drone, camera: [3.8, 2.4, 4.6], hint: "Autonomous patrol with onboard threat detection" },
  "molemisi-soil-analytics": { component: Molemisi, camera: [3.4, 2.4, 4.6], hint: "Soil probe → IoT → ML/GIS crop recommendation" },
  "montsamaisa-smart-walking-stick": { component: WalkingStick, camera: [4.2, 1.8, 3.6], hint: "Ultrasonic sensing catches head-level hazards" },
  "covid-19-mechanical-ventilator": { component: Ventilator, camera: [2.6, 1.6, 4.4], hint: "Closed-loop bag compression, 1:2 I:E cycle" },
  "clews-1000mw-export-model": { component: ClewsNexus, camera: [0, 1.4, 6.6], hint: "Climate · Land · Energy · Water trade-offs" },
  "botswana-irp-sadc-planning": { component: SadcGrid, camera: [0, 3.8, 4.2], hint: "Hover the nodes: SADC power interconnections" },
  "neus-national-energy-use-survey": { component: NeusEnergyBars, camera: [0, 2.6, 6.2], hint: "Hover bars: household final energy by fuel (TJ)" },
};
