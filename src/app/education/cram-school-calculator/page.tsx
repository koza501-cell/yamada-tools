"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";

interface SchoolInput {
  name: string;
  format: string;
  monthly: number;
  lessonsPerWeek: number;
  lessonMinutes: number;
  subjects: number;
  enrollment: number;
  annualMaterials: number;
  seasonalCost: number;
  transport: number;
}

interface SchoolResult {
  monthlyTotal: number;
  annualTotal: number;
  grandTotal: number;
  costPerLesson: number;
  costPerHour: number;
}

const PERIOD_MONTHS: Record<string, number> = {
  "1年": 12, "2年": 24, "3年": 36, "中学3年間": 36, "高校3年間": 36,
};
const PERIOD_YEARS: Record<string, number> = {
  "1年": 1, "2年": 2, "3年": 3, "中学3年間": 3, "高校3年間": 3,
};

function getPeriodMonths(p: string): number { return PERIOD_MONTHS[p] ?? 12; }
function getPeriodYears(p: string): number { return PERIOD_YEARS[p] ?? 1; }

function calcMonthlyTotal(s: SchoolInput): number {
  return s.monthly + s.transport + s.annualMaterials / 12;
}
function calcAnnualTotal(s: SchoolInput): number {
  return s.monthly * 12 + s.enrollment + s.annualMaterials + s.seasonalCost;
}
function calcGrandTotal(s: SchoolInput, period: string): number {
  const months = getPeriodMonths(period);
  const years = getPeriodYears(period);
  return s.enrollment + s.monthly * months + s.annualMaterials * years + s.seasonalCost * years;
}
function calcCostPerLesson(s: SchoolInput): number {
  if (s.lessonsPerWeek === 0) return 0;
  return s.monthly / (s.lessonsPerWeek * 4.3);
}
function calcCostPerHour(s: SchoolInput): number {
  const perLesson = calcCostPerLesson(s);
  if (s.lessonMinutes === 0) return 0;
  return perLesson / (s.lessonMinutes / 60);
}
function yen(n: number): string {
  return Math.round(n).toLocaleString("ja-JP") + "円";
}
function man(n: number): string {
  const m = Math.round(n / 10000);
  if (m === 0) return Math.round(n).toLocaleString("ja-JP") + "円";
  return m.toLocaleString("ja-JP") + "万円";
}
function bar(ratio: number): string {
  const blocks = Math.round(ratio * 20);
  return "█".repeat(Math.max(0, blocks));
}

const GRADE_OPTIONS: Record<string, string[]> = {
  "小学生": ["1年生", "2年生", "3年生", "4年生", "5年生", "6年生"],
  "中学生": ["1年生", "2年生", "3年生"],
  "高校生": ["1年生", "2年生", "3年生"],
  "浪人生": ["1浪"],
  "大学受験生（社会人）": ["受験生"],
};

const FAQ_LIST = [
  { q: "塾の費用は月謝以外に何がかかりますか？", a: "月謝以外に、入会金（1〜3万円）・年間教材費（テキスト代・プリント代、年間1〜5万円）・季節講習費（春夏冬、年間10〜30万円）・交通費（月数千円〜1万円以上）が主な費用です。月謝だけで比較すると実際の総費用を大幅に見誤る場合があります。" },
  { q: "個別指導と集団塾、どちらがコスパが良いですか？", a: "1時間あたりの費用で比較すると集団塾が安いことが多いです（1,500〜3,000円/時間）。個別指導（1対1）は3,000〜8,000円/時間と高めですが、苦手科目の集中対策や授業ペース調整など集団塾にないメリットがあります。目的と予算で選択しましょう。" },
  { q: "オンライン塾は対面塾より本当に安いですか？", a: "はい、一般的にオンライン塾の方が安いです。対面個別指導が月3〜6万円のところ、オンライン個別は月1.5〜3万円程度が相場です。さらに交通費が不要になるため、年間で数万円の節約になります。ただし自己管理能力が必要です。" },
  { q: "季節講習は必ず受ける必要がありますか？", a: "必須ではありません。季節講習は年間費用の20〜40%を占める場合があり、家計への影響が大きいです。苦手科目や受験学年は有効ですが、通常学年では必要な科目・講座のみ選択的に受講することでコストを抑えられます。" },
  { q: "中学受験・高校受験・大学受験で塾費用の相場は違いますか？", a: "はい、大きく異なります。中学受験対策塾（小4〜6年）は月3〜7万円・3年間で200〜400万円、高校受験塾（中1〜3年）は月2〜4万円・3年間で100〜200万円、大学受験予備校（高1〜3年・浪人）は月4〜10万円・1〜3年間で100〜400万円が目安です。" },
];

