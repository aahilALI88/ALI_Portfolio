"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Gauge,
  Keyboard,
  LayoutGrid,
  RotateCcw,
  X,
  Zap,
} from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { palettes } from "../three/palette";
import ThemeSwitcher from "../ThemeSwitcher";
import AtomsBitsLogo from "../AtomsBitsLogo";
import { emptyInput, useDriveInput, type DriveInput } from "./controls";
import Rover, { type RoverState } from "./Rover";
import Environment, { worldColors } from "./Environment";
import { BitCrates, BowlingPins, Batteries } from "./Props";
import { CompanyExhibit, ContactExhibit, EducationExhibit, ExperienceExhibit, ProjectPedestals, ResearchExhibit } from "./Exhibits";
import { ALL_ZONES, AREAS, SPAWN, type WorldZone } from "./worldData";
import { profile } from "@/data/portfolioData";

/* ------------------------------------------------------------------ */
/* In-canvas rigs                                                      */
/* ------------------------------------------------------------------ */

const CAM_OFFSET = new THREE.Vector3(0, 10.5, 15);

function CameraRig({ state, zoom }: { state: MutableRefObject<RoverState>; zoom: number }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const s = state.current;
    // Look slightly ahead of the rover in its direction of travel
    const ahead = THREE.MathUtils.clamp(s.speed, -6, 20) * 0.25;
    look.set(s.position.x - Math.sin(s.heading) * ahead, 0, s.position.z - Math.cos(s.heading) * ahead);
    target.copy(look).addScaledVector(CAM_OFFSET, zoom);
    camera.position.lerp(target, 1 - Math.exp(-3.5 * dt));
    camera.lookAt(camera.position.x - CAM_OFFSET.x * zoom, 0, camera.position.z - CAM_OFFSET.z * zoom);
  });
  return null;
}

function SunRig({ state, theme }: { state: MutableRefObject<RoverState>; theme: string }) {
  const light = useRef<THREE.DirectionalLight>(null);
  useFrame(() => {
    const l = light.current;
    if (!l) return;
    const { x, z } = state.current.position;
    l.position.set(x + 12, 22, z + 8);
    l.target.position.set(x, 0, z);
    l.target.updateMatrixWorld();
  });
  return (
    <directionalLight
      ref={light}
      intensity={theme === "light" ? 1.8 : 2.2}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-30}
      shadow-camera-right={30}
      shadow-camera-top={30}
      shadow-camera-bottom={-30}
      shadow-camera-near={1}
      shadow-camera-far={70}
      shadow-bias={-0.0005}
    />
  );
}

