"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { hero, profile } from "@/data/portfolioData";

export default function ContactPanel() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Fallback for browsers without the async clipboard API
      const el = document.createElement("textarea");
      el.value = profile.email;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="relative overflow-hidden card-shadow rounded-3xl border border-line bg-surface p-7 sm:p-12">
          <div
            className="glow pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber/10 blur-3xl"
            aria-hidden
          />
          <div
            className="glow pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan/10 blur-3xl"
            aria-hidden
          />

          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              <span className="text-amber">//</span> Get in Touch
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              Building hardware or planning an energy future? Let&apos;s talk.
            </h2>
            <p className="mt-4 max-w-xl text-muted">{hero.locationCard.note}.</p>

            {/* Email row */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-line bg-ink/70 px-4 py-3">
                <Mail className="h-4 w-4 shrink-0 text-cyan" aria-hidden />
                <span className="truncate font-mono text-sm text-fg">{profile.email}</span>
              </div>
              <button
                type="button"
                onClick={copyEmail}
                aria-live="polite"
                className={`inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan ${
                  copied ? "border-cyan/50 bg-cyan/10 text-cyan" : "border-line bg-surface text-fg hover:border-muted/60"
                }`}
              >
                {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                {copied ? "Copied!" : "Copy email"}
              </button>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan px-5 py-3 text-sm font-semibold text-ink transition hover:opacity-90"
              >
                <Mail className="h-4 w-4" aria-hidden /> Send email
              </a>
            </div>

            {/* Phone / location / LinkedIn */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-ink/60 px-3.5 py-2 text-sm text-fg">
                <Phone className="h-4 w-4 text-amber" aria-hidden />
                {profile.phones.map((p, i) => (
                  <span key={p.href} className="inline-flex items-center gap-2">
                    {i > 0 && <span className="text-muted">/</span>}
                    <a href={p.href} className="font-mono hover:text-amber">
                      {p.display}
                    </a>
                  </span>
                ))}
              </span>
              <span className="badge inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-3.5 py-2 font-mono text-xs text-amber">
                <MapPin className="h-3.5 w-3.5" aria-hidden /> {profile.location}
              </span>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-ink/60 px-3.5 py-2 text-sm text-fg hover:border-cyan/50 hover:text-cyan"
              >
                <Linkedin className="h-4 w-4" aria-hidden /> LinkedIn
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
