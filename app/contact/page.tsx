import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ContactPanel from "@/components/ContactPanel";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Alfred K. Pone in Gaborone, Botswana: email, phone and LinkedIn.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's build something, or plan something."
        description="For engineering collaborations, Atoms and Bits projects, energy-planning work or research enquiries."
      />
      <ContactPanel />
    </>
  );
}
