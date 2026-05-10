"use client";
import { useState } from "react";
import { FAQSection } from "@/components/FAQSection";

type LocationType = "都心部" | "観光地" | "郊外" | "地方";
type OperatingDays = "180日以内" | "通年365日";
type MgmtType = "売上%" | "月額";

const SEASONAL_FACTORS: Record<LocationType, number[]> = {
  "都心部": [0.90, 0.90, 1.00, 1.00, 0.95, 0.90, 1.00, 1.00, 0.95, 0.90, 0.85, 0.90],
  "観光地": [0.70, 0.70, 0.80, 0.90, 0.85, 0.90, 1.00, 1.00, 0.90, 0.80, 0.70, 0.75],
  "郊外":   [0.70, 0.70, 0.80, 0.85, 0.85, 0.85, 0.90, 0.90, 0.85, 0.80, 0.70, 0.75],
  "地方":   [0.65, 0.65, 0.75, 0.80, 0.80, 0.80, 0.85, 0.85, 0.80, 0.75, 0.65, 0.70],
};

interface RevenueResult {
  monthlyRevenue: number[];
  annualRevenue: number;
  airbnbTotal: number;
  cleaningTotal: number;
  linenTotal: number;
  mgmtTotal: number;
  fixedTotal: number;
  totalExpenses: number;
  netProfit: number;
}

interface FullResult {
  main: RevenueResult;
  compare: RevenueResult | null;
  initTotal: number;
  roi: number;
  payback: number;
  roi365: number;
  payback365: number;
}

function calcRevenue(params: {
  maxDays: number; location: LocationType; or: number; np: number;
  af: number; cf: number; lc: number; hasMgmt: boolean; mgmtType: MgmtType;
  mgmtAmount: number; fc: number; fu: number;
}): RevenueResult {
  const { maxDays, location, or, np, af, cf, lc, hasMgmt, mgmtType, mgmtAmount, fc, fu } = params;
  const factors = SEASONAL_FACTORS[location];
  const totalFactor = factors.reduce((a, b) => a + b, 0);
  const monthlyDays = factors.map(f => (f / totalFactor) * maxDays);
  const monthlyRevenue = monthlyDays.map(d => d * or * np);
  const annualRevenue = monthlyRevenue.reduce((a, b) => a + b, 0);
  const annualOccupiedNights = monthlyDays.reduce((s, d) => s + d * or, 0);
  const annualStays = annualOccupiedNights / 2;

  const airbnbTotal = annualRevenue * af;
  const cleaningTotal = annualStays * cf;
  const linenTotal = lc * 12;
  let mgmtTotal = 0;
  if (hasMgmt) {
    mgmtTotal = mgmtType === "売上%" ? annualRevenue * (mgmtAmount / 100) : mgmtAmount * 12;
  }
  const fixedTotal = (fc + fu) * 12;
  const totalExpenses = airbnbTotal + cleaningTotal + linenTotal + mgmtTotal + fixedTotal;
  const netProfit = annualRevenue - totalExpenses;
  return { monthlyRevenue, annualRevenue, airbnbTotal, cleaningTotal, linenTotal, mgmtTotal, fixedTotal, totalExpenses, netProfit };
}

