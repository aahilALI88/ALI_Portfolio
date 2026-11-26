"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Hand } from "lucide-react";
import { projects } from "@/data/portfolioData";
import { ProjectScene } from "./three";
import { domainStyles } from "./domainStyles";
import { getProjectIcon } from "./projectIcons";

/** Interactive selector: choose a project and explore its 3D model. */
export default function ProjectExplorer() {
  const [index, setIndex] = useState(0);
  const project = projects[index];
  const s = domainStyles[project.domain];

  return (
    <div className="card-shadow grid overflow-hidden rounded-3xl border border-line bg-surface lg:grid-cols-12">
      <div role="tablist" aria-label="Choose a project" className="flex gap-1 overflow-x-auto border-b border-line p-2 lg:col-span-4 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r">
        {projects.map((p, i) => {
          const ps = domainStyles[p.domain];
          const Icon = getProjectIcon(p.slug);
          const active = i === index;
          return (
            <button
              key={p.slug}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setIndex(i)}
              className={`flex min-w-[220px] items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors lg:min-w-0 ${
                active ? `${ps.bg} border ${ps.border}` : "border border-transparent hover:bg-ink/60"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${ps.text}`} aria-hidden />
              <span className={`text-sm leading-snug ${active ? "font-semibold text-fg" : "text-muted"}`}>
                {p.title.split(" — ")[0].replace(/\s*\(.*?\)\s*/g, " ").trim()}
              </span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="relative lg:col-span-8">
        <ProjectScene slug={project.slug} className="h-[360px] w-full sm:h-[440px]" />
        <p className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-2.5 py-1 font-mono text-[10px] text-muted backdrop-blur">
          <Hand className="h-3 w-3" aria-hidden /> drag to rotate
        </p>
        <div className="border-t border-line p-5 sm:p-6">
          <p className={`font-mono text-[11px] uppercase tracking-[0.15em] ${s.text}`}>{project.label}</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
            <div className="max-w-xl">
              <h3 className="text-lg font-semibold leading-snug text-fg">{project.title}</h3>
              <p className="mt-1 text-sm text-muted">{project.subtitle}</p>
            </div>
            <Link
              href={`/projects/${project.slug}`}
              className={`inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-semibold ${s.border} ${s.text} transition-colors hover:bg-surface`}
            >
              Case study <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
