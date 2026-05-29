"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";

// ---- Cost data (2026 MEXT) ----
const COSTS = {
  kindergarten: { public: 70, private: 160 },
  elementary:   { public: 210, private: 1000 },
  junior:       { public: 160, private: 430 },
  high:         { public: 160, private: 310 },
  university: {
    "kokuritu-jitaku":    250,
    "kokuritu-geshuku":   490,
    "shiritsu-bunkei-jitaku":  400,
    "shiritsu-bunkei-geshuku": 650,
    "shiritsu-rikei-jitaku":   550,
    "shiritsu-rikei-geshuku":  800,
    "shiritsu-ika":       3000,
  } as Record<string, number>,
};

// Age at which each stage starts
const STAGE_START_AGE = { kindergarten: 3, elementary: 6, junior: 12, high: 15, university: 18 };
const STAGE_DURATION  = { kindergarten: 3, elementary: 6, junior: 3,  high: 3,  university: 4 };

type SchoolType = "public" | "private";
type UniType = keyof typeof COSTS.university;
type SavingsMethod = "futsuu" | "teiki" | "gakushi" | "nisa" | "custom";

const METHOD_RATES: Record<SavingsMethod, number> = {
  futsuu:  0.0002,
  teiki:   0.002,
  gakushi: 0.0, // special: flat × 1.05
  nisa:    0.05,
  custom:  0.03,
};

const METHOD_LABELS: Record<SavingsMethod, string> = {
  futsuu:  "普通預金（年利0.02%）",
  teiki:   "定期預金（年利0.2%）",
  gakushi: "学資保険（返戻率105%）",
  nisa:    "NISA・投資信託（年利5%）",
  custom:  "カスタム（利率手入力）",
};

function calcFV(monthly: number, annualRate: number, years: number, method: SavingsMethod): number {
  const months = years * 12;
  if (method === "gakushi") {
    return monthly * months * 1.05;
  }
  const r = annualRate / 12;
  if (r === 0) return monthly * months;
  return monthly * (Math.pow(1 + r, months) - 1) / r;
}

function calcFVSavings(amount: number, annualRate: number, years: number, method: SavingsMethod): number {
  if (method === "gakushi") return amount * 1.05;
  if (annualRate === 0) return amount;
  return amount * Math.pow(1 + annualRate, years);
}

function calcRequiredMonthly(target: number, annualRate: number, years: number, method: SavingsMethod): number {
  const months = years * 12;
  if (months <= 0) return target;
  if (method === "gakushi") return target / (months * 1.05);
  const r = annualRate / 12;
  if (r === 0) return target / months;
  return target * r / (Math.pow(1 + r, months) - 1);
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("ja-JP");
}

// ---- Comparison routes ----
function calcRouteTotal(
  kindergarten: SchoolType,
  elementary: SchoolType,
  junior: SchoolType,
  high: SchoolType,
  university: UniType
): number {
  return (
    COSTS.kindergarten[kindergarten] +
    COSTS.elementary[elementary] +
    COSTS.junior[junior] +
    COSTS.high[high] +
    COSTS.university[university]
  );
}

function getStageCostForAge(stage: keyof typeof STAGE_START_AGE, childAge: number): number {
  const start = STAGE_START_AGE[stage];
  const end = start + STAGE_DURATION[stage];
  if (childAge >= end) return 1; // fully past
  if (childAge < start) return 0; // not started
  return (childAge - start) / STAGE_DURATION[stage]; // partial
}

