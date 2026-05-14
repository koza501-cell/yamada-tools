import type { Metadata } from "next";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import KogakuKaigoClient from "./client";

export const metadata: Metadata = {
  title: "高額介護サービス費 計算機【令和8年度】6段階所得区分・払い戻し額を即試算",
  description: "月額の介護保険サービス自己負担額を入力するだけで、6段階所得区分別の負担上限と還付見込み額を即算出。個人・世帯計算、複数利用者の按分、高額医療・高額介護合算(年間)にも対応。令和3年8月改正後の最新区分。無料・登録不要。",
  keywords: ["高額介護サービス費", "計算機", "令和8年度", "所得区分", "負担上限", "還付", "高額医療高額介護合算", "介護保険", "払い戻し", "令和3年8月改正"],
  openGraph: {
    title: "高額介護サービス費 計算機【令和8年度・6段階所得区分対応】",
    description: "月額自己負担を入力するだけで還付見込み額を即算出。高額医療・高額介護合算(年間)も試算可能。",
    type: "website",
  },
  alternates: { canonical: "https://yamada-tools.jp/care/kogaku-kaigo-service" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "高額介護サービス費 計算機",
      url: "https://yamada-tools.jp/care/kogaku-kaigo-service",
      description: "月額介護保険サービス自己負担額から還付見込み額を即算出。6段階所得区分・個人/世帯/按分計算・高額医療高額介護合算対応。令和8年度最新。",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "介護・保育", item: "https://yamada-tools.jp/care" },
        { "@type": "ListItem", position: 3, name: "高額介護サービス費 計算機", item: "https://yamada-tools.jp/care/kogaku-kaigo-service" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "高額介護サービス費はいつ振り込まれますか?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "通常、介護サービスを利用した月から3〜4ヶ月後に自治体から支給申請書が郵送されます。申請後さらに1〜2ヶ月で指定口座に振り込まれます。初回申請後は2回目以降が自動振込になります。",
          },
        },
        {
          "@type": "Question",
          name: "食費・居住費は高額介護サービス費の対象になりますか?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "なりません。施設の食費・居住費、福祉用具購入費、住宅改修費、日常生活費は対象外です。低所得者の食費・居住費については別途「特定入所者介護サービス費(補足給付)」という制度があります。",
          },
        },
        {
          "@type": "Question",
          name: "複数人世帯の場合、按分計算とはどういう意味ですか?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "世帯全員の自己負担合計が世帯上限を超えた場合、超過額(世帯還付額)を各個人の負担割合に応じて按分します。例えば夫45,000円・妻23,000円(合計68,000円)で世帯上限44,400円なら還付23,600円を(45/68)と(23/68)の比で按分します。",
          },
        },
        {
          "@type": "Question",
          name: "高額医療・高額介護合算療養費制度とは何ですか?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "毎年8月1日〜翌年7月31日の1年間の医療費と介護費の自己負担合計に上限を設けた制度です。合計が所得区分別の年間限度額を超え、かつ超過額が500円以上の場合に還付されます。高額介護サービス費(月額)とは別申請が必要です。",
          },
        },
        {
          "@type": "Question",
          name: "申請の期限はいつまでですか?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "介護サービスを利用した月の翌月1日から2年以内です。期限を過ぎると時効で請求権が消滅します。自治体から申請書が届いたら早めに申請してください。",
          },
        },
      ],
    },
  ],
};

const tool = getToolById("kogaku-kaigo-service");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <KogakuKaigoClient />
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </>
  );
}
