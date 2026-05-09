import { Metadata } from "next";
import HubLayout, { HubSection } from "@/components/hub/HubLayout";
import { pdfTools } from "@/config/tools";
import PdfDropZone from "@/components/pdf/PdfDropZone";
import PdfWorkflows from "@/components/pdf/PdfWorkflows";

// ============================================================
// /pdf — PDF・ファイル hub (CORAL theme)
// ============================================================
// Preserves the existing PdfDropZone and PdfWorkflows components
// (they're powerful features users rely on).
// ============================================================

export const metadata: Metadata = {
  title: "PDFツール【無料】結合・圧縮・分割・変換・文字入力 | 山田ツール",
  description:
    "PDF結合・圧縮・分割・回転・OCR・Word/Excel変換・パスワード保護・電子署名・透かし追加など35種以上の無料PDFツール。日本国内サーバーで安心・安全。登録不要・60分自動削除でセキュア。インストール不要、ブラウザだけで完結。",
  keywords:
    "PDF結合, PDF圧縮, PDF分割, PDF変換, PDF文字入力, PDF Word変換, PDF Excel変換, PDF OCR, 無料",
  alternates: {
    canonical: "https://yamada-tools.jp/pdf",
  },
  openGraph: {
    title: "PDFツール【無料】 | 山田ツール",
    description:
      "PDF結合・圧縮・分割・変換など35種以上の無料PDFツール。日本国内サーバーで安心。",
    url: "https://yamada-tools.jp/pdf",
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
    { "@type": "ListItem", position: 2, name: "PDFツール", item: "https://yamada-tools.jp/pdf" },
  ],
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "PDFツール",
  description: "PDF結合・圧縮・分割・変換などの無料PDFツール集",
  url: "https://yamada-tools.jp/pdf",
};

export default function PdfHubPage() {
  const tools = pdfTools.filter((t) => t.available);

  // Section 1: Core PDF operations
  const coreSection: HubSection = {
    title: "基本ツール",
    subtitle: "PDFの結合・圧縮・分割・回転など毎日使う基本機能",
    badge: "基本",
    cols: 5,
    tools: tools
      .filter((t) =>
        ["merge", "compress", "split", "rotate", "delete-pages"].includes(t.id)
      )
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
        popular: t.id === "compress" || t.id === "merge",
      })),
  };

  // Section 2: Editing & marking
  const editingSection: HubSection = {
    title: "編集・書き込み",
    subtitle: "文字入力・電子印鑑・ページ番号・透かしなどの編集機能",
    badge: "編集",
    cols: 4,
    tools: tools
      .filter((t) =>
        ["pdf-text-input", "pdf-stamp", "sign", "page-numbers", "watermark", "reorder", "ocr", "combini-print"].includes(t.id)
      )
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
        popular: t.id === "pdf-text-input",
        isNew: t.isNew,
      })),
  };

  // Section 3: Conversion
  const conversionSection: HubSection = {
    title: "変換ツール",
    subtitle: "Word・Excel・PowerPoint・画像との相互変換",
    badge: "変換",
    cols: 4,
    tools: tools
      .filter((t) =>
        ["image-to-pdf", "pdf-to-image", "pdf-to-word", "word-to-pdf", "excel-to-pdf", "pdf-to-excel", "ppt-to-pdf", "pdf-to-ppt"].includes(t.id)
      )
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
      })),
  };

  // Section 4: Security
  const securitySection: HubSection = {
    title: "セキュリティ",
    subtitle: "パスワード保護・解除で機密書類を安全に管理",
    badge: "保護",
    cols: 3,
    tools: tools
      .filter((t) => ["protect", "unlock"].includes(t.id))
      .map((t) => ({
        id: t.id,
        name: t.nameJa,
        description: t.description,
        url: t.path,
        icon: t.icon,
      })),
  };

  const sections = [coreSection, editingSection, conversionSection, securitySection].filter(
    (s) => s.tools.length > 0
  );

  // PdfDropZone and PdfWorkflows are placed BEFORE sections in the hub
  const beforeSections = (
    <section className="bg-white dark:bg-gray-800 border-b border-stone-100 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <PdfDropZone />
        <div className="mt-6">
          <PdfWorkflows />
        </div>
      </div>
    </section>
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
          iconName: "document",
          name: "PDF・ファイル",
          eyebrow: "PDF & FILES",
          headline: "PDFを、思いのままに。",
          tagline: "結合・圧縮・変換・編集まで35種以上のツール",
          description:
            "PDF結合・圧縮・分割・回転・文字入力・OCR・Word/Excel変換・パスワード保護まで、PDF業務に必要なツールをすべて無料で。日本国内サーバーで処理、60分後に自動削除で安心。",
          theme: "coral",
          primaryCta: { label: "PDFを圧縮する", url: "/pdf/compress" },
          secondaryCta: { label: "PDFを結合する", url: "/pdf/merge" },
        }}
        sections={sections}
        beforeSections={beforeSections}
      />
    </>
  );
}
