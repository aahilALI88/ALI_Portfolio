import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  accent?: "cyan" | "amber";
}

export default function PageHeader({ eyebrow, title, description, children, accent = "cyan" }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-14 sm:px-8 sm:pt-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span className={accent === "cyan" ? "text-cyan" : "text-amber"}>//</span> {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-fg sm:text-5xl">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
        {children}
      </div>
    </header>
  );
}
