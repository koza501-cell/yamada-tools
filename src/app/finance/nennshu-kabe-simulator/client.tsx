"use client";
import { useState, useMemo } from "react";

type CompanySize = "large" | "small";

interface HeadOption { key: string; label: string; rate: number; noDeduction?: boolean }
const HEAD_OPTIONS: HeadOption[] = [
  { key: "300", label: "〜300万円（税率5%）", rate: 0.05 },
  { key: "500", label: "400〜550万円（税率10%）", rate: 0.10 },
  { key: "600", label: "600〜700万円（税率20%）", rate: 0.20 },
  { key: "800", label: "700〜900万円（税率23%）", rate: 0.23 },
  { key: "1000", label: "900〜1800万円（税率33%）", rate: 0.33 },
  { key: "1100", label: "1,100万円超（配偶者控除なし）", rate: 0.33, noDeduction: true },
];

interface Wall { income: number; name: string; desc: string; loss: number; crossed: boolean }

export default function NennshuKabeClient() {
  const [spouseIncome, setSpouseIncome] = useState(100);
  const [companySize, setCompanySize] = useState<CompanySize>("large");
  const [headKey, setHeadKey] = useState("500");

  const calc = useMemo(() => {
    const inc = spouseIncome;
    const opt = HEAD_OPTIONS.find(o => o.key === headKey) ?? HEAD_OPTIONS[1];
    const headRate = opt.rate;
    const noDeduction = !!opt.noDeduction;

    const getDeduction = (i: number): number => {
      if (noDeduction) return 0;
      if (i <= 123) return 38;
      if (i <= 130) return 38;
      if (i <= 136) return 36;
      if (i <= 141) return 31;
      if (i <= 146) return 26;
      if (i <= 151) return 21;
      if (i <= 156) return 16;
      if (i <= 162) return 11;
      if (i <= 168) return 6;
      if (i <= 176) return 3;
      return 0;
    };

    const deduction = getDeduction(inc);
    const headTaxSaving = Math.round(deduction * (headRate + 0.10) * 10) / 10;

    const crossed98 = inc > 98;
    const crossed106 = companySize === "large" && inc > 106;
    const crossed123 = inc > 123;
    const crossed130 = inc > 130;
    const hasSocialIns = crossed106 || (companySize === "small" && crossed130);

    const spSocialIns = hasSocialIns ? Math.round(inc * 0.145 * 10) / 10 : 0;
    const spResidentTax = crossed98 ? Math.round(Math.max(0, inc - 98) * 0.10 * 10) / 10 : 0;
    const spIncomeTax = crossed123 ? Math.round(Math.max(0, inc - 113) * 0.05 * 10) / 10 : 0;
    const spNet = Math.round((inc - spSocialIns - spResidentTax - spIncomeTax) * 10) / 10;

    const fullDeduction = noDeduction ? 0 : 38;
    const lostDeduction = Math.max(0, fullDeduction - deduction);
    const headTaxIncrease = Math.round(lostDeduction * (headRate + 0.10) * 10) / 10;

    const walls: Wall[] = [
      { income: 98, name: "98万円の壁", desc: "住民税が発生", loss: 0.5, crossed: crossed98 },
      ...(companySize === "large" ? [{ income: 106, name: "106万円の壁", desc: "社会保険加入（51人以上の企業）", loss: Math.round(106 * 0.145 * 10) / 10, crossed: crossed106 }] : []),
      { income: 123, name: "123万円の壁", desc: "配偶者控除消滅・所得税発生（2025年改正）", loss: Math.round(38 * (headRate + 0.10) * 10) / 10, crossed: crossed123 },
      ...(companySize === "small" ? [{ income: 130, name: "130万円の壁", desc: "社会保険加入（全企業対象）", loss: Math.round(130 * 0.145 * 10) / 10, crossed: crossed130 }] : []),
      { income: 150, name: "150万円の壁", desc: "配偶者特別控除が段階的に減少", loss: 0, crossed: inc > 150 },
    ];

    return { deduction, headTaxSaving, hasSocialIns, spSocialIns, spResidentTax, spIncomeTax, spNet, headTaxIncrease, walls, crossed98, crossed106, crossed123, crossed130 };
  }, [spouseIncome, companySize, headKey]);

  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";
  const n = (v: number) => (Math.round(Math.abs(v) * 10) / 10).toLocaleString();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">年収の壁 シミュレーター</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">【2025年改正・123万円対応】パート・配偶者の扶養と損益を正確に計算</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">配偶者（パート）の設定</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  配偶者の年収：<span className="font-bold text-xl text-gray-800 dark:text-white">{spouseIncome}万円</span>
                </label>
                <input type="range" min="0" max="250" step="1" value={spouseIncome}
                  onChange={e => setSpouseIncome(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full appearance-none cursor-pointer accent-blue-500" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0万円</span><span>125万円</span><span>250万円</span>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {[98, 106, 123, 130, 150, 180].map(v => (
                    <button key={v} onClick={() => setSpouseIncome(v)}
                      className={`text-xs px-2 py-1 rounded border transition-colors ${spouseIncome === v ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-400"}`}>
                      {v}万
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">勤務先の従業員規模</label>
                <select value={companySize} onChange={e => setCompanySize(e.target.value as CompanySize)} className={inp}>
                  <option value="large">51人以上（106万円の壁あり）</option>
                  <option value="small">50人以下（130万円の壁のみ）</option>
                </select>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">世帯主の設定</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">世帯主の年収（配偶者控除の計算に使用）</label>
                <select value={headKey} onChange={e => setHeadKey(e.target.value)} className={inp}>
                  {HEAD_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">壁チェック（現在 {spouseIncome}万円）</h2>
              <div className="space-y-2">
                {calc.walls.map((w) => (
                  <div key={w.name} className={`p-3 rounded-lg border ${w.crossed ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700" : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-gray-800 dark:text-white">{w.crossed ? "⚠️" : "✅"} {w.name}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${w.crossed ? "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300" : "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300"}`}>
                        {w.crossed ? "超過" : "以内"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{w.desc}</p>
                    {w.crossed && w.loss > 0 && <p className="text-xs text-red-600 dark:text-red-400 mt-1">年間損失目安: 約{n(w.loss)}万円</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">収支の内訳</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">配偶者の収入</span><span className="text-green-600 dark:text-green-400">+{spouseIncome}万円</span></div>
                {calc.spSocialIns > 0 && <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">社会保険料（配偶者）</span><span className="text-red-500">−{n(calc.spSocialIns)}万円</span></div>}
                {calc.spIncomeTax > 0 && <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">所得税（配偶者）</span><span className="text-red-500">−{n(calc.spIncomeTax)}万円</span></div>}
                {calc.spResidentTax > 0 && <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">住民税（配偶者）</span><span className="text-red-500">−{n(calc.spResidentTax)}万円</span></div>}
                {calc.headTaxIncrease > 0 && <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">世帯主の税負担増（控除減）</span><span className="text-red-500">−{n(calc.headTaxIncrease)}万円</span></div>}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">配偶者の実質手取り</span>
                    <span className="font-bold text-2xl text-gray-800 dark:text-white">{n(calc.spNet)}万円</span>
                  </div>
                </div>
                {calc.headTaxSaving > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 text-xs border-t border-gray-100 dark:border-gray-700 pt-2">
                    <span>世帯主の配偶者控除減税（参考）</span><span>+{n(calc.headTaxSaving)}万円/年</span>
                  </div>
                )}
              </div>
            </div>

            <div className={`rounded-xl p-4 border ${calc.hasSocialIns ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700" : calc.crossed123 ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700" : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"}`}>
              <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">💡 アドバイス</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {!calc.crossed98 && "98万円以内なら住民税も発生せず、扶養メリットを最大限享受できます。"}
                {calc.crossed98 && !calc.crossed106 && !calc.crossed123 && companySize === "large" && `106万円の壁まであと${106 - spouseIncome}万円。社会保険加入の損益分岐点を確認しましょう。`}
                {calc.crossed98 && !calc.crossed123 && companySize === "small" && `123万円の壁まであと${123 - spouseIncome}万円。配偶者控除の恩恵が続きます。`}
                {calc.crossed123 && !calc.hasSocialIns && "配偶者控除が段階的に減少中。収入を抑えるか、160万円以上を目指すかを検討しましょう。"}
                {calc.hasSocialIns && "社会保険加入中。将来の厚生年金受給額が増えます。年収160万円以上を目指すと手取りの逆転点を超えやすくなります。"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700 text-xs text-blue-700 dark:text-blue-400 space-y-1">
          <p className="font-semibold text-sm">📋 2025年税制改正のポイント</p>
          <p>・基礎控除が48万円→58万円に引き上げ（10万円増）</p>
          <p>・配偶者控除の適用上限が<strong>103万円→123万円</strong>に拡大（合計所得68万円以下）</p>
          <p>・社会保険の壁（106万・130万円）は変更なし</p>
        </div>

        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300">
          <p className="font-semibold">⚠️ ご注意</p>
          <p>本シミュレーターは概算です。実際の税額は所得控除・自治体・勤務条件により異なります。詳細は税務署・社会保険労務士にご相談ください。</p>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 年収の壁シミュレーター
        </div>
      </div>
    </div>
  );
}
