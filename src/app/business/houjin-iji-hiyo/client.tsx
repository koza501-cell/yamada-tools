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
  Wallet: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
  ),
  TrendingDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
  ),
};

// ============================================================
// Types
// ============================================================
interface CostItem {
  category: string;
  label: string;
  monthly: number;
  yearly: number;
  note: string;
  isRequired: boolean; // 赤字でもかかるか
}

interface CalcResult {
  items: CostItem[];
  totalMonthly: number;
  totalYearly: number;
  requiredMonthly: number;
  requiredYearly: number;
  optionalMonthly: number;
  optionalYearly: number;
}

// ============================================================
// Helpers
// ============================================================
function formatYen(n: number): string {
  return '\u00a5' + n.toLocaleString('ja-JP');
}

// 法人住民税均等割 lookup
function getKintouwari(shihonkin: number, employees: number): number {
  // 都道府県民税 (standard rate)
  let todofuken = 20000;
  if (shihonkin > 10000000) todofuken = 50000;
  if (shihonkin > 100000000) todofuken = 130000;
  if (shihonkin > 1000000000) todofuken = 540000;
  if (shihonkin > 5000000000) todofuken = 800000;

  // 市町村民税
  let shichoson = 50000;
  if (shihonkin > 10000000 && employees <= 50) shichoson = 130000;
  if (shihonkin > 10000000 && employees > 50) shichoson = 150000;
  if (shihonkin > 100000000 && employees <= 50) shichoson = 160000;
  if (shihonkin > 100000000 && employees > 50) shichoson = 400000;
  if (shihonkin > 1000000000 && employees <= 50) shichoson = 410000;
  if (shihonkin > 1000000000 && employees > 50) shichoson = 1750000;
  if (shihonkin > 5000000000 && employees <= 50) shichoson = 410000;
  if (shihonkin > 5000000000 && employees > 50) shichoson = 3000000;

  return todofuken + shichoson;
}

// 税理士顧問料 estimate
function getZeirishiMonthly(annualRevenue: number): number {
  if (annualRevenue <= 5000000) return 15000;
  if (annualRevenue <= 10000000) return 20000;
  if (annualRevenue <= 30000000) return 30000;
  if (annualRevenue <= 50000000) return 40000;
  if (annualRevenue <= 100000000) return 50000;
  return 70000;
}

// 決算申告料 estimate (typically 4-6x monthly fee)
function getKessanFee(monthlyFee: number): number {
  return monthlyFee * 5;
}

