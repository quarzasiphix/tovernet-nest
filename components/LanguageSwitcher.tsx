'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState, useTransition } from 'react';
import posthog from 'posthog-js';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    posthog.capture('language_switched', { from_locale: locale, to_locale: newLocale });
    startTransition(() => {
      // Prefer the page's own declared alternate URL (from generateMetadata's
      // alternates.languages, rendered as <link rel="alternate" hreflang="...">).
      // Falls back to a naive locale-segment swap for pages where the slug is
      // identical in both locales (most pages) or the tag isn't present.
      const altLink = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"]')).find(
        (l) => l.hreflang === newLocale,
      );
      let target: string;
      if (altLink?.href) {
        const url = new URL(altLink.href);
        target = url.pathname + url.search;
      } else {
        const segments = pathname.split('/');
        segments[1] = newLocale;
        target = segments.join('/');
      }
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
      router.replace(target);
      setIsOpen(false);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
        disabled={isPending}
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium uppercase">{locale}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden">
            <button
              onClick={() => switchLocale('en')}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                locale === 'en'
                  ? 'bg-tovernet-500/20 text-tovernet-300 font-semibold'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => switchLocale('pl')}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                locale === 'pl'
                  ? 'bg-tovernet-500/20 text-tovernet-300 font-semibold'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              Polski
            </button>
          </div>
        </>
      )}
    </div>
  );
}
