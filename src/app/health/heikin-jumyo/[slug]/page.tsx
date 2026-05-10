"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
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
  slug: string; pref_name: string; year: number;
  male: number; female: number;
  national_male: number; national_female: number;
  national_male_2024: number; national_female_2024: number;
  male_diff: number; female_diff: number;
  male_rank: number; female_rank: number;
  national_trend: { year: number; national_male: number; national_female: number }[];
};

type YomeiRow = { age: number; remaining_years: number; expected_death_age: number };
type YomeiData = { remaining_years: number; expected_death_age: number; table: YomeiRow[] };

async function fetchPrefData(slug: string): Promise<PrefData | null> {
  try {
    const r = await fetch(API + "/jumyo/prefecture/" + slug, { cache: "no-store" });
    return r.ok ? r.json() : null;
  } catch { return null; }
}

async function fetchYomeiData(slug: string, age: number, gender: string): Promise<YomeiData | null> {
  try {
    const r = await fetch(`${API}/jumyo/age-life-expectancy/${slug}?age=${age}&gender=${gender}`, { cache: "no-store" });
    return r.ok ? r.json() : null;
  } catch { return null; }
}

import { useState, useEffect, useCallback } from "react";

export default function PrefJumyoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  if (!VALID_SLUGS.has(slug)) notFound();

  const [data, setData] = useState<PrefData | null>(null);
  const [maleYomei, setMaleYomei] = useState<YomeiData | null>(null);
  const [femaleYomei, setFemaleYomei] = useState<YomeiData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [pref, male, female] = await Promise.all([
      fetchPrefData(slug),
      fetchYomeiData(slug, 0, "male"),
      fetchYomeiData(slug, 0, "female"),
    ]);
    setData(pref);
    setMaleYomei(male);
    setFemaleYomei(female);
    setLoading(false);
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

  const diffBadge = (diff: number) => (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${diff >= 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-50 text-danger dark:bg-danger/30 dark:text-danger"}`}>
      {diff >= 0 ? "+" : ""}{diff}年
    </span>
  );

  // Build yomei comparison chart (male vs female remaining years by age bracket)
  const yomeiChart = (maleYomei?.table ?? []).map((row, i) => ({
    age: row.age,
    male: row.remaining_years,
    female: femaleYomei?.table[i]?.remaining_years ?? null,
  }));

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        "name": `${data.pref_name}の平均寿命データ（2020年）`,
        "description": `${data.pref_name}の男女別平均寿命。男性${data.male}歳、女性${data.female}歳（令和2年都道府県別生命表）。`,
        "url": `https://yamada-tools.jp/health/heikin-jumyo/${slug}`,
        "creator": { "@type": "Organization", "name": "厚生労働省" },
        "temporalCoverage": "2020",
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
          { "@type": "ListItem", "position": 2, "name": "健康・生活", "item": "https://yamada-tools.jp/health" },
          { "@type": "ListItem", "position": 3, "name": "平均寿命", "item": "https://yamada-tools.jp/health/heikin-jumyo" },
          { "@type": "ListItem", "position": 4, "name": `${data.pref_name}の平均寿命`, "item": `https://yamada-tools.jp/health/heikin-jumyo/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-gradient-to-br from-rose-600 to-kon text-white py-10">
          <div className="max-w-4xl mx-auto px-4">
            <nav className="text-sm text-white/70 mb-2 flex items-center gap-1 flex-wrap">
              <Link href="/health" className="hover:text-white">健康・生活</Link>
              <span>›</span>
              <Link href="/health/heikin-jumyo" className="hover:text-white">平均寿命</Link>
              <span>›</span>
              <span className="text-white">{data.pref_name}</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold">{data.pref_name}の平均寿命</h1>
            <p className="text-white/80 text-sm mt-2">厚生労働省 令和2年（{data.year}年）都道府県別生命表</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Key stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">{data.pref_name}の平均寿命（{data.year}年）</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-kon/20 rounded-xl p-4 text-center">
                <div className="text-xs text-kon dark:text-gray-300 font-medium mb-1">男性</div>
                <div className="text-3xl font-bold text-kon dark:text-gray-300">{data.male}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">歳</div>
                <div className="mt-2">{diffBadge(data.male_diff)}</div>
                <div className="text-xs text-gray-400 mt-1">全国比</div>
              </div>
              <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4 text-center">
                <div className="text-xs text-rose-600 dark:text-rose-400 font-medium mb-1">女性</div>
                <div className="text-3xl font-bold text-rose-700 dark:text-rose-300">{data.female}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">歳</div>
                <div className="mt-2">{diffBadge(data.female_diff)}</div>
                <div className="text-xs text-gray-400 mt-1">全国比</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">男性ランク</div>
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">{data.male_rank}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">位 / 47</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">女性ランク</div>
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">{data.female_rank}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">位 / 47</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg px-4 py-2">
                <span className="text-xs text-gray-400 block">全国平均（2020年）</span>
                <span className="text-gray-700 dark:text-gray-300">男 {data.national_male}歳 / 女 {data.national_female}歳</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg px-4 py-2">
                <span className="text-xs text-gray-400 block">全国平均（2024年）</span>
                <span className="text-gray-700 dark:text-gray-300">男 {data.national_male_2024}歳 / 女 {data.national_female_2024}歳</span>
              </div>
            </div>
          </div>

          {/* National trend chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 dark:text-white mb-1">全国平均寿命の推移</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">簡易生命表（厚生労働省）年次データ</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.national_trend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                <YAxis domain={[78, 90]} tick={{ fontSize: 10 }} tickFormatter={(v) => v + "歳"} />
                <Tooltip formatter={(v) => [Number(v).toFixed(2) + "歳", ""]} />
                <Legend />
                <Line type="monotone" dataKey="national_male" name="男性（全国）" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="national_female" name="女性（全国）" stroke="#f43f5e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Yomei chart */}
          {yomeiChart.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-1">{data.pref_name}の年齢別余命</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">各年齢時点での統計的余命（完全生命表2020年ベース・都道府県補正済み）</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={yomeiChart} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" tick={{ fontSize: 10 }} tickFormatter={(v) => v + "歳"} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => v + "年"} />
                  <Tooltip formatter={(v) => [Number(v).toFixed(1) + "年", ""]} labelFormatter={(l) => l + "歳時点"} />
                  <Legend />
                  <Bar dataKey="male" name="男性" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="female" name="女性" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Cross links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/health/heikin-jumyo/ranking"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
              <span className="text-xl">🏆</span>
              <div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">全国ランキング</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">47都道府県を比較</div>
              </div>
            </Link>
            <Link href="/health/heikin-jumyo/yomei"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
              <span className="text-xl">⏳</span>
              <div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">余命計算</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">年齢別・あと何年？</div>
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
            ⚠️ 本データは厚生労働省の令和2年（2020年）都道府県別生命表に基づく統計値です。実際の寿命は個人差があります。
          </p>
        </div>
      </div>
    </>
  );
}
