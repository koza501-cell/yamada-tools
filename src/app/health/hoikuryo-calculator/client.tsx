"use client";
import { useState } from "react";
import { FAQSection } from "@/components/FAQSection";

type ChildAge = 0 | 1 | 2 | 3 | 4 | 5;
type FacilityType = "認可保育所" | "認定こども園" | "幼稚園" | "認可外保育施設" | "企業内保育所";
type ChildOrder = "第1子" | "第2子" | "第3子以上";
type Region = "東京23区" | "政令指定都市" | "中核市" | "その他市町村";

function incomeToWariKin(income: number): number {
  if (income <= 2000000) return 0;
  if (income <= 3000000) return 50000;
  if (income <= 4000000) return 150000;
  if (income <= 5000000) return 220000;
  if (income <= 6000000) return 300000;
  if (income <= 7000000) return 400000;
  if (income <= 8000000) return 500000;
  if (income <= 9000000) return 650000;
  return 800000;
}

const REGION_MULT: Record<Region, number> = {
  "東京23区": 1.3,
  "政令指定都市": 1.1,
  "中核市": 1.0,
  "その他市町村": 0.9,
};

function calcBaseFee(age: ChildAge, wariKin: number): number {
  if (wariKin === 0) return 0;
  if (age >= 3) return 0;
  if (wariKin <= 50000) return age === 0 ? 11500 : 9000;
  if (wariKin <= 150000) return age === 0 ? 23000 : 19000;
  if (wariKin <= 220000) return age === 0 ? 34000 : 27000;
  if (wariKin <= 300000) return age === 0 ? 44000 : 35000;
  return age === 0 ? 57000 : 44000;
}

type JudgeResult = "無償化対象" | "一部補助あり" | "対象外";

interface Result {
  judge: JudgeResult;
  baseFee: number;
  subsidy: number;
  actualBurden: number;
  annualBurden: number;
  wariKin: number;
  isNonTaxable: boolean;
}

const faqItems = [
  {
    question: "保育料の無償化は2026年も続いていますか？",
    answer: "はい、2019年10月から始まった幼児教育・保育の無償化制度は2026年も継続しています。3歳から5歳までの認可保育所・幼稚園・認定こども園は無償、0歳から2歳までは住民税非課税世帯のみ無償です。yamada-tools.jpの本ツールで世帯年収を入力するだけで簡単に判定できます。"
  },
  {
    question: "認可外保育施設の無償化上限はいくらですか？",
    answer: "3歳から5歳は月額37,000円まで、0歳から2歳の住民税非課税世帯は月額42,000円までが無償化対象です。ただし令和6年10月以降、認可外保育施設指導監督基準を満たしていない施設は対象外となりました。山田ツールの本ツールで上限を超えるかどうかも自動判定できます。"
  },
  {
    question: "幼稚園の無償化上限はいくらですか？",
    answer: "新制度未移行の幼稚園は月額25,700円までが無償化対象です。新制度幼稚園・認定こども園は完全無償です。預かり保育を利用する場合は、保育の必要性の認定を受けることで月額11,300円（3-5歳）または16,300円（満3歳）の追加補助が受けられます。yamada-tools.jpで自世帯のケースを試算できます。"
  },
  {
    question: "0歳から2歳の保育料はどう決まりますか？",
    answer: "住民税所得割額（市民税）に基づく階層区分で決まります。世帯年収が高いほど保育料も高くなる「応能負担」制度です。住民税非課税世帯（年収約260万円以下）は無償、それ以外は階層に応じた保育料となります。yamada-tools.jpの本ツールで世帯年収から推定保育料を即計算できます。"
  },
  {
    question: "第2子・第3子の保育料は安くなりますか？",
    answer: "はい、yamada-tools.jpで自動計算しています。第2子は保育料が半額、第3子以降は無償となります（小学校3年生までを上の子としてカウント）。年収360万円未満世帯は第1子の年齢制限なし。多子世帯ほど負担が大幅に軽減される仕組みです。"
  },
  {
    question: "ひとり親世帯は保育料が安くなりますか？",
    answer: "ひとり親世帯は所得計算で配慮があり、実質的な保育料が安くなる場合が多いです。yamada-tools.jpの本ツールでは「ひとり親世帯」にチェックを入れると、収入を70%換算して試算します。詳細は自治体により異なるため、最終確認は市区町村窓口で行ってください。"
  },
  {
    question: "給食費・行事費は無償化に含まれますか？",
    answer: "いいえ、含まれません。無償化の対象は保育料のみで、給食費（副食費・主食費）・通園送迎費・行事費・延長保育料などは別途負担となります。月5,000〜7,000円程度かかるのが一般的です。ただし年収360万円未満世帯と全世帯の第3子以降は副食費が免除されます。"
  },
  {
    question: "保育料を無料で計算できるツールはありますか？",
    answer: "はい、yamada-tools.jp（山田ツール）の保育料・幼稚園費用 無償化判定計算機が完全無料・登録不要で使えます。世帯年収・子供の年齢・施設タイプを入力するだけで、無償化の適用と月額負担額を即座に判定。第2子・第3子割引、ひとり親世帯にも対応しています。"
  },
];

