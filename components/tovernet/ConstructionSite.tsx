import { CONSTRUCTION_VARIANTS, presentCity, presentName, type ConstructionVariant } from '@/lib/tovernet/construction';
import type { PublicDemo, ConstructionVariantKey } from '@/lib/tovernet/api';

// The rendered website concept. All company facts come from `company`; everything
// else is template copy. Illustrations are generated line art, never presented as
// the company's work.

function Art({ kind, color }: { kind: ConstructionVariant['art']; color: string }) {
  const common = { fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const drawings: Record<ConstructionVariant['art'], JSX.Element> = {
    frame: (
      <g {...common}>
        <path d="M40 300V130l130-80 130 80v170M40 130h260M100 300V170h70v130M210 170h60v60h-60zM170 50v80" />
        <path d="M350 300V60M330 60h130M350 90l60-30M440 60v70" />
        <path d="M20 300h460" strokeWidth={3} />
      </g>
    ),
    road: (
      <g {...common}>
        <path d="M20 300 190 90h120l170 210M250 110v30M250 170v40M250 240v50" />
        <path d="M60 90h60l30 40h-90zM80 130v30M130 130v30" />
        <path d="M20 300h460" strokeWidth={3} />
      </g>
    ),
    walls: (
      <g {...common}>
        <path d="M60 300V70h380v230M60 300h380M60 70l80 50h220l80-50M140 120v180M360 120v180" />
        <path d="M190 190h120v110H190zM250 190v110M190 245h120" />
      </g>
    ),
    circuit: (
      <g {...common}>
        <path d="M250 40 190 170h60l-30 110 100-150h-60l40-90z" strokeWidth={3} />
        <path d="M40 100h110M40 200h90M360 100h100M380 200h80M40 100v100M460 100v100" />
        <circle cx="40" cy="150" r="8" /><circle cx="460" cy="150" r="8" />
      </g>
    ),
    pipes: (
      <g {...common}>
        <path d="M30 90h170a40 40 0 0 1 40 40v60a40 40 0 0 0 40 40h190M30 130h150a20 20 0 0 1 20 20v60a80 80 0 0 0 80 80h190" />
        <path d="M100 70v80M360 210v100M320 60h90v60h-90zM365 120v60" />
      </g>
    ),
    tools: (
      <g {...common}>
        <path d="M60 300h380M100 300V140h300v160M100 200h300M200 140v60M300 200v100M160 200v100" />
        <path d="M180 100l70-50 70 50M250 50v90" />
      </g>
    ),
  };
  return (
    <svg viewBox="0 0 500 330" aria-hidden="true" className="w-full h-auto">
      <defs>
        <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M25 0H0V25" fill="none" stroke={color} strokeOpacity="0.14" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="500" height="330" fill="url(#grid)" />
      {drawings[kind]}
    </svg>
  );
}

/** `embedded`: shown inside another page, so its hero title must not be the page's h1. */
export default function ConstructionSite({ company, variant, embedded = false }: { company: PublicDemo['config']['company']; variant: ConstructionVariantKey; embedded?: boolean }) {
  const Title = embedded ? 'p' : 'h1';
  const v = CONSTRUCTION_VARIANTS[variant] ?? CONSTRUCTION_VARIANTS.general;
  const t = v.theme;
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const light = variant === 'finishing';

  return (
    <div style={{ background: t.bg, color: t.ink }}>
      <header style={{ borderColor: t.line }} className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <span className="text-lg font-extrabold tracking-tight">{name}</span>
          <span style={{ background: t.accent, color: t.onAccent }} className="rounded px-3 py-2 text-sm font-bold">{v.cta}</span>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-24">
        <div>
          <p style={{ color: t.accent }} className="mb-4 text-sm font-bold uppercase tracking-[0.18em]">{v.trade}</p>
          <Title className={`text-4xl leading-[1.05] md:text-6xl ${light ? 'font-semibold tracking-tight' : 'font-black uppercase tracking-tight'}`}>
            {v.headline(city)}
          </Title>
          <p style={{ color: t.muted }} className="mt-6 max-w-md text-lg leading-relaxed">{v.lead}</p>
          <a href="#kontakt" style={{ background: t.accent, color: t.onAccent }} className="mt-8 inline-block rounded px-6 py-4 font-bold">{v.cta}</a>
        </div>
        <Art kind={v.art} color={t.accent} />
      </section>

      <section style={{ background: t.surface }}>
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-3xl font-extrabold tracking-tight">Zakres usług</h2>
            <span style={{ color: t.muted, borderColor: t.line }} className="rounded-full border px-3 py-1 text-xs">Przykładowe usługi, do potwierdzenia przez firmę</span>
          </div>
          <div className="grid gap-px md:grid-cols-2" style={{ background: t.line }}>
            {v.services.map((s, i) => (
              <div key={s.title} style={{ background: t.surface }} className="p-6 md:p-8">
                <span style={{ color: t.accent }} className="text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
                <p style={{ color: t.muted }} className="mt-2 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <h2 className="mb-10 text-3xl font-extrabold tracking-tight">Jak pracujemy</h2>
        <ol className="grid gap-6 md:grid-cols-4">
          {v.steps.map((s, i) => (
            <li key={s} style={{ borderColor: t.accent }} className="border-t-4 pt-4">
              <span style={{ color: t.muted }} className="text-sm">Krok {i + 1}</span>
              <p className="mt-1 text-lg font-bold">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="kontakt" style={{ background: t.surface }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">{v.formTitle}</h2>
            <p style={{ color: t.muted }} className="mt-3">{v.formHint}</p>
            {city && <p className="mt-6 font-bold">Siedziba: {city}</p>}
          </div>
          <div aria-hidden="true" className="space-y-3">
            {['Imię', 'Telefon', 'Opis zlecenia'].map((f, i) => (
              <div key={f} style={{ borderColor: t.line, color: t.muted }} className={`rounded border px-4 ${i === 2 ? 'h-24 pt-3' : 'py-3'}`}>{f}</div>
            ))}
            <div style={{ background: t.accent, color: t.onAccent }} className="rounded px-4 py-3 text-center font-bold">{v.cta}</div>
          </div>
        </div>
      </section>

      <footer style={{ borderColor: t.line, color: t.muted }} className="border-t">
        <div className="mx-auto max-w-6xl px-5 py-6 text-sm">
          {company.legal_name}{company.krs ? `, KRS ${company.krs}` : ''}
        </div>
      </footer>
    </div>
  );
}
