import type { Metadata } from "next";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import HoikushiHaichiClient from "./client";

export const metadata: Metadata = {
  title: "保育士配置基準 計算機【令和8年度・最新改正対応】施設種別7形態・経過措置・1歳児加算",
  description: "認可保育所・幼保連携型認定こども園・小規模A/B/C型・認可外・事業所内の7形態に対応した保育士配置基準計算機。令和6年4月改正(3-5歳児)・令和7年度新設1歳児配置改善加算・経過措置(3歳児令和9年度末終了)に完全対応。年齢別園児数を入力するだけで必要保育士数を即算出。無料・登録不要。",
  keywords: ["保育士配置基準", "計算機", "令和8年度", "令和6年改正", "1歳児加算", "経過措置", "認可保育所", "小規模保育", "認定こども園", "保育園経営"],
  openGraph: {
    title: "保育士配置基準 計算機【令和8年度・最新改正対応】",
    description: "7形態・経過措置・1歳児加算対応。年齢別園児数を入力するだけで必要保育士数を即算出。",
    type: "website",
  },
  alternates: { canonical: "https://yamada-tools.jp/care/hoikushi-haichi-keisan" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "保育士配置基準 計算機",
      url: "https://yamada-tools.jp/care/hoikushi-haichi-keisan",
      description: "認可保育所・認定こども園・小規模A/B/C型など7形態の保育士配置基準を計算。令和8年度最新改正対応。",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "介護・保育", item: "https://yamada-tools.jp/care" },
        { "@type": "ListItem", position: 3, name: "保育士配置基準 計算機", item: "https://yamada-tools.jp/care/hoikushi-haichi-keisan" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "3歳児の経過措置はいつ終わりますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "令和9年度末（2028年3月31日）に終了します。令和10年度（2028年4月）から15:1が完全義務化されます。2026年3月にこども家庭庁が正式決定しています。",
          },
        },
        {
          "@type": "Question",
          name: "1歳児配置改善加算の取得条件は？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "①1歳児を5:1以上に改善、②処遇改善等加算Ⅰ・Ⅱ・Ⅲすべて取得、③ICT機器(登降園管理含む2機能以上)導入、④加算使途の職員周知、の4条件すべてを満たす必要があります。",
          },
        },
        {
          "@type": "Question",
          name: "常時2名以上というのは何ですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "年齢別計算の合計が1名以下でも、保育所は常時2名以上の保育士を配置しなければなりません。認可保育所・認可外・認定こども園などで共通のルールです。",
          },
        },
        {
          "@type": "Question",
          name: "小規模C型の計算方法は他と違いますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "はい、C型は家庭的保育で、0〜2歳児一律「子ども3人につき職員1人」です。補助者がいれば5人まで対応可能。全員が保育士資格を持つ必要はありませんが、家庭的保育士の認定が必要です。",
          },
        },
        {
          "@type": "Question",
          name: "計算結果はシフト人員と同じですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "異なります。計算結果は「同時に必要な最低人数」です。開園12時間・1人8時間勤務なら1.5交代が必要なため、実際の雇用人数は計算結果の1.7〜2.0倍が目安となります。",
          },
        },
      ],
    },
  ],
};

const tool = getToolById("hoikushi-haichi-keisan");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HoikushiHaichiClient />
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </>
  );
}
