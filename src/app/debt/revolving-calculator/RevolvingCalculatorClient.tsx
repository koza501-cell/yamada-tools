"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import Link from "next/link";

const MAN = 10000;

const RATE_OPTIONS = [
  { label: "12%", value: "12" },
  { label: "13%", value: "13" },
  { label: "14%", value: "14" },
  { label: "15%（最多）", value: "15" },
  { label: "16%", value: "16" },
  { label: "18%", value: "18" },
  { label: "その他（手入力）", value: "custom" },
];

interface ScenarioResult {
  completionMonths: number;
  totalInterest: number;
  totalPayment: number;
  impossible: boolean;
}

interface YearlyRow {
  label: string;
  balance: number;
  totalPaid: number;
  totalInterest: number;
}

interface CalcResult {
  balance: number;
  monthlyRate: number;
  monthlyInterest: number;
  principalRepaid: number;
  negativeAmortization: boolean;
  purchaseWarning: boolean;
  base: ScenarioResult;
  extra: ScenarioResult;
  lumpSum: { totalPayment: number };
  shockFacts: {
    interestPct: number;
    monthlyInterestPct: number;
    extraSavingsInterest: number;
    extraShortenMonths: number;
  };
  yearlySchedule: YearlyRow[];
}

function calcScenario(
  balance: number,
  monthlyRate: number,
  monthlyPayment: number,
  monthlyNewPurchase: number
): ScenarioResult {
  let remaining = balance;
  let totalInterest = 0;
  let months = 0;

  while (remaining > 0 && months < 600) {
    const interest = remaining * monthlyRate;
    const principal = monthlyPayment - interest;
    if (principal <= 0) {
      return { completionMonths: 601, totalInterest: 0, totalPayment: 0, impossible: true };
    }
    const actualPrincipal = Math.min(principal, remaining);
    totalInterest += interest;
    remaining -= actualPrincipal;
    remaining += monthlyNewPurchase;
    if (remaining < 0) remaining = 0;
    months++;
    if (months >= 600 && remaining > 0) {
      return { completionMonths: 601, totalInterest: 0, totalPayment: 0, impossible: true };
    }
  }

  return {
    completionMonths: months,
    totalInterest,
    totalPayment: balance + totalInterest,
    impossible: false,
  };
}

function buildYearlySchedule(
  balance: number,
  monthlyRate: number,
  monthlyPayment: number,
  completionMonths: number
): YearlyRow[] {
  const milestones = [0, 12, 36, 60, completionMonths];
  const unique = [...new Set(milestones)].filter((m) => m <= completionMonths).sort((a, b) => a - b);

  let remaining = balance;
  let totalPaid = 0;
  let totalInterest = 0;
  let currentMonth = 0;

  const rows: YearlyRow[] = [];

  for (const targetMonth of unique) {
    while (currentMonth < targetMonth && remaining > 0) {
      const interest = remaining * monthlyRate;
      const principal = Math.min(monthlyPayment - interest, remaining);
      totalInterest += interest;
      totalPaid += monthlyPayment;
      remaining -= principal;
      if (remaining < 0) remaining = 0;
      currentMonth++;
    }

    if (targetMonth === 0) {
      rows.push({ label: "現在", balance, totalPaid: 0, totalInterest: 0 });
    } else if (targetMonth === completionMonths) {
      rows.push({
        label: "完済",
        balance: 0,
        totalPaid: balance + totalInterest,
        totalInterest,
      });
    } else {
      const years = targetMonth / 12;
      rows.push({
        label: `${years}年後`,
        balance: Math.max(0, remaining),
        totalPaid,
        totalInterest,
      });
    }
  }

  return rows;
}

