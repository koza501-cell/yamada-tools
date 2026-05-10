"use client";
import React, { useState } from "react";
import { FAQSection } from "@/components/FAQSection";
import StaticAdSlot from "@/components/common/StaticAdSlot";

interface CalcResult {
  error?: string;
  hourlyWage?: number;
  base?: number;
  nightAllowanceTotal?: number;
  overtimePay?: number;
  lateNightOvertimePay?: number;
  holidayPay?: number;
  onCallPay?: number;
  allowances?: number;
  grossMonthly?: number;
  estimatedAnnual?: number;
  industryAvg?: number;
  diff?: number;
  diffPercent?: string;
}

const JOB_TYPES = ["看護師（正看）", "准看護師", "歯科衛生士", "医療事務", "受付", "看護助手", "薬剤師"];
const SHIFT_TYPES = ["日勤のみ", "2交代制", "3交代制", "夜勤専従"];

const NIGHT_ALLOWANCE_DEFAULTS: Record<string, Record<string, number>> = {
  "看護師（正看）": { "2交代制": 11368, "3交代準夜": 4234, "3交代深夜": 5199, "夜勤専従": 11368 },
  "准看護師": { "2交代制": 9500, "3交代準夜": 3500, "3交代深夜": 4300, "夜勤専従": 9500 },
  "歯科衛生士": { "2交代制": 8000, "3交代準夜": 3000, "3交代深夜": 3700, "夜勤専従": 8000 },
  "医療事務": { "2交代制": 7000, "3交代準夜": 2800, "3交代深夜": 3500, "夜勤専従": 7000 },
  "受付": { "2交代制": 6500, "3交代準夜": 2500, "3交代深夜": 3200, "夜勤専従": 6500 },
  "看護助手": { "2交代制": 7500, "3交代準夜": 3000, "3交代深夜": 3700, "夜勤専従": 7500 },
  "薬剤師": { "2交代制": 12000, "3交代準夜": 4500, "3交代深夜": 5500, "夜勤専従": 12000 },
};

const INDUSTRY_ANNUAL: Record<string, number> = {
  "看護師（正看）": 5247200,
  "准看護師": 4500000,
  "歯科衛生士": 3850000,
  "医療事務": 3200000,
  "受付": 2900000,
  "看護助手": 3000000,
  "薬剤師": 5800000,
};

const fmt = (n: number) => new Intl.NumberFormat("ja-JP").format(n);

const faqItems = [
  {
    question: "看護師の夜勤手当の相場は？",
    answer: "日本看護協会「2023年病院看護実態調査」によると、2交代制は1回平均11,368円、3交代制の準夜勤は4,234円、深夜勤は5,199円です。yamada-tools.jpでは職種・勤務形態別に業界平均が自動セットされます。",
  },
  {
    question: "深夜割増賃金とは？",
    answer: "労働基準法第37条により、22:00〜翌5:00の労働には通常賃金の25%以上の割増が義務付けられています。これは病院独自の夜勤手当とは別途必要です。山田ツールでは時給から自動計算します。",
  },
  {
    question: "深夜残業の割増率は？",
    answer: "深夜時間帯（22:00〜5:00）の時間外労働は、残業25% + 深夜25% = 合計50%の割増となります。yamada-tools.jpでは深夜残業時間を別途入力でき、正確に計算できます。",
  },
  {
    question: "看護師の平均年収はいくら？",
    answer: "厚生労働省「令和7年賃金構造基本統計調査」によると、看護師の平均年収は約524万円（夜勤手当含む）です。山田ツールで自院の給与水準を業界平均と即比較できます。",
  },
  {
    question: "オンコール手当の相場は？",
    answer: "オンコール（待機）手当は1回あたり2,000〜5,000円が一般的で、デフォルト値は3,000円としています。実際に呼び出された場合は別途呼出手当が必要です。yamada-tools.jpで月間回数から計算できます。",
  },
  {
    question: "休日出勤の割増率は？",
    answer: "法定休日労働は35%以上の割増（合計1.35倍）が義務付けられています。法定外休日は時間外労働として25%割増です。山田ツールでは法定休日基準で計算しています。",
  },
  {
    question: "歯科衛生士の平均給与は？",
    answer: "歯科衛生士の平均年収は約385万円（厚労省統計）で、夜勤がある職場は少なめです。yamada-tools.jpでは歯科衛生士向けの計算にも対応しており、業界平均との比較が可能です。",
  },
  {
    question: "医療スタッフの給与を無料で計算できるツールは？",
    answer: "はい、yamada-tools.jp（山田ツール）で完全無料・登録不要で計算できます。看護師・歯科衛生士・医療事務など職種別に夜勤手当・深夜割増・オンコール手当をワンクリックで計算します。",
  },
];

