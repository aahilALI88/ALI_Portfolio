import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, BookOpenText } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EducationExplorer from "@/components/EducationExplorer";
import { Reveal, TiltCard } from "@/components/ui";
import { publications, stack } from "@/data/portfolioData";

export const metadata: Metadata = {
  title: "Education",
  description:
    "Doctorate in Global Energy Policy (EUCLID University, GPA 3.8), MBA in MIS (UNICAF University) and BEng (Hons) Computer Engineering (University of South Wales, UK).",
};

export default function EducationPage() {
  const dissertation = publications.find((p) => p.category === "Doctoral Research");
  const energyTools = stack.find((c) => c.domain === "energy");

  return (
    <>
      <PageHeader
        eyebrow="Education"
        title={
          <>
            Engineering foundations, <span className="text-amber">policy depth.</span>
          </>
        }
        description="A UK computer engineering degree, an MBA specialising in energy management information systems, and a doctorate in global energy policy now at dissertation stage."
      />

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <EducationExplorer />
        </div>
      </section>

      <section className="border-t border-line py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 sm:px-8 lg:grid-cols-2">
          {dissertation && (
            <Reveal>
              <TiltCard className="h-full rounded-2xl" max={4}>
                <div className="card-shadow h-full rounded-2xl border border-line bg-surface p-6 sm:p-7">
                  <BookOpenText className="h-6 w-6 text-amber" aria-hidden />
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-amber">Doctoral dissertation · {dissertation.status}</p>
                  <h2 className="mt-2 text-lg font-semibold leading-snug text-fg">{dissertation.title}</h2>
                  {dissertation.subtitle && <p className="mt-1 text-sm text-muted">{dissertation.subtitle}</p>}
                  <Link href="/research" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-amber">
                    Research & publications <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </TiltCard>
            </Reveal>
          )}
          {energyTools && (
            <Reveal delay={100}>
              <TiltCard className="h-full rounded-2xl" max={4}>
                <div className="card-shadow h-full rounded-2xl border border-line bg-surface p-6 sm:p-7">
                  <BadgeCheck className="h-6 w-6 text-cyan" aria-hidden />
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-cyan">Professional certification</p>
                  <h2 className="mt-2 text-lg font-semibold leading-snug text-fg">{energyTools.subtitle} energy planning tools</h2>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {energyTools.items.map((t) => (
                      <li key={t} className="rounded border border-line bg-ink/60 px-2 py-1 font-mono text-[11px] text-fg">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
