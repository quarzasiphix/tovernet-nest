'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Mail } from 'lucide-react';

const BORDER = '#f0e6d2';
const NAVY = '#1b2740';
const MUTED = '#5b6b8c';
const TEAL = '#14ab9d';
const TEAL_SOFT = '#d5f5f0';
const PINK = '#db2777';

type QuoteFormContent = {
  title: string;
  subtitle: string;
  steps: string[];
  step1: { kennelName: string; breed: string; existingSite: string };
  step2: {
    siteTypeLabel: string;
    siteTypeNew: string;
    siteTypeMigration: string;
    functionsLabel: string;
    functions: string[];
    languagesLabel: string;
    languages: string[];
    dogCountLabel: string;
    dogCountOptions: string[];
  };
  step3: { contactName: string; email: string; phone: string; notes: string };
  nav: { back: string; next: string; submit: string };
  thankYou: { title: string; message: string };
  emailSubject: string;
};

type FormState = {
  kennelName: string;
  breed: string;
  existingSite: string;
  siteType: string;
  functions: string[];
  languages: string[];
  dogCount: string;
  contactName: string;
  email: string;
  phone: string;
  notes: string;
};

const EMPTY: FormState = {
  kennelName: '',
  breed: '',
  existingSite: '',
  siteType: '',
  functions: [],
  languages: [],
  dogCount: '',
  contactName: '',
  email: '',
  phone: '',
  notes: '',
};

function toggleItem(list: string[], item: string) {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
}

function buildMailBody(f: FormState, c: QuoteFormContent) {
  const lines = [
    `${c.step1.kennelName}: ${f.kennelName}`,
    `${c.step1.breed}: ${f.breed}`,
    f.existingSite ? `${c.step1.existingSite}: ${f.existingSite}` : null,
    '',
    f.siteType ? `${c.step2.siteTypeLabel}: ${f.siteType}` : null,
    f.functions.length ? `${c.step2.functionsLabel}: ${f.functions.join(', ')}` : null,
    f.languages.length ? `${c.step2.languagesLabel}: ${f.languages.join(', ')}` : null,
    f.dogCount ? `${c.step2.dogCountLabel}: ${f.dogCount}` : null,
    '',
    f.phone ? `${c.step3.phone}: ${f.phone}` : null,
    f.notes ? `${c.step3.notes}: ${f.notes}` : null,
  ].filter((l): l is string => l !== null);
  return lines.join('\n');
}

