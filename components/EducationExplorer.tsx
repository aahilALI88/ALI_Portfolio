"use client";

import { useState } from "react";
import { Hand } from "lucide-react";
import { education } from "@/data/portfolioData";
import { EducationScene } from "./three";

// Bottom → top of the 3D stack: BEng, MBA, PhD.
const ordered = [...education].reverse();
const levels = [
  { short: "BEng (Hons)", year: "2011" },
  { short: "MBA · MIS", year: "2020" },
  { short: "PhD · DGEP", year: "In progress" },
];

/** 3D degree stack linked to the list: hover either one to highlight both. */
export default function EducationExplorer() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="grid items-center gap-6 lg:grid-cols-2">
      <div className="card-shadow relative overflow-hidden rounded-3xl border border-line bg-surface">
        <EducationScene levels={levels} active={active} onSelect={setActive} className="h-[360px] w-full sm:h-[420px]" />
        <p className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-2.5 py-1 font-mono text-[10px] text-muted backdrop-blur">
          <Hand className="h-3 w-3" aria-hidden /> hover a level
        </p>
      </div>

      <ol className="flex flex-col-reverse gap-3">
        {ordered.map((item, i) => {
          const isActive = active === i;
          const isPhd = i === ordered.length - 1;
          const accent = isPhd ? "text-amber" : "text-cyan";
          return (
            <li key={item.degree}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={`card-shadow w-full rounded-2xl border bg-surface p-5 text-left transition-all ${
                  isActive ? `${isPhd ? "border-amber/60" : "border-cyan/60"} -translate-y-0.5` : "border-line"
                }`}
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className={`font-mono text-xs ${accent}`}>{item.period}</span>
                  {item.status && (
                    <span className="badge rounded-full border border-amber/30 bg-amber/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber">
                      {item.status}
                    </span>
                  )}
                </span>
                <span className="mt-1.5 block font-semibold text-fg">{item.degree}</span>
                <span className="block text-sm text-muted">{item.institution}</span>
                {item.detail && <span className="mt-1 block font-mono text-xs text-fg/80">{item.detail}</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
