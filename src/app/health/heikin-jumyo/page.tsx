"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

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
  slug: string; pref_name: string; year: number;
  male: number; female: number;
  national_male: number; national_female: number;
  national_male_2024: number; national_female_2024: number;
  male_diff: number; female_diff: number;
  male_rank: number; female_rank: number;
  national_trend: { year: number; national_male: number; national_female: number }[];
};

export default function HeikinJumyoPage() {
  const [slug, setSlug] = useState("tokyo");
  const [data, setData] = useState<PrefData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (s: string) => {
    setLoading(true); setData(null);
    try {
      const r = await fetch(API + "/jumyo/prefecture/" + s);
      if (r.ok) setData(await r.json());
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(slug); }, [slug, fetchData]);

  const diffBadge = (diff: number) => (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${diff >= 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
      {diff >= 0 ? "+" : ""}{diff}年
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-br from-rose-600 to-pink-500 text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm text-white/70 mb-2 flex items-center gap-1 flex-wrap">
            <Link href="/health" className="hover:text-white">健康・生活</Link>
            <span>›</span>
            <span className="text-white">平均寿命</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold">都道府県別 平均寿命ランキング</h1>
          <p className="text-white/80 text-sm mt-2">厚生労働省 令和2年（2020年）都道府県別生命表データ</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 text-xs">
            <span className="text-yellow-300">★</span>
            <span>厚生労働省 完全生命表データ準拠</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Mascot */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 flex items-start gap-3">
          <div className="text-3xl shrink-0">🤖</div>
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">アイちゃんより</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">あなたの地域の平均寿命は？都道府県を選んで全国平均との差を確認できます。余命計算もできますよ！</p>
          </div>
        </div>

        {/* Prefecture selector */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">都道府県を選択</label>
          <select value={slug} onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
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
                {data.pref_name}の平均寿命（{data.year}年）
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">男性</div>
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{data.male}</div>
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
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">男性ランキング</div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">{data.male_rank}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">位 / 47都道府県</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">女性ランキング</div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">{data.female_rank}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">位 / 47都道府県</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg px-4 py-2">
                  <span className="text-gray-400 dark:text-gray-500 text-xs block">全国平均（2020年）</span>
                  <span className="font-medium">男 {data.national_male}歳 / 女 {data.national_female}歳</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg px-4 py-2">
                  <span className="text-gray-400 dark:text-gray-500 text-xs block">全国平均（2024年）</span>
                  <span className="font-medium">男 {data.national_male_2024}歳 / 女 {data.national_female_2024}歳</span>
                </div>
              </div>
            </div>

            {/* National trend chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-1">全国平均寿命の推移</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">簡易生命表（厚生労働省）年次データ</p>
              <ResponsiveContainer width="100%" height={260}>
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
              <Link href={"/health/heikin-jumyo/" + slug}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex items-center gap-3">
                <span className="text-xl">📊</span>
                <div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">{data.pref_name}の詳細</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">詳細ページを見る</div>
                </div>
              </Link>
            </div>
          </>
        ) : null}

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ⚠️ 本データは厚生労働省の令和2年（2020年）都道府県別生命表に基づく統計値です。実際の寿命は個人差があります。
        </p>
      </div>
    </div>
  );
}
