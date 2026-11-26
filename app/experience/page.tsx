import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Atom, Building2, Hand } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import TechStack from "@/components/TechStack";
import AtomsBitsLogo from "@/components/AtomsBitsLogo";
import { GlobeScene } from "@/components/three";
import { Reveal, TiltCard } from "@/components/ui";
import { workProfile, type Role } from "@/data/portfolioData";

export const metadata: Metadata = {
  title: "Work Profile",
  description:
    "Founder of Atoms and Bits (Pty) Ltd, IAEA Energy Planning Representative for Botswana and Energy Associate Researcher at BITRI since 2016.",
};

const roleStyle: Record<Role["domain"], { text: string; border: string; dot: string }> = {
  company: { text: "text-brand", border: "border-cyan/40", dot: "bg-gradient-to-r from-cyan to-amber" },
  energy: { text: "text-amber", border: "border-amber/30", dot: "bg-amber" },
  engineering: { text: "text-cyan", border: "border-cyan/30", dot: "bg-cyan" },
};

function RoleIcon({ domain }: { domain: Role["domain"] }) {
  if (domain === "company") return <AtomsBitsLogo className="h-6 w-6" />;
  if (domain === "energy") return <Atom className="h-6 w-6 text-amber" aria-hidden />;
  return <Building2 className="h-6 w-6 text-cyan" aria-hidden />;
}

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Work Profile"
        title={
          <>
            From Gaborone to <span className="text-cyan">SADC</span> and the <span className="text-amber">IAEA</span>.
          </>
        }
        description="More than a decade of energy research at BITRI, Botswana's IAEA energy planning counterpart role, and the founding of Atoms and Bits."
      >
        <div className="card-shadow relative mt-10 overflow-hidden rounded-3xl border border-line bg-surface">
          <GlobeScene className="h-[380px] w-full sm:h-[480px]" />
          <p className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-2.5 py-1 font-mono text-[10px] text-muted backdrop-blur">
            <Hand className="h-3 w-3" aria-hidden /> drag the globe · hover the points
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line px-5 py-3 text-xs text-muted">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber" /> Gaborone (base)</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan" /> SADC partners under IAEA AFRA</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-fg" /> IAEA (Vienna) · University of South Wales (UK)</span>
          </div>
        </div>
      </PageHeader>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <ol className="relative space-y-6 border-l border-line pl-8">
            {workProfile.map((r, i) => {
              const st = roleStyle[r.domain];
              return (
                <li key={r.role} className="relative">
                  <span className={`absolute -left-[37px] top-7 h-3 w-3 rounded-full ring-4 ring-ink ${st.dot}`} aria-hidden />
                  <Reveal delay={i * 80}>
                    <TiltCard className="rounded-2xl" max={4}>
                      <article className={`card-shadow rounded-2xl border bg-surface p-6 sm:p-7 ${r.domain === "company" ? st.border : "border-line"}`}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <RoleIcon domain={r.domain} />
                            <div>
                              <h2 className="font-semibold leading-snug text-fg">{r.role}</h2>
                              <p className={`text-sm font-medium ${st.text}`}>{r.organisation}</p>
                            </div>
                          </div>
                          <span className="font-mono text-xs text-muted">{r.period}</span>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-muted">{r.summary}</p>
                        <ul className="mt-3 space-y-1.5 text-sm text-fg/90">
                          {r.highlights.map((h) => (
                            <li key={h} className="flex gap-2">
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" aria-hidden />
                              {h}
                            </li>
                          ))}
                        </ul>
                        {r.href && (
                          <Link href={r.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan">
                            Visit company page <ArrowUpRight className="h-4 w-4" aria-hidden />
                          </Link>
                        )}
                      </article>
                    </TiltCard>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <TechStack />
    </>
  );
}
