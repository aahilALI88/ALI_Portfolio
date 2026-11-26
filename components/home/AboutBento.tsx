import Image from "next/image";
import { Cpu, GraduationCap, MapPin, Zap, type LucideIcon } from "lucide-react";
import { hero, profile } from "@/data/portfolioData";
import { domainStyles } from "@/components/domainStyles";
import { Reveal, TiltCard } from "@/components/ui";
import { asset } from "@/lib/asset";

const iconMap: Record<string, LucideIcon> = { cpu: Cpu, zap: Zap, graduation: GraduationCap };

export default function AboutBento() {
  const { locationCard } = hero;
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span className="text-cyan">//</span> About
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Reveal className="order-first lg:order-none lg:col-span-4 lg:row-span-2">
            <TiltCard className="h-full rounded-2xl" max={5}>
              <figure className="card-shadow group relative h-full overflow-hidden rounded-2xl border border-line bg-surface">
                <div className="relative aspect-[4/5] w-full lg:aspect-auto lg:h-full lg:min-h-[500px]">
                  <Image
                    src={asset(profile.photo.src)}
                    alt={profile.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 380px, 100vw"
                    className="object-cover object-[50%_35%] transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" aria-hidden />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-xl font-semibold text-fg">{profile.name}</p>
                  <p className="mt-2 font-mono text-[11px] leading-relaxed text-cyan">{profile.titles.engineering}</p>
                  <p className="mt-1 font-mono text-[11px] leading-relaxed text-amber">{profile.titles.energy}</p>
                </figcaption>
              </figure>
            </TiltCard>
          </Reveal>

          <Reveal className="lg:col-span-8">
            <div className="card-shadow h-full rounded-2xl border border-line bg-surface p-6 sm:p-9">
              <div className="space-y-4 text-[15px] leading-relaxed text-muted sm:text-base">
                {hero.bio.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 lg:col-span-8 lg:grid-cols-4">
            {hero.stats.map((stat, i) => {
              const s = domainStyles[stat.domain];
              const Icon = iconMap[stat.icon];
              return (
                <Reveal key={stat.label} delay={i * 80}>
                  <TiltCard className="h-full rounded-2xl">
                    <div className={`card-shadow relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-5 transition-colors ${s.hoverBorder}`}>
                      <div className={`glow absolute inset-0 bg-gradient-to-br ${s.glow} to-transparent opacity-60`} aria-hidden />
                      <div className="relative">
                        <Icon className={`h-5 w-5 ${s.text}`} aria-hidden />
                        <p className={`mt-4 font-mono text-3xl font-bold ${s.text}`}>{stat.value}</p>
                        <p className="mt-1 text-sm leading-snug text-muted">{stat.label}</p>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
            <Reveal delay={240}>
              <TiltCard className="h-full rounded-2xl">
                <div className="card-shadow relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-5">
                  <MapPin className="h-5 w-5 text-fg" aria-hidden />
                  <p className="mt-4 text-xl font-semibold leading-tight text-fg">
                    {locationCard.city},
                    <br />
                    {locationCard.country}
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-muted">{locationCard.coordinates}</p>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
