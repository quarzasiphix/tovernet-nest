'use client';

import { GATEWAY } from '@/lib/tovernet/api';
import { useId, useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import posthog from 'posthog-js';
import type { SiteCopy } from '@/lib/site/copy';
import f from './site/form.module.css';

type FormCopy = SiteCopy['contact']['form'];

/**
 * Enquiry form (homepage, /projekty). Sends tovernetLead.submit through the gateway; if that
 * fails, falls back to a prefilled e-mail. The chosen kind of project leads the notes, so the
 * lead in admin says at once what it is about.
 */
export default function ContactForm({ copy: c, source }: { copy: FormCopy; source: string }) {
  const id = useId();
  const [kind, setKind] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [touched, setTouched] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm((x) => ({ ...x, [k]: v }));
  const reachable = form.email.trim().length > 3 || form.phone.trim().length > 5;
  const ok = form.message.trim().length > 0 && reachable;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    if (!ok || state === 'sending') return;
    setState('sending');
    const notes = `${kind ? `[${kind}] ` : ''}${form.message.trim()}`;
    try {
      const res = await fetch(`${GATEWAY}/v1/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'tovernetLead.submit', source, contactName: form.name, email: form.email, phone: form.phone, notes }),
      });
      if (!res.ok) throw new Error(`gateway ${res.status}`);
      posthog.capture?.('contact_form_submitted', { source, kind });
    } catch {
      const body = [`${c.name}: ${form.name}`, `${c.email}: ${form.email}`, `${c.phone}: ${form.phone}`, '', notes].join('\n');
      window.location.href = `mailto:contact@tovernet.online?subject=${encodeURIComponent('Zapytanie z tovernet.online')}&body=${encodeURIComponent(body)}`;
      posthog.capture?.('contact_form_submitted', { source, kind, fallback: 'mailto' });
    }
    setState('sent');
  };

  if (state === 'sent') {
    return (
      <div className={f.sent} role="status">
        <span className={f.tick}><Check size={26} strokeWidth={2.5} aria-hidden="true" /></span>
        <p className={f.sentTitle}>{c.thanksTitle}</p>
        <p>{c.thanks}</p>
      </div>
    );
  }

  return (
    <form className={f.form} onSubmit={submit} noValidate>
      <fieldset className={f.kinds}>
        <legend>{c.kind}</legend>
        {c.kinds.map((k) => (
          <label key={k} className={f.kind}>
            <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} />
            <span>{k}</span>
          </label>
        ))}
      </fieldset>
      <label className={f.field} htmlFor={`${id}-m`}>
        <span>{c.message}</span>
        <textarea id={`${id}-m`} rows={4} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder={c.placeholder} required
                  aria-invalid={touched && !form.message.trim() ? true : undefined} />
      </label>
      <div className={f.row}>
        <label className={f.field} htmlFor={`${id}-n`}><span>{c.name}</span><input id={`${id}-n`} autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} /></label>
        <label className={f.field} htmlFor={`${id}-p`}><span>{c.phone}</span><input id={`${id}-p`} type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></label>
      </div>
      <label className={f.field} htmlFor={`${id}-e`}><span>{c.email}</span><input id={`${id}-e`} type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></label>
      <p className={f.hint} id={`${id}-h`} role={touched && !reachable ? 'alert' : undefined} data-warn={touched && !reachable ? '' : undefined}>{c.reach}</p>
      <button type="submit" className={f.submit} disabled={state === 'sending'} aria-describedby={`${id}-h`}>
        {state === 'sending' ? c.sending : c.submit}<ArrowRight size={18} aria-hidden="true" />
      </button>
      <p className={f.privacy}>{c.privacy}</p>
    </form>
  );
}
