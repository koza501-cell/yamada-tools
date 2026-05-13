import type { Metadata } from "next";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import YoukaigodoClient from "./client";

export const metadata: Metadata = {
  title: "要介護度 早見表｜要支援1〜要介護5の違い・限度額・サービス比較【令和6年】",
  description: "要支援1から要介護5まで、状態・支給限度額・自己負担額・利用できるサービスを一覧で比較。介護家族・ケアマネ向けの早見表。令和6年度介護保険最新版。",
  keywords: ["要介護度", "早見表", "要支援", "要介護", "支給限度額", "介護保険", "令和6年", "サービス比較", "自己負担"],
  openGraph: {
    title: "要介護度 早見表【令和6年度版】",
    description: "要支援1〜要介護5の状態・限度額・サービスを一覧比較。",
    type: "website",
  },
  alternates: { canonical: "https://yamada-tools.jp/care/youkaigodo-hayami" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      name: "要介護度 早見表",
      url: "https://yamada-tools.jp/care/youkaigodo-hayami",
      description: "要支援1から要介護5まで、状態の目安・支給限度額・自己負担額・利用できるサービスを一覧で比較できる早見表",
      dateModified: "2024-06-01",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "介護・保育", item: "https://yamada-tools.jp/care" },
        { "@type": "ListItem", position: 3, name: "要介護度 早見表", item: "https://yamada-tools.jp/care/youkaigodo-hayami" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "要介護度はどうやって決まるの?",
          acceptedAnswer: { "@type": "Answer", text: "市区町村に申請後、訪問調査と主治医意見書をもとに介護認定審査会が判定します。1次判定はコンピューターによる審査、2次判定は専門家による検討を経て決定されます。" },
        },
        {
          "@type": "Question",
          name: "要支援と要介護の違いは?",
          acceptedAnswer: { "@type": "Answer", text: "要支援は「改善の可能性が高く、介護予防により悪化を防げる状態」、要介護は「継続的な介護が必要な状態」です。利用できるサービスや限度額が異なります。" },
        },
        {
          "@type": "Question",
          name: "特別養護老人ホーム (特養) には誰でも入れるの?",
          acceptedAnswer: { "@type": "Answer", text: "原則として要介護3以上の方が対象です。要介護1〜2の方は、認知症や家族の介護困難など特例事由が認められる場合のみ入居可能です。" },
        },
        {
          "@type": "Question",
          name: "限度額を超えるとどうなる?",
          acceptedAnswer: { "@type": "Answer", text: "限度額を超えた分は全額自己負担になります。ケアマネジャーと相談し、サービスを限度内に調整するのが一般的です。" },
        },
        {
          "@type": "Question",
          name: "介護度は変更できる?",
          acceptedAnswer: { "@type": "Answer", text: "状態が変化した場合、区分変更申請ができます。また有効期間（新規6〜12か月、更新12〜48か月）ごとに更新審査があります。" },
        },
      ],
    },
  ],
};

const tool = getToolById("youkaigodo-hayami");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <YoukaigodoClient />
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </>
  );
}
