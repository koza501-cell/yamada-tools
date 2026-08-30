import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// ─── Types ─────────────────────────────────────────────────────────────────
interface CompanyBasic {
  name: string;
  name_kana: string;
  name_en: string;
  location: string;
  postal_code: string;
  capital_stock: number | string;
  employee_number: number | string;
  representative_name: string;
  company_url: string;
  date_of_establishment: string;
  founding_year: number | string;
  business_summary: string;
  update_date: string;
  status: string;
  company_size_male: string;
  company_size_female: string;
  business_items: string | string[];
}

interface SubsidyItem {
  title?: string;
  date_of_approval?: string;
  subsidy_resource?: string;
  government_departments?: string;
  amount?: number;
  target?: string;
}

interface ProcurementItem {
  title?: string;
  date_of_order?: string;
  amount?: number;
  government_departments?: string;
  joint_signatures?: string[] | string | null;
}

interface CertificationItem {
  title?: string;
  date_of_approval?: string;
  government_departments?: string;
  target?: string;
}

interface FinanceItem {
  fiscal_year_cover_page?: string;
  name_major_shareholders?: string;
  accounting_standards?: string;
  major_shareholders?: any;
  net_income?: number;
  net_sales?: number;
  ordinary_income?: number;
  total_assets?: number;
}

interface CommendationItem {
  title?: string;
  date_of_commendation?: string;
  government_departments?: string;
  target?: string;
}

interface CompanyProfile {
  corporate_number: string;
  basic: CompanyBasic;
  finance: FinanceItem[];
  subsidy: SubsidyItem[];
  procurement: ProcurementItem[];
  certification: CertificationItem[];
  commendation: CommendationItem[];
  fetched_at: string;
}

interface RelatedCompany {
  corporate_number: string;
  name: string;
}

// ─── Data Fetching (Server-Side) ───────────────────────────────────────────
const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

