"use client";
import { AdUnit } from "@/components/common/AdUnit";

import { useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type CalcMode = "diff" | "add" | "business";
type AddUnit = "日" | "週" | "ヶ月" | "年";
type Direction = "後" | "前";

interface DiffResult {
  type: "diff";
  startDate: Date;
  endDate: Date;
  totalDays: number;
  businessDays: number;
  weekdays: number;
  saturdays: number;
  sundays: number;
  holidays: number;
  years: number;
  months: number;
  weeks: number;
}

interface AddResult {
  type: "add";
  baseDate: Date;
  resultDate: Date;
  amount: number;
  unit: AddUnit;
  direction: Direction;
  holidayName: string;
  isWeekendDay: boolean;
  isHolidayDay: boolean;
  wareki: string;
  dayOfWeek: string;
}

interface BusinessResult {
  type: "business";
  startDate: Date;
  resultDate: Date;
  bizDays: number;
  direction: Direction;
  dayOfWeek: string;
  wareki: string;
}

// ─── Holiday Data ─────────────────────────────────────────────────────────────

const holidayList: string[] = [
  // 2024年
  "2024-01-01", "2024-01-08", "2024-02-11", "2024-02-12",
  "2024-02-23", "2024-03-20", "2024-04-29", "2024-05-03",
  "2024-05-04", "2024-05-05", "2024-05-06", "2024-07-15",
  "2024-08-11", "2024-08-12", "2024-09-16", "2024-09-22",
  "2024-09-23", "2024-10-14", "2024-11-03", "2024-11-04",
  "2024-11-23", "2024-12-23",
  // 2025年
  "2025-01-01", "2025-01-13", "2025-02-11", "2025-02-23",
  "2025-02-24", "2025-03-20", "2025-04-29", "2025-05-03",
  "2025-05-04", "2025-05-05", "2025-05-06", "2025-07-21",
  "2025-08-11", "2025-09-15", "2025-09-23", "2025-10-13",
  "2025-11-03", "2025-11-23", "2025-11-24",
  // 2026年
  "2026-01-01", "2026-01-12", "2026-02-11", "2026-02-23",
  "2026-03-20", "2026-04-29", "2026-05-03", "2026-05-04",
  "2026-05-05", "2026-05-06", "2026-07-20", "2026-08-11",
  "2026-09-21", "2026-09-22", "2026-09-23", "2026-10-12",
  "2026-11-03", "2026-11-23",
  // 2027年
  "2027-01-01", "2027-01-11", "2027-02-11", "2027-02-23",
  "2027-03-21", "2027-04-29", "2027-05-03", "2027-05-04",
  "2027-05-05", "2027-07-19", "2027-08-11", "2027-09-20",
  "2027-09-23", "2027-10-11", "2027-11-03", "2027-11-23",
];

const holidayNames: Record<string, string> = {
  "2024-01-01": "元日", "2024-01-08": "成人の日",
  "2024-02-11": "建国記念の日", "2024-02-12": "振替休日",
  "2024-02-23": "天皇誕生日", "2024-03-20": "春分の日",
  "2024-04-29": "昭和の日", "2024-05-03": "憲法記念日",
  "2024-05-04": "みどりの日", "2024-05-05": "こどもの日",
  "2024-05-06": "振替休日", "2024-07-15": "海の日",
  "2024-08-11": "山の日", "2024-08-12": "振替休日",
  "2024-09-16": "敬老の日", "2024-09-22": "振替休日",
  "2024-09-23": "秋分の日", "2024-10-14": "スポーツの日",
  "2024-11-03": "文化の日", "2024-11-04": "振替休日",
  "2024-11-23": "勤労感謝の日", "2024-12-23": "天皇誕生日（旧）",
  "2025-01-01": "元日", "2025-01-13": "成人の日",
  "2025-02-11": "建国記念の日", "2025-02-23": "天皇誕生日",
  "2025-02-24": "振替休日", "2025-03-20": "春分の日",
  "2025-04-29": "昭和の日", "2025-05-03": "憲法記念日",
  "2025-05-04": "みどりの日", "2025-05-05": "こどもの日",
  "2025-05-06": "振替休日", "2025-07-21": "海の日",
  "2025-08-11": "山の日", "2025-09-15": "敬老の日",
  "2025-09-23": "秋分の日", "2025-10-13": "スポーツの日",
  "2025-11-03": "文化の日", "2025-11-23": "勤労感謝の日",
  "2025-11-24": "振替休日",
  "2026-01-01": "元日", "2026-01-12": "成人の日",
  "2026-02-11": "建国記念の日", "2026-02-23": "天皇誕生日",
  "2026-03-20": "春分の日", "2026-04-29": "昭和の日",
  "2026-05-03": "憲法記念日", "2026-05-04": "みどりの日",
  "2026-05-05": "こどもの日", "2026-05-06": "振替休日",
  "2026-07-20": "海の日", "2026-08-11": "山の日",
  "2026-09-21": "敬老の日", "2026-09-22": "国民の休日",
  "2026-09-23": "秋分の日", "2026-10-12": "スポーツの日",
  "2026-11-03": "文化の日", "2026-11-23": "勤労感謝の日",
  "2027-01-01": "元日", "2027-01-11": "成人の日",
  "2027-02-11": "建国記念の日", "2027-02-23": "天皇誕生日",
  "2027-03-21": "春分の日", "2027-04-29": "昭和の日",
  "2027-05-03": "憲法記念日", "2027-05-04": "みどりの日",
  "2027-05-05": "こどもの日", "2027-07-19": "海の日",
  "2027-08-11": "山の日", "2027-09-20": "敬老の日",
  "2027-09-23": "秋分の日", "2027-10-11": "スポーツの日",
  "2027-11-03": "文化の日", "2027-11-23": "勤労感謝の日",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

function isHolidayDate(d: Date): boolean {
  return holidayList.includes(toDateStr(d));
}

function isWeekend(d: Date): boolean {
  return d.getDay() === 0 || d.getDay() === 6;
}

function isBusinessDay(d: Date): boolean {
  return !isWeekend(d) && !isHolidayDate(d);
}

function toWareki(d: Date): string {
  const y = d.getFullYear();
  if (y >= 2019) {
    const w = y - 2018;
    return "令和" + (w === 1 ? "元" : w) + "年";
  }
  if (y >= 1989) {
    const w = y - 1988;
    return "平成" + (w === 1 ? "元" : w) + "年";
  }
  if (y >= 1926) {
    const w = y - 1925;
    return "昭和" + (w === 1 ? "元" : w) + "年";
  }
  return y + "年";
}

const DOW_LABELS = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];

function toDayOfWeek(d: Date): string {
  return DOW_LABELS[d.getDay()];
}

function getHolidayName(d: Date): string {
  return holidayNames[toDateStr(d)] || "";
}

function formatDateJP(d: Date): string {
  return d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
}

function todayStr(): string {
  return toDateStr(new Date());
}

function parseDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s + "T00:00:00");
  if (isNaN(d.getTime())) return null;
  return d;
}

