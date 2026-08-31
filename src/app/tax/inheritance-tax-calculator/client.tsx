"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface HeirResult {
  label: string;
  share: number;
  amount: number;
  taxBefore: number;
  taxAfter: number;
}

interface CalcResult {
  basicDeduction: number;
  taxableEstate: number;
  totalTaxBefore: number;
  spouseDeduction: number;
  totalTaxAfter: number;
  heirs: HeirResult[];
  noTax: boolean;
}

function calcTax(amount: number): number {
  if (amount <= 1000) return amount * 0.1;
  if (amount <= 3000) return amount * 0.15 - 50;
  if (amount <= 5000) return amount * 0.2 - 200;
  if (amount <= 10000) return amount * 0.3 - 700;
  if (amount <= 20000) return amount * 0.4 - 1700;
  if (amount <= 30000) return amount * 0.45 - 2700;
  if (amount <= 60000) return amount * 0.5 - 4200;
  return amount * 0.55 - 7200;
}

function fmtMan(n: number): string {
  return Math.round(n).toLocaleString("ja-JP") + "万円";
}

function calculate(
  estate: number,
  debts: number,
  totalHeirs: number,
  hasSpouse: boolean,
  childCount: number
): CalcResult {
  const basicDeduction = 3000 + 600 * totalHeirs;
  const taxableEstate = estate - debts - basicDeduction;

  if (taxableEstate <= 0) {
    return {
      basicDeduction,
      taxableEstate,
      totalTaxBefore: 0,
      spouseDeduction: 0,
      totalTaxAfter: 0,
      heirs: [],
      noTax: true,
    };
  }

  const heirs: HeirResult[] = [];

  if (hasSpouse && childCount > 0) {
    const spouseAmount = taxableEstate * 0.5;
    const spouseTax = calcTax(spouseAmount);
    heirs.push({ label: "配偶者", share: 0.5, amount: spouseAmount, taxBefore: spouseTax, taxAfter: spouseTax });
    const childShare = 0.5 / childCount;
    const childAmount = taxableEstate * childShare;
    const childTax = calcTax(childAmount);
    for (let i = 1; i <= childCount; i++) {
      heirs.push({ label: `子${i}`, share: childShare, amount: childAmount, taxBefore: childTax, taxAfter: childTax });
    }
  } else if (hasSpouse && childCount === 0) {
    const spouseTax = calcTax(taxableEstate);
    heirs.push({ label: "配偶者", share: 1, amount: taxableEstate, taxBefore: spouseTax, taxAfter: spouseTax });
  } else {
    const childShare = 1 / childCount;
    const childAmount = taxableEstate * childShare;
    const childTax = calcTax(childAmount);
    for (let i = 1; i <= childCount; i++) {
      heirs.push({ label: `子${i}`, share: childShare, amount: childAmount, taxBefore: childTax, taxAfter: childTax });
    }
  }

  const totalTaxBefore = heirs.reduce((s, h) => s + h.taxBefore, 0);

  let spouseDeduction = 0;
  if (hasSpouse) {
    const spouseHeir = heirs.find((h) => h.label === "配偶者");
    if (spouseHeir && spouseHeir.amount <= 16000) {
      spouseDeduction = spouseHeir.taxBefore;
      spouseHeir.taxAfter = 0;
    }
  }

  const totalTaxAfter = totalTaxBefore - spouseDeduction;
  return { basicDeduction, taxableEstate, totalTaxBefore, spouseDeduction, totalTaxAfter, heirs, noTax: false };
}

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "相続税 簡易計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "遺産総額と相続人の人数を入力するだけで相続税を簡単計算。基礎控除・配偶者控除・法定相続分を自動反映。2024年度税制対応の無料シミュレーター。",
      "url": "https://yamada-tools.jp/tax/inheritance-tax-calculator"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "税金計算", "item": "https://yamada-tools.jp/tax" },
        { "@type": "ListItem", "position": 3, "name": "相続税 簡易計算機", "item": "https://yamada-tools.jp/tax/inheritance-tax-calculator" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "相続税がかからない場合でも申告は必要ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "遺産総額が基礎控除額（3,000万円+600万円×法定相続人数）以下であれば原則申告不要です。ただし配偶者控除や小規模宅地等の特例を使って税額ゼロになる場合は申告が必要です。" }
        },
        {
          "@type": "Question",
          "name": "相続税の申告期限はいつですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "相続開始を知った日の翌日から10ヶ月以内です。期限を過ぎると延滞税・加算税が課される場合があります。" }
        },
        {
          "@type": "Question",
          "name": "生命保険金は相続税の対象になりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "死亡保険金は相続税の課税対象ですが、500万円×法定相続人の人数までは非課税です。法定相続人が3人なら1,500万円まで非課税となります。" }
        },
        {
          "@type": "Question",
          "name": "不動産を相続した場合、評価額はどう計算しますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "土地は路線価方式または倍率方式で評価し、路線価は時価の約80%が目安です。小規模宅地等の特例を適用すると居住用宅地は最大80%減額されます。" }
        },
        {
          "@type": "Question",
          "name": "相続税対策として有効な方法は何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "生前贈与（年110万円の基礎控除活用）、生命保険の非課税枠活用（500万円×相続人数）、小規模宅地等の特例の活用などが有効です。具体的な対策は税理士にご相談ください。" }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "相続税の計算方法",
      "description": "遺産総額と相続人構成から相続税を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "遺産総額を入力", "text": "遺産総額と債務・葬儀費用を万円単位で入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "相続人を入力", "text": "法定相続人の人数・配偶者の有無・子供の人数を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」ボタンを押すと基礎控除・課税遺産・相続税額が表示されます。" }
      ]
    }
  ]
};

