"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
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

// Adjacent prefectures for internal linking
const NEIGHBORS: Record<string, string[]> = {
  tokyo: ["kanagawa","saitama","chiba"],
  kanagawa: ["tokyo","saitama","chiba"],
  osaka: ["kyoto","hyogo","nara"],
  aichi: ["shizuoka","gifu","mie"],
  fukuoka: ["saga","nagasaki","kumamoto","oita"],
  hokkaido: ["aomori"],
};

type ByAge = { code: string; label: string; annual_man: number; monthly_sen: number; bonus_sen: number };
type PrefData = {
  pref_name: string; pref_code: string; slug: string;
  annual_man: number; monthly_sen: number; bonus_sen: number;
  national_avg_man: number; diff_man: number; rank: number; total_prefs: number;
  by_age: ByAge[]; year: number; data_source: string;
};

export default function PrefecturePage({ params }: { params: Promise<{ prefecture: string }> }) {
  const { prefecture } = use(params);
  const prefName = PREF_NAMES[prefecture];

  const [data, setData] = useState<PrefData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound_, setNotFound] = useState(false);

  useEffect(() => {
    if (!prefName) { setNotFound(true); return; }
    fetch(`${API}/prefecture/${prefecture}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((d) => { if (d) setData(d); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [prefecture, prefName]);

  if (notFound_) return notFound();

  const neighbors = NEIGHBORS[prefecture] || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-600 text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm text-white/70 mb-2 flex items-center gap-1 flex-wrap">
            <Link href="/finance" className="hover:text-white">金融・投資</Link>
            <span>›</span>
            <Link href="/finance/heikin-nenshu" className="hover:text-white">平均年収検索</Link>
            <span>›</span>
            <span className="text-white">{prefName}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold">{prefName}の平均年収【2023年最新】</h1>
          <p className="text-white/80 text-sm mt-2">
            業種・年齢別データ｜政府統計（賃金構造基本統計調査）準拠
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded w-1/2 mx-auto" />
              <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded" />
              <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ) : data ? (
          <>
            {/* Key stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {prefName}の平均年収（全年齢・全産業・男女計）
              </p>
              <p className="text-5xl font-bold text-gray-900 dark:text-white mb-1">
                ¥{data.annual_man.toFixed(1)}
                <span className="text-2xl font-normal text-gray-500 ml-1">万</span>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  全国平均: <strong className="text-gray-900 dark:text-white">¥{data.national_avg_man.toFixed(1)}万</strong>
                </span>
                <span className={`font-semibold ${data.diff_man >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {data.diff_man >= 0 ? "+" : ""}{data.diff_man.toFixed(1)}万
                </span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs font-bold">
                  全国{data.rank}位/{data.total_prefs}都道府県
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 max-w-sm mx-auto text-sm">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">月給（所定内）</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    ¥{data.monthly_sen.toFixed(1)}<span className="text-xs font-normal">千円</span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">年間賞与</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    ¥{(data.bonus_sen / 10).toFixed(1)}<span className="text-xs font-normal">万</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Age chart */}
            {data.by_age.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 className="font-bold text-gray-900 dark:text-white mb-4">年齢階級別 平均年収</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={data.by_age} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}万`} domain={["auto", "auto"]} />
                    <Tooltip formatter={(v) => [`¥${Number(v).toFixed(1)}万`, "平均年収"]} />
                    <Line
                      type="monotone"
                      dataKey="annual_man"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#2563eb" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                {/* Table */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                        <th className="py-2 text-left font-medium">年齢階級</th>
                        <th className="py-2 text-right font-medium">平均年収</th>
                        <th className="py-2 text-right font-medium hidden sm:table-cell">月給（所定内）</th>
                        <th className="py-2 text-right font-medium hidden sm:table-cell">年間賞与</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                      {data.by_age.map((row) => (
                        <tr key={row.code} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-2 text-gray-900 dark:text-white">{row.label}</td>
                          <td className="py-2 text-right font-bold text-gray-900 dark:text-white">
                            ¥{row.annual_man.toFixed(1)}万
                          </td>
                          <td className="py-2 text-right text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                            ¥{row.monthly_sen.toFixed(1)}千円
                          </td>
                          <td className="py-2 text-right text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                            ¥{(row.bonus_sen / 10).toFixed(1)}万
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Schema.org Dataset */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Dataset",
                  name: `${prefName}の平均年収データ（2023年）`,
                  description: `${prefName}の平均年収。賃金構造基本統計調査（厚生労働省）2023年データ。`,
                  url: `https://yamada-tools.jp/finance/heikin-nenshu/${prefecture}`,
                  creator: { "@type": "Organization", name: "厚生労働省" },
                  license: "https://www.e-stat.go.jp/terms-of-use",
                  temporalCoverage: "2023",
                }),
              }}
            />
          </>
        ) : null}

        {/* Compare with neighbors */}
        {neighbors.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">近隣都道府県と比較</h3>
            <div className="flex flex-wrap gap-2">
              {neighbors.map((slug) => (
                <Link
                  key={slug}
                  href={`/finance/heikin-nenshu/${slug}`}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  {PREF_NAMES[slug]}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Internal links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/finance/heikin-nenshu"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
            <span className="text-xl">🔍</span>
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">条件を変えて検索</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">業種・年齢・性別で絞り込む</div>
            </div>
          </Link>
          <Link href="/finance/heikin-nenshu/ranking"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
            <span className="text-xl">📊</span>
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">全国ランキングを見る</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">47都道府県を一覧比較</div>
            </div>
          </Link>
        </div>

        {/* Breadcrumb schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
                { "@type": "ListItem", position: 2, name: "金融・投資", item: "https://yamada-tools.jp/finance" },
                { "@type": "ListItem", position: 3, name: "平均年収検索", item: "https://yamada-tools.jp/finance/heikin-nenshu" },
                { "@type": "ListItem", position: 4, name: `${prefName}`, item: `https://yamada-tools.jp/finance/heikin-nenshu/${prefecture}` },
              ],
            }),
          }}
        />

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ⚠️ 本データは政府統計（{data?.data_source || "賃金構造基本統計調査（厚生労働省）"}）をもとに表示しています。
          実際の年収は個人差があります。企業規模10人以上の一般労働者が対象です。
        </p>
      </div>
    </div>
  );
}
