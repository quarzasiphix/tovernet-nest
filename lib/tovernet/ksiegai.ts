// Handoff from the Tovernet panel into Księgai (the "Profil firmy gotowy w Księgai" milestone).
//
// Contract for the Tovernet–Księgai integration (owned by a separate workstream; do not build a
// parallel auth flow here):
//   1. State. The panel reads `workspace.ksiegai` from `tovernetProject.get`:
//      { status: 'waiting' | 'preparing' | 'ready' | 'failed', business_profile_id, ready_at, missing }.
//      The server status always wins. Only a backend without the field falls back to "ready once
//      the brief is submitted" (every project already belongs to a `public.business_profiles` row).
//   2. Navigation. `openKsiegaiInvoices` is the single entry point the CTA calls. The integration
//      workstream replaces its body with the business-scoped handoff (public-api
//      `tovernetProject.ksiegaiHandoff`, one-time code, redirect). Keep the signature.
import { track } from './analytics';
import { publicAction } from './api';
import { authClient } from './supabase';

export const KSIEGAI_APP_URL = process.env.NEXT_PUBLIC_KSIEGAI_APP_URL ?? 'https://app.ksiegai.pl';

export type KsiegaiState = 'waiting' | 'preparing' | 'ready' | 'failed';

export function ksiegaiState(ws: { brief_submitted_at: string | null; status: string; ksiegai?: { status: string } | null }): KsiegaiState {
  if (ws.status === 'cancelled') return 'waiting';
  const server = ws.ksiegai?.status;
  if (server === 'waiting' || server === 'ready' || server === 'preparing' || server === 'failed') return server;
  return ws.brief_submitted_at ? 'ready' : 'waiting';
}

async function sessionToken(): Promise<string> {
  const supabase = authClient();
  const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
  const token = data.session?.access_token;
  if (!token) throw new Error('Zaloguj się ponownie, aby przejść do Księgai.');
  return token;
}

// Only ever navigate to the configured Księgai app, whatever the response says.
function goToKsiegai(url: string) {
  const target = new URL(url);
  if (target.origin !== new URL(KSIEGAI_APP_URL).origin) throw new Error('Nie udało się otworzyć Księgai.');
  window.location.assign(target.toString());
}

/**
 * The panel's session stays on tovernet.online. The server mints a one-time code (256 bits,
 * 120 s, single use, bound to this user, this company and the target page) and returns the
 * Księgai URL with the code in the fragment. Księgai redeems it for its own session, selects the
 * company and opens the page. Both functions throw on failure so the caller can reset its button.
 * Backend: ksiegai migrations 20261103160000 and 20261103170000.
 */
export async function openKsiegaiInvoices(ctx: { projectId: string; businessProfileId?: string | null }): Promise<void> {
  const token = await sessionToken();
  const { url } = await publicAction<{ url: string; expiresAt: string }>(
    'tovernetProject.ksiegaiHandoff', { projectId: ctx.projectId }, token,
  );
  track('ksiegai_opened', { project_id: ctx.projectId, placement: 'panel_milestone' }, { beforeNavigation: true });
  goToKsiegai(url);
}

/**
 * Opens the buyer's copy of this order's invoice in Księgai (Wydatki, that one document) in a new
 * tab, so the panel stays open. The tab is opened synchronously in the click, before the handoff
 * call, or browsers block it as a popup; it is then pointed at the handoff URL. If the browser
 * still blocks it, the current tab navigates as before. Must be called directly from a click.
 */
export async function openKsiegaiInvoice(ctx: { orderId: string; placement: string }): Promise<void> {
  const tab = window.open('', '_blank');
  if (tab) {
    tab.opener = null;
    tab.document.title = 'Otwieramy fakturę…';
    tab.document.body.textContent = 'Otwieramy fakturę w Księgai…';
  }
  try {
    const token = await sessionToken();
    const { url } = await publicAction<{ url: string; expiresAt: string }>(
      'tovernetOrder.ksiegaiInvoice', { orderId: ctx.orderId }, token,
    );
    const target = new URL(url);
    if (target.origin !== new URL(KSIEGAI_APP_URL).origin) throw new Error('Nie udało się otworzyć Księgai.');
    track('ksiegai_opened', { order_id: ctx.orderId, placement: ctx.placement, new_tab: Boolean(tab) }, { beforeNavigation: !tab });
    if (tab) tab.location.replace(target.toString());
    else goToKsiegai(url);
  } catch (e) {
    tab?.close();
    throw e;
  }
}
