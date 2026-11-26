import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { Camera, Workflow } from "lucide-react";
import type { Domain, MediaSlotConfig } from "@/data/portfolioData";
import { domainStyles } from "./domainStyles";
import { asset } from "@/lib/asset";

export type MediaKind = "prototype" | "architecture";

const EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg"] as const;

const kindMeta: Record<MediaKind, { heading: string; icon: typeof Camera }> = {
  prototype: { heading: "Hardware Prototype / Field Photo", icon: Camera },
  architecture: { heading: "System Architecture / Modelling Diagram", icon: Workflow },
};

/**
 * Looks for public/images/projects/<slug>/<kind>.<ext> at build time.
 * Server-only: runs during static generation, never in the browser.
 */
function findImage(slug: string, kind: MediaKind): string | null {
  for (const ext of EXTENSIONS) {
    const rel = `/images/projects/${slug}/${kind}.${ext}`;
    if (fs.existsSync(path.join(process.cwd(), "public", rel))) return rel;
  }
  return null;
}

interface MediaSlotProps {
  slug: string;
  kind: MediaKind;
  domain: Domain;
  config: MediaSlotConfig;
}

export default function MediaSlot({ slug, kind, domain, config }: MediaSlotProps) {
  const src = findImage(slug, kind);
  const { heading, icon: Icon } = kindMeta[kind];
  const s = domainStyles[domain];

  return (
    <figure className="card-shadow overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="relative aspect-[16/10] w-full">
        {src ? (
          <Image
            src={asset(src)}
            alt={config.alt}
            fill
            unoptimized={src.endsWith(".svg")}
            sizes="(min-width: 768px) 560px, 100vw"
            className={kind === "architecture" ? "object-contain p-4" : "object-cover"}
          />
        ) : (
          <div className="absolute inset-3 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-ink/50 px-6 text-center">
            <div className={`grid h-12 w-12 place-items-center rounded-full border ${s.border} ${s.bg}`}>
              <Icon className={`h-5 w-5 ${s.text}`} aria-hidden />
            </div>
            <p className="text-sm font-semibold text-fg">{heading}</p>
            <p className="font-mono text-[11px] leading-relaxed text-muted">
              Drop image at
              <br />
              <span className={s.text}>
                public/images/projects/{slug}/{kind}.jpg
              </span>
            </p>
          </div>
        )}
      </div>
      <figcaption className="flex items-center gap-2 border-t border-line px-4 py-3 text-xs text-muted">
        <Icon className={`h-3.5 w-3.5 shrink-0 ${s.text}`} aria-hidden />
        <span className="shrink-0 whitespace-nowrap font-mono uppercase tracking-wider">{kind === "prototype" ? "Fig. A" : "Fig. B"}</span>
        <span className="truncate">{config.caption}</span>
      </figcaption>
    </figure>
  );
}