const FAQ_LIST = [
  {
    q: "教育費はいつから準備し始めればいいですか？",
    a: "早ければ早いほど良いです。子供が生まれてすぐ（0歳）から始めれば18年間の積立期間があります。月3万円を年利5%で18年積み立てると約1,000万円になりますが、10歳から始めると同じ月3万円でも約450万円にしかなりません。複利の力を最大限活用するため、できるだけ早く始めることをお勧めします。",
  },
  {
    q: "学資保険とNISAはどちらが良いですか？",
    a: "積立期間と目的によって異なります。学資保険は元本保証・確実な準備ができる反面、返戻率が105〜110%程度と低めです。NISAは長期投資で年利4〜6%程度が期待できますが元本保証はありません。積立期間が10年以上ある場合はNISA、5年以下の場合は学資保険や定期預金が安全です。",
  },
  {
    q: "私立中学受験を考えています。費用はどのくらいかかりますか？",
    a: "中学受験の準備費用（塾代等）は小学4〜6年の3年間で100〜300万円かかることが多いです。さらに私立中高の学費が6年間で約430〜600万円（学校によって大きく異なる）加わります。合計で500〜900万円程度を目安に準備しておくことをお勧めします。",
  },
  {
    q: "大学進学時に奨学金を借りる予定ですが、それでも貯蓄は必要ですか？",
    a: "必要です。奨学金は大学の授業料・生活費の一部しかカバーしないことが多く、入学金（20〜30万円）や初年度の費用は事前に準備が必要です。また奨学金は卒業後に返済が始まるため、子供の将来の負担になります。できる範囲で教育資金を準備することが理想的です。",
  },
  {
    q: "教育費の不足分はどう対処すればいいですか？",
    a: "いくつかの方法があります。①教育ローンの活用（日本政策金融公庫の教育ローンは低金利）②奨学金の利用（給付型を優先）③大学進学時のアルバイト・TA制度の活用④進学先のコスト見直し（国公立大学・自宅通学など）。計画的な準備が最善ですが、不足した場合も選択肢はあります。",
  },
];

const COST_TABLE = [
  { stage: "幼稚園（3年）", public: "約70万円", private: "約160万円", diff: "+90万円" },
  { stage: "小学校（6年）", public: "約210万円", private: "約1,000万円", diff: "+790万円" },
  { stage: "中学校（3年）", public: "約160万円", private: "約430万円", diff: "+270万円" },
  { stage: "高校（3年）",   public: "約160万円", private: "約310万円", diff: "+150万円" },
  { stage: "大学（4年）",   public: "約250万円", private: "約400〜550万円", diff: "+150〜300万円" },
];

const RELATED_TOOLS = [
  { href: "/education/scholarship-repayment", label: "奨学金返済シミュレーター" },
  { href: "/education/deviation-score", label: "偏差値計算機" },
  { href: "/finance/nisa-simulator", label: "NISAシミュレーター" },
  { href: "/insurance/life-insurance-calculator", label: "生命保険必要保障額計算機" },
];

interface ChildInfo {
  age: string;
}

interface Result {
  totalCost: number;
  remainingCost: number;
  alreadySaved: number;
  requiredAdditional: number;
  savingsYears: number;
  requiredMonthly: number;
  projectedFV: number;
  gap: number;
  stageCosts: { label: string; cost: number }[];
  methodComparison: { method: SavingsMethod; fv: number; rate: number }[];
  routeComparison: { label: string; total: number; diff: number }[];
}

