"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

const API = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/estat";

type PrefItem = {
  rank: number; slug: string; pref_name: string;
  unemployment_rate: number; "kujin_倍率": number | null;
};

function barColor(rate: number): string {
  if (rate <= 3.0) return "#10b981";
  if (rate <= 3.5) return "#34d399";
  if (rate <= 4.0) return "#fbbf24";
  if (rate <= 4.5) return "#f97316";
  return "#ef4444";
}

export default function ShitsugyoRankingPage() {
  const [sort, setSort] = useState("asc");
  const [data, setData] = useState<{ prefectures: PrefItem[]; national_unemployment: number | null; unemployment_year: number; kujin_year: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (s: string) => {
    setLoading(true);
    try {
      const r = await fetch(API + "/shitsugyo/ranking?sort=" + s);
      if (r.ok) setData(await r.json());
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(sort); }, [sort, fetchData]);

  const prefectures = data?.prefectures ?? [];
  const top15 = prefectures.slice(0, 15);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-br from-indigo-700 to-kon text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm text-white/70 mb-2 flex items-center gap-1 flex-wrap">
            <Link href="/career" className="hover:text-white">キャリア・転職</Link>
            <span>›</span>
            <Link href="/career/shitsugyo-ritsu" className="hover:text-white">失業率</Link>
            <span>›</span>
            <span className="text-white">ランキング</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold">都道府県別 失業率ランキング</h1>
          <p className="text-white/80 text-sm mt-2">
            完全失業率（{data?.unemployment_year ?? 2020}年 国勢調査）・有効求人倍率（{data?.kujin_year ?? 2024}年）
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Sort buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">並び替え</label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "asc", label: "失業率（低い順）" },
              { key: "desc", label: "失業率（高い順）" },
            ].map((opt) => (
              <button key={opt.key} onClick={() => setSort(opt.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  sort === opt.key
                    ? "bg-indigo-600 text-white"
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
            {/* Bar chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-1">
                {sort === "asc" ? "失業率が低い" : "失業率が高い"}上位15都道府県
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">完全失業率（国勢調査2020年）</p>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart
                  data={top15.map((p) => ({
                    name: p.pref_name.replace(/[都道府県]$/, ""),
                    value: p.unemployment_rate,
                    slug: p.slug,
                  }))}
                  layout="vertical"
                  margin={{ top: 5, right: 60, left: 70, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 6]} tick={{ fontSize: 10 }} tickFormatter={(v) => v + "%"} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={60} />
                  {data?.national_unemployment && (
                    <ReferenceLine
                      x={data.national_unemployment}
                      stroke="#6366f1"
                      strokeDasharray="4 4"
                      label={{ value: `全国 ${data.national_unemployment}%`, position: "top", fontSize: 9, fill: "#6366f1" }}
                    />
                  )}
                  <Tooltip formatter={(v) => [Number(v).toFixed(1) + "%", "完全失業率"]} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {top15.map((p, i) => (
                      <Cell key={i} fill={barColor(p.unemployment_rate)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Full table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400 flex gap-4 font-medium">
                <span className="w-6 shrink-0">順位</span>
                <span className="w-20 shrink-0">都道府県</span>
                <span className="flex-1 hidden sm:block">完全失業率（2020年）</span>
                <span className="w-20 text-right shrink-0">失業率</span>
                <span className="w-20 text-right shrink-0 hidden sm:block">求人倍率</span>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {prefectures.map((p) => (
                  <Link key={p.slug} href={"/career/shitsugyo-ritsu/" + p.slug}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <span className={`text-sm font-bold w-6 shrink-0 ${p.rank <= 3 ? "text-yellow-500" : "text-gray-400"}`}>{p.rank}</span>
                    <span className="w-20 shrink-0 text-sm font-medium text-gray-900 dark:text-white">{p.pref_name}</span>
                    <div className="flex-1 hidden sm:block">
                      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(p.unemployment_rate / 6) * 100}%`,
                            backgroundColor: barColor(p.unemployment_rate),
                          }}
                        />
                      </div>
                    </div>
                    <span className={`text-sm font-bold w-20 text-right shrink-0 ${sort === "asc" && p.rank <= 3 ? "text-emerald-600 dark:text-emerald-400" : sort === "desc" && p.rank <= 3 ? "text-danger dark:text-danger" : "text-gray-900 dark:text-white"}`}>
                      {p.unemployment_rate}%
                    </span>
                    <span className="text-xs w-20 text-right shrink-0 text-gray-500 dark:text-gray-400 hidden sm:block">
                      {p["kujin_倍率"] !== null ? p["kujin_倍率"] + "倍" : "―"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">色凡例：</span>
              {[
                { color: "#10b981", label: "〜3.0%（低）" },
                { color: "#34d399", label: "3.0〜3.5%" },
                { color: "#fbbf24", label: "3.5〜4.0%" },
                { color: "#f97316", label: "4.0〜4.5%" },
                { color: "#ef4444", label: "4.5%超（高）" },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: item.color }} />
                  {item.label}
                </span>
              ))}
            </div>

            {data?.national_unemployment && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl px-5 py-3 text-sm text-indigo-700 dark:text-indigo-300">
                全国平均（2020年 国勢調査）：<strong>{data.national_unemployment}%</strong>
                <span className="ml-4 text-xs text-indigo-500">※ 労働力調査ベースの全国平均は約2.5%（定義が異なります）</span>
              </div>
            )}
          </>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ⚠️ 完全失業率は総務省 令和2年（2020年）国勢調査に基づく統計値です。個人の状況は地域内でも異なります。
        </p>
      </div>
    </div>
  );
}
