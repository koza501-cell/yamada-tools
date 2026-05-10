"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from "@/components/common/PricingTriggerProvider";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

const Icons = {
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
  ),
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
  ),
  Print: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>
  ),
  AlertCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
};

interface NtaResult {
  registratedNumber?: string;
  name?: string;
  address?: string;
  registrationDate?: string;
  updateDate?: string;
  disposalDate?: string;
  expireDate?: string;
  kind?: string;
  tradeName?: string;
  popularName_previousName?: string;
  country?: string;
  latest?: string;
  notFound?: boolean;
}

interface LookupResponse {
  results: NtaResult[];
  rate_limit: { used: number; limit: number; remaining: number };
}

interface RateStatus {
  used: number;
  limit: number;
  remaining: number;
  is_limited: boolean;
}

function getStatus(r: NtaResult): { label: string; color: string; icon: string } {
  if (r.notFound) return { label: "該当なし", color: "text-gray-500 bg-gray-100", icon: "⚫" };
  if (r.disposalDate) return { label: "取消", color: "text-danger bg-gray-50", icon: "🔴" };
  if (r.expireDate) return { label: "失効", color: "text-kon bg-gray-50", icon: "🟡" };
  if (r.latest === "0") return { label: "履歴", color: "text-yellow-700 bg-yellow-100", icon: "🟡" };
  return { label: "有効", color: "text-green-700 bg-green-100", icon: "🟢" };
}

function formatDate(d?: string): string {
  if (!d) return "";
  if (d.length === 8) return `${d.slice(0, 4)}年${d.slice(4, 6)}月${d.slice(6, 8)}日`;
  return d;
}

