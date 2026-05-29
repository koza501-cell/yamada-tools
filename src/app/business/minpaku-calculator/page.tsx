import { Metadata } from "next";
import MinpakuClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "【無料】民泊・Airbnb 収益計算機【180日制限対応・2026年版】｜年間収益・投資回収を即試算 | yamada-tools.jp",
  description: "民泊の年間収益・投資回収を計算。住宅宿泊事業法の180日制限と通年365日（旅館業）の比較対応。立地・稼働率・経費を入力するだけで月別売上グラフ・表面利回り・投資回収年数まで自動計算。完全無料・登録不要。",
  keywords: ["民泊 収益 計算", "Airbnb 収益 シミュレーター", "民泊 180日制限", "住宅宿泊事業法", "民泊 投資回収", "民泊 利回り", "民泊 経営 試算", "Airbnb 経費"],
  alternates: { canonical: "https://yamada-tools.jp/business/minpaku-calculator" },
  openGraph: {
    title: "民泊・Airbnb 収益計算機【180日制限対応・2026年版】",
    description: "民泊の年間収益・投資回収を計算。住宅宿泊事業法の180日制限対応。完全無料。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "民泊・Airbnb 収益計算機",
      "url": "https://yamada-tools.jp/business/minpaku-calculator",
      "description": "民泊の年間収益・投資回収を計算。住宅宿泊事業法の180日制限対応。",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "ビジネス", "item": "https://yamada-tools.jp/business" },
        { "@type": "ListItem", "position": 3, "name": "民泊・Airbnb 収益計算機", "item": "https://yamada-tools.jp/business/minpaku-calculator" }
      ]
    },
    {
      "@type": "HowTo",
      "name": "民泊・Airbnb収益の計算方法",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "立地と営業日数を選択", "text": "所在地（都心部・観光地・郊外・地方）と年間営業日数（180日 or 365日）を選択。" },
        { "@type": "HowToStep", "position": 2, "name": "収益条件を入力", "text": "1泊料金、稼働率、Airbnb手数料率を入力。スライダーで稼働率を調整できます。" },
        { "@type": "HowToStep", "position": 3, "name": "経費を入力", "text": "清掃費、リネン費、管理委託費、管理費・光熱費を入力。月額・売上%の管理委託にも対応。" },
        { "@type": "HowToStep", "position": 4, "name": "初期投資を入力", "text": "家具・設備費、リフォーム費を入力。" },
        { "@type": "HowToStep", "position": 5, "name": "計算ボタンを押す", "text": "「収益を計算する」ボタンで年間売上・純利益・利回り・投資回収年数・月別売上グラフが表示されます。" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "民泊の180日制限とは何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "住宅宿泊事業法（民泊新法）により、届出住宅は年間180日が営業上限です。違反すると業務停止・届出取消の罰則があります。" }
        },
        {
          "@type": "Question",
          "name": "民泊の平均稼働率はどのくらいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "観光庁の調査によると、届出住宅あたりの平均宿泊日数は約103日（年換算）で、上限180日に対し約57%の水準です。都心部では70〜85%まで上がります。" }
        },
        {
          "@type": "Question",
          "name": "民泊で年間どのくらい稼げますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "都心部の1泊1万円・稼働率65%・180日営業の物件で年商約120万円が目安。経費を引いた純利益は60〜80万円程度です。" }
        },
        {
          "@type": "Question",
          "name": "民泊の初期投資はどれくらい必要ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "家具・家電・寝具で50〜100万円、リフォームを含めると200〜500万円が目安です。物件取得費用は別途必要です。" }
        },
        {
          "@type": "Question",
          "name": "民泊の廃業率はどのくらいですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "観光庁データによると、累計廃業率は約36〜38%です。供給過剰や180日制限による収益性の低さが主な要因です。" }
        },
        {
          "@type": "Question",
          "name": "民泊収益を無料で計算できるツールはありますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、yamada-tools.jp（山田ツール）の民泊・Airbnb 収益計算機が完全無料・登録不要で使えます。" }
        }
      ]
    }
  ]
};

const tool = getToolById("minpaku-calculator")!;

export default function MinpakuPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MinpakuClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
