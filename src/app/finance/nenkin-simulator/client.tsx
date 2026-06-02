"use client";
import { useState, useMemo } from "react";

const BASE_NENKIN = 816000; // 2024年度 老齢基礎年金満額（円/年）
const MAX_KISO_MONTHS = 480; // 40年 × 12

const RECEIVE_AGES = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75];

function getAdjustRate(age: number): number {
  if (age === 65) return 1.0;
  if (age < 65) {
    const months = (65 - age) * 12;
    return 1 - months * 0.004;
  }
  // age > 65
  const months = (age - 65) * 12;
  return 1 + months * 0.007;
}

function getAgeLabel(age: number): string {
  if (age < 65) return `${age}歳（繰上げ）`;
  if (age > 65) return `${age}歳（繰下げ）`;
  return "65歳（標準）";
}

export default function NenkinSimulatorClient() {
  const [currentAge, setCurrentAge] = useState("40");
  const [kisoMonths, setKisoMonths] = useState("480");
  const [hasKosei, setHasKosei] = useState(true);
  const [koseiMonths, setKoseiMonths] = useState("300");
  const [avgSalary, setAvgSalary] = useState("350000");
  const [receiveAge, setReceiveAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState("85");

  const result = useMemo(() => {
    const kMonths = Math.min(MAX_KISO_MONTHS, Math.max(0, parseInt(kisoMonths) || 0));
    const kisoBase = Math.round(BASE_NENKIN * (kMonths / MAX_KISO_MONTHS));

    const ksei = parseInt(koseiMonths) || 0;
    const sal = parseFloat(avgSalary) || 0;
    const koseiBase = hasKosei ? Math.round(sal * (5.481 / 1000) * ksei) : 0;

    const baseTotal = kisoBase + koseiBase;

    const adjRate = getAdjustRate(receiveAge);
    const annualAmount = Math.round(baseTotal * adjRate);
    const monthlyAmount = Math.round(annualAmount / 12);

    const age65Total = baseTotal;
    const age65Monthly = Math.round(age65Total / 12);

    // Comparison table
    const comparison = RECEIVE_AGES.map(age => {
      const r = getAdjustRate(age);
      const annual = Math.round(baseTotal * r);
      const monthly = Math.round(annual / 12);
      const pct = Math.round((r - 1) * 100);

      const life = parseInt(lifeExpectancy) || 85;
      if (age > life) return { age, annual, monthly, pct, totalLifetime: 0, vsStd: 0, breakEven: null };

      const years = life - age;
      const totalLifetime = annual * years;
      const stdLifetime = age65Total * (life - 65);
      const vsStd = totalLifetime - stdLifetime;

      // break-even: how many years until cumulative matches age-65 path
      let breakEven: number | null = null;
      if (age !== 65) {
        for (let y = 1; y <= 50; y++) {
          const thisTotal = annual * y;
          const stdAt = age65Total * Math.max(0, y - (age > 65 ? age - 65 : 0));
          // For early: compare cumulative from age
          // For late: 65歳受給者はage歳から年金もらえている
          if (age < 65) {
            // std starts at 65
            const stdFromAge = age === 65 ? annual * y : age65Total * Math.max(0, y - (65 - age));
            const earlyTotal = annual * y;
            if (earlyTotal < stdFromAge && y > (65 - age)) {
              // Already past standard start
              if (stdFromAge > earlyTotal) {
                breakEven = y + age;
                break;
              }
            }
          } else if (age > 65) {
            // std started at 65, we started late
            const stdCumul = age65Total * (y + (age - 65));
            const lateCumul = annual * y;
            if (lateCumul >= stdCumul) {
              breakEven = y + age;
              break;
            }
          }
        }
      }
      return { age, annual, monthly, pct, totalLifetime, vsStd, breakEven };
    });

    // Correct break-even: simplified — when does cumulative receipt equal 65-start?
    const correctedComparison = RECEIVE_AGES.map(age => {
      const r = getAdjustRate(age);
      const annual = Math.round(baseTotal * r);
      const monthly = Math.round(annual / 12);
      const pct = Math.round((r - 1) * 100);

      let breakEvenAge: number | null = null;
      if (age < 65) {
        // Early receiver gets more early but less per year
        // Standard (65): gets 0 for (65-age) years, then age65Total per year
        // Early (age): gets annual per year from "age"
        // Find y (years after age) where annual*y = age65Total*(y-(65-age))
        // annual*y = age65Total*y - age65Total*(65-age)
        // y*(annual - age65Total) = -age65Total*(65-age)
        // y = age65Total*(65-age) / (age65Total - annual)
        const diff = age65Total - annual;
        if (diff > 0) {
          const beYears = (age65Total * (65 - age)) / diff;
          breakEvenAge = Math.ceil(age + beYears);
        }
      } else if (age > 65) {
        // Late receiver: missed (age-65) years of age65Total
        // annual*y = age65Total*y + age65Total*(age-65)
        // y*(annual - age65Total) = age65Total*(age-65)
        const diff = annual - age65Total;
        if (diff > 0) {
          const beYears = (age65Total * (age - 65)) / diff;
          breakEvenAge = Math.ceil(age + beYears);
        }
      }

      const life = parseInt(lifeExpectancy) || 85;
      const yearsReceiving = Math.max(0, life - age);
      const totalLifetime = annual * yearsReceiving;
      const stdYears = Math.max(0, life - 65);
      const stdLifetime = age65Total * stdYears;
      const vsStd = totalLifetime - stdLifetime;

      return { age, annual, monthly, pct, totalLifetime, vsStd, breakEvenAge };
    });

    const selected = correctedComparison.find(c => c.age === receiveAge);

    return {
      kisoBase, koseiBase, baseTotal,
      annualAmount, monthlyAmount,
      age65Monthly, age65Total,
      comparison: correctedComparison,
      selected,
    };
  }, [kisoMonths, hasKosei, koseiMonths, avgSalary, receiveAge, lifeExpectancy]);

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";
  const lbl = "block text-sm text-gray-600 dark:text-gray-400 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">年金 受給額 簡易シミュレーター</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">老齢基礎年金・老齢厚生年金の概算と、繰上げ・繰下げ受給の損得を比較。</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">加入状況</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>現在の年齢</label>
                  <input type="number" value={currentAge} min="20" max="75" onChange={e => setCurrentAge(e.target.value)} className={inp} />
                </div>
                <div>
                  <label className={lbl}>想定寿命（歳）</label>
                  <input type="number" value={lifeExpectancy} min="65" max="100" onChange={e => setLifeExpectancy(e.target.value)} className={inp} />
                </div>
              </div>
              <div>
                <label className={lbl}>国民年金（基礎年金）加入月数</label>
                <input type="number" value={kisoMonths} min="0" max="480" onChange={e => setKisoMonths(e.target.value)} className={inp} />
                <p className="text-xs text-gray-400 mt-1">満額: 480か月（40年）。20〜60歳まで加入で最大480か月。</p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="hasKosei" checked={hasKosei} onChange={e => setHasKosei(e.target.checked)} className="w-4 h-4 rounded" />
                <label htmlFor="hasKosei" className="text-sm text-gray-600 dark:text-gray-400">厚生年金に加入している（会社員・公務員）</label>
              </div>
              {hasKosei && (
                <div className="space-y-3 pl-1">
                  <div>
                    <label className={lbl}>厚生年金 加入月数（見込み含む）</label>
                    <input type="number" value={koseiMonths} min="0" max="480" onChange={e => setKoseiMonths(e.target.value)} className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>平均標準報酬月額（円）</label>
                    <input type="number" value={avgSalary} onChange={e => setAvgSalary(e.target.value)} className={inp} />
                    <p className="text-xs text-gray-400 mt-1">加入期間中の平均的な月給の目安（ボーナス含む場合は月換算）</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">受給開始年齢を選択</h2>
              <div className="grid grid-cols-4 gap-1.5">
                {RECEIVE_AGES.map(age => (
                  <button type="button" key={age} onClick={() => setReceiveAge(age)}
                    className={`py-2 text-xs rounded-lg font-medium transition-colors ${receiveAge === age ? "bg-kon text-white" : age < 65 ? "bg-gray-50 dark:bg-danger/20 text-danger dark:text-danger border border-gray-200 dark:border-danger hover:bg-gray-50" : age > 65 ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700 hover:bg-green-100" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"}`}>
                    {age}歳{age < 65 ? "↓" : age > 65 ? "↑" : ""}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-2 text-xs text-gray-400">
                <span className="text-danger">↓ 繰上げ（減額）</span>
                <span>標準: 65歳</span>
                <span className="text-green-400">↑ 繰下げ（増額）</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Main result */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">概算受給額（{receiveAge}歳受給開始）</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>老齢基礎年金（65歳ベース）</span>
                  <span>¥{fmt(result.kisoBase)} / 年</span>
                </div>
                {hasKosei && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>老齢厚生年金（65歳ベース）</span>
                    <span>¥{fmt(result.koseiBase)} / 年</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-1">
                  <span>合計（65歳ベース）</span>
                  <span>¥{fmt(result.baseTotal)} / 年（¥{fmt(result.age65Monthly)}/月）</span>
                </div>
                {receiveAge !== 65 && result.selected && (
                  <div className={`flex justify-between border-t pt-2 font-semibold ${receiveAge < 65 ? "text-danger dark:text-danger" : "text-green-600 dark:text-green-400"}`}>
                    <span>{receiveAge < 65 ? "繰上げ" : "繰下げ"}後（{result.selected.pct > 0 ? "+" : ""}{result.selected.pct}%）</span>
                    <span>¥{fmt(result.annualAmount)} / 年</span>
                  </div>
                )}
                <div className="bg-gray-50 dark:bg-kon/20 rounded-lg p-3 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">月額受取見込み</span>
                    <span className="text-3xl font-bold text-kon dark:text-gray-300">¥{fmt(result.monthlyAmount)}</span>
                  </div>
                </div>
                {result.selected && result.selected.breakEvenAge && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {receiveAge < 65 ? `繰上げ損益分岐点: ${result.selected.breakEvenAge}歳（これより長生きすると65歳受給より少なくなります）` : `繰下げ損益分岐点: ${result.selected.breakEvenAge}歳（これ以上生きると65歳受給より多くなります）`}
                  </p>
                )}
              </div>
            </div>

            {/* Comparison table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">繰上げ・繰下げ 比較早見表</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-1 pr-2 text-gray-500 dark:text-gray-400 font-medium">開始</th>
                      <th className="text-right py-1 pr-2 text-gray-500 dark:text-gray-400 font-medium">月額</th>
                      <th className="text-right py-1 pr-2 text-gray-500 dark:text-gray-400 font-medium">増減率</th>
                      <th className="text-right py-1 text-gray-500 dark:text-gray-400 font-medium">損益分岐</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.comparison.filter(c => [60, 62, 65, 67, 70, 72, 75].includes(c.age)).map(c => (
                      <tr key={c.age}
                        className={`border-b border-gray-100 dark:border-gray-700/50 ${receiveAge === c.age ? "bg-gray-50 dark:bg-kon/20 font-semibold" : ""}`}>
                        <td className={`py-1.5 pr-2 ${c.age < 65 ? "text-danger dark:text-danger" : c.age > 65 ? "text-green-600 dark:text-green-400" : "text-gray-700 dark:text-gray-300"}`}>
                          {c.age}歳{c.age === 65 ? "★" : ""}
                        </td>
                        <td className="text-right py-1.5 pr-2 text-gray-700 dark:text-gray-300">¥{fmt(c.monthly)}</td>
                        <td className={`text-right py-1.5 pr-2 ${c.pct < 0 ? "text-danger" : c.pct > 0 ? "text-green-500" : "text-gray-500"}`}>
                          {c.pct === 0 ? "±0%" : c.pct > 0 ? `+${c.pct}%` : `${c.pct}%`}
                        </td>
                        <td className="text-right py-1.5 text-gray-500 dark:text-gray-400">
                          {c.age === 65 ? "−" : c.breakEvenAge ? `${c.breakEvenAge}歳` : "−"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-2">★65歳が標準受給。損益分岐点 = 65歳受給と累計額が並ぶ年齢。</p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <p className="font-semibold">⚠️ ご注意</p>
              <p>このシミュレーターは概算です。実際の年金額は加入記録・生年月日・物価スライドにより異なります。正確な金額は「ねんきん定期便」またはねんきんネットでご確認ください。</p>
              <p>厚生年金の計算式は報酬比例部分の簡易計算（5.481/1000方式）を使用しています。</p>
            </div>
          </div>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 年金 受給額 簡易シミュレーター
        </div>
      </div>
    </div>
  );
}
