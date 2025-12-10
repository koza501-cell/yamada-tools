import { Metadata } from "next";
import { Tool } from "@/config/tools";

const baseUrl = "https://yamada-tools.jp";

interface ToolSeoData {
  tool: Tool;
  longDescription?: string;
  keywords?: string[];
  faq?: { question: string; answer: string }[];
}

export function generateToolMetadata({
  tool,
  longDescription,
  keywords = [],
}: ToolSeoData): Metadata {
  const defaultKeywords = [
    tool.nameJa,
    tool.nameEn,
    "無料",
    "オンライン",
    "日本",
    "安全",
    "登録不要",
  ];

  const description =
    longDescription ||
    `${tool.nameJa}を無料でオンライン変換。${tool.description}。日本国内サーバーで安心・安全。登録不要、ファイルは10分で自動削除。`;

  return {
    title: `${tool.nameJa} - 無料オンライン${tool.nameJa}ツール`,
    description,
    keywords: [...defaultKeywords, ...keywords],
    openGraph: {
      title: `${tool.nameJa} | 山田ツール - 無料オンラインツール`,
      description,
      url: `${baseUrl}${tool.path}`,
      siteName: "山田ツール",
      locale: "ja_JP",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-tools/${tool.id}.png`,
          width: 1200,
          height: 630,
          alt: `${tool.nameJa} - 山田ツール`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.nameJa} | 山田ツール`,
      description,
      images: [`${baseUrl}/og-tools/${tool.id}.png`],
    },
    alternates: {
      canonical: `${baseUrl}${tool.path}`,
    },
  };
}

export function generateToolJsonLd(tool: Tool, faq?: { question: string; answer: string }[]) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${tool.nameJa} | 山田ツール`,
    url: `${baseUrl}${tool.path}`,
    description: `${tool.description}。日本国内サーバーで安心・安全。`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
    provider: {
      "@type": "Organization",
      name: "合同会社山田トレード",
      url: baseUrl,
    },
    inLanguage: "ja",
    isAccessibleForFree: true,
  };

  const schemas = [baseSchema];

  // Add FAQ schema if FAQ exists
  if (faq && faq.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };
    schemas.push(faqSchema as any);
  }

  // Add HowTo schema
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${tool.nameJa}の使い方`,
    description: `${tool.nameJa}を無料で使う方法`,
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "ファイルを選択",
        text: "変換したいファイルをドラッグ＆ドロップまたはクリックして選択します",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "オプションを設定",
        text: "必要に応じてオプションを設定します",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "変換を実行",
        text: "「実行」ボタンをクリックして変換を開始します",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "ダウンロード",
        text: "変換が完了したらファイルをダウンロードします",
      },
    ],
    tool: {
      "@type": "HowToTool",
      name: "山田ツール",
    },
    totalTime: "PT1M",
  };
  schemas.push(howToSchema as any);

  // Add BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "PDFツール",
        item: `${baseUrl}/pdf`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.nameJa,
        item: `${baseUrl}${tool.path}`,
      },
    ],
  };
  schemas.push(breadcrumbSchema as any);

  return schemas;
}
