"use client";
import { useState, useMemo } from "react";

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP"); }
function fmtPrice(n: number) { return fmt(n) + "円"; }

type EmploymentType = "正社員" | "業務委託" | "アルバイト";

interface StaffData {
  name: string;
  employmentType: EmploymentType;
  monthSales: string;
  nominationSales: string;
  shopSales: string;
  baseSalary: string;
  salesRatio: string;
  nominationRatio: string;
  shopRatio: string;
  transportation: string;
  socialInsurance: boolean;
  incomeTax: boolean;
}

function defaultStaff(name: string): StaffData {
  return {
    name,
    employmentType: "正社員",
    monthSales: "500000",
    nominationSales: "100000",
    shopSales: "30000",
    baseSalary: "200000",
    salesRatio: "35",
    nominationRatio: "5",
    shopRatio: "10",
    transportation: "10000",
    socialInsurance: true,
    incomeTax: true,
  };
}

function calcStaff(s: StaffData) {
  const ms = parseFloat(s.monthSales) || 0;
  const ns = parseFloat(s.nominationSales) || 0;
  const ss = parseFloat(s.shopSales) || 0;
  const base = parseFloat(s.baseSalary) || 0;
  const sr = parseFloat(s.salesRatio) / 100 || 0;
  const nr = parseFloat(s.nominationRatio) / 100 || 0;
  const shr = parseFloat(s.shopRatio) / 100 || 0;
  const transport = parseFloat(s.transportation) || 0;

  const salesFee = ms * sr;
  const nominationFee = ns * nr;
  const shopFee = ss * shr;
  const totalFee = salesFee + nominationFee + shopFee;
  const baseActivated = totalFee < base;
  const grossPay = Math.max(base, totalFee) + transport;

  // Social insurance approx (正社員 only)
  let socialIns = 0;
  if (s.socialInsurance && s.employmentType === "正社員") {
    // 健康保険 約5% + 厚生年金 約9.15% + 雇用保険 0.6%
    socialIns = grossPay * 0.1475;
  }

  // Income tax approx
  let taxableIncome = grossPay - socialIns;
  let incomeTaxAmt = 0;
  if (s.incomeTax) {
    if (taxableIncome <= 88000) incomeTaxAmt = 0;
    else if (taxableIncome <= 162500) incomeTaxAmt = taxableIncome * 0.05;
    else if (taxableIncome <= 300000) incomeTaxAmt = taxableIncome * 0.10 - 1300 * 10;
    else incomeTaxAmt = taxableIncome * 0.20 - 4400 * 10;
    incomeTaxAmt = Math.max(0, incomeTaxAmt);
  }

  const takeHome = grossPay - socialIns - incomeTaxAmt;
  const laborRatio = ms > 0 ? grossPay / ms : 0;

  // 業務委託: 請求額 = grossPay × 1.1
  const invoiceAmount = s.employmentType === "業務委託" ? grossPay * 1.1 : 0;

  return {
    salesFee, nominationFee, shopFee, totalFee, baseActivated,
    grossPay, socialIns, incomeTaxAmt, takeHome, laborRatio, invoiceAmount,
  };
}

