import type { Metadata } from "next";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import KaigoShokuinHaichiClient from "./client";

export const metadata: Metadata = {
  title: "介護職員配置基準 計算機【令和8年度・最新改正対応】8施設種別・テクノロジー緩和・夜勤1.6人対応",
  description: "利用者数を入力するだけで、特養・老健・有料老人ホーム・サ高住・グループホーム・デイサービス・ショートステイ・小規模多機能の必要介護職員数を即算出。令和6年4月改正(特定施設3:0.9緩和)・令和8年6月期中改定(処遇改善加算Ⅰロ・Ⅱロ新設)・生産性向上推進体制加算に完全対応。無料・登録不要。",
  keywords: ["介護職員配置基準", "計算機", "令和8年度", "令和6年改正", "特養", "老健", "グループホーム", "デイサービス", "テクノロジー緩和", "夜勤緩和"],
  openGraph: {
    title: "介護職員配置基準 計算機【令和8年度・最新改正対応】",
    description: "8施設種別・テクノロジー緩和・夜勤1.6人対応。利用者数を入力するだけで必要介護職員数を即算出。",
    type: "website",
  },
  alternates: { canonical: "https://yamada-tools.jp/care/kaigo-shokuin-haichi-keisan" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "介護職員配置基準 計算機",
      url: "https://yamada-tools.jp/care/kaigo-shokuin-haichi-keisan",
      description: "特養・老健・有料老人ホーム・サ高住・グループホーム・デイ・ショートステイ・小規模多機能の8施設種別対応。令和8年度最新改正対応。",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "介護・保育", item: "https://yamada-tools.jp/care" },
        { "@type": "ListItem", position: 3, name: "介護職員配置基準 計算機", item: "https://yamada-tools.jp/care/kaigo-shokuin-haichi-keisan" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "3:1は介護職員だけですか?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "いいえ。介護職員と看護職員の合計で3:1です。例えば特養で利用者60名なら、介護+看護の合計で常勤換算20人以上が必要です。",
          },
        },
        {
          "@type": "Question",
          name: "令和6年の3:0.9緩和は全施設で適用できますか?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "いいえ。現時点では特定施設(介護付き有料老人ホーム・サ高住介護型)が対象。テクノロジー機器導入・委員会設置等の要件を満たす必要があります。",
          },
        },
        {
          "@type": "Question",
          name: "夜勤1.6人緩和の条件は何ですか?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "特養・老健・ショートステイでは、見守り機器100%導入や複数の要件を満たすことで夜勤2人から1.6人(常勤換算)に緩和可能です。",
          },
        },
        {
          "@type": "Question",
          name: "処遇改善加算Ⅰロ・Ⅱロを取得するには何が必要ですか?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "令和8年6月期中改定で、処遇改善加算の上位区分(ロ)の取得には生産性向上推進体制加算(Ⅱ)以上の取得が要件となりました。テクノロジー導入と委員会運営が事実上の前提です。",
          },
        },
        {
          "@type": "Question",
          name: "配置基準違反はすぐに指定取消になりますか?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "通常は段階的に進みます(改善指導→勧告→命令→業務停止→指定取消)。ただし指定取消後は5〜10年間、再指定を受けられません。",
          },
        },
      ],
    },
  ],
};

const tool = getToolById("kaigo-shokuin-haichi-keisan");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <KaigoShokuinHaichiClient />
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </>
  );
}
