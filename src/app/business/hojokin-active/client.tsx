"use client";

import { useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

type Subsidy = {
  id: string;
  name?: string;
  title: string;
  target_area_search?: string;
  subsidy_max_limit?: number;
  acceptance_start_datetime?: string;
  acceptance_end_datetime?: string;
  target_number_of_employees?: string;
  use_purpose?: string;
  industry?: string;
  detail?: string;
};

type SearchResponse = {
  metadata?: { resultset?: { count?: number } };
  result?: Subsidy[];
};

type SortOption = "acceptance_end_datetime" | "acceptance_start_datetime" | "created_date";

export default function HojokinActiveClient() {
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState<SortOption>("acceptance_end_datetime");
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const [results, setResults] = useState<Subsidy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = keyword.trim();
    if (trimmed.length < 2) {
      setError("検索キーワードは2文字以上で入力してください");
      return;
    }
    if (trimmed.length > 255) {
      setError("検索キーワードは255文字以内で入力してください");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    setHasSearched(true);
    setTotalCount(0);

    try {
      const params = new URLSearchParams({
        keyword: trimmed,
        sort: sort,
        order: order,
        acceptance: "1",
      });
      const res = await fetch(`${API_BASE}/api/gbiz/active-subsidies?${params}`);

      if (!res.ok) {
        if (res.status === 504) {
          throw new Error("検索がタイムアウトしました。しばらくしてから再度お試しください。");
        }
        throw new Error(`検索中にエラーが発生しました (HTTP ${res.status})`);
      }

      const data: SearchResponse = await res.json();
      const items = data.result || [];
      setResults(items);
      setTotalCount(data.metadata?.resultset?.count || items.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "検索中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    } catch {
      return iso.slice(0, 10);
    }
  };

  const daysUntilDeadline = (iso?: string): number | null => {
    if (!iso) return null;
    try {
      const deadline = new Date(iso);
      const now = new Date();
      const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diff;
    } catch {
      return null;
    }
  };

  const formatYen = (amount?: number) => {
    if (amount === undefined || amount === null || amount === 0) return "未指定";
    return `¥${amount.toLocaleString()}`;
  };

  const popularKeywords = ["IT", "DX", "中小企業", "創業", "ものづくり", "省エネ", "人材", "海外展開"];

  return (
    <div className="min-h-screen pb-24 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <nav className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <span className="mx-1">/</span>
            <Link href="/business" className="hover:text-blue-600">ビジネス・法人</Link>
            <span className="mx-1">/</span>
            <span>補助金検索（募集中）</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            補助金検索ツール
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>現在募集中</strong>の補助金・助成金をキーワードで検索。デジタル庁 Jグランツ の公式データを使用。
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <label htmlFor="keyword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            キーワード <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="keyword"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="例：IT、DX、中小企業、創業..."
              maxLength={255}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || keyword.trim().length < 2}
              className="px-6 py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
            >
              {loading ? "検索中..." : "🔍 検索"}
            </button>
          </div>

          {/* Popular keywords */}
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">人気のキーワード:</span>
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => setKeyword(kw)}
                className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/30 transition"
                disabled={loading}
              >
                {kw}
              </button>
            ))}
          </div>

          {/* Sort options */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">並び順</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                disabled={loading}
              >
                <option value="acceptance_end_datetime">締切日</option>
                <option value="acceptance_start_datetime">受付開始日</option>
                <option value="created_date">登録日</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">順序</label>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as "ASC" | "DESC")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                disabled={loading}
              >
                <option value="ASC">昇順（早い順）</option>
                <option value="DESC">降順（遅い順）</option>
              </select>
            </div>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">補助金を検索中...</p>
          </div>
        )}

        {/* Empty result */}
        {hasSearched && !loading && !error && results.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              「{keyword}」に該当する募集中の補助金が見つかりませんでした。
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
              キーワードを変えて再度お試しください。
            </p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className="font-semibold">{totalCount}件</span>の募集中補助金が見つかりました（最大{results.length}件表示）
            </p>
            {results.map((sub) => {
              const days = daysUntilDeadline(sub.acceptance_end_datetime);
              const isUrgent = days !== null && days >= 0 && days <= 14;
              const isExpired = days !== null && days < 0;
              return (
                <div
                  key={sub.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 hover:shadow-md transition border border-transparent hover:border-pink-200 dark:hover:border-pink-800"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex-1">
                      {sub.title}
                    </h2>
                    {!isExpired && days !== null && (
                      <span
                        className={`flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                          isUrgent
                            ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                            : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                        }`}
                      >
                        締切まで {days}日
                      </span>
                    )}
                  </div>
                  <dl className="text-sm space-y-1.5">
                    {sub.acceptance_end_datetime && (
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="text-gray-500 dark:text-gray-400 min-w-[6rem]">📅 募集締切:</dt>
                        <dd className="text-gray-900 dark:text-white font-medium">
                          {formatDate(sub.acceptance_end_datetime)}
                        </dd>
                      </div>
                    )}
                    {sub.subsidy_max_limit !== undefined && sub.subsidy_max_limit > 0 && (
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="text-gray-500 dark:text-gray-400 min-w-[6rem]">💰 上限額:</dt>
                        <dd className="text-gray-900 dark:text-white font-medium">
                          {formatYen(sub.subsidy_max_limit)}
                        </dd>
                      </div>
                    )}
                    {sub.target_area_search && (
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="text-gray-500 dark:text-gray-400 min-w-[6rem]">🗾 対象地域:</dt>
                        <dd className="text-gray-900 dark:text-white">{sub.target_area_search}</dd>
                      </div>
                    )}
                    {sub.target_number_of_employees && (
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="text-gray-500 dark:text-gray-400 min-w-[6rem]">👥 対象規模:</dt>
                        <dd className="text-gray-900 dark:text-white">{sub.target_number_of_employees}</dd>
                      </div>
                    )}
                    {sub.use_purpose && (
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="text-gray-500 dark:text-gray-400 min-w-[6rem]">🎯 利用目的:</dt>
                        <dd className="text-gray-900 dark:text-white">{sub.use_purpose}</dd>
                      </div>
                    )}
                  </dl>
                  {sub.detail && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {sub.detail}
                    </p>
                  )}
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <a
                      href={`https://www.jgrants-portal.go.jp/subsidy/${sub.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-pink-600 dark:text-pink-400 hover:underline font-medium"
                    >
                      Jグランツで詳細を見る →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            💡 補助金検索ツールについて
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li><strong>デジタル庁 Jグランツ</strong> の公式データを使用しています</li>
            <li>現在<strong>募集中</strong>の補助金のみ表示されます</li>
            <li>申請は Jグランツ の公式サイトから行えます</li>
            <li>無料・登録不要でご利用いただけます</li>
          </ul>
        </div>

        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
          データ提供: デジタル庁 Jグランツ（<a href="https://www.jgrants-portal.go.jp/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">https://www.jgrants-portal.go.jp/</a>）
        </p>
      </div>
    </div>
  );
}
