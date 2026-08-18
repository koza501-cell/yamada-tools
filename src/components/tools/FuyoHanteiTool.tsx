"use client";

import { useState, useMemo } from "react";
import { AdUnit } from "@/components/common/AdUnit";
import { calcFuyo, WALLS, type FuyoInput } from "@/lib/fuyo-calculator";

const FAQ = [
  { q: "103万円の壁とはなんですか？", a: "配偶者の年収が103万円以下の場合に、配偶者控除（38万円）が満額適用される境界線です。103万円を超えると所得税が発生し、配偶者控除は縮小していきます。なお2024年以降の税制改正で「123万円の壁」への変更が議論されています。" },
  { q: "130万円の壁を超えるとどうなりますか？", a: "配偶者の健康保険・厚生年金の扶養から外れ、自分で国民健康保険・国民年金に加入が必要になります。年間の社会保険料負担（約20〜30万円）が突然発生するため、手取りが大幅に減ることがあります。" },
  { q: "106万円の壁は誰に関係しますか？", a: "従業員数51人以上の企業（2024年10月〜）に勤務し、週20時間以上・月額賃金8.8万円以上などの条件を満たす場合、社会保険への加入が義務付けられます。これが「106万円の壁」です。" },
  { q: "配偶者特別控除とは何ですか？", a: "配偶者の年収が103万円超〜201万円以下の場合に適用される控除です。年収が増えるほど控除額は段階的に減少します（最大38万円→0万円）。150万円まで働くと満額の38万円が適用されます。" },
  { q: "「年収の壁・支援強化パッケージ」とは？", a: "政府が2023年10月に開始した対策で、106万円・130万円の壁を超えても一定期間は扶養認定が継続される特例措置（事業主確認制度）などが含まれます。詳細は事業主や社会保険事務所に確認してください。" },
];

