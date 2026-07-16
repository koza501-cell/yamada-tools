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
  Calculator: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
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
interface Tier {
  min: number;
  max: number;
  label: string;
  earlyDeductRatio: number | null; // null = tier4 (formula-based)
}

const TIERS: Tier[] = [
  { min: 0, max: 50, label: '最高解約返戻率 50%以下', earlyDeductRatio: 1.0 },
  { min: 50, max: 70, label: '最高解約返戻率 50%超70%以下', earlyDeductRatio: 0.6 },
  { min: 70, max: 85, label: '最高解約返戻率 70%超85%以下', earlyDeductRatio: 0.4 },
  { min: 85, max: 100, label: '最高解約返戻率 85%超', earlyDeductRatio: null },
];

function getTier(rate: number): Tier {
  if (rate <= 50) return TIERS[0];
  if (rate <= 70) return TIERS[1];
  if (rate <= 85) return TIERS[2];
  return TIERS[3];
}

interface CalculationResult {
  annualPremium: number;
  maxSurrenderRate: number;
  tierLabel: string;
  deductibleRatio: number;
  deductibleAmount: number;
  capitalizedAmount: number;
  assetPeriodYears: number;
  totalPremiumOverAssetPeriod: number;
  totalDeductibleOverAssetPeriod: number;
  totalCapitalizedOverAssetPeriod: number;
}

function formatYen(n: number): string {
  return '¥' + Math.round(n).toLocaleString('ja-JP');
}

function calcDeduction(annualPremium: number, rate: number, insurancePeriodYears: number, yearIndex: number) {
  const tier = getTier(rate);
  let deductibleRatio: number;

  if (tier.earlyDeductRatio !== null) {
    deductibleRatio = tier.earlyDeductRatio;
  } else {
    // Tier 4 (>85%): first 10 years capitalize rate*0.9, after that rate*0.7
    const capRatio = yearIndex <= 10 ? (rate / 100) * 0.9 : (rate / 100) * 0.7;
    deductibleRatio = 1 - capRatio;
  }

  const deductibleAmount = annualPremium * deductibleRatio;
  const capitalizedAmount = annualPremium - deductibleAmount;
  return { deductibleRatio, deductibleAmount, capitalizedAmount };
}

function estimateAssetPeriod(rate: number, insurancePeriodYears: number): number {
  const tier = getTier(rate);
  if (tier === TIERS[0]) return 0;
  if (tier === TIERS[3]) {
    // Rough estimate: asset period runs until around the point of max surrender value,
    // commonly mid-to-later part of the contract for high-return products.
    return Math.round(insurancePeriodYears * 0.6);
  }
  // Tiers 2/3: asset period is roughly the first 40% of the insurance period
  return Math.round(insurancePeriodYears * 0.4);
}

