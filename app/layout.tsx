import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { profile } from "@/data/portfolioData";
import { ThemeProvider, themeInitScript } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL to your live domain (e.g. https://alfredpone.com) when deploying
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${profile.name} | Computer Engineer & Energy Systems Modeller`,
    template: `%s | ${profile.name}`,
  },
  description:
    "Alfred K. Pone: computer engineer (embedded systems, IoT, robotics & AI), PhD energy-policy researcher, Botswana's IAEA energy planning representative, and founder of Atoms and Bits (Pty) Ltd.",
  openGraph: {
    title: `${profile.name} | Computer Engineer & Energy Systems Modeller`,
    description:
      "Engineering intelligent hardware and modelling national energy strategy from Gaborone, Botswana.",
    images: [{ url: asset(profile.photo.src) }],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#090D16",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme is set by the init script before paint, so React must not warn about it
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-cyan focus:px-3 focus:py-2 focus:text-ink"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
