import { BadgeCheck, CircuitBoard, LineChart } from "lucide-react";
import { stack } from "@/data/portfolioData";
import SectionHeading from "./SectionHeading";
import { domainStyles } from "./domainStyles";

export default function TechStack() {
  return (
    <section id="stack" className="border-t border-line py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Technical Stack"
          title="Hardware to policy: the modelling matrix."
          description="The tools behind the builds and the national energy plans."
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {stack.map((col) => {
            const s = domainStyles[col.domain];
            const Icon = col.domain === "engineering" ? CircuitBoard : LineChart;
            return (
              <div key={col.title} className="card-shadow rounded-2xl border border-line bg-surface p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border ${s.border} ${s.bg}`}>
                    <Icon className={`h-5 w-5 ${s.text}`} aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-fg">{col.title}</h3>
                    {col.subtitle && (
                      <p className={`mt-1 inline-flex items-center gap-1.5 font-mono text-xs ${s.text}`}>
                        <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                        {col.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {col.items.map((item, i) => (
                    <li
                      key={item}
                      className={`flex items-center gap-3 rounded-lg border border-line bg-ink/50 px-3.5 py-3 transition-colors ${s.hoverBorder}`}
                    >
                      <span className={`font-mono text-[10px] ${s.text}`}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-sm text-fg/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