export default function EducationCostSimulatorClient() {
  // Section 1
  const [childAge, setChildAge] = useState("0");
  const [numChildren, setNumChildren] = useState("1");
  const [child2Age, setChild2Age] = useState("3");
  const [child3Age, setChild3Age] = useState("6");
  const [currentSavings, setCurrentSavings] = useState("0");

  // Section 2
  const [kinder, setKinder] = useState<SchoolType>("public");
  const [elementary, setElementary] = useState<SchoolType>("public");
  const [junior, setJunior] = useState<SchoolType>("public");
  const [high, setHigh] = useState<SchoolType>("public");
  const [uni, setUni] = useState<UniType>("kokuritu-jitaku");

  // Section 3
  const [monthlyInput, setMonthlyInput] = useState("3");
  const [savingsMethod, setSavingsMethod] = useState<SavingsMethod>("nisa");
  const [customRate, setCustomRate] = useState("3");

  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function calculate() {
    setError("");
    setResult(null);

    const age = parseInt(childAge);
    if (isNaN(age) || age < 0 || age > 18) { setError("子供の年齢を0〜18歳で入力してください。"); return; }
    const savings = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlyInput) || 0;
    const annualRate = savingsMethod === "custom" ? (parseFloat(customRate) || 0) / 100 : METHOD_RATES[savingsMethod];
    const savingsYears = Math.max(0, 18 - age);

    // Stage costs
    const stages: { label: string; stage: keyof typeof STAGE_START_AGE; type: SchoolType | UniType }[] = [
      { label: "幼稚園", stage: "kindergarten", type: kinder },
      { label: "小学校", stage: "elementary",   type: elementary },
      { label: "中学校", stage: "junior",        type: junior },
      { label: "高校",   stage: "high",          type: high },
      { label: "大学",   stage: "university",    type: uni },
    ];

    let totalCost = 0;
    let remainingCost = 0;
    const stageCosts: { label: string; cost: number }[] = [];

    for (const s of stages) {
      let cost = 0;
      if (s.stage === "university") {
        cost = COSTS.university[uni];
      } else {
        cost = COSTS[s.stage][s.type as SchoolType];
      }
      totalCost += cost;

      // How much is already past
      const start = STAGE_START_AGE[s.stage];
      const end = start + STAGE_DURATION[s.stage];
      let remaining = cost;
      if (age >= end) {
        remaining = 0;
      } else if (age > start) {
        const elapsed = (age - start) / STAGE_DURATION[s.stage];
        remaining = cost * (1 - elapsed);
      }
      remainingCost += remaining;
      stageCosts.push({ label: s.label, cost });
    }

    // FV of existing savings
    const fvSavings = calcFVSavings(savings, annualRate, savingsYears, savingsMethod);
    const requiredAdditional = Math.max(0, remainingCost - fvSavings);
    const requiredMonthly = savingsYears > 0
      ? calcRequiredMonthly(requiredAdditional, annualRate, savingsYears, savingsMethod)
      : requiredAdditional;

    // Projected FV from input monthly
    const projectedFV = calcFV(monthly, annualRate, savingsYears, savingsMethod) + fvSavings;
    const gap = projectedFV - remainingCost;

    // Method comparison
    const allMethods: SavingsMethod[] = ["futsuu", "teiki", "gakushi", "nisa"];
    const methodComparison = allMethods.map((m) => {
      const rate = METHOD_RATES[m];
      const fv = calcFV(monthly, rate, savingsYears, m) + calcFVSavings(savings, rate, savingsYears, m);
      return { method: m, fv, rate: fv / remainingCost };
    });

    // Route comparison
    const fullPublic = calcRouteTotal("public", "public", "public", "public", "kokuritu-jitaku");
    const currentTotal = calcRouteTotal(kinder, elementary, junior, high, uni);
    const midPrivate = calcRouteTotal("public", "public", "private", "private", "shiritsu-bunkei-jitaku");
    const highPrivate = calcRouteTotal("public", "public", "public", "private", "shiritsu-bunkei-jitaku");
    const fullPrivate = 2400; // 160+1000+430+310+500（私立平均）≒ 約2,400万円（SEO表・本文と統一）

    const routeComparison = [
      { label: "全て公立", total: fullPublic, diff: 0 },
      { label: "高校から私立", total: highPrivate, diff: highPrivate - fullPublic },
      { label: "中学から私立", total: midPrivate, diff: midPrivate - fullPublic },
      { label: "全て私立", total: fullPrivate, diff: fullPrivate - fullPublic },
    ];

    setResult({
      totalCost,
      remainingCost,
      alreadySaved: savings,
      requiredAdditional,
      savingsYears,
      requiredMonthly,
      projectedFV,
      gap,
      stageCosts,
      methodComparison,
      routeComparison,
    });
  }

  const selectCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white";
  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";
  const sectionTitle = "font-semibold text-gray-800 mb-3 text-base";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-green-200 text-sm mb-1">教育・学習</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">教育費 積立シミュレーター</h1>
          <p className="text-green-100 text-sm">
            幼稚園〜大学の教育費総額を自動計算。必要月積立額・学資保険vsNISA比較・ギャップ分析まで対応。2026年最新データ。
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Section 1: Child info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className={sectionTitle}>お子様の情報</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>現在のお子様の年齢</label>
                <input
                  type="number"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  min="0" max="18"
                  placeholder="0〜18"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>子供の人数</label>
                <select value={numChildren} onChange={(e) => setNumChildren(e.target.value)} className={selectCls}>
                  <option value="1">1人</option>
                  <option value="2">2人</option>
                  <option value="3">3人</option>
                </select>
              </div>
            </div>

            {numChildren === "2" && (
              <div>
                <label className={labelCls}>2人目の年齢</label>
                <input type="number" value={child2Age} onChange={(e) => setChild2Age(e.target.value)}
                  min="0" max="18" placeholder="0〜18" className={inputCls} />
              </div>
            )}
            {numChildren === "3" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>2人目の年齢</label>
                  <input type="number" value={child2Age} onChange={(e) => setChild2Age(e.target.value)}
                    min="0" max="18" placeholder="0〜18" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>3人目の年齢</label>
                  <input type="number" value={child3Age} onChange={(e) => setChild3Age(e.target.value)}
                    min="0" max="18" placeholder="0〜18" className={inputCls} />
                </div>
              </div>
            )}

            <div>
              <label className={labelCls}>現在の教育資金の貯蓄額（万円）</label>
              <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)}
                placeholder="0" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Section 2: Education plan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className={sectionTitle}>教育プランの選択</h2>
          <div className="space-y-3">
            {[
              { label: "幼稚園（3年間）", value: kinder, onChange: (v: string) => setKinder(v as SchoolType) },
              { label: "小学校（6年間）", value: elementary, onChange: (v: string) => setElementary(v as SchoolType) },
              { label: "中学校（3年間）", value: junior, onChange: (v: string) => setJunior(v as SchoolType) },
              { label: "高校（3年間）",   value: high, onChange: (v: string) => setHigh(v as SchoolType) },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-36 shrink-0">{row.label}</span>
                <div className="flex flex-1 rounded-lg overflow-hidden border border-gray-300">
                  <button
                    className={`flex-1 py-2 text-xs font-medium transition-colors ${row.value === "public" ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                    onClick={() => row.onChange("public")}
                  >
                    公立
                  </button>
                  <button
                    className={`flex-1 py-2 text-xs font-medium transition-colors border-l border-gray-300 ${row.value === "private" ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                    onClick={() => row.onChange("private")}
                  >
                    私立
                  </button>
                </div>
              </div>
            ))}

            <div>
              <label className={labelCls}>大学（4〜6年間）</label>
              <select value={uni} onChange={(e) => setUni(e.target.value as UniType)} className={selectCls}>
                <option value="kokuritu-jitaku">国公立（自宅）約250万円</option>
                <option value="kokuritu-geshuku">国公立（下宿）約490万円</option>
                <option value="shiritsu-bunkei-jitaku">私立文系（自宅）約400万円</option>
                <option value="shiritsu-bunkei-geshuku">私立文系（下宿）約650万円</option>
                <option value="shiritsu-rikei-jitaku">私立理系（自宅）約550万円</option>
                <option value="shiritsu-rikei-geshuku">私立理系（下宿）約800万円</option>
                <option value="shiritsu-ika">私立医歯系（6年間）約3,000万円</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Savings plan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className={sectionTitle}>積立設定</h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>月々の積立可能額（万円）</label>
              <input type="number" value={monthlyInput} onChange={(e) => setMonthlyInput(e.target.value)}
                placeholder="3" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>積立方法</label>
              <select value={savingsMethod} onChange={(e) => setSavingsMethod(e.target.value as SavingsMethod)} className={selectCls}>
                {(Object.keys(METHOD_LABELS) as SavingsMethod[]).map((m) => (
                  <option key={m} value={m}>{METHOD_LABELS[m]}</option>
                ))}
              </select>
            </div>
            {savingsMethod === "custom" && (
              <div>
                <label className={labelCls}>年利（%）</label>
                <input type="number" value={customRate} onChange={(e) => setCustomRate(e.target.value)}
                  placeholder="3" step="0.1" className={inputCls} />
              </div>
            )}
            <p className="text-xs text-gray-500">
              積立期間: 大学入学まで（18 - {childAge || "0"}歳 = <strong>{Math.max(0, 18 - (parseInt(childAge) || 0))}年間</strong>）
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-danger">{error}</div>
        )}

        <button
          onClick={calculate}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-colors text-base"
        >
          計算する
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Total cost */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-sm text-gray-500 mb-1 text-center">教育費の総額</p>
              <p className="text-5xl font-extrabold text-green-700 text-center mb-4">
                約{fmt(result.totalCost)}万円
              </p>
              <div className="space-y-2">
                {result.stageCosts.map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-16">{s.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (s.cost / result.totalCost) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-20 text-right">{fmt(s.cost)}万円</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <p className="px-5 py-3 font-semibold text-gray-700 border-b border-gray-100 text-sm">積立計画サマリー</p>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">教育費総額</td>
                    <td className="px-4 py-3 font-semibold text-right">{fmt(result.totalCost)}万円</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">残りの教育費</td>
                    <td className="px-4 py-3 font-semibold text-right">{fmt(result.remainingCost)}万円</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">現在の貯蓄額</td>
                    <td className="px-4 py-3 font-semibold text-right">{fmt(result.alreadySaved)}万円</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">必要な追加積立額</td>
                    <td className="px-4 py-3 font-bold text-right text-green-700">{fmt(result.requiredAdditional)}万円</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">積立期間</td>
                    <td className="px-4 py-3 font-semibold text-right">{result.savingsYears}年</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-500">必要月積立額（目安）</td>
                    <td className="px-4 py-3 font-bold text-right text-green-700">
                      {result.savingsYears > 0 ? `月${fmt(result.requiredMonthly)}万円` : "即時準備が必要"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Method comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <p className="px-5 py-3 font-semibold text-gray-700 border-b border-gray-100 text-sm">
                積立方法の比較（月{monthlyInput}万円 × {result.savingsYears}年）
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-600 font-medium">積立方法</th>
                      <th className="px-4 py-2 text-right text-gray-600 font-medium">将来価値</th>
                      <th className="px-4 py-2 text-right text-gray-600 font-medium">達成率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.methodComparison.map((m) => {
                      const pct = Math.round(m.rate * 100);
                      return (
                        <tr key={m.method} className="border-t border-gray-100">
                          <td className="px-4 py-2.5">{METHOD_LABELS[m.method]}</td>
                          <td className="px-4 py-2.5 text-right font-semibold">{fmt(m.fv)}万円</td>
                          <td className="px-4 py-2.5 text-right">
                            <span className={`font-bold ${pct >= 100 ? "text-green-600" : pct >= 80 ? "text-yellow-600" : "text-danger"}`}>
                              {pct}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gap analysis */}
            <div className={`rounded-xl p-5 border ${result.gap >= 0 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
              <p className={`font-semibold mb-2 text-sm ${result.gap >= 0 ? "text-green-700" : "text-danger"}`}>
                ギャップ分析
              </p>
              {result.gap >= 0 ? (
                <p className="text-sm text-green-700">
                  計画通りに積み立てれば教育費を賄えます。月{monthlyInput}万円の積立で約
                  <span className="font-bold"> {fmt(result.gap)}万円</span> の余裕が生まれます。
                </p>
              ) : (
                <p className="text-sm text-danger">
                  現在の積立ペースでは約<span className="font-bold"> {fmt(Math.abs(result.gap))}万円</span> 不足します。
                  月あと<span className="font-bold"> {fmt(result.requiredMonthly - parseFloat(monthlyInput))}万円</span> 追加するか、教育プランの見直しを検討しましょう。
                </p>
              )}
              <div className="mt-3 bg-white rounded-lg px-4 py-2 text-xs text-gray-600 flex justify-between">
                <span>積立予定額（{METHOD_LABELS[savingsMethod]}）</span>
                <span className="font-semibold">{fmt(result.projectedFV)}万円</span>
              </div>
              <div className="mt-1 bg-white rounded-lg px-4 py-2 text-xs text-gray-600 flex justify-between">
                <span>必要額</span>
                <span className="font-semibold">{fmt(result.remainingCost)}万円</span>
              </div>
            </div>

            {/* Route comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <p className="px-5 py-3 font-semibold text-gray-700 border-b border-gray-100 text-sm">公立vs私立 費用比較</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-600 font-medium">ルート</th>
                      <th className="px-4 py-2 text-right text-gray-600 font-medium">総教育費</th>
                      <th className="px-4 py-2 text-right text-gray-600 font-medium">全公立との差</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.routeComparison.map((r) => (
                      <tr key={r.label} className="border-t border-gray-100">
                        <td className="px-4 py-2.5 font-medium">{r.label}</td>
                        <td className="px-4 py-2.5 text-right">約{fmt(r.total)}万円</td>
                        <td className="px-4 py-2.5 text-right text-gray-500">
                          {r.diff === 0 ? "−" : `+${fmt(r.diff)}万円`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SEO: Cost table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <p className="px-5 py-3 font-semibold text-gray-700 border-b border-gray-100 text-sm">
            教育費 段階別費用早見表（2026年・文科省データ）
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">教育段階</th>
                  <th className="px-4 py-2 text-right text-gray-600 font-medium">公立</th>
                  <th className="px-4 py-2 text-right text-gray-600 font-medium">私立</th>
                  <th className="px-4 py-2 text-right text-gray-600 font-medium">差額</th>
                </tr>
              </thead>
              <tbody>
                {COST_TABLE.map((row) => (
                  <tr key={row.stage} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium">{row.stage}</td>
                    <td className="px-4 py-2.5 text-right">{row.public}</td>
                    <td className="px-4 py-2.5 text-right">{row.private}</td>
                    <td className="px-4 py-2.5 text-right text-kon font-medium">{row.diff}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-300 bg-gray-50">
                  <td className="px-4 py-2.5 font-bold">合計（全公立）</td>
                  <td className="px-4 py-2.5 text-right font-bold">約850万円</td>
                  <td className="px-4 py-2.5 text-right text-gray-400">—</td>
                  <td className="px-4 py-2.5 text-right text-gray-400">—</td>
                </tr>
                <tr className="border-t border-gray-200 bg-gray-50">
                  <td className="px-4 py-2.5 font-bold">合計（全私立）</td>
                  <td className="px-4 py-2.5 text-right text-gray-400">—</td>
                  <td className="px-4 py-2.5 text-right font-bold">約2,400万円</td>
                  <td className="px-4 py-2.5 text-right text-kon font-bold">+1,550万円</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SEO: Knowledge */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-800">教育費の基礎知識と準備方法</h2>
          <p className="text-sm text-gray-600">
            文部科学省の「子供の学習費調査」によると、幼稚園から大学まで全て公立の場合は約850万円、全て私立の場合は約2,400万円かかります。
          </p>
          <div className="space-y-3">
            {[
              {
                title: "学資保険",
                body: "保険と貯蓄を兼ねた商品。返戻率は105〜110%程度が多く、低金利時代には他の方法と大差ない場合もあります。",
              },
              {
                title: "NISA（つみたて投資枠）",
                body: "長期投資により学資保険を上回るリターンが期待できます。ただし元本保証がなく、相場によって減ることもあります。積立期間が10年以上ある場合は検討価値があります。",
              },
              {
                title: "定期預金",
                body: "元本保証で安全ですが、低金利のため増える効果は限定的。教育費の一部を安全に確保したい場合に向いています。",
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-lg px-4 py-3">
                <p className="text-sm font-semibold text-gray-800 mb-1">{item.title}</p>
                <p className="text-sm text-gray-600">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="bg-green-50 rounded-lg px-4 py-3">
            <p className="text-sm font-semibold text-green-800 mb-1">高校無償化・大学無償化制度（2024〜）</p>
            <p className="text-sm text-green-700">
              2024年から私立高校の実質無償化が拡充されました。多子世帯（3人以上）の大学無償化も始まっています。最新の支援制度も活用して教育費負担を軽減しましょう。
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <h2 className="px-5 py-4 font-bold text-gray-800 border-b border-gray-100">よくある質問</h2>
          {FAQ_LIST.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 last:border-0">
              <button
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

        {/* Related tools */}
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
            href="/blog/kyouikuhi-simulation-2026"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-ai flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-5 h-5 text-kon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-kon group-hover:text-ai">【2026年最新】教育費シミュレーション｜幼稚園から大学までいくらかかる？</p>
              <p className="text-xs text-gray-500 mt-0.5">詳しい解説・計算例 →</p>
            </div>
          </a>
        </div>
      </div>
      {/* 広告 */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <AdUnit slot="5612038947" format="horizontal" />
      </div>
    </div>

  );
}
