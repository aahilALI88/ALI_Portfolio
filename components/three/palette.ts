"use client";

import { useTheme, type Theme } from "../ThemeProvider";

export interface Palette {
  bg: string;
  surface: string;
  line: string;
  fg: string;
  muted: string;
  cyan: string;
  amber: string;
  /** Whether glowing / additive effects should be used. */
  glow: boolean;
}

// Mirrors the CSS variables in app/globals.css so 3D scenes re-skin with the site.
export const palettes: Record<Theme, Palette> = {
  dark: { bg: "#090d16", surface: "#111827", line: "#1f2937", fg: "#f8fafc", muted: "#94a3b8", cyan: "#38bdf8", amber: "#f59e0b", glow: true },
  light: { bg: "#fafafa", surface: "#ffffff", line: "#cbd5e1", fg: "#0f172a", muted: "#475569", cyan: "#0284c7", amber: "#d97706", glow: false },
  contrast: { bg: "#000000", surface: "#000000", line: "#ffffff", fg: "#ffffff", muted: "#d4d4d4", cyan: "#ffffff", amber: "#ffffff", glow: false },
};

export function usePalette(): Palette {
  const { theme } = useTheme();
  return palettes[theme];
}
