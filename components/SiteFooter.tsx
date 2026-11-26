import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { company, companyNavLink, navLinks, profile } from "@/data/portfolioData";
import AtomsBitsLogo from "./AtomsBitsLogo";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <p className="font-mono text-sm font-semibold tracking-[0.18em] text-fg">{profile.monogram}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {profile.titles.engineering}
            <br />
            {profile.titles.energy}
          </p>
          <Link
            href={companyNavLink.href}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-fg transition-colors hover:border-cyan/50"
          >
            <AtomsBitsLogo className="h-4 w-4" /> Founder, {company.legalName}
          </Link>
        </div>

        <nav aria-label="Footer">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Pages</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {[{ href: "/", label: "Home" }, ...navLinks, companyNavLink, { href: "/contact", label: "Contact" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted transition-colors hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 text-fg hover:text-cyan">
                <Mail className="h-4 w-4 text-cyan" aria-hidden /> {profile.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2 text-fg">
              <Phone className="h-4 w-4 text-amber" aria-hidden />
              {profile.phones.map((p, i) => (
                <span key={p.href}>
                  {i > 0 && <span className="text-muted"> / </span>}
                  <a href={p.href} className="font-mono hover:text-amber">
                    {p.display}
                  </a>
                </span>
              ))}
            </li>
            <li className="flex items-center gap-2 text-muted">
              <MapPin className="h-4 w-4" aria-hidden /> {profile.location}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted sm:px-8">
          © {new Date().getFullYear()} {profile.name} · {company.legalName}
        </p>
      </div>
    </footer>
  );
}
