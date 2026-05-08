"use client";
import { useState } from "react";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import StaticAdSlot from "@/components/common/StaticAdSlot";

const SPECIALTY_DATA: Record<string, { avgRevenue: number; variableCostRate: number }> = {
  "内科": { avgRevenue: 6500, variableCostRate: 19 },
  "小児科": { avgRevenue: 5800, variableCostRate: 18 },
  "整形外科": { avgRevenue: 7200, variableCostRate: 22 },
  "皮膚科": { avgRevenue: 5500, variableCostRate: 16 },
  "耳鼻科": { avgRevenue: 5200, variableCostRate: 17 },
  "眼科": { avgRevenue: 7800, variableCostRate: 25 },
  "産婦人科": { avgRevenue: 8500, variableCostRate: 23 },
  "精神科": { avgRevenue: 5000, variableCostRate: 12 },
  "歯科": { avgRevenue: 7800, variableCostRate: 28 },
  "一般外科": { avgRevenue: 7000, variableCostRate: 20 },
};

function fmt(n: number) {
  return Math.round(n).toLocaleString("ja-JP");
}

interface CalcResult {
  error?: string;
  totalFixedCost?: number;
  breakEvenRevenue?: number;
  requiredPatientsPerMonth?: number;
  requiredPatientsPerDay?: number;
  marginalProfitRate?: string;
  breakEvenRatio?: string;
}

interface ChartProps { fixedCost: number; variableRate: number; breakEven: number; }

