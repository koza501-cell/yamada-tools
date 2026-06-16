"use client";

import { useState, useEffect, useRef } from "react";
import { AdUnit } from "@/components/common/AdUnit";
import {
  calcNenmatsu,
  type NenmatsuInput,
  type NenmatsuResult,
  type DisabilityType,
  type SpouseDisabilityType,
} from "@/lib/nenmatsu-calculator";

// ── useCountUp ────────────────────────────────────────────────
function useCountUp(target: number, duration = 600): number {
  const [val, setVal] = useState(target);
  const prev   = useRef(target);
  const raf    = useRef<number>(0);
  const startT = useRef(0);
  useEffect(() => {
    const from = prev.current;
    prev.current = target;
    if (from === target) return;
    const diff = target - from;
    const tick = (ts: number) => {
      if (!startT.current) startT.current = ts;
      const p = Math.min((ts - startT.current) / duration, 1);
      setVal(Math.round(from + diff * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    startT.current = 0;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val;
}

// ── Helpers ────────────────────────────────────────────────────
function fmt(n: number) { return "¥" + Math.abs(n).toLocaleString(); }
function fmtSigned(n: number) {
  if (n > 0) return "+" + fmt(n);
  if (n < 0) return "-" + fmt(n);
  return "¥0";
}

// ── Number Input with Slider ───────────────────────────────────
function NumInput({
  label, value, onChange, min = 0, max, step = 10000, prefix = "¥", hint,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; prefix?: string; hint?: string;
}) {
  const [text, setText] = useState(String(value));
  useEffect(() => { setText(String(value)); }, [value]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      <div className="flex items-center gap-2">
        {prefix && <span className="text-gray-400 text-sm">{prefix}</span>}
        <input
          type="number"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v) && v >= 0) onChange(v);
          }}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right font-mono text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {max !== undefined && (
        <>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={Math.min(Math.max(value, min), max)}
            onChange={(e) => { const v = parseInt(e.target.value, 10); onChange(v); setText(String(v)); }}
            className="w-full mt-2 accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{prefix}{min.toLocaleString()}</span>
            <span>{prefix}{max.toLocaleString()}</span>
          </div>
        </>
      )}
    </div>
  );
}

// ── Section Card ───────────────────────────────────────────────
function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      <h2 className="font-semibold text-gray-800 flex items-center gap-2">
        <span className="text-lg">{icon}</span> {title}
      </h2>
      {children}
    </div>
  );
}

