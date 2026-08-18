"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";

interface FormState {
  nyuinDays: string;
  nichigaku: string;
  surgeryMultiplier: string;
  hasSurgery: boolean;
  hasAdvancedRider: boolean;
  advancedCost: string;
}

interface CalcResult {
  nyuinKyufu: number;
  shujutsuKyufu: number;
  sensinKyufu: number;
  goukei: number;
  nyuinHiyou: number;
  kougatsuJiko: number;
  jissitsuFutan: number;
}

const DEFAULT_FORM: FormState = {
  nyuinDays: "",
  nichigaku: "10000",
  surgeryMultiplier: "0",
  hasSurgery: false,
  hasAdvancedRider: false,
  advancedCost: "",
};

function fmt(val: number): string {
  return val.toLocaleString();
}

function calculate(form: FormState): CalcResult {
  const days = parseInt(form.nyuinDays);
  const nichigaku = parseInt(form.nichigaku);
  const multiplier = parseInt(form.surgeryMultiplier);
  const advancedCostYen = (parseFloat(form.advancedCost) || 0) * 10000;

  const nyuinKyufu = days * nichigaku;
  const shujutsuKyufu = form.hasSurgery ? nichigaku * multiplier : 0;
  const sensinKyufu = form.hasAdvancedRider ? advancedCostYen : 0;
  const goukei = nyuinKyufu + shujutsuKyufu + sensinKyufu;

  const nyuinHiyou = days * 25000;
  const kougatsuJiko = Math.min(nyuinHiyou * 0.3, 87430);
  const jissitsuFutan = Math.max(0, kougatsuJiko - goukei);

  return {
    nyuinKyufu,
    shujutsuKyufu,
    sensinKyufu,
    goukei,
    nyuinHiyou,
    kougatsuJiko,
    jissitsuFutan,
  };
}

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "医療保険 入院給付金シミュレーター",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "入院日数・日額・手術の有無から医療保険の給付金と実質自己負担額を無料で計算できるツールです。",
      "url": "https://yamada-tools.jp/insurance/medical-insurance-sim"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "保険・税金計算", "item": "https://yamada-tools.jp/insurance" },
        { "@type": "ListItem", "position": 3, "name": "医療保険 入院給付金シミュレーター", "item": "https://yamada-tools.jp/insurance/medical-insurance-sim" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "医療保険の日額はいくらが適切ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "一般的には日額5,000円〜10,000円が目安です。高額療養費制度により1ヶ月の自己負担上限は約87,430円（標準所得）のため、日額5,000円×30日=15万円の給付金があれば十分カバーできます。" }
        },
        {
          "@type": "Question",
          "name": "高額療養費制度があれば医療保険は不要ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "高額療養費制度は医療費のみをカバーします。差額ベッド代・食事代・交通費・収入減少はカバーされないため、医療保険は引き続き有効です。" }
        },
        {
          "@type": "Question",
          "name": "先進医療特約は必要ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "先進医療は1回で数百万円かかることがあり公的保険が適用されません。保険料は月数百円程度と安いため、コストパフォーマンスは高いとされています。" }
        },
        {
          "@type": "Question",
          "name": "入院給付金に税金はかかりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "個人が受け取る入院給付金は原則非課税です。所得税・住民税の対象外となります。" }
        },
        {
          "@type": "Question",
          "name": "手術給付金の倍率はどう選べばよいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "一般的な手術は10〜20倍、大手術に備えるなら40倍が安心です。倍率が高いほど保険料も上がるため、必要性とのバランスで選びましょう。" }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "医療保険の給付金シミュレーション方法",
      "description": "入院日数・日額・手術の有無から給付金を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "入院情報を入力", "text": "入院日数と日額給付金を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "手術・特約を選択", "text": "手術の有無・倍率・先進医療特約の有無を選択します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」ボタンを押すと給付金合計と実質自己負担額が表示されます。" }
      ]
    }
  ]
};

