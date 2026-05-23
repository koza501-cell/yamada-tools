'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================================
// Inline SVG Icons
// ============================================================
const Icons = {
  Calculator: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  AlertTriangle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  Target: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  ),
};

// ============================================================
// License capital requirements
// ============================================================
interface LicenseReq {
  id: string;
  label: string;
  minCapital: number;
  note: string;
}

const LICENSE_REQUIREMENTS: LicenseReq[] = [
  { id: 'kensetsu', label: '建設業許可（一般）', minCapital: 5000000, note: '自己資本500万円以上、または500万円以上の資金調達能力' },
  { id: 'jinzai-haken', label: '労働者派遣事業', minCapital: 20000000, note: '基準資産額2,000万円以上（資産−負債）' },
  { id: 'jinzai-shokai', label: '有料職業紹介事業', minCapital: 5000000, note: '基準資産額500万円以上' },
  { id: 'fudosan', label: '宅地建物取引業', minCapital: 10000000, note: '営業保証金1,000万円（保証協会加入なら60万円）。資本金の法定要件はないが信用面で重要' },
  { id: 'unsou', label: '一般貨物自動車運送事業', minCapital: 6000000, note: '事業開始に必要な資金（車両費・保険料等）の合計額以上' },
  { id: 'ryokou-1', label: '旅行業（第1種）', minCapital: 30000000, note: '営業保証金7,000万円（保証協会加入なら1,400万円）' },
  { id: 'ryokou-2', label: '旅行業（第2種）', minCapital: 7000000, note: '営業保証金1,100万円（保証協会加入なら220万円）' },
  { id: 'ryokou-3', label: '旅行業（第3種）', minCapital: 3000000, note: '営業保証金300万円（保証協会加入なら60万円）' },
  { id: 'keibisha', label: '警備業', minCapital: 0, note: '資本金要件なし（ただし公安委員会の認定が必要）' },
];

function formatYen(n: number): string {
  if (n >= 10000) {
    return (n / 10000).toLocaleString('ja-JP') + '万円';
  }
  return '\u00a5' + n.toLocaleString('ja-JP');
}

function formatYenRaw(n: number): string {
  return '\u00a5' + n.toLocaleString('ja-JP');
}

// ============================================================
// Types
// ============================================================
interface GuideResult {
  // Factors
  expenseBased: number; // 月間経費 × months
  expenseMonths: number;
  licenseBased: number; // 許認可の最低資本金
  licenseLabel: string;
  financingBased: number; // 融資目標 ÷ 3
  taxThreshold: boolean; // 1,000万以上かどうかの警告
  credibilityMin: number; // 信用面の最低推奨
  // Result
  recommended: number;
  recommendedRounded: number;
  factors: { label: string; value: number; reason: string; isBinding: boolean }[];
  warnings: string[];
  tips: string[];
}

