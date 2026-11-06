'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { publicAction, type PublicDemo } from '@/lib/tovernet/api';
import { authClient } from '@/lib/tovernet/supabase';
import { registerWithInvite, sendLoginCode, sha256hex } from '@/lib/tovernet/auth';
import { clearInviteToken, readInviteToken } from '@/lib/tovernet/invite';
import { identify, markInvitee, track as trackAnalytics } from '@/lib/tovernet/analytics';
import { cartAddons } from '@/lib/tovernet/funnel';
import { type JourneyActions, type PayResult, type PaymentStart, type Result, type SignatoryCheck } from './Journey';
import { paymentMessage } from '../pay/PaymentForm';
import { DOCUMENT_VERSIONS } from '@/lib/legal/versions';
// Redesigned presentation, approved by the owner 2026-11-02. funnel/Journey.tsx stays as the
// previous presentation and as the source of the JourneyActions contract.
import StudioJourney from '../studio/StudioJourney';
import OfferLoader from '../OfferLoader';

const code = (e: unknown) => (e instanceof Error ? e.message : '') || 'unknown';

// Events that also go to tovernet.events (KRS Radar timeline), as OrderFlow and PersonalOffer sent them.
const DEMO_EVENTS: Record<string, string> = { cta_clicked: 'demo_cta_clicked', inquiry_sent: 'demo_inquiry_sent' };

/**
 * The four-stage journey bound to the real calls (docs: 11-funnel.md). Registration and
 * claim are the existing ones from OrderFlow, moved to "Otwórz koncept" when a valid
 * personal invite exists; the claim at payment stays and is idempotent.
 */
