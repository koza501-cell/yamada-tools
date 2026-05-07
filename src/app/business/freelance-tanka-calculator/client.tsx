"use client";
import { useState, useMemo } from "react";

type JobType = "ITエンジニア（Web/アプリ）" | "ITエンジニア（インフラ/クラウド）" | "ITエンジニア（AI/データ）" | "Webデザイナー/UIデザイナー" | "グラフィックデザイナー" | "コピーライター/Webライター" | "翻訳者（英日/日英）" | "動画編集者" | "マーケター/SNS運用" | "コンサルタント" | "経理・財務" | "その他";
type Level = "初級（1〜3年）" | "中級（3〜5年）" | "上級（5〜10年）" | "エキスパート（10年以上）";
type WorkStyle = "常駐" | "リモート" | "ハイブリッド";
type DaysPerWeek = 2 | 3 | 4 | 5;

interface RateData { monthMin: number; monthMax: number; hourMin: number; hourMax: number; }

type MarketDB = Partial<Record<JobType, Record<Level, RateData>>>;

const MARKET_DB: MarketDB = {
  "ITエンジニア（Web/アプリ）": {
    "初級（1〜3年）": { monthMin: 40, monthMax: 60, hourMin: 2500, hourMax: 3500 },
    "中級（3〜5年）": { monthMin: 60, monthMax: 80, hourMin: 3500, hourMax: 5000 },
    "上級（5〜10年）": { monthMin: 80, monthMax: 120, hourMin: 5000, hourMax: 7500 },
    "エキスパート（10年以上）": { monthMin: 100, monthMax: 200, hourMin: 6000, hourMax: 12500 },
  },
  "ITエンジニア（インフラ/クラウド）": {
    "初級（1〜3年）": { monthMin: 45, monthMax: 65, hourMin: 2800, hourMax: 4000 },
    "中級（3〜5年）": { monthMin: 65, monthMax: 90, hourMin: 4000, hourMax: 5500 },
    "上級（5〜10年）": { monthMin: 90, monthMax: 130, hourMin: 5500, hourMax: 8000 },
    "エキスパート（10年以上）": { monthMin: 120, monthMax: 220, hourMin: 7500, hourMax: 14000 },
  },
  "ITエンジニア（AI/データ）": {
    "初級（1〜3年）": { monthMin: 50, monthMax: 70, hourMin: 3000, hourMax: 4500 },
    "中級（3〜5年）": { monthMin: 70, monthMax: 100, hourMin: 4500, hourMax: 6500 },
    "上級（5〜10年）": { monthMin: 100, monthMax: 150, hourMin: 6500, hourMax: 9500 },
    "エキスパート（10年以上）": { monthMin: 150, monthMax: 250, hourMin: 9500, hourMax: 16000 },
  },
  "Webデザイナー/UIデザイナー": {
    "初級（1〜3年）": { monthMin: 25, monthMax: 40, hourMin: 1500, hourMax: 2500 },
    "中級（3〜5年）": { monthMin: 40, monthMax: 60, hourMin: 2500, hourMax: 3500 },
    "上級（5〜10年）": { monthMin: 60, monthMax: 90, hourMin: 3500, hourMax: 5500 },
    "エキスパート（10年以上）": { monthMin: 80, monthMax: 130, hourMin: 5000, hourMax: 8000 },
  },
  "グラフィックデザイナー": {
    "初級（1〜3年）": { monthMin: 20, monthMax: 35, hourMin: 1200, hourMax: 2200 },
    "中級（3〜5年）": { monthMin: 35, monthMax: 55, hourMin: 2200, hourMax: 3500 },
    "上級（5〜10年）": { monthMin: 55, monthMax: 80, hourMin: 3500, hourMax: 5000 },
    "エキスパート（10年以上）": { monthMin: 70, monthMax: 120, hourMin: 4500, hourMax: 7500 },
  },
  "コピーライター/Webライター": {
    "初級（1〜3年）": { monthMin: 15, monthMax: 25, hourMin: 1000, hourMax: 2000 },
    "中級（3〜5年）": { monthMin: 25, monthMax: 45, hourMin: 2000, hourMax: 3500 },
    "上級（5〜10年）": { monthMin: 45, monthMax: 70, hourMin: 3000, hourMax: 6000 },
    "エキスパート（10年以上）": { monthMin: 60, monthMax: 100, hourMin: 4000, hourMax: 8000 },
  },
  "翻訳者（英日/日英）": {
    "初級（1〜3年）": { monthMin: 20, monthMax: 35, hourMin: 2000, hourMax: 3000 },
    "中級（3〜5年）": { monthMin: 35, monthMax: 55, hourMin: 3000, hourMax: 5000 },
    "上級（5〜10年）": { monthMin: 55, monthMax: 80, hourMin: 5000, hourMax: 8000 },
    "エキスパート（10年以上）": { monthMin: 75, monthMax: 130, hourMin: 7000, hourMax: 12000 },
  },
  "動画編集者": {
    "初級（1〜3年）": { monthMin: 15, monthMax: 30, hourMin: 1000, hourMax: 2000 },
    "中級（3〜5年）": { monthMin: 30, monthMax: 55, hourMin: 2000, hourMax: 3500 },
    "上級（5〜10年）": { monthMin: 55, monthMax: 85, hourMin: 3500, hourMax: 5500 },
    "エキスパート（10年以上）": { monthMin: 80, monthMax: 130, hourMin: 5000, hourMax: 8000 },
  },
  "マーケター/SNS運用": {
    "初級（1〜3年）": { monthMin: 25, monthMax: 40, hourMin: 1500, hourMax: 2500 },
    "中級（3〜5年）": { monthMin: 40, monthMax: 65, hourMin: 2500, hourMax: 4000 },
    "上級（5〜10年）": { monthMin: 65, monthMax: 100, hourMin: 4000, hourMax: 6000 },
    "エキスパート（10年以上）": { monthMin: 90, monthMax: 150, hourMin: 5500, hourMax: 9000 },
  },
  "コンサルタント": {
    "初級（1〜3年）": { monthMin: 40, monthMax: 60, hourMin: 2500, hourMax: 4000 },
    "中級（3〜5年）": { monthMin: 60, monthMax: 100, hourMin: 4000, hourMax: 6500 },
    "上級（5〜10年）": { monthMin: 100, monthMax: 160, hourMin: 6500, hourMax: 10000 },
    "エキスパート（10年以上）": { monthMin: 150, monthMax: 300, hourMin: 10000, hourMax: 20000 },
  },
  "経理・財務": {
    "初級（1〜3年）": { monthMin: 25, monthMax: 40, hourMin: 1500, hourMax: 2500 },
    "中級（3〜5年）": { monthMin: 40, monthMax: 65, hourMin: 2500, hourMax: 4000 },
    "上級（5〜10年）": { monthMin: 65, monthMax: 95, hourMin: 4000, hourMax: 6000 },
    "エキスパート（10年以上）": { monthMin: 85, monthMax: 140, hourMin: 5500, hourMax: 9000 },
  },
  "その他": {
    "初級（1〜3年）": { monthMin: 20, monthMax: 35, hourMin: 1200, hourMax: 2200 },
    "中級（3〜5年）": { monthMin: 35, monthMax: 55, hourMin: 2200, hourMax: 3500 },
    "上級（5〜10年）": { monthMin: 55, monthMax: 80, hourMin: 3500, hourMax: 5000 },
    "エキスパート（10年以上）": { monthMin: 70, monthMax: 120, hourMin: 4500, hourMax: 7500 },
  },
};

