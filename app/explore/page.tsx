import type { Metadata } from "next";
import WorldLoader from "@/components/world/WorldLoader";

export const metadata: Metadata = {
  title: "3D World",
  description:
    "Drive the Atoms and Bits rover through an interactive 3D world to explore Alfred K. Pone's projects, research, experience, education and company.",
};

export default function ExplorePage() {
  return <WorldLoader />;
}
