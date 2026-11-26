import { company, profile, projects } from "@/data/portfolioData";

export type Vec2 = [number, number]; // [x, z] on the ground plane

export interface WorldZone {
  id: string;
  label: string; // painted on the ground
  title: string; // shown in the panel
  blurb: string;
  href: string;
  cta: string;
  pos: Vec2;
  radius: number;
  accent: "cyan" | "amber" | "brand";
}

export const SPAWN: Vec2 = [0, 8];

// Big area pads. The car "enters" a zone when inside its radius.
export const AREAS: WorldZone[] = [
  {
    id: "projects",
    label: "PROJECTS",
    title: "Projects & case studies",
    blurb: `${projects.length} builds and studies, from a BCI exoskeleton to Botswana's IRP. Drive onto a pedestal to preview one.`,
    href: "/projects",
    cta: "Open all projects",
    pos: [0, -30],
    radius: 4,
    accent: "cyan",
  },
  {
    id: "research",
    label: "RESEARCH",
    title: "Research & publications",
    blurb: "CLEWS nexus PhD research, IRP modelling inputs, NEUS 2022/23 household energy results and IAEA/SADC outputs.",
    href: "/research",
    cta: "Open research",
    pos: [-32, -12],
    radius: 6,
    accent: "amber",
  },
  {
    id: "experience",
    label: "EXPERIENCE",
    title: "Work profile",
    blurb: "BITRI since 2016, Botswana's IAEA energy planning counterpart, and founder of Atoms and Bits.",
    href: "/experience",
    cta: "Open work profile",
    pos: [32, -12],
    radius: 6,
    accent: "cyan",
  },
  {
    id: "education",
    label: "EDUCATION",
    title: "Education",
    blurb: "PhD in Global Energy Policy (EUCLID, GPA 3.8), MBA in MIS (UNICAF) and BEng (Hons) Computer Engineering (UK).",
    href: "/education",
    cta: "Open education",
    pos: [-28, 24],
    radius: 6,
    accent: "amber",
  },
  {
    id: "company",
    label: "ATOMS & BITS",
    title: company.legalName,
    blurb: company.pitch,
    href: "/atoms-and-bits",
    cta: "Visit Atoms and Bits",
    pos: [28, 24],
    radius: 7,
    accent: "brand",
  },
  {
    id: "contact",
    label: "CONTACT",
    title: "Get in touch",
    blurb: `${profile.email} · ${profile.phones.map((p) => p.display).join(" / ")} · ${profile.location}`,
    href: "/contact",
    cta: "Open contact page",
    pos: [0, 40],
    radius: 6,
    accent: "cyan",
  },
];

// Project pedestals, in a ring around the Projects hub.
const HUB = AREAS[0].pos;
const RING = 11;
export const PEDESTALS: (WorldZone & { slug: string; shape: number })[] = projects.map((p, i) => {
  // Offset by half a step so the road from the spawn runs between two pedestals
  const a = Math.PI + ((i + 0.5) / projects.length) * Math.PI * 2;
  return {
    id: `project-${p.slug}`,
    slug: p.slug,
    shape: i,
    label: String(i + 1).padStart(2, "0"),
    title: p.title,
    blurb: p.subtitle,
    href: `/projects/${p.slug}`,
    cta: "Read case study",
    pos: [HUB[0] + Math.sin(a) * RING, HUB[1] + Math.cos(a) * RING] as Vec2,
    radius: 2.4,
    accent: p.domain === "energy" ? "amber" : "cyan",
  };
});

export const ALL_ZONES: WorldZone[] = [...PEDESTALS, ...AREAS];

export const WORLD_HALF = 62; // play area is ±WORLD_HALF on x and z

// Acacia trees and rocks, placed by hand away from zones and roads.
export const TREES: Vec2[] = [
  [-14, 14], [16, 12], [-46, 8], [46, 6], [-50, -30], [50, -30], [-18, -48], [20, -50],
  [-44, 44], [44, 46], [-8, 52], [12, 54], [-54, -6], [55, 18], [-36, -40], [38, -40],
];
export const ROCKS: Vec2[] = [
  [-6, 18], [9, -14], [-25, -9], [26, -7], [-40, 30], [40, -24], [-10, 44], [18, 36], [-48, -18], [52, 32],
];