const JOBS = Object.keys(MARKET_DB) as JobType[];
const LEVELS: Level[] = ["初級（1〜3年）","中級（3〜5年）","上級（5〜10年）","エキスパート（10年以上）"];
const REMOTE_BONUS: Record<WorkStyle, number> = { "常駐": 1.0, "リモート": 0.90, "ハイブリッド": 0.95 };
const DAYS_RATE: Record<DaysPerWeek, number> = { 2: 0.4, 3: 0.6, 4: 0.8, 5: 1.0 };

export default function FreelanceTankaClient() {
  const [jobType, setJobType] = useState<JobType>(JOBS[0]);
  const [level, setLevel] = useState<Level>("中級（3〜5年）");
  const [workStyle, setWorkStyle] = useState<WorkStyle>("リモート");
  const [daysPerWeek, setDaysPerWeek] = useState<DaysPerWeek>(5);
  const [targetIncome, setTargetIncome] = useState("8000000");

  const result = useMemo(() => {
    const db = MARKET_DB[jobType]?.[level] || { monthMin: 30, monthMax: 60, hourMin: 2000, hourMax: 4000 };
    const remoteBonus = REMOTE_BONUS[workStyle];
    const daysRate = DAYS_RATE[daysPerWeek];

    const adjMonthMin = Math.round(db.monthMin * remoteBonus * daysRate);
    const adjMonthMax = Math.round(db.monthMax * remoteBonus * daysRate);
    const adjHourMin = Math.round(db.hourMin * remoteBonus);
    const adjHourMax = Math.round(db.hourMax * remoteBonus);

    const annualMin = adjMonthMin * 10;
    const annualMax = adjMonthMax * 10;

    const target = parseFloat(targetIncome) || 0;
    const reqMonthly = target > 0 ? Math.ceil(target / 10) : 0;
    const reqHourly = reqMonthly > 0 ? Math.ceil((reqMonthly * 10000) / (160 * daysPerWeek / 5)) : 0;

    const levelIndex = LEVELS.indexOf(level);
    const totalLevels = LEVELS.length;
    const percentile = Math.round(((levelIndex + 0.5) / totalLevels) * 100);

    const midMonthly = Math.round((adjMonthMin + adjMonthMax) / 2);
    const aboveTarget = reqMonthly > adjMonthMax;
    const withinRange = reqMonthly >= adjMonthMin && reqMonthly <= adjMonthMax;

    return {
      adjMonthMin, adjMonthMax, adjHourMin, adjHourMax,
      annualMin, annualMax,
      reqMonthly, reqHourly,
      percentile,
      midMonthly,
      aboveTarget, withinRange,
    };
  }, [jobType, level, workStyle, daysPerWeek, targetIncome]);

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">フリーランス 適正単価・年収診断ツール</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">2025年最新相場。職種・経験・稼働条件から適正単価を診断。</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">職種・スキル</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">職種</label>
                <select value={jobType} onChange={e => setJobType(e.target.value as JobType)} className={inp}>
                  {JOBS.map(j => <option key={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">経験・スキルレベル</label>
                <select value={level} onChange={e => setLevel(e.target.value as Level)} className={inp}>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">稼働条件</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">稼働形態</label>
                <select value={workStyle} onChange={e => setWorkStyle(e.target.value as WorkStyle)} className={inp}>
                  {(["常駐","リモート","ハイブリッド"] as WorkStyle[]).map(s => <option key={s}>{s}</option>)}
                </select>
                {workStyle === "リモート" && <p className="text-xs text-gray-400 mt-1">リモートは常駐比-10%が市場実態です</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">週稼働日数</label>
                <select value={daysPerWeek} onChange={e => setDaysPerWeek(Number(e.target.value) as DaysPerWeek)} className={inp}>
                  {([2,3,4,5] as DaysPerWeek[]).map(d => <option key={d} value={d}>週{d}日</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">目標年収（円）</label>
                <input type="number" value={targetIncome} onChange={e => setTargetIncome(e.target.value)} placeholder="8000000" className={inp} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">推奨単価レンジ</h2>
              <div className="text-center py-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">月額単価</div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {result.adjMonthMin}〜{result.adjMonthMax}万円/月
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-1">時間単価</div>
                <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  ¥{fmt(result.adjHourMin)}〜¥{fmt(result.adjHourMax)}/時
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  推定年収レンジ: {result.annualMin}〜{result.annualMax}万円
                </div>
              </div>
              <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-xs text-center text-blue-700 dark:text-blue-300">
                あなたのスキルは市場の上位 {result.percentile}% に相当します
              </div>
            </div>

            {parseFloat(targetIncome) > 0 && (
              <div className={`rounded-xl p-4 border ${result.aboveTarget ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700" : result.withinRange ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700" : "bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-700"}`}>
                <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">目標年収からの逆算</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  年収 <span className="font-bold text-gray-800 dark:text-white">¥{fmt(parseFloat(targetIncome))}</span> 達成には
                </p>
                <p className="text-lg font-bold text-gray-800 dark:text-white mt-1">
                  月額 {result.reqMonthly}万円 / 時間単価 ¥{fmt(result.reqHourly)}
                </p>
                <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                  {result.aboveTarget
                    ? "⚠️ 目標が現在の相場を上回っています。スキルアップまたは専門特化で達成可能です。"
                    : result.withinRange
                    ? "✅ 目標は相場レンジ内です。現在のスキルで十分達成可能です。"
                    : "💡 目標は相場より低めです。単価交渉の余地があります。"}
                </p>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">単価を上げるには</p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li>高単価スキル（クラウド・AI・セキュリティ等）への特化</li>
                <li>ポートフォリオ・実績の可視化と発信</li>
                <li>エージェント複数活用で案件単価を比較</li>
                <li>業務委託より直取引（エンドクライアント）を狙う</li>
                <li>専門資格（AWS/TOEIC/簿記等）で希少性を高める</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
          ※ 2025年市場相場を基に作成。実際の単価は案件・エージェント・スキルにより異なります。
        </p>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | フリーランス 適正単価・年収診断ツール
        </div>
      </div>
    </div>
  );
}
