"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

const API = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/estat";

const PREF_NAMES: Record<string, string> = {
  hokkaido:"北海道", aomori:"青森県", iwate:"岩手県", miyagi:"宮城県", akita:"秋田県",
  yamagata:"山形県", fukushima:"福島県", ibaraki:"茨城県", tochigi:"栃木県", gunma:"群馬県",
  saitama:"埼玉県", chiba:"千葉県", tokyo:"東京都", kanagawa:"神奈川県", niigata:"新潟県",
  toyama:"富山県", ishikawa:"石川県", fukui:"福井県", yamanashi:"山梨県", nagano:"長野県",
  gifu:"岐阜県", shizuoka:"静岡県", aichi:"愛知県", mie:"三重県", shiga:"滋賀県",
  kyoto:"京都府", osaka:"大阪府", hyogo:"兵庫県", nara:"奈良県", wakayama:"和歌山県",
  tottori:"鳥取県", shimane:"島根県", okayama:"岡山県", hiroshima:"広島県", yamaguchi:"山口県",
  tokushima:"徳島県", kagawa:"香川県", ehime:"愛媛県", kochi:"高知県", fukuoka:"福岡県",
  saga:"佐賀県", nagasaki:"長崎県", kumamoto:"熊本県", oita:"大分県", miyazaki:"宮崎県",
  kagoshima:"鹿児島県", okinawa:"沖縄県",
};

type PyramidRow = { age_group: string; total: number; male: number; female: number };
type PyramidData = { pref_name: string; slug: string; year: number; pyramid: PyramidRow[] };

export default function JinkoSuikeiAgePyramidClient() {
  const [slug, setSlug] = useState("tokyo");
  const [year, setYear] = useState(2024);
  const [data, setData] = useState<PyramidData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (s: string, y: number) => {
    setLoading(true); setData(null);
    try {
      const r = await fetch(API + "/jinko/age-pyramid/" + s + "?year=" + y);
      if (r.ok) setData(await r.json());
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(slug, year); }, [slug, year, fetchData]);

  // Build pyramid chart data - male is negative (left), female is positive (right)
  const pyramidData = (data?.pyramid ?? []).map((row) => ({
    age: row.age_group,
    male: -row.male,
    female: row.female,
    total: row.total,
  })).reverse(); // oldest at top

  const maxVal = Math.max(...(data?.pyramid ?? []).map((r) => Math.max(r.male, r.female)), 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-br from-teal-700 to-emerald-600 text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm text-white/70 mb-2 flex items-center gap-1 flex-wrap">
            <Link href="/finance" className="hover:text-white">金融・投資</Link>
            <span>›</span>
            <Link href="/finance/jinko-suikei" className="hover:text-white">人口推移</Link>
            <span>›</span>
            <span className="text-white">年齢ピラミッド</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold">年齢別人口ピラミッド</h1>
          <p className="text-white/80 text-sm mt-2">都道府県・年別に男女別年齢構成を可視化</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">都道府県</label>
              <select value={slug} onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                {Object.entries(PREF_NAMES).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">年</label>
              <select value={year} onChange={(e) => setYear(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                {[2024, 2020, 2015, 2010, 2005, 2000, 1995, 1990, 1985, 1980].map((y) => (
                  <option key={y} value={y}>{y}年</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
            <div className="animate-pulse h-64 bg-gray-100 dark:bg-gray-700 rounded" />
          </div>
        ) : data ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-1">
                {data.pref_name} {data.year}年 年齢ピラミッド
              </h2>
              <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-kon inline-block" />男性</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-400 inline-block" />女性</span>
              </div>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={pyramidData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }} barCategoryGap="10%">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number"
                    tick={{ fontSize: 9 }}
                    tickFormatter={(v) => Math.abs(Math.round(v / 10000)) + "万"}
                    domain={[-maxVal * 1.05, maxVal * 1.05]}
                  />
                  <YAxis type="category" dataKey="age" tick={{ fontSize: 10 }} width={55} />
                  <Tooltip
                    formatter={(v, name) => [
                      Math.abs(Number(v)).toLocaleString() + "人",
                      name === "male" ? "男性" : "女性"
                    ]}
                  />
                  <ReferenceLine x={0} stroke="#6b7280" />
                  <Bar dataKey="male" fill="#3b82f6" radius={[4, 0, 0, 4]} name="male" />
                  <Bar dataKey="female" fill="#fb7185" radius={[0, 4, 4, 0]} name="female" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                    <th className="px-5 py-3 text-left font-medium">年齢階級</th>
                    <th className="px-5 py-3 text-right font-medium">合計</th>
                    <th className="px-5 py-3 text-right font-medium">男性</th>
                    <th className="px-5 py-3 text-right font-medium">女性</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {[...(data.pyramid ?? [])].reverse().map((row) => (
                    <tr key={row.age_group} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-5 py-2 font-medium text-gray-900 dark:text-white">{row.age_group}</td>
                      <td className="px-5 py-2 text-right text-gray-900 dark:text-white">{row.total.toLocaleString()}</td>
                      <td className="px-5 py-2 text-right text-kon dark:text-gray-300">{row.male.toLocaleString()}</td>
                      <td className="px-5 py-2 text-right text-rose-500 dark:text-rose-400">{row.female.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href={"/finance/jinko-suikei/" + slug}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
                <span className="text-xl">📈</span>
                <div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">{data.pref_name}の人口推移</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">1980〜2050年のトレンド</div>
                </div>
              </Link>
              <Link href="/finance/jinko-suikei/ranking"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
                <span className="text-xl">🏆</span>
                <div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">全国ランキング</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">高齢化率・人口増減を比較</div>
                </div>
              </Link>
            </div>
          </>
        ) : null}

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ⚠️ 本データは政府統計（社会・人口統計体系 e-Stat）をもとに表示しています。0〜79歳の16区分データ（80歳以上は非公開）。
        </p>
      </div>
    </div>
  );
}
