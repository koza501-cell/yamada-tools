import type { Metadata } from "next";
import Link from "next/link";

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

interface PrefectureRow {
  prefecture: string;
  count: number;
}

async function fetchPrefectures(): Promise<PrefectureRow[]> {
  try {
    const res = await fetch(`${API_BASE}/api/gbiz/geo/prefectures`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.prefectures) ? data.prefectures : [];
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: "都道府県から法人を探す | 法人番号検索 | 山田ツール",
  description: "国税庁法人番号公表サイト・gBizINFOのデータをもとに、都道府県別に法人情報を検索できます。",
  alternates: {
    canonical: "https://yamada-tools.jp/business/houjin/pref",
  },
};

export default async function HoujinPrefIndexPage() {
  const prefectures = await fetchPrefectures();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <nav className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            ホーム
          </Link>
          <span>/</span>
          <Link href="/business/houjin-search" className="hover:text-blue-600 dark:hover:text-blue-400">
            法人検索
          </Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">都道府県一覧</span>
        </nav>

        <header className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            都道府県から法人を探す
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            国税庁法人番号公表サイト・gBizINFOのデータに基づく法人情報を都道府県別に掲載しています。
          </p>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          {prefectures.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-3">データを準備中です。</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {prefectures.map((p) => (
                <Link
                  key={p.prefecture}
                  href={`/business/houjin/pref/${encodeURIComponent(p.prefecture)}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
                >
                  <span className="text-gray-900 dark:text-white font-medium">{p.prefecture}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{p.count.toLocaleString()}件</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
