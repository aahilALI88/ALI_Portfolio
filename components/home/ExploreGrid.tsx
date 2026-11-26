import Link from "next/link";
import { ArrowUpRight, Boxes, BookOpenText, Briefcase, Car, GraduationCap, type LucideIcon } from "lucide-react";
import { projects, publications } from "@/data/portfolioData";
import { Reveal, TiltCard } from "@/components/ui";

const items: { href: string; title: string; detail: string; icon: LucideIcon; accent: string; meta: string }[] = [
  {
    href: "/explore",
    title: "Drive the 3D world",
    detail: "Take the Atoms and Bits rover around a physics playground. Find every zone, stop at project pedestals and smash the bits.",
    icon: Car,
    accent: "text-cyan",
    meta: "WASD · touch",
  },
  {
    href: "/projects",
    title: "Projects",
    detail: "Hardware, robotics, AI and energy models, each with an interactive 3D model and case study.",
    icon: Boxes,
    accent: "text-cyan",
    meta: `${projects.length} case studies`,
  },
  {
    href: "/research",
    title: "Research & Publications",
    detail: "Doctoral research, national policy inputs, NEUS 2022/23 results and IAEA/SADC outputs.",
    icon: BookOpenText,
    accent: "text-amber",
    meta: `${publications.length} outputs`,
  },
  {
    href: "/experience",
    title: "Work Profile",
    detail: "BITRI, the IAEA counterpart role and Atoms and Bits, mapped on an interactive 3D globe.",
    icon: Briefcase,
    accent: "text-cyan",
    meta: "10+ years",
  },
  {
    href: "/education",
    title: "Education",
    detail: "PhD in Global Energy Policy, MBA in MIS and BEng (Hons) Computer Engineering.",
    icon: GraduationCap,
    accent: "text-amber",
    meta: "3 degrees",
  },
];

export default function ExploreGrid() {
  return (
    <section className="border-t border-line py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span className="text-amber">//</span> Explore
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">Step inside the work.</h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:[&>*:first-child]:row-span-2">
          {items.map((it, i) => (
            <Reveal key={it.href} delay={i * 70}>
              <TiltCard className="h-full rounded-2xl">
                <Link
                  href={it.href}
                  className="card-shadow group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-muted/60"
                >
                  <div className="flex items-center justify-between">
                    <it.icon className={`h-6 w-6 ${it.accent}`} aria-hidden />
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{it.meta}</span>
                  </div>
                  <p className="mt-6 text-xl font-semibold text-fg">{it.title}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{it.detail}</p>
                  <span className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold ${it.accent}`}>
                    Open
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
