"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

// ── Types ──────────────────────────────────────────────────────────────────

type CorporationInfo = {
  corporate_number: string;
  postal_code?: string;
  location?: string;
  name: string;
  name_en?: string;
  status?: string;
  number_of_activity?: string;
  update_date?: string;
  match_score?: number;
  corp_type_info?: {
    japanese: string;
    code: string;
    en_full: string;
    en_short: string;
    us_equivalent: string;
  };
};

type CorporationDetail = {
  corporate_number: string;
  name: string;
  name_en?: string;
  kana?: string;
  representative_name?: string;
  postal_code?: string;
  location?: string;
  status?: string;
  capital_stock?: number;
  employee_number?: number;
  business_summary?: string;
  company_url?: string;
  date_of_establishment?: string;
  update_date?: string;
};

type SearchResponse = {
  message?: string;
  errors?: string | null;
  "hojin-infos"?: CorporationInfo[];
};

type EnSearchResponse = {
  query?: string;
  results?: CorporationInfo[];
  total_unique?: number;
};

// ── Icons ──────────────────────────────────────────────────────────────────

const Icons = {
  Copy: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Check: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  Close: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  ExternalLink: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
};

// ── Helpers ────────────────────────────────────────────────────────────────

const BADGE_STYLE = {
  green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  red:   "bg-gray-50 text-danger dark:bg-danger/30 dark:text-danger",
  gray:  "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
} as const;

function getStatusBadge(status: string | undefined): { label: string; cls: string } {
  if (!status || status === "-" || status === "01") return { label: "営業中", cls: BADGE_STYLE.green };
  if (status === "閉鎖" || status === "11") return { label: "閉鎖", cls: BADGE_STYLE.red };
  if (status === "21") return { label: "その他", cls: BADGE_STYLE.gray };
  if (status === "31") return { label: "取引停止", cls: BADGE_STYLE.red };
  return { label: status, cls: BADGE_STYLE.gray };
}

function formatPostalCode(code?: string): string {
  if (!code || code.length !== 7) return code || "";
  return `〒${code.slice(0, 3)}-${code.slice(3)}`;
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

function formatCurrency(amount?: number): string {
  if (amount == null || amount <= 0) return "";
  const oku = Math.floor(amount / 100000000);
  if (oku >= 1) return `${oku.toLocaleString()}億円`;
  const man = Math.floor(amount / 10000);
  if (man >= 1) return `${man.toLocaleString()}万円`;
  return `${amount.toLocaleString()}円`;
}

function normalizeSpaces(s?: string): string {
  if (!s) return "";
  return s.replace(/[  \s]+/g, " ").trim();
}

// ── Sub-components ─────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="space-y-0.5">
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-sm text-gray-900 dark:text-white break-words">{value}</div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 animate-pulse">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/5 mb-3" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
    </div>
  );
}

// ── Detail Drawer ──────────────────────────────────────────────────────────

type DrawerProps = {
  corp: CorporationInfo;
  onClose: () => void;
};

