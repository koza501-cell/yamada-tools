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
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
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
  Table: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
  ),
  Cards: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
  ),
};

interface HoujinData {
  corporateNumber?: string;
  name?: string;
  furigana?: string;
  enName?: string;
  kind?: string;
  prefectureName?: string;
  cityName?: string;
  streetNumber?: string;
  postCode?: string;
  assignmentDate?: string;
  closeDate?: string;
  process?: string;
}

interface InvoiceData {
  registered: boolean;
  name?: string;
  process?: string;
  registrationDate?: string;
  disposalDate?: string;
  expireDate?: string;
  is_active?: boolean;
}

interface VerifyResult {
  input_name: string;
  input_number: string;
  detected_type?: string;
  detected_houjin_bangou?: string;
  detected_tnumber?: string;
  detection_note?: string;
  match_status: string;
  match_score: number;
  advice: string;
  registered_name?: string;
  houjin_data?: HoujinData | null;
  invoice_data?: InvoiceData | null;
}

interface RateStatus {
  used: number;
  limit: number;
  remaining: number;
  is_limited: boolean;
  reset_at_jst: string;
}

interface BulkSummary {
  total: number;
  exact: number;
  match: number;
  similar: number;
  mismatch: number;
  closed: number;
  not_found: number;
  invalid: number;
}

type SortKey = "idx" | "name" | "status" | "score" | "regname";
type FilterKey = "all" | "match" | "problems" | "notfound";

const KIND_LABELS: Record<string, string> = {
  "101": "国",
  "201": "地方公共団体",
  "301": "株式会社",
  "302": "有限会社",
  "303": "合名会社",
  "304": "合資会社",
  "305": "合同会社",
  "399": "その他の設立登記法人",
  "401": "外国会社等",
  "499": "その他",
};

