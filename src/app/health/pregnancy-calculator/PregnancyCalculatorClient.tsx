"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import Link from "next/link";
import { IntroSection } from "@/components/IntroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { FAQSection } from "@/components/FAQSection";
import { CitationsSection } from "@/components/CitationsSection";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Milestone {
  label: string;
  week: string;
  date: Date;
  emoji?: string;
}

interface Checkup {
  num: number;
  week: number;
  date: Date;
  description: string;
}

interface CalcResult {
  dueDate: Date;
  lmpDate: Date;
  currentWeek: number;
  currentDay: number;
  daysUntilDue: number;
  trimester: 1 | 2 | 3;
  trimesterLabel: string;
  progressPct: number;
  milestones: Milestone[];
  checkups: Checkup[];
  weekAdvice: string;
  isPast: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${days[date.getDay()]}）`;
}

function formatDateShort(date: Date): string {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

// ─── Calculation ──────────────────────────────────────────────────────────────

function getWeekAdvice(week: number): string {
  if (week <= 4) return "妊娠超初期です。葉酸サプリの摂取を始めましょう。";
  if (week <= 8) return "つわりが始まる時期です。無理せず休息を取りましょう。";
  if (week <= 13) return "母子手帳を取得する時期です。産婦人科での初診を済ませましょう。";
  if (week <= 19) return "安定期に入りました。マタニティ運動を始めても良い時期です。";
  if (week <= 27) return "胎動を感じ始める時期です。性別確認の超音波検査も受けられます。";
  if (week <= 35) return "後期に入りました。出産準備を始める時期です。";
  if (week <= 39) return "正産期です。いつ産まれてもおかしくありません。入院バッグの準備を。";
  return "出産予定日を過ぎています。担当医の指示に従いましょう。";
}

function calculate(
  calcMethod: "lmp" | "ovulation",
  dateStr: string,
  cycleLength: number
): CalcResult {
  const inputDate = new Date(dateStr);
  inputDate.setHours(0, 0, 0, 0);

  let lmpDate: Date;
  let dueDate: Date;

  if (calcMethod === "lmp") {
    lmpDate = inputDate;
    dueDate = addDays(lmpDate, 280 + (cycleLength - 28));
  } else {
    lmpDate = addDays(inputDate, -14);
    dueDate = addDays(inputDate, 266);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPast = lmpDate <= today;

  const daysSinceLmp = Math.floor((today.getTime() - lmpDate.getTime()) / 86400000);
  const currentWeek = isPast ? Math.floor(daysSinceLmp / 7) : 0;
  const currentDay = isPast ? daysSinceLmp % 7 : 0;

  const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / 86400000);

  const totalDays = Math.floor((today.getTime() - lmpDate.getTime()) / 86400000);
  const progressPct = isPast ? Math.min(100, Math.max(0, (totalDays / 280) * 100)) : 0;

  let trimester: 1 | 2 | 3;
  let trimesterLabel: string;
  if (currentWeek < 14) { trimester = 1; trimesterLabel = "第1三半期（初期）"; }
  else if (currentWeek < 28) { trimester = 2; trimesterLabel = "第2三半期（中期）"; }
  else { trimester = 3; trimesterLabel = "第3三半期（後期）"; }

  const milestones: Milestone[] = [
    { label: "心拍確認", week: "妊娠6週頃", date: addDays(lmpDate, 42) },
    { label: "母子手帳交付目安", week: "妊娠10週頃", date: addDays(lmpDate, 70) },
    { label: "初期スクリーニング", week: "妊娠12〜14週", date: addDays(lmpDate, 84) },
    { label: "安定期入り", week: "妊娠14週", date: addDays(lmpDate, 98), emoji: "🎉" },
    { label: "性別確認可能時期", week: "妊娠20週頃", date: addDays(lmpDate, 140) },
    { label: "後期入り", week: "妊娠28週", date: addDays(lmpDate, 196) },
    { label: "正産期入り", week: "妊娠37週", date: addDays(lmpDate, 259) },
    { label: "出産予定日", week: "妊娠40週", date: dueDate, emoji: "⭐" },
  ];

  const checkupData: { week: number; desc: string }[] = [
    { week: 10, desc: "超音波・血液検査・尿検査" },
    { week: 14, desc: "超音波・体重・血圧測定" },
    { week: 18, desc: "超音波・血圧・尿検査" },
    { week: 22, desc: "超音波・体重・血圧測定" },
    { week: 26, desc: "超音波・血液検査・尿検査" },
    { week: 30, desc: "超音波・体重・血圧測定" },
    { week: 32, desc: "超音波・NST（胎児心拍）" },
    { week: 34, desc: "超音波・血液検査・内診" },
    { week: 36, desc: "超音波・GBS検査・内診" },
    { week: 37, desc: "超音波・体重・内診" },
    { week: 38, desc: "超音波・NST・内診" },
    { week: 39, desc: "超音波・NST・内診" },
    { week: 40, desc: "超音波・NST・内診（出産予定日）" },
  ];

  const checkups: Checkup[] = checkupData.map((c, i) => ({
    num: i + 1,
    week: c.week,
    date: addDays(lmpDate, c.week * 7),
    description: c.desc,
  }));

  const weekAdvice = getWeekAdvice(currentWeek);

  return {
    dueDate,
    lmpDate,
    currentWeek,
    currentDay,
    daysUntilDue,
    trimester,
    trimesterLabel,
    progressPct,
    milestones,
    checkups,
    weekAdvice,
    isPast,
  };
}

// ─── SEO Data ─────────────────────────────────────────────────────────────────

const DUE_DATE_TABLE = [
  { lmp: "2025年1月1日", due: "2025年10月8日" },
  { lmp: "2025年2月1日", due: "2025年11月8日" },
  { lmp: "2025年3月1日", due: "2025年12月6日" },
  { lmp: "2025年4月1日", due: "2026年1月6日" },
  { lmp: "2025年5月1日", due: "2026年2月5日" },
  { lmp: "2025年6月1日", due: "2026年3月8日" },
  { lmp: "2025年7月1日", due: "2026年4月7日" },
  { lmp: "2025年8月1日", due: "2026年5月8日" },
  { lmp: "2025年9月1日", due: "2026年6月8日" },
  { lmp: "2025年10月1日", due: "2026年7月8日" },
  { lmp: "2025年11月1日", due: "2026年8月8日" },
  { lmp: "2025年12月1日", due: "2026年9月7日" },
];

const FAQ = [
  {
    q: "出産予定日は必ず正確ですか？",
    a: "出産予定日はあくまで目安です。実際には予定日±2週間（37〜42週）の「正産期」に生まれることが多く、予定日通りに生まれる確率は約5%程度とされています。産婦人科での超音波検査により、より正確な出産予定日が算出されます。",
  },
  {
    q: "妊娠週数と胎児の大きさはどのくらいですか？",
    a: "妊娠10週：約3cm（いちご大）、妊娠20週：約25cm（バナナ大）、妊娠30週：約40cm・約1.5kg、妊娠40週：約50cm・約3kg が目安です。ただし個人差が大きく、超音波検査での確認が最も正確です。",
  },
  {
    q: "安定期とはいつですか？",
    a: "妊娠14週以降（第2三半期）を「安定期」と呼びます。胎盤が完成し、流産リスクが大幅に下がります。つわりが和らぐ方も多く、比較的体調が安定する時期です。ただし「安定期だから何でもOK」ということはなく、引き続き無理は禁物です。",
  },
  {
    q: "妊娠初期に葉酸が必要な理由は何ですか？",
    a: "葉酸は胎児の神経管（脳・脊髄の元になる組織）の正常な発達に必要な栄養素です。神経管は妊娠超初期（妊娠4〜6週）に形成されるため、妊娠が分かる前から摂取することが推奨されています。厚生労働省は妊娠を計画している女性に1日400μgの葉酸摂取を推奨しています。",
  },
  {
    q: "妊婦健診は何回受けるのが一般的ですか？",
    a: "一般的に妊娠期間全体で14回程度の健診が推奨されています。〜23週は4週に1回、24〜35週は2週に1回、36週以降は毎週1回が目安です。多くの自治体で14回分の健診費用補助があります。",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PregnancyCalculatorPage() {
  const [calcMethod, setCalcMethod] = useState<"lmp" | "ovulation">("lmp");
  const [dateStr, setDateStr] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState("");

  function handleCalculate() {
    setError("");
    if (!dateStr) {
      setError("日付を入力してください。");
      return;
    }
    const inputDate = new Date(dateStr);
    if (isNaN(inputDate.getTime())) {
      setError("有効な日付を入力してください。");
      return;
    }
    const today = new Date();
    const diffDays = (today.getTime() - inputDate.getTime()) / 86400000;
    if (diffDays < -310) {
      setError("日付が未来すぎます。正しい日付を入力してください。");
      return;
    }
    if (diffDays > 310) {
      setError("日付が古すぎます。正しい日付を入力してください。");
      return;
    }
    const cycle = parseInt(cycleLength, 10) || 28;
    setResult(calculate(calcMethod, dateStr, cycle));
  }

  const trimesterColors = {
    1: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700", bar: "bg-blue-500" },
    2: { bg: "bg-green-50", border: "border-green-300", text: "text-green-700", bar: "bg-green-500" },
    3: { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-700", bar: "bg-orange-500" },
  };
  const tc = result ? trimesterColors[result.trimester] : trimesterColors[1];

  const faqItems = [
    { question: "出産予定日は必ず正確ですか？", answer: "出産予定日はあくまで目安です。実際には予定日±2週間（37〜42週）の正産期に生まれることが多く、予定日通りに生まれる確率は約5%程度です。産婦人科での超音波検査により、より正確な出産予定日が算出されます。" },
    { question: "安定期とはいつですか？", answer: "妊娠14週以降（第2三半期）を安定期と呼びます。胎盤が完成し流産リスクが大幅に下がります。つわりが和らぐ方も多く比較的体調が安定する時期です。" },
    { question: "妊娠初期に葉酸が必要な理由は何ですか？", answer: "葉酸は胎児の神経管の正常な発達に必要な栄養素です。神経管は妊娠4〜6週に形成されるため妊娠が分かる前から摂取することが推奨されています。厚生労働省は1日400μgの葉酸摂取を推奨しています。" },
    { question: "妊娠週数と胎児の大きさはどのくらいですか？", answer: "妊娠10週：約3cm、妊娠20週：約25cm、妊娠30週：約40cm・約1.5kg、妊娠40週：約50cm・約3kgが目安です。個人差が大きく超音波検査での確認が最も正確です。" },
    { question: "妊婦健診は何回受けるのが一般的ですか？", answer: "妊娠期間全体で14回程度が推奨されています。〜23週は4週に1回、24〜35週は2週に1回、36週以降は毎週1回が目安です。多くの自治体で14回分の費用補助があります。" },
  ];

  const useCases = [
    { icon: "🤰", persona: "妊娠がわかったばかりの方", title: "出産予定日と今の妊娠週数を知りたい", benefit: "最終月経日から正確な出産予定日を自動計算" },
    { icon: "📅", persona: "健診スケジュールを把握したい方", title: "いつ何回病院に行けばいいか確認したい", benefit: "妊娠週数別の推奨健診スケジュールを一覧表示" },
    { icon: "👶", persona: "赤ちゃんの成長が気になる方", title: "今の週数で赤ちゃんはどのくらいの大きさ?", benefit: "週数に応じた胎児の発育目安を確認" },
  ];


  const citations = [
    { name: "公益社団法人 日本産科婦人科学会", url: "https://www.jsog.or.jp/", description: "妊娠週数・出産予定日の計算方法の根拠" },
    { name: "厚生労働省「妊娠中の食生活について」", url: "https://www.mhlw.go.jp/seisakunitsuite/bunya/kodomo/kodomo_kosodate/boshi-hoken/junyou-03.html", description: "妊婦の健康管理・健診スケジュールの根拠" },
  ];

  return (
    <>
      <IntroSection title="妊娠週数・出産予定日計算機" paragraphs={["最終月経日または排卵日・受精日から妊娠週数・出産予定日を計算します。安定期（妊娠5ヶ月）の開始日や各マイルストーンも一覧で確認できます。", "妊婦健診のスケジュール（初診〜36週以降の週1回まで）と、各週での胎児の大きさ・発育の目安も表示します。", "登録不要・完全無料。妊娠中の方が健診計画を立てたり、妊娠週数を把握するのに役立ちます。"]} />
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-3 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-xs text-gray-500 mb-1">
            <Link href="/" className="hover:text-pink-600">ホーム</Link>
            <span className="mx-1">/</span>
            <Link href="/health" className="hover:text-pink-600">健康・ウェルネス</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-700">妊娠週数・出産予定日 計算機</span>
          </nav>
          <h1 className="text-xl font-bold text-gray-900">
            妊娠週数・出産予定日 計算機
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            最終月経日または排卵日から出産予定日・健診スケジュール・マイルストーンを計算
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <AdUnit slot="pregnancy-calculator-top" className="mb-4" />

        {/* ─── Form ─────────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">計算方法を選択</h2>

          {/* Toggle */}
          <div className="flex rounded-lg border border-gray-300 overflow-hidden mb-5">
            <button
              onClick={() => { setCalcMethod("lmp"); setResult(null); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                calcMethod === "lmp"
                  ? "bg-pink-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              最終月経日から計算（一般的）
            </button>
            <button
              onClick={() => { setCalcMethod("ovulation"); setResult(null); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors border-l border-gray-300 ${
                calcMethod === "ovulation"
                  ? "bg-pink-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              排卵日・受精日から計算
            </button>
          </div>

          {/* Date input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {calcMethod === "lmp" ? "最終月経開始日" : "排卵日（受精日）"}
            </label>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>

          {/* Cycle length (LMP only) */}
          {calcMethod === "lmp" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                月経周期
              </label>
              <select
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white"
              >
                <option value="25">25日</option>
                <option value="28">28日（標準）</option>
                <option value="30">30日</option>
                <option value="32">32日</option>
                <option value="35">35日</option>
              </select>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 mb-3">{error}</p>
          )}

          <button
            onClick={handleCalculate}
            className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg transition-colors text-sm"
          >
            計算する
          </button>
        </section>

        {/* ─── Results ──────────────────────────────────────────────────────── */}
        {result && (
          <>
            {/* Section 1: Main result */}
            <section className={`bg-white rounded-xl shadow-sm border ${tc.border} p-6`}>
              <div className="text-center mb-5">
                <p className="text-sm text-gray-500 mb-1">出産予定日</p>
                <p className="text-2xl font-bold text-gray-900">{formatDate(result.dueDate)}</p>
                {result.isPast && result.daysUntilDue > 0 && (
                  <p className="text-sm text-gray-500 mt-1">あと <span className="font-bold text-pink-600">{result.daysUntilDue}日</span></p>
                )}
                {result.isPast && result.daysUntilDue <= 0 && (
                  <p className="text-sm text-orange-600 font-medium mt-1">出産予定日を過ぎています</p>
                )}
              </div>

              {result.isPast && (
                <div className={`${tc.bg} rounded-lg p-4 mb-5 text-center`}>
                  <p className="text-sm text-gray-600 mb-0.5">現在の妊娠週数</p>
                  <p className={`text-3xl font-bold ${tc.text}`}>
                    妊娠{result.currentWeek}週{result.currentDay}日
                  </p>
                  <p className={`text-sm font-medium ${tc.text} mt-1`}>{result.trimesterLabel}</p>
                </div>
              )}

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>0週</span>
                  <span className="font-medium text-gray-700">妊娠の進行状況</span>
                  <span>40週</span>
                </div>
                <div className="relative h-5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${tc.bar} rounded-full transition-all`}
                    style={{ width: `${result.isPast ? result.progressPct : 0}%` }}
                  />
                  <div className="absolute inset-0 flex pointer-events-none">
                    <div style={{ width: "35%" }} className="border-r-2 border-white/60" />
                    <div style={{ width: "35%" }} className="border-r-2 border-white/60" />
                  </div>
                </div>
                <div className="flex text-xs text-gray-400 mt-0.5">
                  <span>初期</span>
                  <span className="ml-auto mr-auto" style={{ marginLeft: "27%" }}>中期</span>
                  <span>後期</span>
                </div>
              </div>
            </section>

            {/* Section 2: Milestone calendar */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-3">重要日程カレンダー</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 pr-3 font-medium text-gray-600">マイルストーン</th>
                      <th className="text-left py-2 pr-3 font-medium text-gray-600">時期</th>
                      <th className="text-left py-2 font-medium text-gray-600">予定日</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.milestones.map((m, i) => {
                      const isPassed = m.date <= new Date() && result.isPast;
                      return (
                        <tr key={i} className={`border-b border-gray-100 ${isPassed ? "opacity-50" : ""}`}>
                          <td className="py-2 pr-3 font-medium text-gray-800">
                            {m.emoji && <span className="mr-1">{m.emoji}</span>}
                            {m.label}
                          </td>
                          <td className="py-2 pr-3 text-gray-500 text-xs">{m.week}</td>
                          <td className="py-2 text-gray-700">{formatDateShort(m.date)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 3: Checkup schedule */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-1">妊婦健診スケジュール目安</h2>
              <p className="text-xs text-gray-500 mb-3">自治体・産婦人科により異なります</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 pr-2 font-medium text-gray-600">回</th>
                      <th className="text-left py-2 pr-2 font-medium text-gray-600">週数</th>
                      <th className="text-left py-2 pr-2 font-medium text-gray-600">予定日</th>
                      <th className="text-left py-2 font-medium text-gray-600">主な検査内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.checkups.map((c) => {
                      const isPassed = c.date <= new Date() && result.isPast;
                      return (
                        <tr key={c.num} className={`border-b border-gray-100 ${isPassed ? "opacity-40" : ""}`}>
                          <td className="py-1.5 pr-2 text-gray-500">第{c.num}回</td>
                          <td className="py-1.5 pr-2 text-gray-700 font-medium">{c.week}週頃</td>
                          <td className="py-1.5 pr-2 text-gray-700">{formatDateShort(c.date)}</td>
                          <td className="py-1.5 text-gray-500 text-xs">{c.description}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 4: Week advice */}
            {result.isPast && (
              <section className="bg-pink-50 rounded-xl border border-pink-200 p-5">
                <h2 className="text-base font-bold text-pink-800 mb-2">
                  妊娠{result.currentWeek}週のアドバイス
                </h2>
                <p className="text-sm text-pink-900">{result.weekAdvice}</p>
              </section>
            )}

            {/* Section 5: Cautions */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-3">妊娠中に避けること</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  "禁煙・禁酒（妊娠が分かった時点から）",
                  "生魚・生肉・非加熱チーズの摂取に注意",
                  "葉酸を妊娠初期から摂取（400μg/日）",
                  "激しい運動・過度のダイエット",
                  "自己判断での薬の服用",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        <AdUnit slot="pregnancy-calculator-mid" className="my-4" />

        {/* ─── SEO Content ──────────────────────────────────────────────────── */}

        {/* Due date quick reference table */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-3">出産予定日 早見表（最終月経日別）</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-2 px-3 font-medium text-gray-600">最終月経開始日</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">出産予定日（周期28日）</th>
                </tr>
              </thead>
              <tbody>
                {DUE_DATE_TABLE.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2 px-3 text-gray-700">{row.lmp}</td>
                    <td className="py-2 px-3 text-gray-700 font-medium">{row.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Knowledge section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
          <h2 className="text-base font-bold text-gray-900">妊娠週数の基礎知識</h2>

          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-1">妊娠週数の数え方</h3>
            <p className="text-sm text-gray-600">
              妊娠週数は最終月経の開始日を「妊娠0週0日」として数えます。実際の受精は排卵日（月経周期28日の場合は月経開始から14日後）に起こりますが、正確な受精日は特定しにくいため、最終月経日を基準とします。
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-1">出産予定日の計算方法（ネーゲレ概算法）</h3>
            <p className="text-sm text-gray-600">
              最終月経開始日に280日（40週）を加えた日が出産予定日です。または、最終月経開始月に9を加えた月（または3を引いた月）、最終月経開始日に7を加えた日が目安になります。
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-2">妊娠の3つの時期（トリメスター）</h3>
            <div className="space-y-2">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-800">第1三半期（妊娠初期）0〜13週</p>
                <p className="text-sm text-blue-700 mt-0.5">胎児の主要な臓器が形成される重要な時期。つわりが起きやすく、流産リスクが最も高い時期。</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm font-medium text-green-800">第2三半期（妊娠中期）14〜27週</p>
                <p className="text-sm text-green-700 mt-0.5">安定期とも呼ばれる比較的安定した時期。胎動を感じ始め、お腹が目立ち始めます。</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-sm font-medium text-orange-800">第3三半期（妊娠後期）28〜40週</p>
                <p className="text-sm text-orange-700 mt-0.5">出産に向けて準備する時期。定期健診の頻度が増え、出産準備を進めましょう。</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-1">妊婦健診の費用と補助</h3>
            <p className="text-sm text-gray-600">
              多くの自治体では妊婦健診の費用を補助しています。母子手帳と一緒に受け取る「妊婦健康診査受診票」を使うことで、14回分の健診費用が無料または低額になります。
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <p className="text-sm font-medium text-gray-900 mb-1">Q. {item.q}</p>
                <p className="text-sm text-gray-600">A. {item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related tools */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-3">あわせて使えるツール</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { href: "/health/bmi-calculator", label: "BMI・適正体重 計算機" },
              { href: "/health/calorie-calculator", label: "基礎代謝・カロリー計算機" },
              { href: "/insurance/life-insurance-calculator", label: "生命保険 必要保障額計算機" },
              { href: "/insurance/medical-insurance-sim", label: "医療保険シミュレーター" },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-colors text-sm text-gray-700 hover:text-pink-700"
              >
                <span className="text-pink-400">→</span>
                {tool.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center pb-4">
          ※この計算機はあくまで目安です。正確な妊娠週数・出産予定日は産婦人科でご確認ください。
        </p>
      </main>
    </div>
    <UseCasesSection cases={useCases} />
    <FAQSection faq={faqItems} />
  </>
  );
}
