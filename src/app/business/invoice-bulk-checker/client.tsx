"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from "@/components/common/PricingTriggerProvider";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

const Icons = {
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Upload: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
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
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  ),
  ChevronUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
  ),
  ArrowLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
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

interface BulkResponse {
  results: NtaResult[];
  total_requested: number;
  total_found: number;
  rate_limit: { used: number; limit: number; remaining: number };
}

interface RateStatus {
  used: number;
  limit: number;
  remaining: number;
  is_limited: boolean;
}

type Step = "input" | "confirm" | "processing" | "results";
type FilterType = "all" | "valid" | "problems";

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

function parseCSVRows(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  return lines.map((line) => {
    const cells: string[] = [];
    let inQuote = false;
    let cell = "";
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === "," && !inQuote) { cells.push(cell.trim()); cell = ""; }
      else { cell += ch; }
    }
    cells.push(cell.trim());
    return cells;
  });
}

function validFormat(n: string): boolean {
  return typeof n === "string" && n.startsWith("T") && n.length === 14 && /^\d+$/.test(n.slice(1));
}

function normalizeNumber(s: string): string {
  const clean = s.trim().toUpperCase().replace(/[Ｔ]/g, "T");
  return clean.startsWith("T") ? clean : `T${clean}`;
}

function parseDirectInput(text: string): string[] {
  return text
    .split(/[\n,\s]+/)
    .map((s) => normalizeNumber(s))
    .filter((s) => s.length > 1);
}

function extractTNumbers(text: string): string[] {
  const raw = text.match(/[TＴ][0-9０-９]{13}/gi) || [];
  const normalized = raw.map((m) =>
    "T" + m.slice(1).replace(/[０-９]/g, (c) => String(c.charCodeAt(0) - 0xff10))
  );
  return [...new Set(normalized.map((m) => m.toUpperCase()))];
}

