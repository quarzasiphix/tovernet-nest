import { ArrowRight, PawPrint, LayoutDashboard, Camera, MessageCircle, Baby } from 'lucide-react';
import PuppyAvatar from './PuppyAvatar';

type HeroDog = {
  name: string;
  color: string | null;
  sexLabel: 'Suczka' | 'Reproduktor';
  photoUrl: string | null;
};

type BreederHeroProps = {
  badge: string;
  title: string;
  titleHighlightWord?: string;
  subtitle: string;
  ctaPrimary: string;
  ctaPrimaryHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  flowLabel: string;
  statusFrom: string;
  statusTo: string;
  dog?: HeroDog | null;
  mobileLivePill: string;
  mobileProofLine: string;
  mobileProofStats: string;
};

// Splits `title` on the first occurrence of `word` (case-insensitive) and wraps
// that word in the tovernet gradient — used only in the mobile heading below,
// the desktop heading renders `title` as plain text, unchanged.
function renderHighlightedTitle(title: string, word?: string) {
  if (!word) return title;
  const idx = title.toLowerCase().indexOf(word.toLowerCase());
  if (idx === -1) return title;
  const before = title.slice(0, idx);
  const match = title.slice(idx, idx + word.length);
  const after = title.slice(idx + word.length);
  return (
    <>
      {before}
      <span className="bg-tovernet-gradient bg-clip-text text-transparent">{match}</span>
      {after}
    </>
  );
}

export default function BreederHero({
  badge,
  title,
  titleHighlightWord,
  subtitle,
  ctaPrimary,
  ctaPrimaryHref,
  ctaSecondary,
  ctaSecondaryHref,
  flowLabel,
  statusFrom,
  statusTo,
  dog,
  mobileLivePill,
  mobileProofLine,
  mobileProofStats,
}: BreederHeroProps) {
  return (
    <section className="relative overflow-hidden bg-kennel-cream-100 pt-6 pb-8 sm:pt-8 sm:pb-10 lg:pt-24 lg:pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kennel-pink-100 border border-kennel-pink-300 mb-6">
              <PawPrint className="h-4 w-4 text-kennel-pink-600" />
              <span className="text-kennel-pink-600 text-sm font-semibold">{badge}</span>
            </div>

            {/* Mobile-only heading: gradient emphasis on the key word. Desktop heading (below) is unchanged. */}
            <h1 className="lg:hidden text-4xl font-bold text-kennel-navy-900 mb-4 leading-tight">
              {renderHighlightedTitle(title, titleHighlightWord)}
            </h1>
            <h1 className="hidden lg:block text-5xl font-bold text-kennel-navy-900 mb-6 leading-tight">
              {title}
            </h1>

            <p className="text-lg md:text-xl text-kennel-navy-600 mb-6 lg:mb-10 leading-relaxed max-w-xl">
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

            {/* Mobile-only compact product visualization — desktop keeps its own visual (right column below) */}
            <div className="lg:hidden relative mt-10 pb-6">
              {/* pastel glow blobs behind the cards */}
              <div className="absolute -top-6 -left-4 h-36 w-36 rounded-full bg-kennel-teal-300/40 blur-3xl pointer-events-none" />
              <div className="absolute top-16 -right-6 h-32 w-32 rounded-full bg-kennel-lavender-300/40 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-6 h-28 w-28 rounded-full bg-kennel-yellow-300/30 blur-3xl pointer-events-none" />
              <div className="absolute bottom-10 right-0 h-32 w-32 rounded-full bg-kennel-pink-300/30 blur-3xl pointer-events-none" />

              {/* panel card */}
              <div className="relative z-10 w-[84%] rounded-2xl bg-white border border-kennel-navy-400/10 kennel-card-shadow p-4 -rotate-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-kennel-teal-100 flex items-center justify-center flex-shrink-0">
                    <LayoutDashboard className="h-4 w-4 text-kennel-teal-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-kennel-navy-400">Panel hodowli</p>
                    <p className="text-sm font-bold text-kennel-navy-900 truncate">{dog?.name ?? 'Bella'}</p>
                  </div>
                  <span className="ml-auto flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-full bg-kennel-pink-100 text-kennel-pink-600">
                    {statusTo}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2.5 rounded-full bg-kennel-cream-200 w-full" />
                  <div className="h-2.5 rounded-full bg-kennel-cream-200 w-3/5" />
                </div>
              </div>

              {/* connecting flow indicator */}
              <div className="relative z-10 flex justify-center -my-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-kennel-navy-400/15 shadow-sm">
                  <MessageCircle className="h-3 w-3 text-tovernet-500" />
                  <span className="text-[10px] font-bold text-kennel-navy-700 whitespace-nowrap">{flowLabel}</span>
                </div>
              </div>

              {/* public dog profile card — bleeds toward the edge of the viewport to invite scrolling */}
              <div className="relative z-10 ml-auto w-[72%] translate-y-3 rounded-2xl bg-white border border-kennel-navy-400/10 kennel-card-shadow p-4 rotate-2">
                <div className="h-28 rounded-xl bg-kennel-pink-100 flex items-center justify-center mb-3 overflow-hidden">
                  {dog?.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={dog.photoUrl} alt={dog.name} className="h-full w-full object-cover" />
                  ) : (
                    <PuppyAvatar className="h-12 w-12" />
                  )}
                </div>
                <p className="font-bold text-kennel-navy-900 text-sm">{dog?.name ?? 'Bella'}</p>
                <p className="text-xs text-kennel-navy-400">
                  {dog ? [dog.color, dog.sexLabel].filter(Boolean).join(' · ') : 'Blue & Tan · Suczka'}
                </p>
              </div>

              {/* live status pill */}
              <div className="relative z-10 flex justify-center mt-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-kennel-teal-50 border border-kennel-teal-300 text-[11px] font-bold text-kennel-teal-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-kennel-teal-500 animate-pulse" />
                  {mobileLivePill}
                </span>
              </div>

              {/* compact social proof */}
              <div className="relative z-10 text-center mt-4">
                <p className="text-xs font-semibold text-kennel-navy-500">{mobileProofLine}</p>
                <p className="text-sm font-bold text-kennel-navy-900 mt-0.5">{mobileProofStats}</p>
              </div>
            </div>
          </div>

          {/* Right: layered visual (desktop only) — dashboard behind, puppy card in front, status transition */}
          <div className="hidden lg:block relative h-[420px] sm:h-[460px]">
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
              <div className="h-24 rounded-xl bg-kennel-pink-100 flex items-center justify-center mb-3 overflow-hidden">
                {dog?.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={dog.photoUrl} alt={dog.name} className="h-full w-full object-cover" />
                ) : (
                  <PuppyAvatar className="h-12 w-12" />
                )}
              </div>
              <p className="font-bold text-kennel-navy-900 text-sm">{dog?.name ?? 'Bella'}</p>
              <p className="text-xs text-kennel-navy-400 mb-3">
                {dog ? [dog.color, dog.sexLabel].filter(Boolean).join(' · ') : 'Blue & Tan · Suczka'}
              </p>
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
