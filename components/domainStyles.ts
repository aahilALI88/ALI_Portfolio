import type { Domain } from "@/data/portfolioData";

// Full literal class strings so Tailwind can detect them at build time.
export const domainStyles: Record<
  Domain,
  { text: string; border: string; bg: string; dot: string; hoverBorder: string; ring: string; glow: string }
> = {
  engineering: {
    text: "text-cyan",
    border: "border-cyan/30",
    bg: "bg-cyan/10",
    dot: "bg-cyan",
    hoverBorder: "hover:border-cyan/50",
    ring: "focus-visible:ring-cyan",
    glow: "from-cyan/15",
  },
  energy: {
    text: "text-amber",
    border: "border-amber/30",
    bg: "bg-amber/10",
    dot: "bg-amber",
    hoverBorder: "hover:border-amber/50",
    ring: "focus-visible:ring-amber",
    glow: "from-amber/15",
  },
};
