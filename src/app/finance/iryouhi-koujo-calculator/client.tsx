"use client";
import { useState, useMemo, useRef } from "react";

type Person = "本人" | "配偶者" | "子" | "親" | "その他家族";
type MedType = "治療費" | "処方薬" | "歯科治療" | "入院費" | "出産費用" | "介護費用" | "通院交通費" | "その他";

interface MedRow {
  id: number;
  person: Person;
  type: MedType;
  amount: string;
  covered: string;
}

const MED_TYPES: MedType[] = ["治療費", "処方薬", "歯科治療", "入院費", "出産費用", "介護費用", "通院交通費", "その他"];
const PERSONS: Person[] = ["本人", "配偶者", "子", "親", "その他家族"];

const TAX_BRACKETS = [
  { limit: 1950000, rate: 0.05 },
  { limit: 3300000, rate: 0.10 },
  { limit: 6950000, rate: 0.20 },
  { limit: 9000000, rate: 0.23 },
  { limit: 18000000, rate: 0.33 },
  { limit: 40000000, rate: 0.40 },
  { limit: Infinity, rate: 0.45 },
];

function getTaxRate(income: number): number {
  for (const b of TAX_BRACKETS) {
    if (income <= b.limit) return b.rate;
  }
  return 0.45;
}

const INELIGIBLE = [
  "美容目的の医療（美容整形等）",
  "健康食品・サプリメント",
  "予防接種（通常）",
  "人間ドック（異常なしの場合）",
  "疲労回復・体力増進の薬",
  "近視・老眼の眼鏡・コンタクト",
];
const ELIGIBLE = [
  "病院・歯科・眼科等の診察費・治療費",
  "医師処方の薬代（処方箋薬）",
  "入院費・手術費",
  "出産費（正常分娩含む）",
  "介護保険サービス費",
  "通院の公共交通費（バス・電車）",
  "医師の指示による松葉杖等",
];

