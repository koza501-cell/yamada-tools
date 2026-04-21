"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";

const MAN = 10000;

const DEBT_TYPES = [
  "消費者金融（アコム・プロミス等）",
  "銀行カードローン",
  "クレジットカード キャッシング",
  "クレジットカード リボ払い",
  "住宅ローン",
  "自動車ローン",
  "奨学金",
  "その他",
];

const DEFAULT_RATES: Record<string, number> = {
  "消費者金融（アコム・プロミス等）": 18.0,
  "銀行カードローン": 14.0,
  "クレジットカード キャッシング": 18.0,
  "クレジットカード リボ払い": 15.0,
  "住宅ローン": 0.5,
  "自動車ローン": 3.0,
  "奨学金": 1.0,
  "その他": 15.0,
};

interface DebtItem {
  id: number;
  type: string;
  balanceMan: string;
  rate: string;
  monthlyPayment: string;
}

interface DebtResult {
  id: number;
  type: string;
  balance: number;
  rate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  completionMonths: number;
  impossible: boolean;
  negativeAmortization: boolean;
}

interface SimResult {
  debts: DebtResult[];
  totalBalance: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  completionMonths: number;
  withExtra: { totalInterest: number; completionMonths: number } | null;
  yearlySchedule: Array<{
    year: number;
    balance: number;
    yearlyPayment: number;
    yearlyInterest: number;
  }>;
}

function calcDebt(
  balance: number,
  annualRate: number,
  monthlyPayment: number
): Omit<DebtResult, "id" | "type" | "rate"> {
  const monthlyRate = annualRate / 12 / 100;
  const interest1 = balance * monthlyRate;

  if (monthlyPayment <= interest1) {
    return {
      balance,
      monthlyPayment,
      totalInterest: 0,
      totalPayment: 0,
      completionMonths: 601,
      impossible: true,
      negativeAmortization: true,
    };
  }

  let remaining = balance;
  let totalInterest = 0;
  let months = 0;

  while (remaining > 0 && months < 600) {
    const interest = remaining * monthlyRate;
    const principal = Math.min(monthlyPayment - interest, remaining);
    totalInterest += interest;
    remaining -= principal;
    months++;
  }

  if (remaining > 0) {
    return {
      balance,
      monthlyPayment,
      totalInterest: 0,
      totalPayment: 0,
      completionMonths: 601,
      impossible: true,
      negativeAmortization: false,
    };
  }

  return {
    balance,
    monthlyPayment,
    totalInterest,
    totalPayment: balance + totalInterest,
    completionMonths: months,
    impossible: false,
    negativeAmortization: false,
  };
}