const faqItems = [
  {
    question: "民泊の180日制限とは何ですか？",
    answer: "住宅宿泊事業法（民泊新法）により、届出住宅は年間180日（正確には180泊）が営業上限です。起算日は毎年4月1日正午から翌年4月1日正午まで。違反すると業務停止・届出取消の罰則があります。yamada-tools.jpの本ツールでは180日制限と通年365日（旅館業許可必要）の両方を比較計算できます。"
  },
  {
    question: "民泊の平均稼働率はどのくらいですか？",
    answer: "観光庁の調査によると、届出住宅あたりの平均宿泊日数は約103日（年換算）で、上限180日に対し約57%の水準です。都心部や人気観光地では70〜85%まで上がりますが、地方では40〜55%程度にとどまります。yamada-tools.jpの計算機では立地別・稼働率別に詳細にシミュレーションできます。"
  },
  {
    question: "民泊で年間どのくらい稼げますか？",
    answer: "都心部の1泊1万円・稼働率65%・180日営業の物件で年商約120万円が目安。経費（清掃・管理・手数料）を引いた純利益は60〜80万円程度です。yamada-tools.jpの本ツールで物件条件を入力すると、月別売上・年間純利益・投資回収年数まで自動計算します。"
  },
  {
    question: "民泊の初期投資はどれくらい必要ですか？",
    answer: "家具・家電・寝具で50〜100万円、リフォームを含めると200〜500万円が目安です。物件取得費用は別途必要。yamada-tools.jpの本ツールで初期投資額を入力すると、表面利回りと投資回収年数が即計算されます。回収5年以内が目安。"
  },
  {
    question: "民泊の廃業率はどのくらいですか？",
    answer: "観光庁データによると、累計廃業率は約36〜38%。届出は57,512件に対し、実際に稼働しているのは36,851件（2024年11月時点）です。供給過剰や180日制限による収益性の低さが主な要因。yamada-tools.jpの計算機で事前に採算性を確認することが廃業リスク低減につながります。"
  },
  {
    question: "民泊と旅館業・特区民泊の違いは？",
    answer: "①住宅宿泊事業法（民泊新法）：届出制、年180日上限。②旅館業法（簡易宿所等）：許可制、365日営業可、設備要件厳しい。③特区民泊：大田区・大阪・北九州など限定、最低2泊3日、365日営業可。yamada-tools.jpの計算機で180日 vs 365日の収益差をシミュレーションできます。"
  },
  {
    question: "Airbnbの手数料はいくらですか？",
    answer: "Airbnbのホスト手数料は通常3%です（一部のホストは14〜16%のサービス料の場合あり）。Booking.comやVrbo等は15〜20%が一般的。yamada-tools.jpの本ツールでは手数料率を自由に設定でき、複数のプラットフォームのシナリオを比較できます。"
  },
  {
    question: "民泊収益を無料で計算できるツールはありますか？",
    answer: "はい、yamada-tools.jp（山田ツール）の民泊・Airbnb 収益計算機が完全無料・登録不要で使えます。立地・稼働率・経費・初期投資から年間純利益・投資回収年数を自動計算。180日 vs 365日の比較、月別売上グラフも表示します。"
  },
];

