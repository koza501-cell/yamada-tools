'use client';

import { useEffect, useState } from 'react';
import PrivacyBadge from '@/components/common/PrivacyBadge';
import { getUserPrefs, setUserPrefs, clearUserPrefs } from '@/lib/userPrefs';

// Expose userPrefs on window for browser console testing
declare global {
  interface Window {
    getUserPrefs: typeof getUserPrefs;
    setUserPrefs: typeof setUserPrefs;
    clearUserPrefs: typeof clearUserPrefs;
  }
}

export default function ComponentsPreviewClient() {
  const [prefsLog, setPrefsLog] = useState<string[]>([]);
  const TEST_KEY = 'preview-test';

  useEffect(() => {
    window.getUserPrefs = getUserPrefs;
    window.setUserPrefs = setUserPrefs;
    window.clearUserPrefs = clearUserPrefs;
  }, []);

  function log(msg: string) {
    setPrefsLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  }

  function handleSet() {
    setUserPrefs(TEST_KEY, { a: 1, label: 'テスト' });
    const raw = localStorage.getItem(`yt_prefs_v1_${TEST_KEY}`);
    log(`setUserPrefs → localStorage['yt_prefs_v1_${TEST_KEY}'] = ${raw}`);
  }

  function handleGet() {
    const data = getUserPrefs(TEST_KEY);
    log(`getUserPrefs → ${JSON.stringify(data)}`);
  }

  function handleClear() {
    clearUserPrefs(TEST_KEY);
    const raw = localStorage.getItem(`yt_prefs_v1_${TEST_KEY}`);
    log(`clearUserPrefs → localStorage value = ${raw} (null = cleared)`);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 space-y-10">
      <h1 className="text-2xl font-bold text-kon">コンポーネントプレビュー</h1>
      <p className="text-sm text-gray-500">Staging only — noindex</p>

      {/* PrivacyBadge */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">PrivacyBadge</h2>
        <div className="space-y-3">
          <div>
            <p className="mb-1 text-xs text-gray-500">mode=&quot;browser-only&quot;</p>
            <PrivacyBadge mode="browser-only" />
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-500">mode=&quot;server-processed&quot;</p>
            <PrivacyBadge mode="server-processed" />
          </div>
        </div>
      </section>

      {/* userPrefs */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">userPrefs (localStorage utility)</h2>
        <p className="text-sm text-gray-600">
          ブラウザコンソールで <code className="bg-gray-100 px-1 rounded">window.setUserPrefs</code>,{' '}
          <code className="bg-gray-100 px-1 rounded">window.getUserPrefs</code>,{' '}
          <code className="bg-gray-100 px-1 rounded">window.clearUserPrefs</code> が利用可能です。
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleSet}
            className="rounded bg-kon px-4 py-2 text-sm text-white hover:opacity-90"
          >
            setUserPrefs
          </button>
          <button
            onClick={handleGet}
            className="rounded bg-ai px-4 py-2 text-sm text-white hover:opacity-90"
          >
            getUserPrefs
          </button>
          <button
            onClick={handleClear}
            className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:opacity-90"
          >
            clearUserPrefs
          </button>
        </div>
        {prefsLog.length > 0 && (
          <div className="rounded border border-gray-200 bg-gray-50 p-3 font-mono text-xs space-y-1">
            {prefsLog.map((entry, i) => (
              <div key={i}>{entry}</div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500">
          コンソールテスト例:{' '}
          <code className="bg-gray-100 px-1 rounded">
            setUserPrefs(&apos;test&apos;, &#123;a:1&#125;)
          </code>
        </p>
      </section>
    </main>
  );
}