export default function BiyoshitsuClient() {
  const [staffList, setStaffList] = useState<StaffData[]>([defaultStaff("スタッフA")]);
  const [activeTab, setActiveTab] = useState(0);

  const addStaff = () => {
    if (staffList.length >= 5) return;
    const labels = ["A", "B", "C", "D", "E"];
    setStaffList(prev => [...prev, defaultStaff("スタッフ" + labels[prev.length])]);
    setActiveTab(staffList.length);
  };

  const removeStaff = (i: number) => {
    if (staffList.length <= 1) return;
    setStaffList(prev => prev.filter((_, idx) => idx !== i));
    setActiveTab(Math.max(0, i - 1));
  };

  const updateStaff = (field: keyof StaffData, val: string | boolean) => {
    setStaffList(prev => prev.map((s, i) => i === activeTab ? { ...s, [field]: val } : s));
  };

  const s = staffList[activeTab];
  const r = useMemo(() => calcStaff(s), [s]);
  const allResults = staffList.map(calcStaff);

  const laborColor = r.laborRatio < 0.4
    ? "text-emerald-600" : r.laborRatio < 0.5
    ? "text-yellow-600" : "text-danger";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:underline">ホーム</a>
        <span className="mx-1">&gt;</span>
        <a href="/business" className="hover:underline">ビジネス</a>
        <span className="mx-1">&gt;</span>
        <span>美容室 歩合給計算機</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">💇 美容室 スタッフ歩合給計算機</h1>
        <p className="text-gray-600 text-sm">美容師・スタイリストの歩合給を売上・指名・店販から自動計算。手取りまで一発表示。</p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {staffList.map((staff, i) => (
          <button type="button" key={i} onClick={() => setActiveTab(i)}
            className={"px-3 py-1.5 rounded-lg text-sm font-medium transition-colors " + (activeTab === i ? "bg-kon text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
            {staff.name}
          </button>
        ))}
        {staffList.length < 5 && (
          <button type="button" onClick={addStaff} className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-500 hover:bg-gray-200">＋追加</button>
        )}
        {staffList.length > 1 && (
          <button type="button" onClick={() => removeStaff(activeTab)} className="text-xs text-danger hover:text-danger ml-auto">削除</button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">スタッフ名</label>
            <input type="text" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-sakura outline-none"
              value={s.name} onChange={e => updateStaff("name", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">雇用形態</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-sakura outline-none"
              value={s.employmentType} onChange={e => updateStaff("employmentType", e.target.value as EmploymentType)}>
              <option value="正社員">正社員</option>
              <option value="業務委託">業務委託</option>
              <option value="アルバイト">アルバイト</option>
            </select>
          </div>
        </div>

        <h2 className="font-semibold text-gray-800 text-sm pt-2">💰 売上情報</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["月間売上合計", "monthSales", "500000"],
            ["うち指名売上", "nominationSales", "100000"],
            ["うち店販売上", "shopSales", "30000"],
          ].map(([label, field, ph]) => (
            <div key={field}>
              <label className="block text-xs text-gray-600 mb-1">{label}（円）</label>
              <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-sakura outline-none"
                value={s[field as keyof StaffData] as string}
                onChange={e => updateStaff(field as keyof StaffData, e.target.value)}
                placeholder={ph} />
            </div>
          ))}
        </div>

        <h2 className="font-semibold text-gray-800 text-sm pt-2">⚙️ 給与設定</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">保証給（基本給）（円）</label>
            <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-sakura outline-none"
              value={s.baseSalary} onChange={e => updateStaff("baseSalary", e.target.value)} placeholder="200000" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">交通費（円）</label>
            <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-sakura outline-none"
              value={s.transportation} onChange={e => updateStaff("transportation", e.target.value)} placeholder="10000" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">売上歩合率（%）</label>
            <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-sakura outline-none"
              value={s.salesRatio} onChange={e => updateStaff("salesRatio", e.target.value)} placeholder="35" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">指名歩合率（%）</label>
            <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-sakura outline-none"
              value={s.nominationRatio} onChange={e => updateStaff("nominationRatio", e.target.value)} placeholder="5" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">店販歩合率（%）</label>
            <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:ring-2 focus:ring-sakura outline-none"
              value={s.shopRatio} onChange={e => updateStaff("shopRatio", e.target.value)} placeholder="10" />
          </div>
        </div>

        {s.employmentType === "正社員" && (
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={s.socialInsurance} onChange={e => updateStaff("socialInsurance", e.target.checked)} className="w-4 h-4 accent-pink-500" />
              <span className="text-sm text-gray-700">社会保険料を控除</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={s.incomeTax} onChange={e => updateStaff("incomeTax", e.target.checked)} className="w-4 h-4 accent-pink-500" />
              <span className="text-sm text-gray-700">所得税（概算）を控除</span>
            </label>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="bg-kon text-white p-4">
          <p className="text-sm opacity-80 mb-1">概算手取り</p>
          <p className="text-3xl font-bold">{fmtPrice(Math.round(r.takeHome))}</p>
          <p className="text-gin text-sm mt-1">総支給額: {fmtPrice(Math.round(r.grossPay))}</p>
        </div>
        <div className="p-4">
          {[
            ["売上歩合", fmtPrice(Math.round(r.salesFee))],
            ["指名歩合", fmtPrice(Math.round(r.nominationFee))],
            ["店販歩合", fmtPrice(Math.round(r.shopFee))],
            ["歩合合計", fmtPrice(Math.round(r.totalFee))],
            ["保証給（基本給）", fmtPrice(parseFloat(s.baseSalary) || 0)],
            ["交通費", fmtPrice(parseFloat(s.transportation) || 0)],
            ["総支給額", fmtPrice(Math.round(r.grossPay)), true],
            ...(s.socialInsurance && s.employmentType === "正社員" ? [["社会保険料（概算）", "−" + fmtPrice(Math.round(r.socialIns))]] : []),
            ...(s.incomeTax ? [["所得税（概算）", "−" + fmtPrice(Math.round(r.incomeTaxAmt))]] : []),
            ["概算手取り", fmtPrice(Math.round(r.takeHome)), true],
          ].map(([label, val, bold], i) => (
            <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-600">{label}</span>
              <span className={"text-sm " + (bold ? "font-bold text-sakura" : "font-medium")}>{val}</span>
            </div>
          ))}
        </div>
        {r.baseActivated && (
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 text-xs text-kon">
            ℹ️ 保証給が発動しています（歩合合計 {fmtPrice(Math.round(r.totalFee))} ＜ 保証給）
          </div>
        )}
        {s.employmentType === "業務委託" && (
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 text-xs text-kon">
            📋 業務委託の場合の請求額（消費税10%込み）: <strong>{fmtPrice(Math.round(r.invoiceAmount))}</strong>
          </div>
        )}
      </div>

      <div className={"border rounded-xl p-4 mb-6 " + (r.laborRatio < 0.4 ? "bg-emerald-50 border-emerald-200" : r.laborRatio < 0.5 ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200")}>
        <p className="text-sm font-semibold mb-1">オーナー側の人件費率</p>
        <p className={"text-2xl font-bold " + laborColor}>{(r.laborRatio * 100).toFixed(1)}%</p>
        <p className="text-xs text-gray-600 mt-1">
          {r.laborRatio < 0.4 ? "✅ 適正（40%未満）" : r.laborRatio < 0.5 ? "⚠️ やや高め（40〜50%）" : "❌ 高すぎ（50%超）"}
          — 目安: 40〜50%が適正
        </p>
      </div>

      {staffList.length > 1 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-gray-800 text-sm mb-3">👥 スタッフ比較</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">名前</th>
                  <th className="text-right py-2 text-gray-500 font-medium">総支給額</th>
                  <th className="text-right py-2 text-gray-500 font-medium">手取り</th>
                  <th className="text-right py-2 text-gray-500 font-medium">人件費率</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff, i) => (
                  <tr key={i} className={"border-b border-gray-50 " + (i === activeTab ? "bg-sakura/30" : "hover:bg-gray-50")}>
                    <td className="py-2 font-medium">{staff.name}</td>
                    <td className="py-2 text-right">{fmtPrice(Math.round(allResults[i].grossPay))}</td>
                    <td className="py-2 text-right">{fmtPrice(Math.round(allResults[i].takeHome))}</td>
                    <td className={"py-2 text-right font-medium " + (allResults[i].laborRatio < 0.4 ? "text-emerald-600" : allResults[i].laborRatio < 0.5 ? "text-yellow-600" : "text-danger")}>
                      {(allResults[i].laborRatio * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 mb-8">
        ※ 社会保険料・所得税は概算です。実際の金額は標準報酬月額・扶養状況等により異なります。
      </p>

      <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        山田ツール | yamada-tools.jp — 無料計算ツール集 | スタッフ: {s.name}
      </div>
    </div>
  );
}
