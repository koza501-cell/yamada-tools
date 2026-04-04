import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】退職金計算機｜退職所得控除・税金・手取りを自動計算 2026年版 | 山田ツール",
  description: "退職金の手取り額を正確計算。勤続年数から退職所得控除を自動算出し、所得税・住民税を差し引いた実際の手取り額を表示。一般・役員・早期退職に対応。登録不要・無料。",
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "退職金計算機",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" },
      "description": "退職金の手取り額を正確計算。退職所得控除・所得税・住民税を自動算出。一般退職・役員退職・早期退職に対応。2026年最新税制対応の無料シミュレーター。",
      "url": "https://yamada-tools.jp/career/retirement-bonus-calculator",
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "転職・年収", "item": "https://yamada-tools.jp/career" },
        { "@type": "ListItem", "position": 3, "name": "退職金計算機", "item": "https://yamada-tools.jp/career/retirement-bonus-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "退職金に税金がかからないケースはありますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "退職金の額が退職所得控除額以下であれば税金はかかりません。例えば勤続10年で退職金400万円以下なら退職所得控除400万円が適用されるため所得税・住民税ともにゼロです。" },
        },
        {
          "@type": "Question",
          "name": "退職金の税金はいつ払うのですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "会社が源泉徴収する場合は退職金受取時に自動的に差し引かれます。自分で確定申告する場合は翌年2〜3月の確定申告時に納税します。" },
        },
        {
          "@type": "Question",
          "name": "転職を繰り返した場合、退職金の税金はどうなりますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "同一年に複数の退職金を受け取った場合や前回の受取から5年以内に再度受け取る場合は計算が複雑になります。前回の勤続期間と重複する場合は退職所得控除の調整が必要です。" },
        },
        {
          "@type": "Question",
          "name": "退職金を一時金と年金に分けて受け取ることはできますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "企業によっては一時金と年金に分けて受け取れる制度があります。一時金は退職所得として有利な課税、年金は雑所得として総合課税されます。" },
        },
        {
          "@type": "Question",
          "name": "iDeCoの受取も退職金と同じ税率ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "iDeCoを一時金で受け取る場合は退職所得として退職所得控除が適用されます。同年に会社の退職金も受け取る場合は控除枠を共有するため、受取時期を5年以上ずらすことで控除を別々に使える場合があります。" },
        },
      ],
    },
    {
      "@type": "HowTo",
      "name": "退職金の手取り計算方法",
      "description": "退職金額と勤続年数から手取り額を計算する手順",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "退職金情報を入力", "text": "退職金の種類・金額・勤続年数・退職理由を入力します。" },
        { "@type": "HowToStep", "position": 2, "name": "追加情報を選択", "text": "障害者退職・前回退職金の有無を選択します。" },
        { "@type": "HowToStep", "position": 3, "name": "計算ボタンを押す", "text": "「計算する」を押すと退職所得控除・税額・手取り額が表示されます。" },
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
