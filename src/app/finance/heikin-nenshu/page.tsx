"use client";

import { useState, useEffect, useCallback } from "react";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

const API = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/estat";

const PREFECTURES = [
  { code: "01000", name: "北海道" }, { code: "02000", name: "青森県" },
  { code: "03000", name: "岩手県" }, { code: "04000", name: "宮城県" },
  { code: "05000", name: "秋田県" }, { code: "06000", name: "山形県" },
  { code: "07000", name: "福島県" }, { code: "08000", name: "茨城県" },
  { code: "09000", name: "栃木県" }, { code: "10000", name: "群馬県" },
  { code: "11000", name: "埼玉県" }, { code: "12000", name: "千葉県" },
  { code: "13000", name: "東京都" }, { code: "14000", name: "神奈川県" },
  { code: "15000", name: "新潟県" }, { code: "16000", name: "富山県" },
  { code: "17000", name: "石川県" }, { code: "18000", name: "福井県" },
  { code: "19000", name: "山梨県" }, { code: "20000", name: "長野県" },
  { code: "21000", name: "岐阜県" }, { code: "22000", name: "静岡県" },
  { code: "23000", name: "愛知県" }, { code: "24000", name: "三重県" },
  { code: "25000", name: "滋賀県" }, { code: "26000", name: "京都府" },
  { code: "27000", name: "大阪府" }, { code: "28000", name: "兵庫県" },
  { code: "29000", name: "奈良県" }, { code: "30000", name: "和歌山県" },
  { code: "31000", name: "鳥取県" }, { code: "32000", name: "島根県" },
  { code: "33000", name: "岡山県" }, { code: "34000", name: "広島県" },
  { code: "35000", name: "山口県" }, { code: "36000", name: "徳島県" },
  { code: "37000", name: "香川県" }, { code: "38000", name: "愛媛県" },
  { code: "39000", name: "高知県" }, { code: "40000", name: "福岡県" },
  { code: "41000", name: "佐賀県" }, { code: "42000", name: "長崎県" },
  { code: "43000", name: "熊本県" }, { code: "44000", name: "大分県" },
  { code: "45000", name: "宮崎県" }, { code: "46000", name: "鹿児島県" },
  { code: "47000", name: "沖縄県" },
];

const AGE_CLASSES = [
  { code: "01", label: "全年齢" }, { code: "03", label: "20～24歳" },
  { code: "04", label: "25～29歳" }, { code: "05", label: "30～34歳" },
  { code: "06", label: "35～39歳" }, { code: "07", label: "40～44歳" },
  { code: "08", label: "45～49歳" }, { code: "09", label: "50～54歳" },
  { code: "10", label: "55～59歳" }, { code: "11", label: "60～64歳" },
];

const INDUSTRIES = [
  { code: "01", label: "産業計" }, { code: "03", label: "建設業" },
  { code: "07", label: "製造業" }, { code: "32", label: "電気・ガス・水道業" },
  { code: "37", label: "情報通信業" }, { code: "40", label: "情報サービス業" },
  { code: "43", label: "運輸業・郵便業" }, { code: "52", label: "卸売業・小売業" },
  { code: "67", label: "金融業・保険業" }, { code: "74", label: "不動産業" },
  { code: "78", label: "学術研究・専門サービス業" }, { code: "83", label: "宿泊・飲食業" },
  { code: "91", label: "教育・学習支援業" }, { code: "94", label: "医療・福祉" },
  { code: "101", label: "サービス業（他分類外）" },
];

type PrefResult = {
  pref_code: string; pref_name: string; slug: string;
  annual_man: number; monthly_sen: number; bonus_sen: number;
  national_avg_man: number; diff_man: number; rank: number; total_prefs: number;
  year: number; data_source: string;
};

type RankingItem = {
  pref_code: string; pref_name: string; slug: string;
  annual_man: number; rank: number;
};

const tool = getToolById("heikin-nenshu");

