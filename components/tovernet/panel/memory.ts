// Per-viewer conveniences in localStorage: last seen message, milestones already stamped.
// Never relied on for anything that matters; every read and write tolerates blocked storage.

export function readSeen(projectId: string): string | null {
  try { return localStorage.getItem(`tv-panel-seen:${projectId}`); } catch { return null; }
}
export function writeSeen(projectId: string, iso: string) {
  try { localStorage.setItem(`tv-panel-seen:${projectId}`, iso); } catch { /* ignore */ }
}

/** True the first time this browser sees a milestone, so its stamp animates once. */
export function firstStamp(projectId: string, key: string): boolean {
  try {
    const k = `tv-panel-stamps:${projectId}`;
    const set = new Set<string>(JSON.parse(localStorage.getItem(k) ?? '[]'));
    if (set.has(key)) return false;
    set.add(key);
    localStorage.setItem(k, JSON.stringify(Array.from(set)));
    return true;
  } catch { return false; }
}
