"use client";

import { useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

type CorporationInfo = {
  corporate_number: string;
  postal_code?: string;
  location?: string;
  name: string;
  name_en?: string;
  status?: string;
  number_of_activity?: string;
  update_date?: string;
};

type SearchResponse = {
  message?: string;
  errors?: string | null;
  "hojin-infos"?: CorporationInfo[];
};

export default function HoujinSearchClient() {
  const [searchName, setSearchName] = useState("");
  const [results, setResults] = useState<CorporationInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchName.trim();
    if (trimmed.length === 0) {
      setError("法人名を入力してください");
      return;
    }
    if (trimmed.length > 100) {
      setError("法人名は100文字以内で入力してください");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({
        name: trimmed,
        limit: "20",
      });
      const res = await fetch(`${API_BASE}/api/gbiz/corporations?${params}`);

      if (!res.ok) {
        if (res.status === 504) {
          throw new Error("検索がタイムアウトしました。しばらくしてから再度お試しください。");
        }
        throw new Error(`検索中にエラーが発生しました (HTTP ${res.status})`);
      }

      const data: SearchResponse = await res.json();
      const infos = data["hojin-infos"] || [];
      setResults(infos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "検索中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const formatPostalCode = (code?: string) => {
    if (!code || code.length !== 7) return code || "";
    return `〒${code.slice(0, 3)}-${code.slice(3)}`;
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try {
      return iso.slice(0, 10);
    } catch {
      return iso;
    }
  };

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
            <span>法人検索</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            法人検索ツール
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            会社名から法人番号・所在地・基本情報を検索できます。経済産業省 gBizINFO の公式データを使用。
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <label htmlFor="company-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            法人名・会社名 <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="company-name"
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="例：トヨタ自動車"
              maxLength={100}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !searchName.trim()}
              className="px-6 py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
            >
              {loading ? "検索中..." : "🔍 検索"}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            部分一致で検索します。「トヨタ」と入力すると「トヨタ自動車」「豊田市」など一致するすべての法人を表示します。
          </p>
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
            <p className="mt-4 text-gray-600 dark:text-gray-400">検索中...</p>
          </div>
        )}

        {/* Empty result */}
        {hasSearched && !loading && !error && results.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              「{searchName}」に該当する法人が見つかりませんでした。
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
              <span className="font-semibold">{results.length}件</span>の法人が見つかりました
            </p>
            {results.map((corp) => (
              <div
                key={corp.corporate_number}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 hover:shadow-md transition border border-transparent hover:border-pink-200 dark:hover:border-pink-800"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {corp.name}
                    </h2>
                    {corp.name_en && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">
                        {corp.name_en}
                      </p>
                    )}
                    <dl className="text-sm space-y-1 mt-2">
                      <div className="flex flex-wrap gap-x-2">
                        <dt className="text-gray-500 dark:text-gray-400">法人番号:</dt>
                        <dd className="font-mono text-gray-900 dark:text-white">
                          {corp.corporate_number}
                        </dd>
                      </div>
                      {corp.location && (
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="text-gray-500 dark:text-gray-400">所在地:</dt>
                          <dd className="text-gray-900 dark:text-white">
                            {formatPostalCode(corp.postal_code)} {corp.location}
                          </dd>
                        </div>
                      )}
                      {corp.update_date && (
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="text-gray-500 dark:text-gray-400">最終更新:</dt>
                          <dd className="text-gray-900 dark:text-white">
                            {formatDate(corp.update_date)}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  {corp.number_of_activity && parseInt(corp.number_of_activity) > 0 && (
                    <div className="flex-shrink-0 text-center bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded">
                      <div className="text-xs text-gray-600 dark:text-gray-400">活動情報</div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {corp.number_of_activity}件
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            💡 法人検索ツールについて
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>経済産業省が運営する <strong>gBizINFO</strong> の公式データを使用しています</li>
            <li>約400万社の国内法人が登録されています</li>
            <li>法人番号・所在地・最終更新日などの基本情報を確認できます</li>
            <li>無料・登録不要でご利用いただけます</li>
          </ul>
        </div>

        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
          データ提供: 経済産業省 gBizINFO（<a href="https://info.gbiz.go.jp/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">https://info.gbiz.go.jp/</a>）
        </p>
      </div>
    </div>
  );
}
