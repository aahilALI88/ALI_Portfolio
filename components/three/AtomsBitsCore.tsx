"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { usePalette } from "./palette";

const ORBITS = [
  { rx: 0.3, ry: 0, speed: 1.1, radius: 1.9 },
  { rx: -0.9, ry: 0.8, speed: 0.8, radius: 2.15 },
  { rx: 1.2, ry: -0.6, speed: 1.4, radius: 2.4 },
];

function Electron({ radius, speed, offset, color }: { radius: number; speed: number; offset: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    ref.current?.position.set(Math.cos(t) * radius, Math.sin(t) * radius, 0);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

/** Cloud of small cubes ("bits") on a spherical shell that blink like data. */
function BitField({ count = 140, color, accent }: { count?: number; color: string; accent: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Fibonacci sphere distribution with radial jitter
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = Math.PI * (3 - Math.sqrt(5)) * i;
        const dist = 3.1 + ((i * 7919) % 100) / 100;
        return {
          pos: new THREE.Vector3(Math.cos(theta) * r * dist, y * dist, Math.sin(theta) * r * dist),
          phase: (i * 0.37) % (Math.PI * 2),
          accent: i % 9 === 0,
        };
      }),
    [count]
  );
  const colors = useMemo(() => {
    const c1 = new THREE.Color(color);
    const c2 = new THREE.Color(accent);
    const arr = new Float32Array(count * 3);
    seeds.forEach((s, i) => (s.accent ? c2 : c1).toArray(arr, i * 3));
    return arr;
  }, [seeds, color, accent, count]);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();
    seeds.forEach((s, i) => {
      const blink = 0.55 + 0.45 * Math.sin(t * 1.6 + s.phase);
      dummy.position.copy(s.pos);
      dummy.rotation.set(t * 0.3 + s.phase, t * 0.2, 0);
      dummy.scale.setScalar(0.07 * blink + 0.02);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.rotation.y = t * 0.05;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </boxGeometry>
      <meshBasicMaterial vertexColors toneMapped={false} />
    </instancedMesh>
  );
}

/**
 * Atoms and Bits signature scene: an atom (physical world) wrapped in
 * a field of bits (digital world), tilting toward the pointer.
 */
export default function AtomsBitsCore({ scale = 1 }: { scale?: number }) {
  const p = usePalette();
  const group = useRef<THREE.Group>(null);
  const nucleus = useRef<THREE.Mesh>(null);

  useFrame(({ pointer, clock }, delta) => {
    const g = group.current;
    if (g) {
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.x * 0.5, 3, delta);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.y * 0.35, 3, delta);
    }
    if (nucleus.current) {
      nucleus.current.rotation.y = clock.getElapsedTime() * 0.4;
      nucleus.current.rotation.z = clock.getElapsedTime() * 0.2;
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.04;
      nucleus.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={group} scale={scale}>
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.6}>
        {/* Nucleus */}
        <mesh ref={nucleus}>
          <icosahedronGeometry args={[0.85, 1]} />
          <meshStandardMaterial color={p.amber} emissive={p.amber} emissiveIntensity={p.glow ? 0.35 : 0.05} flatShading />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.12, 1]} />
          <meshBasicMaterial color={p.amber} wireframe transparent opacity={0.35} />
        </mesh>

        {/* Electron orbits */}
        {ORBITS.map((o, i) => (
          <group key={i} rotation={[o.rx, o.ry, 0]}>
            <mesh>
              <torusGeometry args={[o.radius, 0.012, 8, 128]} />
              <meshBasicMaterial color={p.cyan} transparent opacity={0.65} />
            </mesh>
            <Electron radius={o.radius} speed={o.speed} offset={i * 2.1} color={p.cyan} />
            <Electron radius={o.radius} speed={o.speed} offset={i * 2.1 + Math.PI} color={p.cyan} />
          </group>
        ))}
      </Float>

      <BitField color={p.cyan} accent={p.amber} />
    </group>
  );
}
