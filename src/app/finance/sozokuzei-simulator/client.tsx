"use client";
import { useState, useMemo } from "react";

function calcInheritanceTax(amount: number): number {
  if (amount <= 0) return 0;
  if (amount <= 1000) return amount * 0.10;
  if (amount <= 3000) return amount * 0.15 - 50;
  if (amount <= 5000) return amount * 0.20 - 200;
  if (amount <= 10000) return amount * 0.30 - 700;
  if (amount <= 20000) return amount * 0.40 - 1700;
  if (amount <= 30000) return amount * 0.45 - 2700;
  if (amount <= 60000) return amount * 0.50 - 4200;
  return amount * 0.55 - 7200;
}

export default function SozokuzeiClient() {
  const [cashStr, setCashStr] = useState("2000");
  const [securitiesStr, setSecuritiesStr] = useState("500");
  const [realestateStr, setRealestateStr] = useState("3000");
  const [insuranceStr, setInsuranceStr] = useState("500");
  const [otherStr, setOtherStr] = useState("0");
  const [debtStr, setDebtStr] = useState("0");
  const [funeralStr, setFuneralStr] = useState("150");
  const [hasSpouse, setHasSpouse] = useState(true);
  const [numChildrenStr, setNumChildrenStr] = useState("1");
  const [numParentsStr, setNumParentsStr] = useState("0");
  const [numSiblingsStr, setNumSiblingsStr] = useState("0");
  const [spouseReduction, setSpouseReduction] = useState(true);
  const [smallLand, setSmallLand] = useState(false);

  const calc = useMemo(() => {
    const cash = parseFloat(cashStr) || 0;
    const securities = parseFloat(securitiesStr) || 0;
    const realestate = parseFloat(realestateStr) || 0;
    const insurance = parseFloat(insuranceStr) || 0;
    const other = parseFloat(otherStr) || 0;
    const debt = parseFloat(debtStr) || 0;
    const funeral = Math.min(parseFloat(funeralStr) || 0, 150);
    const children = Math.max(0, parseInt(numChildrenStr) || 0);
    const parents = Math.max(0, parseInt(numParentsStr) || 0);
    const siblings = Math.max(0, parseInt(numSiblingsStr) || 0);

    const primaryCount = children > 0 ? children : parents > 0 ? parents : siblings;
    const legalHeirs = (hasSpouse ? 1 : 0) + primaryCount;

    const basicDeduction = 3000 + 600 * legalHeirs;
    const insExemption = 500 * legalHeirs;
    const taxableInsurance = Math.max(0, insurance - insExemption);
    const landReduction = smallLand ? Math.min(realestate * 0.8, 6400) : 0;

    const grossAssets = cash + securities + realestate + taxableInsurance + other;
    const netAssets = grossAssets - debt - funeral;
    const adjustedAssets = netAssets - landReduction;
    const taxableBase = Math.max(0, adjustedAssets - basicDeduction);

    interface Heir { name: string; share: number; amount: number; tax: number }
    const heirs: Heir[] = [];

    if (taxableBase > 0) {
      const spouseShare = children > 0 ? 0.5 : parents > 0 ? 2 / 3 : siblings > 0 ? 3 / 4 : 1.0;
      if (hasSpouse) {
        const amt = Math.round(taxableBase * spouseShare);
        heirs.push({ name: "配偶者", share: spouseShare, amount: amt, tax: Math.round(calcInheritanceTax(amt)) });
      }
      const otherShare = hasSpouse
        ? (children > 0 ? 0.5 : parents > 0 ? 1 / 3 : 1 / 4)
        : 1.0;
      const count = children > 0 ? children : parents > 0 ? parents : siblings;
      if (count > 0) {
        const share = otherShare / count;
        const label = children > 0 ? "子" : parents > 0 ? "父母" : "兄弟";
        for (let i = 0; i < count; i++) {
          const amt = Math.round(taxableBase * share);
          heirs.push({ name: `${label}${i + 1}`, share, amount: amt, tax: Math.round(calcInheritanceTax(amt)) });
        }
      }
    }

    const totalTax = heirs.reduce((s, h) => s + h.tax, 0);
    const spouseTaxReduction = hasSpouse && spouseReduction ? (heirs.find(h => h.name === "配偶者")?.tax ?? 0) : 0;
    const finalTax = Math.max(0, totalTax - spouseTaxReduction);

    return { basicDeduction, insExemption, grossAssets, netAssets, adjustedAssets, taxableBase, totalTax, finalTax, heirs, legalHeirs, landReduction };
  }, [cashStr, securitiesStr, realestateStr, insuranceStr, otherStr, debtStr, funeralStr,
      hasSpouse, numChildrenStr, numParentsStr, numSiblingsStr, spouseReduction, smallLand]);

  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";
  const numInp = "w-20 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white text-center";
  const fmtM = (v: number) => `${Math.round(v).toLocaleString()}万円`;
  const hasTax = calc.taxableBase > 0;

  const assetFields = [
    { label: "現金・預貯金", val: cashStr, set: setCashStr },
    { label: "有価証券・株式", val: securitiesStr, set: setSecuritiesStr },
    { label: "不動産（評価額）", val: realestateStr, set: setRealestateStr },
    { label: "生命保険金", val: insuranceStr, set: setInsuranceStr },
    { label: "その他の財産", val: otherStr, set: setOtherStr },
    { label: "借金・負債（控除）", val: debtStr, set: setDebtStr },
    { label: "葬儀費用（上限150万）", val: funeralStr, set: setFuneralStr },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">相続税 簡易シミュレーター</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">遺産総額と相続人数を入力するだけで相続税の有無と概算額を計算</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-2">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">遺産の内訳（万円）</h2>
              {assetFields.map(({ label, val, set }) => (
                <div key={label} className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400 w-36 shrink-0">{label}</label>
                  <input type="number" value={val} onChange={e => set(e.target.value)} className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 dark:text-white" />
                  <span className="text-xs text-gray-400 shrink-0">万円</span>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">法定相続人</h2>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="hasSpouse" checked={hasSpouse} onChange={e => setHasSpouse(e.target.checked)} className="w-4 h-4 rounded accent-blue-500" />
                <label htmlFor="hasSpouse" className="text-sm text-gray-600 dark:text-gray-400">配偶者あり</label>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 dark:text-gray-400 w-32 shrink-0">子の人数</label>
                <input type="number" value={numChildrenStr} min="0" max="9" onChange={e => setNumChildrenStr(e.target.value)} className={numInp} />
                <span className="text-xs text-gray-400">人</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 dark:text-gray-400 w-32 shrink-0">父母の人数</label>
                <input type="number" value={numParentsStr} min="0" max="2" onChange={e => setNumParentsStr(e.target.value)} className={numInp} />
                <span className="text-xs text-gray-400">人（子なし場合）</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 dark:text-gray-400 w-32 shrink-0">兄弟姉妹の人数</label>
                <input type="number" value={numSiblingsStr} min="0" max="9" onChange={e => setNumSiblingsStr(e.target.value)} className={numInp} />
                <span className="text-xs text-gray-400">人（子・親なし）</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-2">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">特例の適用</h2>
              <label className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                <input type="checkbox" checked={spouseReduction} onChange={e => setSpouseReduction(e.target.checked)} className="w-4 h-4 mt-0.5 rounded accent-blue-500" />
                配偶者の税額軽減（法定相続分 or 1.6億円まで非課税）
              </label>
              <label className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                <input type="checkbox" checked={smallLand} onChange={e => setSmallLand(e.target.checked)} className="w-4 h-4 mt-0.5 rounded accent-blue-500" />
                小規模宅地等の特例（居住用不動産を最大80%減額）
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`rounded-xl p-6 border-2 text-center ${hasTax ? "bg-gray-50 dark:bg-danger/20 border-danger dark:border-danger" : "bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600"}`}>
              <p className={`text-lg font-bold mb-2 ${hasTax ? "text-danger dark:text-gin" : "text-green-700 dark:text-green-300"}`}>
                {hasTax ? "⚠️ 相続税 あり" : "✅ 相続税 なし"}
              </p>
              {hasTax ? (
                <p className="text-3xl font-bold text-danger dark:text-gin">{fmtM(calc.finalTax)}</p>
              ) : (
                <p className="text-sm text-green-600 dark:text-green-400">遺産額が基礎控除内に収まっています</p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-2 text-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">計算内訳</h2>
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">法定相続人数</span><span className="dark:text-white">{calc.legalHeirs}人</span></div>
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">基礎控除額</span><span className="dark:text-white">{fmtM(calc.basicDeduction)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">生命保険非課税枠</span><span className="dark:text-white">{fmtM(calc.insExemption)}</span></div>
              {calc.landReduction > 0 && <div className="flex justify-between text-green-600 dark:text-green-400"><span>小規模宅地等の減額</span><span>−{fmtM(calc.landReduction)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">遺産純額</span><span className="dark:text-white">{fmtM(calc.netAssets)}</span></div>
              <div className="flex justify-between font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="text-gray-700 dark:text-gray-300">課税遺産総額</span>
                <span className={hasTax ? "text-danger dark:text-danger" : "text-green-600 dark:text-green-400"}>{fmtM(calc.taxableBase)}</span>
              </div>
            </div>

            {hasTax && calc.heirs.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">各相続人の概算税額</h2>
                <div className="space-y-2 text-sm">
                  {calc.heirs.map((h, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{h.name}（法定相続分 {Math.round(h.share * 100)}%）</span>
                      <span className="dark:text-white">{fmtM(h.tax)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-semibold">
                    <span className="text-gray-700 dark:text-gray-300">相続税総額（軽減前）</span>
                    <span className="dark:text-white">{fmtM(calc.totalTax)}</span>
                  </div>
                  {spouseReduction && hasSpouse && (
                    <div className="flex justify-between text-green-600 dark:text-green-400 font-bold">
                      <span>配偶者の税額軽減後</span>
                      <span>{fmtM(calc.finalTax)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <details className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <summary className="p-4 cursor-pointer font-semibold text-sm text-gray-700 dark:text-gray-300">相続税を減らすための対策 ▼</summary>
              <div className="px-4 pb-4 text-xs text-gray-600 dark:text-gray-400 space-y-2">
                <p>・<strong>生前贈与</strong>: 年間110万円の基礎控除で贈与税なし（7年以内の贈与は相続財産に加算注意）</p>
                <p>・<strong>生命保険の活用</strong>: 死亡保険金は「500万円×法定相続人数」が非課税</p>
                <p>・<strong>小規模宅地等の特例</strong>: 居住用土地330㎡まで評価額80%減額</p>
                <p>・<strong>配偶者の税額軽減</strong>: 法定相続分 or 1億6千万円まで非課税</p>
              </div>
            </details>
          </div>
        </div>

        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
          <p className="font-semibold">⚠️ 重要事項</p>
          <p>本シミュレーターは概算です。実際の相続税は財産評価・特例適用・二次相続などにより大きく異なります。相続税がかかる場合、申告期限は相続開始を知った日から<strong>10ヶ月以内</strong>です。税理士への相談を強くお勧めします。</p>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 相続税簡易シミュレーター
        </div>
      </div>
    </div>
  );
}
