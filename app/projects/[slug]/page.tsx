import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Box, Building2, CheckCircle2, Hand, Layers, Target } from "lucide-react";
import { getProjectBySlug, neusSource, projects, type Project } from "@/data/portfolioData";
import { ProjectScene } from "@/components/three";
import MediaSlot from "@/components/MediaSlot";
import { domainStyles } from "@/components/domainStyles";
import { getProjectIcon } from "@/components/projectIcons";

type PageProps = { params: Promise<{ slug: string }> };

// Only the 7 known projects exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: { title: project.title, description: project.description },
  };
}

const domainLabel: Record<Project["domain"], string> = {
  engineering: "Hardware, Robotics & AI",
  energy: "Energy Modelling & Policy",
};

function SectionTitle({ index, icon: Icon, title, accent }: { index: string; icon: typeof Target; title: string; accent: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className={`font-mono text-xs ${accent}`}>{index}</span>
      <Icon className={`h-5 w-5 ${accent}`} aria-hidden />
      <h2 className="text-2xl font-semibold tracking-tight text-fg">{title}</h2>
    </div>
  );
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const s = domainStyles[project.domain];
  const Icon = getProjectIcon(project.slug);
  const { caseStudy } = project;

  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <>
        {/* 1–2. Back link, domain badge & header */}
        <header className="relative overflow-hidden border-b border-line">
          <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto max-w-4xl px-5 pb-14 pt-10 sm:px-8 sm:pt-14">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Projects
              </Link>
              <span
                className={`badge inline-flex items-center gap-2 rounded-full border ${s.border} ${s.bg} px-3 py-1 font-mono text-[11px] tracking-wide ${s.text}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
                {domainLabel[project.domain]}
              </span>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <div className={`grid h-11 w-11 place-items-center rounded-lg border ${s.border} ${s.bg}`}>
                <Icon className={`h-5 w-5 ${s.text}`} aria-hidden />
              </div>
              <p className={`font-mono text-xs uppercase tracking-[0.18em] ${s.text}`}>
                {project.label}
                {project.highlight && <span className="text-muted"> · {project.highlight}</span>}
              </p>
            </div>

            <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 text-lg text-muted sm:text-xl">{project.subtitle}</p>

            <div className="card-shadow mt-8 flex items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3.5">
              <Building2 className={`mt-0.5 h-4 w-4 shrink-0 ${s.text}`} aria-hidden />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Partner / Context</p>
                <p className="mt-0.5 text-sm font-medium text-fg">{project.partner}</p>
              </div>
            </div>

            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology and modelling stack">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className={`badge rounded-full border ${s.border} ${s.bg} px-3 py-1 font-mono text-xs ${s.text}`}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          {/* Interactive 3D model */}
          <section aria-label="Interactive 3D model" className="pt-14">
            <div className="card-shadow relative overflow-hidden rounded-3xl border border-line bg-surface">
              <ProjectScene slug={project.slug} className="h-[360px] w-full sm:h-[460px]" />
              <p className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-2.5 py-1 font-mono text-[10px] text-muted backdrop-blur">
                <Hand className="h-3 w-3" aria-hidden /> drag to rotate
              </p>
              <p className="flex items-center gap-2 border-t border-line px-5 py-3 text-xs text-muted">
                <Box className={`h-3.5 w-3.5 ${s.text}`} aria-hidden /> Interactive concept model, an illustrative 3D rendering of the system
              </p>
            </div>
          </section>

          {/* 3. Media & architecture gallery */}
          <section aria-label="Media and architecture" className="grid grid-cols-1 gap-5 py-14 md:grid-cols-2">
            <MediaSlot slug={project.slug} kind="prototype" domain={project.domain} config={caseStudy.media.prototype} />
            <MediaSlot slug={project.slug} kind="architecture" domain={project.domain} config={caseStudy.media.architecture} />
          </section>

          {/* 4a. Problem */}
          <section className="border-t border-line py-14">
            <SectionTitle index="01" icon={Target} title="Problem Statement & Context" accent={s.text} />
            <div className="space-y-4 text-base leading-relaxed text-muted">
              {caseStudy.problem.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </section>

          {/* 4b. Architecture & methodology */}
          <section className="border-t border-line py-14">
            <SectionTitle index="02" icon={Layers} title="System Architecture & Methodology" accent={s.text} />
            <p className="text-base leading-relaxed text-muted">{caseStudy.architecture.summary}</p>
            <ol className="relative mt-8 space-y-3">
              {caseStudy.architecture.steps.map((step, i) => (
                <li
                  key={step.title}
                  className="card-shadow flex gap-4 rounded-xl border border-line bg-surface p-4 sm:p-5"
                >
                  <span
                    className={`badge grid h-8 w-8 shrink-0 place-items-center rounded-md border ${s.border} ${s.bg} font-mono text-xs font-semibold ${s.text}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-semibold text-fg">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* 4c. Outcomes */}
          <section className="border-t border-line py-14">
            <SectionTitle
              index="03"
              icon={CheckCircle2}
              title={project.domain === "energy" ? "Key Outcomes, Metrics & Policy Impact" : "Key Outcomes, Metrics & Impact"}
              accent={s.text}
            />
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {caseStudy.outcomes.facts.map((f) => (
                <div key={f.label} className="card-shadow rounded-xl border border-line bg-surface p-4">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{f.label}</dt>
                  <dd className={`mt-1 font-semibold ${s.text}`}>{f.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-8 space-y-3">
              {caseStudy.outcomes.impact.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-relaxed text-muted">
                  <CheckCircle2 className={`mt-1 h-4 w-4 shrink-0 ${s.text}`} aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {(project.slug === "neus-national-energy-use-survey" || project.slug === "botswana-irp-sadc-planning") && (
              <p className="mt-6 text-xs text-muted">{neusSource}</p>
            )}
          </section>

          {/* 5. Prev / next */}
          <nav aria-label="More projects" className="grid grid-cols-1 gap-4 border-t border-line py-14 sm:grid-cols-2">
            <ProjectNavCard project={prev} direction="prev" />
            <ProjectNavCard project={next} direction="next" />
          </nav>
        </div>
    </>
  );
}

function ProjectNavCard({ project, direction }: { project: Project; direction: "prev" | "next" }) {
  const s = domainStyles[project.domain];
  const isNext = direction === "next";
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`card-shadow group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-colors ${s.hoverBorder} ${
        isNext ? "sm:items-end sm:text-right" : ""
      }`}
    >
      <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted">
        {!isNext && <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />}
        {isNext ? "Next project" : "Previous project"}
        {isNext && <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />}
      </span>
      <span className={`mt-3 font-mono text-[11px] uppercase tracking-wider ${s.text}`}>{project.label}</span>
      <span className="mt-1 font-semibold leading-snug text-fg">{project.title}</span>
    </Link>
  );
}