function ZoneTracker({ state, onChange }: { state: MutableRefObject<RoverState>; onChange: (z: WorldZone | null) => void }) {
  const current = useRef<string | null>(null);
  useFrame(() => {
    const { x, z } = state.current.position;
    // Pedestals are listed first so they win over the hub area
    const hit = ALL_ZONES.find((zone) => Math.hypot(x - zone.pos[0], z - zone.pos[1]) < zone.radius) ?? null;
    const id = hit?.id ?? null;
    if (id !== current.current) {
      current.current = id;
      onChange(hit);
    }
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Touch controls                                                      */
/* ------------------------------------------------------------------ */

function TouchButton({
  input,
  k,
  label,
  children,
  className = "",
}: {
  input: MutableRefObject<DriveInput>;
  k: keyof DriveInput;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const set = (v: boolean) => (e: React.PointerEvent) => {
    e.preventDefault();
    input.current[k] = v;
  };
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={set(true)}
      onPointerUp={set(false)}
      onPointerLeave={set(false)}
      onPointerCancel={set(false)}
      onContextMenu={(e) => e.preventDefault()}
      className={`grid h-14 w-14 select-none place-items-center rounded-2xl border border-line bg-surface/80 text-fg backdrop-blur active:bg-cyan active:text-ink ${className}`}
      style={{ touchAction: "none" }}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* World                                                               */
/* ------------------------------------------------------------------ */

function accentClass(a: WorldZone["accent"]) {
  return a === "amber" ? "text-amber" : a === "brand" ? "text-brand" : "text-cyan";
}

export default function World() {
  const { theme } = useTheme();
  const p = palettes[theme];
  const colors = worldColors(theme, p);
  const router = useRouter();

  const [started, setStarted] = useState(false);
  const [zone, setZone] = useState<WorldZone | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const [zoom, setZoom] = useState(1);
  const [speed, setSpeed] = useState(0);
  const [coarse, setCoarse] = useState(false);
  const input = useDriveInput(started);
  const state = useRef<RoverState>({ position: new THREE.Vector3(SPAWN[0], 0.75, SPAWN[1]), heading: 0, speed: 0 });

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
    // Pull the camera back on narrow screens so more of the world fits
    if (window.innerWidth < 640) setZoom(1.35);
    const id = window.setInterval(() => setSpeed(Math.round(Math.abs(state.current.speed) * 3.6)), 200);
    return () => window.clearInterval(id);
  }, []);

  const onZone = useCallback((z: WorldZone | null) => {
    setZone(z);
    if (z && AREAS.some((a) => a.id === z.id)) setVisited((v) => (v.has(z.id) ? v : new Set(v).add(z.id)));
  }, []);

  // Enter opens the current zone; Esc shows the intro again; +/- zoom
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!started) return;
      if (e.key === "Enter" && zone) router.push(zone.href);
      if (e.key === "Escape") setStarted(false);
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.max(0.6, z - 0.1));
      if (e.key === "-" || e.key === "_") setZoom((z) => Math.min(1.6, z + 0.1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, zone, router]);

  useEffect(() => {
    if (!started) input.current = emptyInput();
  }, [started, input]);

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden bg-ink">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [SPAWN[0], 10.5, SPAWN[1] + 15], fov: 42, near: 0.5, far: 400 }}
        onWheel={(e) => setZoom((z) => THREE.MathUtils.clamp(z + Math.sign(e.deltaY) * 0.08, 0.6, 1.6))}
      >
        <color attach="background" args={[colors.ground]} />
        <fog attach="fog" args={[colors.ground, 45, 110]} />
        <hemisphereLight args={[theme === "light" ? "#fff7e6" : "#dbe4f0", colors.ground, theme === "light" ? 1 : 0.95]} />
        <ambientLight intensity={theme === "light" ? 0.3 : 0.35} />
        <SunRig state={state} theme={theme} />
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]} timeStep="vary">
            <Environment p={p} c={colors} />
            <ProjectPedestals p={p} activeId={zone?.id ?? null} paint={colors.paintMuted} />
            <ResearchExhibit p={p} paint={colors.paintMuted} />
            <ExperienceExhibit p={p} />
            <EducationExhibit p={p} />
            <CompanyExhibit p={p} />
            <ContactExhibit p={p} paint={colors.paint} email={profile.email} />
            <BitCrates p={p} origin={[0, -12]} paint={colors.paintMuted} />
            <BowlingPins p={p} origin={[20, -1]} paint={colors.paintMuted} />
            <Batteries p={p} spots={[[-22, 3], [-24, 6], [-19, 7]]} />
            <Rover input={input} state={state} palette={p} active={started} />
          </Physics>
        </Suspense>
        <CameraRig state={state} zoom={zoom} />
        <ZoneTracker state={state} onChange={onZone} />
      </Canvas>

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-5">
        <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-line bg-surface/85 px-3 py-2 backdrop-blur">
          <AtomsBitsLogo className="h-5 w-5" />
          <span className="font-mono text-xs font-semibold tracking-[0.15em] text-fg">{profile.monogram}</span>
          <span className="hidden font-mono text-[10px] text-muted sm:inline">· 3D world</span>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <ThemeSwitcher className="hidden sm:inline-flex" />
          <button
            type="button"
            onClick={() => setStarted(false)}
            className="hidden items-center gap-1.5 rounded-lg border border-line bg-surface/85 px-3 py-2 text-xs text-fg backdrop-blur sm:inline-flex"
          >
            <Keyboard className="h-3.5 w-3.5" aria-hidden /> Controls
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/85 px-3 py-2 text-xs font-semibold text-fg backdrop-blur hover:border-cyan/50"
          >
            <LayoutGrid className="h-3.5 w-3.5" aria-hidden /> Classic site
          </Link>
        </div>
      </div>

      {/* HUD */}
      {started && (
        <div className="pointer-events-none absolute left-3 top-16 flex flex-col gap-2 sm:left-5 sm:top-20">
          <div className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface/80 px-3 py-1.5 font-mono text-xs text-fg backdrop-blur">
            <Gauge className="h-3.5 w-3.5 text-cyan" aria-hidden /> {speed} km/h
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface/80 px-3 py-1.5 font-mono text-xs text-fg backdrop-blur">
            Zones found <span className="text-amber">{visited.size}/{AREAS.length}</span>
          </div>
        </div>
      )}

      {/* Zone panel */}
      {started && zone && (
        <div className="absolute inset-x-3 bottom-24 mx-auto max-w-lg sm:bottom-6">
          <div className="page-enter rounded-2xl border border-line bg-surface/95 p-5 shadow-2xl backdrop-blur">
            <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${accentClass(zone.accent)}`}>
              {zone.id.startsWith("project-") ? `Project ${zone.label}` : "You found"}
            </p>
            <h2 className="mt-1 text-lg font-semibold leading-snug text-fg">{zone.title}</h2>
            <p className="mt-1.5 line-clamp-3 text-sm text-muted">{zone.blurb}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <Link
                href={zone.href}
                className="inline-flex items-center gap-1.5 rounded-md bg-cyan px-4 py-2 text-sm font-semibold text-ink hover:opacity-90"
              >
                {zone.cta} <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
              <span className="hidden font-mono text-[10px] text-muted sm:inline">press Enter ↵</span>
            </div>
          </div>
        </div>
      )}

      {/* Touch controls */}
      {started && coarse && (
        <>
          <div className="absolute bottom-5 left-4 flex gap-2">
            <TouchButton input={input} k="left" label="Steer left">
              <ArrowLeft className="h-6 w-6" />
            </TouchButton>
            <TouchButton input={input} k="right" label="Steer right">
              <ArrowRight className="h-6 w-6" />
            </TouchButton>
          </div>
          <div className="absolute bottom-5 right-4 flex items-end gap-2">
            <TouchButton input={input} k="boost" label="Boost" className="h-12 w-12">
              <Zap className="h-5 w-5" />
            </TouchButton>
            <div className="flex flex-col gap-2">
              <TouchButton input={input} k="forward" label="Accelerate">
                <ArrowUp className="h-6 w-6" />
              </TouchButton>
              <TouchButton input={input} k="backward" label="Brake / reverse">
                <ArrowDown className="h-6 w-6" />
              </TouchButton>
            </div>
          </div>
        </>
      )}

      {/* Bottom-right hint (desktop) */}
      {started && !coarse && !zone && (
        <p className="pointer-events-none absolute bottom-5 right-5 rounded-lg border border-line bg-surface/80 px-3 py-2 font-mono text-[11px] text-muted backdrop-blur">
          WASD / ↑↓←→ drive · Shift boost · Space brake · R reset · scroll zoom
        </p>
      )}

      {/* Intro / controls overlay */}
      {!started && (
        <div className="absolute inset-0 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm">
          <div className="page-enter w-full max-w-md rounded-3xl bg-gradient-to-br from-cyan to-amber p-px">
            <div className="rounded-[calc(1.5rem-1px)] bg-surface p-7">
              <div className="flex items-center justify-between">
                <AtomsBitsLogo className="h-10 w-10" />
                <Link href="/" aria-label="Back to classic site" className="rounded-md p-1 text-muted hover:text-fg">
                  <X className="h-5 w-5" />
                </Link>
              </div>
              <h1 className="mt-5 text-2xl font-semibold leading-tight text-fg">Drive through Alfred&apos;s portfolio</h1>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Take the Atoms and Bits rover for a spin. Find the six zones (Projects, Research, Experience,
                Education, Atoms &amp; Bits and Contact), stop on a project pedestal, and knock over a few bits along
                the way.
              </p>
              <ul className="mt-5 grid grid-cols-2 gap-2 font-mono text-[11px] text-fg">
                <li className="rounded-lg border border-line px-2.5 py-2">
                  <span className="text-cyan">WASD / ↑↓←→</span> drive
                </li>
                <li className="rounded-lg border border-line px-2.5 py-2">
                  <span className="text-cyan">Shift</span> boost
                </li>
                <li className="rounded-lg border border-line px-2.5 py-2">
                  <span className="text-cyan">Space</span> brake
                </li>
                <li className="rounded-lg border border-line px-2.5 py-2">
                  <span className="text-cyan">Enter</span> open zone
                </li>
                <li className="rounded-lg border border-line px-2.5 py-2">
                  <span className="text-cyan">R</span> reset rover
                </li>
                <li className="rounded-lg border border-line px-2.5 py-2">
                  <span className="text-cyan">Scroll</span> zoom
                </li>
              </ul>
              <p className="mt-3 text-xs text-muted">On a phone or tablet, use the on-screen buttons.</p>
              <button
                type="button"
                autoFocus
                onClick={() => setStarted(true)}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan to-amber px-5 py-3 text-sm font-semibold text-ink transition hover:opacity-90"
              >
                Start driving
              </button>
              <div className="mt-3 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    input.current.reset = true;
                    setStarted(true);
                  }}
                  className="inline-flex items-center gap-1 text-muted hover:text-fg"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset rover
                </button>
                <Link href="/" className="text-muted hover:text-fg">
                  Prefer the classic site →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
