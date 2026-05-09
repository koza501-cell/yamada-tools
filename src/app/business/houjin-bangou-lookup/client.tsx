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
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
};

// Correction 3: KIND_LABELS for 法人種別 display
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

interface HoujinResult {
  corporateNumber?: string;
  process?: string;
  correct?: string;
  updateDate?: string;
  changeDate?: string;
  name?: string;
  furigana?: string;
  kind?: string;
  prefectureName?: string;
  cityName?: string;
  streetNumber?: string;
  prefectureCode?: string;
  cityCode?: string;
  postCode?: string;
  addressOutside?: string;
  closeDate?: string;
  closeCause?: string;
  successorCorporateNumber?: string;
  changeCause?: string;
  assignmentDate?: string;
  latest?: string;
  enName?: string;             // Correction 1: enName (not nameEn)
  enPrefectureName?: string;   // Correction 1: enPrefectureName (not prefectureNameEn)
  enCityName?: string;         // Correction 1: enCityName (not cityNameEn)
  hihyoji?: string;
  sequenceNumber?: string;
  _notFound?: string;
}

interface RateStatus {
  used: number;
  limit: number;
  remaining: number;
  is_limited: boolean;
}

// Correction 2: Status badge based on closeDate, not process code
function getStatusBadge(r: HoujinResult): { label: string; color: string; icon: string } {
  if (r._notFound === "1") return { label: "該当なし", color: "text-gray-500 bg-gray-100", icon: "⚫" };
  if (r.latest === "0") return { label: "変更前履歴", color: "text-yellow-700 bg-yellow-100", icon: "🟡" };
  if (r.closeDate) return { label: "登記閉鎖", color: "text-red-700 bg-red-100", icon: "🔴" };
  return { label: "登記あり", color: "text-green-700 bg-green-100", icon: "🟢" };
}

