"use client";

import React, { useState } from "react";
import { FAQSection } from "@/components/FAQSection";
import StaticAdSlot from "@/components/common/StaticAdSlot";

interface StaffRow {
  id: number;
  role: string;
  count: string;
  salary: string;
}

interface CalcResult {
  error?: string;
  laborCostRatio?: string;
  laborDistributionRatio?: string;
  salaryPerStaff?: number;
  totalStaff?: number;
  totalLaborCost?: number;
  annualLaborCost?: number;
  judgment?: string;
  judgmentColor?: string;
  benchmark?: { ideal: number; warning: number; danger: number; official: number };
  suggestions?: string[];
}

const BENCHMARK: Record<string, { ideal: number; warning: number; danger: number; official: number }> = {
  '個人クリニック（無床・院内処方）': { ideal: 17.5, warning: 22, danger: 27, official: 17.5 },
  '個人クリニック（無床・院外処方）': { ideal: 25, warning: 30, danger: 35, official: 24.6 },
  '個人クリニック（有床）': { ideal: 30, warning: 35, danger: 40, official: 30 },
  '医療法人（無床）': { ideal: 45, warning: 50, danger: 55, official: 49.0 },
  '医療法人（有床）': { ideal: 50, warning: 55, danger: 60, official: 52 },
};

const CLINIC_TYPES = Object.keys(BENCHMARK);
const STAFF_ROLES = ['医師', '看護師', '准看護師', '歯科衛生士', '医療事務', '受付', '看護助手', 'その他'];
const fmt = (n: number) => new Intl.NumberFormat('ja-JP').format(n);

const faqItems = [
  {
    question: 'クリニックの人件費率の適正値は？',
    answer: '厚生労働省「医療経済実態調査」によると、個人クリニック（入院なし）の人件費率は平均24.6%、医療法人（入院なし）は平均49.0%です。yamada-tools.jpではクリニック形態別に適正値と比較できます。',
  },
  {
    question: '人件費率と労働分配率の違いは？',
    answer: '人件費率は「人件費÷医業収入×100」、労働分配率は「人件費÷限界利益×100」です。労働分配率は変動費を除いた付加価値に対する人件費の割合を示し、より精密な指標です。山田ツールで両方同時に診断できます。',
  },
  {
    question: '人件費には何が含まれますか？',
    answer: '基本給、賞与、退職金、各種手当（通勤・住宅・資格）、法定福利費（社会保険料）、福利厚生費、社宅費用などが含まれます。yamada-tools.jpでは法定福利費率（標準15%）を自動加算します。',
  },
  {
    question: '人件費率が高い場合の改善方法は？',
    answer: '①業務効率化（電子カルテ・予約システム）、②パート・アルバイト活用で社会保険料圧縮、③レセプト・経理の業務委託で固定費の変動費化、が有効です。山田ツールが自院の状況に応じた提案を表示します。',
  },
  {
    question: '医療法人の方が人件費率が高いのはなぜ？',
    answer: '医療法人は規模が大きく、医療スタッフに加え管理職や事務職員も雇用するため人件費が累積的に増加します。厚労省データでも医療法人49.0%・個人クリニック24.6%と約2倍の差があります。',
  },
  {
    question: '院外処方と院内処方で人件費率は違う？',
    answer: 'はい。院内処方は薬剤師など追加スタッフが必要なため人件費率が低めの15-20%、院外処方は20-30%が目安です。yamada-tools.jpではクリニック形態を選択すると自動で適正範囲が変わります。',
  },
  {
    question: '1人あたり給与費の計算方法は？',
    answer: '「年間給与総額÷従事員数」で計算します。地域や診療科により差があり、首都圏では1人あたり年450-500万円が目安です。山田ツールで自院の水準を確認できます。',
  },
  {
    question: 'クリニックの人件費を診断できる無料ツールはありますか？',
    answer: 'はい、yamada-tools.jp（山田ツール）で完全無料・登録不要で診断できます。厚労省「医療経済実態調査」のデータと比較し、判定と改善提案まで自動表示します。',
  },
];

