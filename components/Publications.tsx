"use client";

import { useState } from "react";
import { BookOpenText, Database, FileText, Globe2, Landmark, type LucideIcon } from "lucide-react";
import {
  profile,
  publicationCategories,
  publications,
  type PublicationCategory,
} from "@/data/portfolioData";
import SectionHeading from "./SectionHeading";
import { domainStyles } from "./domainStyles";

type Filter = "All" | PublicationCategory;

const categoryIcons: Record<PublicationCategory, LucideIcon> = {
  "Doctoral Research": BookOpenText,
  "National Policy": Landmark,
  "IAEA / SADC": Globe2,
  "Dataset & Schema": Database,
};

function requestHref(title: string): string {
  const subject = encodeURIComponent(`Preprint / PDF request: ${title}`);
  return `mailto:${profile.email}?subject=${subject}`;
}

export default function Publications() {
  const [filter, setFilter] = useState<Filter>("All");
  const filters: Filter[] = ["All", ...publicationCategories];
  const visible = filter === "All" ? publications : publications.filter((p) => p.category === filter);

  return (
    <section id="publications" className="border-t border-line py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Research & Technical Outputs"
          title="Publications, doctoral research & technical reports."
          description="Doctoral research, national policy inputs, IAEA/SADC technical cooperation and open modelling deliverables."
        />

        <div role="group" aria-label="Filter outputs" className="mb-8 flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = filter === f;
            const count = f === "All" ? publications.length : publications.filter((p) => p.category === f).length;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
                  active ? "badge border-amber/60 bg-amber/10 text-amber" : "border-line bg-surface text-muted hover:text-fg"
                }`}
              >
                {f} <span className="opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        <ol className="flex flex-col gap-5">
          {visible.map((pub) => {
            const s = domainStyles[pub.domain];
            const Icon = categoryIcons[pub.category];
            return (
              <li
                key={pub.id}
                className={`card-shadow group rounded-2xl border border-line bg-surface p-6 transition-colors sm:p-8 ${s.hoverBorder}`}
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border ${s.border} ${s.bg}`}>
                    <Icon className={`h-5 w-5 ${s.text}`} aria-hidden />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`badge rounded-full border ${s.border} ${s.bg} px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${s.text}`}
                      >
                        {pub.category}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{pub.type}</span>
                    </div>

                    <h3 className="mt-3 text-lg font-semibold leading-snug text-fg sm:text-xl">{pub.title}</h3>
                    {pub.subtitle && <p className="mt-1 text-base text-fg/80">{pub.subtitle}</p>}
                    <p className="mt-3 text-sm leading-relaxed text-muted">{pub.summary}</p>

                    <dl className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Status</dt>
                        <dd className={`mt-0.5 font-medium ${s.text}`}>{pub.status}</dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Institutions</dt>
                        <dd className="mt-0.5 text-fg">{pub.organisations.join(" · ")}</dd>
                      </div>
                      {pub.targetJournals && (
                        <div className="sm:col-span-2">
                          <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">Target journals</dt>
                          <dd className="mt-1.5 flex flex-wrap gap-1.5">
                            {pub.targetJournals.map((j) => (
                              <span key={j} className="rounded border border-line bg-ink/60 px-2 py-1 text-xs italic text-fg">
                                {j}
                              </span>
                            ))}
                          </dd>
                        </div>
                      )}
                      {pub.countries && (
                        <div className="sm:col-span-2">
                          <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">
                            Participating countries ({pub.countries.length})
                          </dt>
                          <dd className="mt-1.5 flex flex-wrap gap-1.5">
                            {pub.countries.map((c) => (
                              <span key={c} className="rounded border border-line bg-ink/60 px-2 py-1 font-mono text-[11px] text-fg">
                                {c}
                              </span>
                            ))}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <a
                    href={requestHref(pub.title)}
                    className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-md border border-line px-4 py-2 text-sm font-semibold text-fg transition-colors hover:border-amber/60 hover:text-amber"
                  >
                    <FileText className="h-4 w-4" aria-hidden /> Request Preprint / PDF
                  </a>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
