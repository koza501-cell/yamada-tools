"use client";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import Mascot, { MascotState } from "@/components/common/Mascot";

type Relationship = "lineal" | "other";
type GiftType = "annual" | "unified";
type HousingType = "eco" | "general";

interface CalcResult {
  basicDeduction: number;
  housingDeduction: number;
  taxableAmount: number;
  taxRate: number | null;
  taxDeduction: number;
  giftTax: number;
  effectiveRate: number;
  noTax: boolean;
  isUnified: boolean;
}

function calcAnnualTax(taxable: number, useSpecial: boolean): { tax: number; rate: number; deduction: number } {
  if (useSpecial) {
    if (taxable <= 200) return { tax: taxable * 0.1, rate: 10, deduction: 0 };
    if (taxable <= 400) return { tax: taxable * 0.15 - 10, rate: 15, deduction: 10 };
    if (taxable <= 600) return { tax: taxable * 0.2 - 30, rate: 20, deduction: 30 };
    if (taxable <= 1000) return { tax: taxable * 0.3 - 90, rate: 30, deduction: 90 };
    if (taxable <= 1500) return { tax: taxable * 0.4 - 190, rate: 40, deduction: 190 };
    if (taxable <= 3000) return { tax: taxable * 0.45 - 265, rate: 45, deduction: 265 };
    if (taxable <= 4500) return { tax: taxable * 0.5 - 415, rate: 50, deduction: 415 };
    return { tax: taxable * 0.55 - 640, rate: 55, deduction: 640 };
  } else {
    if (taxable <= 200) return { tax: taxable * 0.1, rate: 10, deduction: 0 };
    if (taxable <= 300) return { tax: taxable * 0.15 - 10, rate: 15, deduction: 10 };
    if (taxable <= 400) return { tax: taxable * 0.2 - 25, rate: 20, deduction: 25 };
    if (taxable <= 600) return { tax: taxable * 0.3 - 65, rate: 30, deduction: 65 };
    if (taxable <= 1000) return { tax: taxable * 0.4 - 125, rate: 40, deduction: 125 };
    if (taxable <= 1500) return { tax: taxable * 0.45 - 175, rate: 45, deduction: 175 };
    if (taxable <= 3000) return { tax: taxable * 0.5 - 250, rate: 50, deduction: 250 };
    return { tax: taxable * 0.55 - 400, rate: 55, deduction: 400 };
  }
}

