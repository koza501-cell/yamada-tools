"use client";

import { useState, useEffect, useRef } from "react";
import { AdUnit } from "@/components/common/AdUnit";
import {
  calcShakaiHoken,
  getHyojunHoshu,
  type ShakaiHokenInput,
  type InsuranceItem,
  type CalcTarget,
  type EmploymentCategory,
  type ShakaiHokenMonthlyResult,
  type ShakaiHokenBonusResult,
} from "@/lib/shakai-hoken-calculator";
import { PREFECTURES } from "@/data/prefecture-health-insurance-2026";

// ── useCountUp ────────────────────────────────────────────────
function useCountUp(target: number, duration = 500): number {
  const [value, setValue] = useState(target);
  const prev = useRef(target);
  const raf  = useRef<number>(0);
  const startTs = useRef(0);

  useEffect(() => {
    const from = prev.current;
    prev.current = target;
    if (from === target) return;
    const diff = target - from;
    const tick = (ts: number) => {
      if (!startTs.current) startTs.current = ts;
      const p    = Math.min((ts - startTs.current) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + diff * ease));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    startTs.current = 0;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}

// ── Constants ──────────────────────────────────────────────────
const INDUSTRY_OPTIONS = [
  { label: "その他の事業（一般）",     rate: 0.3 },
  { label: "製造業・印刷業",           rate: 0.4 },
  { label: "農業・林業・漁業",         rate: 0.6 },
  { label: "運送業・倉庫業",           rate: 0.6 },
  { label: "建設業",                   rate: 0.9 },
];

const ITEM_COLOR_BAR: Record<string, string> = {
  pension: "bg-blue-500",
  health:  "bg-indigo-500",
  nursing: "bg-purple-500",
  child:   "bg-orange-400",
  empIns:  "bg-yellow-500",
  workAcc: "bg-red-400",
};

const ITEM_COLOR_DOT: Record<string, string> = {
  pension: "bg-blue-500",
  health:  "bg-indigo-500",
  nursing: "bg-purple-500",
  child:   "bg-orange-400",
  empIns:  "bg-yellow-500",
  workAcc: "bg-red-400",
};

const FAQ_ITEMS = [
  {
    q: "社会保険料はどうやって計算するの？",
    a: "月給を「標準報酬月額」に換算し、各保険の料率をかけて算出します。標準報酬月額は月給の金額帯ごとに1〜50等級（全50段階）に分類されます。従業員と会社が原則折半で負担します。",
  },
  {
    q: "標準報酬月額とは何ですか？",
    a: "実際の月給を50段階に区分した「みなし賃金」です。4・5・6月の平均月給をもとに9月に改定されます（定時決定）。社会保険料の計算基礎になり、将来の年金額にも影響します。",
  },
  {
    q: "会社はどれくらい社会保険料を負担しているの？",
    a: "厚生年金・健康保険・介護保険・子育て支援金は従業員と折半。雇用保険は会社の負担が大きく（一般事業で月給の1.05%）、労災保険は全額会社負担です。月給30万円の場合、会社負担は月5〜6万円程度になります。",
  },
  {
    q: "介護保険料はいつから引かれますか？",
    a: "40歳の誕生日の前日が属する月から徴収が始まり、65歳の誕生日の前日が属する月の前月まで控除されます。介護保険料率は1.60%（従業員・会社各0.80%）です。",
  },
  {
    q: "賞与の社会保険料の上限はありますか？",
    a: "はい。厚生年金は1回あたり¥1,500,000が上限、健康保険は年間累計¥5,730,000が上限です。上限を超えた賞与には社会保険料がかかりません。賞与の千円未満は切り捨てた「標準賞与額」をもとに計算します。",
  },
];

// ── Sub-components ─────────────────────────────────────────────

function GradeIndicator({ grade, amount }: { grade: number; amount: number }) {
  const fillPct = (grade / 50) * 100;
  const barColor =
    grade >= 40 ? "bg-red-500" : grade >= 30 ? "bg-orange-500" : "bg-blue-500";
  const badgeClass =
    grade >= 35
      ? "bg-red-100 text-red-700"
      : "bg-blue-100 text-blue-700";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">標準報酬月額等級</span>
        <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
          第{grade}等級
        </span>
      </div>
      <p className="text-xl font-bold text-gray-800 mb-2">¥{amount.toLocaleString()}</p>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${fillPct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>第1等級 ¥58,000</span>
        <span>第50等級 ¥1,390,000</span>
      </div>
      {grade >= 35 && (
        <p className="text-xs text-red-600 mt-2">
          ⚠ 厚生年金は第35等級（¥650,000）が上限
        </p>
      )}
    </div>
  );
}

function ItemsTable({
  items,
  mul,
  perspective,
}: {
  items: InsuranceItem[];
  mul: number;
  perspective: "employee" | "employer";
}) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="py-2 text-left text-gray-500 font-medium">項目</th>
          <th className="py-2 text-right text-gray-500 font-medium">従業員</th>
          <th className="py-2 text-right text-gray-500 font-medium">会社</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.key} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-2.5">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    ITEM_COLOR_DOT[item.key] ?? "bg-gray-400"
                  }`}
                />
                <span className="text-gray-700">{item.label}</span>
              </div>
              <div className="text-xs text-gray-400 pl-4">
                従 {item.employeeRate} / 社 {item.employerRate}
                {item.note && <span className="ml-1 text-orange-500">({item.note})</span>}
              </div>
            </td>
            <td
              className={`py-2.5 text-right font-medium ${
                perspective === "employee" ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {item.employeeAmt > 0 ? `¥${(item.employeeAmt * mul).toLocaleString()}` : "—"}
            </td>
            <td
              className={`py-2.5 text-right font-medium ${
                perspective === "employer" ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {item.employerAmt > 0 ? `¥${(item.employerAmt * mul).toLocaleString()}` : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StackedBar({ items, monthlyGross }: { items: InsuranceItem[]; monthlyGross: number }) {
  if (!monthlyGross) return null;
  const totalEmp = items.reduce((s, i) => s + i.employeeAmt, 0);
  const takehome = monthlyGross - totalEmp;

  const segments = [
    { key: "takehome", label: "社保控除後", amount: takehome, barColor: "bg-green-500" },
    ...items
      .filter((i) => i.employeeAmt > 0)
      .map((i) => ({
        key: i.key,
        label: i.label,
        amount: i.employeeAmt,
        barColor: ITEM_COLOR_BAR[i.key] ?? "bg-gray-400",
      })),
  ];

  return (
    <div className="mt-4">
      <p className="text-xs text-gray-500 mb-2">月給内訳（従業員負担ベース）</p>
      <div className="flex h-6 rounded-lg overflow-hidden gap-0.5">
        {segments.map((seg) => {
          const w = (seg.amount / monthlyGross) * 100;
          if (w < 1) return null;
          return (
            <div
              key={seg.key}
              className={`${seg.barColor} transition-all duration-500`}
              style={{ width: `${w}%` }}
              title={`${seg.label}: ¥${seg.amount.toLocaleString()} (${w.toFixed(1)}%)`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {segments.map((seg) => {
          const w = (seg.amount / monthlyGross) * 100;
          if (w < 1) return null;
          return (
            <div key={seg.key} className="flex items-center gap-1 text-xs text-gray-500">
              <span className={`inline-block w-2 h-2 rounded-full ${seg.barColor}`} />
              {seg.label} {w.toFixed(1)}%
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-800 pr-4">{item.q}</span>
              <svg
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                  open === i ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3 leading-relaxed">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function ShakaiHokenCalculator() {
  const [calcTarget, setCalcTarget]         = useState<CalcTarget>("monthly");
  const [monthlyGross, setMonthlyGross]     = useState(300000);
  const [monthlyText, setMonthlyText]       = useState("300000");
  const [bonus, setBonus]                   = useState(600000);
  const [bonusText, setBonusText]           = useState("600000");
  const [prefecture, setPrefecture]         = useState("東京");
  const [age, setAge]                       = useState(35);
  const [ageText, setAgeText]               = useState("35");
  const [empCategory, setEmpCategory]       = useState<EmploymentCategory>("general");
  const [industryIdx, setIndustryIdx]       = useState(0);
  const [perspective, setPerspective]       = useState<"employee" | "employer">("employee");
  const [annual, setAnnual]                 = useState(false);
  const [bonusOpen, setBonusOpen]           = useState(false);

  const workersAccidentRate = INDUSTRY_OPTIONS[industryIdx]?.rate ?? 0.3;

  const input: ShakaiHokenInput = {
    calcTarget,
    monthlyGross,
    bonus,
    prefecture,
    age,
    employmentCategory: empCategory,
    workersAccidentRate,
  };

  const result = calcShakaiHoken(input);
  const m = result.monthly;
  const b = result.bonus;

  const mul = annual ? 12 : 1;

  // Derived values — always computed (no conditional hooks)
  const mEmpTotal  = m ? m.totalEmployee * mul : 0;
  const mCoTotal   = m ? m.totalEmployer * mul : 0;
  const mTakeHome  = m ? (monthlyGross - m.totalEmployee) * mul : 0;
  const mLaborCost = m ? (monthlyGross + m.totalEmployer) * mul : 0;
  const bEmpTotal  = b ? b.totalEmployee : 0;
  const bCoTotal   = b ? b.totalEmployer : 0;

  const animEmpTotal  = useCountUp(mEmpTotal);
  const animCoTotal   = useCountUp(mCoTotal);
  const animTakeHome  = useCountUp(mTakeHome);
  const animLaborCost = useCountUp(mLaborCost);
  const animBEmp      = useCountUp(bEmpTotal);
  const animBCo       = useCountUp(bCoTotal);

  const showMonthly = calcTarget === "monthly" || calcTarget === "both";
  const showBonus   = calcTarget === "bonus"   || calcTarget === "both";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        社会保険料計算ツール 2026
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        月給・賞与の従業員負担・会社負担を自動計算。標準報酬月額等級・都道府県別健康保険料対応。
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── 入力パネル ─────────────────────────────────── */}
        <div className="flex-1 space-y-4">
          {/* 計算対象 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-700 mb-3 text-sm">計算対象</h2>
            <div className="flex gap-2">
              {(["monthly", "bonus", "both"] as CalcTarget[]).map((t) => {
                const label =
                  t === "monthly" ? "月給のみ" : t === "bonus" ? "賞与のみ" : "月給＋賞与";
                return (
                  <button
                    key={t}
                    onClick={() => setCalcTarget(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      calcTarget === t
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 月給スライダー */}
          {showMonthly && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-700 mb-3 text-sm">月給（額面）</h2>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-gray-400 text-sm">¥</span>
                <input
                  type="number"
                  value={monthlyText}
                  onChange={(e) => {
                    setMonthlyText(e.target.value);
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= 0) setMonthlyGross(v);
                  }}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <input
                type="range"
                min={100000}
                max={1500000}
                step={10000}
                value={Math.min(Math.max(monthlyGross, 100000), 1500000)}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setMonthlyGross(v);
                  setMonthlyText(String(v));
                }}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>¥100,000</span>
                <span>¥1,500,000</span>
              </div>
            </div>
          )}

          {/* 賞与入力 */}
          {showBonus && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-700 mb-1 text-sm">賞与額</h2>
              <p className="text-xs text-gray-400 mb-3">
                厚生年金上限 ¥1,500,000/回・健康保険上限 ¥5,730,000/年累計
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">¥</span>
                <input
                  type="number"
                  value={bonusText}
                  onChange={(e) => {
                    setBonusText(e.target.value);
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= 0) setBonus(v);
                  }}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          )}

          {/* 都道府県・年齢 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">都道府県</label>
              <select
                value={prefecture}
                onChange={(e) => setPrefecture(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {PREFECTURES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                年齢
                <span className="text-xs text-gray-400 ml-1">（介護保険: 40〜64歳）</span>
              </label>
              <input
                type="number"
                min={18}
                max={75}
                value={ageText}
                onChange={(e) => {
                  setAgeText(e.target.value);
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) setAge(v);
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* 雇用保険 & 労災 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <div>
              <h2 className="font-semibold text-gray-700 mb-2 text-sm">雇用保険 雇用形態</h2>
              <div className="space-y-1.5">
                {(
                  [
                    ["general",      "一般事業",                  "従業員0.5% / 会社1.05%"],
                    ["agriculture",  "農林水産業・清酒製造業",    "従業員0.6% / 会社1.15%"],
                    ["construction", "建設業",                    "従業員0.6% / 会社1.15%"],
                  ] as [EmploymentCategory, string, string][]
                ).map(([val, label, rate]) => (
                  <label key={val} className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={empCategory === val}
                      onChange={() => setEmpCategory(val)}
                      className="mt-0.5 accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">
                      {label}
                      <span className="text-xs text-gray-400 ml-1">({rate})</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-700 mb-2 text-sm">労災保険料率（業種別）</h2>
              <select
                value={industryIdx}
                onChange={(e) => setIndustryIdx(parseInt(e.target.value, 10))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {INDUSTRY_OPTIONS.map((opt, i) => (
                  <option key={i} value={i}>
                    {opt.label}（{opt.rate.toFixed(1)}%）
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">労災保険は会社全額負担です</p>
            </div>
          </div>

          <AdUnit slot="5612038947" format="rectangle" className="my-4" />
        </div>

        {/* ── 結果パネル ─────────────────────────────────── */}
        <div className="lg:w-[430px] xl:w-[460px] lg:sticky lg:top-4 self-start space-y-4">
          {/* Toggle bar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-0.5 p-1 bg-gray-100 rounded-lg">
              {(["employee", "employer"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setPerspective(v)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    perspective === v
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {v === "employee" ? "従業員視点" : "事業主視点"}
                </button>
              ))}
            </div>
            <div className="flex gap-0.5 p-1 bg-gray-100 rounded-lg">
              {([false, true] as const).map((v) => (
                <button
                  key={String(v)}
                  onClick={() => setAnnual(v)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    annual === v
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {v ? "年次" : "月次"}
                </button>
              ))}
            </div>
          </div>

          {/* 月給結果 */}
          {m && (
            <>
              <GradeIndicator grade={m.hyojunGrade} amount={m.hyojunHoshu} />

              {/* Hero card */}
              {perspective === "employee" ? (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 text-white">
                  <p className="text-blue-200 text-sm mb-1">従業員負担 社会保険料合計</p>
                  <p className="text-3xl font-bold">
                    ¥{animEmpTotal.toLocaleString()}
                    <span className="text-base font-normal text-blue-200 ml-1">{annual ? "/年" : "/月"}</span>
                  </p>
                  <div className="mt-3 pt-3 border-t border-blue-500 flex justify-between text-sm">
                    <span className="text-blue-200">社保控除後の手取り見込み</span>
                    <span className="font-semibold">¥{animTakeHome.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-blue-300 mt-1">※所得税・住民税は別途控除されます</p>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-5 text-white">
                  <p className="text-emerald-200 text-sm mb-1">会社負担 社会保険料合計</p>
                  <p className="text-3xl font-bold">
                    ¥{animCoTotal.toLocaleString()}
                    <span className="text-base font-normal text-emerald-200 ml-1">{annual ? "/年" : "/月"}</span>
                  </p>
                  <div className="mt-3 pt-3 border-t border-emerald-500 flex justify-between text-sm">
                    <span className="text-emerald-200">総人件費（月給＋会社負担）</span>
                    <span className="font-semibold">¥{animLaborCost.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-emerald-300 mt-1">
                    月給 ¥{(monthlyGross * mul).toLocaleString()} + 会社社保 ¥{animCoTotal.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Breakdown table */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <ItemsTable items={m.items} mul={mul} perspective={perspective} />
                <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-3 text-sm font-semibold">
                  <span className="text-gray-700">合計</span>
                  <span className="text-right text-blue-700">¥{(m.totalEmployee * mul).toLocaleString()}</span>
                  <span className="text-right text-emerald-700">¥{(m.totalEmployer * mul).toLocaleString()}</span>
                </div>
                {!annual && <StackedBar items={m.items} monthlyGross={monthlyGross} />}
              </div>
            </>
          )}

          {/* 賞与のみモードのヒーローカード */}
          {!m && b && (
            <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl p-5 text-white">
              <p className="text-violet-200 text-sm mb-1">賞与 従業員負担 社会保険料</p>
              <p className="text-3xl font-bold">
                ¥{animBEmp.toLocaleString()}
              </p>
              <div className="mt-3 pt-3 border-t border-violet-500 flex justify-between text-sm">
                <span className="text-violet-200">会社負担</span>
                <span className="font-semibold">¥{animBCo.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* 賞与セクション */}
          {b && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setBonusOpen(!bonusOpen)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-700 text-sm">賞与の社会保険料</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-blue-600 font-medium">
                    従業員 ¥{b.totalEmployee.toLocaleString()}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${bonusOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {bonusOpen && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mt-3 mb-3">
                    標準賞与額（千円未満切捨）: ¥{b.hyojunBonus.toLocaleString()}
                  </p>
                  <ItemsTable items={b.items} mul={1} perspective={perspective} />
                  <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-3 text-sm font-semibold">
                    <span className="text-gray-700">合計</span>
                    <span className="text-right text-blue-700">¥{b.totalEmployee.toLocaleString()}</span>
                    <span className="text-right text-emerald-700">¥{b.totalEmployer.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 賞与シミュレーターへの誘導（月給のみモード時） */}
          {calcTarget === "monthly" && (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-400">
                賞与シミュレーターは「月給＋賞与」を選択してご利用ください
              </p>
            </div>
          )}
        </div>
      </div>

      <FaqAccordion />

      <AdUnit slot="5612038947" format="horizontal" className="mt-8 print:hidden" />
    </div>
  );
}
