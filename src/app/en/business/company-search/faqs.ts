/**
 * SAVE THIS FILE AS (REPLACE EXISTING):
 *   ~/projects/3websitepassive_income/yamada-tools/frontend-staging/src/app/en/business/company-search/faqs.ts
 *
 * Changes vs. old file:
 *   - PRESERVED all 15 original FAQs (no edits)
 *   - ADDED 5 new FAQs targeting high-value long-tail keywords:
 *       16. "How do I check a Japanese company for free?" (head term)
 *       17. "What is METI gBizINFO?" (entity SEO + AI citation)
 *       18. "Can I verify a Japanese supplier before paying?" (anti-scam intent)
 *       19. "Difference between corporate number and tax invoice number (T-number)?"
 *       20. "Is this tool good enough for KYB compliance?" (compliance/legal intent)
 *
 *   These 5 new FAQs target the highest-intent English keywords that have
 *   ZERO good answers ranking today. AI search engines will cite our answers.
 */

export const FAQS = [
  {
    q: "What is a 法人番号 (Houjin Bangou / Corporate Number)?",
    a: "It's Japan's official 13-digit corporate identification number, issued by the National Tax Agency to every registered business entity. It functions like a US EIN or UK Company Number. Every Japanese company, non-profit, school, and government agency has a unique 法人番号. You can use it to verify the official identity of any Japanese organization.",
  },
  {
    q: "What's the difference between Kabushiki Kaisha (KK) and Godo Kaisha (GK)?",
    a: "KK (株式会社) is the traditional joint-stock company, similar to a US Inc. or UK Ltd. — it's larger, has shareholders, and carries more prestige. GK (合同会社) is similar to a US LLC — simpler structure, fewer requirements, easier to set up. Most large Japanese companies are KK. Foreign businesses entering Japan often choose GK because it's faster to register and cheaper to maintain.",
  },
  {
    q: "How do I verify if a Japanese company actually exists?",
    a: "Search the company name in this tool. If a result appears with a 13-digit Corporate Number (法人番号) and an official address, the company is registered with Japan's National Tax Agency. Higher 'government records' counts indicate more substantial business activity. For high-stakes deals, also cross-check with Japan's official corporate registry (Houjin Bangou Site) and request a registered company seal certificate (印鑑証明書).",
  },
  {
    q: "What does the 'government records' count mean?",
    a: "This is the number of times a company appears in official government databases — including patents, government contracts, subsidies received, financial filings, certifications, and announcements. Companies with 100+ records are firmly established. Companies with thousands have decades of operating history. Zero records doesn't always mean fake — small businesses may legitimately have few public records — but it warrants extra caution for unknown entities.",
  },
  {
    q: "Why do I see multiple companies with similar names?",
    a: "Japanese law allows multiple companies to share names as long as they have different corporate addresses. This is especially common with regional subsidiaries (e.g., 'Tokyo Toyota', 'Osaka Toyota') or unrelated companies that happen to share a word. Always verify the corporate number, address, and 法人番号 — not just the name — when identifying a specific entity.",
  },
  {
    q: "Is gBizINFO data official and trustworthy?",
    a: "Yes. gBizINFO is operated by METI (Ministry of Economy, Trade and Industry), one of Japan's most powerful government ministries. It aggregates official data from the National Tax Agency, the Patent Office, financial regulators, and other government sources. The data is the authoritative public record — the same data Japanese banks, lawyers, and accountants reference.",
  },
  {
    q: "Can I find the CEO or executives of a Japanese company here?",
    a: "Some companies show their representative director (代表取締役) in the result. However, gBizINFO does not provide full executive lists. For comprehensive officer information, consult the official corporate registry (履歴事項全部証明書) from the Legal Affairs Bureau (法務局), which lists all directors and capital structure.",
  },
  {
    q: "Why do my English searches sometimes find the wrong company?",
    a: "The gBizINFO API only matches Japanese names. When you type 'Toyota' in English, our tool automatically tries Japanese variations like トヨタ自動車 and トヨタ自動車株式会社. For famous brands, this works well. For less common names, try entering the company's official Japanese name directly for better results.",
  },
  {
    q: "What does the activity score / match score mean?",
    a: "Match score (0–100) reflects how likely a result matches your search intent — based on company size, government records, name match, and entity type. Activity score reflects how established the company is — based on the number of public government records. We use both to push real, established companies above shell companies and unrelated subsidiaries with similar names.",
  },
  {
    q: "Is this service free? Will I be charged?",
    a: "Yes, completely free. No registration, no login, no credit card. We use Japan's official public gBizINFO data, which is free for public use. We cache responses for 24 hours to be respectful of the API's rate limits.",
  },
  {
    q: "How current is the data?",
    a: "gBizINFO updates monthly with data from the National Tax Agency. Most company information (name, address, status) is current within 30 days. Newly registered companies may take 1–2 months to appear. For urgent verification, supplement with a direct check at the Houjin Bangou Site or request fresh corporate registry documents.",
  },
  {
    q: "Can I search for a company by its corporate number directly?",
    a: "Yes — if you already know the 13-digit corporate number, you can use our detail lookup. From any search result, the corporate number is shown prominently. Knowing the corporate number is the fastest way to confirm you're looking at the exact entity, since names can be ambiguous.",
  },
  {
    q: "What information should I trust most when verifying a Japanese supplier?",
    a: "In order of reliability: (1) The 13-digit corporate number — uniquely identifies the entity. (2) Registered address — must match the address on invoices and contracts. (3) Government records count — indicates how active and established the business is. (4) Corporate type — KK has more regulatory oversight than GK. Red flags: addresses that look generic (virtual offices), zero government records combined with a recent registration date, names that closely mimic famous brands.",
  },
  {
    q: "What are common red flags when checking a Japanese company?",
    a: "Watch for: (1) The company name closely mimics a famous brand but is technically different (e.g., 'Sony Trading' instead of 'Sony Group'). (2) Zero or very low government records on a company claiming to be a major business. (3) Address is in a building known for housing virtual office services. (4) The corporate type is GK (合同会社) but they claim to be a large corporation — major Japanese corporations are almost always KK (株式会社). (5) Recent registration date (under 1 year) for a company claiming long history.",
  },
  {
    q: "Can I use this for due diligence on a potential business partner?",
    a: "Use this as the first step of due diligence — it confirms basic existence and gives you key reference data. For full due diligence on significant deals, you should also: request a corporate registry certificate (履歴事項全部証明書), check financial statements through EDINET if they're publicly listed, request bank references, and consider hiring a licensed Japanese accountant (公認会計士) or lawyer (弁護士) for formal investigation.",
  },
  // ─── NEW: 5 long-tail SEO entries ───────────────────────────────────────
  {
    q: "How do I check a Japanese company for free?",
    a: "Use this Japan Company Search tool. It is completely free, requires no registration, and pulls live data from METI gBizINFO — Japan's official government corporate database covering 5+ million registered companies. Type the company name in English (e.g., Toyota), romaji, or Japanese. Each result returns the official 13-digit corporate number, registered address, registration date, corporate type, and government activity records. No credit card, no signup, no usage limits for normal use.",
  },
  {
    q: "What is METI gBizINFO and why is it trustworthy?",
    a: "gBizINFO is the official public corporate information database operated by METI (Ministry of Economy, Trade and Industry of Japan). It aggregates authoritative data from multiple Japanese government sources: the National Tax Agency (corporate registration), the Japan Patent Office (patents and trademarks), the Financial Services Agency (public company filings), the Ministry of Land (construction registrations), and various other ministries. Because the data comes directly from government sources, it is the same authoritative information that Japanese banks, lawyers, accountants, and courts reference. It is updated monthly and free for public use.",
  },
  {
    q: "Can I verify a Japanese supplier before sending payment?",
    a: "Yes, and you should always do this before sending an international wire transfer to a Japanese company. (1) Ask the supplier for their official Japanese company name and 13-digit corporate number (法人番号). Every legitimate Japanese business has one. (2) Search for them in this tool and confirm the corporate number, registered address, and corporate type match what they told you. (3) Verify the bank account name on the invoice matches the registered company name exactly. (4) For deals above a few thousand US dollars, also request a 履歴事項全部証明書 (Certificate of All Historical Matters) from Japan's Legal Affairs Bureau. Walk away from any 'supplier' who refuses to share their corporate number.",
  },
  {
    q: "What's the difference between the corporate number (法人番号) and the tax invoice number (T-number)?",
    a: "Both numbers identify the same Japanese company, but they serve different purposes. The 法人番号 (Houjin Bangou) is the 13-digit corporate number issued by the National Tax Agency for general corporate identification — like a US EIN. The T-number (Tの数字, also called 適格請求書発行事業者番号 or Qualified Invoice Issuer Number) is the same 13-digit number prefixed with the letter 'T' (e.g., T1234567890123), used specifically for Japan's consumption tax invoice system (インボイス制度), which started in October 2023. Not every Japanese company has a T-number — only businesses that registered as qualified invoice issuers do. Every business that has a T-number also has a 法人番号 (they're the same 13 digits).",
  },
  {
    q: "Is this tool good enough for formal KYB or compliance checks?",
    a: "This tool is excellent for the first stage of Know Your Business (KYB) checks: confirming a Japanese counterparty exists, has a valid corporate number, and is registered with the National Tax Agency. For low-risk transactions, casual due diligence, or initial supplier screening, it provides everything you need. However, for regulated industries (banking, securities, insurance, fintech, government contracting) or high-value deals where you must demonstrate formal AML/CFT compliance to a regulator, supplement this tool with: (1) a certified corporate registry document (履歴事項全部証明書) from the Legal Affairs Bureau, (2) UBO/beneficial owner verification, (3) sanctions and PEP screening, and (4) ongoing transaction monitoring. For formal regulated KYB you may need a licensed KYB service provider.",
  },
];
