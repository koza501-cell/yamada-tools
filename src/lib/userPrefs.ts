/**
 * userPrefs — per-tool localStorage persistence.
 * Schema version is embedded in the key prefix (yt_prefs_v1_).
 * Bump KEY_PREFIX when the data shape changes incompatibly.
 */

const KEY_PREFIX = 'yt_prefs_v1_';

export function getUserPrefs<T extends object>(toolKey: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${KEY_PREFIX}${toolKey}`);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setUserPrefs<T extends object>(toolKey: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${KEY_PREFIX}${toolKey}`, JSON.stringify(data));
  } catch {
    // localStorage quota exceeded or unavailable — silently ignore
  }
}

export function clearUserPrefs(toolKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${KEY_PREFIX}${toolKey}`);
  } catch {
    // ignore
  }
}
