"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FAQS } from "./faqs";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

// ─── Types ───────────────────────────────────────────────────────────────────

type BankItem = { code: string; name_jp: string; name_en: string; kana: string; swift_code?: string | null };
type BranchItem = { code: string; name_jp: string; name_en: string; kana: string };
type LookupResult = {
  bank: BankItem;
  branch: BranchItem;
  full_label_en: string;
  full_label_jp: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TOP_BANKS: { code: string; name_en: string; name_jp: string }[] = [
  { code: "0001", name_en: "Mizuho Bank", name_jp: "みずほ銀行" },
  { code: "0005", name_en: "MUFG Bank", name_jp: "三菱ＵＦＪ銀行" },
  { code: "0009", name_en: "SMBC", name_jp: "三井住友銀行" },
  { code: "0010", name_en: "Resona Bank", name_jp: "りそな銀行" },
  { code: "0017", name_en: "Saitama Resona Bank", name_jp: "埼玉りそな銀行" },
  { code: "0033", name_en: "Citibank Japan", name_jp: "シティバンク銀行" },
  { code: "0036", name_en: "Rakuten Bank", name_jp: "楽天銀行" },
  { code: "0038", name_en: "SBI Sumishin Net Bank", name_jp: "住信ＳＢＩネット銀行" },
  { code: "0040", name_en: "PayPay Bank", name_jp: "PayPay銀行" },
  { code: "0116", name_en: "Hokkaido Bank", name_jp: "北海道銀行" },
  { code: "0117", name_en: "Aomori Bank", name_jp: "青森銀行" },
  { code: "0157", name_en: "Joyo Bank", name_jp: "常陽銀行" },
  { code: "0183", name_en: "Chiba Bank", name_jp: "千葉銀行" },
  { code: "0288", name_en: "Mitsubishi UFJ Trust", name_jp: "三菱ＵＦＪ信託銀行" },
  { code: "0289", name_en: "Mizuho Trust & Banking", name_jp: "みずほ信託銀行" },
  { code: "0294", name_en: "Sumitomo Mitsui Trust", name_jp: "三井住友信託銀行" },
  { code: "0310", name_en: "Shizuoka Bank", name_jp: "静岡銀行" },
  { code: "0349", name_en: "Bank of Kyoto", name_jp: "京都銀行" },
  { code: "0393", name_en: "Fukuoka Bank", name_jp: "福岡銀行" },
  { code: "9900", name_en: "Japan Post Bank", name_jp: "ゆうちょ銀行" },
];

const SAMPLE_SEARCHES = ["MUFG", "Mizuho", "SMBC", "Resona", "Japan Post Bank"];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <button type="button"
      onClick={copy}
      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded transition-colors"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function LookupResultCard({ result }: { result: LookupResult }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {result.bank.name_en}
        <span className="text-gray-400 dark:text-gray-500 font-normal mx-2">—</span>
        {result.branch.name_en}
      </h3>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Bank</p>
          <p className="font-semibold text-gray-900 dark:text-white">{result.bank.name_en}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{result.bank.name_jp}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-mono text-lg font-bold text-kon dark:text-sakura">{result.bank.code}</span>
            <CopyButton text={result.bank.code} />
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Branch</p>
          <p className="font-semibold text-gray-900 dark:text-white">{result.branch.name_en}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{result.branch.name_jp}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-mono text-lg font-bold text-kon dark:text-sakura">{result.branch.code}</span>
            <CopyButton text={result.branch.code} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
        <span className="text-sm text-blue-800 dark:text-blue-200 flex-1">{result.full_label_en}</span>
        <CopyButton text={result.full_label_en} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">
          🌐 International Transfer (from outside Japan)
        </h4>
        {result.bank.swift_code ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 mb-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">SWIFT / BIC Code</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-green-800 dark:text-green-300">{result.bank.swift_code}</span>
              <CopyButton text={result.bank.swift_code} />
            </div>
            <p className="text-xs text-green-700 dark:text-green-400 mt-1.5">
              Provide this to the sender&apos;s bank for international wire transfers to Japan
            </p>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3 mb-3">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              SWIFT code not available for this bank in our dataset. Contact the recipient&apos;s bank directly for their SWIFT/BIC code.
            </p>
          </div>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          SWIFT/BIC data covers major Japanese banks only. For smaller or regional banks, verify directly with the recipient&apos;s bank. SWIFT codes can vary by branch for some banks.
        </p>
      </div>
    </div>
  );
}

