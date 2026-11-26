"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";

interface FloorTextProps {
  text: string;
  position: [number, number, number];
  /** World-space height of one line of text. */
  size?: number;
  color: string;
  weight?: number;
  font?: "sans" | "mono";
  rotation?: number; // around Y
  opacity?: number;
}

/**
 * Text painted flat on the ground, drawn once to a canvas texture.
 * No font files to fetch, and it picks up the site's loaded web fonts.
 */
export default function FloorText({
  text,
  position,
  size = 2,
  color,
  weight = 800,
  font = "sans",
  rotation = 0,
  opacity = 1,
}: FloorTextProps) {
  const { texture, aspect } = useMemo(() => {
    const family = font === "mono" ? '"JetBrains Mono Variable", ui-monospace, monospace' : '"Inter Variable", system-ui, sans-serif';
    const px = 160;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = `${weight} ${px}px ${family}`;
    const w = Math.ceil(ctx.measureText(text).width) + px * 0.4;
    const h = Math.ceil(px * 1.3);
    canvas.width = w;
    canvas.height = h;
    ctx.font = `${weight} ${px}px ${family}`;
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(text, w / 2, h / 2);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return { texture: tex, aspect: w / h };
  }, [text, color, weight, font]);

  useEffect(() => () => texture.dispose(), [texture]);

  const height = size * 1.3;
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, rotation]} receiveShadow>
      <planeGeometry args={[height * aspect, height]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
