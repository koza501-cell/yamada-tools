"use client";
import { useState, useMemo } from "react";

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function fmtPrice(n: number) { return fmt(n) + "円"; }

const SUNSHINE: Record<string, number> = {
  北海道: 1241, 青森: 1282, 岩手: 1350, 宮城: 1348, 秋田: 1209, 山形: 1357, 福島: 1400,
  茨城: 1408, 栃木: 1407, 群馬: 1452, 埼玉: 1415, 千葉: 1398, 東京: 1369, 神奈川: 1360,
  新潟: 1231, 富山: 1255, 石川: 1266, 福井: 1289, 山梨: 1561, 長野: 1460, 岐阜: 1395,
  静岡: 1474, 愛知: 1388, 三重: 1394, 滋賀: 1351, 京都: 1366, 大阪: 1344, 兵庫: 1388,
  奈良: 1388, 和歌山: 1452, 鳥取: 1288, 島根: 1286, 岡山: 1411, 広島: 1373, 山口: 1382,
  徳島: 1427, 香川: 1443, 愛媛: 1402, 高知: 1462, 福岡: 1394, 佐賀: 1399, 長崎: 1392,
  熊本: 1438, 大分: 1389, 宮崎: 1516, 鹿児島: 1497, 沖縄: 1497,
};

const PREFECTURES = Object.keys(SUNSHINE);

const ROOF_DIRECTIONS = [
  { label: "南向き（最適）", factor: 1.0 },
  { label: "南東・南西向き", factor: 0.85 },
  { label: "東・西向き", factor: 0.70 },
  { label: "北向き", factor: 0.55 },
];

const ROOF_ANGLES = [
  { label: "30度（最適）", factor: 1.0 },
  { label: "20度", factor: 0.95 },
  { label: "10度", factor: 0.85 },
  { label: "フラット屋根", factor: 0.75 },
];

const PANEL_TYPES = [
  { label: "単結晶シリコン（高効率）", efficiency: 0.20 },
  { label: "多結晶シリコン（標準）", efficiency: 0.17 },
  { label: "薄膜系（低コスト）", efficiency: 0.13 },
];

