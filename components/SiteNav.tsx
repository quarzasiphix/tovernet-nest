import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SiteNav({ locale }: { locale: string }) {
  const t = useTranslations('nav');

  return (
    <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <a href={`/${locale}`} className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-tovernet-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-tovernet-400 to-ksiegai-400 bg-clip-text text-transparent">
              TOVERNET
            </span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href={`/${locale}/hodowcy`} className="text-gray-300 hover:text-white transition-colors">{t('breeders')}</a>
            <a href={`/${locale}/zwiazki-kynologiczne`} className="text-gray-300 hover:text-white transition-colors">{t('kennelClubs')}</a>
            <a href={`/${locale}/projekty`} className="text-gray-300 hover:text-white transition-colors">{t('projects')}</a>
            <LanguageSwitcher />
            <a href={`/${locale}#contact`} className="px-6 py-2 bg-tovernet-gradient rounded-lg text-white font-semibold hover:opacity-90 transition-opacity">
              {t('contact')}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
