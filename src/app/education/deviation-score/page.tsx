"use client";

import { useState } from "react";
import { AdUnit } from "@/components/common/AdUnit";

// ---- Calculation helpers ----
function normalCDF(z: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(z));
  const poly =
    t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erf = 1 - poly * Math.exp(-z * z);
  return z >= 0 ? (1 + erf) / 2 : (1 - erf) / 2;
}

function calcHensachi(score: number, mean: number, sd: number): number {
  if (sd === 0) return 50;
  return (score - mean) / sd * 10 + 50;
}

function calcPercentile(hensachi: number): number {
  const z = (hensachi - 50) / 10;
  return (1 - normalCDF(z)) * 100;
}

function calcRank(percentile: number, classSize: number): number {
  return Math.ceil(percentile / 100 * classSize);
}

function calcScoreFromHensachi(h: number, mean: number, sd: number): number {
  return (h - 50) / 10 * sd + mean;
}

function calcStatsFromList(scores: number[]): { mean: number; sd: number } {
  const n = scores.length;
  const mean = scores.reduce((a, b) => a + b, 0) / n;
  const variance = scores.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  return { mean, sd: Math.sqrt(variance) };
}

function getUniversityLevel(h: number): string {
  if (h >= 75) return "東京大学・京都大学レベル";
  if (h >= 70) return "一橋・東工大・医学部レベル";
  if (h >= 65) return "早慶・旧帝大レベル";
  if (h >= 60) return "MARCH・関関同立レベル";
  if (h >= 55) return "日東駒専・産近甲龍レベル";
  if (h >= 50) return "中堅私立大学レベル";
  return "基礎固めが必要なレベル";
}

function getSubjectRating(h: number): string {
  if (h >= 60) return "得意 ⭐";
  if (h >= 45) return "標準";
  return "要強化 ⚠️";
}

function getGaugeColor(h: number): string {
  if (h < 40) return "bg-red-500";
  if (h < 50) return "bg-orange-400";
  if (h < 60) return "bg-yellow-400";
  if (h < 70) return "bg-sky-400";
  return "bg-blue-600";
}

function getHensachiTextColor(h: number): string {
  if (h < 40) return "text-red-600";
  if (h < 50) return "text-orange-500";
  if (h < 60) return "text-yellow-600";
  if (h < 70) return "text-sky-500";
  return "text-blue-700";
}

const FAQ_LIST = [
  {
    q: "偏差値50は平均点ですか？",
    a: "はい、偏差値50はちょうど平均点に相当します。テストを受けた全員の点数を集めると偏差値の平均は必ず50になります。偏差値60は上位約16%、偏差値40は下位約16%に位置します。",
  },
  {
    q: "偏差値はどの模試でも同じですか？",
    a: "いいえ、異なります。偏差値は受験した集団の中での相対的な位置を示すため、受験者層によって大きく変わります。難関大志望者が多く受験する模試では偏差値が低めに出る傾向があります。同じ模試・同じ母集団での比較が重要です。",
  },
  {
    q: "偏差値を10上げるのは難しいですか？",
    a: "難しいですが不可能ではありません。偏差値を10上げるということは、現在の位置から標準偏差1つ分上に行くことを意味します。弱点科目の克服と得意科目の強化を組み合わせることで、3〜6ヶ月の集中学習で達成できることもあります。",
  },
  {
    q: "標準偏差がわからない場合はどうすればいいですか？",
    a: "本ツールの「点数を入力して自動計算」機能を使うと、クラス全員の点数から平均・標準偏差を自動計算できます。または一般的なテストでは標準偏差が平均点の約20〜30%程度になることが多いです（目安：平均60点なら標準偏差12〜18点程度）。",
  },
  {
    q: "大学受験の合格に必要な偏差値はどう調べますか？",
    a: "各大学・学部の偏差値は、河合塾・駿台・ベネッセなどの予備校が毎年更新しています。ただし模試の種類によって偏差値が異なるため、同じ予備校の模試を継続的に受けて比較することが重要です。一般的に合格可能性60〜80%の偏差値を目標の目安にします。",
  },
];

