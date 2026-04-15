"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import Mascot, { MascotState } from "@/components/common/Mascot";

type Mode = "exclude" | "include" | "taxonly";
type TaxRate = 0.1 | 0.08;
type Rounding = "floor" | "ceil" | "round";

interface Item {
  name: string;
  amount: string;
  rate: TaxRate;
}

interface SingleResult {
  exclude: number;
  tax: number;
  include: number;
  rate: TaxRate;
}

interface ItemResult {
  name: string;
  exclude: number;
  tax: number;
  include: number;
  rate: TaxRate;
}

function applyRounding(n: number, method: Rounding): number {
  if (method === "floor") return Math.floor(n);
  if (method === "ceil") return Math.ceil(n);
  return Math.round(n);
}

function sanitize(n: number): number {
  return parseFloat(n.toFixed(10));
}

function calcSingle(amount: number, rate: TaxRate, mode: Mode, rounding: Rounding): SingleResult {
  if (mode === "exclude") {
    const tax = applyRounding(amount * rate, rounding);
    return { exclude: amount, tax, include: amount + tax, rate };
  } else if (mode === "include") {
    const exclude = applyRounding(sanitize(amount / (1 + rate)), rounding);
    const tax = amount - exclude;
    return { exclude, tax, include: amount, rate };
  } else {
    const tax = applyRounding(amount * rate, rounding);
    return { exclude: amount, tax, include: amount + tax, rate };
  }
}

function calcItem(item: Item, rounding: Rounding): ItemResult {
  const amount = parseFloat(item.amount) || 0;
  const tax = applyRounding(amount * item.rate, rounding);
  return { name: item.name, exclude: amount, tax, include: amount + tax, rate: item.rate };
}

function fmtJPY(n: number): string {
  return n.toLocaleString("ja-JP") + "円";
}

const defaultItems: Item[] = [{ name: "", amount: "", rate: 0.1 }];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "消費税 計算機 Pro",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "消費税10%・軽減税率8%対応の無料計算機。税抜→税込・税込→税抜の両方向計算、複数明細一括計算、端数処理選択に対応。インボイス制度対応。",
      "url": "https://yamada-tools.jp/tax/consumption-tax"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "税金計算", "item": "https://yamada-tools.jp/tax" },
        { "@type": "ListItem", "position": 3, "name": "消費税 計算機 Pro", "item": "https://yamada-tools.jp/tax/consumption-tax" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "消費税の税率は10%と8%のどちらを使えばいいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "食料品（酒類除く）と定期購読の新聞には軽減税率8%が適用されます。それ以外には標準税率10%が適用されます。外食・テイクアウトは10%、スーパーの食品は8%が基本です。" }
        },
        {
          "@type": "Question",
          "name": "税込価格から税抜価格を計算する方法は？",
          "acceptedAnswer": { "@type": "Answer", "text": "税抜価格 = 税込価格 ÷ 1.1（10%の場合）または ÷ 1.08（8%の場合）です。例えば税込1,100円なら税抜1,000円、消費税100円となります。" }
        },
        {
          "@type": "Question",
          "name": "インボイス制度とは何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "2023年10月から始まった制度で、消費税の仕入税額控除を受けるために適格請求書（インボイス）の保存が必要になりました。適格請求書には登録番号・税率・税額の明記が必要です。" }
        },
        {
          "@type": "Question",
          "name": "複数の商品をまとめて消費税計算したい場合は？",
          "acceptedAnswer": { "@type": "Answer", "text": "複数明細モードをONにすると、品名・金額・税率を行ごとに入力して一括計算できます。最大10行まで対応しており、合計税額と税込総額を自動計算します。" }
        },
        {
          "@type": "Question",
          "name": "消費税の端数はどう処理すればいいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "切り捨て・切り上げ・四捨五入のいずれも法律上認められています。インボイス制度では1枚の請求書につき税率ごとに1回だけ端数処理を行うことが原則です。" }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "消費税の計算方法",
      "description": "税抜・税込・複数明細の消費税を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "計算モードを選択", "text": "税抜→税込・税込→税抜・税額のみの3モードから選択します。" },
        { "@type": "HowToStep", "position": 2, "name": "金額と税率を入力", "text": "金額を入力し、10%（標準）または8%（軽減税率）を選択します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」ボタンを押すと税抜・消費税額・税込金額が表示されます。" }
      ]
    }
  ]
};

