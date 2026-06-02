"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";

// ---- Preset data ----
interface PresetData {
  label: string;
  examFee: number;
  studyHours: number;
  passRate: number;
  salaryUp: number;
  materialCost: number;
  difficulty: string;
  costpa: string;
}

const PRESETS: Record<string, PresetData> = {
  takken: {
    label: "宅地建物取引士（宅建）",
    examFee: 8200,
    studyHours: 300,
    passRate: 17,
    salaryUp: 50,
    materialCost: 5,
    difficulty: "★★★☆☆",
    costpa: "高",
  },
  chusho: {
    label: "中小企業診断士",
    examFee: 27900,
    studyHours: 1000,
    passRate: 4,
    salaryUp: 100,
    materialCost: 20,
    difficulty: "★★★★☆",
    costpa: "中",
  },
  cpa: {
    label: "公認会計士（CPA）",
    examFee: 19500,
    studyHours: 3500,
    passRate: 10,
    salaryUp: 200,
    materialCost: 60,
    difficulty: "★★★★★",
    costpa: "高",
  },
  zeirishi: {
    label: "税理士",
    examFee: 20000,
    studyHours: 3000,
    passRate: 18,
    salaryUp: 150,
    materialCost: 40,
    difficulty: "★★★★★",
    costpa: "高",
  },
  sharoshi: {
    label: "社会保険労務士（社労士）",
    examFee: 15000,
    studyHours: 800,
    passRate: 6,
    salaryUp: 80,
    materialCost: 15,
    difficulty: "★★★★☆",
    costpa: "中",
  },
  fp2: {
    label: "ファイナンシャルプランナー（FP2級）",
    examFee: 11700,
    studyHours: 150,
    passRate: 40,
    salaryUp: 30,
    materialCost: 3,
    difficulty: "★★☆☆☆",
    costpa: "高",
  },
  kihon: {
    label: "基本情報技術者",
    examFee: 7500,
    studyHours: 200,
    passRate: 30,
    salaryUp: 50,
    materialCost: 3,
    difficulty: "★★★☆☆",
    costpa: "高",
  },
  oyo: {
    label: "応用情報技術者",
    examFee: 7500,
    studyHours: 500,
    passRate: 23,
    salaryUp: 80,
    materialCost: 5,
    difficulty: "★★★★☆",
    costpa: "高",
  },
  aws: {
    label: "AWS認定（SAA）",
    examFee: 19000,
    studyHours: 150,
    passRate: 70,
    salaryUp: 100,
    materialCost: 3,
    difficulty: "★★★☆☆",
    costpa: "最高",
  },
};

const SEO_TABLE = [
  { name: "FP2級", hours: 150, totalCost: "約15万円", salaryUp: "約30万円/年", payback: "約6ヶ月" },
  { name: "AWS SAA", hours: 150, totalCost: "約22万円", salaryUp: "約100万円/年", payback: "約3ヶ月" },
  { name: "基本情報技術者", hours: 200, totalCost: "約11万円", salaryUp: "約50万円/年", payback: "約3ヶ月" },
  { name: "宅建", hours: 300, totalCost: "約13万円", salaryUp: "約50万円/年", payback: "約3ヶ月" },
  { name: "社労士", hours: 800, totalCost: "約30万円", salaryUp: "約80万円/年", payback: "約5ヶ月" },
  { name: "中小企業診断士", hours: 1000, totalCost: "約47万円", salaryUp: "約100万円/年", payback: "約6ヶ月" },
  { name: "税理士", hours: 3000, totalCost: "約60万円", salaryUp: "約150万円/年", payback: "約5ヶ月" },
  { name: "公認会計士", hours: 3500, totalCost: "約79万円", salaryUp: "約200万円/年", payback: "約5ヶ月" },
];

