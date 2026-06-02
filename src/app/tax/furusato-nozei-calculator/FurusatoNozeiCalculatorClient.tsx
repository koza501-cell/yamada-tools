"use client";

import { useState } from "react";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface CalcResult {
  salaryCut: number;
  salaryIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  incomeTaxRate: number;
  residentTaxIncome: number;
  limitAmount: number;
  incomeTaxRefund: number;
  residentTaxBasic: number;
  residentTaxSpecial: number;
  totalDeductionAmount: number;
}

function calcEmploymentDeduction(salary: number): number {
  if (salary <= 162.5) return 55;
  if (salary <= 180) return salary * 0.4 - 10;
  if (salary <= 360) return salary * 0.3 + 8;
  if (salary <= 660) return salary * 0.2 + 44;
  if (salary <= 850) return salary * 0.1 + 110;
  return 195;
}

function getIncomeTaxRate(taxable: number): number {
  if (taxable <= 195) return 0.05;
  if (taxable <= 330) return 0.1;
  if (taxable <= 695) return 0.2;
  if (taxable <= 900) return 0.23;
  if (taxable <= 1800) return 0.33;
  return 0.4;
}

function calcIncomeTax(taxable: number): number {
  if (taxable <= 195) return taxable * 0.05;
  if (taxable <= 330) return taxable * 0.1 - 9.75;
  if (taxable <= 695) return taxable * 0.2 - 42.75;
  if (taxable <= 900) return taxable * 0.23 - 63.6;
  if (taxable <= 1800) return taxable * 0.33 - 153.6;
  return taxable * 0.4 - 279.6;
}

function calculate(
  salary: number,
  hasSpouse: boolean,
  spouseIncome: number,
  dependents: number,
  socialInsAuto: boolean,
  socialInsManual: number,
  medicalDeduction: number,
  mortgageCredit: number
): CalcResult {
  const salaryCut = calcEmploymentDeduction(salary);
  const salaryIncome = Math.max(0, salary - salaryCut);

  const basicDeduction = 48;
  const socialIns = socialInsAuto ? salary * 0.1497 : socialInsManual;
  const spouseDeduction = !hasSpouse ? 0 : spouseIncome <= 103 ? 38 : spouseIncome <= 201 ? 26 : 0;
  const dependentDeduction = 38 * dependents;

  const totalDeductions = basicDeduction + socialIns + spouseDeduction + dependentDeduction + medicalDeduction;
  const taxableIncome = Math.max(0, salaryIncome - totalDeductions);

  let incomeTaxRate = getIncomeTaxRate(taxableIncome);

  if (mortgageCredit > 0 && taxableIncome > 0) {
    const baseTax = calcIncomeTax(taxableIncome) * 1.021;
    const taxAfterCredit = Math.max(0, baseTax - mortgageCredit);
    incomeTaxRate = taxAfterCredit / taxableIncome;
  }

  const residentDeductions = totalDeductions - basicDeduction + 43;
  const residentTaxableIncome = Math.max(0, salaryIncome - residentDeductions);
  const residentTaxIncome = residentTaxableIncome * 0.1;

  const residentTaxLimit = residentTaxIncome * 0.2;
  const denominator = 1 - incomeTaxRate * 1.021 - 0.1;
  const limitAmount = denominator > 0 ? residentTaxLimit / denominator + 0.2 : 0;

  const donation = Math.max(0, limitAmount - 0.2);
  const incomeTaxRefund = donation * incomeTaxRate * 1.021;
  const residentTaxBasic = donation * 0.1;
  const residentTaxSpecial = donation * (1 - incomeTaxRate * 1.021 - 0.1);
  const totalDeductionAmount = donation;

  return {
    salaryCut,
    salaryIncome,
    totalDeductions,
    taxableIncome,
    incomeTaxRate,
    residentTaxIncome,
    limitAmount,
    incomeTaxRefund,
    residentTaxBasic,
    residentTaxSpecial,
    totalDeductionAmount,
  };
}

function fmt1(val: number): string {
  return val.toFixed(1);
}

