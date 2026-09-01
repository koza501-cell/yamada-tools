import { Metadata } from "next";
import HubLayout, { HubSection } from "@/components/hub/HubLayout";
import { documentTools, generatorTools, convertTools } from "@/config/tools";

// ============================================================
// /document — ビジネス書類 hub (BLUE theme, FEATURED niche)
// ============================================================
// Combines: documentTools + selected generator tools (envelope, hanko, T-num)
// + selected convert tools (bank-format) for a complete business workflow.
// ============================================================

export const metadata: Metadata = {
  title: "ビジネス書類作成ツール【無料】請求書・見積書・封筒印刷・全銀フォーマット",
  description:
    "請求書・見積書・履歴書・封筒印刷・全銀フォーマット・電子印鑑など、日本のビジネスに必要な書類を無料で作成。インボイス対応・登録不要・日本国内サーバー処理。",
  keywords:
    "請求書作成, 見積書作成, 履歴書作成, 封筒印刷, 全銀フォーマット, 電子印鑑, ビジネスメール, 送付状, インボイス, 無料",
  alternates: {
    canonical: "https://yamada-tools.jp/document",
  },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "ビジネス書類作成ツール【無料】 | 山田ツール",
    description:
      "請求書・見積書・封筒印刷・全銀フォーマットなど、日本のビジネスに必要な25種以上のツールを無料で。",
    url: "https://yamada-tools.jp/document",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
    { "@type": "ListItem", position: 2, name: "ビジネス書類", item: "https://yamada-tools.jp/document" },
  ],
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "ビジネス書類作成ツール",
  description: "請求書・見積書・封筒印刷・全銀フォーマットなどの無料ビジネスツール集",
  url: "https://yamada-tools.jp/document",
};

export default function DocumentHubPage() {
  const docs = documentTools.filter((t) => t.available);

  // Pull related business tools from other configs
  const envelope = generatorTools.find((t) => t.id === "envelope-print");
  const hanko = generatorTools.find((t) => t.id === "hanko");
  const tNumber = generatorTools.find((t) => t.id === "invoice-validator");
  const bankFormat = convertTools.find((t) => t.id === "bank-format");
  const charCount = generatorTools.find((t) => t.id === "char-counter");
  const passwordGen = generatorTools.find((t) => t.id === "password-generator");

  // Section 1: Core documents (invoice, quotation, etc.)
  const coreDocsSection: HubSection = {
    title: "基本書類",
    subtitle: "請求書・見積書・領収書など毎日の業務で使う書類",
    badge: "基本",
    cols: 4,
    tools: docs
      .filter((t) =>
        ["invoice", "quotation", "receipt", "delivery-slip", "cover-letter", "fax-cover"].includes(
          t.id
        )
      )
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
        popular: t.id === "invoice",
      })),
  };

  // Section 2: HR documents
  const hrDocsSection: HubSection = {
    title: "人事・採用書類",
    subtitle: "履歴書・名刺・ビジネスメール作成",
    badge: "人事",
    cols: 3,
    tools: docs
      .filter((t) => ["resume", "business-card", "business-email"].includes(t.id))
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
      })),
  };

  // Section 3: Japan-specific business tools (the differentiator)
  const japanSection: HubSection = {
    title: "日本独自の業務ツール",
    subtitle: "封筒印刷・全銀フォーマット・縦書き・電子印鑑など、海外ツールでは対応できない日本特化機能",
    badge: "日本特化",
    cols: 4,
    tools: [
      ...(envelope
        ? [
            {
              id: envelope.id,
              name: envelope.nameJa,
              description: envelope.description,
              url: envelope.path,
              icon: envelope.icon,
              popular: true,
            },
          ]
        : []),
      ...(bankFormat
        ? [
            {
              id: bankFormat.id,
              name: bankFormat.nameJa,
              description: bankFormat.description,
              url: bankFormat.path,
              icon: bankFormat.icon,
              popular: true,
            },
          ]
        : []),
      ...(hanko
        ? [
            {
              id: hanko.id,
              name: hanko.nameJa,
              description: hanko.description,
              url: hanko.path,
              icon: hanko.icon,
            },
          ]
        : []),
      ...docs
        .filter((t) => t.id === "vertical-text")
        .map((t) => ({
          id: t.id,
          name: t.nameJa,
          description: t.description,
          url: t.path,
          icon: t.icon,
        })),
      ...(tNumber
        ? [
            {
              id: tNumber.id,
              name: tNumber.nameJa,
              description: tNumber.description,
              url: tNumber.path,
              icon: tNumber.icon,
            },
          ]
        : []),
    ],
  };

  // Section 4: Helper utilities
  const helperSection: HubSection = {
    title: "業務サポートツール",
    subtitle: "文字数カウント・パスワード生成など、業務効率化に役立つツール",
    badge: "便利",
    cols: 3,
    tools: [
      ...(charCount
        ? [
            {
              id: charCount.id,
              name: charCount.nameJa,
              description: charCount.description,
              url: charCount.path,
              icon: charCount.icon,
            },
          ]
        : []),
      ...(passwordGen
        ? [
            {
              id: passwordGen.id,
              name: passwordGen.nameJa,
              description: passwordGen.description,
              url: passwordGen.path,
              icon: passwordGen.icon,
            },
          ]
        : []),
    ],
  };

  const sections = [coreDocsSection, hrDocsSection, japanSection, helperSection].filter(
    (s) => s.tools.length > 0
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, collectionJsonLd]),
        }}
      />
      <HubLayout
        niche={{
          iconName: "briefcase",
          name: "ビジネス書類",
          eyebrow: "BUSINESS DOCUMENTS",
          headline: "ビジネスを、もっとシンプルに。",
          tagline: "日本の中小企業・フリーランスのための書類作成ツール",
          description:
            "請求書・見積書・履歴書・封筒印刷・全銀フォーマット・電子印鑑まで、日本のビジネスに必要な書類をすべて無料で作成。インボイス制度にも完全対応。",
          theme: "blue",
          primaryCta: { label: "請求書を作成する", url: "/document/invoice" },
          secondaryCta: { label: "封筒印刷ツール", url: "/generator/envelope-print" },
        }}
        sections={sections}
      />
    </>
  );
}
