/* eslint-disable @next/next/no-img-element */
import { ArrowRight } from 'lucide-react';
import { asLocale, copyFor, localPath } from '@/lib/site/copy';
import { localize, siteProjects } from '@/lib/tovernet/portfolio';
import { siteFonts } from './fonts';
import s from './site.module.css';
import n from './next.module.css';

/** Bottom of a case study: the next listed project and the way back to all work. */
export default function CaseStudyNext({ locale: raw, slug }: { locale: string; slug: string }) {
  const locale = asLocale(raw);
  const c = copyFor(locale);
  const list = siteProjects();
  const i = list.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  const next = list[(i + 1) % list.length];
  const shot = next.shots[0];
  return (
    <nav className={`${s.tokens} ${siteFonts} ${n.next}`} aria-label={locale === 'pl' ? 'Następny projekt' : 'Next project'}
         style={{ '--pbg': next.palette?.bg ?? '#1B1C1F', '--pfg': next.palette?.fg ?? '#ECEBE4', '--pac': next.palette?.accent ?? '#9AA6FF' } as React.CSSProperties}>
      <div className={s.wrap}>
        <a href={`/${locale}/projekty/${next.slug}/`} className={n.card}>
          <span className={n.text}>
            <span className={`${s.label} ${n.kicker}`}>{locale === 'pl' ? 'Następny projekt' : 'Next project'} · {String(i + 2 > list.length ? 1 : i + 2).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</span>
            <span className={n.name}>{next.name}<ArrowRight aria-hidden="true" /></span>
            <span className={n.head}>{localize(next, locale).headline}</span>
          </span>
          <span className={n.shot} aria-hidden="true"><img src={shot.src} alt="" loading="lazy" decoding="async" /></span>
        </a>
        <a href={localPath(locale, '/projekty')} className={`${s.link} ${n.all}`}>{c.work.all}</a>
      </div>
    </nav>
  );
}
