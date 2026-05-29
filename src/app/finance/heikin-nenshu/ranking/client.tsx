"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const API = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/estat";

const AGE_CLASSES = [
  { code: "01", label: "全年齢" }, { code: "03", label: "20～24歳" },
  { code: "04", label: "25～29歳" }, { code: "05", label: "30～34歳" },
  { code: "06", label: "35～39歳" }, { code: "07", label: "40～44歳" },
  { code: "08", label: "45～49歳" }, { code: "09", label: "50～54歳" },
  { code: "10", label: "55～59歳" }, { code: "11", label: "60～64歳" },
];

const INDUSTRIES = [
  { code: "01", label: "産業計" }, { code: "03", label: "建設業" },
  { code: "07", label: "製造業" }, { code: "37", label: "情報通信業" },
  { code: "52", label: "卸売業・小売業" }, { code: "67", label: "金融業・保険業" },
  { code: "83", label: "宿泊・飲食業" }, { code: "94", label: "医療・福祉" },
];

type PrefItem = {
  rank: number; pref_code: string; pref_name: string; slug: string; annual_man: number;
  monthly_sen: number; bonus_sen: number;
};

const PREF_SLUG: Record<string, string> = {
  "01000":"hokkaido","02000":"aomori","03000":"iwate","04000":"miyagi","05000":"akita",
  "06000":"yamagata","07000":"fukushima","08000":"ibaraki","09000":"tochigi","10000":"gunma",
  "11000":"saitama","12000":"chiba","13000":"tokyo","14000":"kanagawa","15000":"niigata",
  "16000":"toyama","17000":"ishikawa","18000":"fukui","19000":"yamanashi","20000":"nagano",
  "21000":"gifu","22000":"shizuoka","23000":"aichi","24000":"mie","25000":"shiga",
  "26000":"kyoto","27000":"osaka","28000":"hyogo","29000":"nara","30000":"wakayama",
  "31000":"tottori","32000":"shimane","33000":"okayama","34000":"hiroshima","35000":"yamaguchi",
  "36000":"tokushima","37000":"kagawa","38000":"ehime","39000":"kochi","40000":"fukuoka",
  "41000":"saga","42000":"nagasaki","43000":"kumamoto","44000":"oita","45000":"miyazaki",
  "46000":"kagoshima","47000":"okinawa",
};

export default function HeikinNenshuRankingClient() {
  const [ageClass, setAgeClass] = useState("01");
  const [industry, setIndustry] = useState("01");
  const [gender, setGender] = useState("01");
  const [prefectures, setPrefectures] = useState<PrefItem[]>([]);
  const [nationalAvg, setNationalAvg] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/ranking?age_class=${ageClass}&industry=${industry}&gender=${gender}`);
      if (!r.ok) return;
      const d = await r.json();
      setPrefectures(d.prefectures || []);
      setNationalAvg(d.national_avg_man || 0);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [ageClass, industry, gender]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const maxAnnual = prefectures[0]?.annual_man || 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-br from-blue-700 to-indigo-600 text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm text-white/70 mb-2">
            <Link href="/finance" className="hover:text-white">金融・投資</Link>
            {" "}›{" "}
            <Link href="/finance/heikin-nenshu" className="hover:text-white">平均年収検索</Link>
            {" "}›{" "}ランキング
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">都道府県別 平均年収ランキング</h1>
          <p className="text-white/80 text-sm mt-2">政府統計（賃金構造基本統計調査 2023年）</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">年齢階級</label>
              <select value={ageClass} onChange={(e) => setAgeClass(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon">
                {AGE_CLASSES.map((a) => <option key={a.code} value={a.code}>{a.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">業種</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon">
                {INDUSTRIES.map((i) => <option key={i.code} value={i.code}>{i.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">性別</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon">
                <option value="01">男女計</option>
                <option value="02">男性</option>
                <option value="03">女性</option>
              </select>
            </div>
          </div>
          {nationalAvg > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              全国平均: <strong className="text-gray-900 dark:text-white">¥{nationalAvg.toFixed(1)}万</strong>
            </p>
          )}
        </div>

        {/* Ranking table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {prefectures.map((p) => {
                const barWidth = Math.round((p.annual_man / maxAnnual) * 100);
                const isAboveAvg = p.annual_man >= nationalAvg;
                return (
                  <Link
                    key={p.pref_code}
                    href={`/finance/heikin-nenshu/${PREF_SLUG[p.pref_code] || p.slug}`}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <span className={`text-sm font-bold w-6 shrink-0 ${p.rank <= 3 ? "text-yellow-500" : "text-gray-400"}`}>
                      {p.rank}
                    </span>
                    <span className="w-20 shrink-0 text-sm font-medium text-gray-900 dark:text-white">
                      {p.pref_name}
                    </span>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isAboveAvg ? "bg-kon" : "bg-gray-50"}`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white w-20 text-right shrink-0">
                      ¥{p.annual_man.toFixed(1)}万
                    </span>
                    <span className={`text-xs w-12 text-right shrink-0 ${isAboveAvg ? "text-green-600" : "text-gray-400"}`}>
                      {isAboveAvg ? `+${(p.annual_man - nationalAvg).toFixed(1)}` : (p.annual_man - nationalAvg).toFixed(1)}万
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ⚠️ 本データは政府統計（賃金構造基本統計調査 2023年）をもとに表示しています。
          実際の年収は個人差があります。
        </p>
      </div>
    </div>
  );
}
