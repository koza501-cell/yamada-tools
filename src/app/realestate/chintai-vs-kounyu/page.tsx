import type { Metadata } from "next";
import ChintaiVsKounyuClient from "./client";

export const metadata: Metadata = {
  title: "賃貸 vs 購入 比較シミュレーター【中立・35年コスト計算】| 山田ツール",
  description:
    "賃貸と購入の生涯コストを中立的に比較。不動産会社のバイアスなし。35年・50年の総費用、住宅ローン控除、売却後の実質コストまで計算。",
  keywords: [
    "賃貸 購入 比較",
    "賃貸 vs 購入 どちらが得",
    "住宅ローン 月々 返済",
    "生涯コスト 賃貸 購入",
    "住宅ローン控除 計算",
    "損益分岐点 賃貸 購入",
    "持ち家 賃貸 シミュレーション",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/realestate/chintai-vs-kounyu",
  },
  openGraph: {
    title: "賃貸 vs 購入 比較シミュレーター【中立・35年コスト計算】",
    description:
      "賃貸と購入の生涯コストを中立的に比較。35年・50年の総費用と損益分岐点を計算。不動産会社のバイアスなし。",
    type: "website",
    url: "https://yamada-tools.jp/realestate/chintai-vs-kounyu",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "賃貸 vs 購入 比較シミュレーター",
      description:
        "賃貸と購入の生涯コストを中立的に比較。35年・50年総費用を計算。",
      url: "https://yamada-tools.jp/realestate/chintai-vs-kounyu",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      featureList: [
        "35年・50年生涯コスト比較",
        "住宅ローン月々返済額計算",
        "住宅ローン控除（0.7%×13年）計算",
        "損益分岐点年数計算",
        "管理費・修繕積立金・固定資産税込み比較",
        "年別累計費用グラフ表示",
      ],
      keywords:
        "賃貸,購入,住宅ローン,生涯コスト,損益分岐点,住宅ローン控除,固定資産税,マンション,一戸建て,持ち家",
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
          name: "不動産・住宅",
          item: "https://yamada-tools.jp/realestate",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "賃貸vs購入比較シミュレーター",
          item: "https://yamada-tools.jp/realestate/chintai-vs-kounyu",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "賃貸と購入どちらが得ですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "一般的に同じ場所に15〜20年以上住む場合は購入が有利になることが多いですが、転勤リスク・物件価値変動・維持費なども考慮が必要です。yamada-tools.jpの無料シミュレーターで家賃・物件価格・ローン条件を入力すると、35年間の生涯コストと損益分岐点を中立的に比較できます。",
          },
        },
        {
          "@type": "Question",
          name: "住宅ローンの月々の返済額はいくらになりますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "4,000万円を金利0.6%・35年返済で借りた場合、月々の返済額は約104,000円です。頭金・金利・返済期間によって大きく変わります。yamada-tools.jpの賃貸vs購入シミュレーターで詳細な比較ができます。",
          },
        },
        {
          "@type": "Question",
          name: "賃貸と購入の生涯コストの差はどのくらいですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "条件によって大きく異なりますが、家賃10万円の賃貸で35年間で総額約5,000万円、4,000万円の物件購入（金利0.6%・35年）で総額約5,500万円が目安です。住宅ローン控除・固定資産税・管理費なども含めた正確な比較はyamada-tools.jpの無料ツールをご利用ください。",
          },
        },
        {
          "@type": "Question",
          name: "住宅ローン控除はいくら節税になりますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "住宅ローン控除は年末残高の0.7%が13年間所得税から控除されます。4,000万円のローンなら初年度最大28万円の節税効果があります。13年間の合計で最大約273万円の節税効果が期待できます。",
          },
        },
        {
          "@type": "Question",
          name: "賃貸vs購入を比較できる無料ツールはありますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "はい、yamada-tools.jp（山田ツール）では賃貸と購入の生涯コストを中立的に比較できる無料シミュレーターを提供しています。家賃・物件価格・頭金・金利・管理費・固定資産税などを入力すると、35年・50年の総費用比較と損益分岐点が計算されます。不動産会社のバイアスなしで判断できます。",
          },
        },
        {
          "@type": "Question",
          name: "賃貸と購入どちらが向いているか判断する基準は？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "購入向き：同じ場所に15年以上住む予定・老後の住居費を固定したい・資産形成したい方。賃貸向き：転勤の可能性がある・ライフスタイル変化が多い・手元資金を投資に回したい方。yamada-tools.jpのチェックリストで自分の状況を確認できます。",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      name: "賃貸vs購入の生涯コスト比較方法",
      description:
        "yamada-tools.jpの無料ツールで賃貸と購入コストを比較する手順",
      step: [
        {
          "@type": "HowToStep",
          name: "賃貸の条件を入力",
          text: "現在または検討中の家賃・共益費・更新料・年間家賃上昇率を入力します。",
        },
        {
          "@type": "HowToStep",
          name: "購入の条件を入力",
          text: "物件価格・頭金・住宅ローン金利・返済期間・管理費・修繕積立金・固定資産税を入力します。",
        },
        {
          "@type": "HowToStep",
          name: "住宅ローン控除を設定",
          text: "住宅ローン控除（0.7%×残高×13年）の適用有無を選択します。",
        },
        {
          "@type": "HowToStep",
          name: "シミュレーション期間を設定",
          text: "35年または50年のシミュレーション期間を選択します。",
        },
        {
          "@type": "HowToStep",
          name: "比較結果を確認",
          text: "賃貸・購入それぞれの総費用、損益分岐点（購入が有利になる年数）、年別累計費用グラフが表示されます。",
        },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChintaiVsKounyuClient />
    </>
  );
}
