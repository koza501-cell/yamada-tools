"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const API = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/estat";

const INDUSTRIES = [
  { code: "01", label: "産業計" },
  { code: "03", label: "建設業" },
  { code: "07", label: "製造業" },
  { code: "32", label: "電気・ガス・水道業" },
  { code: "37", label: "情報通信業" },
  { code: "40", label: "情報サービス業" },
  { code: "43", label: "運輸業・郵便業" },
  { code: "52", label: "卸売業・小売業" },
  { code: "67", label: "金融業・保険業" },
  { code: "74", label: "不動産業" },
  { code: "78", label: "学術研究・専門サービス業" },
  { code: "83", label: "宿泊・飲食サービス業" },
  { code: "91", label: "教育・学習支援業" },
  { code: "94", label: "医療・福祉" },
  { code: "101", label: "サービス業（他分類外）" },
];

const AGE_CLASSES = [
  { code: "01", label: "全年齢" }, { code: "05", label: "30～34歳" },
  { code: "06", label: "35～39歳" }, { code: "07", label: "40～44歳" },
];

type IndustryResult = {
  industry_code: string; industry_label: string; annual_man: number; monthly_sen: number; bonus_sen: number;
};

export default function HeikinNenshuIndustryClient() {
  const [ageClass, setAgeClass] = useState("01");
  const [gender, setGender] = useState("01");
  const [results, setResults] = useState<IndustryResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch for each industry code (Tokyo = 13000 as reference, but we show national average area=all)
      // We use the ranking endpoint per industry with all prefectures and take avg
      const fetches = INDUSTRIES.map(async (ind) => {
        const r = await fetch(
          `${API}/ranking?age_class=${ageClass}&industry=${ind.code}&gender=${gender}`
        );
        if (!r.ok) return null;
        const d = await r.json();
        const nat = d.national_avg_man as number;
        return {
          industry_code: ind.code,
          industry_label: ind.label,
          annual_man: nat,
          monthly_sen: 0,
          bonus_sen: 0,
        } as IndustryResult;
      });
      const res = await Promise.all(fetches);
      const valid = res.filter(Boolean) as IndustryResult[];
      // Sort by annual descending, move 産業計 to top
      const total = valid.find((x) => x.industry_code === "01");
      const rest = valid.filter((x) => x.industry_code !== "01").sort((a, b) => b.annual_man - a.annual_man);
      setResults(total ? [total, ...rest] : rest);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [ageClass, gender]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalAvg = results.find((r) => r.industry_code === "01")?.annual_man || 0;
  const displayData = results.filter((r) => r.industry_code !== "01");
  const maxVal = Math.max(...displayData.map((r) => r.annual_man), 1);

  const COLORS = [
    "#1d4ed8","#2563eb","#3b82f6","#60a5fa","#93c5fd",
    "#6366f1","#818cf8","#a5b4fc","#c7d2fe",
    "#0ea5e9","#38bdf8","#7dd3fc","#bae6fd","#e0f2fe",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-br from-blue-700 to-indigo-600 text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm text-white/70 mb-2">
            <Link href="/finance" className="hover:text-white">金融・投資</Link>
            {" "}›{" "}
            <Link href="/finance/heikin-nenshu" className="hover:text-white">平均年収検索</Link>
            {" "}›{" "}業種別
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">業種別 平均年収ランキング</h1>
          <p className="text-white/80 text-sm mt-2">
            全国平均（47都道府県の単純平均）・政府統計 2023年
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">年齢階級</label>
              <select value={ageClass} onChange={(e) => setAgeClass(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon">
                {AGE_CLASSES.map((a) => <option key={a.code} value={a.code}>{a.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">性別</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon">
                <option value="01">男女計</option>
                <option value="02">男性</option>
                <option value="03">女性</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="animate-pulse space-y-3">
              {[...Array(8)].map((_, i) => <div key={i} className="h-10 bg-gray-100 dark:bg-gray-700 rounded" />)}
            </div>
          </div>
        ) : (
          <>
            {/* Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">業種別 全国平均年収</h2>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={displayData.map((r, i) => ({ name: r.industry_label.replace(/業$/, ""), annual: r.annual_man, color: COLORS[i % COLORS.length] }))}
                  layout="vertical"
                  margin={{ top: 5, right: 60, left: 120, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}万`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
                  <Tooltip formatter={(v) => [`¥${Number(v).toFixed(1)}万`, "全国平均年収"]} />
                  <Bar dataKey="annual" radius={[0, 4, 4, 0]}>
                    {displayData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 text-left text-xs text-gray-500 dark:text-gray-400">
                    <th className="px-5 py-3 font-medium">順位</th>
                    <th className="px-5 py-3 font-medium">業種</th>
                    <th className="px-5 py-3 font-medium text-right">全国平均年収</th>
                    <th className="px-5 py-3 font-medium text-right hidden sm:table-cell">全国平均比</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {displayData.map((r, i) => (
                    <tr key={r.industry_code} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">{i + 1}</td>
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{r.industry_label}</td>
                      <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white">
                        ¥{r.annual_man.toFixed(1)}万
                      </td>
                      <td className={`px-5 py-3 text-right hidden sm:table-cell font-medium ${r.annual_man >= totalAvg ? "text-green-600" : "text-danger"}`}>
                        {r.annual_man >= totalAvg ? "+" : ""}{(r.annual_man - totalAvg).toFixed(1)}万
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ⚠️ 表示は47都道府県の単純平均です。本データは政府統計（賃金構造基本統計調査 2023年）をもとに表示しています。
          実際の年収は個人差があります。
        </p>
      </div>
    </div>
  );
}
