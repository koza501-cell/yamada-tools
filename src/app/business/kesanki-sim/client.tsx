'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================================
// Inline SVG Icons
// ============================================================
const Icons = {
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  ),
  Star: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  StarEmpty: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
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
  Trophy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
};

// ============================================================
// Constants
// ============================================================
const MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

// Busy months for tax accountants (higher cost, less attention)
const TAX_BUSY_MONTHS = [3, 12]; // March (個人確定申告 + 3月決算) and December (年末調整 + 12月決算)
const TAX_SEMI_BUSY_MONTHS = [1, 2, 9]; // Jan/Feb (確定申告シーズン), Sep (9月決算)

// Popular decision months (higher competition for accountant time)
const POPULAR_MONTHS = [3, 9, 12];

// ============================================================
// Types
// ============================================================
interface MonthAnalysis {
  month: number; // 1-12
  label: string;
  firstPeriodMonths: number; // length of first fiscal period
  totalExemptMonths: number; // total months of consumption tax exemption (period 1 + period 2)
  taxFilingDeadlineMonth: number; // month of tax filing deadline (決算月+2)
  isBusySeason: boolean;
  isSemiBusy: boolean;
  isPopular: boolean;
  score: number; // 0-100 overall rating
  pros: string[];
  cons: string[];
}

interface SimResult {
  setsuritsuMonth: number;
  shihonkinUnder10M: boolean;
  busyMonths: number[];
  recommended: MonthAnalysis;
  allMonths: MonthAnalysis[];
}

// ============================================================
// Helper functions
// ============================================================
function getMonthLabel(m: number): string {
  return MONTH_NAMES[m - 1];
}

function getFilingDeadlineMonth(kesanMonth: number): number {
  return ((kesanMonth + 2 - 1) % 12) + 1;
}

function getFirstPeriodMonths(setsuritsuMonth: number, kesanMonth: number): number {
  if (kesanMonth >= setsuritsuMonth) {
    return kesanMonth - setsuritsuMonth + 1;
  }
  return 12 - setsuritsuMonth + kesanMonth + 1;
}

function analyzeMonth(
  kesanMonth: number,
  setsuritsuMonth: number,
  shihonkinUnder10M: boolean,
  userBusyMonths: number[]
): MonthAnalysis {
  const firstPeriodMonths = getFirstPeriodMonths(setsuritsuMonth, kesanMonth);
  const secondPeriodMonths = 12;
  const totalExemptMonths = shihonkinUnder10M ? firstPeriodMonths + secondPeriodMonths : 0;
  const filingMonth = getFilingDeadlineMonth(kesanMonth);

  const isBusy = TAX_BUSY_MONTHS.includes(kesanMonth);
  const isSemiBusy = TAX_SEMI_BUSY_MONTHS.includes(kesanMonth);
  const isPopular = POPULAR_MONTHS.includes(kesanMonth);

  // Scoring
  let score = 50; // base

  // Consumption tax exemption maximization (most important, up to +30)
  if (shihonkinUnder10M) {
    const maxPossible = 23; // best case: 11 months period 1 + 12 months period 2
    const exemptRatio = firstPeriodMonths / 12;
    score += Math.round(exemptRatio * 30);
  }

  // Tax accountant availability (+10 if off-season, -10 if busy)
  if (isBusy) {
    score -= 10;
  } else if (isSemiBusy) {
    score -= 5;
  } else {
    score += 10;
  }

  // Avoid filing deadline in user's busy months (-8 per overlap)
  if (userBusyMonths.includes(filingMonth)) {
    score -= 8;
  }
  if (userBusyMonths.includes(kesanMonth)) {
    score -= 5;
  }

  // Avoid popular months (better accountant attention) +5
  if (!isPopular) {
    score += 5;
  }

  // Penalty for very short first period (< 3 months) — wastes exemption
  if (shihonkinUnder10M && firstPeriodMonths <= 2) {
    score -= 15;
  }
  if (shihonkinUnder10M && firstPeriodMonths <= 1) {
    score -= 10; // additional
  }

  // Bonus for near-maximum first period (10-11 months)
  if (shihonkinUnder10M && firstPeriodMonths >= 10) {
    score += 5;
  }

  // Clamp
  score = Math.max(0, Math.min(100, score));

  // Build pros/cons
  const pros: string[] = [];
  const cons: string[] = [];

  if (shihonkinUnder10M) {
    if (firstPeriodMonths >= 10) {
      pros.push(`第1期が${firstPeriodMonths}か月間 → 消費税免税期間を最大限活用`);
    } else if (firstPeriodMonths >= 7) {
      pros.push(`第1期は${firstPeriodMonths}か月間の免税期間`);
    }
    if (firstPeriodMonths <= 3) {
      cons.push(`第1期がわずか${firstPeriodMonths}か月 → 消費税免税期間を大幅に損失`);
    }
    if (totalExemptMonths >= 22) {
      pros.push(`合計${totalExemptMonths}か月間の消費税免税（最大級）`);
    }
  }

  if (!isBusy && !isSemiBusy) {
    pros.push('税理士の閑散期 → 丁寧な対応・費用が安い傾向');
  }
  if (isBusy) {
    cons.push('税理士の繁忙期 → 費用が高く、対応が手薄になりがち');
  }
  if (isSemiBusy) {
    cons.push('税理士がやや忙しい時期');
  }

  if (userBusyMonths.includes(filingMonth)) {
    cons.push(`申告期限（${getMonthLabel(filingMonth)}）が御社の繁忙期と重なる`);
  }
  if (userBusyMonths.includes(kesanMonth) && !userBusyMonths.includes(filingMonth)) {
    cons.push(`決算月（${getMonthLabel(kesanMonth)}）が御社の繁忙期と重なる → 棚卸し等が大変`);
  }

  if (!isPopular) {
    pros.push('決算法人が少ない月 → 税務調査の確率が分散');
  }

  return {
    month: kesanMonth,
    label: getMonthLabel(kesanMonth),
    firstPeriodMonths,
    totalExemptMonths,
    taxFilingDeadlineMonth: filingMonth,
    isBusySeason: isBusy,
    isSemiBusy,
    isPopular,
    score,
    pros,
    cons,
  };
}

