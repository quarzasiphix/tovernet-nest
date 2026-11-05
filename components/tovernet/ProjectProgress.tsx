'use client';

export type PanelProject = {
  id: string;
  name: string;
  status: string;
  company_name: string;
  preview_url: string | null;
  production_url: string | null;
  domain: string | null;
  open_requests: number;
  lead_id: string | null;
  order_id: string;
};

const STEPS: { key: string; label: string; next: string }[] = [
  { key: 'new', label: 'Zamówienie', next: 'Zamówienie opłacone. Uzupełnij materiały poniżej, a zaczniemy pracę.' },
  { key: 'awaiting_information', label: 'Materiały', next: 'Zbieramy materiały. Szczegóły poniżej.' },
  { key: 'in_production', label: 'Realizacja', next: 'Pracujemy nad stroną. Damy znać, gdy będzie gotowa do przeglądu.' },
  { key: 'client_review', label: 'Twój przegląd', next: 'Strona czeka na Twoją decyzję. Szczegóły poniżej.' },
  { key: 'ready_to_launch', label: 'Publikacja', next: 'Ustalamy termin publikacji i domenę.' },
  { key: 'completed', label: 'Online', next: 'Strona jest opublikowana.' },
];

/** Steps from order to a live site, the domain, and what comes next. */
export default function ProjectProgress({ project, dark = false }: { project: PanelProject; dark?: boolean }) {
  const cancelled = project.status === 'cancelled';
  const current = Math.max(0, STEPS.findIndex((s) => s.key === project.status));
  const step = STEPS[current];
  const liveUrl = project.production_url ?? (project.status === 'completed' && project.domain ? `https://${project.domain}` : null);
  const muted = dark ? 'text-white/60' : 'text-[#5A5C60]';

  return (
    <div>
      {cancelled ? (
        <p className="font-semibold">Projekt anulowany.</p>
      ) : (
        <>
          <ol className="grid grid-cols-6 gap-1" aria-label="Postęp realizacji">
            {STEPS.map((s, i) => (
              <li key={s.key} className="min-w-0">
                <div className={`h-1 ${i === current ? (dark ? 'bg-white' : 'bg-[#2536C4]') : i < current ? (dark ? 'bg-white' : 'bg-[#15161A]') : (dark ? 'bg-white/20' : 'bg-[#C8C9C2]')}`} />
                <p className={`mt-2 truncate text-[11px] font-semibold sm:text-xs ${i === current ? '' : muted}`} aria-current={i === current ? 'step' : undefined}>{s.label}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4">{step.next}</p>
          {project.open_requests > 0 && <p className="mt-2 font-semibold">Otwarte prośby o informacje: {project.open_requests}</p>}
        </>
      )}

      <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className={`text-xs uppercase tracking-wider ${muted}`}>Domena</dt>
          <dd className="mt-1 font-semibold">
            {liveUrl ? <a className="underline" href={liveUrl} target="_blank" rel="noreferrer">{project.domain ?? liveUrl.replace(/^https?:\/\//, '')}</a>
              : project.domain ?? 'Ustalimy razem przed publikacją'}
          </dd>
        </div>
        <div>
          <dt className={`text-xs uppercase tracking-wider ${muted}`}>Podgląd</dt>
          <dd className="mt-1 font-semibold">
            {project.preview_url ? <a className="underline" href={project.preview_url} target="_blank" rel="noreferrer">Otwórz podgląd</a> : 'Pojawi się, gdy projekt będzie gotowy'}
          </dd>
        </div>
      </dl>
    </div>
  );
}

/** Google visibility reports: placeholder until Search Console reports are connected. */
export function ReportsTeaser({ project, dark = false }: { project: PanelProject; dark?: boolean }) {
  const live = project.status === 'completed';
  return (
    <div className={`p-5 ${dark ? 'bg-white/10' : 'border border-[#C8C9C2]'}`}>
      <p className="font-bold">Raporty z Google</p>
      <p className={`mt-1 text-sm ${dark ? 'text-white/70' : 'text-[#5A5C60]'}`}>
        {live
          ? 'Łączymy stronę z Google Search Console. Pierwszy raport (wyświetlenia, kliknięcia, frazy) zobaczysz tutaj, gdy Google zbierze dane.'
          : 'Po publikacji zobaczysz tu, jak często Twoja strona pokazuje się w Google, na jakie frazy i ile osób ją odwiedza.'}
      </p>
    </div>
  );
}
