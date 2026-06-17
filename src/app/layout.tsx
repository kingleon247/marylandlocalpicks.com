import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";

import { ComingSoonGate } from "@/components/coming-soon-gate";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { shouldShowSiteGate } from "@/lib/site-gate";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const siteManifest: Pick<Metadata, "manifest"> = {
  manifest: "/site.webmanifest",
};

const publicMetadata: Metadata = {
  metadataBase: new URL("https://marylandlocalpicks.com"),
  ...siteManifest,
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
  ...siteManifest,
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
      className={`${plusJakartaSans.variable} ${inter.variable} ${ibmPlexMono.variable}`}
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
