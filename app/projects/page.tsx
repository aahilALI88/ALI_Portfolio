import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProjectExplorer from "@/components/ProjectExplorer";
import ProjectsGrid from "@/components/ProjectsGrid";
import { projects } from "@/data/portfolioData";

export const metadata: Metadata = {
  title: "Projects",
  description: "Hardware, robotics, AI and energy-modelling projects by Alfred K. Pone, each with an interactive 3D model and case study.",
};

export default function ProjectsPage() {
  const eng = projects.filter((p) => p.domain === "engineering").length;
  const energy = projects.length - eng;
  return (
    <>
      <PageHeader
        eyebrow="Projects & Research"
        title={
          <>
            <span className="text-cyan">{eng} hardware &amp; AI builds.</span>{" "}
            <span className="text-amber">{energy} national energy studies.</span>
          </>
        }
        description="Choose a project to load its interactive 3D model, then open the full case study for the problem, the architecture and the outcomes."
      />
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <ProjectExplorer />
        </div>
      </section>
      <ProjectsGrid />
    </>
  );
}