export default function InheritanceTaxCalculatorClient() {
  const [estate, setEstate] = useState("");
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [debts, setDebts] = useState("");
  const [totalHeirs, setTotalHeirs] = useState("1");
  const [hasSpouse, setHasSpouse] = useState(false);
  const [childCount, setChildCount] = useState("0");
  const [result, setResult] = useState<CalcResult | null>(null);

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const toggleClass = (active: boolean) =>
    `flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
      active ? "bg-kon text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  function handleCalculate() {
    const estateVal = parseFloat(estate);
    const debtsVal = parseFloat(debts) || 0;
    const totalHeirsVal = parseInt(totalHeirs) || 1;
    const childCountVal = parseInt(childCount) || 0;
    if (isNaN(estateVal) || estateVal <= 0) return;
    const res = calculate(estateVal, debtsVal, totalHeirsVal, hasSpouse, childCountVal);
    setResult(res);
    setMascotState("success");
  }

  function handleReset() {
    setEstate("");
    setDebts("");
    setTotalHeirs("1");
    setHasSpouse(false);
    setChildCount("0");
    setResult(null);
  }

  const childOptions = Array.from({ length: 10 }, (_, i) => i);
  const heirOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  const faqItems = [
    { question: "相続税の基礎控除はいくらですか？", answer: "基礎控除額 = 3,000万円 ＋（600万円 × 法定相続人の数）です。例えば法定相続人が配偶者＋子2人の場合、3,000万円＋1,800万円＝4,800万円まで非課税です。" },
    { question: "配偶者の相続税は優遇されますか？", answer: "はい、配偶者控除により法定相続分または1億6,000万円のいずれか多い金額まで非課税です。多くの場合、配偶者は相続税がゼロになります。ただし二次相続（配偶者が亡くなった時）の税負担増に注意が必要です。" },
    { question: "相続税の申告期限はいつですか？", answer: "被相続人（亡くなった方）が死亡したことを知った日の翌日から10ヶ月以内です。期限を過ぎると無申告加算税（最大20%）や延滞税が発生するため注意が必要です。" },
  ];

  const useCases = [
    { icon: "🏛️", persona: "相続が発生した・近い将来予想される方", title: "相続税がかかるかどうか事前確認したい", benefit: "基礎控除額と遺産総額を比較して申告要否を判定" },
    { icon: "👫", persona: "配偶者・子どもへの相続を計画中の方", title: "配偶者控除でいくら非課税になるか確認したい", benefit: "配偶者控除1.6億円の適用シミュレーション" },
    { icon: "📅", persona: "相続税申告の期限が心配な方", title: "申告期限と必要な手続きを確認したい", benefit: "10ヶ月以内の期限と無申告加算税のリスクを確認" },
  ];

  return (
    <>
      <IntroSection title="相続税 簡易計算機" paragraphs={["遺産総額・法定相続人の数を入力すると相続税の基礎控除額と概算税額がわかります。配偶者控除（1億6,000万円）や各相続人の取得分に応じた税額配分も確認できます。", "二次相続（配偶者が亡くなった際の再課税）のリスクも考慮した試算が可能です。", "登録不要・完全無料。相続対策の検討や、申告が必要かどうかの概算確認に最適です。"]} />
      <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="bg-gradient-to-r from-blue-700 to-kon text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">相続税 簡易計算機</h1>
          <p className="text-gin text-sm md:text-base">
            遺産総額と相続人を入力するだけ。基礎控除・配偶者控除・法定相続分を自動計算。2024年度対応。
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-base font-bold text-gray-800 border-b pb-2">入力項目</h2>

            <div>
              <label className={labelClass}>遺産総額（万円）</label>
              <input
                type="number"
                className={inputClass}
                placeholder="例：5000"
                value={estate}
                onChange={(e) => setEstate(e.target.value)}
                min="0"
              />
            </div>

            <div>
              <label className={labelClass}>債務・葬儀費用（万円）</label>
              <input
                type="number"
                className={inputClass}
                placeholder="例：200"
                value={debts}
                onChange={(e) => setDebts(e.target.value)}
                min="0"
              />
            </div>

            <div>
              <label className={labelClass}>法定相続人の人数</label>
              <select
                className={inputClass}
                value={totalHeirs}
                onChange={(e) => setTotalHeirs(e.target.value)}
              >
                {heirOptions.map((n) => (
                  <option key={n} value={n}>{n}人</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>内、配偶者</label>
              <div className="flex gap-2">
                <button type="button" className={toggleClass(!hasSpouse)} onClick={() => setHasSpouse(false)}>
                  なし
                </button>
                <button type="button" className={toggleClass(hasSpouse)} onClick={() => setHasSpouse(true)}>
                  あり（1人）
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>内、子供の人数</label>
              <select
                className={inputClass}
                value={childCount}
                onChange={(e) => setChildCount(e.target.value)}
              >
                {childOptions.map((n) => (
                  <option key={n} value={n}>{n}人</option>
                ))}
              </select>
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

          {/* Results Panel */}
          <div className="space-y-4">
            {result ? (
              result.noTax ? (
                <div className="bg-white rounded-xl shadow-sm border border-green-200 p-8 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <p className="text-xl font-bold text-green-600 mb-2">相続税はかかりません</p>
                  <p className="text-sm text-gray-500">基礎控除額: {fmtMan(result.basicDeduction)}</p>
                  <p className="text-xs text-gray-400 mt-2">遺産総額が基礎控除以下のため相続税は発生しません。</p>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">計算結果サマリー</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1.5 border-b">
                        <span className="text-gray-600">基礎控除額</span>
                        <span className="font-medium">{fmtMan(result.basicDeduction)}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b">
                        <span className="text-gray-600">課税遺産総額</span>
                        <span className="font-medium text-kon">{fmtMan(result.taxableEstate)}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b">
                        <span className="text-gray-600">相続税総額（控除前）</span>
                        <span className="font-medium">{fmtMan(result.totalTaxBefore)}</span>
                      </div>
                      {result.spouseDeduction > 0 && (
                        <div className="flex justify-between py-1.5 border-b">
                          <span className="text-gray-600">配偶者控除額</span>
                          <span className="font-medium text-green-600">－{fmtMan(result.spouseDeduction)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-3 mt-1">
                        <span className="text-sm font-bold text-kon">最終相続税額</span>
                        <span className="text-2xl font-bold text-kon">{fmtMan(result.totalTaxAfter)}</span>
                      </div>
                    </div>
                  </div>

                  {result.heirs.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                      <h3 className="text-sm font-bold text-gray-700 mb-3">各相続人の負担額</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 text-gray-600 text-xs">
                              <th className="py-2 px-2 text-left">相続人</th>
                              <th className="py-2 px-2 text-right">法定相続分</th>
                              <th className="py-2 px-2 text-right">取得金額</th>
                              <th className="py-2 px-2 text-right">相続税</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.heirs.map((heir, idx) => (
                              <tr key={idx} className="border-t">
                                <td className="py-2 px-2 text-gray-700 font-medium">{heir.label}</td>
                                <td className="py-2 px-2 text-right text-gray-500">{(heir.share * 100).toFixed(1)}%</td>
                                <td className="py-2 px-2 text-right">{fmtMan(heir.amount)}</td>
                                <td className="py-2 px-2 text-right font-medium text-kon">
                                  {heir.taxAfter === 0 && heir.taxBefore > 0 ? (
                                    <span className="text-green-600">
                                      0万円<span className="text-xs text-gray-400 ml-1">(控除済)</span>
                                    </span>
                                  ) : (
                                    fmtMan(heir.taxAfter)
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
                <p className="text-4xl mb-3">🏛️</p>
                <p className="text-sm">遺産総額と相続人を入力して「計算する」を押してください</p>
              </div>
            )}

            <p className="text-xs text-gray-400 leading-relaxed">
              ※簡易計算です。実際の相続税は税理士にご相談ください。小規模宅地等の特例は考慮していません。
            </p>
          </div>
        </div>

        {/* よくある計算例 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">よくある計算例</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-kon text-white">
                    <th className="px-4 py-3 text-left font-semibold">遺産総額</th>
                    <th className="px-4 py-3 text-left font-semibold">相続人</th>
                    <th className="px-4 py-3 text-left font-semibold">基礎控除</th>
                    <th className="px-4 py-3 text-left font-semibold">相続税目安</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["3,000万円", "配偶者+子1人", "4,200万円", "0円（非課税）", true],
                    ["5,000万円", "配偶者+子2人", "4,800万円", "約40万円", false],
                    ["8,000万円", "配偶者+子2人", "4,800万円", "約235万円", false],
                    ["1億円", "配偶者+子3人", "5,400万円", "約315万円", false],
                    ["2億円", "配偶者+子2人", "4,800万円", "約1,670万円", false],
                  ].map(([estate, heirs, deduction, tax, isZero], i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800">{estate}</td>
                      <td className="px-4 py-3 text-gray-800">{heirs}</td>
                      <td className="px-4 py-3 text-gray-800">{deduction}</td>
                      <td className={`px-4 py-3 font-semibold ${isZero ? "text-green-600" : "text-kon"}`}>{tax}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 相続税の基本知識 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">相続税の基本知識</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              相続税は、亡くなった方（被相続人）から財産を受け継いだ際に課税される税金です。
              すべての相続に課税されるわけではなく、基礎控除額を超えた場合のみ申告・納税が必要です。
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-kon mb-2">基礎控除の計算式：</p>
              <p className="text-kon font-mono text-base">3,000万円 + （600万円 × 法定相続人の人数）</p>
              <p className="text-xs text-kon mt-2">例：配偶者と子供2人の場合<br />3,000万円 + 600万円 × 3人 = 4,800万円<br />→ 遺産総額が4,800万円以下なら相続税はかかりません</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-2">法定相続人と法定相続分：</p>
              <ul className="space-y-1.5 ml-4">
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span>配偶者と子供がいる場合：配偶者1/2、子供で残り1/2を均等分割</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span>配偶者のみの場合：配偶者が全額取得</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span>子供のみの場合：子供で均等分割</span></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-2">主な相続税の控除：</p>
              <ul className="space-y-1.5 ml-4">
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span><span className="font-medium">配偶者控除：</span>配偶者が取得した財産が1億6,000万円以下なら相続税ゼロ</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span><span className="font-medium">未成年者控除：</span>18歳までの年数×10万円</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span><span className="font-medium">障害者控除：</span>85歳までの年数×10万円（特別障害者は20万円）</span></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">申告期限：</p>
              <p>相続開始を知った日の翌日から10ヶ月以内に申告・納税が必要です。</p>
            </div>
          </div>
        </div>

        {/* よくある質問 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-3">
            {[
              {
                q: "相続税がかからない場合でも申告は必要ですか？",
                a: "遺産総額が基礎控除額（3,000万円+600万円×法定相続人数）以下であれば、原則として申告は不要です。ただし配偶者控除や小規模宅地等の特例を使って税額がゼロになる場合は、申告が必要です。"
              },
              {
                q: "相続税の申告期限はいつですか？",
                a: "相続開始を知った日の翌日から10ヶ月以内です。例えば1月15日に亡くなった場合、11月15日が申告・納税の期限です。期限を過ぎると延滞税・加算税が課される場合があります。"
              },
              {
                q: "生命保険金は相続税の対象になりますか？",
                a: "死亡保険金は相続税の課税対象ですが、「500万円×法定相続人の人数」までは非課税です。例えば法定相続人が3人いれば1,500万円まで非課税となります。"
              },
              {
                q: "不動産を相続した場合、評価額はどう計算しますか？",
                a: "土地は「路線価方式」または「倍率方式」で評価します。路線価は時価の約80%が目安です。建物は固定資産税評価額で評価します。小規模宅地等の特例を適用すると、居住用宅地は最大80%減額されます。本ツールは簡易計算のため不動産評価は含まれていません。"
              },
              {
                q: "相続税対策として有効な方法は何ですか？",
                a: "主な対策として、生前贈与（年110万円の基礎控除活用）、生命保険の非課税枠活用（500万円×相続人数）、小規模宅地等の特例の活用、相続時精算課税制度の活用などがあります。具体的な対策は税理士にご相談ください。"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <p className="font-semibold text-gray-800 mb-2 flex gap-2">
                  <span className="text-kon font-bold shrink-0">Q{i + 1}.</span>
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
              { href: "/tax/gift-tax-calculator", label: "贈与税 計算機", desc: "贈与金額から贈与税額を計算" },
              { href: "/tax/income-tax-calculator", label: "所得税・住民税 計算機", desc: "年収・家族構成から税負担をシミュレーション" },
              { href: "/insurance/life-insurance-calculator", label: "生命保険 必要保障額計算機", desc: "年収・家族構成から必要な保険金額を診断" },
              { href: "/blog/rougo-shikin-simulation-2026", label: "老後資金シミュレーター", desc: "老後に必要な資金と不足額を計算" },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 hover:border-ai hover:shadow-md transition-all p-4 group"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-50 group-hover:bg-ai flex items-center justify-center shrink-0 transition-colors">
                  <svg className="w-5 h-5 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-kon group-hover:text-ai">{tool.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        {/* 関連ブログ記事 */}
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
          <Link
            href="/blog/souzokuzei-simulation-2026"
            className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-kon hover:border-ai hover:shadow-md transition-all p-5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-50 group-hover:bg-ai flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-6 h-6 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-kon group-hover:text-ai">【2026年最新】相続税シミュレーション完全ガイド｜基礎控除・税率・計算方法</p>
              <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
            </div>
          </Link>
        </div>
        </div>

      </div>
    </div>
    <UseCasesSection cases={useCases} />
    <FAQSection faq={faqItems} />
      {/* 広告 */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <AdUnit slot="5612038947" format="horizontal" />
      </div>

  </>
  );
}
