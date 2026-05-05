"use client";
import { useState, useMemo } from "react";

function fmt(n: number) { return Math.floor(n).toLocaleString("ja-JP") + "円"; }

const HEALTH_RATE = 0.0998;
const CARE_RATE = 0.018;
const PENSION_RATE = 0.183;
const EMP_INS_RATE = 0.006;

function getStandardRemuneration(monthly: number): number {
  const brackets = [
    88000, 98000, 104000, 110000, 118000, 126000, 134000, 142000, 150000,
    160000, 170000, 180000, 190000, 200000, 220000, 240000, 260000, 280000,
    300000, 320000, 340000, 360000, 380000, 410000, 440000, 470000, 500000,
    530000, 560000, 590000, 620000, 650000,
  ];
  for (const b of brackets) if (monthly <= b) return b;
  return 650000;
}

function getIncomeTax(taxableMonthly: number, dependents: number): number {
  if (taxableMonthly <= 0) return 0;
  const annual = taxableMonthly * 12;
  let empDed = 0;
  if (annual <= 1625000) empDed = 550000;
  else if (annual <= 1800000) empDed = annual * 0.4 - 100000;
  else if (annual <= 3600000) empDed = annual * 0.3 + 80000;
  else if (annual <= 6600000) empDed = annual * 0.2 + 440000;
  else if (annual <= 8500000) empDed = annual * 0.1 + 1100000;
  else empDed = 1950000;

  const depDed = dependents * 380000;
  const basicDed = 480000;
  const taxable = Math.max(0, annual - empDed - basicDed - depDed);

  let tax = 0;
  if (taxable <= 1950000) tax = taxable * 0.05;
  else if (taxable <= 3300000) tax = taxable * 0.10 - 97500;
  else if (taxable <= 6950000) tax = taxable * 0.20 - 427500;
  else if (taxable <= 9000000) tax = taxable * 0.23 - 636000;
  else if (taxable <= 18000000) tax = taxable * 0.33 - 1536000;
  else tax = taxable * 0.40 - 2796000;

  tax = tax * 1.021;
  return Math.max(0, Math.floor(tax / 12));
}

function getResidentTax(annualSalary: number, dependents: number): number {
  if (annualSalary <= 1000000) return 0;
  let empDed = 0;
  if (annualSalary <= 1625000) empDed = 650000;
  else if (annualSalary <= 1800000) empDed = annualSalary * 0.4;
  else if (annualSalary <= 3600000) empDed = annualSalary * 0.3 + 180000;
  else if (annualSalary <= 6600000) empDed = annualSalary * 0.2 + 540000;
  else empDed = annualSalary * 0.1 + 1200000;
  const depDed = dependents * 330000;
  const basicDed = 430000;
  const taxable = Math.max(0, annualSalary - empDed - basicDed - depDed);
  return Math.floor((taxable * 0.10) / 12) + 5000;
}

interface CalcRow { label: string; amount: number; tip?: string; }

