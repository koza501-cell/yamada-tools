"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { FAQS } from "./faqs";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api-staging.yamada-tools.jp";

// ─── Types ───────────────────────────────────────────────────────────────────

type AddressResult = {
  prefecture_jp: string;
  prefecture_en: string;
  city_jp: string;
  city_en: string;
  town_jp: string;
  town_en: string;
  full_address_jp: string;
  full_address_en: string;
  prefecture_code: string;
};

type LookupResponse = {
  postal_code: string;
  results: AddressResult[];
  credit_text: string;
};

type PrefectureItem = { jp: string; en: string; code: string };
type CityItem = { jp: string; en: string };
type TownItem = { jp: string; en: string; postal: string };

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SAMPLE_CODES = [
  { code: "100-0001", label: "Tokyo Imperial Palace" },
  { code: "530-0001", label: "Osaka Umeda" },
  { code: "150-0002", label: "Shibuya" },
  { code: "460-0008", label: "Nagoya" },
];

function normalizePostalCode(raw: string): string {
  let s = raw.replace(/〒/g, "").replace(/[　 ]/g, "");
  s = s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
  return s.replace(/[^\d]/g, "");
}

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
    <button
      onClick={copy}
      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded transition-colors"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function ResultCard({
  result,
  postalCode,
}: {
  result: AddressResult;
  postalCode: string;
}) {
  const prHref = `/en/realestate/property-report?address=${encodeURIComponent(
    result.full_address_jp
  )}`;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-1">
        <p className="text-lg font-semibold text-gray-900 dark:text-white leading-snug">
          {result.full_address_en}
        </p>
        <CopyButton text={result.full_address_en} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-base font-mono text-kon dark:text-sakura font-bold">
          〒{postalCode}
        </span>
        <CopyButton text={postalCode} />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {result.full_address_jp}
        </span>
        <CopyButton text={result.full_address_jp} />
      </div>

      <div className="flex flex-wrap gap-2 text-xs mb-4">
        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-700">
          {result.prefecture_en} ({result.prefecture_jp})
        </span>
        <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600">
          {result.city_en} / {result.city_jp}
        </span>
        {result.town_jp && (
          <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600">
            {result.town_en} / {result.town_jp}
          </span>
        )}
      </div>

      <Link
        href={prHref}
        className="inline-flex items-center gap-1.5 text-sm text-kon dark:text-sakura hover:underline font-medium"
      >
        🏠 Check this address in Property Report →
      </Link>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PostalCodeClient() {
  const [activeTab, setActiveTab] = useState<"lookup" | "reverse">("lookup");

  // Lookup tab
  const [postalInput, setPostalInput] = useState("");
  const [lookupResult, setLookupResult] = useState<LookupResponse | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Cascade (reverse) tab
  const [prefectures, setPrefectures] = useState<PrefectureItem[]>([]);
  const [prefsLoading, setPrefsLoading] = useState(false);
  const [selectedPref, setSelectedPref] = useState<PrefectureItem | null>(null);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityItem | null>(null);
  const [towns, setTowns] = useState<TownItem[]>([]);
  const [townsLoading, setTownsLoading] = useState(false);
  const [selectedTown, setSelectedTown] = useState<TownItem | null>(null);
  const [cascadeError, setCascadeError] = useState<string | null>(null);

  // Load prefectures once on mount
  useEffect(() => {
    setPrefsLoading(true);
    fetch(`${API_URL}/api/postal-en/prefectures`)
      .then((r) => r.json())
      .then((d) => setPrefectures(d.prefectures || []))
      .catch(() => setCascadeError("Could not load prefecture list."))
      .finally(() => setPrefsLoading(false));
  }, []);

  // Load cities when prefecture changes
  useEffect(() => {
    if (!selectedPref) return;
    setCities([]);
    setSelectedCity(null);
    setTowns([]);
    setSelectedTown(null);
    setCascadeError(null);
    setCitiesLoading(true);
    fetch(`${API_URL}/api/postal-en/cities?prefecture=${encodeURIComponent(selectedPref.jp)}`)
      .then((r) => r.json())
      .then((d) => setCities(d.cities || []))
      .catch(() => setCascadeError("Could not load city list."))
      .finally(() => setCitiesLoading(false));
  }, [selectedPref]);

  // Load towns when city changes
  useEffect(() => {
    if (!selectedPref || !selectedCity) return;
    setTowns([]);
    setSelectedTown(null);
    setCascadeError(null);
    setTownsLoading(true);
    fetch(
      `${API_URL}/api/postal-en/towns?prefecture=${encodeURIComponent(selectedPref.jp)}&city=${encodeURIComponent(selectedCity.jp)}`
    )
      .then((r) => r.json())
      .then((d) => setTowns(d.towns || []))
      .catch(() => setCascadeError("Could not load town list."))
      .finally(() => setTownsLoading(false));
  }, [selectedPref, selectedCity]);

  const runLookup = useCallback(async (code: string) => {
    const digits = normalizePostalCode(code);
    if (digits.length !== 7) {
      setLookupError("Please enter a 7-digit postal code (e.g., 100-0001 or 1000001).");
      return;
    }
    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);
    try {
      const res = await fetch(`${API_URL}/api/postal-en/lookup?code=${digits}`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.detail || `Error ${res.status}`);
      }
      setLookupResult(await res.json());
    } catch (e: unknown) {
      setLookupError(e instanceof Error ? e.message : "Lookup failed. Please try again.");
    } finally {
      setLookupLoading(false);
    }
  }, []);

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runLookup(postalInput);
  };

  // Build result object from cascade selections (no extra API call needed)
  const cascadeResult: AddressResult | null =
    selectedPref && selectedCity && selectedTown
      ? {
          prefecture_jp: selectedPref.jp,
          prefecture_en: selectedPref.en,
          city_jp: selectedCity.jp,
          city_en: selectedCity.en,
          town_jp: selectedTown.jp,
          town_en: selectedTown.en,
          full_address_jp: selectedPref.jp + selectedCity.jp + selectedTown.jp,
          full_address_en: `${selectedTown.en}, ${selectedCity.en}, ${selectedPref.en}`,
          prefecture_code: selectedPref.code,
        }
      : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
          <Link href="/en" className="hover:text-kon dark:hover:text-sakura">Home</Link>
          <span className="mx-2">›</span>
          <span>Utility</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800 dark:text-gray-200">Postal Code Lookup</span>
        </nav>

        {/* Direct answer block */}
        <div className="direct-answer-block bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl px-5 py-4 mb-6 text-sm text-blue-900 dark:text-blue-100">
          <strong>Japanese postal codes are 7 digits</strong> in XXX-XXXX format (e.g., 100-0001). Enter any code below to get the full English address — or select an address from the dropdowns to find its postal code.
        </div>

        {/* H1 */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Japan Postal Code Lookup
          <span className="block text-xl md:text-2xl font-semibold text-gray-500 dark:text-gray-400 mt-1">
            English Address &amp; Zip Code Search
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-base">
          Free lookup for all 120,000+ Japanese postal codes (郵便番号) — with full English romaji addresses.
          Reverse search by Japanese address also available.
        </p>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 w-fit">
          <button
            onClick={() => setActiveTab("lookup")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "lookup"
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            〒 Postal code → Address
          </button>
          <button
            onClick={() => setActiveTab("reverse")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "reverse"
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            🔍 Address → Postal code
          </button>
        </div>

        {/* ── Lookup tab ─────────────────────────────────────── */}
        {activeTab === "lookup" && (
          <div>
            <form onSubmit={handleLookupSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                value={postalInput}
                onChange={(e) => setPostalInput(e.target.value)}
                placeholder="e.g., 100-0001 or 1000001 or 〒100-0001"
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kon dark:focus:ring-sakura"
                maxLength={12}
              />
              <button
                type="submit"
                disabled={lookupLoading}
                className="px-6 py-3 bg-kon dark:bg-ai text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {lookupLoading ? "…" : "Look up"}
              </button>
            </form>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs text-gray-500 dark:text-gray-400 self-center">Try:</span>
              {SAMPLE_CODES.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => { setPostalInput(code); runLookup(code); }}
                  className="text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full hover:border-kon dark:hover:border-sakura hover:text-kon dark:hover:text-sakura transition-colors"
                >
                  {code} <span className="text-gray-400">({label})</span>
                </button>
              ))}
            </div>

            {lookupError && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-700 dark:text-red-300 text-sm">
                {lookupError}
              </div>
            )}

            {lookupResult && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {lookupResult.results.length} result{lookupResult.results.length !== 1 ? "s" : ""} for{" "}
                  <span className="font-mono font-semibold text-gray-700 dark:text-gray-200">〒{lookupResult.postal_code}</span>
                </p>
                {lookupResult.results.map((r, i) => (
                  <ResultCard key={i} result={r} postalCode={lookupResult.postal_code} />
                ))}
                <p className="text-xs text-gray-400 dark:text-gray-500">{lookupResult.credit_text}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Reverse tab (cascading dropdowns) ──────────────── */}
        {activeTab === "reverse" && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Select your address in 3 steps to find the postal code.
            </p>

            <div className="space-y-4 mb-6">
              {/* Step 1: Prefecture */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Step 1 — Prefecture (都道府県)
                </label>
                <select
                  value={selectedPref?.jp ?? ""}
                  onChange={(e) => {
                    const pref = prefectures.find((p) => p.jp === e.target.value) ?? null;
                    setSelectedPref(pref);
                  }}
                  disabled={prefsLoading || prefectures.length === 0}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kon dark:focus:ring-sakura disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {prefsLoading ? "Loading prefectures…" : "Select prefecture"}
                  </option>
                  {prefectures.map((p) => (
                    <option key={p.code} value={p.jp}>
                      {p.en} ({p.jp})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: City / Ward */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Step 2 — City / Ward (市区町村)
                </label>
                <select
                  value={selectedCity?.jp ?? ""}
                  onChange={(e) => {
                    const city = cities.find((c) => c.jp === e.target.value) ?? null;
                    setSelectedCity(city);
                  }}
                  disabled={!selectedPref || citiesLoading}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kon dark:focus:ring-sakura disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!selectedPref
                      ? "Select prefecture first"
                      : citiesLoading
                      ? "Loading cities…"
                      : "Select city / ward"}
                  </option>
                  {cities.map((c) => (
                    <option key={c.jp} value={c.jp}>
                      {c.en} ({c.jp})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Town / District */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Step 3 — Town / District (町丁目)
                </label>
                <select
                  value={selectedTown?.jp ?? ""}
                  onChange={(e) => {
                    const town = towns.find((t) => t.jp === e.target.value) ?? null;
                    setSelectedTown(town);
                  }}
                  disabled={!selectedCity || townsLoading}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kon dark:focus:ring-sakura disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!selectedCity
                      ? "Select city first"
                      : townsLoading
                      ? "Loading towns…"
                      : "Select town / district"}
                  </option>
                  {towns.map((t) => (
                    <option key={t.jp} value={t.jp}>
                      {t.en} ({t.jp}) — 〒{t.postal}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {cascadeError && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-700 dark:text-red-300 text-sm">
                {cascadeError}
              </div>
            )}

            {cascadeResult && selectedTown && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Postal code for{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {cascadeResult.full_address_jp}
                  </span>
                </p>
                <ResultCard result={cascadeResult} postalCode={selectedTown.postal} />
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Address-to-postcode data from HeartRails GeoAPI (public API)
                </p>
              </div>
            )}
          </div>
        )}

        {/* ─── Educational sections ─────────────────────────── */}
        <div className="mt-12 space-y-6">

          {/* How Japan postal codes work */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              How Japan postal codes work
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Japan introduced its current 7-digit postal code system on <strong>February 2, 1998</strong>,
              replacing the older 3-digit and 5-digit systems. The format is <strong>XXX-XXXX</strong>.
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
              <li>First 3 digits — regional sorting area (大口区分)</li>
              <li>Last 4 digits — specific street block or district (小区分)</li>
              <li>The 〒 symbol is required on all domestic mail</li>
              <li>Japan has approximately 120,000+ unique postal codes</li>
              <li>Large buildings and PO Boxes may have dedicated codes</li>
            </ul>
          </section>

          {/* Regional codes */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Japan postal code regions
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              {[
                ["0xx", "Hokkaido (北海道)"],
                ["01x–07x", "Tohoku (東北): Aomori, Iwate, Miyagi, Akita, Yamagata, Fukushima"],
                ["1xx", "Tokyo (東京都) — 23 wards"],
                ["2xx", "Kanagawa, Chiba, Ibaraki (Greater Tokyo)"],
                ["3xx", "Tochigi, Gunma, Saitama, Shizuoka, Yamanashi"],
                ["4xx", "Aichi, Gifu, Toyama, Ishikawa, Fukui, Nagano"],
                ["5xx", "Osaka (大阪), Kyoto (京都)"],
                ["6xx", "Hyogo (兵庫), Nara, Shiga, Wakayama"],
                ["7xx", "Tottori, Shimane, Okayama, Hiroshima, Yamaguchi"],
                ["7xx–8xx", "Tokushima, Kagawa, Ehime, Kochi (Shikoku)"],
                ["8xx", "Fukuoka, Saga, Nagasaki, Kumamoto, Oita, Miyazaki, Kagoshima"],
                ["9xx", "Niigata, Akita, Fukushima (overlap), Okinawa"],
              ].map(([code, label]) => (
                <div key={code} className="flex gap-2">
                  <span className="font-mono text-kon dark:text-sakura font-semibold w-16 flex-shrink-0">{code}</span>
                  <span className="text-gray-600 dark:text-gray-300">{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* How to write a Japanese address in English */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              How to write a Japanese address in English
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Japanese addresses run <strong>largest to smallest</strong> (prefecture → city → block → building),
              which is the reverse of the English convention (building → street → city → country).
              When writing for English-speaking recipients, reverse the order:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-2 text-gray-500 dark:text-gray-400 font-medium">Element</th>
                    <th className="pb-2 text-gray-500 dark:text-gray-400 font-medium">Japanese order</th>
                    <th className="pb-2 text-gray-500 dark:text-gray-400 font-medium">English order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {[
                    ["Prefecture", "1st (東京都)", "Last before JAPAN"],
                    ["City / Ward", "2nd (千代田区)", "3rd"],
                    ["Town / District", "3rd (千代田)", "2nd"],
                    ["Block / Building", "4th (1-1)", "1st"],
                    ["Postal code", "Before prefecture (〒100-0001)", "At end or after city"],
                  ].map(([el, jp, en]) => (
                    <tr key={el}>
                      <td className="py-1.5 font-medium text-gray-700 dark:text-gray-300 pr-4">{el}</td>
                      <td className="py-1.5 text-gray-500 dark:text-gray-400 pr-4">{jp}</td>
                      <td className="py-1.5 text-gray-500 dark:text-gray-400">{en}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Example: <span className="font-mono">〒100-0001 東京都千代田区千代田1-1</span> →{" "}
              <span className="font-mono">1-1 Chiyoda, Chiyoda-ku, Tokyo 100-0001, JAPAN</span>
            </p>
          </section>

          {/* Glossary */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Japanese address glossary
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {[
                ["郵便番号 (ゆうびんばんごう)", "Postal code (zip code)"],
                ["〒", "Postal code symbol"],
                ["都道府県 (とどうふけん)", "Prefecture (all 47 prefectures)"],
                ["市 (し)", "City (shi)"],
                ["区 (く)", "Ward (ku) — Tokyo wards or city wards"],
                ["町 (まち/ちょう)", "Town (machi/cho)"],
                ["村 (むら)", "Village (mura)"],
                ["丁目 (ちょうめ)", "Sub-district block number"],
                ["番地 (ばんち)", "Lot/address number"],
                ["号 (ごう)", "Building entrance number"],
                ["大字 (おおあざ)", "Large rural district"],
                ["字 (あざ)", "Small rural sub-district"],
              ].map(([jp, en]) => (
                <div key={jp} className="flex gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-200 w-48 flex-shrink-0">{jp}</span>
                  <span className="text-gray-600 dark:text-gray-300">{en}</span>
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
            Postal data from JapanPost via{" "}
            <a href="https://zipcloud.ibsnet.co.jp" target="_blank" rel="noopener noreferrer" className="underline">
              zipcloud
            </a>{" "}
            public API. Verify with{" "}
            <a href="https://www.japanpost.jp/zipcode/" target="_blank" rel="noopener noreferrer" className="underline">
              japanpost.jp
            </a>{" "}
            for time-sensitive shipping.
          </p>

          {/* Japanese version note */}
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              日本語版はありません。日本のユーザーは日本郵便の公式サービスをご利用ください。
            </p>
            <Link href="/" className="text-sm text-kon dark:text-sakura hover:underline mt-1 inline-block">
              ← 日本語のトップページへ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