const RELATED_TOOLS = [
  { href: "/education/education-cost-simulator", label: "教育費 積立シミュレーター" },
  { href: "/education/deviation-score", label: "偏差値計算ツール" },
  { href: "/education/certification-roi", label: "資格取得 費用対効果計算機" },
];

const DEFAULT_SCHOOL: SchoolInput = {
  name: "", format: "集団授業", monthly: 30000, lessonsPerWeek: 2,
  lessonMinutes: 90, subjects: 2, enrollment: 10000,
  annualMaterials: 30000, seasonalCost: 80000, transport: 3000,
};

export default function CramSchoolCalculator() {
  const [target, setTarget] = useState("中学生");
  const [grade, setGrade] = useState("3年生");
  const [period, setPeriod] = useState("3年");
  const [purpose, setPurpose] = useState("高校受験対策");
  const [activeCount, setActiveCount] = useState(2);
  const [schools, setSchools] = useState<SchoolInput[]>([
    { ...DEFAULT_SCHOOL, name: "塾A" },
    { ...DEFAULT_SCHOOL, name: "塾B", monthly: 50000, format: "個別指導（1対1）", enrollment: 20000 },
    { ...DEFAULT_SCHOOL, name: "塾C", monthly: 15000, format: "オンライン個別", enrollment: 0, transport: 0 },
  ]);
  const [showResult, setShowResult] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const gradeOptions = GRADE_OPTIONS[target] ?? [];

  function updateSchool(idx: number, field: keyof SchoolInput, value: string | number) {
    setSchools((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
    setShowResult(false);
  }

  function handleCalculate() {
    setShowResult(true);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  const activeSchools = schools.slice(0, activeCount);
  const results: SchoolResult[] = activeSchools.map((s) => ({
    monthlyTotal: calcMonthlyTotal(s),
    annualTotal: calcAnnualTotal(s),
    grandTotal: calcGrandTotal(s, period),
    costPerLesson: calcCostPerLesson(s),
    costPerHour: calcCostPerHour(s),
  }));
  const minGrandTotal = showResult ? Math.min(...results.map((r) => r.grandTotal)) : 0;

  function getAdvices(): string[] {
    if (!showResult) return [];
    const advices: string[] = [];
    activeSchools.forEach((s, i) => {
      const r = results[i];
      const label = s.name || `塾${String.fromCharCode(65 + i)}`;
      if (s.seasonalCost > s.monthly * 3) {
        advices.push(`【${label}】季節講習費が月謝の3倍以上です。必要な講習だけを選択的に受講することで節約できます。`);
      }
      if ((s.format.includes("個別") || s.format.includes("オンライン個別")) && r.costPerHour > 5000) {
        advices.push(`【${label}】1時間あたり${yen(r.costPerHour)}の個別指導です。オンライン個別指導（1,500〜3,000円/時間）との比較も検討しましょう。`);
      }
      if (s.transport > s.monthly * 0.1) {
        advices.push(`【${label}】交通費が月謝の10%以上かかっています。オンライン塾への切り替えで節約できる可能性があります。`);
      }
    });
    if (advices.length === 0) {
      advices.push("現在の費用構成は概ね適切です。季節講習の選択講座化やオンライン塾との組み合わせでさらに節約できる場合があります。");
    }
    return advices;
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-50 rounded-2xl mb-4">
          <span className="text-3xl">🏫</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">塾・予備校費用 比較計算機</h1>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
          月謝だけじゃわからない！入会金・教材費・季節講習・交通費まで含めた<strong>通塾期間の総費用</strong>を最大3校で比較。
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <span className="bg-gray-50 text-kon text-xs font-medium px-3 py-1 rounded-full">最大3校同時比較</span>
          <span className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">1時間単価計算</span>
          <span className="bg-gray-50 text-kon text-xs font-medium px-3 py-1 rounded-full">コスト削減アドバイス</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <h2 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="bg-kon text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">1</span>
          お子様 / 本人の情報
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>対象者</label>
            <select className={inputClass} value={target} onChange={(e) => { setTarget(e.target.value); setGrade(GRADE_OPTIONS[e.target.value]?.[0] ?? ""); setShowResult(false); }}>
              {Object.keys(GRADE_OPTIONS).map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>現在の学年</label>
            <select className={inputClass} value={grade} onChange={(e) => { setGrade(e.target.value); setShowResult(false); }}>
              {gradeOptions.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>通塾予定期間</label>
            <select className={inputClass} value={period} onChange={(e) => { setPeriod(e.target.value); setShowResult(false); }}>
              {["1年", "2年", "3年", "中学3年間", "高校3年間"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>目的</label>
            <select className={inputClass} value={purpose} onChange={(e) => { setPurpose(e.target.value); setShowResult(false); }}>
              {["中学受験対策", "高校受験対策", "大学受験対策", "学校の補習・定期テスト対策", "英語・特定科目強化"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-base font-bold text-gray-700 flex items-center gap-2">
            <span className="bg-kon text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">2</span>
            塾・予備校の情報（最大3校）
          </h2>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <button key={n} onClick={() => { setActiveCount(n); setShowResult(false); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeCount >= n ? "bg-kon text-white" : "bg-gray-100 text-gray-500"}`}>
                {n}校
              </button>
            ))}
          </div>
        </div>
        <div className={`grid gap-4 ${activeCount === 1 ? "grid-cols-1 max-w-md" : activeCount === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
          {schools.slice(0, activeCount).map((s, i) => {
            const colorClass = i === 0 ? "border-gray-200 bg-gray-50/30" : i === 1 ? "border-green-200 bg-green-50/30" : "border-kon bg-gray-50/30";
            const headerColor = i === 0 ? "text-kon bg-gray-50" : i === 1 ? "text-green-700 bg-green-100" : "text-kon bg-gray-50";
            const letter = String.fromCharCode(65 + i);
            return (
              <div key={i} className={`border-2 rounded-xl p-4 ${colorClass}`}>
                <div className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-3 ${headerColor}`}>塾{letter}</div>
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>塾・予備校名（任意）</label>
                    <input type="text" className={inputClass} placeholder="例：○○塾" value={s.name} onChange={(e) => updateSchool(i, "name", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>授業形式</label>
                    <select className={inputClass} value={s.format} onChange={(e) => updateSchool(i, "format", e.target.value)}>
                      {["集団授業", "個別指導（1対1）", "個別指導（1対2〜3）", "オンライン集団", "オンライン個別", "映像授業（録画）"].map((f) => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>月謝（円）</label>
                    <input type="number" className={inputClass} min={0} value={s.monthly} onChange={(e) => updateSchool(i, "monthly", Number(e.target.value))} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelClass}>週コマ数</label>
                      <input type="number" className={inputClass} min={1} max={20} value={s.lessonsPerWeek} onChange={(e) => updateSchool(i, "lessonsPerWeek", Number(e.target.value))} />
                    </div>
                    <div>
                      <label className={labelClass}>1コマの時間</label>
                      <select className={inputClass} value={s.lessonMinutes} onChange={(e) => updateSchool(i, "lessonMinutes", Number(e.target.value))}>
                        {[45, 50, 60, 90, 120].map((m) => <option key={m} value={m}>{m}分</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>科目数</label>
                    <input type="number" className={inputClass} min={1} max={10} value={s.subjects} onChange={(e) => updateSchool(i, "subjects", Number(e.target.value))} />
                  </div>
                  <div>
                    <label className={labelClass}>入会金（円）</label>
                    <input type="number" className={inputClass} min={0} value={s.enrollment} onChange={(e) => updateSchool(i, "enrollment", Number(e.target.value))} />
                  </div>
                  <div>
                    <label className={labelClass}>年間教材費（テキスト等）（円）</label>
                    <input type="number" className={inputClass} min={0} value={s.annualMaterials} onChange={(e) => updateSchool(i, "annualMaterials", Number(e.target.value))} />
                  </div>
                  <div>
                    <label className={labelClass}>季節講習費合計/年（円）</label>
                    <input type="number" className={inputClass} min={0} value={s.seasonalCost} onChange={(e) => updateSchool(i, "seasonalCost", Number(e.target.value))} />
                  </div>
                  <div>
                    <label className={labelClass}>交通費（月額・円）</label>
                    <input type="number" className={inputClass} min={0} value={s.transport} onChange={(e) => updateSchool(i, "transport", Number(e.target.value))} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={handleCalculate}
        className="w-full bg-kon hover:bg-ai text-white font-bold py-4 rounded-xl transition-colors text-lg mb-8 shadow-sm">
        費用を計算・比較する
      </button>

      {showResult && (
        <div id="results" className="space-y-6">
          <div className={`grid gap-4 ${activeCount === 1 ? "grid-cols-1 max-w-sm" : activeCount === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
            {activeSchools.map((s, i) => {
              const r = results[i];
              const isCheapest = r.grandTotal === minGrandTotal;
              const label = s.name || `塾${String.fromCharCode(65 + i)}`;
              return (
                <div key={i} className={`bg-white rounded-xl shadow-sm border-2 ${isCheapest ? "border-green-400" : "border-gray-100"} p-5 relative`}>
                  {isCheapest && activeCount > 1 && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-0.5 rounded-full">最安値 ★</span>
                  )}
                  <h3 className="font-bold text-gray-800 mb-1">{label}</h3>
                  <p className="text-xs text-gray-400 mb-4">{s.format}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">月謝</span><span className="font-medium">{yen(s.monthly)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">月次総費用</span><span className="font-medium">{yen(r.monthlyTotal)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">年間総費用</span><span className="font-medium">{man(r.annualTotal)}</span></div>
                    <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
                      <span className="text-gray-700 font-semibold">{period}総費用</span>
                      <span className="text-xl font-bold text-kon">{man(r.grandTotal)}</span>
                    </div>
                    <div className="flex justify-between"><span className="text-gray-500">1コマ費用</span><span className="font-medium">{yen(Math.round(r.costPerLesson))}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">1時間あたり</span><span className="font-medium">{yen(Math.round(r.costPerHour))}</span></div>
                  </div>
                </div>
              );
            })}
          </div>

          {activeCount >= 2 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100"><h3 className="font-bold text-gray-700">費用比較表</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 text-gray-600 font-medium">項目</th>
                      {activeSchools.map((s, i) => <th key={i} className="text-right px-4 py-3 text-gray-700 font-semibold">{s.name || `塾${String.fromCharCode(65 + i)}`}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "月謝", values: activeSchools.map((s) => s.monthly), highlight: false },
                      { label: "入会金", values: activeSchools.map((s) => s.enrollment), highlight: false },
                      { label: "年間教材費", values: activeSchools.map((s) => s.annualMaterials), highlight: false },
                      { label: "季節講習/年", values: activeSchools.map((s) => s.seasonalCost), highlight: false },
                      { label: "交通費/月", values: activeSchools.map((s) => s.transport), highlight: false },
                      { label: "月次総費用", values: results.map((r) => r.monthlyTotal), highlight: false },
                      { label: "年間総費用", values: results.map((r) => r.annualTotal), highlight: false },
                      { label: `${period}総費用`, values: results.map((r) => r.grandTotal), highlight: true },
                      { label: "1時間単価", values: results.map((r) => Math.round(r.costPerHour)), highlight: false },
                    ].map(({ label, values, highlight }) => {
                      const minVal = Math.min(...values);
                      return (
                        <tr key={label} className={`border-t border-gray-50 ${highlight ? "bg-gray-50/40 font-semibold" : ""}`}>
                          <td className="px-4 py-3 text-gray-600">{label}</td>
                          {values.map((v, i) => (
                            <td key={i} className={`text-right px-4 py-3 ${v === minVal && activeCount > 1 ? "text-green-600 font-bold" : "text-gray-700"}`}>
                              {highlight ? man(v) : yen(Math.round(v))}{v === minVal && activeCount > 1 && highlight ? " ★" : ""}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-700 mb-4">年間費用の内訳</h3>
            <div className={`grid gap-6 ${activeCount === 1 ? "grid-cols-1" : activeCount === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {activeSchools.map((s, i) => {
                const label = s.name || `塾${String.fromCharCode(65 + i)}`;
                const annual = calcAnnualTotal(s);
                const parts = [
                  { name: "月謝（年間）", value: s.monthly * 12 },
                  { name: "教材費", value: s.annualMaterials },
                  { name: "季節講習", value: s.seasonalCost },
                  { name: "交通費（年間）", value: s.transport * 12 },
                  { name: "入会金（初年度）", value: s.enrollment },
                ];
                return (
                  <div key={i}>
                    <p className="font-semibold text-gray-700 mb-2 text-sm">{label}の費用内訳</p>
                    <div className="space-y-2">
                      {parts.filter((p) => p.value > 0).map(({ name, value }) => {
                        const ratio = annual > 0 ? value / annual : 0;
                        const pct = Math.round(ratio * 100);
                        return (
                          <div key={name}>
                            <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                              <span>{name}</span><span>{pct}% / {yen(value)}</span>
                            </div>
                            <div className="text-kon text-xs font-mono leading-none">{bar(ratio)}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-kon mb-3 flex items-center gap-2"><span>💡</span> コスト削減アドバイス</h3>
            <ul className="space-y-2">
              {getAdvices().map((a, i) => (
                <li key={i} className="text-sm text-kon flex gap-2">
                  <span className="mt-0.5 shrink-0">•</span><span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mt-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">塾・予備校の費用相場（2026年）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 py-3 text-gray-600 font-medium">種別</th>
                <th className="text-right px-3 py-3 text-gray-600 font-medium">月謝目安</th>
                <th className="text-right px-3 py-3 text-gray-600 font-medium">年間費用目安</th>
                <th className="text-left px-3 py-3 text-gray-600 font-medium hidden md:table-cell">特徴</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: "大手集団塾（中学生）", monthly: "2〜5万円/月", annual: "30〜80万円", note: "競争環境・カリキュラム充実" },
                { type: "個別指導塾（週2回）", monthly: "3〜6万円/月", annual: "40〜90万円", note: "苦手科目対応・柔軟" },
                { type: "大手予備校（高3）", monthly: "5〜10万円/月", annual: "70〜150万円", note: "大学受験専門・実績豊富" },
                { type: "オンライン塾", monthly: "1〜3万円/月", annual: "15〜40万円", note: "低コスト・場所自由" },
                { type: "映像授業サービス", monthly: "0.5〜2万円/月", annual: "6〜25万円", note: "最安・自己管理必要" },
                { type: "家庭教師", monthly: "3〜8万円/月", annual: "40〜100万円", note: "完全個別・最高単価" },
              ].map(({ type, monthly, annual, note }) => (
                <tr key={type} className="border-t border-gray-50">
                  <td className="px-3 py-3 text-gray-700 font-medium">{type}</td>
                  <td className="px-3 py-3 text-right text-gray-600">{monthly}</td>
                  <td className="px-3 py-3 text-right text-kon font-semibold">{annual}</td>
                  <td className="px-3 py-3 text-gray-500 text-xs hidden md:table-cell">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">※上記は目安です。塾・地域・学年・受講科目数により異なります。</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">塾・予備校費用の基礎知識</h2>
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">塾費用の内訳を理解する</h3>
            <p>多くの保護者が「月謝」だけで塾を選びますが、実際の費用は月謝以外にも多くかかります。見落としがちな費用として、<strong>入会金</strong>（多くの塾で1〜3万円）、<strong>教材費</strong>（テキスト・プリント代、年間1〜5万円）、<strong>季節講習費</strong>（春夏冬それぞれ5〜15万円、年間合計10〜40万円）、<strong>交通費</strong>（月3,000〜15,000円）があります。月謝だけで比較すると実際の総費用を大幅に見誤る場合があります。</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">1時間単価で比較する重要性</h3>
            <p>塾選びでは「月謝の安さ」だけでなく、<strong>1時間あたりの費用</strong>で比較することが重要です。集団塾は月謝が安くても授業時間が少ない場合、個別指導に比べて割高になることがあります。また、オンライン塾は対面塾に比べて1時間単価が安い傾向があります（1,500〜3,000円 vs 3,000〜8,000円）。</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">3年間の総額で考える</h3>
            <p>受験対策など長期通塾の場合、3年間の総費用で考えることが重要です。月謝3万円の塾でも3年間で入会金・教材費・季節講習を含めると150〜200万円になることがあります。月謝5,000円の差でも3年間で18万円の差になりますので、長期視点での比較をおすすめします。</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQ_LIST.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-start justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-700 text-sm pr-2">Q. {item.q}</span>
                <span className="text-gray-400 shrink-0 ml-2 mt-0.5">{openFaq === i ? "▲" : "▼"}</span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                  <p className="pt-3">A. {item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-700 mb-3">関連ツール</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {RELATED_TOOLS.map(({ href, label }) => (
            <a key={href} href={href}
              className="bg-white border border-gray-100 rounded-xl p-4 text-sm font-medium text-kon hover:bg-gray-50 hover:border-ai transition-colors text-center shadow-sm">
              {label}
            </a>
          ))}
        </div>
      {/* 広告 */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <AdUnit slot="5612038947" format="horizontal" />
      </div>
      </div>
    </div>
  );
}
