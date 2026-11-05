'use client';

import { tradeOf } from '@/lib/tovernet/niches';
import { useState, type FormEvent } from 'react';
import type { PublicDemo } from '@/lib/tovernet/api';
import { presentName } from '@/lib/tovernet/construction';
import { money } from '@/lib/tovernet/money';
import { QUIET_PLANS, cartLines, honestTagline, type Cart } from '@/lib/tovernet/funnel';
import Karta from '../Karta';
import { funnelCopy } from '@/lib/tovernet/funnelCopy';
import type { JourneyActions } from './Journey';
import b from '../brand.module.css';
import f from './funnel.module.css';

const AFTER: [string, string, string][] = [
  ['Płatność i faktura', 'Fakturę wystawiamy automatycznie.', 'Nic więcej nie robisz.'],
  ['Ankieta w panelu klienta', 'Podpowiadamy, czego potrzeba.', 'Podajesz numer, usługi i zdjęcia. Wystarczą z telefonu.'],
  ['Projekt do akceptacji', 'Dopracowujemy koncept z Twoimi danymi.', 'Oglądasz stronę i zgłaszasz poprawki.'],
  ['Publikacja', 'Publikujemy stronę pod Twoją domeną.', 'Dostajesz dostęp do panelu klienta.'],
];

const FAQ: [string, string][] = [
  ['Nie mam jeszcze zdjęć ani opinii. Czy to ma sens?', 'Tak. Koncept jest zaprojektowany tak, żeby dobrze wyglądał bez nich. Zdjęcia z telefonu możesz przesłać w ankiecie po zamówieniu.'],
  ['Czy mogę zmienić usługi, teksty i kolory?', 'Tak. Usługi w koncepcie są przykładowe. Ustalimy je w ankiecie, a całą stronę zobaczysz przed publikacją.'],
  ['Dlaczego plan miesięczny jest obowiązkowy?', 'Strona musi gdzieś działać: serwer, certyfikat SSL, kopie zapasowe i aktualizacje. Plan to obejmuje. Rezygnację zgłaszasz w panelu klienta, ze skutkiem na koniec okresu rozliczeniowego.'],
  ['Kto wystawia fakturę?', 'Tovernet sp. z o.o., automatycznie po płatności, na firmę z KRS. Jesteśmy zwolnieni z VAT, więc kwoty na stronie są ostateczne.'],
  ['Mogę najpierw o coś zapytać?', 'Tak. Napisz poniżej, odpowiemy e-mailem.'],
];