// ============================================================
// Main Component
// ============================================================
export default function HojinHokenSimulatorClient() {
  const [mounted, setMounted] = useState(false);

  const [annualPremium, setAnnualPremium] = useState<string>('2000000');
  const [maxSurrenderRate, setMaxSurrenderRate] = useState<string>('75');
  const [insurancePeriod, setInsurancePeriod] = useState<string>('30');

  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCalculate = () => {
    const premiumNum = Number(annualPremium) || 0;
    const rateNum = Number(maxSurrenderRate) || 0;
    const periodNum = Number(insurancePeriod) || 0;
    if (premiumNum <= 0 || rateNum < 0 || rateNum > 100 || periodNum <= 0) return;

    const tier = getTier(rateNum);
    const assetPeriodYears = estimateAssetPeriod(rateNum, periodNum);

    // Year-1 snapshot for headline figures
    const { deductibleRatio, deductibleAmount, capitalizedAmount } = calcDeduction(
      premiumNum,
      rateNum,
      periodNum,
      1
    );

    // Sum across the asset-capitalization period (approximation: ratio held constant per 10-yr band for tier4)
    let totalPremium = 0;
    let totalDeductible = 0;
    let totalCapitalized = 0;
    for (let y = 1; y <= Math.max(assetPeriodYears, 1); y++) {
      const yearCalc = calcDeduction(premiumNum, rateNum, periodNum, y);
      totalPremium += premiumNum;
      totalDeductible += yearCalc.deductibleAmount;
      totalCapitalized += yearCalc.capitalizedAmount;
    }

    setResult({
      annualPremium: premiumNum,
      maxSurrenderRate: rateNum,
      tierLabel: tier.label,
      deductibleRatio,
      deductibleAmount,
      capitalizedAmount,
      assetPeriodYears,
      totalPremiumOverAssetPeriod: totalPremium,
      totalDeductibleOverAssetPeriod: totalDeductible,
      totalCapitalizedOverAssetPeriod: totalCapitalized,
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
          <span className="text-gray-900 dark:text-gray-100">法人保険 損金算入シミュレーター</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          法人保険 損金算入シミュレーター
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          年間保険料と<strong>最高解約返戻率</strong>を入力するだけで、2019年税制改正後のルールに基づく
          <strong>損金算入額</strong>と<strong>資産計上額</strong>がすぐわかります。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* ============================================================ */}
        {/* INPUT FORM */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">

          {/* Annual premium */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">年間保険料</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
              <input
                type="number"
                value={annualPremium}
                onChange={(e) => setAnnualPremium(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
                placeholder="2000000"
                min="1"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { label: '50万', value: '500000' },
                { label: '100万', value: '1000000' },
                { label: '200万', value: '2000000' },
                { label: '500万', value: '5000000' },
              ].map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setAnnualPremium(preset.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    annualPremium === preset.value
                      ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500'
                      : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rate + period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                最高解約返戻率
                <span className="ml-2 text-xs font-normal text-gray-400">（保険設計書に記載）</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={maxSurrenderRate}
                  onChange={(e) => setMaxSurrenderRate(e.target.value)}
                  className="w-full pl-4 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
                  placeholder="75"
                  min="0"
                  max="100"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {['40', '60', '75', '90'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setMaxSurrenderRate(r)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      maxSurrenderRate === r
                        ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500'
                        : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">保険期間</label>
              <div className="relative">
                <input
                  type="number"
                  value={insurancePeriod}
                  onChange={(e) => setInsurancePeriod(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
                  placeholder="30"
                  min="1"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">年</span>
              </div>
            </div>
          </div>

          {/* Calculate button */}
          <button
            type="button"
            onClick={handleCalculate}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Icons.Calculator />
            損金算入額を計算する
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
                <p className="text-sm text-slate-300 mb-1">初年度の損金算入額（年間保険料のうち）</p>
                <p className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                  {formatYen(result.deductibleAmount)}
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-300 mt-4">
                  <span>資産計上額 {formatYen(result.capitalizedAmount)}</span>
                  <span className="text-slate-500">/</span>
                  <span>損金割合 {(result.deductibleRatio * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* 区分 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-2 border-pink-200 dark:border-pink-800 p-6 shadow-sm flex items-center gap-3">
              <span className="text-pink-500"><Icons.Shield /></span>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">適用区分</p>
                <p className="font-bold text-gray-900 dark:text-gray-100">{result.tierLabel}</p>
              </div>
            </div>

            {/* 内訳 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 border-b border-blue-100 dark:border-blue-800">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 text-sm">資産計上期間の累計（概算）</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <ResultRow label="資産計上期間（目安）" value={result.assetPeriodYears} isYears />
                <ResultRow label="期間中の保険料累計" value={result.totalPremiumOverAssetPeriod} isBold />
                <ResultRow label="期間中の損金算入累計" value={result.totalDeductibleOverAssetPeriod} />
                <ResultRow label="期間中の資産計上累計" value={result.totalCapitalizedOverAssetPeriod} isBold isHighlight />
              </div>
            </div>

            {/* 注意事項 */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3">ご注意</h4>
              <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <li>• 本シミュレーションは2019年7月8日以降契約の定期保険・第三分野保険の区分ルールに基づく概算です。資産計上期間・取崩期間の詳細な月割計算は保険商品ごとに異なります。</li>
                <li>• 最高解約返戻率85%超の区分は、実際には保険期間開始から最高解約返戻率となる期間終了までが資産計上期間となり、本ツールの推定値と異なる場合があります。</li>
                <li>• 2019年7月8日より前に契約した既契約には、改正前の旧ルール（全額損金・2分の1損金等）が適用されます。</li>
                <li>• 損金算入は課税の繰延べであり、解約時の返戻金は雑収入として課税対象になります。</li>
                <li>• 正確な会計処理・税務判断は税理士にご確認ください。</li>
              </ul>
            </div>

            {/* 関連ツール */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">あわせて使えるツール</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { href: '/business/kyosai-simulator', label: '小規模企業共済シミュレーター', desc: '節税効果・受取額を計算' },
                  { href: '/business/business-loan-simulator', label: 'ビジネスローン返済シミュレーター', desc: '融資の月々返済額を計算' },
                  { href: '/business/incorporation-simulator', label: '法人化シミュレーター', desc: '個人事業 vs 法人の税金比較' },
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">年間保険料200万円の場合の損金算入額（初年度目安）</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">最高解約返戻率</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">損金算入額</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">資産計上額</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {[30, 60, 75, 90].map((r) => {
                  const premium = 2000000;
                  const { deductibleAmount, capitalizedAmount } = calcDeduction(premium, r, 30, 1);
                  return (
                    <tr key={r} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-2 text-gray-900 dark:text-gray-100">{r}%</td>
                      <td className="py-3 px-2 text-right font-bold text-pink-600 dark:text-pink-400">{formatYen(deductibleAmount)}</td>
                      <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">{formatYen(capitalizedAmount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">※ 初年度・資産計上期間中の目安です。取崩期間に入ると資産計上額が損金算入に転じます。</p>
        </div>

        {/* ============================================================ */}
        {/* FAQ */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          {/* 監修・出典 */}
          <div className="max-w-4xl mx-auto px-4 mb-8" style={{maxWidth: '100%'}}>
            <ExpertSupervision
              sources={[
                { name: '国税庁 定期保険及び第三分野保険に関する取扱通達', url: 'https://www.nta.go.jp/' },
              ]}
              lastUpdated="2026年5月"
              nextReview="税制改正時に随時"
              trustNote="本ツールの計算結果は概算です。正確な会計処理・税務判断は税理士にご確認ください。"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">よくある質問</h2>
          <div className="space-y-6">
            {[
              {
                q: '最高解約返戻率とは何ですか？',
                a: '保険期間中に解約した場合の返戻金が支払保険料累計に対して最も高くなる割合のことです。保険会社が契約時に提示する設計書に記載されており、この数値によって税務上の損金算入割合が区分されます。',
              },
              {
                q: '2019年の税制改正で何が変わりましたか？',
                a: '2019年7月8日以降に契約した定期保険・第三分野保険は、最高解約返戻率に応じて4段階（50%以下・50%超70%以下・70%超85%以下・85%超）で損金算入割合が決まる新ルールが適用されるようになりました。従来の「全額損金」「2分の1損金」といった単純な区分は使えなくなっています。',
              },
              {
                q: '最高解約返戻率が85%を超える保険はどう扱われますか？',
                a: '契約当初10年間は「支払保険料×最高解約返戻率×90%」、11年目以降は「支払保険料×最高解約返戻率×70%」を資産計上し、残額を損金算入します。返戻率が高いほど資産計上割合が大きくなり、節税効果は限定的になります。',
              },
              {
                q: '資産計上した保険料はどうなりますか？',
                a: '資産計上期間が終了した後の一定期間（取崩期間）で均等に取り崩し、損金算入していきます。解約時に資産計上額と解約返戻金の差額は雑収入または雑損失として計上されます。',
              },
              {
                q: '法人保険は本当に節税になりますか？',
                a: '損金算入は「課税の繰り延べ」であり、恒久的な節税ではありません。解約時に受け取る返戻金は雑収入として課税対象になるため、出口戦略（退職金支給等で相殺するタイミング）まで含めて検討する必要があります。',
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
  isBold = false,
  isHighlight = false,
  isYears = false,
}: {
  label: string;
  value: number;
  isBold?: boolean;
  isHighlight?: boolean;
  isYears?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between px-6 py-3 ${isHighlight ? 'bg-emerald-50 dark:bg-emerald-900/10' : ''}`}>
      <span className={`text-sm ${isBold ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
        {label}
      </span>
      <span className={`text-sm ${isBold ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-900 dark:text-gray-100'} ${isHighlight ? 'text-emerald-700 dark:text-emerald-400 font-bold text-base' : ''}`}>
        {isYears ? `${value}年` : formatYen(value)}
      </span>
    </div>
  );
}
