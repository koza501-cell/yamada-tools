import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】消費税 簡易課税 判定・比較ツール｜本則vs簡易vs2割特例 2026年版",
  description: "消費税の課税方式を3パターン比較。本則課税・簡易課税・2割特例のどれが有利か自動判定。業種別みなし仕入率対応、インボイス登録の影響も計算。2026年最新税制対応。登録不要・完全無料。",
  keywords: [
    "消費税 簡易課税 計算",
    "簡易課税 本則課税 比較",
    "消費税 2割特例 計算",
    "みなし仕入率 業種",
    "インボイス 消費税 シミュレーション",
    "消費税 どっちが得",
    "簡易課税 届出 判断",
    "消費税 節税",
    "課税事業者 免税事業者",
    "消費税 計算 ツール",
  ],
  openGraph: {
    title: "【無料】消費税 簡易課税 判定・比較ツール｜本則vs簡易vs2割特例 2026年版",
    description: "消費税の課税方式を3パターン比較。本則課税・簡易課税・2割特例のどれが有利か自動判定。業種別みなし仕入率対応。",
    type: "website",
    locale: "ja_JP",
    siteName: "山田ツール",
    images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E6%B6%88%E8%B2%BB%E7%A8%8E%20%E7%B0%A1%E6%98%93%E8%AA%B2%E7%A8%8E%20%E5%88%A4%E5%AE%9A%E3%83%BB%E6%AF%94%E8%BC%83%E3%83%84%E3%83%BC%E3%83%AB%EF%BD%9C%E6%9C%AC%E5%89%87vs%E7%B0%A1%E6%98%93vs2%E5%89%B2%E7%89%B9%E4%BE%8B%202026%E5%B9%B4%E7%89%88" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "【無料】消費税 簡易課税 判定・比較ツール",
    description: "本則vs簡易vs2割特例を一括比較。2026年最新税制対応。登録不要・無料。",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/business/simplified-tax-calculator",
  },
};

export default function SimplifiedTaxCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "消費税 簡易課税 判定・比較ツール",
        "description": "消費税の課税方式（本則課税・簡易課税・2割特例）を3パターン同時比較し、最も有利な方式を自動判定。業種別みなし仕入率に対応し、インボイス登録の影響も計算できる消費税シミュレーター。",
        "url": "https://yamada-tools.jp/business/simplified-tax-calculator",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "JPY"
        },
        "provider": {
          "@type": "Organization",
          "name": "山田ツール",
          "url": "https://yamada-tools.jp"
        },
        "featureList": [
          "本則課税の消費税計算",
          "簡易課税の消費税計算",
          "2割特例の消費税計算",
          "3方式の同時比較",
          "最有利方式の自動判定",
          "業種別みなし仕入率対応",
          "インボイス登録影響計算",
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
            "name": "消費税 簡易課税 判定ツール",
            "item": "https://yamada-tools.jp/business/simplified-tax-calculator"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "簡易課税と本則課税、どちらが有利ですか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "実際の仕入率がみなし仕入率より低い場合は簡易課税が有利、高い場合は本則課税が有利です。例えばサービス業（みなし仕入率50%）で実際の仕入率が30%なら簡易課税が有利。設備投資が多い年は本則課税で還付を受けられる場合もあります。"
            }
          },
          {
            "@type": "Question",
            "name": "2割特例とは何ですか？いつまで使えますか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "2割特例は、インボイス制度開始に伴い免税事業者から課税事業者になった方向けの経過措置です。売上消費税の2割のみを納付すればよく、2026年9月30日を含む課税期間まで適用できます。届出不要で確定申告時に選択可能です。"
            }
          },
          {
            "@type": "Question",
            "name": "簡易課税を選択する条件は何ですか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "簡易課税を選択するには、基準期間（2年前）の課税売上高が5,000万円以下であること、適用を受けようとする課税期間の開始日の前日までに届出書を提出することが必要です。一度選択すると2年間は変更できません。"
            }
          },
          {
            "@type": "Question",
            "name": "みなし仕入率は業種によってどう違いますか？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "第1種（卸売業）90%、第2種（小売業）80%、第3種（製造業等）70%、第4種（飲食業等）60%、第5種（サービス業等）50%、第6種（不動産業）40%です。複数の事業を営む場合は、売上割合に応じた加重平均か、主たる事業の区分を適用します。"
            }
          },
          {
            "@type": "Question",
            "name": "インボイス登録すべきか判断する基準は？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "取引先が法人や課税事業者中心なら登録を検討すべきです。登録しないと取引先が仕入税額控除できず、取引継続に影響する可能性があります。個人消費者向けビジネスなら登録しなくても影響は少ないでしょう。2割特例を活用すれば、登録後も消費税負担を抑えられます。"
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "消費税の有利な課税方式の判定方法",
        "description": "売上・仕入・業種から最適な消費税の課税方式を判定する手順",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "売上情報を入力",
            "text": "年間売上（税抜）と、インボイス登録状況（未登録/登録済み/2割特例適用可能）を選択します。"
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "仕入・経費を入力",
            "text": "課税仕入（仕入、外注費、経費など消費税がかかる支出）の年間合計を入力します。"
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "業種を選択",
            "text": "事業の業種区分を選択します。簡易課税のみなし仕入率（40%〜90%）が自動設定されます。"
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "比較結果を確認",
            "text": "「比較する」ボタンを押すと、本則課税・簡易課税・2割特例の消費税額が比較表示され、最も有利な方式がハイライトされます。"
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