const FAQ_LIST = [
  {
    q: "資格を取っても年収が上がるとは限りませんか？",
    a: "はい、資格を取得しただけで自動的に年収が上がるわけではありません。年収アップには①転職（資格を評価する会社への移動）②社内昇進・資格手当の申請③独立・開業、のいずれかのアクションが必要です。本ツールの年収アップ額はこれらのアクションを取った場合の目安です。",
  },
  {
    q: "勉強時間の目安はどうやって決めればいいですか？",
    a: "本ツールのプリセット値は、合格者の平均的な勉強時間の目安です。ただし個人の基礎知識・学習効率によって大きく異なります。未経験者は目安の1.5倍、関連知識がある場合は0.7倍程度で見積もると良いでしょう。",
  },
  {
    q: "複数の資格を取る場合のROIはどう考えますか？",
    a: "資格の組み合わせによってシナジー効果があります。例えばFP+宅建の組み合わせは不動産・金融分野で強みになります。税理士+中小企業診断士は経営コンサルとして独立する場合に有利です。単純な足し算より効果が大きい場合があります。",
  },
  {
    q: "資格スクール（専門学校）と独学ではどちらがいいですか？",
    a: "合格率・学習効率を考えると難関資格（公認会計士・税理士・司法書士等）はスクールが有利です。一方、IT資格やFP2級程度は独学でも十分合格可能です。本ツールでスクール費用を含めたROIを計算して比較することをお勧めします。",
  },
  {
    q: "資格取得のための学費は税控除できますか？",
    a: "資格取得費用が「現在の職業に直接必要」と認められる場合、特定支出控除として所得控除できる可能性があります。ただし給与所得の特定支出控除は適用基準が厳しく、確定申告が必要です。詳細は税務署または税理士にご相談ください。",
  },
];

const RELATED_TOOLS = [
  { href: "/education/scholarship-repayment", label: "奨学金返済シミュレーター" },
  { href: "/education/deviation-score", label: "偏差値計算機" },
  { href: "/career/job-change-simulator", label: "転職年収シミュレーター" },
  { href: "/career/salary-negotiation", label: "給与交渉額シミュレーター" },
];

// ---- Types ----
interface Result {
  totalCost: number;
  moneyCost: number;
  timeCost: number;
  totalReturn: number;
  roi: number;
  paybackYears: number;
  monthlyUp: number;
  salaryUpYearly: number;
  usableYears: number;
  examAttempts: string;
  examFee: number;
  materialCostYen: number;
  studyHours: number;
  hourlyRate: number;
}

// ---- Helpers ----
function formatMan(yen: number): string {
  const man = yen / 10000;
  if (man >= 1) return `${man.toFixed(1)}万円`;
  return `${Math.round(yen).toLocaleString()}円`;
}

function formatYen(yen: number): string {
  return `${Math.round(yen).toLocaleString()}円`;
}

function formatPayback(years: number): string {
  const y = Math.floor(years);
  const m = Math.round((years - y) * 12);
  if (y === 0) return `${m}ヶ月`;
  if (m === 0) return `${y}年`;
  return `${y}年${m}ヶ月`;
}

function getRoiBadge(roi: number): { label: string; bg: string; text: string } {
  if (roi > 500) return { label: "🌟 超高リターン", bg: "bg-yellow-400", text: "text-yellow-900" };
  if (roi > 200) return { label: "✅ 高リターン", bg: "bg-green-500", text: "text-white" };
  if (roi > 100) return { label: "👍 良好", bg: "bg-kon", text: "text-white" };
  if (roi > 50) return { label: "🤔 検討余地あり", bg: "bg-kon", text: "text-white" };
  return { label: "⚠️ 慎重に検討を", bg: "bg-danger", text: "text-white" };
}

