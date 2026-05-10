"use client";

import { useState, useCallback, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer,
} from "recharts";
import RelatedTools from "@/components/finance/RelatedTools";
import Mascot, { MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";

const NISA_LIMIT = 18_000_000;
const TAX_RATE = 0.20315;
const SCENARIO_COLORS = ["#3B82F6", "#10B981", "#F59E0B"];
const SCENARIO_NAMES = ["シナリオ1", "シナリオ2", "シナリオ3"];

interface YearData { age: number; year: number; principal: number; value: number; profit: number; remainingNisa: number; }
interface ScenarioResult { rate: number; finalValue: number; totalPrincipal: number; profit: number; taxSaved: number; nisaUsage: number; yearlyData: YearData[]; }

function calcScenario(
  currentAge: number, targetAge: number, initialHolding: number,
  investType: "monthly" | "lump" | "both",
  monthlyAmount: number, lumpAmount: number, annualRate: number,
  nisaType: "tsumitate" | "growth" | "both"
): ScenarioResult {
  if (targetAge <= currentAge) return { rate: annualRate, finalValue: initialHolding, totalPrincipal: initialHolding, profit: 0, taxSaved: 0, nisaUsage: initialHolding, yearlyData: [] };
  const r = annualRate / 100 / 12;
  const annualNisaMax = nisaType === "tsumitate" ? 1_200_000 : nisaType === "growth" ? 2_400_000 : 3_600_000;
  const monthlyNisaMax = annualNisaMax / 12;
  let principal = initialHolding;
  let value = initialHolding;
  let cumulativeNisaUsed = initialHolding;
  if (investType === "lump" || investType === "both") {
    const addLump = Math.min(lumpAmount, Math.max(0, NISA_LIMIT - cumulativeNisaUsed));
    principal += addLump; value += addLump; cumulativeNisaUsed += addLump;
  }
  const yearlyData: YearData[] = [];
  yearlyData.push({ age: currentAge, year: 0, principal, value, profit: 0, remainingNisa: Math.max(0, NISA_LIMIT - cumulativeNisaUsed) });
  for (let y = 1; y <= targetAge - currentAge; y++) {
    for (let m = 0; m < 12; m++) {
      value = value * (1 + r);
      if ((investType === "monthly" || investType === "both") && cumulativeNisaUsed < NISA_LIMIT) {
        const canAdd = Math.min(NISA_LIMIT - cumulativeNisaUsed, monthlyNisaMax, monthlyAmount);
        principal += canAdd; value += canAdd; cumulativeNisaUsed += canAdd;
      }
    }
    yearlyData.push({ age: currentAge + y, year: y, principal, value: Math.round(value), profit: Math.round(value - principal), remainingNisa: Math.max(0, NISA_LIMIT - cumulativeNisaUsed) });
  }
  const finalValue = Math.round(value);
  const profit = Math.round(finalValue - principal);
  return { rate: annualRate, finalValue, totalPrincipal: Math.round(principal), profit, taxSaved: Math.round(Math.max(0, profit) * TAX_RATE), nisaUsage: Math.min(cumulativeNisaUsed, NISA_LIMIT), yearlyData };
}

function fmt(val: number): string { return (val / 10000).toFixed(1); }
function fmtMan(val: number): string { return (val / 10000).toFixed(1) + "万円"; }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-xs">
        <p className="font-bold text-gray-700 mb-2">{label}歳</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="mb-1">
            <span style={{ color: p.color }} className="font-semibold">{p.name}: </span>
            <span>{Number(p.value).toFixed(1)}万円</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function NisaSimulatorClient() {
  const [currentAge, setCurrentAge] = useState(30);
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [targetAge, setTargetAge] = useState(65);
  const [initialHolding, setInitialHolding] = useState(0);
  const [investType, setInvestType] = useState<"monthly" | "lump" | "both">("monthly");
  const [monthlyAmount, setMonthlyAmount] = useState(50000);
  const [lumpAmount, setLumpAmount] = useState(1000000);
  const [rates, setRates] = useState([3, 5, 7]);
  const [nisaType, setNisaType] = useState<"tsumitate" | "growth" | "both">("tsumitate");
  const [tableOpen, setTableOpen] = useState(false);
  const [tableScenario, setTableScenario] = useState(1);
  const resultRef = useRef<HTMLDivElement>(null);

  const scenarios = rates.map((rate) =>
    calcScenario(currentAge, targetAge, initialHolding, investType, monthlyAmount, lumpAmount, rate, nisaType)
  );

  const chartData = scenarios[0].yearlyData.map((yd, idx) => {
    const entry: any = { age: yd.age };
    scenarios.forEach((s, si) => {
      entry["scenario" + si] = parseFloat(((s.yearlyData[idx]?.value ?? 0) / 10000).toFixed(2));
    });
    return entry;
  });

  const tableData = scenarios[tableScenario].yearlyData;

  const handleCopy = useCallback(() => {
    const s = scenarios[1];
    const text = [
      "【新NISAシミュレーター結果】",
      "現在年齢: " + currentAge + "歳 → 目標年齢: " + targetAge + "歳",
      "想定利回り" + rates[1] + "%の場合:",
      "・最終資産額: " + fmtMan(s.finalValue),
      "・元本合計: " + fmtMan(s.totalPrincipal),
      "・運用益: " + fmtMan(s.profit),
      "・節税額: " + fmtMan(s.taxSaved),
      "詳細: https://yamada-tools.jp/tools/nisa-simulator",
    ].join(String.fromCharCode(10));
    navigator.clipboard.writeText(text).then(() => alert("コピーしました！"));
  }, [scenarios, currentAge, targetAge, rates]);

  const handleSaveImage = useCallback(async () => {
    if (!resultRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(resultRef.current, { scale: 2, useCORS: true });
      const link = document.createElement("a");
      link.download = "nisa-simulation.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch { alert("画像の保存に失敗しました。"); }
  }, []);

  const nisaUsageRate = (v: number) => Math.min(100, (v / NISA_LIMIT) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <div className="bg-gradient-to-r from-blue-700 to-kon text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">新NISAシミュレーター</h1>
          </div>
          <p className="text-gin text-sm md:text-base">積立・一括・複数シナリオ対応｜1800万円非課税枠の活用をシミュレーション</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">シミュレーション設定</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                現在の年齢: <span className="text-kon font-bold">{currentAge}歳</span>
              </label>
              <input type="range" min={18} max={65} value={currentAge}
                onChange={e => setCurrentAge(Math.min(Number(e.target.value), targetAge - 1))}
                className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>18歳</span><span>65歳</span></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                運用終了年齢: <span className="text-kon font-bold">{targetAge}歳</span>
              </label>
              <input type="range" min={currentAge + 1} max={99} value={targetAge}
                onChange={e => setTargetAge(Number(e.target.value))}
                className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>{currentAge + 1}歳</span><span>99歳</span></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">既存保有額</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
                <input type="number" min={0} step={10000} value={initialHolding}
                  onChange={e => setInitialHolding(Math.max(0, Number(e.target.value)))}
                  className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-kon focus:border-transparent" />
              </div>
              <p className="text-xs text-gray-400 mt-1">{fmtMan(initialHolding)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">非課税枠の使い方</label>
              <div className="flex flex-wrap gap-2">
                {(["tsumitate", "growth", "both"] as const).map((t) => (
                  <button key={t} onClick={() => setNisaType(t)}
                    className={"px-3 py-1.5 rounded-full text-sm border transition-all " + (nisaType === t ? "bg-kon text-white border-kon" : "bg-white text-gray-700 border-gray-300 hover:border-ai")}>
                    {t === "tsumitate" ? "つみたて枠のみ" : t === "growth" ? "成長投資枠のみ" : "両方同時"}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {nisaType === "tsumitate" ? "年120万円まで" : nisaType === "growth" ? "年240万円まで" : "年360万円まで"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">積立方法</label>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden w-fit">
              {(["monthly", "lump", "both"] as const).map((t) => (
                <button key={t} onClick={() => setInvestType(t)}
                  className={"px-4 py-2 text-sm transition-all " + (investType === t ? "bg-kon text-white" : "bg-white text-gray-600 hover:bg-gray-50")}>
                  {t === "monthly" ? "毎月積立" : t === "lump" ? "一括投資" : "両方"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {(investType === "monthly" || investType === "both") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  毎月の積立額 <span className="text-xs text-gray-400">(上限 ¥100,000)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
                  <input type="number" min={0} max={100000} step={1000} value={monthlyAmount}
                    onChange={e => setMonthlyAmount(Math.min(100000, Math.max(0, Number(e.target.value))))}
                    className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-kon focus:border-transparent" />
                </div>
                <input type="range" min={0} max={100000} step={1000} value={monthlyAmount}
                  onChange={e => setMonthlyAmount(Number(e.target.value))}
                  className="w-full accent-blue-600 mt-2" />
                <p className="text-xs text-gray-400">{fmtMan(monthlyAmount)} / 月</p>
              </div>
            )}
            {(investType === "lump" || investType === "both") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">一括投資額</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
                  <input type="number" min={0} step={100000} value={lumpAmount}
                    onChange={e => setLumpAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-kon focus:border-transparent" />
                </div>
                <p className="text-xs text-gray-400 mt-1">{fmtMan(lumpAmount)}</p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">想定利回り（3シナリオ同時比較）</label>
            <div className="grid grid-cols-3 gap-3">
              {rates.map((rate, i) => (
                <div key={i}>
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SCENARIO_COLORS[i] }}></div>
                    <span className="text-xs text-gray-600">{SCENARIO_NAMES[i]}</span>
                  </div>
                  <div className="relative">
                    <input type="number" min={0.1} max={30} step={0.5} value={rate}
                      onChange={e => {
                        const newRates = [...rates];
                        newRates[i] = Math.max(0.1, Math.min(30, Number(e.target.value)));
                        setRates(newRates);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-kon focus:border-transparent" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="adsense-slot my-6" data-ad-slot="auto"></div>

        {/* Results */}
        <div ref={resultRef}>
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">シミュレーション結果</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border-t-4 p-5" style={{ borderColor: SCENARIO_COLORS[i] }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SCENARIO_COLORS[i] }}></div>
                    <span className="font-bold text-gray-700">{SCENARIO_NAMES[i]}</span>
                    <span className="text-sm font-bold" style={{ color: SCENARIO_COLORS[i] }}>{s.rate}%</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">最終資産額</p>
                      <p className="text-2xl font-bold text-gray-900">{fmt(s.finalValue)}<span className="text-sm font-normal text-gray-600">万円</span></p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">元本合計</p>
                        <p className="font-semibold">{fmt(s.totalPrincipal)}万円</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">運用益</p>
                        <p className="font-semibold text-green-700">+{fmt(s.profit)}万円</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">節税額</p>
                        <p className="font-semibold text-kon">{fmt(s.taxSaved)}万円</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">非課税枠使用</p>
                        <p className="font-semibold text-kon">{fmt(s.nisaUsage)}万円</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>非課税枠使用率</span>
                        <span>{nisaUsageRate(s.nisaUsage)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all" style={{ width: nisaUsageRate(s.nisaUsage) + "%", backgroundColor: SCENARIO_COLORS[i] }}></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{fmt(s.nisaUsage)}万 / 1800万円</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <div>
                <p className="font-bold text-gray-800 mb-1">NISAの節税効果（{rates[1]}%シナリオ）</p>
                <p className="text-gray-700">
                  もし課税口座で運用していた場合、<span className="font-bold text-danger text-lg">{fmtMan(scenarios[1].taxSaved)}</span>の税金がかかっていました。<br />
                  <span className="font-bold text-green-700">NISAなら全額非課税！</span>運用益をまるまる受け取れます。
                </p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">資産推移グラフ</h2>
            <div className="w-full" style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="age" tickFormatter={(v) => v + "歳"} tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => v + "万"} tick={{ fontSize: 11 }} width={55} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(value: string) => {
                    const idx = parseInt(value.replace("scenario", ""));
                    return SCENARIO_NAMES[idx] + " (" + rates[idx] + "%)";
                  }} />
                  <ReferenceLine y={1800} stroke="#EF4444" strokeDasharray="6 3" label={{ value: "1800万 上限", fill: "#EF4444", fontSize: 11 }} />
                  {scenarios.map((_, i) => (
                    <Line key={i} type="monotone" dataKey={"scenario" + i} stroke={SCENARIO_COLORS[i]}
                      strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} name={"scenario" + i} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="adsense-slot my-6" data-ad-slot="auto"></div>

        {/* Yearly table */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <button onClick={() => setTableOpen(!tableOpen)} className="w-full flex items-center justify-between text-left">
            <h2 className="text-lg font-bold text-gray-800">年別推移表</h2>
            <span className="text-gray-400 text-lg">{tableOpen ? "▲" : "▼"}</span>
          </button>
          {tableOpen && (
            <div className="mt-4">
              <div className="flex gap-2 mb-4">
                {scenarios.map((s, i) => (
                  <button key={i} onClick={() => setTableScenario(i)}
                    className={"px-3 py-1.5 rounded-full text-sm transition-all " + (tableScenario === i ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
                    style={tableScenario === i ? { backgroundColor: SCENARIO_COLORS[i] } : {}}>
                    {s.rate}%
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs">
                      <th className="px-3 py-2 text-left">年齢</th>
                      <th className="px-3 py-2 text-left">年数</th>
                      <th className="px-3 py-2 text-right">累計元本</th>
                      <th className="px-3 py-2 text-right">評価額</th>
                      <th className="px-3 py-2 text-right">運用益</th>
                      <th className="px-3 py-2 text-right">残り非課税枠</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-3 py-2 font-medium">{row.age}歳</td>
                        <td className="px-3 py-2 text-gray-500">{row.year}年目</td>
                        <td className="px-3 py-2 text-right">{fmt(row.principal)}万</td>
                        <td className="px-3 py-2 text-right font-semibold">{fmt(row.value)}万</td>
                        <td className="px-3 py-2 text-right text-green-700">+{fmt(row.profit)}万</td>
                        <td className="px-3 py-2 text-right text-kon">{fmt(row.remainingNisa)}万</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Share buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2.5 bg-kon hover:bg-ai text-white rounded-xl text-sm font-medium transition-colors">
            結果をコピー
          </button>
          <button onClick={handleSaveImage}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors">
            画像として保存
          </button>
        </div>

        {/* NISA explanation for AdSense */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">新NISAとは？基本をわかりやすく解説</h2>
          <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
            <p>
              新NISA（少額投資非課税制度）は、2024年1月から始まった新しい投資優遇制度です。
              投資で得た利益（配当金・売却益）が永久に非課税になるという、非常に強力な制度です。
              新NISA シミュレーション 登録不要 無料でお試しいただけます。
            </p>
            <h3 className="font-bold text-gray-800">新NISAの2つの投資枠</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-kon mb-2">つみたて投資枠</h4>
                <ul className="text-sm space-y-1">
                  <li>年間上限: <strong>120万円</strong></li>
                  <li>対象: 長期積立・分散投資に適した投資信託</li>
                  <li>毎月10万円まで積立可能</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-bold text-green-700 mb-2">成長投資枠</h4>
                <ul className="text-sm space-y-1">
                  <li>年間上限: <strong>240万円</strong></li>
                  <li>対象: 株式・投資信託など幅広い商品</li>
                  <li>一括投資にも活用可能</li>
                </ul>
              </div>
            </div>
            <h3 className="font-bold text-gray-800">つみたて投資枠 成長投資枠 どちらがお得？</h3>
            <p>
              つみたて投資枠は手数料が安いインデックス投信が中心で、長期・積立投資に最適です。
              成長投資枠は個別株やETFも選べ、一括投資にも対応しています。
              両方の枠を組み合わせることで、投資スタイルに合わせた柔軟な運用が可能です。
            </p>
            <h3 className="font-bold text-gray-800">生涯非課税限度額: 1,800万円</h3>
            <p>
              新NISAでは、生涯を通じて最大1,800万円まで非課税で運用できます（つみたて投資枠600万円＋成長投資枠1,200万円）。
              この枠を使い切ったら新たな投資はできませんが、売却すれば枠が復活するという特徴もあります。
              新NISA 1800万円 何年で埋まるかは、毎月の積立額によって変わります。
            </p>
            <h3 className="font-bold text-gray-800">新NISA 毎月いくら積み立てれば老後2000万円貯まるか</h3>
            <p>
              年利5%で運用する場合、老後に2,000万円貯めるには毎月約3万円を30年間積み立てる必要があります。
              複利の力により、早く始めるほど資産が大きく育ちます。
              例えば、月10万円を10年間積み立てると、元本1,200万円に対して運用益で約350万円の増加が見込めます。
            </p>
            <h3 className="font-bold text-gray-800">新NISA 節税額 いくら？</h3>
            <p>
              新NISAの節税額は運用益の20.315%（所得税15.315%＋住民税5%）に相当します。
              例えば運用益が100万円なら約20万円、500万円なら約101万円の節税効果があります。
              長期運用で運用益が大きくなるほど、節税効果も大きくなります。
            </p>
            <h3 className="font-bold text-gray-800">シミュレーターの使い方</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>現在の年齢と運用終了年齢を設定</li>
              <li>既に保有している投資額を入力（ない場合は0）</li>
              <li>毎月積立か一括投資かを選択</li>
              <li>非課税枠の使い方を選択（つみたて枠・成長投資枠・両方）</li>
              <li>3つのシナリオの利回りを自由にカスタマイズ</li>
            </ol>
          </div>
        </section>

        <RelatedTools currentTool="/finance/nisa-simulator" />

        <div className="bg-gray-100 rounded-xl p-4 text-xs text-gray-500 mb-8">
          <p className="font-semibold mb-1">免責事項</p>
          <p>このシミュレーターは参考値です。実際の運用成果を保証するものではありません。投資判断はご自身の責任で行ってください。計算結果は概算であり、手数料・税制変更等は考慮していません。</p>
        </div>
        <AdUnit slot="5612038947" format="horizontal" />
      </div>
    </div>
  );
}