function formatDate(d?: string): string {
  if (!d) return "";
  const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[1]}年${m[2]}月${m[3]}日`;
  if (d.length === 8) return `${d.slice(0, 4)}年${d.slice(4, 6)}月${d.slice(6, 8)}日`;
  return d;
}

// Correction 4: composeAddress() helper
function composeAddress(r: HoujinResult): string {
  return [r.prefectureName, r.cityName, r.streetNumber].filter(Boolean).join("");
}

function extract13DigitNumbers(text: string): string[] {
  const matches = text.match(/\d{13}/g) || [];
  return [...new Set(matches)];
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

function ResultRow({ r, idx }: { r: HoujinResult; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  const [copiedNum, setCopiedNum] = useState(false);
  const badge = getStatusBadge(r);
  const address = composeAddress(r);

  const handleCopyNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!r.corporateNumber) return;
    navigator.clipboard.writeText(r.corporateNumber).then(() => {
      setCopiedNum(true);
      setTimeout(() => setCopiedNum(false), 1500);
    });
  };

  return (
    <>
      <tr
        className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-3 py-3">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-gray-600 whitespace-nowrap">{r.corporateNumber || "—"}</span>
            {r.corporateNumber && (
              <button type="button" onClick={handleCopyNumber} className="text-gray-300 hover:text-gray-500 transition-colors shrink-0" title="コピー">
                {copiedNum ? <Icons.Check /> : <Icons.Copy />}
              </button>
            )}
          </div>
        </td>
        <td className="px-3 py-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${badge.color}`}>
            {badge.icon} {badge.label}
          </span>
        </td>
        <td className="px-3 py-3 text-sm text-gray-800 max-w-[200px]">
          {r._notFound === "1" ? (
            <span className="text-gray-400">—</span>
          ) : (
            <div>
              <div className="font-medium truncate">{r.name || "—"}</div>
              {r.furigana && <div className="text-xs text-gray-400 truncate">{r.furigana}</div>}
            </div>
          )}
        </td>
        <td className="px-3 py-3 text-xs text-gray-500 max-w-[160px] truncate hidden sm:table-cell">{address || "—"}</td>
        <td className="px-3 py-3 text-xs text-gray-500 hidden md:table-cell whitespace-nowrap">
          {/* Correction 5: assignmentDate, label "法人番号指定日" */}
          {formatDate(r.assignmentDate) || "—"}
        </td>
        <td className="px-3 py-3 text-gray-400">{expanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}</td>
      </tr>
      {expanded && r._notFound !== "1" && (
        <tr className="bg-blue-50/30 border-b border-gray-100">
          <td colSpan={6} className="px-4 py-3">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-xs">
              {r.kind && (
                <div>
                  <dt className="text-gray-400">法人種別</dt>
                  <dd className="text-gray-700 font-medium">{KIND_LABELS[r.kind] ?? r.kind}</dd>
                </div>
              )}
              {r.postCode && (
                <div>
                  <dt className="text-gray-400">郵便番号</dt>
                  <dd className="text-gray-700">{r.postCode}</dd>
                </div>
              )}
              {r.assignmentDate && (
                <div>
                  <dt className="text-gray-400">法人番号指定日</dt>
                  <dd className="text-gray-700">{formatDate(r.assignmentDate)}</dd>
                </div>
              )}
              {r.enName && (
                <div>
                  <dt className="text-gray-400">英語名</dt>
                  <dd className="text-gray-700">{r.enName}</dd>
                </div>
              )}
              {(r.enPrefectureName || r.enCityName) && (
                <div>
                  <dt className="text-gray-400">英語住所</dt>
                  <dd className="text-gray-700">{[r.enCityName, r.enPrefectureName].filter(Boolean).join(", ")}</dd>
                </div>
              )}
              {r.closeDate && (
                <div>
                  <dt className="text-red-400">登記閉鎖年月日</dt>
                  <dd className="text-red-600 font-medium">{formatDate(r.closeDate)}</dd>
                </div>
              )}
              {r.closeCause && (
                <div>
                  <dt className="text-gray-400">閉鎖事由</dt>
                  <dd className="text-gray-700">{r.closeCause}</dd>
                </div>
              )}
              {r.successorCorporateNumber && (
                <div>
                  <dt className="text-gray-400">承継先法人番号</dt>
                  <dd className="text-gray-700 font-mono">{r.successorCorporateNumber}</dd>
                </div>
              )}
              {r.updateDate && (
                <div>
                  <dt className="text-gray-400">最終更新</dt>
                  <dd className="text-gray-700">{formatDate(r.updateDate)}</dd>
                </div>
              )}
            </dl>
          </td>
        </tr>
      )}
    </>
  );
}

