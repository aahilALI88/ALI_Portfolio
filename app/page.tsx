import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HomeHero from "@/components/home/HomeHero";
import CompanySpotlight from "@/components/home/CompanySpotlight";
import AboutBento from "@/components/home/AboutBento";
import ExploreGrid from "@/components/home/ExploreGrid";
import ProjectExplorer from "@/components/ProjectExplorer";

export default function Home() {
  return (
    <>
      <HomeHero />
      <CompanySpotlight />
      <AboutBento />
      <section className="border-t border-line py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                <span className="text-cyan">//</span> Interactive 3D project lab
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">Pick a project. Spin it.</h2>
            </div>
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan">
              All projects <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <ProjectExplorer />
        </div>
      </section>
      <ExploreGrid />
    </>
  );
}
