import { Accessibility, BarChart3, Brain, Droplets, Network, Plane, Sprout, Stethoscope, type LucideIcon } from "lucide-react";

// Keyed by project slug (see data/portfolioData.ts).
const icons: Record<string, LucideIcon> = {
  "bci-lower-limb-exoskeleton": Brain,
  "anti-poaching-autonomous-drone": Plane,
  "molemisi-soil-analytics": Sprout,
  "montsamaisa-smart-walking-stick": Accessibility,
  "covid-19-mechanical-ventilator": Stethoscope,
  "clews-1000mw-export-model": Droplets,
  "botswana-irp-sadc-planning": Network,
  "neus-national-energy-use-survey": BarChart3,
};

export function getProjectIcon(slug: string): LucideIcon {
  return icons[slug] ?? Network;
}