export default function ConsumptionTaxPage() {
  const [mode, setMode] = useState<Mode>("exclude");
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [amount, setAmount] = useState("");
  const [taxRate, setTaxRate] = useState<TaxRate>(0.1);
  const [rounding, setRounding] = useState<Rounding>("floor");
  const [multiMode, setMultiMode] = useState(false);
  const [items, setItems] = useState<Item[]>(defaultItems);
  const [singleResult, setSingleResult] = useState<SingleResult | null>(null);
  const [itemResults, setItemResults] = useState<ItemResult[] | null>(null);

  const toggleClass = (active: boolean) =>
    `flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
      active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  function handleCalculate() {
    if (multiMode) {
      const results = items.map((item) => calcItem(item, rounding));
      setItemResults(results);
      setSingleResult(null);
    } else {
      const n = parseFloat(amount);
      if (isNaN(n) || n < 0) return;
      const result = calcSingle(n, taxRate, mode, rounding);
      setSingleResult(result);
      setItemResults(null);
    }
  }

  function handleReset() {
    setMode("exclude");
    setAmount("");
    setTaxRate(0.1);
    setRounding("floor");
    setMultiMode(false);
    setItems(defaultItems);
    setSingleResult(null);
    setItemResults(null);
  }

  function addItem() {
    if (items.length >= 10) return;
    setItems([...items, { name: "", amount: "", rate: 0.1 }]);
  }

  function removeItem(idx: number) {
    setItems(items.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, field: keyof Item, value: string | TaxRate) {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setItems(updated);
  }

  const grandTotals = itemResults
    ? {
        exclude: itemResults.reduce((s, r) => s + r.exclude, 0),
        tax: itemResults.reduce((s, r) => s + r.tax, 0),
        include: itemResults.reduce((s, r) => s + r.include, 0),
      }
    : null;

  const faqItems = [
    { question: "消費税の軽減税率8%はどの商品に適用されますか？", answer: "軽減税率8%は飲食料品（酒類・外食を除く）と週2回以上発行される新聞（定期購読）に適用されます。それ以外の商品・サービスは標準税率10%が適用されます。" },
    { question: "インボイス制度で消費税計算はどう変わりますか？", answer: "2023年10月からインボイス制度が開始し、適格請求書（インボイス）に消費税額を明記する必要があります。端数処理は1枚の請求書につき1回のみ（切り捨て・切り上げ・四捨五入のいずれか）です。" },
    { question: "税込み価格から税抜き価格を計算する方法は？", answer: "税率10%の場合：税抜き価格 = 税込み価格 ÷ 1.1。税率8%の場合：税抜き価格 = 税込み価格 ÷ 1.08。例えば税込み1,100円なら税抜き1,000円です。" },
  ];

  const useCases = [
    { icon: "🧾", persona: "請求書・見積書を作成している事業者", title: "インボイス対応の消費税額を正確に計算したい", benefit: "適格請求書に記載する消費税額を端数処理込みで算出" },
    { icon: "🛒", persona: "買い物・家計管理をする方", title: "税込価格から税抜価格を素早く確認したい", benefit: "8%・10%の税抜価格を瞬時に逆算" },
    { icon: "📊", persona: "経理・会計担当者", title: "軽減税率対象商品の仕訳を正確に処理したい", benefit: "8%・10%混在請求書の税額を自動仕分け計算" },
  ];

  return (
    <>
      <IntroSection title="消費税計算機Pro" paragraphs={["税率10%・軽減税率8%の消費税を瞬時に計算。税込から税抜、税抜から税込への変換も対応しています。", "インボイス制度（適格請求書）の端数処理（切り捨て・切り上げ・四捨五入）の違いも確認できます。複数品目の消費税合計も一括計算可能。", "登録不要・完全無料。見積書・請求書作成や、買い物時の税込・税抜確認に活用できます。"]} />
      <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">消費税 計算機 Pro</h1>
          <p className="text-blue-100 text-sm md:text-base">
            税抜・税込・軽減税率8%対応。複数明細の一括計算・端数処理選択・インボイス制度対応。
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-base font-bold text-gray-800 border-b pb-2">入力項目</h2>

            <div>
              <label className={labelClass}>計算モード</label>
              <div className="flex gap-1">
                <button className={toggleClass(mode === "exclude")} onClick={() => setMode("exclude")}>
                  税抜→税込
                </button>
                <button className={toggleClass(mode === "include")} onClick={() => setMode("include")}>
                  税込→税抜
                </button>
                <button className={toggleClass(mode === "taxonly")} onClick={() => setMode("taxonly")}>
                  税額のみ
                </button>
              </div>
            </div>

            {!multiMode && (
              <div>
                <label className={labelClass}>
                  金額（円）{mode === "include" ? "（税込）" : "（税抜）"}
                </label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="例：1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                />
              </div>
            )}

            {!multiMode && (
              <div>
                <label className={labelClass}>税率</label>
                <div className="flex gap-2">
                  <button className={toggleClass(taxRate === 0.1)} onClick={() => setTaxRate(0.1)}>
                    10%（標準）
                  </button>
                  <button className={toggleClass(taxRate === 0.08)} onClick={() => setTaxRate(0.08)}>
                    8%（軽減税率）
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className={labelClass}>端数処理</label>
              <select
                className={inputClass}
                value={rounding}
                onChange={(e) => setRounding(e.target.value as Rounding)}
              >
                <option value="floor">切り捨て</option>
                <option value="ceil">切り上げ</option>
                <option value="round">四捨五入</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>複数明細モード</label>
              <div className="flex gap-2">
                <button className={toggleClass(!multiMode)} onClick={() => setMultiMode(false)}>
                  なし
                </button>
                <button className={toggleClass(multiMode)} onClick={() => setMultiMode(true)}>
                  あり
                </button>
              </div>
            </div>

            {multiMode && (
              <div className="space-y-3">
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">明細 {idx + 1}</span>
                        {items.length > 1 && (
                          <button
                            onClick={() => removeItem(idx)}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            削除
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="品名"
                        value={item.name}
                        onChange={(e) => updateItem(idx, "name", e.target.value)}
                      />
                      <input
                        type="number"
                        className={inputClass}
                        placeholder="金額（税抜）"
                        value={item.amount}
                        onChange={(e) => updateItem(idx, "amount", e.target.value)}
                        min="0"
                      />
                      <div className="flex gap-1">
                        <button
                          className={toggleClass(item.rate === 0.1)}
                          onClick={() => updateItem(idx, "rate", 0.1 as TaxRate)}
                        >
                          10%
                        </button>
                        <button
                          className={toggleClass(item.rate === 0.08)}
                          onClick={() => updateItem(idx, "rate", 0.08 as TaxRate)}
                        >
                          8%
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {items.length < 10 && (
                  <button
                    onClick={addItem}
                    className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-500 text-sm rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    ＋ 行を追加（{items.length}/10）
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                リセット
              </button>
              <button
                onClick={handleCalculate}
                className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                計算する
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {singleResult && !multiMode && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-700">計算結果</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                    {singleResult.rate === 0.1 ? "10%（標準）" : "8%（軽減税率）"}
                  </span>
                </div>
                <div className="space-y-3">
                  {mode !== "taxonly" && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">税抜金額</span>
                      <span className="text-lg font-semibold text-gray-800">
                        {fmtJPY(singleResult.exclude)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">消費税額</span>
                    <span className="text-lg font-semibold text-orange-600">
                      {fmtJPY(singleResult.tax)}
                    </span>
                  </div>
                  {mode !== "taxonly" ? (
                    <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-3">
                      <span className="text-sm font-bold text-blue-800">税込金額</span>
                      <span className="text-2xl font-bold text-blue-800">
                        {fmtJPY(singleResult.include)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center py-3 bg-orange-50 rounded-lg px-3">
                      <span className="text-sm font-bold text-orange-800">消費税額</span>
                      <span className="text-2xl font-bold text-orange-800">
                        {fmtJPY(singleResult.tax)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {itemResults && multiMode && grandTotals && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-3">複数明細 計算結果</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-xs">
                        <th className="py-2 px-2 text-left">品名</th>
                        <th className="py-2 px-2 text-right">税抜</th>
                        <th className="py-2 px-2 text-right">税率</th>
                        <th className="py-2 px-2 text-right">消費税</th>
                        <th className="py-2 px-2 text-right">税込</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemResults.map((r, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="py-2 px-2 text-gray-700 max-w-[80px] truncate">
                            {r.name || `品目${idx + 1}`}
                          </td>
                          <td className="py-2 px-2 text-right">{r.exclude.toLocaleString()}</td>
                          <td className="py-2 px-2 text-right text-xs text-gray-500">
                            {r.rate === 0.1 ? "10%" : "8%"}
                          </td>
                          <td className="py-2 px-2 text-right text-orange-600">
                            {r.tax.toLocaleString()}
                          </td>
                          <td className="py-2 px-2 text-right font-medium">
                            {r.include.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-blue-50 border-t-2 border-blue-200 font-bold text-blue-800">
                        <td className="py-3 px-2">合計</td>
                        <td className="py-3 px-2 text-right">{grandTotals.exclude.toLocaleString()}</td>
                        <td className="py-3 px-2"></td>
                        <td className="py-3 px-2 text-right text-orange-700">
                          {grandTotals.tax.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-right text-lg">
                          {fmtJPY(grandTotals.include)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {!singleResult && !itemResults && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
                <p className="text-4xl mb-3">🧾</p>
                <p className="text-sm">金額を入力して「計算する」を押してください</p>
              </div>
            )}

            <p className="text-xs text-gray-400 leading-relaxed">
              ※インボイス制度対応。軽減税率（8%）は食料品・新聞等に適用されます。
            </p>
          </div>
        </div>

        {/* よくある計算例 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">よくある計算例</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-4 py-3 text-left font-semibold">税抜金額</th>
                    <th className="px-4 py-3 text-left font-semibold">税率</th>
                    <th className="px-4 py-3 text-left font-semibold">消費税額</th>
                    <th className="px-4 py-3 text-left font-semibold">税込金額</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["1,000円", "10%", "100円", "1,100円"],
                    ["1,000円", "8%", "80円", "1,080円"],
                    ["5,000円", "10%", "500円", "5,500円"],
                    ["10,000円", "10%", "1,000円", "11,000円"],
                    ["50,000円", "10%", "5,000円", "55,000円"],
                  ].map(([excl, rate, tax, incl], i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800">{excl}</td>
                      <td className="px-4 py-3 text-gray-800">{rate}</td>
                      <td className="px-4 py-3 text-orange-600 font-medium">{tax}</td>
                      <td className="px-4 py-3 font-semibold text-blue-700">{incl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-sm font-semibold text-gray-700 mb-3">逆算（税込→税抜）の例：</p>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="px-4 py-3 text-left font-semibold">税込金額</th>
                    <th className="px-4 py-3 text-left font-semibold">税率</th>
                    <th className="px-4 py-3 text-left font-semibold">税抜金額</th>
                    <th className="px-4 py-3 text-left font-semibold">消費税額</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["1,100円", "10%", "1,000円", "100円"],
                    ["1,080円", "8%", "1,000円", "80円"],
                    ["11,000円", "10%", "10,000円", "1,000円"],
                    ["55,000円", "10%", "50,000円", "5,000円"],
                  ].map(([incl, rate, excl, tax], i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-indigo-700">{incl}</td>
                      <td className="px-4 py-3 text-gray-800">{rate}</td>
                      <td className="px-4 py-3 text-gray-800">{excl}</td>
                      <td className="px-4 py-3 text-orange-600 font-medium">{tax}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 消費税の計算方法 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">消費税の計算方法</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              消費税は商品・サービスの購入時に課税される間接税です。
              現在の税率は標準税率10%と軽減税率8%の2種類があります。
            </p>
            <div>
              <p className="font-semibold text-gray-800 mb-2">標準税率（10%）が適用されるもの：</p>
              <ul className="space-y-1.5 ml-4">
                <li className="flex gap-2"><span className="text-blue-500 mt-0.5">•</span><span>一般的な商品・サービス全般</span></li>
                <li className="flex gap-2"><span className="text-blue-500 mt-0.5">•</span><span>外食（レストラン・カフェでの飲食）</span></li>
                <li className="flex gap-2"><span className="text-blue-500 mt-0.5">•</span><span>アルコール飲料</span></li>
                <li className="flex gap-2"><span className="text-blue-500 mt-0.5">•</span><span>テイクアウト以外の飲食サービス</span></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-2">軽減税率（8%）が適用されるもの：</p>
              <ul className="space-y-1.5 ml-4">
                <li className="flex gap-2"><span className="text-blue-500 mt-0.5">•</span><span>食料品（酒類を除く）</span></li>
                <li className="flex gap-2"><span className="text-blue-500 mt-0.5">•</span><span>定期購読の新聞</span></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">端数処理について：</p>
              <p>消費税の端数処理は「切り捨て・切り上げ・四捨五入」のいずれも法的に認められています。
              インボイス制度（適格請求書等保存方式）では、1つの請求書につき税率ごとに端数処理を行います。</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">インボイス制度（2023年10月〜）：</p>
              <p>適格請求書発行事業者は、税率ごとの消費税額を明記した請求書の発行が必要です。
              本ツールはインボイス制度に対応した消費税計算が可能です。</p>
            </div>
          </div>
        </div>

        {/* よくある質問 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-3">
            {[
              {
                q: "消費税の税率は10%と8%のどちらを使えばいいですか？",
                a: "食料品（酒類除く）と定期購読の新聞には軽減税率8%が適用されます。それ以外の商品・サービスには標準税率10%が適用されます。外食・テイクアウトは10%、スーパーの食品は8%が基本です。"
              },
              {
                q: "税込価格から税抜価格を計算する方法は？",
                a: "税抜価格 = 税込価格 ÷ 1.1（10%の場合）または ÷ 1.08（8%の場合）です。例えば税込1,100円なら税抜1,000円、消費税100円となります。本ツールの「税込→税抜」モードで簡単に計算できます。"
              },
              {
                q: "インボイス制度とは何ですか？",
                a: "2023年10月から始まった制度で、消費税の仕入税額控除を受けるために「適格請求書（インボイス）」の保存が必要になりました。適格請求書には登録番号・税率・税額の明記が必要です。免税事業者との取引では仕入税額控除が受けられなくなる場合があります。"
              },
              {
                q: "複数の商品をまとめて消費税計算したい場合は？",
                a: "本ツールの「複数明細モード」をONにすると、品名・金額・税率を行ごとに入力して一括計算できます。最大10行まで対応しており、合計税額と税込総額を自動計算します。"
              },
              {
                q: "消費税の端数はどう処理すればいいですか？",
                a: "切り捨て・切り上げ・四捨五入のいずれも法律上認められています。ただしインボイス制度では1枚の請求書につき、税率ごとに1回だけ端数処理を行うことが原則です。本ツールで3種類の端数処理を切り替えて確認できます。"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <p className="font-semibold text-gray-800 mb-2 flex gap-2">
                  <span className="text-blue-600 font-bold shrink-0">Q{i + 1}.</span>
                  {item.q}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed flex gap-2">
                  <span className="text-green-600 font-bold shrink-0">A.</span>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* あわせて使えるツール */}
        <div className="pb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/tax/income-tax-calculator", label: "所得税・住民税 計算機", desc: "年収・家族構成から税負担をシミュレーション" },
              { href: "/tax/furusato-nozei-calculator", label: "ふるさと納税 控除額計算機", desc: "年収・家族構成から控除上限額を計算" },
              { href: "/tax/inheritance-tax-calculator", label: "相続税 簡易計算機", desc: "遺産総額から相続税の目安を計算" },
              { href: "/tax/gift-tax-calculator", label: "贈与税 計算機", desc: "贈与金額から贈与税額を計算" },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-start gap-3 bg-white rounded-xl border border-blue-100 hover:border-blue-400 hover:shadow-md transition-all p-4 group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-700 group-hover:text-blue-800">{tool.label}</p>
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
      {/* 広告 */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <AdUnit position="mid" format="horizontal" />
      </div>

  </>
  );
}
