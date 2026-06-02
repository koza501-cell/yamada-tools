"use client";
import { useState, useMemo } from "react";

type BizType = "B2B" | "B2C" | "混合";

const SIMPLIFIED: Record<string, number> = {
  "第1種（卸売）": 0.90,
  "第2種（小売）": 0.80,
  "第3種（製造）": 0.70,
  "第4種（その他）": 0.60,
  "第5種（サービス）": 0.50,
  "第6種（不動産）": 0.40,
};

const SIMPLIFIED_KEYS = Object.keys(SIMPLIFIED);

export default function InvoiceSonekiClient() {
  const [revenue, setRevenue] = useState("5000000");
  const [bizType, setBizType] = useState<BizType>("B2B");
  const [expenses, setExpenses] = useState("2000000");
  const [simplifiedKey, setSimplifiedKey] = useState("第5種（サービス）");
  const [twoRateApply, setTwoRateApply] = useState(true);

  const calc = useMemo(() => {
    const rev = parseFloat(revenue) || 0;
    const exp = parseFloat(expenses) || 0;
    const outTax = (rev / 1.1) * 0.1;
    const inTax = (exp / 1.1) * 0.1;
    const honkoku = Math.max(0, outTax - inTax);
    const kaniRate = SIMPLIFIED[simplifiedKey] ?? 0.5;
    const kani = outTax * (1 - kaniRate);
    const twoRate = outTax * 0.20;
    const registered = [honkoku, kani, ...(twoRateApply ? [twoRate] : [])];
    const best = Math.min(...registered);
    const bestName = twoRateApply && best === twoRate ? "2割特例" : best === kani ? "簡易課税" : "原則課税";
    const clientNow = outTax * 0.20;
    const client2026 = outTax * 0.50;
    const clientFull = outTax;
    let rec = "";
    if (bizType === "B2C") {
      rec = "BtoC主体のため、インボイス未登録でも事業継続リスクは比較的低いです。ただし2026年10月以降の経過措置終了後も状況を確認してください。";
    } else if (bizType === "B2B") {
      rec = "BtoB主体のためインボイス登録を強く推奨します。未登録のままだと取引先の仕入税額控除ができず、取引停止・値下げ要求のリスクがあります。";
    } else {
      rec = "BtoB取引の比率が高い場合はインボイス登録を検討してください。登録する場合の最有利方式は「" + bestName + "」です。";
    }
    return { outTax, inTax, honkoku, kani, twoRate, best, bestName, clientNow, client2026, clientFull, rec };
  }, [revenue, expenses, simplifiedKey, twoRateApply, bizType]);

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";

  const rows = [
    { label: "免税のまま", tax: 0, note: bizType === "B2B" ? "取引リスク高" : "リスク低" },
    { label: "原則課税", tax: calc.honkoku, note: "" },
    { label: "簡易課税", tax: calc.kani, note: `みなし仕入率${Math.round((SIMPLIFIED[simplifiedKey] ?? 0.5) * 100)}%` },
    ...(twoRateApply ? [{ label: "2割特例", tax: calc.twoRate, note: "〜2026/9" }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">インボイス登録 損益判定ツール</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">免税事業者向け：登録すべきか？消費税負担の比較計算</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">入力</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">年間売上高（消費税込）</label>
                <input type="number" value={revenue} onChange={e => setRevenue(e.target.value)} className={inp} placeholder="5000000" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">主な取引先</label>
                <div className="flex gap-2">
                  {(["B2B", "B2C", "混合"] as BizType[]).map(t => (
                    <button type="button" key={t} onClick={() => setBizType(t)}
                      className={"flex-1 py-2 rounded-lg text-sm border transition-colors " + (bizType === t ? "bg-kon text-white border-kon" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600")}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">経費・仕入・外注費等（消費税込）</label>
                <input type="number" value={expenses} onChange={e => setExpenses(e.target.value)} className={inp} placeholder="2000000" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">簡易課税業種</label>
                <select value={simplifiedKey} onChange={e => setSimplifiedKey(e.target.value)} className={inp}>
                  {SIMPLIFIED_KEYS.map(k => (
                    <option key={k} value={k}>{k}（みなし仕入率{Math.round((SIMPLIFIED[k] ?? 0) * 100)}%）</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="twoRate" checked={twoRateApply} onChange={e => setTwoRateApply(e.target.checked)} className="w-4 h-4 rounded" />
                <label htmlFor="twoRate" className="text-sm text-gray-600 dark:text-gray-400">2割特例 適用可能（〜2026年9月）</label>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-kon/20 rounded-xl p-4 text-xs text-kon dark:text-gray-300">
              <p className="font-semibold mb-1">⚠️ 2割特例は2026年9月末で終了</p>
              <p>インボイス制度開始を機に課税事業者になった方のみ適用可。2026年10月以降は経過措置も終了し、取引先は仕入税額控除が受けられなくなります。</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">消費税負担 比較</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left pb-2">方式</th>
                      <th className="text-right pb-2">消費税納税額</th>
                      <th className="text-right pb-2">手取り変化</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => {
                      const isBest = i > 0 && Math.round(row.tax) === Math.round(calc.best);
                      return (
                        <tr key={i} className={"border-b border-gray-100 dark:border-gray-700/50 " + (isBest ? "bg-green-50 dark:bg-green-900/10" : "")}>
                          <td className="py-2 text-gray-700 dark:text-gray-300">
                            {row.label}
                            {row.note && <span className={"ml-1 text-xs " + (i === 0 && bizType === "B2B" ? "text-danger" : "text-gray-400")}>{row.note}</span>}
                            {isBest && <span className="ml-1 text-xs text-green-600 dark:text-green-400">★最安</span>}
                          </td>
                          <td className="py-2 text-right font-medium text-danger dark:text-danger">
                            {i === 0 ? "0円" : fmt(row.tax) + "円"}
                          </td>
                          <td className="py-2 text-right text-gray-600 dark:text-gray-400">
                            {i === 0 ? "基準" : "−" + fmt(row.tax) + "円"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">取引先への影響（未登録継続の場合）</h2>
              <div className="space-y-2 text-xs">
                {[
                  { label: "〜2026年9月（80%控除）", val: calc.clientNow, color: "text-gray-700 dark:text-gray-300" },
                  { label: "2026年10月〜2029年9月（50%控除）", val: calc.client2026, color: "text-kon dark:text-gray-300" },
                  { label: "2029年10月〜（控除なし）", val: calc.clientFull, color: "text-danger dark:text-danger" },
                ].map(r => (
                  <div key={r.label} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{r.label}</span>
                    <span className={r.color}>{fmt(r.val)}円/年</span>
                  </div>
                ))}
                <p className="text-gray-400 mt-1">※取引先が負担する追加コスト（仕入税額控除できない分）</p>
              </div>
            </div>
            <div className={"rounded-xl p-4 border " + (bizType === "B2B" ? "bg-gray-50 dark:bg-danger/20 border-gray-200 dark:border-danger" : "bg-gray-50 dark:bg-kon/20 border-gray-200 dark:border-kon")}>
              <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">あなたへの推奨</p>
              <p className={"text-xs " + (bizType === "B2B" ? "text-danger dark:text-gin" : "text-kon dark:text-gray-300")}>{calc.rec}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300">
              <p className="font-semibold mb-1">⚠️ ご注意</p>
              <p>実際の判断は税理士にご相談ください。本ツールは概算による参考情報です。</p>
            </div>
          </div>
        </div>
        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | インボイス登録 損益判定ツール
        </div>
      </div>
    </div>
  );
}
