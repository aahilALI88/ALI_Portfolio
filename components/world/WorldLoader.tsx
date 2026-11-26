"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import AtomsBitsLogo from "../AtomsBitsLogo";

function Loading() {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-ink">
      <div className="flex flex-col items-center gap-4">
        <AtomsBitsLogo className="h-14 w-14 animate-spin [animation-duration:3s]" />
        <p className="font-mono text-xs tracking-[0.2em] text-muted">LOADING THE 3D WORLD…</p>
      </div>
    </div>
  );
}

// Three.js + Rapier physics (WASM) load only on this route, client-side.
const World = dynamic(() => import("./World"), { ssr: false, loading: Loading });

/**
 * Rendered into <body> via a portal so the full-screen world sits above the
 * site's navbar and footer (outside the page-transition stacking context),
 * and the page behind it can't scroll.
 */
export default function WorldLoader() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  return mounted ? createPortal(<World />, document.body) : <Loading />;
}