// ── Waterfall Chart ────────────────────────────────────────────
function WaterfallChart({ result }: { result: NenmatsuResult }) {
  const d = result.deductions;
  const maxVal = result.annualIncome;
  const rows: { label: string; value: number; type: "income" | "deduct" | "total" | "tax" | "result"; indent?: boolean }[] = [
    { label: "年間給与収入",       value: result.annualIncome,          type: "income" },
    { label: "　給与所得控除",     value: d.kyuyoShotokuKojo,           type: "deduct", indent: true },
    { label: "給与所得",           value: d.kyuyoShotoku,               type: "total" },
    { label: "　所得控除合計",     value: d.totalDeductions,            type: "deduct", indent: true },
    { label: "課税所得",           value: result.taxableIncome,         type: "total" },
    { label: "　所得税（推計）",   value: result.grossIncomeTax,        type: "tax", indent: true },
    { label: "　住宅ローン控除",   value: result.mortgageTaxCredit,     type: "deduct", indent: true },
    { label: "年税額",             value: result.finalTax,              type: "total" },
    { label: "源泉徴収税額",       value: result.withholdingTax,        type: "income" },
    { label: result.refundAmount >= 0 ? "還付金" : "追徴税額",
                                   value: Math.abs(result.refundAmount), type: "result" },
  ];

  return (
    <div className="space-y-0.5">
      {rows.map((row, i) => {
        const barW = maxVal > 0 ? (row.value / maxVal) * 100 : 0;
        const isDeduct = row.type === "deduct";
        const isResult = row.type === "result";
        const isTax    = row.type === "tax";
        const isTotal  = row.type === "total";
        const barColor = isResult
          ? (result.refundAmount >= 0 ? "bg-green-500" : "bg-red-500")
          : isDeduct ? "bg-orange-300"
          : isTax    ? "bg-red-300"
          : isTotal  ? "bg-blue-400"
          : "bg-blue-200";
        const textColor = isResult
          ? (result.refundAmount >= 0 ? "text-green-700" : "text-red-700")
          : isDeduct || isTax ? "text-orange-700"
          : isTotal           ? "text-blue-800"
          : "text-gray-700";
        const isTotal2 = isTotal || isResult;

        return (
          <div
            key={i}
            className={`flex items-center gap-2 py-1 ${isTotal2 ? "border-t border-gray-200 pt-2" : ""} ${
              isResult ? "mt-1 pt-2 border-t-2 border-gray-300" : ""
            }`}
          >
            <div className={`text-xs w-36 flex-shrink-0 ${isTotal2 ? "font-semibold text-gray-800" : "text-gray-500"}`}>
              {isDeduct ? "− " : isTax ? "× " : isResult && result.refundAmount < 0 ? "追徴 " : ""}{row.label}
            </div>
            <div className="flex-1 h-4 bg-gray-50 rounded overflow-hidden">
              <div
                className={`h-full ${barColor} rounded transition-all duration-500`}
                style={{ width: `${Math.min(barW, 100)}%` }}
              />
            </div>
            <div className={`text-xs font-mono w-24 text-right font-medium ${textColor}`}>
              {isDeduct || isTax ? "−" : ""}{fmt(row.value)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Tax Bracket Indicator ──────────────────────────────────────
const BRACKETS = [
  { rate: 0.05,  label: "5%",  max: 1950000 },
  { rate: 0.10,  label: "10%", max: 3300000 },
  { rate: 0.20,  label: "20%", max: 6950000 },
  { rate: 0.23,  label: "23%", max: 9000000 },
  { rate: 0.33,  label: "33%", max: 18000000 },
  { rate: 0.40,  label: "40%", max: 40000000 },
  { rate: 0.45,  label: "45%", max: Infinity },
];

function TaxBracketIndicator({ bracketRate, nextGap }: { bracketRate: number; nextGap: number }) {
  const idx = BRACKETS.findIndex((b) => b.rate === bracketRate);
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-sm font-medium text-gray-600 mb-3">適用税率ブラケット</p>
      <div className="flex gap-1">
        {BRACKETS.map((b, i) => (
          <div
            key={b.label}
            className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-bold transition-all ${
              i === idx
                ? "bg-blue-600 text-white shadow-md scale-110"
                : i < idx
                ? "bg-blue-100 text-blue-500"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {b.label}
          </div>
        ))}
      </div>
      {idx < BRACKETS.length - 1 && nextGap > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          次のブラケット（{BRACKETS[idx + 1].label}）まで課税所得があと{" "}
          <span className="font-semibold text-blue-600">¥{nextGap.toLocaleString()}</span>
        </p>
      )}
    </div>
  );
}

// ── FAQ ────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "年末調整の還付金はいつ振り込まれますか？",
    a: "通常、年末調整が行われる12月の給与（または賞与）で精算されます。還付金は給与に上乗せして支払われるため、12月〜翌年1月の給与振込時に反映されます。",
  },
  {
    q: "還付金の計算方法を教えてください",
    a: "還付金 = 源泉徴収税額 − 年税額 です。年間を通じて毎月天引きされた源泉徴収税額が、各種控除を加味した正確な年税額を上回っている場合、その差額が還付されます。",
  },
  {
    q: "住宅ローン控除は年末調整で受けられますか？",
    a: "はい。住宅ローン控除は初年度のみ確定申告が必要ですが、2年目以降は年末調整で申告できます。控除額は年末残高×0.7%（2022年以降取得の場合）で、最大21万円が税額から直接差し引かれます。",
  },
  {
    q: "生命保険料控除の上限はいくらですか？",
    a: "2012年以降に締結した保険（新制度）の場合、一般生命保険・介護医療保険・個人年金保険の3区分それぞれ最大4万円、合計で最大12万円の控除が受けられます。",
  },
  {
    q: "年末調整をしないとどうなりますか？",
    a: "年末調整をしないと、毎月天引きされた概算の源泉徴収税額が確定しません。翌年3月15日までに自分で確定申告をする必要があります。申告しなかった場合、追徴税や延滞税が発生する可能性があります。",
  },
];

// ── Main Component ─────────────────────────────────────────────
const DEFAULT_INPUT: NenmatsuInput = {
  annualIncome: 5000000,
  withholdingTax: 0,
  useEstimatedWithholding: true,
  socialInsurance: 0,
  useEstimatedSocialInsurance: true,
  hasSpouse: false,
  spouseIncome: 0,
  spouseIsDisabled: false,
  generalDependents: 0,
  specificDependents: 0,
  elderlyDependents: 0,
  elderlyLivingDependents: 0,
  lifeInsuranceGeneral: 0,
  lifeInsuranceNursing: 0,
  lifeInsurancePension: 0,
  earthquakeInsurance: 0,
  ideco: 0,
  smallEnterprise: 0,
  mortgageLoanBalance: 0,
  mortgageTaxCreditManual: 0,
  medicalExpenses: 0,
  furusatoNozei: 0,
  disability: "none",
  spouseDisability: "none",
};

export default function NenmatsuChoseiCalculator() {
  const [inp, setInp]     = useState<NenmatsuInput>(DEFAULT_INPUT);
  const [simple, setSimple] = useState(true);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const upd = <K extends keyof NenmatsuInput>(key: K, value: NenmatsuInput[K]) =>
    setInp((prev) => ({ ...prev, [key]: value }));

  const result = calcNenmatsu(inp);

  const animRefund   = useCountUp(result.refundAmount);
  const animFinalTax = useCountUp(result.finalTax);
  const animTaxable  = useCountUp(result.taxableIncome);

  const isRefund  = result.refundAmount > 0;
  const isZero    = result.refundAmount === 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        年末調整 還付金計算ツール 2026
      </h1>
      <p className="text-gray-500 text-sm mb-2">
        各種控除を入力して還付金（または追徴額）を事前シミュレーション。
      </p>

      {/* 簡易/詳細 toggle */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-gray-500">入力モード:</span>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          {[true, false].map((s) => (
            <button
              key={String(s)}
              onClick={() => setSimple(s)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                simple === s
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {s ? "簡易モード" : "詳細モード"}
            </button>
          ))}
        </div>
        {simple && (
          <span className="text-xs text-gray-400">よく使う5項目のみ表示</span>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── 入力パネル ─────────────────────────────────── */}
        <div className="flex-1 space-y-4">
          {/* 1. 収入情報 */}
          <SectionCard title="収入情報" icon="💴">
            <NumInput
              label="年間給与収入（税込・交通費含む）"
              value={inp.annualIncome}
              onChange={(v) => upd("annualIncome", v)}
              max={20000000}
              step={100000}
              hint="源泉徴収票の「支払金額」欄"
            />
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">源泉徴収税額</label>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => upd("useEstimatedWithholding", true)}
                  className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${
                    inp.useEstimatedWithholding
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-600 hover:border-blue-400"
                  }`}
                >
                  自動推計
                </button>
                <button
                  onClick={() => upd("useEstimatedWithholding", false)}
                  className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${
                    !inp.useEstimatedWithholding
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-600 hover:border-blue-400"
                  }`}
                >
                  実額入力
                </button>
              </div>
              {!inp.useEstimatedWithholding ? (
                <NumInput
                  label=""
                  value={inp.withholdingTax}
                  onChange={(v) => upd("withholdingTax", v)}
                  hint='源泉徴収票の「源泉徴収税額」欄の金額'
                />
              ) : (
                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2">
                  基礎控除・社会保険料のみで推計した概算値を使用します
                </p>
              )}
            </div>

            {/* 社会保険料 */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">社会保険料控除</label>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => upd("useEstimatedSocialInsurance", true)}
                  className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${
                    inp.useEstimatedSocialInsurance
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-600 hover:border-blue-400"
                  }`}
                >
                  自動推計（14.42%）
                </button>
                <button
                  onClick={() => upd("useEstimatedSocialInsurance", false)}
                  className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${
                    !inp.useEstimatedSocialInsurance
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-600 hover:border-blue-400"
                  }`}
                >
                  実額入力
                </button>
              </div>
              {!inp.useEstimatedSocialInsurance && (
                <NumInput
                  label=""
                  value={inp.socialInsurance}
                  onChange={(v) => upd("socialInsurance", v)}
                  hint='源泉徴収票の「社会保険料等の金額」欄'
                />
              )}
            </div>
          </SectionCard>

          {/* 2. 家族構成 */}
          <SectionCard title="家族構成" icon="👨‍👩‍👧">
            {/* 配偶者 */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inp.hasSpouse}
                  onChange={(e) => upd("hasSpouse", e.target.checked)}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">配偶者あり</span>
              </label>

              {inp.hasSpouse && (
                <div className="mt-3 pl-4 space-y-3">
                  <NumInput
                    label="配偶者の給与年収"
                    value={inp.spouseIncome}
                    onChange={(v) => upd("spouseIncome", v)}
                    max={2500000}
                    step={100000}
                  />

                  {/* 壁インジケーター */}
                  <div className="space-y-1.5">
                    {[
                      { wall: 1030000, label: "103万円の壁", desc: "配偶者控除（¥380,000）の境界", gap: result.spouseWall103Gap },
                      { wall: 1500000, label: "150万円の壁", desc: "配偶者特別控除フル額の境界", gap: result.spouseWall150Gap },
                      { wall: 2010000, label: "201万円の壁", desc: "配偶者特別控除が消失する境界", gap: result.spouseWall201Gap },
                    ].map((w) => {
                      const crossed = inp.spouseIncome >= w.wall;
                      const close   = !crossed && w.gap < 200000;
                      return (
                        <div
                          key={w.label}
                          className={`text-xs rounded-lg px-3 py-2 ${
                            crossed ? "bg-orange-50 border border-orange-200 text-orange-700" :
                            close   ? "bg-yellow-50 border border-yellow-200 text-yellow-700" :
                            "bg-gray-50 text-gray-500"
                          }`}
                        >
                          <span className="font-semibold">{w.label}</span>
                          {crossed ? " ✓ 超えています" : ` まであと¥${w.gap.toLocaleString()}`}
                          <span className="ml-1 opacity-70">— {w.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 扶養親族 */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">扶養親族</p>
              {[
                { key: "generalDependents",       label: "一般扶養親族（16-18歳・23-69歳）", unit: 380000 },
                { key: "specificDependents",      label: "特定扶養親族（19-22歳）",           unit: 630000 },
                { key: "elderlyDependents",       label: "老人扶養親族・別居（70歳以上）",    unit: 480000 },
                { key: "elderlyLivingDependents", label: "同居老人扶養親族（70歳以上）",       unit: 580000 },
              ].map((dep) => (
                <div key={dep.key} className="flex items-center gap-3">
                  <span className="flex-1 text-sm text-gray-600">{dep.label}</span>
                  <span className="text-xs text-gray-400">¥{dep.unit.toLocaleString()}/人</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => upd(dep.key as keyof NenmatsuInput, Math.max(0, (inp[dep.key as keyof NenmatsuInput] as number) - 1) as NenmatsuInput[keyof NenmatsuInput])}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >−</button>
                    <span className="w-6 text-center font-medium">{inp[dep.key as keyof NenmatsuInput] as number}</span>
                    <button
                      onClick={() => upd(dep.key as keyof NenmatsuInput, Math.min(10, (inp[dep.key as keyof NenmatsuInput] as number) + 1) as NenmatsuInput[keyof NenmatsuInput])}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >＋</button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 3. 各種控除 */}
          <SectionCard title="各種控除" icon="📋">
            {/* 住宅ローン控除 (簡易でも表示) */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1">🏠 住宅ローン控除</p>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => upd("mortgageTaxCreditManual", 0)}
                  className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${
                    inp.mortgageTaxCreditManual === 0
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-600 hover:border-blue-400"
                  }`}
                >
                  残高から計算（×0.7%）
                </button>
                <button
                  onClick={() => upd("mortgageTaxCreditManual", 1)}
                  className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${
                    inp.mortgageTaxCreditManual > 0
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-600 hover:border-blue-400"
                  }`}
                >
                  実額入力
                </button>
              </div>
              {inp.mortgageTaxCreditManual === 0 ? (
                <NumInput
                  label="住宅ローン年末残高"
                  value={inp.mortgageLoanBalance}
                  onChange={(v) => upd("mortgageLoanBalance", v)}
                  max={50000000}
                  step={500000}
                  hint="残高×0.7%が税額控除（上限¥21万）"
                />
              ) : (
                <NumInput
                  label="住宅ローン控除額（実額）"
                  value={inp.mortgageTaxCreditManual}
                  onChange={(v) => upd("mortgageTaxCreditManual", v)}
                  max={350000}
                  step={10000}
                  hint='源泉徴収票の「住宅借入金等特別控除の額」欄'
                />
              )}
            </div>

            {/* iDeCo / 小規模企業共済 (簡易表示) */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1">🏦 iDeCo・小規模企業共済</p>
              <NumInput
                label="iDeCo掛金（年額）"
                value={inp.ideco}
                onChange={(v) => upd("ideco", v)}
                max={276000}
                step={10000}
                hint="月掛金×12（会社員上限¥276,000/年）"
              />
              {!simple && (
                <NumInput
                  label="小規模企業共済掛金（年額）"
                  value={inp.smallEnterprise}
                  onChange={(v) => upd("smallEnterprise", v)}
                  max={840000}
                  step={10000}
                />
              )}
            </div>

            {/* 生命保険料控除 (簡易表示) */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1">🛡️ 生命保険料控除（新制度・各上限¥40,000）</p>
              <NumInput
                label="一般生命保険料（年額）"
                value={inp.lifeInsuranceGeneral}
                onChange={(v) => upd("lifeInsuranceGeneral", v)}
                max={200000}
                step={10000}
              />
              {!simple && (
                <>
                  <NumInput
                    label="介護医療保険料（年額）"
                    value={inp.lifeInsuranceNursing}
                    onChange={(v) => upd("lifeInsuranceNursing", v)}
                    max={200000}
                    step={10000}
                  />
                  <NumInput
                    label="個人年金保険料（年額）"
                    value={inp.lifeInsurancePension}
                    onChange={(v) => upd("lifeInsurancePension", v)}
                    max={200000}
                    step={10000}
                  />
                </>
              )}
              {result.deductions.lifeInsuranceDeduction > 0 && (
                <p className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">
                  計算後の控除額: ¥{result.deductions.lifeInsuranceDeduction.toLocaleString()}（上限¥120,000）
                </p>
              )}
            </div>

            {/* ふるさと納税 (簡易表示) */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">❤️ ふるさと納税（寄附金控除）</p>
              <NumInput
                label="ふるさと納税の寄附総額"
                value={inp.furusatoNozei}
                onChange={(v) => upd("furusatoNozei", v)}
                max={1000000}
                step={5000}
                hint="実質自己負担2,000円。控除額 = 寄付額 − 2,000円"
              />
            </div>

            {/* 詳細モードのみ */}
            {!simple && (
              <>
                {/* 地震保険料 */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">🏚️ 地震保険料控除（上限¥50,000）</p>
                  <NumInput
                    label="地震保険料（年額）"
                    value={inp.earthquakeInsurance}
                    onChange={(v) => upd("earthquakeInsurance", v)}
                    max={100000}
                    step={5000}
                  />
                </div>

                {/* 医療費控除 */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">🏥 医療費控除</p>
                  <NumInput
                    label="年間医療費（本人・家族合計）"
                    value={inp.medicalExpenses}
                    onChange={(v) => upd("medicalExpenses", v)}
                    max={3000000}
                    step={10000}
                    hint="10万円（または所得の5%）を超えた分が控除"
                  />
                  {result.deductions.medicalDeduction > 0 && (
                    <p className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1 mt-1">
                      控除額: ¥{result.deductions.medicalDeduction.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* 障害者控除 */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">♿ 障害者控除</p>
                  <div className="space-y-1">
                    {(["none", "normal", "special", "specialLiving"] as DisabilityType[]).map((v) => {
                      const labels: Record<DisabilityType, string> = {
                        none: "なし", normal: "一般障害者（¥270,000）",
                        special: "特別障害者（¥400,000）", specialLiving: "同居特別障害者（¥750,000）",
                      };
                      return (
                        <label key={v} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" checked={inp.disability === v}
                            onChange={() => upd("disability", v)} className="accent-blue-600" />
                          <span className="text-sm text-gray-700">{labels[v]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </SectionCard>

          <AdUnit slot="5612038947" format="rectangle" className="my-4" />
        </div>

        {/* ── 結果パネル ─────────────────────────────────── */}
        <div className="lg:w-[420px] xl:w-[460px] lg:sticky lg:top-4 self-start space-y-4">
          {/* Hero */}
          <div
            className={`rounded-xl p-5 text-white ${
              isZero
                ? "bg-gradient-to-br from-gray-500 to-gray-600"
                : isRefund
                ? "bg-gradient-to-br from-green-600 to-emerald-700"
                : "bg-gradient-to-br from-orange-500 to-red-600"
            }`}
          >
            <p className={`text-sm mb-1 ${isRefund ? "text-green-200" : isZero ? "text-gray-300" : "text-orange-200"}`}>
              {isRefund ? "還付金（戻ってくる金額）" : isZero ? "還付・追徴なし" : "追徴税額（追加で払う金額）"}
            </p>
            <p className="text-4xl font-bold mb-1">
              {isRefund ? "+" : isZero ? "" : "−"}¥{Math.abs(animRefund).toLocaleString()}
            </p>
            {isRefund && (
              <p className={`text-sm ${isRefund ? "text-green-200" : "text-orange-200"}`}>
                振込予定: 12月給与または翌年1〜2月頃
              </p>
            )}
            <div className={`mt-3 pt-3 border-t ${isRefund ? "border-green-500" : isZero ? "border-gray-400" : "border-orange-400"} grid grid-cols-2 gap-2 text-sm`}>
              <div>
                <p className="opacity-70 text-xs">年税額</p>
                <p className="font-semibold">¥{animFinalTax.toLocaleString()}</p>
              </div>
              <div>
                <p className="opacity-70 text-xs">課税所得</p>
                <p className="font-semibold">¥{animTaxable.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Waterfall */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">計算の内訳</p>
            <WaterfallChart result={result} />
          </div>

          {/* 所得控除内訳 */}
          {result.deductions.totalDeductions > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">所得控除内訳</p>
              <div className="space-y-1.5">
                {[
                  { label: "基礎控除",         val: result.deductions.basicDeduction },
                  { label: "社会保険料控除",   val: result.deductions.socialInsuranceDeduction },
                  { label: result.deductions.spouseDeductionType || "配偶者控除", val: result.deductions.spouseDeduction },
                  { label: "扶養控除",         val: result.deductions.dependentDeduction },
                  { label: "生命保険料控除",   val: result.deductions.lifeInsuranceDeduction },
                  { label: "地震保険料控除",   val: result.deductions.earthquakeDeduction },
                  { label: "小規模共済等控除", val: result.deductions.idecoCombinedDeduction },
                  { label: "医療費控除",       val: result.deductions.medicalDeduction },
                  { label: "寄附金控除",       val: result.deductions.furusatoDeduction },
                  { label: "障害者控除",       val: result.deductions.disabilityDeduction },
                ].filter((r) => r.val > 0).map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-gray-600">{row.label}</span>
                    <span className="font-medium text-gray-800">¥{row.val.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-1.5 mt-1.5">
                  <span className="text-gray-700">控除合計</span>
                  <span className="text-blue-700">¥{result.deductions.totalDeductions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bracket */}
          <TaxBracketIndicator bracketRate={result.bracketRate} nextGap={result.nextBracketGap} />

          {/* 節税アドバイス */}
          {result.potentialSavings.filter((s) => s.additionalRefund > 0).length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-800 mb-3">💡 節税アドバイス</p>
              <div className="space-y-2">
                {result.potentialSavings.filter((s) => s.additionalRefund > 0).map((saving) => (
                  <div key={saving.key} className="bg-white rounded-lg p-3 border border-amber-100">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{saving.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{saving.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{saving.description}</p>
                        <p className="text-sm font-semibold text-green-700 mt-1">
                          還付金が約¥{saving.additionalRefund.toLocaleString()}増える可能性
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="w-full py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors print:hidden"
          >
            🖨️ 印刷 / PDF保存
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800 pr-4">{item.q}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${faqOpen === i ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {faqOpen === i && (
                <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <AdUnit slot="5612038947" format="horizontal" className="mt-8 print:hidden" />
    </div>
  );
}
