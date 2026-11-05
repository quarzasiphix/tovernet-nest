'use client';

import { useEffect, useState } from 'react';
import type { PublicDemo } from '@/lib/tovernet/api';
import { publicAction } from '@/lib/tovernet/api';
import { authClient } from '@/lib/tovernet/supabase';
import { track as trackAnalytics } from '@/lib/tovernet/analytics';
import { presentName } from '@/lib/tovernet/construction';
import { brandFonts } from '@/lib/tovernet/brand';
import s from './brand.module.css';
import LiveJourney from './funnel/LiveJourney';
import OfferLoader from './OfferLoader';
import PanelCompany, { type PanelCompanyData } from './PanelCompany';
import ProjectProgress, { ReportsTeaser, type PanelProject } from './ProjectProgress';

type BuyerOrder = { id: string; status: string; public_id: string | null; lead_id: string | null; invoice_number: string | null };
type Overview = { companies?: PanelCompanyData[]; projects: (PanelProject & { lead_id: string | null })[]; orders: BuyerOrder[] };
type Buyer = { company: PanelCompanyData | null; project: PanelProject | null; order: BuyerOrder };

/**
 * A personalised offer opened by someone who already bought it shows their site's
 * progress instead of the pricing. Everyone else (not signed in, or signed in without
 * an order for this company) gets the normal offer.
 */
export default function OfferGate({ demo, track, personalLink }: { demo: PublicDemo; track: (eventType: string, placement?: string) => void; personalLink: boolean }) {
  const [state, setState] = useState<'checking' | 'prospect' | 'buyer'>('checking');
  const [buyer, setBuyer] = useState<Buyer | null>(null);

  useEffect(() => {
    const supabase = authClient();
    if (!supabase) { setState('prospect'); return; }
    let cancelled = false;
    void (async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) { if (!cancelled) setState('prospect'); return; }
      try {
        const { overview } = await publicAction<{ overview: Overview }>('tovernetPanel.overview', {}, token);
        const company = overview.companies?.find((c) => c.public_id === demo.public_id) ?? null;
        const order = overview.orders.find((o) => o.status !== 'refunded' &&
          (o.public_id === demo.public_id || (company && o.lead_id === company.lead_id)));
        if (cancelled) return;
        if (!order) { setState('prospect'); return; }
        setBuyer({ company, order, project: overview.projects.find((p) => p.order_id === order.id) ?? null });
        setState('buyer');
        trackAnalytics('offer_viewed_by_customer');
      } catch {
        if (!cancelled) setState('prospect');
      }
    })();
    return () => { cancelled = true; };
  }, [demo.public_id]);

  if (state === 'checking') {
    return <OfferLoader />;
  }
  // Prospects get the four-stage journey (11-funnel.md). PersonalOffer.tsx is the previous single page, kept until this is approved for production.
  if (state === 'prospect' || !buyer) return <LiveJourney demo={demo} track={track} />;

  const name = presentName(demo.config.company.display_name);
  const { project, order } = buyer;

  return (
    <main lang="pl" className={`${brandFonts} ${s.tv}`}>
      <div className={s.bar}>
        <a href="/pl/" className={`${s.word} ${s.barWord}`}>tovernet</a>
        <div className={s.barName}><span className={s.l}>{order.status === 'payment_review' ? 'Sprawdzamy płatność' : 'Zamówienie opłacone'}</span><b>{name}</b></div>
        <a href="/panel/" className={s.barCta}>Panel klienta</a>
      </div>
      <div className={s.wrap} style={{ maxWidth: 1064, paddingTop: 40, paddingBottom: 64 }}>
        <h1 className={s.h2}>Strona dla {name}</h1>
        {project && <div className={s.card} style={{ marginTop: 28 }}><ProjectProgress project={project} /></div>}
        {order.invoice_number && <p className={s.l} style={{ marginTop: 14 }}>Faktura {order.invoice_number}</p>}
        {buyer.company && <PanelCompany company={buyer.company} />}
        {project && <div style={{ marginTop: 24 }}><ReportsTeaser project={project} /></div>}
        <p style={{ marginTop: 24, fontSize: 14 }}>
          Pytania o realizację, treści i zmiany: <a className="underline" href="/panel/">panel klienta</a> albo{' '}
          <a className="underline" href="mailto:contact@tovernet.online">contact@tovernet.online</a>.
        </p>
      </div>
    </main>
  );
}
