'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ExpertSupervision from '@/components/ExpertSupervision';

// ============================================================
// Inline SVG Icons (no lucide-react)
// ============================================================
const Icons = {
  Users2: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
  ),
  Users3: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
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
type FactoringType = 'nisha' | 'sansha';

interface TypeConfig {
  label: string;
  sub: string;
  defaultRate: number;
  rateRange: string;
}

const FACTORING_TYPES: Record<FactoringType, TypeConfig> = {
  nisha: { label: '2社間ファクタリング', sub: '売掛先に非通知・即日〜数日で資金化', defaultRate: 15, rateRange: '相場 10〜20%' },
  sansha: { label: '3社間ファクタリング', sub: '売掛先の承諾必要・手数料は低め', defaultRate: 5, rateRange: '相場 1〜9%' },
};

interface CalculationResult {
  invoiceAmount: number;
  feeRate: number;
  feeAmount: number;
  netPayout: number;
  days: number;
  annualizedRate: number;
  bankLoanEquivalentInterest: number;
  costDifference: number;
}

// ============================================================
// Helpers
// ============================================================
function formatYen(n: number): string {
  return '¥' + Math.round(n).toLocaleString('ja-JP');
}

const BANK_LOAN_REFERENCE_RATE = 2.5; // 参考：銀行融資の目安年率

function calcFactoring(invoiceAmount: number, feeRate: number, days: number) {
  const feeAmount = invoiceAmount * (feeRate / 100);
  const netPayout = invoiceAmount - feeAmount;
  const annualizedRate = feeRate * (365 / days);
  const bankLoanEquivalentInterest = invoiceAmount * (BANK_LOAN_REFERENCE_RATE / 100) * (days / 365);
  const costDifference = feeAmount - bankLoanEquivalentInterest;
  return { feeAmount, netPayout, annualizedRate, bankLoanEquivalentInterest, costDifference };
}

