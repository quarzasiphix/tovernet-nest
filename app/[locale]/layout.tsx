import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const isPolish = params.locale === 'pl';
  
  return {
    title: isPolish 
      ? "TOVERNET - Infrastruktura Cyfrowa dla Firm, Które Nie Mogą Sobie Pozwolić na Chaos"
      : "TOVERNET - Digital Infrastructure for Businesses That Cannot Afford Chaos",
    description: isPolish
      ? "TOVERNET projektuje i obsługuje niestandardowe systemy cyfrowe dla firm, które chcą struktury, a nie narzędzi. Budujemy dedykowaną infrastrukturę, przepływy pracy i platformy, które skalują się."
      : "TOVERNET designs and operates custom digital systems for businesses that want structure, not tools. We build bespoke infrastructure, workflows, and platforms that scale.",
    keywords: isPolish
      ? ["infrastruktura cyfrowa", "systemy biznesowe", "oprogramowanie niestandardowe", "automatyzacja", "systemy zgodności", "infrastruktura operacyjna"]
      : ["digital infrastructure", "business systems", "custom software", "automation", "compliance systems", "operational infrastructure"],
    authors: [{ name: "TOVERNET" }],
    openGraph: {
      title: isPolish ? "TOVERNET - Infrastruktura Cyfrowa dla Firm" : "TOVERNET - Digital Infrastructure for Businesses",
      description: isPolish
        ? "Projektujemy, wdrażamy i zarządzamy infrastrukturą biznesową dla przedsięwzięć, które muszą skalować się, zachować zgodność i koordynować działania."
        : "We design, deploy, and govern business infrastructure for ventures that must scale, comply, and coordinate across systems, people, and jurisdictions.",
      type: "website",
      locale: isPolish ? "pl_PL" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: isPolish ? "TOVERNET - Infrastruktura Cyfrowa" : "TOVERNET - Digital Infrastructure",
      description: isPolish
        ? "Niestandardowe systemy cyfrowe dla firm, które chcą struktury, a nie narzędzi."
        : "Custom digital systems for businesses that want structure, not tools.",
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: "",
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