// ---- Main Component ----
export default function CertificationRoiClient() {
  const [preset, setPreset] = useState("");
  const [certName, setCertName] = useState("");
  const [examFee, setExamFee] = useState("");
  const [materialCost, setMaterialCost] = useState("");
  const [studyHours, setStudyHours] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [examAttempts, setExamAttempts] = useState("1");
  const [salaryUp, setSalaryUp] = useState("");
  const [usableYears, setUsableYears] = useState("10");

  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handlePresetChange(key: string) {
    setPreset(key);
    setResult(null);
    setError("");
    if (key === "" || key === "other") {
      if (key === "other") {
        setExamFee("");
        setStudyHours("");
        setSalaryUp("");
        setMaterialCost("");
        setCertName("");
      }
      return;
    }
    const p = PRESETS[key];
    setCertName(p.label);
    setExamFee(String(p.examFee));
    setStudyHours(String(p.studyHours));
    setSalaryUp(String(p.salaryUp));
    setMaterialCost(String(p.materialCost));
  }

  function handleMonthlyIncomeChange(val: string) {
    setMonthlyIncome(val);
    const m = parseFloat(val);
    if (!isNaN(m) && m > 0) {
      const rate = Math.round((m * 10000) / (8 * 20));
      setHourlyRate(String(rate));
    }
  }

  function calculate() {
    setError("");
    setResult(null);

    const fee = parseFloat(examFee);
    const mat = parseFloat(materialCost);
    const hours = parseFloat(studyHours);
    const rate = parseFloat(hourlyRate);
    const salUp = parseFloat(salaryUp);
    const years = parseFloat(usableYears);

    if (isNaN(fee) || fee < 0) { setError("受験料を正しく入力してください。"); return; }
    if (isNaN(mat) || mat < 0) { setError("教材・スクール費用を正しく入力してください。"); return; }
    if (isNaN(hours) || hours <= 0) { setError("勉強時間を入力してください。"); return; }
    if (isNaN(rate) || rate <= 0) { setError("時給換算を入力してください。現在の月収から自動計算できます。"); return; }
    if (isNaN(salUp) || salUp <= 0) { setError("資格取得後の年収アップ額を入力してください。"); return; }
    if (isNaN(years) || years <= 0) { setError("資格が活かせる年数を入力してください。"); return; }

    const multiplier: Record<string, number> = { "1": 1, "2": 1.5, "3": 2 };
    const mult = multiplier[examAttempts] ?? 1;

    const moneyCost = fee * mult + mat * 10000;
    const timeCost = hours * rate;
    const totalCost = moneyCost + timeCost;
    const salaryUpYen = salUp * 10000;
    const totalReturn = salaryUpYen * years;
    const roi = ((totalReturn - totalCost) / totalCost) * 100;
    const paybackYears = totalCost / salaryUpYen;
    const monthlyUp = salaryUpYen / 12;

    setResult({
      totalCost,
      moneyCost,
      timeCost,
      totalReturn,
      roi,
      paybackYears,
      monthlyUp,
      salaryUpYearly: salaryUpYen,
      usableYears: years,
      examAttempts,
      examFee: fee,
      materialCostYen: mat * 10000,
      studyHours: hours,
      hourlyRate: rate,
    });
  }

  const badge = result ? getRoiBadge(result.roi) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-green-200 text-sm mb-1">教育・学習</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">資格取得 費用対効果 計算機</h1>
          <p className="text-green-100 text-sm">
            受験料・教材費・勉強時間コストと年収アップ効果を比較。ROI・投資回収期間を自動計算。宅建・診断士・AWS等9資格のプリセット付き。
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Section 1: 資格情報 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-800 text-base">① 資格情報</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">資格を選択（プリセット）</label>
            <select
              value={preset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="">— 選択してください —</option>
              {Object.entries(PRESETS).map(([key, p]) => (
                <option key={key} value={key}>{p.label}</option>
              ))}
              <option value="other">その他（手動入力）</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">資格名</label>
            <input
              type="text"
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
              placeholder="例: 宅地建物取引士"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {preset && preset !== "other" && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
              <span className="font-semibold">合格率目安：</span> {PRESETS[preset].passRate}%
              &nbsp;|&nbsp;
              <span className="font-semibold">難易度：</span> {PRESETS[preset].difficulty}
            </div>
          )}
        </div>

        {/* Section 2: 取得コスト */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-800 text-base">② 取得コスト</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">受験料（円）</label>
              <input
                type="number"
                value={examFee}
                onChange={(e) => setExamFee(e.target.value)}
                placeholder="例: 8200"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">教材・スクール費（万円）</label>
              <input
                type="number"
                value={materialCost}
                onChange={(e) => setMaterialCost(e.target.value)}
                placeholder="例: 5"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">勉強時間（総時間）</label>
            <input
              type="number"
              value={studyHours}
              onChange={(e) => setStudyHours(e.target.value)}
              placeholder="例: 300"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">現在の月収（手取り）（万円）</label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => handleMonthlyIncomeChange(e.target.value)}
              placeholder="例: 30"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">入力すると時給を自動計算します（月収 ÷ 8時間×20日）</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              時給換算（円）
              <span className="ml-2 text-xs text-gray-400 font-normal">— 勉強時間の機会コスト計算用</span>
            </label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="例: 1875"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">受験回数の見込み</label>
            <select
              value={examAttempts}
              onChange={(e) => setExamAttempts(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="1">1回で合格</option>
              <option value="2">2回（再受験あり）</option>
              <option value="3">3回以上</option>
            </select>
          </div>
        </div>

        {/* Section 3: 取得後の効果 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-800 text-base">③ 取得後の効果</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">資格取得後の想定年収アップ（万円/年）</label>
            <input
              type="number"
              value={salaryUp}
              onChange={(e) => setSalaryUp(e.target.value)}
              placeholder="例: 50"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">転職・昇給・独立による年収増加の見込み額</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">資格が活かせる年数（デフォルト10年）</label>
            <input
              type="number"
              value={usableYears}
              onChange={(e) => setUsableYears(e.target.value)}
              placeholder="10"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">転職・独立等で資格を活用できる期間</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-danger">{error}</div>
        )}

        {/* Calculate Button */}
        <button type="button"
          onClick={calculate}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-colors text-base"
        >
          費用対効果を計算する
        </button>

        {/* Results */}
        {result && badge && (
          <div className="space-y-4">

            {/* 4 Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">投資回収期間</p>
                <p className="text-2xl font-extrabold text-green-700">{formatPayback(result.paybackYears)}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">ROI</p>
                <p className={`text-2xl font-extrabold ${result.roi > 200 ? "text-green-700" : result.roi > 100 ? "text-kon" : result.roi > 50 ? "text-kon" : "text-danger"}`}>
                  {result.roi >= 0 ? "+" : ""}{Math.round(result.roi)}%
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">総コスト</p>
                <p className="text-xl font-extrabold text-gray-800">{formatMan(result.totalCost)}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">{Math.round(result.usableYears)}年間の総リターン</p>
                <p className="text-xl font-extrabold text-green-700">{formatMan(result.totalReturn)}</p>
              </div>
            </div>

            {/* ROI Badge */}
            <div className={`${badge.bg} rounded-xl p-4 text-center`}>
              <span className={`text-lg font-bold ${badge.text}`}>{badge.label}</span>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <p className="px-5 py-3 font-semibold text-gray-700 border-b border-gray-100 text-sm">コスト内訳</p>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">
                      受験料（{result.examAttempts === "1" ? "1回" : result.examAttempts === "2" ? "2回分" : "3回以上"}）
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatYen(result.examFee * (result.examAttempts === "1" ? 1 : result.examAttempts === "2" ? 1.5 : 2))}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">教材・スクール費</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatMan(result.materialCostYen)}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">
                      時間コスト（{Math.round(result.studyHours)}時間 × {formatYen(result.hourlyRate)}）
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatMan(result.timeCost)}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-gray-700 font-bold">総コスト</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">{formatMan(result.totalCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Return Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <p className="px-5 py-3 font-semibold text-gray-700 border-b border-gray-100 text-sm">リターン試算</p>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">年収アップ（年間）</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-700">{formatMan(result.salaryUpYearly)}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">月収アップ</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-700">{formatYen(result.monthlyUp)}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">{Math.round(result.usableYears)}年間の累計収入増</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-700">{formatMan(result.totalReturn)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-500">投資回収期間</td>
                    <td className="px-4 py-3 text-right font-bold">{formatPayback(result.paybackYears)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Advice */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-2">
              <p className="font-semibold text-kon text-sm">アドバイス</p>
              <p className="text-sm text-kon">
                {result.paybackYears < 2
                  ? "コスパ最高！積極的に取得を検討しましょう。短期間で元が取れます。"
                  : result.paybackYears <= 5
                  ? "中長期的には十分元が取れます。計画的に取り組みましょう。"
                  : "長期的な計画が必要です。転職・独立との組み合わせが効果的です。"}
              </p>
              {result.timeCost > result.moneyCost && (
                <p className="text-sm text-kon">
                  ⏱ 時間コストが金銭コストより大きいです。効率的な学習法（スクール・オンライン講座）を選びましょう。
                </p>
              )}
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <p className="px-5 py-3 font-semibold text-gray-700 border-b border-gray-100 text-sm">資格別 難易度・コスパ比較</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-600 font-medium">資格</th>
                      <th className="px-4 py-2 text-right text-gray-600 font-medium">難易度</th>
                      <th className="px-4 py-2 text-right text-gray-600 font-medium">勉強時間</th>
                      <th className="px-4 py-2 text-right text-gray-600 font-medium">年収アップ</th>
                      <th className="px-4 py-2 text-right text-gray-600 font-medium">コスパ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(PRESETS).map(([key, p]) => (
                      <tr key={key} className={`border-t border-gray-100 ${preset === key ? "bg-green-50" : "hover:bg-gray-50"}`}>
                        <td className={`px-4 py-2.5 font-medium text-xs ${preset === key ? "text-green-700" : ""}`}>
                          {p.label.replace(/（[^）]+）/, "").trim()}
                          {preset === key && <span className="ml-1 text-green-600">←</span>}
                        </td>
                        <td className="px-4 py-2.5 text-right text-xs">{p.difficulty}</td>
                        <td className="px-4 py-2.5 text-right">{p.studyHours}h</td>
                        <td className="px-4 py-2.5 text-right text-green-700 font-semibold">+{p.salaryUp}万</td>
                        <td className="px-4 py-2.5 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.costpa === "最高" ? "bg-yellow-100 text-yellow-800" : p.costpa === "高" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                            {p.costpa}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SEO: Comparison Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <h2 className="px-5 py-3 font-bold text-gray-800 border-b border-gray-100 text-sm">主要資格 コスパ比較表（2026年）</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">資格</th>
                  <th className="px-4 py-2 text-right text-gray-600 font-medium">勉強時間</th>
                  <th className="px-4 py-2 text-right text-gray-600 font-medium">総費用目安</th>
                  <th className="px-4 py-2 text-right text-gray-600 font-medium">年収アップ目安</th>
                  <th className="px-4 py-2 text-right text-gray-600 font-medium">回収期間目安</th>
                </tr>
              </thead>
              <tbody>
                {SEO_TABLE.map((row) => (
                  <tr key={row.name} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium">{row.name}</td>
                    <td className="px-4 py-2.5 text-right">{row.hours}h</td>
                    <td className="px-4 py-2.5 text-right">{row.totalCost}</td>
                    <td className="px-4 py-2.5 text-right text-green-700 font-semibold">{row.salaryUp}</td>
                    <td className="px-4 py-2.5 text-right">{row.payback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SEO: Educational Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-800">資格取得の費用対効果の考え方</h2>

          <div>
            <h3 className="font-semibold text-gray-700 text-sm mb-2">資格取得のROIとは</h3>
            <p className="text-sm text-gray-600">
              資格取得にかかるコスト（受験料・教材費・勉強時間）に対して、取得後に得られる収入増加がどれだけあるかを数値化したものです。ROIが100%なら投資と同額のリターン、200%なら2倍のリターンを意味します。
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 text-sm mb-2">見落とされがちな「時間コスト」</h3>
            <p className="text-sm text-gray-600">
              多くの人が資格取得の費用として教材費や受験料しか考慮しませんが、勉強に費やす時間も大切なコストです。例えば月収30万円の人が1,000時間勉強する場合、時給換算で約1,875円×1,000時間＝約188万円の機会コストがあります。
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 text-sm mb-2">コスパが良い資格の特徴</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>勉強時間が比較的短い（150〜300時間）</li>
              <li>合格率が高め（30%以上）</li>
              <li>需要が高く年収アップ効果が大きい</li>
              <li>更新不要または更新コストが低い</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 text-sm mb-2">IT系資格のコスパが高い理由</h3>
            <p className="text-sm text-gray-600">
              AWS・基本情報技術者などIT資格は、勉強時間が比較的短く（150〜500時間）、IT業界の高需要により年収アップ効果が大きいです。特にクラウド系資格（AWS・GCP・Azure）は転職市場での需要が急増しており高いROIが期待できます。
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <h2 className="px-5 py-4 font-bold text-gray-800 border-b border-gray-100">よくある質問</h2>
          {FAQ_LIST.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 last:border-0">
              <button type="button"
                className="w-full px-5 py-3.5 flex items-start justify-between text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="pr-4">Q. {faq.q}</span>
                <span className="text-gray-400 shrink-0">{openFaq === i ? "▲" : "▼"}</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">A. {faq.a}</div>
              )}
            </div>
          ))}
        </div>

        {/* Related Tools */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-3 text-sm">あわせて使えるツール</h2>
          <div className="grid grid-cols-2 gap-2">
            {RELATED_TOOLS.map((t) => (
              <a key={t.href} href={t.href} className="text-green-600 hover:text-green-800 text-sm hover:underline">
                {t.label}
              </a>
            ))}
          </div>
        </div>

      
        {/* 関連ブログ記事 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-kon p-5 mt-4">
          <h2 className="font-bold text-gray-800 mb-3 text-sm">📝 関連ブログ記事</h2>
          
            <a
            href="/blog/shikaku-toshi-simulation-2026"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-ai flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-5 h-5 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-kon group-hover:text-ai">【2026年最新】資格取得は投資になる？費用対効果（ROI）をシミュレーション</p>
              <p className="text-xs text-gray-500 mt-0.5">詳しい解説・計算例 →</p>
            </div>
          </a>
        </div>
      {/* 広告 */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <AdUnit slot="5612038947" format="horizontal" />
      </div>
      </div>
    </div>
  );
}
