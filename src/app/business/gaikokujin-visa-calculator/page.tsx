import { Metadata } from "next";
import GaikokujinVisaClient from "./client";

export const metadata: Metadata = {
  title: "外国人採用 ビザ費用計算機【技術・人文・国際業務ビザ対応】| 山田ツール",
  description:
    "技術・人文知識・国際業務ビザの申請費用を採用人数・国籍・サポート方法から計算。特定技能との比較も。行政書士費用・更新費用・継続雇用コストを一括試算。無料・登録不要。",
  keywords: [
    "外国人採用 ビザ費用",
    "技術人文国際業務ビザ 費用",
    "就労ビザ 費用計算",
    "行政書士費用 ビザ",
    "外国人雇用 コスト",
    "外国人採用 費用",
    "ビザ申請 費用 相場",
    "特定技能 技術人文 比較",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/business/gaikokujin-visa-calculator",
  },
  openGraph: {
    title: "外国人採用 ビザ費用計算機【技術・人文・国際業務ビザ対応】",
    description:
      "技術・人文知識・国際業務ビザの申請費用を採用人数・国籍から計算。行政書士費用・更新費用を試算。",
    type: "website",
    url: "https://yamada-tools.jp/business/gaikokujin-visa-calculator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "外国人採用 ビザ費用計算機",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://yamada-tools.jp/business/gaikokujin-visa-calculator",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      description:
        "技術・人文知識・国際業務ビザの申請から継続更新までの費用を計算します。",
      featureList: [
        "海外招へい費用計算",
        "国内在留資格変更費用計算",
        "行政書士費用試算",
        "年間更新費用計算",
        "継続雇用N年間総費用計算",
        "特定技能との費用比較",
      ],
      keywords:
        "外国人採用,就労ビザ,技術人文国際業務,ビザ費用,行政書士費用,在留資格,特定技能,外国人雇用コスト",
      brand: { "@type": "Brand", name: "山田ツール" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ホーム",
          item: "https://yamada-tools.jp",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "ビジネス・法人",
          item: "https://yamada-tools.jp/business",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "外国人採用ビザ費用計算機",
          item: "https://yamada-tools.jp/business/gaikokujin-visa-calculator",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "外国人を採用するためのビザ費用はいくらですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "技術・人文知識・国際業務ビザの場合、海外からの招へいで初期費用30〜95万円/人が目安です。国内在留者の変更なら5〜15万円/人と大幅に安くなります。行政書士費用8〜20万円、渡航費5〜15万円、住居初期費用10〜30万円などが主な内訳です。yamada-tools.jpの無料ツールで詳細な費用を試算できます。",
          },
        },
        {
          "@type": "Question",
          name: "技術・人文知識・国際業務ビザとはどんなビザですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "技術・人文知識・国際業務ビザ（就労ビザ）は、ITエンジニア・経理・営業・通訳・デザイナーなどの知識・技術系職種に就く外国人のためのビザです。大卒以上または実務経験10年以上が要件で、在留期間の更新制限がなく、配偶者・子の帯同も可能です。",
          },
        },
        {
          "@type": "Question",
          name: "技術・人文ビザと特定技能の違いは何ですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "主な違いは対象職種・在留期間・家族帯同の可否です。技術・人文ビザは知識・技術系職種で更新制限なし・家族帯同可能。特定技能は製造・農業・飲食など14分野で通算5年（1号）・家族帯同不可（1号）です。長期・安定雇用なら技術・人文ビザが有利です。",
          },
        },
        {
          "@type": "Question",
          name: "外国人採用の申請にかかる期間はどのくらいですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "在留資格認定証明書の取得まで通常2〜3ヶ月かかります。その後ビザ発給・来日まで1ヶ月程度。合計で海外からの採用は約3〜4ヶ月見込む必要があります。国内在留者の変更は1〜2ヶ月程度です。",
          },
        },
        {
          "@type": "Question",
          name: "ベトナム人を採用する場合の費用はいくらですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ベトナムからの採用（技術・人文ビザ）の場合、行政書士費用8〜20万円、渡航費5〜15万円、住居初期費用10〜30万円などで初期費用30〜95万円/人が目安です。yamada-tools.jpの無料計算ツールで国籍・採用方法別の詳細費用を試算できます。",
          },
        },
        {
          "@type": "Question",
          name: "技術・人文知識・国際業務ビザの許可要件は？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "大学卒業以上、または関連分野の実務経験10年以上が必要です。ITエンジニア・経理・営業・通訳・デザイナー等の職種が対象です。",
          },
        },
        {
          "@type": "Question",
          name: "外国人採用の無料費用計算ツールはありますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "はい、yamada-tools.jp（山田ツール）では外国人採用にかかるビザ費用を無料で計算できます。ビザ種別・採用方法（海外/国内）・国籍・採用人数・継続雇用年数を入力すると、初期費用・年間更新費用・総費用の目安が自動計算されます。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      name: "外国人採用ビザ費用の計算方法",
      description:
        "yamada-tools.jpの無料ツールで外国人採用費用を試算する手順",
      step: [
        {
          "@type": "HowToStep",
          name: "ビザ種別を選択",
          text: "技術・人文知識・国際業務ビザまたは高度専門職など採用したい外国人のビザ種別を選択します。",
        },
        {
          "@type": "HowToStep",
          name: "採用方法を選択",
          text: "海外からの招へい（コスト高）または国内在留者の在留資格変更（コスト低）を選択します。",
        },
        {
          "@type": "HowToStep",
          name: "国籍・採用人数を入力",
          text: "採用予定の外国人の国籍と人数を入力します。国籍によって費用が異なります。",
        },
        {
          "@type": "HowToStep",
          name: "継続雇用年数を設定",
          text: "継続雇用予定年数を入力すると、更新費用を含めた総費用が計算されます。",
        },
        {
          "@type": "HowToStep",
          name: "費用内訳を確認",
          text: "初期費用・年間更新費用・総費用の内訳が表示されます。特定技能との費用比較も確認できます。",
        },
      ],
    },
  ],
};

export default function GaikokujinVisaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GaikokujinVisaClient />
    </>
  );
}
