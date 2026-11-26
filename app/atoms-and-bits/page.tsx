import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Hand, Mail, MapPin } from "lucide-react";
import AtomsBitsLogo from "@/components/AtomsBitsLogo";
import { CompanyScene } from "@/components/three";
import { Reveal, TiltCard } from "@/components/ui";
import { pillarIcons } from "@/components/home/CompanySpotlight";
import { domainStyles } from "@/components/domainStyles";
import { getProjectIcon } from "@/components/projectIcons";
import { company, getProjectBySlug, type Project } from "@/data/portfolioData";

export const metadata: Metadata = {
  title: "Atoms and Bits (Pty) Ltd",
  description:
    "Atoms and Bits (Pty) Ltd is an AI-powered research engineering company in Gaborone, Botswana, doing R&D in smart mechatronics, hardware, software and AI. Founded by Alfred K. Pone.",
};

export default function CompanyPage() {
  const founderProjects = company.founderProjects
    .map((slug) => getProjectBySlug(slug))
    .filter((p): p is Project => Boolean(p));
  const enquiry = `mailto:${company.email}?subject=${encodeURIComponent("Project enquiry: Atoms and Bits")}`;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="glow pointer-events-none absolute -right-32 top-0 h-[460px] w-[460px] rounded-full bg-amber/10 blur-3xl" aria-hidden />
        <div className="glow pointer-events-none absolute -left-32 bottom-0 h-[460px] w-[460px] rounded-full bg-cyan/10 blur-3xl" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 pb-14 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
              <AtomsBitsLogo className="h-14 w-14" />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Research engineering company</p>
                <p className="text-lg font-semibold text-fg">{company.legalName}</p>
              </div>
            </div>
            <h1 className="mt-8 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
              <span className="text-cyan">Atoms</span> <span className="text-muted">and</span>{" "}
              <span className="text-amber">Bits</span>
            </h1>
            <p className="mt-4 text-2xl font-semibold tracking-tight">
              <span className="text-brand">{company.tagline}.</span>
            </p>
            <p className="mt-5 max-w-xl leading-relaxed text-muted">{company.pitch}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={enquiry}
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan to-amber px-5 py-2.5 text-sm font-semibold text-ink transition hover:opacity-90"
              >
                <Mail className="h-4 w-4" aria-hidden /> Start a project
              </a>
              <span className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm text-muted">
                <MapPin className="h-4 w-4" aria-hidden /> {company.location}
              </span>
            </div>
          </div>
          <div className="relative">
            <CompanyScene className="aspect-square w-full" />
            <p className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1.5 font-mono text-[10px] text-muted">
              <Hand className="h-3 w-3" aria-hidden /> drag to rotate
            </p>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className="text-cyan">//</span> What we do
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Four disciplines, one R&amp;D team.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {company.pillars.map((pillar, i) => {
              const Icon = pillarIcons[pillar.icon];
              const accent = i % 2 === 0 ? "text-cyan" : "text-amber";
              return (
                <Reveal key={pillar.key} delay={i * 80}>
                  <TiltCard className="h-full rounded-2xl">
                    <div className="card-shadow h-full rounded-2xl border border-line bg-surface p-6">
                      <span className="font-mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <Icon className={`mt-4 h-7 w-7 ${accent}`} aria-hidden />
                      <h3 className="mt-5 text-lg font-semibold text-fg">{pillar.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{pillar.detail}</p>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="border-t border-line py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className="text-amber">//</span> How we work
          </p>
          <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            {company.process.map((p, i) => (
              <Reveal key={p.step} delay={i * 80}>
                <li className="card-shadow relative h-full rounded-2xl border border-line bg-surface p-6">
                  <span className="badge inline-grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-cyan to-amber font-mono text-xs font-bold text-ink">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-semibold text-fg">{p.step}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.detail}</p>
                  {i < company.process.length - 1 && (
                    <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-muted md:block" aria-hidden />
                  )}
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Founder track record */}
      <section className="border-t border-line py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className="text-cyan">//</span> Founder&apos;s track record
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Built by an engineer who ships hardware.
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            {company.founder}. Selected builds from Alfred&apos;s engineering portfolio show the range of capability
            behind the company.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {founderProjects.map((p, i) => {
              const s = domainStyles[p.domain];
              const Icon = getProjectIcon(p.slug);
              return (
                <Reveal key={p.slug} delay={i * 60}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className={`card-shadow group flex h-full items-start gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors ${s.hoverBorder}`}
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border ${s.border} ${s.bg}`}>
                      <Icon className={`h-5 w-5 ${s.text}`} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold leading-snug text-fg">{p.title}</span>
                      <span className="mt-1 block text-sm text-muted">{p.subtitle}</span>
                    </span>
                    <ArrowUpRight className={`ml-auto h-4 w-4 shrink-0 ${s.text}`} aria-hidden />
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-cyan to-amber p-px">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[calc(1.5rem-1px)] bg-ink p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <p className="text-2xl font-semibold text-fg">Have a hardware, AI or research problem?</p>
              <p className="mt-1 text-muted">Tell us about it. We&apos;ll reply from {company.email}.</p>
            </div>
            <a
              href={enquiry}
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-gradient-to-r from-cyan to-amber px-5 py-3 text-sm font-semibold text-ink transition hover:opacity-90"
            >
              <Mail className="h-4 w-4" aria-hidden /> Email Atoms and Bits
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
