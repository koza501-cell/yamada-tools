"use client";

import { useState, useEffect } from "react";
import { FAQSection } from "@/components/FAQSection";
import { KAIGO_KYUGYO_RATES, KAIGO_KYUGYO_VS_KYUKKA, HAYAMI_TABLE } from "@/data/kaigo-kyugyo";
import Link from "next/link";

const Icons = {
  Calc: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="8" x2="16" y1="10" y2="10"/><line x1="8" x2="12" y1="14" y2="14"/>
    </svg>
  ),
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Printer: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect width="12" height="8" x="6" y="14"/>
    </svg>
  ),
  Warning: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  ),
};

interface CalcResult {
  chingin6m: number;
  rawNichuaku: number;
  chinginNichuaku: number;
  isUpper: boolean;
  isLower: boolean;
  days: number;
  fullUnits: number;
  partialDays: number;
  perUnitBenefit: number;
  perPartialBenefit: number;
  totalBenefit: number;
  monthlyWage: number;
  hasChingin: boolean;
  payRatio: number;
  wageBase: number;
  chinginAdjusted: boolean;
}

const fmt = (n: number) => "\u00a5" + Math.round(n).toLocaleString("ja-JP");

const faqItems = [
  {
    question: "介護休業給付金の支給率は何%ですか?",
    answer: "休業開始時賃金日額の67%です。1支給単位(30日)あたりの上限は¥532,200(令和7年8月改定)で、毎年8月1日に改定されます。賃金日額の上限は¥17,740/日です。",
  },
  {
    question: "パートやアルバイトでも受給できますか?",
    answer: "はい。雇用保険に加入していて、休業開始日前2年間に賃金支払基礎日数11日以上の月が通算12か月以上あれば、雇用形態を問わず受給可能です。65歳以上の高年齢被保険者も対象です。",
  },
  {
    question: "93日を3回に分割できますか?",
    answer: "はい。通算93日の範囲内で最大3回まで分割取得できます。各回ごとに事業主への申し出(2週間前まで)と、休業終了後の給付金申請が必要です。同一対象家族について通算93日が絶対上限です。",
  },
  {
    question: "介護休業給付金に所得税はかかりますか?",
    answer: "かかりません。雇用保険法第12条で非課税と規定されています。所得税・住民税のいずれも課税されず、額面がほぼ手取りになります。なお、社会保険料(健康保険・厚生年金)は休業中も別途発生します。",
  },
  {
    question: "申請の期限はいつまでですか?",
    answer: "介護休業終了日の翌日から2ヶ月後の月末までです。例えば7月20日に休業終了なら9月30日が期限です。期限を過ぎると時効で請求権が消滅するため注意が必要です。",
  },
  {
    question: "退職を予定している場合でも受給できますか?",
    answer: "できません。介護休業給付金は休業終了後の職場復帰を前提とした制度です。退職予定者は支給対象外となります。",
  },
];