export default function HoikuryoClient() {
  const [age, setAge] = useState<ChildAge>(0);
  const [facility, setFacility] = useState<FacilityType>("認可保育所");
  const [income, setIncome] = useState("5000000");
  const [singleParent, setSingleParent] = useState(false);
  const [childOrder, setChildOrder] = useState<ChildOrder>("第1子");
  const [region, setRegion] = useState<Region>("その他市町村");
  const [result, setResult] = useState<Result | null>(null);

  const handleCalculate = () => {
    const inc = Number(income) || 0;
    const effectiveIncome = singleParent ? inc * 0.7 : inc;
    const wariKin = incomeToWariKin(effectiveIncome);
    const isNonTaxable = wariKin === 0;
    const rm = REGION_MULT[region];

    let baseFee = 0;
    let subsidy = 0;
    let judge: JudgeResult = "対象外";

    if (facility === "認可保育所" || facility === "認定こども園" || facility === "企業内保育所") {
      if (age >= 3) {
        baseFee = 0;
        subsidy = 0;
        judge = "無償化対象";
      } else {
        baseFee = Math.round(calcBaseFee(age, wariKin) * rm);
        if (isNonTaxable) {
          subsidy = baseFee;
          baseFee = 0;
          judge = "無償化対象";
        } else {
          judge = "対象外";
        }
      }
    } else if (facility === "幼稚園") {
      if (age >= 3) {
        const stdFee = Math.round(25700 * rm);
        baseFee = stdFee;
        subsidy = Math.min(stdFee, 25700);
        judge = "一部補助あり";
        if (subsidy >= baseFee) judge = "無償化対象";
      } else {
        baseFee = Math.round(15000 * rm);
        if (isNonTaxable) {
          subsidy = baseFee;
          judge = "無償化対象";
        } else {
          judge = "対象外";
        }
      }
    } else {
      // 認可外
      if (age >= 3) {
        const capSubsidy = 37000;
        baseFee = Math.round(50000 * rm);
        subsidy = Math.min(capSubsidy, baseFee);
        judge = "一部補助あり";
      } else if (isNonTaxable) {
        const capSubsidy = 42000;
        baseFee = Math.round(50000 * rm);
        subsidy = Math.min(capSubsidy, baseFee);
        judge = "一部補助あり";
      } else {
        baseFee = Math.round(50000 * rm);
        subsidy = 0;
        judge = "対象外";
      }
    }

    // Multi-child reduction
    if (childOrder === "第2子") {
      const reduction = Math.round((baseFee - subsidy) * 0.5);
      subsidy += reduction;
    } else if (childOrder === "第3子以上") {
      subsidy = baseFee;
      judge = "無償化対象";
    }

    const actualBurden = Math.max(0, baseFee - subsidy);
    setResult({ judge, baseFee, subsidy, actualBurden, annualBurden: actualBurden * 12, wariKin, isNonTaxable });
  };

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";

  const bannerStyle = result?.judge === "無償化対象"
    ? "bg-green-100 dark:bg-green-900/40 border-green-400 text-green-800 dark:text-green-300"
    : result?.judge === "一部補助あり"
    ? "bg-yellow-100 dark:bg-yellow-900/40 border-yellow-400 text-yellow-800 dark:text-yellow-300"
    : "bg-gray-100 dark:bg-gray-700 border-gray-400 text-gray-700 dark:text-gray-300";

  const bannerIcon = result?.judge === "無償化対象" ? "✅" : result?.judge === "一部補助あり" ? "🔶" : "❌";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">保育料・幼稚園費用 無償化判定計算機</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">2026年版 幼児教育・保育無償化制度に対応。月額負担目安を自動計算。</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">お子さまの情報</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">子供の年齢</label>
                <select value={age} onChange={e => setAge(Number(e.target.value) as ChildAge)} className={inp}>
                  {([0,1,2,3,4,5] as ChildAge[]).map(a => <option key={a} value={a}>{a}歳</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">施設タイプ</label>
                <select value={facility} onChange={e => setFacility(e.target.value as FacilityType)} className={inp}>
                  {(["認可保育所","認定こども園","幼稚園","認可外保育施設","企業内保育所"] as FacilityType[]).map(f => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">第何子か</label>
                <select value={childOrder} onChange={e => setChildOrder(e.target.value as ChildOrder)} className={inp}>
                  {(["第1子","第2子","第3子以上"] as ChildOrder[]).map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">世帯・地域情報</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">世帯年収（両親合計）(円)</label>
                <input type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="例: 5000000" className={inp} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="single" checked={singleParent} onChange={e => setSingleParent(e.target.checked)} className="w-4 h-4 rounded" />
                <label htmlFor="single" className="text-sm text-gray-600 dark:text-gray-400">ひとり親世帯（収入を70%換算）</label>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">地域</label>
                <select value={region} onChange={e => setRegion(e.target.value as Region)} className={inp}>
                  {(["東京23区","政令指定都市","中核市","その他市町村"] as Region[]).map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-sm transition"
            >
              判定する
            </button>
          </div>

          <div className="space-y-4">
            {result ? (
              <>
                <div className={`rounded-xl p-5 border-2 shadow-sm ${bannerStyle}`}>
                  <div className="text-center">
                    <div className="text-3xl mb-1">{bannerIcon}</div>
                    <div className="text-xl font-bold">{result.judge}</div>
                    <div className="text-sm mt-1 opacity-80">
                      {result.judge === "無償化対象" ? "保育料の自己負担はありません" :
                       result.judge === "一部補助あり" ? `月額 ¥${fmt(result.subsidy)} の補助があります` :
                       "無償化・補助の対象外です"}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                  <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">費用内訳</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">月額保育料の目安</span>
                      <span className="font-medium dark:text-white">¥{fmt(result.baseFee)}</span>
                    </div>
                    {result.subsidy > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">無償化・補助額</span>
                        <span className="font-medium text-green-600 dark:text-green-400">▲¥{fmt(result.subsidy)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">実質月額負担</span>
                        <span className={`font-bold text-xl ${result.actualBurden === 0 ? "text-green-600 dark:text-green-400" : "text-gray-800 dark:text-white"}`}>
                          ¥{fmt(result.actualBurden)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">年間負担額</span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">¥{fmt(result.annualBurden)}</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400 mt-3">
                      推定 市民税所得割額: <span className="font-semibold text-blue-700 dark:text-blue-300">約¥{fmt(result.wariKin)}/年</span>
                      {result.isNonTaxable && <span className="ml-2 text-green-600 dark:text-green-400">（非課税世帯）</span>}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-center text-sm text-gray-500 dark:text-gray-400">
                左の項目を入力して「判定する」ボタンを押してください
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-sm space-y-2">
              <p className="font-semibold text-blue-800 dark:text-blue-300">ℹ️ 2026年 幼児教育無償化ポイント</p>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                <li>3〜5歳: 認可保育所・幼稚園・こども園→無償（上限なし）</li>
                <li>0〜2歳: 住民税非課税世帯のみ無償</li>
                <li>認可外: 3-5歳→月3.7万円まで補助</li>
                <li>認可外（0-2歳・非課税）: 月4.2万円まで補助</li>
                <li>第2子50%軽減、第3子以降無償（自治体により異なる）</li>
                <li>令和6年10月以降、指導監督基準未満の認可外は対象外</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300">
              ⚠️ 給食費・雑費は別途かかります（月5,000〜7,000円程度）。正確な保育料はお住まいの市区町村窓口にご確認ください。この計算は目安であり、法的根拠となるものではありません。
            </div>
          </div>
        </div>

        <div className="mt-8">
          <FAQSection faq={faqItems} />
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 保育料・幼稚園費用 無償化判定計算機
        </div>
      </div>
    </div>
  );
}
