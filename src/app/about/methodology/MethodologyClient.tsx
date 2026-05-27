'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { TOOL_VALUE_TABLE } from '@/config/tool-value-table';
import { trackEvent } from '@/lib/analytics';
import type { ToolValue } from '@/config/tool-value-table';

const LAST_UPDATED = '2026-05-26';
const HOURLY_YEN = 3000;

const CATEGORY_LABELS: Record<string, string> = {
  pdf: 'PDF',
  image: '画像',
  finance: '金融',
  document: '書類',
  business: 'ビジネス',
  convert: '変換',
  other: 'その他',
};

function computeTimeSaved(tv: ToolValue): number {
  return Math.max(0, Math.round((tv.manualTimeMinutes * 60 - tv.toolTimeSeconds) / 60));
}

function computeMoney(tv: ToolValue): number {
  const timeMoney = Math.floor(computeTimeSaved(tv) * HOURLY_YEN / 60);
  return timeMoney + (tv.monetaryValueYen ?? 0);
}

type SortKey = 'toolName' | 'category' | 'manualTimeMinutes' | 'toolTimeSeconds' | 'timeSaved' | 'money';

function SortHeader({
  label, sortKey, current, dir, onSort,
}: {
  label: string; sortKey: SortKey; current: SortKey; dir: 'asc' | 'desc';
  onSort: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
    >
      {label}
      <span className={`ml-1 ${active ? 'text-primary-700 dark:text-primary-400' : 'text-gray-300 dark:text-gray-600'}`}>
        {active ? (dir === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </th>
  );
}

export function MethodologyClient() {
  const [sortKey, setSortKey] = useState<SortKey>('category');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filterCat, setFilterCat] = useState<string>('all');

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  useEffect(() => { trackEvent('methodology_opened'); }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(TOOL_VALUE_TABLE.map(t => t.category)));
    return cats.sort();
  }, []);

  const sorted = useMemo(() => {
    const filtered = filterCat === 'all'
      ? TOOL_VALUE_TABLE
      : TOOL_VALUE_TABLE.filter(t => t.category === filterCat);

    return [...filtered].sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      switch (sortKey) {
        case 'toolName': av = a.toolName; bv = b.toolName; break;
        case 'category': av = a.category; bv = b.category; break;
        case 'manualTimeMinutes': av = a.manualTimeMinutes; bv = b.manualTimeMinutes; break;
        case 'toolTimeSeconds': av = a.toolTimeSeconds; bv = b.toolTimeSeconds; break;
        case 'timeSaved': av = computeTimeSaved(a); bv = computeTimeSaved(b); break;
        case 'money': av = computeMoney(a); bv = computeMoney(b); break;
        default: av = a.toolName; bv = b.toolName;
      }
      const cmp = typeof av === 'string'
        ? av.localeCompare(bv as string, 'ja')
        : (av as number) - (bv as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [sortKey, sortDir, filterCat]);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-blue-500 hover:underline mb-4 inline-block">
            ← ダッシュボードに戻る
          </Link>
          <h1 className="text-2xl font-bold text-kon dark:text-gray-100 mb-2">節約金額の計算方法</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">最終更新: {LAST_UPDATED}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-card border border-gray-200 dark:border-gray-700 p-5 mb-6 text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <p><span className="font-semibold text-gray-800 dark:text-gray-100">時給基準:</span> ¥3,000/時間（事務作業の一般的な目安）</p>
          <p><span className="font-semibold text-gray-800 dark:text-gray-100">節約時間:</span> 手作業の想定時間 − ツール使用時間（端数切り捨て）</p>
          <p><span className="font-semibold text-gray-800 dark:text-gray-100">節約金額:</span> 節約時間 × ¥3,000/時間 + 直接的な金銭価値（代行費・郵送費等）</p>
          <p><span className="font-semibold text-gray-800 dark:text-gray-100">上限:</span> 1回あたり最大60分・¥3,000（過大な見積もりを防ぐため、記録時に適用）</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-100 dark:border-gray-600">
            数値はあくまで参考目安です。実際の節約効果は個人の作業速度・環境により異なります。
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilterCat('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterCat === 'all' ? 'bg-primary-700 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            すべて ({TOOL_VALUE_TABLE.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterCat === cat ? 'bg-primary-700 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              {CATEGORY_LABELS[cat] ?? cat} ({TOOL_VALUE_TABLE.filter(t => t.category === cat).length})
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-card border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <SortHeader label="ツール名" sortKey="toolName" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortHeader label="カテゴリ" sortKey="category" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortHeader label="手作業時間" sortKey="manualTimeMinutes" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortHeader label="ツール時間" sortKey="toolTimeSeconds" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortHeader label="節約時間" sortKey="timeSaved" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortHeader label="節約金額目安" sortKey="money" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">計算根拠</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {sorted.map((tv) => {
                  const timeSaved = computeTimeSaved(tv);
                  const money = computeMoney(tv);
                  return (
                    <tr key={tv.slug} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-3 py-3 font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">{tv.toolName}</td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {CATEGORY_LABELS[tv.category] ?? tv.category}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{tv.manualTimeMinutes}分</td>
                      <td className="px-3 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {tv.toolTimeSeconds >= 60
                          ? `${Math.floor(tv.toolTimeSeconds / 60)}分${tv.toolTimeSeconds % 60 > 0 ? `${tv.toolTimeSeconds % 60}秒` : ''}`
                          : `${tv.toolTimeSeconds}秒`}
                      </td>
                      <td className="px-3 py-3 font-medium text-green-700 dark:text-green-400 whitespace-nowrap">{timeSaved}分</td>
                      <td className="px-3 py-3 font-medium text-blue-700 dark:text-blue-400 whitespace-nowrap">
                        ¥{money.toLocaleString('ja-JP')}
                        {tv.monetaryValueYen ? <span className="text-xs text-gray-400 ml-1">(+直接)</span> : null}
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">{tv.methodology}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
            {sorted.length} / {TOOL_VALUE_TABLE.length} ツール表示
          </div>
        </div>

        <p className="mt-6 text-xs text-center text-gray-400 dark:text-gray-600">
          計算基準: 2026年5月時点 · 時給¥3,000（事務作業相場） · 上限60分/¥3,000/回
        </p>
      </div>
    </div>
  );
}
