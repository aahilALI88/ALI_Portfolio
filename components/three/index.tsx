"use client";

import dynamic from "next/dynamic";

// three.js only runs in the browser and is heavy, so every scene is
// code-split and loaded client-side with a quiet placeholder.
const placeholder = () => <div className="h-full w-full animate-pulse rounded-2xl bg-surface/40" aria-hidden />;

export const HeroScene = dynamic(() => import("./Scenes").then((m) => m.HeroScene), { ssr: false, loading: placeholder });
export const CompanyScene = dynamic(() => import("./Scenes").then((m) => m.CompanyScene), { ssr: false, loading: placeholder });
export const ProjectScene = dynamic(() => import("./Scenes").then((m) => m.ProjectScene), { ssr: false, loading: placeholder });
export const GlobeScene = dynamic(() => import("./Scenes").then((m) => m.GlobeScene), { ssr: false, loading: placeholder });
export const NeusScene = dynamic(() => import("./Scenes").then((m) => m.NeusScene), { ssr: false, loading: placeholder });
export const EducationScene = dynamic(() => import("./Scenes").then((m) => m.EducationScene), { ssr: false, loading: placeholder });
