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
              <p className="text-gray-400 text-sm mb-3">
                {t('tagline')}
              </p>
              <p className="text-gray-500 text-xs leading-relaxed">
                {t('digitalAdmin')}
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
                <li>
                  <a href={`/${locale}/${locale === 'pl' ? 'audyt-dostawcy-uslug-cyfrowych' : 'digital-provider-audit'}`} className="hover:text-kennelclub-400 transition-colors">
                    {tn('providerAudit')}
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
                  {/* TODO: swap back to https://globalpet.online once GlobalPet Transport's licence comes through */}
                  <a href="https://www.facebook.com/share/194QgDs1Nu/" target="_blank" rel="noopener noreferrer" className="hover:text-globalpet-400 transition-colors">
                    {t('globalPet')}
                  </a>
                </li>
                <li>
                  <a href={`/${locale}/projekty/nekrolog-lodz`} className="hover:text-kennelclub-400 transition-colors">
                    {t('nekrolog')}
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
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} {t('copyright')}</p>
            <div className="flex items-center gap-4">
              <a href={`/${locale}/polityka-prywatnosci`} className="hover:text-gray-300 transition-colors">
                {t('privacyPolicy')}
              </a>
              <a href={`/${locale}/regulamin`} className="hover:text-gray-300 transition-colors">
                {t('terms')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