const RELATED_TOOLS = [
  { nameJa: "📖 クリニック経営の数字管理ガイド", path: "/blog/clinic-keiei-suji-kanri-guide" },
  { nameJa: "クリニック損益分岐点シミュレーター", path: "/clinic/break-even-calculator" },
  { nameJa: "クリニック人件費率診断ツール", path: "/clinic/labor-cost-ratio-diagnosis" },
  { nameJa: "残業代手当計算機", path: "/generator/zangyou-tegata" },
  { nameJa: "所得税計算機", path: "/tax/syotokuzei-calculator", coming: true as boolean },
];

function BarChart({ own, industry }: { own: number; industry: number }) {
  const maxVal = Math.max(own, industry, 1000000) * 1.2;
  const W = 480, H = 140, PL = 100, PR = 100, PT = 20;
  const chartW = W - PL - PR;
  const barH = 36, gap = 16;
  const bars = [
    { label: "自院（推定）", value: own, color: "#3b82f6" },
    { label: "業界平均", value: industry, color: "#f59e0b" },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg">
      {bars.map((bar, i) => {
        const y = PT + i * (barH + gap);
        const bw = (bar.value / maxVal) * chartW;
        return (
          <g key={i}>
            <text x={PL - 6} y={y + barH / 2 + 4} textAnchor="end" fontSize="11" fill="#6b7280">{bar.label}</text>
            <rect x={PL} y={y} width={bw} height={barH} fill={bar.color} rx="4" opacity="0.85" />
            <text x={PL + bw + 6} y={y + barH / 2 + 4} fontSize="12" fill="#374151" fontWeight="bold">¥{fmt(bar.value)}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function MedicalStaffPayrollClient() {
  const [jobType, setJobType] = useState("看護師（正看）");
  const [baseSalary, setBaseSalary] = useState("");
  const [shiftType, setShiftType] = useState("日勤のみ");
  const [workHours, setWorkHours] = useState("160");
  const [twoShiftAllowance, setTwoShiftAllowance] = useState("11368");
  const [twoShiftCount, setTwoShiftCount] = useState("");
  const [jyunyaAllowance, setJyunyaAllowance] = useState("4234");
  const [jyunyaCount, setJyunyaCount] = useState("");
  const [shinyaAllowance, setShinyaAllowance] = useState("5199");
  const [shinyaCount, setShinyaCount] = useState("");
  const [overtime, setOvertime] = useState("");
  const [lateNightOvertime, setLateNightOvertime] = useState("");
  const [holidayWork, setHolidayWork] = useState("");
  const [onCallRate, setOnCallRate] = useState("3000");
  const [onCallCount, setOnCallCount] = useState("");
  const [commute, setCommute] = useState("");
  const [housing, setHousing] = useState("");
  const [qualification, setQualification] = useState("");
  const [position, setPosition] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);

  const handleJobChange = (job: string) => {
    setJobType(job);
    const defaults = NIGHT_ALLOWANCE_DEFAULTS[job] || {};
    if (shiftType === "2交代制" || shiftType === "夜勤専従") {
      setTwoShiftAllowance(String(defaults["2交代制"] || 0));
    } else if (shiftType === "3交代制") {
      setJyunyaAllowance(String(defaults["3交代準夜"] || 0));
      setShinyaAllowance(String(defaults["3交代深夜"] || 0));
    }
  };

  const handleShiftChange = (shift: string) => {
    setShiftType(shift);
    const defaults = NIGHT_ALLOWANCE_DEFAULTS[jobType] || {};
    if (shift === "2交代制" || shift === "夜勤専従") {
      setTwoShiftAllowance(String(defaults["2交代制"] || 0));
    } else if (shift === "3交代制") {
      setJyunyaAllowance(String(defaults["3交代準夜"] || 0));
      setShinyaAllowance(String(defaults["3交代深夜"] || 0));
    }
  };

  const handleCalculate = () => {
    const base = Number(baseSalary) || 0;
    const monthlyHours = Number(workHours) || 160;
    if (base <= 0 || monthlyHours <= 0) {
      setResult({ error: "基本給と月間労働時間を入力してください。" });
      return;
    }
    const hourlyWage = base / monthlyHours;
    let nightAllowanceTotal = 0;
    if (shiftType === "2交代制") {
      nightAllowanceTotal = (Number(twoShiftAllowance) || 0) * (Number(twoShiftCount) || 0);
    } else if (shiftType === "3交代制") {
      nightAllowanceTotal =
        (Number(jyunyaAllowance) || 0) * (Number(jyunyaCount) || 0) +
        (Number(shinyaAllowance) || 0) * (Number(shinyaCount) || 0);
    } else if (shiftType === "夜勤専従") {
      nightAllowanceTotal = (Number(twoShiftAllowance) || 0) * (Number(twoShiftCount) || 0);
    }
    const overtimeHours = Number(overtime) || 0;
    const overtimePay = overtimeHours * hourlyWage * 1.25;
    const lateNightOvertimeHours = Number(lateNightOvertime) || 0;
    const lateNightOvertimePay = lateNightOvertimeHours * hourlyWage * 1.50;
    const holidayHours = Number(holidayWork) || 0;
    const holidayPay = holidayHours * hourlyWage * 1.35;
    const onCallPay = (Number(onCallRate) || 0) * (Number(onCallCount) || 0);
    const allowances = (Number(commute) || 0) + (Number(housing) || 0) +
                       (Number(qualification) || 0) + (Number(position) || 0);
    const grossMonthly = base + nightAllowanceTotal + overtimePay +
                         lateNightOvertimePay + holidayPay + onCallPay + allowances;
    const estimatedAnnual = grossMonthly * 12 + base * 4;
    const industryAvg = INDUSTRY_ANNUAL[jobType] || 0;
    const diff = estimatedAnnual - industryAvg;
    const diffPercent = industryAvg > 0 ? (diff / industryAvg * 100) : 0;
    setResult({
      hourlyWage: Math.round(hourlyWage),
      base: Math.round(base),
      nightAllowanceTotal: Math.round(nightAllowanceTotal),
      overtimePay: Math.round(overtimePay),
      lateNightOvertimePay: Math.round(lateNightOvertimePay),
      holidayPay: Math.round(holidayPay),
      onCallPay: Math.round(onCallPay),
      allowances: Math.round(allowances),
      grossMonthly: Math.round(grossMonthly),
      estimatedAnnual: Math.round(estimatedAnnual),
      industryAvg,
      diff: Math.round(diff),
      diffPercent: diffPercent.toFixed(1),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-ai">ホーム</a>
          <span className="mx-2">/</span>
          <a href="/clinic" className="hover:text-ai">クリニック経営</a>
          <span className="mx-2">/</span>
          <span className="text-gray-700">医療スタッフ給与計算機</span>
        </nav>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">💰</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">医療スタッフ給与計算機</h1>
              <p className="text-sm text-gray-500">看護師・歯科衛生士・医療事務</p>
            </div>
          </div>
          <p className="text-gray-600">夜勤手当・深夜割増（25%）・残業・オンコール手当を自動計算。日本看護協会データで業界平均と比較。</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">給与情報を入力</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">職種</label>
              <select value={jobType} onChange={e => handleJobChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon">
                {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">勤務形態</label>
              <select value={shiftType} onChange={e => handleShiftChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon">
                {SHIFT_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">基本給（月）<span className="text-danger ml-1">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400 text-sm">¥</span>
                <input type="number" value={baseSalary} onChange={e => setBaseSalary(e.target.value)} placeholder="250000"
                  className="w-full border border-gray-300 rounded-lg pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">月間労働時間</label>
              <div className="relative">
                <input type="number" value={workHours} onChange={e => setWorkHours(e.target.value)} placeholder="160"
                  className="w-full border border-gray-300 rounded-lg px-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon" />
                <span className="absolute right-3 top-2 text-gray-400 text-sm">時間</span>
              </div>
            </div>
          </div>
          {(shiftType === "2交代制" || shiftType === "夜勤専従") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">夜勤手当（1回あたり）</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400 text-sm">¥</span>
                  <input type="number" value={twoShiftAllowance} onChange={e => setTwoShiftAllowance(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">夜勤回数（月）</label>
                <div className="relative">
                  <input type="number" value={twoShiftCount} onChange={e => setTwoShiftCount(e.target.value)} placeholder="4"
                    className="w-full border border-gray-300 rounded-lg px-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon" />
                  <span className="absolute right-3 top-2 text-gray-400 text-sm">回</span>
                </div>
              </div>
            </div>
          )}
          {shiftType === "3交代制" && (
            <div className="p-4 bg-gray-50 rounded-xl mb-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">準夜勤手当（1回）</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">¥</span>
                    <input type="number" value={jyunyaAllowance} onChange={e => setJyunyaAllowance(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">準夜勤回数（月）</label>
                  <div className="relative">
                    <input type="number" value={jyunyaCount} onChange={e => setJyunyaCount(e.target.value)} placeholder="5"
                      className="w-full border border-gray-300 rounded-lg px-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon" />
                    <span className="absolute right-3 top-2 text-gray-400 text-sm">回</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">深夜勤手当（1回）</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">¥</span>
                    <input type="number" value={shinyaAllowance} onChange={e => setShinyaAllowance(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">深夜勤回数（月）</label>
                  <div className="relative">
                    <input type="number" value={shinyaCount} onChange={e => setShinyaCount(e.target.value)} placeholder="4"
                      className="w-full border border-gray-300 rounded-lg px-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon" />
                    <span className="absolute right-3 top-2 text-gray-400 text-sm">回</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">残業時間（月）</label>
              <div className="relative">
                <input type="number" value={overtime} onChange={e => setOvertime(e.target.value)} placeholder="10"
                  className="w-full border border-gray-300 rounded-lg px-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon" />
                <span className="absolute right-3 top-2 text-gray-400 text-sm">時間</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">深夜残業（22-5時）</label>
              <div className="relative">
                <input type="number" value={lateNightOvertime} onChange={e => setLateNightOvertime(e.target.value)} placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon" />
                <span className="absolute right-3 top-2 text-gray-400 text-sm">時間</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">休日出勤（月）</label>
              <div className="relative">
                <input type="number" value={holidayWork} onChange={e => setHolidayWork(e.target.value)} placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon" />
                <span className="absolute right-3 top-2 text-gray-400 text-sm">時間</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">オンコール手当（1回）</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400 text-sm">¥</span>
                <input type="number" value={onCallRate} onChange={e => setOnCallRate(e.target.value)} placeholder="3000"
                  className="w-full border border-gray-300 rounded-lg pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">オンコール回数（月）</label>
              <div className="relative">
                <input type="number" value={onCallCount} onChange={e => setOnCallCount(e.target.value)} placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon" />
                <span className="absolute right-3 top-2 text-gray-400 text-sm">回</span>
              </div>
            </div>
          </div>
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-700 mb-2">諸手当</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "通勤手当", value: commute, setter: setCommute },
                { label: "住宅手当", value: housing, setter: setHousing },
                { label: "資格手当", value: qualification, setter: setQualification },
                { label: "役職手当", value: position, setter: setPosition },
              ].map(item => (
                <div key={item.label}>
                  <label className="block text-xs text-gray-500 mb-1">{item.label}</label>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-gray-400 text-xs">¥</span>
                    <input type="number" value={item.value} onChange={e => item.setter(e.target.value)} placeholder="0"
                      className="w-full border border-gray-300 rounded-lg pl-5 pr-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button type="button" onClick={handleCalculate}
            className="w-full bg-kon hover:bg-ai text-white font-semibold py-3 rounded-xl transition-colors text-base">
            計算する
          </button>
        </div>

        {/* Results */}
        {result && (
          <div>
            {result.error ? (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6 text-danger text-sm">{result.error}</div>
            ) : (
              <>
                {/* 月給内訳テーブル */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">月給内訳</h2>
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        { label: "基本給", value: result.base },
                        { label: "夜勤手当（定額）", value: result.nightAllowanceTotal },
                        { label: "残業手当（25%）", value: result.overtimePay },
                        { label: "深夜残業手当（50%）", value: result.lateNightOvertimePay },
                        { label: "休日出勤手当（35%）", value: result.holidayPay },
                        { label: "オンコール手当", value: result.onCallPay },
                        { label: "諸手当", value: result.allowances },
                      ].map(row => (
                        <tr key={row.label} className="border-b border-gray-100">
                          <td className="py-2 text-gray-600">{row.label}</td>
                          <td className="py-2 text-right font-mono text-gray-800">¥{fmt(row.value || 0)}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td className="py-3 font-bold text-gray-900">月給総額</td>
                        <td className="py-3 text-right font-bold text-kon font-mono text-lg">¥{fmt(result.grossMonthly || 0)}</td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="py-2 text-gray-500 text-xs">時給換算</td>
                        <td className="py-2 text-right font-mono text-gray-600 text-xs">¥{fmt(result.hourlyWage || 0)}/時間</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 年収目安 */}
                <div className="bg-gradient-to-r from-slate-900 to-kon rounded-2xl p-6 mb-6 text-white">
                  <p className="text-sm text-gin mb-1">推定年収（月給×12 + 賞与4ヶ月）</p>
                  <p className="text-3xl font-bold">¥{fmt(result.estimatedAnnual || 0)}</p>
                </div>

                <StaticAdSlot />

                {/* 業界平均比較 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">業界平均との比較</h2>
                  <BarChart own={result.estimatedAnnual || 0} industry={result.industryAvg || 0} />
                  <p className="text-xs text-gray-400 mt-2">出典: 厚労省 令和7年賃金構造基本統計調査 / 日本看護協会2023年病院看護実態調査</p>
                  <div className="mt-4 p-4 rounded-xl bg-gray-50">
                    <p className="text-sm text-gray-700">
                      業界平均（{jobType}）: <span className="font-bold">¥{fmt(result.industryAvg || 0)}</span>
                    </p>
                    <p className="text-sm mt-1">
                      差額:{" "}
                      <span className={(result.diff || 0) >= 0 ? "text-green-600 font-bold" : "text-danger font-bold"}>
                        {(result.diff || 0) >= 0 ? "+" : ""}¥{fmt(Math.abs(result.diff || 0))}
                        （{(result.diff || 0) >= 0 ? "+" : ""}{result.diffPercent}%）
                      </span>
                    </p>
                    <p className="text-sm mt-2 text-gray-600">
                      {Number(result.diffPercent) >= 5
                        ? "業界平均より高水準。スタッフ満足度・定着率に有利です。"
                        : Number(result.diffPercent) >= -5
                        ? "業界平均水準です。"
                        : "業界平均より低水準。離職リスク・採用競争力に注意が必要です。"}
                    </p>
                  </div>
                </div>

                {/* 印刷ボタン */}
                <div className="flex justify-end mb-6">
                  <button type="button" onClick={() => window.print()}
                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                    印刷 / PDF保存
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <StaticAdSlot />

        <FAQSection faq={faqItems} />

        <StaticAdSlot />

        {/* 関連ツール */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">関連ツール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RELATED_TOOLS.map(tool => (
              <a
                key={tool.path}
                href={"coming" in tool && tool.coming ? undefined : tool.path}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${"coming" in tool && tool.coming ? "border-gray-100 bg-gray-50 cursor-default" : "border-gray-200 hover:border-ai hover:bg-gray-50"}`}
              >
                <span className="text-2xl">🔗</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{tool.nameJa}</p>
                  {"coming" in tool && tool.coming && <p className="text-xs text-gray-400">近日公開</p>}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 印刷フッター */}
        <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-xs text-gray-400 text-center">
          yamada-tools.jp — 医療スタッフ給与計算機 | 計算結果は参考値です。正確な計算は各都道府県の労働基準法に基づきご確認ください。
        </div>
      </div>
    </div>
  );
}