// ============================================================
// Main Component
// ============================================================
export default function FactoringSimulatorClient() {
  const [mounted, setMounted] = useState(false);

  const [factoringType, setFactoringType] = useState<FactoringType>('nisha');
  const [invoiceAmount, setInvoiceAmount] = useState<string>('3000000');
  const [feeRate, setFeeRate] = useState<string>(String(FACTORING_TYPES.nisha.defaultRate));
  const [days, setDays] = useState<string>('30');

  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTypeChange = (type: FactoringType) => {
    setFactoringType(type);
    setFeeRate(String(FACTORING_TYPES[type].defaultRate));
  };

  const handleCalculate = () => {
    const invoiceNum = Number(invoiceAmount) || 0;
    const rateNum = Number(feeRate) || 0;
    const daysNum = Number(days) || 0;
    if (invoiceNum <= 0 || daysNum <= 0) return;

    const { feeAmount, netPayout, annualizedRate, bankLoanEquivalentInterest, costDifference } =
      calcFactoring(invoiceNum, rateNum, daysNum);

    setResult({
      invoiceAmount: invoiceNum,
      feeRate: rateNum,
      feeAmount,
      netPayout,
      days: daysNum,
      annualizedRate,
      bankLoanEquivalentInterest,
      costDifference,
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
          <span className="text-gray-900 dark:text-gray-100">ファクタリング手数料シミュレーター</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          ファクタリング手数料シミュレーター
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          売掛金額・手数料率を入力するだけで、<strong>手取り額</strong>と<strong>実質年率換算コスト</strong>を即計算します。
          銀行融資との実質コスト比較にも使えます。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* ============================================================ */}
        {/* INPUT FORM */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">

          {/* Factoring type */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              ファクタリングの種類
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(Object.keys(FACTORING_TYPES) as FactoringType[]).map((key) => {
                const cfg = FACTORING_TYPES[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleTypeChange(key)}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      factoringType === key
                        ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20 dark:border-pink-500 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    {factoringType === key && (
                      <span className="absolute top-2 right-2 text-pink-500"><Icons.Check /></span>
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      <span className={factoringType === key ? 'text-pink-500' : 'text-gray-400 dark:text-gray-500'}>
                        {key === 'nisha' ? <Icons.Users2 /> : <Icons.Users3 />}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">{cfg.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{cfg.sub}（{cfg.rateRange}）</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Invoice amount */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">売掛金額</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
              <input
                type="number"
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
                placeholder="3000000"
                min="1"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { label: '50万', value: '500000' },
                { label: '100万', value: '1000000' },
                { label: '300万', value: '3000000' },
                { label: '500万', value: '5000000' },
                { label: '1,000万', value: '10000000' },
              ].map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setInvoiceAmount(preset.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    invoiceAmount === preset.value
                      ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500'
                      : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fee rate + days */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                手数料率
                <span className="ml-2 text-xs font-normal text-gray-400">（種類選択で自動入力・編集可）</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={feeRate}
                  onChange={(e) => setFeeRate(e.target.value)}
                  className="w-full pl-4 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
                  placeholder="15"
                  min="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">入金までの日数</label>
              <div className="relative">
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
                  placeholder="30"
                  min="1"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">日</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {['15', '30', '60', '90'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      days === d
                        ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500'
                        : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    {d}日
                  </button>
                ))}
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
            手取り額を計算する
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
                <p className="text-sm text-slate-300 mb-1">手取り額</p>
                <p className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                  {formatYen(result.netPayout)}
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-300 mt-4">
                  <span>手数料 {formatYen(result.feeAmount)}</span>
                  <span className="text-slate-500">/</span>
                  <span>実質年率換算 約{result.annualizedRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* 内訳 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 border-b border-blue-100 dark:border-blue-800">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 text-sm">ファクタリング内訳</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <ResultRow label="売掛金額" value={result.invoiceAmount} isBold />
                <ResultRow label="手数料率" value={result.feeRate} isRate />
                <ResultRow label="手数料額" value={result.feeAmount} />
                <ResultRow label="入金までの日数" value={result.days} isDays />
                <ResultRow label="手取り額" value={result.netPayout} isBold isHighlight />
              </div>
            </div>

            {/* 銀行融資との比較 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="bg-amber-50 dark:bg-amber-900/20 px-6 py-3 border-b border-amber-100 dark:border-amber-800">
                <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-1.5">
                  <Icons.AlertTriangle />
                  銀行融資（参考年率{BANK_LOAN_REFERENCE_RATE}%）との比較
                </h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <ResultRow label="同期間の銀行融資利息（参考）" value={result.bankLoanEquivalentInterest} note={`同額を年率${BANK_LOAN_REFERENCE_RATE}%で借りた場合の概算`} />
                <ResultRow label="ファクタリングの割高分" value={result.costDifference} isBold isHighlight={result.costDifference > 0} />
              </div>
            </div>

            {/* 注意事項 */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3">ご注意</h4>
              <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <li>• 本シミュレーションは概算です。実際の手数料は売掛先の信用力・利用実績・契約内容により変動します。</li>
                <li>• 実質年率換算はあくまで参考値で、ファクタリング会社が公式に年率表示するものではありません。</li>
                <li>• 償還請求権の有無、契約書の内容は必ず事前に確認してください。</li>
                <li>• 手数料が相場を大幅に超える契約や違法な取り立てには注意し、金融庁・日本貸金業協会の注意喚起も参考にしてください。</li>
              </ul>
            </div>

            {/* 関連ツール */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">あわせて使えるツール</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { href: '/business/business-loan-simulator', label: 'ビジネスローン返済シミュレーター', desc: '融資の月々返済額を計算' },
                  { href: '/business/kyosai-simulator', label: '小規模企業共済シミュレーター', desc: '節税効果・受取額を計算' },
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">売掛金300万円の場合の手取り額比較</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">種類・手数料率</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">手数料額</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">手取り額</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  { label: '2社間（10%）', rate: 10 },
                  { label: '2社間（15%）', rate: 15 },
                  { label: '2社間（20%）', rate: 20 },
                  { label: '3社間（3%）', rate: 3 },
                  { label: '3社間（9%）', rate: 9 },
                ].map((row) => {
                  const amount = 3000000;
                  const fee = amount * (row.rate / 100);
                  return (
                    <tr key={row.label} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-2 text-gray-900 dark:text-gray-100">{row.label}</td>
                      <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">{formatYen(fee)}</td>
                      <td className="py-3 px-2 text-right font-bold text-pink-600 dark:text-pink-400">{formatYen(amount - fee)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">※ 相場の目安です。実際の手数料は契約内容・審査結果により異なります。</p>
        </div>

        {/* ============================================================ */}
        {/* FAQ */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          {/* 監修・出典 */}
          <div className="max-w-4xl mx-auto px-4 mb-8" style={{maxWidth: '100%'}}>
            <ExpertSupervision
              sources={[
                { name: '金融庁 ファクタリングに関する注意喚起', url: 'https://www.fsa.go.jp/' },
                { name: '中小企業庁 資金調達ガイド', url: 'https://www.chusho.meti.go.jp/' },
              ]}
              lastUpdated="2026年5月"
              nextReview="市場動向の変化に応じて随時"
              trustNote="本ツールの計算結果は概算です。実際の契約条件は各ファクタリング会社にご確認ください。"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">よくある質問</h2>
          <div className="space-y-6">
            {[
              {
                q: '2社間ファクタリングと3社間ファクタリングの違いは？',
                a: '2社間ファクタリングは利用者とファクタリング会社の2者間で契約し、売掛先（取引先）に知られずに資金化できますが、手数料は10〜20%程度と高めです。3社間ファクタリングは売掛先の承諾を得て契約するため手数料は1〜9%程度と低くなりますが、取引先にファクタリング利用の事実が伝わります。',
              },
              {
                q: 'ファクタリングの手数料は実質年率に換算するとどれくらいですか？',
                a: '手数料率が同じでも、入金までの期間が短いほど年率換算コストは跳ね上がります。例えば手数料10%でも入金サイトが30日なら年率換算では100%を超えることがあり、銀行融資（年1〜3%程度）と比べて割高になりやすい点に注意が必要です。',
              },
              {
                q: 'ファクタリングは融資（借入）に該当しますか？',
                a: 'いいえ、ファクタリングは売掛債権の売買であり、法律上は融資（貸付）ではありません。そのため貸金業登録は不要とされ、負債として計上されない場合が多く、決算書の見た目を悪化させずに資金調達できる点がメリットです。',
              },
              {
                q: '個人事業主やフリーランスでも利用できますか？',
                a: 'はい、法人だけでなく個人事業主・フリーランスも利用可能なファクタリング会社が多くあります。ただし売掛先の信用力が審査の中心になるため、売掛先が個人（BtoC）の場合は利用できないケースもあります。',
              },
              {
                q: '悪質なファクタリング業者を見分けるポイントは？',
                a: '手数料が相場（2社間10〜20%、3社間1〜9%）を大幅に超える場合や、償還請求権（売掛先が倒産した場合に利用者が代わりに支払う義務）ありの契約を「償還請求権なし」と偽るケースには注意が必要です。契約書の内容を必ず確認し、金融庁・日本貸金業協会の注意喚起も参考にしてください。',
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
  isRate = false,
  isDays = false,
}: {
  label: string;
  value: number;
  note?: string;
  isBold?: boolean;
  isHighlight?: boolean;
  isRate?: boolean;
  isDays?: boolean;
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
          {isRate ? `${value}%` : isDays ? `${value}日` : formatYen(value)}
        </span>
      </div>
    </div>
  );
}
