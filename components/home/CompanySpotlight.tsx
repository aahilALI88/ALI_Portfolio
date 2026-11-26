import Link from "next/link";
import { ArrowRight, Bot, BrainCircuit, Code2, Cpu, type LucideIcon } from "lucide-react";
import { company } from "@/data/portfolioData";
import AtomsBitsLogo from "@/components/AtomsBitsLogo";
import { Reveal, TiltCard } from "@/components/ui";

export const pillarIcons: Record<string, LucideIcon> = { bot: Bot, cpu: Cpu, code: Code2, brain: BrainCircuit };

/** Prominent band promoting Atoms and Bits (Pty) Ltd on the home page. */
export default function CompanySpotlight() {
  return (
    <section className="relative px-5 py-10 sm:px-8">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan via-cyan/40 to-amber p-px">
          <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-ink p-7 sm:p-12">
            <div className="glow pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-amber/15 blur-3xl" aria-hidden />
            <div className="glow pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-cyan/15 blur-3xl" aria-hidden />

            <div className="relative grid gap-10 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3">
                  <AtomsBitsLogo className="h-12 w-12" />
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">The company</p>
                    <p className="text-xl font-semibold text-fg">{company.legalName}</p>
                  </div>
                </div>
                <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  <span className="text-brand">{company.tagline}.</span>
                </h2>
                <p className="mt-4 leading-relaxed text-muted">{company.pitch}</p>
                <Link
                  href="/atoms-and-bits"
                  className="mt-7 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan to-amber px-5 py-2.5 text-sm font-semibold text-ink transition hover:opacity-90"
                >
                  Discover Atoms and Bits <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3">
                {company.pillars.map((pillar, i) => {
                  const Icon = pillarIcons[pillar.icon];
                  const accent = i % 2 === 0 ? "text-cyan" : "text-amber";
                  return (
                    <TiltCard key={pillar.key} className="h-full rounded-2xl">
                      <div className="card-shadow h-full rounded-2xl border border-line bg-surface p-5">
                        <Icon className={`h-6 w-6 ${accent}`} aria-hidden />
                        <p className="mt-4 font-semibold text-fg">{pillar.title}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted">{pillar.detail}</p>
                      </div>
                    </TiltCard>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
