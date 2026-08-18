"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  calcFurusato,
  generateQuickTable,
  FurusatoInput,
  FurusatoResult,
  QuickTableRow,
} from "@/lib/furusato-calculator";

// ── Count-up hook ──────────────────────────────────────────────
function useCountUp(target: number, duration = 600): number {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);
  const prev = useRef(0);
  useEffect(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    const start = prev.current;
    const diff = target - start;
    const t0 = performance.now();
    function step(now: number) {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const v = Math.round(start + diff * ease);
      setValue(v);
      if (p < 1) raf.current = requestAnimationFrame(step);
      else prev.current = target;
    }
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);
  return value;
}

const fmt = (n: number) => n.toLocaleString("ja-JP");

// ── Gauge bar ──────────────────────────────────────────────────
function GaugeBar({ donated, limit }: { donated: number; limit: number }) {
  const pct = limit > 0 ? Math.min((donated / limit) * 100, 100) : 0;
  const remaining = Math.max(limit - donated, 0);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-500">
        <span>\u5bc4\u4ed8\u6e08\u307f: <span className="font-bold text-gray-800">\uFFE5{fmt(donated)}</span></span>
        <span>\u6b8b\u308a: <span className="font-bold text-emerald-600">\uFFE5{fmt(remaining)}</span></span>
      </div>
      <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: pct >= 100
              ? "linear-gradient(90deg,#ef4444,#dc2626)"
              : "linear-gradient(90deg,#10b981,#059669)",
          }}
        />
      </div>
      <div className="text-right text-xs text-gray-400">{pct.toFixed(1)}% \u4f7f\u7528</div>
    </div>
  );
}

