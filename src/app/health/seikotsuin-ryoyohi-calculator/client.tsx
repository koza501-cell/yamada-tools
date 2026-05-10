"use client";
import { useState, useMemo } from "react";

type Symptom = "捻挫（足首・手首等）" | "打撲" | "挫傷（筋肉損傷）" | "骨折（応急処置）" | "脱臼（応急処置）";
type PartCount = "1部位" | "2部位" | "3部位以上";
type InsuranceType = "健康保険（3割）" | "後期高齢者医療（1割）" | "国民健康保険（3割）";

interface SymptomData { initialFee: number; treatMin: number; treatMax: number; }

const SYMPTOMS: Record<Symptom, SymptomData> = {
  "捻挫（足首・手首等）": { initialFee: 1500, treatMin: 600, treatMax: 1200 },
  "打撲": { initialFee: 1500, treatMin: 500, treatMax: 1000 },
  "挫傷（筋肉損傷）": { initialFee: 1500, treatMin: 700, treatMax: 1200 },
  "骨折（応急処置）": { initialFee: 3000, treatMin: 1500, treatMax: 2500 },
  "脱臼（応急処置）": { initialFee: 3000, treatMin: 1500, treatMax: 2500 },
};

const PART_MULT: Record<PartCount, number> = { "1部位": 1.0, "2部位": 1.5, "3部位以上": 2.0 };
const INS_RATE: Record<InsuranceType, number> = { "健康保険（3割）": 0.30, "後期高齢者医療（1割）": 0.10, "国民健康保険（3割）": 0.30 };

interface Addon { label: string; min: number; max: number; }
const ADDONS: Addon[] = [
  { label: "電気光線療法", min: 350, max: 500 },
  { label: "温罨法（温熱）", min: 200, max: 350 },
  { label: "冷罨法（冷却）", min: 200, max: 350 },
  { label: "マッサージ", min: 400, max: 600 },
];