export default function SolarClient() {
  const [capacity, setCapacity] = useState(5);
  const [prefecture, setPrefecture] = useState("東京");
  const [roofDir, setRoofDir] = useState(0);
  const [roofAngle, setRoofAngle] = useState(0);
  const [panelType, setPanelType] = useState(0);
  const [installCost, setInstallCost] = useState("1500000");
  const [subsidy, setSubsidy] = useState("0");
  const [electricityRate, setElectricityRate] = useState("31");
  const [fitRate, setFitRate] = useState("16");
  const [selfRatio, setSelfRatio] = useState(30);
  const [degradation, setDegradation] = useState("0.5");
  const [showBattery, setShowBattery] = useState(false);
  const batteryCost = 700000;

  const r = useMemo(() => {
    const sun = SUNSHINE[prefecture] ?? 1369;
    const dirFactor = ROOF_DIRECTIONS[roofDir].factor;
    const angleFactor = ROOF_ANGLES[roofAngle].factor;
    const panelEff = PANEL_TYPES[panelType].efficiency;
    const deg = parseFloat(degradation) / 100 || 0.005;

    const annualGen = capacity * sun * dirFactor * angleFactor;
    const selfConsumption = annualGen * (selfRatio / 100);
    const saleGen = annualGen * (1 - selfRatio / 100);

    const elecRate = parseFloat(electricityRate) || 31;
    const fit = parseFloat(fitRate) || 16;
    const ic = parseFloat(installCost) || 1500000;
    const sub = parseFloat(subsidy) || 0;

    const annualSave = selfConsumption * elecRate;
    const annualSale = saleGen * fit;
    const annualRevenue = annualSave + annualSale;
    const netCost = ic - sub;
    const paybackYears = annualRevenue > 0 ? netCost / annualRevenue : 999;

    // 20-year projection with degradation
    const yearlyRevenue: number[] = [];
    let cumulative = -netCost;
    let breakEvenYear = -1;
    for (let y = 1; y <= 20; y++) {
      const factor = Math.pow(1 - deg, y - 1);
      // After 10 years (FIT ends), sell at electricity rate not FIT rate
      const saleRate = y <= 10 ? fit : elecRate * 0.8;
      const rev = (selfConsumption * elecRate + saleGen * saleRate) * factor;
      yearlyRevenue.push(rev);
      cumulative += rev;
      if (breakEvenYear < 0 && cumulative >= 0) breakEvenYear = y;
    }
    const total20 = yearlyRevenue.reduce((a, b) => a + b, 0) - netCost;
    const co2 = annualGen * 0.441; // kg CO2 per kWh (Japan average)

    // Battery scenario: self consumption goes to 70%
    const selfRatioWithBattery = Math.min(selfRatio + 40, 90);
    const annualSaveB = annualGen * (selfRatioWithBattery / 100) * elecRate;
    const annualSaleB = annualGen * (1 - selfRatioWithBattery / 100) * fit;
    const annualRevB = annualSaveB + annualSaleB;
    const paybackB = annualRevB > 0 ? (netCost + batteryCost) / annualRevB : 999;

    return { annualGen, selfConsumption, saleGen, annualSave, annualSale, annualRevenue,
      netCost, paybackYears, yearlyRevenue, total20, co2, breakEvenYear,
      paybackB, annualRevB };
  }, [capacity, prefecture, roofDir, roofAngle, panelType, installCost, subsidy,
    electricityRate, fitRate, selfRatio, degradation]);

  const maxRev = Math.max(...r.yearlyRevenue);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-1">&gt;</span>
        <a href="/realestate" className="hover:underline">不動産</a>
        <span className="mx-1">&gt;</span>
        <span>太陽光発電シミュレーター</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">☀️ 太陽光発電 投資回収シミュレーター</h1>
        <p className="text-gray-600 text-sm">全47都道府県の日照時間データで投資回収年数を中立的に計算。業者の営業資料に頼らない判断を。</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 mb-6">
        <h2 className="font-semibold text-gray-800 text-sm">🏡 設置情報</h2>

        <div>
          <label className="block text-sm text-gray-600 mb-1">設置容量: <strong>{capacity} kW</strong></label>
          <input type="range" min={3} max={10} step={0.5} value={capacity}
            onChange={e => setCapacity(parseFloat(e.target.value))}
            className="w-full accent-yellow-500" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>3kW</span><span>10kW</span></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">都道府県</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
              value={prefecture} onChange={e => setPrefecture(e.target.value)}>
              {PREFECTURES.map(p => <option key={p} value={p}>{p}（年間日照{SUNSHINE[p]}h）</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">パネルの種類</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
              value={panelType} onChange={e => setPanelType(parseInt(e.target.value))}>
              {PANEL_TYPES.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">屋根の向き</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
              value={roofDir} onChange={e => setRoofDir(parseInt(e.target.value))}>
              {ROOF_DIRECTIONS.map((d, i) => <option key={i} value={i}>{d.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">屋根の傾き</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
              value={roofAngle} onChange={e => setRoofAngle(parseInt(e.target.value))}>
              {ROOF_ANGLES.map((a, i) => <option key={i} value={i}>{a.label}</option>)}
            </select>
          </div>
        </div>

        <h2 className="font-semibold text-gray-800 text-sm pt-2">💰 費用・料金設定</h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">設置総費用（円）</label>
            <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
              value={installCost} onChange={e => setInstallCost(e.target.value)} placeholder="1500000" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">補助金額（円）</label>
            <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
              value={subsidy} onChange={e => setSubsidy(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">電気料金単価（円/kWh）</label>
            <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
              value={electricityRate} onChange={e => setElectricityRate(e.target.value)} placeholder="31" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">FIT売電単価（円/kWh）</label>
            <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
              value={fitRate} onChange={e => setFitRate(e.target.value)} placeholder="16" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">自家消費率: <strong>{selfRatio}%</strong></label>
          <input type="range" min={10} max={90} step={5} value={selfRatio}
            onChange={e => setSelfRatio(parseInt(e.target.value))}
            className="w-full accent-yellow-500" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10%（ほぼ売電）</span><span>90%（ほぼ自家消費）</span></div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">パネル年間劣化率（%）</label>
          <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-40 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
            value={degradation} onChange={e => setDegradation(e.target.value)} step="0.1" placeholder="0.5" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="bg-yellow-500 text-white p-4">
          <p className="text-sm opacity-90 mb-1">投資回収年数</p>
          <p className="text-4xl font-bold">{r.paybackYears < 100 ? r.paybackYears.toFixed(1) + "年" : "回収不可"}</p>
          {r.breakEvenYear > 0 && <p className="text-yellow-100 text-sm mt-1">設置後 {r.breakEvenYear} 年目に累計黒字転換</p>}
        </div>
        <div className="p-4 space-y-0">
          {[
            ["年間発電量", `${fmt(r.annualGen)} kWh`],
            ["年間電気代節約額", fmtPrice(r.annualSave)],
            ["年間売電収入（FIT）", fmtPrice(r.annualSale)],
            ["年間合計収益", fmtPrice(r.annualRevenue), true],
            ["実質設置費用（補助金控除後）", fmtPrice(r.netCost)],
            ["20年間累計収益（劣化考慮）", (r.total20 >= 0 ? "+" : "") + fmtPrice(r.total20)],
            ["年間CO2削減量", `${fmt(r.co2)} kg`],
          ].map(([label, val, bold], i) => (
            <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-600">{label}</span>
              <span className={"text-sm " + (bold ? "font-bold text-yellow-600" : "font-medium")}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <h2 className="font-semibold text-gray-800 text-sm mb-3">📈 20年間 年間収益推移</h2>
        <div className="space-y-1">
          {r.yearlyRevenue.map((rev, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-8">{i + 1}年</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div className={"h-full rounded-full transition-all " + (i < 10 ? "bg-yellow-400" : "bg-kon")}
                  style={{ width: (rev / maxRev * 100) + "%" }} />
              </div>
              <span className="text-xs text-gray-600 w-20 text-right">{fmtPrice(Math.round(rev))}</span>
              {i === 10 && <span className="text-xs text-kon whitespace-nowrap">FIT終了</span>}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">黄: FIT期間（10年） / オレンジ: FIT終了後</p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
        <button type="button" onClick={() => setShowBattery(s => !s)}
          className="w-full text-left flex items-center justify-between">
          <span className="text-sm font-semibold text-kon">🔋 蓄電池を追加した場合の試算</span>
          <span className="text-kon">{showBattery ? "▲" : "▼"}</span>
        </button>
        {showBattery && (
          <div className="mt-3 space-y-2 text-sm text-kon">
            <p>蓄電池費用目安: <strong>{fmtPrice(batteryCost)}</strong>（容量10kWh程度）</p>
            <p>自家消費率: {selfRatio}% → <strong>{Math.min(selfRatio + 40, 90)}%</strong> に向上</p>
            <p>年間合計収益: <strong>{fmtPrice(r.annualRevB)}</strong></p>
            <p>投資回収年数（蓄電池込み）: <strong>{r.paybackB < 100 ? r.paybackB.toFixed(1) + "年" : "回収困難"}</strong></p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-semibold text-kon mb-1">⚠️ ご注意</p>
        <p className="text-xs text-kon">本シミュレーターは中立的な目安計算です。実際の発電量は設置条件・天候・パネルメーカーにより異なります。必ず複数の業者から見積もりを取り、独立した第三者の意見を参考にしてください。</p>
      </div>

      <p className="text-xs text-gray-400 mb-8">
        ※ FIT（固定価格買取制度）の売電単価は毎年度変更されます。最新の単価は資源エネルギー庁のサイトでご確認ください。
      </p>

      <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        山田ツール | yamada-tools.jp — 無料計算ツール集
      </div>
    </div>
  );
}
