import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';

export default function SiteFooter({ locale }: { locale: string }) {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');

  return (
    <footer className="border-t border-white/10 bg-slate-950 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-tovernet-400" />
                <span className="text-xl font-bold text-white">TOVERNET</span>
              </div>
              <p className="text-gray-400 text-sm">
                {t('tagline')}
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t('solutions')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href={`/${locale}/hodowcy`} className="hover:text-breeder-400 transition-colors">
                    {tn('breeders')}
                  </a>
                </li>
                <li>
                  <a href={`/${locale}/zwiazki-kynologiczne`} className="hover:text-kennelclub-400 transition-colors">
                    {tn('kennelClubs')}
                  </a>
                </li>
                <li>
                  <a href={`/${locale}/projekty`} className="hover:text-tovernet-400 transition-colors">
                    {tn('projects')}
                  </a>
                </li>
                <li>
                  <a href={`/${locale}/poradnik`} className="hover:text-breeder-400 transition-colors">
                    {tn('poradnik')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t('verticals')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="https://ksiegai.pl" target="_blank" rel="noopener noreferrer" className="hover:text-ksiegai-400 transition-colors">
                    {t('ksiegai')}
                  </a>
                </li>
                <li>
                  <a href="https://globalpet.online" target="_blank" rel="noopener noreferrer" className="hover:text-globalpet-400 transition-colors">
                    {t('globalPet')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t('contact')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="mailto:contact@tovernet.online" className="hover:text-tovernet-400 transition-colors">
                    contact@tovernet.online
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} {t('copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
