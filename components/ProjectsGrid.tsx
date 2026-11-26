"use client";

import { useMemo, useState } from "react";
import { BatteryCharging, Bot, Layers } from "lucide-react";
import { projects, type Domain } from "@/data/portfolioData";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";
import { TiltCard } from "./ui";

type Filter = "all" | Domain;

const tabs: { id: Filter; label: string; icon: typeof Layers; active: string }[] = [
  { id: "all", label: "All", icon: Layers, active: "border-fg/40 bg-fg/10 text-fg" },
  { id: "engineering", label: "Hardware, Robotics & AI", icon: Bot, active: "border-cyan/50 bg-cyan/10 text-cyan" },
  { id: "energy", label: "Energy Modelling & Policy", icon: BatteryCharging, active: "border-amber/50 bg-amber/10 text-amber" },
];

export default function ProjectsGrid() {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(
    () => ({
      all: projects.length,
      engineering: projects.filter((p) => p.domain === "engineering").length,
      energy: projects.filter((p) => p.domain === "energy").length,
    }),
    []
  );

  const visible = filter === "all" ? projects : projects.filter((p) => p.domain === filter);

  return (
    <section id="projects" className="border-t border-line py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="All case studies"
          title="Two tracks, one engineering mindset."
          description="Flagship hardware, robotics and AI builds alongside national and regional energy systems modelling for Botswana and SADC."
        />

        <div role="tablist" aria-label="Filter projects" className="mb-8 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = filter === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls="projects-panel"
                onClick={() => setFilter(tab.id)}
                className={`inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan ${
                  isActive ? tab.active : "border-line bg-surface text-muted hover:text-fg"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {tab.label}
                <span className="font-mono text-xs opacity-80">({counts[tab.id]})</span>
              </button>
            );
          })}
        </div>

        <div id="projects-panel" role="tabpanel" className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {visible.map((project) => (
            <TiltCard key={project.id} className="h-full rounded-2xl" max={5}>
              <ProjectCard project={project} />
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