export default function SeikotsuinRyoyohiClient() {
  const [symptom, setSymptom] = useState<Symptom>("捻挫（足首・手首等）");
  const [partCount, setPartCount] = useState<PartCount>("1部位");
  const [addons, setAddons] = useState<string[]>([]);
  const [visits, setVisits] = useState("6");
  const [insType, setInsType] = useState<InsuranceType>("健康保険（3割）");

  const toggleAddon = (label: string) =>
    setAddons(prev => prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]);

  const result = useMemo(() => {
    const sym = SYMPTOMS[symptom];
    const mult = PART_MULT[partCount];
    const rate = INS_RATE[insType];
    const numVisits = Math.max(1, parseFloat(visits) || 1);

    const selectedAddons = ADDONS.filter(a => addons.includes(a.label));
    const addonMin = selectedAddons.reduce((s, a) => s + a.min, 0);
    const addonMax = selectedAddons.reduce((s, a) => s + a.max, 0);

    // First visit includes initial fee
    const firstVisitMin = Math.round(sym.initialFee + sym.treatMin * mult + addonMin);
    const firstVisitMax = Math.round(sym.initialFee + sym.treatMax * mult + addonMax);
    const followMin = Math.round(sym.treatMin * mult + addonMin);
    const followMax = Math.round(sym.treatMax * mult + addonMax);

    const totalMin = firstVisitMin + followMin * Math.max(0, numVisits - 1);
    const totalMax = firstVisitMax + followMax * Math.max(0, numVisits - 1);
    const totalMid = Math.round((totalMin + totalMax) / 2);

    const selfPayMid = Math.round(totalMid * rate);
    const insurancePayMid = totalMid - selfPayMid;

    const perVisitMid = Math.round((Math.round((firstVisitMin + firstVisitMax) / 2) + Math.round((followMin + followMax) / 2) * Math.max(0, numVisits - 1)) / numVisits);

    return { totalMin, totalMax, totalMid, selfPayMid, insurancePayMid, perVisitMid, firstVisitMid: Math.round((firstVisitMin + firstVisitMax) / 2), followMid: Math.round((followMin + followMax) / 2) };
  }, [symptom, partCount, addons, visits, insType]);

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">整骨院・接骨院 療養費目安計算機</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">施術部位・回数から保険適用時の自己負担額を計算</p>

        <div className="bg-gray-50 dark:bg-kon/20 rounded-xl p-4 mb-6 text-sm">
          <p className="font-semibold text-kon dark:text-gray-300 mb-1">ℹ️ 保険適用の条件</p>
          <ul className="text-xs text-kon dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>骨折・脱臼・打撲・捻挫・挫傷の<span className="font-bold">急性の外傷のみ</span>が対象</li>
            <li>慢性的な肩こり・腰痛・疲労は<span className="font-bold">保険適用外</span></li>
            <li>骨折・脱臼は医師の同意が必要（応急処置は不要）</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">症状・施術情報</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">症状・外傷</label>
                <select value={symptom} onChange={e => setSymptom(e.target.value as Symptom)} className={inp}>
                  {(Object.keys(SYMPTOMS) as Symptom[]).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">施術部位数</label>
                <select value={partCount} onChange={e => setPartCount(e.target.value as PartCount)} className={inp}>
                  <option value="1部位">1部位（×1.0）</option>
                  <option value="2部位">2部位（×1.5）</option>
                  <option value="3部位以上">3部位以上（×2.0）</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">施術内容（追加）</label>
                <div className="space-y-2">
                  {ADDONS.map(addon => (
                    <div key={addon.label} className="flex items-center gap-2">
                      <input type="checkbox" id={addon.label} checked={addons.includes(addon.label)} onChange={() => toggleAddon(addon.label)} className="w-4 h-4 rounded" />
                      <label htmlFor={addon.label} className="text-sm text-gray-600 dark:text-gray-400">
                        {addon.label}（+¥{fmt(addon.min)}〜¥{fmt(addon.max)}）
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">通院回数</label>
                <input type="number" value={visits} onChange={e => setVisits(e.target.value)} min="1" placeholder="6" className={inp} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">保険種別</label>
                <select value={insType} onChange={e => setInsType(e.target.value as InsuranceType)} className={inp}>
                  {(Object.keys(INS_RATE) as InsuranceType[]).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">費用試算</h2>
              <div className="space-y-2 text-sm">
                {[
                  ["初回 1回あたり（目安）", result.firstVisitMid],
                  ["2回目以降 1回あたり（目安）", result.followMid],
                ].map(([l, v]) => (
                  <div key={String(l)} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{l}</span>
                    <span className="dark:text-white">¥{fmt(Number(v))}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">費用範囲（{visits}回）</span>
                    <span className="text-xs dark:text-gray-300">¥{fmt(result.totalMin)}〜¥{fmt(result.totalMax)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">総療養費目安</span>
                    <span className="font-bold text-xl text-gray-800 dark:text-white">¥{fmt(result.totalMid)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">保険給付額</span>
                    <span className="text-green-600 dark:text-green-400">▲¥{fmt(result.insurancePayMid)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">自己負担額合計</span>
                    <span className="font-bold text-2xl text-kon dark:text-gray-300">¥{fmt(result.selfPayMid)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 text-xs text-gray-600 dark:text-gray-400 space-y-2">
              <p className="font-semibold text-gray-700 dark:text-gray-300">📋 注意事項</p>
              <p>✅ 領収書の発行を必ず求めてください。</p>
              <p>⚠️ 保険適用外の施術（マッサージ等）を保険請求する不正請求に注意。</p>
              <p>ℹ️ 実際の療養費は施術所・地域により異なります。この計算は目安です。</p>
            </div>
          </div>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 整骨院・接骨院 療養費目安計算機
        </div>
      </div>
    </div>
  );
}
