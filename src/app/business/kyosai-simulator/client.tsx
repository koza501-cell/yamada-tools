'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ExpertSupervision from '@/components/ExpertSupervision';

// ============================================================
// Inline SVG Icons (no lucide-react)
// ============================================================
const Icons = {
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
  ),
  Heart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  ),
  Building: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
  ),
  Exit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
  ),
  Calculator: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  AlertTriangle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
};

// ============================================================
// Types
// ============================================================
type ExitType = 'kyosaiA' | 'kyosaiB' | 'jun' | 'kaiyaku';

// ============================================================
// Approximation curves (based on official 中小機構 example tables)
// ratio = payout / total contributions, keyed by months
// These are estimates for illustration; actual amounts follow
// the official 別表第一・別表第二 tables exactly.
// ============================================================
const A_CURVE: [number, number][] = [
  [6, 1.0],
  [12, 1.008],
  [36, 1.02],
  [60, 1.036],
  [120, 1.08],
  [180, 1.12],
  [240, 1.161],
  [360, 1.22],
  [480, 1.28],
];

const B_EXTRA = 0.015; // 共済金Bはおおむね共済金Aよりやや有利
const JUN_DISCOUNT = 0.02; // 準共済金はA/Bよりやや不利

function interpolateRatio(months: number, curve: [number, number][]): number {
  if (months < curve[0][0]) return 0;
  for (let i = 0; i < curve.length - 1; i++) {
    const [m1, r1] = curve[i];
    const [m2, r2] = curve[i + 1];
    if (months >= m1 && months <= m2) {
      const t = (months - m1) / (m2 - m1);
      return r1 + t * (r2 - r1);
    }
  }
  return curve[curve.length - 1][1];
}

function kaiyakuRatio(months: number): number {
  if (months < 12) return 0;
  if (months >= 240) {
    // slow overfunding beyond 20 years, capped illustration
    const extra = Math.min((months - 240) / 240, 1) * 0.06;
    return 1.0 + extra;
  }
  // linear approx from 80% at 12mo to 100% at 240mo
  const t = (months - 12) / (240 - 12);
  return 0.8 + t * 0.2;
}

interface CalculationResult {
  monthlyPremium: number;
  months: number;
  totalContribution: number;
  exitType: ExitType;
  payoutRatio: number;
  payoutAmount: number;
  gainLoss: number;
  annualTaxSaving: number;
  totalTaxSaving: number;
  effectiveCost: number;
}

// ============================================================
// Helpers
// ============================================================
function formatYen(n: number): string {
  return '¥' + Math.round(n).toLocaleString('ja-JP');
}

const TAX_BRACKETS = [
  { label: '課税所得195万円以下（税率5%）', rate: 5 },
  { label: '課税所得195〜330万円（税率10%）', rate: 10 },
  { label: '課税所得330〜695万円（税率20%）', rate: 20 },
  { label: '課税所得695〜900万円（税率23%）', rate: 23 },
  { label: '課税所得900〜1,800万円（税率33%）', rate: 33 },
  { label: '課税所得1,800〜4,000万円（税率40%）', rate: 40 },
  { label: '課税所得4,000万円超（税率45%）', rate: 45 },
];
const RESIDENT_TAX_RATE = 10;

