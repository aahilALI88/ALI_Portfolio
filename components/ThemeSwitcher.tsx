"use client";

import { Contrast, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme, type Theme } from "./ThemeProvider";

const options: { id: Theme; label: string; icon: LucideIcon }[] = [
  { id: "dark", label: "Technical Dark", icon: Moon },
  { id: "light", label: "Light Minimalist", icon: Sun },
  { id: "contrast", label: "High-Contrast Editorial", icon: Contrast },
];

export default function ThemeSwitcher({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={`inline-flex items-center gap-0.5 rounded-lg border border-line bg-surface p-0.5 ${className}`}
    >
      {options.map(({ id, label, icon: Icon }) => {
        const active = theme === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(id)}
            className={`grid h-7 w-7 place-items-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan ${
              active ? "bg-fg text-ink" : "text-muted hover:text-fg"
            }`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