function getOtokuMessage(limit: number): { text: string; color: string } {
  if (limit < 1) return { text: "控除額は少額です。ワンストップ特例が便利です。", color: "text-gray-600" };
  if (limit < 5) return { text: "ふるさと納税を活用するとお得です！", color: "text-kon" };
  if (limit < 10) return { text: "積極的に活用できる金額です！", color: "text-green-600" };
  return { text: "かなりの控除が見込めます！複数自治体への寄附を検討しましょう。", color: "text-kon" };
}

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "ふるさと納税 控除額計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "年収と家族構成を入力するだけでふるさと納税の控除上限額を自動計算。所得税還付・住民税控除の内訳も表示。住宅ローン控除との併用も考慮。2024年度対応。",
      "url": "https://yamada-tools.jp/tax/furusato-nozei-calculator"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "税金計算", "item": "https://yamada-tools.jp/tax" },
        { "@type": "ListItem", "position": 3, "name": "ふるさと納税 控除額計算機", "item": "https://yamada-tools.jp/tax/furusato-nozei-calculator" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "ふるさと納税の上限額を超えたらどうなりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "上限額を超えた分は控除されず全額自己負担となります。上限5万円の方が8万円寄附した場合、超過分3万円は控除されず実質自己負担は3万2,000円になります。" }
        },
        {
          "@type": "Question",
          "name": "ワンストップ特例と確定申告どちらがいいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "給与所得者で寄附先が5自治体以内ならワンストップ特例がおすすめです。医療費控除・住宅ローン控除初年度・副業収入がある方は確定申告が必要です。" }
        },
        {
          "@type": "Question",
          "name": "ふるさと納税は年収いくらからお得ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "年収150万円以上で控除効果があります。実質的に返礼品のメリットを感じやすいのは年収300万円以上からです。年収が高いほど上限額が大きくなりよりお得です。" }
        },
        {
          "@type": "Question",
          "name": "共働き夫婦の場合、それぞれ別々にふるさと納税できますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、夫婦それぞれが個人の収入に応じた上限額でふるさと納税できます。合算はできません。それぞれの年収で上限額を計算し、別々に寄附・申告を行います。" }
        },
        {
          "@type": "Question",
          "name": "ふるさと納税の返礼品に税金はかかりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "返礼品は一時所得として扱われますが、年間50万円の特別控除があるため返礼品の価値が50万円を超えなければ課税されません。一般的な利用では課税対象になることはほとんどありません。" }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "ふるさと納税の控除上限額の計算方法",
      "description": "年収と家族構成からふるさと納税の控除上限額を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "年収と家族構成を入力", "text": "給与収入・配偶者の有無・扶養人数を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "控除情報を入力", "text": "医療費控除・住宅ローン控除がある場合は入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」ボタンを押すと寄附上限額と控除内訳が表示されます。" }
      ]
    }
  ]
};