export default function QuoteForm({ content }: { content: QuoteFormContent }) {
  const c = content;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [sent, setSent] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const canNext = step === 0 ? form.kennelName.trim().length > 0 && form.breed.trim().length > 0 : true;

  const submit = () => {
    const body = buildMailBody(form, c);
    const mailto = `mailto:contact@tovernet.online?subject=${encodeURIComponent(`${c.emailSubject} — ${form.kennelName}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-3xl bg-white kennel-card-shadow p-10 text-center max-w-xl mx-auto" style={{ border: `1px solid ${BORDER}` }}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-5" style={{ background: TEAL_SOFT }}>
          <Check className="h-8 w-8" style={{ color: TEAL }} strokeWidth={3} />
        </div>
        <h3 className="text-2xl font-bold mb-2" style={{ color: NAVY }}>{c.thankYou.title}</h3>
        <p className="text-sm" style={{ color: MUTED }}>{c.thankYou.message}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white kennel-card-shadow p-6 sm:p-10 max-w-2xl mx-auto" style={{ border: `1px solid ${BORDER}` }}>
      <div className="flex items-center gap-2 mb-8">
        {c.steps.map((label, i) => (
          <div key={label} className="flex-1">
            <div className="h-2 rounded-full mb-2 transition" style={{ background: i <= step ? TEAL : BORDER }} />
            <p className="text-[11px] font-bold text-center hidden sm:block" style={{ color: i <= step ? TEAL : MUTED }}>{label}</p>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-1.5 block" style={{ color: NAVY }}>{c.step1.kennelName}</label>
            <input
              value={form.kennelName}
              onChange={(e) => set('kennelName', e.target.value)}
              className="w-full h-12 rounded-xl px-4 text-sm outline-none"
              style={{ border: `1.5px solid ${BORDER}`, color: NAVY }}
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block" style={{ color: NAVY }}>{c.step1.breed}</label>
            <input
              value={form.breed}
              onChange={(e) => set('breed', e.target.value)}
              className="w-full h-12 rounded-xl px-4 text-sm outline-none"
              style={{ border: `1.5px solid ${BORDER}`, color: NAVY }}
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block" style={{ color: NAVY }}>{c.step1.existingSite}</label>
            <input
              value={form.existingSite}
              onChange={(e) => set('existingSite', e.target.value)}
              className="w-full h-12 rounded-xl px-4 text-sm outline-none"
              style={{ border: `1.5px solid ${BORDER}`, color: NAVY }}
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold mb-2 block" style={{ color: NAVY }}>{c.step2.siteTypeLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              {[c.step2.siteTypeNew, c.step2.siteTypeMigration].map((opt) => (
                <button
                  key={opt}
                  onClick={() => set('siteType', opt)}
                  className="h-11 rounded-xl text-sm font-semibold transition"
                  style={form.siteType === opt ? { background: TEAL, color: 'white' } : { border: `1.5px solid ${BORDER}`, color: MUTED }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block" style={{ color: NAVY }}>{c.step2.functionsLabel}</label>
            <div className="flex flex-wrap gap-2">
              {c.step2.functions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => set('functions', toggleItem(form.functions, opt))}
                  className="h-9 px-3 rounded-full text-xs font-bold transition"
                  style={form.functions.includes(opt) ? { background: PINK, color: 'white' } : { border: `1.5px solid ${BORDER}`, color: MUTED }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block" style={{ color: NAVY }}>{c.step2.languagesLabel}</label>
            <div className="flex flex-wrap gap-2">
              {c.step2.languages.map((opt) => (
                <button
                  key={opt}
                  onClick={() => set('languages', toggleItem(form.languages, opt))}
                  className="h-9 px-3 rounded-full text-xs font-bold transition"
                  style={form.languages.includes(opt) ? { background: '#8a68f5', color: 'white' } : { border: `1.5px solid ${BORDER}`, color: MUTED }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block" style={{ color: NAVY }}>{c.step2.dogCountLabel}</label>
            <div className="flex flex-wrap gap-2">
              {c.step2.dogCountOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => set('dogCount', opt)}
                  className="h-9 px-3 rounded-full text-xs font-bold transition"
                  style={form.dogCount === opt ? { background: '#f59e0b', color: 'white' } : { border: `1.5px solid ${BORDER}`, color: MUTED }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-1.5 block" style={{ color: NAVY }}>{c.step3.contactName}</label>
            <input
              value={form.contactName}
              onChange={(e) => set('contactName', e.target.value)}
              className="w-full h-12 rounded-xl px-4 text-sm outline-none"
              style={{ border: `1.5px solid ${BORDER}`, color: NAVY }}
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block" style={{ color: NAVY }}>{c.step3.email}</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className="w-full h-12 rounded-xl px-4 text-sm outline-none"
              style={{ border: `1.5px solid ${BORDER}`, color: NAVY }}
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block" style={{ color: NAVY }}>{c.step3.phone}</label>
            <input
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              className="w-full h-12 rounded-xl px-4 text-sm outline-none"
              style={{ border: `1.5px solid ${BORDER}`, color: NAVY }}
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block" style={{ color: NAVY }}>{c.step3.notes}</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
              style={{ border: `1.5px solid ${BORDER}`, color: NAVY }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mt-8">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="inline-flex items-center gap-1.5 h-12 px-5 rounded-xl text-sm font-semibold"
            style={{ border: `1.5px solid ${BORDER}`, color: NAVY }}
          >
            <ArrowLeft className="h-4 w-4" /> {c.nav.back}
          </button>
        )}
        <button
          onClick={() => (step < 2 ? setStep((s) => s + 1) : submit())}
          disabled={!canNext}
          className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold text-white transition disabled:opacity-40"
          style={{ background: step < 2 ? TEAL : PINK }}
        >
          {step < 2 ? (
            <>{c.nav.next} <ArrowRight className="h-4 w-4" /></>
          ) : (
            <>{c.nav.submit} <Mail className="h-4 w-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