function calcDiff(start: Date, end: Date): DiffResult {
  const s = start <= end ? start : end;
  const e = start <= end ? end : start;
  const totalDays = Math.round((e.getTime() - s.getTime()) / 86400000);

  let saturdays = 0, sundays = 0, holidays = 0, businessDays = 0, weekdays = 0;
  const cur = new Date(s);
  while (cur < e) {
    const dow = cur.getDay();
    const h = isHolidayDate(cur);
    if (dow === 6) saturdays++;
    else if (dow === 0) sundays++;
    else if (h) holidays++;
    else businessDays++;
    if (dow !== 0 && dow !== 6) weekdays++;
    cur.setDate(cur.getDate() + 1);
  }

  return {
    type: "diff",
    startDate: s,
    endDate: e,
    totalDays,
    businessDays,
    weekdays,
    saturdays,
    sundays,
    holidays,
    years: Math.floor(totalDays / 365),
    months: Math.floor(totalDays / 30),
    weeks: Math.floor(totalDays / 7),
  };
}

function calcAdd(base: Date, amount: number, unit: AddUnit, direction: Direction, businessOnly: boolean): AddResult {
  const resultDate = new Date(base);
  const sign = direction === "後" ? 1 : -1;

  if (businessOnly && unit === "日") {
    let count = 0;
    while (count < amount) {
      resultDate.setDate(resultDate.getDate() + sign);
      if (isBusinessDay(resultDate)) count++;
    }
  } else if (unit === "日") {
    resultDate.setDate(resultDate.getDate() + sign * amount);
  } else if (unit === "週") {
    resultDate.setDate(resultDate.getDate() + sign * amount * 7);
  } else if (unit === "ヶ月") {
    resultDate.setMonth(resultDate.getMonth() + sign * amount);
  } else if (unit === "年") {
    resultDate.setFullYear(resultDate.getFullYear() + sign * amount);
  }

  return {
    type: "add",
    baseDate: base,
    resultDate,
    amount,
    unit,
    direction,
    holidayName: getHolidayName(resultDate),
    isWeekendDay: isWeekend(resultDate),
    isHolidayDay: isHolidayDate(resultDate),
    wareki: toWareki(resultDate),
    dayOfWeek: toDayOfWeek(resultDate),
  };
}

