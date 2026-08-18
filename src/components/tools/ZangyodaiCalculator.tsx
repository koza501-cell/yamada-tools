"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  calcZangyodai,
  type ZangyodaiInput,
  type ZangyodaiResult,
  type Allowance,
  type DailyRow,
  type WageType,
  type OvertimeMode,
  type DayType,
} from "@/lib/zangyodai-calculator";
import { AdUnit } from "@/components/common/AdUnit";

// ============================================================
// Helpers
// ============================================================

function fmtNum(n: number): string {
  return Math.round(n).toLocaleString("ja-JP");
}

function fmtH(h: number): string {
  const r = Math.round(h * 10) / 10;
  return r % 1 === 0 ? `${r}` : r.toFixed(1);
}

let _uid = 0;
function newId(): string {
  return `uid-${++_uid}`;
}

// ============================================================
// Count-up animation hook
// ============================================================

function useCountUp(target: number, duration = 600): number {
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
      const t = Math.min((now - startTime) / duration, 1);
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
// Sub-components
// ============================================================

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">{children}</h2>;
}

function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  unit,
  placeholder,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value || ""}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-300 pr-10"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit}</span>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Default input
// ============================================================

const DEFAULT_INPUT: ZangyodaiInput = {
  wageType: "monthly",
  baseWage: 300000,
  allowances: [],
  hoursPerDay: 8,
  annualWorkDays: 240,
  overtimeMode: "simple",
  simpleOvertimeHours: 20,
  dOvertimeUnder60: 0,
  dOvertimeOver60: 0,
  dHolidayStatutory: 0,
  dHolidayNonStatutory: 0,
  dNighttime: 0,
  dailyRows: [],
  unpaidMonths: 1,
};

const DEFAULT_DAILY_ROW = (): DailyRow => ({
  id: newId(),
  date: new Date().toISOString().slice(0, 10),
  startTime: "09:00",
  endTime: "20:00",
  breakMinutes: 60,
  dayType: "normal",
});

// ============================================================
// Main component
// ============================================================