export default function NetSalaryClient() {
  const [gross, setGross] = useState("300000");
  const [age, setAge] = useState("35");
  const [dependents, setDependents] = useState("0");
  const [commute, setCommute] = useState("10000");
  const [includeResident, setIncludeResident] = useState(true);

  const result = useMemo(() => {
    const g = parseFloat(gross) || 0;
    const a = parseInt(age) || 30;
    const dep = parseInt(dependents) || 0;
    const com = parseFloat(commute) || 0;

    const sr = getStandardRemuneration(g);

    const health = Math.floor(sr * (HEALTH_RATE / 2));
    const care = a >= 40 ? Math.floor(sr * (CARE_RATE / 2)) : 0;
    const pension = Math.floor(sr * (PENSION_RATE / 2));
    const empIns = Math.floor(g * EMP_INS_RATE);
    const socialTotal = health + care + pension + empIns;

    const commuteExempt = Math.min(com, 150000);
    const taxableMonthly = Math.max(0, g - socialTotal - commuteExempt);
    const incomeTax = getIncomeTax(taxableMonthly, dep);
    const residentTax = includeResident ? getResidentTax(g * 12, dep) : 0;

    const totalDeductions = socialTotal + incomeTax + residentTax;
    const netSalary = g - totalDeductions;
    const netRate = g > 0 ? Math.round((netSalary / g) * 100) : 0;

    const rows: CalcRow[] = [
      { label: "健康保険料", amount: health, tip: `協会けんぽ全国平均近似。標準報酬月額${sr.toLocaleString()}円 × ${HEALTH_RATE / 2 * 100}%（労使折半）` },
      ...(care > 0 ? [{ label: "介護保険料（40歳以上）", amount: care, tip: "40歳以上が対象。介護保険料率1.8%の労使折半" }] : []),
      { label: "厚生年金保険料", amount: pension, tip: `標準報酬月額${sr.toLocaleString()}円 × 9.15%（労使折半）` },
      { label: "雇用保険料", amount: empIns, tip: `月給 × 0.6%（一般の事業）` },
      { label: "所得税（源泉徴収）", amount: incomeTax, tip: `扶養控除等申告書提出（甲欄）で計算。扶養${dep}人` },
      ...(includeResident ? [{ label: "住民税（概算）", amount: residentTax, tip: "前年収入ベースの概算値。入社1年目6月まで非課税。実際の金額は市区町村の通知書をご確認ください" }] : []),
    ];

    return { health, care, pension, empIns, socialTotal, incomeTax, residentTax, totalDeductions, netSalary, netRate, rows, sr };
  }, [gross, age, dependents, commute, includeResident]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-1">&gt;</span>
        <a href="/finance" className="hover:underline">金融・資産</a>
        <span className="mx-1">&gt;</span>
        <span>給与手取り計算機</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">💴 給与手取り計算機</h1>
        <p className="text-gray-600">月給から手取り額を即座に計算。社会保険・所得税・住民税の内訳もわかりやすく表示します。</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 mb-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">月給（額面・総支給額）</label>
          <div className="flex items-center gap-2">
            <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={gross} onChange={e => setGross(e.target.value)} placeholder="300000" />
            <span className="text-gray-500 text-sm whitespace-nowrap">円/月</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">年齢</label>
            <div className="flex items-center gap-1">
              <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm outline-none"
                value={age} onChange={e => setAge(e.target.value)} placeholder="35" min="18" max="70" />
              <span className="text-gray-500 text-xs">歳</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">40歳以上は介護保険あり</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">扶養家族数</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm outline-none"
              value={dependents} onChange={e => setDependents(e.target.value)}>
              {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}人</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">通勤手当</label>
            <div className="flex items-center gap-1">
              <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm outline-none"
                value={commute} onChange={e => setCommute(e.target.value)} placeholder="10000" />
              <span className="text-gray-500 text-xs">円</span>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeResident} onChange={e => setIncludeResident(e.target.checked)}
            className="w-4 h-4 accent-blue-500" />
          <span className="text-sm text-gray-600">住民税を含める（概算・2年目以降が対象）</span>
        </label>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="bg-blue-600 text-white p-5">
          <p className="text-sm opacity-80 mb-1">月の手取り額（概算）</p>
          <p className="text-4xl font-bold">{fmt(result.netSalary)}</p>
          <p className="text-blue-200 text-sm mt-1">
            額面の約{result.netRate}% ／ 年収換算 約{fmt(parseFloat(gross) * 12)} → 手取り約{fmt(result.netSalary * 12)}
          </p>
        </div>

        <div className="p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">控除内訳</p>
          <div className="space-y-0">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">月給（額面）</span>
              <span className="text-sm font-medium text-gray-900">{fmt(parseFloat(gross) || 0)}</span>
            </div>
            {result.rows.map((row, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">
                  {row.label}
                  {row.tip && (
                    <span className="relative inline-block ml-1 group">
                      <span className="text-blue-400 text-xs border border-blue-300 rounded-full w-4 h-4 inline-flex items-center justify-center cursor-pointer">?</span>
                      <span className="absolute z-50 left-5 top-0 w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-2 text-xs text-gray-600 hidden group-hover:block">
                        {row.tip}
                      </span>
                    </span>
                  )}
                </span>
                <span className="text-sm text-red-600">−{fmt(row.amount)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between py-3 bg-gray-50 -mx-4 px-4">
              <span className="text-sm font-semibold text-gray-700">控除合計</span>
              <span className="text-sm font-semibold text-red-600">−{fmt(result.totalDeductions)}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-base font-bold text-gray-900">手取り額</span>
              <span className="text-base font-bold text-blue-700">{fmt(result.netSalary)}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-8">
        ※ この計算は参考値です。実際の控除額は勤務先・加入保険組合・前年収入・各種控除により異なります。
        協会けんぽ全国平均近似値（2024年度）を使用。住民税は概算です。
      </p>

      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: "手取り額の目安はどのくらいですか？", a: "一般的に手取りは額面の75〜85%程度です。月給25万円なら手取りは約19〜21万円、月給35万円なら約26〜29万円が目安です。社会保険料や所得税・住民税の負担により変わります。" },
            { q: "健康保険料はどうやって計算されますか？", a: "健康保険料は標準報酬月額に保険料率を掛けて計算します。協会けんぽの保険料率は都道府県によって異なりますが、全国平均は約10%前後（労使折半で約5%ずつ）です。" },
            { q: "住民税はいつから引かれますか？", a: "住民税は前年の収入に基づいて計算され、翌年6月から翌々年5月まで毎月給与から天引きされます。入社1年目の5月末までは住民税が引かれません。このツールで「住民税を含める」のチェックを外すと1年目の手取りの目安が確認できます。" },
            { q: "40歳以上で保険料が上がるのはなぜ？", a: "40歳になると健康保険料に加えて介護保険料（料率1.8%、労使折半で0.9%）が追加されるためです。介護保険は40歳以上が被保険者となり、介護サービスの費用を支えます。" },
          ].map(({ q, a }, i) => (
            <details key={i} className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 font-medium text-gray-800 cursor-pointer hover:bg-gray-50 text-sm">Q. {q}</summary>
              <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
