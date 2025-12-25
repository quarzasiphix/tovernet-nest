import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TOVERNET - Digital Infrastructure for Businesses That Cannot Afford Chaos",
  description: "TOVERNET designs and operates custom digital systems for businesses that want structure, not tools. We build bespoke infrastructure, workflows, and platforms that scale.",
  keywords: ["digital infrastructure", "business systems", "custom software", "automation", "compliance systems", "operational infrastructure"],
  authors: [{ name: "TOVERNET" }],
  openGraph: {
    title: "TOVERNET - Digital Infrastructure for Businesses",
    description: "We design, deploy, and govern business infrastructure for ventures that must scale, comply, and coordinate across systems, people, and jurisdictions.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TOVERNET - Digital Infrastructure",
    description: "Custom digital systems for businesses that want structure, not tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
