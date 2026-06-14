"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ComposedChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine, Cell,
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

const NEIGHBORS: Record<string, string[]> = {
  tokyo: ["kanagawa","saitama","chiba"],
  kanagawa: ["tokyo","saitama","chiba"],
  osaka: ["kyoto","hyogo","nara"],
  aichi: ["shizuoka","gifu","mie"],
  fukuoka: ["saga","nagasaki","kumamoto","oita"],
  hokkaido: ["aomori"],
};

type ChartPoint = { year: number; population: number; type: string; aging_rate: number | null };
type PyramidRow = { age_group: string; total: number; male: number; female: number };
type PrefData = {
  pref_name: string; slug: string;
  current_population: number; population_2020: number; population_2050_proj: number;
  growth_vs_2020_pct: number; change_to_2050_pct: number;
  aging_rate: number; youth_rate: number; national_population: number;
  chart: ChartPoint[]; projection_note: string; data_source: string;
};

function fmtPop(n: number): string {
  return Math.round(n / 10000).toLocaleString() + "万人";
}

export default function PrefecturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const prefName = PREF_NAMES[slug];

  const [data, setData] = useState<PrefData | null>(null);
  const [pyramid, setPyramid] = useState<PyramidRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound_, setNotFound] = useState(false);

  useEffect(() => {
    if (!prefName) { setNotFound(true); return; }
    Promise.all([
      fetch(API + "/jinko/prefecture/" + slug).then((r) => r.ok ? r.json() : null),
      fetch(API + "/jinko/age-pyramid/" + slug).then((r) => r.ok ? r.json() : null),
    ]).then(([d, p]) => {
      if (d) setData(d);
      if (p) setPyramid(p.pyramid || []);
    }).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [slug, prefName]);

  if (notFound_) return notFound();

  const chartData = (data?.chart ?? []).map((p) => ({
    year: p.year,
    actual: p.type === "actual" ? p.population : null,
    projection: p.type === "projection" ? p.population : (p.type === "actual" && p.year === 2024 ? p.population : null),
  }));

  const pyramidData = [...pyramid].reverse().map((row) => ({
    age: row.age_group,
    male: -row.male,
    female: row.female,
  }));
  const maxPyrVal = Math.max(...pyramid.map((r) => Math.max(r.male, r.female)), 1);

  const neighbors = NEIGHBORS[slug] || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-700 to-emerald-600 text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm text-white/70 mb-2 flex items-center gap-1 flex-wrap">
            <Link href="/finance" className="hover:text-white">金融・投資</Link>
            <span>›</span>
            <Link href="/finance/jinko-suikei" className="hover:text-white">人口推移</Link>
            <span>›</span>
            <span className="text-white">{prefName}</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold">{prefName}の人口推移と2050年予測【2024年最新】</h1>
          <p className="text-white/80 text-sm mt-2">政府統計（社会・人口統計体系 e-Stat）準拠</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-16 bg-gray-100 dark:bg-gray-700 rounded w-1/2 mx-auto" />
              <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded" />
              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ) : data ? (
          <>
            {/* Key stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{prefName}の人口（2024年推計）</p>
              <p className="text-5xl font-bold text-gray-900 dark:text-white mb-1">
                {fmtPop(data.current_population)}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  全国計: <strong className="text-gray-900 dark:text-white">{fmtPop(data.national_population)}</strong>
                </span>
                <span className={`font-semibold ${data.growth_vs_2020_pct >= 0 ? "text-green-600" : "text-danger"}`}>
                  2020年比 {data.growth_vs_2020_pct >= 0 ? "+" : ""}{data.growth_vs_2020_pct}%
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto text-sm">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">高齢化率</p>
                  <p className="font-bold text-gray-900 dark:text-white">{data.aging_rate}%</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">少子化率</p>
                  <p className="font-bold text-gray-900 dark:text-white">{data.youth_rate}%</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">2050年推計人口</p>
                  <p className="font-bold text-gray-900 dark:text-white">{fmtPop(data.population_2050_proj)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">2050年変化</p>
                  <p className={`font-bold ${data.change_to_2050_pct >= 0 ? "text-green-600" : "text-danger"}`}>
                    {data.change_to_2050_pct >= 0 ? "+" : ""}{data.change_to_2050_pct}%
                  </p>
                </div>
              </div>
            </div>

            {/* Trend chart */}
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

            {/* Age pyramid */}
            {pyramid.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 className="font-bold text-gray-900 dark:text-white mb-1">年齢ピラミッド（2024年）</h2>
                <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-kon inline-block" />男性</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-400 inline-block" />女性</span>
                </div>
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart data={pyramidData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }} barCategoryGap="10%">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 9 }}
                      tickFormatter={(v) => Math.abs(Math.round(v / 10000)) + "万"}
                      domain={[-maxPyrVal * 1.1, maxPyrVal * 1.1]} />
                    <YAxis type="category" dataKey="age" tick={{ fontSize: 10 }} width={55} />
                    <Tooltip formatter={(v, name) => [Math.abs(Number(v)).toLocaleString() + "人", name === "male" ? "男性" : "女性"]} />
                    <ReferenceLine x={0} stroke="#6b7280" />
                    <Bar dataKey="male" fill="#3b82f6" radius={[4, 0, 0, 4]} name="male" />
                    <Bar dataKey="female" fill="#fb7185" radius={[0, 4, 4, 0]} name="female" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 text-center">
                  <Link href={"/finance/jinko-suikei/age-pyramid?slug=" + slug}
                    className="text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400">
                    年別比較（年齢ピラミッドページ）→
                  </Link>
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
                  name: `${prefName}の人口推移データ（2024年）`,
                  description: ((`${prefName}の人口推移（1980〜2024年）と将来予測。政府統計（社会・人口統計体系）準拠。`)||"").length>150?((`${prefName}の人口推移（1980〜2024年）と将来予測。政府統計（社会・人口統計体系）準拠。`)||"").slice(0,150)+"…":((`${prefName}の人口推移（1980〜2024年）と将来予測。政府統計（社会・人口統計体系）準拠。`)||""),
                  url: `https://yamada-tools.jp/finance/jinko-suikei/${slug}`,
                  creator: { "@type": "Organization", name: "総務省統計局" },
                  license: "https://www.e-stat.go.jp/terms-of-use",
                  temporalCoverage: "1980/2024",
                }),
              }}
            />
          </>
        ) : null}

        {/* Neighbor prefectures */}
        {neighbors.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">近隣都道府県と比較</h3>
            <div className="flex flex-wrap gap-2">
              {neighbors.map((s) => (
                <Link key={s} href={"/finance/jinko-suikei/" + s}
                  className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 rounded-lg text-sm hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors">
                  {PREF_NAMES[s]}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Cross links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/finance/jinko-suikei"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
            <span className="text-xl">🔍</span>
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">他県と比較</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">都道府県を変えて検索</div>
            </div>
          </Link>
          <Link href="/finance/jinko-suikei/ranking"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
            <span className="text-xl">🏆</span>
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">全国ランキング</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">47都道府県を一覧比較</div>
            </div>
          </Link>
          <Link href={"/finance/heikin-nenshu/" + slug}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
            <span className="text-xl">💰</span>
            <div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">{prefName}の平均年収</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">賃金と人口の関係を見る</div>
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
                { "@type": "ListItem", position: 3, name: "人口推移", item: "https://yamada-tools.jp/finance/jinko-suikei" },
                { "@type": "ListItem", position: 4, name: prefName, item: `https://yamada-tools.jp/finance/jinko-suikei/${slug}` },
              ],
            }),
          }}
        />

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ⚠️ 本データは政府統計（{data?.data_source || "社会・人口統計体系（総務省統計局）"}）をもとに表示しています。
          将来推計はトレンド計算によるもので、公式推計（社人研）と異なる場合があります。
        </p>
      </div>
    </div>
  );
}
