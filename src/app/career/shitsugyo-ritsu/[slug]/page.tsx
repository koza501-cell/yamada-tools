"use client";

import { use, useState, useEffect, useCallback } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ComposedChart, Line, Scatter, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, ReferenceLine,
} from "recharts";

const API = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/estat";

const VALID_SLUGS = new Set([
  "hokkaido","aomori","iwate","miyagi","akita","yamagata","fukushima","ibaraki","tochigi","gunma",
  "saitama","chiba","tokyo","kanagawa","niigata","toyama","ishikawa","fukui","yamanashi","nagano",
  "gifu","shizuoka","aichi","mie","shiga","kyoto","osaka","hyogo","nara","wakayama",
  "tottori","shimane","okayama","hiroshima","yamaguchi","tokushima","kagawa","ehime","kochi",
  "fukuoka","saga","nagasaki","kumamoto","oita","miyazaki","kagoshima","okinawa",
]);

type PrefData = {
  slug: string; pref_name: string; pref_code: string;
  unemployment_rate: number | null; unemployment_year: number;
  national_unemployment: number | null; national_unemployment_annual: number | null;
  national_annual_year: number;
  "kujin_倍率": number | null; kujin_year: number | null;
  rank_low: number | null; rank_high: number | null; total_prefs: number;
  chart: { year: number; pref_unemp?: number; nat_census_unemp?: number; nat_annual_unemp?: number; pref_kujin?: number }[];
};

function rateColor(rate: number | null): string {
  if (!rate) return "text-gray-600 dark:text-gray-400";
  if (rate <= 3.0) return "text-emerald-600 dark:text-emerald-400";
  if (rate <= 3.5) return "text-green-600 dark:text-green-400";
  if (rate <= 4.0) return "text-yellow-600 dark:text-yellow-400";
  if (rate <= 4.5) return "text-orange-500 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

export default function PrefShitsugyoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  if (!VALID_SLUGS.has(slug)) notFound();

  const [data, setData] = useState<PrefData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(API + "/shitsugyo/prefecture/" + slug, { cache: "no-store" });
      if (r.ok) setData(await r.json());
    } catch { /* silent */ } finally { setLoading(false); }
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!data) notFound();

  const kujinChart = data.chart.filter((d) => d.pref_kujin !== undefined);

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        "name": `${data.pref_name}の完全失業率データ（${data.unemployment_year}年）`,
        "description": `${data.pref_name}の完全失業率${data.unemployment_rate}%（${data.unemployment_year}年 国勢調査）、有効求人倍率${data["kujin_倍率"]}倍（${data.kujin_year}年）。`,
        "url": `https://yamada-tools.jp/career/shitsugyo-ritsu/${slug}`,
        "creator": { "@type": "Organization", "name": "総務省" },
        "temporalCoverage": String(data.unemployment_year),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
          { "@type": "ListItem", "position": 2, "name": "キャリア・転職", "item": "https://yamada-tools.jp/career" },
          { "@type": "ListItem", "position": 3, "name": "失業率", "item": "https://yamada-tools.jp/career/shitsugyo-ritsu" },
          { "@type": "ListItem", "position": 4, "name": `${data.pref_name}の失業率`, "item": `https://yamada-tools.jp/career/shitsugyo-ritsu/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-gradient-to-br from-indigo-700 to-blue-600 text-white py-10">
          <div className="max-w-4xl mx-auto px-4">
            <nav className="text-sm text-white/70 mb-2 flex items-center gap-1 flex-wrap">
              <Link href="/career" className="hover:text-white">キャリア・転職</Link>
              <span>›</span>
              <Link href="/career/shitsugyo-ritsu" className="hover:text-white">失業率</Link>
              <span>›</span>
              <span className="text-white">{data.pref_name}</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold">{data.pref_name}の失業率</h1>
            <p className="text-white/80 text-sm mt-2">
              完全失業率（{data.unemployment_year}年 国勢調査）・有効求人倍率（{data.kujin_year}年）
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Key stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">{data.pref_name}の雇用状況</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">完全失業率</div>
                <div className={`text-3xl font-bold ${rateColor(data.unemployment_rate)}`}>
                  {data.unemployment_rate ?? "―"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">%（{data.unemployment_year}年）</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">全国平均（国調）</div>
                <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">{data.national_unemployment ?? "―"}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">%（{data.unemployment_year}年）</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">有効求人倍率</div>
                <div className={`text-3xl font-bold ${(data["kujin_倍率"] ?? 0) >= 1 ? "text-emerald-600 dark:text-emerald-400" : "text-orange-500"}`}>
                  {data["kujin_倍率"] ?? "―"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">倍（{data.kujin_year}年）</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">全国順位</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {data.rank_low}位
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">低い順/{data.total_prefs}都道府県</div>
              </div>
            </div>
            {data.unemployment_rate !== null && data.national_unemployment !== null && (
              <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 text-sm text-gray-700 dark:text-gray-300">
                全国平均との差：
                <span className={`font-bold ml-1 ${data.unemployment_rate >= data.national_unemployment ? "text-red-500" : "text-emerald-600"}`}>
                  {data.unemployment_rate >= data.national_unemployment ? "+" : ""}
                  {(data.unemployment_rate - data.national_unemployment).toFixed(1)}ポイント
                </span>
                <span className="ml-4 text-xs text-gray-400">
                  ※ 労働力調査ベース全国平均：{data.national_unemployment_annual}%（{data.national_annual_year}年）
                </span>
              </div>
            )}
          </div>

          {/* Trend chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 dark:text-white mb-1">完全失業率の推移</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              ●: {data.pref_name}（国勢調査）　線: 全国（労働力調査年次）
            </p>
            <ResponsiveContainer width="100%" height={260}>
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

          {/* 有効求人倍率 chart */}
          {kujinChart.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-1">{data.pref_name}の有効求人倍率推移</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">厚生労働省 職業安定業務統計</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={kujinChart} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, "auto"]} tick={{ fontSize: 10 }} tickFormatter={(v) => v + "倍"} />
                  <ReferenceLine y={1} stroke="#6366f1" strokeDasharray="4 4" label={{ value: "1倍", position: "right", fontSize: 9, fill: "#6366f1" }} />
                  <Tooltip formatter={(v) => [Number(v).toFixed(2) + "倍", "有効求人倍率"]} />
                  <Bar dataKey="pref_kujin" radius={[4, 4, 0, 0]}>
                    {kujinChart.map((d, i) => (
                      <Cell key={i} fill={(d.pref_kujin ?? 0) >= 1 ? "#10b981" : "#f97316"} />
                    ))}
                  </Bar>
                </BarChart>
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
            <Link href="/finance/heikin-nenshu"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
              <span className="text-xl">💰</span>
              <div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">平均年収ツール</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">給与水準も確認</div>
              </div>
            </Link>
            <Link href="/finance/jinko-suikei"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
              <span className="text-xl">📈</span>
              <div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">人口推移ツール</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">地域の人口動向</div>
              </div>
            </Link>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            ⚠️ 完全失業率は総務省 令和2年（2020年）国勢調査に基づく統計値です。個人の状況は地域内でも異なります。
          </p>
        </div>
      </div>
    </>
  );
}
