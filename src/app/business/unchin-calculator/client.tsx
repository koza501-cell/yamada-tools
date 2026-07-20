"use client";
import { useState } from "react";
import { FAQSection } from "@/components/FAQSection";

type VehicleType = "軽貨物" | "2t車" | "4t車" | "10t車";
type CargoType = "一般荷物" | "精密機器" | "冷凍冷蔵" | "危険物";
type TimeSlot = "通常" | "深夜（22〜5時）+25%" | "早朝+10%";

const VEHICLE_MULT: Record<VehicleType, number> = {
  "軽貨物": 1.0, "2t車": 1.8, "4t車": 2.5, "10t車": 3.5,
};

const CARGO_MULT: Record<CargoType, number> = {
  "一般荷物": 1.0, "精密機器": 1.2, "冷凍冷蔵": 1.3, "危険物": 1.4,
};

const TIME_MULT: Record<TimeSlot, number> = {
  "通常": 1.0, "深夜（22〜5時）+25%": 1.25, "早朝+10%": 1.10,
};

function baseKei(km: number): number {
  if (km <= 10) return 4000;
  if (km <= 30) return 6500;
  if (km <= 50) return 10000;
  if (km <= 100) return 16000;
  return 20000 + (km - 100) * 200;
}

interface Result {
  base: number;
  cargoAdj: number;
  waitCharge: number;
  surcharge: number;
  timeAdj: number;
  hw: number;
  total: number;
  fuelCost: number;
  dailyExpense: number;
  netIncome: number;
  market: string;
}

const faqItems = [
  {
    question: "軽貨物の運賃相場はいくらですか？",
    answer: "距離・荷物・地域により大きく異なりますが、一般的に10km以内で3,000〜5,000円、30km以内で5,000〜8,000円、50km以内で8,000〜12,000円が目安です。yamada-tools.jpの本ツールでは令和6年3月告示の標準的運賃を参考に算出。深夜・早朝・休日割増もワンクリックで反映できます。"
  },
  {
    question: "標準的運賃とは何ですか？",
    answer: "国土交通省が告示する「貨物自動車運送事業の標準的な運賃」のことで、令和6年3月に約8%引き上げ改正されました。荷主と運送事業者の交渉指標として活用され、適正運賃確保が目的です。yamada-tools.jpの計算結果が「相場比較: 安め」と出た場合、標準的運賃を下回っている可能性があります。"
  },
  {
    question: "軽貨物ドライバーの待機時間料金はいくらですか？",
    answer: "標準的運賃では30分を超える待機について時間料金を請求できると定められています。yamada-tools.jpの本ツールでは30分超から1分あたり50円（1時間で3,000円）で計算。長時間待機が頻発する案件では、契約段階で待機料金の取り決めをしておくのが重要です。"
  },
  {
    question: "深夜・早朝・休日の割増は何%ですか？",
    answer: "標準的運賃では深夜（22時〜5時）+30%、休日+50%まで設定可能です。yamada-tools.jpの本ツールでは深夜+25%、早朝+10%、休日+25%、時間指定配送+10%、2人作業+30%、階段作業+20%として計算。実際の割増は契約により異なります。"
  },
  {
    question: "軽貨物ドライバーの手取り目安は1日いくらですか？",
    answer: "yamada-tools.jpの本ツールでは1配送あたりの手取り目安（運賃−燃料費−車両維持費の日割）を算出します。月22日稼働で日当12,000〜18,000円、月収26〜40万円が一般的な目安。複数件こなすことで月収50万円超のドライバーも。本ツールで自分の単価が適正か確認しましょう。"
  },
  {
    question: "燃料費はどう計算すればいいですか？",
    answer: "軽貨物車の実燃費は街乗り12〜15km/L、高速主体で15〜18km/L程度。軽油1Lの全国平均が約180円なので、街乗りで1kmあたり12〜15円、高速主体で10〜12円が目安です。yamada-tools.jpの本ツールでは「燃費（円/km）」に直接単価を入力でき、最新の燃料価格に対応できます。"
  },
  {
    question: "個人事業主の軽貨物ドライバーになるには？",
    answer: "①営業ナンバー（黒ナンバー）の取得、②貨物軽自動車運送事業経営届出書の運輸支局提出、③車両の任意保険・自賠責加入、④事業用ETCカードの準備、が主な手順です。開業費用は約20〜50万円。yamada-tools.jpの計算機で案件ごとの採算性を試算してから請ける癖をつけると確実です。"
  },
  {
    question: "運賃を無料で計算できるツールはありますか？",
    answer: "はい、yamada-tools.jp（山田ツール）の軽貨物・運送業 運賃計算機が完全無料・登録不要で使えます。距離・荷物・待機時間・各種附帯作業を入力するだけで適正運賃を即計算。相場比較・ドライバー手取り目安まで確認できます。"
  },
];

