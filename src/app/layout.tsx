import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
