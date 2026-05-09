"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

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

type YomeiData = {
  slug: string; pref_name: string; age: number; gender: string;
  remaining_years: number; expected_death_age: number;
  national_remaining: number; pref_base: number; national_base: number;
  table: { age: number; remaining_years: number; expected_death_age: number }[];
};

export default function YomeiPage() {
  const [slug, setSlug] = useState("tokyo");
  const [age, setAge] = useState(40);
  const [gender, setGender] = useState("male");
  const [data, setData] = useState<YomeiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);

  const calculate = async () => {
    setLoading(true); setData(null);
    try {
      const r = await fetch(`${API}/jumyo/age-life-expectancy/${slug}?age=${age}&gender=${gender}`);
      if (r.ok) { setData(await r.json()); setCalculated(true); }
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const genderLabel = gender === "male" ? "男性" : "女性";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-br from-purple-600 to-violet-500 text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm text-white/70 mb-2 flex items-center gap-1 flex-wrap">
            <Link href="/health" className="hover:text-white">健康・生活</Link>
            <span>›</span>
            <Link href="/health/heikin-jumyo" className="hover:text-white">平均寿命</Link>
            <span>›</span>
            <span className="text-white">余命計算</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold">余命計算ツール</h1>
          <p className="text-white/80 text-sm mt-2">年齢・性別・都道府県から統計的な余命を計算</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Input form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">条件を入力</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">現在の年齢</label>
              <input
                type="number" min={0} max={100} value={age}
                onChange={(e) => setAge(Math.max(0, Math.min(100, Number(e.target.value))))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">性別</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="male">男性</option>
                <option value="female">女性</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">都道府県</label>
              <select value={slug} onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                {Object.entries(PREF_NAMES).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
              </select>
            </div>
          </div>
          <button onClick={calculate} disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors">
            {loading ? "計算中..." : "余命を計算する"}
          </button>
        </div>

        {calculated && data && (
          <>
            {/* Result */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {data.pref_name}の{age}歳{genderLabel}の統計的余命
                </div>
                <div className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {data.remaining_years}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-lg">年</div>
                <div className="mt-3 text-gray-600 dark:text-gray-400">
                  統計的な平均寿命：<span className="font-bold text-gray-900 dark:text-white text-xl">{data.expected_death_age}歳</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">全国平均の余命</div>
                  <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{data.national_remaining}年</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">全国比</div>
                  <div className={`text-2xl font-bold ${data.remaining_years >= data.national_remaining ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                    {data.remaining_years >= data.national_remaining ? "+" : ""}{(data.remaining_years - data.national_remaining).toFixed(1)}年
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-xs text-amber-700 dark:text-amber-400">
                ※ 厚生労働省 令和2年完全生命表・都道府県別生命表に基づく統計的推計値です。実際の寿命は健康状態・生活習慣・遺伝等により大きく異なります。
              </div>
            </div>

            {/* Bar chart - remaining years by age */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">年齢別 余命グラフ</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.table} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" tick={{ fontSize: 10 }} tickFormatter={(v) => v + "歳"} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => v + "年"} />
                  <ReferenceLine x={age} stroke="#7c3aed" strokeWidth={2} label={{ value: "現在", position: "top", fontSize: 10, fill: "#7c3aed" }} />
                  <Tooltip formatter={(v) => [Number(v).toFixed(1) + "年", "余命"]} labelFormatter={(l) => l + "歳時点"} />
                  <Bar dataKey="remaining_years" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                    <th className="px-5 py-3 text-left font-medium">年齢</th>
                    <th className="px-5 py-3 text-right font-medium">余命</th>
                    <th className="px-5 py-3 text-right font-medium">統計的寿命</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {data.table.map((row) => (
                    <tr key={row.age} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${row.age === age ? "bg-purple-50 dark:bg-purple-900/20" : ""}`}>
                      <td className="px-5 py-2 font-medium text-gray-900 dark:text-white">
                        {row.age}歳{row.age === age ? " ← 現在" : ""}
                      </td>
                      <td className="px-5 py-2 text-right text-purple-600 dark:text-purple-400 font-bold">{row.remaining_years}年</td>
                      <td className="px-5 py-2 text-right text-gray-700 dark:text-gray-300">{row.expected_death_age}歳</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Cross links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/health/heikin-jumyo/ranking"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
            <span className="text-xl">🏆</span>
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">都道府県ランキング</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">長寿県・短命県を比較</div>
            </div>
          </Link>
          <Link href="/finance/heikin-nenshu"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
            <span className="text-xl">💰</span>
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">平均年収ツール</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">老後・相続計画に</div>
            </div>
          </Link>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ⚠️ 本データは厚生労働省の生命表に基づく統計値です。実際の寿命は個人差があります。
        </p>
      </div>
    </div>
  );
}