function calcRevolving(
  balanceMan: number,
  annualRate: number,
  monthlyPayment: number,
  monthlyNewPurchase: number,
  extraPaymentYen: number
): CalcResult {
  const balance = balanceMan * MAN;
  const monthlyRate = annualRate / 12 / 100;
  const monthlyInterest = balance * monthlyRate;
  const principalRepaid = monthlyPayment - monthlyInterest;
  const negativeAmortization = principalRepaid <= 0;
  const purchaseWarning = monthlyNewPurchase > 0 && principalRepaid - monthlyNewPurchase <= 0;

  const base = calcScenario(balance, monthlyRate, monthlyPayment, monthlyNewPurchase);
  const extra = calcScenario(balance, monthlyRate, monthlyPayment + extraPaymentYen, monthlyNewPurchase);

  const interestPct = base.impossible ? 0 : (base.totalInterest / base.totalPayment) * 100;
  const monthlyInterestPct = negativeAmortization ? 100 : (monthlyInterest / monthlyPayment) * 100;
  const extraSavingsInterest = base.impossible || extra.impossible ? 0 : base.totalInterest - extra.totalInterest;
  const extraShortenMonths = base.impossible || extra.impossible ? 0 : base.completionMonths - extra.completionMonths;

  const yearlySchedule = base.impossible
    ? []
    : buildYearlySchedule(balance, monthlyRate, monthlyPayment, base.completionMonths);

  return {
    balance,
    monthlyRate,
    monthlyInterest,
    principalRepaid,
    negativeAmortization,
    purchaseWarning,
    base,
    extra,
    lumpSum: { totalPayment: balance },
    shockFacts: { interestPct, monthlyInterestPct, extraSavingsInterest, extraShortenMonths },
    yearlySchedule,
  };
}

