import type { Metadata } from "next";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import KaigoKyugyoClient from "./client";

export const metadata: Metadata = {
  title: "介護休業給付金 計算機【令和8年度】67%×日数で支給額を即試算",
  description: "月給を入れるだけで介護休業中の給付金額を瞬時に計算。賃金日額×67%の基本式、上限¥532,200/月、賃金支払時の80%調整、93日3回分割パターン、非課税の額面手取り対応。令和7年4月改正・令和7年8月上限改定反映済み。無料・登録不要。",
  keywords: ["介護休業給付金", "計算機", "令和8年度", "67%", "93日", "賃金日額", "雇用保険", "介護と仕事の両立", "令和7年4月改正", "非課税"],
  openGraph: {
    title: "介護休業給付金 計算機【令和8年度・67%×93日】",
    description: "月給を入れるだけで給付金額を即算出。賃金支払い時の80%調整・93日分割・非課税メリットまで対応。",
    type: "website",
  },
  alternates: { canonical: "https://yamada-tools.jp/care/kaigo-kyugyo-kyufukin" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "介護休業給付金 計算機",
      url: "https://yamada-tools.jp/care/kaigo-kyugyo-kyufukin",
      description: "月給から介護休業給付金額を即算出。67%支給率・上限¥532,200・賃金支払い調整・93日分割対応。令和8年度最新。",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "介護・保育", item: "https://yamada-tools.jp/care" },
        { "@type": "ListItem", position: 3, name: "介護休業給付金 計算機", item: "https://yamada-tools.jp/care/kaigo-kyugyo-kyufukin" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "介護休業給付金の支給率は何%ですか?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "休業開始時賃金日額の67%です。1支給単位(30日)あたりの上限は¥532,200(令和7年8月改定)で、毎年8月1日に改定されます。",
          },
        },
        {
          "@type": "Question",
          name: "パートやアルバイトでも受給できますか?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "はい。雇用保険に加入していて、休業開始日前2年間に賃金支払基礎日数11日以上の月が通算12か月以上あれば、雇用形態を問わず受給可能です。",
          },
        },
        {
          "@type": "Question",
          name: "93日を3回に分割できますか?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "はい。通算93日の範囲内で最大3回まで分割取得できます。各回ごとに事業主への申し出(2週間前)と、休業終了後の給付金申請が必要です。",
          },
        },
        {
          "@type": "Question",
          name: "介護休業給付金に所得税はかかりますか?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "かかりません。雇用保険法第12条で非課税と規定されています。所得税・住民税・雇用保険料・社会保険料のいずれも控除されず、額面がほぼ手取りになります。",
          },
        },
        {
          "@type": "Question",
          name: "申請の期限はいつまでですか?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "介護休業終了日の翌日から2ヶ月後の月末までです。例えば7月20日に休業終了なら9月30日が期限です。期限を過ぎると時効で請求権が消滅するため注意が必要です。",
          },
        },
      ],
    },
  ],
};

const tool = getToolById("kaigo-kyugyo-kyufukin");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <KaigoKyugyoClient />
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </>
  );
}