async function fetchProfile(corporateNumber: string): Promise<CompanyProfile | null> {
  try {
    const res = await fetch(`${API_BASE}/api/gbiz/profile/${corporateNumber}`, {
      next: { revalidate: 2592000 }, // 30 days
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.detail || !data?.basic) return null;
    return data as CompanyProfile;
  } catch {
    return null;
  }
}

async function fetchRelated(corporateNumber: string): Promise<RelatedCompany[]> {
  try {
    const res = await fetch(`${API_BASE}/api/gbiz/related/${corporateNumber}`, {
      next: { revalidate: 2592000 }, // 30 days, matches profile cache
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.related) ? data.related : [];
  } catch {
    return [];
  }
}

async function fetchProfileFresh(corporateNumber: string): Promise<CompanyProfile | null> {
  try {
    const res = await fetch(`${API_BASE}/api/gbiz/profile/${corporateNumber}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.detail || !data?.basic) return null;
    return data as CompanyProfile;
  } catch {
    return null;
  }
}

// ─── Dynamic Metadata ──────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ corporateNumber: string }>;
}): Promise<Metadata> {
  const { corporateNumber } = await params;
  const profile = await fetchProfile(corporateNumber);
  if (!profile) {
    return { title: "法人情報が見つかりません | 山田ツール" };
  }

  const name = profile.basic.name;
  const location = profile.basic.location || "";
  const title = `${name}（法人番号：${corporateNumber}）| 法人情報・補助金・財務データ | 山田ツール`;
  const rawDesc = `${name}の法人情報を無料で閲覧。所在地：${location}。基本情報に加え、補助金・入札・認定・財務データを1ページで確認。出典：経済産業省Gビズインフォ`;
  const description = rawDesc.length > 150 ? rawDesc.slice(0, 150) + "…" : rawDesc;

  return {
    title,
    description,
    openGraph: {
      title: `${name} | 法人情報 | 山田ツール`,
      description,
      type: "website",
    },
    alternates: {
      canonical: `https://yamada-tools.jp/business/houjin/${corporateNumber}`,
    },
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function formatCurrency(value: number | string | undefined): string {
  if (value == null || value === "") return "";
  const num = typeof value === "string" ? parseInt(value, 10) : value;
  if (isNaN(num) || num === 0) return "";
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(1).replace(/\.0$/, "")}億円`;
  }
  if (num >= 10000) {
    return `${(num / 10000).toFixed(0)}万円`;
  }
  return `${num.toLocaleString()}円`;
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  } catch {
    return dateStr;
  }
}

function cleanRepresentativeName(name: string): string {
  if (!name) return "";
  // Remove role prefix and extra spaces
  return name
    .replace(/^(取締役社長|代表取締役|取締役|代表社員|代表理事)\s*/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ─── Icons (inline SVG — no lucide-react) ──────────────────────────────────
const Icons = {
  building: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>
  ),
  yen: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
  ),
  briefcase: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
  ),
  award: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
  ),
  shield: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  chart: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  ),
  search: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  link: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
  ),
};

// ─── Section Component ─────────────────────────────────────────────────────
function Section({
  title,
  icon,
  children,
  emptyText,
  isEmpty,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  emptyText?: string;
  isEmpty?: boolean;
}) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2.5">
        <span className="text-blue-600 dark:text-blue-400">{icon}</span>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="p-5">
        {isEmpty ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-3">
            {emptyText || "該当データなし"}
          </p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

// ─── Info Row ──────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string | React.ReactNode }) {
  if (!value || value === "" || value === "0") return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start py-2.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-40 shrink-0 mb-0.5 sm:mb-0">
        {label}
      </dt>
      <dd className="text-sm text-gray-900 dark:text-gray-100">{value}</dd>
    </div>
  );
}

// ─── Data Table ────────────────────────────────────────────────────────────
function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) {
  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-600">
            {headers.map((h, i) => (
              <th
                key={i}
                className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider first:pl-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750"
            >
              {row.map((cell, ci) => (
                <td key={ci} className="py-2.5 px-3 text-gray-700 dark:text-gray-300 first:pl-0">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── JSON-LD Schema ────────────────────────────────────────────────────────
function CompanySchema({ profile }: { profile: CompanyProfile }) {
  const b = profile.basic;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: b.name,
    ...(b.name_en && { alternateName: b.name_en }),
    taxID: profile.corporate_number,
    ...(b.location && {
      address: {
        "@type": "PostalAddress",
        streetAddress: b.location,
        addressCountry: "JP",
        ...(b.postal_code && { postalCode: b.postal_code }),
      },
    }),
    ...(b.company_url && { url: b.company_url }),
    ...(b.date_of_establishment && { foundingDate: b.date_of_establishment }),
    ...(b.employee_number && {
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        value: Number(b.employee_number) || 0,
      },
    }),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
      {
        "@type": "ListItem",
        position: 2,
        name: "ビジネスツール",
        item: "https://yamada-tools.jp/business/houjin-search",
      },
      { "@type": "ListItem", position: 3, name: b.name },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}

// ─── Page Component ────────────────────────────────────────────────────────
export const dynamicParams = true;
// revalidate handled per-fetch

export default async function HoujinProfilePage({
  params,
}: {
  params: Promise<{ corporateNumber: string }>;
}) {
  const { corporateNumber } = await params;

  // Validate format
  if (!/^\d{13}$/.test(corporateNumber)) {
    notFound();
  }

  const profile = await fetchProfile(corporateNumber);
  if (!profile) {
    notFound();
  }

  const related = await fetchRelated(corporateNumber);

  const b = profile.basic;
  const hasFinance = profile.finance.length > 0;
  const hasSubsidy = profile.subsidy.length > 0;
  const hasProcurement = profile.procurement.length > 0;
  const hasCertification = profile.certification.length > 0;
  const hasCommendation = profile.commendation.length > 0;

  const subsidyHasResource = profile.subsidy.some((s) => s.subsidy_resource);
  const subsidyHasTarget = profile.subsidy.some((s) => s.target);
  const procHasJoint = profile.procurement.some((p) =>
    Array.isArray(p.joint_signatures) ? p.joint_signatures.length > 0 : !!p.joint_signatures
  );
  const certHasTarget = profile.certification.some((c) => c.target);
  const commendHasTarget = profile.commendation.some((c) => c.target);
  const financeAccounting = profile.finance.find((f) => f.accounting_standards)?.accounting_standards;
  const hasMajorShareholders = profile.finance.some((f) => f.major_shareholders);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6">
      <CompanySchema profile={profile} />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            ホーム
          </Link>
          <span>/</span>
          <Link
            href="/business/houjin-search"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            法人検索
          </Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300 font-medium">{b.name}</span>
        </nav>

        {/* Header */}
        <header className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {b.name}
              </h1>
              {b.name_kana && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{b.name_kana}</p>
              )}
              {b.name_en && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{b.name_en}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  b.status === "閉鎖"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                }`}
              >
                {b.status === "閉鎖" ? "登記閉鎖" : "営業中"}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            法人番号：{corporateNumber}
          </p>
        </header>

        {/* 1. Basic Info */}
        <Section title="基本情報" icon={Icons.building}>
          <dl className="divide-y-0">
            <InfoRow label="所在地" value={b.postal_code ? `〒${b.postal_code.replace(/(\d{3})(\d{4})/, "$1-$2")} ${b.location}` : b.location} />
            <InfoRow label="代表者" value={cleanRepresentativeName(b.representative_name)} />
            <InfoRow
              label="資本金"
              value={formatCurrency(b.capital_stock)}
            />
            <InfoRow
              label="従業員数"
              value={
                b.employee_number
                  ? `${Number(b.employee_number).toLocaleString()}名`
                  : ""
              }
            />
            <InfoRow label="設立日" value={formatDate(b.date_of_establishment)} />
            {b.founding_year ? (
              <InfoRow label="設立年" value={`${b.founding_year}年`} />
            ) : null}
            <InfoRow
              label="従業員内訳"
              value={
                b.company_size_male || b.company_size_female
                  ? [
                      b.company_size_male ? `男性 ${Number(b.company_size_male).toLocaleString()}名` : "",
                      b.company_size_female ? `女性 ${Number(b.company_size_female).toLocaleString()}名` : "",
                    ]
                      .filter(Boolean)
                      .join(" / ")
                  : ""
              }
            />
            <InfoRow label="事業概要" value={b.business_summary} />
            {b.company_url && (
              <InfoRow
                label="ウェブサイト"
                value={
                  <a
                    href={b.company_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    {b.company_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    {Icons.link}
                  </a>
                }
              />
            )}
            <InfoRow label="最終更新" value={formatDate(b.update_date)} />
          </dl>
        </Section>

        {/* 2. Subsidy */}
        <Section
          title="補助金情報"
          icon={Icons.yen}
          isEmpty={!hasSubsidy}
          emptyText="補助金の受給実績はありません。国の補助金を受給した法人のみ表示されます。"
        >
          <DataTable
            headers={[
              "補助金名", "省庁", "金額", "交付日",
              ...(subsidyHasResource ? ["財源"] : []),
              ...(subsidyHasTarget ? ["対象"] : []),
            ]}
            rows={profile.subsidy.slice(0, 20).map((s) => [
              <span key="t" className="font-medium max-w-[280px] block truncate" title={s.title}>
                {s.title || "-"}
              </span>,
              s.government_departments || "-",
              s.amount ? formatCurrency(s.amount) : "-",
              formatDate(s.date_of_approval) || "-",
              ...(subsidyHasResource ? [s.subsidy_resource || ""] : []),
              ...(subsidyHasTarget ? [s.target || ""] : []),
            ])}
          />
          {profile.subsidy.length > 20 && (
            <p className="text-xs text-gray-500 mt-3">
              他 {profile.subsidy.length - 20}件の補助金情報があります
            </p>
          )}
        </Section>

        {/* 3. Procurement */}
        <Section
          title="入札・調達情報"
          icon={Icons.briefcase}
          isEmpty={!hasProcurement}
          emptyText="官公庁との調達・入札実績はありません。政府調達で落札した法人のみ表示されます。"
        >
          <DataTable
            headers={[
              "案件名", "発注機関", "金額", "契約日",
              ...(procHasJoint ? ["共同受注"] : []),
            ]}
            rows={profile.procurement.slice(0, 20).map((p) => [
              <span key="t" className="font-medium max-w-[280px] block truncate" title={p.title}>
                {p.title || "-"}
              </span>,
              p.government_departments || "-",
              p.amount ? formatCurrency(p.amount) : "-",
              formatDate(p.date_of_order) || "-",
              ...(procHasJoint
                ? [
                    Array.isArray(p.joint_signatures)
                      ? p.joint_signatures.join("・")
                      : p.joint_signatures || "",
                  ]
                : []),
            ])}
          />
          {profile.procurement.length > 20 && (
            <p className="text-xs text-gray-500 mt-3">
              他 {profile.procurement.length - 20}件の調達情報があります
            </p>
          )}
        </Section>

        {/* 4. Certification */}
        <Section
          title="届出・認定情報"
          icon={Icons.shield}
          isEmpty={!hasCertification}
          emptyText="届出・認定の実績はありません。各種認定を取得した法人のみ表示されます。"
        >
          <DataTable
            headers={[
              "認定名", "認定機関", "認定日",
              ...(certHasTarget ? ["対象"] : []),
            ]}
            rows={profile.certification.slice(0, 20).map((c) => [
              <span key="t" className="font-medium max-w-[280px] block truncate" title={c.title}>
                {c.title || "-"}
              </span>,
              c.government_departments || "-",
              formatDate(c.date_of_approval) || "-",
              ...(certHasTarget ? [c.target || ""] : []),
            ])}
          />
          {profile.certification.length > 20 && (
            <p className="text-xs text-gray-500 mt-3">
              他 {profile.certification.length - 20}件の認定情報があります
            </p>
          )}
        </Section>

        {/* 5. Finance */}
        <Section
          title="財務情報"
          icon={Icons.chart}
          isEmpty={!hasFinance}
          emptyText="財務情報は公開されていません。官報に決算公告を掲載し、Gビズインフォでの公開を許諾した法人のみ表示されます。"
        >
          <DataTable
            headers={["決算期", "売上高", "経常利益", "当期純利益", "総資産"]}
            rows={profile.finance.slice(0, 10).map((f) => [
              f.fiscal_year_cover_page || "-",
              f.net_sales != null ? formatCurrency(f.net_sales) : "-",
              f.ordinary_income != null ? formatCurrency(f.ordinary_income) : "-",
              f.net_income != null ? formatCurrency(f.net_income) : "-",
              f.total_assets != null ? formatCurrency(f.total_assets) : "-",
            ])}
          />
          {financeAccounting && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              会計基準：{financeAccounting}
            </p>
          )}
          {hasMajorShareholders && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                主要株主
              </p>
              {profile.finance
                .filter((f) => f.major_shareholders)
                .slice(0, 1)
                .map((f, i) => (
                  <div key={i} className="text-sm text-gray-700 dark:text-gray-300">
                    {Array.isArray(f.major_shareholders) ? (
                      <ul className="space-y-0.5 list-disc list-inside">
                        {(f.major_shareholders as any[]).map((sh, j) => (
                          <li key={j}>
                            {typeof sh === "string" ? sh : (sh as any).name ?? JSON.stringify(sh)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{String(f.major_shareholders)}</p>
                    )}
                  </div>
                ))}
            </div>
          )}
        </Section>

        {/* 6. Commendation */}
        <Section
          title="表彰情報"
          icon={Icons.award}
          isEmpty={!hasCommendation}
          emptyText="官公庁からの表彰実績はありません。政府から表彰を受けた法人のみ表示されます。"
        >
          <DataTable
            headers={[
              "表彰名", "省庁", "表彰日",
              ...(commendHasTarget ? ["対象"] : []),
            ]}
            rows={profile.commendation.slice(0, 20).map((c) => [
              <span key="t" className="font-medium max-w-[280px] block truncate" title={c.title}>
                {c.title || "-"}
              </span>,
              c.government_departments || "-",
              formatDate(c.date_of_commendation) || "-",
              ...(commendHasTarget ? [c.target || ""] : []),
            ])}
          />
        </Section>

        {/* 6.5. Related Companies (same registered postal-code area) */}
        {related.length > 0 && (
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              近隣の企業
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              登記上の郵便番号が近い法人（国税庁法人番号公表サイトのデータに基づく）
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {related.map((r) => (
                <Link
                  key={r.corporate_number}
                  href={`/business/houjin/${r.corporate_number}`}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline truncate py-1"
                  title={r.name}
                >
                  {r.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 7. Related Tools */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            関連ツール
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                href: "/business/houjin-search",
                title: "法人検索ツール",
                desc: "他の法人を検索する",
              },
              {
                href: "/business/hojokin-active",
                title: "補助金公募情報",
                desc: "最新の補助金公募を確認",
              },
              {
                href: "/business/houjin-zaimu",
                title: "法人財務情報",
                desc: "財務データを詳しく分析",
              },
              {
                href: "/business/houjin-nyusatsu",
                title: "入札情報検索",
                desc: "官公庁の入札情報を検索",
              },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <span className="text-blue-600 dark:text-blue-400">{Icons.search}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 8. Source Attribution & Disclaimer */}
        <footer className="text-xs text-gray-400 dark:text-gray-500 space-y-1 pb-8">
          <p>出典：経済産業省Gビズインフォ（gBizINFO）</p>
          <p>出典：国税庁法人番号公表サイト</p>
          <p>
            本ページの情報は政府のオープンデータに基づいています。
            情報の正確性については出典元をご確認ください。
            最終データ取得：{formatDate(profile.fetched_at)}
          </p>
        </footer>
      </div>
    </div>
  );
}