function formatMonths(months: number): string {
  if (months > 600) return "返済不能";
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m}ヶ月`;
  if (m === 0) return `${y}年`;
  return `${y}年${m}ヶ月`;
}

function formatYen(yen: number): string {
  if (yen >= MAN) {
    const man = Math.round(yen / MAN);
    return `${man.toLocaleString()}万円`;
  }
  return `${Math.round(yen).toLocaleString()}円`;
}

function formatYenPrecise(yen: number): string {
  return `${Math.round(yen).toLocaleString()}円`;
}

function calcFixedPayment(
  balanceMan: number,
  annualRate: number = 0.15
): { months: number; totalInterest: number; totalPayment: number } {
  const balance = balanceMan * MAN;
  const monthlyRate = annualRate / 12;
  const payment = Math.max(balance * 0.03, 3000);

  let remaining = balance;
  let totalInterest = 0;
  let months = 0;

  while (remaining > 0 && months < 1200) {
    const interest = remaining * monthlyRate;
    const principal = payment - interest;
    if (principal <= 0) break;
    totalInterest += interest;
    remaining -= principal;
    months++;
    if (remaining < 0) remaining = 0;
  }

  return {
    months,
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalInterest + balance),
  };
}

const HAYAMI_ROWS = [10, 30, 50, 100].map((man) => {
  const payment = Math.max(man * MAN * 0.03, 3000);
  const calc = calcFixedPayment(man);
  return {
    balanceLabel: `${man}万円`,
    paymentLabel: `${payment.toLocaleString()}円`,
    months: calc.months,
    totalInterest: calc.totalInterest,
    totalPayment: calc.totalPayment,
  };
});


export default function RevolvingCalculator() {
  const [balanceMan, setBalanceMan] = useState("");
  const [rateSelect, setRateSelect] = useState("15");
  const [customRate, setCustomRate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [monthlyNewPurchase, setMonthlyNewPurchase] = useState("0");
  const [extraPayment, setExtraPayment] = useState("5000");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const isCustomRate = rateSelect === "custom";
  const effectiveRate = isCustomRate ? parseFloat(customRate) : parseFloat(rateSelect);

  function handleCalculate() {
    const bMan = parseFloat(balanceMan);
    const mp = parseFloat(monthlyPayment);
    const mnp = parseFloat(monthlyNewPurchase) || 0;
    const ep = parseFloat(extraPayment) || 0;

    if (isNaN(bMan) || bMan <= 0) {
      alert("リボ残高を正しく入力してください。");
      return;
    }
    if (isNaN(effectiveRate) || effectiveRate <= 0 || effectiveRate > 100) {
      alert("金利を正しく入力してください。");
      return;
    }
    if (isNaN(mp) || mp <= 0) {
      alert("毎月の返済額を正しく入力してください。");
      return;
    }

    setResult(calcRevolving(bMan, effectiveRate, mp, mnp, ep));
  }

  function handleReset() {
    setBalanceMan("");
    setRateSelect("15");
    setCustomRate("");
    setMonthlyPayment("");
    setMonthlyNewPurchase("0");
    setExtraPayment("5000");
    setResult(null);
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

  const faqs = [
    {
      q: "リボ払いの金利は何%が多いですか？",
      a: "多くのクレジットカードのリボ払い金利は年12〜15%程度です。消費者金融系のカードでは年18%になることもあります。カードの明細書や会員サイトで確認できます。一般的な銀行ローン（年3〜7%）と比べると非常に高い金利です。",
    },
    {
      q: "リボ払いの毎月の返済額を増やすにはどうすればいいですか？",
      a: "カード会社のフリーダイヤルまたは会員サイトから変更できます。多くのカード会社では毎月1日〜10日ごろまでに連絡すれば翌月から反映されます。「繰り上げ返済」として追加で支払うことも可能です。返済額を増やすことがリボ地獄脱出の最速の方法です。",
    },
    {
      q: "リボ払いを完済したら信用情報に影響がありますか？",
      a: "正常な返済であれば信用情報には悪影響はありません。むしろ返済実績として記録されます。問題になるのは返済を滞納した場合です。リボ払いを完済することは信用情報の観点からも好ましいことです。",
    },
    {
      q: "リボ払いを一括返済する方法はありますか？",
      a: "はい、カード会社に連絡して「一括返済」を申し込めます。ATMやカード会社のアプリから残高全額を支払うことも可能です。一括返済後の翌月から利息が発生しなくなります。手元に資金がない場合は、低金利の借り換えローンを検討しましょう。",
    },
    {
      q: "リボ払いの利息に気づかなかった場合、過払い金はありますか？",
      a: "2010年6月18日以降の契約に基づくリボ払いは法定金利内（年15〜20%）で運用されているため、通常は過払い金は発生しません。過払い金が発生するのは主に2010年以前のグレーゾーン金利（年20〜29.2%）が適用されていた消費者金融との取引が対象です。",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <nav className="text-xs text-gray-500 mb-3">
          <Link href="/" className="hover:underline">ホーム</Link>
          <span className="mx-1">/</span>
          <Link href="/debt" className="hover:underline">借金・債務整理</Link>
          <span className="mx-1">/</span>
          <span>リボ払い恐怖計算機</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">リボ払い恐怖計算機</h1>
        <p className="text-sm text-gray-600">
          リボ払いの残高・金利・月返済額を入力するだけで、完済まで何年かかるか・総利息はいくらかを計算。一括払いとの比較・繰り上げ返済効果も表示。登録不要・完全無料。
        </p>
      </div>

      {/* Section 1: リボ払いの現状 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
        <h2 className="text-base font-bold text-gray-800 mb-4">リボ払いの現状</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>現在のリボ残高（万円）</label>
            <input
              type="number"
              value={balanceMan}
              onChange={(e) => setBalanceMan(e.target.value)}
              placeholder="例: 30"
              className={inputClass}
              min="0"
              step="0.1"
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>
              適用金利（年利）
              <span
                className="ml-1 text-gray-400 cursor-help"
                title="クレジットカードの明細や会員サイトで確認できます"
              >
                ?
              </span>
            </label>
            <select
              value={rateSelect}
              onChange={(e) => setRateSelect(e.target.value)}
              className={inputClass}
            >
              {RATE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {isCustomRate && (
              <input
                type="number"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                placeholder="例: 17.5"
                className={`${inputClass} mt-2`}
                min="0"
                max="100"
                step="0.1"
              />
            )}
          </div>

          <div>
            <label className={labelClass}>
              毎月の返済額（設定額）（円）
              <span
                className="ml-1 text-gray-400 cursor-help"
                title="カード会社に設定した毎月の支払額"
              >
                ?
              </span>
            </label>
            <input
              type="number"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(e.target.value)}
              placeholder="例: 10000"
              className={inputClass}
              min="0"
              step="100"
            />
          </div>

          <div>
            <label className={labelClass}>
              毎月の新規利用額（円）
              <span
                className="ml-1 text-gray-400 cursor-help"
                title="毎月リボでさらに買い物をしている場合に入力"
              >
                ?
              </span>
            </label>
            <input
              type="number"
              value={monthlyNewPurchase}
              onChange={(e) => setMonthlyNewPurchase(e.target.value)}
              placeholder="例: 0"
              className={inputClass}
              min="0"
              step="100"
            />
          </div>
        </div>
      </div>

      {/* Section 2: 比較設定 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
        <h2 className="text-base font-bold text-gray-800 mb-4">比較設定</h2>
        <div>
          <label className={labelClass}>
            追加返済シミュレーション（円/月）
            <span
              className="ml-1 text-gray-400 cursor-help"
              title="毎月この金額を追加で返済した場合の効果"
            >
              ?
            </span>
          </label>
          <input
            type="number"
            value={extraPayment}
            onChange={(e) => setExtraPayment(e.target.value)}
            placeholder="例: 5000"
            className={inputClass}
            min="0"
            step="1000"
          />
          <p className="text-xs text-gray-400 mt-1">
            毎月この金額を追加で返済した場合の効果を比較します。
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleCalculate}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-base transition-colors"
        >
          衝撃の現実を計算する
        </button>
        <button
          onClick={handleReset}
          className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl text-sm transition-colors"
        >
          リセット
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 mb-8">
          {/* Negative amortization warning */}
          {result.negativeAmortization && (
            <div className="bg-red-600 rounded-xl p-5 text-white">
              <div className="text-lg font-black mb-1">🚨 最大の恐怖</div>
              <div className="text-sm font-bold">
                毎月返済しても借金が増え続けています！
              </div>
              <div className="text-xs mt-1 opacity-90">
                月利息 {formatYenPrecise(result.monthlyInterest)} に対して返済額が不足しています。
                今すぐ返済額を増やすか、専門家に相談してください。
              </div>
            </div>
          )}

          {result.purchaseWarning && !result.negativeAmortization && (
            <div className="bg-orange-500 rounded-xl p-4 text-white">
              <div className="text-sm font-bold">⚠ 新規利用が続く限り借金は永遠に減りません</div>
              <div className="text-xs mt-1 opacity-90">
                毎月の新規利用額を0円にすることが完済への第一歩です。
              </div>
            </div>
          )}

          {/* Section 1: 衝撃の現実 */}
          <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6">
            <h2 className="text-base font-black text-red-700 mb-4">💀 衝撃の現実</h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="text-xs text-red-500 font-medium mb-1">完済まで</div>
                <div className="text-2xl font-black text-red-700 leading-tight">
                  {result.base.impossible ? "返済不能" : formatMonths(result.base.completionMonths)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-red-500 font-medium mb-1">総利息</div>
                <div className="text-2xl font-black text-red-700 leading-tight">
                  {result.base.impossible ? "∞" : formatYen(result.base.totalInterest)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-red-500 font-medium mb-1">総支払額</div>
                <div className="text-2xl font-black text-red-700 leading-tight">
                  {result.base.impossible ? "∞" : formatYen(result.base.totalPayment)}
                </div>
              </div>
            </div>
            {!result.base.impossible && (
              <div className="bg-red-100 rounded-lg p-3 text-sm text-red-800 text-center font-medium">
                元の借金 {formatYen(result.balance)} に対して、利息だけで{" "}
                <span className="font-black">{formatYen(result.base.totalInterest)}</span>{" "}
                払うことになります
              </div>
            )}
          </div>

          {/* Section 2: 毎月の内訳 */}
          {!result.negativeAmortization && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3">毎月の返済内訳</h3>
              <div className="mb-2">
                <div className="flex rounded-full overflow-hidden h-6">
                  <div
                    className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${result.shockFacts.monthlyInterestPct}%` }}
                  >
                    {result.shockFacts.monthlyInterestPct.toFixed(0)}%
                  </div>
                  <div
                    className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${100 - result.shockFacts.monthlyInterestPct}%` }}
                  >
                    {(100 - result.shockFacts.monthlyInterestPct).toFixed(0)}%
                  </div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span className="text-red-600 font-medium">
                    利息: {formatYenPrecise(result.monthlyInterest)}（{result.shockFacts.monthlyInterestPct.toFixed(1)}%）
                  </span>
                  <span className="text-green-600 font-medium">
                    元金返済: {formatYenPrecise(result.principalRepaid)}（{(100 - result.shockFacts.monthlyInterestPct).toFixed(1)}%）
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                毎月の返済額{formatYenPrecise(parseFloat(monthlyPayment))}のうち、
                <span className="text-red-600 font-bold">{formatYenPrecise(result.monthlyInterest)}（{result.shockFacts.monthlyInterestPct.toFixed(1)}%）</span>
                が利息として消えています
              </p>
            </div>
          )}

          {/* Section 3: 3パターン比較表 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">3パターン比較</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-gray-600 font-medium text-xs"></th>
                    <th className="px-3 py-2 text-center text-red-600 font-bold text-xs bg-red-50">
                      現状のまま
                    </th>
                    <th className="px-3 py-2 text-center text-blue-600 font-medium text-xs">
                      月{(parseFloat(extraPayment) || 0).toLocaleString()}円追加
                    </th>
                    <th className="px-3 py-2 text-center text-green-600 font-medium text-xs">
                      今すぐ一括
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-3 py-2 text-xs text-gray-600 font-medium">完済まで</td>
                    <td className="px-3 py-2 text-center font-bold text-red-700 bg-red-50 text-sm">
                      {result.base.impossible ? "返済不能" : formatMonths(result.base.completionMonths)}
                    </td>
                    <td className="px-3 py-2 text-center text-gray-700 text-sm">
                      {result.extra.impossible ? "返済不能" : formatMonths(result.extra.completionMonths)}
                    </td>
                    <td className="px-3 py-2 text-center text-green-700 font-bold text-sm">即時</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-xs text-gray-600 font-medium">総利息</td>
                    <td className="px-3 py-2 text-center font-bold text-red-700 bg-red-50 text-sm">
                      {result.base.impossible ? "∞" : formatYen(result.base.totalInterest)}
                    </td>
                    <td className="px-3 py-2 text-center text-gray-700 text-sm">
                      {result.extra.impossible ? "∞" : formatYen(result.extra.totalInterest)}
                    </td>
                    <td className="px-3 py-2 text-center text-green-700 font-bold text-sm">0円</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-xs text-gray-600 font-medium">総支払額</td>
                    <td className="px-3 py-2 text-center font-bold text-red-700 bg-red-50 text-sm">
                      {result.base.impossible ? "∞" : formatYen(result.base.totalPayment)}
                    </td>
                    <td className="px-3 py-2 text-center text-gray-700 text-sm">
                      {result.extra.impossible ? "∞" : formatYen(result.extra.totalPayment)}
                    </td>
                    <td className="px-3 py-2 text-center text-green-700 font-bold text-sm">
                      {formatYen(result.balance)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-xs text-gray-600 font-medium">節約額</td>
                    <td className="px-3 py-2 text-center text-gray-400 bg-red-50 text-sm">—</td>
                    <td className="px-3 py-2 text-center text-blue-600 font-medium text-sm">
                      {result.shockFacts.extraSavingsInterest > 0
                        ? `-${formatYen(result.shockFacts.extraSavingsInterest)}`
                        : "—"}
                    </td>
                    <td className="px-3 py-2 text-center text-green-700 font-bold text-sm">
                      {result.base.impossible ? "∞" : `-${formatYen(result.base.totalInterest)}`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: 年別残高推移表 */}
          {result.yearlySchedule.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-800">年別残高推移</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs text-gray-600 font-medium">経過</th>
                      <th className="px-3 py-2 text-right text-xs text-gray-600 font-medium">残高</th>
                      <th className="px-3 py-2 text-right text-xs text-gray-600 font-medium">累計返済額</th>
                      <th className="px-3 py-2 text-right text-xs text-gray-600 font-medium">累計利息</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {result.yearlySchedule.map((row, i) => (
                      <tr key={i} className={row.label === "完済" ? "bg-green-50" : ""}>
                        <td className="px-3 py-2 text-gray-700 font-medium text-xs">{row.label}</td>
                        <td className="px-3 py-2 text-right text-gray-700 text-xs">
                          {formatYen(row.balance)}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-700 text-xs">
                          {row.label === "現在" ? "—" : formatYen(row.totalPaid)}
                        </td>
                        <td className="px-3 py-2 text-right text-red-600 text-xs">
                          {row.label === "現在" ? "—" : formatYen(row.totalInterest)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 5: 衝撃ファクト */}
          {!result.base.impossible && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
              <h3 className="text-sm font-black text-orange-800 mb-3">😱 衝撃の事実</h3>
              <ul className="space-y-2 text-sm text-orange-900">
                <li>
                  ・あなたが払う総額の
                  <span className="font-black text-red-700 text-base mx-1">
                    {result.shockFacts.interestPct.toFixed(1)}%
                  </span>
                  が利息です
                </li>
                <li>
                  ・完済まであと
                  <span className="font-black text-red-700 text-base mx-1">
                    {formatMonths(result.base.completionMonths)}
                  </span>
                  かかります
                </li>
                <li>
                  ・毎月の返済額のうち
                  <span className="font-black text-red-700 text-base mx-1">
                    {result.shockFacts.monthlyInterestPct.toFixed(1)}%
                    （{formatYenPrecise(result.monthlyInterest)}）
                  </span>
                  が利息に消えています
                </li>
                <li>
                  ・一括で払った場合より合計
                  <span className="font-black text-red-700 text-base mx-1">
                    {formatYen(result.base.totalInterest)}
                  </span>
                  多く払います
                </li>
              </ul>
            </div>
          )}

          {/* アドバイスカード */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-blue-800 mb-3">💡 アドバイス</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              {result.shockFacts.extraShortenMonths > 0 && (
                <li>
                  ・繰り上げ返済が最も効果的です。月{(parseFloat(extraPayment) || 0).toLocaleString()}円追加するだけで完済が
                  <span className="font-bold">{formatMonths(result.shockFacts.extraShortenMonths)}</span>
                  早くなります
                </li>
              )}
              <li>・他の低金利ローンへの借り換えも検討してください</li>
              {!result.base.impossible && result.base.completionMonths > 60 && (
                <li className="font-bold text-red-700">
                  ・返済に5年以上かかる場合、専門家への相談を検討してください
                </li>
              )}
              <li>・カード会社に連絡すれば返済額を増額できます（翌月から反映）</li>
            </ul>
          </div>
        </div>
      )}

      {/* Ad */}
      <div className="my-8">
        <AdUnit slot="revolving-calculator" />
      </div>

      {/* SEO Content */}
      <div className="space-y-8">
        {/* 残高別恐怖の早見表 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-2">リボ払い 残高別 恐怖の早見表</h2>
          <p className="text-xs text-gray-500 mb-1">金利15%・最低返済額（残高の3%または3,000円）の場合</p>
          <p className="text-xs text-gray-400 mb-3">※毎月の返済額は初回設定額で固定した場合の試算です</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs text-gray-600 font-medium">リボ残高</th>
                  <th className="px-3 py-2 text-right text-xs text-gray-600 font-medium">月返済額目安</th>
                  <th className="px-3 py-2 text-right text-xs text-gray-600 font-medium">完済まで</th>
                  <th className="px-3 py-2 text-right text-xs text-gray-600 font-medium">総利息</th>
                  <th className="px-3 py-2 text-right text-xs text-gray-600 font-medium">総支払額</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {HAYAMI_ROWS.map((row) => (
                  <tr key={row.balanceLabel}>
                    <td className="px-3 py-2 text-gray-700">{row.balanceLabel}</td>
                    <td className="px-3 py-2 text-right text-gray-700">{row.paymentLabel}</td>
                    <td className="px-3 py-2 text-right text-red-600 font-medium">
                      約{formatMonths(row.months)}
                    </td>
                    <td className="px-3 py-2 text-right text-red-600">
                      約{Math.round(row.totalInterest / 10000)}万円
                    </td>
                    <td className="px-3 py-2 text-right text-gray-700">
                      約{Math.round(row.totalPayment / 10000)}万円
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 基礎知識と危険性 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">リボ払いの基礎知識と危険性</h2>
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              リボ払い（リボルビング払い）とは、毎月一定額を支払い続けるクレジットカードの支払い方式です。
              「毎月の支払いが少なくて楽」というメリットの裏に、大きな落とし穴が隠れています。
            </p>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">リボ払いが危険な理由</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>金利が高い（年15%前後）</li>
                <li>毎月の返済の大部分が利息に消える</li>
                <li>新規利用を続けると残高が減らない</li>
                <li>完済まで何年もかかる</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">リボ払いと分割払いの違い</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>分割払い：回数を決めて返済（例：6回払い）→ 完済が明確</li>
                <li>リボ払い：残高に対して毎月定額返済 → いつ終わるかわかりにくい</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">リボ払いから脱出するための方法</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>毎月の返済額を増額設定する（カード会社に連絡）</li>
                <li>ボーナス月に一括返済する</li>
                <li>低金利のカードローンへ借り換える</li>
                <li>一括返済できる金額を用意する</li>
              </ol>
              <p className="mt-2 text-xs text-gray-500">
                カード会社に電話すると返済額を増額できます。多くのカード会社では0円から最大一括返済まで自由に設定できます。
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">よくある質問</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-gray-800 flex justify-between items-center hover:bg-gray-50"
                >
                  <span>Q{i + 1}. {faq.q}</span>
                  <span className="text-gray-400 ml-2 flex-shrink-0">{openFaq === i ? "▲" : "▼"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 pt-1 text-sm text-gray-600 bg-gray-50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related tools */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">あわせて使えるツール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/debt/repayment-simulator"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div>
                <div className="text-sm font-medium text-gray-800">借金返済シミュレーター</div>
                <div className="text-xs text-gray-500">複数の借金の完済日を計算</div>
              </div>
            </Link>
            <Link
              href="/debt/loan-interest-calculator"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div>
                <div className="text-sm font-medium text-gray-800">カードローン利息計算機</div>
                <div className="text-xs text-gray-500">借入利息を簡単計算</div>
              </div>
            </Link>
            <Link
              href="/debt/debt-restructuring-checker"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div>
                <div className="text-sm font-medium text-gray-800">任意整理vs自己破産 比較ツール</div>
                <div className="text-xs text-gray-500">債務整理の選択を支援</div>
              </div>
            </Link>
            <Link
              href="/finance/jutaku-loan"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div>
                <div className="text-sm font-medium text-gray-800">住宅ローン計算機 Pro</div>
                <div className="text-xs text-gray-500">住宅ローンを徹底シミュレーション</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
