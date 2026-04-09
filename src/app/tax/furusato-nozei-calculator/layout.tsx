import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】ふるさと納税 控除上限額計算機｜年収・家族構成から自動計算",
  description: "年収と家族構成を入力するだけでふるさと納税の控除上限額を自動計算。所得税還付・住民税控除の内訳も表示。2024年度対応の無料シミュレーター。",
  alternates: { canonical: "https://yamada-tools.jp/tax/furusato-nozei-calculator" },
  openGraph: { url: "https://yamada-tools.jp/tax/furusato-nozei-calculator", siteName: "山田ツール", locale: "ja_JP", type: "website" , images: [{ url: "https://api.easynihon.com/api/og?site=yamada&title=%E3%80%90%E7%84%A1%E6%96%99%E3%80%91%E3%81%B5%E3%82%8B%E3%81%95%E3%81%A8%E7%B4%8D%E7%A8%8E%20%E6%8E%A7%E9%99%A4%E4%B8%8A%E9%99%90%E9%A1%8D%E8%A8%88%E7%AE%97%E6%A9%9F%EF%BD%9C%E5%B9%B4%E5%8F%8E%E3%83%BB%E5%AE%B6%E6%97%8F%E6%A7%8B%E6%88%90%E3%81%8B%E3%82%89%E8%87%AA%E5%8B%95%E8%A8%88%E7%AE%97" }] },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "ふるさと納税控除上限額計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "年収と家族構成を入力するだけでふるさと納税の控除上限額を自動計算。所得税還付・住民税控除の内訳も表示。",
      "url": "https://yamada-tools.jp/tax/furusato-nozei-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "税金・控除計算", "item": "https://yamada-tools.jp/tax" },
        { "@type": "ListItem", "position": 3, "name": "ふるさと納税計算機", "item": "https://yamada-tools.jp/tax/furusato-nozei-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "ふるさと納税の控除上限額はどう決まりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "控除上限額は年収と家族構成（扶養人数・共働きかどうか）によって決まります。おおよその目安は年収400万円の独身で約42,000円、年収600万円の共働き夫婦で約77,000円です。" },
        },
        {
          "@type": "Question",
          "name": "ワンストップ特例制度とは何ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "確定申告をしなくても寄付先の自治体に申請するだけで住民税控除が受けられる制度です。年間5自治体以内の寄付に限り利用でき、会社員など確定申告が不要な方に向いています。" },
        },
        {
          "@type": "Question",
          "name": "ふるさと納税は実質2,000円の自己負担とはどういう意味ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "控除上限額以内の寄付をすると、寄付額から2,000円を引いた金額が所得税の還付・住民税の控除として戻ってきます。例えば50,000円寄付すると48,000円が控除され、実質負担は2,000円になります。" },
        },
      ],
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
