import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SiteNav({ locale }: { locale: string }) {
  const t = useTranslations('nav');

  return (
    <nav className="border-b border-white/10 bg-slate-950 relative z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <a href={`/${locale}`} className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-tovernet-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-tovernet-400 to-ksiegai-400 bg-clip-text text-transparent">
              TOVERNET
            </span>
          </a>
          <div className="flex items-center gap-4 md:gap-8">
            <a href={`/${locale}/hodowcy`} className="hidden md:inline text-gray-300 hover:text-white transition-colors">{t('breeders')}</a>
            <a href={`/${locale}/zwiazki-kynologiczne`} className="hidden md:inline text-gray-300 hover:text-white transition-colors">{t('kennelClubs')}</a>
            <a href={`/${locale}/projekty`} className="hidden md:inline text-gray-300 hover:text-white transition-colors">{t('projects')}</a>
            <a href={`/${locale}/poradnik`} className="hidden md:inline text-gray-300 hover:text-white transition-colors">{t('poradnik')}</a>
            <a href={`/${locale}/${locale === 'pl' ? 'audyt-dostawcy-uslug-cyfrowych' : 'digital-provider-audit'}`} className="hidden lg:inline text-gray-300 hover:text-white transition-colors">{t('providerAudit')}</a>
            <LanguageSwitcher />
            <a href={`/${locale}#contact`} className="hidden sm:inline-flex px-6 py-2 bg-tovernet-gradient rounded-lg text-white font-semibold hover:opacity-90 transition-opacity">
              {t('contact')}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
