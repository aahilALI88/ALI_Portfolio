"use client";

import { useEffect, useRef } from "react";

export interface DriveInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  boost: boolean;
  brake: boolean;
  reset: boolean;
}

export const emptyInput = (): DriveInput => ({
  forward: false,
  backward: false,
  left: false,
  right: false,
  boost: false,
  brake: false,
  reset: false,
});

const KEYMAP: Record<string, keyof DriveInput> = {
  KeyW: "forward",
  ArrowUp: "forward",
  KeyS: "backward",
  ArrowDown: "backward",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
  ShiftLeft: "boost",
  ShiftRight: "boost",
  Space: "brake",
  KeyR: "reset",
};

/**
 * Shared, mutable input state (read every frame by the rover).
 * Keyboard listeners are attached here; touch buttons write to the same ref.
 */
export function useDriveInput(enabled: boolean) {
  const input = useRef<DriveInput>(emptyInput());

  useEffect(() => {
    if (!enabled) return;
    const set = (e: KeyboardEvent, down: boolean) => {
      const k = KEYMAP[e.code];
      if (!k) return;
      // Don't steal keys from form fields / buttons being typed into
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      e.preventDefault();
      input.current[k] = down;
    };
    const onDown = (e: KeyboardEvent) => set(e, true);
    const onUp = (e: KeyboardEvent) => set(e, false);
    const onBlur = () => (input.current = emptyInput());
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [enabled]);

  return input;
}