function ResultRow({ r, idx }: { r: NtaResult; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  const status = getStatus(r);
  const isLegal = r.kind === "2";

  return (
    <>
      <tr
        className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
          idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
        }`}
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-3 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">
          {r.registratedNumber || "—"}
        </td>
        <td className="px-3 py-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
            {status.icon} {status.label}
          </span>
        </td>
        <td className="px-3 py-3 text-sm text-gray-800 max-w-[180px] truncate">
          {r.notFound ? <span className="text-gray-400">—</span> : (r.name || "—")}
        </td>
        <td className="px-3 py-3 text-xs text-gray-500 max-w-[160px] truncate hidden sm:table-cell">
          {r.address || "—"}
        </td>
        <td className="px-3 py-3 text-xs text-gray-500 hidden md:table-cell whitespace-nowrap">
          {formatDate(r.registrationDate) || "—"}
        </td>
        <td className="px-3 py-3 text-gray-400">
          {expanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
        </td>
      </tr>
      {expanded && !r.notFound && (
        <tr className="bg-gray-50/30 border-b border-gray-100">
          <td colSpan={6} className="px-4 py-3">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-xs">
              <div>
                <dt className="text-gray-400">区分</dt>
                <dd className="text-gray-700 font-medium">{isLegal ? "法人" : "個人事業主"}</dd>
              </div>
              {r.updateDate && (
                <div>
                  <dt className="text-gray-400">最終更新</dt>
                  <dd className="text-gray-700">{formatDate(r.updateDate)}</dd>
                </div>
              )}
              {r.expireDate && (
                <div>
                  <dt className="text-danger">失効日</dt>
                  <dd className="text-danger font-medium">{formatDate(r.expireDate)}</dd>
                </div>
              )}
              {r.disposalDate && (
                <div>
                  <dt className="text-danger">取消日</dt>
                  <dd className="text-danger font-medium">{formatDate(r.disposalDate)}</dd>
                </div>
              )}
              {!isLegal && r.tradeName && (
                <div>
                  <dt className="text-gray-400">屋号</dt>
                  <dd className="text-gray-700">{r.tradeName}</dd>
                </div>
              )}
              {!isLegal && r.popularName_previousName && (
                <div>
                  <dt className="text-gray-400">通称・旧姓</dt>
                  <dd className="text-gray-700">{r.popularName_previousName}</dd>
                </div>
              )}
            </dl>
          </td>
        </tr>
      )}
    </>
  );
}

const SAMPLE_NUMBERS = [
  "T2021001052596",
  "T6010001197612",
  "T3010401028184",
  "T4010001082481",
  "T1010001094426",
].join("\n");

export default function InvoiceBulkCheckerClient() {
  const { triggerSuccess } = usePricingContext();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("input");
  const [activeTab, setActiveTab] = useState(0);

  const [directInput, setDirectInput] = useState("");

  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [csvColumns, setCsvColumns] = useState<number[]>([]);
  const [csvColIdx, setCsvColIdx] = useState(0);
  const [csvFileName, setCsvFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [excelText, setExcelText] = useState("");
  const [excelExtracted, setExcelExtracted] = useState<string[]>([]);

  const [validNumbers, setValidNumbers] = useState<string[]>([]);
  const [invalidSamples, setInvalidSamples] = useState<string[]>([]);
  const [dupCount, setDupCount] = useState(0);

  const [progress, setProgress] = useState({ current: 0, total: 1 });

  const [results, setResults] = useState<NtaResult[] | null>(null);
  const [rateLimit, setRateLimit] = useState<{ used: number; limit: number; remaining: number } | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [copied, setCopied] = useState(false);

  const [rateStatus, setRateStatus] = useState<RateStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    setMounted(true);
    fetch(`${API_BASE}/api/nta/invoice/rate-status`)
      .then((r) => r.json())
      .then((d: RateStatus) => setRateStatus(d))
      .catch(() => null);
  }, []);

  const isLimited = rateStatus != null && rateStatus.remaining === 0;

  const handleCsvUpload = (file: File) => {
    setCsvFileName(file.name);
    setCsvRows([]);
    setCsvColumns([]);
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      let text = "";
      try {
        const utf8 = new TextDecoder("utf-8").decode(buffer);
        text = utf8.includes("�")
          ? new TextDecoder("shift_jis").decode(buffer)
          : utf8;
      } catch {
        text = new TextDecoder("utf-8").decode(buffer);
      }
      const rows = parseCSVRows(text);
      if (rows.length === 0) return;
      setCsvRows(rows);
      const colCount = Math.max(...rows.map((r) => r.length));
      const tCols: number[] = [];
      for (let c = 0; c < colCount; c++) {
        if (rows.some((row) => validFormat(row[c] || ""))) tCols.push(c);
      }
      setCsvColumns(tCols);
      setCsvColIdx(tCols[0] ?? 0);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExcelPaste = (text: string) => {
    setExcelText(text);
    setExcelExtracted(extractTNumbers(text));
  };

  const getRawNumbers = (): string[] => {
    if (activeTab === 0) return parseDirectInput(directInput);
    if (activeTab === 1) {
      return csvRows
        .map((row) => normalizeNumber(row[csvColIdx] || ""))
        .filter((v) => v.length > 1);
    }
    return excelExtracted;
  };

  const handleValidate = () => {
    setError(null);
    const raw = getRawNumbers();
    if (raw.length === 0) {
      setError("T番号を1件以上入力してください");
      return;
    }
    const seen = new Set<string>();
    const valid: string[] = [];
    const invalid: string[] = [];
    let dups = 0;
    for (const n of raw) {
      if (validFormat(n)) {
        if (seen.has(n)) { dups++; }
        else { seen.add(n); valid.push(n); }
      } else {
        invalid.push(n);
      }
    }
    if (valid.length === 0) {
      setError("有効なT番号が見つかりません。形式: T + 13桁の数字（例: T2021001052596）");
      return;
    }
    if (valid.length > 100) {
      setError(`最大100件まで検証できます。現在: ${valid.length}件`);
      return;
    }
    setValidNumbers(valid);
    setInvalidSamples(invalid.slice(0, 3));
    setDupCount(dups);
    setStep("confirm");
  };

  const handleBulk = async () => {
    if (isLimited) return;
    setError(null);
    const totalBatches = Math.ceil(validNumbers.length / 10);
    setProgress({ current: 0, total: totalBatches });
    setStep("processing");

    let cur = 0;
    const interval = setInterval(() => {
      cur++;
      if (cur <= totalBatches) setProgress({ current: cur, total: totalBatches });
    }, 900);

    try {
      const res = await fetch(`${API_BASE}/api/nta/invoice/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers: validNumbers }),
      });
      clearInterval(interval);

      if (res.status === 429) {
        const d = await res.json().catch(() => ({}));
        setError(
          (d as { detail?: string }).detail ||
            "本日の検索回数の上限に達しました。明日0時にリセットされます。"
        );
        setStep("confirm");
        return;
      }
      if (!res.ok) throw new Error(`エラー (HTTP ${res.status})`);

      const data: BulkResponse = await res.json();
      setProgress({ current: totalBatches, total: totalBatches });
      setResults(data.results);
      setRateLimit(data.rate_limit);
      setRateStatus((prev) =>
        prev ? { ...prev, used: data.rate_limit.used, remaining: data.rate_limit.remaining } : null
      );
      if (data.results.some((r) => !r.notFound)) triggerSuccess("invoice-bulk-checker");
      setStep("results");
    } catch (e) {
      clearInterval(interval);
      setError(e instanceof Error ? e.message : "検索中にエラーが発生しました");
      setStep("confirm");
    }
  };

  const handleCsvDownload = () => {
    if (!results) return;
    const header = "登録番号,ステータス,事業者名,所在地,登録年月日,最終更新日\n";
    const rows = results
      .map((r) => {
        const s = getStatus(r);
        const esc = (v?: string) => `"${(v || "").replace(/"/g, '""')}"`;
        return [
          r.registratedNumber || "",
          s.label,
          esc(r.name),
          esc(r.address),
          formatDate(r.registrationDate),
          formatDate(r.updateDate),
        ].join(",");
      })
      .join("\n");
    const blob = new Blob(["﻿" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoice_bulk_check.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = () => {
    if (!results) return;
    const header = "登録番号\tステータス\t事業者名\t所在地\t登録年月日";
    const rows = results
      .map((r) => {
        const s = getStatus(r);
        return [
          r.registratedNumber || "",
          s.label,
          r.name || "",
          r.address || "",
          formatDate(r.registrationDate),
        ].join("\t");
      })
      .join("\n");
    navigator.clipboard.writeText(header + "\n" + rows).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const resetAll = () => {
    setStep("input");
    setResults(null);
    setRateLimit(null);
    setFilter("all");
    setDirectInput("");
    setCsvRows([]);
    setCsvColumns([]);
    setCsvFileName("");
    setExcelText("");
    setExcelExtracted([]);
    setError(null);
    setSortKey(null);
    setSortDir("asc");
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else { setSortKey(null); setSortDir("asc"); }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filteredResults = results
    ? results
        .filter((r) => {
          if (filter === "valid") return getStatus(r).label === "有効";
          if (filter === "problems") return getStatus(r).label !== "有効";
          return true;
        })
        .sort((a, b) => {
          if (!sortKey) return 0;
          const dir = sortDir === "asc" ? 1 : -1;
          if (sortKey === "status") {
            const order: Record<string, number> = { 有効: 0, 履歴: 1, 失効: 2, 取消: 3, 該当なし: 4 };
            return dir * ((order[getStatus(a).label] ?? 5) - (order[getStatus(b).label] ?? 5));
          }
          if (sortKey === "registratedNumber") {
            return dir * (a.registratedNumber || "").localeCompare(b.registratedNumber || "", "ja");
          }
          if (sortKey === "name") {
            return dir * (a.name || "").localeCompare(b.name || "", "ja");
          }
          if (sortKey === "registrationDate") {
            return dir * (a.registrationDate || "").localeCompare(b.registrationDate || "");
          }
          return 0;
        })
    : [];

  const summaryStats = results
    ? {
        total: results.length,
        valid: results.filter((r) => getStatus(r).label === "有効").length,
        expired: results.filter((r) => !!(r.disposalDate || r.expireDate)).length,
        notFound: results.filter((r) => r.notFound).length,
      }
    : null;

  if (!mounted) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">📊</div>
          <h1 className="text-3xl font-bold text-kon mb-2">インボイス番号一括チェッカー</h1>
          <p className="text-gray-600 text-lg">最大100件のT番号を国税庁公式データで一括検証</p>
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
              : `本日の検索回数: ${rateStatus.used} / ${rateStatus.limit}回（1回につき最大100件）`}
          </div>
        )}

        {/* INPUT STEP */}
        {step === "input" && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
              {["直接入力", "CSV アップロード", "Excel 貼り付け"].map((label, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setActiveTab(i); setError(null); }}
                  className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === i
                      ? "bg-white shadow-sm text-kon"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  T番号（1行に1件、最大100件）
                  {directInput && (
                    <span className="ml-2 text-xs text-gray-400">
                      {parseDirectInput(directInput).length}件入力中
                    </span>
                  )}
                </label>
                <textarea
                  value={directInput}
                  onChange={(e) => setDirectInput(e.target.value)}
                  placeholder={"T2021001052596\nT6010001197612\n（Tなしの13桁も自動補完）"}
                  rows={8}
                  className="w-full px-4 py-3 font-mono text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">改行・カンマ・スペース区切りに対応。重複は自動除去します。</p>
                <button
                  type="button"
                  onClick={() => setDirectInput(SAMPLE_NUMBERS)}
                  className="mt-2 text-xs text-kon hover:text-ai underline"
                >
                  サンプルデータで試す（5件）
                </button>
              </div>
            )}

            {activeTab === 1 && (
              <div>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-kon/50 transition-colors"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleCsvUpload(file);
                  }}
                >
                  <div className="flex justify-center mb-2 text-gray-400">
                    <Icons.Upload />
                  </div>
                  <p className="text-sm text-gray-500">
                    {csvFileName ? csvFileName : "CSVファイルをドロップ、またはクリックして選択"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">.csv（UTF-8・Shift_JIS対応）</p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCsvUpload(file);
                  }}
                />
                {csvRows.length > 0 && csvColumns.length === 0 && (
                  <p className="text-sm text-kon mt-3">
                    T番号（T+13桁）を含む列が見つかりませんでした。直接入力タブをお試しください。
                  </p>
                )}
                {csvRows.length > 0 && csvColumns.length > 0 && (
                  <div className="mt-4">
                    {csvColumns.length > 1 && (
                      <div className="mb-3">
                        <label className="text-sm font-medium text-gray-700 block mb-1">T番号が含まれる列を選択</label>
                        <select
                          value={csvColIdx}
                          onChange={(e) => setCsvColIdx(Number(e.target.value) || 0)}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        >
                          {csvColumns.map((c) => (
                            <option key={c} value={c}>
                              列{c + 1}（例: {csvRows.find((r) => validFormat(r[c] || ""))?.[c] || "—"}）
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <p className="text-sm text-green-700 font-medium">
                      ✓ {csvRows.filter((r) => validFormat(r[csvColIdx] || "")).length}件のT番号を検出
                    </p>
                    <div className="mt-2 overflow-x-auto border border-gray-200 rounded-lg">
                      <table className="w-full text-xs">
                        <tbody>
                          {csvRows.slice(0, 5).map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              {row.slice(0, 4).map((cell, j) => (
                                <td
                                  key={j}
                                  className={`px-2 py-1 border-r border-gray-100 ${
                                    j === csvColIdx ? "bg-gray-50 font-medium text-kon" : "text-gray-600"
                                  }`}
                                >
                                  {cell || "—"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">プレビュー（最大5行）</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 2 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excelからコピーした内容を貼り付け
                  {excelExtracted.length > 0 && (
                    <span className="ml-2 text-xs text-green-600 font-semibold">
                      ✓ {excelExtracted.length}件のT番号を検出
                    </span>
                  )}
                </label>
                <textarea
                  value={excelText}
                  onChange={(e) => handleExcelPaste(e.target.value)}
                  placeholder="Excelシートからコピーした内容をここに貼り付けてください。T番号を含む列があれば自動抽出します。"
                  rows={8}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  T+13桁の数字を含むセルを自動検出します。他の列のデータは無視されます。
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 mt-4 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-danger text-sm">
                <Icons.AlertCircle />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleValidate}
              disabled={isLimited}
              className="w-full mt-6 py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icons.Search />
              入力内容を確認する
            </button>
          </section>
        )}

        {/* CONFIRM STEP */}
        {step === "confirm" && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-lg text-gray-800 mb-5">検証内容の確認</h2>
            <div className="space-y-0 divide-y divide-gray-100 mb-5">
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-600">有効な形式のT番号</span>
                <span className="font-bold text-green-700">{validNumbers.length}件</span>
              </div>
              {invalidSamples.length > 0 && (
                <div className="flex items-start justify-between py-3 gap-4">
                  <span className="text-sm text-gray-600">
                    形式不正（スキップ）
                    <span className="text-xs text-gray-400 ml-1 block">例: {invalidSamples.join(", ")}</span>
                  </span>
                  <span className="font-bold text-danger shrink-0">{invalidSamples.length}件以上</span>
                </div>
              )}
              {dupCount > 0 && (
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-gray-600">重複（自動除去済み）</span>
                  <span className="font-bold text-gray-500">{dupCount}件</span>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 mb-4 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-danger text-sm">
                <Icons.AlertCircle />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-kon mb-6">
              <Icons.Info />
              <span>
                <strong>{validNumbers.length}件</strong>を国税庁データで検証します
                {rateStatus != null && ` （残り: ${rateStatus.remaining}/${rateStatus.limit}回）`}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setStep("input"); setError(null); }}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Icons.ArrowLeft />
                戻る
              </button>
              <button
                type="button"
                onClick={handleBulk}
                disabled={isLimited}
                className="flex-1 py-3 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Icons.Search />
                {validNumbers.length}件を一括検証する
              </button>
            </div>
          </section>
        )}

        {/* PROCESSING STEP */}
        {step === "processing" && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="font-bold text-gray-800 mb-2">国税庁DBを照会中...</p>
            <p className="text-sm text-gray-500 mb-6">
              バッチ {progress.current}/{progress.total} 処理中（10件ずつ）
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                className="bg-gradient-to-r from-kon to-ai h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${((progress.current || 0) / (progress.total || 1)) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-400">
              {validNumbers.length}件を検証中 / 完了まであと少しお待ちください
            </p>
          </section>
        )}

        {/* RESULTS STEP */}
        {step === "results" && results && summaryStats && (
          <section className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">{summaryStats.total}</div>
                <div className="text-xs text-gray-500 mt-1">総検証件数</div>
              </div>
              <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{summaryStats.valid}</div>
                <div className="text-xs text-green-600 mt-1">🟢 有効</div>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-danger">{summaryStats.expired}</div>
                <div className="text-xs text-danger mt-1">🔴 失効・取消</div>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">{summaryStats.notFound}</div>
                <div className="text-xs text-gray-500 mt-1">⚫ 該当なし</div>
              </div>
            </div>

            {rateLimit && (
              <p className="text-xs text-gray-400 mb-3 text-right">
                本日 {rateLimit.used}/{rateLimit.limit} 回使用済み
              </p>
            )}

            <div className="flex gap-2 mb-4 flex-wrap">
              {(
                [
                  ["all", "全表示"],
                  ["valid", "有効のみ"],
                  ["problems", "問題ありのみ"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filter === key
                      ? "bg-kon text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th
                        className="text-left px-3 py-3 text-xs font-semibold text-gray-500 cursor-pointer hover:bg-gray-100 select-none whitespace-nowrap"
                        onClick={() => handleSort("registratedNumber")}
                        aria-sort={sortKey === "registratedNumber" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                      >
                        登録番号 <span className="text-gray-400">{sortKey === "registratedNumber" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
                      </th>
                      <th
                        className="text-left px-3 py-3 text-xs font-semibold text-gray-500 cursor-pointer hover:bg-gray-100 select-none whitespace-nowrap"
                        onClick={() => handleSort("status")}
                        aria-sort={sortKey === "status" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                      >
                        ステータス <span className="text-gray-400">{sortKey === "status" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
                      </th>
                      <th
                        className="text-left px-3 py-3 text-xs font-semibold text-gray-500 cursor-pointer hover:bg-gray-100 select-none whitespace-nowrap"
                        onClick={() => handleSort("name")}
                        aria-sort={sortKey === "name" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                      >
                        事業者名 <span className="text-gray-400">{sortKey === "name" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
                      </th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">所在地</th>
                      <th
                        className="text-left px-3 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell cursor-pointer hover:bg-gray-100 select-none whitespace-nowrap"
                        onClick={() => handleSort("registrationDate")}
                        aria-sort={sortKey === "registrationDate" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                      >
                        登録年月日 <span className="text-gray-400">{sortKey === "registrationDate" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
                      </th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((r, i) => (
                      <ResultRow key={r.registratedNumber || i} r={r} idx={i} />
                    ))}
                    {filteredResults.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                          該当する結果がありません
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-5">
              <button
                type="button"
                onClick={handleCsvDownload}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icons.Download />
                CSVダウンロード
              </button>
              <button
                type="button"
                onClick={handleCopyClipboard}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icons.Copy />
                {copied ? "コピーしました！" : "クリップボードにコピー（Excel貼付用）"}
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

            <button
              type="button"
              onClick={resetAll}
              className="flex items-center gap-2 text-sm text-kon hover:text-ai font-medium mb-5"
            >
              <Icons.ArrowLeft />
              新しい一括検証を開始
            </button>

            <p className="text-xs text-gray-400 italic leading-relaxed pt-4 border-t border-gray-100">
              このサービスは、国税庁適格請求書発行事業者公表システムのWeb-API機能を利用して取得した情報をもとに作成しているが、サービスの内容は国税庁によって保証されたものではない。
            </p>
          </section>
        )}

        {(step === "input" || step === "confirm") && (
          <div className="bg-gray-50 rounded-xl p-5 mb-6 text-sm">
            <span className="text-gray-600">少数の番号を確認したい場合: </span>
            <Link href="/generator/t-number" className="text-kon hover:text-ai underline">
              インボイス番号検索（1〜10件）→
            </Link>
            <div className="mt-2">
              <Link href="/blog/invoice-tnumber-kakunin-guide" className="text-kon hover:text-ai underline">
                📖 インボイス番号確認の完全ガイド →
              </Link>
            </div>
            <div className="mt-2">
              <Link href="/business/houjin-bangou-lookup" className="text-kon hover:text-ai underline">
                🔢 法人番号検索（13桁で会社情報を確認）→
              </Link>
            </div>
            <div className="mt-2">
              <Link href="/business/houjin-cross-verify" className="text-kon hover:text-ai underline">
                🔍 法人名×T番号 クロス検証（名前と番号の一致を確認）→
              </Link>
            </div>
          </div>
        )}

        {/* Blog callout — invoice guide */}
        <section className="mt-8 print-hide">
          <div className="rounded-2xl border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/30 p-6">
            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
              📖 インボイス番号確認の完全ガイド
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              経過措置(2026-2029)、月次チェック手順、フリーランス向けT番号管理まで完全解説。経理担当者・個人事業主必読。
            </p>
            <a href="/blog/invoice-tnumber-kakunin-guide" className="inline-flex items-center gap-1 font-semibold text-sky-700 dark:text-sky-300 hover:underline">
              ガイドを読む →
            </a>
          </div>
        </section>

        <div className="mt-4 text-center">
          <Link href="/business" className="text-kon hover:text-ai text-sm">
            ← ビジネスツール一覧に戻る
          </Link>
        </div>

        <AdUnit slot="5612038947" format="horizontal" />
      </div>
    </div>
  );
}
