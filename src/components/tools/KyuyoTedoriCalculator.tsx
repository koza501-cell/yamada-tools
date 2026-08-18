"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { calcTakeHome, type KyuyoInput } from "@/lib/kyuyo-calculator";
import {
  PREFECTURE_HEALTH_RATES_2026,
  PREFECTURES,
} from "@/data/prefecture-health-insurance-2026";
import { AdUnit } from "@/components/common/AdUnit";

// ============================================================
// Helpers
// ============================================================

function fmtNum(n: number): string {
  return Math.round(n).toLocaleString("ja-JP");
}

// ============================================================
// Count-up animation hook
// ============================================================

function useCountUp(target: number, duration = 500): number {
  const [current, setCurrent] = useState(target);
  const prevRef = useRef(target);

  useEffect(() => {
    const start = prevRef.current;
    const diff = target - start;
    if (Math.abs(diff) < 1) {
      setCurrent(target);
      prevRef.current = target;
      return;
    }
    const startTime = performance.now();
    let rafId: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(Math.round(start + diff * eased));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        prevRef.current = target;
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return current;
}

// ============================================================
// Prefecture searchable dropdown
// ============================================================

function PrefectureSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = PREFECTURES.filter((p) => p.includes(search));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-left flex justify-between items-center bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:border-gray-400"
      >
        <span className="font-medium text-gray-800">{value}</span>
        <span className="text-gray-400 text-xs ml-2">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-xl mt-1 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              placeholder="都道府県を検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  onChange(p);
                  setOpen(false);
                  setSearch("");
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  value === p
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                見つかりません
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Chart colors
// ============================================================

const COLORS = {
  takeHome:            "#1E3A8A",
  pension:             "#7C3AED",
  healthInsurance:     "#0891B2",
  nursingInsurance:    "#0D9488",
  childcareLevy:       "#DB2777",
  employmentInsurance: "#65A30D",
  incomeTax:           "#DC2626",
  residentTax:         "#EA580C",
};

// ============================================================
// Donut tooltip
// ============================================================

interface TooltipItem {
  name: string;
  value: number;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipItem[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-gray-700">{payload[0].name}</p>
      <p className="text-gray-900">
        {"\u00a5"}
        {Math.round(payload[0].value).toLocaleString("ja-JP")}
      </p>
    </div>
  );
}

// ============================================================
// Default input
// ============================================================

const DEFAULT: KyuyoInput = {
  monthlyGross: 300000,
  annualBonus: 600000,
  age: 30,
  dependents: 0,
  prefecture: "\u6771\u4eac",
  employmentType: "seishain",
  commuteMonthly: 10000,
};

// ============================================================
// Main component
// ============================================================

export default function KyuyoTedoriCalculator() {
  const [inp, setInp] = useState<KyuyoInput>(DEFAULT);
  const [viewMode, setViewMode] = useState<"monthly" | "annual">("monthly");
  const [tableOpen, setTableOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  function set<K extends keyof KyuyoInput>(key: K, val: KyuyoInput[K]) {
    setInp((prev) => ({ ...prev, [key]: val }));
  }

  const result = useMemo(() => calcTakeHome(inp), [inp]);
  const resultPlus1 = useMemo(
    () => calcTakeHome({ ...inp, dependents: inp.dependents + 1 }),
    [inp],
  );
  const resultAge40 = useMemo(
    () => (inp.age < 40 ? calcTakeHome({ ...inp, age: 40 }) : null),
    [inp],
  );

  const animatedTakeHome = useCountUp(
    viewMode === "monthly" ? result.monthlyTakeHome : result.annualTakeHome,
  );

  // Pie data — filter zeros
  const pieData = [
    { name: "\u624b\u53d6\u308a",     value: result.monthlyTakeHome,       color: COLORS.takeHome },
    { name: "\u6240\u5f97\u7a0e",     value: result.incomeTax,             color: COLORS.incomeTax },
    { name: "\u4f4f\u6c11\u7a0e",     value: result.residentTax,           color: COLORS.residentTax },
    { name: "\u5398\u751f\u5e74\u91d1", value: result.pension,             color: COLORS.pension },
    { name: "\u5065\u5eb7\u4fdd\u967a", value: result.healthInsurance,     color: COLORS.healthInsurance },
    { name: "\u4ecb\u8b77\u4fdd\u967a", value: result.nursingInsurance,    color: COLORS.nursingInsurance },
    { name: "\u96c7\u7528\u4fdd\u967a", value: result.employmentInsurance, color: COLORS.employmentInsurance },
    { name: "\u5b50\u80b2\u3066\u652f\u63f4\u91d1", value: result.childcareLevy, color: COLORS.childcareLevy },
  ].filter((d) => d.value > 0);

  // Stacked bar
  const stackSegs = [
    { label: "\u624b\u53d6\u308a",       pct: result.pcts.takeHome,            color: COLORS.takeHome },
    { label: "\u5398\u751f\u5e74\u91d1", pct: result.pcts.pension,             color: COLORS.pension },
    { label: "\u5065\u5eb7\u4fdd\u967a", pct: result.pcts.healthInsurance,     color: COLORS.healthInsurance },
    { label: "\u4ecb\u8b77\u4fdd\u967a", pct: result.pcts.nursingInsurance,    color: COLORS.nursingInsurance },
    { label: "\u5b50\u80b2\u3066\u652f\u63f4\u91d1", pct: result.pcts.childcareLevy, color: COLORS.childcareLevy },
    { label: "\u96c7\u7528\u4fdd\u967a", pct: result.pcts.employmentInsurance, color: COLORS.employmentInsurance },
    { label: "\u6240\u5f97\u7a0e",       pct: result.pcts.incomeTax,           color: COLORS.incomeTax },
    { label: "\u4f4f\u6c11\u7a0e",       pct: result.pcts.residentTax,         color: COLORS.residentTax },
  ].filter((s) => s.pct > 0);

  const healthRate = PREFECTURE_HEALTH_RATES_2026[inp.prefecture] ?? 10.01;
  const healthEmployeeRate = (healthRate / 2).toFixed(3);

  const handleCopy = useCallback(() => {
    const isAnnual = viewMode === "annual";
    const lines = [
      "\u300e\u7d66\u4e0e\u624b\u53d6\u308a\u8a08\u7b97\u7d50\u679c 2026\u300f",
      `\u6708\u53ce\uff08\u984d\u9762\uff09: \u00a5${fmtNum(result.monthlyGross)}`,
      `\u8cde\u4e0e\uff08\u5e74\u984d\uff09: \u00a5${fmtNum(result.annualBonus)}`,
      "",
      isAnnual
        ? `\u5e74\u9593\u624b\u53d6\u308a: \u00a5${fmtNum(result.annualTakeHome)}`
        : `\u6708\u9593\u624b\u53d6\u308a: \u00a5${fmtNum(result.monthlyTakeHome)}`,
      "",
      "── \u6708\u984d\u63a7\u9664\u5185\u8a33 ──",
      `\u5398\u751f\u5e74\u91d1: \u00a5${fmtNum(result.pension)}`,
      `\u5065\u5eb7\u4fdd\u967a: \u00a5${fmtNum(result.healthInsurance)}`,
      result.nursingInsurance > 0
        ? `\u4ecb\u8b77\u4fdd\u967a: \u00a5${fmtNum(result.nursingInsurance)}`
        : null,
      `\u5b50\u3069\u3082\u30fb\u5b50\u80b2\u3066\u652f\u63f4\u91d1: \u00a5${fmtNum(result.childcareLevy)}`,
      `\u96c7\u7528\u4fdd\u967a: \u00a5${fmtNum(result.employmentInsurance)}`,
      `\u793e\u4f1a\u4fdd\u967a\u6599\u5c0f\u8a08: \u00a5${fmtNum(result.totalSocialInsurance)}`,
      `\u6240\u5f97\u7a0e: \u00a5${fmtNum(result.incomeTax)}`,
      `\u4f4f\u6c11\u7a0e\uff08\u6982\u7b97\uff09: \u00a5${fmtNum(result.residentTax)}`,
      `\u63a7\u9664\u5408\u8a08: \u00a5${fmtNum(result.totalDeductions)}`,
      "",
      `\u6a19\u6e96\u5831\u916c\u6708\u984d: \u00a5${fmtNum(result.hyojunHoshu)}\uff08\u7b2c${result.hyojunGrade}\u7b49\u7d1a\uff09`,
      "",
      "\u8a08\u7b97\u30c4\u30fc\u30eb: https://yamada-tools.jp/tools/kyuyo-tedori-keisan",
    ]
      .filter((l) => l !== null)
      .join("\n");

    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result, viewMode]);

  const breakdownRows = [
    {
      icon: "\ud83c\udfe6",
      name: "\u5398\u751f\u5e74\u91d1",
      note: `\u6a19\u6e96\u5831\u916c\u00a5${fmtNum(Math.min(result.hyojunHoshu, 650000))} \u00d7 9.15%`,
      monthly: result.pension,
      color: COLORS.pension,
    },
    {
      icon: "\ud83c\udfe5",
      name: "\u5065\u5eb7\u4fdd\u967a",
      note: `\u6a19\u6e96\u5831\u916c\u00a5${fmtNum(result.hyojunHoshu)} \u00d7 ${healthEmployeeRate}%`,
      monthly: result.healthInsurance,
      color: COLORS.healthInsurance,
    },
    ...(result.nursingInsurance > 0
      ? [
          {
            icon: "\ud83d\udc74",
            name: "\u4ecb\u8b77\u4fdd\u967a",
            note: "\u6a19\u6e96\u5831\u916c \u00d7 0.800%\uff0840\uff5e64\u6b73\uff09",
            monthly: result.nursingInsurance,
            color: COLORS.nursingInsurance,
          },
        ]
      : []),
    {
      icon: "\ud83d\udc76",
      name: "\u5b50\u3069\u3082\u30fb\u5b50\u80b2\u3066\u652f\u63f4\u91d1",
      note: "\u6a19\u6e96\u5831\u916c \u00d7 0.050%\uff082026\u5e744\u6708\uff5e\uff09",
      monthly: result.childcareLevy,
      color: COLORS.childcareLevy,
    },
    {
      icon: "\ud83d\udccb",
      name: "\u96c7\u7528\u4fdd\u967a",
      note: "\u6708\u53ce \u00d7 0.500%",
      monthly: result.employmentInsurance,
      color: COLORS.employmentInsurance,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1e40af] to-[#1d4ed8] text-white py-10 px-4 print:hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">\ud83d\udcb4</span>
            <h1 className="text-2xl md:text-3xl font-bold">
              \u7d66\u4e0e\u624b\u53d6\u308a\u8a08\u7b97\u30c4\u30fc\u30eb 2026
            </h1>
          </div>
          <p className="text-blue-200 text-sm md:text-base">
            \u6708\u53ce\u30fb\u5e74\u53ce\u304b\u3089\u6240\u5f97\u7a0e\u30fb\u4f4f\u6c11\u7a0e\u30fb\u793e\u4f1a\u4fdd\u967a\u6599\u3092\u81ea\u52d5\u8a08\u7b97 | 2026\u5e74\u5ea6\u6700\u65b0\u30ec\u30fc\u30c8\u5bfe\u5fdc
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              "2026\u5e74\u6700\u65b0",
              "47\u90fd\u9053\u5e9c\u770c\u5bfe\u5fdc",
              "\u4ecb\u8b77\u4fdd\u967a\u81ea\u52d5\u5224\u5b9a",
              "\u5b50\u80b2\u3066\u652f\u63f4\u91d1\u5bfe\u5fdc",
              "\u6a19\u6e96\u5831\u916c\u6708\u984d\u8868\u4f7f\u7528",
            ].map((tag) => (
              <span
                key={tag}
                className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          {/* ═══ INPUT PANEL ═══ */}
          <aside className="lg:col-span-2 mb-6 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-4">
              <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
                <span className="w-5 h-5 bg-[#1E3A8A] text-white rounded-full text-xs flex items-center justify-center font-bold">
                  1
                </span>
                \u5165\u529b\u60c5\u5831
              </h2>

              <div className="space-y-5">
                {/* 月収 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    \u6708\u53ce\uff08\u984d\u9762\uff09
                    <span className="ml-2 font-bold text-[#1E3A8A]">
                      \u00a5{fmtNum(inp.monthlyGross)}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={100000}
                    max={2000000}
                    step={10000}
                    value={inp.monthlyGross}
                    onChange={(e) => set("monthlyGross", Number(e.target.value))}
                    className="w-full accent-blue-700 mb-1"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>10\u4e07\u5186</span>
                    <span>200\u4e07\u5186</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      \u00a5
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={inp.monthlyGross}
                      onChange={(e) =>
                        set("monthlyGross", Math.max(0, Number(e.target.value)))
                      }
                      className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                {/* 賞与 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    \u8cde\u4e0e\uff08\u5e74\u984d\u30fb\u4efb\u610f\uff09
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      \u00a5
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      value={inp.annualBonus}
                      onChange={(e) =>
                        set("annualBonus", Math.max(0, Number(e.target.value)))
                      }
                      className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  {inp.monthlyGross > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      \u6708\u53ce\u306e{" "}
                      {(inp.annualBonus / inp.monthlyGross).toFixed(1)}{" "}
                      \u30f6\u6708\u5206
                    </p>
                  )}
                </div>

                {/* 年齢 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    \u5e74\u9f62
                    {inp.age >= 40 && inp.age < 65 && (
                      <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                        \u4ecb\u8b77\u4fdd\u967a\u5bfe\u8c61
                      </span>
                    )}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={15}
                      max={75}
                      value={inp.age}
                      onChange={(e) =>
                        set(
                          "age",
                          Math.max(15, Math.min(75, Number(e.target.value))),
                        )
                      }
                      className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    <span className="text-sm text-gray-600">\u6b73</span>
                  </div>
                </div>

                {/* 扶養家族数 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    \u6276\u990a\u5bb6\u65cf\u6570
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => set("dependents", n)}
                        className={`w-11 h-11 rounded-full text-xs font-semibold transition-all ${
                          inp.dependents === n
                            ? "bg-[#1E3A8A] text-white shadow-md scale-110"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {n === 5 ? "5+" : n}
                        {"\u4eba"}
                      </button>
                    ))}
                  </div>
                  {inp.dependents > 0 && (
                    <p className="text-xs text-gray-400 mt-1.5">
                      \u6276\u990a\u63a7\u9664 \u00a5
                      {fmtNum(inp.dependents * 380000)} / \u5e74
                    </p>
                  )}
                </div>

                {/* 都道府県 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    \u90fd\u9053\u5e9c\u770c\uff08\u5065\u5eb7\u4fdd\u967a\u6599\u7387\uff09
                  </label>
                  <PrefectureSelect
                    value={inp.prefecture}
                    onChange={(v) => set("prefecture", v)}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    \u5065\u5eb7\u4fdd\u967a\u6599\u7387:{" "}
                    {healthEmployeeRate}
                    %\uff08\u5f93\u696d\u54e1\u8ca0\u62c5\uff09
                  </p>
                </div>

                {/* 雇用形態 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    \u96c7\u7528\u5f62\u614b
                  </label>
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                    {(["seishain", "part"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set("employmentType", t)}
                        className={`flex-1 py-2 text-sm font-medium transition-all ${
                          inp.employmentType === t
                            ? "bg-[#1E3A8A] text-white"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {t === "seishain"
                          ? "\u6b63\u793e\u54e1"
                          : "\u30d1\u30fc\u30c8\u30fb\u30a2\u30eb\u30d0\u30a4\u30c8"}
                      </button>
                    ))}
                  </div>
                  {inp.employmentType === "part" && (
                    <p className="text-xs text-amber-700 mt-1.5 bg-amber-50 rounded-lg p-2">
                      ※\u903130\u6642\u9593\u672a\u6e80\u306e\u5834\u5408\u3001\u793e\u4f1a\u4fdd\u967a\u306e\u9069\u7528\u5916\u306b\u306a\u308b\u3053\u3068\u304c\u3042\u308a\u307e\u3059
                    </p>
                  )}
                </div>

                {/* 交通費 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    \u4ea4\u901a\u8cbb\uff08\u6708\u984d\uff09
                    <span className="text-xs text-gray-400 ml-1">
                      \u6240\u5f97\u7a0e\u306f\u5e7415\u4e07\u5186\u307e\u3067\u975e\u8ab2\u7a0e
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      \u00a5
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={inp.commuteMonthly}
                      onChange={(e) =>
                        set(
                          "commuteMonthly",
                          Math.max(0, Number(e.target.value)),
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ═══ RESULTS PANEL ═══ */}
          <main className="lg:col-span-3 space-y-5">
            {/* Mode toggle */}
            <div className="flex justify-end">
              <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                {(["monthly", "annual"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setViewMode(m)}
                    className={`px-5 py-2 text-sm font-medium transition-all ${
                      viewMode === m
                        ? "bg-[#1E3A8A] text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {m === "monthly"
                      ? "\u6708\u53ce\u30e2\u30fc\u30c9"
                      : "\u5e74\u53ce\u30e2\u30fc\u30c9"}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero card */}
            <div className="bg-gradient-to-br from-[#1E3A8A] to-[#1d4ed8] text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-blue-200 text-sm mb-1">
                    {viewMode === "monthly" ? "\u6708\u9593" : "\u5e74\u9593"}
                    \u624b\u53d6\u308a\u984d
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-blue-300 text-xl font-light">\u00a5</span>
                    <span
                      className="font-bold tabular-nums tracking-tight"
                      style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)" }}
                    >
                      {animatedTakeHome.toLocaleString("ja-JP")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className="h-1.5 rounded-full bg-white/30"
                      style={{ width: 80 }}
                    >
                      <div
                        className="h-1.5 rounded-full bg-white transition-all duration-500"
                        style={{ width: `${result.pcts.takeHome}%` }}
                      />
                    </div>
                    <span className="text-blue-200 text-xs">
                      \u984d\u9762\u306e {result.pcts.takeHome.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm shrink-0">
                  <p className="text-blue-300 text-xs">\u984d\u9762</p>
                  <p className="font-semibold text-lg">
                    \u00a5
                    {fmtNum(
                      viewMode === "monthly"
                        ? result.monthlyGross
                        : result.annualTotalGross,
                    )}
                  </p>
                  <p className="text-blue-300 text-xs mt-1">\u63a7\u9664\u5408\u8a08</p>
                  <p className="font-semibold text-red-300 text-lg">
                    \u2212\u00a5
                    {fmtNum(
                      viewMode === "monthly"
                        ? result.totalDeductions
                        : result.annualTotalDeductions,
                    )}
                  </p>
                </div>
              </div>

              {/* Stacked bar */}
              <div>
                <div
                  className="flex rounded-full overflow-hidden h-4 mb-2"
                  role="img"
                  aria-label="\u7d66\u4e0e\u5185\u8a33\u5185\u8a33\u30d0\u30fc"
                >
                  {stackSegs.map((s, i) => (
                    <div
                      key={i}
                      title={`${s.label}: ${s.pct.toFixed(1)}%`}
                      style={{
                        width: `${s.pct}%`,
                        backgroundColor: s.color,
                        transition: "width 200ms ease",
                      }}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {stackSegs
                    .filter((s) => s.pct >= 0.5)
                    .map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 text-xs text-blue-200"
                      >
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: s.color }}
                        />
                        <span>
                          {s.label} {s.pct.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Donut chart + legend */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-800 mb-4">
                \u63a7\u9664\u5185\u8a33\uff08\u6708\u984d\uff09
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-52 h-52 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={56}
                        outerRadius={90}
                        dataKey="value"
                        paddingAngle={2}
                        animationBegin={0}
                        animationDuration={400}
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 w-full space-y-2">
                  {pieData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-800">
                          \u00a5{fmtNum(item.value)}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          (
                          {(
                            (item.value / (result.monthlyGross || 1)) *
                            100
                          ).toFixed(1)}
                          %)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed breakdown table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                type="button"
                onClick={() => setTableOpen((o) => !o)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-sm font-bold text-gray-800">
                  \u8a73\u7d30\u5185\u8a33
                </h3>
                <span className="text-gray-400 text-sm">
                  {tableOpen ? "\u25b2" : "\u25bc"}
                </span>
              </button>

              {tableOpen && (
                <div className="border-t border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                        <th className="text-left px-5 py-3">\u9805\u76ee</th>
                        <th className="text-right px-5 py-3">
                          \u6708\u984d
                        </th>
                        <th className="text-right px-5 py-3">
                          \u5e74\u984d
                        </th>
                        <th className="text-right px-5 py-3 hidden md:table-cell">
                          \u5272\u5408
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Gross row */}
                      <tr className="bg-blue-50">
                        <td className="px-5 py-3 font-bold text-[#1E3A8A]">
                          \ud83d\udcb0 \u984d\u9762\u7d66\u4e0e
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-gray-900">
                          \u00a5{fmtNum(result.monthlyGross)}
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-gray-900">
                          \u00a5{fmtNum(result.annualTotalGross)}
                        </td>
                        <td className="px-5 py-3 text-right text-gray-400 hidden md:table-cell text-xs">
                          100%
                        </td>
                      </tr>

                      {/* Social insurance header */}
                      <tr className="bg-purple-50">
                        <td
                          colSpan={4}
                          className="px-5 py-2 text-xs font-bold text-purple-700 uppercase tracking-wide"
                        >
                          \u793e\u4f1a\u4fdd\u967a\u6599
                        </td>
                      </tr>

                      {breakdownRows.map((row, i) => (
                        <tr
                          key={i}
                          className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{row.icon}</span>
                              <div>
                                <p className="font-medium text-gray-800">
                                  {row.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {row.note}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-right font-medium text-gray-700">
                            \u00a5{fmtNum(row.monthly)}
                          </td>
                          <td className="px-5 py-3 text-right text-gray-500">
                            \u00a5{fmtNum(row.monthly * 12)}
                          </td>
                          <td className="px-5 py-3 text-right text-gray-400 hidden md:table-cell text-xs">
                            {(
                              (row.monthly / (result.monthlyGross || 1)) *
                              100
                            ).toFixed(1)}
                            %
                          </td>
                        </tr>
                      ))}

                      {/* Social insurance subtotal */}
                      <tr className="bg-purple-50 font-semibold border-t border-purple-100">
                        <td className="px-5 py-3 text-purple-800 pl-8">
                          \u793e\u4f1a\u4fdd\u967a\u6599 \u5c0f\u8a08
                        </td>
                        <td className="px-5 py-3 text-right text-purple-800">
                          \u00a5{fmtNum(result.totalSocialInsurance)}
                        </td>
                        <td className="px-5 py-3 text-right text-purple-700">
                          \u00a5{fmtNum(result.annualSocialInsurance)}
                        </td>
                        <td className="px-5 py-3 text-right text-purple-600 hidden md:table-cell text-xs">
                          {(
                            (result.totalSocialInsurance /
                              (result.monthlyGross || 1)) *
                            100
                          ).toFixed(1)}
                          %
                        </td>
                      </tr>

                      {/* Tax header */}
                      <tr className="bg-red-50 border-t border-gray-100">
                        <td
                          colSpan={4}
                          className="px-5 py-2 text-xs font-bold text-red-700 uppercase tracking-wide"
                        >
                          \u7a0e\u91d1
                        </td>
                      </tr>

                      {/* Income tax */}
                      <tr className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">\ud83d\udcca</span>
                            <div>
                              <p className="font-medium text-gray-800">
                                \u6240\u5f97\u7a0e
                              </p>
                              <p className="text-xs text-gray-400">
                                \u5e74\u9593\u7a0e\u984d\u00f712\uff08\u6e90\u6cc9\u5f81\u53ce\u7532\u6b04\uff09
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right font-medium text-red-600">
                          \u00a5{fmtNum(result.incomeTax)}
                        </td>
                        <td className="px-5 py-3 text-right text-gray-500">
                          \u00a5{fmtNum(result.annualIncomeTax)}
                        </td>
                        <td className="px-5 py-3 text-right text-gray-400 hidden md:table-cell text-xs">
                          {result.pcts.incomeTax.toFixed(1)}%
                        </td>
                      </tr>

                      {/* Resident tax */}
                      <tr className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">\ud83c\udfd9\ufe0f</span>
                            <div>
                              <p className="font-medium text-gray-800">
                                \u4f4f\u6c11\u7a0e
                              </p>
                              <p className="text-xs text-amber-600">
                                \u26a0\ufe0f
                                \u6982\u7b97\uff08\u524d\u5e74\u6240\u5f97\u306b\u57fa\u3065\u304d\u7fe0\u5e746\u6708\u304b\u3089\u5f81\u53ce\uff09
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right font-medium text-orange-600">
                          \u00a5{fmtNum(result.residentTax)}
                        </td>
                        <td className="px-5 py-3 text-right text-gray-500">
                          \u00a5{fmtNum(result.annualResidentTax)}
                        </td>
                        <td className="px-5 py-3 text-right text-gray-400 hidden md:table-cell text-xs">
                          {result.pcts.residentTax.toFixed(1)}%
                        </td>
                      </tr>

                      {/* Tax subtotal */}
                      <tr className="bg-red-50 font-semibold border-t border-red-100">
                        <td className="px-5 py-3 text-red-800 pl-8">
                          \u7a0e\u91d1 \u5c0f\u8a08
                        </td>
                        <td className="px-5 py-3 text-right text-red-800">
                          \u00a5{fmtNum(result.totalTax)}
                        </td>
                        <td className="px-5 py-3 text-right text-red-700">
                          \u00a5
                          {fmtNum(
                            result.annualIncomeTax + result.annualResidentTax,
                          )}
                        </td>
                        <td className="px-5 py-3 text-right text-red-600 hidden md:table-cell text-xs">
                          {(
                            (result.totalTax / (result.monthlyGross || 1)) *
                            100
                          ).toFixed(1)}
                          %
                        </td>
                      </tr>

                      {/* Total deductions */}
                      <tr className="bg-gray-800 text-white font-bold border-t-2 border-gray-700">
                        <td className="px-5 py-4">
                          \u63a7\u9664\u5408\u8a08
                        </td>
                        <td className="px-5 py-4 text-right">
                          \u00a5{fmtNum(result.totalDeductions)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          \u00a5{fmtNum(result.annualTotalDeductions)}
                        </td>
                        <td className="px-5 py-4 text-right text-gray-300 hidden md:table-cell text-xs">
                          {(
                            (result.totalDeductions /
                              (result.monthlyGross || 1)) *
                            100
                          ).toFixed(1)}
                          %
                        </td>
                      </tr>

                      {/* Take-home */}
                      <tr className="bg-gradient-to-r from-[#1E3A8A] to-[#1d4ed8] text-white">
                        <td className="px-5 py-5 font-bold text-lg">
                          \ud83d\udcb4 \u624b\u53d6\u308a
                        </td>
                        <td className="px-5 py-5 text-right font-bold text-3xl">
                          \u00a5{fmtNum(result.monthlyTakeHome)}
                        </td>
                        <td className="px-5 py-5 text-right font-bold text-xl">
                          \u00a5{fmtNum(result.annualTakeHome)}
                        </td>
                        <td className="px-5 py-5 text-right text-blue-200 hidden md:table-cell">
                          {result.pcts.takeHome.toFixed(1)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Meta */}
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                      \u6a19\u6e96\u5831\u916c\u6708\u984d: \u00a5
                      {fmtNum(result.hyojunHoshu)}\uff08\u7b2c
                      {result.hyojunGrade}\u7b49\u7d1a\uff09
                    </span>
                    <span>\u90fd\u9053\u5e9c\u770c: {inp.prefecture}</span>
                    <span>\u5e74\u9f62: {inp.age}\u6b73</span>
                    <span>
                      \u6276\u990a: {inp.dependents}\u4eba
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Comparison */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-800 mb-4">
                \ud83d\udcca \u6bd4\u8f03\u30b7\u30df\u30e5\u30ec\u30fc\u30b7\u30e7\u30f3
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* +1 dependent */}
                <div className="border border-green-200 bg-green-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-green-700 mb-3 uppercase tracking-wide">
                    \u6276\u990a+1\u4eba\u306e\u5834\u5408
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-green-600">
                        \u6708\u9593\u624b\u53d6\u308a\u5909\u5316
                      </p>
                      <p className="text-xl font-bold text-green-700">
                        +\u00a5
                        {fmtNum(
                          resultPlus1.monthlyTakeHome - result.monthlyTakeHome,
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-green-600">
                        \u5e74\u984d\u63db\u7b97
                      </p>
                      <p className="text-sm font-semibold text-green-700">
                        +\u00a5
                        {fmtNum(
                          (resultPlus1.monthlyTakeHome -
                            result.monthlyTakeHome) *
                            12,
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    \u6276\u990a\u63a7\u9664\u306b\u3088\u308a\u6240\u5f97\u7a0e\u30fb\u4f4f\u6c11\u7a0e\u304c\u8efd\u6e1b
                  </p>
                </div>

                {/* Age 40 */}
                {resultAge40 ? (
                  <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-amber-700 mb-3 uppercase tracking-wide">
                      40\u6b73\u306b\u306a\u3063\u305f\u3089\uff08\u4ecb\u8b77\u4fdd\u967a\uff09
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-amber-600">
                          \u6708\u9593\u624b\u53d6\u308a\u5909\u5316
                        </p>
                        <p className="text-xl font-bold text-amber-700">
                          \u2212\u00a5
                          {fmtNum(
                            result.monthlyTakeHome - resultAge40.monthlyTakeHome,
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-amber-600">
                          \u4ecb\u8b77\u4fdd\u967a\u6599
                        </p>
                        <p className="text-sm font-semibold text-amber-700">
                          \u00a5{fmtNum(resultAge40.nursingInsurance)}/\u6708
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-amber-600 mt-2">
                      40\u6b73\u304b\u3089\u4ecb\u8b77\u4fdd\u967a\u6599\uff08\u6a19\u6e96\u5831\u916c
                      \u00d7 0.80%\uff09\u304c\u767a\u751f
                    </p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">
                      \u4ecb\u8b77\u4fdd\u967a\uff0840\uff5e64\u6b73\uff09
                    </p>
                    {inp.age >= 40 && inp.age < 65 ? (
                      <>
                        <p className="text-sm text-teal-700 font-semibold">
                          \u2713 \u5bfe\u8c61\u5e74\u9f62\uff08{inp.age}\u6b73\uff09
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          \u4ecb\u8b77\u4fdd\u967a\u6599 \u00a5
                          {fmtNum(result.nursingInsurance)}
                          /\u6708 \u304c\u542b\u307e\u308c\u3066\u3044\u307e\u3059
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        65\u6b73\u4ee5\u4e0a\u306f\u4ecb\u8b77\u4fdd\u967a\u6599\uff08\u7b2c1\u53f7\u88ab\u4fdd\u967a\u8005\uff09\u306b\u79fb\u884c
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 print:hidden">
              <button
                type="button"
                onClick={handleCopy}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm ${
                  copied
                    ? "bg-green-600 text-white"
                    : "bg-[#1E3A8A] hover:bg-blue-800 text-white"
                }`}
              >
                {copied
                  ? "\u2713 \u30b3\u30d4\u30fc\u6e08\u307f"
                  : "\ud83d\udccb \u7d50\u679c\u3092\u30b3\u30d4\u30fc"}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-all shadow-sm"
              >
                \ud83d\udda8\ufe0f \u5370\u523a / PDF\u4fdd\u5b58
              </button>
            </div>
          </main>
        </div>

        <AdUnit slot="5612038947" format="rectangle" className="my-8" />

        {/* FAQ */}
        <section className="mt-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 print:hidden">
          <h2 className="text-lg font-bold text-gray-800 mb-6">
            \u3088\u304f\u3042\u308b\u8cea\u554f
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "\u624b\u53d6\u308a\u8a08\u7b97\u306f\u3069\u306e\u3088\u3046\u306a\u65b9\u6cd5\u3067\u8a08\u7b97\u3057\u3066\u3044\u307e\u3059\u304b\uff1f",
                a: "2026\u5e74\u5ea6\u306e\u5354\u4f1a\u3051\u3093\u307d\u6599\u7387\u30fb\u5398\u751f\u5e74\u91d1\u6599\u7387\u30fb\u96c7\u7528\u4fdd\u967a\u6599\u7387\u3092\u4f7f\u7528\u3057\u3001\u6a19\u6e96\u5831\u916c\u6708\u984d\u30c6\u30fc\u30d6\u30eb\uff0850\u7b49\u7d1a\uff09\u306b\u57fa\u3065\u3044\u3066\u793e\u4f1a\u4fdd\u967a\u6599\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002\u6240\u5f97\u7a0e\u306f\u7d66\u4e0e\u6240\u5f97\u63a7\u9664\u30fb\u57fa\u790e\u63a7\u9664\u30fb\u793e\u4f1a\u4fdd\u967a\u6599\u63a7\u9664\u30fb\u6276\u990a\u63a7\u9664\u3092\u9069\u7528\u5f8c\u306e\u8ab2\u7a0e\u6240\u5f97\u306b\u5bfe\u3057\u3001\u56fd\u7a0e\u5e81\u306e\u7d2f\u9032\u7a0e\u7387\uff085\uff5e45%\uff09+\u5fa9\u8208\u7279\u5225\u6240\u5f97\u7a0e2.1%\u3092\u9069\u7528\u3057\u3066\u3044\u307e\u3059\u3002",
              },
              {
                q: "\u7d66\u4e0e\u304b\u3089\u5f15\u304b\u308c\u308b\u793e\u4f1a\u4fdd\u967a\u6599\u306e\u8a08\u7b97\u65b9\u6cd5\u306f\uff1f",
                a: "\u793e\u4f1a\u4fdd\u967a\u6599\u306f\u300c\u6a19\u6e96\u5831\u916c\u6708\u984d\u300d\u3092\u57fa\u306b\u8a08\u7b97\u3057\u307e\u3059\u3002\u6708\u53ce\u3092\u305d\u306e\u307e\u307e\u4f7f\u3046\u306e\u3067\u306f\u306a\u304f\u3001\u6708\u53ce\u3092\u56fd\u304c\u5b9a\u3081\u305f\u7b49\u7d1a\u8868\uff0850\u7b49\u7d1a\uff09\u306b\u5f53\u3066\u306f\u3081\u305f\u91d1\u984d\u306b\u6599\u7387\u3092\u639b\u3051\u307e\u3059\u3002\u5398\u751f\u5e74\u91d1\u306e\u4e0a\u9650\u306f\u6708\u984d65\u4e07\u5186\uff08\u7b2c35\u7b49\u7d1a\uff09\u3067\u3001\u5065\u5eb7\u4fdd\u967a\u306f\u6700\u9ad8139\u4e07\u5186\uff08\u7b2c50\u7b49\u7d1a\uff09\u307e\u3067\u3042\u308a\u307e\u3059\u3002",
              },
              {
                q: "\u4f4f\u6c11\u7a0e\u304c\u300c\u6982\u7b97\u300d\u3068\u8868\u793a\u3055\u308c\u3066\u3044\u308b\u306e\u306f\u306a\u305c\u3067\u3059\u304b\uff1f",
                a: "\u4f4f\u6c11\u7a0e\u306f\u300c\u524d\u5e74\u306e\u6240\u5f97\u300d\u306b\u57fa\u3065\u3044\u3066\u7fe0\u5e746\u6708\u304b\u3089\u5f81\u53ce\u304c\u59cb\u307e\u308a\u307e\u3059\u3002\u305d\u306e\u305f\u3081\u65b0\u5165\u793e\u54e1\u3084\u8ee2\u8077\u76f4\u5f8c\u306a\u3069\u3001\u524d\u5e74\u6240\u5f97\u304c\u4eca\u5e74\u3068\u7570\u306a\u308b\u5834\u5408\u3001\u5b9f\u969b\u306e\u4f4f\u6c11\u7a0e\u984d\u3068\u7570\u306a\u308b\u53ef\u80fd\u6027\u304c\u3042\u308a\u307e\u3059\u3002\u672c\u30c4\u30fc\u30eb\u3067\u306f\u300c\u73fe\u5728\u306e\u7d66\u4e0e\u304c1\u5e74\u9593\u7d9a\u3044\u305f\u5834\u5408\u306e\u4f4f\u6c11\u7a0e\u300d\u3068\u3057\u3066\u6982\u7b97\u8868\u793a\u3057\u3066\u3044\u307e\u3059\u3002",
              },
              {
                q: "\u90fd\u9053\u5e9c\u770c\u306b\u3088\u3063\u3066\u624b\u53d6\u308a\u304c\u5909\u308f\u308b\u306e\u306f\u306a\u305c\u3067\u3059\u304b\uff1f",
                a: "\u5065\u5eb7\u4fdd\u967a\u6599\u7387\u306f\u90fd\u9053\u5e9c\u770c\u3054\u3068\u306b\u7570\u306a\u308a\u307e\u3059\uff08\u5354\u4f1a\u3051\u3093\u307d\uff09\u3002\u6700\u3082\u9ad8\u3044\u4f50\u8cc0\u770c\uff0810.42%/2026\u5e74\u5ea6\uff09\u3068\u6700\u3082\u4f4e\u3044\u65b0\u6f5f\u770c\uff089.35%\uff09\u3067\u306f\u6bce\u6708\u306e\u8ca0\u62c5\u984d\u306b\u5dee\u304c\u751f\u3058\u307e\u3059\u3002\u540c\u3058\u6708\u53ce30\u4e07\u5186\u3067\u3082\u3001\u90fd\u9053\u5e9c\u770c\u304c\u9055\u3048\u3070\u5e74\u9593\u3067\u6570\u4e07\u5186\u306e\u5dee\u306b\u306a\u308b\u3053\u3068\u304c\u3042\u308a\u307e\u3059\u3002",
              },
              {
                q: "\u5b50\u3069\u3082\u30fb\u5b50\u80b2\u3066\u652f\u63f4\u91d1\u3068\u306f\u4f55\u3067\u3059\u304b\uff1f",
                a: "2026\u5e744\u6708\u304b\u3089\u65b0\u8a2d\u3055\u308c\u305f\u5236\u5ea6\u3067\u3001\u5168\u56fd\u306e\u533b\u7642\u4fdd\u967a\u52a0\u5165\u8005\u304b\u3089\u5f81\u53ce\u3055\u308c\u307e\u3059\u3002\u5f93\u696d\u54e1\u8ca0\u62c5\u306f\u6a19\u6e96\u5831\u916c\u6708\u984d\u306e0.05%\uff08\u4e8b\u696d\u4e3b\u3068\u6298\u534a\uff09\u3067\u3059\u3002\u6708\u537330\u4e07\u5186\uff08\u6a19\u6e96\u5831\u916c30\u4e07\u5186\uff09\u306e\u5834\u5408\u3001\u6708150\u5186\u7a0b\u5ea6\u306e\u8ca0\u62c5\u3068\u306a\u308a\u307e\u3059\u3002\u5c11\u5b50\u5316\u5bfe\u7b56\u306e\u8ca1\u6e90\u3068\u3057\u3066\u6d3b\u7528\u3055\u308c\u307e\u3059\u3002",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="border border-gray-100 rounded-xl overflow-hidden group"
              >
                <summary className="p-4 cursor-pointer font-medium text-gray-800 hover:bg-gray-50 flex items-start justify-between list-none">
                  <span className="flex items-start gap-2 flex-1">
                    <span className="text-[#1E3A8A] font-bold shrink-0">
                      Q.
                    </span>
                    <span className="text-sm">{item.q}</span>
                  </span>
                  <span className="text-gray-400 ml-4 shrink-0 group-open:rotate-180 transition-transform duration-200">
                    \u25bc
                  </span>
                </summary>
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 text-sm text-gray-600 leading-relaxed">
                  <span className="text-[#1E3A8A] font-bold">A.</span>{" "}
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 print:hidden">
          <p className="font-semibold mb-1">
            \u26a0\ufe0f \u514d\u8ca3\u4e8b\u9805
          </p>
          <p>
            \u672c\u30c4\u30fc\u30eb\u306f2026\u5e74\u5ea6\u306e\u5354\u4f1a\u3051\u3093\u307d\u6599\u7387\u30fb\u5398\u751f\u5e74\u91d1\u6599\u7387\u30fb\u6240\u5f97\u7a0e\u7387\u306b\u57fa\u3065\u304f\u53c2\u8003\u8a08\u7b97\u3067\u3059\u3002
            \u5b9f\u969b\u306e\u624b\u53d6\u308a\u984d\u306f\u3001\u4f1a\u793e\u306e\u7d66\u4e0e\u898f\u7a0b\u30fb\u8cde\u4e0e\u306e\u30bf\u30a4\u30df\u30f3\u30b0\u30fb\u5e74\u672b\u8abf\u6574\u30fb\u4f4f\u6c11\u7a0e\u306e\u7279\u5225\u5f81\u53ce\u958b\u59cb\u6642\u671f\u306a\u3069\u306b\u3088\u308a\u7570\u306a\u308a\u307e\u3059\u3002
            \u78ba\u5b9a\u3057\u305f\u91d1\u984d\u306b\u3064\u3044\u3066\u306f\u3001\u7d66\u4e0e\u660e\u7d30\u307e\u305f\u306f\u4f1a\u793e\u306e\u62c5\u5f53\u90e8\u7f72\u306b\u3054\u78ba\u8a8d\u304f\u3060\u3055\u3044\u3002
            \u4f4f\u6c11\u7a0e\u306f\u524d\u5e74\u6240\u5f97\u306b\u57fa\u3065\u304d\u7fe0\u5e746\u6708\u304b\u3089\u5f81\u53ce\u3055\u308c\u308b\u305f\u3081\u3001\u6982\u7b97\u3068\u306a\u308a\u307e\u3059\u3002
          </p>
        </div>

        <AdUnit slot="5612038947" format="horizontal" className="mt-8 print:hidden" />
      </div>
    </div>
  );
}