function WallBar({ income }: { income: number }) {
  const MAX = 220;
  const walls = [0, 100, 103, 106, 130, 150, 201, MAX];
  const colors = ["bg-green-400", "bg-yellow-400", "bg-orange-400", "bg-red-400", "bg-red-500", "bg-purple-400", "bg-gray-300"];
  const labels = ["〜100", "103", "106", "130", "150", "201", "201+"];

  const clampedIncome = Math.min(income, MAX);

  return (
    <div className="w-full">
      <div className="relative h-8 rounded-full overflow-hidden flex">
        {walls.slice(0, -1).map((w, i) => {
          const segStart = (w / MAX) * 100;
          const segEnd = (walls[i + 1] / MAX) * 100;
          return (
            <div key={i} className={`h-full ${colors[i]} opacity-40`} style={{ width: `${segEnd - segStart}%` }} />
          );
        })}
        {/* Indicator */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-gray-900 rounded-full transition-all duration-300"
          style={{ left: `calc(${(clampedIncome / MAX) * 100}% - 2px)` }}
        />
      </div>
      <div className="relative flex justify-between text-xs text-gray-500 mt-1">
        {[100, 103, 106, 130, 150, 201].map(v => (
          <span key={v} className="absolute" style={{ left: `${(v / MAX) * 100}%`, transform: "translateX(-50%)" }}>{v}</span>
        ))}
      </div>
      <div className="mt-4 text-center text-xs text-gray-400">万円</div>
    </div>
  );
}

export default function FuyoHanteiTool() {
  const [income, setIncome] = useState(103);
  const [incomeText, setIncomeText] = useState("103");
  const [ownIncome, setOwnIncome] = useState(500);
  const [spouseAge, setSpouseAge] = useState(35);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const input: FuyoInput = { spouseIncome: income, ownIncome, spouseAge, ownAge: 40, hasDisability: false };
  const result = useMemo(() => calcFuyo(input), [income, ownIncome, spouseAge]);

  const totalDeduction = result.spouseDeduction + result.spouseSpecialDeduction;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">扶養控除判定ツール 2026</h1>
      <p className="text-sm text-gray-500 mb-6">配偶者の年収と「壁」の関係をリアルタイムで可視化</p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 入力 */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">配偶者の年収</label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number" value={incomeText}
                  onChange={e => { setIncomeText(e.target.value); const v = parseInt(e.target.value); if (!isNaN(v)) setIncome(v); }}
                  className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-right font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-500 text-sm">万円</span>
              </div>
              <input
                type="range" min={0} max={220} step={1} value={Math.min(income, 220)}
                onChange={e => { const v = Number(e.target.value); setIncome(v); setIncomeText(String(v)); }}
                className="w-full accent-blue-600"
              />
              <div className="mt-3">
                <WallBar income={income} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">本人（納税者）の年収</label>
                <div className="flex items-center gap-1">
                  <input type="number" min={0} max={2000} step={10} value={ownIncome}
                    onChange={e => setOwnIncome(Number(e.target.value))}
                    className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  <span className="text-sm text-gray-500">万円</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">配偶者の年齢</label>
                <div className="flex items-center gap-1">
                  <input type="number" min={16} max={80} value={spouseAge}
                    onChange={e => setSpouseAge(Number(e.target.value))}
                    className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  <span className="text-sm text-gray-500">歳</span>
                </div>
                {spouseAge >= 70 && <p className="text-xs text-blue-600 mt-1">老人扶養控除 +10万円加算</p>}
              </div>
            </div>
          </div>

          {/* 壁一覧 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-700 text-sm mb-3">年収の壁と現在地</h2>
            <div className="space-y-2">
              {WALLS.map(w => {
                const passed = income >= w.threshold;
                const isCurrent = result.nextWall?.threshold === w.threshold;
                return (
                  <div key={w.threshold}
                    className={`flex items-start gap-3 p-2.5 rounded-lg border transition-colors ${isCurrent ? "border-blue-400 bg-blue-50" : passed ? "border-gray-200 bg-gray-50 opacity-60" : "border-gray-100 bg-white"}`}>
                    <span className={`text-lg mt-0.5 ${passed ? "grayscale opacity-40" : ""}`}>
                      {passed ? "✅" : isCurrent ? "⚠️" : "🔵"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${w.color}`}>{w.label}</span>
                        {isCurrent && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">次の壁</span>}
                        {passed && <span className="text-xs text-gray-400">超過済み</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{w.description}</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-gray-700 flex-shrink-0">{w.threshold}万</span>
                  </div>
                );
              })}
            </div>
          </div>

          <AdUnit slot="5612038947" format="rectangle" className="my-4" />
        </div>

        {/* 結果 */}
        <div className="lg:w-80 xl:w-96 lg:sticky lg:top-4 self-start space-y-4">
          {/* 扶養ステータス */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-700 text-sm mb-3">扶養ステータス</h2>
            <div className="space-y-2">
              {[
                { label: "税法上の配偶者控除", ok: result.isTaxDependent, note: "103万円以下" },
                { label: "社会保険の扶養（130万の壁）", ok: result.isSocialInsDependent, note: "130万円未満" },
                { label: "106万円の壁（大企業）", ok: result.isCompanyAllowanceDependent, note: "106万円未満" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm text-gray-700">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.note}</p>
                  </div>
                  <span className={`text-sm font-bold ${item.ok ? "text-green-600" : "text-red-600"}`}>
                    {item.ok ? "対象" : "対象外"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 控除額 */}
          <div className={`rounded-xl p-4 ${totalDeduction > 0 ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white" : "bg-gray-100"}`}>
            <p className="text-sm font-medium mb-3 opacity-80">適用される控除額（概算）</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${totalDeduction > 0 ? "opacity-80" : "text-gray-500"}`}>配偶者控除</span>
                <span className={`font-bold text-lg font-mono ${totalDeduction > 0 ? "" : "text-gray-700"}`}>
                  {result.spouseDeduction}万円
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${totalDeduction > 0 ? "opacity-80" : "text-gray-500"}`}>配偶者特別控除</span>
                <span className={`font-bold text-lg font-mono ${totalDeduction > 0 ? "" : "text-gray-700"}`}>
                  {result.spouseSpecialDeduction}万円
                </span>
              </div>
              <div className={`flex justify-between items-center pt-2 border-t ${totalDeduction > 0 ? "border-blue-500" : "border-gray-300"}`}>
                <span className={`text-sm font-bold ${totalDeduction > 0 ? "" : "text-gray-700"}`}>合計控除額</span>
                <span className={`font-bold text-2xl font-mono ${totalDeduction > 0 ? "text-yellow-200" : "text-gray-800"}`}>
                  {totalDeduction}万円
                </span>
              </div>
              {result.taxSaving > 0 && (
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs opacity-70">税負担軽減額（概算）</span>
                  <span className="font-bold text-sm font-mono text-green-200">約{result.taxSaving}万円</span>
                </div>
              )}
            </div>
          </div>

          {/* アドバイス */}
          {result.advice.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm font-bold text-amber-800 mb-2">📋 現在の状況</p>
              <p className="text-xs text-amber-700 leading-relaxed">{result.advice[0]}</p>
            </div>
          )}

          {result.nextWall && (
            <div className={`${result.nextWall.bgColor} border rounded-xl p-4`} style={{ borderColor: "currentColor" }}>
              <p className={`text-sm font-bold mb-1 ${result.nextWall.color}`}>
                次の壁まで {result.nextWall.threshold - income} 万円
              </p>
              <p className="text-xs text-gray-600">{result.nextWall.label}: {result.nextWall.description}</p>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400">現在地: {result.currentWall}</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50">
                <span className="font-medium text-gray-800 pr-4">{item.q}</span>
                <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${faqOpen === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {faqOpen === i && <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3 leading-relaxed">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
      <AdUnit slot="5612038947" format="horizontal" className="mt-8" />
    </div>
  );
}
