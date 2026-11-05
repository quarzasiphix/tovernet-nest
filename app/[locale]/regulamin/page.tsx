import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import LegalDocumentView from '@/components/legal/LegalDocumentView';
import { loadLegalDocument } from '@/lib/legal/documents';
import { buildMetadata } from '@/lib/seo';

// Binding text is Polish only; the English route shows the same document with a note.
export async function generateMetadata({ params: { locale } }: { params: { locale: 'pl' | 'en' } }): Promise<Metadata> {
  return buildMetadata({
    locale,
    path: '/regulamin',
    title: locale === 'pl' ? 'Regulamin świadczenia usług | Tovernet' : 'Terms of Service | Tovernet',
    description: locale === 'pl' ? 'Regulamin świadczenia usług Tovernet: wykonanie stron internetowych, plany utrzymania, płatności, odstąpienie, reklamacje.' : 'Tovernet terms of service (Polish, binding version).',
  });
}

export default function Page({ params: { locale } }: { params: { locale: 'pl' | 'en' } }) {
  unstable_setRequestLocale(locale);
  const { meta, blocks, entry } = loadLegalDocument('regulamin');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <SiteNav locale={locale} />
      {locale === 'en' && (
        <p className="max-w-3xl mx-auto px-4 pt-10 text-sm text-gray-400">
          Our services are offered in Polish. The binding terms are the Polish text below; you can download them as PDF.
        </p>
      )}
      <LegalDocumentView title={meta.title} blocks={blocks} entry={entry} />
      <SiteFooter locale={locale} />
    </div>
  );
}
