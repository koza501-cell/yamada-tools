"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";

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

type PrefData = {
  slug: string; pref_name: string; pref_code: string;
  unemployment_rate: number | null; unemployment_year: number;
  national_unemployment: number | null; national_unemployment_annual: number | null;
  national_annual_year: number;
  "kujin_倍率": number | null; kujin_year: number | null;
  rank_low: number | null; rank_high: number | null; total_prefs: number;
  chart: { year: number; pref_unemp?: number; nat_census_unemp?: number; nat_annual_unemp?: number }[];
};

function rateColor(rate: number | null): string {
  if (!rate) return "text-gray-600 dark:text-gray-400";
  if (rate <= 3.0) return "text-emerald-600 dark:text-emerald-400";
  if (rate <= 3.5) return "text-green-600 dark:text-green-400";
  if (rate <= 4.0) return "text-yellow-600 dark:text-yellow-400";
  if (rate <= 4.5) return "text-orange-500 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

export default function ShitsugyoRitsuPage() {
  const [slug, setSlug] = useState("tokyo");
  const [data, setData] = useState<PrefData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (s: string) => {
    setLoading(true); setData(null);
    try {
      const r = await fetch(API + "/shitsugyo/prefecture/" + s);
      if (r.ok) setData(await r.json());
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(slug); }, [slug, fetchData]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-br from-indigo-700 to-blue-600 text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm text-white/70 mb-2 flex items-center gap-1 flex-wrap">
            <Link href="/career" className="hover:text-white">キャリア・転職</Link>
            <span>›</span>
            <span className="text-white">失業率</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold">都道府県別 失業率ランキング</h1>
          <p className="text-white/80 text-sm mt-2">総務省 国勢調査・労働力調査データ準拠</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 text-xs">
            <span className="text-yellow-300">★</span>
            <span>総務省 労働力調査データ準拠</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Mascot */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 flex items-start gap-3">
          <div className="text-3xl shrink-0">🤖</div>
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">アイちゃんより</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">あなたの地域の雇用状況をチェック！完全失業率・有効求人倍率で地域の労働市場を確認できます。</p>
          </div>
        </div>

        {/* Prefecture selector */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">都道府県を選択</label>
          <select value={slug} onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {Object.entries(PREF_NAMES).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
          </select>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded w-1/2" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-700 rounded" />)}
              </div>
            </div>
          </div>
        ) : data ? (
          <>
            {/* Key stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">
                {data.pref_name}の雇用状況（{data.unemployment_year}年 国勢調査）
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">完全失業率</div>
                  <div className={`text-3xl font-bold ${rateColor(data.unemployment_rate)}`}>
                    {data.unemployment_rate ?? "―"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">%</div>
                  <div className="text-xs text-gray-400 mt-1">({data.unemployment_year}年)</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">全国平均</div>
                  <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">{data.national_unemployment ?? "―"}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">%（国勢調査）</div>
                  <div className="text-xs text-gray-400 mt-1">{data.national_unemployment_annual}%（労調{data.national_annual_year}）</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">有効求人倍率</div>
                  <div className={`text-3xl font-bold ${(data["kujin_倍率"] ?? 0) >= 1 ? "text-emerald-600 dark:text-emerald-400" : "text-orange-500 dark:text-orange-400"}`}>
                    {data["kujin_倍率"] ?? "―"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">倍（{data.kujin_year}年）</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">全国順位</div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {data.rank_low !== null ? `${data.rank_low}位` : "―"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    低い順（/{data.total_prefs}）
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    高い順: {data.rank_high}位
                  </div>
                </div>
              </div>

              {/* Diff badge */}
              {data.unemployment_rate !== null && data.national_unemployment !== null && (
                <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 text-sm text-gray-700 dark:text-gray-300">
                  全国平均（{data.national_unemployment}%）との差：
                  <span className={`font-bold ml-1 ${data.unemployment_rate >= data.national_unemployment ? "text-red-500" : "text-emerald-600"}`}>
                    {data.unemployment_rate >= data.national_unemployment ? "+" : ""}
                    {(data.unemployment_rate - data.national_unemployment).toFixed(1)}ポイント
                  </span>
                </div>
              )}
            </div>

            {/* Trend chart */}
            {data.chart.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 className="font-bold text-gray-900 dark:text-white mb-1">完全失業率の推移</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  ●は国勢調査ベース都道府県値。線は全国の労働力調査年次データ。
                </p>
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={data.chart} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, "auto"]} tick={{ fontSize: 10 }} tickFormatter={(v) => v + "%"} />
                    <Tooltip formatter={(v) => [Number(v).toFixed(1) + "%", ""]} />
                    <Legend />
                    <Line
                      type="monotone" dataKey="nat_annual_unemp" name="全国（労働力調査）"
                      stroke="#6366f1" strokeWidth={2} dot={false} connectNulls
                    />
                    <Scatter dataKey="pref_unemp" name={`${data.pref_name}（国勢調査）`} fill="#f59e0b" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Cross links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/career/shitsugyo-ritsu/ranking"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
                <span className="text-xl">🏆</span>
                <div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">全国ランキング</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">47都道府県を比較</div>
                </div>
              </Link>
              <Link href={"/career/shitsugyo-ritsu/" + slug}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
                <span className="text-xl">📊</span>
                <div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">{data.pref_name}の詳細</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">詳細ページを見る</div>
                </div>
              </Link>
              <Link href="/finance/heikin-nenshu"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
                <span className="text-xl">💰</span>
                <div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">平均年収ツール</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">給与水準も確認</div>
                </div>
              </Link>
            </div>
          </>
        ) : null}

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ⚠️ 完全失業率は総務省 令和2年（2020年）国勢調査に基づく統計値です。有効求人倍率は厚生労働省 職業安定業務統計（{new Date().getFullYear() - 2}年）。本データは政府統計の数値です。個人の状況は地域内でも異なります。
        </p>
      </div>
    </div>
  );
}
