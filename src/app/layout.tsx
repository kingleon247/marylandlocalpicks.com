import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader, Source_Serif_4 } from "next/font/google";

import { ComingSoonGate } from "@/components/coming-soon-gate";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { shouldShowSiteGate } from "@/lib/site-gate";

import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const publicMetadata: Metadata = {
  metadataBase: new URL("https://marylandlocalpicks.com"),
  title: {
    default: "Maryland Local Picks",
    template: "%s | Maryland Local Picks",
  },
  description:
    "Local businesses, offers, and places worth knowing across Maryland.",
  openGraph: {
    title: "Maryland Local Picks",
    description:
      "A printed card and digital guide to local businesses, offers, and places worth knowing.",
    type: "website",
  },
};

const gatedMetadata: Metadata = {
  title: "Coming Soon | Maryland Local Picks",
  description:
    "Maryland Local Picks is getting ready. Private preview access is available for invited reviewers.",
  robots: {
    index: false,
    follow: false,
  },
};

export async function generateMetadata(): Promise<Metadata> {
  if (await shouldShowSiteGate()) {
    return gatedMetadata;
  }

  return publicMetadata;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const showGate = await shouldShowSiteGate();

  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${sourceSerif.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        {showGate ? (
          <ComingSoonGate />
        ) : (
          <>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </>
        )}
      </body>
    </html>
  );
}
