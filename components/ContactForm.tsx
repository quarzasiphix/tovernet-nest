'use client';

import { GATEWAY } from '@/lib/tovernet/api';
import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import posthog from 'posthog-js';

type ContactFormContent = {
  name: string;
  email: string;
  phone: string;
  message: string;
  submit: string;
  thankYouTitle: string;
  thankYouMessage: string;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const EMPTY: FormState = { name: '', email: '', phone: '', message: '' };

export default function ContactForm({ content, source }: { content: ContactFormContent; source: string }) {
  const c = content;
  const [form, setForm] = useState<FormState>(EMPTY);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const canSubmit = form.message.trim().length > 0 && (form.name.trim().length > 0 || form.email.trim().length > 0 || form.phone.trim().length > 0);

  const submit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${GATEWAY}/v1/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'tovernetLead.submit',
          source,
          contactName: form.name,
          email: form.email,
          phone: form.phone,
          notes: form.message,
        }),
      });
      if (!res.ok) throw new Error(`gateway ${res.status}`);
      posthog.capture('contact_form_submitted', { source });
      setSent(true);
    } catch {
      const body = [
        `${c.name}: ${form.name}`,
        `${c.email}: ${form.email}`,
        `${c.phone}: ${form.phone}`,
        '',
        form.message,
      ].join('\n');
      const mailto = `mailto:contact@tovernet.online?subject=${encodeURIComponent('Zapytanie z tovernet.online')}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      posthog.capture('contact_form_submitted', { source, fallback: 'mailto' });
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-xl mx-auto text-center rounded-3xl border border-white/10 bg-white/5 p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-tovernet-500/20 mb-5">
          <Check className="h-7 w-7 text-tovernet-400" strokeWidth={3} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{c.thankYouTitle}</h3>
        <p className="text-gray-400">{c.thankYouMessage}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 text-left">
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-semibold text-gray-300 mb-1.5 block">{c.name}</label>
          <input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="w-full h-12 rounded-xl px-4 text-sm bg-white/5 border border-white/10 text-white outline-none focus:border-tovernet-400 transition-colors"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-300 mb-1.5 block">{c.phone}</label>
          <input
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            className="w-full h-12 rounded-xl px-4 text-sm bg-white/5 border border-white/10 text-white outline-none focus:border-tovernet-400 transition-colors"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-300 mb-1.5 block">{c.email}</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          className="w-full h-12 rounded-xl px-4 text-sm bg-white/5 border border-white/10 text-white outline-none focus:border-tovernet-400 transition-colors"
        />
      </div>
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-300 mb-1.5 block">{c.message}</label>
        <textarea
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          rows={4}
          className="w-full rounded-xl px-4 py-3 text-sm bg-white/5 border border-white/10 text-white outline-none resize-none focus:border-tovernet-400 transition-colors"
        />
      </div>
      <button
        onClick={submit}
        disabled={!canSubmit || submitting}
        className="w-full inline-flex items-center justify-center gap-2 bg-tovernet-gradient text-white text-lg px-8 py-4 rounded-xl font-semibold shadow-2xl hover-lift magical-glow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {c.submit}
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}