const QUICK_TABLE = [
  { h: 80, pct: "0.1%", rank: "1位", level: "最難関" },
  { h: 75, pct: "0.6%", rank: "1位", level: "難関" },
  { h: 70, pct: "2.3%", rank: "1位", level: "上位" },
  { h: 65, pct: "6.7%", rank: "3位", level: "やや上位" },
  { h: 60, pct: "15.9%", rank: "7位", level: "中の上" },
  { h: 55, pct: "30.9%", rank: "13位", level: "平均やや上" },
  { h: 50, pct: "50.0%", rank: "20位", level: "平均" },
  { h: 45, pct: "69.1%", rank: "28位", level: "平均やや下" },
  { h: 40, pct: "84.1%", rank: "34位", level: "要努力" },
];

const RELATED_TOOLS = [
  { href: "/education/scholarship-repayment", label: "奨学金返済シミュレーター" },
  { href: "/education/education-cost-simulator", label: "教育費積立シミュレーター" },
  { href: "/education/certification-roi", label: "資格取得費用対効果計算機" },
  { href: "/utility/age-calculator", label: "年齢計算機" },
];

const UNIVERSITY_ROWS = [
  { range: "偏差値75以上", label: "東京大学・京都大学レベル", color: "bg-blue-700" },
  { range: "偏差値70〜75", label: "一橋・東工大・医学部レベル", color: "bg-blue-500" },
  { range: "偏差値65〜70", label: "早慶・旧帝大レベル", color: "bg-sky-500" },
  { range: "偏差値60〜65", label: "MARCH・関関同立レベル", color: "bg-sky-400" },
  { range: "偏差値55〜60", label: "日東駒専・産近甲龍レベル", color: "bg-yellow-400" },
  { range: "偏差値50〜55", label: "中堅私立大学レベル", color: "bg-orange-400" },
  { range: "偏差値50以下", label: "基礎固めが必要なレベル", color: "bg-red-400" },
];

interface SubjectRow {
  name: string;
  score: string;
  mean: string;
  sd: string;
}

interface Result {
  hensachi: number;
  percentile: number;
  rank: number;
  myScore: number;
  mean: number;
  sd: number;
  reverseScore?: number;
  currentScore?: number;
  subjects?: Array<{ name: string; score: number; hensachi: number; percentile: number }>;
}

