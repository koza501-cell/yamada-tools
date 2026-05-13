import type { Metadata } from "next";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import DayserviceCostSimClient from "./client";

export const metadata: Metadata = {
  title: "デイサービス 月額利用料 シミュレーター｜要介護度別の費用目安【家族向け・無料】",
  description: "デイサービス(通所介護)の1ヶ月の費用を、要介護度・利用時間・回数から簡単に試算。食費込みの月額目安が一発で分かる、介護家族向けの無料シミュレーター。令和6年改定対応。",
  keywords: ["デイサービス", "費用", "料金", "シミュレーター", "要介護度", "月額", "介護保険", "家族向け"],
  openGraph: {
    title: "デイサービス 月額利用料 シミュレーター【家族向け・無料】",
    description: "要介護度・利用時間・回数から月額費用を試算。食費込み、限度額チェック付き。",
    type: "website",
  },
  alternates: { canonical: "https://yamada-tools.jp/care/dayservice-cost-sim" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "デイサービス 月額利用料 シミュレーター",
      url: "https://yamada-tools.jp/care/dayservice-cost-sim",
      description: "要介護度・利用時間・回数から月額費用を試算。食費込み、限度額チェック付きの家族向け無料ツール。",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "介護・保育", item: "https://yamada-tools.jp/care" },
        { "@type": "ListItem", position: 3, name: "デイサービス 月額利用料 シミュレーター", item: "https://yamada-tools.jp/care/dayservice-cost-sim" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "デイサービスの料金はどう決まるの?",
          acceptedAnswer: { "@type": "Answer", text: "介護保険の単位数 × お住まいの地域単価 × 自己負担割合(1〜3割)で計算されます。これに食費(1回あたり500〜800円が目安)などの実費が加わります。当ツールでは平均的な加算と食費を含めた月額目安を表示します。" },
        },
        {
          "@type": "Question",
          name: "計算結果は正確?",
          acceptedAnswer: { "@type": "Answer", text: "一般的な加算込みの概算です。実際の費用は施設の加算内容や食費設定により上下します。正確な見積もりは契約予定のデイサービス事業所にご確認ください。" },
        },
        {
          "@type": "Question",
          name: "限度額を超えるとどうなる?",
          acceptedAnswer: { "@type": "Answer", text: "月額の支給限度額(要介護度ごとに決まっています)を超えると、超過分は全額自己負担になります。当ツールでは限度額超過時に警告を表示します。ケアマネジャーと相談して回数を調整するのが一般的です。" },
        },
        {
          "@type": "Question",
          name: "1割負担、2割負担、3割負担はどう決まる?",
          acceptedAnswer: { "@type": "Answer", text: "本人の合計所得金額と年金収入で決まります。多くの方は1割負担です。年金収入のみで年280万円以上(単身)の場合は2割、340万円以上の場合は3割になります。市区町村から「介護保険負担割合証」が交付されます。" },
        },
        {
          "@type": "Question",
          name: "要支援1・2の場合は使えない?",
          acceptedAnswer: { "@type": "Answer", text: "要支援の方は「介護予防通所サービス」を利用します。当ツールは要介護1〜5の方向けです。要支援の方は「要介護度 早見表」で限度額を確認してください。" },
        },
      ],
    },
  ],
};

const tool = getToolById("dayservice-cost-sim");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DayserviceCostSimClient />
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </>
  );
}
