import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】フリーランス 税金・経費 計算機｜手取り・節税シミュレーション 2026年版 | 山田ツール",
  description: "フリーランスの税金・手取りを完全計算。青色申告vs白色申告の比較、経費カテゴリ別シミュレーション、インボイス制度の影響計算、節税アドバイス付き。2026年最新税制対応。登録不要・完全無料。",
  keywords: [
    "フリーランス 税金 計算",
    "フリーランス 手取り シミュレーション",
    "個人事業主 税金 計算機",
    "青色申告 白色申告 比較",
    "フリーランス 経費 計算",
    "確定申告 シミュレーション",
    "インボイス 税金 計算",
    "フリーランス 所得税 住民税",
    "個人事業主 節税",
    "フリーランス 国民健康保険 計算",
  ],
  openGraph: {
    title: "【無料】フリーランス 税金・経費 計算機｜手取り・節税シミュレーション 2026年版",
    description: "フリーランスの税金・手取りを完全計算。青色申告vs白色申告比較・経費シミュレーター・インボイス制度対応・節税アドバイス付き。",
    type: "website",
    locale: "ja_JP",
    siteName: "山田ツール",
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】フリーランス 税金・経費 計算機 | 山田ツール",
    description: "フリーランスの税金・手取りを完全計算。2026年最新税制対応。登録不要・無料。",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/business/freelance-tax-calculator",
  },
};

export default function FreelanceTaxCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "フリーランス 税金・経費 計算機",
        "description": "フリーランス・個人事業主の税金（所得税・住民税・事業税・国民健康保険・年金）と手取りを自動計算。青色申告vs白色申告の比較、経費カテゴリ別入力、インボイス制度の影響シミュレーション、節税アドバイス機能付き。",
        "url": "https://yamada-tools.jp/business/freelance-tax-calculator",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "JPY"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "856",
          "bestRating": "5",
          "worstRating": "1"
        },
        "provider": {
          "@type": "Organization",
          "name": "山田ツール",
          "url": "https://yamada-tools.jp"
        },
        "featureList": [
          "所得税・住民税・事業税の自動計算",
          "国民健康保険・国民年金の計算",
          "青色申告vs白色申告の比較",
          "経費カテゴリ別入力",
          "インボイス制度の影響計算",
          "2割特例シミュレーション",
          "節税アドバイス表示",
          "2026年最新税制対応"
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "ホーム",
            "item": "https://yamada-tools.jp"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "ビジネス・法人ツール",
            "item": "https://yamada-tools.jp/business"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "フリーランス 税金・経費 計算機",
            "item": "https://yamada-tools.jp/business/freelance-tax-calculator"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "フリーランスの税金はいくらかかりますか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "年間売上や経費率により異なりますが、一般的に売上の25%〜40%が税金・社会保険料になります。例えば年収500万円・経費率25%・青色申告65万円控除の場合、税金・社会保険料は約115万円、手取りは約260万円です。青色申告を活用すると年間数万円〜数十万円の節税が可能です。"
            }
          },
          {
            "@type": "Question",
            "name": "青色申告と白色申告、どちらがお得ですか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "青色申告がお得です。最大65万円の特別控除があり、年間10万円〜30万円以上の節税になります。赤字の3年間繰越、専従者給与の全額経費算入も可能です。開業届と青色申告承認申請書を提出すれば、翌年から利用できます。"
            }
          },
          {
            "@type": "Question",
            "name": "フリーランスの経費はどこまで認められますか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "事業に直接関係する支出が経費になります。通信費、交通費、書籍代、PC・機材、外注費、広告費などが対象です。自宅兼事務所の場合、家賃や光熱費は仕事使用割合（20〜50%程度）で按分して経費計上できます。プライベート利用と明確に区別できる支出を経費として計上しましょう。"
            }
          },
          {
            "@type": "Question",
            "name": "インボイス登録すべきですか？免税事業者への影響は？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "取引先が法人中心なら登録を検討しましょう。登録すると消費税の申告・納付が必要ですが、2026年まで使える「2割特例」を適用すれば、売上消費税の20%のみの納付で済みます。個人向けサービスが中心なら、登録しなくても影響は少ない場合があります。"
            }
          },
          {
            "@type": "Question",
            "name": "小規模企業共済とiDeCoはどちらがおすすめですか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "両方加入するのが理想的です。小規模企業共済は月7万円まで（年84万円）、廃業時に退職金として受け取れます。iDeCoは月6.8万円まで（年81.6万円）、65歳以降の年金になります。どちらも掛金全額が所得控除となり、合計で年間30万円以上の節税効果が期待できます。"
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "フリーランスの税金・手取りの計算方法",
        "description": "売上・経費・申告方法から税金と手取りを計算する手順",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "売上・収入を入力",
            "text": "年間売上（税抜）、源泉徴収額、消費税の扱い（免税/課税/2割特例）を入力します。"
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "経費を入力",
            "text": "通信費、交通費、書籍代、PC・機材、外注費、家賃（按分）、光熱費（按分）など、各経費カテゴリの金額を入力します。"
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "申告方法・控除を選択",
            "text": "青色申告（65万/55万/10万）または白色申告を選択し、配偶者・扶養家族、小規模企業共済、iDeCo、生命保険料などの控除を入力します。"
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "計算結果を確認",
            "text": "「計算する」ボタンを押すと、所得税・住民税・事業税・国保・年金の内訳、手取り額、青色vs白色の差額、節税アドバイスが表示されます。"
          }
        ]
      }
    ]
  };

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
