/**
 * userPrefs — per-tool localStorage persistence, versioned JSON.
 *
 * Usage:
 *   const prefs = getUserPrefs('envelope-print');
 *   setUserPrefs('envelope-print', { senderName: '山田太郎' });
 *   clearUserPrefs('envelope-print');
 */

const SCHEMA_VERSION = 1;
const KEY_PREFIX = 'yt_prefs_v1_';

interface PrefsEnvelope<T> {
  v: number;
  data: T;
  savedAt: number;
}

function storageKey(toolKey: string): string {
  return `${KEY_PREFIX}${toolKey}`;
}

export function getUserPrefs<T extends object>(toolKey: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(storageKey(toolKey));
    if (!raw) return null;
    const envelope = JSON.parse(raw) as PrefsEnvelope<T>;
    if (envelope.v !== SCHEMA_VERSION) return null;
    return envelope.data;
  } catch {
    return null;
  }
}

export function setUserPrefs<T extends object>(toolKey: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    const envelope: PrefsEnvelope<T> = { v: SCHEMA_VERSION, data, savedAt: Date.now() };
    localStorage.setItem(storageKey(toolKey), JSON.stringify(envelope));
  } catch {
    // localStorage quota exceeded or unavailable — silently ignore
  }
}

export function clearUserPrefs(toolKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(storageKey(toolKey));
  } catch {
    // ignore
  }
}

export function getSavedAt(toolKey: string): Date | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(storageKey(toolKey));
    if (!raw) return null;
    const envelope = JSON.parse(raw) as PrefsEnvelope<unknown>;
    return new Date(envelope.savedAt);
  } catch {
    return null;
  }
}