function calcBusiness(start: Date, bizDays: number, direction: Direction): BusinessResult {
  const resultDate = new Date(start);
  const sign = direction === "後" ? 1 : -1;
  let count = 0;
  while (count < bizDays) {
    resultDate.setDate(resultDate.getDate() + sign);
    if (isBusinessDay(resultDate)) count++;
  }
  return {
    type: "business",
    startDate: start,
    resultDate,
    bizDays,
    direction,
    dayOfWeek: toDayOfWeek(resultDate),
    wareki: toWareki(resultDate),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DateCalculatorPage() {
  const today = todayStr();

  const [mode, setMode] = useState<CalcMode>("diff");

  // Mode 1
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [businessOnlyDiff, setBusinessOnlyDiff] = useState(false);

  // Mode 2
  const [baseDate, setBaseDate] = useState(today);
  const [addAmount, setAddAmount] = useState("30");
  const [addUnit, setAddUnit] = useState<AddUnit>("日");
  const [addDirection, setAddDirection] = useState<Direction>("後");
  const [businessOnlyAdd, setBusinessOnlyAdd] = useState(false);

  // Mode 3
  const [bizStart, setBizStart] = useState(today);
  const [bizDays, setBizDays] = useState("3");
  const [bizDirection, setBizDirection] = useState<Direction>("後");

  const [result, setResult] = useState<DiffResult | AddResult | BusinessResult | null>(null);
  const [error, setError] = useState("");

  function handleCalc() {
    setError("");
    if (mode === "diff") {
      const s = parseDate(startDate);
      const e = parseDate(endDate);
      if (!s) { setError("開始日を入力してください"); return; }
      if (!e) { setError("終了日を入力してください"); return; }
      setResult(calcDiff(s, e));
    } else if (mode === "add") {
      const b = parseDate(baseDate);
      if (!b) { setError("基準日を入力してください"); return; }
      const amt = parseInt(addAmount);
      if (isNaN(amt) || amt <= 0) { setError("正の整数を入力してください"); return; }
      if (amt > 10000) { setError("日数は10000以下で入力してください"); return; }
      setResult(calcAdd(b, amt, addUnit, addDirection, businessOnlyAdd));
    } else {
      const s = parseDate(bizStart);
      if (!s) { setError("開始日を入力してください"); return; }
      const days = parseInt(bizDays);
      if (isNaN(days) || days <= 0) { setError("正の整数を入力してください"); return; }
      if (days > 1000) { setError("営業日数は1000以下で入力してください"); return; }
      setResult(calcBusiness(s, days, bizDirection));
    }
    setTimeout(() => {
      document.getElementById("date-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function switchMode(m: CalcMode) {
    setMode(m);
    setResult(null);
    setError("");
  }

  function applyShortcut(key: string) {
    setError("");
    const t = new Date();
    const ts = todayStr();
    if (key === "100days") {
      const b = new Date(ts + "T00:00:00");
      setMode("add"); setBaseDate(ts); setAddAmount("100"); setAddUnit("日"); setAddDirection("後"); setBusinessOnlyAdd(false);
      setResult(calcAdd(b, 100, "日", "後", false));
    } else if (key === "1year") {
      const b = new Date(ts + "T00:00:00");
      setMode("add"); setBaseDate(ts); setAddAmount("1"); setAddUnit("年"); setAddDirection("後"); setBusinessOnlyAdd(false);
      setResult(calcAdd(b, 1, "年", "後", false));
    } else if (key === "30biz") {
      const s = new Date(ts + "T00:00:00");
      setMode("business"); setBizStart(ts); setBizDays("30"); setBizDirection("後");
      setResult(calcBusiness(s, 30, "後"));
    } else if (key === "monthend") {
      const lastDay = new Date(t.getFullYear(), t.getMonth() + 1, 0);
      const s = new Date(ts + "T00:00:00");
      setMode("diff"); setStartDate(ts); setEndDate(toDateStr(lastDay)); setBusinessOnlyDiff(false);
      setResult(calcDiff(s, lastDay));
    } else if (key === "yearend") {
      const yearEndStr = t.getFullYear() + "-12-31";
      const s = new Date(ts + "T00:00:00");
      const ye = new Date(yearEndStr + "T00:00:00");
      setMode("diff"); setStartDate(ts); setEndDate(yearEndStr); setBusinessOnlyDiff(false);
      setResult(calcDiff(s, ye));
    }
    setTimeout(() => {
      document.getElementById("date-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  const modes: { key: CalcMode; label: string }[] = [
    { key: "diff", label: "日数差計算" },
    { key: "add", label: "日付加減算" },
    { key: "business", label: "営業日計算" },
  ];

  const shortcuts = [
    { label: "今日から100日後", key: "100days" },
    { label: "今日から1年後", key: "1year" },
    { label: "今日から30営業日後", key: "30biz" },
    { label: "今月末まで", key: "monthend" },
    { label: "年末まで", key: "yearend" },
  ];

  const faqItems = [
    {
      q: "「3営業日以内」とは何日以内ですか？",
      a: "申込日の翌日から土日祝日を除いてカウントします。例えば月曜日に申し込んだ場合、火曜・水曜・木曜の3営業日後は木曜日が期限です。祝日が挟まる場合はその分だけ後ろにずれます。本ツールの営業日計算機能で正確な日付を確認できます。",
    },
    {
      q: "うるう年の計算はどうなりますか？",
      a: "本ツールは自動的にうるう年を考慮して計算します。うるう年は4年に1度（西暦年が4で割り切れる年）ですが、100で割り切れる年はうるう年ではなく、400で割り切れる年は例外的にうるう年になります（例：2000年はうるう年、1900年はうるう年ではない）。",
    },
    {
      q: "契約期間「3年間」の満了日はいつですか？",
      a: "「3年間」の計算方法は契約書の表記によります。一般的に契約開始日が2024年4月1日の場合、3年後の満了日は2027年3月31日（前日が満了日）となります。本ツールで開始日に3年を加算して計算できます。",
    },
    {
      q: "「翌月末日」はどうやって計算しますか？",
      a: "例えば1月15日の「翌月末日」は2月28日（うるう年なら29日）です。本ツールでは日数加算モードで「1ヶ月後」を計算し、その月の末日を確認できます。なお2月末日は年によって28日か29日が変わります。",
    },
    {
      q: "日本の祝日はどうやって計算していますか？",
      a: "本ツールには2024〜2027年の日本の祝日データが組み込まれています。国民の祝日・振替休日を含めて正確に計算します。それ以降の年については祝日を含まない計算になる場合があります。",
    },
  ];

  const relatedTools = [
    { href: "/utility/age-calculator", label: "年齢計算機", desc: "生年月日から年齢・和暦を計算" },
    { href: "/health/pregnancy-calculator", label: "妊娠週数・出産予定日計算機", desc: "妊娠期間・出産予定日を計算" },
    { href: "/utility/hourly-to-annual", label: "時給→年収換算ツール", desc: "時給から年収・月収を計算" },
    { href: "/utility/discount-calculator", label: "割引・値引き計算機", desc: "割引後の金額を計算" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-2 flex flex-wrap gap-1">
            <Link href="/" className="hover:text-ai">ホーム</Link>
            <span>/</span>
            <Link href="/utility" className="hover:text-ai">日常生活・便利ツール</Link>
            <span>/</span>
            <span className="text-gray-900">日付・日数計算機</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">日付・日数 計算機</h1>
          <p className="text-sm text-gray-600 mt-1">営業日計算・祝日対応・和暦表示 | 2024〜2027年日本祝日対応</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <AdUnit slot="date-calculator-top" className="mb-6" />

        {/* Mode tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-4">
          <div className="flex gap-2">
            {modes.map((m) => (
              <button
                key={m.key}
                onClick={() => switchMode(m.key)}
                className={"flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors " + (mode === m.key ? "bg-kon text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          {mode === "diff" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">2つの日付の間の日数を計算します</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">開始日</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-kon focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">終了日</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-kon focus:border-transparent"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={businessOnlyDiff}
                  onChange={(e) => setBusinessOnlyDiff(e.target.checked)}
                  className="w-4 h-4 text-kon rounded"
                />
                <span>営業日のみカウント（土日・祝日を除く）</span>
              </label>
            </div>
          )}

          {mode === "add" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">日付に日数・月数・年数を足す/引く</p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">基準日</label>
                <input
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-kon focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 items-end flex-wrap">
                <div className="flex-1 min-w-24">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">数値</label>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    min="1"
                    max="10000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-kon focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">単位</label>
                  <select
                    value={addUnit}
                    onChange={(e) => setAddUnit(e.target.value as AddUnit)}
                    className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-kon focus:border-transparent bg-white"
                  >
                    <option>日</option>
                    <option>週</option>
                    <option>ヶ月</option>
                    <option>年</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">方向</label>
                  <div className="flex rounded-lg overflow-hidden border border-gray-300">
                    {(["後", "前"] as Direction[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setAddDirection(d)}
                        className={"px-5 py-2.5 text-sm font-semibold " + (addDirection === d ? "bg-kon text-white" : "bg-white text-gray-600 hover:bg-gray-50")}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <label className={"flex items-center gap-2 text-sm cursor-pointer " + (addUnit !== "日" ? "opacity-40" : "text-gray-700")}>
                <input
                  type="checkbox"
                  checked={businessOnlyAdd}
                  onChange={(e) => setBusinessOnlyAdd(e.target.checked)}
                  disabled={addUnit !== "日"}
                  className="w-4 h-4 text-kon rounded"
                />
                <span>営業日で計算（土日・祝日を除く）※日単位のみ</span>
              </label>
            </div>
          )}

          {mode === "business" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">X営業日後/前の日付を計算します（土日・祝日を除く）</p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">開始日</label>
                <input
                  type="date"
                  value={bizStart}
                  onChange={(e) => setBizStart(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-kon focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 items-end flex-wrap">
                <div className="flex-1 min-w-24">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">営業日数</label>
                  <input
                    type="number"
                    value={bizDays}
                    onChange={(e) => setBizDays(e.target.value)}
                    min="1"
                    max="1000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-kon focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">方向</label>
                  <div className="flex rounded-lg overflow-hidden border border-gray-300">
                    {(["後", "前"] as Direction[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setBizDirection(d)}
                        className={"px-5 py-2.5 text-sm font-semibold " + (bizDirection === d ? "bg-kon text-white" : "bg-white text-gray-600 hover:bg-gray-50")}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-3 text-sm text-danger bg-gray-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            onClick={handleCalc}
            className="mt-5 w-full bg-kon hover:bg-ai text-white font-bold py-3.5 rounded-xl text-base transition-colors"
          >
            計算する
          </button>
        </div>

        {/* Shortcut buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">よく使う計算例ショートカット</p>
          <div className="flex flex-wrap gap-2">
            {shortcuts.map((s) => (
              <button
                key={s.key}
                onClick={() => applyShortcut(s.key)}
                className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full hover:bg-indigo-100 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div id="date-result" className="space-y-4 mb-4 scroll-mt-4">
            {result.type === "diff" && (
              <>
                <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-6">
                  <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-indigo-500 font-semibold mb-1">開始日</p>
                      <p className="font-bold text-gray-900">{formatDateJP(result.startDate)}</p>
                      <p className="text-xs text-gray-500">{toWareki(result.startDate)}　{toDayOfWeek(result.startDate)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-indigo-500 font-semibold mb-1">終了日</p>
                      <p className="font-bold text-gray-900">{formatDateJP(result.endDate)}</p>
                      <p className="text-xs text-gray-500">{toWareki(result.endDate)}　{toDayOfWeek(result.endDate)}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-indigo-500 font-semibold mb-1">総日数</p>
                    <div className="text-6xl font-bold text-indigo-700">{result.totalDays}</div>
                    <div className="text-xl font-bold text-indigo-600 mb-3">日</div>
                    <div className="text-sm text-indigo-500 space-y-0.5">
                      {result.years > 0 && (
                        <div>約{result.years}年{(result.months % 12) > 0 ? (result.months % 12) + "ヶ月" : ""}</div>
                      )}
                      <div>約{result.weeks}週間</div>
                    </div>
                  </div>
                  {businessOnlyDiff && (
                    <div className="mt-5 pt-5 border-t border-indigo-200 text-center">
                      <p className="text-xs text-kon font-semibold mb-1">営業日数</p>
                      <div className="text-4xl font-bold text-kon">{result.businessDays}</div>
                      <div className="text-base font-bold text-kon mb-1">営業日</div>
                      <p className="text-xs text-gray-500">うち土日: {result.saturdays + result.sundays}日、祝日（平日）: {result.holidays}日</p>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">期間中の内訳</h3>
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                      {[
                        ["平日（月〜金）", result.weekdays + "日"],
                        ["土曜日", result.saturdays + "日"],
                        ["日曜日", result.sundays + "日"],
                        ["祝日（平日）", result.holidays + "日"],
                        ["営業日合計", result.businessDays + "日"],
                      ].map(([label, val]) => (
                        <tr key={label}>
                          <td className="py-2 text-gray-600">{label}</td>
                          <td className="py-2 text-right font-semibold text-gray-900">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {result.type === "add" && (
              <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-6">
                <div className="mb-4 text-sm">
                  <span className="text-indigo-500 font-semibold">基準日：</span>
                  <span className="font-bold text-gray-900 ml-1">{formatDateJP(result.baseDate)}</span>
                </div>
                <div className="text-sm text-indigo-500 font-semibold mb-2">
                  {result.amount}{result.unit}{result.direction}
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-700 mb-2">{formatDateJP(result.resultDate)}</div>
                  <div className="text-sm text-gray-600 mb-3">{result.wareki}　{result.dayOfWeek}</div>
                  {result.holidayName ? (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gray-50 text-danger">
                      祝日「{result.holidayName}」
                    </span>
                  ) : result.isWeekendDay ? (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gray-50 text-kon">
                      {result.dayOfWeek}（休日）
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                      平日（営業日）
                    </span>
                  )}
                </div>
              </div>
            )}

            {result.type === "business" && (
              <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-6">
                <div className="mb-4 text-sm">
                  <span className="text-indigo-500 font-semibold">開始日：</span>
                  <span className="font-bold text-gray-900 ml-1">{formatDateJP(result.startDate)}</span>
                </div>
                <div className="text-sm text-indigo-500 font-semibold mb-2">
                  {result.bizDays}営業日{result.direction}
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-700 mb-2">{formatDateJP(result.resultDate)}</div>
                  <div className="text-sm text-gray-600 mb-3">{result.wareki}　{result.dayOfWeek}</div>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                    営業日
                  </span>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => setResult(null)}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                リセット
              </button>
            </div>
          </div>
        )}

        <AdUnit slot="date-calculator-mid" className="mb-6" />

        {/* SEO: 早見表 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">よく使う日数計算の早見表</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">期間</th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700">日数</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ["1週間", "7日"],
                  ["2週間", "14日"],
                  ["1ヶ月（30日）", "30日"],
                  ["3ヶ月", "約91日"],
                  ["半年", "約182日"],
                  ["1年", "365日（うるう年366日）"],
                  ["100日", "約3ヶ月9日"],
                ].map(([period, days]) => (
                  <tr key={period}>
                    <td className="py-2 px-3 text-gray-700">{period}</td>
                    <td className="py-2 px-3 text-right font-semibold text-gray-900">{days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SEO: 基礎知識 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">日付計算の基礎知識</h2>
          <div className="space-y-5 text-sm text-gray-700">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">ビジネスでよく使う日数計算</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>契約期間の計算（例：3年契約の満了日）</li>
                <li>納期・期限の設定（例：発注から30営業日後）</li>
                <li>試用期間の終了日（例：入社から3ヶ月後）</li>
                <li>手形・小切手の決済日</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">法律・手続きで使う日数計算</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>不動産の引き渡し期限</li>
                <li>申告期限（確定申告は3月15日まで）</li>
                <li>時効の計算（消費者金融は5年等）</li>
                <li>育児休業・産休期間の計算</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">日常生活でよく使う計算</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>記念日・イベントまでのカウントダウン</li>
                <li>旅行・出張の日程計算</li>
                <li>妊娠週数の計算</li>
                <li>薬の服用期間の管理</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">営業日（ビジネスデー）について</h3>
              <p className="text-gray-600">
                営業日とは土曜・日曜・祝日を除いた平日のことです。「〇営業日以内」という表現は、土日祝日をカウントしない日数で計算します。例：月曜日に申し込んで「3営業日後」なら木曜日が目安です。
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-5">
            {faqItems.map((item) => (
              <div key={item.q}>
                <p className="font-semibold text-gray-900 mb-1">Q. {item.q}</p>
                <p className="text-sm text-gray-600">A. {item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related tools */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">あわせて使えるツール</h2>
          <div className="grid grid-cols-2 gap-3">
            {relatedTools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="block p-3 border border-gray-200 rounded-lg hover:border-ai hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm font-semibold text-kon">{t.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
