'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ExpertSupervision from '@/components/ExpertSupervision';

// ============================================================
// Inline SVG Icons (no lucide-react)
// ============================================================
const Icons = {
  Bank: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
  ),
  Handshake: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>
  ),
  Zap: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  Calculator: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
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
type LoanType = 'koko' | 'ginko' | 'hosho' | 'shinkin' | 'business' | 'custom';
type RepaymentMethod = 'ganri' | 'gankin'; // 元利均等 / 元金均等

interface LoanTypeConfig {
  label: string;
  sub: string;
  defaultRate: number;
}

const LOAN_TYPES: Record<LoanType, LoanTypeConfig> = {
  koko: { label: '日本政策金融公庫', sub: '創業融資・小規模事業者向け', defaultRate: 2.3 },
  ginko: { label: '銀行プロパー融資', sub: '実績のある事業者向け', defaultRate: 2.0 },
  hosho: { label: '信用保証協会保証付き', sub: '保証料が別途かかる', defaultRate: 2.5 },
  shinkin: { label: '信用金庫・信用組合', sub: '地域密着型の融資', defaultRate: 3.0 },
  business: { label: 'ビジネスローン（ノンバンク）', sub: '審査が早いが金利は高め', defaultRate: 9.0 },
  custom: { label: 'カスタム', sub: '金利を自由に入力', defaultRate: 5.0 },
};

interface CalculationResult {
  principal: number;
  annualRate: number;
  months: number;
  method: RepaymentMethod;
  totalPayment: number;
  totalInterest: number;
  firstMonthPayment: number;
  lastMonthPayment: number;
  averageMonthlyPayment: number;
}

// ============================================================
// Helpers
// ============================================================
function formatYen(n: number): string {
  return '¥' + Math.round(n).toLocaleString('ja-JP');
}

