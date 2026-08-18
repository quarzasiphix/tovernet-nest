'use client';

import { useState } from 'react';
import { Check, Mail } from 'lucide-react';

type AuditIntakeFormContent = {
  title: string;
  subtitle: string;
  companyName: string;
  providerType: string;
  providerTypeOptions: string[];
  disputeStage: string;
  disputeStageOptions: string[];
  affectedAssets: string;
  affectedAssetsOptions: string[];
  contactName: string;
  email: string;
  notes: string;
  submit: string;
  thankYou: { title: string; message: string };
  emailSubject: string;
};

type FormState = {
  companyName: string;
  providerType: string;
  disputeStage: string;
  affectedAssets: string[];
  contactName: string;
  email: string;
  notes: string;
};

const EMPTY: FormState = {
  companyName: '',
  providerType: '',
  disputeStage: '',
  affectedAssets: [],
  contactName: '',
  email: '',
  notes: '',
};

const NAVY = '#0f172a';
const BLUE = '#60a5fa';
const BLUE_SOFT = 'rgba(96,165,250,0.12)';
const VIOLET = '#8a68f5';

function toggleItem(list: string[], item: string) {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
}

function buildMailBody(f: FormState, c: AuditIntakeFormContent) {
  const lines = [
    `${c.companyName}: ${f.companyName}`,
    f.providerType ? `${c.providerType}: ${f.providerType}` : null,
    f.disputeStage ? `${c.disputeStage}: ${f.disputeStage}` : null,
    f.affectedAssets.length ? `${c.affectedAssets}: ${f.affectedAssets.join(', ')}` : null,
    '',
    `${c.contactName}: ${f.contactName}`,
    `${c.email}: ${f.email}`,
    f.notes ? `${c.notes}: ${f.notes}` : null,
  ].filter((l): l is string => l !== null);
  return lines.join('\n');
}

export default function AuditIntakeForm({ content }: { content: AuditIntakeFormContent }) {
  const c = content;
  const [form, setForm] = useState<FormState>(EMPTY);
  const [sent, setSent] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const canSubmit = form.companyName.trim().length > 0 && form.email.trim().length > 0;

  const submit = () => {
    const body = buildMailBody(form, c);
    const mailto = `mailto:contact@tovernet.online?subject=${encodeURIComponent(`${c.emailSubject} — ${form.companyName}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-10 text-center max-w-xl mx-auto magical-glow-blue">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-5" style={{ background: BLUE_SOFT }}>
          <Check className="h-8 w-8" style={{ color: BLUE }} strokeWidth={3} />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-white">{c.thankYou.title}</h3>
        <p className="text-sm text-gray-400">{c.thankYou.message}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 sm:p-10 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-white mb-1">{c.title}</h3>
      <p className="text-sm text-gray-400 mb-8">{c.subtitle}</p>

      <div className="space-y-5">
        <div>
          <label className="text-sm font-semibold mb-1.5 block text-white">{c.companyName}</label>
          <input
            value={form.companyName}
            onChange={(e) => set('companyName', e.target.value)}
            className="w-full h-12 rounded-xl px-4 text-sm outline-none bg-white/5 border border-white/15 text-white placeholder:text-gray-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block text-white">{c.providerType}</label>
          <div className="flex flex-wrap gap-2">
            {c.providerTypeOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => set('providerType', opt)}
                className="h-9 px-3 rounded-full text-xs font-bold transition"
                style={form.providerType === opt ? { background: BLUE, color: NAVY } : { border: '1.5px solid rgba(255,255,255,0.15)', color: '#9ca3af' }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block text-white">{c.disputeStage}</label>
          <div className="flex flex-wrap gap-2">
            {c.disputeStageOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => set('disputeStage', opt)}
                className="h-9 px-3 rounded-full text-xs font-bold transition"
                style={form.disputeStage === opt ? { background: VIOLET, color: 'white' } : { border: '1.5px solid rgba(255,255,255,0.15)', color: '#9ca3af' }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block text-white">{c.affectedAssets}</label>
          <div className="flex flex-wrap gap-2">
            {c.affectedAssetsOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => set('affectedAssets', toggleItem(form.affectedAssets, opt))}
                className="h-9 px-3 rounded-full text-xs font-bold transition"
                style={form.affectedAssets.includes(opt) ? { background: BLUE, color: NAVY } : { border: '1.5px solid rgba(255,255,255,0.15)', color: '#9ca3af' }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold mb-1.5 block text-white">{c.contactName}</label>
            <input
              value={form.contactName}
              onChange={(e) => set('contactName', e.target.value)}
              className="w-full h-12 rounded-xl px-4 text-sm outline-none bg-white/5 border border-white/15 text-white"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block text-white">{c.email}</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className="w-full h-12 rounded-xl px-4 text-sm outline-none bg-white/5 border border-white/15 text-white"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-1.5 block text-white">{c.notes}</label>
          <textarea
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            rows={4}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none bg-white/5 border border-white/15 text-white"
          />
        </div>
      </div>

      <button
        onClick={submit}
        disabled={!canSubmit}
        className="mt-8 w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold text-white transition disabled:opacity-40 bg-tovernet-gradient"
      >
        {c.submit} <Mail className="h-4 w-4" />
      </button>
    </div>
  );
}