const RELATED_TOOLS = [
  { nameJa: '📖 クリニック経営の数字管理ガイド', path: '/blog/clinic-keiei-suji-kanri-guide' },
  { nameJa: 'クリニック損益分岐点シミュレーター', path: '/clinic/break-even-calculator' },
  { nameJa: '医療スタッフ給与計算機', path: '/clinic/medical-staff-payroll-calculator', coming: true },
  { nameJa: '法人化節税シミュレーター', path: '/finance/houjinka-setsuzei-calculator' },
  { nameJa: '人件費シミュレーター', path: '/business/jinkenhi-shiyuki' },
];

function BarChart({ own, official, ideal }: { own: number; official: number; ideal: number }) {
  const maxVal = Math.max(own, official, ideal, 10) * 1.2;
  const W = 480, H = 200, PL = 100, PR = 80, PT = 20;
  const chartW = W - PL - PR;
  const barH = 36, gap = 16;
  const bars = [
    { label: '自院', value: own, color: '#3b82f6' },
    { label: '業界平均', value: official, color: '#f59e0b' },
    { label: '適正上限', value: ideal, color: '#10b981' },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg">
      {bars.map((bar, i) => {
        const y = PT + i * (barH + gap);
        const bw = (bar.value / maxVal) * chartW;
        return (
          <g key={i}>
            <text x={PL - 6} y={y + barH / 2 + 4} textAnchor="end" fontSize="11" fill="#6b7280">{bar.label}</text>
            <rect x={PL} y={y} width={bw} height={barH} fill={bar.color} rx="4" opacity="0.85" />
            <text x={PL + bw + 6} y={y + barH / 2 + 4} fontSize="12" fill="#374151" fontWeight="bold">{bar.value.toFixed(1)}%</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function LaborCostRatioClient() {
  const [clinicType, setClinicType] = useState(CLINIC_TYPES[1]);
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [monthlyVariableCost, setMonthlyVariableCost] = useState('');
  const [staffRows, setStaffRows] = useState<StaffRow[]>([
    { id: 1, role: '医師', count: '1', salary: '' },
    { id: 2, role: '医療事務', count: '2', salary: '' },
  ]);
  const [legalBenefitRate, setLegalBenefitRate] = useState('15');
  const [result, setResult] = useState<CalcResult | null>(null);
  let nextId = staffRows.length + 1;

  const addRow = () => {
    setStaffRows(prev => [...prev, { id: nextId++, role: 'その他', count: '1', salary: '' }]);
  };
  const removeRow = (id: number) => {
    setStaffRows(prev => prev.filter(r => r.id !== id));
  };
  const updateRow = (id: number, field: keyof StaffRow, value: string) => {
    setStaffRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleCalculate = () => {
    const revenue = Number(monthlyRevenue) || 0;
    const variableCost = Number(monthlyVariableCost) || 0;
    if (revenue <= 0) { setResult({ error: '月間医業収入を入力してください。' }); return; }
    let totalSalary = 0;
    let totalStaff = 0;
    staffRows.forEach(row => {
      const count = Number(row.count) || 0;
      const salary = Number(row.salary) || 0;
      totalSalary += count * salary;
      totalStaff += count;
    });
    const benefitRate = (Number(legalBenefitRate) || 15) / 100;
    const totalLaborCost = totalSalary * (1 + benefitRate);
    const annualRevenue = revenue * 12;
    const annualVariable = variableCost * 12;
    const annualLaborCost = totalLaborCost * 12;
    const laborCostRatio = (annualLaborCost / annualRevenue) * 100;
    const marginalProfit = annualRevenue - annualVariable;
    const laborDistributionRatio = marginalProfit > 0 ? (annualLaborCost / marginalProfit) * 100 : 0;
    const salaryPerStaff = totalStaff > 0 ? (totalSalary * 12) / totalStaff : 0;
    const benchmark = BENCHMARK[clinicType];
    let judgment = '';
    let judgmentColor = '';
    if (laborCostRatio <= benchmark.ideal) { judgment = '良好'; judgmentColor = 'green'; }
    else if (laborCostRatio <= benchmark.warning) { judgment = '適正範囲'; judgmentColor = 'blue'; }
    else if (laborCostRatio <= benchmark.danger) { judgment = '要注意'; judgmentColor = 'yellow'; }
    else { judgment = '危険水準'; judgmentColor = 'red'; }
    const suggestions: string[] = [];
    if (laborCostRatio > benchmark.warning) {
      suggestions.push('業務効率化（電子カルテ・予約システム導入）で残業時間削減を検討');
      suggestions.push('パート・アルバイトの活用で社会保険料を圧縮');
      suggestions.push('業務委託（レセプト・経理）で固定人件費を変動費化');
    }
    if (laborDistributionRatio > 60) suggestions.push('労働分配率が高めです。1人あたり生産性の向上が必要');
    if (salaryPerStaff < 3500000) suggestions.push('1人あたり給与費が地域平均より低い可能性があります（離職リスク）');
    if (suggestions.length === 0) suggestions.push('現状の人件費水準は適正範囲内です。スタッフ満足度の維持に注力しましょう。');
    setResult({
      laborCostRatio: laborCostRatio.toFixed(1),
      laborDistributionRatio: laborDistributionRatio.toFixed(1),
      salaryPerStaff: Math.round(salaryPerStaff),
      totalStaff,
      totalLaborCost: Math.round(totalLaborCost),
      annualLaborCost: Math.round(annualLaborCost),
      judgment, judgmentColor, benchmark, suggestions,
    });
  };

  const judgmentStyles: Record<string, string> = {
    green: 'bg-green-100 text-green-800 border-green-300',
    blue: 'bg-gray-50 text-kon border-kon',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    red: 'bg-gray-50 text-danger border-gray-200',
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-4">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-1">/</span>
        <a href="/clinic" className="hover:underline">クリニック経営</a>
        <span className="mx-1">/</span>
        <span>人件費率診断</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">クリニック人件費率診断ツール</h1>
      <p className="text-gray-600 mb-6">厚労省「医療経済実態調査」のデータと比較し、人件費率・労働分配率・1人あたり給与費を診断します。</p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">クリニック形態</label>
          <select value={clinicType} onChange={e => setClinicType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-kon focus:border-transparent">
            {CLINIC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">月間医業収入（円）</label>
            <input type="number" value={monthlyRevenue} onChange={e => setMonthlyRevenue(e.target.value)} placeholder="例: 5000000" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-kon focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">月間変動費（医薬品・材料費等、円）</label>
            <input type="number" value={monthlyVariableCost} onChange={e => setMonthlyVariableCost(e.target.value)} placeholder="例: 1000000" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-kon focus:border-transparent" />
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">スタッフ構成</label>
            <button type="button" onClick={addRow} className="text-xs bg-kon text-white px-3 py-1 rounded-lg hover:bg-ai">+ スタッフ追加</button>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium px-1">
              <div className="col-span-5">職種</div>
              <div className="col-span-3">人数</div>
              <div className="col-span-3">平均月給（円）</div>
              <div className="col-span-1"></div>
            </div>
            {staffRows.map(row => (
              <div key={row.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <select value={row.role} onChange={e => updateRow(row.id, 'role', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm">
                    {STAFF_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="col-span-3">
                  <input type="number" value={row.count} onChange={e => updateRow(row.id, 'count', e.target.value)} min="1" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                </div>
                <div className="col-span-3">
                  <input type="number" value={row.salary} onChange={e => updateRow(row.id, 'salary', e.target.value)} placeholder="例: 350000" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                </div>
                <div className="col-span-1 flex justify-center">
                  {staffRows.length > 1 && (
                    <button type="button" onClick={() => removeRow(row.id)} className="text-danger hover:text-danger text-xl leading-none">×</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">法定福利費率（%、標準15%）</label>
          <input type="number" value={legalBenefitRate} onChange={e => setLegalBenefitRate(e.target.value)} min="0" max="30" className="w-40 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-kon focus:border-transparent" />
        </div>

        <button type="button" onClick={handleCalculate} className="w-full bg-kon hover:bg-ai text-white font-bold py-3 rounded-xl text-base transition-colors">
          診断する
        </button>
      </div>

      {result && (
        <div className="mb-6">
          {result.error ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-danger">{result.error}</div>
          ) : (
            <>
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">診断結果</h2>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full border ${judgmentStyles[result.judgmentColor!]}`}>
                    {result.judgment}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  <div className="text-center bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-kon">{result.laborCostRatio}%</div>
                    <div className="text-xs text-gray-600 mt-1">人件費率</div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-kon">{result.laborDistributionRatio}%</div>
                    <div className="text-xs text-gray-600 mt-1">労働分配率</div>
                  </div>
                  <div className="text-center bg-green-50 rounded-lg p-3 col-span-2 sm:col-span-1">
                    <div className="text-xl font-bold text-green-700">¥{fmt(result.salaryPerStaff!)}</div>
                    <div className="text-xs text-gray-600 mt-1">1人あたり給与費（年）</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                  <div className="flex justify-between"><span>スタッフ総数</span><span className="font-bold">{result.totalStaff}人</span></div>
                  <div className="flex justify-between"><span>月間人件費（法福込）</span><span className="font-bold">¥{fmt(result.totalLaborCost!)}</span></div>
                  <div className="flex justify-between col-span-2"><span>年間人件費</span><span className="font-bold">¥{fmt(result.annualLaborCost!)}</span></div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4 shadow-sm">
                <h2 className="text-base font-bold text-gray-800 mb-4">厚労省データとの比較</h2>
                <BarChart
                  own={parseFloat(result.laborCostRatio!)}
                  official={result.benchmark!.official}
                  ideal={result.benchmark!.ideal}
                />
                <p className="text-xs text-gray-400 mt-2">出典: 厚生労働省「第24回（令和5年実施）医療経済実態調査」</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4 shadow-sm">
                <h2 className="text-base font-bold text-gray-800 mb-3">改善提案</h2>
                <ul className="space-y-2">
                  {result.suggestions!.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-kon mt-0.5 flex-shrink-0">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end mb-4">
                <button type="button" onClick={() => window.print()} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                  印刷・PDF保存
                </button>
              </div>

              <StaticAdSlot />
            </>
          )}
        </div>
      )}

      <FAQSection faq={faqItems} />
      <StaticAdSlot />

      <div className="mt-8">
        <h2 className="text-base font-bold text-gray-800 mb-3">関連ツール</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {RELATED_TOOLS.map(tool => (
            <a
              key={tool.path}
              href={'coming' in tool && tool.coming ? '#' : tool.path}
              className={`block border rounded-lg p-3 text-sm hover:shadow-md transition-shadow ${'coming' in tool && tool.coming ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-default' : 'border-gray-200 bg-gray-50 text-kon hover:bg-ai'}`}
            >
              {tool.nameJa}
              {'coming' in tool && tool.coming && <span className="ml-2 text-xs bg-gray-200 text-gray-500 px-1 rounded">近日公開</span>}
            </a>
          ))}
        </div>
      </div>

      <div className="hidden print:block mt-8 text-center text-xs text-gray-400 border-t pt-4">
        <p>yamada-tools.jp — クリニック人件費率診断ツール</p>
        <p>厚生労働省「医療経済実態調査」データ参照（令和5年実施）</p>
      </div>
    </main>
  );
}
