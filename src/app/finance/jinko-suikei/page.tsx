"use client";

import { useState, useEffect, useCallback } from "react";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import Link from "next/link";
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

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

type ChartPoint = { year: number; population: number; type: string; aging_rate: number | null };
type PrefData = {
  pref_name: string; slug: string;
  current_population: number; population_2050_proj: number;
  growth_vs_2020_pct: number; change_to_2050_pct: number;
  aging_rate: number; youth_rate: number;
  chart: ChartPoint[]; projection_note: string;
};

function fmtPop(n: number): string {
  return Math.round(n / 10000).toLocaleString() + "万人";
}

const tool = getToolById("jinko-suikei");

export default function JinkoPage() {
  const [slug, setSlug] = useState("tokyo");
  const [data, setData] = useState<PrefData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (s: string) => {
    setLoading(true); setData(null);
    try {
      const r = await fetch(API + "/jinko/prefecture/" + s);
      if (r.ok) setData(await r.json());
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(slug); }, [slug, fetchData]);

  const chartData = (data?.chart ?? []).map((p) => ({
    year: p.year,
    actual: p.type === "actual" ? p.population : null,
    projection: p.type === "projection" ? p.population : (p.type === "actual" && p.year === 2024 ? p.population : null),
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-br from-teal-700 to-emerald-600 text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm text-white/70 mb-2 flex items-center gap-1 flex-wrap">
            <Link href="/finance" className="hover:text-white">金融・投資</Link>
            <span>›</span>
            <span className="text-white">人口推移・将来予測</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold">都道府県別 人口推移・将来予測</h1>
          <p className="text-white/80 text-sm mt-2">1980〜2024年の実績 + 2050年トレンド推計｜政府統計（e-Stat）準拠</p>
          <div className="mt-4 bg-white/10 rounded-xl px-4 py-3 text-sm max-w-sm">
            🤖 <span className="font-medium">アイちゃん:</span> あなたの地域の人口、20年後はどうなる？
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">都道府県を選択</label>
          <select value={slug} onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
            {Object.entries(PREF_NAMES).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
          </select>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full font-medium">政府統計 e-Stat + 社人研データ</span>
          </div>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-16 bg-gray-100 dark:bg-gray-700 rounded w-1/2 mx-auto" />
              <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ) : data ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-1">{data.pref_name}の人口（2024年推計）</p>
              <p className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">{fmtPop(data.current_population)}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">2020年比</p>
                  <p className={`font-bold text-lg ${data.growth_vs_2020_pct >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {data.growth_vs_2020_pct >= 0 ? "+" : ""}{data.growth_vs_2020_pct}%
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">高齢化率（65歳以上）</p>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">{data.aging_rate}%</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">少子化率（15歳未満）</p>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">{data.youth_rate}%</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">2050年変化予測</p>
                  <p className={`font-bold text-lg ${data.change_to_2050_pct >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {data.change_to_2050_pct >= 0 ? "+" : ""}{data.change_to_2050_pct}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-1">人口推移チャート（1980〜2050年）</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">実線=実績値 / 点線=トレンド推計</p>
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} interval={4} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => Math.round(v / 10000) + "万"} />
                  <Tooltip
                    formatter={(v, name) => [fmtPop(Number(v)), name === "actual" ? "実績" : "推計"]}
                    labelFormatter={(l) => l + "年"}
                  />
                  <Legend formatter={(v) => v === "actual" ? "実績" : "推計"} />
                  <Line type="monotone" dataKey="actual" stroke="#0d9488" strokeWidth={2.5} dot={false} connectNulls={false} name="actual" />
                  <Line type="monotone" dataKey="projection" stroke="#0d9488" strokeWidth={2} strokeDasharray="6 3" dot={false} connectNulls={false} name="projection" />
                </ComposedChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">{data.projection_note}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href={"/finance/jinko-suikei/" + data.slug}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
                <span className="text-xl">📊</span>
                <div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">{data.pref_name}の詳細ページ</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">年齢ピラミッドなど詳細データ</div>
                </div>
              </Link>
              <Link href="/finance/jinko-suikei/ranking"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
                <span className="text-xl">🏆</span>
                <div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">全国ランキングを見る</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">人口・高齢化率・増減率で比較</div>
                </div>
              </Link>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4 flex items-center gap-3">
              <span className="text-xl">💰</span>
              <div className="flex-1 text-sm">
                <span className="font-semibold text-teal-800 dark:text-teal-200">{data.pref_name}の平均年収も確認する</span>
                <span className="text-teal-700 dark:text-teal-300 ml-2 text-xs">人口と経済の関係を比べよう</span>
              </div>
              <Link href={"/finance/heikin-nenshu/" + data.slug}
                className="shrink-0 px-3 py-1.5 bg-teal-600 text-white text-xs rounded-lg hover:bg-teal-700">見る</Link>
            </div>
          </>
        ) : null}

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ⚠️ 本データは政府統計（社会・人口統計体系 e-Stat）をもとに表示しています。将来推計はトレンド計算によるもので、公式推計（社人研）と異なる場合があります。
        </p>
      </div>
    
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </div>
  );
}
