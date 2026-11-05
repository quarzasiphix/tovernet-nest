// First-party journey log for the personal offer (ksiegai 18-niche-expansion.md
// "Behaviour tracking", migration 20261103190000). Every funnel event that goes to
// `track()` is also queued here with the current stage, plus active (visible) time per
// stage. Batched to public-api `tovernetDemo.journey`; the server stores it only when
// TOVERNET_JOURNEY_TRACKING is on. No session recording, no form contents.

import { GATEWAY } from './api';
import { authClient } from './supabase';

type Ev = { e: string; s?: string; p?: Record<string, string | number | boolean | null>; ms?: number; t: number };

let ctx: { publicId: string; trackingCode: string | null; session: string } | null = null;
let queue: Ev[] = [];
let stage: string | null = null;
let activeSince: number | null = null; // visible time counting since
let stageMs = 0;
let timer: ReturnType<typeof setTimeout> | null = null;
let bound = false;

const now = () => Date.now();

function sessionId(): string {
  try {
    const k = 'tv-journey-session';
    const existing = sessionStorage.getItem(k);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(k, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

// Only short, primitive values; never free text the visitor typed.
const SKIP = new Set(['message', 'notes', 'email', 'phone', 'contact', 'body', 'text']);
function clean(props: Record<string, unknown>) {
  const out: Record<string, string | number | boolean | null> = {};
  for (const [k, v] of Object.entries(props).slice(0, 16)) {
    if (SKIP.has(k) || !/^[a-z_][a-z0-9_]{0,31}$/i.test(k)) continue;
    if (typeof v === 'string') out[k] = v.slice(0, 80);
    else if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
    else if (typeof v === 'boolean' || v === null) out[k] = v;
  }
  return out;
}

function push(ev: Omit<Ev, 't'>) {
  if (!ctx) return;
  queue.push({ ...ev, t: now() });
  if (queue.length >= 20) void flush();
  else if (!timer) timer = setTimeout(() => { void flush(); }, 5000);
}

function pauseClock() {
  if (activeSince != null) { stageMs += now() - activeSince; activeSince = null; }
}
function closeStage(reason: string) {
  if (!stage) return;
  pauseClock();
  if (stageMs > 300) push({ e: 'stage_time', s: stage, ms: Math.round(stageMs), p: { reason } });
  stageMs = 0;
}

async function flush(beacon = false) {
  if (timer) { clearTimeout(timer); timer = null; }
  if (!ctx || !queue.length) return;
  const events = queue.splice(0, 50);
  let token = '';
  if (!beacon) {
    try { token = (await authClient()?.auth.getSession())?.data.session?.access_token ?? ''; } catch { /* anonymous */ }
  }
  try {
    await fetch(`${GATEWAY}/v1/public`, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ action: 'tovernetDemo.journey', publicId: ctx.publicId, trackingCode: ctx.trackingCode, session: ctx.session, events }),
    });
  } catch { /* tracking never breaks the offer */ }
  if (queue.length) void flush(beacon);
}

/** Starts logging for one offer view. Safe to call more than once. */
export function startJourney(publicId: string, trackingCode: string | null, props: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const fresh = !ctx || ctx.publicId !== publicId;
  ctx = { publicId, trackingCode, session: sessionId() };
  if (!bound) {
    bound = true;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') { pauseClock(); push({ e: 'tab_hidden', s: stage ?? undefined }); void flush(true); }
      else if (stage) { activeSince = now(); push({ e: 'tab_visible', s: stage }); }
    });
    window.addEventListener('pagehide', () => { closeStage('page_left'); push({ e: 'page_left', s: stage ?? undefined }); void flush(true); });
  }
  if (fresh) {
    const device = window.matchMedia?.('(max-width: 860px)').matches ? 'phone' : 'desktop';
    push({ e: 'journey_started', p: clean({ device, width: window.innerWidth, ...props }) });
  }
}

/** Called by analytics.track(): every funnel event lands here with the current stage. */
export function journeyEvent(event: string, props: Record<string, unknown> = {}) {
  if (!ctx) return;
  if (event === 'stage_viewed' && typeof props.stage === 'string') {
    closeStage('next_stage');
    stage = props.stage;
    activeSince = document.visibilityState === 'visible' ? now() : null;
  }
  const name = event.replace(/[^a-z0-9_]/g, '_').slice(0, 48);
  push({ e: /^[a-z]/.test(name) ? name : `e_${name}`, s: stage ?? undefined, p: clean(props) });
}