export default function IryouhiKoujoClient() {
  const nextId = useRef(2);
  const [rows, setRows] = useState<MedRow[]>([
    { id: 1, person: "本人", type: "治療費", amount: "", covered: "" },
  ]);
  const [otcAmount, setOtcAmount] = useState("");
  const [hasCheckup, setHasCheckup] = useState(false);
  const [annualIncome, setAnnualIncome] = useState("5000000");
  const [showList, setShowList] = useState(false);

  const addRow = () => {
    const id = nextId.current++;
    setRows(prev => [...prev, { id, person: "本人", type: "治療費", amount: "", covered: "" }]);
  };
  const removeRow = (id: number) => setRows(prev => prev.filter(r => r.id !== id));
  const updateRow = (id: number, field: keyof Omit<MedRow, "id">, value: string) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  const result = useMemo(() => {
    const income = parseFloat(annualIncome) || 0;
    const taxRate = getTaxRate(income);
    const combinedRate = taxRate + 0.10; // income tax + resident tax

    const totalMed = rows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
    const totalCovered = rows.reduce((s, r) => s + (parseFloat(r.covered) || 0), 0);
    const netMed = Math.max(0, totalMed - totalCovered);
    const threshold = Math.min(100000, income * 0.05);
    const deduction1 = Math.min(2000000, Math.max(0, netMed - threshold));
    const taxSave1 = Math.round(deduction1 * combinedRate);

    const otc = parseFloat(otcAmount) || 0;
    const deduction2 = hasCheckup ? Math.min(88000, Math.max(0, otc - 12000)) : 0;
    const taxSave2 = Math.round(deduction2 * combinedRate);

    const useIryouhi = deduction1 >= deduction2;

    return {
      totalMed, totalCovered, netMed, threshold, deduction1, taxSave1,
      otc, deduction2, taxSave2, useIryouhi, taxRate, combinedRate,
    };
  }, [rows, otcAmount, hasCheckup, annualIncome]);

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";
  const lbl = "block text-xs text-gray-500 dark:text-gray-400 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">医療費控除 計算機</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">セルフメディケーション税制との比較付き。家族全員分の医療費を合算できます。</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">基本情報</h2>
              <div>
                <label className={lbl}>年間所得（合計所得金額）円</label>
                <input type="number" value={annualIncome} onChange={e => setAnnualIncome(e.target.value)} className={inp} />
                <p className="text-xs text-gray-400 mt-1">控除下限（10万円 or 所得×5%の低い方）の計算に使用。所得税率: {Math.round(result.taxRate * 100)}%</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">医療費の内訳</h2>
              {rows.map(row => (
                <div key={row.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <div className="flex gap-2 flex-1">
                      <select value={row.person} onChange={e => updateRow(row.id, "person", e.target.value as Person)}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white w-28">
                        {PERSONS.map(p => <option key={p}>{p}</option>)}
                      </select>
                      <select value={row.type} onChange={e => updateRow(row.id, "type", e.target.value as MedType)}
                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white">
                        {MED_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    {rows.length > 1 && (
                      <button onClick={() => removeRow(row.id)} className="ml-2 text-red-400 hover:text-red-600 text-xl font-bold leading-none">×</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={lbl}>医療費（円）</label>
                      <input type="number" placeholder="0" value={row.amount} min="0"
                        onChange={e => updateRow(row.id, "amount", e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div>
                      <label className={lbl}>保険金等補填額（円）</label>
                      <input type="number" placeholder="0" value={row.covered} min="0"
                        onChange={e => updateRow(row.id, "covered", e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white" />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addRow} className="w-full py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
                ＋ 医療費を追加
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300">セルフメディケーション税制</h2>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="hasCheckup" checked={hasCheckup} onChange={e => setHasCheckup(e.target.checked)} className="w-4 h-4 rounded" />
                <label htmlFor="hasCheckup" className="text-sm text-gray-600 dark:text-gray-400">健康診断・予防接種等を受けた（必須条件）</label>
              </div>
              <div>
                <label className={lbl}>特定OTC医薬品の購入額（円）</label>
                <input type="number" value={otcAmount} onChange={e => setOtcAmount(e.target.value)} placeholder="0" className={inp} />
                <p className="text-xs text-gray-400 mt-1">スイッチOTC医薬品（指定医薬品）のみ対象。ドラッグストアのレシートで確認できます。</p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Verdict */}
            {(result.deduction1 > 0 || result.deduction2 > 0) && (
              <div className={`rounded-xl p-5 border-2 ${result.useIryouhi ? "bg-green-50 dark:bg-green-900/20 border-green-400" : "bg-purple-50 dark:bg-purple-900/20 border-purple-400"}`}>
                <p className="text-lg font-bold mb-1">
                  {result.useIryouhi ? "💊 医療費控除の方が有利" : "🏥 セルフメディケーション税制の方が有利"}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  節税額の差: ¥{fmt(Math.abs(result.taxSave1 - result.taxSave2))}
                </p>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">医療費控除</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>医療費合計</span><span>¥{fmt(result.totalMed)}</span>
                </div>
                {result.totalCovered > 0 && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>保険金等補填額</span><span>−¥{fmt(result.totalCovered)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>控除下限（{result.threshold === 100000 ? "10万円" : "所得×5%"}）</span>
                  <span>−¥{fmt(result.threshold)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="flex justify-between font-semibold text-gray-700 dark:text-gray-300">
                    <span>控除額</span><span>¥{fmt(result.deduction1)}</span>
                  </div>
                </div>
                {result.deduction1 > 0 && (
                  <>
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>所得税の節税</span><span>¥{fmt(Math.round(result.deduction1 * result.taxRate))}</span>
                    </div>
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>住民税の節税</span><span>¥{fmt(Math.round(result.deduction1 * 0.10))}</span>
                    </div>
                    <div className="flex justify-between font-bold text-green-700 dark:text-green-300 border-t border-gray-100 dark:border-gray-700 pt-1">
                      <span>合計節税額</span><span>¥{fmt(result.taxSave1)}</span>
                    </div>
                  </>
                )}
                {result.deduction1 === 0 && result.netMed > 0 && (
                  <p className="text-xs text-gray-400">医療費（補填後）が控除下限 ¥{fmt(result.threshold)} に達していません。あと ¥{fmt(result.threshold - result.netMed)} 必要です。</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">セルフメディケーション税制</h2>
              <div className="space-y-2 text-sm">
                {!hasCheckup && (
                  <p className="text-xs text-orange-500">※健康診断等の受診がない場合は利用できません</p>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>OTC薬購入額</span><span>¥{fmt(result.otc)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>控除下限（1.2万円）</span><span>−¥12,000</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="flex justify-between font-semibold text-gray-700 dark:text-gray-300">
                    <span>控除額（上限8.8万円）</span><span>¥{fmt(result.deduction2)}</span>
                  </div>
                </div>
                {result.deduction2 > 0 && (
                  <div className="flex justify-between font-bold text-green-700 dark:text-green-300">
                    <span>合計節税額</span><span>¥{fmt(result.taxSave2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Eligible list accordion */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <button onClick={() => setShowList(!showList)}
                className="w-full flex justify-between items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                <span>医療費控除の対象・非対象 早見表</span>
                <span>{showList ? "▲" : "▼"}</span>
              </button>
              {showList && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">✓ 対象</p>
                    <ul className="space-y-1">
                      {ELIGIBLE.map(e => <li key={e} className="text-xs text-gray-600 dark:text-gray-400">・{e}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-500 dark:text-red-400 mb-1">✗ 非対象</p>
                    <ul className="space-y-1">
                      {INELIGIBLE.map(e => <li key={e} className="text-xs text-gray-600 dark:text-gray-400">・{e}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-sm text-gray-600 dark:text-gray-400">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">確定申告での申請方法</p>
              <p className="text-xs">医療費控除は年末調整では申告できません。翌年2月16日〜3月15日に確定申告が必要です。医療費の領収書を5年間保管してください（提出不要・保管義務）。</p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <p className="font-semibold">⚠️ ご注意</p>
              <p>実際の計算は税理士か税務署にご確認ください。健康保険の高額療養費支給額は医療費から控除する必要があります。</p>
            </div>
          </div>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 医療費控除 計算機
        </div>
      </div>
    </div>
  );
}