function getMatchBadge(status: string, score: number) {
  const pct = ((score || 0) * 100).toFixed(1);
  switch (status) {
    case "exact":
      return { label: "完全一致", emoji: "✅", bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-800 dark:text-green-200", border: "border-green-300 dark:border-green-700", desc: "スコア: 100%" };
    case "match":
      return { label: "一致", emoji: "✅", bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-800 dark:text-green-200", border: "border-green-300 dark:border-green-700", desc: `スコア: ${pct}%（正規化後）` };
    case "similar":
      return { label: "類似（要確認）", emoji: "⚠️", bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-800 dark:text-yellow-200", border: "border-yellow-300 dark:border-yellow-700", desc: `スコア: ${pct}%` };
    case "mismatch":
      return { label: "不一致", emoji: "❌", bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-800 dark:text-red-200", border: "border-red-300 dark:border-red-700", desc: `スコア: ${pct}%` };
    case "closed":
      return { label: "登記閉鎖", emoji: "🔴", bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-800 dark:text-red-200", border: "border-red-300 dark:border-red-700", desc: "登記閉鎖" };
    case "not_found":
      return { label: "該当なし", emoji: "⚫", bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", border: "border-gray-300 dark:border-gray-600", desc: "番号が見つかりません" };
    default:
      return { label: status, emoji: "⚫", bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", border: "border-gray-300 dark:border-gray-600", desc: "" };
  }
}

function getAdviceStyle(status: string): string {
  if (status === "exact" || status === "match") return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200";
  if (status === "similar") return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200";
  if (status === "mismatch" || status === "closed") return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200";
  return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300";
}

function formatDate(d?: string): string {
  if (!d) return "";
  const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[1]}年${m[2]}月${m[3]}日`;
  if (d.length === 8) return `${d.slice(0, 4)}年${d.slice(4, 6)}月${d.slice(6, 8)}日`;
  return d;
}

function composeAddress(h: HoujinData): string {
  return [h.prefectureName, h.cityName, h.streetNumber].filter(Boolean).join("");
}

function getInvoiceStatus(inv: InvoiceData): { label: string; color: string; emoji: string } {
  if (!inv.registered) return { label: "インボイス未登録", color: "text-gray-500 dark:text-gray-400", emoji: "⚫" };
  if (!inv.is_active) return { label: "インボイス登録 — 失効/取消", color: "text-red-600 dark:text-red-400", emoji: "🔴" };
  return { label: "インボイス登録 — 有効", color: "text-green-600 dark:text-green-400", emoji: "🟢" };
}

function parseCSVRows(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  return lines.map((line) => {
    const cells: string[] = [];
    let inQuote = false;
    let cell = "";
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; }
      else if ((ch === "," || ch === "\t") && !inQuote) { cells.push(cell.trim()); cell = ""; }
      else { cell += ch; }
    }
    cells.push(cell.trim());
    return cells;
  });
}

function parseBulkText(text: string): Array<{ name: string; number: string }> {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  return lines.map((line) => {
    const sep = line.includes("\t") ? "\t" : ",";
    const sepIdx = line.indexOf(sep);
    if (sepIdx < 0) return { name: line.trim(), number: "" };
    return { name: line.slice(0, sepIdx).trim(), number: line.slice(sepIdx + 1).trim() };
  }).filter((p) => p.name || p.number);
}

function detectPairColumns(rows: string[][]): { nameCol: number; numCol: number } {
  if (rows.length === 0) return { nameCol: 0, numCol: 1 };
  const colCount = Math.max(...rows.map((row) => row.length));
  for (let c = 0; c < colCount; c++) {
    const vals = rows.map((row) => (row[c] || "").trim().replace(/^[Tt]/, ""));
    const numericCount = vals.filter((v) => /^\d{12,13}$/.test(v)).length;
    if (numericCount >= rows.length * 0.5) {
      return { nameCol: c === 0 ? 1 : 0, numCol: c };
    }
  }
  return { nameCol: 0, numCol: 1 };
}

const NTA_NOTICE = "このサービスは、国税庁の法人番号システムおよび適格請求書発行事業者公表システムのWeb-API機能を利用して取得した情報をもとに作成しているが、サービスの内容は国税庁によって保証されたものではない。";

function ResultCard({ result, idx }: { result: VerifyResult; idx: number }) {
  const [expanded, setExpanded] = useState(true);
  const badge = getMatchBadge(result.match_status, result.match_score);
  const adviceStyle = getAdviceStyle(result.match_status);
  const h = result.houjin_data;
  const inv = result.invoice_data;

  return (
    <div className={`border rounded-xl overflow-hidden ${badge.border}`}>
      <button
        type="button"
        className={`w-full flex items-center justify-between p-4 cursor-pointer text-left ${badge.bg}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{badge.emoji}</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-bold text-sm px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>{badge.label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{badge.desc}</span>
            </div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1 text-left">
              {idx + 1}. {result.input_name} / <span className="font-mono">{result.input_number}</span>
            </div>
          </div>
        </div>
        <span className="text-gray-400 flex-shrink-0 ml-2">
          {expanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
        </span>
      </button>

      {expanded && (
        <div className="p-4 bg-white dark:bg-gray-900 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">入力した会社名</p>
              <p className="font-medium text-gray-900 dark:text-white break-all">{result.input_name}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">国税庁登録名</p>
              <p className="font-medium text-gray-900 dark:text-white break-all">{result.registered_name || "—"}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">入力番号</p>
              <p className="font-mono text-sm text-gray-900 dark:text-white">{result.input_number}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">法人番号 / T番号</p>
              <p className="font-mono text-sm text-gray-900 dark:text-white">
                {result.detected_houjin_bangou || "—"}
                {result.detected_tnumber && (
                  <span className="text-gray-400 dark:text-gray-500 ml-2 text-xs">({result.detected_tnumber})</span>
                )}
              </p>
            </div>
          </div>

          {result.detection_note && (
            <div className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
              <span className="flex-shrink-0 mt-0.5"><Icons.Info /></span>
              <span>{result.detection_note}</span>
            </div>
          )}

          {result.advice && (
            <div className={`border rounded-lg p-3 text-sm ${adviceStyle}`}>
              <span className="font-semibold">アドバイス:</span> {result.advice}
            </div>
          )}

          {h && h.name && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">法人情報（国税庁公式データ）</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                {h.furigana && (
                  <div><span className="text-gray-500 dark:text-gray-400">フリガナ: </span><span className="text-gray-900 dark:text-white">{h.furigana}</span></div>
                )}
                {h.enName && (
                  <div><span className="text-gray-500 dark:text-gray-400">英語名: </span><span className="text-gray-900 dark:text-white">{h.enName}</span></div>
                )}
                {h.kind && (
                  <div><span className="text-gray-500 dark:text-gray-400">法人種別: </span><span className="text-gray-900 dark:text-white">{KIND_LABELS[h.kind] || h.kind}</span></div>
                )}
                {(h.prefectureName || h.cityName || h.streetNumber) && (
                  <div className="sm:col-span-2"><span className="text-gray-500 dark:text-gray-400">所在地: </span><span className="text-gray-900 dark:text-white">{composeAddress(h)}</span></div>
                )}
                {h.assignmentDate && (
                  <div><span className="text-gray-500 dark:text-gray-400">法人番号指定日: </span><span className="text-gray-900 dark:text-white">{formatDate(h.assignmentDate)}</span></div>
                )}
                {h.closeDate && (
                  <div className="sm:col-span-2"><span className="text-red-500 dark:text-red-400">登記閉鎖日: </span><span className="text-red-700 dark:text-red-300 font-semibold">{formatDate(h.closeDate)}</span></div>
                )}
              </div>
            </div>
          )}

          {inv && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">インボイス登録状況</p>
              {(() => {
                const st = getInvoiceStatus(inv);
                return (
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <span>{st.emoji}</span>
                    <span className={`font-medium ${st.color}`}>{st.label}</span>
                    {inv.registrationDate && (
                      <span className="text-gray-400 dark:text-gray-500 text-xs">（登録日: {formatDate(inv.registrationDate)}）</span>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HoujinCrossVerifyClient() {
  const [tab, setTab] = useState<"single" | "bulk">("single");

  const [singleName, setSingleName] = useState("");
  const [singleNumber, setSingleNumber] = useState("");
  const [singleResult, setSingleResult] = useState<VerifyResult | null>(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState("");

  const [bulkSubMode, setBulkSubMode] = useState<"text" | "csv">("text");
  const [bulkText, setBulkText] = useState("");
  const [csvFileName, setCsvFileName] = useState("");
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [csvNameCol, setCsvNameCol] = useState(0);
  const [csvNumCol, setCsvNumCol] = useState(1);
  const [bulkResults, setBulkResults] = useState<VerifyResult[]>([]);
  const [bulkSummary, setBulkSummary] = useState<BulkSummary | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState("");

  const [rateStatus, setRateStatus] = useState<RateStatus | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [sortKey, setSortKey] = useState<SortKey>("idx");
  const [sortAsc, setSortAsc] = useState(true);
  const [copied, setCopied] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const { triggerSuccess } = usePricingContext();

  useEffect(() => {
    fetch(`${API_BASE}/api/nta/cross-verify/rate-status`)
      .then((r) => r.json())
      .then((d: RateStatus) => setRateStatus(d))
      .catch(() => null);
  }, []);

  const isRateLimited = rateStatus != null && rateStatus.is_limited;

  const handleSingleVerify = async () => {
    if (!singleName.trim()) { setSingleError("会社名を入力してください。"); return; }
    if (!singleNumber.trim()) { setSingleError("番号を入力してください。"); return; }
    setSingleError("");
    setSingleLoading(true);
    setSingleResult(null);
    try {
      const resp = await fetch(`${API_BASE}/api/nta/cross-verify/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: singleName.trim(), number: singleNumber.trim() }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ detail: resp.statusText }));
        setSingleError(err.detail || "エラーが発生しました。");
        return;
      }
      const data = await resp.json();
      setSingleResult(data.result);
      if (data.rate_limit) setRateStatus(data.rate_limit);
      if (data.result?.match_status === "match" || data.result?.match_status === "exact") {
        triggerSuccess("houjin-cross-verify");
      }
    } catch {
      setSingleError("通信エラーが発生しました。しばらく後でお試しください。");
    } finally {
      setSingleLoading(false);
    }
  };

  const handleCsvUpload = (file: File) => {
    setCsvFileName(file.name);
    setCsvRows([]);
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      let text = "";
      try {
        const utf8 = new TextDecoder("utf-8").decode(buffer);
        text = utf8.includes("�") ? new TextDecoder("shift_jis").decode(buffer) : utf8;
      } catch {
        text = new TextDecoder("utf-8").decode(buffer);
      }
      const rows = parseCSVRows(text);
      setCsvRows(rows);
      const { nameCol, numCol } = detectPairColumns(rows);
      setCsvNameCol(nameCol);
      setCsvNumCol(numCol);
    };
    reader.readAsArrayBuffer(file);
  };

  const getBulkPairs = () => {
    if (bulkSubMode === "text") return parseBulkText(bulkText);
    return csvRows
      .map((row) => ({ name: (row[csvNameCol] || "").trim(), number: (row[csvNumCol] || "").trim() }))
      .filter((p) => p.name || p.number);
  };

  const handleBulkVerify = async () => {
    const pairs = getBulkPairs();
    if (pairs.length === 0) { setBulkError("検証するデータを入力してください。"); return; }
    if (pairs.length > 50) { setBulkError("1回の一括検証は最大50件です。"); return; }
    setBulkError("");
    setBulkLoading(true);
    setBulkResults([]);
    setBulkSummary(null);
    try {
      const resp = await fetch(`${API_BASE}/api/nta/cross-verify/verify-bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pairs }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ detail: resp.statusText }));
        setBulkError(err.detail || "エラーが発生しました。");
        return;
      }
      const data = await resp.json();
      setBulkResults(data.results || []);
      setBulkSummary(data.summary || null);
      if (data.rate_limit) setRateStatus(data.rate_limit);
      triggerSuccess("houjin-cross-verify");
    } catch {
      setBulkError("通信エラーが発生しました。しばらく後でお試しください。");
    } finally {
      setBulkLoading(false);
    }
  };

  const getFilteredSorted = () => {
    let results = [...bulkResults];
    if (filter === "match") {
      results = results.filter((r) => r.match_status === "exact" || r.match_status === "match");
    } else if (filter === "problems") {
      results = results.filter((r) => r.match_status === "similar" || r.match_status === "mismatch" || r.match_status === "closed");
    } else if (filter === "notfound") {
      results = results.filter((r) => ["not_found", "invalid_number", "invalid_input", "error"].includes(r.match_status));
    }
    if (sortKey === "score") {
      results.sort((a, b) => sortAsc ? (a.match_score || 0) - (b.match_score || 0) : (b.match_score || 0) - (a.match_score || 0));
    } else if (sortKey === "status") {
      results.sort((a, b) => sortAsc ? a.match_status.localeCompare(b.match_status) : b.match_status.localeCompare(a.match_status));
    } else if (sortKey === "name") {
      results.sort((a, b) => sortAsc ? a.input_name.localeCompare(b.input_name, "ja") : b.input_name.localeCompare(a.input_name, "ja"));
    } else if (sortKey === "regname") {
      results.sort((a, b) => {
        const an = a.registered_name || "";
        const bn = b.registered_name || "";
        return sortAsc ? an.localeCompare(bn, "ja") : bn.localeCompare(an, "ja");
      });
    }
    return results;
  };

  const handleCopy = () => {
    const header = ["入力名", "入力番号", "ステータス", "スコア", "登録名", "アドバイス"].join("\t");
    const lines = bulkResults.map((r) =>
      [
        r.input_name,
        r.input_number,
        r.match_status,
        ((r.match_score || 0) * 100).toFixed(1) + "%",
        r.registered_name || "",
        r.advice || "",
      ].join("\t")
    );
    navigator.clipboard.writeText([header, ...lines].join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleDownloadCSV = () => {
    const BOM = "﻿";
    const header = ["入力名", "入力番号", "ステータス", "スコア(%)", "登録名", "法人番号", "T番号", "アドバイス"].join(",");
    const lines = bulkResults.map((r) =>
      [
        `"${(r.input_name || "").replace(/"/g, '""')}"`,
        `"${(r.input_number || "").replace(/"/g, '""')}"`,
        `"${(r.match_status || "").replace(/"/g, '""')}"`,
        `"${((r.match_score || 0) * 100).toFixed(1)}"`,
        `"${(r.registered_name || "").replace(/"/g, '""')}"`,
        `"${(r.detected_houjin_bangou || "").replace(/"/g, '""')}"`,
        `"${(r.detected_tnumber || "").replace(/"/g, '""')}"`,
        `"${(r.advice || "").replace(/"/g, '""')}"`,
      ].join(",")
    );
    const csv = BOM + [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cross-verify-results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSortClick = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const textPairs = parseBulkText(bulkText);
  const csvMaxCols = csvRows.length > 0 ? Math.max(1, Math.max(...csvRows.map((r) => r.length))) : 2;
  const csvPreviewRows = csvRows.slice(0, 10);
  const validBulkCount = bulkSubMode === "text"
    ? textPairs.filter((p) => p.name && p.number).length
    : csvRows.filter((r) => (r[csvNameCol] || "").trim() && (r[csvNumCol] || "").trim()).length;
  const totalBulkCount = bulkSubMode === "text" ? textPairs.length : csvRows.length;
  const filteredResults = getFilteredSorted();

  const tableColumns: Array<{ key: SortKey; label: string }> = [
    { key: "idx", label: "#" },
    { key: "name", label: "入力名" },
    { key: "status", label: "ステータス" },
    { key: "score", label: "スコア" },
    { key: "regname", label: "登録名" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-kon to-ai text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">法人名×法人番号 クロス検証ツール</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            会社名と法人番号が一致するか、国税庁公式データで照合。<br className="hidden md:block" />
            6段階で判定。経理・法務・KYC業務に。完全無料・登録不要。
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {rateStatus && (
          <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm border ${
            isRateLimited
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300"
              : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300"
          }`}>
            <Icons.Info />
            {isRateLimited
              ? `本日の無料検索枠（${rateStatus.limit}回）を使い切りました。${rateStatus.reset_at_jst}にリセットされます。`
              : `本日のクロス検証回数: ${rateStatus.used} / ${rateStatus.limit}回（残り${rateStatus.remaining}回）`
            }
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">{NTA_NOTICE}</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("single")}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors ${
              tab === "single"
                ? "bg-ai text-white shadow"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            個別検証
          </button>
          <button
            type="button"
            onClick={() => setTab("bulk")}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors ${
              tab === "bulk"
                ? "bg-ai text-white shadow"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            一括検証（最大50件）
          </button>
        </div>

        {tab === "single" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  会社名
                </label>
                <input
                  type="text"
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  maxLength={200}
                  placeholder="例: 株式会社山田商事"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  法人番号 / T番号 / 12桁番号
                </label>
                <input
                  type="text"
                  value={singleNumber}
                  onChange={(e) => setSingleNumber(e.target.value)}
                  placeholder="例: 7000012050002"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ai"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">13桁の数字、T+13桁、12桁の会社法人等番号のいずれか</p>
              </div>
            </div>

            {singleError && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <Icons.AlertCircle />
                <span>{singleError}</span>
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => { setSingleName("国税庁"); setSingleNumber("7000012050002"); }}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                サンプルで試す
              </button>
              <button
                type="button"
                onClick={handleSingleVerify}
                disabled={singleLoading || isRateLimited}
                className="flex items-center gap-2 px-6 py-2 bg-ai text-white rounded-lg font-medium text-sm hover:bg-kon transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icons.Search />
                {singleLoading ? "検証中..." : "クロス検証する"}
              </button>
            </div>

            {singleResult && (
              <div className="mt-4">
                <ResultCard result={singleResult} idx={0} />
              </div>
            )}
          </div>
        )}

        {tab === "bulk" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBulkSubMode("text")}
                  className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                    bulkSubMode === "text"
                      ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  直接入力
                </button>
                <button
                  type="button"
                  onClick={() => setBulkSubMode("csv")}
                  className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                    bulkSubMode === "csv"
                      ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  CSVアップロード
                </button>
              </div>

              {bulkSubMode === "text" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    会社名,番号 を1行に1件（カンマまたはタブ区切り、最大50件）
                  </label>
                  <textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    rows={8}
                    placeholder={"国税庁,7000012050002\n株式会社サンプル,T1234567890123\n合同会社例,123456789012"}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-mono bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ai resize-y"
                  />
                  {bulkText.trim() && (
                    <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                      {validBulkCount}件の検証準備完了
                      {totalBulkCount - validBulkCount > 0 && ` / ${totalBulkCount - validBulkCount}件は名前または番号が未入力`}
                    </p>
                  )}
                </div>
              )}

              {bulkSubMode === "csv" && (
                <div className="space-y-3">
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-ai transition-colors"
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) handleCsvUpload(file);
                    }}
                  >
                    <div className="flex justify-center text-gray-400 dark:text-gray-500 mb-2">
                      <Icons.Upload />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      クリックまたはドラッグ＆ドロップでCSVをアップロード
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">.csv（UTF-8・Shift_JIS対応）</p>
                    {csvFileName && <p className="text-xs text-ai mt-2 font-medium">{csvFileName}</p>}
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

                  {csvRows.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 flex-wrap text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <span>会社名列:</span>
                          <select
                            value={csvNameCol}
                            onChange={(e) => setCsvNameCol(Number(e.target.value) || 0)}
                            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            {Array.from({ length: csvMaxCols }, (_, i) => (
                              <option key={i} value={i}>列 {i + 1}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>番号列:</span>
                          <select
                            value={csvNumCol}
                            onChange={(e) => setCsvNumCol(Number(e.target.value) || 0)}
                            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            {Array.from({ length: csvMaxCols }, (_, i) => (
                              <option key={i} value={i}>列 {i + 1}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="text-xs border-collapse w-full">
                          <thead>
                            <tr>
                              <th className="border-b border-gray-200 dark:border-gray-700 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-left text-gray-500 dark:text-gray-400">#</th>
                              {(csvRows[0] || []).map((_, ci) => (
                                <th
                                  key={ci}
                                  className={`border-b border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-gray-500 dark:text-gray-400 ${
                                    ci === csvNameCol ? "bg-blue-100 dark:bg-blue-900/30" : ci === csvNumCol ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"
                                  }`}
                                >
                                  列{ci + 1}{ci === csvNameCol ? "（名前）" : ci === csvNumCol ? "（番号）" : ""}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {csvPreviewRows.map((row, ri) => (
                              <tr key={ri} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                                <td className="px-3 py-1.5 text-gray-400 dark:text-gray-500">{ri + 1}</td>
                                {row.map((cell, ci) => (
                                  <td
                                    key={ci}
                                    className={`px-3 py-1.5 text-gray-900 dark:text-white ${
                                      ci === csvNameCol ? "bg-blue-50 dark:bg-blue-900/10" : ci === csvNumCol ? "bg-green-50 dark:bg-green-900/10" : ""
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {csvRows.length > 10 && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">先頭10件を表示 / 全{csvRows.length}件</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">{validBulkCount}件の検証準備完了</p>
                    </div>
                  )}
                </div>
              )}

              {bulkError && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <Icons.AlertCircle />
                  <span>{bulkError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleBulkVerify}
                disabled={bulkLoading || isRateLimited || validBulkCount === 0}
                className="flex items-center gap-2 px-6 py-2 bg-ai text-white rounded-lg font-medium text-sm hover:bg-kon transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icons.Search />
                {bulkLoading ? "検証中..." : `クロス検証を実行する（${validBulkCount}件）`}
              </button>
            </div>

            {bulkResults.length > 0 && (
              <div className="space-y-4">
                {bulkSummary && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">検証結果サマリー</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{bulkSummary.total || 0}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">総検証件数</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">{(bulkSummary.exact || 0) + (bulkSummary.match || 0)}</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">✅ 一致</p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                        <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{bulkSummary.similar || 0}</p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">⚠️ 類似（要確認）</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                        <p className="text-2xl font-bold text-red-700 dark:text-red-300">{(bulkSummary.mismatch || 0) + (bulkSummary.closed || 0)}</p>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">❌ 不一致・閉鎖</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">{bulkSummary.not_found || 0}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">⚫ 該当なし</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">{bulkSummary.invalid || 0}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">エラー・形式不正</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800">
                    <Icons.Copy />
                    {copied ? "コピーしました！" : "結果をコピー（Excel用）"}
                  </button>
                  <button type="button" onClick={handleDownloadCSV} className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800">
                    <Icons.Download />
                    CSVダウンロード
                  </button>
                  <button type="button" onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800">
                    <Icons.Print />
                    印刷・PDF保存
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
                    className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 ml-auto"
                  >
                    {viewMode === "card" ? <Icons.Table /> : <Icons.Cards />}
                    {viewMode === "card" ? "テーブル表示" : "カード表示"}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {([
                    { key: "all" as FilterKey, label: "全表示" },
                    { key: "match" as FilterKey, label: "一致のみ" },
                    { key: "problems" as FilterKey, label: "不一致・要確認" },
                    { key: "notfound" as FilterKey, label: "該当なし" },
                  ]).map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setFilter(f.key)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        filter === f.key
                          ? "bg-ai text-white"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {viewMode === "card" && (
                  <div className="space-y-3">
                    {filteredResults.map((r, i) => (
                      <ResultCard key={i} result={r} idx={bulkResults.indexOf(r)} />
                    ))}
                    {filteredResults.length === 0 && (
                      <p className="text-center text-gray-400 dark:text-gray-500 py-8">該当する結果がありません</p>
                    )}
                  </div>
                )}

                {viewMode === "table" && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          {tableColumns.map((col) => (
                            <th
                              key={col.key}
                              onClick={() => handleSortClick(col.key)}
                              className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide cursor-pointer hover:text-ai select-none whitespace-nowrap"
                            >
                              {col.label}
                              {sortKey === col.key && (sortAsc ? " ↑" : " ↓")}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResults.map((r, i) => {
                          const badge = getMatchBadge(r.match_status, r.match_score);
                          return (
                            <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 last:border-0">
                              <td className="px-4 py-3 text-gray-400 dark:text-gray-500 text-xs">{bulkResults.indexOf(r) + 1}</td>
                              <td className="px-4 py-3 text-gray-900 dark:text-white max-w-[160px] truncate">{r.input_name}</td>
                              <td className="px-4 py-3">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.bg} ${badge.text}`}>
                                  {badge.emoji} {badge.label}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-700 dark:text-gray-300 tabular-nums">
                                {((r.match_score || 0) * 100).toFixed(1)}%
                              </td>
                              <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[160px] truncate">
                                {r.registered_name || "—"}
                              </td>
                            </tr>
                          );
                        })}
                        {filteredResults.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                              該当する結果がありません
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <AdUnit slot="5612038947" format="horizontal" />

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">関連ツール</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">法人番号から会社情報を取得するには → </span>
              <Link href="/business/houjin-bangou-lookup" className="text-kon hover:text-ai underline">法人番号検索ツール</Link>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">会社名から法人を検索するには → </span>
              <Link href="/business/houjin-search" className="text-kon hover:text-ai underline">法人検索 (gBizINFO)</Link>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">インボイス番号（T番号）を検索するには → </span>
              <Link href="/generator/t-number" className="text-kon hover:text-ai underline">インボイス番号検索</Link>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">インボイス番号の一括チェックは → </span>
              <Link href="/business/invoice-bulk-checker" className="text-kon hover:text-ai underline">インボイス一括チェッカー</Link>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">請求書の作成は → </span>
              <Link href="/document/invoice" className="text-kon hover:text-ai underline">請求書作成ツール</Link>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">法人番号の仕組みを学ぶ → </span>
              <Link href="/blog/houjin-bangou-complete-guide" className="text-kon hover:text-ai underline">📖 法人番号の完全ガイド</Link>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">取引先KYCの実務手順を学ぶ → </span>
              <Link href="/blog/torihikisaki-kyc-cross-verify-guide" className="text-kon hover:text-ai underline">📖 取引先KYC完全ガイド</Link>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">{NTA_NOTICE}</p>
        </div>
      </div>
    </div>
  );
}
