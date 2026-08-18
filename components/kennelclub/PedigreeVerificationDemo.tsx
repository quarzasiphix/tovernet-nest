'use client';

import { useState } from 'react';
import { CheckCircle2, Lock, ShieldCheck, Unlock } from 'lucide-react';

// Mirrors the real, live flow in the POK/POKIU system (psy.pokiu.pl):
// src/features/check/pages/CheckPage.tsx + src/shared/lib/commands.ts's
// PublicDogCheck. Step 1 is a free, no-code registry lookup; step 2 unlocks
// an inline document preview with a per-dog security code (never a
// download — same as the real ALLOW_PDF_DOWNLOAD = false). Fictional demo
// data only, no real POKIU client/dog information.
const DEMO_CODE = 'GY7K2Q';

type DemoContent = {
  intro: string;
  fields: {
    breed: string;
    sex: string;
    birthDate: string;
    pkrNumber: string;
    kennel: string;
    parents: string;
    breeder: string;
    certificateNumber: string;
  };
  verifiedBadge: string;
  unlockLabel: string;
  unlockPlaceholder: string;
  unlockHint: string;
  unlockButton: string;
  unlockedTitle: string;
  unlockedBadge: string;
  errorLabel: string;
};

export default function PedigreeVerificationDemo({ content }: { content: DemoContent }) {
  const [code, setCode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const tryUnlock = () => {
    if (code.trim().toUpperCase() === DEMO_CODE) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mb-10">
      <p className="text-center text-sm text-gray-400 mb-6">{content.intro}</p>

      <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
        {/* browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border-b border-white/10">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <span className="ml-3 text-xs text-gray-400 font-mono">psy.pokiu.pl/check/••••••••</span>
        </div>

        <div className="p-5 sm:p-8 space-y-5" style={{ background: 'oklch(0.16 0.02 260)' }}>
          {/* Step 1: free registry check */}
          <div className="rounded-2xl bg-white p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-lg font-bold text-slate-900">Ares Srebrny Las</p>
                <p className="text-xs text-slate-500">{content.fields.certificateNumber}: POK/PKR/0114/2024</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 flex-shrink-0">
                <ShieldCheck className="h-3.5 w-3.5" />
                {content.verifiedBadge}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
              <Field label={content.fields.breed} value="Owczarek niemiecki" />
              <Field label={content.fields.sex} value="Pies" />
              <Field label={content.fields.birthDate} value="12.03.2024" />
              <Field label={content.fields.pkrNumber} value="0114/2024" />
              <Field label={content.fields.kennel} value="Srebrny Las" />
              <Field label={content.fields.parents} value="Rex × Luna Srebrny Las" />
              <Field label={content.fields.breeder} value="A. Kowalska" />
            </div>
          </div>

          {/* Step 2: unlock with security code */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            {!unlocked ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="h-4 w-4 text-kennelclub-400" />
                  <p className="text-sm font-bold text-white">{content.unlockLabel}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setError(false);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && tryUnlock()}
                    placeholder={content.unlockPlaceholder}
                    className="flex-1 h-11 rounded-xl px-4 text-sm bg-white/5 border border-white/15 text-white placeholder:text-gray-500 outline-none focus:border-kennelclub-400"
                  />
                  <button
                    onClick={tryUnlock}
                    className="h-11 px-5 rounded-xl text-sm font-bold bg-kennelclub-gradient text-white flex-shrink-0 hover:opacity-90 transition-opacity"
                  >
                    {content.unlockButton}
                  </button>
                </div>
                {error && <p className="mt-2 text-xs text-red-400">{content.errorLabel}</p>}
                <p className="mt-2 text-xs text-gray-500">{content.unlockHint} <span className="font-mono text-kennelclub-300">{DEMO_CODE}</span></p>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <Unlock className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5">
                    {content.unlockedTitle}
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{content.unlockedBadge}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-slate-800 font-medium">{value}</p>
    </div>
  );
}