export default function DeviationScorePage() {
  const [mode, setMode] = useState<"score" | "reverse">("score");
  const [inputMode, setInputMode] = useState<"manual" | "auto">("manual");

  const [score, setScore] = useState("");
  const [mean, setMean] = useState("");
  const [sd, setSd] = useState("");
  const [scoreList, setScoreList] = useState("");

  const [targetH, setTargetH] = useState("");
  const [mean2, setMean2] = useState("");
  const [sd2, setSd2] = useState("");
  const [currentScore2, setCurrentScore2] = useState("");

  const [classSize, setClassSize] = useState("40");

  const [showSubjects, setShowSubjects] = useState(false);
  const [subjects, setSubjects] = useState<SubjectRow[]>(
    Array(5).fill(null).map(() => ({ name: "", score: "", mean: "", sd: "" }))
  );

  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function updateSubject(i: number, field: keyof SubjectRow, val: string) {
    setSubjects((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));
  }

  function calculate() {
    setError("");
    setResult(null);
    const cs = parseInt(classSize) || 40;

    if (mode === "score") {
      let myScore: number, myMean: number, mySd: number;

      if (inputMode === "auto") {
        const raw = scoreList
          .split(/[\n,、，\s]+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .map(Number)
          .filter((n) => !isNaN(n));
        if (raw.length < 2) { setError("点数を2人分以上入力してください。"); return; }
        if (raw.length > 50) { setError("点数は最大50人分まで入力できます。"); return; }
        const myScoreRaw = parseFloat(score);
        if (isNaN(myScoreRaw)) { setError("自分の点数を入力してください。"); return; }
        const stats = calcStatsFromList(raw);
        myScore = myScoreRaw; myMean = stats.mean; mySd = stats.sd;
      } else {
        myScore = parseFloat(score);
        myMean = parseFloat(mean);
        mySd = parseFloat(sd);
        if (isNaN(myScore) || isNaN(myMean) || isNaN(mySd)) {
          setError("点数・平均点・標準偏差を入力してください。"); return;
        }
        if (mySd < 0) { setError("標準偏差は0以上の値を入力してください。"); return; }
      }

      const h = calcHensachi(myScore, myMean, mySd);
      const pct = calcPercentile(h);
      const rnk = calcRank(pct, cs);

      const validSubjects = subjects
        .filter((s) => s.name && s.score && s.mean && s.sd)
        .map((s) => {
          const sh = calcHensachi(parseFloat(s.score), parseFloat(s.mean), parseFloat(s.sd));
          return { name: s.name, score: parseFloat(s.score), hensachi: sh, percentile: calcPercentile(sh) };
        });

      setResult({
        hensachi: h, percentile: pct, rank: rnk, myScore, mean: myMean, sd: mySd,
        subjects: validSubjects.length > 0 ? validSubjects : undefined,
      });
    } else {
      const th = parseFloat(targetH);
      const m = parseFloat(mean2);
      const s = parseFloat(sd2);
      const cur = parseFloat(currentScore2);
      if (isNaN(th) || isNaN(m) || isNaN(s)) { setError("目標偏差値・平均点・標準偏差を入力してください。"); return; }
      if (s <= 0) { setError("標準偏差は0より大きい値を入力してください。"); return; }
      const needed = calcScoreFromHensachi(th, m, s);
      const pct = calcPercentile(th);
      const rnk = calcRank(pct, cs);
      setResult({
        hensachi: th, percentile: pct, rank: rnk, myScore: isNaN(cur) ? 0 : cur,
        mean: m, sd: s, reverseScore: needed, currentScore: isNaN(cur) ? undefined : cur,
      });
    }
  }

  const gaugePercent = result
    ? Math.min(100, Math.max(0, ((result.hensachi - 20) / 60) * 100))
    : 50;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-200 text-sm mb-1">教育・学習</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">偏差値 計算機</h1>
          <p className="text-blue-100 text-sm">
            点数から偏差値を瞬時に計算。上位%・クラス順位・大学合格難易度も表示。偏差値から必要点数の逆算・複数科目比較も対応。
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Mode tabs */}
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              mode === "score" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => { setMode("score"); setResult(null); setError(""); }}
          >
            点数 → 偏差値
          </button>
          <button
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              mode === "reverse" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => { setMode("reverse"); setResult(null); setError(""); }}
          >
            偏差値 → 点数（逆算）
          </button>
        </div>

        {/* Input card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          {mode === "score" ? (
            <>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setInputMode(inputMode === "manual" ? "auto" : "manual")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    inputMode === "auto" ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      inputMode === "auto" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700">点数を入力して自動計算（平均・標準偏差を自動算出）</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">自分の点数</label>
                <input
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="例: 72"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {inputMode === "auto" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    受験者全員の点数（カンマ・改行・スペース区切り、最大50人）
                  </label>
                  <textarea
                    value={scoreList}
                    onChange={(e) => setScoreList(e.target.value)}
                    placeholder="例: 85, 72, 63, 91, 55, 78..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">平均点</label>
                    <input
                      type="number"
                      value={mean}
                      onChange={(e) => setMean(e.target.value)}
                      placeholder="例: 60"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">標準偏差</label>
                    <input
                      type="number"
                      value={sd}
                      onChange={(e) => setSd(e.target.value)}
                      placeholder="例: 15"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">目標偏差値</label>
                <input
                  type="number"
                  value={targetH}
                  onChange={(e) => setTargetH(e.target.value)}
                  placeholder="例: 65"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">平均点</label>
                  <input
                    type="number"
                    value={mean2}
                    onChange={(e) => setMean2(e.target.value)}
                    placeholder="例: 60"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">標準偏差</label>
                  <input
                    type="number"
                    value={sd2}
                    onChange={(e) => setSd2(e.target.value)}
                    placeholder="例: 15"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">現在の点数（任意）</label>
                <input
                  type="number"
                  value={currentScore2}
                  onChange={(e) => setCurrentScore2(e.target.value)}
                  placeholder="例: 55"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">クラス人数（順位計算用）</label>
            <input
              type="number"
              value={classSize}
              onChange={(e) => setClassSize(e.target.value)}
              placeholder="40"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Multi-subject */}
        {mode === "score" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              className="w-full px-5 py-3 flex items-center justify-between text-sm font-semibold text-gray-700 hover:bg-gray-50"
              onClick={() => setShowSubjects(!showSubjects)}
            >
              <span>複数科目比較（任意・最大5科目）</span>
              <span className="text-gray-400">{showSubjects ? "▲" : "▼"}</span>
            </button>
            {showSubjects && (
              <div className="px-5 pb-5 space-y-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 pt-3">科目名・点数・平均点・標準偏差を入力すると比較表が表示されます。</p>
                {subjects.map((s, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2">
                    <input type="text" value={s.name} onChange={(e) => updateSubject(i, "name", e.target.value)}
                      placeholder="科目名" className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <input type="number" value={s.score} onChange={(e) => updateSubject(i, "score", e.target.value)}
                      placeholder="点数" className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <input type="number" value={s.mean} onChange={(e) => updateSubject(i, "mean", e.target.value)}
                      placeholder="平均点" className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <input type="number" value={s.sd} onChange={(e) => updateSubject(i, "sd", e.target.value)}
                      placeholder="標準偏差" className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <button
          onClick={calculate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors text-base"
        >
          計算する
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Big hensachi + gauge */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <p className="text-sm text-gray-500 mb-1">
                {mode === "reverse" ? "目標偏差値" : "あなたの偏差値"}
              </p>
              <p className={`text-6xl font-extrabold mb-4 ${getHensachiTextColor(result.hensachi)}`}>
                {result.hensachi.toFixed(1)}
              </p>
              <div className="mb-2">
                <div className="relative h-6 rounded-full bg-gradient-to-r from-red-400 via-yellow-300 to-blue-600 overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-gray-900 rounded"
                    style={{ left: `calc(${gaugePercent}% - 2px)` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>20</span><span>30</span><span>40</span><span>50</span><span>60</span><span>70</span><span>80</span>
                </div>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${getGaugeColor(result.hensachi)}`}>
                {getUniversityLevel(result.hensachi)}
              </span>
            </div>

            {/* Details table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {mode === "score" && (
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-500">自分の点数</td>
                      <td className="px-4 py-3 font-semibold text-right">{result.myScore}点</td>
                    </tr>
                  )}
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">平均点</td>
                    <td className="px-4 py-3 font-semibold text-right">{result.mean.toFixed(1)}点</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">標準偏差</td>
                    <td className="px-4 py-3 font-semibold text-right">{result.sd.toFixed(1)}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">偏差値</td>
                    <td className={`px-4 py-3 font-bold text-right ${getHensachiTextColor(result.hensachi)}`}>
                      {result.hensachi.toFixed(1)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-500">上位</td>
                    <td className="px-4 py-3 font-semibold text-right">{result.percentile.toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-500">{parseInt(classSize) || 40}人クラスでの順位目安</td>
                    <td className="px-4 py-3 font-semibold text-right">約{result.rank}位</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mode 2: reverse result */}
            {mode === "reverse" && result.reverseScore !== undefined && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <p className="text-sm text-blue-700 font-semibold mb-2">
                  目標偏差値 {result.hensachi.toFixed(1)} を達成するには
                </p>
                <p className="text-3xl font-extrabold text-blue-800 mb-1">
                  {result.reverseScore.toFixed(1)}点 が必要
                </p>
                {result.currentScore !== undefined && result.currentScore > 0 && (
                  <p className="text-sm text-blue-600">
                    現在の {result.currentScore}点 から{" "}
                    <span className="font-bold">
                      {(result.reverseScore - result.currentScore) >= 0
                        ? `+${(result.reverseScore - result.currentScore).toFixed(1)}`
                        : (result.reverseScore - result.currentScore).toFixed(1)}
                      点
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Multi-subject comparison */}
            {result.subjects && result.subjects.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <p className="px-5 py-3 font-semibold text-gray-700 border-b border-gray-100 text-sm">複数科目比較</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-600 font-medium">科目</th>
                        <th className="px-4 py-2 text-right text-gray-600 font-medium">点数</th>
                        <th className="px-4 py-2 text-right text-gray-600 font-medium">偏差値</th>
                        <th className="px-4 py-2 text-right text-gray-600 font-medium">上位%</th>
                        <th className="px-4 py-2 text-right text-gray-600 font-medium">評価</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.subjects.map((s, i) => (
                        <tr key={i} className="border-t border-gray-100">
                          <td className="px-4 py-2.5 font-medium">{s.name}</td>
                          <td className="px-4 py-2.5 text-right">{s.score}点</td>
                          <td className={`px-4 py-2.5 text-right font-bold ${getHensachiTextColor(s.hensachi)}`}>
                            {s.hensachi.toFixed(1)}
                          </td>
                          <td className="px-4 py-2.5 text-right">{s.percentile.toFixed(1)}%</td>
                          <td className="px-4 py-2.5 text-right">{getSubjectRating(s.hensachi)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* University difficulty */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="font-semibold text-gray-700 mb-3 text-sm">大学合格難易度の目安</p>
              <p className="text-sm text-gray-600 mb-3">
                あなたの偏差値{" "}
                <span className={`font-bold ${getHensachiTextColor(result.hensachi)}`}>{result.hensachi.toFixed(1)}</span>{" "}
                は <span className="font-semibold">{getUniversityLevel(result.hensachi)}</span> に相当します。
              </p>
              <div className="space-y-1.5 text-xs">
                {UNIVERSITY_ROWS.map((row) => {
                  const active = getUniversityLevel(result!.hensachi) === row.label;
                  return (
                    <div
                      key={row.label}
                      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${active ? "bg-blue-50 border border-blue-200" : ""}`}
                    >
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${row.color}`} />
                      <span className="text-gray-500 w-28 shrink-0">{row.range}</span>
                      <span className={`font-medium ${active ? "text-blue-700" : "text-gray-700"}`}>{row.label}</span>
                      {active && <span className="ml-auto text-blue-600 font-bold">← あなた</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SEO: Quick table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <p className="px-5 py-3 font-semibold text-gray-700 border-b border-gray-100 text-sm">偏差値早見表（40人クラス基準）</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 font-medium">偏差値</th>
                  <th className="px-4 py-2 text-right text-gray-600 font-medium">上位%</th>
                  <th className="px-4 py-2 text-right text-gray-600 font-medium">40人クラス順位</th>
                  <th className="px-4 py-2 text-right text-gray-600 font-medium">レベル</th>
                </tr>
              </thead>
              <tbody>
                {QUICK_TABLE.map((row) => (
                  <tr key={row.h} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-semibold">{row.h}</td>
                    <td className="px-4 py-2.5 text-right">{row.pct}</td>
                    <td className="px-4 py-2.5 text-right">{row.rank}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{row.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SEO: Knowledge */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-800">偏差値とは？基礎知識と計算式</h2>
          <p className="text-sm text-gray-600">
            偏差値とは、テストの点数が全体の中でどの位置にあるかを示す指標です。平均点を50として、標準偏差（点数のばらつき）を基準に算出されます。
          </p>
          <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm font-mono text-gray-700">
            偏差値 = （自分の点数 − 平均点） ÷ 標準偏差 × 10 + 50
          </div>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>平均点をとった人の偏差値は常に <strong>50</strong></li>
            <li>標準偏差の1倍上にいる人の偏差値は <strong>60</strong></li>
            <li>標準偏差の2倍上にいる人の偏差値は <strong>70</strong></li>
            <li>偏差値70以上は全体の上位約 <strong>2.3%</strong></li>
          </ul>
          <p className="text-sm text-gray-600">
            同じ50点でも、平均が40点のテストと60点のテストでは偏差値が全く異なります。偏差値はテストの難易度に左右されないため、異なるテスト間での比較に適しています。
          </p>
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
              <a key={t.href} href={t.href} className="text-blue-600 hover:text-blue-800 text-sm hover:underline">
                {t.label}
              </a>
            ))}
          </div>
        </div>
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <AdUnit position="mid" format="horizontal" />
      </div>
      </div>
    </div>
  );
}