export default function ZangyodaiCalculator() {
  const [input, setInput] = useState<ZangyodaiInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<ZangyodaiResult>(() => calcZangyodai(DEFAULT_INPUT));

  useEffect(() => {
    setResult(calcZangyodai(input));
  }, [input]);

  const set = useCallback(<K extends keyof ZangyodaiInput>(key: K, val: ZangyodaiInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: val }));
  }, []);

  const animatedTotal = useCountUp(result.totalOvertimePay);
  const animatedHourly = useCountUp(Math.round(result.baseHourlyRate));

  const monthlyScheduledHours = (input.annualWorkDays * input.hoursPerDay) / 12;

  // Allowance helpers
  const addAllowance = () => {
    const a: Allowance = { id: newId(), name: "\u624b\u5f53", amount: 0, included: false };
    set("allowances", [...input.allowances, a]);
  };
  const removeAllowance = (id: string) =>
    set("allowances", input.allowances.filter((a) => a.id !== id));
  const updateAllowance = (id: string, field: keyof Allowance, val: string | number | boolean) =>
    set(
      "allowances",
      input.allowances.map((a) => (a.id === id ? { ...a, [field]: val } : a))
    );

  // Daily row helpers
  const addDailyRow = () =>
    set("dailyRows", [...input.dailyRows, DEFAULT_DAILY_ROW()]);
  const removeDailyRow = (id: string) =>
    set("dailyRows", input.dailyRows.filter((r) => r.id !== id));
  const updateDailyRow = (id: string, field: keyof DailyRow, val: string | number) =>
    set(
      "dailyRows",
      input.dailyRows.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );

  const wageLabel =
    input.wageType === "monthly"
      ? "\u6708\u7d66\uff08\u57fa\u672c\u7d66\uff09"
      : input.wageType === "daily"
      ? "\u65e5\u7d66"
      : "\u6642\u7d66";

  const wageUnit =
    input.wageType === "monthly" ? "\u5186/\u6708" : input.wageType === "daily" ? "\u5186/\u65e5" : "\u5186/\u6642";

  const hoursUntil60 = result.hoursUntil60;
  const isOver60 = hoursUntil60 < 0;
  const isOver45 = result.totalOvertimeHours > 45;
  const pct60 = Math.min(100, (result.totalOvertimeHours / 60) * 100);

  const WAGE_TABS: { key: WageType; label: string }[] = [
    { key: "monthly", label: "\u6708\u7d66\u5236" },
    { key: "daily", label: "\u65e5\u7d66\u5236" },
    { key: "hourly", label: "\u6642\u7d66\u5236" },
  ];
  const OT_TABS: { key: OvertimeMode; label: string }[] = [
    { key: "simple", label: "\u30b7\u30f3\u30d7\u30eb" },
    { key: "detailed", label: "\u8a73\u7d30" },
    { key: "daily", label: "\u65e5\u5225\u5165\u529b" },
  ];
  const DAY_TYPE_OPTIONS: { value: DayType; label: string }[] = [
    { value: "normal", label: "\u901a\u5e38\u52e4\u52d9\u65e5" },
    { value: "nonStatutoryHoliday", label: "\u6cd5\u5b9a\u5916\u4f11\u65e5" },
    { value: "statutoryHoliday", label: "\u6cd5\u5b9a\u4f11\u65e5" },
  ];

  const tabBase = "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-150";
  const tabActive = "bg-orange-500 text-white shadow";
  const tabInactive = "text-gray-500 hover:text-orange-500";

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/60 to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <span>\u52b4\u57fa\u6cd5\u7b2c37\u6761\u5bfe\u5fdc</span>
            <span>\u00b7</span>
            <span>2026\u5e74\u5ea6\u6700\u65b0</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            \u6b8b\u696d\u4ee3\u8a08\u7b97\u30c4\u30fc\u30eb
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            \u6642\u9593\u5916\u30fb\u6df1\u591c\u30fb\u4f11\u65e5\u52b4\u50cd\u306e\u5272\u5897\u8cc3\u91d1\u3092\u6b63\u78ba\u306b\u81ea\u52d5\u8a08\u7b97\u3002\u672a\u6255\u3044\u6b8b\u696d\u4ee3\u306e\u7dcf\u984d\u3082\u30b7\u30df\u30e5\u30ec\u30fc\u30b7\u30e7\u30f3\u3002
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ============================================================ */}
          {/* Input panel */}
          {/* ============================================================ */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Section 1: 賃金設定 */}
            <Card>
              <SectionTitle>\u8ccc\u91d1\u8a2d\u5b9a</SectionTitle>

              {/* 賃金形態 tabs */}
              <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-4">
                {WAGE_TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => set("wageType", t.key)}
                    className={`${tabBase} ${input.wageType === t.key ? tabActive : tabInactive}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <NumberInput
                    label={wageLabel}
                    value={input.baseWage}
                    onChange={(v) => set("baseWage", v)}
                    min={0}
                    unit={wageUnit}
                    placeholder={input.wageType === "monthly" ? "300000" : input.wageType === "daily" ? "12000" : "1500"}
                  />
                </div>
              </div>

              {/* 除外賃金メモ */}
              <p className="mt-3 text-xs text-gray-400">
                \u2139\ufe0f \u5bb6\u65cf\u624b\u5f53\u30fb\u4f4f\u5b85\u624b\u5f53\u30fb\u901a\u52e4\u624b\u5f53\u306a\u3069\u306f\u6cd5\u5b9a\u9664\u5916\u8cc3\u91d1\uff08\u6b8b\u696d\u57fa\u790e\u306b\u542b\u307e\u306a\u3044\uff09\u3002\u4e0b\u8a18\u3067\u5404\u624b\u5f53\u306e\u542b\u3081\u308b\u304b\u3069\u3046\u304b\u3092\u8a2d\u5b9a\u3067\u304d\u307e\u3059\u3002
              </p>
            </Card>

            {/* Section 2: 諸手当 */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <SectionTitle>\u8af8\u624b\u5f53\uff08\u6708\u984d\uff09</SectionTitle>
                <button
                  onClick={addAllowance}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-800 flex items-center gap-1"
                >
                  <span className="text-base leading-none">+</span> \u624b\u5f53\u3092\u8ffd\u52a0
                </button>
              </div>

              {input.allowances.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-2">
                  \u624b\u5f53\u304c\u3042\u308b\u5834\u5408\u306f\u8ffd\u52a0\u3057\u3066\u304f\u3060\u3055\u3044
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-400 px-1">
                    <span className="col-span-4">\u624b\u5f53\u540d</span>
                    <span className="col-span-4">\u6708\u984d</span>
                    <span className="col-span-3 text-center">\u6b8b\u696d\u57fa\u790e\u306b\u542b\u3080</span>
                    <span className="col-span-1"></span>
                  </div>
                  {input.allowances.map((a) => (
                    <div key={a.id} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        className="col-span-4 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs focus:border-orange-400 focus:outline-none"
                        value={a.name}
                        onChange={(e) => updateAllowance(a.id, "name", e.target.value)}
                        placeholder="\u624b\u5f53\u540d"
                      />
                      <div className="col-span-4 relative">
                        <input
                          type="number"
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs font-mono focus:border-orange-400 focus:outline-none pr-6"
                          value={a.amount || ""}
                          min={0}
                          onChange={(e) => updateAllowance(a.id, "amount", parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">\u5186</span>
                      </div>
                      <div className="col-span-3 flex justify-center">
                        <button
                          onClick={() => updateAllowance(a.id, "included", !a.included)}
                          className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                            a.included ? "bg-orange-500" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`block w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 mx-0.5 ${
                              a.included ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                      <button
                        onClick={() => removeAllowance(a.id)}
                        className="col-span-1 text-gray-300 hover:text-red-400 text-lg leading-none text-center"
                      >
                        \u00d7
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Section 3: 所定労働時間設定 */}
            <Card>
              <SectionTitle>\u6240\u5b9a\u52b4\u50cd\u6642\u9593\u8a2d\u5b9a</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    1\u65e5\u306e\u6240\u5b9a\u52b4\u50cd\u6642\u9593
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={12}
                      step={0.5}
                      value={input.hoursPerDay}
                      onChange={(e) => set("hoursPerDay", parseFloat(e.target.value))}
                      className="flex-1 accent-orange-500"
                    />
                    <span className="text-sm font-bold text-gray-800 w-12 text-right">
                      {fmtH(input.hoursPerDay)}\u6642\u9593
                    </span>
                  </div>
                </div>
                <NumberInput
                  label="\u5e74\u9593\u6240\u5b9a\u52b4\u50cd\u65e5\u6570"
                  value={input.annualWorkDays}
                  onChange={(v) => set("annualWorkDays", Math.max(100, Math.min(365, v)))}
                  min={100}
                  max={365}
                  unit="\u65e5/\u5e74"
                  placeholder="240"
                />
              </div>
              <div className="mt-3 flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-2">
                <span className="text-xs text-orange-700">
                  \u6708\u306e\u6240\u5b9a\u52b4\u50cd\u6642\u9593\uff1a
                  <strong className="font-bold">
                    {fmtH(monthlyScheduledHours)}\u6642\u9593
                  </strong>
                  <span className="ml-2 font-normal text-orange-500">
                    ({input.annualWorkDays}\u65e5 \u00d7 {fmtH(input.hoursPerDay)}h \u00f7 12)
                  </span>
                </span>
              </div>
            </Card>

            {/* Section 4: 残業時間入力 */}
            <Card>
              <SectionTitle>\u6b8b\u696d\u6642\u9593\u5165\u529b</SectionTitle>

              {/* Mode tabs */}
              <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-4">
                {OT_TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => set("overtimeMode", t.key)}
                    className={`${tabBase} ${input.overtimeMode === t.key ? tabActive : tabInactive}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Simple mode */}
              {input.overtimeMode === "simple" && (
                <div className="space-y-3">
                  <NumberInput
                    label="\u4eca\u6708\u306e\u6642\u9593\u5916\u52b4\u50cd\u6642\u9593\u5408\u8a08"
                    value={input.simpleOvertimeHours}
                    onChange={(v) => set("simpleOvertimeHours", v)}
                    min={0}
                    max={200}
                    step={0.5}
                    unit="\u6642\u9593"
                    placeholder="20"
                  />
                  <p className="text-xs text-gray-400">
                    \u2022 60h\u4ee5\u5185\uff1a125%\u3000\u2022 60h\u8d85\uff1a150%\uff08\u5ca9\u30a82023\u5e744\u6708\u304b\u3089\u4e2d\u5c0f\u4f01\u696d\u3082\u9069\u7528\uff09
                  </p>
                </div>
              )}

              {/* Detailed mode */}
              {input.overtimeMode === "detailed" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-blue-700">\u6642\u9593\u5916\uff0860h\u4ee5\u5185\uff09</span>
                        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">125%</span>
                      </div>
                      <div className="relative">
                        <input type="number" min={0} step={0.5} value={input.dOvertimeUnder60 || ""}
                          onChange={(e) => set("dOvertimeUnder60", parseFloat(e.target.value) || 0)}
                          className="w-full rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-sm font-mono focus:border-blue-400 focus:outline-none pr-10"
                          placeholder="0" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">h</span>
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-orange-700">\u6642\u9593\u5916\uff0860h\u8d85\uff09</span>
                        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">150%</span>
                      </div>
                      <div className="relative">
                        <input type="number" min={0} step={0.5} value={input.dOvertimeOver60 || ""}
                          onChange={(e) => set("dOvertimeOver60", parseFloat(e.target.value) || 0)}
                          className="w-full rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-sm font-mono focus:border-orange-400 focus:outline-none pr-10"
                          placeholder="0" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">h</span>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-red-700">\u6cd5\u5b9a\u4f11\u65e5\u52b4\u50cd</span>
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">135%</span>
                      </div>
                      <div className="relative">
                        <input type="number" min={0} step={0.5} value={input.dHolidayStatutory || ""}
                          onChange={(e) => set("dHolidayStatutory", parseFloat(e.target.value) || 0)}
                          className="w-full rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-mono focus:border-red-400 focus:outline-none pr-10"
                          placeholder="0" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">h</span>
                      </div>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-yellow-700">\u6cd5\u5b9a\u5916\u4f11\u65e5\u52b4\u50cd</span>
                        <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">125%</span>
                      </div>
                      <div className="relative">
                        <input type="number" min={0} step={0.5} value={input.dHolidayNonStatutory || ""}
                          onChange={(e) => set("dHolidayNonStatutory", parseFloat(e.target.value) || 0)}
                          className="w-full rounded-lg border border-yellow-200 bg-white px-3 py-1.5 text-sm font-mono focus:border-yellow-400 focus:outline-none pr-10"
                          placeholder="0" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">h</span>
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-3 sm:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-purple-700">\u6df1\u591c\u5272\u5897\uff0822\u6642\u221e5\u6642\u30fb\u901a\u5e38\u52e4\u52d9\u5185\uff09</span>
                        <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">+25%</span>
                      </div>
                      <div className="relative">
                        <input type="number" min={0} step={0.5} value={input.dNighttime || ""}
                          onChange={(e) => set("dNighttime", parseFloat(e.target.value) || 0)}
                          className="w-full rounded-lg border border-purple-200 bg-white px-3 py-1.5 text-sm font-mono focus:border-purple-400 focus:outline-none pr-10"
                          placeholder="0" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">h</span>
                      </div>
                      <p className="text-xs text-purple-400 mt-1">
                        \u6642\u9593\u5916\u52b4\u50cd\u3068\u91cd\u8907\u3057\u306a\u3044\u6df1\u591c\u5206\uff08\u4e0a\u8a18\u306e\u6642\u9593\u5916\u306b\u542b\u3081\u305f\u5206\u306f\u9664\u304f\uff09
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Daily mode */}
              {input.overtimeMode === "daily" && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500">
                    \u65e5\u3054\u3068\u306e\u52e4\u52d9\u6642\u9593\u3092\u5165\u529b\u3059\u308b\u3068\u3001\u6642\u9593\u5916\u30fb\u6df1\u591c\u30fb\u4f11\u65e5\u5272\u5897\u3092\u81ea\u52d5\u5206\u985e\u3057\u307e\u3059\u3002
                  </p>

                  {input.dailyRows.length > 0 && (
                    <div className="space-y-2 overflow-x-auto">
                      <div className="grid grid-cols-12 gap-1 text-xs text-gray-400 font-semibold min-w-[600px] px-1">
                        <span className="col-span-2">\u65e5\u4ed8</span>
                        <span className="col-span-2">\u958b\u59cb</span>
                        <span className="col-span-2">\u7d42\u4e86</span>
                        <span className="col-span-2">\u4f11\u618e(min)</span>
                        <span className="col-span-3">\u52e4\u52d9\u533a\u5206</span>
                        <span className="col-span-1"></span>
                      </div>
                      {input.dailyRows.map((row) => (
                        <div key={row.id} className="grid grid-cols-12 gap-1 items-center min-w-[600px]">
                          <input type="date" value={row.date}
                            onChange={(e) => updateDailyRow(row.id, "date", e.target.value)}
                            className="col-span-2 rounded-lg border border-gray-200 bg-gray-50 px-1.5 py-1.5 text-xs focus:border-orange-400 focus:outline-none" />
                          <input type="time" value={row.startTime}
                            onChange={(e) => updateDailyRow(row.id, "startTime", e.target.value)}
                            className="col-span-2 rounded-lg border border-gray-200 bg-gray-50 px-1.5 py-1.5 text-xs focus:border-orange-400 focus:outline-none" />
                          <input type="time" value={row.endTime}
                            onChange={(e) => updateDailyRow(row.id, "endTime", e.target.value)}
                            className="col-span-2 rounded-lg border border-gray-200 bg-gray-50 px-1.5 py-1.5 text-xs focus:border-orange-400 focus:outline-none" />
                          <input type="number" min={0} max={240} value={row.breakMinutes}
                            onChange={(e) => updateDailyRow(row.id, "breakMinutes", parseInt(e.target.value) || 0)}
                            className="col-span-2 rounded-lg border border-gray-200 bg-gray-50 px-1.5 py-1.5 text-xs font-mono focus:border-orange-400 focus:outline-none" />
                          <select value={row.dayType}
                            onChange={(e) => updateDailyRow(row.id, "dayType", e.target.value)}
                            className="col-span-3 rounded-lg border border-gray-200 bg-gray-50 px-1.5 py-1.5 text-xs focus:border-orange-400 focus:outline-none">
                            {DAY_TYPE_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                          <button onClick={() => removeDailyRow(row.id)}
                            className="col-span-1 text-gray-300 hover:text-red-400 text-base text-center">\u00d7</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={addDailyRow}
                    className="w-full py-2 border-2 border-dashed border-orange-200 rounded-xl text-sm text-orange-500 hover:border-orange-400 hover:bg-orange-50 transition-colors"
                  >
                    + \u65e5\u3092\u8ffd\u52a0
                  </button>
                </div>
              )}
            </Card>

            {/* Section 5: 未払い期間 */}
            <Card>
              <SectionTitle>\u672a\u6255\u3044\u6b8b\u696d\u4ee3\u306e\u7dcf\u984d\u8a08\u7b97</SectionTitle>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-600">
                      \u672a\u6255\u3044\u671f\u9593
                    </label>
                    <span className="text-sm font-bold text-red-600">
                      {input.unpaidMonths}\u304b\u6708\u5206
                      {input.unpaidMonths >= 36 && <span className="text-xs ml-1">(\u6642\u52b9\u6e80\u4e86)</span>}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={36}
                    value={input.unpaidMonths}
                    onChange={(e) => set("unpaidMonths", parseInt(e.target.value))}
                    className="w-full accent-red-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1\u304b\u6708</span>
                    <span>36\u304b\u6708\uff083\u5e74\uff09</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  \u2022 \u6b8b\u696d\u4ee3\u306e\u6d88\u6ec5\u6642\u52b9\u306f\uff12\u5e74\uff082020\u5e744\u6708\u4ee5\u964d\u767a\u751f\u5206\u306f3\u5e74\uff09\u3002\u306a\u308b\u3079\u304f\u65e9\u304f\u8acb\u6c42\u3059\u308b\u3053\u3068\u3092\u304a\u52e7\u3081\u3057\u307e\u3059\u3002
                </p>
              </div>
            </Card>

            <AdUnit slot="5612038947" format="rectangle" className="my-4" />

            {/* FAQ */}
            <div className="space-y-3 mt-6">
              <h2 className="text-base font-bold text-gray-800">\u6b8b\u696d\u4ee3\u306b\u3064\u3044\u3066\u3088\u304f\u3042\u308b\u8cea\u554f</h2>
              {[
                {
                  q: "\u6b8b\u696d\u4ee3\u306e\u8a08\u7b97\u65b9\u6cd5\u306f\uff1f",
                  a: "\u6b8b\u696d\u4ee3 = \u57fa\u790e\u6642\u7d66 \u00d7 \u5272\u5897\u8cc3\u91d1\u7387 \u00d7 \u6642\u9593\u6570\u3002\u57fa\u790e\u6642\u7d66\u306f\u300c(\u6708\u7d66 + \u542b\u3081\u308b\u624b\u5f53) \u00f7 \u6708\u306e\u6240\u5b9a\u52b4\u50cd\u6642\u9593\u300d\u3067\u8a08\u7b97\u3057\u307e\u3059\u3002\u5bb6\u65cf\u624b\u5f53\u30fb\u4f4f\u5b85\u624b\u5f53\u30fb\u901a\u52e4\u624b\u5f53\u306a\u3069\u306f\u9664\u5916\u8cc3\u91d1\u306b\u5f53\u305f\u308a\u3001\u57fa\u790e\u8a08\u7b97\u306b\u542b\u3081\u307e\u305b\u3093\u3002",
                },
                {
                  q: "\u5272\u5897\u8cc3\u91d1\u7387\u306f\u3069\u306e\u304f\u3089\u3044\uff1f",
                  a: "\u52b4\u5eade\u6cd5\u7b2c37\u6761\u306b\u3088\u308a\u3001\u6642\u9593\u5916\u52b4\u50cd\uff0860h\u4ee5\u5185\uff09\u306f25%\u5272\u5897\uff081.25\u500d\uff09\u3001\u6cd5\u5b9a\u4f11\u65e5\u52b4\u50cd\u306f35%\u5272\u5897\uff081.35\u500d\uff09\u3001\u6df1\u591c\u52b4\u50cd\uff0822\u6642\uff5e5\u6642\uff09\u306f25%\u5272\u5897\uff081.25\u500d\uff09\u3068\u306a\u308a\u307e\u3059\u3002\u8907\u6570\u8a72\u5f53\u3059\u308b\u5834\u5408\u306f\u52a0\u7b97\u3055\u308c\u307e\u3059\u3002",
                },
                {
                  q: "\u670860\u6642\u8d85\u306e\u6b8b\u696d\u4ee3\u306f\uff1f",
                  a: "2023\u5e744\u6708\u304b\u3089\u4e2d\u5c0f\u4f01\u696d\u3082\u542b\u3081\u3066\u3001\u670860\u6642\u3092\u8d85\u3048\u308b\u6642\u9593\u5916\u52b4\u50cd\u306f50%\u5272\u5897\uff081.5\u500d\uff09\u306b\u306a\u308a\u307e\u3059\u3002\u3053\u308c\u306f\u6cd5\u5b9a\u4f11\u65e5\u52b4\u50cd\u3092\u9664\u304f\u6642\u9593\u5916\u52b4\u50cd\u306e\u7d2f\u8a08\u6642\u9593\u3067\u5224\u5b9a\u3057\u307e\u3059\u3002",
                },
                {
                  q: "\u672a\u6255\u3044\u6b8b\u696d\u4ee3\u306e\u6642\u52b9\u306f\uff1f",
                  a: "2020\u5e744\u6708\u4ee5\u964d\u306b\u767a\u751f\u3057\u305f\u672a\u6255\u3044\u6b8b\u696d\u4ee3\u306f3\u5e74\u9593\u8acb\u6c42\u3067\u304d\u307e\u3059\u3002\u305d\u308c\u4ee5\u524d\u306e\u5206\u306f2\u5e74\u9593\u3067\u3059\u3002\u6642\u52b9\u6e80\u4e86\u3067\u8acb\u6c42\u6a29\u304c\u6d88\u6ec5\u3059\u308b\u524d\u306b\u5c65\u6b74\u306e\u4fdd\u5168\u3084\u5f01\u8b77\u58eb\u3078\u306e\u76f8\u8ac7\u3092\u304a\u52e7\u3081\u3057\u307e\u3059\u3002",
                },
                {
                  q: "\u6df1\u591c\u6b8b\u696d\u306e\u8a08\u7b97\u65b9\u6cd5\u306f\uff1f",
                  a: "22\u6642\uff5e\u7fc1\u65e55\u6642\u306e\u52b4\u50cd\u306f\u6df1\u591c\u5272\u5897\uff08+25%\uff09\u306e\u5bfe\u8c61\u3068\u306a\u308a\u307e\u3059\u3002\u6642\u9593\u5916\u52b4\u50cd\u3068\u91cd\u306a\u308b\u5834\u5408\u306f50%\u5272\u5897\u30001.5\u500d\uff09\u3001\u6cd5\u5b9a\u4f11\u65e5\u4e0b\u306e\u6df1\u591c\u306f60%\u5272\u5897\uff081.6\u500d\uff09\u306b\u306a\u308a\u307e\u3059\u3002",
                },
              ].map((item, i) => (
                <details key={i} className="bg-white border border-gray-100 rounded-xl group">
                  <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-semibold text-gray-700 list-none">
                    <span>Q. {item.q}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform duration-200">&#9660;</span>
                  </summary>
                  <div className="px-4 pb-3 text-xs text-gray-600 leading-relaxed border-t border-gray-50">
                    <p className="pt-2">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* ============================================================ */}
          {/* Result panel */}
          {/* ============================================================ */}
          <div className="w-full lg:w-80 xl:w-96 lg:sticky lg:top-4 shrink-0 space-y-3">

            {/* Main result card */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg p-5 text-white">
              <p className="text-xs font-semibold opacity-80 mb-1">\u4eca\u6708\u306e\u6b8b\u696d\u4ee3\u5408\u8a08</p>
              <div className="flex items-end gap-1">
                <span className="text-3xl md:text-4xl font-black tracking-tight">
                  \u00a5{fmtNum(animatedTotal)}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-70">\u57fa\u790e\u6642\u7d66</p>
                  <p className="text-lg font-bold">\u00a5{fmtNum(animatedHourly)}<span className="text-xs font-normal opacity-80">/\u6642</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-70">\u6642\u9593\u5916\u6642\u9593</p>
                  <p className="text-lg font-bold">{fmtH(result.totalOvertimeHours)}<span className="text-xs font-normal opacity-80">h</span></p>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            {result.breakdown.length > 0 && (
              <Card>
                <SectionTitle>\u5185\u8a33</SectionTitle>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-100">
                      <th className="text-left pb-1.5 font-semibold">\u533a\u5206</th>
                      <th className="text-right pb-1.5 font-semibold">\u6642\u9593</th>
                      <th className="text-right pb-1.5 font-semibold">\u7387</th>
                      <th className="text-right pb-1.5 font-semibold">\u91d1\u984d</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {result.breakdown.map((b) => (
                      <tr key={b.key}>
                        <td className="py-1.5 text-gray-700">{b.label}</td>
                        <td className="py-1.5 text-right font-mono text-gray-600">{fmtH(b.hours)}h</td>
                        <td className="py-1.5 text-right">
                          <span className="font-bold text-orange-600">{b.rateLabel}</span>
                        </td>
                        <td className="py-1.5 text-right font-bold text-gray-800">\u00a5{fmtNum(b.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

            {/* 60h progress bar */}
            {(input.overtimeMode === "simple" || input.overtimeMode === "detailed" || input.overtimeMode === "daily") && (
              <Card>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-600">60h\u5ba3\u8a00\u7387\u9598\u5e03</span>
                  {isOver60 ? (
                    <span className="text-xs font-bold text-red-600">\u8d8560h\u8d85\u904e</span>
                  ) : (
                    <span className="text-xs text-gray-500">\u3042\u3068{fmtH(hoursUntil60)}h\u3067150%</span>
                  )}
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isOver60 ? "bg-red-500" : pct60 > 75 ? "bg-orange-500" : "bg-orange-300"}`}
                    style={{ width: `${Math.min(pct60, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>0h</span>
                  <span className="font-semibold text-orange-600">60h</span>
                </div>

                {/* 36協定 warning */}
                {isOver45 && !isOver60 && (
                  <div className="mt-2 flex gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                    <span className="text-yellow-600 shrink-0">\u26a0\ufe0f</span>
                    <p className="text-xs text-yellow-700">
                      \u670845h\u8d85\u300236\u5354\u5b9a\u306e\u5ef6\u9577\u9650\u5ea6\u306b\u3054\u6ce8\u610f\u304f\u3060\u3055\u3044\u3002
                    </p>
                  </div>
                )}

                {/* Over 60h warning */}
                {isOver60 && (
                  <div className="mt-2 flex gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <span className="text-red-600 shrink-0">\ud83d\udea8</span>
                    <p className="text-xs text-red-700">
                      \u670860h\u8d85 \u2014 60h\u8d85\u3048\u305f\u5206\u306f\u5272\u5897\u7387\u304c<strong>50%</strong>\u306b\u306a\u308a\u307e\u3059\u3002
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* 未払い残業代 */}
            {input.unpaidMonths > 1 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-xs font-semibold text-red-600 mb-1">
                  \u672a\u6255\u3044\u6b8b\u696d\u4ee3\u5408\u8a08\uff08{input.unpaidMonths}\u304b\u6708\u5206\uff09
                </p>
                <p className="text-2xl font-black text-red-700">
                  \u00a5{fmtNum(result.unpaidTotal)}
                </p>
                <p className="text-xs text-red-400 mt-1">
                  \u00a5{fmtNum(result.totalOvertimePay)} \u00d7 {input.unpaidMonths}\u304b\u6708
                </p>
              </div>
            )}

            {/* CTA */}
            <a
              href="https://bengoshi-soudan.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold text-center rounded-xl transition-colors duration-150"
            >
              \u5f01\u8b77\u58eb\u306b\u6b8b\u696d\u4ee3\u3092\u76f8\u8ac7\u3059\u308b \u2192
            </a>
            <p className="text-xs text-gray-400 text-center">
              \u521d\u56de\u76f8\u8ac7\u7121\u6599\u306e\u5f01\u8b77\u58eb\u4e8b\u52d9\u6240\u3082\u591a\u6570\u3042\u308a\u307e\u3059\u3002
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
