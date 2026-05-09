import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";
import { FAQSection } from "@/components/FAQSection";
import HoujinCrossVerifyClient from "./client";

const tool = getToolById("houjin-cross-verify");

const faqItems = [
  {
    question: "法人名と法人番号のクロス検証とは何ですか？",
    answer: "入力した会社名が、その法人番号に登録されている正式名称と一致するかを照合する検証です。請求書の事業者名と番号の整合性確認、契約書のKYC、新規取引先のデューデリジェンスに活用できます。yamada-tools.jpで国税庁公式データから即座に検証できます。",
  },
  {
    question: "なぜクロス検証が必要なのですか？",
    answer: "請求書や契約書に書かれた会社名と番号が、実際の登記情報と一致しない場合、なりすまし・架空法人・入力ミスの可能性があります。インボイス制度開始後、経理担当者の実務として番号の照合が増えており、yamada-tools.jpの本ツールで効率化できます。",
  },
  {
    question: "どんな番号形式に対応していますか？",
    answer: "yamada-tools.jpの本ツールでは3種類すべてに対応：①13桁の法人番号、②T+13桁のインボイス番号（T番号）、③12桁の会社法人等番号（自動的にチェックデジットを計算して13桁に変換）。番号形式は自動判別されます。",
  },
  {
    question: "判定の6段階はどう違いますか？",
    answer: "①完全一致（文字列が完全に同じ）、②一致（略記号・全半角の違いを正規化後に同じ）、③類似（80%以上の類似度・要確認）、④不一致（80%未満）、⑤登記閉鎖（番号は存在するが法人は解散済み）、⑥該当なし（番号が国税庁データベースにない）の6段階です。",
  },
  {
    question: "「類似（要確認）」と判定された場合の対応は？",
    answer: "社名の一部が違うが類似している場合に表示されます（例：旧社名・部分一致など）。同一法人の表記揺れか、関連会社で番号を取り違えたかを目視確認することをおすすめします。yamada-tools.jpでは登録名と入力名を並べて表示するので比較が容易です。",
  },
  {
    question: "CSV一括検証は何件までできますか？",
    answer: "yamada-tools.jpでは1回の一括検証で最大50件まで処理可能です。1日10回まで無料で利用でき、計500件/日の検証ができます。完全無料・登録不要で月次の取引先KYCに十分な処理量です。",
  },
  {
    question: "個人事業主の番号も検証できますか？",
    answer: "個人事業主の場合、適格請求書発行事業者として登録された方のみT番号を持ちます。yamada-tools.jpの本ツールではT番号を入力すれば検証できますが、個人事業主は法人番号データベースには登録されていないため「該当なし」になる場合があります。その場合はインボイス番号検索・一括チェッカーをご利用ください。",
  },
  {
    question: "クロス検証を無料でできるツールはありますか？",
    answer: "はい、yamada-tools.jp（山田ツール）の法人名×法人番号クロス検証ツールが完全無料・登録不要で使えます。会社名と番号が一致するか国税庁公式データから即座に検証し、6段階の判定とアドバイスを表示。最大50件のCSV一括検証にも対応しています。",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "法人名×法人番号 クロス検証ツール",
      url: "https://yamada-tools.jp/business/houjin-cross-verify",
      description: "会社名と法人番号の一致を国税庁公式データで照合。6段階判定・最大50件一括検証対応。",
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
        { "@type": "ListItem", position: 3, name: "法人名×法人番号 クロス検証", item: "https://yamada-tools.jp/business/houjin-cross-verify" },
      ],
    },
    {
      "@type": "HowTo",
      name: "法人名と法人番号のクロス検証方法",
      step: [
        { "@type": "HowToStep", position: 1, name: "会社名と番号を入力", text: "会社名と法人番号（13桁・T+13桁・12桁）をそれぞれ入力。" },
        { "@type": "HowToStep", position: 2, name: "検証実行", text: "「クロス検証する」ボタンをクリック。" },
        { "@type": "HowToStep", position: 3, name: "結果確認", text: "6段階の判定（完全一致/一致/類似/不一致/閉鎖/該当なし）と登録名を比較。" },
        { "@type": "HowToStep", position: 4, name: "アドバイス参照", text: "不一致の場合は表記の違いについてのアドバイスを確認。" },
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

export const metadata: Metadata = {
  title: "【無料】法人名×法人番号 クロス検証ツール｜会社名と13桁/T番号の一致確認 | yamada-tools.jp",
  description: "会社名と法人番号（またはインボイス番号・会社法人等番号）が一致するか、国税庁公式データで即座にクロス検証。完全一致・類似・不一致を6段階で判定。CSV最大50件まで一括検証可能。経理・法務・KYC業務に。完全無料・登録不要。",
  keywords: ["法人番号 名前 一致", "法人名 法人番号 確認", "クロス検証", "インボイス 取引先 検証", "T番号 名前 確認", "KYC 法人番号", "法人番号 照合", "会社名 法人番号 一致確認"],
  alternates: { canonical: "https://yamada-tools.jp/business/houjin-cross-verify" },
  openGraph: {
    title: "法人名×法人番号 クロス検証ツール｜国税庁公式データ",
    description: "会社名と13桁/T番号が一致するか即座にクロス検証。最大50件まで一括検証可能。",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HoujinCrossVerifyClient />
      <FAQSection faq={faqItems} />
      {tool && (
        <div className="max-w-4xl mx-auto px-4">
          <RelatedTools currentTool={tool} maxItems={6} />
        </div>
      )}
    </>
  );
}