function calculate(
  giftAmount: number,
  relationship: Relationship,
  age: number,
  giftType: GiftType,
  housingGift: boolean,
  housingType: HousingType
): CalcResult {
  const basicDeduction = 110;
  const housingDeduction = housingGift ? (housingType === "eco" ? 1000 : 500) : 0;

  if (giftType === "unified") {
    const unifiedDeduction = 2500;
    const taxable = giftAmount - basicDeduction - unifiedDeduction;
    if (taxable <= 0) {
      return {
        basicDeduction,
        housingDeduction: 0,
        taxableAmount: 0,
        taxRate: null,
        taxDeduction: 0,
        giftTax: 0,
        effectiveRate: 0,
        noTax: true,
        isUnified: true,
      };
    }
    const giftTax = taxable * 0.2;
    return {
      basicDeduction,
      housingDeduction: 0,
      taxableAmount: taxable,
      taxRate: 20,
      taxDeduction: 0,
      giftTax,
      effectiveRate: giftAmount > 0 ? (giftTax / giftAmount) * 100 : 0,
      noTax: false,
      isUnified: true,
    };
  }

  const taxable = giftAmount - basicDeduction - housingDeduction;
  if (taxable <= 0) {
    return {
      basicDeduction,
      housingDeduction,
      taxableAmount: 0,
      taxRate: null,
      taxDeduction: 0,
      giftTax: 0,
      effectiveRate: 0,
      noTax: true,
      isUnified: false,
    };
  }

  const useSpecial = relationship === "lineal" && age >= 18;
  const { tax, rate, deduction } = calcAnnualTax(taxable, useSpecial);

  return {
    basicDeduction,
    housingDeduction,
    taxableAmount: taxable,
    taxRate: rate,
    taxDeduction: deduction,
    giftTax: Math.max(0, tax),
    effectiveRate: giftAmount > 0 ? (Math.max(0, tax) / giftAmount) * 100 : 0,
    noTax: false,
    isUnified: false,
  };
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("ja-JP") + "万円";
}

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "贈与税計算機",
      "description": "贈与金額・関係性・年齢を入力するだけで贈与税を自動計算。暦年課税・相続時精算課税・住宅取得資金贈与の特例に対応した無料ツール。",
      "url": "https://yamada-tools.jp/tax/gift-tax-calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "税金計算", "item": "https://yamada-tools.jp/tax" },
        { "@type": "ListItem", "position": 3, "name": "贈与税計算機", "item": "https://yamada-tools.jp/tax/gift-tax-calculator" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "贈与税の基礎控除はいくらですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "暦年課税の基礎控除は年間110万円です。受贈者1人につき毎年110万円まで贈与税がかかりません。" }
        },
        {
          "@type": "Question",
          "name": "特例税率と一般税率の違いは何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "特例税率は直系尊属（父母・祖父母等）から18歳以上の子・孫への贈与に適用される優遇税率です。同じ金額でも一般税率より税額が低くなります。" }
        },
        {
          "@type": "Question",
          "name": "相続時精算課税とはどういう制度ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "生涯2,500万円まで贈与税を非課税にできる制度です。ただし贈与財産は将来の相続税に加算されます。2024年改正で毎年110万円の基礎控除が新設されました。" }
        },
        {
          "@type": "Question",
          "name": "住宅取得資金贈与の特例はいつまで使えますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "2026年12月31日までの贈与が対象です。省エネ等住宅は1,000万円、一般住宅は500万円が非課税となります。" }
        },
        {
          "@type": "Question",
          "name": "毎年110万円の贈与を繰り返すのは問題ありませんか？",
          "acceptedAnswer": { "@type": "Answer", "text": "計画的な連年贈与と見なされると一括贈与として課税されるリスクがあります。毎年贈与契約書を作成し、金額や時期を変えるなど対策が重要です。" }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "贈与税の計算方法",
      "step": [
        { "@type": "HowToStep", "name": "贈与金額を確認", "text": "年間に受け取った贈与の合計額を確認します。" },
        { "@type": "HowToStep", "name": "控除額を差し引く", "text": "基礎控除110万円（および特例がある場合はその控除額）を差し引きます。" },
        { "@type": "HowToStep", "name": "税率を確認", "text": "課税価格に応じた税率（特例税率または一般税率）を確認します。" },
        { "@type": "HowToStep", "name": "贈与税額を計算", "text": "課税価格×税率－控除額で贈与税額を計算します。" }
      ]
    }
  ]
};