// ============================================================
// Main Component
// ============================================================
export default function ShihonkinGuideClient() {
  const [mounted, setMounted] = useState(false);
  const [monthlyExpense, setMonthlyExpense] = useState<string>('500000');
  const [hasLicense, setHasLicense] = useState<boolean>(false);
  const [selectedLicense, setSelectedLicense] = useState<string>('');
  const [planFinancing, setPlanFinancing] = useState<boolean>(false);
  const [financingTarget, setFinancingTarget] = useState<string>('5000000');
  const [credibilityPriority, setCredibilityPriority] = useState<string>('normal');
  const [result, setResult] = useState<GuideResult | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleCalculate = () => {
    const expenseNum = Number(monthlyExpense) || 0;
    const finTargetNum = Number(financingTarget) || 0;

    const factors: { label: string; value: number; reason: string; isBinding: boolean }[] = [];
    const warnings: string[] = [];
    const tips: string[] = [];

    // Factor 1: 月間経費 × 3〜6か月
    const expenseMonths = credibilityPriority === 'high' ? 6 : 3;
    const expenseBased = expenseNum * expenseMonths;
    factors.push({
      label: `運転資金（月間経費${expenseMonths}か月分）`,
      value: expenseBased,
      reason: `月間経費${formatYen(expenseNum)} × ${expenseMonths}か月 = ${formatYen(expenseBased)}`,
      isBinding: false,
    });

    // Factor 2: 許認可の最低資本金
    let licenseBased = 0;
    let licenseLabel = '';
    if (hasLicense && selectedLicense) {
      const lic = LICENSE_REQUIREMENTS.find((l) => l.id === selectedLicense);
      if (lic && lic.minCapital > 0) {
        licenseBased = lic.minCapital;
        licenseLabel = lic.label;
        factors.push({
          label: `許認可要件（${lic.label}）`,
          value: licenseBased,
          reason: lic.note,
          isBinding: true,
        });
      }
    }

    // Factor 3: 融資目標
    let financingBased = 0;
    if (planFinancing) {
      financingBased = Math.ceil(finTargetNum / 3);
      factors.push({
        label: '融資目標からの逆算',
        value: financingBased,
        reason: `日本政策金融公庫の創業融資は自己資金の2〜3倍が目安。${formatYen(finTargetNum)}の融資に必要な自己資金 ≈ ${formatYen(financingBased)}`,
        isBinding: false,
      });
    }

    // Factor 4: 信用面の最低推奨
    const credibilityMin = credibilityPriority === 'high' ? 3000000 : credibilityPriority === 'normal' ? 1000000 : 500000;
    factors.push({
      label: '信用力（銀行口座開設・取引先の印象）',
      value: credibilityMin,
      reason: credibilityPriority === 'high'
        ? '大企業・官公庁との取引では300万円以上が望ましい'
        : credibilityPriority === 'normal'
          ? '中小企業との取引では100万円以上が一般的'
          : '個人向けビジネスなら50万円以上で十分',
      isBinding: false,
    });

    // Determine recommended amount
    const rawRecommended = Math.max(expenseBased, licenseBased, financingBased, credibilityMin);

    // Round to nice number
    let recommended = rawRecommended;
    if (recommended <= 500000) recommended = Math.ceil(recommended / 100000) * 100000;
    else if (recommended <= 5000000) recommended = Math.ceil(recommended / 500000) * 500000;
    else recommended = Math.ceil(recommended / 1000000) * 1000000;

    // 1,000万 threshold check
    const taxThreshold = recommended >= 10000000;
    if (taxThreshold) {
      warnings.push('資本金1,000万円以上の場合、設立初年度から消費税の課税事業者になります（免税メリットなし）');
      warnings.push('法人住民税の均等割が増加します（7万円/年 → 18万円/年）');

      // If close to 10M and not forced by license, suggest 999万
      if (licenseBased < 10000000 && recommended >= 10000000 && recommended < 12000000) {
        tips.push('許認可上の制約がなければ、999万円にすることで消費税免税と均等割の節約が可能です');
        recommended = 9990000;
      }
    }

    if (recommended < 500000) {
      warnings.push('資本金50万円未満の場合、銀行の法人口座開設が困難になる可能性があります');
    }

    if (licenseBased > 0 && licenseBased > expenseBased) {
      tips.push(`許認可の資本金要件（${formatYen(licenseBased)}以上）が最も大きな決定要因です`);
    }

    if (planFinancing && financingBased > expenseBased) {
      tips.push('融資を有利にするには、資本金を多く見せることが重要です。ただし全額が口座に入っている必要があります');
    }

    tips.push('資本金は後から増資も可能です。まず必要最小限で設立し、事業が軌道に乗ったら増資する方法もあります');

    setResult({
      expenseBased,
      expenseMonths,
      licenseBased,
      licenseLabel,
      financingBased,
      taxThreshold: recommended >= 10000000,
      credibilityMin,
      recommended: rawRecommended,
      recommendedRounded: recommended,
      factors,
      warnings,
      tips,
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
          <span className="text-gray-900 dark:text-gray-100">資本金決定ガイド</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          資本金決定ガイド
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          月間経費・許認可要件・融資計画・信用力の4つの観点から、<strong>最適な資本金額</strong>を自動算出します。
          消費税の1,000万円ラインや均等割への影響も考慮します。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* ============================================================ */}
        {/* INPUT FORM */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">

          {/* 月間経費 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              想定する月間経費（固定費）
              <span className="ml-1 text-xs font-normal text-gray-400">家賃・人件費・通信費など</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{'\u00a5'}</span>
              <input type="number" value={monthlyExpense} onChange={(e) => setMonthlyExpense(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none" placeholder="500000" min="0" />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[{ l: '20万', v: '200000' }, { l: '30万', v: '300000' }, { l: '50万', v: '500000' }, { l: '80万', v: '800000' }, { l: '100万', v: '1000000' }].map((p) => (
                <button key={p.v} type="button" onClick={() => setMonthlyExpense(p.v)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${monthlyExpense === p.v ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}>{p.l}</button>
              ))}
            </div>
          </div>

          {/* 許認可 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">許認可が必要な業種ですか？</label>
            <div className="flex gap-3 mb-3">
              <button type="button" onClick={() => { setHasLicense(false); setSelectedLicense(''); }}
                className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${!hasLicense ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                不要
              </button>
              <button type="button" onClick={() => setHasLicense(true)}
                className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${hasLicense ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                必要
              </button>
            </div>
            {hasLicense && (
              <select
                value={selectedLicense}
                onChange={(e) => setSelectedLicense(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none text-sm"
              >
                <option value="">許認可の種類を選択</option>
                {LICENSE_REQUIREMENTS.filter((l) => l.minCapital > 0).map((lic) => (
                  <option key={lic.id} value={lic.id}>{lic.label}（{formatYen(lic.minCapital)}以上）</option>
                ))}
              </select>
            )}
          </div>

          {/* 融資計画 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">融資（借入）の予定は？</label>
            <div className="flex gap-3 mb-3">
              <button type="button" onClick={() => setPlanFinancing(false)}
                className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${!planFinancing ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                自己資金のみ
              </button>
              <button type="button" onClick={() => setPlanFinancing(true)}
                className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${planFinancing ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                融資を検討中
              </button>
            </div>
            {planFinancing && (
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">希望融資額</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{'\u00a5'}</span>
                  <input type="number" value={financingTarget} onChange={(e) => setFinancingTarget(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none text-sm" placeholder="5000000" min="0" />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[{ l: '300万', v: '3000000' }, { l: '500万', v: '5000000' }, { l: '1,000万', v: '10000000' }, { l: '2,000万', v: '20000000' }].map((p) => (
                    <button key={p.v} type="button" onClick={() => setFinancingTarget(p.v)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${financingTarget === p.v ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}>{p.l}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 信用力 */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">取引先の規模（信用力の重要度）</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: 'low', l: '個人・小規模', sub: '信用力は気にしない' },
                { v: 'normal', l: '中小企業', sub: '標準的な信用力' },
                { v: 'high', l: '大企業・官公庁', sub: '高い信用力が必要' },
              ].map((opt) => (
                <button key={opt.v} type="button" onClick={() => setCredibilityPriority(opt.v)}
                  className={`py-3 px-3 rounded-xl border-2 text-left transition-all ${credibilityPriority === opt.v ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600'}`}>
                  <span className={`text-sm font-medium block ${credibilityPriority === opt.v ? 'text-pink-700 dark:text-pink-400' : 'text-gray-700 dark:text-gray-300'}`}>{opt.l}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="button" onClick={handleCalculate}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
            <Icons.Calculator />
            最適な資本金額を計算する
          </button>
        </div>

        {/* ============================================================ */}
        {/* RESULTS */}
        {/* ============================================================ */}
        {result && (
          <div className="space-y-6 mb-12">

            {/* Recommendation hero */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-xl text-center">
              <div className="inline-flex items-center gap-2 mb-3 text-slate-300">
                <Icons.Target />
                <span className="text-sm">おすすめの資本金額</span>
              </div>
              <p className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                {formatYen(result.recommendedRounded)}
              </p>
              {result.recommendedRounded !== result.recommended && (
                <p className="text-sm text-slate-400">計算値 {formatYenRaw(result.recommended)} → 切り上げ {formatYen(result.recommendedRounded)}</p>
              )}
            </div>

            {/* Factor breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">判断根拠</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {result.factors.map((factor, i) => {
                  const isMax = factor.value === Math.max(...result.factors.map((f) => f.value));
                  return (
                    <div key={i} className={`px-6 py-4 ${isMax ? 'bg-pink-50/50 dark:bg-pink-900/5' : ''}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          {factor.label}
                          {isMax && <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-bold">決定要因</span>}
                          {factor.isBinding && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold">必須条件</span>}
                        </span>
                        <span className={`text-sm font-bold ${isMax ? 'text-pink-600 dark:text-pink-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {formatYen(factor.value)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{factor.reason}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
                <h4 className="font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-1.5 mb-3">
                  <Icons.AlertTriangle />
                  注意点
                </h4>
                <ul className="space-y-2">
                  {result.warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-amber-900/80 dark:text-amber-200/80">
                      <span className="text-amber-500 mt-0.5 shrink-0"><Icons.AlertTriangle /></span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {result.tips.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm flex items-center gap-1.5 mb-3">
                  <Icons.Info />
                  アドバイス
                </h4>
                <ul className="space-y-2">
                  {result.tips.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-blue-900/80 dark:text-blue-200/80">
                      <span className="text-blue-400 mt-0.5 shrink-0"><Icons.Check /></span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 消費税・均等割 impact */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-sm">資本金額による影響比較</h3>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 px-2 text-gray-500 dark:text-gray-400 font-semibold text-xs">項目</th>
                      <th className="text-center py-2 px-2 text-gray-500 dark:text-gray-400 font-semibold text-xs">999万円以下</th>
                      <th className="text-center py-2 px-2 text-gray-500 dark:text-gray-400 font-semibold text-xs">1,000万円以上</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr>
                      <td className="py-2.5 px-2 text-gray-700 dark:text-gray-300">消費税（設立1〜2期）</td>
                      <td className="py-2.5 px-2 text-center text-emerald-600 dark:text-emerald-400 font-medium">免税</td>
                      <td className="py-2.5 px-2 text-center text-red-600 dark:text-red-400 font-medium">課税</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2 text-gray-700 dark:text-gray-300">均等割（都道府県）</td>
                      <td className="py-2.5 px-2 text-center text-gray-600 dark:text-gray-400">2万円/年</td>
                      <td className="py-2.5 px-2 text-center text-gray-600 dark:text-gray-400">5万円/年</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2 text-gray-700 dark:text-gray-300">均等割（市町村）</td>
                      <td className="py-2.5 px-2 text-center text-gray-600 dark:text-gray-400">5万円/年</td>
                      <td className="py-2.5 px-2 text-center text-gray-600 dark:text-gray-400">13万円/年</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-700/30">
                      <td className="py-2.5 px-2 font-bold text-gray-900 dark:text-gray-100">均等割 合計</td>
                      <td className="py-2.5 px-2 text-center font-bold text-emerald-600 dark:text-emerald-400">7万円/年</td>
                      <td className="py-2.5 px-2 text-center font-bold text-red-600 dark:text-red-400">18万円/年</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-2 text-gray-700 dark:text-gray-300">登録免許税（KK設立時）</td>
                      <td className="py-2.5 px-2 text-center text-gray-600 dark:text-gray-400">15万円</td>
                      <td className="py-2.5 px-2 text-center text-gray-600 dark:text-gray-400">資本金×0.7%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <li>• 本ガイドの推奨額は一般的な目安です。最終決定は税理士・司法書士にご相談ください。</li>
                <li>• 許認可の資本金要件は「自己資本」や「基準資産額」の場合があり、単純な資本金額と異なることがあります。</li>
                <li>• 融資の可否は資本金だけでなく、事業計画・経験・信用情報等も影響します。</li>
                <li>• 特定期間（設立後6か月）の課税売上高が1,000万円超の場合、資本金1,000万円未満でも2期目から課税事業者になる場合があります。</li>
              </ul>
            </div>

            {/* Related tools */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">あわせて使えるツール</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { href: '/business/setsuritsu-hiyo', label: '会社設立費用シミュレーター', desc: '資本金額に応じた設立費用を計算' },
                  { href: '/business/kaisha-shindan', label: '会社形態診断ツール', desc: '最適な会社形態を診断' },
                  { href: '/business/houjin-iji-hiyo', label: '法人維持費シミュレーター', desc: '資本金による均等割の差を確認' },
                  { href: '/business/jigyou-mokuteki', label: '事業目的ジェネレーター', desc: '許認可に対応した事業目的を生成' },
                ].map((tool) => (
                  <Link key={tool.href} href={tool.href}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all group">
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
        {/* FAQ */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">よくある質問</h2>
          <div className="space-y-6">
            {[
              {
                q: '資本金はいくらが一般的ですか？',
                a: '中小企業庁の統計によると、新設法人の約7割が資本金300万円以下で設立しています。最も多いのは100万円前後です。ただし業種や事業規模によって最適額は大きく異なります。',
              },
              {
                q: '資本金と自己資金は同じですか？',
                a: '似ていますが異なります。資本金は登記上の金額で、設立後に事業経費として使っても登記上の資本金は変わりません。自己資金は実際に手元にあるお金です。融資審査では「自己資金＝実際に口座にある金額」で判断されます。',
              },
              {
                q: '資本金を払い込んだ後、すぐに使ってもいい？',
                a: 'はい、設立登記完了後は資本金を事業資金として自由に使えます。資本金は「会社に入れたお金」であり、必ずしも口座に残しておく必要はありません。ただし融資申請前は口座残高を多くしておくほうが有利です。',
              },
              {
                q: '合同会社（GK）と株式会社（KK）で資本金額は変えるべき？',
                a: '会社形態による資本金の最低額に違いはありません（どちらも1円から）。ただし合同会社は設立費用が安い分、資本金に多く回せるメリットがあります。信用力が重要なら株式会社で資本金を多めに、コスト重視なら合同会社で資本金を適正額にするのが合理的です。',
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
