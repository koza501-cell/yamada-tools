"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FAQS } from "./faqs";

/**
 * SAVE THIS FILE AS (REPLACE EXISTING):
 *   ~/projects/3websitepassive_income/yamada-tools/frontend-staging/src/app/en/business/company-search/client.tsx
 *
 * Changes vs. old file:
 *   - Added direct-answer block at top (huge GEO win — first 200 words)
 *   - Updated H1 with secondary keyword ("Free English Verification")
 *   - Added intro paragraph with extractable answer text
 *   - Added id="step1"..."step5" anchors to match HowTo schema URLs
 *   - REMOVED duplicate FAQPage JSON-LD (already in page.tsx — was duplicated)
 *   - REMOVED inline WebApplication JSON-LD (now in page.tsx — was duplicated)
 *   - Added className="direct-answer-block" + .faq-answer (matches speakable schema)
 *   - All existing functionality preserved (search, results, sample brands, etc.)
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

// ─── Types ──────────────────────────────────────────────────────────────────
type CorpTypeInfo = {
  japanese: string;
  code: string;
  en_full: string;
  en_short: string;
  us_equivalent: string;
  description: string;
};

type CorpResult = {
  corporate_number: string;
  name: string;
  name_en?: string;
  location?: string;
  postal_code?: string;
  status?: string;
  representative_name?: string;
  number_of_activity?: string | number;
  match_score: number;
  corp_type_info: CorpTypeInfo | null;
};

type SearchResponse = {
  query: string;
  queries_tried: string[];
  total_unique: number;
  results: CorpResult[];
  warnings: {
    duplicate_names_found: boolean;
    many_results_warning: boolean;
  };
  verified_at: string;
  data_source: string;
};

const SAMPLE_BRANDS = [
  "Toyota",
  "Sony",
  "Honda",
  "Nintendo",
  "Rakuten",
  "Mitsubishi",
  "Uniqlo",
  "Takeda",
];

// ─── Activity badge logic ───────────────────────────────────────────────────
function getActivityBadge(activity: string | number | undefined) {
  const n = parseInt(String(activity || "0"), 10);
  if (n >= 1000)
    return {
      label: `${n.toLocaleString()} government records`,
      tone: "trust",
      icon: "★★★",
      hint: "Highly established business",
    };
  if (n >= 100)
    return {
      label: `${n.toLocaleString()} government records`,
      tone: "trust",
      icon: "★★",
      hint: "Established business",
    };
  if (n >= 20)
    return {
      label: `${n} records`,
      tone: "ok",
      icon: "★",
      hint: "Active business",
    };
  if (n >= 1)
    return {
      label: `${n} records`,
      tone: "neutral",
      icon: "·",
      hint: "Limited activity",
    };
  return {
    label: "No public records",
    tone: "warn",
    icon: "?",
    hint: "Verify carefully",
  };
}

function getMatchBadge(score: number) {
  if (score >= 80) return { label: "Strong match", tone: "strong" };
  if (score >= 50) return { label: "Likely match", tone: "ok" };
  if (score >= 20) return { label: "Possible match", tone: "weak" };
  return { label: "Weak match", tone: "weak" };
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function CompanySearchClient() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  async function runSearch(term: string) {
    if (!term.trim()) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const res = await fetch(
        `${API_URL}/api/gbiz/corporations-en?q=${encodeURIComponent(term)}&limit=20`
      );
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.detail || `HTTP ${res.status}`);
      }
      const json: SearchResponse = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || "Search failed. Please try again.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runSearch(query);
  }

  function handleSampleClick(brand: string) {
    setQuery(brand);
    runSearch(brand);
  }

  if (!mounted) {
    return (
      <div className="min-h-screen py-12 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* ─── Breadcrumb ───────────────────────────────────────────── */}
      <nav
        className="max-w-5xl mx-auto px-4 pt-6 text-sm text-gray-500 dark:text-gray-400"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>›</li>
          <li>
            <Link href="/business" className="hover:underline">
              Business Tools
            </Link>
          </li>
          <li>›</li>
          <li className="text-gray-700 dark:text-gray-200 font-medium">
            Japanese Company Search
          </li>
        </ol>
      </nav>

      {/* ─── Header ──────────────────────────────────────────────── */}
      <header className="max-w-5xl mx-auto px-4 mt-6 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Japan Company Search — Free English Verification
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          Verify any Japanese corporation instantly using official government
          data. Free, no registration, no login.
        </p>

        <div className="flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-kon/30 text-kon dark:text-gray-300 rounded-full">
            <span aria-hidden>🛡️</span> Official METI source
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
            <span aria-hidden>🇯🇵</span> Japan-domestic processing
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-kon/30 text-kon dark:text-gray-300 rounded-full">
            <span aria-hidden>⚡</span> Free, instant, no signup
          </span>
        </div>
      </header>

      {/* ─── Direct-answer block (GEO: first 200 words = AI citation gold) ── */}
      <section className="max-w-5xl mx-auto px-4 mb-6">
        <div
          className="direct-answer-block bg-blue-50 dark:bg-blue-950/40 border-l-4 border-blue-600 dark:border-blue-400 p-4 md:p-5 rounded-r-lg"
        >
          <p className="text-gray-800 dark:text-gray-100 text-sm md:text-base leading-relaxed">
            <strong>
              How to verify a Japanese company in English (free):
            </strong>{" "}
            Enter the company name below in English, romaji, or Japanese. Each
            result returns the official{" "}
            <strong>13-digit corporate number (法人番号)</strong>, registered
            address, registration date, and government activity records. Data
            comes from{" "}
            <strong>
              METI gBizINFO — Japan&apos;s official government corporate
              database
            </strong>{" "}
            covering 5+ million registered businesses. This is the same data
            Japanese banks, lawyers, and accountants reference. Use it to
            verify suppliers, partners, or any Japanese 株式会社 before doing
            business. No signup, no credit card, results in under 2 seconds.
          </p>
        </div>
      </section>

      {/* ─── Search box ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mb-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5"
        >
          <label
            htmlFor="company-search-input"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
          >
            Company name (in English, romaji, or Japanese)
          </label>
          <div className="flex gap-2">
            <input
              id="company-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Toyota, Sony, トヨタ自動車"
              className="flex-1 min-w-0 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kon"
              aria-describedby="search-hint"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-kon hover:bg-ai disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-semibold rounded-lg transition whitespace-nowrap"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          <p
            id="search-hint"
            className="mt-2 text-xs text-gray-500 dark:text-gray-400"
          >
            Famous brand names are auto-translated. The system tries multiple
            search variations.
          </p>

          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Try these:
            </p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_BRANDS.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => handleSampleClick(brand)}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-ai/30 text-gray-700 dark:text-gray-200 rounded-full border border-gray-200 dark:border-gray-600 transition"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </form>
      </section>

      {/* ─── Error ──────────────────────────────────────────────── */}
      {error && (
        <section className="max-w-5xl mx-auto px-4 mb-6">
          <div className="bg-gray-50 dark:bg-danger/30 border border-gray-200 dark:border-danger text-danger dark:text-gin px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        </section>
      )}

      {/* ─── Results ───────────────────────────────────────────── */}
      {data && !loading && (
        <section className="max-w-5xl mx-auto px-4">
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>
              <strong>{data.results.length}</strong> result
              {data.results.length !== 1 ? "s" : ""} for{" "}
              <strong className="text-gray-900 dark:text-white">
                &quot;{data.query}&quot;
              </strong>
              {data.queries_tried.length > 1 && (
                <span className="ml-2 text-xs">
                  (also tried:{" "}
                  {data.queries_tried
                    .slice(1)
                    .map((q) => `"${q}"`)
                    .join(", ")}
                  )
                </span>
              )}
            </p>
          </div>

          {data.warnings.duplicate_names_found && (
            <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 px-4 py-3 rounded-lg text-sm">
              <strong>⚠️ Multiple companies share the same name.</strong> Check
              the 法人番号 (corporate number) and address carefully to identify
              the correct entity.
            </div>
          )}

          {data.results.length === 0 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                No companies found.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Try searching with the Japanese name (e.g. &quot;ソニー&quot; instead of
                &quot;Sony&quot;), or use a more common spelling.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {data.results.map((corp) => (
              <CompanyCard key={corp.corporate_number} corp={corp} />
            ))}
          </div>

          <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
            <p>
              <strong>Data source:</strong> {data.data_source}
            </p>
            <p>
              <strong>Verified at:</strong>{" "}
              {new Date(data.verified_at).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              })}
            </p>
            <p className="mt-1">
              Information is provided by the official Japan METI gBizINFO API.
              Cached for 24 hours. Always verify with official sources for
              business decisions.
            </p>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ═══ EDUCATIONAL CONTENT (always visible — SEO + GEO) ═════ */}
      {/* ═══════════════════════════════════════════════════════════ */}

      {/* ─── Section 1: Common Use Cases ──────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mt-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            When you need to verify a Japanese company
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Whether you&apos;re a foreign investor, an importer, a recruiter, or an
            international supplier, you&apos;ll often need to confirm that a
            Japanese counterparty is real, registered, and reputable. Here are
            the most common situations where this tool helps:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <UseCase
              icon="🤝"
              title="Verifying a new business partner"
              text="Before signing a contract or sending a wire transfer to a Japanese company, confirm they're actually registered with Japan's National Tax Agency. A registered 法人番号 is your first line of defense against shell companies and fraud."
            />
            <UseCase
              icon="📦"
              title="Confirming a supplier's legitimacy"
              text="You found a great wholesale price from a Japanese manufacturer on Alibaba or a trade show. Before placing a large order, verify that the company exists at the address they provided and matches their stated business type."
            />
            <UseCase
              icon="💼"
              title="Recruiting from a Japanese company"
              text="A candidate's resume mentions employment at a Japanese firm. Confirm the company exists and is substantial enough to have employed the candidate in the role they describe."
            />
            <UseCase
              icon="🏢"
              title="Researching subsidiaries and holdings"
              text="Multinational companies often have multiple Japanese subsidiaries with similar names (e.g., Sony Group, Sony Corporation, Sony Music Entertainment). Identify the correct legal entity for contracts, invoicing, or M&A research."
            />
            <UseCase
              icon="🎓"
              title="Academic or journalistic research"
              text="Confirming the registered name, address, and basic public records of Japanese organizations for citation in research papers, news articles, or industry reports."
            />
            <UseCase
              icon="⚖️"
              title="Legal or compliance preparation"
              text="Initial KYC (Know Your Customer) or AML (Anti-Money Laundering) checks for Japanese counterparties. Note: This is a starting point — formal compliance requires certified registry documents."
            />
          </div>
        </div>
      </section>

      {/* ─── Section 2: Step-by-Step Verification Guide ───────────── */}
      <section className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How to verify a Japanese company: a 5-step guide
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            For most business situations, this 5-step process gives you 90% of
            what you need to confidently engage with a Japanese counterparty.
            Use this tool for steps 1-3 and government sources for steps 4-5.
          </p>
          <ol className="space-y-5">
            <Step
              id="step1"
              n={1}
              title="Search the company name"
              text="Type the company name above. If you only know the English/romaji version, type that — our tool auto-translates famous brands. For less-known companies, ask your Japanese contact for the official name in Japanese (it should be on their business card or invoices)."
            />
            <Step
              id="step2"
              n={2}
              title="Match the corporate number (法人番号)"
              text="The 13-digit corporate number is the unique identifier. Your contact should provide this number on invoices, contracts, or official correspondence. If they can't or won't provide it, that's a red flag. Match the number from your records to the search result exactly."
            />
            <Step
              id="step3"
              n={3}
              title="Verify the registered address"
              text="The address shown should match the address on their letterhead, invoices, or website. If addresses differ, ask why — many legitimate companies have multiple offices (head office vs. operations), but discrepancies should be explained. Watch out for addresses in buildings known to host hundreds of small companies (potential virtual offices)."
            />
            <Step
              id="step4"
              n={4}
              title="Check for an established track record"
              text="Look at the 'government records' count in the result. Companies with 100+ records have a substantial public footprint — patents, government contracts, certifications, etc. Companies with fewer than 5 records that claim to be major operations deserve extra scrutiny."
            />
            <Step
              id="step5"
              n={5}
              title="For high-stakes deals: get certified documents"
              text="If the deal is significant (six figures or more), request a 履歴事項全部証明書 (Certificate of All Historical Matters) from Japan's Legal Affairs Bureau (法務局). This shows full history including all directors, capital changes, and registered addresses. It costs about ¥600 and can be requested by anyone, including foreigners. A licensed Japanese accountant or lawyer can obtain it for you."
            />
          </ol>
        </div>
      </section>

      {/* ─── Section 3: Corporate Types Comparison Table ──────────── */}
      <section className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Japanese corporate types vs. US/UK equivalents
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Japan recognizes several types of legal business entities. Knowing
            the difference matters: the corporate type affects regulatory
            scrutiny, tax treatment, and how seriously the entity is generally
            regarded in business dealings.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                  <th className="px-3 py-2 font-semibold text-gray-900 dark:text-white">
                    Japanese
                  </th>
                  <th className="px-3 py-2 font-semibold text-gray-900 dark:text-white">
                    Code
                  </th>
                  <th className="px-3 py-2 font-semibold text-gray-900 dark:text-white">
                    English Name
                  </th>
                  <th className="px-3 py-2 font-semibold text-gray-900 dark:text-white">
                    US/UK Equivalent
                  </th>
                  <th className="px-3 py-2 font-semibold text-gray-900 dark:text-white">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <CorpRow
                  jp="株式会社"
                  code="KK"
                  en="Kabushiki Kaisha"
                  eq="Inc. / Ltd."
                  note="Most common. Required for IPO. Higher prestige."
                />
                <CorpRow
                  jp="合同会社"
                  code="GK"
                  en="Godo Kaisha"
                  eq="LLC"
                  note="Simpler & cheaper. Apple Japan and Amazon Japan are GK."
                />
                <CorpRow
                  jp="合資会社"
                  code="GS"
                  en="Goshi Kaisha"
                  eq="Limited Partnership"
                  note="Mixed liability. Rare today."
                />
                <CorpRow
                  jp="合名会社"
                  code="GM"
                  en="Gomei Kaisha"
                  eq="General Partnership"
                  note="Unlimited liability. Very rare."
                />
                <CorpRow
                  jp="有限会社"
                  code="YK"
                  en="Yugen Kaisha"
                  eq="Limited (legacy)"
                  note="Abolished in 2006. Existing YKs continue."
                />
                <CorpRow
                  jp="一般社団法人"
                  code="ISH"
                  en="Ippan Shadan Houjin"
                  eq="Non-profit Association"
                  note="Industry associations, member groups."
                />
                <CorpRow
                  jp="一般財団法人"
                  code="IZH"
                  en="Ippan Zaidan Houjin"
                  eq="Foundation"
                  note="Asset-based non-profit."
                />
                <CorpRow
                  jp="医療法人"
                  code="IH"
                  en="Iryou Houjin"
                  eq="Medical Organization"
                  note="Hospitals, clinics."
                />
                <CorpRow
                  jp="学校法人"
                  code="GH"
                  en="Gakkou Houjin"
                  eq="Educational Institution"
                  note="Private schools, universities."
                />
                <CorpRow
                  jp="宗教法人"
                  code="SH"
                  en="Shukyo Houjin"
                  eq="Religious Organization"
                  note="Temples, shrines, churches."
                />
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 italic">
            Tip: When verifying a major Japanese corporation, expect to see KK
            (株式会社). If a company claims to be a &quot;Japanese mega-corporation&quot;
            but is registered as GK or YK, dig deeper.
          </p>
        </div>
      </section>

      {/* ─── Section 4: Glossary ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Glossary: Japanese business terms you&apos;ll encounter
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Learning these terms will dramatically improve your effectiveness
            when dealing with Japanese corporate counterparties.
          </p>
          <dl className="grid md:grid-cols-2 gap-x-8 gap-y-5">
            <Term
              jp="法人番号"
              romaji="houjin bangou"
              def="Corporate number — Japan's 13-digit official ID for every registered organization. Equivalent to US EIN or UK Company Number."
            />
            <Term
              jp="株式会社 (KK)"
              romaji="kabushiki kaisha"
              def="Joint-stock company. The traditional, most respected corporate form in Japan."
            />
            <Term
              jp="合同会社 (GK)"
              romaji="godo kaisha"
              def="Limited liability company. Simpler than KK; popular with foreign-owned subsidiaries."
            />
            <Term
              jp="代表取締役"
              romaji="daihyou torishimariyaku"
              def="Representative director. The legally authorized signing authority — equivalent to a CEO."
            />
            <Term
              jp="取締役"
              romaji="torishimariyaku"
              def="Director. Member of the board of directors."
            />
            <Term
              jp="印鑑証明書"
              romaji="inkan shoumeisho"
              def="Seal certificate. Proves a company's official seal (印鑑) is registered with the government. Required for many formal contracts."
            />
            <Term
              jp="登記簿謄本"
              romaji="touki-bo touhon"
              def="Corporate registry transcript. Official record showing company history, directors, capital, and address changes."
            />
            <Term
              jp="履歴事項全部証明書"
              romaji="rireki jikou zenbu shoumeisho"
              def="Certificate of All Historical Matters. The most comprehensive corporate registry document; shows entire history."
            />
            <Term
              jp="決算公告"
              romaji="kessan koukoku"
              def="Annual financial filing. KK companies are legally required to publish abbreviated financial statements."
            />
            <Term
              jp="本店所在地"
              romaji="honten shozaichi"
              def="Registered head office address. The legal address of the company; should match what they show on invoices."
            />
            <Term
              jp="資本金"
              romaji="shihonkin"
              def="Paid-in capital. The capital contributed by shareholders. Often used as a rough indicator of company size."
            />
            <Term
              jp="設立年月日"
              romaji="setsuritsu nengappi"
              def="Date of incorporation. When the company was officially registered."
            />
          </dl>
        </div>
      </section>

      {/* ─── Section 5: Red Flags ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-gray-50 dark:bg-danger/20 border-2 border-gray-200 dark:border-danger rounded-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-danger dark:text-gin mb-4">
            🚩 Red flags when verifying a Japanese company
          </h2>
          <p className="text-danger dark:text-gin mb-6">
            These warning signs don&apos;t always mean fraud, but each one warrants
            additional verification before you commit money or sign contracts:
          </p>
          <div className="space-y-4">
            <RedFlag
              title="Name closely mimics a famous brand"
              text="Watch for variations like 'Sony Trading Co.' or 'Toyota International Corp' that are not actually part of the famous brand. Many scams rely on confusingly similar names. Verify the corporate number matches the official entity."
            />
            <RedFlag
              title="Zero government records on a 'major' company"
              text="If a company claims to be a large operation but has zero records in gBizINFO, something is off. Genuine large businesses accumulate patents, contracts, certifications, and filings over time."
            />
            <RedFlag
              title="GK (合同会社) claiming to be a major corporation"
              text="Most major Japanese corporations are KK (株式会社). A GK claiming significant scale is unusual — possible, but verify size with other sources (employees, revenue, etc.)."
            />
            <RedFlag
              title="Address in a known virtual-office building"
              text="Some buildings host hundreds of registered companies that don't actually operate there. If the address looks generic or appears for many unrelated companies, ask for proof of physical operations."
            />
            <RedFlag
              title="Recent registration but claims long history"
              text="The setsuritsu nengappi (incorporation date) should match claims of company age. A company registered 6 months ago can't have '20 years of experience.'"
            />
            <RedFlag
              title="Counterparty refuses to share corporate number"
              text="Every legitimate Japanese business knows their 法人番号 and should share it readily. Refusal or vague responses are major warning signs."
            />
            <RedFlag
              title="Bank account name doesn't match corporate name"
              text="Wire transfers should go to an account in the company's exact registered name. Personal accounts or unrelated company names are classic invoice-fraud indicators."
            />
          </div>
        </div>
      </section>

      {/* ─── Section 6: About gBizINFO ────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            About gBizINFO and METI: where this data comes from
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Our search tool queries the official{" "}
            <strong>gBizINFO API</strong>, a comprehensive corporate
            information database operated by{" "}
            <strong>
              METI — the Ministry of Economy, Trade and Industry
            </strong>{" "}
            of Japan. METI is one of Japan&apos;s most powerful and respected
            government ministries, responsible for industrial policy, trade
            regulation, and corporate oversight.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            gBizINFO aggregates corporate data from multiple authoritative
            sources:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
            <li>
              <strong>National Tax Agency (国税庁)</strong> — basic corporate
              registration: name, address, corporate number
            </li>
            <li>
              <strong>Japan Patent Office (特許庁)</strong> — patents, trademarks,
              and intellectual property records
            </li>
            <li>
              <strong>Ministry of Land (国土交通省)</strong> — construction and
              real estate registrations
            </li>
            <li>
              <strong>Financial Services Agency (金融庁)</strong> — financial
              filings for publicly-listed companies
            </li>
            <li>
              <strong>Various ministries</strong> — government contracts,
              subsidies awarded, certifications, and industry-specific
              registrations
            </li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Because gBizINFO aggregates from official government sources, the
            data is the same authoritative information that Japanese banks,
            lawyers, accountants, and government agencies use. The data is
            updated monthly and provided as a public service to support
            transparent business in Japan.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            For questions on data interpretation that go beyond what this tool
            offers, you can visit the official{" "}
            <a
              href="https://info.gbiz.go.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-kon dark:text-gray-300 hover:underline"
            >
              gBizINFO portal
            </a>{" "}
            (Japanese only) or consult a Japanese{" "}
            <strong>certified public accountant (公認会計士)</strong> or{" "}
            <strong>licensed administrative scrivener (行政書士)</strong>.
          </p>
        </div>
      </section>

      {/* ─── Section 7: FAQ ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently asked questions
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Common questions from foreign users searching Japanese companies.
            Click any question to expand the answer.
          </p>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <summary className="cursor-pointer px-4 py-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold text-gray-900 dark:text-white flex items-start gap-2">
                  <span className="text-kon dark:text-gray-300 group-open:rotate-90 transition-transform">
                    ▸
                  </span>
                  <span>{faq.q}</span>
                </summary>
                <div className="faq-answer px-4 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Related links ──────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-gray-50 dark:bg-kon/20 border border-gray-200 dark:border-kon rounded-xl p-5">
          <h2 className="text-base font-semibold text-kon dark:text-gray-300 mb-2">
            Looking for the Japanese version?
          </h2>
          <p className="text-sm text-kon dark:text-gray-300 mb-3">
            日本語をお使いの方は、日本語版の法人検索ツールをご利用いただけます。
          </p>
          <Link
            href="/business/houjin-search"
            className="inline-block px-4 py-2 bg-kon hover:bg-ai text-white text-sm font-semibold rounded-lg transition"
          >
            日本語版 法人検索ツール →
          </Link>
        </div>
      </section>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function CompanyCard({ corp }: { corp: CorpResult }) {
  const activityBadge = getActivityBadge(corp.number_of_activity);
  const matchBadge = getMatchBadge(corp.match_score);

  const activityToneClass = {
    trust:
      "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200",
    ok: "bg-gray-50 dark:bg-kon/40 text-kon dark:text-gray-300",
    neutral: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200",
    warn: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200",
  }[activityBadge.tone];

  const matchToneClass = {
    strong: "bg-green-600 text-white",
    ok: "bg-kon text-white",
    weak: "bg-gray-400 dark:bg-gray-600 text-white",
  }[matchBadge.tone];

  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-ai dark:hover:border-ai transition">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 break-words">
            {corp.name_en || corp.name}
          </h3>
          {corp.name_en && (
            <p className="text-base text-gray-700 dark:text-gray-300 break-words">
              {corp.name}
            </p>
          )}
        </div>
        <span
          className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${matchToneClass}`}
        >
          {matchBadge.label}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-3 text-xs">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${activityToneClass}`}
          title={activityBadge.hint}
        >
          {activityBadge.icon} {activityBadge.label}
        </span>
        {corp.corp_type_info && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full font-medium">
            {corp.corp_type_info.code} · {corp.corp_type_info.en_short}
          </span>
        )}
      </div>

      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div>
          <dt className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide mb-0.5">
            Corporate Number
          </dt>
          <dd className="text-gray-900 dark:text-white font-mono">
            {corp.corporate_number}
          </dd>
        </div>
        {corp.location && (
          <div>
            <dt className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide mb-0.5">
              Address
            </dt>
            <dd className="text-gray-900 dark:text-white text-sm">
              {corp.postal_code && `〒${corp.postal_code} `}
              {corp.location}
            </dd>
          </div>
        )}
        {corp.representative_name && (
          <div className="md:col-span-2">
            <dt className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide mb-0.5">
              Representative
            </dt>
            <dd className="text-gray-900 dark:text-white">
              {corp.representative_name}
            </dd>
          </div>
        )}
      </dl>

      {corp.corp_type_info && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-kon dark:text-gray-300 hover:underline">
            What is &quot;{corp.corp_type_info.en_full}&quot;?
          </summary>
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-700 dark:text-gray-300">
            <p>
              <strong>{corp.corp_type_info.code}</strong> ={" "}
              <strong>{corp.corp_type_info.en_full}</strong> (
              {corp.corp_type_info.japanese})
            </p>
            <p className="mt-1">
              US equivalent:{" "}
              <strong>{corp.corp_type_info.us_equivalent}</strong>
            </p>
            <p className="mt-1">{corp.corp_type_info.description}</p>
          </div>
        </details>
      )}
    </article>
  );
}

function UseCase({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0" aria-hidden>
          {icon}
        </span>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
        </div>
      </div>
    </div>
  );
}

function Step({
  id,
  n,
  title,
  text,
}: {
  id?: string;
  n: number;
  title: string;
  text: string;
}) {
  return (
    <li id={id} className="flex gap-4 scroll-mt-20">
      <span className="flex-shrink-0 w-9 h-9 bg-kon text-white rounded-full flex items-center justify-center font-bold text-sm">
        {n}
      </span>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
      </div>
    </li>
  );
}

function CorpRow({
  jp,
  code,
  en,
  eq,
  note,
}: {
  jp: string;
  code: string;
  en: string;
  eq: string;
  note: string;
}) {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
        {jp}
      </td>
      <td className="px-3 py-2 font-mono text-xs">{code}</td>
      <td className="px-3 py-2">{en}</td>
      <td className="px-3 py-2">{eq}</td>
      <td className="px-3 py-2 text-xs">{note}</td>
    </tr>
  );
}

function Term({
  jp,
  romaji,
  def,
}: {
  jp: string;
  romaji: string;
  def: string;
}) {
  return (
    <div>
      <dt className="font-semibold text-gray-900 dark:text-white mb-1">
        {jp}{" "}
        <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
          ({romaji})
        </span>
      </dt>
      <dd className="text-sm text-gray-700 dark:text-gray-300">{def}</dd>
    </div>
  );
}

function RedFlag({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-l-4 border-danger pl-4 py-1">
      <h3 className="font-semibold text-danger dark:text-gin mb-1">
        {title}
      </h3>
      <p className="text-sm text-danger/90 dark:text-gin/90">{text}</p>
    </div>
  );
}