function getScoreStars(score: number): number {
  if (score >= 85) return 5;
  if (score >= 70) return 4;
  if (score >= 55) return 3;
  if (score >= 40) return 2;
  return 1;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 60) return 'text-blue-600 dark:text-blue-400';
  if (score >= 40) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-500 dark:text-red-400';
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
  if (score >= 60) return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
  if (score >= 40) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
  return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
}

// ============================================================
// Main Component
// ============================================================
export default function KesankiSimClient() {
  const [mounted, setMounted] = useState(false);
  const [setsuritsuMonth, setSetsuritsuMonth] = useState<number>(4);
  const [shihonkinUnder10M, setShihonkinUnder10M] = useState<boolean>(true);
  const [busyMonths, setBusyMonths] = useState<number[]>([]);
  const [result, setResult] = useState<SimResult | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleBusyMonth = (m: number) => {
    setBusyMonths((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const handleCalculate = () => {
    const allMonths: MonthAnalysis[] = [];
    for (let m = 1; m <= 12; m++) {
      allMonths.push(analyzeMonth(m, setsuritsuMonth, shihonkinUnder10M, busyMonths));
    }
    allMonths.sort((a, b) => b.score - a.score);
    const recommended = allMonths[0];

    setResult({
      setsuritsuMonth,
      shihonkinUnder10M,
      busyMonths: [...busyMonths],
      recommended,
      allMonths,
    });
  };

  if (!mounted) {
    return <div className="min-h-screen py-12 flex items-center justify-center text-gray-500 dark:text-gray-400">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-pink-500 transition-colors">ホーム</Link>
          <span className="mx-2">{'>'}</span>
          <Link href="/business" className="hover:text-pink-500 transition-colors">ビジネス・法人</Link>
          <span className="mx-2">{'>'}</span>
          <span className="text-gray-900 dark:text-gray-100">決算期シミュレーター</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          決算期シミュレーター
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          会社の設立月から<strong>最適な決算月</strong>を自動判定します。
          消費税の免税期間を最大化しつつ、税理士の繁忙期や自社の忙しい月を避けた決算月を提案します。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* ============================================================ */}
        {/* INPUT FORM */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">

          {/* 設立月 */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              会社の設立月（予定月）を選択
            </label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSetsuritsuMonth(m)}
                  className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all ${
                    setsuritsuMonth === m
                      ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500 shadow-md'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  {m}月
                </button>
              ))}
            </div>
          </div>

          {/* 資本金 */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              資本金は1,000万円未満ですか？
              <span className="ml-2 text-xs font-normal text-gray-400">（消費税免税の判定に使用）</span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShihonkinUnder10M(true)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                  shihonkinUnder10M
                    ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                はい（1,000万円未満）
              </button>
              <button
                type="button"
                onClick={() => setShihonkinUnder10M(false)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                  !shihonkinUnder10M
                    ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                いいえ（1,000万円以上）
              </button>
            </div>
            {!shihonkinUnder10M && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Icons.AlertTriangle />
                資本金1,000万円以上の場合、設立初年度から消費税の課税事業者になります。
              </p>
            )}
          </div>

          {/* 繁忙期 */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              御社の繁忙期を選択（複数可・任意）
              <span className="ml-2 text-xs font-normal text-gray-400">決算月・申告期限との重なりを回避します</span>
            </label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                const isSelected = busyMonths.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleBusyMonth(m)}
                    className={`py-2.5 px-2 rounded-xl border-2 text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-500'
                        : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    {isSelected && <span className="mr-0.5">✓</span>}
                    {m}月
                  </button>
                );
              })}
            </div>
            {busyMonths.length === 0 && (
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">選択しない場合、繁忙期の考慮なしで計算します</p>
            )}
          </div>

          {/* Calculate */}
          <button
            type="button"
            onClick={handleCalculate}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Icons.Calendar />
            最適な決算月を計算する
          </button>
        </div>

        {/* ============================================================ */}
        {/* RESULTS */}
        {/* ============================================================ */}
        {result && (
          <div className="space-y-6 mb-12">
            {/* Recommendation header */}
            <div className={`rounded-2xl border-2 p-6 md:p-8 shadow-lg ${getScoreBg(result.recommended.score)}`}>
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/70 dark:bg-gray-800/70 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <Icons.Trophy />
                  おすすめの決算月
                </div>
                <h2 className={`text-4xl md:text-5xl font-black ${getScoreColor(result.recommended.score)}`}>
                  {result.recommended.label}決算
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  {getMonthLabel(result.setsuritsuMonth)}設立 → {result.recommended.label}決算（事業年度：{getMonthLabel(result.setsuritsuMonth)}〜{result.recommended.label}）
                </p>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">第1期の長さ</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{result.recommended.firstPeriodMonths}か月</p>
                </div>
                {result.shihonkinUnder10M && (
                  <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">消費税免税期間</p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{result.recommended.totalExemptMonths}か月</p>
                  </div>
                )}
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">申告期限</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{getMonthLabel(result.recommended.taxFilingDeadlineMonth)}末</p>
                </div>
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">総合スコア</p>
                  <p className={`text-lg font-bold ${getScoreColor(result.recommended.score)}`}>{result.recommended.score}点</p>
                </div>
              </div>

              {/* Pros/Cons of recommended */}
              {(result.recommended.pros.length > 0 || result.recommended.cons.length > 0) && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.recommended.pros.length > 0 && (
                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4">
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">メリット</p>
                      <ul className="space-y-1.5">
                        {result.recommended.pros.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <span className="text-emerald-500 mt-0.5 flex-shrink-0"><Icons.Check /></span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.recommended.cons.length > 0 && (
                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4">
                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">注意点</p>
                      <ul className="space-y-1.5">
                        {result.recommended.cons.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <span className="text-amber-500 mt-0.5 flex-shrink-0"><Icons.AlertTriangle /></span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Consumption tax explanation */}
            {result.shihonkinUnder10M && (
              <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-1.5 mb-3">
                  <Icons.Info />
                  消費税の免税期間について
                </h3>
                <div className="text-sm text-emerald-900/80 dark:text-emerald-200/80 space-y-2 leading-relaxed">
                  <p>
                    資本金1,000万円未満の法人は、設立後<strong>最大2事業年度</strong>が消費税免税です。
                  </p>
                  <p>
                    <strong>{getMonthLabel(result.setsuritsuMonth)}設立 × {result.recommended.label}決算</strong>の場合：
                    第1期 {result.recommended.firstPeriodMonths}か月 + 第2期 12か月 = <strong>合計{result.recommended.totalExemptMonths}か月間</strong>が免税となります。
                  </p>
                  {result.recommended.firstPeriodMonths <= 3 && (
                    <p className="text-amber-700 dark:text-amber-400 font-medium">
                      ⚠ 第1期が短いため、免税期間を十分に活用できません。設立月の前月を決算月にすると最大化できます。
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* All 12 months ranking */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">全12か月の評価一覧</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{getMonthLabel(result.setsuritsuMonth)}設立の場合 — スコア順</p>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {result.allMonths.map((ma, idx) => {
                  const stars = getScoreStars(ma.score);
                  const isTop = idx === 0;
                  return (
                    <div
                      key={ma.month}
                      className={`px-6 py-4 flex items-center gap-4 ${isTop ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}
                    >
                      {/* Rank */}
                      <span className={`w-8 text-center text-sm font-bold ${isTop ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        {isTop ? '🏆' : `${idx + 1}`}
                      </span>

                      {/* Month */}
                      <span className={`w-16 font-bold text-base ${isTop ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-900 dark:text-gray-100'}`}>
                        {ma.label}決算
                      </span>

                      {/* Stars */}
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={i < stars ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}>
                            {i < stars ? <Icons.Star /> : <Icons.StarEmpty />}
                          </span>
                        ))}
                      </div>

                      {/* Score */}
                      <span className={`w-12 text-right text-sm font-bold ${getScoreColor(ma.score)}`}>
                        {ma.score}点
                      </span>

                      {/* Period info */}
                      <div className="hidden md:flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 flex-1">
                        <span className="flex items-center gap-1">
                          <Icons.Clock />
                          第1期 {ma.firstPeriodMonths}か月
                        </span>
                        {result.shihonkinUnder10M && (
                          <span>免税 {ma.totalExemptMonths}か月</span>
                        )}
                        <span>申告 {getMonthLabel(ma.taxFilingDeadlineMonth)}末</span>
                        {ma.isBusySeason && (
                          <span className="text-red-500 dark:text-red-400 font-medium">税理士繁忙期</span>
                        )}
                      </div>

                      {/* Tags on mobile */}
                      <div className="flex md:hidden flex-wrap gap-1 flex-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{ma.firstPeriodMonths}か月</span>
                        {ma.isBusySeason && (
                          <span className="text-xs text-red-500 dark:text-red-400">繁忙期</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key deadlines */}
            {result.recommended && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Icons.Clock />
                  {result.recommended.label}決算の場合の主な届出期限
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      label: '法人税 確定申告・納付',
                      deadline: `${getMonthLabel(result.recommended.taxFilingDeadlineMonth)}末日`,
                      note: '決算日から2か月以内',
                    },
                    {
                      label: '消費税 確定申告・納付',
                      deadline: `${getMonthLabel(result.recommended.taxFilingDeadlineMonth)}末日`,
                      note: '法人税と同じ期限',
                    },
                    {
                      label: '法人住民税・事業税 申告',
                      deadline: `${getMonthLabel(result.recommended.taxFilingDeadlineMonth)}末日`,
                      note: '都道府県税事務所・市区町村',
                    },
                    {
                      label: '株主総会の開催',
                      deadline: `${result.recommended.label}末日まで（通常）`,
                      note: '定款で定めた期間内',
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                      <span className="text-pink-500 mt-0.5 flex-shrink-0"><Icons.Calendar /></span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.note}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100 shrink-0">{item.deadline}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related tools */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">あわせて使えるツール</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { href: '/business/setsuritsu-hiyo', label: '会社設立費用シミュレーター', desc: 'KK・GK・社団の設立費用を即計算' },
                  { href: '/business/kaisha-shindan', label: '会社形態診断ツール', desc: '最適な会社形態を8問で診断' },
                  { href: '/calculator/houjinka-sim', label: '法人化シミュレーター', desc: '個人事業 vs 法人の税金比較' },
                  { href: '/calculator/yakuin-hoshu', label: '役員報酬最適化', desc: '手取りを最大化する報酬額を計算' },
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

            {/* Disclaimer */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                ※ 本シミュレーションは一般的な判断基準に基づく参考情報です。消費税の免税判定には、特定期間（設立後6か月）の課税売上高・給与支払額の基準もあります。
                インボイス登録事業者は設立初年度から課税事業者となる場合があります。最終的な決算期の決定は税理士にご相談ください。
                決算期は設立後でも変更可能です（定款変更＋届出で対応）。
              </p>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PRE-COMPUTED EXAMPLES */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">設立月別 おすすめ決算月の早見表</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">資本金1,000万円未満・繁忙期なしの場合</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">設立月</th>
                  <th className="text-center py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">おすすめ決算月</th>
                  <th className="text-center py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">第1期</th>
                  <th className="text-center py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">免税合計</th>
                  <th className="text-center py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">申告期限</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  { s: '1月', k: '11月', p1: '11か月', ex: '23か月', dl: '1月末' },
                  { s: '2月', k: '11月', p1: '10か月', ex: '22か月', dl: '1月末' },
                  { s: '3月', k: '11月', p1: '9か月', ex: '21か月', dl: '1月末' },
                  { s: '4月', k: '11月', p1: '8か月', ex: '20か月', dl: '1月末' },
                  { s: '5月', k: '4月', p1: '12か月', ex: '24か月', dl: '6月末' },
                  { s: '6月', k: '5月', p1: '12か月', ex: '24か月', dl: '7月末' },
                  { s: '7月', k: '6月', p1: '12か月', ex: '24か月', dl: '8月末' },
                  { s: '8月', k: '7月', p1: '12か月', ex: '24か月', dl: '9月末' },
                  { s: '9月', k: '8月', p1: '12か月', ex: '24か月', dl: '10月末' },
                  { s: '10月', k: '8月', p1: '11か月', ex: '23か月', dl: '10月末' },
                  { s: '11月', k: '10月', p1: '12か月', ex: '24か月', dl: '12月末' },
                  { s: '12月', k: '11月', p1: '12か月', ex: '24か月', dl: '1月末' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-3 px-2 font-medium text-gray-900 dark:text-gray-100">{row.s}設立</td>
                    <td className="py-3 px-2 text-center font-bold text-pink-600 dark:text-pink-400">{row.k}決算</td>
                    <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">{row.p1}</td>
                    <td className="py-3 px-2 text-center text-emerald-600 dark:text-emerald-400 font-medium">{row.ex}</td>
                    <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">{row.dl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            ※ 上記は消費税免税期間・税理士繁忙期・人気月回避を総合的に考慮した推奨値です。御社の繁忙期により最適解は異なります。
          </p>
        </div>

        {/* ============================================================ */}
        {/* FAQ */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">よくある質問</h2>
          <div className="space-y-6">
            {[
              {
                q: '決算月はどうやって決めるのですか？',
                a: '会社設立時に定款で事業年度を定めます。例えば「毎年4月1日から翌年3月31日まで」と記載すれば3月決算になります。設立後に変更する場合は、株主総会決議による定款変更と、税務署等への届出が必要です。',
              },
              {
                q: 'なぜ設立月の前月が決算月として最適なのですか？',
                a: '消費税の免税期間を最大化するためです。第1期を最長（11〜12か月）にすることで、第1期＋第2期の合計免税期間が23〜24か月になります。設立月と同じ月を決算月にすると第1期が1か月になり、免税期間が13か月に短縮されてしまいます。',
              },
              {
                q: '3月決算にするメリット・デメリットは？',
                a: 'メリットは官公庁・大企業と会計年度が揃うことです。デメリットは税理士の最繁忙期（個人の確定申告＋3月決算法人が集中）と重なるため、税理士費用が高くなりやすく、対応が手薄になる可能性があることです。',
              },
              {
                q: '決算期を変更すると費用はかかりますか？',
                a: '登記変更は不要なので登録免許税はかかりません。自分で行う場合は実質無料（届出書の提出のみ）です。税理士に依頼する場合は数万円の報酬がかかることがあります。',
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
