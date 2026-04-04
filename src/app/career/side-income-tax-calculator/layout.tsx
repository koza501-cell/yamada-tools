import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】副業収入税金計算機｜確定申告要否判定・追加税負担を自動計算 2026年版 | 山田ツール",
  description: "副業収入（フリーランス・アルバイト・ネット販売・不動産等）の税金を一括計算。本業との合算税額・実質手取り・確定申告要否を自動判定。節税アドバイス付き。登録不要・無料。",
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "副業収入税金計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "副業収入（フリーランス・アルバイト・ネット販売・不動産等）の税金を一括計算。確定申告要否判定・節税アドバイス付き。2026年最新税制対応。",
      "url": "https://yamada-tools.jp/career/side-income-tax-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "転職・年収", "item": "https://yamada-tools.jp/career" },
        { "@type": "ListItem", "position": 3, "name": "副業収入税金計算機", "item": "https://yamada-tools.jp/career/side-income-tax-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "副業収入が20万円以下なら税金はかかりませんか？",
          "acceptedAnswer": { "@type": "Answer", "text": "副業所得が20万円以下の場合確定申告は不要ですが税金がゼロになるわけではなく住民税の申告は市区町村に必要です。源泉徴収されている場合は確定申告で還付を受けられる場合があります。" },
        },
        {
          "@type": "Question",
          "name": "副業がバレないようにするにはどうすればいいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "確定申告の際に住民税の徴収方法を普通徴収にすることで副業分の住民税が給与から天引きされなくなります。ただし完全に発覚を防げるわけではありません。就業規則で副業が禁止されている場合は会社への確認が必要です。" },
        },
        {
          "@type": "Question",
          "name": "フリーランス収入は雑所得と事業所得どちらで申告しますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "継続的・安定的に副業収入があり帳簿を作成している場合は事業所得として申告できます。事業所得は青色申告特別控除（最大65万円）が使え赤字の場合は給与所得と損益通算できる点が有利です。" },
        },
        {
          "@type": "Question",
          "name": "メルカリやネット販売の利益にも税金はかかりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "営利目的の継続的な販売は雑所得として課税対象です。自分が使っていた生活用品を売った場合は非課税となります。年間の利益が20万円を超えると確定申告が必要です。" },
        },
        {
          "@type": "Question",
          "name": "副業で赤字が出た場合、本業の税金は減りますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "不動産所得・事業所得の赤字は給与所得と損益通算できるため本業の税金が減る可能性があります。一方雑所得の赤字は損益通算できません。" },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "副業収入の税金計算方法",
      "description": "本業年収と副業収入から追加税負担と手取りを計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "本業情報を入力", "text": "本業の年収・年齢・家族構成を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "副業情報を入力", "text": "副業の種類を選択し、収入と経費を入力します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」を押すと追加税負担・実質手取り・確定申告要否が表示されます。" },
      ],
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
