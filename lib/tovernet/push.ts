// Browser push for the client panel: Firebase Cloud Messaging, the same Firebase project as
// KsięgaI (config is public by design, see ksiegai apps/admin/src/lib/firebaseWebPush.ts).
// Devices are stored in tovernet.push_devices through public-api (tovernetPush.register),
// separate from KsięgaI's devices. The Firebase SDK loads only when push is used.
import { publicAction } from './api';

const FIREBASE_WEB_CONFIG = {
  apiKey: 'AIzaSyAlEs8OrGvny8yct3-7-hx1yj_GGrXkOqE',
  authDomain: 'ksiegai-420b.firebaseapp.com',
  projectId: 'ksiegai-420b',
  storageBucket: 'ksiegai-420b.firebasestorage.app',
  messagingSenderId: '34332307408',
  appId: '1:34332307408:web:fed72ee215b5f8482ed3d5',
};
const VAPID_KEY = 'BLezXTQYFsmzjcGqZwu04bxrezkY6T1SdI93gd8Li1-GBvs0NykzoGa_9I7qv4Xy55qZxDRvKm3v0sFI_rlkWCE';

const TOKEN_KEY = 'tovernet:push-token';
const OPTED_OUT_KEY = 'tovernet:push-opted-out';
const DISMISSED_KEY = 'tovernet:push-prompt-dismissed';

export type PushState = 'unsupported' | 'ios-home-screen' | 'denied' | 'on' | 'off';
export type PushResult = { ok: boolean; reason?: 'unsupported' | 'denied' | 'error' };

const store = {
  get: (k: string) => { try { return window.localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { window.localStorage.setItem(k, v); } catch { /* private mode */ } },
  del: (k: string) => { try { window.localStorage.removeItem(k); } catch { /* private mode */ } },
};

/** iPhone/iPad deliver web push only to a web app added to the home screen (iOS 16.4+). */
export function isIosOutsideHomeScreen(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1);
  if (!ios) return false;
  const standalone = window.matchMedia?.('(display-mode: standalone)').matches
    || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return !standalone;
}

async function messagingOrNull() {
  if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) return null;
  const [{ initializeApp, getApps }, m] = await Promise.all([import('firebase/app'), import('firebase/messaging')]);
  if (!(await m.isSupported())) return null;
  const app = getApps()[0] ?? initializeApp(FIREBASE_WEB_CONFIG);
  return { messaging: m.getMessaging(app), m };
}

export async function pushState(): Promise<PushState> {
  if (typeof window === 'undefined') return 'unsupported';
  if (isIosOutsideHomeScreen()) return 'ios-home-screen';
  if (!('Notification' in window) || !('serviceWorker' in navigator) || !(await messagingOrNull())) return 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.permission === 'granted' && store.get(TOKEN_KEY) && store.get(OPTED_OUT_KEY) !== 'true' ? 'on' : 'off';
}

// The first registration is still installing; subscribing before it is active fails with
// "no active Service Worker".
async function activeRegistration(url: string): Promise<ServiceWorkerRegistration> {
  const registration = await navigator.serviceWorker.register(url);
  if (registration.active) return registration;
  const worker = registration.installing ?? registration.waiting;
  if (worker) {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('service_worker_timeout')), 15000);
      worker.addEventListener('statechange', () => {
        if (worker.state === 'activated') { clearTimeout(timer); resolve(); }
        if (worker.state === 'redundant') { clearTimeout(timer); reject(new Error('service_worker_redundant')); }
      });
    });
  }
  return registration;
}

async function register(accessToken: string): Promise<PushResult> {
  try {
    const fm = await messagingOrNull();
    if (!fm) return { ok: false, reason: 'unsupported' };
    const swUrl = `/firebase-messaging-sw.js?${new URLSearchParams(FIREBASE_WEB_CONFIG).toString()}`;
    const registration = await activeRegistration(swUrl);
    const token = await fm.m.getToken(fm.messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
    if (!token) return { ok: false, reason: 'error' };
    await publicAction('tovernetPush.register', { token }, accessToken);
    store.set(TOKEN_KEY, token);
    return { ok: true };
  } catch (e) {
    console.error('[tovernet push] register', e);
    return { ok: false, reason: 'error' };
  }
}

/** Asks for permission (call from a click: iOS requires a user gesture) and registers this browser. */
export async function enablePush(accessToken: string): Promise<PushResult> {
  if (!(await messagingOrNull())) return { ok: false, reason: 'unsupported' };
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return { ok: false, reason: 'denied' };
  store.del(OPTED_OUT_KEY);
  return register(accessToken);
}

export async function disablePush(accessToken: string): Promise<void> {
  const token = store.get(TOKEN_KEY);
  if (token) await publicAction('tovernetPush.disable', { token }, accessToken).catch(() => undefined);
  store.del(TOKEN_KEY);
  store.set(OPTED_OUT_KEY, 'true');
}

/**
 * On panel load: FCM tokens rotate, and the server switches dead ones off, so re-register
 * quietly when permission is already granted and the user has not turned push off here.
 * Also ties this browser's token to whoever is signed in now.
 */
export async function syncPush(accessToken: string): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted' || store.get(OPTED_OUT_KEY) === 'true') return;
  await register(accessToken);
}

/** While the panel is open, FCM delivers to the page instead of a system notification. */
export function onForegroundPush(handler: (p: { title: string; body: string }) => void): () => void {
  let unsub: (() => void) | null = null;
  let cancelled = false;
  void (async () => {
    const fm = await messagingOrNull().catch(() => null);
    if (!fm || cancelled) return;
    unsub = fm.m.onMessage(fm.messaging, (payload) => {
      handler({ title: payload.data?.title ?? 'Tovernet', body: payload.data?.body ?? '' });
    });
  })();
  return () => { cancelled = true; unsub?.(); };
}

export const pushPromptDismissed = () => store.get(DISMISSED_KEY) === 'true' || store.get(OPTED_OUT_KEY) === 'true';
export const dismissPushPrompt = () => store.set(DISMISSED_KEY, 'true');
