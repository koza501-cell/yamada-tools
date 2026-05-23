'use client';

/**
 * ExpertSupervision — 監修者・出典・更新日 trust block
 * 
 * Usage:
 *   <ExpertSupervision
 *     lastUpdated="2026年5月"
 *     sources={[
 *       { name: '国税庁 タックスアンサー', url: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/' },
 *     ]}
 *   />
 */

interface Source {
  name: string;
  url?: string;
}

interface ExpertSupervisionProps {
  /** Optional named supervisor — use when a specific 税理士 is recruited */
  supervisorName?: string;
  supervisorTitle?: string;
  supervisorRegistration?: string;
  /** Data sources / legal references */
  sources?: Source[];
  /** Last updated date string */
  lastUpdated?: string;
  /** Next review date */
  nextReview?: string;
  /** Additional trust note */
  trustNote?: string;
}

export default function ExpertSupervision({
  supervisorName,
  supervisorTitle,
  supervisorRegistration,
  sources = [],
  lastUpdated,
  nextReview,
  trustNote,
}: ExpertSupervisionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      {/* Trust badges */}
      <div className="flex flex-wrap gap-3 mb-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
          {supervisorName ? '税理士監修' : '公的データに基づく計算'}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          入力データ非保存
        </span>
        {lastUpdated && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            最終更新: {lastUpdated}
          </span>
        )}
      </div>

      {/* Supervisor (when available) */}
      {supervisorName && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{supervisorName}</p>
            {supervisorTitle && <p className="text-xs text-gray-500 dark:text-gray-400">{supervisorTitle}</p>}
            {supervisorRegistration && <p className="text-xs text-gray-400 dark:text-gray-500">登録番号: {supervisorRegistration}</p>}
          </div>
        </div>
      )}

      {/* Sources */}
      {sources.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">計算根拠・出典</p>
          <ul className="space-y-1">
            {sources.map((s, i) => (
              <li key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
                <span className="text-gray-300 dark:text-gray-600 mt-0.5 shrink-0">•</span>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors underline decoration-dotted">
                    {s.name}
                  </a>
                ) : (
                  <span>{s.name}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Trust note */}
      {trustNote && (
        <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{trustNote}</p>
      )}

      {/* Review schedule */}
      {nextReview && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">次回見直し予定: {nextReview}</p>
      )}
    </div>
  );
}
