"use client";

import { useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

type SubsidyRecord = {
  date_of_approval?: string;
  title?: string;
  amount?: number;
  target?: string;
  government_departments?: string;
  joint_signatures?: string;
  subsidy_resource?: string;
  note?: string;
};

type HojinInfo = {
  name?: string;
  corporate_number?: string;
  subsidy?: SubsidyRecord[];
};

type SearchResponse = {
  message?: string;
  errors?: string | null;
  "hojin-infos"?: HojinInfo[];
};

type CorporationInfo = {
  corporate_number: string;
  name: string;
  location?: string;
};

export default function HojokinHistoryClient() {
  const [mode, setMode] = useState<"name" | "number">("name");
  const [searchInput, setSearchInput] = useState("");
  const [companies, setCompanies] = useState<CorporationInfo[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CorporationInfo | null>(null);
  const [subsidies, setSubsidies] = useState<SubsidyRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"input" | "select" | "results">("input");

  const handleSearchByName = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed.length === 0) {
      setError("法人名を入力してください");
      return;
    }
    setLoading(true);
    setError(null);
    setCompanies([]);

    try {
      const params = new URLSearchParams({ name: trimmed, limit: "20" });
      const res = await fetch(`${API_BASE}/api/gbiz/corporations?${params}`);
      if (!res.ok) throw new Error(`検索エラー (HTTP ${res.status})`);

      const data = await res.json();
      const infos = (data["hojin-infos"] || []) as CorporationInfo[];

      if (infos.length === 0) {
        setError(`「${trimmed}」に該当する法人が見つかりませんでした`);
        setStep("input");
      } else if (infos.length === 1) {
        // Auto-select if only one result
        await fetchSubsidies(infos[0]);
      } else {
        setCompanies(infos);
        setStep("select");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "検索エラー");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByNumber = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchInput.trim();
    if (!/^\d{13}$/.test(trimmed)) {
      setError("法人番号は13桁の数字で入力してください");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // First get corp info for display
      const detailRes = await fetch(`${API_BASE}/api/gbiz/corporation/${trimmed}`);
      if (!detailRes.ok) {
        if (detailRes.status === 404) throw new Error("法人番号が見つかりません");
        throw new Error(`検索エラー (HTTP ${detailRes.status})`);
      }
      const detailData = await detailRes.json();
      const corp = (detailData["hojin-infos"] || [])[0] as CorporationInfo;

      if (!corp) throw new Error("法人情報の取得に失敗しました");

      await fetchSubsidies(corp);
    } catch (err) {
      setError(err instanceof Error ? err.message : "検索エラー");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubsidies = async (corp: CorporationInfo) => {
    setSelectedCompany(corp);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/gbiz/subsidy-history/${corp.corporate_number}`);
      if (!res.ok) throw new Error(`補助金履歴の取得エラー (HTTP ${res.status})`);

      const data: SearchResponse = await res.json();
      const subs = data["hojin-infos"]?.[0]?.subsidy || [];
      setSubsidies(subs);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "補助金履歴の取得エラー");
      setStep("input");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("input");
    setSearchInput("");
    setCompanies([]);
    setSelectedCompany(null);
    setSubsidies([]);
    setError(null);
  };

  const formatYen = (amount?: number) => {
    if (amount === undefined || amount === null) return "—";
    return `¥${amount.toLocaleString()}`;
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "—";
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
            <Link href="/" className="hover:text-ai">ホーム</Link>
            <span className="mx-1">/</span>
            <Link href="/business" className="hover:text-ai">ビジネス・法人</Link>
            <span className="mx-1">/</span>
            <span>補助金履歴検索</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            補助金履歴検索ツール
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            特定の法人が<strong>過去に受け取った補助金</strong>の履歴を検索。経済産業省 gBizINFO の公式データを使用。
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* STEP 1: Input */}
        {step === "input" && (
          <>
            {/* Mode toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => { setMode("name"); setError(null); setSearchInput(""); }}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  mode === "name"
                    ? "bg-kon text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                }`}
              >
                法人名で検索
              </button>
              <button
                onClick={() => { setMode("number"); setError(null); setSearchInput(""); }}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  mode === "number"
                    ? "bg-kon text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                }`}
              >
                法人番号で検索
              </button>
            </div>

            <form
              onSubmit={mode === "name" ? handleSearchByName : handleSearchByNumber}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {mode === "name" ? "法人名・会社名" : "法人番号（13桁）"} <span className="text-danger">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={mode === "name" ? "例：トヨタ自動車" : "例：1010001012345"}
                  maxLength={mode === "name" ? 100 : 13}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sakura dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !searchInput.trim()}
                  className="px-6 py-3 bg-kon hover:bg-ai disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
                >
                  {loading ? "検索中..." : "🔍 検索"}
                </button>
              </div>
              {mode === "number" && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  法人番号がわからない場合は「法人名で検索」をご利用ください。
                </p>
              )}
            </form>
          </>
        )}

        {/* STEP 2: Select from multiple companies */}
        {step === "select" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                該当する法人を選択してください（{companies.length}件）
              </h2>
              <button
                onClick={handleReset}
                className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
              >
                ← 別のキーワードで検索
              </button>
            </div>
            <div className="space-y-2">
              {companies.map((corp) => (
                <button
                  key={corp.corporate_number}
                  onClick={() => fetchSubsidies(corp)}
                  className="w-full text-left bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md hover:border-sakura dark:hover:border-sakura transition border border-transparent"
                  disabled={loading}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">{corp.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    法人番号: <span className="font-mono">{corp.corporate_number}</span>
                  </div>
                  {corp.location && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">{corp.location}</div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {/* STEP 3: Results */}
        {step === "results" && selectedCompany && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedCompany.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    法人番号: <span className="font-mono">{selectedCompany.corporate_number}</span>
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:underline whitespace-nowrap"
                >
                  ← 新規検索
                </button>
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-3">
                補助金履歴: <span className="text-sakura dark:text-sakura">{subsidies.length}件</span>
              </p>
            </div>

            {subsidies.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  この法人の補助金受給履歴は記録されていません。
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                  ※gBizINFO に登録されているデータのみ表示されます
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {subsidies.map((sub, idx) => (
                  <div
                    key={`${sub.title}-${idx}`}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-5"
                  >
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                      {sub.title || "（タイトルなし）"}
                    </h3>
                    <dl className="text-sm space-y-1.5">
                      {sub.date_of_approval && (
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="text-gray-500 dark:text-gray-400 min-w-[6rem]">📅 認定日:</dt>
                          <dd className="text-gray-900 dark:text-white">{formatDate(sub.date_of_approval)}</dd>
                        </div>
                      )}
                      {sub.amount !== undefined && (
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="text-gray-500 dark:text-gray-400 min-w-[6rem]">💰 補助金額:</dt>
                          <dd className="text-gray-900 dark:text-white font-semibold">{formatYen(sub.amount)}</dd>
                        </div>
                      )}
                      {sub.government_departments && (
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="text-gray-500 dark:text-gray-400 min-w-[6rem]">🏛 担当省庁:</dt>
                          <dd className="text-gray-900 dark:text-white">{sub.government_departments}</dd>
                        </div>
                      )}
                      {sub.target && (
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="text-gray-500 dark:text-gray-400 min-w-[6rem]">🎯 対象:</dt>
                          <dd className="text-gray-900 dark:text-white">{sub.target}</dd>
                        </div>
                      )}
                      {sub.subsidy_resource && (
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="text-gray-500 dark:text-gray-400 min-w-[6rem]">📋 制度名:</dt>
                          <dd className="text-gray-900 dark:text-white">{sub.subsidy_resource}</dd>
                        </div>
                      )}
                      {sub.note && (
                        <div className="flex flex-wrap gap-x-2">
                          <dt className="text-gray-500 dark:text-gray-400 min-w-[6rem]">📝 備考:</dt>
                          <dd className="text-gray-900 dark:text-white">{sub.note}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Error */}
        {error && (
          <div className="bg-gray-50 dark:bg-danger/20 border border-gray-200 dark:border-danger text-danger dark:text-gin p-4 rounded-lg mt-4">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-sakura"></div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">読み込み中...</p>
          </div>
        )}

        {/* Info section */}
        <div className="mt-12 bg-gray-50 dark:bg-kon/20 border border-gray-200 dark:border-kon rounded-lg p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            💡 補助金履歴検索ツールについて
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>経済産業省 <strong>gBizINFO</strong> の公式データを使用</li>
            <li>特定の法人が過去に受給した補助金の履歴を表示</li>
            <li>取引先の信用調査・与信判断にご活用ください</li>
            <li>無料・登録不要</li>
          </ul>
          <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
            ※ <strong>現在募集中の補助金</strong>を探したい場合は <Link href="/business/hojokin-active" className="text-sakura dark:text-sakura underline">補助金検索ツール</Link> をご利用ください
          </p>
        </div>

        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
          データ提供: 経済産業省 gBizINFO（<a href="https://info.gbiz.go.jp/" target="_blank" rel="noopener noreferrer" className="underline hover:text-ai">https://info.gbiz.go.jp/</a>）
        </p>
      </div>
    </div>
  );
}
