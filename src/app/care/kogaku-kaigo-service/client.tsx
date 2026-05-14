"use client";

import { useState, useEffect } from "react";
import { FAQSection } from "@/components/FAQSection";
import {
  SHOTOKU_KUBUN,
  GASSAN_75,
  TAISHO_GAI,
  type ShotokuKubun,
  type GassanKubun,
} from "@/data/kogaku-kaigo";
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
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  ChevronUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  ),
};

interface MonthlyResult {
  shotokuKubun: ShotokuKubun;
  kosei: "1" | "2+";
  selfAmount: number;
  otherAmount: number;
  householdTotal: number;
  householdLimit: number;
  individualLimit: number | null;
  householdRefund: number;
  selfRefund: number;
  otherRefund: number;
}

interface GassanResult {
  kubun: GassanKubun;
  medicalAmount: number;
  careAmount: number;
  total: number;
  yearlyLimit: number;
  refund: number;
}

const fmt = (n: number) =>
  "¥" + Math.round(n).toLocaleString("ja-JP");

const faqItems = [
  {
    question: "高額介護サービス費はいつ振り込まれますか?",
    answer: "通常、利用月から3〜4ヶ月後に自治体から支給申請書が郵送されます。申請後さらに1〜2ヶ月で指定口座に振り込まれます。初回申請後は2回目以降が自動振込になります。",
  },
  {
    question: "食費・居住費は対象になりますか?",
    answer: "なりません。施設の食費・居住費、福祉用具購入費、住宅改修費、日常生活費は対象外です。低所得者の食費・居住費には別途「特定入所者介護サービス費(補足給付)」という制度があります。",
  },
  {
    question: "複数人世帯の按分計算とはどういう意味ですか?",
    answer: "世帯全員の合計が世帯上限を超えた超過額を、各個人の負担割合に応じて比例配分することです。夫45,000円・妻23,000円(合計68,000円)で世帯上限44,400円なら、還付23,600円を45:23の比で按分します。",
  },
  {
    question: "高額医療・高額介護合算療養費制度とは何ですか?",
    answer: "毎年8月1日〜翌年7月31日の医療費と介護費の合計に年間限度額を設けた制度です。超過額が500円以上の場合に還付されます。高額介護サービス費(月額)とは別の申請が必要です。",
  },
  {
    question: "申請の期限はいつまでですか?",
    answer: "介護サービスを利用した月の翌月1日から2年以内です。期限を過ぎると時効で請求権が消滅します。自治体から申請書が届いたら早めに申請してください。",
  },
];