// ─── Search tab ───────────────────────────────────────────────────────────────

function SearchTab() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BankItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState<BankItem | null>(null);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchFilter, setBranchFilter] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = async (q: string) => {
    if (!q.trim()) { setSearchResults([]); return; }
    setSearchLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bank-en/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val), 300);
  };

  const selectBank = async (bank: BankItem) => {
    setSelectedBank(bank);
    setSearchResults([]);
    setQuery("");
    setBranchFilter("");
    setBranchesLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bank-en/branches?bank_code=${bank.code}`);
      const data = await res.json();
      setBranches(data.branches || []);
    } catch {
      setBranches([]);
    } finally {
      setBranchesLoading(false);
    }
  };

  const filteredBranches = branchFilter.trim()
    ? branches.filter(
        (b) =>
          b.name_en.toLowerCase().includes(branchFilter.toLowerCase()) ||
          b.name_jp.includes(branchFilter) ||
          b.kana.includes(branchFilter) ||
          b.code.includes(branchFilter)
      )
    : branches;

  return (
    <div>
      {!selectedBank ? (
        <>
          <div className="relative mb-3">
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Type bank name (e.g., Mizuho, みずほ, MUFG)"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kon dark:focus:ring-sakura"
            />
            {searchLoading && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">…</span>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-4 divide-y divide-gray-100 dark:divide-gray-700">
              {searchResults.map((b) => (
                <button type="button"
                  key={b.code}
                  onClick={() => selectBank(b)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors"
                >
                  <span className="font-mono text-sm font-bold text-kon dark:text-sakura w-12 flex-shrink-0">{b.code}</span>
                  <span>
                    <span className="font-medium text-gray-900 dark:text-white">{b.name_en}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{b.name_jp}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 self-center">Try:</span>
            {SAMPLE_SEARCHES.map((s) => (
              <button type="button"
                key={s}
                onClick={() => { setQuery(s); runSearch(s); }}
                className="text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full hover:border-kon dark:hover:border-sakura hover:text-kon dark:hover:text-sakura transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Selected bank</p>
              <p className="font-bold text-gray-900 dark:text-white">
                <span className="font-mono text-kon dark:text-sakura mr-2">{selectedBank.code}</span>
                {selectedBank.name_en}
                <span className="text-gray-500 dark:text-gray-400 font-normal ml-2">{selectedBank.name_jp}</span>
              </p>
              {selectedBank.swift_code && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-green-700 dark:text-green-400">SWIFT:</span>
                  <span className="font-mono text-sm font-bold text-green-700 dark:text-green-400">{selectedBank.swift_code}</span>
                  <CopyButton text={selectedBank.swift_code} />
                </div>
              )}
            </div>
            <button type="button"
              onClick={() => { setSelectedBank(null); setBranches([]); }}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
            >
              Change bank
            </button>
          </div>

          {branchesLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading branches…</p>
          ) : (
            <>
              <input
                type="text"
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                placeholder="Filter branches by name or code…"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kon dark:focus:ring-sakura mb-3"
              />
              <div className="max-h-72 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-700">
                {filteredBranches.slice(0, 200).map((br) => (
                  <div key={br.code} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="font-mono text-sm font-bold text-kon dark:text-sakura w-10 flex-shrink-0">{br.code}</span>
                    <span className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{br.name_en}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{br.name_jp}</span>
                    </span>
                    <div className="flex gap-1 flex-shrink-0">
                      <CopyButton text={br.code} />
                    </div>
                  </div>
                ))}
                {filteredBranches.length === 0 && (
                  <p className="px-4 py-3 text-sm text-gray-400">No branches match &ldquo;{branchFilter}&rdquo;</p>
                )}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {filteredBranches.length} branch{filteredBranches.length !== 1 ? "es" : ""}
                {branchFilter && ` matching "${branchFilter}"`}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Dropdown tab ─────────────────────────────────────────────────────────────

function DropdownTab() {
  const [allBanks, setAllBanks] = useState<BankItem[]>([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [bankFilter, setBankFilter] = useState("");
  const [selectedBankCode, setSelectedBankCode] = useState("");

  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [selectedBranchCode, setSelectedBranchCode] = useState("");

  const [result, setResult] = useState<LookupResult | null>(null);
  const [resultLoading, setResultLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBanksLoading(true);
    fetch(`${API_URL}/api/bank-en/banks`)
      .then((r) => r.json())
      .then((d) => setAllBanks(Array.isArray(d) ? d : []))
      .catch(() => setError("Could not load bank list."))
      .finally(() => setBanksLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedBankCode) { setBranches([]); setSelectedBranchCode(""); setResult(null); return; }
    setBranchesLoading(true);
    setSelectedBranchCode("");
    setResult(null);
    fetch(`${API_URL}/api/bank-en/branches?bank_code=${selectedBankCode}`)
      .then((r) => r.json())
      .then((d) => setBranches(d.branches || []))
      .catch(() => setError("Could not load branches."))
      .finally(() => setBranchesLoading(false));
  }, [selectedBankCode]);

  useEffect(() => {
    if (!selectedBankCode || !selectedBranchCode) { setResult(null); return; }
    setResultLoading(true);
    setError(null);
    fetch(`${API_URL}/api/bank-en/lookup?bank_code=${selectedBankCode}&branch_code=${selectedBranchCode}`)
      .then((r) => r.json())
      .then((d) => setResult(d))
      .catch(() => setError("Lookup failed. Please try again."))
      .finally(() => setResultLoading(false));
  }, [selectedBankCode, selectedBranchCode]);

  const filteredBanks = bankFilter.trim()
    ? allBanks.filter(
        (b) =>
          b.name_en.toLowerCase().includes(bankFilter.toLowerCase()) ||
          b.name_jp.includes(bankFilter) ||
          b.kana.includes(bankFilter) ||
          b.code.includes(bankFilter)
      )
    : allBanks;

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Bank */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
          Step 1 — Bank (金融機関)
        </label>
        <input
          type="text"
          value={bankFilter}
          onChange={(e) => setBankFilter(e.target.value)}
          placeholder="Filter banks by name…"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-t-lg px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kon dark:focus:ring-sakura"
        />
        <select
          value={selectedBankCode}
          onChange={(e) => setSelectedBankCode(e.target.value)}
          disabled={banksLoading}
          size={1}
          className="w-full border border-t-0 border-gray-300 dark:border-gray-600 rounded-b-lg px-4 py-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kon dark:focus:ring-sakura disabled:opacity-50"
        >
          <option value="">
            {banksLoading ? "Loading banks…" : "Select bank"}
          </option>
          {filteredBanks.map((b) => (
            <option key={b.code} value={b.code}>
              {b.code} — {b.name_en} ({b.name_jp})
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Branch */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
          Step 2 — Branch (支店)
        </label>
        <select
          value={selectedBranchCode}
          onChange={(e) => setSelectedBranchCode(e.target.value)}
          disabled={!selectedBankCode || branchesLoading}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kon dark:focus:ring-sakura disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {!selectedBankCode
              ? "Select bank first"
              : branchesLoading
              ? "Loading branches…"
              : "Select branch"}
          </option>
          {branches.map((br) => (
            <option key={br.code} value={br.code}>
              {br.code} — {br.name_en} ({br.name_jp})
            </option>
          ))}
        </select>
      </div>

      {/* Result */}
      {resultLoading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading result…</p>
      )}
      {result && !resultLoading && <LookupResultCard result={result} />}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BankCodeClient() {
  const [activeTab, setActiveTab] = useState<"search" | "dropdown">("search");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-4">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
          <Link href="/en" className="hover:text-kon dark:hover:text-sakura">Home</Link>
          <span className="mx-2">›</span>
          <span>Business Tools</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800 dark:text-gray-200">Bank Code Lookup</span>
        </nav>

        {/* Direct answer block */}
        <div className="direct-answer-block bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl px-5 py-4 mb-6 text-sm text-blue-900 dark:text-blue-100">
          <strong>Japanese bank codes (Zengin codes) are 4 digits</strong> for the bank (e.g., 0001 = Mizuho) and <strong>3 digits</strong> for the branch. Search below to find any bank or branch code for wire transfers.
        </div>

        {/* H1 */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Japan Bank &amp; Branch Code Lookup
          <span className="block text-xl md:text-2xl font-semibold text-gray-500 dark:text-gray-400 mt-1">
            Free English Zengin Code Search
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-base">
          Find the 4-digit bank code and 3-digit branch code for any Japanese bank.
          Used for domestic wire transfers (振込), payroll setup, and international remittances to Japan.
        </p>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 w-fit">
          <button type="button"
            onClick={() => setActiveTab("search")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "search"
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            🔍 Bank search
          </button>
          <button type="button"
            onClick={() => setActiveTab("dropdown")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "dropdown"
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            🏦 Bank → Branch (dropdowns)
          </button>
        </div>

        {activeTab === "search" ? <SearchTab /> : <DropdownTab />}

        {/* ─── Educational sections ─────────────────────────── */}
        <div className="mt-12 space-y-6">

          {/* Why you need Japan bank codes */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Why you need Japan bank codes
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Japan uses the <strong>Zengin system</strong> (全銀システム) — the domestic interbank network operated by the
              Japanese Bankers Association since 1973. Every bank and branch in Japan has a unique Zengin code,
              required for:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1.5 list-disc list-inside">
              <li>Domestic wire transfers (振込, furikomi) between Japanese banks</li>
              <li>Payroll direct deposit setup (給与振込, kyūyo furikomi)</li>
              <li>Utility auto-debit enrollment (口座振替, kōza furikae)</li>
              <li>International wire transfers — your overseas bank uses SWIFT, then the Zengin code for final routing</li>
              <li>B2B payment setup for Japanese suppliers and partners</li>
            </ul>
          </section>

          {/* Zengin vs SWIFT */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Zengin bank code vs SWIFT/BIC code
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left pb-2 text-gray-500 dark:text-gray-400 font-medium">Feature</th>
                    <th className="text-left pb-2 text-gray-500 dark:text-gray-400 font-medium">Zengin Code</th>
                    <th className="text-left pb-2 text-gray-500 dark:text-gray-400 font-medium">SWIFT/BIC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {[
                    ["Use case", "Domestic Japan transfers", "International transfers"],
                    ["Format", "4-digit bank + 3-digit branch", "8–11 alphanumeric characters"],
                    ["Mizuho example", "Bank 0001, Branch 001", "MHCBJPJT"],
                    ["MUFG example", "Bank 0005", "BOTKJPJT"],
                    ["SMBC example", "Bank 0009", "SMBCJPJT"],
                    ["Who provides it", "This tool (all banks)", "This tool (major banks) / recipient's bank"],
                  ].map(([feature, zengin, swift]) => (
                    <tr key={feature}>
                      <td className="py-2 font-medium text-gray-700 dark:text-gray-300 pr-4">{feature}</td>
                      <td className="py-2 text-gray-600 dark:text-gray-300 pr-4">{zengin}</td>
                      <td className="py-2 text-gray-600 dark:text-gray-300">{swift}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Top Japanese banks table */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Top Japanese banks — quick reference
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left pb-2 text-gray-500 dark:text-gray-400 font-medium pr-4">Code</th>
                    <th className="text-left pb-2 text-gray-500 dark:text-gray-400 font-medium pr-4">English Name</th>
                    <th className="text-left pb-2 text-gray-500 dark:text-gray-400 font-medium">Japanese Name</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {TOP_BANKS.map((b) => (
                    <tr key={b.code}>
                      <td className="py-1.5 font-mono font-bold text-kon dark:text-sakura pr-4">{b.code}</td>
                      <td className="py-1.5 text-gray-900 dark:text-white pr-4">{b.name_en}</td>
                      <td className="py-1.5 text-gray-500 dark:text-gray-400">{b.name_jp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How to wire to Japan */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              How to send a wire transfer to a Japanese bank account
            </h2>
            <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-3 list-decimal list-inside">
              <li>
                <strong>Get the full account details from the recipient:</strong> bank name (Japanese + English),
                bank code (4 digits), branch name, branch code (3 digits), account type (普通 savings or 当座 current),
                account number (7 digits), and account holder name in katakana.
              </li>
              <li>
                <strong>Find the SWIFT/BIC code</strong> for the recipient&apos;s bank — use the table above or ask the
                recipient&apos;s bank directly. This tool gives Zengin codes; your overseas bank needs the SWIFT code
                for routing.
              </li>
              <li>
                <strong>Fill out your bank&apos;s international wire form:</strong> beneficiary name exactly as on
                the account, beneficiary bank SWIFT code, bank name and address (in English), account number,
                and the purpose of payment (for large amounts).
              </li>
              <li>
                <strong>Currency:</strong> Japan does not use IBAN. Use JPY (Japanese yen) to avoid conversion fees
                on the receiving end, unless the recipient prefers another currency.
              </li>
              <li>
                <strong>Verify before sending:</strong> confirm all codes with the recipient directly, especially for
                first-time transfers. Incorrect codes can cause delays of 3–10 business days.
              </li>
            </ol>
          </section>

          {/* Glossary */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Japanese banking terms glossary
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {[
                ["金融機関コード (きんゆうきかんコード)", "Bank code / financial institution code (4 digits)"],
                ["支店番号 / 店番 (してんばんごう / たなばん)", "Branch code (3 digits)"],
                ["全銀システム (ぜんぎんシステム)", "Zengin System — Japan's interbank network"],
                ["口座番号 (こうざばんごう)", "Account number (7 digits)"],
                ["口座種別 (こうざしゅべつ)", "Account type (普通 savings / 当座 current)"],
                ["振込 (ふりこみ)", "Wire transfer / bank transfer"],
                ["口座振替 (こうざふりかえ)", "Automatic debit / direct debit"],
                ["給与振込 (きゅうよふりこみ)", "Payroll direct deposit"],
                ["普通預金 (ふつうよきん)", "Ordinary savings account"],
                ["当座預金 (とうざよきん)", "Current / checking account"],
                ["定期預金 (ていきよきん)", "Time deposit / fixed-term savings"],
                ["SWIFT/BIC コード", "International bank identifier (for overseas transfers)"],
              ].map(([jp, en]) => (
                <div key={jp} className="flex gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-200 w-56 flex-shrink-0 text-xs leading-relaxed">{jp}</span>
                  <span className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">{en}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <details
                  key={i}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden group"
                >
                  <summary className="cursor-pointer px-5 py-4 font-semibold text-gray-900 dark:text-white text-sm list-none flex items-center justify-between gap-3">
                    {faq.q}
                    <span className="flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="faq-answer px-5 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* Credit */}
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-2">
            Bank data from{" "}
            <a href="https://github.com/zengin-code/zengin-rb" target="_blank" rel="noopener noreferrer" className="underline">
              ZenginCode
            </a>{" "}
            (MIT-licensed dataset, updated regularly). Verify codes with the recipient&apos;s bank for time-sensitive transfers.
          </p>

          {/* Japanese version note */}
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Looking for the Japanese version of this tool?
            </p>
            <Link
              href="/reference/bank-codes"
              className="inline-block px-4 py-2 bg-kon hover:bg-ai text-white text-sm font-semibold rounded-lg transition"
            >
              日本語版 銀行コード検索 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
