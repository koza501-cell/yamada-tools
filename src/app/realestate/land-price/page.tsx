import { Metadata } from "next";
import LandPriceClient from "./client";

export const metadata: Metadata = {
  title: "地価チェッカー — 住所で地価公示・地価調査を確認 | 山田ツール",
  description:
    "住所を入力するだけで近隣の地価公示・地価調査データを確認。㎡単価・坪単価・前年比変動率・エリア平均価格も表示。相続・売買・固定資産税・土地評価の参考に。国土交通省データ使用、完全無料。",
  keywords: [
    "地価 調べ方 無料",
    "地価公示 住所 検索",
    "土地価格 相場 確認",
    "坪単価 調べる",
    "相続 土地価格 評価",
    "固定資産税 地価 参考",
    "地価 前年比 上昇 下落",
    "不動産 売却 相場 調べ方",
    "土地 売却 価格 目安",
    "地価公示 わかりやすく",
    "公示地価 実勢価格 違い",
    "地価 スマホ 確認",
  ],
  alternates: { canonical: "https://yamada-tools.jp/realestate/land-price" },
  openGraph: {
    title: "地価チェッカー — 住所で地価公示・坪単価を確認",
    description: "住所だけで近隣の地価公示・地価調査データ、㎡単価・坪単価・前年比を確認。相続・売買の参考に。",
    type: "website",
    url: "https://yamada-tools.jp/realestate/land-price",
    siteName: "山田ツール",
    locale: "ja_JP",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "地価チェッカー",
      "url": "https://yamada-tools.jp/realestate/land-price",
      "description": "住所を入力するだけで近隣の地価公示・地価調査データを確認できる無料ツール。㎡単価・坪単価・前年比変動率・エリア平均も表示。",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "不動産", "item": "https://yamada-tools.jp/realestate" },
        { "@type": "ListItem", "position": 3, "name": "地価チェッカー", "item": "https://yamada-tools.jp/realestate/land-price" }
      ]
    },
    {
      "@type": "HowTo",
      "name": "地価公示の調べ方",
      "description": "住所を入力するだけで近隣の地価公示データを無料で確認する方法",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "住所を入力", "text": "調べたい住所を入力欄に入力します。市区町村名だけでも検索できますが、番地まで入力するとより近い地点のデータが表示されます。" },
        { "@type": "HowToStep", "position": 2, "name": "検索ボタンをクリック", "text": "「地価を調べる」ボタンをクリックします。" },
        { "@type": "HowToStep", "position": 3, "name": "結果を確認", "text": "近隣の地価公示地点の㎡単価・坪単価・前年比変動率・エリア平均価格が表示されます。" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "地価公示とは何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "地価公示とは、国土交通省が地価公示法に基づき、毎年1月1日時点の標準地の正常な価格（公示価格）を3月下旬に発表するものです。全国約26,000地点で調査され、土地取引の指標や相続税・固定資産税の算定基準として活用されます。一般的に実勢価格（実際の取引価格）の目安にもなります。" }
        },
        {
          "@type": "Question",
          "name": "地価公示と実際の売買価格（実勢価格）は違いますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、異なります。地価公示は公的な基準地価であり、実際の売買価格（実勢価格）は需給関係や個別条件によって変動します。一般的に実勢価格は公示価格の0.9〜1.1倍程度といわれますが、立地・時期・条件によって大きく異なります。このツールの地価公示データはあくまで参考値としてご活用ください。" }
        },
        {
          "@type": "Question",
          "name": "坪単価とは何ですか？㎡単価との違いは？",
          "acceptedAnswer": { "@type": "Answer", "text": "坪単価は1坪（約3.3㎡）あたりの価格で、日本の不動産業界では伝統的に使われてきた単位です。㎡単価は国際標準で1平方メートルあたりの価格です。1坪＝3.30579㎡なので、㎡単価×3.30579＝坪単価となります。このツールでは両方を表示しています。" }
        },
        {
          "@type": "Question",
          "name": "前年比変動率の見方を教えてください",
          "acceptedAnswer": { "@type": "Answer", "text": "前年比変動率はプラスが地価上昇、マイナスが地価下落を示します。例えば+5.0%なら前年より5%土地価格が上がったことを意味します。都市部・駅近エリアは上昇傾向、地方・過疎地は下落傾向にある場合が多いです。不動産投資や売却タイミングの参考にお使いください。" }
        },
        {
          "@type": "Question",
          "name": "相続税申告に地価公示データは使えますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "相続税の土地評価には、原則として国税庁が公表する「路線価」（公示価格の約80%水準）が使われます。地価公示データは相続税の直接の計算根拠ではありませんが、土地価値の大まかな目安として参考にできます。正確な相続税評価は税理士や税務署にご相談ください。" }
        },
        {
          "@type": "Question",
          "name": "地価データが見つからない場合はどうすればいいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "地価公示地点は全国に約26,000点あり、すべての住所の近くにあるわけではありません。特に農村部・山間部・離島では地点が少ない場合があります。近くのデータが見つからない場合は、より広い範囲の住所（市区町村名のみなど）で検索するか、国土交通省の「土地総合情報システム」でご確認ください。" }
        },
        {
          "@type": "Question",
          "name": "地価公示と地価調査の違いは何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "地価公示（公示地価）は国土交通省が毎年1月1日時点で調査し3月に発表するものです。地価調査（基準地価）は各都道府県が毎年7月1日時点で調査し9月に発表するものです。両者を合わせることで年2回の地価動向を把握できます。このツールでは両方のデータを表示しています。" }
        }
      ]
    }
  ]
};

export default function LandPricePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandPriceClient />
    </>
  );
}
