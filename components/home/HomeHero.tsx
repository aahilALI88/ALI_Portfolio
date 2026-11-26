import Link from "next/link";
import { ArrowRight, MousePointer2 } from "lucide-react";
import { company, hero } from "@/data/portfolioData";
import { HeroScene } from "@/components/three";
import { domainStyles } from "@/components/domainStyles";
import AtomsBitsLogo from "@/components/AtomsBitsLogo";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="glow pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan/10 via-transparent to-amber/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-5 pb-16 pt-10 sm:px-8 sm:pt-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Link
            href="/atoms-and-bits"
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 py-1 pl-1 pr-3 text-xs text-fg backdrop-blur transition-colors hover:border-cyan/50"
          >
            <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan to-amber px-2 py-0.5 font-semibold text-ink">
              <AtomsBitsLogo className="h-3.5 w-3.5" mono /> Founder
            </span>
            {company.legalName}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>

          <div className="mt-6 flex flex-wrap gap-2">
            {hero.domainPills.map((pill) => {
              const s = domainStyles[pill.domain];
              return (
                <span
                  key={pill.label}
                  className={`badge inline-flex items-center gap-2 rounded-full border ${s.border} ${s.bg} px-3 py-1 font-mono text-[11px] tracking-wide ${s.text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
                  {pill.label}
                </span>
              );
            })}
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-6xl">
            <span className="text-cyan">{hero.headline.lead}</span>{" "}
            <span className="text-muted">{hero.headline.connector}</span>{" "}
            <span className="text-amber">{hero.headline.trail}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Computer engineer, PhD energy-policy researcher, Botswana&apos;s IAEA energy planning representative and
            founder of <span className="font-semibold text-fg">{company.name}</span>, building intelligent hardware
            and the models behind national energy strategy.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-md bg-fg px-5 py-2.5 text-sm font-semibold text-ink transition hover:opacity-90"
            >
              Explore Projects in 3D <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/atoms-and-bits"
              className="inline-flex items-center gap-2 rounded-md border border-line px-5 py-2.5 text-sm font-semibold text-fg transition hover:border-cyan/50"
            >
              <AtomsBitsLogo className="h-4 w-4" /> Atoms and Bits
            </Link>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <HeroScene className="aspect-square w-full" />
          <p className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1.5 font-mono text-[10px] text-muted">
            <MousePointer2 className="h-3 w-3" aria-hidden /> move your pointer
          </p>
        </div>
      </div>
    </section>
  );
}