function DetailDrawer({ corp, onClose }: DrawerProps) {
  const [detail, setDetail] = useState<CorporationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDetail(null);
    setFetchError(null);
    setLoading(true);

    fetch(`${API_BASE}/api/gbiz/corporation/${corp.corporate_number}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const info: CorporationDetail | undefined = data["hojin-infos"]?.[0];
        setDetail(info ?? null);
      })
      .catch((e: Error) => setFetchError(e.message))
      .finally(() => setLoading(false));
  }, [corp.corporate_number]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(corp.corporate_number).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Drawer panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">法人詳細情報</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition"
          >
            {Icons.Close}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* 法人番号 — always visible */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">法人番号</div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-gray-900 dark:text-white tracking-wider">
                {corp.corporate_number}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                title="コピー"
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition"
              >
                {copied ? Icons.Check : Icons.Copy}
              </button>
            </div>
                 <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              法人番号から直接検索する場合は{' '}
              <Link href="/business/houjin-bangou-lookup" className="text-kon dark:text-gray-300 underline hover:text-ai">
                法人番号検索ツール
              </Link>
              {' '}も便利です
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              法人名と番号が一致するか確認したい場合は{' '}
              <Link href="/business/houjin-cross-verify" className="text-kon underline hover:text-sakura">
                クロス検証ツール
              </Link>
              {' '}が便利です
            </div>
          </div>

          {loading && (
            <div className="space-y-3 animate-pulse">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
          )}

          {fetchError && (
            <div className="bg-gray-50 dark:bg-danger/20 border border-gray-200 dark:border-danger text-danger dark:text-gin p-4 rounded-lg text-sm">
              ⚠️ 詳細情報の取得に失敗しました。({fetchError})
            </div>
          )}

          {!loading && !fetchError && (
            <>
              <DetailRow label="法人名（日本語）" value={detail?.name || corp.name} />
              {detail?.kana && (
                <DetailRow label="法人名（カナ）" value={detail.kana} />
              )}
              {(detail?.name_en || corp.name_en) && (
                <DetailRow label="法人名（英語）" value={detail?.name_en || corp.name_en} />
              )}
              {detail?.representative_name && (
                <DetailRow label="代表者" value={normalizeSpaces(detail.representative_name)} />
              )}
              {detail?.location && (
                <DetailRow
                  label="所在地"
                  value={`${formatPostalCode(detail.postal_code)} ${detail.location}`.trim()}
                />
              )}
              {detail?.date_of_establishment && (
                <DetailRow label="設立日" value={detail.date_of_establishment} />
              )}
              {detail?.capital_stock != null && (Number(detail.capital_stock) || 0) > 0 && (
                <DetailRow label="資本金" value={formatCurrency(detail.capital_stock)} />
              )}
              {detail?.employee_number != null && (Number(detail.employee_number) || 0) > 0 && (
                <DetailRow
                  label="従業員数"
                  value={`${(Number(detail.employee_number) || 0).toLocaleString()}人`}
                />
              )}
              {detail?.business_summary && (
                <DetailRow label="事業概要" value={detail.business_summary} />
              )}
              {detail?.company_url && (
                <div className="space-y-0.5">
                  <div className="text-xs text-gray-500 dark:text-gray-400">ウェブサイト</div>
                  <a
                    href={detail.company_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-kon dark:text-gray-300 hover:underline break-all"
                  >
                    {detail.company_url}
                    {Icons.ExternalLink}
                  </a>
                </div>
              )}
              {detail?.update_date && (
                <DetailRow label="最終更新" value={formatDate(detail.update_date)} />
              )}
              {!detail && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  詳細情報がありません
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            データ提供: 経済産業省 gBizINFO
          </p>
        </div>
      </div>
    </>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function HoujinSearchClient() {
  const [searchMode, setSearchMode] = useState<"ja" | "en">("ja");
  const [searchName, setSearchName] = useState("");
  const [results, setResults] = useState<CorporationInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCorp, setSelectedCorp] = useState<CorporationInfo | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchName.trim();
    if (trimmed.length === 0) {
      setInputError(
        searchMode === "ja"
          ? "🔍 検索キーワードを入力してください（例: トヨタ、楽天）"
          : "🔍 Please enter a company name (e.g., Toyota, Rakuten)"
      );
      return;
    }
    if (trimmed.length > 100) {
      setError("法人名は100文字以内で入力してください");
      return;
    }

    setInputError(null);
    setLoading(true);
    setError(null);
    setResults([]);
    setHasSearched(true);
    setSelectedCorp(null);

    try {
      let fetched: CorporationInfo[] = [];

      if (searchMode === "ja") {
        const params = new URLSearchParams({ name: trimmed, limit: "20" });
        const res = await fetch(`${API_BASE}/api/gbiz/corporations?${params}`);
        if (!res.ok) {
          if (res.status === 504) throw new Error("検索がタイムアウトしました。しばらくしてから再度お試しください。");
          throw new Error(`検索中にエラーが発生しました (HTTP ${res.status})`);
        }
        const data: SearchResponse = await res.json();
        fetched = data["hojin-infos"] || [];
      } else {
        const params = new URLSearchParams({ q: trimmed, limit: "20" });
        const res = await fetch(`${API_BASE}/api/gbiz/corporations-en?${params}`);
        if (!res.ok) {
          if (res.status === 504) throw new Error("Search timed out. Please try again.");
          throw new Error(`Search error (HTTP ${res.status})`);
        }
        const data: EnSearchResponse = await res.json();
        fetched = data.results || [];
      }

      setResults(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : "検索中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (mode: "ja" | "en") => {
    if (mode === searchMode) return;
    setSearchMode(mode);
    setSearchName("");
    setResults([]);
    setError(null);
    setInputError(null);
    setHasSearched(false);
    setSelectedCorp(null);
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <nav className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            <Link href="/" className="hover:text-ai">ホーム</Link>
            <span className="mx-1">/</span>
            <Link href="/business" className="hover:text-ai">ビジネス・法人</Link>
            <span className="mx-1">/</span>
            <span>法人検索</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            法人検索ツール
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            会社名から法人番号・所在地・基本情報を検索。詳細情報・営業状態・英語検索に対応。経済産業省 gBizINFO 公式データを使用。
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Mode tabs */}
        <div className="flex gap-1 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow p-1 w-fit">
          <button
            type="button"
            onClick={() => handleModeChange("ja")}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              searchMode === "ja"
                ? "bg-kon text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            🇯🇵 日本語で検索
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("en")}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              searchMode === "en"
                ? "bg-kon text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            🌐 English / Romaji
          </button>
        </div>

        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <label htmlFor="company-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {searchMode === "ja" ? "法人名・会社名" : "Company name / Romaji"}{" "}
            <span className="text-danger">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="company-name"
              type="text"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                if (inputError) setInputError(null);
              }}
              placeholder={
                searchMode === "ja"
                  ? "例：トヨタ自動車、楽天、ソフトバンク"
                  : "e.g., Toyota, Rakuten, SoftBank"
              }
              maxLength={100}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sakura dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-kon hover:bg-ai disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
            >
              {loading
                ? (searchMode === "ja" ? "検索中..." : "Searching...")
                : "🔍 検索"}
            </button>
          </div>
          {inputError && (
            <p className="mt-1.5 text-xs text-danger dark:text-danger">{inputError}</p>
          )}
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {searchMode === "ja"
              ? "部分一致で検索します。「トヨタ」と入力すると「トヨタ自動車」など一致するすべての法人を表示します。"
              : 'Search by English name or Romaji. Try "Toyota", "Sony", "Nintendo", etc.'}
          </p>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-gray-50 dark:bg-danger/20 border border-gray-200 dark:border-danger text-danger dark:text-gin p-4 rounded-lg mb-6 flex items-start justify-between gap-3">
            <span>⚠️ {error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-danger dark:text-danger hover:underline text-sm flex-shrink-0"
            >
              閉じる
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Empty result */}
        {hasSearched && !loading && !error && results.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-3">
              {searchMode === "ja"
                ? `「${searchName}」に該当する法人が見つかりませんでした。`
                : `No results found for "${searchName}".`}
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1 text-left inline-block">
              <li>• 検索キーワードを短くしてみてください</li>
              <li>• ひらがな・カタカナ・漢字を変えてみてください</li>
              {searchMode === "ja" && (
                <li>• 英語・ローマ字の場合は「English / Romaji」タブをお試しください</li>
              )}
            </ul>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className="font-semibold">{results.length}件</span>の法人が見つかりました
              {searchMode === "en" && (
                <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">（スコア順）</span>
              )}
            </p>
            {results.map((corp) => {
              const badge = getStatusBadge(corp.status);
              return (
                <div
                  key={corp.corporate_number}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedCorp(corp)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelectedCorp(corp);
                  }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 hover:shadow-md transition border border-transparent hover:border-sakura dark:hover:border-sakura cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                          {corp.name}
                        </h2>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </div>
                      {corp.name_en && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">
                          {corp.name_en}
                        </p>
                      )}
                      {corp.corp_type_info && (
                        <p className="text-xs text-kon dark:text-gray-300 mb-2">
                          {corp.corp_type_info.japanese}（{corp.corp_type_info.en_short} · {corp.corp_type_info.us_equivalent}）
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
                    <div className="flex flex-shrink-0 flex-col gap-2 items-end">
                      {corp.number_of_activity && (Number(corp.number_of_activity) || 0) > 0 && (
                        <div className="text-center bg-gray-50 dark:bg-kon/30 px-3 py-2 rounded">
                          <div className="text-xs text-gray-600 dark:text-gray-400">活動情報</div>
                          <div className="text-lg font-bold text-kon dark:text-gray-300">
                            {corp.number_of_activity}件
                          </div>
                        </div>
                      )}
                      <div className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded">
                        詳細 →
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info section */}
        <div className="mt-12 bg-gray-50 dark:bg-kon/20 border border-gray-200 dark:border-kon rounded-lg p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            💡 法人検索ツールについて
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>経済産業省が運営する <strong>gBizINFO</strong> の公式データを使用しています</li>
            <li>約400万社の国内法人が登録されています</li>
            <li>法人番号・所在地・最終更新日などの基本情報を確認できます</li>
            <li>結果をクリックすると資本金・従業員数・設立日・代表者などの詳細情報を表示します</li>
            <li>英語・ローマ字での会社名検索に対応しています（Toyota, Sony など）</li>
            <li>無料・登録不要でご利用いただけます</li>
          </ul>
        </div>

        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
          データ提供: 経済産業省 gBizINFO（<a href="https://info.gbiz.go.jp/" target="_blank" rel="noopener noreferrer" className="underline hover:text-ai">https://info.gbiz.go.jp/</a>）
        </p>
      </div>

      {/* Detail Drawer */}
      {selectedCorp && (
        <DetailDrawer
          corp={selectedCorp}
          onClose={() => setSelectedCorp(null)}
        />
      )}
    </div>
  );
}
