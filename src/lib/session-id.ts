/**
 * Returns a stable per-browser UUID, persisted in localStorage.
 * Used as X-Session-Id header for the feedback API to dedupe votes per browser.
 * Privacy: no PII, just a random UUID. Survives page reloads, not incognito.
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  const KEY = 'yamada-feedback-session-id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36));
    localStorage.setItem(KEY, id);
  }
  return id;
}
