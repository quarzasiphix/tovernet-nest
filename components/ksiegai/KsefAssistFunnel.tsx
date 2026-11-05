'use client';

import { GATEWAY } from '@/lib/tovernet/api';
import { useState, type FormEvent } from 'react';
import { Search, Building2, Mail, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import posthog from 'posthog-js';

// Public ksiegai gateway — same public entrypoint the ksiegai.pl and
// ksef.support versions of this funnel call, no auth needed (anonymous
// visitor, no ksiegai account yet). See ksiegai-gateway/src/routes/public.ts
// ksefAssistLead handler and ksef-ai/supabase/functions/ksef-assist-lead.
const GATEWAY_URL = `${GATEWAY}/v1/public/ksef-assist/lead`;

type LookupResult = {
  found: boolean;
  name?: string;
  nip?: string;
  krs?: string;
  regon?: string;
  city?: string;
  legalForm?: string;
  companyType?: string;
};

async function callFunnel<T>(body: Record<string, unknown>): Promise<T> {
  // The gateway wraps every response in an envelope —
  // success: { data: <upstream payload> }, error: { error: { code, message } }
  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const envelope = await res.json();
  if (!res.ok || envelope?.error) {
    throw new Error(envelope?.error?.message || 'Coś poszło nie tak. Spróbuj ponownie.');
  }
  return envelope.data as T;
}

type Step = 'query' | 'found' | 'sent';

export default function KsefAssistFunnel() {
  const [step, setStep] = useState<Step>('query');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<LookupResult | null>(null);
  const [email, setEmail] = useState('');

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = query.replace(/\D/g, '');
    if (trimmed.length !== 10) {
      setError('Podaj 10-cyfrowy numer NIP lub KRS.');
      return;
    }

    setLoading(true);
    try {
      const result = await callFunnel<LookupResult>({ action: 'lookup', query: trimmed });
      if (!result.found) {
        setError('Nie znaleźliśmy tej firmy w rejestrze KRS. Sprawdź numer i spróbuj ponownie.');
        setLoading(false);
        return;
      }
      posthog.capture('ksef_assist_funnel_company_found', { source: 'tovernet_seo' });
      setCompany(result);
      setStep('found');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Coś poszło nie tak. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendLink = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Podaj adres e-mail.');
      return;
    }

    setLoading(true);
    try {
      await callFunnel({
        action: 'createLead',
        email,
        nip: company?.nip,
        krs: company?.krs,
        regon: company?.regon,
        companyName: company?.name,
        companyType: company?.companyType,
        city: company?.city,
      });
      posthog.capture('ksef_assist_funnel_lead_created', { source: 'tovernet_seo' });
      setStep('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Coś poszło nie tak. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-sm">
      <style>{`
        @keyframes ksef-assist-shimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .ksef-assist-shimmer-btn {
          background: linear-gradient(270deg, #6d28d9, #7c3aed, #a78bfa, #7c3aed, #6d28d9);
          background-size: 300% 300%;
          animation: ksef-assist-shimmer 3s ease infinite;
        }
        @keyframes ksef-assist-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.35); }
          50%      { box-shadow: 0 0 26px 6px rgba(124, 58, 237, 0.55); }
        }
        .ksef-assist-glow-btn {
          background: linear-gradient(270deg, #6d28d9, #7c3aed, #a78bfa, #7c3aed, #6d28d9);
          background-size: 300% 300%;
          animation: ksef-assist-shimmer 3s ease infinite, ksef-assist-glow 2.2s ease-in-out infinite;
        }
        @keyframes ksef-assist-input-highlight {
          0%, 100% { border-color: rgba(124, 58, 237, 0.3); box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
          50%      { border-color: rgba(124, 58, 237, 0.9); box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.14); }
        }
        .ksef-assist-input-highlight {
          animation: ksef-assist-input-highlight 2.2s ease-in-out infinite;
        }
      `}</style>

      {step === 'query' && (
        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">NIP lub KRS firmy</label>
            <div className="relative mt-1.5">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="np. 0000012345"
                required
                className="ksef-assist-input-highlight w-full rounded-lg border-2 bg-white/5 py-2.5 pl-9 pr-3.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-ksiegai-400"
              />
            </div>
          </div>

          {error && (
            <p className="flex items-start gap-2 text-sm text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="ksef-assist-glow-btn flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition-opacity disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? 'Sprawdzam…' : 'Sprawdź firmę'}
          </button>
          <p className="text-center text-xs text-gray-500">
            Dane pobieramy z jawnego rejestru KRS. Nie zapisujemy niczego bez Twojej zgody.
          </p>
        </form>
      )}

      {step === 'found' && company && (
        <form onSubmit={handleSendLink} className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-semibold text-white">{company.name}</p>
              {company.city && <p className="text-xs text-gray-400">{company.city}</p>}
              {company.legalForm && <p className="text-xs text-gray-400">{company.legalForm}</p>}
            </div>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">
            Podaj e-mail, a wyślemy Ci link do dokończenia aktywacji i umówienia asysty przy
            konfiguracji KSeF dla <strong>{company.name}</strong>.
          </p>

          <div>
            <label className="block text-sm font-medium text-white">E-mail</label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ty@firma.pl"
                required
                className="w-full rounded-lg border border-white/15 bg-white/5 py-2.5 pl-9 pr-3.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-ksiegai-400"
              />
            </div>
          </div>

          {error && (
            <p className="flex items-start gap-2 text-sm text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="ksef-assist-shimmer-btn flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition-opacity disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? 'Wysyłam…' : 'Wyślij link'}
          </button>
          <button
            type="button"
            onClick={() => { setStep('query'); setCompany(null); setError(null); }}
            className="w-full text-center text-xs text-gray-500 hover:underline"
          >
            To nie ta firma — wróć
          </button>
        </form>
      )}

      {step === 'sent' && (
        <div className="py-4 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-white">Sprawdź skrzynkę</h3>
          <p className="mt-2 text-sm text-gray-400 leading-relaxed">
            Wysłaliśmy link na <strong className="text-white">{email}</strong>. Kliknij go, żeby
            dokończyć aktywację konta (jedno kliknięcie, bez hasła) i przejść do zakupu asysty przy
            KSeF.
          </p>
        </div>
      )}
    </div>
  );
}
