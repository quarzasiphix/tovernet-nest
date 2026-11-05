'use client';

import { tradeOf } from '@/lib/tovernet/niches';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, BadgeCheck, Check, ChevronDown, ChevronUp, Eye, FileCheck2, Inbox, Info, Scale, Smartphone, Sparkles } from 'lucide-react';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentCity, presentName } from '@/lib/tovernet/construction';
import { cheapestStart, termsFor } from '@/lib/tovernet/payments';
import { cartLines, type Cart } from '@/lib/tovernet/funnel';
import { funnelCopy } from '@/lib/tovernet/funnelCopy';
import ConceptSite from '../ConceptSite';
import type { JourneyActions } from '../funnel/Journey';
import { AFTER, FAQ } from './copy';
import { Scaled, delay, price, useTween } from './motion';
import Packages from './offer/Packages';
import Plans from './offer/Plans';
import Extras from './offer/Extras';
import ValueCalc from './offer/ValueCalc';
import Freedom from './offer/Freedom';
import Migration, { JourneySwitch } from './offer/Migration';
import Summary from './offer/Summary';
import { GUARANTEE, GUARANTEE_FINE, SEASONAL, type Journey } from './offer/offerCopy';
import s from './studio.module.css';
import o from './offer/offer.module.css';

const JOB_ICONS = [Eye, Inbox, Smartphone];
const GUARANTEE_ICONS = [Eye, FileCheck2, Scale];

/**
 * Stage 3: the sales page (ksiegai/docs/plans/tovernet/16-offer-redesign.md). Outcome, scope
 * with a full-scope sheet per package, plans recommended by package, add-ons, freedom to
 * leave, process, objections. Cart rules as funnel/StageOffer.tsx.
 */
