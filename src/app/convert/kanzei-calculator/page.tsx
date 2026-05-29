import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import KanzeiClient from "./client";
import { AdUnit } from "@/components/common/AdUnit";
import { LazyFAQ } from "@/components/common/LazyFAQ";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("kanzei-calculator")!;

const faq = [
  {
    question: "個人輸入で関税はいくらからかかりますか？",
    answer: "課税価格の合計が16,666円を超えると関税・消費税の対象になります。商品代金が16,666円（合計20,000円相当）以下なら原則免税ですが、革製品・ニット製品・酒類など一部品目は1円から課税されます。本ツールでは免税ラインを自動判定します。",
  },
  {
    question: "個人輸入と商業輸入で関税率は違いますか？",
    answer: "個人輸入は「個人使用目的」として簡易税率が適用され、商業輸入より低い税率になることが多いです。本ツールは個人モード／商業モードを切り替え可能で、それぞれ正しい税率で計算します。商業利用なら必ず商業モードを選んでください。",
  },
  {
    question: "課税価格は商品代金そのものですか？",
    answer: "個人輸入の課税価格は「商品代金の60%」が基本です（簡易税率制度）。商業輸入の場合は商品代金＋送料＋保険料の全額が課税対象です。本ツールは選択モードに応じて自動で正しい計算式を適用します。",
  },
  {
    question: "革製品の関税が高いと聞きましたが本当ですか？",
    answer: "本当です。革製ハンドバッグ・革靴・革ジャケットは関税率20%前後と最も高い品目の一つで、免税ライン（16,666円）の適用もありません。1円から課税されるため、たとえば3万円の革バッグでも数千円の関税がかかります。本ツールは品目別の特殊ルールを自動反映します。",
  },
  {
    question: "送料は関税計算に含まれますか？",
    answer: "個人輸入では送料は課税価格に含まれません（商品代金の60%が課税対象）。商業輸入では送料・保険料も含めた合計額（CIF価格）が課税対象になります。本ツールではモードに応じて自動的に正しい計算をします。",
  },
  {
    question: "計算結果は税関の判断と一致しますか？",
    answer: "本ツールは目安としての試算です。実際の課税は税関職員の判断により、商品の用途や品質によって税率が変わることがあります。特に革製品・繊維製品・電子機器は確認が厳しい品目です。事前見積もりや想定外の費用回避には十分役立ちますが、最終金額は通関時に確定します。",
  },
  {
    question: "通関手数料も関税に含まれますか？",
    answer: "含まれません。本ツールが計算するのは「関税＋消費税＋地方消費税」です。これとは別に、宅配業者の通関手数料（500〜2,000円程度）や消費税・地方消費税の取り扱い手数料がかかる場合があります。実際の支払総額はこれらを上乗せして見積もってください。",
  },
  {
    question: "ビジネス利用（転売・販売目的）でも使えますか？",
    answer: "使えます。商業モードを選択してください。商業輸入では関税の優遇がなく、商品代金＋送料＋保険料の全額が課税対象、税率も簡易ではなく一般税率が適用されます。仕入れ判断や利益試算に活用できます。インボイス制度下では仕入税額控除の処理も別途必要です。",
  },
];

export const metadata: Metadata = generateToolMetadata({
  customTitle: "個人輸入の関税計算機【無料】10カテゴリ・8通貨対応｜海外通販・eBay・Amazon輸入の関税・消費税を自動計算",
  tool,
  longDescription: "個人輸入や越境ECで関税・消費税がいくらかかるかを無料計算。商品カテゴリ別の関税率、課税対象額、免税ラインを自動判定。eBay・Amazon海外・Shopify輸入の事前見積もりに。10カテゴリ・8通貨対応。",
  keywords: [
    "個人輸入 関税",
    "関税計算機",
    "個人輸入 消費税",
    "eBay 関税",
    "Amazon 海外 関税",
    "海外通販 関税",
    "関税 計算 無料",
    "輸入 関税率",
    "個人輸入 免税",
    "越境EC 関税",
    "Shopify 輸入",
    "海外購入 関税",
    "関税 いくら",
    "個人輸入 送料 関税",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <KanzeiClient />
      <AdUnit slot="5612038947" format="horizontal" />

      {/* Educational Content */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-kon dark:text-gray-100 mb-6">個人輸入で関税が発生する仕組み</h2>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            海外サイトで商品を購入し日本に発送すると、商品の種類と金額によって関税・消費税が発生します。
            個人輸入では一般的に「商品代金の60%」が課税価格とみなされ、それを基準に税額が計算されます。
            課税価格の合計が16,666円（商品代金20,000円相当）以下なら原則免税ですが、革製品・酒類・タバコなど
            一部の品目は1円から課税対象です。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">本ツールで分かること</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 mb-6">
            <li>商品カテゴリ別の関税率（10カテゴリ対応）</li>
            <li>個人輸入／商業輸入それぞれの正しい課税ベース</li>
            <li>関税＋消費税＋地方消費税の合計</li>
            <li>免税ラインの自動判定</li>
            <li>8通貨対応（USD・EUR・GBP・CNY・KRW・AUD・CAD・JPY）</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">こんな場面で使えます</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 mb-6">
            <li><strong>eBay・Amazon海外</strong>での購入前見積もり</li>
            <li><strong>Shopify・個人輸入代行</strong>での仕入れ試算</li>
            <li><strong>越境EC・転売ビジネス</strong>の利益計算</li>
            <li><strong>海外通販</strong>での税込み総額確認</li>
            <li><strong>クリスマス・誕生日プレゼント</strong>の海外通販事前確認</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">関税が高くなりやすい品目</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            革製品（ハンドバッグ・革靴・革ジャケット）は関税率20%前後で最も高く、免税ラインも適用されません。
            ニット衣類・酒類・タバコも比較的高税率です。一方、書籍・電子書籍・コンピューターソフトウェアは
            関税ゼロ、絵画・骨董品も特例で低税率です。本ツールは品目別の特殊ルールを自動的に反映します。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-8 mb-3">注意事項</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            本ツールは目安計算です。実際の課税は税関の判断により、申告内容や用途で税率が変わる場合があります。
            特に革製品・繊維製品・電子機器は確認が厳しい傾向があります。通関業者の手数料（500〜2,000円程度）
            は別途発生します。事前見積もりや想定外の費用回避にお役立てください。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-kon dark:text-gray-100 mb-6">よくある質問（FAQ）</h2>
        <LazyFAQ faq={faq} />
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-12">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
