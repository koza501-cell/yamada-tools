"use client";
import { useState, useMemo, useRef } from "react";

type InsuranceType = "70%補償" | "50%補償" | "90%補償";

interface TreatmentItem {
  label: string;
  min: number;
  max: number;
  unit: string;
  category: string;
}

const TREATMENTS: TreatmentItem[] = [
  { label: "初診料", min: 1500, max: 3000, unit: "回", category: "一般診察" },
  { label: "再診料", min: 1000, max: 2000, unit: "回", category: "一般診察" },
  { label: "一般健康診断", min: 3000, max: 8000, unit: "回", category: "一般診察" },
  { label: "ワクチン接種（混合）", min: 3000, max: 6000, unit: "回", category: "一般診察" },
  { label: "血液検査（一般）", min: 3000, max: 8000, unit: "回", category: "検査" },
  { label: "血液検査（詳細）", min: 8000, max: 20000, unit: "回", category: "検査" },
  { label: "レントゲン（1枚）", min: 3000, max: 8000, unit: "枚", category: "検査" },
  { label: "エコー検査", min: 5000, max: 15000, unit: "回", category: "検査" },
  { label: "CT検査", min: 30000, max: 80000, unit: "回", category: "検査" },
  { label: "MRI検査", min: 50000, max: 150000, unit: "回", category: "検査" },
  { label: "投薬（抗生物質1週間）", min: 2000, max: 5000, unit: "回", category: "処置・治療" },
  { label: "点滴（1回）", min: 3000, max: 8000, unit: "回", category: "処置・治療" },
  { label: "入院（1日）", min: 5000, max: 20000, unit: "日", category: "処置・治療" },
  { label: "傷の処置・縫合", min: 10000, max: 30000, unit: "回", category: "処置・治療" },
  { label: "避妊手術（メス犬）", min: 30000, max: 80000, unit: "回", category: "手術" },
  { label: "去勢手術（オス犬）", min: 20000, max: 50000, unit: "回", category: "手術" },
  { label: "避妊手術（メス猫）", min: 20000, max: 50000, unit: "回", category: "手術" },
  { label: "去勢手術（オス猫）", min: 15000, max: 30000, unit: "回", category: "手術" },
  { label: "骨折手術", min: 100000, max: 300000, unit: "回", category: "手術" },
  { label: "腫瘍摘出手術", min: 80000, max: 300000, unit: "回", category: "手術" },
  { label: "椎間板ヘルニア手術", min: 200000, max: 500000, unit: "回", category: "手術" },
  { label: "歯石除去（麻酔あり）", min: 20000, max: 50000, unit: "回", category: "手術" },
  { label: "異物除去手術", min: 80000, max: 200000, unit: "回", category: "手術" },
];

const CATEGORIES = [...new Set(TREATMENTS.map(t => t.category))];
const INS_RATE: Record<InsuranceType, number> = { "70%補償": 0.70, "50%補償": 0.50, "90%補償": 0.90 };

interface SelectedRow {
  id: number;
  treatment: string;
  qty: string;
}