export default function UnchinClient() {
  const [vehicle, setVehicle] = useState<VehicleType>("軽貨物");
  const [distance, setDistance] = useState("20");
  const [cargo, setCargo] = useState<CargoType>("一般荷物");
  const [loadingMin, setLoadingMin] = useState("30");
  const [waitingMin, setWaitingMin] = useState("0");
  const [timeSlot, setTimeSlot] = useState<TimeSlot>("通常");
  const [highway, setHighway] = useState("0");
  const [twoWorkers, setTwoWorkers] = useState(false);
  const [stairs, setStairs] = useState(false);
  const [timeDes, setTimeDes] = useState(false);
  const [holiday, setHoliday] = useState(false);
  const [fuelPerKm, setFuelPerKm] = useState("15");
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState("22");
  const [result, setResult] = useState<Result | null>(null);

  const handleCalculate = () => {
    const km = Number(distance) || 0;
    const wait = Math.max(0, (Number(waitingMin) || 0) - 30);
    const hw = Number(highway) || 0;

    const base = baseKei(km) * VEHICLE_MULT[vehicle];
    const cargoAdj = base * (CARGO_MULT[cargo] - 1);
    const waitCharge = wait * 50;

    let surcharge = 0;
    if (twoWorkers) surcharge += base * 0.30;
    if (stairs) surcharge += base * 0.20;
    if (timeDes) surcharge += base * 0.10;
    if (holiday) surcharge += base * 0.25;

    const timeAdj = (base + cargoAdj + surcharge) * (TIME_MULT[timeSlot] - 1);
    const subtotal = base + cargoAdj + surcharge + timeAdj + waitCharge + hw;
    const total = Math.round(subtotal / 100) * 100;

    // Driver net estimate
    const fuelCost = km * 2 * (Number(fuelPerKm) || 15); // round trip
    const vehicleMaintenance = vehicle === "軽貨物" ? 3000 : vehicle === "2t車" ? 8000 : vehicle === "4t車" ? 12000 : 20000;
    const daysPerMonth = Number(workDaysPerMonth) || 22;
    const dailyExpense = fuelCost + vehicleMaintenance / daysPerMonth;
    const netIncome = total - dailyExpense;

    // Market comparison
    let market = "標準";
    const ref = baseKei(km) * VEHICLE_MULT[vehicle];
    if (total < ref * 0.85) market = "安め";
    else if (total > ref * 1.5) market = "高め";

    setResult({ base, cargoAdj, waitCharge, surcharge, timeAdj, hw, total, fuelCost, dailyExpense, netIncome, market });
  };

  const fmt = (n: number) => Math.round(n).toLocaleString();
  const inp = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white";

  const BREAKDOWNS: [string, number][] = result ? [
    ["基本運賃", result.base],
    ...(CARGO_MULT[cargo] > 1 ? [["荷物割増", result.cargoAdj] as [string, number]] : []),
    ...(result.waitCharge > 0 ? [["待機料金", result.waitCharge] as [string, number]] : []),
    ...(result.surcharge > 0 ? [["附帯作業割増", result.surcharge] as [string, number]] : []),
    ...(result.timeAdj > 0 ? [["時間帯割増", result.timeAdj] as [string, number]] : []),
    ...(result.hw > 0 ? [["高速道路料金", result.hw] as [string, number]] : []),
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">軽貨物・運送業 運賃計算機</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">距離・荷物・待機時間から配送料金の目安を計算。令和6年3月告示の標準的運賃に対応。適正単価の確認に。</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">基本設定</h2>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">輸送タイプ</label>
                <select value={vehicle} onChange={e => setVehicle(e.target.value as VehicleType)} className={inp}>
                  {(["軽貨物","2t車","4t車","10t車"] as VehicleType[]).map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">距離 (km)</label>
                <input type="number" value={distance} onChange={e => setDistance(e.target.value)} className={inp} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">荷物の種類</label>
                <select value={cargo} onChange={e => setCargo(e.target.value as CargoType)} className={inp}>
                  {(["一般荷物","精密機器","冷凍冷蔵","危険物"] as CargoType[]).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">配送時間帯</label>
                <select value={timeSlot} onChange={e => setTimeSlot(e.target.value as TimeSlot)} className={inp}>
                  {(["通常","深夜（22〜5時）+25%","早朝+10%"] as TimeSlot[]).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">積み込み時間 (分)</label>
                  <input type="number" value={loadingMin} onChange={e => setLoadingMin(e.target.value)} className={inp} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">待機時間 (分)</label>
                  <input type="number" value={waitingMin} onChange={e => setWaitingMin(e.target.value)} className={inp} />
                  <p className="text-xs text-gray-400 mt-1">30分超から¥50/分</p>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">高速道路料金 (円)</label>
                <input type="number" value={highway} onChange={e => setHighway(e.target.value)} className={inp} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">附帯作業</h2>
              <div className="space-y-2">
                {([
                  [twoWorkers, setTwoWorkers, "2人作業", "+30%"],
                  [stairs, setStairs, "階段作業", "+20%"],
                  [timeDes, setTimeDes, "時間指定配送", "+10%"],
                  [holiday, setHoliday, "日曜・祝日", "+25%"],
                ] as [boolean, (v: boolean) => void, string, string][]).map(([val, set, lbl, pct]) => (
                  <div key={lbl} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} className="w-4 h-4 rounded" />
                      <label className="text-sm text-gray-600 dark:text-gray-400">{lbl}</label>
                    </div>
                    <span className="text-xs text-kon dark:text-gray-300 font-medium">{pct}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">経費（手取り試算用）</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">燃費 (円/km)</label>
                  <input type="number" value={fuelPerKm} onChange={e => setFuelPerKm(e.target.value)} className={inp} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">月稼働日数</label>
                  <input type="number" value={workDaysPerMonth} onChange={e => setWorkDaysPerMonth(e.target.value)} className={inp} />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-kon hover:bg-ai text-white font-semibold py-3 rounded-xl shadow-sm transition"
            >
              運賃を計算する
            </button>
          </div>

          <div className="space-y-4">
            {result ? (
              <>
                <div className="bg-gray-50 dark:bg-kon/30 rounded-xl p-5 shadow-sm">
                  <h2 className="font-semibold text-kon dark:text-gray-300 mb-3">📊 運賃見積もり</h2>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-kon dark:text-gray-300">¥{fmt(result.total)}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">合計見積運賃</div>
                    <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                      result.market === "安め" ? "bg-gray-50 text-danger dark:bg-danger/40 dark:text-gin" :
                      result.market === "高め" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" :
                      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    }`}>
                      相場比較: {result.market}
                    </div>
                  </div>
                  <table className="w-full text-sm">
                    <tbody>
                      {BREAKDOWNS.map(([l, v]) => (
                        <tr key={l} className="border-b border-gray-200 dark:border-kon">
                          <td className="py-1.5 text-gray-600 dark:text-gray-400">{l}</td>
                          <td className="py-1.5 text-right font-medium dark:text-white">¥{fmt(v)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                  <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">ドライバー手取り目安</h2>
                  <div className="space-y-2 text-sm">
                    {[
                      ["運賃収入", result.total],
                      ["燃料費（往復）", -result.fuelCost],
                      ["車両維持費（日割）", -(result.dailyExpense - result.fuelCost)],
                    ].map(([l, v]) => (
                      <div key={String(l)} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{String(l)}</span>
                        <span className={`font-medium ${Number(v) < 0 ? "text-danger dark:text-danger" : "dark:text-white"}`}>
                          {Number(v) < 0 ? "▲" : ""}¥{fmt(Math.abs(Number(v)))}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">1配送あたり手取り目安</span>
                      <span className={`font-bold text-lg ${result.netIncome >= 0 ? "text-green-600 dark:text-green-400" : "text-danger dark:text-danger"}`}>
                        ¥{fmt(result.netIncome)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-center text-sm text-gray-500 dark:text-gray-400">
                左の項目を入力して「運賃を計算する」ボタンを押してください
              </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm">軽貨物 基本料金目安</h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left pb-1">距離</th>
                    <th className="text-right pb-1">料金目安</th>
                  </tr>
                </thead>
                <tbody>
                  {[["〜10km","3,000〜5,000円"],["11〜30km","5,000〜8,000円"],["31〜50km","8,000〜12,000円"],["51〜100km","12,000〜20,000円"],["100km超","20,000円＋200円/km"]].map(([d, p]) => (
                    <tr key={d} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-1 text-gray-600 dark:text-gray-400">{d}</td>
                      <td className="py-1 text-right text-gray-600 dark:text-gray-400">{p}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
              ※ この料金は目安です。実際の運賃は事業者との交渉で決まります。令和6年3月告示の標準的運賃を参考にしています。
            </p>
          </div>
        </div>

        <div className="mt-8">
          <FAQSection faq={faqItems} />
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          山田ツール | yamada-tools.jp — 無料計算ツール集 | 軽貨物・運送業 運賃計算機
        </div>
      </div>
    </div>
  );
}