export default function KaigoKyugyoClient() {
  const [mounted, setMounted] = useState(false);
  const [inputMode, setInputMode] = useState<"monthly" | "total">("monthly");
  const [monthlyInput, setMonthlyInput] = useState("");
  const [total6mInput, setTotal6mInput] = useState("");
  const [daysInput, setDaysInput] = useState("");
  const [hasChingin, setHasChingin] = useState<"no" | "yes">("no");
  const [chinginInput, setChinginInput] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="min-h-screen" />;

  function handleCalculate() {
    const chingin6m = inputMode === "monthly"
      ? (Number(monthlyInput) || 0) * 6
      : (Number(total6mInput) || 0);
    const days = Math.max(1, Math.min(93, Math.round(Number(daysInput) || 0)));
    const monthlyWage = hasChingin === "yes" ? (Number(chinginInput) || 0) : 0;

    const rawNichuaku = chingin6m > 0 ? chingin6m / 180 : 0;
    const chinginNichuaku = Math.min(
      Math.max(rawNichuaku, KAIGO_KYUGYO_RATES.chingin_kagaku),
      KAIGO_KYUGYO_RATES.chingin_jougaku
    );
    const isUpper = rawNichuaku > KAIGO_KYUGYO_RATES.chingin_jougaku;
    const isLower = rawNichuaku > 0 && rawNichuaku < KAIGO_KYUGYO_RATES.chingin_kagaku;

    const fullUnits = Math.floor(days / 30);
    const partialDays = days % 30;
    const wageBase = chinginNichuaku * 30;
    const payRatio = wageBase > 0 && monthlyWage > 0 ? monthlyWage / wageBase : 0;
    const chinginAdjusted = hasChingin === "yes" && monthlyWage > 0;

    let perUnitBenefit = 0;
    let perPartialBenefit = 0;

    if (payRatio >= KAIGO_KYUGYO_RATES.chingin_chosei.full_pay_threshold) {
      perUnitBenefit = 0;
      perPartialBenefit = 0;
    } else if (payRatio >= KAIGO_KYUGYO_RATES.chingin_chosei.no_adjustment_threshold) {
      perUnitBenefit = fullUnits > 0 ? wageBase * 0.80 - monthlyWage : 0;
      perPartialBenefit = partialDays > 0
        ? (chinginNichuaku * partialDays * 0.80) - (monthlyWage * partialDays / 30)
        : 0;
    } else {
      perUnitBenefit = chinginNichuaku * 30 * KAIGO_KYUGYO_RATES.shikyu_ritsu;
      perPartialBenefit = partialDays > 0
        ? chinginNichuaku * partialDays * KAIGO_KYUGYO_RATES.shikyu_ritsu
        : 0;
    }

    perUnitBenefit = Math.max(0, perUnitBenefit);
    perPartialBenefit = Math.max(0, perPartialBenefit);
    const totalBenefit = fullUnits * perUnitBenefit + perPartialBenefit;

    setResult({
      chingin6m, rawNichuaku, chinginNichuaku, isUpper, isLower,
      days, fullUnits, partialDays, perUnitBenefit, perPartialBenefit,
      totalBenefit, monthlyWage, hasChingin: chinginAdjusted, payRatio, wageBase, chinginAdjusted,
    });
  }

  function handleCopy() {
    if (!result) return;
    const lines = [
      "【介護休業給付金 試算結果】",
      `取得日数: ${result.days}日`,
      `賃金日額: ${fmt(result.chinginNichuaku)}${result.isUpper ? " (上限適用)" : result.isLower ? " (下限適用)" : ""}`,
      `1支給単位 (30日) 給付額: ${fmt(result.perUnitBenefit)}`,
      result.partialDays > 0 ? `端数 (${result.partialDays}日) 給付額: ${fmt(result.perPartialBenefit)}` : null,
      `支給総額見込み: ${fmt(result.totalBenefit)}`,
      result.chinginAdjusted ? `賃金支払い調整あり (支払率 ${(result.payRatio * 100).toFixed(1)}%)` : null,
      "※概算です。正確な金額はハローワークにご確認ください。",
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="print:hidden text-sm text-gray-600 dark:text-gray-400 mb-4" aria-label="パンくずリスト">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">›</span>
        <Link href="/care" className="hover:underline">介護・保育</Link>
        <span className="mx-2">›</span>
        <span>介護休業給付金 計算機</span>
      </nav>

      {/* Badge + Title */}
      <div className="mb-4 print:hidden">
        <span className="inline-block rounded-full px-3 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200">
          働く家族向け
        </span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        介護休業給付金 計算機【令和8年度・67%×日数で即試算】
      </h1>
      <p className="print:hidden text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-8">
        月給を入れるだけで、介護休業中に雇用保険から支給される給付金額を瞬時に計算。
        基本式 (賃金日額×67%)、上限額¥532,200/月、賃金支払時の80%調整、93日分割パターン、非課税の額面手取りまで完全対応。
        令和7年4月改正・令和7年8月上限改定反映済み。
      </p>

      {/* ===== Section 1: 入力 ===== */}
      <section className="print:hidden mb-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold">1</span>
          給付金を試算する
        </h2>

        {/* Q1: 月給入力方法 */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            入力方法を選択 <span className="text-red-500">*</span>
          </p>
          <div className="flex gap-2 mb-3">
            {(["monthly", "total"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setInputMode(mode)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  inputMode === mode
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-purple-400"
                }`}
              >
                {mode === "monthly" ? "月平均支給額で入力" : "6ヶ月合計で入力"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 w-48 shrink-0">
              {inputMode === "monthly" ? "月平均支給額 (賞与除く)" : "休業前6ヶ月の総支給額 (賞与除く)"}
            </span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">¥</span>
              {inputMode === "monthly" ? (
                <input
                  type="number"
                  value={monthlyInput}
                  onChange={(e) => setMonthlyInput(e.target.value)}
                  placeholder="例: 300000"
                  min="0"
                  className="pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-44 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <input
                  type="number"
                  value={total6mInput}
                  onChange={(e) => setTotal6mInput(e.target.value)}
                  placeholder="例: 1800000"
                  min="0"
                  className="pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-44 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              )}
            </div>
          </div>
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">通勤手当・残業代は含む。賞与・ボーナスは除く。保険料控除前の額面で入力してください。</p>
        </div>

        {/* Q2: 取得日数 */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            介護休業を取得する日数 <span className="text-red-500">*</span>
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={daysInput}
              onChange={(e) => setDaysInput(e.target.value)}
              placeholder="例: 30"
              min="1"
              max="93"
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-28 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">日 (最大93日・3回分割可)</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {[30, 60, 93].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDaysInput(String(d))}
                className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                  daysInput === String(d)
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-400"
                }`}
              >
                {d}日
              </button>
            ))}
          </div>
        </div>

        {/* Q3: 賃金支払い */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            休業中に会社から賃金が支払われますか?
          </p>
          <div className="flex gap-3">
            {(["no", "yes"] as const).map((v) => (
              <label
                key={v}
                className={`flex items-center gap-2 cursor-pointer rounded-lg border px-4 py-2 text-sm transition-colors ${
                  hasChingin === v
                    ? "border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                    : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-300"
                }`}
              >
                <input
                  type="radio"
                  name="hasChingin"
                  value={v}
                  checked={hasChingin === v}
                  onChange={() => setHasChingin(v)}
                  className="sr-only"
                />
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${hasChingin === v ? "border-purple-600" : "border-gray-400"}`}>
                  {hasChingin === v && <span className="w-2 h-2 rounded-full bg-purple-600 block" />}
                </span>
                {v === "no" ? "いいえ (無給)" : "はい (一部支給あり)"}
              </label>
            ))}
          </div>
        </div>

        {/* Q4: 賃金支払い額 (conditional) */}
        {hasChingin === "yes" && (
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              休業中の月額賃金支払い額 <span className="text-red-500">*</span>
            </p>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">¥</span>
                <input
                  type="number"
                  value={chinginInput}
                  onChange={(e) => setChinginInput(e.target.value)}
                  placeholder="例: 80000"
                  min="0"
                  className="pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-44 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">/ 月</span>
            </div>
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              支払率が80%以上の場合は給付金が不支給になります。13〜80%未満は差額調整されます。
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleCalculate}
          className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 text-sm transition-colors"
        >
          <Icons.Calc />
          給付金を計算する
        </button>
      </section>

      {/* ===== Section 2: 結果 ===== */}
      {result && (
        <section className="mb-8 rounded-2xl border-2 border-purple-400 dark:border-purple-600 bg-purple-50 dark:bg-purple-950/40 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            給付金 試算結果
          </h2>

          <div className="mb-5 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">支給総額見込み ({result.days}日間)</p>
            <p className={`text-4xl font-bold ${result.totalBenefit > 0 ? "text-purple-700 dark:text-purple-300" : "text-gray-500"}`}>
              {fmt(result.totalBenefit)}
            </p>
            {result.totalBenefit === 0 && result.chinginAdjusted && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">賃金支払率が80%以上のため不支給です</p>
            )}
          </div>

          {/* 内訳 */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left">
              <tbody>
                <tr className="border-b border-purple-200 dark:border-purple-800">
                  <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">休業前6ヶ月総支給額</td>
                  <td className="py-1.5 font-medium text-gray-900 dark:text-gray-100">{fmt(result.chingin6m)}</td>
                </tr>
                <tr className="border-b border-purple-200 dark:border-purple-800">
                  <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    賃金日額
                    {result.isUpper && <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">(上限適用)</span>}
                    {result.isLower && <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">(下限適用)</span>}
                  </td>
                  <td className="py-1.5 font-medium text-gray-900 dark:text-gray-100">
                    {fmt(result.chinginNichuaku)}/日
                    {result.isUpper && <span className="ml-1 text-xs text-gray-500">(算出: {fmt(result.rawNichuaku)})</span>}
                  </td>
                </tr>
                <tr className="border-b border-purple-200 dark:border-purple-800">
                  <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">取得日数</td>
                  <td className="py-1.5 font-medium text-gray-900 dark:text-gray-100">{result.days}日</td>
                </tr>
                {result.fullUnits > 0 && (
                  <tr className="border-b border-purple-200 dark:border-purple-800">
                    <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">1支給単位 (30日) 給付額</td>
                    <td className="py-1.5 font-medium text-purple-700 dark:text-purple-300">{fmt(result.perUnitBenefit)}</td>
                  </tr>
                )}
                {result.partialDays > 0 && (
                  <tr className="border-b border-purple-200 dark:border-purple-800">
                    <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">端数 ({result.partialDays}日) 給付額</td>
                    <td className="py-1.5 font-medium text-purple-700 dark:text-purple-300">{fmt(result.perPartialBenefit)}</td>
                  </tr>
                )}
                <tr>
                  <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap font-semibold">支給総額見込み</td>
                  <td className="py-1.5 font-bold text-purple-700 dark:text-purple-300 text-lg">{fmt(result.totalBenefit)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 賃金支払い調整 */}
          {result.chinginAdjusted && result.wageBase > 0 && (
            <div className="mb-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-200 mb-1">賃金支払い調整の内訳</p>
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td className="py-0.5 text-amber-700 dark:text-amber-300 pr-3">賃金支払率</td>
                    <td className="py-0.5 font-medium text-amber-800 dark:text-amber-200">
                      {(result.payRatio * 100).toFixed(1)}%
                      {result.payRatio < 0.13 && " → 全額支給"}
                      {result.payRatio >= 0.13 && result.payRatio < 0.80 && " → 差額調整 (80%上限)"}
                      {result.payRatio >= 0.80 && " → 不支給"}
                    </td>
                  </tr>
                  {result.payRatio >= 0.13 && result.payRatio < 0.80 && (
                    <tr>
                      <td className="py-0.5 text-amber-700 dark:text-amber-300 pr-3">計算式 (30日単位)</td>
                      <td className="py-0.5 font-medium text-amber-800 dark:text-amber-200">
                        {fmt(result.wageBase)}×80% − {fmt(result.monthlyWage)} = {fmt(result.perUnitBenefit)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 非課税メリット */}
          <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 p-3 text-xs text-green-800 dark:text-green-200">
            <p className="font-semibold mb-1">💡 非課税のメリット</p>
            <p>給付金には所得税・住民税がかかりません。雇用保険料の控除もないため、額面がほぼ手取りになります（社会保険料は別途発生）。</p>
          </div>

          {/* 申請期限 */}
          <div className="mb-4 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 p-3 text-xs text-sky-800 dark:text-sky-200">
            <p className="font-semibold mb-1">📅 申請期限</p>
            <p>介護休業終了日の翌日から <strong>2ヶ月後の月末まで</strong> にハローワークへ申請。</p>
            <p className="mt-0.5 text-sky-600 dark:text-sky-400">例: 7月20日終了 → 9月30日まで</p>
          </div>

          {/* 落とし穴 */}
          <div className="mb-4 flex gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
            <span className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"><Icons.Warning /></span>
            <div className="text-xs text-amber-800 dark:text-amber-200">
              <p className="font-semibold mb-1">注意事項</p>
              <ul className="space-y-0.5">
                <li>・退職予定の方は支給対象外（職場復帰が前提）</li>
                <li>・同一家族について通算93日が上限（要介護度変更でも再受給不可）</li>
                <li>・1支給単位中の就業日数が10日超の月は不支給</li>
                <li>・社会保険料（健康保険・厚生年金）は休業中も別途発生</li>
              </ul>
            </div>
          </div>

          {/* コピー/印刷 */}
          <div className="print:hidden flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? <Icons.Check /> : <Icons.Copy />}
              {copied ? "コピーしました" : "結果をコピー"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Icons.Printer />
              印刷
            </button>
          </div>
        </section>
      )}

      {/* ===== Blog Callout ===== */}
      <div className="print:hidden mb-8 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 p-4">
        <p className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-1">📖 制度をもっと詳しく知りたい方へ</p>
        <p className="text-xs text-purple-700 dark:text-purple-300 mb-2">
          93日3回分割の活用戦略・賃金80%調整ルール・失業給付との競合・令和7年4月改正・落とし穴まで完全解説しています。
        </p>
        <Link href="/blog/kaigo-kyugyo-kyufukin-guide" className="text-xs text-purple-700 dark:text-purple-300 underline hover:text-purple-900 dark:hover:text-purple-100">
          介護休業給付金の完全ガイド【令和8年度版】を読む →
        </Link>
      </div>

      {/* ===== Section 3: 月給別早見表 ===== */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          令和8年度 介護休業給付金 月給別早見表
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">月給</th>
                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">賃金日額</th>
                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">1支給単位 (30日)</th>
                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">93日総額 (概算)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900">
              {HAYAMI_TABLE.map((row) => (
                <tr key={row.monthly} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-2 px-3 font-medium text-gray-900 dark:text-gray-100 text-xs">
                    {fmt(row.monthly)}
                    {"capped" in row && row.capped && (
                      <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">(上限)</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right text-gray-700 dark:text-gray-300 text-xs">{fmt(row.daily)}</td>
                  <td className="py-2 px-3 text-right font-medium text-purple-700 dark:text-purple-300 text-xs">{fmt(row.unit)}</td>
                  <td className="py-2 px-3 text-right font-semibold text-purple-700 dark:text-purple-300 text-xs">{fmt(row.total93)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          ※ 賃金日額上限 ¥17,740/日 (令和7年8月〜令和8年7月)。93日 = 30日×3単位 (最後は33日)。賞与除く。
        </p>
      </section>

      {/* ===== Section 4: 介護休業 vs 介護休暇 ===== */}
      <section className="mb-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          介護休業 vs 介護休暇 — 給付金がもらえるのは前者のみ
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">項目</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-purple-600 dark:text-purple-400">介護休業</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">介護休暇</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900">
              {[
                ["期間", KAIGO_KYUGYO_VS_KYUKKA.kyugyo.duration, KAIGO_KYUGYO_VS_KYUKKA.kyukka.duration],
                ["給付金", KAIGO_KYUGYO_VS_KYUKKA.kyugyo.benefit, KAIGO_KYUGYO_VS_KYUKKA.kyukka.benefit],
                ["用途", KAIGO_KYUGYO_VS_KYUKKA.kyugyo.purpose, KAIGO_KYUGYO_VS_KYUKKA.kyukka.purpose],
                ["申請", KAIGO_KYUGYO_VS_KYUKKA.kyugyo.application, KAIGO_KYUGYO_VS_KYUKKA.kyukka.application],
              ].map(([label, kyugyo, kyukka]) => (
                <tr key={label} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">{label}</td>
                  <td className="py-2 px-3 text-xs text-purple-700 dark:text-purple-300 font-medium">{kyugyo}</td>
                  <td className="py-2 px-3 text-xs text-gray-700 dark:text-gray-300">{kyukka}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          ※ 両者は別制度なので <strong>併用可能</strong>。日々の通院付き添いに介護休暇、まとまった介護期間に介護休業を組み合わせるのが最適です。
        </p>
      </section>

      {/* ===== Section 5: 計算式の解説 ===== */}
      <section className="mb-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">計算式の解説</h2>
        <div className="space-y-5 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">基本計算式</h3>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 font-mono text-xs">
              <p>賃金日額 = 休業前6ヶ月総支給額 ÷ 180</p>
              <p>賃金日額 = min(max(賃金日額, 下限¥2,869), 上限¥17,740)</p>
              <p>1支給単位給付額 = 賃金日額 × 30日 × 67%</p>
            </div>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              例: 月給30万円 → 6ヶ月総支給額¥1,800,000 ÷ 180 = 賃金日額¥10,000 → 1支給単位¥<strong>201,000</strong>
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">賃金支払い時の80%調整ルール</h3>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 font-mono text-xs">
              <p>支払率 = 月額賃金 ÷ (賃金日額×30)</p>
              <p>支払率 &lt; 13%  → 全額支給</p>
              <p>13% ≤ 支払率 &lt; 80% → 給付額 = (賃金日額×30×80%) − 月額賃金</p>
              <p>支払率 ≥ 80%  → 不支給</p>
            </div>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              例: 月給30万・賃金支払¥80,000 → 支払率26.7% → ¥300,000×80% − ¥80,000 = <strong>¥160,000</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="print:hidden mb-8">
        <FAQSection faq={faqItems} title="よくある質問" />
      </section>
    </main>
  );
}