function calcMultiDebt(
  debtItems: Array<{ balance: number; rate: number; monthlyPayment: number }>,
  extraPaymentYen: number,
  priority: "avalanche" | "snowball"
): {
  totalInterest: number;
  completionMonths: number;
  yearlySchedule: Array<{
    year: number;
    balance: number;
    yearlyPayment: number;
    yearlyInterest: number;
  }>;
} {
  const debts = debtItems.map((d, i) => ({ ...d, id: i, balance: d.balance }));
  let month = 0;
  let totalInterest = 0;
  const yearlyData: Map<number, { payment: number; interest: number }> = new Map();

  while (debts.some((d) => d.balance > 0) && month < 600) {
    month++;
    const year = Math.ceil(month / 12);

    const activeDebts = debts
      .filter((d) => d.balance > 0)
      .sort((a, b) =>
        priority === "avalanche" ? b.rate - a.rate : a.balance - b.balance
      );

    let leftoverPayment = extraPaymentYen;
    let monthPayment = 0;
    let monthInterest = 0;

    for (const d of debts) {
      if (d.balance <= 0) continue;
      const monthlyRate = d.rate / 12 / 100;
      const interest = d.balance * monthlyRate;
      if (d.monthlyPayment <= interest) {
        d.balance += interest - d.monthlyPayment;
        totalInterest += interest;
        monthInterest += interest;
        monthPayment += d.monthlyPayment;
        continue;
      }
      const principal = Math.min(d.monthlyPayment - interest, d.balance);
      d.balance -= principal;
      totalInterest += interest;
      monthInterest += interest;
      monthPayment += d.monthlyPayment;
    }

    for (const active of activeDebts) {
      const d = debts[active.id];
      if (d.balance <= 0 || leftoverPayment <= 0) break;
      const pay = Math.min(leftoverPayment, d.balance);
      d.balance -= pay;
      leftoverPayment -= pay;
      monthPayment += pay;
    }

    const yd = yearlyData.get(year) || { payment: 0, interest: 0 };
    yd.payment += monthPayment;
    yd.interest += monthInterest;
    yearlyData.set(year, yd);
  }

  let runningBalance = debtItems.reduce((s, d) => s + d.balance, 0);
  const totalYears = Math.ceil(month / 12);
  const yearlySchedule: Array<{
    year: number;
    balance: number;
    yearlyPayment: number;
    yearlyInterest: number;
  }> = [];

  for (let y = 1; y <= totalYears; y++) {
    const yd = yearlyData.get(y) || { payment: 0, interest: 0 };
    runningBalance -= yd.payment - yd.interest;
    yearlySchedule.push({
      year: y,
      balance: Math.max(0, runningBalance),
      yearlyPayment: yd.payment,
      yearlyInterest: yd.interest,
    });
  }

  return { totalInterest, completionMonths: month, yearlySchedule };
}

