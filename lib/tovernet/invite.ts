// The personal invite token, kept in this browser so a visitor who has not registered yet
// can refresh or return from the same device and still get one-click sign-up. The server
// still decides whether the invite is valid, on every check. Only for the personal e-mail
// link: a view-only link never stores anything.
// Matches the invite's own expiry (30 days); the server still checks it on every use.
const TTL_MS = 30 * 24 * 60 * 60 * 1000;
const key = (publicId: string) => `tovernet_invite_${publicId}`;

export function saveInviteToken(publicId: string, token: string) {
  try { localStorage.setItem(key(publicId), JSON.stringify({ token, expires: Date.now() + TTL_MS })); } catch { /* storage blocked */ }
}

export function readInviteToken(publicId: string): string | null {
  try {
    const raw = localStorage.getItem(key(publicId));
    if (!raw) return null;
    const saved = JSON.parse(raw) as { token?: string; expires?: number };
    if (saved.token && saved.expires && saved.expires > Date.now()) return saved.token;
    localStorage.removeItem(key(publicId));
  } catch { /* storage blocked or bad value */ }
  return null;
}

export function clearInviteToken(publicId: string) {
  try { localStorage.removeItem(key(publicId)); } catch { /* storage blocked */ }
}
