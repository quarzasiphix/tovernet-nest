import { ArrowRight, PawPrint, LayoutDashboard, Camera, MessageCircle, Baby } from 'lucide-react';

type BreederHeroProps = {
  badge: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaPrimaryHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  flowLabel: string;
  statusFrom: string;
  statusTo: string;
};

export default function BreederHero({
  badge,
  title,
  subtitle,
  ctaPrimary,
  ctaPrimaryHref,
  ctaSecondary,
  ctaSecondaryHref,
  flowLabel,
  statusFrom,
  statusTo,
}: BreederHeroProps) {
  return (
    <section className="relative overflow-hidden bg-kennel-cream-100 pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kennel-pink-100 border border-kennel-pink-300 mb-6">
              <PawPrint className="h-4 w-4 text-kennel-pink-600" />
              <span className="text-kennel-pink-600 text-sm font-semibold">{badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-kennel-navy-900 mb-6 leading-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-kennel-navy-600 mb-10 leading-relaxed max-w-xl">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={ctaPrimaryHref}
                className="inline-flex items-center justify-center gap-2 bg-tovernet-gradient text-white text-base px-8 py-4 rounded-xl font-semibold shadow-lg hover-lift transition-all"
              >
                {ctaPrimary}
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href={ctaSecondaryHref}
                className="inline-flex items-center justify-center gap-2 bg-white border border-kennel-navy-400/20 text-kennel-navy-700 text-base px-8 py-4 rounded-xl font-semibold hover:bg-kennel-cream-200 transition-all"
              >
                {ctaSecondary}
              </a>
            </div>
          </div>

          {/* Right: layered visual — dashboard behind, puppy card in front, status transition */}
          <div className="relative h-[420px] sm:h-[460px]">
            {/* dashboard card (behind) */}
            <div className="absolute left-0 top-4 w-[78%] rounded-2xl bg-white border border-kennel-navy-400/10 kennel-card-shadow p-5 rotate-[-3deg]">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-kennel-teal-100 flex items-center justify-center">
                  <LayoutDashboard className="h-4 w-4 text-kennel-teal-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-kennel-navy-400">Panel hodowli</p>
                  <p className="text-sm font-bold text-kennel-navy-900">Nasze psy</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { icon: PawPrint, bg: 'bg-kennel-teal-50', fg: 'text-kennel-teal-600' },
                  { icon: Baby, bg: 'bg-kennel-lavender-50', fg: 'text-kennel-lavender-500' },
                  { icon: Camera, bg: 'bg-kennel-yellow-50', fg: 'text-kennel-yellow-500' },
                ].map(({ icon: Icon, bg, fg }, i) => (
                  <div key={i} className={`h-14 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${fg}`} />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-3 rounded-full bg-kennel-cream-200 w-full" />
                <div className="h-3 rounded-full bg-kennel-cream-200 w-4/5" />
              </div>
            </div>

            {/* puppy card (front) */}
            <div className="absolute right-0 bottom-2 w-[62%] rounded-2xl bg-white border border-kennel-navy-400/10 kennel-card-shadow p-4 rotate-[2deg]">
              <div className="h-24 rounded-xl bg-kennel-pink-100 flex items-center justify-center text-4xl mb-3">
                🐕
              </div>
              <p className="font-bold text-kennel-navy-900 text-sm">Bella</p>
              <p className="text-xs text-kennel-navy-400 mb-3">Blue &amp; Tan · Suczka</p>
              <div className="flex items-center gap-1.5 text-[11px] font-bold">
                <span className="px-2 py-1 rounded-full bg-kennel-teal-100 text-kennel-teal-600 line-through decoration-2">
                  {statusFrom}
                </span>
                <ArrowRight className="h-3 w-3 text-kennel-navy-400 flex-shrink-0" />
                <span className="px-2 py-1 rounded-full bg-kennel-pink-100 text-kennel-pink-600">
                  {statusTo}
                </span>
              </div>
            </div>

            {/* connecting label */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-1 pointer-events-none">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-kennel-navy-400/15 shadow-sm">
                <MessageCircle className="h-3 w-3 text-tovernet-500" />
                <span className="text-[10px] font-bold text-kennel-navy-700 whitespace-nowrap">{flowLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