export default function FurusatoNozeiCalculatorPage() {
  const [salary, setSalary] = useState("");
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [hasSpouse, setHasSpouse] = useState(false);
  const [spouseIncome, setSpouseIncome] = useState("");
  const [dependents, setDependents] = useState(0);
  const [socialInsAuto, setSocialInsAuto] = useState(true);
  const [socialInsManual, setSocialInsManual] = useState("");
  const [medicalDeduction, setMedicalDeduction] = useState("");
  const [mortgageCredit, setMortgageCredit] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);

  function handleCalculate() {
    const s = parseFloat(salary);
    if (isNaN(s) || s <= 0) return;
    const si = parseFloat(spouseIncome) || 0;
    const sm = parseFloat(socialInsManual) || 0;
    const med = parseFloat(medicalDeduction) || 0;
    const mort = parseFloat(mortgageCredit) || 0;
    setResult(calculate(s, hasSpouse, si, dependents, socialInsAuto, sm, med, mort));
  }

  function handleReset() {
    setSalary("");
    setHasSpouse(false);
    setSpouseIncome("");
    setDependents(0);
    setSocialInsAuto(true);
    setSocialInsManual("");
    setMedicalDeduction("");
    setMortgageCredit("");
    setResult(null);
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const toggleClass = (active: boolean) =>
    `flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
      active ? "bg-kon text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  const faqItems = [
    { question: "ふるさと納税の控除上限額はどう決まりますか？", answer: "控除上限額は年収と家族構成（扶養人数・共働きかどうか）によって決まります。おおよその目安は年収400万円の独身で約42,000円、年収600万円の共働き夫婦で約77,000円です。" },
    { question: "ワンストップ特例制度とは何ですか？", answer: "確定申告をしなくても寄付先の自治体に申請するだけで住民税控除が受けられる制度です。年間5自治体以内の寄付に限り利用でき、会社員など確定申告が不要な方に向いています。" },
    { question: "ふるさと納税は実質2,000円の自己負担とはどういう意味ですか？", answer: "控除上限額以内の寄付をすると、寄付額から2,000円を引いた金額が所得税の還付・住民税の控除として戻ってきます。例えば50,000円寄付すると48,000円が控除され、実質負担は2,000円になります。" },
  ];

  const useCases = [
    { icon: "🏡", persona: "ふるさと納税をこれからする方", title: "自分の上限額がいくらか知りたい", benefit: "年収・家族構成から控除上限額を自動計算" },
    { icon: "👨‍👩‍👧", persona: "共働き夫婦・扶養家族がいる方", title: "共働き世帯での上限額の計算が複雑で困っている", benefit: "世帯構成を反映した正確な上限額を計算" },
    { icon: "📝", persona: "確定申告をしない会社員", title: "ワンストップ特例が使えるか確認したい", benefit: "5自治体以内かどうかと手続き方法を案内" },
  ];

  return (
    <>
      <IntroSection title="ふるさと納税 控除上限額計算機" paragraphs={["年収と家族構成を入力するだけでふるさと納税の控除上限額（実質自己負担2,000円に収まる上限）を自動計算します。", "共働き・配偶者控除・扶養家族の有無など、よく混乱するケースも詳しく対応。ワンストップ特例と確定申告の選択判定も行います。", "登録不要・完全無料。今年のふるさと納税上限額を知りたい方に最適です。"]} />
      <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="bg-gradient-to-r from-blue-700 to-kon text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">ふるさと納税 控除上限額計算機</h1>
          <p className="text-gin text-sm md:text-base">
            年収・家族構成から控除上限額を自動計算。所得税還付・住民税控除の内訳も表示（2024年度税制）
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-base font-bold text-gray-800 border-b pb-2">入力項目</h2>

            <div>
              <label className={labelClass}>給与収入（万円）</label>
              <input
                type="number"
                className={inputClass}
                placeholder="例：500"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                min="0"
              />
            </div>

            <div>
              <label className={labelClass}>配偶者あり？</label>
              <div className="flex gap-2">
                <button type="button" className={toggleClass(!hasSpouse)} onClick={() => setHasSpouse(false)}>
                  なし
                </button>
                <button type="button" className={toggleClass(hasSpouse)} onClick={() => setHasSpouse(true)}>
                  あり
                </button>
              </div>
            </div>

            {hasSpouse && (
              <div>
                <label className={labelClass}>配偶者の年収（万円）</label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="例：103"
                  value={spouseIncome}
                  onChange={(e) => setSpouseIncome(e.target.value)}
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  103万以下→控除38万、201万以下→26万、超→0
                </p>
              </div>
            )}

            <div>
              <label className={labelClass}>扶養親族の人数</label>
              <select
                className={inputClass}
                value={dependents}
                onChange={(e) => setDependents(parseInt(e.target.value))}
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}人
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>社会保険料</label>
              <div className="flex gap-2 mb-2">
                <button type="button" className={toggleClass(socialInsAuto)} onClick={() => setSocialInsAuto(true)}>
                  自動計算（14.97%）
                </button>
                <button type="button" className={toggleClass(!socialInsAuto)} onClick={() => setSocialInsAuto(false)}>
                  手入力
                </button>
              </div>
              {!socialInsAuto && (
                <input
                  type="number"
                  className={inputClass}
                  placeholder="例：74.85"
                  value={socialInsManual}
                  onChange={(e) => setSocialInsManual(e.target.value)}
                  min="0"
                />
              )}
            </div>

            <div>
              <label className={labelClass}>医療費控除（万円）</label>
              <input
                type="number"
                className={inputClass}
                placeholder="0"
                value={medicalDeduction}
                onChange={(e) => setMedicalDeduction(e.target.value)}
                min="0"
              />
            </div>

            <div>
              <label className={labelClass}>住宅ローン控除（万円）</label>
              <input
                type="number"
                className={inputClass}
                placeholder="0"
                value={mortgageCredit}
                onChange={(e) => setMortgageCredit(e.target.value)}
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                住宅ローン控除がある場合、所得税から控除されるため上限額に影響します
              </p>
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
              <>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
                  <p className="text-sm text-kon font-medium mb-1">ふるさと納税の上限目安</p>
                  <p className="text-4xl font-bold text-kon mb-1">
                    {fmt1(result.limitAmount)}
                    <span className="text-lg font-normal ml-1">万円</span>
                  </p>
                  <p className="text-sm text-kon">
                    実質自己負担：<span className="font-bold">2,000円</span>
                  </p>
                </div>

                {(() => {
                  const msg = getOtokuMessage(result.limitAmount);
                  return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                      <p className={`text-sm font-medium ${msg.color}`}>💡 {msg.text}</p>
                    </div>
                  );
                })()}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">控除内訳</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">所得税還付額</td>
                        <td className="py-2 text-right font-medium text-kon">
                          {fmt1(result.incomeTaxRefund)} 万円
                        </td>
                      </tr>
                      <tr className="border-b bg-gray-50">
                        <td className="py-2 text-gray-600">住民税控除額（基本分）</td>
                        <td className="py-2 text-right font-medium text-indigo-700">
                          {fmt1(result.residentTaxBasic)} 万円
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">住民税控除額（特例分）</td>
                        <td className="py-2 text-right font-medium text-indigo-700">
                          {fmt1(result.residentTaxSpecial)} 万円
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-2 font-bold text-kon pl-2">合計控除額</td>
                        <td className="py-2 text-right font-bold text-kon">
                          {fmt1(result.totalDeductionAmount)} 万円
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">計算内訳</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-1.5 text-gray-600">給与収入</td>
                        <td className="py-1.5 text-right font-medium">
                          {fmt1(parseFloat(salary))} 万円
                        </td>
                      </tr>
                      <tr className="border-b bg-gray-50">
                        <td className="py-1.5 text-gray-600">給与所得控除</td>
                        <td className="py-1.5 text-right text-danger">
                          − {fmt1(result.salaryCut)} 万円
                        </td>
                      </tr>
                      <tr className="border-b font-semibold">
                        <td className="py-1.5">給与所得</td>
                        <td className="py-1.5 text-right">{fmt1(result.salaryIncome)} 万円</td>
                      </tr>
                      <tr className="border-b bg-gray-50">
                        <td className="py-1.5 text-gray-600 pl-3">所得控除合計</td>
                        <td className="py-1.5 text-right text-danger">
                          − {fmt1(result.totalDeductions)} 万円
                        </td>
                      </tr>
                      <tr className="border-b font-semibold">
                        <td className="py-1.5">課税所得（所得税）</td>
                        <td className="py-1.5 text-right">{fmt1(result.taxableIncome)} 万円</td>
                      </tr>
                      <tr className="border-b bg-gray-50">
                        <td className="py-1.5 text-gray-600">適用所得税率</td>
                        <td className="py-1.5 text-right">
                          {(result.incomeTaxRate * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5 text-gray-600">住民税所得割額</td>
                        <td className="py-1.5 text-right">{fmt1(result.residentTaxIncome)} 万円</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 text-xs text-yellow-800 leading-relaxed">
                  ※ワンストップ特例制度利用の場合、確定申告不要（寄附先5自治体以内）
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
                <p className="text-4xl mb-3">🏡</p>
                <p className="text-sm">給与収入を入力して「計算する」を押してください</p>
              </div>
            )}

            <p className="text-xs text-gray-400 leading-relaxed">
              ※2024年度税制に基づく概算です。実際の控除額は自治体・収入状況により異なります。
            </p>
          </div>
        </div>

        {/* よくある計算例 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">よくある計算例</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-kon text-white">
                  <th className="text-left px-3 py-2 rounded-tl-lg">年収</th>
                  <th className="text-left px-3 py-2">家族構成</th>
                  <th className="text-right px-3 py-2">寄附上限目安</th>
                  <th className="text-right px-3 py-2 rounded-tr-lg">実質自己負担</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { income: "300万円", family: "独身", limit: "約2.8万円", burden: "2,000円" },
                  { income: "400万円", family: "独身", limit: "約4.2万円", burden: "2,000円" },
                  { income: "500万円", family: "配偶者あり", limit: "約6.1万円", burden: "2,000円" },
                  { income: "600万円", family: "配偶者+子1人", limit: "約7.7万円", burden: "2,000円" },
                  { income: "800万円", family: "配偶者+子2人", limit: "約10.2万円", burden: "2,000円" },
                  { income: "1,000万円", family: "配偶者+子2人", limit: "約17.6万円", burden: "2,000円" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-3 py-2 font-medium text-gray-800">{row.income}</td>
                    <td className="px-3 py-2 text-gray-600">{row.family}</td>
                    <td className="px-3 py-2 text-right font-bold text-kon">{row.limit}</td>
                    <td className="px-3 py-2 text-right text-green-600 font-medium">{row.burden}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">※社会保険料を給与の14.97%、住宅ローン控除なしで試算した目安です。</p>
        </div>

        {/* ふるさと納税の仕組みと控除 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">ふるさと納税の仕組みと控除</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            ふるさと納税とは、応援したい自治体に寄附を行い、寄附金額から2,000円を引いた全額が所得税・住民税から控除される制度です。
          </p>

          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-gray-800 mb-2">控除の仕組み：</p>
              <ul className="space-y-1.5 pl-2">
                <li className="flex gap-2"><span className="text-kon shrink-0">・</span><span><strong>所得税還付</strong>：寄附金額（-2,000円）×所得税率分が還付</span></li>
                <li className="flex gap-2"><span className="text-kon shrink-0">・</span><span><strong>住民税控除（基本分）</strong>：寄附金額（-2,000円）×10%が翌年の住民税から控除</span></li>
                <li className="flex gap-2"><span className="text-kon shrink-0">・</span><span><strong>住民税控除（特例分）</strong>：残りの全額が住民税から控除</span></li>
              </ul>
              <div className="mt-2 bg-gray-50 rounded-lg p-3 text-kon text-xs">
                → 合計で寄附金額-2,000円がほぼ全額戻ってきます
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-2">上限額を超えた場合：</p>
              <p className="text-gray-600 leading-relaxed">上限額を超えて寄附した分は控除されず、自己負担が増えます。必ず上限額の範囲内で寄附するようにしましょう。</p>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-2">申告方法は2種類：</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <p className="font-semibold text-green-800 mb-1">【ワンストップ特例】</p>
                  <p className="text-xs text-green-700 leading-relaxed">確定申告不要。寄附先が5自治体以内で給与所得者のみ利用可。寄附した自治体に申請書を郵送するだけで手続き完了。</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="font-semibold text-kon mb-1">【確定申告】</p>
                  <p className="text-xs text-kon leading-relaxed">寄附先が6自治体以上の場合や、自営業者・医療費控除を受ける方は確定申告が必要。控除効果は同じですが所得税還付と住民税控除に分かれて戻ってきます。</p>
                </div>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-1">住宅ローン控除との併用：</p>
              <p className="text-gray-600 leading-relaxed">住宅ローン控除がある場合、所得税が減額されるためふるさと納税の控除上限が下がることがあります。本ツールでは住宅ローン控除を考慮した計算が可能です。</p>
            </div>
          </div>
        </div>

        {/* よくある質問 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">よくある質問</h2>
          <div className="space-y-3">
            {[
              {
                q: "ふるさと納税の上限額を超えたらどうなりますか？",
                a: "上限額を超えた分は控除されず、全額自己負担となります。例えば上限5万円の方が8万円寄附した場合、超過分3万円は控除されず実質自己負担は3万2,000円になります。必ず事前に上限額を確認しましょう。"
              },
              {
                q: "ワンストップ特例と確定申告どちらがいいですか？",
                a: "給与所得者で寄附先が5自治体以内なら、手続きが簡単なワンストップ特例がおすすめです。ただし医療費控除・住宅ローン控除初年度・副業収入がある方は確定申告が必要です。確定申告をする場合はワンストップ特例の申請は不要です。"
              },
              {
                q: "ふるさと納税は年収いくらからお得ですか？",
                a: "年収150万円以上であれば一定の控除効果があります。ただし控除上限額が非常に少ないため、実質的に返礼品のメリットを感じやすいのは年収300万円以上からです。年収が高いほど上限額が大きくなり、よりお得に活用できます。"
              },
              {
                q: "共働き夫婦の場合、それぞれ別々にふるさと納税できますか？",
                a: "はい、夫婦それぞれが個人の収入に応じた上限額でふるさと納税できます。合算はできません。それぞれの年収で上限額を計算し、別々に寄附・申告を行います。"
              },
              {
                q: "ふるさと納税の返礼品に税金はかかりますか？",
                a: "返礼品は「一時所得」として扱われます。ただし一時所得は年間50万円の特別控除があるため、返礼品の価値（寄附額の3割相当）が50万円を超えなければ課税されません。一般的な利用では課税対象になることはほとんどありません。"
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
                href: "/tax/income-tax-calculator",
                label: "所得税・住民税 計算機",
                desc: "年収・控除から所得税・住民税を自動計算",
              },
              {
                href: "/tax/gift-tax-calculator",
                label: "贈与税 計算機",
                desc: "贈与金額と関係性から贈与税を試算",
              },
              {
                href: "/tax/inheritance-tax-calculator",
                label: "相続税 簡易計算機",
                desc: "相続財産と法定相続人から相続税を試算",
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
