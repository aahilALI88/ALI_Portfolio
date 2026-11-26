"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody, useRapier, type RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import type { DriveInput } from "./controls";
import type { Palette } from "../three/palette";
import { SPAWN } from "./worldData";

export interface RoverState {
  position: THREE.Vector3;
  heading: number; // radians, 0 = facing -Z
  speed: number;
}

const MAX_SPEED = 13;
const BOOST_SPEED = 21;
const REVERSE_SPEED = 6;
const ACCEL = 18;
const BRAKE = 30;
const DRAG = 3.2;
const MAX_STEER = 0.55;
const WHEELBASE = 1.7;
const RIDE_HEIGHT = 0.75;
const WHEEL_R = 0.42;

function Wheel({ position, spin, steer, color, hub }: { position: [number, number, number]; spin: MutableRefObject<number>; steer?: MutableRefObject<number>; color: string; hub: string }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  useFrame(() => {
    if (outer.current && steer) outer.current.rotation.y = steer.current;
    if (inner.current) inner.current.rotation.x = spin.current;
  });
  return (
    <group ref={outer} position={position}>
      <group ref={inner}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[WHEEL_R, WHEEL_R, 0.34, 20]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[WHEEL_R * 0.55, WHEEL_R * 0.55, 0.36, 6]} />
          <meshStandardMaterial color={hub} metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * The Atoms and Bits rover: a kinematic body moved by an arcade driving model,
 * with Rapier's character controller resolving collisions and pushing props.
 */
export default function Rover({
  input,
  state,
  palette: p,
  active,
}: {
  input: MutableRefObject<DriveInput>;
  state: MutableRefObject<RoverState>;
  palette: Palette;
  active: boolean;
}) {
  const body = useRef<RapierRigidBody>(null);
  const chassis = useRef<THREE.Group>(null);
  const { world } = useRapier();
  const spin = useRef(0);
  const steer = useRef(0);
  const antenna = useRef<THREE.Group>(null);

  const controller = useMemo(() => {
    const c = world.createCharacterController(0.05);
    c.setApplyImpulsesToDynamicBodies(true);
    c.setCharacterMass(60);
    c.setSlideEnabled(true);
    c.setUp({ x: 0, y: 1, z: 0 });
    return c;
  }, [world]);

  useEffect(() => () => world.removeCharacterController(controller), [world, controller]);

  const quat = useMemo(() => new THREE.Quaternion(), []);
  const yAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const desired = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, rawDt) => {
    const rb = body.current;
    if (!rb) return;
    const dt = Math.min(rawDt, 1 / 30);
    const s = state.current;
    const i = active ? input.current : { forward: false, backward: false, left: false, right: false, boost: false, brake: false, reset: false };

    if (i.reset) {
      s.position.set(SPAWN[0], RIDE_HEIGHT, SPAWN[1]);
      s.heading = 0;
      s.speed = 0;
      rb.setTranslation({ x: s.position.x, y: s.position.y, z: s.position.z }, true);
      input.current.reset = false;
    }

    // Longitudinal
    const top = i.boost ? BOOST_SPEED : MAX_SPEED;
    if (i.forward) s.speed += (s.speed < 0 ? BRAKE : ACCEL) * dt;
    else if (i.backward) s.speed -= (s.speed > 0 ? BRAKE : ACCEL * 0.7) * dt;
    else s.speed -= Math.sign(s.speed) * Math.min(Math.abs(s.speed), DRAG * dt * (1 + Math.abs(s.speed) * 0.15));
    if (i.brake) s.speed -= Math.sign(s.speed) * Math.min(Math.abs(s.speed), BRAKE * dt);
    s.speed = THREE.MathUtils.clamp(s.speed, -REVERSE_SPEED, top);

    // Steering (smoothed), with less lock at speed
    const targetSteer = (i.left ? 1 : 0) - (i.right ? 1 : 0);
    const lock = MAX_STEER * (1 - Math.min(Math.abs(s.speed) / 40, 0.5));
    steer.current = THREE.MathUtils.damp(steer.current, targetSteer * lock, 10, dt);
    s.heading += (s.speed * Math.tan(steer.current) / WHEELBASE) * dt;

    // Desired movement, resolved against the world
    desired.set(-Math.sin(s.heading), 0, -Math.cos(s.heading)).multiplyScalar(s.speed * dt);
    const collider = rb.collider(0);
    controller.computeColliderMovement(collider, desired, undefined, undefined, (c) => !c.isSensor());
    const moved = controller.computedMovement();

    // Extra shove for dynamic props, so crates and pins fly like toys
    for (let k = 0; k < controller.numComputedCollisions(); k++) {
      const hit = controller.computedCollision(k);
      const other = hit?.collider?.parent();
      if (other && other.isDynamic()) {
        const f = Math.abs(s.speed) * 0.9;
        const dir = Math.sign(s.speed) || 1;
        other.applyImpulse({ x: -Math.sin(s.heading) * f * dir, y: f * 0.35, z: -Math.cos(s.heading) * f * dir }, true);
      }
    }

    // Lose speed when blocked by something solid
    const wanted = Math.hypot(desired.x, desired.z);
    const got = Math.hypot(moved.x, moved.z);
    if (wanted > 1e-4 && got / wanted < 0.5) s.speed *= 0.6;

    s.position.set(s.position.x + moved.x, RIDE_HEIGHT, s.position.z + moved.z);
    rb.setNextKinematicTranslation({ x: s.position.x, y: RIDE_HEIGHT, z: s.position.z });
    quat.setFromAxisAngle(yAxis, s.heading);
    rb.setNextKinematicRotation(quat);

    // Cosmetics: wheel spin, body roll/pitch, antenna wobble
    spin.current -= (s.speed * dt) / WHEEL_R;
    if (chassis.current) {
      chassis.current.rotation.z = THREE.MathUtils.damp(chassis.current.rotation.z, -steer.current * s.speed * 0.012, 6, dt);
      const accel = (i.forward ? 1 : 0) - (i.backward || i.brake ? 1 : 0);
      chassis.current.rotation.x = THREE.MathUtils.damp(chassis.current.rotation.x, accel * 0.04, 5, dt);
    }
    if (antenna.current) antenna.current.rotation.x = THREE.MathUtils.damp(antenna.current.rotation.x, s.speed * 0.03, 4, dt);
  });

  const tyre = "#1f2937";
  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={[SPAWN[0], RIDE_HEIGHT, SPAWN[1]]}
    >
      <CuboidCollider args={[0.95, 0.45, 1.45]} position={[0, 0.15, 0]} />
      <group ref={chassis}>
        {/* body */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.6, 0.5, 2.6]} />
          <meshStandardMaterial color={p.cyan} metalness={0.3} roughness={0.45} />
        </mesh>
        {/* cabin / sensor deck */}
        <mesh position={[0, 0.62, 0.25]} castShadow>
          <boxGeometry args={[1.2, 0.36, 1.2]} />
          <meshStandardMaterial color={p.surface} metalness={0.5} roughness={0.3} />
        </mesh>
        {/* windscreen */}
        <mesh position={[0, 0.64, -0.36]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[1.1, 0.3, 0.04]} />
          <meshStandardMaterial color={p.amber} emissive={p.amber} emissiveIntensity={p.glow ? 0.6 : 0.1} />
        </mesh>
        {/* Atoms and Bits "bit" on the roof */}
        <mesh position={[0, 0.88, 0.25]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <boxGeometry args={[0.36, 0.16, 0.36]} />
          <meshStandardMaterial color={p.amber} />
        </mesh>
        {/* headlights */}
        {[-0.55, 0.55].map((x) => (
          <mesh key={x} position={[x, 0.25, -1.31]}>
            <boxGeometry args={[0.28, 0.14, 0.04]} />
            <meshBasicMaterial color={p.fg} />
          </mesh>
        ))}
        {/* tail lights */}
        {[-0.6, 0.6].map((x) => (
          <mesh key={x} position={[x, 0.25, 1.31]}>
            <boxGeometry args={[0.24, 0.1, 0.04]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        ))}
        {/* antenna */}
        <group ref={antenna} position={[0.5, 0.8, 0.75]}>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.9, 6]} />
            <meshStandardMaterial color={p.fg} />
          </mesh>
          <mesh position={[0, 0.92, 0]}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshBasicMaterial color={p.amber} />
          </mesh>
        </group>
      </group>
      <Wheel position={[-0.92, -0.33, -0.85]} spin={spin} steer={steer} color={tyre} hub={p.fg} />
      <Wheel position={[0.92, -0.33, -0.85]} spin={spin} steer={steer} color={tyre} hub={p.fg} />
      <Wheel position={[-0.92, -0.33, 0.85]} spin={spin} color={tyre} hub={p.fg} />
      <Wheel position={[0.92, -0.33, 0.85]} spin={spin} color={tyre} hub={p.fg} />
    </RigidBody>
  );
}
