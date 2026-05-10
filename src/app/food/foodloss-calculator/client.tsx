"use client";
import { useState, useMemo } from "react";

type Industry = "restaurant" | "izakaya" | "cafe" | "supermarket" | "convenience" | "cafeteria" | "hotel";

interface IndustryInfo { label: string; benchmark: number; benchmarkLabel: string }
const INDUSTRY_INFO: Record<Industry, IndustryInfo> = {
  restaurant: { label: "レストラン", benchmark: 12, benchmarkLabel: "10〜15%" },
  izakaya: { label: "居酒屋", benchmark: 13, benchmarkLabel: "10〜15%" },
  cafe: { label: "カフェ", benchmark: 8, benchmarkLabel: "5〜10%" },
  supermarket: { label: "食品スーパー", benchmark: 4, benchmarkLabel: "3〜5%" },
  convenience: { label: "コンビニ", benchmark: 3.5, benchmarkLabel: "3〜4%" },
  cafeteria: { label: "給食・社員食堂", benchmark: 6, benchmarkLabel: "5〜8%" },
  hotel: { label: "ホテル・旅館", benchmark: 10, benchmarkLabel: "8〜12%" },
};

export default function FoodlossClient() {
  const [industry, setIndustry] = useState<Industry>("restaurant");
  const [monthlyStr, setMonthlyStr] = useState("500");
  const [currentRateStr, setCurrentRateStr] = useState("12");
  const [targetRateStr, setTargetRateStr] = useState("5");
  const [costRateStr, setCostRateStr] = useState("30");
  const [lossTypes, setLossTypes] = useState({ cooking: true, leftover: false, unsold: true, over_order: false });

  const calc = useMemo(() => {
    const monthly = parseFloat(monthlyStr) || 0;
    const cur = parseFloat(currentRateStr) / 100 || 0;
    const tgt = Math.min(parseFloat(targetRateStr) / 100 || 0, cur);
    const costRate = (parseFloat(costRateStr) || 30) / 100;
    const bench = INDUSTRY_INFO[industry].benchmark / 100;

    const monthlyLoss = monthly * cur;
    const annualLoss = monthlyLoss * 12;
    const disposalCost = annualLoss * 0.10;
    const totalLoss = annualLoss + disposalCost;
    const missedRevenue = costRate > 0 ? Math.round(annualLoss / costRate) : 0;

    const annualSaving = (cur - tgt) * monthly * 12;
    const totalSaving = annualSaving * 1.10;
    const profitImprove = annualSaving * (1 - costRate) / costRate;

    const foodKg = annualSaving / 500;
    const co2 = Math.round(foodKg * 3.6);

    const diff = cur - bench;
    const vsLabel = diff > 0.02 ? "業界平均より高い（改善余地あり）" : diff < -0.02 ? "業界平均より低い（良好）" : "業界平均並み";
    const vsClass = diff > 0.02 ? "text-danger dark:text-danger" : diff < -0.02 ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400";

    return { monthlyLoss, annualLoss, disposalCost, totalLoss, missedRevenue, annualSaving, totalSaving, profitImprove, co2, vsLabel, vsClass };
  }, [industry, monthlyStr, currentRateStr, targetRateStr, costRateStr]);

  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";
  const fmt = (n: number) => Math.round(n).toLocaleString();

  const hints = [
    { key: "cooking" as const, label: "調理ロス対策", tips: "下処理の歩留まり改善・端材の有効活用（スープ・ソースへの転用）・野菜の皮まで活用するメニュー開発" },
    { key: "leftover" as const, label: "食べ残し対策", tips: "量の見直しとハーフサイズ設定・持ち帰り容器の提供・メニューの写真を実物に近づけて期待値調整" },
    { key: "unsold" as const, label: "売れ残り・期限切れ対策", tips: "閉店前の見切り品値引き・冷凍保存活用・在庫の可視化・仕込み量の柔軟な最適化" },
    { key: "over_order" as const, label: "過剰仕入れ対策", tips: "過去の販売実績からの需要予測・小ロット発注・食材を複数メニューで兼用する設計" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">フードロス コスト計算機</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">廃棄ロス率から年間損失額を計算。削減効果と利益改善を見える化</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">事業の設定</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">業種</label>
                <select value={industry} onChange={e => setIndustry(e.target.value as Industry)} className={inp}>
                  {Object.entries(INDUSTRY_INFO).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}（業界平均: {v.benchmarkLabel}）</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">月間食材仕入れ額（万円）</label>
                <input type="number" value={monthlyStr} onChange={e => setMonthlyStr(e.target.value)} className={inp} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  現在の廃棄ロス率：<span className="font-bold text-gray-800 dark:text-white">{currentRateStr}%</span>
                  <span className={`ml-2 text-xs ${calc.vsClass}`}>（{calc.vsLabel}）</span>
                </label>
                <input type="range" min="0" max="30" step="0.5" value={currentRateStr}
                  onChange={e => setCurrentRateStr(e.target.value)}
                  className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full appearance-none cursor-pointer accent-red-500" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0%</span><span>15%</span><span>30%</span></div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  目標ロス率：<span className="font-bold text-gray-800 dark:text-white">{targetRateStr}%</span>
                </label>
                <input type="range" min="0" max="30" step="0.5" value={targetRateStr}
                  onChange={e => setTargetRateStr(e.target.value)}
                  className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full appearance-none cursor-pointer accent-green-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">原価率（%）</label>
                <input type="number" value={costRateStr} min="5" max="90" onChange={e => setCostRateStr(e.target.value)} className={inp} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">廃棄の主な原因（任意）</h2>
              <div className="grid grid-cols-2 gap-2">
                {hints.map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={lossTypes[key]}
                      onChange={e => setLossTypes(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="w-4 h-4 rounded accent-blue-500" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-danger/20 rounded-xl p-5 border border-gray-200 dark:border-danger">
              <h2 className="font-semibold text-danger dark:text-gin mb-3">現在のフードロス損失</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">月間廃棄額</span><span className="font-semibold text-danger dark:text-danger">{fmt(calc.monthlyLoss)}万円/月</span></div>
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-danger pt-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">年間廃棄損失</span>
                  <span className="font-bold text-2xl text-danger dark:text-danger">{fmt(calc.annualLoss)}万円</span>
                </div>
                <div className="flex justify-between text-xs"><span className="text-gray-500 dark:text-gray-400">廃棄処理コスト（+10%）</span><span className="text-danger">+{fmt(calc.disposalCost)}万円</span></div>
                <div className="flex justify-between text-xs font-semibold"><span className="text-gray-600 dark:text-gray-400">年間総損失</span><span className="text-danger dark:text-danger">{fmt(calc.totalLoss)}万円</span></div>
                <div className="flex justify-between text-xs border-t border-gray-200 dark:border-danger pt-1"><span className="text-gray-500 dark:text-gray-400">逃した売上機会（原価率{costRateStr}%）</span><span className="text-kon">約{fmt(calc.missedRevenue)}万円</span></div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200 dark:border-green-700">
              <h2 className="font-semibold text-green-700 dark:text-green-300 mb-3">目標ロス率達成時の削減効果</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">年間削減額</span>
                  <span className="font-bold text-2xl text-green-600 dark:text-green-400">{fmt(calc.annualSaving)}万円</span>
                </div>
                <div className="flex justify-between text-xs font-semibold border-t border-green-200 dark:border-green-800 pt-1"><span className="text-gray-600 dark:text-gray-400">処理コスト削減込み</span><span className="text-green-600 dark:text-green-400">計 {fmt(calc.totalSaving)}万円</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500 dark:text-gray-400">🌿 CO₂削減効果（概算）</span><span className="text-green-500">{fmt(calc.co2).toLocaleString()} kg-CO₂</span></div>
              </div>
            </div>

            <details className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <summary className="p-4 cursor-pointer font-semibold text-sm text-gray-700 dark:text-gray-300">廃棄種別の改善ヒント ▼</summary>
              <div className="px-4 pb-4 text-xs text-gray-600 dark:text-gray-400 space-y-3">
                {hints.filter(h => lossTypes[h.key]).map(h => (
                  <div key={h.key}>
                    <p className="font-semibold text-gray-700 dark:text-gray-300 mb-0.5">{h.label}</p>
                    <p>{h.tips}</p>
                  </div>
                ))}
                {Object.values(lossTypes).every(v => !v) && <p className="text-gray-400">廃棄の原因を上でチェックするとヒントが表示されます</p>}
              </div>
            </details>
          </div>
        </div>

        <div className="mt-4 bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-xs text-green-700 dark:text-green-300">
          <p className="font-semibold">🌏 フードロス削減は環境と利益の両方に貢献します</p>
          <p>日本の食品廃棄量は年間約523万トン（農水省2022年度推計）。飲食・食品業での取り組みが持続可能な社会に直結します。</p>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | フードロスコスト計算機
        </div>
      </div>
    </div>
  );
}