export default function HeikinNenshuPage() {
  const [prefCode, setPrefCode] = useState("13000");
  const [ageClass, setAgeClass] = useState("01");
  const [industry, setIndustry] = useState("01");
  const [gender, setGender] = useState("01");
  const [mySalary, setMySalary] = useState("");

  const [result, setResult] = useState<PrefResult | null>(null);
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [rankLoading, setRankLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchResult = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(
        `${API}/heikin-nenshu?pref_code=${prefCode}&age_class=${ageClass}&industry=${industry}&gender=${gender}`
      );
      if (!r.ok) throw new Error("データ取得失敗");
      setResult(await r.json());
    } catch {
      setError("データの取得に失敗しました。しばらくしてから再試行してください。");
    } finally {
      setLoading(false);
    }
  }, [prefCode, ageClass, industry, gender]);

  const fetchRanking = useCallback(async () => {
    setRankLoading(true);
    try {
      const r = await fetch(
        `${API}/ranking?age_class=${ageClass}&industry=${industry}&gender=${gender}`
      );
      if (!r.ok) return;
      const d = await r.json();
      setRanking(d.prefectures || []);
    } catch {
      /* silent */
    } finally {
      setRankLoading(false);
    }
  }, [ageClass, industry, gender]);

  useEffect(() => {
    fetchResult();
    fetchRanking();
  }, [fetchResult, fetchRanking]);

  const myPercentile = (() => {
    if (!mySalary || !result || ranking.length === 0) return null;
    const mine = parseFloat(mySalary);
    if (isNaN(mine)) return null;
    const sorted = [...ranking].sort((a, b) => b.annual_man - a.annual_man);
    const above = sorted.filter((p) => p.pref_code === prefCode ? false : false).length;
    // Compare against all workers in selected pref
    const prefRank = sorted.findIndex((p) => p.pref_code === prefCode);
    const prefAnnual = result.annual_man;
    const ratio = mine / prefAnnual;
    if (ratio >= 1.5) return { label: "上位10%以内", color: "text-green-600" };
    if (ratio >= 1.2) return { label: "上位25%以内", color: "text-green-500" };
    if (ratio >= 1.0) return { label: "平均以上（上位50%）", color: "text-kon" };
    if (ratio >= 0.8) return { label: "平均以下（下位50%）", color: "text-yellow-600" };
    return { label: "下位25%以内", color: "text-danger" };
  })();

  const chartData = ranking.slice(0, 47).map((p) => ({
    name: p.pref_name.replace(/[都道府県]$/, ""),
    annual: p.annual_man,
    isSelected: p.pref_code === prefCode,
  }));

  const selectedPrefName = PREFECTURES.find((p) => p.code === prefCode)?.name || "";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-600 text-white py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-white/70 mb-2">
            <Link href="/finance" className="hover:text-white">金融・投資</Link>
            {" "}›{" "}平均年収検索
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">都道府県別 平均年収検索</h1>
          <p className="text-white/80 text-sm">
            政府統計（賃金構造基本統計調査 2023年）をもとに47都道府県の年収データを無料で検索
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            政府統計（e-Stat）データ準拠
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Mascot */}
        <div className="bg-gray-50 dark:bg-kon/30 border border-gray-200 dark:border-kon rounded-xl p-4 flex items-start gap-3">
          <div className="text-2xl shrink-0">🤖</div>
          <p className="text-sm text-kon dark:text-gray-300">
            あなたの地域の平均年収をチェック！都道府県・年齢・業種・性別で絞り込めます。
            <span className="font-semibold">データ更新: 2026年4月（2023年調査分）</span>
          </p>
        </div>

        {/* Filter form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">条件を選択</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">都道府県</label>
              <select
                value={prefCode}
                onChange={(e) => setPrefCode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
              >
                {PREFECTURES.map((p) => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">年齢階級</label>
              <select
                value={ageClass}
                onChange={(e) => setAgeClass(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
              >
                {AGE_CLASSES.map((a) => (
                  <option key={a.code} value={a.code}>{a.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">業種</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
              >
                {INDUSTRIES.map((i) => (
                  <option key={i.code} value={i.code}>{i.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">性別</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
              >
                <option value="01">男女計</option>
                <option value="02">男性</option>
                <option value="03">女性</option>
              </select>
            </div>
          </div>
        </div>

        {/* Result */}
        {error && (
          <div className="bg-gray-50 dark:bg-red-950/40 border border-gray-200 rounded-xl p-4 text-sm text-danger">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded w-1/2 mx-auto" />
              <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded" />
              <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded w-2/3 mx-auto" />
            </div>
          </div>
        ) : result ? (
          <>
            {/* Big number */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{selectedPrefName}の平均年収</p>
              <p className="text-5xl font-bold text-gray-900 dark:text-white mb-1">
                ¥{result.annual_man.toFixed(1)}
                <span className="text-2xl font-normal text-gray-500 ml-1">万</span>
              </p>
              <div className="flex items-center justify-center gap-4 mt-3 text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  全国平均: <strong className="text-gray-900 dark:text-white">¥{result.national_avg_man.toFixed(1)}万</strong>
                </span>
                <span className={`font-semibold ${result.diff_man >= 0 ? "text-green-600" : "text-danger"}`}>
                  {result.diff_man >= 0 ? "+" : ""}{result.diff_man.toFixed(1)}万
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  全国<strong className="text-gray-900 dark:text-white">{result.rank}</strong>位/{result.total_prefs}都道府県
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 max-w-sm mx-auto text-sm">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">月給（所定内）</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    ¥{(result.monthly_sen).toFixed(1)}<span className="text-xs font-normal">千円</span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">年間賞与</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    ¥{(result.bonus_sen / 10).toFixed(1)}<span className="text-xs font-normal">万</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Salary comparison */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">あなたの年収と比べる</h3>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={mySalary}
                  onChange={(e) => setMySalary(e.target.value)}
                  placeholder="例: 450"
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kon"
                />
                <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">万円</span>
              </div>
              {myPercentile && (
                <div className={`mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm font-semibold ${myPercentile.color}`}>
                  {selectedPrefName}の平均と比べて: {myPercentile.label}
                  <span className="text-gray-500 dark:text-gray-400 font-normal ml-2">
                    （平均 ¥{result.annual_man.toFixed(0)}万に対して ¥{mySalary}万）
                  </span>
                </div>
              )}
            </div>
          </>
        ) : null}

        {/* Bar chart ranking */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">全国47都道府県 年収ランキング</h3>
            <Link href="/finance/heikin-nenshu/ranking" className="text-xs text-kon dark:text-gray-300 hover:underline">
              表で見る →
            </Link>
          </div>
          {rankLoading ? (
            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
          ) : chartData.length > 0 ? (
            <div className="overflow-x-auto">
              <div style={{ minWidth: 900 }}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${v}万`}
                      domain={["auto", "auto"]}
                    />
                    <Tooltip
                      formatter={(v) => [`¥${Number(v).toFixed(1)}万`, "平均年収"]}
                      labelFormatter={(l) => `${l}`}
                    />
                    {result && (
                      <ReferenceLine
                        y={result.national_avg_man}
                        stroke="#6366f1"
                        strokeDasharray="4 2"
                        label={{ value: "全国平均", position: "insideTopRight", fontSize: 10, fill: "#6366f1" }}
                      />
                    )}
                    <Bar dataKey="annual" radius={[3, 3, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.isSelected ? "#2563eb" : "#93c5fd"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/finance/heikin-nenshu/ranking"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-sm text-gray-900 dark:text-white">都道府県ランキング</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">47都道府県を一覧で比較</div>
          </Link>
          <Link href="/finance/heikin-nenshu/industry"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">🏢</div>
            <div className="font-semibold text-sm text-gray-900 dark:text-white">業種別年収</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">業種ごとの平均年収を比較</div>
          </Link>
          <Link
            href={`/finance/heikin-nenshu/${PREFECTURES.find((p) => p.code === prefCode)?.name.replace(/[都道府県]$/, "").toLowerCase() || "tokyo"}`}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">📍</div>
            <div className="font-semibold text-sm text-gray-900 dark:text-white">{selectedPrefName}の詳細</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">年齢別推移など詳しいデータ</div>
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ⚠️ 本データは政府統計（賃金構造基本統計調査 2023年、厚生労働省）をもとに表示しています。
          実際の年収は個人差があります。企業規模10人以上の一般労働者が対象です。
        </p>
      </div>
    
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </div>
  );
}
