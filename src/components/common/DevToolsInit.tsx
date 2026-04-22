'use client';

import { useEffect } from 'react';
import { getUserPrefs, setUserPrefs, clearUserPrefs } from '@/lib/userPrefs';

declare global {
  interface Window {
    getUserPrefs: typeof getUserPrefs;
    setUserPrefs: typeof setUserPrefs;
    clearUserPrefs: typeof clearUserPrefs;
  }
}

export default function DevToolsInit() {
  useEffect(() => {
    window.getUserPrefs = getUserPrefs;
    window.setUserPrefs = setUserPrefs;
    window.clearUserPrefs = clearUserPrefs;
  }, []);
  return null;
}
