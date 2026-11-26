"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export interface SceneCanvasProps {
  children: ReactNode;
  /** Camera position [x, y, z]. */
  camera?: [number, number, number];
  fov?: number;
  /** Drag-to-rotate. Zoom & pan stay disabled so page scrolling is never hijacked. */
  orbit?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  className?: string;
  label: string;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Mounts a WebGL canvas only when it scrolls near the viewport and pauses
 * rendering when off-screen, so pages with several scenes stay fast.
 */
export default function SceneCanvas({
  children,
  camera = [0, 0, 6],
  fov = 45,
  orbit = true,
  autoRotate = false,
  autoRotateSpeed = 0.6,
  className = "",
  label,
}: SceneCanvasProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`} role="img" aria-label={label}>
      {mounted ? (
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: camera, fov }}
          frameloop={visible && !reduced ? "always" : "demand"}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ touchAction: "pan-y" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.55} />
            <directionalLight position={[4, 6, 5]} intensity={1.2} />
            <pointLight position={[-5, -3, -4]} intensity={0.6} />
            {children}
            {orbit && (
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={autoRotate && !reduced}
                autoRotateSpeed={autoRotateSpeed}
                enableDamping
              />
            )}
          </Suspense>
        </Canvas>
      ) : (
        <div className="absolute inset-0 animate-pulse rounded-2xl bg-surface/40" aria-hidden />
      )}
    </div>
  );
}
