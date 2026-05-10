"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const API = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/estat";

type PrefItem = {
  rank: number; pref_code: string; pref_name: string; slug: string;
  population_2024: number; population_2020: number;
  growth_pct: number; aging_rate: number; youth_rate: number;
};

function fmtPop(n: number): string {
  return Math.round(n / 10000).toLocaleString() + "万人";
}

export default function JinkoRankingPage() {
  const [sort, setSort] = useState("population");
  const [prefectures, setPrefectures] = useState<PrefItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (s: string) => {
    setLoading(true);
    try {
      const r = await fetch(API + "/jinko/ranking?sort=" + s);
      if (r.ok) {
        const d = await r.json();
        setPrefectures(d.prefectures || []);
      }
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(sort); }, [sort, fetchData]);

  const top15 = prefectures.slice(0, 15);
  const barKey = sort === "aging" ? "aging_rate" : sort === "growth" || sort === "growth_asc" ? "growth_pct" : "population_2024";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-br from-teal-700 to-emerald-600 text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm text-white/70 mb-2 flex items-center gap-1 flex-wrap">
            <Link href="/finance" className="hover:text-white">金融・投資</Link>
            <span>›</span>
            <Link href="/finance/jinko-suikei" className="hover:text-white">人口推移</Link>
            <span>›</span>
            <span className="text-white">ランキング</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold">都道府県別 人口ランキング</h1>
          <p className="text-white/80 text-sm mt-2">政府統計（社会・人口統計体系 2024年）</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Sort selector */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">並び替え</label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "population", label: "人口（多い順）" },
              { key: "growth", label: "増減率（増加順）" },
              { key: "growth_asc", label: "増減率（減少順）" },
              { key: "aging", label: "高齢化率（高い順）" },
            ].map((opt) => (
              <button key={opt.key} onClick={() => setSort(opt.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  sort === opt.key
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <div className="animate-pulse space-y-3">
              {[...Array(10)].map((_, i) => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded" />)}
            </div>
          </div>
        ) : (
          <>
            {/* Bar chart top 15 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">上位15都道府県</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={top15.map((p) => {
                    const vals: Record<string, number> = { population_2024: p.population_2024, growth_pct: p.growth_pct, aging_rate: p.aging_rate };
                    return { name: p.pref_name.replace(/[都道府県]$/, ""), value: vals[barKey] ?? 0, slug: p.slug };
                  })}
                  layout="vertical"
                  margin={{ top: 5, right: 60, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10 }}
                    tickFormatter={(v) => barKey === "population_2024" ? Math.round(v/10000) + "万" : v + (barKey === "aging_rate" ? "%" : "%")} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={70} />
                  <Tooltip
                    formatter={(v) => [
                      barKey === "population_2024" ? fmtPop(Number(v)) : Number(v).toFixed(1) + "%",
                      barKey === "population_2024" ? "人口" : barKey === "aging_rate" ? "高齢化率" : "増減率"
                    ]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {top15.map((_, index) => (
                      <Cell key={index} fill={index < 3 ? "#0f766e" : index < 10 ? "#0d9488" : "#5eead4"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Full table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {prefectures.map((p) => {
                  const maxPop = prefectures[0]?.population_2024 || 1;
                  const barWidth = Math.round((p.population_2024 / maxPop) * 100);
                  return (
                    <Link key={p.pref_code} href={"/finance/jinko-suikei/" + p.slug}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <span className={`text-sm font-bold w-6 shrink-0 ${p.rank <= 3 ? "text-yellow-500" : "text-gray-400"}`}>{p.rank}</span>
                      <span className="w-20 shrink-0 text-sm font-medium text-gray-900 dark:text-white">{p.pref_name}</span>
                      <div className="flex-1 hidden sm:block">
                        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: barWidth + "%" }} />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white w-24 text-right shrink-0">{fmtPop(p.population_2024)}</span>
                      <span className={`text-xs w-14 text-right shrink-0 font-medium ${p.growth_pct >= 0 ? "text-green-600" : "text-danger"}`}>
                        {p.growth_pct >= 0 ? "+" : ""}{p.growth_pct}%
                      </span>
                      <span className="text-xs w-12 text-right shrink-0 text-gray-500 dark:text-gray-400 hidden sm:block">{p.aging_rate}%高齢</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ⚠️ 本データは政府統計（社会・人口統計体系 e-Stat 2024年）をもとに表示しています。
        </p>
      </div>
    </div>
  );
}
