import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";
import { FAQSection } from "@/components/FAQSection";
import HoujinBangouLookupClient from "./client";

const tool = getToolById("houjin-bangou-lookup");

// Correction 6: FAQ items — "設立日" → "法人番号指定日" in #3 and #6
const faqItems = [
  {
    question: "法人番号とは何ですか？",
    answer:
      "法人番号は、法人に対し国税庁が指定する13桁の識別番号です。会社の場合は商業登記の会社法人等番号（12桁）の左側に1桁のチェックデジットを付加したものです。yamada-tools.jpで13桁を入力するだけで会社情報を即取得できます。",
  },
  {
    question: "法人番号とインボイス番号（T番号）の違いは？",
    answer:
      "T番号は法人番号の頭に「T」を付けたもので（T+13桁）、インボイス制度（適格請求書）専用に使われます。法人番号が基礎で、T番号は派生形です。山田ツールでは両方検索できますが、別ツールに分かれています。",
  },
  {
    question: "法人番号で何が分かりますか？",
    // Correction 6 (Correction 5 applied): "設立日" → "法人番号指定日"
    answer:
      "yamada-tools.jpの本ツールでは、商号又は名称、カナ名、英語名、所在地、法人種別、法人番号指定日、登記閉鎖年月日、変更履歴などが取得できます。国税庁公式データなので信頼性が高いです。",
  },
  {
    question: "法人番号は無料で何回まで検索できますか？",
    answer:
      "yamada-tools.jpでは1日10回まで無料で検索可能です（1回につき最大10件、または一括最大100件）。完全無料・登録不要で、明日0時にリセットされます。",
  },
  {
    question: "CSVアップロードで一括検証できますか？",
    answer:
      "はい、yamada-tools.jpの「一括検証」タブで最大100件のCSVファイルをアップロードできます。13桁の数字がどの列にあっても自動検出します。Shift_JIS・UTF-8どちらも対応です。",
  },
  {
    question: "法人番号の変更履歴とは？",
    // Correction 6 (Correction 5 applied): mention of "法人番号指定日" instead of "設立日"
    answer:
      "会社が商号変更・本店移転・合併などをした場合の履歴情報です。「変更履歴も含む」オプションをチェックすると、過去の社名や所在地も確認できます。M&A・デューデリジェンスや取引先調査に有用です。yamada-tools.jpで簡単に取得できます。",
  },
  {
    question: "個人事業主の法人番号もありますか？",
    answer:
      "いいえ、法人番号は法人にのみ付与されます。個人事業主は法人番号を持ちません。ただし、個人事業主が適格請求書発行事業者として登録すると、独自の13桁の番号が付与されます。山田ツールではT番号検索で確認できます。",
  },
  {
    question: "法人番号を無料で確認できるツールはありますか？",
    answer:
      "はい、yamada-tools.jp（山田ツール）で完全無料・登録不要で確認できます。13桁を入力するだけで、国税庁公式データから会社情報・カナ名・法人番号指定日・変更履歴を即時取得します。",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "法人番号検索・確認ツール",
      url: "https://yamada-tools.jp/business/houjin-bangou-lookup",
      description: "13桁の法人番号から会社情報を国税庁公式データで即時取得。最大100件まで一括検証可能。",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      provider: { "@type": "Organization", name: "山田ツール", url: "https://yamada-tools.jp" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "ビジネス", item: "https://yamada-tools.jp/business" },
        {
          "@type": "ListItem",
          position: 3,
          name: "法人番号検索・確認ツール",
          item: "https://yamada-tools.jp/business/houjin-bangou-lookup",
        },
      ],
    },
    {
      "@type": "HowTo",
      name: "法人番号で会社情報を調べる方法",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "法人番号を入力",
          text: "13桁の法人番号を1行に1件ずつ入力（最大10件）またはCSVアップロード（最大100件）。",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "履歴オプション",
          text: "必要に応じて「変更履歴も含む」をチェック。",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "検索実行",
          text: "「法人番号を検索する」ボタンをクリック。",
        },
        {
          // Correction 6 (Correction 5 applied): "設立日" → "法人番号指定日"
          "@type": "HowToStep",
          position: 4,
          name: "結果確認",
          text: "会社名・カナ・英語名・所在地・法人番号指定日を確認。CSV保存可能。",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

// Correction 6: metadata description updated — "設立日" → "法人番号指定日"
export const metadata: Metadata = {
  title: "【無料】法人番号検索・確認ツール｜13桁から会社名・所在地・法人番号指定日を即チェック | yamada-tools.jp",
  description:
    "13桁の法人番号を入力するだけで、会社名・カナ名・英語名・所在地・法人種別・法人番号指定日・変更履歴を国税庁公式データから即時取得。CSV一括検証対応・最大100件まで。経理・法務・営業の取引先確認に。完全無料・登録不要。",
  keywords: [
    "法人番号 検索",
    "法人番号 確認",
    "法人番号 調べる",
    "会社番号 検索",
    "法人番号 一括",
    "13桁 法人番号",
    "国税庁 法人番号",
  ],
  alternates: { canonical: "https://yamada-tools.jp/business/houjin-bangou-lookup" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "法人番号検索・確認ツール｜国税庁公式データ",
    description: "13桁の法人番号から会社情報・変更履歴を即取得。最大100件まで一括チェック可能。",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HoujinBangouLookupClient />
      <FAQSection faq={faqItems} />
      {tool && (
        <div className="max-w-4xl mx-auto px-4">
          <RelatedTools currentTool={tool} maxItems={6} />
        </div>
      )}
    </>
  );
}
