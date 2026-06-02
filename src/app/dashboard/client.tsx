'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell,
} from 'recharts';
import {
  getTotals,
  getTotalsThisMonth,
  getMonthlyBreakdown,
  getMostUsedTools,
  clearAllUsage,
} from '@/lib/value-tracker';
import type { UsageTotals } from '@/lib/value-tracker';
import { allTools } from '@/config/tools';
import Card from '@/components/ui/Card';
import Emoji from '@/components/ui/Emoji';
import { buttonCls } from '@/components/ui/Button';
import { UpgradePrompt } from '@/components/common/UpgradePrompt';
import { trackEvent } from '@/lib/analytics';

const TOTAL_TOOLS = allTools.filter(t => t.available).length;

function getToolMeta(slug: string) {
  const t = allTools.find(t => t.id === slug);
  return { name: t?.nameJa ?? slug, icon: t?.icon ?? '🔧', path: t?.path ?? '/' };
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}分`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}時間${m}分` : `${h}時間`;
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="text-gray-500 dark:text-gray-400 text-xs">{label}</p>
      <p className="font-bold text-blue-600 dark:text-blue-400">{payload[0].value}分節約</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center max-w-xs">
        <img src="/mascot/mascot-idle.png" alt="" className="w-24 h-24 mx-auto mb-6 object-contain opacity-80" />
        <h1 className="text-xl font-bold text-kon dark:text-gray-100 mb-2">
          まだツールを使っていません
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          ツールを使うたびに節約した時間と金額が記録され、ここに表示されます。
        </p>
        <Link
          href="/"
          className="inline-block bg-kon text-white font-bold px-6 py-3 rounded-btn text-sm hover:bg-primary-700 transition-colors"
        >
          ツールを探す →
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  label, value, sub, colorClass, cardClass = '',
}: {
  label: string; value: string; sub?: string; colorClass: string; cardClass?: string;
}) {
  return (
    <Card noHover className={`p-5 ${cardClass}`.trim()}>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</p>
      <p className={`text-2xl font-bold leading-tight ${colorClass}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </Card>
  );
}

export default function DashboardClient() {
  const [totals, setTotals] = useState<UsageTotals | null>(null);
  const [monthTotals, setMonthTotals] = useState<UsageTotals | null>(null);
  const [chartData, setChartData] = useState<{ label: string; minutes: number }[]>([]);
  const [topTools, setTopTools] = useState<{ slug: string; count: number; totalMinutes: number }[]>([]);

  useEffect(() => {
    setTotals(getTotals());
    setMonthTotals(getTotalsThisMonth());
    setChartData(getMonthlyBreakdown(6));
    setTopTools(getMostUsedTools(5));
    trackEvent('dashboard_viewed');
  }, []);

  // SSR guard — localStorage not available server-side
  if (!totals) return null;

  if (totals.totalUsages === 0) return <EmptyState />;

  const firstUsedDate = totals.firstUsedAt
    ? new Date(totals.firstUsedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-3xl mx-auto px-4 space-y-8">

        {/* Header */}
        <header>
          <h1 className="text-jp-h1 font-bold text-kon dark:text-gray-100">節約ダッシュボード</h1>
          {firstUsedDate && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">初回利用: {firstUsedDate}</p>
          )}
        </header>

        {/* Hero stats — 3 cards */}
        <section aria-label="累計サマリー">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="累計節約時間"
              value={formatTime(totals.totalTimeSavedMinutes)}
              colorClass="text-blue-600 dark:text-blue-400"
            />
            <StatCard
              label="累計節約金額"
              value={`¥${totals.totalMoneySavedYen.toLocaleString('ja-JP')}`}
              sub="時給¥3,000換算"
              colorClass="text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              label="利用ツール数"
              value={`${totals.toolsUsedCount} / ${TOTAL_TOOLS}`}
              sub="種類"
              colorClass="text-primary-900 dark:text-primary-100"
              cardClass="bg-primary-100 dark:bg-primary-900/20"
            />
          </div>
        </section>

        {/* This month + 6-month bar chart */}
        <section aria-label="今月の実績">
          <h2 className="text-jp-h2 font-bold text-kon dark:text-gray-100 mb-4">今月の実績</h2>
          <Card noHover className="p-6">
            <div className="flex gap-8 mb-6">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">今月の節約時間</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatTime(monthTotals?.totalTimeSavedMinutes ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">今月の利用回数</p>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                  {monthTotals?.totalUsages ?? 0}
                  <span className="text-sm font-normal ml-1 text-gray-500">回</span>
                </p>
              </div>
            </div>

            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(59,130,246,0.06)' }} />
                  <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={i === chartData.length - 1 ? '#3B82F6' : '#BFDBFE'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
              過去6ヶ月の節約時間（分） — 今月は濃色
            </p>
          </Card>
        </section>

        {/* Top 5 most-used tools */}
        {topTools.length > 0 && (
          <section aria-label="よく使うツール">
            <h2 className="text-jp-h2 font-bold text-kon dark:text-gray-100 mb-4">
              よく使うツール TOP{topTools.length}
            </h2>
            <Card noHover className="overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
              {topTools.map((t, i) => {
                const meta = getToolMeta(t.slug);
                return (
                  <Link
                    key={t.slug}
                    href={meta.path}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="w-5 text-sm font-bold text-gray-300 dark:text-gray-600 flex-shrink-0 text-right">
                      {i + 1}
                    </span>
                    <span className="text-xl flex-shrink-0">{meta.icon}</span>
                    <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                      {meta.name}
                    </span>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {formatTime(t.totalMinutes)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{t.count}回使用</p>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600 flex-shrink-0 text-lg">›</span>
                  </Link>
                );
              })}
            </Card>
          </section>
        )}

        {/* Tier-based upgrade prompt (self-dismissing, 7-day cooldown) */}
        <UpgradePrompt />

        {/* Collapsible methodology */}
        <section>
          <details className="bg-white dark:bg-gray-800 rounded-card border border-gray-200 dark:border-gray-700 group">
            <summary className="px-5 py-4 font-medium cursor-pointer text-gray-700 dark:text-gray-200 list-none flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors select-none">
              <span className="flex items-center gap-2 text-sm">
                <Emoji symbol="📐" size="sm" />
                計算方法について
              </span>
              <span className="text-gray-400 text-xs group-open:rotate-180 transition-transform duration-200 inline-block">▼</span>
            </summary>
            <div className="px-5 pb-5 pt-3 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 space-y-3">
              <ul className="space-y-2">
                <li>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">節約時間</span>
                  {' = '}手作業の想定時間 − ツール使用時間（端数切り捨て）
                </li>
                <li>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">時給基準</span>
                  {' ¥3,000/時間（事務作業の一般的な目安）'}
                </li>
                <li>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">節約金額</span>
                  {' = 節約時間 × ¥3,000/時間 + 直接的な金銭価値（代行費・郵送費等）'}
                </li>
                <li>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">上限設定</span>
                  {' 1回あたり最大60分・¥3,000（過大な見積もりを防ぐため）'}
                </li>
              </ul>
              <p className="text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
                数値はあくまで参考目安です。実際の節約効果は個人の作業速度・環境により異なります。
                <br />ツールごとの詳細な想定時間は<Link href="/about/methodology" className="text-blue-500 hover:underline">計算方法ページ</Link>をご覧ください。最終更新: 2026-05-26
              </p>
            </div>
          </details>
        </section>

        {/* Upgrade CTA */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-card p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">すべてのツールを無制限で</p>
          <p className="text-xl font-bold text-kon dark:text-gray-100 mb-1">月額¥980で無制限アクセス</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">年払いなら¥9,800（2ヶ月分お得）</p>
          <Link href="/pricing" className={buttonCls('primary', 'lg')}>
            PROプランを見る →
          </Link>
        </section>

        {/* Footer meta */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-600 pb-4 space-y-1">
          <p>累計{totals.totalUsages}回のツール使用を記録 · データはこのブラウザのみに保存されます</p>
          <button type="button"
            onClick={() => {
              if (window.confirm('利用履歴をすべて削除しますか？\nこの操作は取り消せません。')) {
                trackEvent('usage_cleared');
                clearAllUsage();
                window.location.reload();
              }
            }}
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors underline decoration-dotted cursor-pointer"
          >
            [クリア]
          </button>
        </div>

      </div>
    </div>
  );
}