function ResultCard({ r }: { r: NtaResult }) {
  const status = getStatus(r);
  const isLegal = r.kind === "2";
  const countryLabel =
    r.country === "1" ? "国内" : r.country === "2" ? "特定国外" : r.country === "3" ? "その他国外" : "";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="font-mono text-sm text-gray-500 mb-1">{r.registratedNumber || "—"}</div>
          {r.notFound ? (
            <p className="text-gray-500 text-sm">この番号は適格請求書発行事業者として登録されていません。</p>
          ) : (
            <p className="font-bold text-lg text-gray-900">{r.name || "—"}</p>
          )}
        </div>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap ${status.color}`}>
          {status.icon} {status.label}
        </span>
      </div>

      {!r.notFound && (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {r.address && (
            <div className="sm:col-span-2">
              <dt className="text-gray-400 text-xs">所在地</dt>
              <dd className="text-gray-800">{r.address}</dd>
            </div>
          )}
          <div>
            <dt className="text-gray-400 text-xs">区分</dt>
            <dd className="text-gray-800">{isLegal ? "法人" : "個人事業主"}</dd>
          </div>
          {countryLabel && (
            <div>
              <dt className="text-gray-400 text-xs">国</dt>
              <dd className="text-gray-800">{countryLabel}</dd>
            </div>
          )}
          {r.registrationDate && (
            <div>
              <dt className="text-gray-400 text-xs">登録年月日</dt>
              <dd className="text-gray-800">{formatDate(r.registrationDate)}</dd>
            </div>
          )}
          {r.updateDate && (
            <div>
              <dt className="text-gray-400 text-xs">最終更新日</dt>
              <dd className="text-gray-800">{formatDate(r.updateDate)}</dd>
            </div>
          )}
          {r.expireDate && (
            <div>
              <dt className="text-gray-400 text-xs text-kon">失効年月日</dt>
              <dd className="text-kon font-medium">{formatDate(r.expireDate)}</dd>
            </div>
          )}
          {r.disposalDate && (
            <div>
              <dt className="text-gray-400 text-xs text-danger">取消年月日</dt>
              <dd className="text-danger font-medium">{formatDate(r.disposalDate)}</dd>
            </div>
          )}
          {!isLegal && r.tradeName && (
            <div>
              <dt className="text-gray-400 text-xs">屋号</dt>
              <dd className="text-gray-800">{r.tradeName}</dd>
            </div>
          )}
          {!isLegal && r.popularName_previousName && (
            <div>
              <dt className="text-gray-400 text-xs">通称・旧姓</dt>
              <dd className="text-gray-800">{r.popularName_previousName}</dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}

function validFormat(n: string): boolean {
  return typeof n === "string" && n.startsWith("T") && n.length === 14 && /^\d+$/.test(n.slice(1));
}

function parseNumbers(raw: string): string[] {
  return raw
    .split(/[\n,\s]+/)
    .map((s) => {
      const clean = s.trim().toUpperCase().replace(/[Ｔ]/g, "T");
      return clean.startsWith("T") ? clean : `T${clean}`;
    })
    .filter((s) => s.length > 1);
}

export default function TNumberClient() {
  const { triggerSuccess } = usePricingContext();
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [includeHistory, setIncludeHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<NtaResult[] | null>(null);
  const [rateLimit, setRateLimit] = useState<{ used: number; limit: number; remaining: number } | null>(null);
  const [rateStatus, setRateStatus] = useState<RateStatus | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch(`${API_BASE}/api/nta/invoice/rate-status`)
      .then((r) => r.json())
      .then((d: RateStatus) => setRateStatus(d))
      .catch(() => null);
  }, []);

  const handleSearch = async () => {
    const parsed = parseNumbers(input);
    if (parsed.length === 0) {
      setError("T番号を入力してください");
      return;
    }
    if (parsed.length > 10) {
      setError("一度に10件まで検索できます");
      return;
    }
    const invalid = parsed.filter((n) => !validFormat(n));
    if (invalid.length > 0) {
      setError(`形式が不正です: ${invalid[0]}（例: T1234567890123）`);
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const params = new URLSearchParams({ numbers: parsed.join(",") });
      if (includeHistory) params.set("history", "1");
      const res = await fetch(`${API_BASE}/api/nta/invoice/lookup?${params}`);
      if (res.status === 429) {
        const d = await res.json().catch(() => ({}));
        setError(
          (d as { detail?: string }).detail ||
            "本日の検索回数の上限に達しました。明日0時にリセットされます。"
        );
        return;
      }
      if (!res.ok) throw new Error(`エラー (HTTP ${res.status})`);
      const data: LookupResponse = await res.json();
      setResults(data.results);
      setRateLimit(data.rate_limit);
      setRateStatus((prev) =>
        prev ? { ...prev, used: data.rate_limit.used, remaining: data.rate_limit.remaining } : null
      );
      const hasValid = data.results.some((r) => !r.notFound);
      if (hasValid) triggerSuccess("t-number");
    } catch (e) {
      setError(e instanceof Error ? e.message : "検索中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!results) return;
    const text = results
      .map((r) => {
        const s = getStatus(r);
        if (r.notFound) return `${r.registratedNumber} — 該当なし`;
        return `${r.registratedNumber} | ${r.name} | ${r.address || ""} | ${s.label} | 登録日: ${formatDate(r.registrationDate)}`;
      })
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCsvDownload = () => {
    if (!results) return;
    const header = "登録番号,事業者名,所在地,ステータス,登録年月日\n";
    const rows = results
      .map((r) => {
        const s = getStatus(r);
        const name = (r.name || "").replace(/,/g, "、");
        const addr = (r.address || "").replace(/,/g, "、");
        return `${r.registratedNumber || ""},${name},${addr},${s.label},${formatDate(r.registrationDate)}`;
      })
      .join("\n");
    const blob = new Blob(["﻿" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoice_check.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const isLimited = rateStatus != null && rateStatus.remaining === 0;
  const countText = input ? `${parseNumbers(input).length}件入力中` : "";

  if (!mounted) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-kon mb-2">インボイス番号 検索・確認</h1>
          <p className="text-gray-600 text-lg">国税庁公式データで適格請求書発行事業者を即時検証</p>
        </header>

        {rateStatus && (
          <div
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg mb-5 ${
              isLimited
                ? "bg-gray-50 text-danger border border-gray-200"
                : "bg-gray-50 text-kon border border-gray-200"
            }`}
          >
            <Icons.Info />
            {isLimited
              ? "本日の無料検索枠を使い切りました。明日0時にリセットされます。"
              : `本日の検索回数: ${rateStatus.used} / ${rateStatus.limit}回`}
          </div>
        )}

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              登録番号（T + 13桁）
              {countText && <span className="ml-2 text-xs text-gray-400">{countText}</span>}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"T2021001052596\nT6010001197612\n（1行に1件、最大10件）"}
              rows={4}
              className="w-full px-4 py-3 font-mono text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              改行・カンマ・スペース区切りに対応。Tなしの13桁も自動補完します。
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 mb-5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeHistory}
              onChange={(e) => setIncludeHistory(e.target.checked)}
              className="rounded"
            />
            履歴も含む（過去の登録情報も表示）
          </label>

          <button
            type="button"
            onClick={handleSearch}
            disabled={loading || isLimited}
            className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icons.Search />
            )}
            {loading ? "国税庁DBを照会中..." : "検索"}
          </button>
        </section>

        {error && (
          <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-danger text-sm">
            <Icons.AlertCircle />
            <span>{error}</span>
          </div>
        )}

        {results && results.length > 0 && (
          <section className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-800">検索結果 ({results.length}件)</h2>
              {rateLimit && (
                <span className="text-xs text-gray-400">
                  本日 {rateLimit.used}/{rateLimit.limit} 回使用済み
                </span>
              )}
            </div>

            {results.map((r, i) => (
              <ResultCard key={i} r={r} />
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icons.Copy />
                {copied ? "コピーしました！" : "結果をコピー"}
              </button>
              <button
                type="button"
                onClick={handleCsvDownload}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icons.Download />
                CSVでダウンロード
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icons.Print />
                印刷・PDF保存
              </button>
            </div>

            <Link
              href="/business/invoice-bulk-checker"
              className="flex items-center gap-2 text-sm text-kon hover:text-ai font-medium pt-1"
            >
              <Icons.ArrowRight />
              もっと多くの番号を一括チェック（最大100件）
            </Link>

            <Link
              href="/blog/invoice-tnumber-kakunin-guide"
              className="flex items-center gap-2 text-sm text-kon hover:text-ai font-medium pt-1"
            >
              <Icons.ArrowRight />
              📖 インボイス番号確認の完全ガイド
            </Link>

            <Link
              href="/business/houjin-bangou-lookup"
              className="flex items-center gap-2 text-sm text-kon hover:text-ai font-medium pt-1"
            >
              <Icons.ArrowRight />
              🔢 法人番号検索（13桁で会社詳細・変更履歴を確認）
            </Link>

            <Link
              href="/business/houjin-cross-verify"
              className="flex items-center gap-2 text-sm text-kon hover:text-ai font-medium pt-1"
            >
              <Icons.ArrowRight />
              🔍 法人名×T番号 クロス検証（請求書の名前と番号の一致を確認）
            </Link>

            <p className="text-xs text-gray-400 italic leading-relaxed pt-2 border-t border-gray-100">
              このサービスは、国税庁適格請求書発行事業者公表システムのWeb-API機能を利用して取得した情報をもとに作成しているが、サービスの内容は国税庁によって保証されたものではない。
            </p>
          </section>
        )}

        <section className="bg-gray-50 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-kon mb-3 text-sm">サンプル番号（テスト用）</h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setInput("T2021001052596")}
              className="block w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-100 font-mono text-sm"
            >
              T2021001052596（国税庁）
            </button>
            <button
              type="button"
              onClick={() => setInput("T9999999999999")}
              className="block w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-100 font-mono text-sm"
            >
              T9999999999999（該当なしの表示例）
            </button>
          </div>
        </section>

        <div className="mt-6 text-center">
          <Link href="/generator" className="text-kon hover:text-ai text-sm">
            ← 計算・生成ツール一覧に戻る
          </Link>
        </div>
        <AdUnit slot="5612038947" format="horizontal" />
      </div>
    </div>
  );
}
