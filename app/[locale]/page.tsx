import { useTranslations } from 'next-intl';
import { ArrowRight, Sparkles, Network, Shield, Zap, Building2, Globe, Calculator, Receipt, PawPrint, Plane, Heart } from "lucide-react";
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-tovernet-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-tovernet-400 to-ksiegai-400 bg-clip-text text-transparent">
                TOVERNET
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#what-we-build" className="text-gray-300 hover:text-white transition-colors">{t('nav.whatWeBuild')}</a>
              <a href="#verticals" className="text-gray-300 hover:text-white transition-colors">{t('nav.verticals')}</a>
              <a href="#engagement" className="text-gray-300 hover:text-white transition-colors">{t('nav.engagement')}</a>
              <LanguageSwitcher />
              <a href="#contact" className="px-6 py-2 bg-tovernet-gradient rounded-lg text-white font-semibold hover:opacity-90 transition-opacity">
                {t('nav.contact')}
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-tovernet-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tovernet-500/10 border border-tovernet-500/30 mb-8 magical-glow">
              <Sparkles className="h-4 w-4 text-tovernet-400" />
              <span className="text-tovernet-300 text-sm font-semibold">{t('hero.badge')}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {t('hero.title')}{" "}
              <span className="bg-gradient-to-r from-tovernet-400 via-ksiegai-400 to-tovernet-500 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            
            <p className="text-lg text-tovernet-300 mb-12 font-medium">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-tovernet-gradient text-white text-lg px-10 py-4 rounded-xl font-semibold shadow-2xl hover-lift magical-glow transition-all"
              >
                {t('hero.ctaPrimary')}
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#verticals"
                className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white text-lg px-10 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                {t('hero.ctaSecondary')}
              </a>
            </div>

            {/* Key Value Props */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <Shield className="h-8 w-8 text-tovernet-400 mb-3 mx-auto" />
                <h3 className="text-white font-semibold mb-2">{t('hero.valueProps.clarity.title')}</h3>
                <p className="text-gray-400 text-sm">{t('hero.valueProps.clarity.description')}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <Network className="h-8 w-8 text-tovernet-400 mb-3 mx-auto" />
                <h3 className="text-white font-semibold mb-2">{t('hero.valueProps.decision.title')}</h3>
                <p className="text-gray-400 text-sm">{t('hero.valueProps.decision.description')}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <Zap className="h-8 w-8 text-tovernet-400 mb-3 mx-auto" />
                <h3 className="text-white font-semibold mb-2">{t('hero.valueProps.traceability.title')}</h3>
                <p className="text-gray-400 text-sm">{t('hero.valueProps.traceability.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Build Section */}
      <section id="what-we-build" className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {t('whatWeBuild.title')}
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {t('whatWeBuild.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-tovernet-900/30 to-ksiegai-900/30 border border-tovernet-500/20 rounded-2xl p-8 hover-lift">
                <Building2 className="h-12 w-12 text-tovernet-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">{t('whatWeBuild.internal.title')}</h3>
                <p className="text-gray-300 mb-4">{t('whatWeBuild.internal.description')}</p>
                <ul className="space-y-2 text-gray-400">
                  {t.raw('whatWeBuild.internal.features').map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-tovernet-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-tovernet-900/30 to-ksiegai-900/30 border border-tovernet-500/20 rounded-2xl p-8 hover-lift">
                <Globe className="h-12 w-12 text-tovernet-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">{t('whatWeBuild.external.title')}</h3>
                <p className="text-gray-300 mb-4">{t('whatWeBuild.external.description')}</p>
                <ul className="space-y-2 text-gray-400">
                  {t.raw('whatWeBuild.external.features').map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-tovernet-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-tovernet-900/30 to-ksiegai-900/30 border border-tovernet-500/20 rounded-2xl p-8 hover-lift">
                <Zap className="h-12 w-12 text-tovernet-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">{t('whatWeBuild.automation.title')}</h3>
                <p className="text-gray-300 mb-4">{t('whatWeBuild.automation.description')}</p>
                <ul className="space-y-2 text-gray-400">
                  {t.raw('whatWeBuild.automation.features').map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-tovernet-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-tovernet-900/30 to-ksiegai-900/30 border border-tovernet-500/20 rounded-2xl p-8 hover-lift">
                <Shield className="h-12 w-12 text-tovernet-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">{t('whatWeBuild.governance.title')}</h3>
                <p className="text-gray-300 mb-4">{t('whatWeBuild.governance.description')}</p>
                <ul className="space-y-2 text-gray-400">
                  {t.raw('whatWeBuild.governance.features').map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-tovernet-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Verticals Section */}
      <section id="verticals" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {t('verticals.title')}
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {t('verticals.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* KsięgaI Vertical */}
              <div className="group relative bg-gradient-to-br from-ksiegai-900/40 to-purple-900/40 border border-ksiegai-500/30 rounded-3xl p-10 hover-lift magical-glow overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ksiegai-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Calculator className="h-10 w-10 text-ksiegai-400" />
                    <Receipt className="h-10 w-10 text-purple-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {t('verticals.ksiegai.title')}
                  </h3>
                  <div className="inline-block px-3 py-1 bg-ksiegai-500/20 border border-ksiegai-400/30 rounded-full mb-6">
                    <span className="text-ksiegai-300 text-sm font-semibold">{t('verticals.ksiegai.badge')}</span>
                  </div>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    {t('verticals.ksiegai.description')}
                  </p>
                  <ul className="space-y-3 mb-8 text-gray-400">
                    {t.raw('verticals.ksiegai.features').map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <ArrowRight className="h-5 w-5 text-ksiegai-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://ksiegai.pl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-ksiegai-gradient text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    {t('verticals.ksiegai.cta')}
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Global Pet Vertical */}
              <div className="group relative bg-gradient-to-br from-globalpet-900/40 to-green-900/40 border border-globalpet-500/30 rounded-3xl p-10 hover-lift magical-glow-green overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-globalpet-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <PawPrint className="h-10 w-10 text-globalpet-400" />
                    <Plane className="h-10 w-10 text-green-400" />
                    <Heart className="h-10 w-10 text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {t('verticals.globalPet.title')}
                  </h3>
                  <div className="inline-block px-3 py-1 bg-globalpet-500/20 border border-globalpet-400/30 rounded-full mb-6">
                    <span className="text-globalpet-300 text-sm font-semibold">{t('verticals.globalPet.badge')}</span>
                  </div>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    {t('verticals.globalPet.description')}
                  </p>
                  <ul className="space-y-3 mb-8 text-gray-400">
                    {t.raw('verticals.globalPet.features').map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <ArrowRight className="h-5 w-5 text-globalpet-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="inline-flex items-center gap-2 bg-globalpet-gradient text-white px-6 py-3 rounded-lg font-semibold opacity-75">
                    <span>{t('verticals.globalPet.cta')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Custom Section */}
      <section className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('whyCustom.title')}
            </h2>
            <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
              {t('whyCustom.subtitle')}
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-tovernet-400 to-ksiegai-400 bg-clip-text text-transparent mb-12">
              {t('whyCustom.highlight')}
            </p>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <p className="text-xl text-gray-300 leading-relaxed">
                {t('whyCustom.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Model Section */}
      <section id="engagement" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {t('engagement.title')}
              </h2>
              <p className="text-xl text-gray-300">
                {t('engagement.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {t.raw('engagement.steps').map((step: { title: string; description: string }, i: number) => (
                <div key={i} className="bg-gradient-to-br from-tovernet-900/30 to-ksiegai-900/30 border border-tovernet-500/20 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-tovernet-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-tovernet-400">{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('contact.title')}
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              {t('contact.subtitle')}
            </p>
            <a
              href="mailto:contact@tovernet.online"
              className="inline-flex items-center gap-2 bg-tovernet-gradient text-white text-lg px-12 py-4 rounded-xl font-semibold shadow-2xl hover-lift magical-glow transition-all"
            >
              {t('contact.cta')}
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-6 w-6 text-tovernet-400" />
                  <span className="text-xl font-bold text-white">TOVERNET</span>
                </div>
                <p className="text-gray-400 text-sm">
                  {t('footer.tagline')}
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">{t('footer.verticals')}</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <a href="https://ksiegai.pl" target="_blank" rel="noopener noreferrer" className="hover:text-ksiegai-400 transition-colors">
                      {t('footer.ksiegai')}
                    </a>
                  </li>
                  <li className="text-gray-500">{t('footer.globalPet')}</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">{t('footer.contact')}</h4>
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
              <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