/** Stage 3: the sales page. Outcome, recommended scope with its reason, plan, process, limits, objections. */
export default function StageOffer({ demo, cart, setCart, actions, onOrder, onConcept }: {
  demo: PublicDemo; cart: Cart; setCart: (c: Cart) => void; actions: JourneyActions; onOrder: () => void; onConcept: () => void;
}) {
  const { track } = actions;
  const company = demo.config.company;
  const name = presentName(company.display_name);
  const trade = tradeOf(demo.config.variant);
  const packages = demo.packages.filter((p) => p.kind === 'package');
  const plans = demo.packages.filter((p) => p.kind === 'recurring');
  const addons = demo.packages.filter((p) => p.kind === 'addon');
  const [showQuiet, setShowQuiet] = useState(() => QUIET_PLANS.includes(cart.plan ?? ''));
  const visiblePlans = plans.filter((p) => showQuiet || !QUIET_PLANS.includes(p.key));
  const pkg = packages.find((p) => p.key === cart.pkg) ?? packages[0];
  const plan = plans.find((p) => p.key === cart.plan);
  const { once, monthly, today } = cartLines(demo, cart);
  const copy = funnelCopy(demo.config.variant);
  const reasons = copy.fit;
  const exempt = demo.packages.every((p) => p.vat_exempt);
  const excluded = Array.from(new Set([...(pkg?.exclusions ?? []), ...(plan?.exclusions ?? [])]));

  const order = (placement: string) => {
    track('cta_clicked', { placement });
    track('configure_completed', { package: cart.pkg, plan: cart.plan, addons: Object.keys(cart.qty).filter((k) => cart.qty[k] > 0), once_minor: once, monthly_minor: monthly, signed_in: Boolean(actions.account) });
    onOrder();
  };

  return (
    <>
      <section className={f.offerHead}>
        <div>
          <p className={b.l}>Oferta dla {name}</p>
          <h1 className={f.h1}>Ten koncept może być Twoją stroną.</h1>
          <p className={f.lead}>Dopracujemy go z Twoim numerem, usługami i zdjęciami. Cenę znasz teraz, a gotową stronę zobaczysz i poprawisz przed publikacją.</p>
          <button type="button" className={b.link} onClick={onConcept}>Wróć do konceptu</button>
        </div>
        <div className={f.offerKarta}>
          <Karta displayName={company.display_name} city={company.city} krs={company.krs} trade={trade} stage="Oferta" corner={['Przygotował', 'Wiktor, Tovernet']} />
        </div>
      </section>

      <div className={f.offerGrid}>
        <div className={f.offerMain}>
          <section className={f.block}>
            <h2 className={f.h2}>Co ta strona robi dla Twojej firmy</h2>
            <ol className={f.index}>
              {copy.jobs.map(([t, d], i) => <li key={t}><span className={f.num}>0{i + 1}</span><div><b>{t}</b><p>{d}</p></div></li>)}
            </ol>
            <p className={f.honest}>Nie obiecujemy pozycji w Google ani konkretnej liczby zapytań, bo zależą też od rzeczy poza stroną. Robimy stronę, która jasno mówi, czym się zajmujesz, i ułatwia kontakt.</p>
          </section>

          <section className={f.block} aria-labelledby="zakres">
            <h2 id="zakres" className={f.h2}>Zakres strony</h2>
            <div role="radiogroup" aria-label="Pakiet" className={f.tabs}>
              {packages.map((p) => (
                <button key={p.key} type="button" role="radio" aria-checked={cart.pkg === p.key}
                        onClick={() => { setCart({ ...cart, pkg: p.key }); track('package_selected', { package: p.key, price_minor: p.gross_minor }); }}>
                  <span className={f.tabName}>{p.name.replace(/^Strona /, '')}</span>
                  <span className={f.tabPrice}>{money(p.gross_minor)}</span>
                  {p.recommended && <span className={f.fit}>Pasuje do konceptu</span>}
                </button>
              ))}
            </div>
            {pkg && (
              <div className={f.pkg}>
                <div className={f.pkgHead}>
                  <div>
                    <h3>{pkg.name}</h3>
                    {pkg.description && <p>{pkg.description}</p>}
                  </div>
                  <p className={f.pkgPrice}><b>{money(pkg.gross_minor)}</b><span>jednorazowo</span></p>
                </div>
                {reasons[pkg.key] && <p className={f.reason}><span className={b.l}>{pkg.recommended ? 'Dlaczego ten' : 'Czym się różni'}</span>{reasons[pkg.key]}</p>}
                <ul className={f.incl}>{pkg.included.map((x) => <li key={x}>{x}</li>)}</ul>
                {pkg.recommended && <p className={f.compare}>{copy.compare}</p>}
              </div>
            )}
          </section>

          <section className={f.block}>
            <h2 className={f.h2}>Plan po publikacji</h2>
            <p className={f.lead}>Strona musi gdzieś działać: serwer, certyfikat SSL, kopie zapasowe i aktualizacje. Dlatego do pakietu dobierasz plan miesięczny. Rezygnujesz w panelu klienta, na koniec okresu.</p>
            <div className={b.spec} style={{ marginTop: 24 }}>
              {visiblePlans.map((p) => (
                <label key={p.key} className={b.row}>
                  <input type="radio" name="plan" checked={cart.plan === p.key} onChange={() => { setCart({ ...cart, plan: p.key }); track('plan_selected', { plan: p.key, price_minor: p.gross_minor }); }} />
                  <span className={b.top}><span className={b.mark} /><span className={b.nm}>{p.name}</span><span className={b.pr}>{money(p.gross_minor)}<small> / mies.</small></span></span>
                  <span className={b.ds}>{honestTagline(p) ?? p.description}</span>
                  <ul className={b.inc}>{p.included.map((x) => <li key={x}>{x}</li>)}</ul>
                </label>
              ))}
            </div>
            {!showQuiet && plans.some((p) => QUIET_PLANS.includes(p.key)) && (
              <button type="button" className={b.link} style={{ marginTop: 12 }} onClick={() => setShowQuiet(true)}>Inne plany</button>
            )}
          </section>

          {addons.length > 0 && (
            <details className={f.addons}>
              <summary><span>Dodatki</span><span className={b.l}>opcjonalnie</span></summary>
              <div className={b.spec}>
                {addons.map((a) => {
                  const included = a.included_in.includes(cart.pkg ?? '');
                  const value = cart.qty[a.key] ?? 0;
                  return (
                    <div key={a.key} className={`${b.addon} ${included ? b.addonIn : ''}`}>
                      <label className={f.addonLabel}>
                        <input type="checkbox" disabled={included} checked={included || value > 0}
                               onChange={(e) => { setCart({ ...cart, qty: { ...cart.qty, [a.key]: e.target.checked ? 1 : 0 } }); track('addon_changed', { addon: a.key, selected: e.target.checked }); }} />
                        <span><b>{a.name}</b><small>{a.description}</small></span>
                      </label>
                      <span className={f.addonEnd}>
                        {a.max_quantity > 1 && value > 0 && (
                          <span className={f.addonQty}>
                            <button type="button" aria-label="Mniej" onClick={() => setCart({ ...cart, qty: { ...cart.qty, [a.key]: Math.max(0, value - 1) } })} className={b.qty}>−</button>
                            <span aria-live="polite">{value}</span>
                            <button type="button" aria-label="Więcej" onClick={() => setCart({ ...cart, qty: { ...cart.qty, [a.key]: Math.min(a.max_quantity, value + 1) } })} className={b.qty}>+</button>
                          </span>
                        )}
                        <span className={b.pr} style={{ fontSize: 16 }}>{included ? 'w pakiecie' : money(a.gross_minor)}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </details>
          )}

          <section className={f.block}>
            <h2 className={f.h2}>Co dzieje się po zamówieniu</h2>
            <ol className={f.after}>
              <li className={f.afterHead} aria-hidden="true"><span /><span className={b.l}>My</span><span className={b.l}>Ty</span></li>
              {AFTER.map(([t, we, you], i) => (
                <li key={t}><b><span className={f.num}>0{i + 1}</span>{t}</b><p><span className={f.who}>My: </span>{we}</p><p><span className={f.who}>Ty: </span>{you}</p></li>
              ))}
            </ol>
          </section>

          {excluded.length > 0 && (
            <section className={f.block}>
              <h2 className={f.h2s}>Czego ten zakres nie obejmuje</h2>
              <ul className={f.excl}>{excluded.map((x) => <li key={x}>{x}</li>)}</ul>
              <p className={f.small}>Prace spoza zakresu wyceniamy osobno, zanim cokolwiek zrobimy.</p>
            </section>
          )}

          <section className={f.block}>
            <h2 className={f.h2s}>Pytania przed zamówieniem</h2>
            <div className={f.faq}>
              {FAQ.map(([q, a]) => (
                <details key={q}><summary>{q}</summary><p>{a}</p></details>
              ))}
            </div>
            <Ask actions={actions} />
          </section>

          <section className={f.closing}>
            <p className={b.l}>Twój wybór</p>
            <p className={f.closingTitle}>{pkg?.name} i plan {plan?.name}</p>
            <p className={f.closingText}>Dziś {money(today)}, potem {money(monthly)} miesięcznie. {exempt ? 'Kwoty są ostateczne.' : 'Ceny brutto.'}</p>
            <button type="button" className={f.primary} onClick={() => order('offer_order')}>Zamawiam<span aria-hidden="true">→</span></button>
          </section>
        </div>

        <aside className={f.summary} aria-label="Podsumowanie">
          <p className={b.l}>Płatność dziś</p>
          <b className={f.total} data-testid="pay-today">{money(today)}</b>
          <p className={f.small}>{pkg?.name} {money(once)}{monthly ? `. Plan ${plan?.name} ${money(monthly)} miesięcznie od publikacji strony.` : '.'}</p>
          <p className={f.small}>{exempt ? 'Sprzedawca zwolniony z VAT. Kwoty są ostateczne.' : 'Ceny brutto, zawierają VAT.'}</p>
          <button type="button" className={f.primary} onClick={() => order('offer_summary')}>Zamawiam<span aria-hidden="true">→</span></button>
        </aside>
      </div>

      <div className={f.dock}>
        <div><span className={b.l}>Dziś</span><b>{money(today)}</b><small>potem {money(monthly)} / mies.</small></div>
        <button type="button" onClick={() => order('offer_dock')}>Zamawiam</button>
      </div>
    </>
  );
}

function Ask({ actions }: { actions: JourneyActions }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const known = Boolean(actions.inviteEmail || actions.account);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setState('sending');
    const r = await actions.ask(String(d.get('message') ?? '').trim(), known ? null : String(d.get('contact') ?? '').trim());
    setState(r.ok ? 'sent' : 'error');
    if (r.ok) actions.track('inquiry_sent', { source: 'offer' });
  };
  if (state === 'sent') return <p role="status" className={f.sent}>Dziękujemy. Odpowiemy e-mailem{actions.inviteEmail ? ` na ${actions.inviteEmail}` : ''}.</p>;
  return (
    <form onSubmit={submit} className={f.ask}>
      <label><span className={b.l}>Twoje pytanie</span>
        <textarea name="message" required rows={3} placeholder="Np. czy mogę dodać drugą firmę albo zmienić kolorystykę?" />
      </label>
      {!known && <label><span className={b.l}>E-mail lub telefon do odpowiedzi</span><input name="contact" required autoComplete="email" /></label>}
      <button type="submit" className={f.secondary} disabled={state === 'sending'}>{state === 'sending' ? 'Wysyłamy…' : 'Wyślij pytanie'}</button>
      {state === 'error' && <p role="alert" className={f.err}>Nie udało się wysłać. Spróbuj ponownie.</p>}
    </form>
  );
}