// ── StepIndicator ──────────────────────────────────────────────
function StepIndicator({ step }: { step: number }) {
  const steps = ["\u53ce\u5165", "\u5bb6\u65cf\u30fb\u63a7\u9664", "\u7d50\u679c"];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => {
        const s = i + 1;
        const active = step === s;
        const done = step > s;
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-blue-600 text-white ring-4 ring-blue-200"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? "\u2713" : s}
              </div>
              <span className={`mt-1 text-xs font-medium ${active ? "text-blue-600" : done ? "text-emerald-600" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 h-0.5 mb-5 mx-1 transition-all duration-500 ${done ? "bg-emerald-400" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── NumberInput ────────────────────────────────────────────────
function NumberInput({
  label, value, onChange, unit = "\u5186", help, min = 0,
}: {
  label: string; value: number; onChange: (v: number) => void;
  unit?: string; help?: string; min?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      {help && <p className="text-xs text-gray-400">{help}</p>}
      <div className="relative flex items-center">
        <input
          type="number"
          value={value === 0 ? "" : value}
          min={min}
          placeholder="0"
          onChange={(e) => {
            const v = parseInt(e.target.value.replace(/,/g, ""), 10);
            onChange(isNaN(v) ? 0 : v);
          }}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-14 text-right text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-white transition-colors"
        />
        <span className="absolute right-4 text-sm text-gray-400 pointer-events-none">{unit}</span>
      </div>
    </div>
  );
}

// ── ToggleInput ────────────────────────────────────────────────
function ToggleInput({
  label, value, onChange, help,
}: {
  label: string; value: boolean; onChange: (v: boolean) => void; help?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        {help && <p className="text-xs text-gray-400">{help}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${value ? "bg-blue-600" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${value ? "translate-x-6" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

// ── CounterInput ───────────────────────────────────────────────
function CounterInput({ label, value, onChange, max = 6, help }: {
  label: string; value: number; onChange: (v: number) => void; max?: number; help?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      {help && <p className="text-xs text-gray-400">{help}</p>}
      <div className="flex items-center gap-2">
        {Array.from({ length: max + 1 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className={`w-10 h-10 rounded-xl text-sm font-bold border-2 transition-all duration-150 ${
              value === i
                ? "bg-blue-600 border-blue-600 text-white shadow-md scale-110"
                : "bg-white border-gray-200 text-gray-500 hover:border-blue-300"
            }`}
          >
            {i}
          </button>
        ))}
        <span className="text-sm text-gray-400">\u4eba</span>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
export default function FurusatoNozeiCalculator() {
  const [step, setStep] = useState(1);
  const [slideDir, setSlideDir] = useState<"forward" | "back">("forward");
  const [animating, setAnimating] = useState(false);
  const [donatedAmount, setDonatedAmount] = useState(0);

  const [input, setInput] = useState<FurusatoInput>({
    annualIncome: 0,
    sideIncome: 0,
    hasSpouse: false,
    spouseIncome: 0,
    dependents1618: 0,
    dependents1922: 0,
    dependentsOther: 0,
    dependents70plus: 0,
    mortgageDeductionTotal: 0,
    medicalExpenses: 0,
    idecoAnnual: 0,
  });

  const [result, setResult] = useState<FurusatoResult | null>(null);
  const [quickTable, setQuickTable] = useState<QuickTableRow[]>([]);

  const goTo = useCallback((target: number) => {
    if (animating) return;
    const dir: "forward" | "back" = target > step ? "forward" : "back";
    setSlideDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(target);
      setAnimating(false);
      if (target === 3) {
        setResult(calcFurusato(input));
        setQuickTable(generateQuickTable());
      }
    }, 220);
  }, [animating, step, input]);

  const animClass = animating
    ? slideDir === "forward"
      ? "opacity-0 translate-x-8"
      : "opacity-0 -translate-x-8"
    : "opacity-100 translate-x-0";

  const animatedLimit = useCountUp(result?.furusatoLimit ?? 0, 700);

  // ── Step 1 ──────────────────────────────────────────────────
  const Step1 = (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">\u5e74\u53ce\u304b\u3089\u63a7\u9664\u4e0a\u9650\u984d\u3092\u8a08\u7b97\u3057\u307e\u3059\u3002\u7d66\u4e0e\u6240\u5f97\u306e\u304a\u3088\u305d\u306e\u91d1\u984d\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002</p>

      <NumberInput
        label="\u5e74\u53ce\uff08\u7d66\u4e0e\u6240\u5f97\uff09"
        value={input.annualIncome}
        onChange={(v) => setInput({ ...input, annualIncome: v })}
        help="\u6e90\u6cc9\u5f35\u7b49\u306e\u300c\u652f\u6255\u91d1\u984d\u300d\u6b04\u306e\u5408\u8a08\uff08\u5e74\u53ce\uff09"
      />

      <NumberInput
        label="\u526f\u696d\u30fb\u305d\u306e\u4ed6\u6240\u5f97\uff08\u4efb\u610f\uff09"
        value={input.sideIncome}
        onChange={(v) => setInput({ ...input, sideIncome: v })}
        help="\u30d5\u30ea\u30fc\u30e9\u30f3\u30b9\u30fb\u80a1\u5f0f\u914d\u5f53\u91d1\u30fb\u4e0d\u52d5\u7523\u6240\u5f97\u306a\u3069\uff08\u7d4c\u8cbb\u5dee\u3057\u5f15\u304d\u5f8c\uff09"
      />

      <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-800 space-y-1">
        <div className="font-bold">\u2139\ufe0f \u5165\u529b\u5358\u4f4d\u306b\u3064\u3044\u3066</div>
        <div className="text-blue-600">500\u4e07\u5186\u306e\u5834\u5408\u306f\u300c5000000\u300d\u3068\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002</div>
      </div>

      <button
        type="button"
        disabled={input.annualIncome <= 0}
        onClick={() => goTo(2)}
        className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: input.annualIncome > 0 ? "linear-gradient(135deg,#1d4ed8,#2563eb)" : undefined, backgroundColor: input.annualIncome <= 0 ? "#9ca3af" : undefined }}
      >
        \u6b21\u3078\uff1a\u5bb6\u65cf\u30fb\u63a7\u9664 \u2192
      </button>
    </div>
  );

  // ── Step 2 ──────────────────────────────────────────────────
  const Step2 = (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">\u5bb6\u65cf\u69cb\u6210\u3084\u5404\u7a2e\u63a7\u9664\u3092\u5165\u529b\u3059\u308b\u3068\u5c71\u6b21\u52b9\u679c\u304c\u4e0a\u304c\u308a\u307e\u3059\u3002</p>

      {/* Spouse */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-700">\u914d\u5076\u8005</h3>
        <ToggleInput
          label="\u914d\u5076\u8005\u3042\u308a"
          value={input.hasSpouse}
          onChange={(v) => setInput({ ...input, hasSpouse: v })}
          help="\u914d\u5076\u8005\u63a7\u9664\u30fb\u914d\u5076\u8005\u7279\u5225\u63a7\u9664\u306b\u5f71\u97ff"
        />
        {input.hasSpouse && (
          <NumberInput
            label="\u914d\u5076\u8005\u306e\u5e74\u53ce"
            value={input.spouseIncome}
            onChange={(v) => setInput({ ...input, spouseIncome: v })}
            help="103\u4e07\u5186\u4ee5\u4e0b\u306a\u3089\u914d\u5076\u8005\u63a7\u9664\uff08\u6700\u592738\u4e07\u5186\uff09\u304c\u9069\u7528"
          />
        )}
      </div>

      {/* Dependents */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
        <h3 className="text-sm font-bold text-gray-700">\u6276\u990a\u5bb6\u65cf</h3>
        <CounterInput
          label="16\uff5e18\u6b73"
          value={input.dependents1618}
          onChange={(v) => setInput({ ...input, dependents1618: v })}
          help="\u4e00\u822c\u6276\u990a\u63a7\u9664 33\u4e07\u5186\uff0838\u4e07\u5186\uff09"
        />
        <CounterInput
          label="19\uff5e22\u6b73\uff08\u7279\u5b9a\u6276\u990a\uff09"
          value={input.dependents1922}
          onChange={(v) => setInput({ ...input, dependents1922: v })}
          help="\u7279\u5b9a\u6276\u990a\u63a7\u9664 63\u4e07\u5186\uff0645\u4e07\u5186\uff09"
        />
        <CounterInput
          label="23\uff5e69\u6b73\uff08\u4e00\u822c\u6276\u990a\uff09"
          value={input.dependentsOther}
          onChange={(v) => setInput({ ...input, dependentsOther: v })}
          help="\u4e00\u822c\u6276\u990a\u63a7\u9664 38\u4e07\u5186\uff0833\u4e07\u5186\uff09"
        />
        <CounterInput
          label="70\u6b73\u4ee5\u4e0a\uff08\u8001\u4eba\u6276\u990a\uff09"
          value={input.dependents70plus}
          onChange={(v) => setInput({ ...input, dependents70plus: v })}
          help="\u8001\u4eba\u6276\u990a\u63a7\u9664 48\u4e07\u5186\uff0838\u4e07\u5186\uff09"
        />
      </div>

      {/* Deductions */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
        <h3 className="text-sm font-bold text-gray-700">\u305d\u306e\u4ed6\u63a7\u9664</h3>
        <NumberInput
          label="\u4f4f\u5b85\u30ed\u30fc\u30f3\u63a7\u9664\uff08\u5e74\u984d\uff09"
          value={input.mortgageDeductionTotal}
          onChange={(v) => setInput({ ...input, mortgageDeductionTotal: v })}
          help="\u5e74\u672b\u6b8b\u9ad8\u306e0.7%\u3002\u6240\u5f97\u7a0e\u304b\u3089\u5f15\u3044\u3066\u4f4f\u6c11\u7a0e\u306b\u6d41\u7528"
        />
        <NumberInput
          label="\u533b\u7642\u8cbb\u63a7\u9664\uff08\u5b9f\u969b\u652f\u51fa\u984d\uff09"
          value={input.medicalExpenses}
          onChange={(v) => setInput({ ...input, medicalExpenses: v })}
          help="\u5b9f\u969b\u306e\u5c71\u5c71\u8cfc\u5165\u984d\u3002\u4fdd\u967a\u91d1\u3084\u9650\u5ea6\u984d\u8d85\u904e\u5206\u306e\u8a08\u7b97\u306f\u81ea\u52d5\u3067\u884c\u3044\u307e\u3059"
        />
        <NumberInput
          label="iDeCo\u6284\u51fa\u989d\uff08\u5e74\u984d\uff09"
          value={input.idecoAnnual}
          onChange={(v) => setInput({ ...input, idecoAnnual: v })}
          help="\u5c0f\u898f\u6a21\u4f01\u696d\u52e4\u52d9: \u6708\u6700\u59275.5\u4e07\u5186\u3001\u4f1a\u793e\u54e1: \u6708\u6700\u59272.3\u4e07\u5186"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => goTo(1)}
          className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-lg hover:border-gray-300 transition-all"
        >
          \u2190 \u623b\u308b
        </button>
        <button
          type="button"
          onClick={() => goTo(3)}
          className="flex-[2] py-4 rounded-2xl text-white font-bold text-lg transition-all duration-200"
          style={{ background: "linear-gradient(135deg,#1d4ed8,#7c3aed)" }}
        >
          \u63a7\u9664\u4e0a\u9650\u3092\u8a08\u7b97 \u2192
        </button>
      </div>
    </div>
  );

  // ── Step 3 ──────────────────────────────────────────────────
  const rows: { label: string; amount: number; color: string }[] = result ? [
    { label: "\u7d66\u4e0e\u6240\u5f97", amount: result.kyuyoShotoku, color: "#6366f1" },
    { label: "\u793e\u4f1a\u4fdd\u967a\u6599\u63a7\u9664", amount: result.socialInsurance, color: "#8b5cf6" },
    { label: "\u914d\u5076\u8005\u63a7\u9664", amount: result.spouseDeductionRT, color: "#a78bfa" },
    { label: "\u6276\u990a\u63a7\u9664", amount: result.dependentsRT, color: "#c4b5fd" },
    { label: "\u57fa\u790e\u63a7\u9664", amount: result.basicDeductionRT, color: "#ddd6fe" },
    { label: "\u533b\u7642\u8cbb+iDeCo\u63a7\u9664", amount: result.medicalDeduction + result.idecoDeduction, color: "#ede9fe" },
    { label: "\u8ab2\u7a0e\u6240\u5f97\uff08\u4f4f\u6c11\u7a0e\uff09", amount: result.taxableRT, color: "#2563eb" },
    { label: "\u4f4f\u6c11\u7a0e\u6240\u5f97\u5272\u984d", amount: result.residentTaxOwed, color: "#1d4ed8" },
  ].filter((r) => r.amount > 0) : [];

  const Step3 = result ? (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="rounded-3xl text-white p-6 text-center shadow-xl" style={{ background: "linear-gradient(135deg,#1e3a8a,#7c3aed,#1d4ed8)" }}>
        <div className="text-sm font-medium opacity-80 mb-1">\u3042\u306a\u305f\u306e\u3075\u308b\u3055\u3068\u7d0d\u7a0e\u63a7\u9664\u4e0a\u9650\u984d</div>
        <div className="text-5xl font-black tracking-tight mt-2">
          <span className="text-2xl mr-1 opacity-80">\uFFE5</span>
          {fmt(animatedLimit)}
        </div>
        <div className="mt-3 text-sm opacity-70">2\u5343\u5186\u306e\u81ea\u5df1\u8ca0\u62c5\u3067\u3053\u306e\u91d1\u984d\u307e\u3067\u5bfe\u8c61\u5546\u54c1\u304c\u3082\u3089\u3048\u307e\u3059</div>
        <div className="mt-4 bg-white/20 rounded-2xl px-4 py-2 inline-block">
          <span className="text-xs opacity-80">\u7bc0\u7a0e\u52b9\u679c: </span>
          <span className="font-bold text-yellow-300">\uFFE5{fmt(result.taxSaving)}</span>
          <span className="text-xs opacity-80 ml-1">(\u81ea\u5df1\u8ca0\u62c5\u5dee\u3057\u5f15\u304d)</span>
        </div>
      </div>

      {/* Donated tracker */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-700">\u5bc4\u4ed8\u6e08\u307f\u984d\u306e\u8ffd\u8de1</h3>
          <span className="text-xs text-gray-400">\u4eca\u5e74\u306e\u5bc4\u4ed8\u984d\u3092\u8a18\u9332</span>
        </div>
        <GaugeBar donated={donatedAmount} limit={result.furusatoLimit} />
        <div className="flex gap-2">
          <input
            type="number"
            value={donatedAmount === 0 ? "" : donatedAmount}
            min={0}
            placeholder="\u5bc4\u4ed8\u6e08\u307f\u984d\u3092\u5165\u529b"
            onChange={(e) => setDonatedAmount(parseInt(e.target.value, 10) || 0)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-right font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          />
          <span className="flex items-center text-sm text-gray-400 pr-2">\u5186</span>
        </div>
      </div>

      {/* Breakdown table */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-4">\u8a08\u7b97\u5185\u8a33</h3>
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                <span className="text-sm text-gray-600">{row.label}</span>
              </div>
              <span className="text-sm font-mono font-semibold text-gray-800">\uFFE5{fmt(row.amount)}</span>
            </div>
          ))}
          <div className="pt-3 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800">\u4f4f\u6c11\u7a0e\u6240\u5f97\u5272\u984d \xd7 20%</span>
            <span className="text-sm font-mono font-bold text-blue-700">\uFFE5{fmt(Math.round(result.residentTaxOwed * 0.20))}</span>
          </div>
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs text-gray-500">\u5206\u6bcd (0.9 \u2212 \u9650\u754c\u7a0e\u7387{(result.marginalRate * 100).toFixed(0)}% \xd7 1.021)</span>
            <span className="text-xs font-mono text-gray-500">{(0.9 - result.marginalRate * 1.021).toFixed(4)}</span>
          </div>
          <div className="flex items-center justify-between bg-blue-50 rounded-xl px-3 py-2 mt-2">
            <span className="text-sm font-bold text-blue-800">\u63a7\u9664\u4e0a\u9650\u984d\uff08+2,000\u5186\uff09</span>
            <span className="text-lg font-black font-mono text-blue-700">\uFFE5{fmt(result.furusatoLimit)}</span>
          </div>
        </div>
      </div>

      {/* Compare: single vs current */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-4">\u72ec\u8eab\u30fb\u73fe\u5728\u306e\u8a2d\u5b9a\u6bd4\u8f03</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "\u72ec\u8eab\uff08\u540c\u5e74\u53ce\uff09", limit: result.singleLimit, highlight: false },
            { label: "\u73fe\u5728\u306e\u8a2d\u5b9a", limit: result.furusatoLimit, highlight: true },
          ].map((c) => (
            <div
              key={c.label}
              className={`rounded-2xl p-4 text-center ${c.highlight ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-700"}`}
            >
              <div className={`text-xs font-medium mb-2 ${c.highlight ? "opacity-80" : "text-gray-500"}`}>{c.label}</div>
              <div className={`text-2xl font-black font-mono ${c.highlight ? "" : "text-gray-800"}`}>\uFFE5{fmt(c.limit)}</div>
            </div>
          ))}
        </div>
        {result.furusatoLimit > result.singleLimit && (
          <div className="mt-3 text-center text-sm text-emerald-600 font-medium">
            \u5bb6\u65cf\u69cb\u6210\u30fb\u63a7\u9664\u306b\u3088\u308a <span className="font-bold">\uFFE5{fmt(result.furusatoLimit - result.singleLimit)}</span> \u591a\u304f\u5bc4\u4ed8\u3067\u304d\u307e\u3059
          </div>
        )}
      </div>

      {/* Quick table */}
      {quickTable.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm overflow-x-auto">
          <h3 className="text-sm font-bold text-gray-700 mb-4">\u5e74\u53ce\u5225\u65e9\u898b\u8868</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 border-b">
                <th className="pb-2 text-left font-medium">\u5e74\u53ce</th>
                <th className="pb-2 text-right font-medium">\u72ec\u8eab</th>
                <th className="pb-2 text-right font-medium">\u914d\u5076\u8005\u3042\u308a</th>
                <th className="pb-2 text-right font-medium">\u5b50\u3042\u308a</th>
              </tr>
            </thead>
            <tbody>
              {quickTable.map((row) => (
                <tr key={row.income} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-2 font-mono text-gray-700">{fmt(row.income / 10000)}\u4e07</td>
                  <td className="py-2 text-right font-mono text-blue-700 font-bold">{fmt(row.single)}</td>
                  <td className="py-2 text-right font-mono text-purple-600">{fmt(row.married)}</td>
                  <td className="py-2 text-right font-mono text-emerald-600">{fmt(row.marriedWithChild)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => goTo(2)}
          className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-gray-300 transition-all"
        >
          \u2190 \u4fee\u6b63
        </button>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(
              `\u3075\u308b\u3055\u3068\u7d0d\u7a0e\u63a7\u9664\u4e0a\u9650\u984d: \uFFE5${fmt(result.furusatoLimit)}\n\u5e74\u53ce: \uFFE5${fmt(input.annualIncome)}\n\u7bc0\u7a0e\u52b9\u679c: \uFFE5${fmt(result.taxSaving)}`
            );
          }}
          className="flex-1 py-3 rounded-2xl border-2 border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 transition-all"
        >
          \u30b3\u30d4\u30fc
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-gray-300 transition-all"
        >
          \u5370\u5237
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block text-5xl mb-3">\u2764\ufe0f</div>
          <h1 className="text-2xl font-black text-gray-900">\u3075\u308b\u3055\u3068\u7d0d\u7a0e<br />\u63a7\u9664\u4e0a\u9650\u984d\u8a08\u7b97</h1>
          <p className="mt-2 text-sm text-gray-500">2026\u5e74\u5ea6\u6700\u65b0\u30ec\u30fc\u30c8\u5bfe\u5fdc\u30fb\u603b\u52d9\u7701\u65b9\u5f0f\u6b63\u78ba\u8a08\u7b97</p>
        </div>

        <StepIndicator step={step} />

        <div className={`bg-white rounded-3xl shadow-lg p-6 transition-all duration-220 ${animClass}`}>
          {step === 1 && Step1}
          {step === 2 && Step2}
          {step === 3 && Step3}
        </div>

        {/* FAQ */}
        <div className="mt-8 space-y-3">
          <h2 className="text-sm font-bold text-gray-600">\u3088\u304f\u3042\u308b\u8cea\u554f</h2>
          {[
            ["\u8a08\u7b97\u65b9\u5f0f\u306f\uff1f", "\u603b\u52d9\u7701\u304c\u516c\u5f0f\u306b\u793a\u3059\u300c(\u4f4f\u6c11\u7a0e\u6240\u5f97\u5272 \xd7 20%) \u00f7 (0.9 \u2212 \u9650\u754c\u7a0e\u7387 \xd7 1.021) + 2000\u5186\u300d\u3092\u4f7f\u7528\u3057\u3066\u3044\u307e\u3059\u3002"],
            ["\u793e\u4f1a\u4fdd\u967a\u6599\u306f\u306a\u305c\u5fc5\u8981\uff1f", "\u793e\u4f1a\u4fdd\u967a\u6599\u306f\u6240\u5f97\u63a7\u9664\u306b\u3042\u305f\u308a\u3001\u8ab2\u7a0e\u6240\u5f97\u3092\u5927\u304d\u304f\u6e1b\u3089\u3059\u305f\u3081\u4e0a\u9650\u984d\u306b\u5f71\u97ff\u3057\u307e\u3059\u3002\u7d66\u4e0e\u5e74\u53ce\u306e\u7d0414.4%\u3067\u6982\u7b97\u3057\u3066\u3044\u307e\u3059\u3002"],
            ["\u5b9f\u969b\u306e\u63a7\u9664\u4e0a\u9650\u3068\u9055\u3046\u5834\u5408\u306f\uff1f", "\u5e74\u6700\u7d42\u8abf\u6574\u3084\u305d\u306e\u5e74\u306e\u5b9f\u969b\u306e\u793e\u4f1a\u4fdd\u967a\u6599\u306b\u3088\u308a\u6570\u5343\u5186\u30ec\u30d9\u30eb\u3067\u5dee\u304c\u751f\u3058\u308b\u3053\u3068\u304c\u3042\u308a\u307e\u3059\u3002\u8a73\u7d30\u306f\u7d42\u308f\u5c3a\u745e\u5e95\u8a08\u7b97\u3092\u3054\u5229\u7528\u304f\u3060\u3055\u3044\u3002"],
          ].map(([q, a]) => (
            <details key={q} className="bg-white rounded-2xl border border-gray-100 shadow-sm group">
              <summary className="px-5 py-4 text-sm font-semibold text-gray-700 cursor-pointer list-none flex items-center justify-between">
                {q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">\u25be</span>
              </summary>
              <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
