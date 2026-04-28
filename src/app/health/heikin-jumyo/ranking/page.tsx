"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

const API = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/estat";

type PrefItem = {
  rank: number; slug: string; pref_name: string;
  male: number; female: number; average: number;
};

export default function JumyoRankingPage() {
  const [sort, setSort] = useState("female");
  const [data, setData] = useState<{ prefectures: PrefItem[]; national_male: number; national_female: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (s: string) => {
    setLoading(true);
    try {
      const r = await fetch(API + "/jumyo/ranking?sort=" + s);
      if (r.ok) setData(await r.json());
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(sort); }, [sort, fetchData]);

  const prefectures = data?.prefectures ?? [];
  const top15 = prefectures.slice(0, 15);
  const barKey = sort === "male" || sort === "male_asc" ? "male" : sort === "average" ? "average" : "female";
  const nationalRef = sort === "male" || sort === "male_asc" ? data?.national_male : data?.national_female;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-br from-rose-600 to-pink-500 text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm text-white/70 mb-2 flex items-center gap-1 flex-wrap">
            <Link href="/health" className="hover:text-white">健康・生活</Link>
            <span>›</span>
            <Link href="/health/heikin-jumyo" className="hover:text-white">平均寿命</Link>
            <span>›</span>
            <span className="text-white">ランキング</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold">都道府県別 平均寿命ランキング</h1>
          <p className="text-white/80 text-sm mt-2">厚生労働省 令和2年（2020年）都道府県別生命表</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Sort buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">並び替え</label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "female", label: "女性（長寿順）" },
              { key: "female_asc", label: "女性（短命順）" },
              { key: "male", label: "男性（長寿順）" },
              { key: "male_asc", label: "男性（短命順）" },
              { key: "average", label: "平均（長寿順）" },
            ].map((opt) => (
              <button key={opt.key} onClick={() => setSort(opt.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  sort === opt.key
                    ? "bg-rose-600 text-white"
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
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">上位15都道府県</h2>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart
                  data={top15.map((p) => ({ name: p.pref_name.replace(/[都道府県]$/, ""), value: p[barKey], slug: p.slug }))}
                  layout="vertical"
                  margin={{ top: 5, right: 60, left: 70, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={["auto", "auto"]} tick={{ fontSize: 10 }}
                    tickFormatter={(v) => v + "歳"} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={60} />
                  {nationalRef && <ReferenceLine x={nationalRef} stroke="#6b7280" strokeDasharray="4 4" label={{ value: "全国平均", position: "top", fontSize: 9, fill: "#9ca3af" }} />}
                  <Tooltip formatter={(v) => [Number(v).toFixed(2) + "歳", barKey === "male" ? "男性" : barKey === "female" ? "女性" : "平均"]} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {top15.map((_, i) => (
                      <Cell key={i} fill={i < 3 ? "#e11d48" : i < 10 ? "#f43f5e" : "#fda4af"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Full table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {prefectures.map((p) => (
                  <Link key={p.slug} href={"/health/heikin-jumyo/" + p.slug}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <span className={`text-sm font-bold w-6 shrink-0 ${p.rank <= 3 ? "text-yellow-500" : "text-gray-400"}`}>{p.rank}</span>
                    <span className="w-20 shrink-0 text-sm font-medium text-gray-900 dark:text-white">{p.pref_name}</span>
                    <div className="flex-1 hidden sm:flex gap-4 text-sm">
                      <span className="text-blue-600 dark:text-blue-400">男 <strong>{p.male}</strong>歳</span>
                      <span className="text-rose-500 dark:text-rose-400">女 <strong>{p.female}</strong>歳</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">平均 {p.average}歳</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* National averages note */}
            {data && (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl px-5 py-3 text-sm text-gray-600 dark:text-gray-400 flex gap-6">
                <span>全国平均（2020年）：</span>
                <span className="text-blue-600 dark:text-blue-400">男性 {data.national_male}歳</span>
                <span className="text-rose-500 dark:text-rose-400">女性 {data.national_female}歳</span>
              </div>
            )}
          </>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ⚠️ 本データは厚生労働省の令和2年（2020年）都道府県別生命表に基づく統計値です。実際の寿命は個人差があります。
        </p>
      </div>
    </div>
  );
}