function formatMonths(months: number): string {
  if (months > 600) return "返済不能";
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m}ヶ月`;
  if (m === 0) return `${y}年`;
  return `${y}年${m}ヶ月`;
}

function completionDate(months: number): string {
  if (months > 600) return "返済不能";
  const d = new Date(2026, 2, 1);
  d.setMonth(d.getMonth() + months);
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

function formatYen(yen: number): string {
  if (yen >= MAN) {
    const man = Math.round(yen / MAN);
    return `${man.toLocaleString()}万円`;
  }
  return `${Math.round(yen).toLocaleString()}円`;
}

let nextId = 2;

export default function DebtRepaymentSimulator() {
  const [debts, setDebts] = useState<DebtItem[]>([
    {
      id: 1,
      type: "消費者金融（アコム・プロミス等）",
      balanceMan: "",
      rate: "18.0",
      monthlyPayment: "",
    },
  ]);
  const [extraPayment, setExtraPayment] = useState("");
  const [priority, setPriority] = useState<"avalanche" | "snowball">("avalanche");
  const [result, setResult] = useState<SimResult | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function addDebt() {
    if (debts.length >= 5) return;
    setDebts([
      ...debts,
      {
        id: nextId++,
        type: "消費者金融（アコム・プロミス等）",
        balanceMan: "",
        rate: "18.0",
        monthlyPayment: "",
      },
    ]);
  }

  function removeDebt(id: number) {
    if (debts.length <= 1) return;
    setDebts(debts.filter((d) => d.id !== id));
  }

  function updateDebt(id: number, field: keyof DebtItem, value: string) {
    setDebts(
      debts.map((d) => {
        if (d.id !== id) return d;
        if (field === "type") {
          return { ...d, type: value, rate: String(DEFAULT_RATES[value] ?? 15.0) };
        }
        return { ...d, [field]: value };
      })
    );
  }

  function handleCalculate() {
    const parsed = debts.map((d) => ({
      id: d.id,
      type: d.type,
      balance: parseFloat(d.balanceMan) * MAN,
      rate: parseFloat(d.rate),
      monthlyPayment: parseFloat(d.monthlyPayment),
    }));

    if (
      parsed.some(
        (d) =>
          isNaN(d.balance) ||
          isNaN(d.rate) ||
          isNaN(d.monthlyPayment) ||
          d.balance <= 0 ||
          d.rate <= 0 ||
          d.monthlyPayment <= 0
      )
    ) {
      alert("全ての借金情報を正しく入力してください。");
      return;
    }

    const debtResults: DebtResult[] = parsed.map((d) => ({
      id: d.id,
      type: d.type,
      rate: d.rate,
      ...calcDebt(d.balance, d.rate, d.monthlyPayment),
    }));

    const totalBalance = parsed.reduce((s, d) => s + d.balance, 0);
    const totalMonthlyPayment = parsed.reduce((s, d) => s + d.monthlyPayment, 0);

    const base = calcMultiDebt(
      parsed.map((d) => ({
        balance: d.balance,
        rate: d.rate,
        monthlyPayment: d.monthlyPayment,
      })),
      0,
      priority
    );

    const extraYen = parseFloat(extraPayment) || 0;
    let withExtra = null;
    if (extraYen > 0) {
      const withExtraCalc = calcMultiDebt(
        parsed.map((d) => ({
          balance: d.balance,
          rate: d.rate,
          monthlyPayment: d.monthlyPayment,
        })),
        extraYen,
        priority
      );
      withExtra = {
        totalInterest: withExtraCalc.totalInterest,
        completionMonths: withExtraCalc.completionMonths,
      };
    }

    setResult({
      debts: debtResults,
      totalBalance,
      totalMonthlyPayment,
      totalInterest: base.totalInterest,
      completionMonths: base.completionMonths,
      withExtra,
      yearlySchedule: base.yearlySchedule,
    });
  }

  function handleReset() {
    setDebts([
      {
        id: 1,
        type: "消費者金融（アコム・プロミス等）",
        balanceMan: "",
        rate: "18.0",
        monthlyPayment: "",
      },
    ]);
    setExtraPayment("");
    setPriority("avalanche");
    setResult(null);
  }

  const hasNegativeAmortization = result?.debts.some((d) => d.negativeAmortization) ?? false;
  const completionYears = result ? result.completionMonths / 12 : 0;

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

  const faqs = [
    {
      q: "毎月の最低返済額しか払えない場合どうなりますか？",
      a: "最低返済額が利息を下回っている場合、返済しても借金が減らず、むしろ増え続けます。これを「負のスパイラル」と呼びます。最低返済額は利息を上回るように設定されていることが多いですが、リボ払いや複数の借金を抱えている場合は特に注意が必要です。本ツールで「危険」判定が出た場合は専門家への相談を検討してください。",
    },
    {
      q: "借金の繰り上げ返済はどれくらい効果がありますか？",
      a: "非常に大きな効果があります。例えば残高100万円・年利18%・月3万円返済の場合、月1万円の繰り上げ返済を加えると返済期間が約1年10ヶ月短縮され、利息を約22万円節約できます。少額でも繰り上げ返済を続けることが重要です。",
    },
    {
      q: "複数の借金がある場合、どれから返せばいいですか？",
      a: "2つの方法があります。①アバランチ法：金利が高い借金から返済（総利息が最小になる）②スノーボール法：残高が少ない借金から返済（達成感を得やすく継続しやすい）。数学的には①が有利ですが、モチベーション維持のために②を選ぶ方も多いです。本ツールで両方の効果を比較できます。",
    },
    {
      q: "借金の時効はありますか？",
      a: "民事上の借金の消滅時効は原則5年です（2020年4月改正）。ただし時効が完成するには返済や債務承認がなく、かつ時効援用の意思表示が必要です。時効を主張すると信用情報に傷がつく可能性があります。安易に時効を期待せず、返済計画を立てることを優先しましょう。",
    },
    {
      q: "借金が返せない場合の選択肢は何がありますか？",
      a: "主に3つの債務整理の方法があります。①任意整理：弁護士・司法書士が債権者と交渉し金利をカット②個人再生：裁判所を通じて借金を最大1/5に減額③自己破産：裁判所に申立て、借金をゼロにする代わりに財産を処分。それぞれメリット・デメリットがあり、弁護士・司法書士への無料相談をお勧めします。",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <nav className="text-xs text-gray-500 mb-3">
          <Link href="/" className="hover:underline">
            ホーム
          </Link>
          <span className="mx-1">/</span>
          <Link href="/debt" className="hover:underline">
            借金・債務整理
          </Link>
          <span className="mx-1">/</span>
          <span>借金返済シミュレーター</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">借金返済シミュレーター</h1>
        <p className="text-sm text-gray-600">
          複数の借金の完済予定日・総利息・危険度を無料計算。完全中立・登録不要。2026年最新法定金利対応。
        </p>
      </div>

      {/* Section 1: Debt inputs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
        <h2 className="text-base font-bold text-gray-800 mb-4">借金の情報（最大5件）</h2>

        <div className="space-y-6">
          {debts.map((debt, idx) => (
            <div key={debt.id} className="border border-gray-200 rounded-lg p-4 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">借金 {idx + 1}</span>
                {debts.length > 1 && (
                  <button
                    onClick={() => removeDebt(debt.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    削除
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className={labelClass}>借入先の種類</label>
                  <select
                    value={debt.type}
                    onChange={(e) => updateDebt(debt.id, "type", e.target.value)}
                    className={inputClass}
                  >
                    {DEBT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>残高（万円）</label>
                  <input
                    type="number"
                    value={debt.balanceMan}
                    onChange={(e) => updateDebt(debt.id, "balanceMan", e.target.value)}
                    placeholder="例: 50"
                    className={inputClass}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className={labelClass}>金利（年利 %）</label>
                  <input
                    type="number"
                    value={debt.rate}
                    onChange={(e) => updateDebt(debt.id, "rate", e.target.value)}
                    placeholder="例: 18.0"
                    className={inputClass}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>月々の返済額（円）</label>
                  <input
                    type="number"
                    value={debt.monthlyPayment}
                    onChange={(e) => updateDebt(debt.id, "monthlyPayment", e.target.value)}
                    placeholder="例: 30000"
                    className={inputClass}
                    min="0"
                    step="100"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {debts.length < 5 && (
          <button
            onClick={addDebt}
            className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            ＋ 借金を追加（最大5件）
          </button>
        )}
      </div>

      {/* Section 2: Repayment settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
        <h2 className="text-base font-bold text-gray-800 mb-4">返済設定</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              繰り上げ返済（追加返済）円/月
              <span
                className="ml-1 text-gray-400 cursor-help"
                title="毎月の最低返済額に加えて追加で返済する金額"
              >
                ?
              </span>
            </label>
            <input
              type="number"
              value={extraPayment}
              onChange={(e) => setExtraPayment(e.target.value)}
              placeholder="例: 10000（0でも可）"
              className={inputClass}
              min="0"
              step="1000"
            />
          </div>
          <div>
            <label className={labelClass}>
              返済方法の優先順位
              <span
                className="ml-1 text-gray-400 cursor-help"
                title="複数の借金がある場合、どの借金から優先的に返済するか"
              >
                ?
              </span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setPriority("avalanche")}
                className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
                  priority === "avalanche"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                金利高い順
                <br />
                <span className="text-xs opacity-80">（アバランチ法）</span>
              </button>
              <button
                onClick={() => setPriority("snowball")}
                className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
                  priority === "snowball"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                残高少ない順
                <br />
                <span className="text-xs opacity-80">（スノーボール法）</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleCalculate}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-base transition-colors"
        >
          計算する
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
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">借金総額</div>
              <div className="text-xl font-bold text-gray-900">
                {formatYen(result.totalBalance)}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">完済予定</div>
              <div className="text-lg font-bold text-gray-900">
                {completionDate(result.completionMonths)}
              </div>
              <div className="text-xs text-gray-400">
                （{formatMonths(result.completionMonths)}後）
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">総利息支払額</div>
              <div className="text-xl font-bold text-red-600">
                {result.completionMonths > 600 ? "計算不能" : formatYen(result.totalInterest)}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">総支払額（元本+利息）</div>
              <div className="text-xl font-bold text-gray-900">
                {result.completionMonths > 600
                  ? "計算不能"
                  : formatYen(result.totalBalance + result.totalInterest)}
              </div>
            </div>
          </div>

          {/* Danger assessment */}
          {hasNegativeAmortization ? (
            <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4">
              <div className="font-bold text-red-700 text-sm mb-1">
                【危険】返済額が利息以下の借金があります！
              </div>
              <div className="text-xs text-red-600">
                {result.debts
                  .filter((d) => d.negativeAmortization)
                  .map((d) => d.type)
                  .join("、")}
                の返済額が利息以下のため、借金が毎月増えています。今すぐ返済額を増やすか専門家に相談してください。
              </div>
            </div>
          ) : completionYears > 10 ? (
            <div className="bg-orange-50 border border-orange-300 rounded-xl p-4">
              <div className="font-bold text-orange-700 text-sm mb-1">
                返済完了まで10年以上かかります
              </div>
              <div className="text-xs text-orange-600">
                繰り上げ返済や借り換えを検討しましょう。
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-300 rounded-xl p-4">
              <div className="font-bold text-green-700 text-sm">計画的に返済できています。</div>
            </div>
          )}

          {/* Per-debt breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">借金ごとの返済内訳</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-gray-600 font-medium">借入先</th>
                    <th className="px-3 py-2 text-right text-gray-600 font-medium">残高</th>
                    <th className="px-3 py-2 text-right text-gray-600 font-medium">金利</th>
                    <th className="px-3 py-2 text-right text-gray-600 font-medium">月返済額</th>
                    <th className="px-3 py-2 text-right text-gray-600 font-medium">完済予定</th>
                    <th className="px-3 py-2 text-right text-gray-600 font-medium">総利息</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.debts.map((d) => (
                    <tr key={d.id} className={d.negativeAmortization ? "bg-red-50" : ""}>
                      <td className="px-3 py-2 text-gray-700">
                        {d.type.replace("（アコム・プロミス等）", "")}
                        {d.negativeAmortization && (
                          <span className="ml-1 text-red-600 font-bold">⚠</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-700">
                        {formatYen(d.balance)}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-700">{d.rate}%</td>
                      <td className="px-3 py-2 text-right text-gray-700">
                        {formatYen(d.monthlyPayment)}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-700">
                        {d.impossible ? (
                          <span className="text-red-600 font-bold">返済不能</span>
                        ) : (
                          completionDate(d.completionMonths)
                        )}
                      </td>
                      <td className="px-3 py-2 text-right text-red-600">
                        {d.impossible ? "∞" : formatYen(d.totalInterest)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Extra payment effect */}
          {result.withExtra && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="text-sm font-bold text-blue-800 mb-2">繰り上げ返済効果</h3>
              <p className="text-sm text-blue-700">
                月<strong>{parseInt(extraPayment).toLocaleString()}円</strong>を追加返済すると：
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">完済が早くなる</div>
                  <div className="text-lg font-bold text-blue-700">
                    {formatMonths(result.completionMonths - result.withExtra.completionMonths)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">利息を節約できる</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatYen(result.totalInterest - result.withExtra.totalInterest)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Yearly schedule */}
          {result.yearlySchedule.length > 0 && result.completionMonths <= 600 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-800">返済スケジュール表（年単位）</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-600 font-medium">経過年</th>
                      <th className="px-3 py-2 text-right text-gray-600 font-medium">残高合計</th>
                      <th className="px-3 py-2 text-right text-gray-600 font-medium">
                        その年の返済額
                      </th>
                      <th className="px-3 py-2 text-right text-gray-600 font-medium">
                        その年の利息
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {result.yearlySchedule.map((row) => (
                      <tr key={row.year}>
                        <td className="px-3 py-2 text-gray-700">{row.year}年後</td>
                        <td className="px-3 py-2 text-right text-gray-700">
                          {formatYen(row.balance)}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-700">
                          {formatYen(row.yearlyPayment)}
                        </td>
                        <td className="px-3 py-2 text-right text-red-600">
                          {formatYen(row.yearlyInterest)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ad */}
      <div className="my-8">
        <AdUnit slot="debt-repayment-simulator" />
      </div>

      {/* SEO Content */}
      <div className="space-y-8">
        {/* 早見表 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">借金返済の目安早見表</h2>
          <p className="text-xs text-gray-500 mb-3">残高100万円の場合（金利18%）</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-gray-600 font-medium">月返済額</th>
                  <th className="px-3 py-2 text-right text-gray-600 font-medium">完済期間</th>
                  <th className="px-3 py-2 text-right text-gray-600 font-medium">総利息</th>
                  <th className="px-3 py-2 text-right text-gray-600 font-medium">総支払額</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-red-50">
                  <td className="px-3 py-2 text-gray-700">10,000円</td>
                  <td className="px-3 py-2 text-right text-red-600 font-bold">返済不能</td>
                  <td className="px-3 py-2 text-right text-red-600">∞</td>
                  <td className="px-3 py-2 text-right text-red-600">∞</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-gray-700">20,000円</td>
                  <td className="px-3 py-2 text-right text-gray-700">約8年2ヶ月</td>
                  <td className="px-3 py-2 text-right text-red-600">約96万円</td>
                  <td className="px-3 py-2 text-right text-gray-700">約196万円</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-gray-700">30,000円</td>
                  <td className="px-3 py-2 text-right text-gray-700">約4年4ヶ月</td>
                  <td className="px-3 py-2 text-right text-red-600">約56万円</td>
                  <td className="px-3 py-2 text-right text-gray-700">約156万円</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-gray-700">50,000円</td>
                  <td className="px-3 py-2 text-right text-gray-700">約2年4ヶ月</td>
                  <td className="px-3 py-2 text-right text-red-600">約39万円</td>
                  <td className="px-3 py-2 text-right text-gray-700">約139万円</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 基礎知識 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">借金返済の基礎知識</h2>
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>借金の返済で最も重要なのは「金利」と「月々の返済額」のバランスです。</p>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">なぜ借金はなかなか減らないのか</h3>
              <p>
                消費者金融やクレジットカードのキャッシングは、年利15〜18%という高い金利が設定されています。
                例えば残高100万円・年利18%の場合、1ヶ月の利息だけで約15,000円発生します。
                月10,000円しか返済しないと、利息すら払えず借金が増え続けます。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">リボ払いの危険性</h3>
              <p>
                クレジットカードのリボ払いは「毎月定額返済」という手軽さが特徴ですが、金利は15%前後と高く、
                最低返済額（月3,000〜10,000円程度）だけを払い続けると完済に数十年かかることがあります。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">法定金利（利息制限法）</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>借入額10万円未満: 年20%まで</li>
                <li>借入額10万〜100万円: 年18%まで</li>
                <li>借入額100万円以上: 年15%まで</li>
              </ul>
              <p className="mt-1 text-xs text-gray-500">
                これを超える金利は違法です。契約書の金利を必ず確認しましょう。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">借金を早く返すための3つのポイント</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>金利の高い借金から優先的に返済する（アバランチ法）</li>
                <li>毎月の返済額を少しでも増やす（繰り上げ返済）</li>
                <li>高金利の借金を低金利に借り換える</li>
              </ol>
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
                  <span>
                    Q{i + 1}. {faq.q}
                  </span>
                  <span className="text-gray-400 ml-2 flex-shrink-0">
                    {openFaq === i ? "▲" : "▼"}
                  </span>
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
              href="/debt/revolving-calculator"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div>
                <div className="text-sm font-medium text-gray-800">リボ払い恐怖計算機</div>
                <div className="text-xs text-gray-500">リボ払いの実態を可視化</div>
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
      
        {/* 関連ブログ記事 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-5 mt-4">
          <h2 className="font-bold text-gray-800 mb-3 text-sm">📝 関連ブログ記事</h2>
          
            <a
            href="/blog/shakkin-hensai-simulation-2026"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-700 group-hover:text-purple-800">【2026年最新】借金返済シミュレーション｜完済までの期間と総支払額を計算</p>
              <p className="text-xs text-gray-500 mt-0.5">詳しい解説・計算例 →</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
