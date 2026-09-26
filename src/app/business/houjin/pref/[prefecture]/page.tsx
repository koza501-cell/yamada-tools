import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
const PAGE_SIZE = 100;

interface CityRow {
  city: string;
  count: number;
}

interface CompanyRow {
  corporate_number: string;
  name: string;
}

interface PrefPage {
  prefecture: string;
  page: number;
  limit: number;
  total: number;
  pages: number;
  companies: CompanyRow[];
}

async function fetchCities(prefecture: string): Promise<CityRow[]> {
  try {
    const res = await fetch(`${API_BASE}/api/gbiz/geo/${encodeURIComponent(prefecture)}/cities`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.cities) ? data.cities : [];
  } catch {
    return [];
  }
}

async function fetchPrefPage(prefecture: string, page: number): Promise<PrefPage | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/gbiz/geo/${encodeURIComponent(prefecture)}?page=${page}&limit=${PAGE_SIZE}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    return (await res.json()) as PrefPage;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ prefecture: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { prefecture } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);

  const canonical = `https://yamada-tools.jp/business/houjin/pref/${encodeURIComponent(prefecture)}${
    page > 1 ? `?page=${page}` : ""
  }`;

  return {
    title: `${prefecture}の法人一覧${page > 1 ? `（${page}ページ目）` : ""} | 山田ツール`,
    description: `${prefecture}に登記されている法人の一覧。国税庁法人番号公表サイト・gBizINFOのデータに基づきます。`,
    alternates: { canonical },
  };
}

export default async function HoujinPrefPage({
  params,
  searchParams,
}: {
  params: Promise<{ prefecture: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { prefecture } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);

  const [cities, prefPage] = await Promise.all([fetchCities(prefecture), fetchPrefPage(prefecture, page)]);

  if (!prefPage || prefPage.total === 0 || page > prefPage.pages) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <nav className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            ホーム
          </Link>
          <span>/</span>
          <Link href="/business/houjin/pref" className="hover:text-blue-600 dark:hover:text-blue-400">
            都道府県一覧
          </Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">{prefecture}</span>
        </nav>

        <header className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {prefecture}の法人一覧
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {prefecture}に登記されている法人 {prefPage.total.toLocaleString()}件
          </p>
        </header>

        {cities.length > 0 && (
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">市区町村から探す</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {cities.map((c) => (
                <Link
                  key={c.city}
                  href={`/business/houjin/pref/${encodeURIComponent(prefecture)}/${encodeURIComponent(c.city)}`}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
                >
                  <span className="text-gray-900 dark:text-white">{c.city}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{c.count.toLocaleString()}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">法人一覧</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {prefPage.companies.map((c) => (
              <Link
                key={c.corporate_number}
                href={`/business/houjin/${c.corporate_number}`}
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline truncate py-1"
                title={c.name}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <Pagination
            basePath={`/business/houjin/pref/${encodeURIComponent(prefecture)}`}
            page={prefPage.page}
            pages={prefPage.pages}
          />
        </section>
      </div>
    </div>
  );
}

function Pagination({ basePath, page, pages }: { basePath: string; page: number; pages: number }) {
  if (pages <= 1) return null;
  const prevHref = page > 1 ? (page - 1 === 1 ? basePath : `${basePath}?page=${page - 1}`) : null;
  const nextHref = page < pages ? `${basePath}?page=${page + 1}` : null;

  return (
    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm">
      {prevHref ? (
        <Link href={prevHref} className="text-blue-600 dark:text-blue-400 hover:underline">
          ← 前のページ
        </Link>
      ) : (
        <span />
      )}
      <span className="text-gray-400 dark:text-gray-500">
        {page} / {pages} ページ
      </span>
      {nextHref ? (
        <Link href={nextHref} className="text-blue-600 dark:text-blue-400 hover:underline">
          次のページ →
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