export default function Offer({ demo, cart, setCart, actions, onOrder, onConcept }: {
  demo: PublicDemo; cart: Cart; setCart: (c: Cart) => void; actions: JourneyActions; onOrder: () => void; onConcept: () => void;
}) {
  const { track } = actions;
  const company = demo.config.company;
  const name = presentName(company.display_name);
  const city = presentCity(company.city);
  const trade = tradeOf(demo.config.variant);
  const packages = demo.packages.filter((p) => p.kind === 'package');
  const plans = demo.packages.filter((p) => p.kind === 'recurring');
  const addons = demo.packages.filter((p) => p.kind === 'addon');
  const pkg = packages.find((p) => p.key === cart.pkg) ?? packages[0];
  const plan = plans.find((p) => p.key === cart.plan);
  const pkgName = pkg?.name.replace(/^Strona /, '') ?? '';
  const { once, monthly, today } = cartLines(demo, cart);
  const copy = funnelCopy(demo.config.variant);
  const exempt = demo.packages.every((p) => p.vat_exempt);
  const [journey, setJourney] = useState<Journey>('new');
  const [ask, setAsk] = useState<{ text: string; n: number } | null>(null);
  const [dockOpen, setDockOpen] = useState(false);
  const shownToday = useTween(today);

  const order = (placement: string) => {
    track('cta_clicked', { placement });
    track('configure_completed', { package: cart.pkg, plan: cart.plan, addons: Object.keys(cart.qty).filter((k) => cart.qty[k] > 0), once_minor: once, monthly_minor: monthly, signed_in: Boolean(actions.account), journey });
    onOrder();
  };
  const choosePkg = (key: string) => {
    const p = packages.find((x) => x.key === key);
    setCart({ ...cart, pkg: key });
    track('package_selected', { package: key, price_minor: p?.gross_minor, journey });
  };

  const start = cheapestStart(demo);

  return (
    <div className={s.offer}>
      <section className={`${s.wrap} ${s.offerHero}`}>
        <div>
          <p className={`${s.chip} ${s.rise}`}><span className={s.pulse} aria-hidden="true" />Oferta dla {name}</p>
          <h1 className={`${s.h1} ${s.rise}`} style={delay(80)}>Ten koncept może zacząć pracować <em>dla Twojej firmy.</em></h1>
          <p className={`${s.lead} ${s.rise}`} style={delay(160)}>Koncept już widziałeś. Dopracujemy go z Twoim numerem, usługami i zdjęciami. Cenę znasz teraz, a gotową stronę zobaczysz i poprawisz, zanim trafi do sieci.</p>
          <ul className={`${o.heroFacts} ${s.rise}`} style={delay(220)}>
            <li><Check size={15} aria-hidden="true" />Stała cena za ustalony zakres</li>
            <li><Check size={15} aria-hidden="true" />Akceptacja przed publikacją</li>
            <li><Check size={15} aria-hidden="true" />Plan bez umowy na rok</li>
          </ul>
          {start && (
            <p className={`${o.startBanner} ${s.rise}`} style={delay(280)}>
              <b>Zacznij od {price(start.upfront)}.</b> Resztę płacisz w miesięcznych ratach, bez odsetek i dodatkowych opłat. Strona razem od {price(start.total)}.
            </p>
          )}
        </div>
        <div className={`${s.pcard} ${s.rise}`} style={delay(220)}>
          <div className={s.pcardShot}>
            <div aria-hidden="true"><Scaled width={1280} className={s.pcardPan}><ConceptSite company={company} variant={demo.config.variant} embedded preview /></Scaled></div>
            <button type="button" className={s.pcardHover} onClick={onConcept}><Eye size={16} aria-hidden="true" />Wróć do konceptu</button>
          </div>
          <div className={s.pcardBody}>
            <p className={s.pcardName}>{name}</p>
            <p className={s.pcardMeta}>{[trade, city, company.krs ? `KRS ${company.krs}` : null].filter(Boolean).join(' · ')}</p>
            <p className={s.pcardStage}><i aria-hidden="true" />Etap: oferta · przygotował Wiktor, Tovernet</p>
          </div>
        </div>
      </section>

      <div className={`${s.wrap} ${s.offerGrid}`}>
        <div className={s.offerMain}>
          <section className={s.section} data-reveal="">
            <h2 className={s.h2}>Co ta strona robi dla Twojej firmy</h2>
            <div className={s.jobs}>
              {copy.jobs.map(([t, d], i) => {
                const Icon = JOB_ICONS[i] ?? Sparkles;
                return <article key={t} className={s.job}><span className={s.jobIcon}><Icon size={20} aria-hidden="true" /></span><b>{t}</b><p>{d}</p></article>;
              })}
            </div>
            <p className={s.honest}><Info size={16} aria-hidden="true" />Nie obiecujemy pozycji w Google ani konkretnej liczby zapytań, bo zależą też od rzeczy poza stroną. Robimy stronę, która jasno mówi, czym się zajmujesz, i ułatwia kontakt.</p>
          </section>

          <section className={s.section} aria-labelledby="zakres" data-reveal="">
            <p className={s.kicker}>Krok 1 z 3 · wykonanie strony</p>
            <h2 id="zakres" className={`${s.h2} ${o.h2gap}`}>Wybierz zakres strony</h2>
            <p className={s.sub}>{start ? 'Za wykonanie płacisz jednorazowo albo w ratach bez odsetek; wybierasz w zamówieniu.' : 'Jedna płatność za wykonanie.'} {exempt ? 'Kwoty są ostateczne, bez doliczania VAT.' : 'Ceny brutto.'} Koncept to punkt wyjścia: kolory, układ, teksty, zdjęcia i usługi zmienisz w granicach pakietu.</p>
            <JourneySwitch value={journey} onChange={(j) => { setJourney(j); track('journey_selected', { journey: j }); }} />
            <Packages demo={demo} packages={packages} addons={addons} selected={cart.pkg} journey={journey} onSelect={choosePkg} track={track} />
            {journey === 'migration' && <Migration track={track} />}
            {pkg && copy.fit[pkg.key] && (
              <div className={s.fitNote} key={pkg.key}>
                <Sparkles size={18} aria-hidden="true" />
                <div>
                  <b>{pkg.recommended ? `Dlaczego ${pkgName} do tego konceptu` : `${pkgName}: czym się różni`}</b>
                  <p>{copy.fit[pkg.key]}</p>
                </div>
              </div>
            )}
            {pkg && <ValueCalc pkgName={pkgName} once={pkg.gross_minor} monthly={plan?.gross_minor ?? 0} track={track} />}
          </section>

          <section className={s.section} aria-labelledby="pewnosc" data-reveal="">
            <h2 id="pewnosc" className={s.h3}>Chcemy, żebyś był zadowolony ze swojej strony</h2>
            <div className={o.guar}>
              {GUARANTEE.map(([t, d], i) => {
                const Icon = GUARANTEE_ICONS[i] ?? BadgeCheck;
                return <article key={t}><Icon size={19} aria-hidden="true" /><b>{t}</b><p>{d}</p></article>;
              })}
            </div>
            <p className={o.guarFine}>{GUARANTEE_FINE}</p>
          </section>

          <section className={s.section} aria-labelledby="plan" data-reveal="">
            <p className={s.kicker}>Krok 2 z 3 · po publikacji</p>
            <h2 id="plan" className={`${s.h2} ${o.h2gap}`}>Plan miesięczny</h2>
            <p className={s.sub}>Strona musi gdzieś działać: serwer, certyfikat SSL, kopie zapasowe, aktualizacje i odnawiana domena. Dlatego do strony dobierasz plan. Pokazujemy te, które najlepiej pasują do pakietu {pkgName}, ale możesz wybrać każdy.</p>
            <Plans plans={plans} pkgKey={cart.pkg} pkgName={pkgName} selected={cart.plan}
                   onSelect={(key) => setCart({ ...cart, plan: key })} track={track} />
          </section>

          {addons.length > 0 && (
            <section className={s.section} aria-labelledby="dodatki" data-reveal="">
              <p className={s.kicker}>Krok 3 z 3 · opcjonalnie</p>
              <h2 id="dodatki" className={`${s.h2} ${o.h2gap}`}>Dodatki</h2>
              <p className={s.sub}>Płacisz raz, razem ze stroną. To, co jest już w Twoim pakiecie, oznaczamy i nie doliczamy.</p>
              <Extras addons={addons} cart={cart} setCart={setCart} track={track}
                      onAsk={(text) => setAsk((a) => ({ text, n: (a?.n ?? 0) + 1 }))} />
            </section>
          )}

          <section className={s.section} aria-labelledby="wolnosc" data-reveal="">
            <h2 id="wolnosc" className={s.h2}>Zostajesz, bo chcesz. Nie dlatego, że musisz.</h2>
            <p className={s.sub}>Bez umów na rok, kar i zatrzymywania czegokolwiek. Strona i domena są Twoje.</p>
            <Freedom plans={plans} seasonal={SEASONAL.includes(demo.config.variant)} />
          </section>

          <section className={s.section} data-reveal="">
            <h2 className={s.h2}>Co dzieje się po zamówieniu</h2>
            <p className={s.sub}>Większość pracy jest po naszej stronie. Od Ciebie potrzebujemy kilku informacji i akceptacji.</p>
            <ol className={s.timeline}>
              {AFTER.map(([t, we, you], i) => (
                <li key={t} style={delay(i * 110)}>
                  <span className={s.tNum}>{i + 1}</span>
                  <b>{t}</b>
                  <p><span>My</span>{we}</p>
                  <p><span>Ty</span>{you}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className={s.section} id="pytania" data-reveal="">
            <h2 className={s.h3}>Pytania przed zamówieniem</h2>
            <div className={s.faq}>
              {FAQ.map(([q, a]) => (
                <details key={q}><summary>{q}<ChevronDown size={18} aria-hidden="true" /></summary><p>{a}</p></details>
              ))}
            </div>
            <Ask actions={actions} prefill={ask} />
          </section>

          <section className={s.closing} data-reveal="">
            <p className={s.kicker}>Twój wybór</p>
            <p className={s.closingTitle}>{pkg?.name}{plan ? ` z planem ${plan.name}` : ''}</p>
            <p className={s.closingText}>Dziś {price(today)}: wykonanie strony{once > (pkg?.gross_minor ?? 0) ? ' z dodatkami' : ''}{termsFor(demo, cart.pkg) ? ' (albo pierwsza rata, wybierzesz w zamówieniu)' : ''}. Plan {price(monthly)} co miesiąc od publikacji strony. {exempt ? 'Kwoty są ostateczne.' : 'Ceny brutto.'}</p>
            <button type="button" className={s.cta} onClick={() => order('offer_order')}>Przejdź do zamówienia<ArrowRight size={19} aria-hidden="true" /></button>
          </section>
        </div>

        <aside className={`${s.summary} ${o.aside}`} aria-label="Podsumowanie">
          <Summary demo={demo} cart={cart} journey={journey} exempt={exempt} onOrder={() => order('offer_summary')} />
        </aside>
      </div>

      <div className={`${s.dock} ${o.dock}`} data-open={dockOpen || undefined}>
        <div className={o.dockSheet} id="dock-sheet" hidden={!dockOpen}>
          <Summary demo={demo} cart={cart} journey={journey} exempt={exempt} onOrder={() => order('offer_dock_sheet')} compact />
        </div>
        <div className={o.dockBar}>
          <button type="button" className={o.dockToggle} aria-expanded={dockOpen} aria-controls="dock-sheet" onClick={() => setDockOpen((v) => !v)}>
            <span>{pkgName}{plan ? ` + ${plan.name}` : ''}</span>
            <b>{price(shownToday)}</b>
            <small>dziś, potem {price(monthly)} / mies.{dockOpen ? <ChevronDown size={13} aria-hidden="true" /> : <ChevronUp size={13} aria-hidden="true" />}</small>
          </button>
          <button type="button" className={s.cta} onClick={() => order('offer_dock')}>Zamawiam<ArrowRight size={17} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}

function Ask({ actions, prefill }: { actions: JourneyActions; prefill: { text: string; n: number } | null }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const area = useRef<HTMLTextAreaElement>(null);
  const known = Boolean(actions.inviteEmail || actions.account);
  useEffect(() => {
    if (!prefill || !area.current) return;
    if (state === 'sent') setState('idle');
    area.current.value = prefill.text;
    area.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    area.current.focus({ preventScroll: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill?.n]);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setState('sending');
    const r = await actions.ask(String(d.get('message') ?? '').trim(), known ? null : String(d.get('contact') ?? '').trim());
    setState(r.ok ? 'sent' : 'error');
    if (r.ok) actions.track('inquiry_sent', { source: 'offer' });
  };
  if (state === 'sent') return <p role="status" className={s.sent}><Check size={18} aria-hidden="true" />Dziękujemy. Odpowiemy e-mailem{actions.inviteEmail ? ` na ${actions.inviteEmail}` : ''}.</p>;
  return (
    <form onSubmit={submit} className={s.ask}>
      <label><span className={s.label}>Twoje pytanie</span>
        <textarea ref={area} className={s.field} name="message" required rows={3} placeholder="Np. czy mogę dodać drugą firmę albo zmienić kolorystykę?" />
      </label>
      {!known && <label><span className={s.label}>E-mail lub telefon do odpowiedzi</span><input className={s.field} name="contact" required autoComplete="email" /></label>}
      <button type="submit" className={s.ghost} disabled={state === 'sending'}>{state === 'sending' ? 'Wysyłamy…' : 'Wyślij pytanie'}</button>
      {state === 'error' && <p role="alert" className={s.err}>Nie udało się wysłać. Spróbuj ponownie.</p>}
    </form>
  );
}
