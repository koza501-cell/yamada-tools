import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】賃貸 敷金礼金 トータルコスト計算機｜初期費用から退去費用まで全部計算",
  description: "賃貸の敷金・礼金・仲介手数料・鍵交換・火災保険・更新料・退去クリーニングまでトータルコストを計算。2物件の比較機能付き。隠れコストを可視化する無料ツール。",
  keywords: [
    "賃貸 初期費用 計算",
    "敷金 礼金 計算",
    "賃貸 総コスト",
    "賃貸 隠れコスト",
    "仲介手数料 計算",
    "更新料 計算",
    "退去費用 目安",
    "賃貸 比較",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/realestate/rental-cost-calculator",
  },
  openGraph: {
    title: "【無料】賃貸 敷金礼金 トータルコスト計算機｜初期費用から退去費用まで全部計算",
    description: "賃貸の敷金・礼金・仲介手数料・鍵交換・火災保険・更新料・退去クリーニングまでトータルコストを計算。2物件の比較機能付き。",
    url: "https://yamada-tools.jp/realestate/rental-cost-calculator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E8%B3%83%E8%B2%B8%20%E6%95%B7%E9%87%91%E7%A4%BC%E9%87%91%20%E3%83%88%E3%83%BC%E3%82%BF%E3%83%AB%E3%82%B3%E3%82%B9%E3%83%88%E8%A8%88%E7%AE%97%E6%A9%9F%EF%BD%9C%E5%88%9D%E6%9C%9F%E8%B2%BB%E7%94%A8%E3%81%8B%E3%82%89%E9%80%80%E5%8E%BB%E8%B2%BB%E7%94%A8%E3%81%BE%E3%81%A7%E5%85%A8%E9%83%A8%E8%A8%88%E7%AE%97" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】賃貸 敷金礼金 トータルコスト計算機｜初期費用から退去費用まで全部計算",
    description: "賃貸の敷金・礼金・仲介手数料・鍵交換・火災保険・更新料・退去クリーニングまでトータルコストを計算。2物件の比較機能付き。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "賃貸 敷金礼金 トータルコスト計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": {
        "@type": "Organization",
        "name": "山田ツール",
        "url": "https://yamada-tools.jp",
      },
      "description":
        "賃貸の敷金・礼金・仲介手数料・更新料・退去費用まで含めたトータルコストを計算。2物件の比較機能付き。隠れコストを可視化する無料ツール。",
      "url": "https://yamada-tools.jp/realestate/rental-cost-calculator",
      "datePublished": "2026-03-31",
      "dateModified": "2026-03-31",
      "inLanguage": "ja",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "ホーム",
          "item": "https://yamada-tools.jp",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "不動産・住まい",
          "item": "https://yamada-tools.jp/realestate",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "賃貸 敷金礼金 トータルコスト計算機",
          "item": "https://yamada-tools.jp/realestate/rental-cost-calculator",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "賃貸の初期費用を安くする方法はありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "礼金ゼロ・敷金ゼロ物件を選ぶ、フリーレント物件を探す、仲介手数料を交渉する、引越し時期を繁忙期を避けるなどの方法が有効です。",
          },
        },
        {
          "@type": "Question",
          "name": "敷金は全額返ってきますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "通常の生活による劣化は貸主負担です。借主負担となるのは故意・過失による損傷です。入居時の状態を写真で記録しておくことをお勧めします。",
          },
        },
        {
          "@type": "Question",
          "name": "仲介手数料は値引き交渉できますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "可能な場合があります。法律上の上限は賃料の1ヶ月分+消費税です。空室が多い時期や閑散期には交渉しやすくなります。",
          },
        },
        {
          "@type": "Question",
          "name": "保証会社の費用はどのくらいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "初回保証料は家賃の30〜100%が一般的です。毎年または2年ごとに更新料が発生する場合もあります。保証会社によって費用が大きく異なるため入居前に確認しましょう。",
          },
        },
        {
          "@type": "Question",
          "name": "退去時の原状回復費用の相場はいくらですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "通常使用の場合、ハウスクリーニング費用が主な負担で1K〜1LDKで3〜6万円程度が相場です。国土交通省の原状回復ガイドラインを参考に不当な請求には交渉も可能です。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "賃貸トータルコストの計算方法",
      "description": "家賃・初期費用・更新料・退去費用から賃貸の総コストを計算する手順",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "物件情報を入力",
          "text": "家賃・敷金・礼金・仲介手数料・その他初期費用を入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "居住条件を入力",
          "text": "居住予定年数・更新料・家賃値上がり率を入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "退去費用を入力",
          "text": "間取り・敷金返還条件・クリーニング費用を入力します。",
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "計算ボタンを押す",
          "text": "「計算する」を押すと初期費用・月額コスト・トータルコストが表示されます。",
        },
      ],
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