export default function GiftTaxCalculatorPage() {
  const [giftAmount, setGiftAmount] = useState("");
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [relationship, setRelationship] = useState<Relationship>("lineal");
  const [age, setAge] = useState("");
  const [giftType, setGiftType] = useState<GiftType>("annual");
  const [housingGift, setHousingGift] = useState(false);
  const [housingType, setHousingType] = useState<HousingType>("eco");
  const [result, setResult] = useState<CalcResult | null>(null);

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const toggleClass = (active: boolean) =>
    `flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
      active ? "bg-kon text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  function handleCalculate() {
    const amount = parseFloat(giftAmount);
    const ageVal = parseInt(age);
    if (isNaN(amount) || amount <= 0) return;
    if (isNaN(ageVal) || ageVal <= 0) return;
    const res = calculate(amount, relationship, ageVal, giftType, housingGift, housingType);
    setResult(res);
    setMascotState("success");
  }

  function handleReset() {
    setGiftAmount("");
    setRelationship("lineal");
    setAge("");
    setGiftType("annual");
    setHousingGift(false);
    setHousingType("eco");
    setResult(null);
  }

  const faqItems = [
    { question: "贈与税の基礎控除はいくらですか？", answer: "暦年課税の場合、年間110万円まで非課税です。110万円を超えた部分に対して10%〜55%の累進税率で課税されます。" },
    { question: "親から1000万円もらったら贈与税はいくらですか？", answer: "一般贈与（祖父母・親以外）の場合：（1000万円-110万円）×40%−125万円=231万円。特例贈与（直系尊属から20歳以上への贈与）の場合：（1000万円-110万円）×30%−90万円=177万円です。" },
    { question: "相続時精算課税と暦年課税の違いは何ですか？", answer: "相続時精算課税は2,500万円まで非課税で贈与でき、贈与者が亡くなった時に相続財産に加算して相続税を計算する制度です。2024年改正から年間110万円の基礎控除が追加されました。暦年課税は毎年110万円まで非課税の制度です。" },
  ];

  const useCases = [
    { icon: "🎁", persona: "親から大きな贈与を受ける予定の方", title: "贈与税がいくらかかるか事前に確認したい", benefit: "一般贈与・特例贈与の税額を自動計算" },
    { icon: "🏠", persona: "住宅購入資金を親に援助してもらう方", title: "住宅取得資金贈与の非課税枠を確認したい", benefit: "各種贈与税の非課税特例と適用条件を確認" },
    { icon: "📅", persona: "相続対策として毎年贈与を検討している方", title: "暦年贈与と相続時精算課税どちらが有利か", benefit: "長期的な相続税対策として最適な贈与方法を試算" },
  ];

  return (
    <>
      <IntroSection title="贈与税計算機" paragraphs={["贈与金額・贈与者との関係（親・祖父母など直系尊属か否か）・受贈者の年齢を入力すると贈与税を自動計算します。", "暦年課税（年間110万円基礎控除）と相続時精算課税（2,500万円非課税・2024年改正で年110万円追加控除）を比較できます。", "登録不要・完全無料。生前贈与の計画立案や贈与税の概算把握に活用できます。"]} />
      <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="bg-gradient-to-r from-blue-700 to-kon text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">贈与税 計算機</h1>
          <p className="text-gin text-sm md:text-base">
            贈与金額と関係性を入力するだけで贈与税を自動計算。暦年課税・相続時精算課税・住宅取得資金贈与の特例に対応。2024年度改正対応。
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-base font-bold text-gray-800 border-b pb-2">入力項目</h2>

            <div>
              <label className={labelClass}>贈与を受けた金額（万円）</label>
              <input
                type="number"
                className={inputClass}
                placeholder="例：500"
                value={giftAmount}
                onChange={(e) => setGiftAmount(e.target.value)}
                min="0"
              />
            </div>

            <div>
              <label className={labelClass}>贈与者との関係</label>
              <div className="flex gap-2">
                <button type="button" className={toggleClass(relationship === "lineal")} onClick={() => setRelationship("lineal")}>
                  直系尊属（父母・祖父母）
                </button>
                <button type="button" className={toggleClass(relationship === "other")} onClick={() => setRelationship("other")}>
                  その他
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>受贈者の年齢（歳）</label>
              <input
                type="number"
                className={inputClass}
                placeholder="例：30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="0"
                max="120"
              />
            </div>

            <div>
              <label className={labelClass}>贈与の種類</label>
              <div className="flex gap-2">
                <button type="button" className={toggleClass(giftType === "annual")} onClick={() => setGiftType("annual")}>
                  暦年課税
                </button>
                <button type="button" className={toggleClass(giftType === "unified")} onClick={() => setGiftType("unified")}>
                  相続時精算課税
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>住宅取得資金贈与の特例</label>
              <div className="flex gap-2 mb-3">
                <button type="button" className={toggleClass(!housingGift)} onClick={() => setHousingGift(false)}>
                  なし
                </button>
                <button type="button" className={toggleClass(housingGift)} onClick={() => setHousingGift(true)}>
                  あり
                </button>
              </div>
              {housingGift && (
                <div>
                  <label className={labelClass}>住宅の種類</label>
                  <div className="flex gap-2">
                    <button type="button" className={toggleClass(housingType === "eco")} onClick={() => setHousingType("eco")}>
                      省エネ等住宅
                    </button>
                    <button type="button" className={toggleClass(housingType === "general")} onClick={() => setHousingType("general")}>
                      一般住宅
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button"
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                リセット
              </button>
              <button type="button"
                onClick={handleCalculate}
                className="flex-1 py-2.5 rounded-lg bg-kon text-white text-sm font-bold hover:bg-ai transition-colors"
              >
                計算する
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {result ? (
              result.noTax ? (
                <div className="bg-white rounded-xl shadow-sm border border-green-200 p-8 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <p className="text-xl font-bold text-green-600 mb-2">贈与税はかかりません</p>
                  <div className="text-sm text-gray-500 space-y-1 mt-3">
                    <p>基礎控除額: {fmt(result.basicDeduction)}</p>
                    {result.housingDeduction > 0 && (
                      <p>住宅取得資金特例: {fmt(result.housingDeduction)}</p>
                    )}
                    {result.isUnified && (
                      <p>相続時精算課税特別控除: 2,500万円</p>
                    )}
                  </div>
                  {result.isUnified && (
                    <p className="text-xs text-kon mt-3 bg-gray-50 rounded-lg p-2">
                      ※相続時に贈与財産が相続税の課税対象となります
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">計算結果</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1.5 border-b">
                        <span className="text-gray-600">基礎控除額</span>
                        <span className="font-medium">{fmt(result.basicDeduction)}</span>
                      </div>
                      {result.housingDeduction > 0 && (
                        <div className="flex justify-between py-1.5 border-b">
                          <span className="text-gray-600">住宅取得資金特例控除</span>
                          <span className="font-medium text-green-600">{fmt(result.housingDeduction)}</span>
                        </div>
                      )}
                      {result.isUnified && (
                        <div className="flex justify-between py-1.5 border-b">
                          <span className="text-gray-600">相続時精算課税特別控除</span>
                          <span className="font-medium text-green-600">2,500万円</span>
                        </div>
                      )}
                      <div className="flex justify-between py-1.5 border-b">
                        <span className="text-gray-600">課税価格</span>
                        <span className="font-medium text-kon">{fmt(result.taxableAmount)}</span>
                      </div>
                      {result.taxRate !== null && (
                        <div className="flex justify-between py-1.5 border-b">
                          <span className="text-gray-600">適用税率</span>
                          <span className="font-medium">{result.taxRate}%</span>
                        </div>
                      )}
                      {result.taxDeduction > 0 && (
                        <div className="flex justify-between py-1.5 border-b">
                          <span className="text-gray-600">控除額</span>
                          <span className="font-medium">{fmt(result.taxDeduction)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-3 mt-1">
                        <span className="text-sm font-bold text-kon">贈与税額</span>
                        <span className="text-2xl font-bold text-kon">{fmt(result.giftTax)}</span>
                      </div>
                      <div className="flex justify-between py-1.5 px-1">
                        <span className="text-gray-500 text-xs">実効税率</span>
                        <span className="text-sm font-medium text-gray-700">
                          {result.effectiveRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {result.isUnified && (
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-xs text-kon leading-relaxed">
                      <p className="font-bold mb-1">相続時精算課税について</p>
                      <p>贈与時に支払った贈与税は、将来の相続時に相続税と精算されます。贈与財産は相続税の課税対象に加算されます。</p>
                    </div>
                  )}

                  {!result.isUnified && (
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-xs text-kon leading-relaxed">
                      <p className="font-bold mb-1">暦年課税 vs 相続時精算課税</p>
                      <p>毎年少額の贈与を続ける場合は暦年課税、まとまった金額を贈与する場合は相続時精算課税が有利なケースがあります。詳しくは税理士にご相談ください。</p>
                    </div>
                  )}
                </>
              )
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
                <p className="text-4xl mb-3">🎁</p>
                <p className="text-sm">贈与金額と条件を入力して「計算する」を押してください</p>
              </div>
            )}

            <p className="text-xs text-gray-400 leading-relaxed">
              ※2024年度税制に基づく概算です。正確な金額は税理士にご相談ください。
            </p>
          </div>
        </div>

        {/* よくある計算例 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">よくある計算例</h2>

          <p className="text-sm font-semibold text-kon mb-2">暦年課税（特例税率）：直系尊属から18歳以上への贈与</p>
          <div className="overflow-x-auto mb-5">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-kon text-white">
                  <th className="text-left px-3 py-2 rounded-tl-lg">贈与金額</th>
                  <th className="text-right px-3 py-2">課税価格</th>
                  <th className="text-right px-3 py-2">税率</th>
                  <th className="text-right px-3 py-2 rounded-tr-lg">贈与税額</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { gift: "200万円", taxable: "90万円", rate: "10%", tax: "9万円" },
                  { gift: "500万円", taxable: "390万円", rate: "20%", tax: "48万円" },
                  { gift: "1,000万円", taxable: "890万円", rate: "30%", tax: "177万円" },
                  { gift: "2,000万円", taxable: "1,890万円", rate: "45%", tax: "585.5万円" },
                  { gift: "3,000万円", taxable: "2,890万円", rate: "50%", tax: "1,030万円" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-3 py-2 font-medium text-gray-800">{row.gift}</td>
                    <td className="px-3 py-2 text-right text-kon">{row.taxable}</td>
                    <td className="px-3 py-2 text-right">{row.rate}</td>
                    <td className="px-3 py-2 text-right font-bold text-kon">{row.tax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm font-semibold text-indigo-700 mb-2">暦年課税（一般税率）：その他の贈与</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="text-left px-3 py-2 rounded-tl-lg">贈与金額</th>
                  <th className="text-right px-3 py-2">課税価格</th>
                  <th className="text-right px-3 py-2">税率</th>
                  <th className="text-right px-3 py-2 rounded-tr-lg">贈与税額</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { gift: "200万円", taxable: "90万円", rate: "10%", tax: "9万円" },
                  { gift: "500万円", taxable: "390万円", rate: "30%", tax: "52万円" },
                  { gift: "1,000万円", taxable: "890万円", rate: "40%", tax: "231万円" },
                  { gift: "2,000万円", taxable: "1,890万円", rate: "50%", tax: "695万円" },
                  { gift: "3,000万円", taxable: "2,890万円", rate: "55%", tax: "1,089.5万円" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-3 py-2 font-medium text-gray-800">{row.gift}</td>
                    <td className="px-3 py-2 text-right text-kon">{row.taxable}</td>
                    <td className="px-3 py-2 text-right">{row.rate}</td>
                    <td className="px-3 py-2 text-right font-bold text-indigo-700">{row.tax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">※基礎控除110万円を差し引いた課税価格で計算。住宅取得資金特例は含みません。</p>
        </div>

        {/* 贈与税の基本知識 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">贈与税の基本知識</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            贈与税は、個人から財産をもらった際にかかる税金です。毎年1月1日から12月31日までの1年間に受けた贈与の合計額が110万円を超えると申告・納税が必要になります。
          </p>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-kon font-bold shrink-0">▶</span>
              <span><strong>暦年課税</strong>：年間110万円の基礎控除あり。超えた分に税率適用。受贈者の年齢・贈与者との関係により特例税率が適用。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-kon font-bold shrink-0">▶</span>
              <span><strong>相続時精算課税</strong>：累計2,500万円まで非課税（2024年改正で毎年110万円の基礎控除も新設）。将来の相続税で精算。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-kon font-bold shrink-0">▶</span>
              <span><strong>住宅取得資金贈与の特例</strong>：省エネ等住宅は1,000万円、一般住宅は500万円が非課税（2026年12月末まで）。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-kon font-bold shrink-0">▶</span>
              <span><strong>申告期限</strong>：贈与を受けた年の翌年2月1日〜3月15日。期限内に税務署へ申告・納税が必要。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-kon font-bold shrink-0">▶</span>
              <span><strong>生前贈与加算</strong>：2024年改正により、死亡前7年以内（改正前は3年以内）の贈与は相続財産に加算されます。</span>
            </li>
          </ul>
        </div>

        {/* よくある質問 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">よくある質問</h2>
          <div className="space-y-3">
            {[
              {
                q: "贈与税の基礎控除はいくらですか？",
                a: "暦年課税の基礎控除は年間110万円です。受贈者1人につき毎年110万円まで贈与税がかかりません。複数の人から贈与を受けた場合は合計額から110万円を控除します。"
              },
              {
                q: "特例税率と一般税率の違いは何ですか？",
                a: "特例税率は直系尊属（父母・祖父母等）から18歳以上の子・孫への贈与に適用される優遇税率です。同じ贈与金額でも一般税率より税額が低くなります。例えば課税価格600万円の場合、特例税率では税額90万円、一般税率では税額115万円となります。"
              },
              {
                q: "相続時精算課税を選択するメリット・デメリットは？",
                a: "メリットは生涯2,500万円まで贈与税が非課税になること、2024年改正で毎年110万円の基礎控除も追加されたこと。デメリットは一度選択すると暦年課税に戻れないこと、贈与財産が将来の相続税に加算されることです。"
              },
              {
                q: "贈与税の申告はいつまでに行う必要がありますか？",
                a: "贈与を受けた年の翌年2月1日から3月15日が申告・納付期限です。申告が必要なのは年間贈与額が110万円（基礎控除額）を超えた場合です。期限を過ぎると延滞税や加算税が課されます。"
              },
              {
                q: "毎年110万円の非課税贈与を繰り返すと問題になりますか？",
                a: "はい、定期贈与と見なされると一括贈与として課税されるリスクがあります。対策として毎年贈与契約書を作成する、贈与の時期や金額をわずかに変える、受贈者が実際に管理できる口座に入金するなどが重要です。"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <p className="font-semibold text-gray-800 mb-2 flex gap-2">
                  <span className="text-kon font-bold shrink-0">Q{i + 1}.</span>{item.q}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed flex gap-2">
                  <span className="text-green-600 font-bold shrink-0">A.</span>{item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* あわせて使えるツール */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">あわせて使えるツール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                href: "/tax/inheritance-tax-calculator",
                label: "相続税 計算機",
                desc: "相続財産と法定相続人を入力して相続税を試算",
              },
              {
                href: "/tax/income-tax-calculator",
                label: "所得税 計算機",
                desc: "年収・控除から所得税・住民税を自動計算",
              },
              {
                href: "/tax/furusato-nozei-calculator",
                label: "ふるさと納税 控除上限額計算機",
                desc: "年収・家族構成から控除上限額を試算",
              },
              {
                href: "/insurance/life-insurance-calculator",
                label: "生命保険 必要保障額計算機",
                desc: "家族構成と収入から必要な保険金額を計算",
              },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 hover:border-ai hover:shadow-md transition-all p-4 group"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-50 group-hover:bg-ai flex items-center justify-center shrink-0 transition-colors">
                  <svg className="w-5 h-5 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-kon group-hover:text-ai">{tool.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
    <UseCasesSection cases={useCases} />
    <FAQSection faq={faqItems} />
  </>
  );
}