export default function DoubutsuIryoClient() {
  const nextId = useRef(2);
  const [rows, setRows] = useState<SelectedRow[]>([{ id: 1, treatment: TREATMENTS[0].label, qty: "1" }]);
  const [hasIns, setHasIns] = useState(false);
  const [insType, setInsType] = useState<InsuranceType>("70%補償");
  const [deductible, setDeductible] = useState("0");
  const [premium, setPremium] = useState("60000");

  const addRow = () => {
    const id = nextId.current++;
    setRows(prev => [...prev, { id, treatment: TREATMENTS[0].label, qty: "1" }]);
  };

  const removeRow = (id: number) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const updateRow = (id: number, field: keyof Omit<SelectedRow, "id">, value: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const result = useMemo(() => {
    let totalMin = 0;
    let totalMax = 0;
    const lineItems = rows.map(row => {
      const t = TREATMENTS.find(tr => tr.label === row.treatment) ?? TREATMENTS[0];
      const qty = Math.max(1, parseInt(row.qty) || 1);
      const lineMin = t.min * qty;
      const lineMax = t.max * qty;
      totalMin += lineMin;
      totalMax += lineMax;
      return { label: t.label, unit: t.unit, qty, lineMin, lineMax };
    });
    const totalMid = Math.round((totalMin + totalMax) / 2);

    const ded = parseFloat(deductible) || 0;
    const rate = INS_RATE[insType];
    const selfPay = hasIns ? Math.round(totalMid * (1 - rate)) + ded : totalMid;
    const saving = totalMid - selfPay;

    const ann = parseFloat(premium) || 0;
    const breakEven = ann > 0 ? Math.round(ann / rate) : 0;
    const shouldInsure = breakEven > 0 && totalMid > breakEven;

    return { lineItems, totalMin, totalMax, totalMid, selfPay, saving, breakEven, shouldInsure };
  }, [rows, hasIns, insType, deductible, premium]);

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">ペット医療費計算機</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">犬・猫の動物病院費用相場確認とペット保険の自己負担額を計算</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">診療内容（複数選択可）</h2>
              {rows.map((row) => {
                const t = TREATMENTS.find(tr => tr.label === row.treatment) ?? TREATMENTS[0];
                return (
                  <div key={row.id} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-1">
                      <select
                        value={row.treatment}
                        onChange={e => updateRow(row.id, "treatment", e.target.value)}
                        className={inp}
                      >
                        {CATEGORIES.map(cat => (
                          <optgroup key={cat} label={`── ${cat}`}>
                            {TREATMENTS.filter(tr => tr.category === cat).map(tr => (
                              <option key={tr.label} value={tr.label}>
                                {tr.label}（¥{fmt(tr.min)}〜¥{fmt(tr.max)}）
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={row.qty}
                          min="1"
                          onChange={e => updateRow(row.id, "qty", e.target.value)}
                          className="w-20 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-white"
                        />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t.unit}</span>
                      </div>
                    </div>
                    {rows.length > 1 && (
                      <button
                        onClick={() => removeRow(row.id)}
                        className="mt-1 text-red-400 hover:text-red-600 text-xl font-bold leading-none"
                        aria-label="削除"
                      >×</button>
                    )}
                  </div>
                );
              })}
              <button
                onClick={addRow}
                className="w-full py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
              >
                ＋ 診療項目を追加
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">ペット保険</h2>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="hasIns" checked={hasIns} onChange={e => setHasIns(e.target.checked)} className="w-4 h-4 rounded" />
                <label htmlFor="hasIns" className="text-sm text-gray-600 dark:text-gray-400">ペット保険に加入している</label>
              </div>
              {hasIns && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">補償率</label>
                    <select value={insType} onChange={e => setInsType(e.target.value as InsuranceType)} className={inp}>
                      {(["70%補償", "50%補償", "90%補償"] as InsuranceType[]).map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">免責金額（円）</label>
                    <input type="number" value={deductible} onChange={e => setDeductible(e.target.value)} placeholder="0" className={inp} />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">年間保険料（加入検討・比較用）</label>
                <input type="number" value={premium} onChange={e => setPremium(e.target.value)} placeholder="60000" className={inp} />
                <p className="text-xs text-gray-400 mt-1">ペット保険の要否判定に使用します</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">費用内訳</h2>
              <div className="space-y-2 text-sm">
                {result.lineItems.map((li, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {li.label}{li.qty > 1 ? `　×${li.qty}${li.unit}` : ""}
                    </span>
                    <span className="dark:text-white">¥{fmt(li.lineMin)}〜¥{fmt(li.lineMax)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-1">
                  <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
                    <span>費用範囲</span>
                    <span>¥{fmt(result.totalMin)}〜¥{fmt(result.totalMax)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">診療費合計（目安）</span>
                    <span className="font-bold text-2xl text-gray-800 dark:text-white">¥{fmt(result.totalMid)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">保険あり/なし 比較</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">保険なし（全額自己負担）</span>
                  <span className="dark:text-white">¥{fmt(result.totalMid)}</span>
                </div>
                {hasIns && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">保険後の自己負担</span>
                      <span className="font-bold text-green-600 dark:text-green-400">¥{fmt(result.selfPay)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">保険による軽減額</span>
                      <span className="text-blue-600 dark:text-blue-400">▲¥{fmt(result.saving)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {parseFloat(premium) > 0 && (
              <div className={`rounded-xl p-4 border ${result.shouldInsure ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700" : "bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-600"}`}>
                <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">
                  {result.shouldInsure ? "💡 保険加入を検討する価値があります" : "💡 ペット保険の要否判定"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  年間保険料 ¥{fmt(parseFloat(premium))} が元を取るには年間医療費が
                  <span className="font-semibold text-gray-800 dark:text-white mx-1">¥{fmt(result.breakEven)}以上</span>
                  必要です。
                </p>
              </div>
            )}

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <p className="font-semibold">⚠️ ご注意</p>
              <p>実際の費用は動物病院により大きく異なります。緊急・夜間は割増料金が発生します。</p>
              <p>複数の動物病院に相談することをお勧めします。</p>
            </div>
          </div>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | ペット医療費計算機
        </div>
      </div>
    </div>
  );
}
