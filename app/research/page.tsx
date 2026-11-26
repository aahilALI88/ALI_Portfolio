import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import NeusSpotlight from "@/components/NeusSpotlight";
import Publications from "@/components/Publications";
import { ProjectScene } from "@/components/three";

export const metadata: Metadata = {
  title: "Research & Publications",
  description:
    "Doctoral research on the CLEWS nexus, Botswana IRP modelling inputs, NEUS 2022/23 results and IAEA/SADC technical cooperation outputs.",
};

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        accent="amber"
        eyebrow="Research & Technical Outputs"
        title={
          <>
            Evidence for <span className="text-amber">energy-water-land</span> decisions in Botswana and SADC.
          </>
        }
        description="A PhD on the Climate-Land-Energy-Water (CLEWS) nexus, national least-cost planning, the first National Energy Use Survey, and regional IAEA cooperation."
      >
        <div className="mt-10 grid items-center gap-6 lg:grid-cols-2">
          <div className="card-shadow overflow-hidden rounded-3xl border border-line bg-surface">
            <ProjectScene slug="clews-1000mw-export-model" className="h-[320px] w-full" />
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-amber">Doctoral research · interactive model</p>
            <p className="mt-2 text-xl font-semibold text-fg">The CLEWS nexus</p>
            <p className="mt-2 leading-relaxed text-muted">
              Climate, land, energy and water are modelled as one system. Each export pathway is judged by the foreign
              exchange it earns per unit of water it consumes, not by cost alone. Drag the model to explore the links.
            </p>
          </div>
        </div>
      </PageHeader>
      <NeusSpotlight />
      <Publications />
    </>
  );
}
