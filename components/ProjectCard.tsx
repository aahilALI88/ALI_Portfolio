import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/portfolioData";
import { domainStyles } from "./domainStyles";
import { getProjectIcon } from "./projectIcons";

export default function ProjectCard({ project }: { project: Project }) {
  const s = domainStyles[project.domain];
  const Icon = getProjectIcon(project.slug);

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`Read case study: ${project.title}`}
      className={`card-shadow group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 ${s.ring} ${s.hoverBorder}`}
    >
      <div className={`glow absolute inset-x-0 top-0 h-px ${s.dot} opacity-60`} aria-hidden />

      <div className="flex items-start justify-between gap-4">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border ${s.border} ${s.bg}`}>
          <Icon className={`h-5 w-5 ${s.text}`} aria-hidden />
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {project.highlight && (
            <span
              className={`badge rounded-full border ${s.border} ${s.bg} px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${s.text}`}
            >
              {project.highlight}
            </span>
          )}
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            {String(project.id).padStart(2, "0")}
          </span>
        </div>
      </div>

      <p className={`mt-5 font-mono text-[11px] uppercase tracking-[0.15em] ${s.text}`}>{project.label}</p>
      <h3 className="mt-2 text-lg font-semibold leading-snug text-fg">{project.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>

      <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded border border-line bg-ink/60 px-2 py-1 font-mono text-[11px] text-muted">
            {tag}
          </li>
        ))}
      </ul>

      <span className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${s.text}`}>
        Read case study
        <ArrowUpRight
          className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
