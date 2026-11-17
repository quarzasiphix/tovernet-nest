import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PostHogProvider from "@/components/PostHogProvider";
import LoginLinkConfirm from "@/components/tovernet/LoginLinkConfirm";
import KsiegaiReturnLink from "@/components/tovernet/KsiegaiReturnLink";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://tovernet.online"),
  title: "Tovernet: strony internetowe, sklepy i systemy dla firm",
  description: "Projektujemy strony firmowe, sklepy internetowe i oprogramowanie na zamówienie. Stała cena, akceptacja przed publikacją, działające realizacje.",
  authors: [{ name: "Tovernet sp. z o.o." }],
  openGraph: { title: "Tovernet: strony, sklepy i systemy dla firm", type: "website", locale: "pl_PL", siteName: "Tovernet" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={inter.className}>
          <PostHogProvider>{children}<LoginLinkConfirm /><KsiegaiReturnLink /></PostHogProvider>
        </body>
    </html>
  );
}