export default function KogakuKaigoClient() {
  const [mounted, setMounted] = useState(false);

  // Monthly inputs
  const [shotokuKubun, setShotokuKubun] = useState<ShotokuKubun>("kazei_ippan");
  const [kosei, setKosei] = useState<"1" | "2+">("1");
  const [selfAmount, setSelfAmount] = useState("");
  const [otherAmount, setOtherAmount] = useState("");
  const [result, setResult] = useState<MonthlyResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Annual inputs
  const [showGassan, setShowGassan] = useState(false);
  const [gassanKubun, setGassanKubun] = useState<GassanKubun>("teisotokuII");
  const [medicalAmount, setMedicalAmount] = useState("");
  const [careYearAmount, setCareYearAmount] = useState("");
  const [gassanResult, setGassanResult] = useState<GassanResult | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen" />;

  function handleCalculate() {
    const rule = SHOTOKU_KUBUN[shotokuKubun];
    const self = Number(selfAmount) || 0;
    const other = kosei === "2+" ? (Number(otherAmount) || 0) : 0;
    const householdTotal = self + other;

    let householdRefund = 0;
    let selfRefund = 0;
    let otherRefund = 0;

    if (kosei === "1") {
      const effectiveLimit =
        rule.individual_limit !== null ? rule.individual_limit : rule.household_limit;
      householdRefund = Math.max(0, self - effectiveLimit);
      selfRefund = householdRefund;
      otherRefund = 0;
    } else {
      householdRefund = Math.max(0, householdTotal - rule.household_limit);
      if (householdTotal > 0) {
        selfRefund = householdRefund * (self / householdTotal);
        otherRefund = householdRefund * (other / householdTotal);
      }
    }

    setResult({
      shotokuKubun,
      kosei,
      selfAmount: self,
      otherAmount: other,
      householdTotal,
      householdLimit: rule.household_limit,
      individualLimit: rule.individual_limit,
      householdRefund,
      selfRefund,
      otherRefund,
    });
  }

  function handleGassanCalculate() {
    const rule = GASSAN_75[gassanKubun];
    const medical = Number(medicalAmount) || 0;
    const care = Number(careYearAmount) || 0;
    const total = medical + care;
    const refund = Math.max(0, total - rule.yearly_limit);

    setGassanResult({
      kubun: gassanKubun,
      medicalAmount: medical,
      careAmount: care,
      total,
      yearlyLimit: rule.yearly_limit,
      refund,
    });
  }

  function handleCopy() {
    if (!result) return;
    const rule = SHOTOKU_KUBUN[result.shotokuKubun];
    const lines = [
      "【高額介護サービス費 試算結果】",
      `所得区分: ${rule.label}`,
      `世帯構成: ${result.kosei === "1" ? "1人利用" : "複数人利用"}`,
      `本人月額自己負担: ${fmt(result.selfAmount)}`,
      result.kosei === "2+" ? `その他世帯員合計: ${fmt(result.otherAmount)}` : null,
      result.kosei === "2+" ? `世帯合計: ${fmt(result.householdTotal)}` : null,
      `世帯上限: ${fmt(result.householdLimit)}`,
      result.individualLimit !== null ? `個人上限: ${fmt(result.individualLimit)}` : null,
      `還付見込み額 (本人): ${fmt(result.selfRefund)}`,
      result.kosei === "2+" ? `還付見込み額 (その他): ${fmt(result.otherRefund)}` : null,
      result.kosei === "2+" ? `世帯還付合計: ${fmt(result.householdRefund)}` : null,
      "※概算です。正確な金額は市区町村窓口にご確認ください。",
    ]
      .filter(Boolean)
      .join("\n");
    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const shotokuKeys = Object.keys(SHOTOKU_KUBUN) as ShotokuKubun[];
  const gassanKeys = Object.keys(GASSAN_75) as GassanKubun[];

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="print:hidden text-sm text-gray-600 dark:text-gray-400 mb-4" aria-label="パンくずリスト">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">›</span>
        <Link href="/care" className="hover:underline">介護・保育</Link>
        <span className="mx-2">›</span>
        <span>高額介護サービス費 計算機</span>
      </nav>

      {/* Badge + Title */}
      <div className="mb-4 print:hidden">
        <span className="inline-block rounded-full px-3 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200">
          介護家族向け
        </span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        高額介護サービス費 計算機【令和8年度・払い戻し額を即試算】
      </h1>
      <p className="print:hidden text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-8">
        月額の介護保険サービス自己負担額を入力するだけで、所得区分別の負担上限と還付見込み額を瞬時に計算。
        6段階所得区分・個人/世帯計算・複数利用者の按分対応。高額医療・高額介護合算（年間）も追加試算可能。
      </p>

      {/* ===== Section 1: 月額入力 ===== */}
      <section className="print:hidden mb-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold">1</span>
          月額自己負担額から試算する
        </h2>

        {/* Q1: 所得区分 */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            所得区分を選択 <span className="text-red-500">*</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {shotokuKeys.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setShotokuKubun(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  shotokuKubun === key
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-sky-400"
                }`}
              >
                {SHOTOKU_KUBUN[key].label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {SHOTOKU_KUBUN[shotokuKubun].description}
          </p>
          <p className="mt-1 text-xs text-sky-700 dark:text-sky-300 font-medium">
            適用上限: {SHOTOKU_KUBUN[shotokuKubun].note}
          </p>
        </div>

        {/* Q2: 世帯構成 */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            世帯構成 <span className="text-red-500">*</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {(["1", "2+"] as const).map((v) => (
              <label
                key={v}
                className={`flex items-center gap-2 cursor-pointer rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                  kosei === v
                    ? "border-sky-600 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300"
                    : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-sky-300"
                }`}
              >
                <input
                  type="radio"
                  name="kosei"
                  value={v}
                  checked={kosei === v}
                  onChange={() => setKosei(v)}
                  className="sr-only"
                />
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${kosei === v ? "border-sky-600" : "border-gray-400"}`}>
                  {kosei === v && <span className="w-2 h-2 rounded-full bg-sky-600 block" />}
                </span>
                {v === "1" ? "介護サービス利用者は1人（本人のみ）" : "介護サービス利用者は複数（世帯内2人以上）"}
              </label>
            ))}
          </div>
        </div>

        {/* Q3: 月額自己負担 */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            月額の介護保険 自己負担額 <span className="text-red-500">*</span>
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 w-40 shrink-0">
                {kosei === "2+" ? "本人の額" : "月額自己負担"}
              </span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">¥</span>
                <input
                  type="number"
                  value={selfAmount}
                  onChange={(e) => setSelfAmount(e.target.value)}
                  placeholder="例: 60000"
                  min="0"
                  className="pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-44 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
            {kosei === "2+" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-40 shrink-0">その他世帯員の合計</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">¥</span>
                  <input
                    type="number"
                    value={otherAmount}
                    onChange={(e) => setOtherAmount(e.target.value)}
                    placeholder="例: 23000"
                    min="0"
                    className="pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-44 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          className="flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 text-sm transition-colors"
        >
          <Icons.Calc />
          還付見込み額を計算する
        </button>
      </section>

      {/* ===== Section 2: 月額結果 ===== */}
      {result && (
        <section className="mb-8 rounded-2xl border-2 border-sky-400 dark:border-sky-600 bg-sky-50 dark:bg-sky-950/40 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            月額 試算結果
          </h2>

          <div className="mb-4 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">還付見込み額（本人）</p>
            <p className={`text-4xl font-bold ${result.selfRefund > 0 ? "text-sky-700 dark:text-sky-300" : "text-gray-500"}`}>
              {fmt(result.selfRefund)}
            </p>
            {result.kosei === "2+" && result.householdRefund > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                世帯還付合計: {fmt(result.householdRefund)}
              </p>
            )}
            {result.selfRefund === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">自己負担額が上限以下のため、今月の還付はありません</p>
            )}
          </div>

          {/* 内訳テーブル */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left">
              <tbody>
                <tr className="border-b border-sky-200 dark:border-sky-800">
                  <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">所得区分</td>
                  <td className="py-1.5 font-medium text-gray-900 dark:text-gray-100">{SHOTOKU_KUBUN[result.shotokuKubun].label}</td>
                </tr>
                <tr className="border-b border-sky-200 dark:border-sky-800">
                  <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">本人月額自己負担</td>
                  <td className="py-1.5 font-medium text-gray-900 dark:text-gray-100">{fmt(result.selfAmount)}</td>
                </tr>
                {result.kosei === "2+" && (
                  <>
                    <tr className="border-b border-sky-200 dark:border-sky-800">
                      <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">その他世帯員合計</td>
                      <td className="py-1.5 font-medium text-gray-900 dark:text-gray-100">{fmt(result.otherAmount)}</td>
                    </tr>
                    <tr className="border-b border-sky-200 dark:border-sky-800">
                      <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">世帯合計</td>
                      <td className="py-1.5 font-medium text-gray-900 dark:text-gray-100">{fmt(result.householdTotal)}</td>
                    </tr>
                  </>
                )}
                {result.individualLimit !== null && result.kosei === "1" && (
                  <tr className="border-b border-sky-200 dark:border-sky-800">
                    <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">個人上限（適用）</td>
                    <td className="py-1.5 font-medium text-sky-700 dark:text-sky-300">{fmt(result.individualLimit)}</td>
                  </tr>
                )}
                <tr className="border-b border-sky-200 dark:border-sky-800">
                  <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">世帯上限</td>
                  <td className="py-1.5 font-medium text-sky-700 dark:text-sky-300">{fmt(result.householdLimit)}</td>
                </tr>
                {result.kosei === "2+" && (
                  <>
                    <tr className="border-b border-sky-200 dark:border-sky-800">
                      <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">世帯超過額（還付対象）</td>
                      <td className="py-1.5 font-bold text-sky-700 dark:text-sky-300">{fmt(result.householdRefund)}</td>
                    </tr>
                    <tr className="border-b border-sky-200 dark:border-sky-800">
                      <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">按分 — 本人還付</td>
                      <td className="py-1.5 font-bold text-sky-700 dark:text-sky-300">{fmt(result.selfRefund)}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">按分 — その他還付</td>
                      <td className="py-1.5 font-bold text-sky-700 dark:text-sky-300">{fmt(result.otherRefund)}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* 対象外警告 */}
          <div className="mb-4 flex gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
            <span className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"><Icons.Warning /></span>
            <div className="text-xs text-amber-800 dark:text-amber-200">
              <p className="font-semibold mb-1">以下は還付対象外です</p>
              <ul className="space-y-0.5">
                {TAISHO_GAI.map((t, i) => <li key={i}>・{t}</li>)}
              </ul>
            </div>
          </div>

          {/* 申請のヒント */}
          <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 p-3 text-xs text-green-800 dark:text-green-200">
            <p className="font-semibold mb-1">💡 申請のヒント</p>
            <ul className="space-y-0.5">
              <li>・自治体から自動的に支給申請書が郵送されます（利用月の3〜4ヶ月後）</li>
              <li>・申請期限は利用月の翌月から <strong>2年以内</strong></li>
              <li>・一度申請すれば、2回目以降は自動振込</li>
            </ul>
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
      <div className="print:hidden mb-8 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/40 p-4">
        <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">📖 制度をもっと詳しく知りたい方へ</p>
        <p className="text-xs text-green-700 dark:text-green-300 mb-2">
          6段階所得区分の詳細・複数人世帯の按分計算・対象外費用・高額医療合算制度・申請手順・医療費控除との連動を完全解説しています。
        </p>
        <Link href="/blog/kogaku-kaigo-service-guide" className="text-xs text-green-700 dark:text-green-300 underline hover:text-green-900 dark:hover:text-green-100">
          高額介護サービス費の完全ガイド【令和8年度版】を読む →
        </Link>
      </div>

      {/* ===== Section 3: 年間合算（折りたたみ） ===== */}
      <section className="print:hidden mb-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button
          type="button"
          onClick={() => setShowGassan((v) => !v)}
          className="w-full flex items-center justify-between p-5 text-left"
        >
          <div>
            <p className="text-base font-bold text-gray-900 dark:text-gray-100">
              年間の医療費・介護費 合算で更に還付を受けられるかも
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              高額医療・高額介護合算療養費制度（8/1〜翌7/31 年間試算）
            </p>
          </div>
          <span className="text-gray-400 dark:text-gray-500 shrink-0 ml-2">
            {showGassan ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
          </span>
        </button>

        {showGassan && (
          <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-5">
            {/* Q4: 後期高齢者医療 所得区分 */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                後期高齢者医療制度の所得区分 <span className="text-red-500">*</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {gassanKeys.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setGassanKubun(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      gassanKubun === key
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-sky-400"
                    }`}
                  >
                    {GASSAN_75[key].label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-sky-700 dark:text-sky-300 font-medium">
                年間上限: {fmt(GASSAN_75[gassanKubun].yearly_limit)} — {GASSAN_75[gassanKubun].note}
              </p>
            </div>

            {/* Q5: 年間医療費・介護費 */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                1年間 (8/1〜翌7/31) の自己負担合計 <span className="text-red-500">*</span>
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-32 shrink-0">医療費合計</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">¥</span>
                    <input
                      type="number"
                      value={medicalAmount}
                      onChange={(e) => setMedicalAmount(e.target.value)}
                      placeholder="例: 400000"
                      min="0"
                      className="pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-44 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-32 shrink-0">介護費合計</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">¥</span>
                    <input
                      type="number"
                      value={careYearAmount}
                      onChange={(e) => setCareYearAmount(e.target.value)}
                      placeholder="例: 300000"
                      min="0"
                      className="pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-44 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGassanCalculate}
              className="flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 text-sm transition-colors"
            >
              <Icons.Calc />
              年間合算を試算する
            </button>
          </div>
        )}
      </section>

      {/* ===== Section 4: 年間合算結果 ===== */}
      {gassanResult && (
        <section className="mb-8 rounded-2xl border-2 border-purple-400 dark:border-purple-600 bg-purple-50 dark:bg-purple-950/40 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            高額医療・高額介護合算 年間試算結果
          </h2>
          <div className="mb-4 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">年間還付見込み額</p>
            <p className={`text-4xl font-bold ${gassanResult.refund > 0 ? "text-purple-700 dark:text-purple-300" : "text-gray-500"}`}>
              {fmt(gassanResult.refund)}
            </p>
            {gassanResult.refund < 500 && gassanResult.refund > 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">超過額が¥500未満のため支給されません</p>
            )}
            {gassanResult.refund === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">合算額が年間上限以下のため、還付対象外です</p>
            )}
          </div>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left">
              <tbody>
                <tr className="border-b border-purple-200 dark:border-purple-800">
                  <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400">所得区分</td>
                  <td className="py-1.5 font-medium text-gray-900 dark:text-gray-100">{GASSAN_75[gassanResult.kubun].label}</td>
                </tr>
                <tr className="border-b border-purple-200 dark:border-purple-800">
                  <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400">医療費自己負担</td>
                  <td className="py-1.5 font-medium text-gray-900 dark:text-gray-100">{fmt(gassanResult.medicalAmount)}</td>
                </tr>
                <tr className="border-b border-purple-200 dark:border-purple-800">
                  <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400">介護費自己負担</td>
                  <td className="py-1.5 font-medium text-gray-900 dark:text-gray-100">{fmt(gassanResult.careAmount)}</td>
                </tr>
                <tr className="border-b border-purple-200 dark:border-purple-800">
                  <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400">合算額</td>
                  <td className="py-1.5 font-medium text-gray-900 dark:text-gray-100">{fmt(gassanResult.total)}</td>
                </tr>
                <tr className="border-b border-purple-200 dark:border-purple-800">
                  <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400">年間上限</td>
                  <td className="py-1.5 font-medium text-purple-700 dark:text-purple-300">{fmt(gassanResult.yearlyLimit)}</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400">超過分（還付対象）</td>
                  <td className="py-1.5 font-bold text-purple-700 dark:text-purple-300">{fmt(gassanResult.refund)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
            <span className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"><Icons.Warning /></span>
            <div className="text-xs text-amber-800 dark:text-amber-200 space-y-0.5">
              <p>・超過額が¥500未満の場合は支給されません</p>
              <p>・申請には市区町村窓口に「自己負担額証明書」の交付申請が必要</p>
              <p>・申請期限: 基準日 (7/31) の翌日から2年以内</p>
              <p>・医療保険と介護保険から比率に応じて按分支給されます</p>
            </div>
          </div>
        </section>
      )}

      {/* ===== Section 5: 静的SEOテーブル ===== */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          令和8年度 高額介護サービス費 6段階所得区分表
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">区分</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">対象</th>
                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">個人上限</th>
                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">世帯上限</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900">
              {shotokuKeys.map((key) => {
                const r = SHOTOKU_KUBUN[key];
                return (
                  <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-2 px-3 font-medium text-gray-900 dark:text-gray-100 text-xs">{r.label}</td>
                    <td className="py-2 px-3 text-gray-600 dark:text-gray-400 text-xs max-w-xs">{r.description}</td>
                    <td className="py-2 px-3 text-right font-medium text-sky-700 dark:text-sky-300 whitespace-nowrap text-xs">
                      {r.individual_limit !== null ? fmt(r.individual_limit) : "—"}
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-sky-700 dark:text-sky-300 whitespace-nowrap text-xs">
                      {fmt(r.household_limit)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          令和8年度 高額医療・高額介護合算 75歳以上 年間限度額表
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">区分</th>
                <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">年間限度額</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">備考</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900">
              {gassanKeys.map((key) => {
                const r = GASSAN_75[key];
                return (
                  <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-2 px-3 font-medium text-gray-900 dark:text-gray-100 text-xs">{r.label}</td>
                    <td className="py-2 px-3 text-right font-medium text-purple-700 dark:text-purple-300 whitespace-nowrap text-xs">{fmt(r.yearly_limit)}</td>
                    <td className="py-2 px-3 text-gray-600 dark:text-gray-400 text-xs">{r.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          ※ 70歳未満は別表あり。70〜74歳は国民健康保険または被用者保険の区分が適用されます。
        </p>
      </section>

      {/* ===== Section 6: 計算式の解説 ===== */}
      <section className="mb-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">計算式の解説</h2>
        <div className="space-y-5 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">1人世帯の計算式</h3>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 font-mono text-xs">
              <p>還付額 = max(0, 月額自己負担 − 個人上限 or 世帯上限)</p>
              <p className="mt-1 text-gray-500 dark:text-gray-400"># 個人上限がある区分は個人上限を優先適用</p>
            </div>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              例: 一般課税世帯 · 月額60,000円 → 60,000 − 44,400 = <strong>¥15,600還付</strong>
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">複数人世帯の按分計算</h3>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 font-mono text-xs">
              <p>世帯還付額 = max(0, 世帯合計自己負担 − 世帯上限)</p>
              <p>個人還付額 = 世帯還付額 × (個人負担 ÷ 世帯合計)</p>
            </div>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              例: 一般課税 · 夫45,000円 + 妻23,000円 = 68,000円 → 世帯還付23,600円 →<br />
              夫: 23,600 × (45,000/68,000) ≒ <strong>¥15,618</strong>　妻: 23,600 × (23,000/68,000) ≒ <strong>¥7,982</strong>
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">高額医療・高額介護合算の計算式</h3>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 font-mono text-xs">
              <p>年間還付額 = max(0, 医療費合計 + 介護費合計 − 年間上限額)</p>
              <p className="mt-1 text-gray-500 dark:text-gray-400"># 超過額が¥500未満は支給なし</p>
            </div>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              例: 住民税非課税Ⅱ · 医療40万+介護30万 = 70万 → 70万 − 31万 = <strong>¥390,000還付</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ===== Section 7: 対象外項目 ===== */}
      <section className="mb-8 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <span className="text-amber-600 dark:text-amber-400"><Icons.Warning /></span>
          高額介護サービス費の対象外費用
        </h2>
        <ul className="space-y-1 text-sm text-amber-800 dark:text-amber-200">
          {TAISHO_GAI.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-amber-500 shrink-0">✕</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">
          施設入居中の食費・居住費は対象外ですが、低所得者は別途「特定入所者介護サービス費(補足給付)」の対象となる場合があります。
        </p>
      </section>

      {/* FAQ */}
      <section className="print:hidden mb-8">
        <FAQSection faq={faqItems} title="よくある質問" />
      </section>
    </main>
  );
}
