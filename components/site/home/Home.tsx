/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { NICHES } from '@/lib/tovernet/niches';
import { SELLER } from '@/lib/seller';
import { PRICES, asLocale, copyFor, localPath, price } from '@/lib/site/copy';
import { PROJECTS, VERIFIED_ON, evidenceHref, hostOf, localize, siteProjects, type PortfolioProject } from '@/lib/tovernet/portfolio';
import { PreviewLink } from '../preview/ProjectPreview';
import { Lines, SectionHead } from '../Text';
import LivePlate, { type PlateSlide } from './LivePlate';
import ProjectIndex from './ProjectIndex';
import { StartButton, type Pkg } from '../start/StartFlow';
import s from '../site.module.css';
import h from './home.module.css';

const bySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug) as PortfolioProject;
const FEATURED = 3;

export default function Home({ locale: raw }: { locale: string }) {
  const locale = asLocale(raw);
  const c = copyFor(locale);
  const projects = siteProjects();
  const kindOf = (p: PortfolioProject) => c.kind[p.kind];
  const shortDate = new Date(`${VERIFIED_ON}T12:00:00`).toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const slides: PlateSlide[] = ['nekrolog-lodz', 'gryfin-york', 'pokiu', 'ksiegai'].map(bySlug).filter((p) => p.preview?.full).map((p) => {
    const l = localize(p, locale);
    return { slug: p.slug, name: p.name, meta: `${kindOf(p)} · ${l.category}`, host: p.url ? hostOf(p.url) : p.name,
      full: { ...p.preview!.full!, alt: l.alt(p.preview!.full!) }, phone: p.preview?.phone ? { src: p.preview.phone.src } : undefined };
  });

  return (
    <>
      {/* ============ hero ============ */}
      <section className={h.hero}>
        <div className={s.wrap}>
          <div className={h.heroTop}>
            <p className={s.label}><b>Tovernet</b> · {c.hero.label}</p>
            <p className={s.label}><i className={h.dotLive} aria-hidden="true" />{c.work.count(projects.length)} · {c.ticker.live}</p>
          </div>
          <Lines lines={c.hero.lines} as="h1" className={`${s.display} ${h.heroTitle}`} split />
          <div className={h.heroGrid}>
            <div className={h.heroCopy} data-reveal="" style={{ '--d': '320ms' } as CSSProperties}>
              <p className={s.lead}>{c.hero.lead}</p>
              <div className={h.heroCtas}>
                <a href="#realizacje" className={s.btn}>{c.hero.ctaWork}<ArrowDown size={18} aria-hidden="true" /></a>
                <a href="#cennik" className={`${s.btn} ${s.btnGhost}`}>{c.hero.ctaPrice(price(PRICES.start, locale))}</a>
              </div>
              <ul className={h.notes}>{c.hero.notes.map((n) => <li key={n}>{n}</li>)}</ul>
            </div>
            <div data-reveal="" style={{ '--d': '420ms' } as CSSProperties}>
              <LivePlate slides={slides} labels={{ live: c.hero.live, open: c.hero.open }} />
            </div>
          </div>
        </div>
        <div className={h.ticker} aria-hidden="true">
          <div className={h.tickerTrack}>
            {[0, 1].map((k) => projects.map((p) => (
              <span key={`${k}-${p.slug}`}><i /><b>{p.url ? hostOf(p.url) : p.name}</b>{c.ticker.live} · {kindOf(p)}</span>
            )))}
          </div>
        </div>
      </section>

      {/* ============ services ============ */}
      <section id="uslugi" className={h.sec}>
        {/* Old anchor (#solutions) still linked from the industry pages. */}
        <span id="solutions" className={h.anchor} aria-hidden="true" />
        <div className={s.wrap}>
          <SectionHead num={c.services.num} label={c.services.label} />
          <div className={h.secTop}>
            <Lines lines={c.services.title} className={s.h2} split />
            <p className={s.lead} data-reveal="">{c.services.lead}</p>
          </div>
          <ol className={h.svc}>
            {c.services.items.map((it, i) => (
              <li key={it.key} className={h.svcRow} data-reveal="" style={{ '--d': `${i * 60}ms` } as CSSProperties}>
                <span className={h.svcNum}>0{i + 1}</span>
                <h3 className={h.svcTitle}>{it.title}</h3>
                <div className={h.svcText}>
                  <p>{it.text}</p>
                  <small>{it.meta(price(PRICES.start, locale))}</small>
                </div>
                <div className={h.svcEx}>
                  <p className={s.label}>{c.services.examples}</p>
                  <div className={h.thumbs}>
                    {it.projects.map(bySlug).map((p) => (
                      <PreviewLink key={p.slug} slug={p.slug} placement={`services_${it.key}`} className={h.thumb} label={`${c.hero.open}: ${p.name}`}>
                        <img src={p.shots[0].src} alt="" loading="lazy" decoding="async" /><span aria-hidden="true">{p.name}</span>
                      </PreviewLink>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ work ============ */}
      <section id="realizacje" className={h.work}>
        <div className={`${s.wrap} ${s.ink}`} style={{ background: 'transparent' }}>
          <div className={h.sec}>
            <SectionHead num={c.work.num} label={c.work.label} aside={c.work.count(projects.length)} />
            <div className={h.secTop}>
              <Lines lines={c.work.title} className={s.h2} split />
              <p className={s.lead} data-reveal="">{c.work.lead}</p>
            </div>
          </div>

          {projects.slice(0, FEATURED).map((p, i) => {
            const l = localize(p, locale);
            const pal = p.palette ?? { bg: '#1B1C1F', fg: '#fff', accent: '#9AA6FF' };
            const shot = p.preview?.full ?? p.shots[0];
            return (
              <article key={p.slug} className={h.spread} aria-labelledby={`w-${p.slug}`}>
                <div className={h.spreadText} data-reveal="">
                  <span className={h.spreadNum}>{String(i + 1).padStart(2, '0')} — {kindOf(p)}</span>
                  <h3 id={`w-${p.slug}`} className={h.spreadName}><PreviewLink slug={p.slug} placement="work_title">{p.name}</PreviewLink></h3>
                  <p className={h.spreadHead}>{l.headline}</p>
                  <ul className={h.spreadMeta}>
                    <li className={h.ok}>● {c.status[p.status]}</li>
                    <li>{l.category}</li>
                    {p.url && <li>{hostOf(p.url)}</li>}
                  </ul>
                  <div className={h.spreadActions}>
                    <PreviewLink slug={p.slug} placement="work_button" className={s.btn}>{c.work.preview}<ArrowUpRight size={17} aria-hidden="true" /></PreviewLink>
                    {p.caseStudy && <a href={evidenceHref(p.caseStudy, locale)} className={`${s.btn} ${s.btnGhost}`}>{c.work.caseStudy}</a>}
                  </div>
                </div>
                <PreviewLink slug={p.slug} placement="work_stage" className={h.stage} label={`${c.hero.open}: ${p.name}`}
                             style={{ '--pbg': pal.bg, '--pac': pal.accent } as CSSProperties}>
                  <div className={h.stageShot}>
                    <img src={shot.src} alt={l.alt(shot)} width={shot.width} height={shot.height} loading="lazy" decoding="async" />
                  </div>
                  {p.preview?.phone && (
                    <div className={h.stagePhone} aria-hidden="true"><div><img src={p.preview.phone.src} alt="" loading="lazy" decoding="async" /></div></div>
                  )}
                  <span className={h.stageHint}>{c.hero.open}<ArrowUpRight size={15} aria-hidden="true" /></span>
                </PreviewLink>
              </article>
            );
          })}

          <div className={h.index}>
            <SectionHead num="02.b" label={c.work.index} />
            <ProjectIndex placement="work_index" rows={projects.slice(FEATURED).map((p, i) => ({
              slug: p.slug, num: String(FEATURED + i + 1).padStart(2, '0'), name: p.name, category: localize(p, locale).category, kind: kindOf(p),
              shot: { src: p.shots[0].src, alt: localize(p, locale).alt(p.shots[0]) },
            }))} />
            <a href={localPath(locale, '/projekty')} className={`${s.btn} ${s.btnGhost} ${h.allLink}`}>{c.work.all}<ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      {/* ============ verify ============ */}
      <section id="sprawdz" className={h.sec}>
        <div className={s.wrap}>
          <SectionHead num={c.verify.num} label={c.verify.label} />
          <div className={h.secTop}>
            <Lines lines={c.verify.title} className={s.h2} split />
            <p className={s.lead} data-reveal="">{c.verify.lead}</p>
          </div>
          <div data-reveal="">
            <table className={h.verify}>
              <thead><tr>{c.verify.cols.map((x) => <th key={x} scope="col">{x}</th>)}</tr></thead>
              <tbody>
                {projects.map((p) => {
                  const ev = localize(p, locale).evidence[0];
                  return (
                    <tr key={p.slug}>
                      <td>{p.name}</td>
                      <td>{ev?.url ? <a href={evidenceHref(ev.url, locale)} target="_blank" rel="noopener noreferrer">{ev.label}</a> : ev?.label}</td>
                      <td>{p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer" className={s.link}>{hostOf(p.url)}<ArrowUpRight size={14} aria-hidden="true" /></a> : <span style={{ color: 'var(--soft)' }}>{c.verify.private}</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className={h.verifyFoot}>
              <p>{c.verify.checked(shortDate)}</p>
              <p>{c.verify.company} · KRS {SELLER.krs} · NIP {SELLER.nip}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ pricing ============ */}
      <section id="cennik" className={h.sec}>
        <div className={s.wrap}>
          <SectionHead num={c.pricing.num} label={c.pricing.label} />
          <div className={h.secTop}>
            <Lines lines={c.pricing.title} className={s.h2} split />
            <p className={s.lead} data-reveal="">{c.pricing.lead}</p>
          </div>
          <div className={h.sheet} data-reveal="">
            {c.pricing.packages.map((pk) => {
              const rec = pk.key === 'firma';
              return (
                <article key={pk.key} className={`${h.pkg} ${rec ? `${h.pkgRec} ${s.ink}` : ''}`} aria-label={pk.name}>
                  {rec && <span className={h.pkgTag}>{c.pricing.recommended}</span>}
                  <h3 className={h.pkgName}>{pk.name}</h3>
                  <p className={h.pkgPrice}>{price(PRICES[pk.key as 'start' | 'firma' | 'pro'], locale)}<small>{c.pricing.once}</small></p>
                  <p className={h.pkgHead}>{pk.headline}</p>
                  <ul className={h.pkgItems}>{pk.items.map((x) => <li key={x}><Check size={16} aria-hidden="true" />{x}</li>)}</ul>
                  <StartButton pkg={pk.key as Pkg} placement="pricing" className={`${s.btn} ${rec ? '' : s.btnGhost} ${h.pkgCta}`}>
                    {c.start.choose(pk.name)}<ArrowRight size={17} aria-hidden="true" />
                  </StartButton>
                </article>
              );
            })}
          </div>
          <div className={h.sheetNotes}>
            <div>
              <p>{c.pricing.plan(price(PRICES.planFrom, locale))}</p>
              <p>{c.pricing.vat}</p>
              <p><b style={{ color: 'var(--ink)' }}>{c.pricing.custom}</b></p>
            </div>
            <div className={h.sheetCtas}>
              <a href="#branze" className={`${s.btn} ${s.btnGhost}`}>{c.pricing.ctaNiche}</a>
              <a href="#kontakt" className={s.btn}>{c.pricing.ctaQuote}<ArrowRight size={18} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ engineering ============ */}
      <section id="technologia" className={`${h.engSec} ${s.ink}`}>
        <div className={s.wrap}>
          <div className={h.sec}>
            <SectionHead num={c.engineering.num} label={c.engineering.label} />
            <div className={h.secTop}>
              <Lines lines={c.engineering.title} className={s.h2} split />
              <p className={s.lead} data-reveal="">{c.engineering.lead}</p>
            </div>
            <ul className={h.eng}>
              {c.engineering.rows.map((r, i) => (
                <li key={r.plain} data-reveal="" style={{ '--d': `${i * 50}ms` } as CSSProperties}>
                  <b>{r.plain}</b>
                  <code>{r.tech}</code>
                  {r.project ? <PreviewLink slug={r.project} placement="engineering" className={s.link}>{bySlug(r.project).name}</PreviewLink> : <span>{locale === 'pl' ? 'Każda strona' : 'Every site'}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ process ============ */}
      <section id="proces" className={h.sec}>
        <div className={s.wrap}>
          <SectionHead num={c.process.num} label={c.process.label} />
          <div className={h.secTop}><Lines lines={c.process.title} className={s.h2} split /></div>
          <ol className={h.steps}>
            {c.process.steps.map(([t, d], i) => (
              <li key={t} data-reveal="" style={{ '--d': `${i * 90}ms` } as CSSProperties}>
                <span className={h.stepNum} aria-hidden="true">{i + 1}</span>
                <b>{t}</b>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ industries ============ */}
      <section id="branze" className={h.sec}>
        <div className={s.wrap}>
          <SectionHead num={c.industries.num} label={c.industries.label} />
          <div className={h.secTop}>
            <Lines lines={c.industries.title} className={s.h2} split />
            <p className={s.lead} data-reveal="">{c.industries.lead}</p>
          </div>
          <ul className={h.feat}>
            {c.industries.featured.map((f) => (
              <li key={f.href} data-reveal="">
                <a href={localPath(locale, f.href)}><b>{f.title}</b><p>{f.text}</p><ArrowUpRight size={28} aria-hidden="true" /></a>
              </li>
            ))}
          </ul>
          <nav className={h.niches} aria-label={c.industries.niches} data-reveal="">
            <p className={s.label}>{c.industries.niches}</p>
            <ul>{NICHES.map((n) => <li key={n.key}><a href={n.path} lang="pl">{n.label}</a></li>)}</ul>
          </nav>
        </div>
      </section>

      {/* ============ contact ============ */}
      <section id="kontakt" className={h.sec}>
        <span id="contact" className={h.anchor} aria-hidden="true" />
        <div className={s.wrap}>
          <SectionHead num={c.contact.num} label={c.contact.label} />
          <div className={h.contact} style={{ marginTop: 'clamp(28px,4vw,56px)' }}>
            <div>
              <Lines lines={c.contact.title} as="h2" className={h.contactTitle} split />
              <p className={s.lead} style={{ marginTop: 24 }} data-reveal="">{c.contact.lead}</p>
              <div className={h.reach} data-reveal="">
                <p>{c.contact.phone}</p>
                <a href={SELLER.phoneHref}>{SELLER.phone}</a>
                <p>{c.contact.email}</p>
                <a href={`mailto:${SELLER.email}`} className={h.reachMail}>{SELLER.email}</a>
              </div>
            </div>
            <div data-reveal="" style={{ '--d': '150ms' } as CSSProperties}>
              <ContactForm copy={c.contact.form} source="tovernet-nest:homepage-contact" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