// ============================================================
// Main Component
// ============================================================
export default function KyosaiSimulatorClient() {
  const [mounted, setMounted] = useState(false);

  const [monthlyPremium, setMonthlyPremium] = useState<string>('30000');
  const [years, setYears] = useState<string>('10');
  const [exitType, setExitType] = useState<ExitType>('kyosaiA');
  const [taxRate, setTaxRate] = useState<number>(20);

  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCalculate = () => {
    const premiumNum = Number(monthlyPremium) || 0;
    const yearsNum = Number(years) || 0;
    const months = Math.round(yearsNum * 12);
    if (premiumNum <= 0 || months <= 0) return;

    const totalContribution = premiumNum * months;

    let ratio = 0;
    if (exitType === 'kaiyaku') {
      ratio = kaiyakuRatio(months);
    } else {
      const baseRatio = interpolateRatio(months, A_CURVE);
      if (exitType === 'kyosaiA') ratio = baseRatio;
      else if (exitType === 'kyosaiB') ratio = months >= 180 ? baseRatio + B_EXTRA : 0;
      else if (exitType === 'jun') ratio = Math.max(baseRatio - JUN_DISCOUNT, months >= 12 ? 0.9 : 0);
    }

    const payoutAmount = totalContribution * ratio;
    const gainLoss = payoutAmount - totalContribution;

    const annualPremium = premiumNum * 12;
    const annualTaxSaving = annualPremium * ((taxRate + RESIDENT_TAX_RATE) / 100);
    const totalTaxSaving = annualTaxSaving * yearsNum;
    const effectiveCost = totalContribution - totalTaxSaving;

    setResult({
      monthlyPremium: premiumNum,
      months,
      totalContribution,
      exitType,
      payoutRatio: ratio,
      payoutAmount,
      gainLoss,
      annualTaxSaving,
      totalTaxSaving,
      effectiveCost,
    });
  };

  if (!mounted) {
    return <div className="min-h-screen py-12 flex items-center justify-center text-gray-500 dark:text-gray-400">読み込み中...</div>;
  }

  const exitLabels: Record<ExitType, string> = {
    kyosaiA: '共済金A（廃業・死亡）',
    kyosaiB: '共済金B（老齢給付・65歳以上180ヶ月以上）',
    jun: '準共済金（法人成り）',
    kaiyaku: '解約手当金（任意解約）',
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-pink-500 transition-colors">ホーム</Link>
          <span className="mx-2">{'>'}</span>
          <Link href="/business" className="hover:text-pink-500 transition-colors">ビジネス・法人</Link>
          <span className="mx-2">{'>'}</span>
          <span className="text-gray-900 dark:text-gray-100">小規模企業共済シミュレーター</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          小規模企業共済シミュレーター
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          掛金月額と加入年数を入力するだけで、<strong>節税効果</strong>と<strong>受取見込み額</strong>を計算します。
          共済金A・共済金B・準共済金・解約手当金の4パターンに対応。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* ============================================================ */}
        {/* INPUT FORM */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">

          {/* Monthly premium */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              掛金月額
              <span className="ml-2 text-xs font-normal text-gray-400">（1,000円〜70,000円・500円単位）</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
              <input
                type="number"
                value={monthlyPremium}
                onChange={(e) => setMonthlyPremium(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
                placeholder="30000"
                min="1000"
                max="70000"
                step="500"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {['5000', '10000', '20000', '30000', '50000', '70000'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMonthlyPremium(preset)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    monthlyPremium === preset
                      ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500'
                      : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {Number(preset).toLocaleString()}円
                </button>
              ))}
            </div>
          </div>

          {/* Years + tax bracket */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">加入年数（見込み）</label>
              <div className="relative">
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
                  placeholder="10"
                  min="1"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">年</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {['5', '10', '15', '20', '30'].map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setYears(y)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      years === y
                        ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500'
                        : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    {y}年
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                所得税率区分
                <span className="ml-2 text-xs font-normal text-gray-400">（節税額の計算に使用）</span>
              </label>
              <select
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-sm"
              >
                {TAX_BRACKETS.map((b) => (
                  <option key={b.rate} value={b.rate}>{b.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Exit type */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">受取事由（脱退理由）</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {([
                { value: 'kyosaiA' as ExitType, label: '共済金A', sub: '廃業・死亡時', icon: <Icons.Shield /> },
                { value: 'kyosaiB' as ExitType, label: '共済金B', sub: '老齢給付（65歳以上・180ヶ月以上）', icon: <Icons.Heart /> },
                { value: 'jun' as ExitType, label: '準共済金', sub: '個人事業の法人成り', icon: <Icons.Building /> },
                { value: 'kaiyaku' as ExitType, label: '解約手当金', sub: '任意解約（自己都合）', icon: <Icons.Exit /> },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setExitType(opt.value)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    exitType === opt.value
                      ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20 dark:border-pink-500 shadow-md'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  {exitType === opt.value && (
                    <span className="absolute top-2 right-2 text-pink-500"><Icons.Check /></span>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <span className={exitType === opt.value ? 'text-pink-500' : 'text-gray-400 dark:text-gray-500'}>{opt.icon}</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">{opt.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Calculate button */}
          <button
            type="button"
            onClick={handleCalculate}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Icons.Calculator />
            節税効果・受取額を計算する
          </button>
        </div>

        {/* ============================================================ */}
        {/* RESULTS */}
        {/* ============================================================ */}
        {result && (
          <div className="space-y-6 mb-12">
            {/* ヘッダー結果 */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-xl">
              <div className="text-center">
                <p className="text-sm text-slate-300 mb-1">{exitLabels[result.exitType]}での受取見込み額</p>
                <p className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                  {result.payoutAmount > 0 ? formatYen(result.payoutAmount) : '受給資格なし'}
                </p>
                {result.payoutAmount > 0 && (
                  <div className="flex items-center justify-center gap-4 text-sm text-slate-300 mt-4">
                    <span>掛金累計 {formatYen(result.totalContribution)}</span>
                    <span className="text-slate-500">/</span>
                    <span className={result.gainLoss >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
                      {result.gainLoss >= 0 ? '+' : ''}{formatYen(result.gainLoss)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 内訳 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 border-b border-blue-100 dark:border-blue-800">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 text-sm">受取シミュレーション内訳</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <ResultRow label="掛金月額" value={result.monthlyPremium} />
                <ResultRow label="掛金納付月数" value={result.months} isCount />
                <ResultRow label="掛金累計額" value={result.totalContribution} isBold />
                <ResultRow label="支給割合（目安）" value={Math.round(result.payoutRatio * 1000) / 10} isPercent />
                <ResultRow label="受取見込み額" value={result.payoutAmount} isBold isHighlight />
              </div>
            </div>

            {/* 節税効果 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 px-6 py-3 border-b border-emerald-100 dark:border-emerald-800">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-1.5">
                  <Icons.Info />
                  加入期間中の節税効果
                </h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <ResultRow label="年間節税額" value={result.annualTaxSaving} note="掛金全額所得控除による軽減" />
                <ResultRow label="加入期間累計 節税額" value={result.totalTaxSaving} isBold />
                <ResultRow label="実質負担額（掛金累計−節税累計）" value={result.effectiveCost} isBold isHighlight />
              </div>
            </div>

            {/* 注意事項 */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3">ご注意</h4>
              <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <li>• 受取見込み額は中小機構が公表する例に基づく概算です。実際の金額は掛金納付月数・区分ごとの支給率表（別表第一・別表第二）で厳密に決まります。</li>
                <li>• 共済金A・Bは6ヶ月未満、準共済金・解約手当金は12ヶ月未満の場合、受け取れません（掛け捨て）。</li>
                <li>• 解約手当金は240ヶ月（20年）未満の任意解約で元本割れします。</li>
                <li>• 掛金の増額・減額を行った場合、区分ごとに納付月数が計算されるため、本シミュレーションより不利になる場合があります。</li>
                <li>• 正確な受取額・節税額は中小機構または税理士にご確認ください。</li>
              </ul>
            </div>

            {/* 関連ツール */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">あわせて使えるツール</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { href: '/business/business-loan-simulator', label: 'ビジネスローン返済シミュレーター', desc: '融資の月々返済額を計算' },
                  { href: '/business/incorporation-simulator', label: '法人化シミュレーター', desc: '個人事業 vs 法人の税金比較' },
                  { href: '/finance/nisa-simulator', label: '新NISAシミュレーター', desc: '資産運用の積立シミュレーション' },
                ].map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all group"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{tool.label}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{tool.desc}</p>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600 group-hover:text-pink-400 transition-colors"><Icons.ArrowRight /></span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PRE-COMPUTED EXAMPLES (for SEO / GEO) */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">掛金月額1万円の場合の受取額目安（共済金A）</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">加入年数</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">掛金累計額</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">共済金A目安</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">解約手当金目安</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {[5, 10, 15, 20, 30].map((y) => {
                  const months = y * 12;
                  const total = 10000 * months;
                  const aRatio = interpolateRatio(months, A_CURVE);
                  const kRatio = kaiyakuRatio(months);
                  return (
                    <tr key={y} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-2 text-gray-900 dark:text-gray-100">{y}年</td>
                      <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">{formatYen(total)}</td>
                      <td className="py-3 px-2 text-right font-bold text-pink-600 dark:text-pink-400">{formatYen(total * aRatio)}</td>
                      <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">{formatYen(total * kRatio)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">※ 中小機構公表の例に基づく概算です。実際の金額は付加共済金の年度別支給率により変動します。</p>
        </div>

        {/* ============================================================ */}
        {/* FAQ */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          {/* 監修・出典 */}
          <div className="max-w-4xl mx-auto px-4 mb-8" style={{maxWidth: '100%'}}>
            <ExpertSupervision
              sources={[
                { name: '中小機構 小規模企業共済', url: 'https://www.smrj.go.jp/skyosai/' },
                { name: '共済金の額の算定方法', url: 'https://kyosai-web.smrj.go.jp/customer/skyosai/claim/index_02.html' },
              ]}
              lastUpdated="2026年5月"
              nextReview="予定利率改定時に随時"
              trustNote="本ツールの計算結果は概算です。正確な受取額・節税額は中小機構・税理士にご確認ください。"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">よくある質問</h2>
          <div className="space-y-6">
            {[
              {
                q: '小規模企業共済の掛金はいくらまで所得控除できますか？',
                a: '掛金は月額1,000円〜70,000円の範囲内で全額が「小規模企業共済等掛金控除」として所得控除の対象になります。年間最大84万円（月7万円×12ヶ月）まで控除でき、課税所得を大きく圧縮できます。',
              },
              {
                q: '共済金A・共済金B・準共済金・解約手当金の違いは？',
                a: '共済金Aは廃業や死亡時、共済金Bは65歳以上で180ヶ月以上納付した老齢給付時に受け取れます。準共済金は個人事業の法人成りで加入資格を失った場合、解約手当金は任意解約（自己都合）の場合に受け取ります。受取額はA・Bが最も有利で、任意解約の解約手当金が最も不利になります。',
              },
              {
                q: '20年未満で解約すると元本割れしますか？',
                a: '任意解約（解約手当金）の場合、掛金納付月数が240ヶ月（20年）未満だと支給率が80%〜99.25%となり、納付した掛金の合計額を下回ります。ただし廃業や死亡による共済金A・Bの場合は、5年程度の短期間でも掛金合計額を上回るケースが多くなります。',
              },
              {
                q: 'フリーランスでも加入できますか？',
                a: 'はい。雇用関係がなく請負契約・準委任契約等で事業所得として申告しているフリーランスも加入対象です。商業・サービス業は従業員5人以下、建設業・製造業等は20人以下の個人事業主または会社役員が対象になります。',
              },
              {
                q: '受け取るときも税金はかかりますか？',
                a: '一括受取りの場合は退職所得扱い、分割受取りの場合は公的年金等の雑所得扱いとなり、いずれも給与所得などと比べて税負担が軽くなる優遇があります。ただし任意解約（解約手当金）は一時所得扱いとなり、特別控除は最大50万円です。',
              },
            ].map((faq, i) => (
              <div key={i}>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2">Q. {faq.q}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-4 border-l-2 border-pink-200 dark:border-pink-800">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Result Row Component
// ============================================================
function ResultRow({
  label,
  value,
  note,
  isBold = false,
  isHighlight = false,
  isCount = false,
  isPercent = false,
}: {
  label: string;
  value: number;
  note?: string;
  isBold?: boolean;
  isHighlight?: boolean;
  isCount?: boolean;
  isPercent?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between px-6 py-3 ${isHighlight ? 'bg-emerald-50 dark:bg-emerald-900/10' : ''}`}>
      <div className="flex-1 min-w-0">
        <span className={`text-sm ${isBold ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
          {label}
        </span>
        {note && <span className="block text-xs text-gray-400 dark:text-gray-500 mt-0.5">{note}</span>}
      </div>
      <div className="ml-4 text-right shrink-0">
        <span className={`text-sm ${isBold ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-900 dark:text-gray-100'} ${isHighlight ? 'text-emerald-700 dark:text-emerald-400 font-bold text-base' : ''}`}>
          {isCount ? `${value}ヶ月` : isPercent ? `${value}%` : formatYen(value)}
        </span>
      </div>
    </div>
  );
}