function calcGanriKintou(principal: number, monthlyRate: number, months: number) {
  // 元利均等返済
  if (monthlyRate === 0) {
    const payment = principal / months;
    return { payment, totalPayment: principal, totalInterest: 0 };
  }
  const payment =
    (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  const totalPayment = payment * months;
  const totalInterest = totalPayment - principal;
  return { payment, totalPayment, totalInterest };
}

function calcGankinKintou(principal: number, monthlyRate: number, months: number) {
  // 元金均等返済
  const principalPerMonth = principal / months;
  const firstPayment = principalPerMonth + principal * monthlyRate;
  const lastPayment = principalPerMonth + principalPerMonth * monthlyRate;
  // total interest = r * P * (n+1) / 2
  const totalInterest = monthlyRate * principal * ((months + 1) / 2);
  const totalPayment = principal + totalInterest;
  return { firstPayment, lastPayment, totalPayment, totalInterest };
}

// ============================================================
// Main Component
// ============================================================
export default function BusinessLoanSimulatorClient() {
  const [mounted, setMounted] = useState(false);

  const [loanType, setLoanType] = useState<LoanType>('koko');
  const [principal, setPrincipal] = useState<string>('5000000');
  const [annualRate, setAnnualRate] = useState<string>(String(LOAN_TYPES.koko.defaultRate));
  const [years, setYears] = useState<string>('5');
  const [method, setMethod] = useState<RepaymentMethod>('ganri');

  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoanTypeChange = (type: LoanType) => {
    setLoanType(type);
    setAnnualRate(String(LOAN_TYPES[type].defaultRate));
  };

  const handleCalculate = () => {
    const principalNum = Number(principal) || 0;
    const rateNum = Number(annualRate) || 0;
    const yearsNum = Number(years) || 0;
    const months = Math.round(yearsNum * 12);
    const monthlyRate = rateNum / 100 / 12;

    if (principalNum <= 0 || months <= 0) return;

    if (method === 'ganri') {
      const { payment, totalPayment, totalInterest } = calcGanriKintou(
        principalNum,
        monthlyRate,
        months
      );
      setResult({
        principal: principalNum,
        annualRate: rateNum,
        months,
        method,
        totalPayment,
        totalInterest,
        firstMonthPayment: payment,
        lastMonthPayment: payment,
        averageMonthlyPayment: payment,
      });
    } else {
      const { firstPayment, lastPayment, totalPayment, totalInterest } = calcGankinKintou(
        principalNum,
        monthlyRate,
        months
      );
      setResult({
        principal: principalNum,
        annualRate: rateNum,
        months,
        method,
        totalPayment,
        totalInterest,
        firstMonthPayment: firstPayment,
        lastMonthPayment: lastPayment,
        averageMonthlyPayment: totalPayment / months,
      });
    }
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
          <span className="text-gray-900 dark:text-gray-100">ビジネスローン返済シミュレーター</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          ビジネスローン返済シミュレーター
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          事業資金の<strong>融資額・金利・返済期間</strong>を入力するだけで、月々の返済額と総利息額を即計算します。
          元利均等・元金均等の両方式に対応し、融資元ごとの金利相場と比較できます。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* ============================================================ */}
        {/* INPUT FORM */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">

          {/* Loan Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              融資元を選択
              <span className="ml-2 text-xs font-normal text-gray-400">（選ぶと目安金利が自動入力されます）</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(Object.keys(LOAN_TYPES) as LoanType[]).map((key) => {
                const cfg = LOAN_TYPES[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleLoanTypeChange(key)}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      loanType === key
                        ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20 dark:border-pink-500 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    {loanType === key && (
                      <span className="absolute top-2 right-2 text-pink-500"><Icons.Check /></span>
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      <span className={loanType === key ? 'text-pink-500' : 'text-gray-400 dark:text-gray-500'}>
                        {key === 'business' ? <Icons.Zap /> : key === 'hosho' ? <Icons.Handshake /> : <Icons.Bank />}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">{cfg.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{cfg.sub}（目安 年{cfg.defaultRate}%）</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Principal */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              融資希望額
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
                placeholder="5000000"
                min="1"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { label: '100万', value: '1000000' },
                { label: '300万', value: '3000000' },
                { label: '500万', value: '5000000' },
                { label: '1,000万', value: '10000000' },
                { label: '3,000万', value: '30000000' },
              ].map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setPrincipal(preset.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    principal === preset.value
                      ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500'
                      : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rate + Years row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                年利
                <span className="ml-2 text-xs font-normal text-gray-400">（融資元選択で自動入力・編集可）</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  className="w-full pl-4 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
                  placeholder="2.3"
                  min="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">返済期間</label>
              <div className="relative">
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
                  placeholder="5"
                  min="1"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">年</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {['1', '3', '5', '7', '10'].map((y) => (
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
          </div>

          {/* Repayment method */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">返済方式</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMethod('ganri')}
                className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                  method === 'ganri'
                    ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                元利均等返済（毎月定額）
              </button>
              <button
                type="button"
                onClick={() => setMethod('gankin')}
                className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                  method === 'gankin'
                    ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                元金均等返済（総利息が少ない）
              </button>
            </div>
          </div>

          {/* Calculate button */}
          <button
            type="button"
            onClick={handleCalculate}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Icons.Calculator />
            返済額を計算する
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
                <p className="text-sm text-slate-300 mb-1">
                  {result.method === 'ganri' ? '毎月の返済額' : '返済初月の返済額'}
                </p>
                <p className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                  {formatYen(result.firstMonthPayment)}
                  <span className="text-lg font-normal text-slate-300">/月</span>
                </p>
                {result.method === 'gankin' && (
                  <p className="text-sm text-slate-300 mb-2">
                    最終月の返済額 {formatYen(result.lastMonthPayment)}/月
                  </p>
                )}
                <div className="flex items-center justify-center gap-4 text-sm text-slate-300 mt-4">
                  <span>総返済額 {formatYen(result.totalPayment)}</span>
                  <span className="text-slate-500">/</span>
                  <span>総利息 {formatYen(result.totalInterest)}</span>
                </div>
              </div>
            </div>

            {/* 内訳 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 border-b border-blue-100 dark:border-blue-800">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 text-sm">返済シミュレーション内訳</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <ResultRow label="融資額" value={result.principal} isBold />
                <ResultRow label="年利" value={result.annualRate} isRate />
                <ResultRow label="返済回数" value={result.months} isCount />
                <ResultRow label="総利息" value={result.totalInterest} />
                <ResultRow label="総返済額" value={result.totalPayment} isBold isHighlight />
              </div>
            </div>

            {/* 注意事項 */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3">ご注意</h4>
              <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <li>• 本シミュレーションは概算です。実際の金利は審査結果・担保有無・信用保証料等により変動します。</li>
                <li>• 信用保証協会保証付き融資の場合、別途保証料が発生します（本ツールでは金利に含めていません）。</li>
                <li>• 元金均等返済は返済初期の負担が大きくなるため、資金繰り計画に注意してください。</li>
                <li>• 正確な融資条件は各金融機関・日本政策金融公庫の窓口にご確認ください。</li>
              </ul>
            </div>

            {/* 関連ツール */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">あわせて使えるツール</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { href: '/business/setsuritsu-hiyo', label: '会社設立費用シミュレーター', desc: '設立にかかる総額を計算' },
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">融資元別 返済シミュレーション例（500万円・5年・元利均等）</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">融資元</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">目安金利</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">月々返済額</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">総利息</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {(Object.keys(LOAN_TYPES) as LoanType[])
                  .filter((k) => k !== 'custom')
                  .map((key) => {
                    const cfg = LOAN_TYPES[key];
                    const monthlyRate = cfg.defaultRate / 100 / 12;
                    const { payment, totalInterest } = calcGanriKintou(5000000, monthlyRate, 60);
                    return (
                      <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-2 text-gray-900 dark:text-gray-100">{cfg.label}</td>
                        <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">年{cfg.defaultRate}%</td>
                        <td className="py-3 px-2 text-right font-medium text-gray-900 dark:text-gray-100">{formatYen(payment)}</td>
                        <td className="py-3 px-2 text-right font-bold text-pink-600 dark:text-pink-400">{formatYen(totalInterest)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">※ 元利均等返済・保証料等別途費用は含みません。実際の適用金利は審査結果により異なります。</p>
        </div>

        {/* ============================================================ */}
        {/* FAQ */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          {/* 監修・出典 */}
          <div className="max-w-4xl mx-auto px-4 mb-8" style={{maxWidth: '100%'}}>
            <ExpertSupervision
              sources={[
                { name: '日本政策金融公庫 融資制度案内', url: 'https://www.jfc.go.jp/n/finance/' },
                { name: '全国信用保証協会連合会', url: 'https://www.zenshinhoren.or.jp/' },
              ]}
              lastUpdated="2026年5月"
              nextReview="金利動向の変化に応じて随時"
              trustNote="本ツールの計算結果は概算です。実際の融資条件は各金融機関にご確認ください。"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">よくある質問</h2>
          <div className="space-y-6">
            {[
              {
                q: '元利均等返済と元金均等返済の違いは？',
                a: '元利均等返済は毎月の返済額（元金+利息）が一定になる方式で、返済計画が立てやすいのが特徴です。元金均等返済は毎月の元金部分が一定で、返済初期の利息負担が大きく、返済が進むにつれて月々の返済額が減っていきます。総支払利息は元金均等のほうが少なくなります。',
              },
              {
                q: 'ビジネスローンの金利相場はどれくらいですか？',
                a: '融資元によって大きく異なります。日本政策金融公庫は年2%台、銀行のプロパー融資は年1〜3%台、信用保証協会の保証付き融資は年2%台後半が目安です。一方、ノンバンク系のビジネスローンは年8〜15%程度と高めに設定されていることが多く、審査スピードとのトレードオフになります。',
              },
              {
                q: '返済期間を長くすると総利息はどう変わりますか？',
                a: '返済期間を長くすると月々の返済額は下がりますが、総支払利息は増加します。資金繰りに余裕を持たせたい場合は期間を長めに、総コストを抑えたい場合は期間を短めに設定するのが基本的な考え方です。',
              },
              {
                q: '日本政策金融公庫の融資は個人事業主でも受けられますか？',
                a: 'はい、個人事業主・フリーランスでも新創業融資制度などを利用できます。無担保・無保証人で利用できる制度もあり、創業初期の資金調達先として広く使われています。',
              },
              {
                q: '保証料は返済額に含まれますか？',
                a: '本シミュレーターの計算には信用保証協会の保証料は含まれていません。保証付き融資を検討する場合は、金利に加えて保証料（融資額・保証期間に応じた別料金）も考慮する必要があります。',
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
  isRate = false,
  isCount = false,
}: {
  label: string;
  value: number;
  isBold?: boolean;
  isHighlight?: boolean;
  isRate?: boolean;
  isCount?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between px-6 py-3 ${isHighlight ? 'bg-emerald-50 dark:bg-emerald-900/10' : ''}`}>
      <span className={`text-sm ${isBold ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
        {label}
      </span>
      <span className={`text-sm ${isBold ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-900 dark:text-gray-100'} ${isHighlight ? 'text-emerald-700 dark:text-emerald-400 font-bold text-base' : ''}`}>
        {isRate ? `年${value}%` : isCount ? `${value}回` : formatYen(value)}
      </span>
    </div>
  );
}
