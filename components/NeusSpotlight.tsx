import Link from "next/link";
import { ArrowUpRight, Hand } from "lucide-react";
import { getProjectBySlug, neusSource } from "@/data/portfolioData";
import { NeusScene } from "./three";
import { Reveal } from "./ui";

/** NEUS 2022/23 headline results with an interactive 3D energy-mix chart. */
export default function NeusSpotlight() {
  const neus = getProjectBySlug("neus-national-energy-use-survey");
  if (!neus) return null;
  const facts = neus.caseStudy.outcomes.facts;

  return (
    <section className="py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              <span className="text-amber">//</span> Data spotlight · NEUS 2022/23
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              How Botswana&apos;s households use energy.
            </h2>
            <p className="mt-3 text-muted">
              Headline results of Botswana&apos;s first National Energy Use Survey, conducted by the Department of
              Energy with Statistics Botswana and BITRI.
            </p>
          </div>
          <Link href={`/projects/${neus.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber">
            Full case study <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="card-shadow relative overflow-hidden rounded-3xl border border-line bg-surface">
              <NeusScene className="h-[380px] w-full sm:h-[440px]" />
              <p className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-2.5 py-1 font-mono text-[10px] text-muted backdrop-blur">
                <Hand className="h-3 w-3" aria-hidden /> hover bars · drag to rotate
              </p>
              <p className="border-t border-line px-5 py-3 text-xs text-muted">
                Household Total Final Consumption by fuel: 43,001.66 TJ per year.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 lg:col-span-5">
            {facts.map((f, i) => (
              <Reveal key={f.label} delay={i * 50}>
                <div className="card-shadow h-full rounded-xl border border-line bg-surface p-4">
                  <p className="font-mono text-[10px] uppercase leading-snug tracking-wider text-muted">{f.label}</p>
                  <p className={`mt-1.5 text-sm font-semibold leading-snug ${i % 2 ? "text-cyan" : "text-amber"}`}>{f.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <p className="mt-5 text-xs text-muted">{neusSource}</p>
      </div>
    </section>
  );
}
