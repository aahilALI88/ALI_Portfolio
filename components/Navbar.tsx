"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Menu, Send, X } from "lucide-react";
import { companyNavLink, navLinks, profile } from "@/data/portfolioData";
import ThemeSwitcher from "./ThemeSwitcher";
import AtomsBitsLogo from "./AtomsBitsLogo";

function isActive(pathname: string, href: string): boolean {
  const clean = pathname.replace(/\/$/, "") || "/";
  return href === "/" ? clean === "/" : clean === href || clean.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const companyActive = isActive(pathname, companyNavLink.href);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? "border-line bg-ink/85 backdrop-blur-md" : "border-transparent bg-ink/40 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8" aria-label="Main">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${profile.name}, home`}>
          <span className="grid h-8 w-8 place-items-center rounded-md border border-line bg-surface font-mono text-xs font-bold">
            <span>
              <span className="text-cyan">A</span>
              <span className="text-amber">P</span>
            </span>
          </span>
          <span className="hidden whitespace-nowrap font-mono text-sm font-semibold tracking-[0.18em] text-fg min-[420px]:inline xl:hidden 2xl:inline">
            {profile.monogram}
          </span>
        </Link>

        <div className="hidden items-center gap-3 xl:flex">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`whitespace-nowrap rounded-md px-2.5 py-2 text-sm transition-colors ${
                      active ? "bg-surface text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-line px-3 py-1.5 text-sm font-semibold text-fg transition-colors hover:border-cyan/60 hover:text-cyan"
          >
            <Car className="h-4 w-4 text-cyan" aria-hidden /> 3D World
          </Link>

          {/* Company link stands out with a gradient ring and logo mark */}
          <Link
            href={companyNavLink.href}
            aria-current={companyActive ? "page" : undefined}
            className="group relative rounded-full bg-gradient-to-r from-cyan to-amber p-px"
          >
            <span
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                companyActive ? "bg-transparent text-ink" : "bg-ink text-fg group-hover:bg-ink/80"
              }`}
            >
              <AtomsBitsLogo className="h-4 w-4" />
              {companyNavLink.label}
            </span>
          </Link>

          <ThemeSwitcher />
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-cyan px-4 py-2 text-sm font-semibold text-ink transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Contact <Send className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <ThemeSwitcher />
          <button
            type="button"
            className="rounded-md border border-line p-2 text-fg"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line px-5 pb-5 xl:hidden">
          <ul className="flex flex-col py-2">
            {[{ href: "/", label: "Home" }, ...navLinks].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block border-b border-line/60 py-3 text-sm ${
                    isActive(pathname, link.href) ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/explore"
            className="mt-3 flex items-center justify-center gap-2 rounded-md border border-cyan/50 px-4 py-2.5 text-sm font-semibold text-cyan"
          >
            <Car className="h-4 w-4" aria-hidden /> Drive the 3D world
          </Link>
          <Link
            href={companyNavLink.href}
            className="mt-2 flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-cyan to-amber px-4 py-2.5 text-sm font-semibold text-ink"
          >
            <AtomsBitsLogo className="h-4 w-4" mono /> Atoms and Bits (Pty) Ltd
          </Link>
          <Link
            href="/contact"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-fg"
          >
            Contact <Send className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      )}
    </header>
  );
}