function NameResultRow({ r, idx }: { r: HoujinResult; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  const badge = getStatusBadge(r);
  const address = composeAddress(r);

  return (
    <>
      <tr
        className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-3 py-3 font-mono text-xs text-gray-500 whitespace-nowrap hidden sm:table-cell">{r.corporateNumber || "—"}</td>
        <td className="px-3 py-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${badge.color}`}>
            {badge.icon} {badge.label}
          </span>
        </td>
        <td className="px-3 py-3 text-sm font-medium text-gray-800 max-w-[200px]">
          <div className="truncate">{r.name || "—"}</div>
          {r.furigana && <div className="text-xs text-gray-400 truncate">{r.furigana}</div>}
        </td>
        <td className="px-3 py-3 text-xs text-gray-500 hidden md:table-cell max-w-[180px] truncate">{address || "—"}</td>
        <td className="px-3 py-3 text-gray-400">{expanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}</td>
      </tr>
      {expanded && (
        <tr className="bg-blue-50/30 border-b border-gray-100">
          <td colSpan={5} className="px-4 py-3">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-xs">
              <div>
                <dt className="text-gray-400">法人番号</dt>
                <dd className="text-gray-700 font-mono">{r.corporateNumber || "—"}</dd>
              </div>
              {r.kind && (
                <div>
                  <dt className="text-gray-400">法人種別</dt>
                  <dd className="text-gray-700">{KIND_LABELS[r.kind] ?? r.kind}</dd>
                </div>
              )}
              {r.enName && (
                <div>
                  <dt className="text-gray-400">英語名</dt>
                  <dd className="text-gray-700">{r.enName}</dd>
                </div>
              )}
              {r.assignmentDate && (
                <div>
                  <dt className="text-gray-400">法人番号指定日</dt>
                  <dd className="text-gray-700">{formatDate(r.assignmentDate)}</dd>
                </div>
              )}
              {r.closeDate && (
                <div>
                  <dt className="text-red-400">登記閉鎖年月日</dt>
                  <dd className="text-red-600 font-medium">{formatDate(r.closeDate)}</dd>
                </div>
              )}
              {r.postCode && (
                <div>
                  <dt className="text-gray-400">郵便番号</dt>
                  <dd className="text-gray-700">{r.postCode}</dd>
                </div>
              )}
              {r.updateDate && (
                <div>
                  <dt className="text-gray-400">最終更新</dt>
                  <dd className="text-gray-700">{formatDate(r.updateDate)}</dd>
                </div>
              )}
            </dl>
          </td>
        </tr>
      )}
    </>
  );
}

const SAMPLE_NUMBERS = "7000012050002\n4120001105571\n1010001085536";

export default function HoujinBangouLookupClient() {
  const { triggerSuccess } = usePricingContext();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Tab 0: direct input
  const [directInput, setDirectInput] = useState("");
  const [includeHistory, setIncludeHistory] = useState(false);

  // Tab 1: bulk
  const [bulkSubTab, setBulkSubTab] = useState(0); // 0=CSV, 1=paste
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [csvColumns, setCsvColumns] = useState<number[]>([]);
  const [csvColIdx, setCsvColIdx] = useState(0);
  const [csvFileName, setCsvFileName] = useState("");
  const [bulkPasteText, setBulkPasteText] = useState("");
  const [bulkIncludeHistory, setBulkIncludeHistory] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Tab 2: name search
  const [nameInput, setNameInput] = useState("");
  const [nameMode, setNameMode] = useState<"2" | "1">("2");

  // Shared
  const [step, setStep] = useState<"input" | "processing" | "results">("input");
  const [resultsTab, setResultsTab] = useState(0); // which tab produced results
  const [lookupResults, setLookupResults] = useState<HoujinResult[] | null>(null);
  const [nameResults, setNameResults] = useState<HoujinResult[] | null>(null);
  const [rateLimit, setRateLimit] = useState<{ used: number; limit: number; remaining: number } | null>(null);
  const [rateStatus, setRateStatus] = useState<RateStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 1 });
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");
  const [copied, setCopied] = useState(false);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    setMounted(true);
    fetch(`${API_BASE}/api/nta/houjin/rate-status`)
      .then((r) => r.json())
      .then((d: RateStatus) => setRateStatus(d))
      .catch(() => null);
  }, []);

  const isLimited = rateStatus != null && rateStatus.is_limited;

  const updateRateStatus = (rl: { used: number; limit: number; remaining: number }) => {
    setRateLimit(rl);
    setRateStatus((prev) =>
      prev
        ? { ...prev, used: rl.used, remaining: rl.remaining, is_limited: rl.remaining === 0 }
        : null
    );
  };

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
        text = utf8.includes("�") ? new TextDecoder("shift_jis").decode(buffer) : utf8;
      } catch {
        text = new TextDecoder("utf-8").decode(buffer);
      }
      const rows = parseCSVRows(text);
      if (rows.length === 0) return;
      setCsvRows(rows);
      const colCount = Math.max(...rows.map((r) => r.length));
      const numCols: number[] = [];
      for (let c = 0; c < colCount; c++) {
        if (rows.some((row) => /^\d{13}$/.test((row[c] || "").trim()))) numCols.push(c);
      }
      setCsvColumns(numCols);
      setCsvColIdx(numCols[0] ?? 0);
    };
    reader.readAsArrayBuffer(file);
  };

  const getBulkNumbers = (): string[] => {
    if (bulkSubTab === 0) {
      return csvRows.map((row) => (row[csvColIdx] || "").trim()).filter((v) => /^\d{13}$/.test(v));
    }
    return extract13DigitNumbers(bulkPasteText);
  };

  const handleDirectSearch = async () => {
    if (isLimited) return;
    setError(null);
    const raw = directInput
      .split(/[\n\r,\s]+/)
      .map((s) => s.replace(/\D/g, ""))
      .filter((s) => s.length === 13);
    const unique = [...new Set(raw)];
    if (unique.length === 0) {
      setError("13桁の法人番号を入力してください（例: 7000012050002）");
      return;
    }
    if (unique.length > 10) {
      setError(`直接入力は最大10件です（現在: ${unique.length}件）。一括検証タブをご利用ください。`);
      return;
    }
    setResultsTab(0);
    setStep("processing");
    setProgress({ current: 0, total: 1 });
    try {
      const res = await fetch(
        `${API_BASE}/api/nta/houjin/lookup?numbers=${encodeURIComponent(unique.join(","))}&history=${includeHistory ? 1 : 0}`
      );
      if (res.status === 429) {
        const d = await res.json().catch(() => ({}));
        setError((d as { detail?: string }).detail || "本日の検索枠を使い切りました。明日0時にリセットされます。");
        setStep("input");
        return;
      }
      if (!res.ok) throw new Error(`エラー (HTTP ${res.status})`);
      const data = await res.json();
      setLookupResults(data.results);
      updateRateStatus(data.rate_limit);
      if ((data.results as HoujinResult[]).some((r) => r._notFound !== "1")) {
        triggerSuccess("houjin-bangou-lookup");
      }
      setStep("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "検索中にエラーが発生しました");
      setStep("input");
    }
  };

  const handleBulkSearch = async () => {
    if (isLimited) return;
    setError(null);
    const numbers = getBulkNumbers();
    const unique = [...new Set(numbers)];
    if (unique.length === 0) {
      setError("13桁の法人番号が見つかりません");
      return;
    }
    if (unique.length > 100) {
      setError(`最大100件です（現在: ${unique.length}件）`);
      return;
    }
    const totalBatches = Math.ceil(unique.length / 10);
    setResultsTab(1);
    setProgress({ current: 0, total: totalBatches });
    setStep("processing");

    let cur = 0;
    const interval = setInterval(() => {
      cur = Math.min(cur + 1, totalBatches - 1);
      setProgress({ current: cur, total: totalBatches });
    }, 900);

    try {
      const res = await fetch(`${API_BASE}/api/nta/houjin/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers: unique, history: bulkIncludeHistory ? 1 : 0 }),
      });
      clearInterval(interval);
      if (res.status === 429) {
        const d = await res.json().catch(() => ({}));
        setError((d as { detail?: string }).detail || "本日の検索枠を使い切りました。");
        setStep("input");
        return;
      }
      if (!res.ok) throw new Error(`エラー (HTTP ${res.status})`);
      const data = await res.json();
      setProgress({ current: totalBatches, total: totalBatches });
      setLookupResults(data.results);
      updateRateStatus(data.rate_limit);
      if ((data.results as HoujinResult[]).some((r) => r._notFound !== "1")) {
        triggerSuccess("houjin-bangou-lookup");
      }
      setStep("results");
    } catch (e) {
      clearInterval(interval);
      setError(e instanceof Error ? e.message : "検索中にエラーが発生しました");
      setStep("input");
    }
  };

  const handleNameSearch = async () => {
    if (isLimited) return;
    setError(null);
    const name = nameInput.trim();
    if (!name) {
      setError("会社名を入力してください");
      return;
    }
    setResultsTab(2);
    setStep("processing");
    setProgress({ current: 0, total: 1 });
    try {
      const res = await fetch(
        `${API_BASE}/api/nta/houjin/name-search?name=${encodeURIComponent(name)}&mode=${nameMode}`
      );
      if (res.status === 429) {
        const d = await res.json().catch(() => ({}));
        setError((d as { detail?: string }).detail || "本日の検索枠を使い切りました。");
        setStep("input");
        return;
      }
      if (res.status === 400) {
        const d = await res.json().catch(() => ({}));
        setError((d as { detail?: string }).detail || "検索条件を変更してください");
        setStep("input");
        return;
      }
      if (!res.ok) throw new Error(`エラー (HTTP ${res.status})`);
      const data = await res.json();
      setNameResults(data.results);
      updateRateStatus(data.rate_limit);
      if (data.results && (data.results as HoujinResult[]).length > 0) {
        triggerSuccess("houjin-bangou-lookup");
      }
      setStep("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "検索中にエラーが発生しました");
      setStep("input");
    }
  };

  const handleCsvDownload = () => {
    const data = resultsTab === 2 ? nameResults : lookupResults;
    if (!data) return;
    // Correction 5: "法人番号指定日" in CSV header
    const header = "法人番号,ステータス,商号又は名称,カナ,所在地,郵便番号,法人種別,法人番号指定日,登記閉鎖年月日,英語名\n";
    const rows = data
      .map((r) => {
        const s = getStatusBadge(r);
        const esc = (v?: string) => `"${(v || "").replace(/"/g, '""')}"`;
        return [
          r.corporateNumber || "",
          s.label,
          esc(r.name),
          esc(r.furigana),
          esc(composeAddress(r)),
          r.postCode || "",
          KIND_LABELS[r.kind || ""] ?? (r.kind || ""),
          formatDate(r.assignmentDate),
          formatDate(r.closeDate),
          esc(r.enName),
        ].join(",");
      })
      .join("\n");
    const blob = new Blob(["﻿" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "houjin_lookup.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = () => {
    const data = resultsTab === 2 ? nameResults : lookupResults;
    if (!data) return;
    // Correction 5: "法人番号指定日" in clipboard header
    const header = "法人番号\tステータス\t商号又は名称\tカナ\t所在地\t法人番号指定日";
    const rows = data
      .map((r) => {
        const s = getStatusBadge(r);
        return [
          r.corporateNumber || "",
          s.label,
          r.name || "",
          r.furigana || "",
          composeAddress(r),
          formatDate(r.assignmentDate),
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
    setLookupResults(null);
    setNameResults(null);
    setRateLimit(null);
    setFilter("all");
    setSortKey(null);
    setSortDir("asc");
    setError(null);
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

  const getDisplayResults = (): HoujinResult[] => {
    const data = lookupResults ?? [];
    return data
      .filter((r) => {
        if (filter === "active") return !r.closeDate && r._notFound !== "1";
        if (filter === "closed") return !!(r.closeDate || r._notFound === "1");
        return true;
      })
      .sort((a, b) => {
        if (!sortKey) return 0;
        const dir = sortDir === "asc" ? 1 : -1;
        if (sortKey === "status") {
          const order: Record<string, number> = { "登記あり": 0, "変更前履歴": 1, "登記閉鎖": 2, "該当なし": 3 };
          return dir * ((order[getStatusBadge(a).label] ?? 4) - (order[getStatusBadge(b).label] ?? 4));
        }
        if (sortKey === "corporateNumber") {
          return dir * (a.corporateNumber || "").localeCompare(b.corporateNumber || "");
        }
        if (sortKey === "name") {
          return dir * (a.name || "").localeCompare(b.name || "", "ja");
        }
        if (sortKey === "assignmentDate") {
          return dir * (a.assignmentDate || "").localeCompare(b.assignmentDate || "");
        }
        return 0;
      });
  };

  const summaryStats = lookupResults
    ? {
        total: lookupResults.length,
        active: lookupResults.filter((r) => !r.closeDate && r._notFound !== "1" && r.latest !== "0").length,
        closed: lookupResults.filter((r) => !!r.closeDate).length,
        notFound: lookupResults.filter((r) => r._notFound === "1").length,
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
          <div className="text-5xl mb-4">🔢</div>
          <h1 className="text-3xl font-bold text-kon mb-2">法人番号検索・確認ツール</h1>
          <p className="text-gray-600 text-lg">13桁の法人番号から会社情報を国税庁公式データで即時取得</p>
        </header>

        {rateStatus && (
          <div
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg mb-5 ${
              isLimited
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-blue-50 text-blue-700 border border-blue-100"
            }`}
          >
            <Icons.Info />
            {isLimited
              ? "本日の無料検索枠を使い切りました。明日0時にリセットされます。"
              : `本日の検索回数: ${rateStatus.used} / ${rateStatus.limit}回`}
          </div>
        )}

        {/* INPUT STEP */}
        {step === "input" && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
              {["直接入力 (1〜10件)", "一括検証 (〜100件)", "名前で検索"].map((label, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setActiveTab(i); setError(null); }}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === i ? "bg-white shadow-sm text-kon" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tab 0: Direct input */}
            {activeTab === 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  法人番号（1行に1件、最大10件）
                  {directInput.trim() && (
                    <span className="ml-2 text-xs text-gray-400">
                      {directInput.split(/[\n\r,\s]+/).map((s) => s.replace(/\D/g, "")).filter((s) => s.length === 13).length}件入力中
                    </span>
                  )}
                </label>
                <textarea
                  value={directInput}
                  onChange={(e) => setDirectInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) { void handleDirectSearch(); } }}
                  placeholder={"7000012050002\n4120001105571\n（13桁の数字、ハイフンは自動除去）"}
                  rows={5}
                  className="w-full px-4 py-3 font-mono text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">改行・カンマ・スペース区切り対応。重複は自動除去。</p>
                <div className="flex items-center gap-4 mt-3">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeHistory}
                      onChange={(e) => setIncludeHistory(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    変更履歴も含む
                  </label>
                  <button
                    type="button"
                    onClick={() => setDirectInput(SAMPLE_NUMBERS)}
                    className="text-xs text-kon hover:text-ai underline"
                  >
                    サンプルで試す（3件）
                  </button>
                </div>
              </div>
            )}

            {/* Tab 1: Bulk */}
            {activeTab === 1 && (
              <div>
                <div className="flex gap-1 mb-4 bg-gray-50 rounded-lg p-1">
                  {["CSVアップロード", "テキスト貼り付け"].map((label, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setBulkSubTab(i)}
                      className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
                        bulkSubTab === i ? "bg-white shadow-sm text-kon" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {bulkSubTab === 0 && (
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
                      <div className="flex justify-center mb-2 text-gray-400"><Icons.Upload /></div>
                      <p className="text-sm text-gray-500">
                        {csvFileName ? csvFileName : "CSVファイルをドロップ、またはクリックして選択"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">.csv（UTF-8・Shift_JIS対応）最大100件</p>
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
                      <p className="text-sm text-orange-600 mt-3">
                        13桁の法人番号を含む列が見つかりませんでした。テキスト貼り付けをお試しください。
                      </p>
                    )}
                    {csvRows.length > 0 && csvColumns.length > 0 && (
                      <div className="mt-4">
                        {csvColumns.length > 1 && (
                          <div className="mb-3">
                            <label className="text-sm font-medium text-gray-700 block mb-1">法人番号が含まれる列を選択</label>
                            <select
                              value={csvColIdx}
                              onChange={(e) => setCsvColIdx(Number(e.target.value) || 0)}
                              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                            >
                              {csvColumns.map((c) => (
                                <option key={c} value={c}>
                                  列{c + 1}（例: {csvRows.find((row) => /^\d{13}$/.test((row[c] || "").trim()))?.[c] || "—"}）
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        <p className="text-sm text-green-700 font-medium">
                          ✓ {csvRows.filter((row) => /^\d{13}$/.test((row[csvColIdx] || "").trim())).length}件の法人番号を検出
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
                                        j === csvColIdx ? "bg-blue-50 font-medium text-kon" : "text-gray-600"
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

                {bulkSubTab === 1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      法人番号を貼り付け（最大100件）
                      {bulkPasteText && (
                        <span className="ml-2 text-xs text-green-600 font-semibold">
                          ✓ {extract13DigitNumbers(bulkPasteText).length}件検出
                        </span>
                      )}
                    </label>
                    <textarea
                      value={bulkPasteText}
                      onChange={(e) => setBulkPasteText(e.target.value)}
                      placeholder="ExcelやCSVからコピーした内容を貼り付けてください。13桁の数字を自動抽出します。"
                      rows={8}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">13桁の連続した数字を自動検出。他のデータが混在していても問題ありません。</p>
                  </div>
                )}

                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none mt-3">
                  <input
                    type="checkbox"
                    checked={bulkIncludeHistory}
                    onChange={(e) => setBulkIncludeHistory(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  変更履歴も含む
                </label>
              </div>
            )}

            {/* Tab 2: Name search */}
            {activeTab === 2 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">会社名で検索</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { void handleNameSearch(); } }}
                  placeholder="例: トヨタ自動車、ソニー、山田商事"
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
                />
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-sm text-gray-600">検索方式:</span>
                  {(["2", "1"] as const).map((m) => (
                    <label key={m} className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="nameMode"
                        value={m}
                        checked={nameMode === m}
                        onChange={() => setNameMode(m)}
                        className="border-gray-300"
                      />
                      {m === "2" ? "部分一致" : "前方一致"}
                    </label>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                  資本金・従業員数・代表者など詳細情報は →{" "}
                  <Link href="/business/houjin-search" className="text-kon hover:text-ai underline">
                    gBiz法人検索
                  </Link>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                <span className="shrink-0 mt-0.5"><Icons.AlertCircle /></span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                if (activeTab === 0) { void handleDirectSearch(); }
                else if (activeTab === 1) { void handleBulkSearch(); }
                else { void handleNameSearch(); }
              }}
              disabled={isLimited}
              className="w-full mt-6 py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icons.Search />
              {activeTab === 2 ? "名前で検索する" : "法人番号を検索する"}
            </button>
          </section>
        )}

        {/* PROCESSING STEP */}
        {step === "processing" && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="font-bold text-gray-800 mb-2">国税庁DBを照会中...</p>
            {resultsTab === 1 && (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  バッチ {progress.current}/{progress.total} 処理中（10件ずつ）
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className="bg-gradient-to-r from-kon to-ai h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((progress.current || 0) / (progress.total || 1)) * 100}%` }}
                  />
                </div>
              </>
            )}
            <p className="text-xs text-gray-400 mt-2">しばらくお待ちください</p>
          </section>
        )}

        {/* RESULTS STEP */}
        {step === "results" && (
          <section className="mb-6">
            {/* Summary stats for lookup/bulk */}
            {resultsTab !== 2 && lookupResults && summaryStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <div className="text-2xl font-bold text-gray-800">{summaryStats.total}</div>
                  <div className="text-xs text-gray-500 mt-1">総件数</div>
                </div>
                <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">{summaryStats.active}</div>
                  <div className="text-xs text-green-600 mt-1">🟢 登記あり</div>
                </div>
                <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
                  <div className="text-2xl font-bold text-red-700">{summaryStats.closed}</div>
                  <div className="text-xs text-red-600 mt-1">🔴 登記閉鎖</div>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">{summaryStats.notFound}</div>
                  <div className="text-xs text-gray-500 mt-1">⚫ 該当なし</div>
                </div>
              </div>
            )}

            {/* Name search header */}
            {resultsTab === 2 && nameResults && (
              <div className="mb-4">
                <h2 className="font-bold text-gray-800">「{nameInput}」の検索結果: {nameResults.length}件</h2>
              </div>
            )}

            {rateLimit && (
              <p className="text-xs text-gray-400 mb-3 text-right">
                本日 {rateLimit.used}/{rateLimit.limit} 回使用済み
              </p>
            )}

            {/* Filter for lookup/bulk */}
            {resultsTab !== 2 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {([["all", "全表示"], ["active", "登記ありのみ"], ["closed", "閉鎖・該当なし"]] as const).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filter === key ? "bg-kon text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
              <div className="overflow-x-auto">
                {resultsTab === 2 ? (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell whitespace-nowrap">法人番号</th>
                        <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap">ステータス</th>
                        <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500">商号又は名称</th>
                        <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">所在地</th>
                        <th className="w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(nameResults ?? []).map((r, i) => (
                        <NameResultRow key={`${r.corporateNumber ?? ""}-${r.sequenceNumber ?? ""}-${i}`} r={r} idx={i} />
                      ))}
                      {(nameResults ?? []).length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-400 text-sm">
                            結果が見つかりませんでした
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th
                          className="text-left px-3 py-3 text-xs font-semibold text-gray-500 cursor-pointer hover:bg-gray-100 select-none whitespace-nowrap"
                          onClick={() => handleSort("corporateNumber")}
                        >
                          法人番号 <span className="text-gray-400">{sortKey === "corporateNumber" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
                        </th>
                        <th
                          className="text-left px-3 py-3 text-xs font-semibold text-gray-500 cursor-pointer hover:bg-gray-100 select-none whitespace-nowrap"
                          onClick={() => handleSort("status")}
                        >
                          ステータス <span className="text-gray-400">{sortKey === "status" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
                        </th>
                        <th
                          className="text-left px-3 py-3 text-xs font-semibold text-gray-500 cursor-pointer hover:bg-gray-100 select-none whitespace-nowrap"
                          onClick={() => handleSort("name")}
                        >
                          商号又は名称 <span className="text-gray-400">{sortKey === "name" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
                        </th>
                        <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">所在地</th>
                        <th
                          className="text-left px-3 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell cursor-pointer hover:bg-gray-100 select-none whitespace-nowrap"
                          onClick={() => handleSort("assignmentDate")}
                        >
                          法人番号指定日 <span className="text-gray-400">{sortKey === "assignmentDate" ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
                        </th>
                        <th className="w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {getDisplayResults().map((r, i) => (
                        <ResultRow
                          key={`${r.corporateNumber ?? ""}-${r.sequenceNumber ?? ""}-${i}`}
                          r={r}
                          idx={i}
                        />
                      ))}
                      {getDisplayResults().length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                            該当する結果がありません
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
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
              新しい検索を開始
            </button>

          </section>
        )}

        {step === "input" && (
          <div className="bg-gray-50 rounded-xl p-5 mb-6 text-sm space-y-2">
            <div>
              <span className="text-gray-600">インボイス番号（T番号）の確認は → </span>
              <Link href="/generator/t-number" className="text-kon hover:text-ai underline">インボイス番号検索</Link>
            </div>
            <div>
              <span className="text-gray-600">gBizINFO法人検索（社名・詳細情報）は → </span>
              <Link href="/business/houjin-search" className="text-kon hover:text-ai underline">法人検索 (gBizINFO)</Link>
            </div>
            <div>
              <span className="text-gray-600">法人番号の仕組みや活用方法は → </span>
              <Link href="/blog/houjin-bangou-complete-guide" className="text-kon hover:text-ai underline">📖 法人番号の完全ガイド</Link>
            </div>
            <div>
              <span className="text-gray-600">会社名と法人番号が一致するか確認したい場合は → </span>
              <Link href="/business/houjin-cross-verify" className="text-kon hover:text-ai underline">🔍 法人名×番号 クロス検証</Link>
            </div>
          </div>
        )}

        {/* Legal notice — always visible */}
        <p className="text-xs text-gray-400 italic leading-relaxed pt-4 border-t border-gray-100 mt-6">
          このサービスは、国税庁法人番号システムのWeb-API機能を利用して取得した情報をもとに作成しているが、サービスの内容は国税庁によって保証されたものではない。
        </p>

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