export default function MinpakuClient() {
  const [location, setLocation] = useState<LocationType>("都心部");
  const [nightly, setNightly] = useState("10000");
  const [occupancyRate, setOccupancyRate] = useState(65);
  const [operatingDays, setOperatingDays] = useState<OperatingDays>("180日以内");
  const [airbnbFee, setAirbnbFee] = useState("3");
  const [cleaningFee, setCleaningFee] = useState("3000");
  const [linenCost, setLinenCost] = useState("5000");
  const [hasMgmt, setHasMgmt] = useState(false);
  const [mgmtType, setMgmtType] = useState<MgmtType>("売上%");
  const [mgmtAmount, setMgmtAmount] = useState("20");
  const [fixedCondo, setFixedCondo] = useState("15000");
  const [fixedUtility, setFixedUtility] = useState("8000");
  const [initFurniture, setInitFurniture] = useState("500000");
  const [initRenovation, setInitRenovation] = useState("0");
  const [result, setResult] = useState<FullResult | null>(null);

  const handleCalculate = () => {
    const p = {
      location, or: occupancyRate / 100,
      np: Number(nightly) || 0,
      af: (Number(airbnbFee) || 3) / 100,
      cf: Number(cleaningFee) || 0,
      lc: Number(linenCost) || 0,
      hasMgmt, mgmtType,
      mgmtAmount: Number(mgmtAmount) || 0,
      fc: Number(fixedCondo) || 0,
      fu: Number(fixedUtility) || 0,
    };
    const initTotal = (Number(initFurniture) || 0) + (Number(initRenovation) || 0);
    const main = calcRevenue({ ...p, maxDays: operatingDays === "180日以内" ? 180 : 365 });
    const compare = operatingDays === "180日以内" ? calcRevenue({ ...p, maxDays: 365 }) : null;
    const roi = initTotal > 0 && main.netProfit > 0 ? (main.netProfit / initTotal) * 100 : 0;
    const payback = initTotal > 0 && main.netProfit > 0 ? initTotal / main.netProfit : 0;
    const roi365 = compare && initTotal > 0 && compare.netProfit > 0 ? (compare.netProfit / initTotal) * 100 : 0;
    const payback365 = compare && initTotal > 0 && compare.netProfit > 0 ? initTotal / compare.netProfit : 0;
    setResult({ main, compare, initTotal, roi, payback, roi365, payback365 });
  };

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const fmtPct = (n: number) => n.toFixed(1) + "%";
  const maxBar = result ? Math.max(...result.main.monthlyRevenue, 1) : 1;

  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";
  const label = "block text-sm text-gray-600 dark:text-gray-400 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">民泊・Airbnb 収益計算機</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">住宅宿泊事業法の180日制限対応。年間収益・投資回収を中立計算。【2026年版】</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">物件・立地情報</h2>
              <div>
                <label className={label}>所在地</label>
                <select value={location} onChange={e => setLocation(e.target.value as LocationType)} className={inp}>
                  {(["都心部","観光地","郊外","地方"] as LocationType[]).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>年間営業日数</label>
                <select value={operatingDays} onChange={e => setOperatingDays(e.target.value as OperatingDays)} className={inp}>
                  <option>180日以内</option>
                  <option>通年365日</option>
                </select>
                {operatingDays === "180日以内" && (
                  <p className="text-xs text-kon dark:text-kon mt-1">
                    ⚠️ 住宅宿泊事業法により、届出住宅は年間180日が上限です
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">収益設定</h2>
              <div>
                <label className={label}>1泊あたり料金 (円)</label>
                <input type="number" value={nightly} onChange={e => setNightly(e.target.value)} className={inp} />
              </div>
              <div>
                <label className={label}>想定稼働率: <span className="font-semibold text-kon dark:text-gray-300">{occupancyRate}%</span></label>
                <input type="range" min={40} max={90} value={occupancyRate} onChange={e => setOccupancyRate(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>40%</span><span>65%（目安）</span><span>90%</span></div>
              </div>
              <div>
                <label className={label}>Airbnb手数料率 (%)</label>
                <input type="number" value={airbnbFee} onChange={e => setAirbnbFee(e.target.value)} className={inp} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">経費設定</h2>
              <div>
                <label className={label}>清掃費 (円/回)</label>
                <input type="number" value={cleaningFee} onChange={e => setCleaningFee(e.target.value)} className={inp} />
              </div>
              <div>
                <label className={label}>リネン・消耗品費 (円/月)</label>
                <input type="number" value={linenCost} onChange={e => setLinenCost(e.target.value)} className={inp} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="hasMgmt" checked={hasMgmt} onChange={e => setHasMgmt(e.target.checked)} className="w-4 h-4 rounded" />
                <label htmlFor="hasMgmt" className="text-sm text-gray-600 dark:text-gray-400">管理委託あり</label>
              </div>
              {hasMgmt && (
                <div className="pl-4 space-y-2">
                  <div className="flex gap-2">
                    {(["売上%", "月額"] as MgmtType[]).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setMgmtType(t)}
                        className={`flex-1 py-1 rounded text-sm ${mgmtType === t ? "bg-kon text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <input type="number" value={mgmtAmount} onChange={e => setMgmtAmount(e.target.value)}
                    placeholder={mgmtType === "売上%" ? "20 (%)" : "30000 (円/月)"}
                    className={inp} />
                </div>
              )}
              <div>
                <label className={label}>管理費・修繕積立金 (円/月)</label>
                <input type="number" value={fixedCondo} onChange={e => setFixedCondo(e.target.value)} className={inp} />
              </div>
              <div>
                <label className={label}>光熱費 (円/月)</label>
                <input type="number" value={fixedUtility} onChange={e => setFixedUtility(e.target.value)} className={inp} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">初期投資</h2>
              <div>
                <label className={label}>家具・設備費 (円)</label>
                <input type="number" value={initFurniture} onChange={e => setInitFurniture(e.target.value)} className={inp} />
              </div>
              <div>
                <label className={label}>リフォーム費 (円)</label>
                <input type="number" value={initRenovation} onChange={e => setInitRenovation(e.target.value)} className={inp} />
              </div>
            </div>

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-kon hover:bg-ai text-white font-semibold py-3 rounded-xl shadow-sm transition"
            >
              収益を計算する
            </button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                <div className="bg-gray-50 dark:bg-kon/30 rounded-xl p-5 shadow-sm">
                  <h2 className="font-semibold text-kon dark:text-gray-300 mb-3">📊 試算結果（{operatingDays}）</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">年間売上</span><span className="font-bold text-gray-800 dark:text-white">¥{fmt(result.main.annualRevenue)}</span></div>
                    <div className="flex justify-between"><span className="text-sm text-gray-600 dark:text-gray-400">年間経費合計</span><span className="font-semibold text-danger dark:text-danger">▲¥{fmt(result.main.totalExpenses)}</span></div>
                    <div className="border-t border-gray-200 dark:border-kon pt-2 flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">年間純利益</span>
                      <span className={`font-bold text-xl ${result.main.netProfit >= 0 ? "text-green-600 dark:text-green-400" : "text-danger dark:text-danger"}`}>¥{fmt(result.main.netProfit)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400">表面利回り</div>
                        <div className="font-bold text-lg text-kon dark:text-gray-300">{fmtPct(result.roi)}</div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400">投資回収年数</div>
                        <div className="font-bold text-lg text-kon dark:text-gray-300">{result.payback > 0 ? result.payback.toFixed(1) + "年" : "−"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                  <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">経費内訳</h2>
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ["Airbnb手数料", result.main.airbnbTotal],
                        ["清掃費合計", result.main.cleaningTotal],
                        ["リネン・消耗品", result.main.linenTotal],
                        ...(hasMgmt ? [["管理委託費", result.main.mgmtTotal] as [string, number]] : []),
                        ["固定費（管理費＋光熱費）", result.main.fixedTotal],
                      ].map(([l, v]) => (
                        <tr key={String(l)} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-2 text-gray-600 dark:text-gray-400">{String(l)}</td>
                          <td className="py-2 text-right font-medium dark:text-white">¥{fmt(Number(v))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                  <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">月別売上グラフ</h2>
                  <div className="flex items-end gap-1 h-28">
                    {result.main.monthlyRevenue.map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-kon dark:bg-kon rounded-t" style={{ height: `${(v / maxBar) * 100}%` }} />
                        <span className="text-xs text-gray-400">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-1">月（横軸）/ 売上高（縦軸）</p>
                </div>

                {result.compare && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-5 shadow-sm">
                    <h2 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3">📋 180日 vs 通年365日 比較</h2>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-yellow-200 dark:border-yellow-700">
                          <th className="text-left pb-2"></th>
                          <th className="text-right pb-2">180日</th>
                          <th className="text-right pb-2">365日</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["年間売上", `¥${fmt(result.main.annualRevenue)}`, `¥${fmt(result.compare.annualRevenue)}`],
                          ["年間純利益", `¥${fmt(result.main.netProfit)}`, `¥${fmt(result.compare.netProfit)}`],
                          ["表面利回り", fmtPct(result.roi), fmtPct(result.roi365)],
                          ["投資回収", result.payback > 0 ? result.payback.toFixed(1) + "年" : "−", result.payback365 > 0 ? result.payback365.toFixed(1) + "年" : "−"],
                        ].map(([l, v1, v2]) => (
                          <tr key={String(l)} className="border-b border-yellow-100 dark:border-yellow-800">
                            <td className="py-2 text-gray-600 dark:text-gray-400">{l}</td>
                            <td className="py-2 text-right font-medium dark:text-white">{v1}</td>
                            <td className="py-2 text-right font-medium dark:text-white">{v2}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-xs text-kon dark:text-kon mt-2">
                      ※ 通年営業は旅館業法の許可が必要です。無許可営業は行政処分の対象となります。
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-center text-sm text-gray-500 dark:text-gray-400">
                左の項目を入力して「収益を計算する」ボタンを押してください
              </div>
            )}

            <div className="bg-gray-50 dark:bg-danger/20 rounded-xl p-4 text-sm space-y-1">
              <p className="font-semibold text-danger dark:text-gin">⚠️ ご注意ください</p>
              <ul className="list-disc list-inside text-xs text-danger dark:text-gin space-y-1">
                <li>ご近所トラブル・騒音苦情のリスクがあります</li>
                <li>マンションの場合、管理組合の許可が必要なことがあります</li>
                <li>住宅宿泊事業法の届出が必要です（都道府県等への届出）</li>
                <li>この計算は目安です。税務・法的アドバイスは専門家にご相談ください</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <FAQSection faq={faqItems} />
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 民泊・Airbnb 収益計算機
        </div>
      </div>
    </div>
  );
}