function BreakEvenChart({ fixedCost, variableRate, breakEven }: ChartProps) {
  const W = 480; const H = 280;
  const PAD = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const maxX = breakEven * 2; const maxY = maxX * 1.05;
  function xPx(val: number) { return PAD.left + (val / maxX) * chartW; }
  function yPx(val: number) { return H - PAD.bottom - (val / maxY) * chartH; }
  const revenuePoints = `${xPx(0)},${yPx(0)} ${xPx(maxX)},${yPx(maxX)}`;
  const costPoints = `${xPx(0)},${yPx(fixedCost)} ${xPx(maxX)},${yPx(fixedCost + maxX * variableRate)}`;
  const bePx = xPx(breakEven); const bePy = yPx(breakEven);
  const xLabels = [0, 0.5, 1, 1.5, 2].map(r => ({ val: maxX * r, px: xPx(maxX * r) }));
  const yLabels = [0, 0.25, 0.5, 0.75, 1].map(r => ({ val: maxY * r, py: yPx(maxY * r) }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto border border-gray-200 rounded-lg bg-white">
      {yLabels.map((l, i) => (
        <line key={i} x1={PAD.left} y1={l.py} x2={W - PAD.right} y2={l.py} stroke="#e5e7eb" strokeWidth="1" />
      ))}
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="#6b7280" strokeWidth="1.5" />
      <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="#6b7280" strokeWidth="1.5" />
      <polyline points={revenuePoints} fill="none" stroke="#2563eb" strokeWidth="2.5" />
      <polyline points={costPoints} fill="none" stroke="#dc2626" strokeWidth="2.5" />
      <line x1={bePx} y1={PAD.top} x2={bePx} y2={H - PAD.bottom} stroke="#9ca3af" strokeWidth="1" strokeDasharray="4,3" />
      <circle cx={bePx} cy={bePy} r="6" fill="#16a34a" />
      <text x={bePx + 8} y={bePy - 8} fontSize="11" fill="#16a34a" fontWeight="bold">損益分岐点</text>
      {xLabels.map((l, i) => (
        <text key={i} x={l.px} y={H - PAD.bottom + 16} fontSize="10" fill="#6b7280" textAnchor="middle">
          {l.val === 0 ? "0" : `¥${Math.round(l.val / 10000)}万`}
        </text>
      ))}
      {yLabels.map((l, i) => (
        <text key={i} x={PAD.left - 6} y={l.py + 4} fontSize="10" fill="#6b7280" textAnchor="end">
          {l.val === 0 ? "0" : `¥${Math.round(l.val / 10000)}万`}
        </text>
      ))}
      <rect x={W - PAD.right - 110} y={PAD.top + 4} width="10" height="10" fill="#2563eb" rx="2" />
      <text x={W - PAD.right - 97} y={PAD.top + 13} fontSize="11" fill="#374151">売上高</text>
      <rect x={W - PAD.right - 110} y={PAD.top + 20} width="10" height="10" fill="#dc2626" rx="2" />
      <text x={W - PAD.right - 97} y={PAD.top + 29} fontSize="11" fill="#374151">総費用</text>
    </svg>
  );
}
const faqItems = [
  { question: "クリニックの損益分岐点とは何ですか？", answer: "損益分岐点とは、医業収入と費用が等しくなる売上高のことです。これを超えると黒字、下回ると赤字になります。yamada-tools.jpの本ツールでは、固定費と変動費から損益分岐点を即座に計算できます。" },
  { question: "内科クリニックの平均診療単価はいくらですか？", answer: "内科の平均診療単価は1人あたり約6,500円です。診療科によって異なり、整形外科は7,200円、歯科は7,800円、皮膚科は5,500円が目安です。山田ツールではこれらの業界平均が自動入力されます。" },
  { question: "損益分岐点比率の目安は？", answer: "厚生労働省の調査ではクリニックの平均損益分岐点比率は約90%とされており、赤字に近い水準です。70%以下であれば良好な経営状態と判断できます。yamada-tools.jpで自院の比率をチェックできます。" },
  { question: "1日に必要な患者数はどう計算しますか？", answer: "計算式は「損益分岐点売上高 ÷ 平均診療単価 ÷ 月間診療日数」です。例えば月間固定費400万円、内科（単価6,500円、変動費率19%）の場合、1日約32人の患者が必要です。山田ツールで自動計算できます。" },
  { question: "固定費にはどんな項目が含まれますか？", answer: "家賃、スタッフ給与（社員）、医療機器のリース料、減価償却費、光熱費、通信費、広告費、医師会費などが固定費に含まれます。yamada-tools.jpのツールでは項目別に入力でき、合計が自動計算されます。" },
  { question: "変動費率はどれくらいが適正ですか？", answer: "診療科により異なりますが、内科19%、整形外科22%、歯科28%が目安です。医薬品費、診療材料費、検査委託費が主な変動費です。山田ツールでは診療科別の業界平均が自動セットされます。" },
  { question: "計算結果は融資申請に使えますか？", answer: "はい、yamada-tools.jpの本ツールには印刷・PDF保存機能があり、事業計画書の参考資料として金融機関への融資申請に活用できます。ただし正式な事業計画は税理士・コンサルタントにご相談ください。" },
  { question: "クリニックの損益分岐点を計算できる無料ツールはありますか？", answer: "はい、yamada-tools.jp（山田ツール）で完全無料・登録不要で計算できます。診療科別の業界平均値が自動入力されるため、わずか1分で自院の損益分岐点と必要患者数が分かります。" },
];

const RELATED_TOOLS = [
  { href: "/clinic/labor-cost-ratio-diagnosis", label: "👥 人件費率診断", note: "Coming soon" as string | undefined },
  { href: "/clinic/medical-staff-payroll-calculator", label: "💊 医療スタッフ給与計算", note: "Coming soon" as string | undefined },
  { href: "/business/incorporation-simulator", label: "🏢 法人化節税シミュレーター", note: undefined as string | undefined },
  { href: "/finance/iryouhi-koujo-calculator", label: "🏥 医療費控除計算機", note: undefined as string | undefined },
];

export default function BreakEvenCalculatorClient() {
  const [specialty, setSpecialty] = useState("内科");
  const [rent, setRent] = useState("");
  const [staffSalary, setStaffSalary] = useState("");
  const [lease, setLease] = useState("");
  const [utilities, setUtilities] = useState("");
  const [advertising, setAdvertising] = useState("");
  const [otherFixed, setOtherFixed] = useState("");
  const [avgRevenue, setAvgRevenue] = useState(String(SPECIALTY_DATA["内科"].avgRevenue));
  const [variableCostRate, setVariableCostRate] = useState(String(SPECIALTY_DATA["内科"].variableCostRate));
  const [monthlyDays, setMonthlyDays] = useState("22");
  const [result, setResult] = useState<CalcResult | null>(null);

  const totalFixedLive =
    (Number(rent) || 0) + (Number(staffSalary) || 0) + (Number(lease) || 0) +
    (Number(utilities) || 0) + (Number(advertising) || 0) + (Number(otherFixed) || 0);

  function handleSpecialtyChange(val: string) {
    setSpecialty(val);
    if (SPECIALTY_DATA[val]) {
      setAvgRevenue(String(SPECIALTY_DATA[val].avgRevenue));
      setVariableCostRate(String(SPECIALTY_DATA[val].variableCostRate));
    }
  }

  function handleCalculate() {
    const totalFixedCost =
      (Number(rent) || 0) + (Number(staffSalary) || 0) + (Number(lease) || 0) +
      (Number(utilities) || 0) + (Number(advertising) || 0) + (Number(otherFixed) || 0);
    if (totalFixedCost <= 0) { setResult({ error: "固定費を1つ以上入力してください。" }); return; }
    const variableRate = (Number(variableCostRate) || 0) / 100;
    const marginalProfitRate = 1 - variableRate;
    if (marginalProfitRate <= 0) { setResult({ error: "変動費率が100%を超えています。入力を確認してください。" }); return; }
    const breakEvenRevenue = totalFixedCost / marginalProfitRate;
    const avgRev = Number(avgRevenue) || 1;
    const days = Number(monthlyDays) || 22;
    const requiredPatientsPerMonth = Math.ceil(breakEvenRevenue / avgRev);
    const requiredPatientsPerDay = Math.ceil(requiredPatientsPerMonth / days);
    const assumedRevenue = breakEvenRevenue * 1.3;
    const breakEvenRatio = (breakEvenRevenue / assumedRevenue) * 100;
    setResult({ totalFixedCost, breakEvenRevenue: Math.ceil(breakEvenRevenue), requiredPatientsPerMonth, requiredPatientsPerDay, marginalProfitRate: (marginalProfitRate * 100).toFixed(1), breakEvenRatio: breakEvenRatio.toFixed(1) });
  }

  function getRatioJudgment(ratio: number) {
    if (ratio < 70) return { label: "良好", color: "text-green-600 bg-green-50 border-green-200" };
    if (ratio < 85) return { label: "適正", color: "text-blue-600 bg-blue-50 border-blue-200" };
    if (ratio < 95) return { label: "要注意", color: "text-yellow-600 bg-yellow-50 border-yellow-200" };
    return { label: "危険", color: "text-red-600 bg-red-50 border-red-200" };
  }

  const ic = "border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none";
  const lc = "block text-sm text-gray-600 mb-1";
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-1">›</span>
        <Link href="/clinic" className="hover:underline">クリニック経営</Link>
        <span className="mx-1">›</span>
        <span>損益分岐点シミュレーター</span>
      </nav>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">🏥 クリニック損益分岐点・必要患者数シミュレーター</h1>
        <p className="text-gray-600 text-sm">診療科別の平均診療単価から損益分岐点と1日に必要な患者数を計算。融資申請にも使えます。</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-4">
        <h2 className="font-semibold text-gray-800 text-sm mb-3">① 診療科を選択</h2>
        <select value={specialty} onChange={e => handleSpecialtyChange(e.target.value)} className={ic}>
          {Object.keys(SPECIALTY_DATA).map(s => (<option key={s} value={s}>{s}</option>))}
        </select>
        <p className="text-xs text-gray-400 mt-1">選択すると平均診療単価・変動費率が自動入力されます</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-4">
        <h2 className="font-semibold text-gray-800 text-sm mb-3">② 月間固定費を入力</h2>
        <div className="space-y-3">
          {([ { label: "家賃 (¥)", value: rent, set: setRent, ph: "500000" }, { label: "スタッフ給与合計 (¥)", value: staffSalary, set: setStaffSalary, ph: "2000000" }, { label: "リース料・減価償却 (¥)", value: lease, set: setLease, ph: "300000" }, { label: "光熱費・通信費 (¥)", value: utilities, set: setUtilities, ph: "100000" }, { label: "広告費 (¥)", value: advertising, set: setAdvertising, ph: "50000" }, { label: "その他固定費 (¥)", value: otherFixed, set: setOtherFixed, ph: "100000" }, ] as { label: string; value: string; set: (v: string) => void; ph: string }[]).map(({ label, value, set, ph }) => (
            <div key={label}><label className={lc}>{label}</label><input type="number" className={ic} value={value} onChange={e => set(e.target.value)} placeholder={ph} min="0" /></div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-600 font-medium">月間固定費合計</span>
          <span className="text-base font-bold text-gray-900">¥{fmt(totalFixedLive)}</span>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-4">
        <h2 className="font-semibold text-gray-800 text-sm mb-3">③ 診療単価・診療日数を確認</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={lc}>平均診療単価 (¥)</label><input type="number" className={ic} value={avgRevenue} onChange={e => setAvgRevenue(e.target.value)} min="1" /></div>
          <div><label className={lc}>変動費率 (%)</label><input type="number" className={ic} value={variableCostRate} onChange={e => setVariableCostRate(e.target.value)} min="0" max="99" /></div>
        </div>
        <div className="mt-3"><label className={lc}>月間診療日数</label><input type="number" className={ic} value={monthlyDays} onChange={e => setMonthlyDays(e.target.value)} min="1" max="31" /></div>
      </div>
      <button type="button" onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-base transition mb-6">計算する</button>
      {result && (
        <>
          {result.error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-6">{result.error}</div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 overflow-hidden">
              <div className="bg-blue-600 px-5 py-3"><h2 className="text-white font-bold text-sm">計算結果</h2></div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <div className="text-xs text-blue-600 font-medium mb-1">損益分岐点売上高</div>
                    <div className="text-xl font-bold text-blue-700">¥{fmt(result.breakEvenRevenue!)}<span className="text-sm font-normal">/月</span></div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <div className="text-xs text-green-600 font-medium mb-1">必要患者数</div>
                    <div className="text-xl font-bold text-green-700">{result.requiredPatientsPerDay!}<span className="text-sm font-normal">人/日</span></div>
                    <div className="text-xs text-green-600 mt-0.5">{result.requiredPatientsPerMonth}人/月</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-600">月間総固定費</span><span className="font-medium">¥{fmt(result.totalFixedCost!)}</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-600">限界利益率</span><span className="font-medium">{result.marginalProfitRate}%</span></div>
                  <div className="flex justify-between py-2 items-center">
                    <span className="text-gray-600">損益分岐点比率</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{result.breakEvenRatio}%</span>
                      {(() => { const j = getRatioJudgment(Number(result.breakEvenRatio)); return (<span className={`text-xs font-bold px-2 py-0.5 rounded border ${j.color}`}>{j.label}</span>); })()}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">📊 厚生労働省調査によるとクリニックの平均損益分岐点比率は約90%です。損益分岐点比率は「想定売上の1.3倍で試算」しています。</p>
                <div className="mt-4"><h3 className="text-sm font-semibold text-gray-700 mb-2">損益分岐点グラフ</h3>
                  <BreakEvenChart fixedCost={result.totalFixedCost!} variableRate={(Number(variableCostRate) || 0) / 100} breakEven={result.breakEvenRevenue!} />
                </div>
                <div className="flex justify-end mt-2"><button type="button" onClick={() => window.print()} className="text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg px-4 py-2 transition">🖨️ 印刷・PDF保存</button></div>
                <div className="hidden print:block mt-8 pt-4 border-t text-xs text-gray-600"><p>このシミュレーションはyamada-tools.jp（山田ツール）で作成されました。</p><p>https://yamada-tools.jp/clinic/break-even-calculator</p></div>
              </div>
            </div>
          )}
          <StaticAdSlot />
        </>
      )}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3 text-sm">📋 使い方（5ステップ）</h2>
        <ol className="space-y-2 text-sm text-gray-700">
          {["診療科を選択（業界平均値が自動入力されます）", "月間の固定費（家賃・人件費・リース料など）を入力", "平均診療単価と月間診療日数を確認・調整", "「計算する」ボタンをクリック", "損益分岐点売上高と1日必要患者数を確認、必要に応じて印刷"].map((step, i) => (
            <li key={i} className="flex gap-3"><span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold">{i + 1}</span><span>{step}</span></li>
          ))}
        </ol>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold text-gray-800 mb-3 text-sm">🔗 関連ツール</h2>
        <div className="grid grid-cols-2 gap-3">
          {RELATED_TOOLS.map(tool => (
            <Link key={tool.href} href={tool.href} className="block bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-blue-300 transition text-sm">
              <span className="font-medium text-gray-800">{tool.label}</span>
              {tool.note && (<span className="ml-2 text-xs text-gray-400">({tool.note})</span>)}
            </Link>
          ))}
        </div>
      </div>
      <FAQSection faq={faqItems} />
      <StaticAdSlot />
    </div>
  );
}