export default function LiveJourney({ demo, track: trackDemo }: { demo: PublicDemo; track: (eventType: string, placement?: string) => void }) {
  const supabase = authClient();
  const [session, setSessionState] = useState<Session | null>(null);
  // openWithAccount and pay run back to back inside "Zapłać": pay must see the new session at once.
  const sessionRef = useRef<Session | null>(null);
  const setSession = (s: Session | null) => { sessionRef.current = s; setSessionState(s); };
  const [invite, setInvite] = useState<{ email: string; tokenHash: string; hasAccount: boolean; valid: boolean } | null>(null);
  // The first screen depends on both: render it once, not twice.
  const [sessionKnown, setSessionKnown] = useState(!supabase);
  const [inviteKnown, setInviteKnown] = useState(false);
  // The personal invite opens the account once, in the background, on the first visit.
  const autoOpened = useRef(false);

  useEffect(() => {
    if (!supabase) { setInviteKnown(true); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setSessionKnown(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    (async () => {
      const token = readInviteToken(demo.public_id);
      if (!token) { setInviteKnown(true); return; }
      const tokenHash = await sha256hex(token);
      const r = await publicAction<{ invite: { is_valid: boolean; recipient_email: string; recipient_has_account: boolean } | null }>(
        'tovernetOffer.inviteStatus', { publicId: demo.public_id, tokenHash },
      ).catch(() => null);
      if (r?.invite) {
        const inv = { email: r.invite.recipient_email, tokenHash, hasAccount: r.invite.recipient_has_account, valid: r.invite.is_valid };
        markInvitee(inv.email, { krs: demo.config.company.krs ?? null, name: demo.config.company.legal_name });
        // Returning visitor without a session (new device, cleared browser) or an address that
        // already had an account (e.g. KsięgaI): the link signs them in until the first purchase.
        // If the server refuses, the code login below takes over, e-mail prefilled.
        if (!inv.valid || inv.hasAccount) {
          const { data: current } = await supabase.auth.getSession();
          if (!current.session) {
            const t = await publicAction<{ access_token: string; refresh_token: string }>(
              'tovernetOffer.inviteLogin', { publicId: demo.public_id, tokenHash },
            ).catch(() => null);
            if (t) {
              const { data: signed } = await supabase.auth.setSession(t);
              if (signed.session) { setSession(signed.session); identify(signed.session, 'invite_link'); }
            }
          }
        }
        setInvite(inv);
      }
      else if (r) clearInviteToken(demo.public_id);
      setInviteKnown(true);
    })();
    return () => data.subscription.unsubscribe();
  }, [supabase, demo.public_id]);

  const claim = async (s: Session) => {
    await publicAction('tovernetOffer.claim', { publicId: demo.public_id, tokenHash: invite?.valid ? invite.tokenHash : null }, s.access_token);
  };

  const actions: JourneyActions = useMemo(() => ({
    // An address that already has an account signs in with a code instead (EmailAuth did the same).
    inviteEmail: invite?.valid && !invite.hasAccount ? invite.email : null,
    knownEmail: invite && (!invite.valid || invite.hasAccount) ? invite.email : null,
    account: session?.user.email ?? null,
    track: (event, props = {}) => {
      trackAnalytics(event, props);
      if (DEMO_EVENTS[event]) trackDemo(DEMO_EVENTS[event], typeof props.placement === 'string' ? props.placement : undefined);
    },
    openWithAccount: async (): Promise<Result> => {
      if (!supabase || !invite) return { ok: false, code: 'no_invite' };
      let r = await registerWithInvite(supabase, invite.email, invite.tokenHash);
      if (r === 'exists') {
        // The address already has an account (created by this invite earlier, or a KsięgaI
        // account): the link signs it in. The server refuses after the first purchase.
        const t = await publicAction<{ access_token: string; refresh_token: string }>(
          'tovernetOffer.inviteLogin', { publicId: demo.public_id, tokenHash: invite.tokenHash },
        ).catch(() => null);
        const signed = t ? (await supabase.auth.setSession(t)).data.session : null;
        if (!signed) { setInvite({ ...invite, hasAccount: true }); trackAnalytics('auth_existing_account'); return { ok: false, code: 'account_exists' }; }
        r = signed;
      }
      if (!r) { trackAnalytics('auth_failed', { method: 'personal_link' }); return { ok: false, code: 'register_failed' }; }
      identify(r, 'personal_link');
      setSession(r);
      try { await claim(r); return { ok: true }; } catch (e) { return { ok: false, code: code(e) }; }
    },
    sendCode: async (email) => {
      if (!supabase) return { ok: false, code: 'auth_unavailable' };
      const sent = await sendLoginCode(supabase, email);
      if (sent !== 'sent') { trackAnalytics('auth_failed', { method: 'email_code', stage: 'send' }); return { ok: false, code: sent }; }
      trackAnalytics('auth_code_sent', { personal_link: Boolean(invite) });
      return { ok: true };
    },
    verifyCode: async (email, otp) => {
      if (!supabase) return { ok: false, code: 'auth_unavailable' };
      const { data, error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
      if (error || !data.session) { trackAnalytics('auth_failed', { method: 'email_code', stage: 'verify' }); return { ok: false, code: 'bad_code' }; }
      identify(data.session, 'email_code');
      setSession(data.session);
      return { ok: true };
    },
    signOut: () => { void supabase?.auth.signOut({ scope: 'local' }); setSession(null); },
    checkSignatory: async (name, capacity) => {
      const session = sessionRef.current;
      if (!session) return { ok: false, code: 'not_signed_in' };
      try {
        await claim(session);
        const { check } = await publicAction<{ check: SignatoryCheck }>('tovernetCheckout.checkSignatory', {
          publicId: demo.public_id, name, capacity,
        }, session.access_token);
        return { ok: true, check };
      } catch (e) {
        return { ok: false, code: code(e) };
      }
    },
    pay: async (cart, c): Promise<PayResult> => {
      const session = sessionRef.current;
      if (!session) return { ok: false, code: 'not_signed_in' };
      try {
        await claim(session);
        const payment = await publicAction<PaymentStart>('tovernetCheckout.create', {
          publicId: demo.public_id, package: cart.pkg, plan: cart.plan, addons: cartAddons(demo, cart),
          paymentOption: cart.payment ?? 'full', autopay: Boolean(cart.autopay),
          documents: DOCUMENT_VERSIONS, signatory: c.signatory, consents: c.consents, professional: c.professional,
        }, session.access_token);
        clearInviteToken(demo.public_id);
        return { ok: true, payment };
      } catch (e) {
        return { ok: false, code: code(e) };
      }
    },
    confirmPayment: async (orderId, paymentIntentId) => {
      const session = sessionRef.current;
      if (!session) return { status: 'pending' };
      // The webhook usually settles first; this call does the same work if it has not yet.
      for (let i = 0; i < 8; i++) {
        try {
          const r = await publicAction<{ paymentStatus: string; order: { status: string } | null; error: string | null }>(
            'tovernetCheckout.confirm', { orderId, paymentIntentId }, session.access_token);
          if (r.order?.status === 'paid') return { status: 'paid' };
          if (r.order?.status === 'payment_review') return { status: 'pending' };
          if (r.paymentStatus === 'requires_payment_method' || r.paymentStatus === 'canceled') {
            return { status: 'failed', message: paymentMessage(r.error) };
          }
        } catch { /* retry */ }
        await new Promise((res) => setTimeout(res, i < 3 ? 1500 : 3000));
      }
      return { status: 'pending' };
    },
    ask: async (message, contact) => {
      try {
        await publicAction('tovernetLead.submit', {
          source: `demo:${demo.public_id}`, notes: message,
          ...(contact?.includes('@') ? { email: contact } : contact ? { phone: contact } : {}),
        });
        return { ok: true };
      } catch (e) { return { ok: false, code: code(e) }; }
    },
  }), [invite, session, supabase, demo]); // eslint-disable-line react-hooks/exhaustive-deps

  // First visit from a personal invite: open the account and claim the company at once, with no
  // gate (owner 2026-11-06: 12 of 21 recipients left at "Odblokuj ofertę" before seeing anything,
  // ksiegai docs/plans/tovernet/20-conversion-rethink.md). The offer shows meanwhile; a failure
  // never blocks it, and the account is then opened at checkout as before.
  useEffect(() => {
    if (!sessionKnown || !inviteKnown || !actions.inviteEmail || session || autoOpened.current) return;
    autoOpened.current = true;
    void actions.openWithAccount().then((r) => trackAnalytics('account_auto_opened', { ok: r.ok, code: r.ok ? null : r.code }));
  }, [sessionKnown, inviteKnown, actions, session]);

  if (!sessionKnown || !inviteKnown) return <OfferLoader />;
  return <StudioJourney demo={demo} actions={actions} />;
}