// ============================================================
// Main Component
// ============================================================
export default function HoujinIjiHiyoClient() {
  const [mounted, setMounted] = useState(false);

  // Inputs
  const [shihonkin, setShihonkin] = useState<string>('1000000');
  const [yakuinHoshu, setYakuinHoshu] = useState<string>('300000');
  const [employeeCount, setEmployeeCount] = useState<string>('0');
  const [avgEmployeeSalary, setAvgEmployeeSalary] = useState<string>('250000');
  const [annualRevenue, setAnnualRevenue] = useState<string>('10000000');
  const [useZeirishi, setUseZeirishi] = useState<boolean>(true);
  const [useVirtualOffice, setUseVirtualOffice] = useState<boolean>(false);
  const [virtualOfficeCost, setVirtualOfficeCost] = useState<string>('5000');

  const [result, setResult] = useState<CalcResult | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCalculate = () => {
    const shihonkinNum = Number(shihonkin) || 0;
    const yakuinHoshuNum = Number(yakuinHoshu) || 0;
    const empCount = Number(employeeCount) || 0;
    const empSalary = Number(avgEmployeeSalary) || 0;
    const revenueNum = Number(annualRevenue) || 0;
    const vofficeCost = Number(virtualOfficeCost) || 0;

    const items: CostItem[] = [];

    // ── 1. 法人住民税均等割 ──
    const kintouwari = getKintouwari(shihonkinNum, empCount);
    items.push({
      category: '税金',
      label: '法人住民税 均等割',
      monthly: Math.round(kintouwari / 12),
      yearly: kintouwari,
      note: '赤字でも必ず発生。資本金・従業員数で変動。',
      isRequired: true,
    });

    // ── 2. 社会保険料（役員分・会社負担） ──
    const shahoRate = 0.1549; // 健康保険(約5%) + 介護保険(約0.9%) + 厚生年金(約9.15%) + 子ども子育て(約0.36%)
    const yakuinShaho = Math.round(yakuinHoshuNum * shahoRate);
    if (yakuinHoshuNum > 0) {
      items.push({
        category: '社会保険',
        label: '社会保険料（役員分・会社負担）',
        monthly: yakuinShaho,
        yearly: yakuinShaho * 12,
        note: `役員報酬${formatYen(yakuinHoshuNum)} × 約15.5%。健康保険+厚生年金+子ども子育て拠出金。`,
        isRequired: true,
      });
    }

    // ── 3. 社会保険料（従業員分・会社負担） ──
    if (empCount > 0 && empSalary > 0) {
      const empShaho = Math.round(empSalary * shahoRate * empCount);
      items.push({
        category: '社会保険',
        label: `社会保険料（従業員${empCount}名分・会社負担）`,
        monthly: empShaho,
        yearly: empShaho * 12,
        note: `平均月給${formatYen(empSalary)} × ${empCount}名 × 約15.5%`,
        isRequired: true,
      });

      // ── 4. 労働保険料 ──
      const roudouRate = 0.0095; // 労災0.3% + 雇用保険(会社負担0.65%) ≈ 0.95%
      const roudouMonthly = Math.round(empSalary * empCount * roudouRate);
      items.push({
        category: '社会保険',
        label: '労働保険料（労災＋雇用保険・会社負担）',
        monthly: roudouMonthly,
        yearly: roudouMonthly * 12,
        note: `従業員給与総額 × 約0.95%（業種により変動）`,
        isRequired: true,
      });
    }

    // ── 5. 税理士顧問料 ──
    if (useZeirishi) {
      const zeirishiMonthly = getZeirishiMonthly(revenueNum);
      const kessanFee = getKessanFee(zeirishiMonthly);
      items.push({
        category: '専門家',
        label: '税理士顧問料（月額）',
        monthly: zeirishiMonthly,
        yearly: zeirishiMonthly * 12,
        note: `年商${formatYen(revenueNum)}規模の相場。記帳代行込み。`,
        isRequired: false,
      });
      items.push({
        category: '専門家',
        label: '決算申告料（年1回）',
        monthly: Math.round(kessanFee / 12),
        yearly: kessanFee,
        note: `月額顧問料の約5か月分が相場`,
        isRequired: false,
      });
    }

    // ── 6. 会計ソフト ──
    const kaikeiSoft = 2680; // freee ミニマム月額
    items.push({
      category: '運営費',
      label: '会計ソフト（クラウド）',
      monthly: kaikeiSoft,
      yearly: kaikeiSoft * 12,
      note: 'freee・マネーフォワード等のスタータープラン相場',
      isRequired: true,
    });

    // ── 7. 法人銀行口座 ──
    items.push({
      category: '運営費',
      label: '法人銀行口座 維持費',
      monthly: 0,
      yearly: 0,
      note: '多くのネット銀行は無料（GMOあおぞら等）',
      isRequired: true,
    });

    // ── 8. バーチャルオフィス ──
    if (useVirtualOffice) {
      items.push({
        category: '運営費',
        label: 'バーチャルオフィス',
        monthly: vofficeCost,
        yearly: vofficeCost * 12,
        note: '住所利用・郵便転送サービス',
        isRequired: false,
      });
    }

    // ── 9. 登記簿謄本・印鑑証明 (年間概算) ──
    items.push({
      category: '運営費',
      label: '登記簿謄本・印鑑証明（年間概算）',
      monthly: Math.round(3600 / 12),
      yearly: 3600,
      note: '銀行・取引先提出用。年2〜3回取得想定。',
      isRequired: true,
    });

    // ── 10. 役員変更登記（KK only, 概算按分） ──
    // 2年or10年任期 → 按分は不要（ユーザーが混乱するため除外）

    // Calculate totals
    let totalMonthly = 0;
    let totalYearly = 0;
    let requiredMonthly = 0;
    let requiredYearly = 0;
    let optionalMonthly = 0;
    let optionalYearly = 0;

    for (const item of items) {
      totalMonthly += item.monthly;
      totalYearly += item.yearly;
      if (item.isRequired) {
        requiredMonthly += item.monthly;
        requiredYearly += item.yearly;
      } else {
        optionalMonthly += item.monthly;
        optionalYearly += item.yearly;
      }
    }

    setResult({ items, totalMonthly, totalYearly, requiredMonthly, requiredYearly, optionalMonthly, optionalYearly });
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
          <span className="text-gray-900 dark:text-gray-100">法人維持費シミュレーター</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          法人維持費シミュレーター
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          会社を維持するために<strong>毎月・毎年かかるランニングコスト</strong>を計算します。
          法人住民税・社会保険料・税理士費用など、赤字でも発生する固定費の全体像がわかります。
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* ============================================================ */}
        {/* INPUT FORM */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">

          {/* Row 1: 資本金 + 役員報酬 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                資本金
                <span className="ml-1 text-xs font-normal text-gray-400">（均等割の計算に使用）</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{'\u00a5'}</span>
                <input type="number" value={shihonkin} onChange={(e) => setShihonkin(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none" placeholder="1000000" min="1" />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {[{ l: '100万', v: '1000000' }, { l: '300万', v: '3000000' }, { l: '1,000万', v: '10000000' }].map((p) => (
                  <button key={p.v} type="button" onClick={() => setShihonkin(p.v)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${shihonkin === p.v ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'}`}>{p.l}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                役員報酬（月額）
                <span className="ml-1 text-xs font-normal text-gray-400">（社会保険料の計算に使用）</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{'\u00a5'}</span>
                <input type="number" value={yakuinHoshu} onChange={(e) => setYakuinHoshu(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none" placeholder="300000" min="0" />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {[{ l: '20万', v: '200000' }, { l: '30万', v: '300000' }, { l: '50万', v: '500000' }, { l: '80万', v: '800000' }].map((p) => (
                  <button key={p.v} type="button" onClick={() => setYakuinHoshu(p.v)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${yakuinHoshu === p.v ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'}`}>{p.l}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: 従業員 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                従業員数（役員除く）
              </label>
              <div className="relative">
                <input type="number" value={employeeCount} onChange={(e) => setEmployeeCount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none" placeholder="0" min="0" />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {[{ l: '0人', v: '0' }, { l: '1人', v: '1' }, { l: '3人', v: '3' }, { l: '5人', v: '5' }, { l: '10人', v: '10' }].map((p) => (
                  <button key={p.v} type="button" onClick={() => setEmployeeCount(p.v)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${employeeCount === p.v ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'}`}>{p.l}</button>
                ))}
              </div>
            </div>

            {(Number(employeeCount) || 0) > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  従業員の平均月給
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{'\u00a5'}</span>
                  <input type="number" value={avgEmployeeSalary} onChange={(e) => setAvgEmployeeSalary(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none" placeholder="250000" min="0" />
                </div>
              </div>
            )}
          </div>

          {/* Row 3: 年商 + toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                想定年商
                <span className="ml-1 text-xs font-normal text-gray-400">（税理士費用の見積もりに使用）</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{'\u00a5'}</span>
                <input type="number" value={annualRevenue} onChange={(e) => setAnnualRevenue(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none" placeholder="10000000" min="0" />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {[{ l: '500万', v: '5000000' }, { l: '1,000万', v: '10000000' }, { l: '3,000万', v: '30000000' }, { l: '1億', v: '100000000' }].map((p) => (
                  <button key={p.v} type="button" onClick={() => setAnnualRevenue(p.v)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${annualRevenue === p.v ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'}`}>{p.l}</button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">税理士に依頼</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setUseZeirishi(true)}
                    className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${useZeirishi ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                    依頼する
                  </button>
                  <button type="button" onClick={() => setUseZeirishi(false)}
                    className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${!useZeirishi ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                    自分で記帳
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">バーチャルオフィス</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setUseVirtualOffice(false)}
                    className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${!useVirtualOffice ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                    利用しない
                  </button>
                  <button type="button" onClick={() => setUseVirtualOffice(true)}
                    className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${useVirtualOffice ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                    利用する
                  </button>
                </div>
                {useVirtualOffice && (
                  <div className="mt-2 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{'\u00a5'}</span>
                    <input type="number" value={virtualOfficeCost} onChange={(e) => setVirtualOfficeCost(e.target.value)}
                      className="w-full pl-8 pr-16 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none text-sm" placeholder="5000" min="0" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">/月</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Calculate button */}
          <button type="button" onClick={handleCalculate}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
            <Icons.Calculator />
            年間維持費を計算する
          </button>
        </div>

        {/* ============================================================ */}
        {/* RESULTS */}
        {/* ============================================================ */}
        {result && (
          <div className="space-y-6 mb-12">

            {/* Summary header */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-xl">
              <div className="text-center mb-6">
                <p className="text-sm text-slate-300 mb-1">法人の年間維持費（合計）</p>
                <p className="text-4xl md:text-5xl font-black tracking-tight">{formatYen(result.totalYearly)}</p>
                <p className="text-slate-400 text-sm mt-2">月額換算: {formatYen(result.totalMonthly)}/月</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-300 mb-1 flex items-center justify-center gap-1">
                    <Icons.AlertTriangle />
                    赤字でも必ずかかる費用
                  </p>
                  <p className="text-xl font-bold text-red-300">{formatYen(result.requiredYearly)}/年</p>
                  <p className="text-xs text-slate-400 mt-1">{formatYen(result.requiredMonthly)}/月</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-300 mb-1 flex items-center justify-center gap-1">
                    <Icons.Wallet />
                    任意の費用
                  </p>
                  <p className="text-xl font-bold text-blue-300">{formatYen(result.optionalYearly)}/年</p>
                  <p className="text-xs text-slate-400 mt-1">{formatYen(result.optionalMonthly)}/月</p>
                </div>
              </div>
            </div>

            {/* Cost breakdown by category */}
            {['税金', '社会保険', '専門家', '運営費'].map((cat) => {
              const catItems = result.items.filter((i) => i.category === cat);
              if (catItems.length === 0) return null;
              const catYearly = catItems.reduce((sum, i) => sum + i.yearly, 0);

              const catColors: Record<string, { header: string; headerDark: string; border: string; borderDark: string }> = {
                '税金': { header: 'bg-red-50', headerDark: 'dark:bg-red-900/20', border: 'border-red-100', borderDark: 'dark:border-red-800' },
                '社会保険': { header: 'bg-blue-50', headerDark: 'dark:bg-blue-900/20', border: 'border-blue-100', borderDark: 'dark:border-blue-800' },
                '専門家': { header: 'bg-purple-50', headerDark: 'dark:bg-purple-900/20', border: 'border-purple-100', borderDark: 'dark:border-purple-800' },
                '運営費': { header: 'bg-gray-50', headerDark: 'dark:bg-gray-700/50', border: 'border-gray-100', borderDark: 'dark:border-gray-700' },
              };
              const c = catColors[cat] || catColors['運営費'];

              return (
                <div key={cat} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                  <div className={`${c.header} ${c.headerDark} px-6 py-3 border-b ${c.border} ${c.borderDark} flex items-center justify-between`}>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{cat}</h3>
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{formatYen(catYearly)}/年</span>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {catItems.map((item, i) => (
                      <div key={i} className="px-6 py-3 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                            {item.isRequired && (
                              <span className="text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded font-medium shrink-0">必須</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.note}</p>
                        </div>
                        <div className="ml-4 text-right shrink-0">
                          {item.yearly === 0 ? (
                            <span className="text-sm text-gray-400">無料</span>
                          ) : (
                            <>
                              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatYen(item.yearly)}/年</p>
                              <p className="text-xs text-gray-400">{formatYen(item.monthly)}/月</p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* "Your company costs ¥X per day to exist" */}
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 text-center">
              <p className="text-sm text-amber-800 dark:text-amber-300 mb-1 flex items-center justify-center gap-1.5">
                <Icons.TrendingDown />
                あなたの会社は1日あたり
              </p>
              <p className="text-3xl font-black text-amber-700 dark:text-amber-400">
                {formatYen(Math.round(result.totalYearly / 365))}
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">のコストが発生しています（売上がゼロでも）</p>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-3">ご注意</h4>
              <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <li>• 社会保険料率は協会けんぽ（東京都・2026年度概算）を使用しています。都道府県により異なります。</li>
                <li>• 税理士費用は一般的な相場であり、事務所により大きく異なります。</li>
                <li>• 法人税・法人事業税・消費税は利益に応じて別途発生しますが、本ツールでは「赤字でもかかる固定費」に焦点を当てています。</li>
                <li>• 役員報酬には個人の所得税・住民税・社会保険の本人負担分がかかります（本ツールでは会社側の負担のみ計算）。</li>
              </ul>
            </div>

            {/* Related tools */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">あわせて使えるツール</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { href: '/business/setsuritsu-hiyo', label: '会社設立費用シミュレーター', desc: '設立にかかる初期費用を計算' },
                  { href: '/business/kaisha-shindan', label: '会社形態診断ツール', desc: '最適な会社形態を8問で診断' },
                  { href: '/business/kesanki-sim', label: '決算期シミュレーター', desc: '最適な決算月を自動判定' },
                  { href: '/calculator/yakuin-hoshu', label: '役員報酬最適化', desc: '手取りを最大化する報酬額を計算' },
                  { href: '/calculator/houjinka-sim', label: '法人化シミュレーター', desc: '個人事業 vs 法人の税金比較' },
                  { href: '/calculator/shakaihoken', label: '社会保険計算機', desc: '健康保険・厚生年金の保険料を計算' },
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
        {/* PRE-COMPUTED EXAMPLES */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">法人の年間維持費パターン別一覧</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">パターン</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">年間維持費</th>
                  <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-semibold">月額換算</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  { p: '1人社長（役員報酬20万・税理士なし）', y: '約48万円', m: '約4.0万円' },
                  { p: '1人社長（役員報酬30万・税理士あり）', y: '約100万円', m: '約8.4万円' },
                  { p: '1人社長（役員報酬50万・税理士あり）', y: '約138万円', m: '約11.5万円' },
                  { p: '従業員3名（平均月給25万・税理士あり）', y: '約265万円', m: '約22.1万円' },
                  { p: '従業員10名（平均月給30万・税理士あり）', y: '約780万円', m: '約65.0万円' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-3 px-2 text-gray-900 dark:text-gray-100">{row.p}</td>
                    <td className="py-3 px-2 text-right font-bold text-pink-600 dark:text-pink-400">{row.y}</td>
                    <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-400">{row.m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">※ 資本金100万円・年商1,000万円（従業員ありは3,000万〜1億）・東京都の概算値。従業員パターンは役員報酬30〜50万円想定。法人税等の利益関連税は含みません。</p>
        </div>

        {/* ============================================================ */}
        {/* FAQ */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">よくある質問</h2>
          <div className="space-y-6">
            {[
              {
                q: '法人の維持費を最小限にするには？',
                a: '役員報酬を低く設定する（社会保険料が減少）、税理士を使わず自分で記帳・申告する、バーチャルオフィスを使う、の3点が主な節約方法です。ただし役員報酬が低すぎると社会保険のメリットを受けられず、税理士なしでは申告ミスのリスクがあります。',
              },
              {
                q: '法人住民税の均等割は免除できますか？',
                a: '原則として免除できません。休眠届を出した場合でも、都道府県・市区町村によって対応が異なります。完全に法人を閉じる（解散・清算）以外に均等割を止める方法はほぼありません。',
              },
              {
                q: '社会保険料は役員1人でも必ずかかりますか？',
                a: 'はい、法人は役員1名でも社会保険（健康保険＋厚生年金）への加入が義務です。ただし役員報酬が0円の場合は社会保険に加入できないため、別途国民健康保険・国民年金に加入する必要があります。',
              },
              {
                q: '個人事業主に戻すことはできますか？',
                a: 'はい、法人を解散・清算して個人事業に戻すことは可能です。ただし解散登記（登録免許税3万円）＋清算結了登記（2,000円）＋専門家費用（10〜30万円）がかかり、手続きに2〜3か月かかります。',
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