export default function MedicalInsuranceSimClient() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState("");

  function handleChange(key: keyof FormState, value: string | boolean) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "hasSurgery" && value === false) {
        next.surgeryMultiplier = "0";
      }
      return next;
    });
    setResult(null);
    setError("");
  }

  function handleCalculate() {
    const days = parseInt(form.nyuinDays);
    if (!form.nyuinDays || isNaN(days) || days < 1 || days > 180) {
      setError("入院日数は1〜180の範囲で入力してください");
      return;
    }
    if (form.hasSurgery && form.surgeryMultiplier === "0") {
      setError("手術ありの場合は手術給付金倍率を選択してください");
      return;
    }
    if (form.hasAdvancedRider && (!form.advancedCost || parseFloat(form.advancedCost) <= 0)) {
      setError("先進医療費用を入力してください");
      return;
    }
    setResult(calculate(form));
    setError("");
  }

  function handleReset() {
    setForm(DEFAULT_FORM);
    setResult(null);
    setError("");
  }

  const faqItems = [
    { question: "入院1日の費用はいくらかかりますか？", answer: "医療費の自己負担（3割）＋食事代＋差額ベッド代で、一般的に1日あたり1〜3万円が目安です。高額療養費制度を適用すると、月の自己負担上限は年収によって57,600円〜167,400円程度になります。" },
    { question: "高額療養費制度とはどういう制度ですか？", answer: "1ヶ月の医療費の自己負担が一定額（所得に応じた上限額）を超えた場合、超過分が払い戻される制度です。年収約370〜770万円の方の上限は月約87,000円です。食事代・差額ベッド代・先進医療は対象外です。" },
    { question: "医療保険の日額はいくら必要ですか？", answer: "高額療養費制度で医療費の自己負担は抑えられますが、差額ベッド代・食事代・日用品・収入減少を考えると日額5,000〜10,000円が一般的な目安です。貯蓄が少ない方や入院リスクが高い方は高めの設定が安心です。" },
  ];

  const useCases = [
    { icon: "🏥", persona: "医療保険への加入を検討している方", title: "日額いくらの保険に入ればいいか判断したい", benefit: "収入・貯蓄から最適な日額と入院給付金額を算出" },
    { icon: "💰", persona: "高額療養費制度を知りたい方", title: "実際の入院でいくら自己負担になるか知りたい", benefit: "高額療養費適用後の実質負担額を計算" },
    { icon: "🔄", persona: "既存の医療保険を見直したい方", title: "今の保険が過剰・不足でないか確認したい", benefit: "現在の保険と必要額のギャップを可視化" },
  ];

  return (
    <>
      <IntroSection title="医療保険 入院給付金シミュレーター" paragraphs={["入院日数・手術の有無・治療内容を入力すると、医療費の自己負担額と医療保険の給付金受取額をシミュレーションします。高額療養費制度を適用した自己負担上限額も計算。", "入院1日あたりの費用内訳（医療費3割・食事代・差額ベッド代）を考慮し、医療保険の日額（5,000円・10,000円等）別の過不足も確認できます。", "登録不要・完全無料。医療保険の加入・見直しを検討している方に最適です。"]} />
      <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            医療保険 入院給付金シミュレーター
          </h1>
          <p className="text-gray-600 text-sm">
            入院日数・日額・手術の有無を入力して、医療保険の給付金と実質自己負担額がわかります。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              入院・給付情報の入力
            </h2>

            <div className="space-y-4">
              {/* 入院日数 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  入院日数 <span className="text-danger">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={form.nyuinDays}
                    onChange={(e) => handleChange("nyuinDays", e.target.value)}
                    placeholder="例: 14"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent"
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">日</span>
                </div>
              </div>

              {/* 日額給付金 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  日額給付金
                </label>
                <select
                  value={form.nichigaku}
                  onChange={(e) => handleChange("nichigaku", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                >
                  {[3000, 5000, 10000, 15000, 20000].map((v) => (
                    <option key={v} value={v}>{v.toLocaleString()} 円</option>
                  ))}
                </select>
              </div>

              {/* 手術給付金倍率 */}
              <div className={!form.hasSurgery ? "opacity-40 pointer-events-none" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  手術給付金倍率
                </label>
                <select
                  value={form.surgeryMultiplier}
                  onChange={(e) => handleChange("surgeryMultiplier", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                >
                  <option value="0">なし</option>
                  <option value="10">10倍</option>
                  <option value="20">20倍</option>
                  <option value="40">40倍</option>
                </select>
              </div>

              {/* 手術あり？ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  手術あり？
                </label>
                <div className="flex gap-3">
                  {([{ label: "あり", value: true }, { label: "なし", value: false }] as const).map((opt) => (
                    <button type="button"
                      key={String(opt.value)}
                      onClick={() => handleChange("hasSurgery", opt.value)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        form.hasSurgery === opt.value
                          ? "bg-kon text-white border-kon"
                          : "bg-white text-gray-600 border-gray-300 hover:border-ai"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 先進医療特約あり？ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  先進医療特約あり？
                </label>
                <div className="flex gap-3">
                  {([{ label: "あり", value: true }, { label: "なし", value: false }] as const).map((opt) => (
                    <button type="button"
                      key={String(opt.value)}
                      onClick={() => handleChange("hasAdvancedRider", opt.value)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        form.hasAdvancedRider === opt.value
                          ? "bg-kon text-white border-kon"
                          : "bg-white text-gray-600 border-gray-300 hover:border-ai"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 先進医療費用 (conditional) */}
              {form.hasAdvancedRider && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    先進医療費用 <span className="text-danger">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={form.advancedCost}
                      onChange={(e) => handleChange("advancedCost", e.target.value)}
                      placeholder="例: 200"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon focus:border-transparent"
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">万円</span>
                  </div>
                </div>
              )}

              {error && (
                <p className="text-danger text-sm bg-gray-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button"
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  リセット
                </button>
                <button type="button"
                  onClick={handleCalculate}
                  className="flex-1 py-2.5 rounded-lg bg-kon text-white text-sm font-semibold hover:bg-ai transition-colors shadow-sm"
                >
                  計算する
                </button>
              </div>
            </div>
          </div>

          {/* Result Area */}
          <div className="flex flex-col gap-4">
            {result ? (
              <>
                <div className="bg-kon rounded-xl p-6 text-white shadow-sm">
                  <p className="text-sm font-medium opacity-80 mb-1">合計給付金</p>
                  <p className="text-4xl font-bold mb-1">
                    {fmt(result.goukei)}<span className="text-2xl ml-1">円</span>
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">給付金内訳</h3>
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-2 text-gray-600">入院給付金</td>
                        <td className="py-2 text-right font-medium text-gray-900">{fmt(result.nyuinKyufu)} 円</td>
                      </tr>
                      {form.hasSurgery && (
                        <tr>
                          <td className="py-2 text-gray-600">手術給付金</td>
                          <td className="py-2 text-right font-medium text-gray-900">{fmt(result.shujutsuKyufu)} 円</td>
                        </tr>
                      )}
                      {form.hasAdvancedRider && (
                        <tr>
                          <td className="py-2 text-gray-600">先進医療給付金</td>
                          <td className="py-2 text-right font-medium text-gray-900">{fmt(result.sensinKyufu)} 円</td>
                        </tr>
                      )}
                      <tr className="bg-gray-50">
                        <td className="py-2 px-2 text-kon font-medium">合計給付金</td>
                        <td className="py-2 px-2 text-right font-bold text-kon">{fmt(result.goukei)} 円</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">自己負担目安</h3>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-2 text-gray-600">入院費用目安</td>
                          <td className="py-2 text-right font-medium text-gray-900">{fmt(result.nyuinHiyou)} 円</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-600">高額療養費後の自己負担</td>
                          <td className="py-2 text-right font-medium text-gray-900">{fmt(Math.round(result.kougatsuJiko))} 円</td>
                        </tr>
                        <tr style={{ backgroundColor: result.jissitsuFutan > 0 ? "#FEF2F2" : "#F0FDF4" }}>
                          <td className="py-2 px-2 font-medium" style={{ color: result.jissitsuFutan > 0 ? "#DC2626" : "#15803D" }}>
                            実質自己負担
                          </td>
                          <td className="py-2 px-2 text-right font-bold" style={{ color: result.jissitsuFutan > 0 ? "#DC2626" : "#15803D" }}>
                            {result.jissitsuFutan > 0 ? fmt(Math.round(result.jissitsuFutan)) + " 円" : "0 円（給付金で賄えます）"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="text-xs text-gray-400 px-1">
                  ※高額療養費制度（標準的な所得区分）を適用した概算です。実際の給付・自己負担額は保険契約内容により異なります。
                </p>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center text-center h-full min-h-64">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">左のフォームを入力して<br />「計算する」を押してください</p>
              </div>
            )}
          </div>
        </div>

        {/* よくある計算例 */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">よくある計算例</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-kon text-white">
                    <th className="px-4 py-3 text-left font-semibold">入院日数</th>
                    <th className="px-4 py-3 text-left font-semibold">日額給付金</th>
                    <th className="px-4 py-3 text-left font-semibold">手術</th>
                    <th className="px-4 py-3 text-left font-semibold">合計給付金目安</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">7日</td>
                    <td className="px-4 py-3 text-gray-800">5,000円</td>
                    <td className="px-4 py-3 text-gray-800">なし</td>
                    <td className="px-4 py-3 font-semibold text-kon">35,000円</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">14日</td>
                    <td className="px-4 py-3 text-gray-800">10,000円</td>
                    <td className="px-4 py-3 text-gray-800">あり(10倍)</td>
                    <td className="px-4 py-3 font-semibold text-kon">240,000円</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">30日</td>
                    <td className="px-4 py-3 text-gray-800">10,000円</td>
                    <td className="px-4 py-3 text-gray-800">あり(20倍)</td>
                    <td className="px-4 py-3 font-semibold text-kon">500,000円</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">60日</td>
                    <td className="px-4 py-3 text-gray-800">5,000円</td>
                    <td className="px-4 py-3 text-gray-800">なし</td>
                    <td className="px-4 py-3 font-semibold text-kon">300,000円</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">14日</td>
                    <td className="px-4 py-3 text-gray-800">10,000円</td>
                    <td className="px-4 py-3 text-gray-800">あり + 先進医療100万</td>
                    <td className="px-4 py-3 font-semibold text-kon">1,340,000円</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 医療保険の給付金とは */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">医療保険の給付金とは</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              入院給付金とは、病気やケガで入院した際に保険会社から受け取れる給付金です。
              日額×入院日数で計算され、実際の入院費用に関わらず受け取れるのが特徴です。
            </p>
            <div>
              <p className="font-semibold text-gray-800 mb-2">主な給付金の種類：</p>
              <ul className="space-y-1.5 ml-4">
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span><span className="font-medium">入院給付金：</span>入院1日あたりの給付金（日額3,000円〜20,000円が一般的）</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span><span className="font-medium">手術給付金：</span>手術を受けた際に日額の10〜40倍が支給</span></li>
                <li className="flex gap-2"><span className="text-kon mt-0.5">•</span><span><span className="font-medium">先進医療給付金：</span>公的保険が適用されない先進医療の費用を実費補償</span></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-2">高額療養費制度について：</p>
              <p>日本では公的医療保険により、1ヶ月の自己負担額に上限が設けられています。
              標準的な所得の方の場合、上限は約87,430円です。
              医療保険の給付金がこの上限を超える場合、実質的な自己負担はゼロになることもあります。</p>
            </div>
          </div>
        </div>

        {/* よくある質問 */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-3">
            {[
              {
                q: "医療保険の日額はいくらが適切ですか？",
                a: "一般的には日額5,000円〜10,000円が目安です。高額療養費制度により1ヶ月の自己負担上限は約87,430円（標準所得）のため、30日入院でも自己負担は約9万円です。日額5,000円×30日=15万円の給付金があれば十分カバーできます。"
              },
              {
                q: "高額療養費制度があれば医療保険は不要ですか？",
                a: "高額療養費制度は入院費の医療費のみをカバーします。差額ベッド代・食事代・交通費・仕事を休んだ際の収入減少はカバーされません。これらを考慮すると医療保険は引き続き有効です。"
              },
              {
                q: "先進医療特約は必要ですか？",
                a: "先進医療（陽子線治療など）は1回で数百万円かかることがあり、公的保険が適用されません。保険料は月数百円程度と安いため、コストパフォーマンスは高いとされています。"
              },
              {
                q: "入院給付金に税金はかかりますか？",
                a: "個人が受け取る入院給付金は原則非課税です。所得税・住民税の対象外となります。"
              },
              {
                q: "手術給付金の倍率はどう選べばよいですか？",
                a: "一般的な手術は10〜20倍、大手術に備えるなら40倍が安心です。ただし倍率が高いほど保険料も上がるため、必要性とのバランスで選びましょう。"
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
        <div className="mt-10 mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/insurance/life-insurance-calculator", label: "生命保険 必要保障額計算機", desc: "年収・家族構成から必要な保険金額を診断" },
              { href: "/tax/income-tax-calculator", label: "所得税・住民税 計算機", desc: "年収から税負担をシミュレーション" },
              { href: "/finance/retirement-simulator", label: "老後資金シミュレーター", desc: "老後に必要な資金と不足額を計算" },
              { href: "/tax/furusato-nozei-calculator", label: "ふるさと納税 控除額計算機", desc: "年収・家族構成から控除上限額を計算" },
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
            href="/blog/iryo-hoken-simulation-2026"
            className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-kon hover:border-ai hover:shadow-md transition-all p-5 group"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-50 group-hover:bg-ai flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-6 h-6 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-kon group-hover:text-ai">【2026年最新】医療保険は必要？不要？シミュレーションで判断する方法</p>
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
