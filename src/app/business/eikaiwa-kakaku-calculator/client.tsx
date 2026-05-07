"use client";
import { useState, useMemo } from "react";

type EmployType = "個人事業主" | "法人";
type LessonDuration = 30 | 45 | 60 | 90;

export default function EikaiwaKakakuClient() {
  const [targetIncome, setTargetIncome] = useState("4000000");
  const [employType, setEmployType] = useState<EmployType>("個人事業主");
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [lessonsPerDay, setLessonsPerDay] = useState(4);
  const [vacationDays, setVacationDays] = useState("30");
  const [rent, setRent] = useState("0");
  const [utilities, setUtilities] = useState("0");
  const [materials, setMaterials] = useState("5000");
  const [advertising, setAdvertising] = useState("10000");
  const [other, setOther] = useState("0");
  const [duration, setDuration] = useState<LessonDuration>(60);

  const result = useMemo(() => {
    const target = parseFloat(targetIncome) || 0;
    const vacation = parseFloat(vacationDays) || 0;
    const annualWorkDays = Math.max(1, daysPerWeek * 52 - vacation);
    const annualLessons = annualWorkDays * lessonsPerDay;

    const monthlyExpenses = (parseFloat(rent)||0) + (parseFloat(utilities)||0) + (parseFloat(materials)||0) + (parseFloat(advertising)||0) + (parseFloat(other)||0);
    const annualExpenses = monthlyExpenses * 12;

    let tax = 0;
    let socialIns = 0;
    if (employType === "個人事業主") {
      const taxableIncome = Math.max(0, target - 650000);
      if (taxableIncome <= 1950000) tax = taxableIncome * 0.05;
      else if (taxableIncome <= 3300000) tax = taxableIncome * 0.10 - 97500;
      else if (taxableIncome <= 6950000) tax = taxableIncome * 0.20 - 427500;
      else if (taxableIncome <= 9000000) tax = taxableIncome * 0.23 - 636000;
      else tax = taxableIncome * 0.33 - 1536000;
      const residence = target * 0.10;
      const health = target * 0.10;
      const pension = 16980 * 12;
      socialIns = residence + health + pension;
    } else {
      tax = target * 0.15;
      socialIns = target * 0.12;
    }

    const requiredRevenue = target + annualExpenses + tax + socialIns;
    const requiredLessonRate = annualLessons > 0 ? Math.ceil(requiredRevenue / annualLessons / 100) * 100 : 0;
    const hourlyRate = Math.ceil(requiredLessonRate / (duration / 60) / 100) * 100;

    const breakEvenLessons = requiredLessonRate > 0 ? Math.ceil(annualExpenses / requiredLessonRate) : 0;

    return {
      annualWorkDays, annualLessons,
      annualExpenses, tax: Math.round(tax), socialIns: Math.round(socialIns),
      requiredRevenue: Math.round(requiredRevenue),
      requiredLessonRate, hourlyRate, breakEvenLessons,
      breakEvenMonthly: Math.ceil(breakEvenLessons / 12),
    };
  }, [targetIncome, employType, daysPerWeek, lessonsPerDay, vacationDays, rent, utilities, materials, advertising, other, duration]);

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";

  const marketRates = [
    { label: "個人英会話講師", range: "2,500〜5,000円/時" },
    { label: "英会話スクール", range: "3,000〜8,000円/時" },
    { label: "オンライン英会話", range: "1,000〜3,000円/時" },
  ];

  const isAboveMarket = result.hourlyRate > 5000;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">英会話・語学教室 レッスン単価計算機</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">目標年収から適正なレッスン料金を逆算。経費・税・社保を含む損益シミュレーション。</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">目標収入・稼働設定</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">目標年収（円）</label>
                <input type="number" value={targetIncome} onChange={e => setTargetIncome(e.target.value)} placeholder="4000000" className={inp} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">雇用形態</label>
                <select value={employType} onChange={e => setEmployType(e.target.value as EmployType)} className={inp}>
                  <option>個人事業主</option>
                  <option>法人</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">週稼働日数: {daysPerWeek}日</label>
                <select value={daysPerWeek} onChange={e => setDaysPerWeek(Number(e.target.value))} className={inp}>
                  {[3,4,5,6].map(d => <option key={d} value={d}>{d}日</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">1日のレッスン数: {lessonsPerDay}コマ</label>
                <select value={lessonsPerDay} onChange={e => setLessonsPerDay(Number(e.target.value))} className={inp}>
                  {[2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}コマ</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">年間休暇日数</label>
                <input type="number" value={vacationDays} onChange={e => setVacationDays(e.target.value)} placeholder="30" className={inp} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">レッスン時間</label>
                <select value={duration} onChange={e => setDuration(Number(e.target.value) as LessonDuration)} className={inp}>
                  {([30,45,60,90] as LessonDuration[]).map(d => <option key={d} value={d}>{d}分</option>)}
                </select>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">月間コスト（円）</h2>
              {[
                ["教室家賃（オンラインは0）", rent, setRent],
                ["光熱費", utilities, setUtilities],
                ["教材費", materials, setMaterials, "5000"],
                ["広告費", advertising, setAdvertising, "10000"],
                ["その他経費", other, setOther],
              ].map(([label, val, setter, placeholder]) => (
                <div key={String(label)}>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{String(label)}</label>
                  <input type="number" value={String(val)} onChange={e => (setter as (v: string) => void)(e.target.value)} placeholder={String(placeholder || "0")} className={inp} />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">必要レッスン単価</h2>
              <div className="text-center py-3">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">¥{fmt(result.requiredLessonRate)}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{duration}分 / 1レッスン</div>
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2">時間単価: ¥{fmt(result.hourlyRate)}</div>
              </div>
              <div className="space-y-2 text-sm mt-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                {[
                  ["年間稼働日数", `${result.annualWorkDays}日`],
                  ["年間最大レッスン数", `${result.annualLessons}コマ`],
                  ["年間経費合計", `¥${fmt(result.annualExpenses)}`],
                  ["税金概算", `¥${fmt(result.tax)}`],
                  ["社会保険概算", `¥${fmt(result.socialIns)}`],
                  ["必要総収入", `¥${fmt(result.requiredRevenue)}`],
                ].map(([l, v]) => (
                  <div key={String(l)} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{l}</span>
                    <span className="font-medium dark:text-white">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">相場との比較</h2>
              <div className="space-y-2 text-sm">
                {marketRates.map(r => (
                  <div key={r.label} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{r.label}</span>
                    <span className="dark:text-white">{r.range}</span>
                  </div>
                ))}
                <div className={`mt-2 p-2 rounded text-xs ${isAboveMarket ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300" : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"}`}>
                  {isAboveMarket
                    ? "⚠️ 算出単価が相場上限を超えています。稼働数・経費削減を検討しましょう。"
                    : "✅ 算出単価は市場相場の範囲内です。"}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-sm">
              <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">📊 損益分岐点</p>
              <p className="text-blue-700 dark:text-blue-300 text-xs">
                経費をカバーするには月に<span className="font-bold mx-1 text-base">{result.breakEvenMonthly}コマ</span>以上必要です。
                （年間 {result.breakEvenLessons}コマ）
              </p>
            </div>
          </div>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 英会話・語学教室 レッスン単価計算機
        </div>
      </div>
    </div>
  );
}
