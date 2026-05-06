import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import MonochromeClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("monochrome")!;

const faq = [
  {
    question: "白黒変換はどうやって使いますか？",
    answer: "本ツールに画像をドラッグ＆ドロップするだけで、瞬時にモノクロ（白黒）変換できます。スライダーで強度を調整し、完全な白黒からうっすら色が残る状態まで自由にコントロール可能です。アップロード不要・ブラウザ内で処理されるため、機密性の高い画像も安全です。",
  },
  {
    question: "PNG画像も白黒変換できますか？",
    answer: "はい、PNGファイルの白黒変換に完全対応しています。透過情報も保持されるため、透過PNGをそのまま白黒化できます。JPG・WebP・BMP・GIFにも対応しています。",
  },
  {
    question: "完全な白黒にできますか？",
    answer: "はい、スライダーを100%にすると完全なモノクロ（グレースケール）になります。新聞印刷風や白黒写真風の仕上がりにしたい場合に最適です。",
  },
  {
    question: "少しだけ色を残せますか？",
    answer: "はい、スライダーで50%程度にすると、うっすら色が残るレトロな雰囲気になります。30%でセピア調風、70%でアート写真風など、強度を変えるだけで多彩な表現が可能です。",
  },
  {
    question: "印刷用に使えますか？",
    answer: "はい、高解像度のまま変換されるので印刷にも適しています。新聞・冊子・パンフレットなど、コスト削減のためモノクロ印刷したいケースで便利です。文書やチラシのモノクロ化にも活用できます。",
  },
  {
    question: "白黒画像をPDFに変換するには？",
    answer: "本ツールで画像を白黒変換したあと、ダウンロードした画像を「複数の画像をPDFにまとめる」ツールに渡すと、白黒画像のPDFファイルを作成できます。資料の白黒化＋PDF化までブラウザ上で完結します。",
  },
  {
    question: "元の画像は変更されますか？",
    answer: "いいえ、元の画像はそのままです。変換後の画像を別ファイルとしてダウンロードする方式なので、原本を残しつつ加工後の画像を取得できます。失敗を恐れず安心して試せます。",
  },
  {
    question: "スマホからも使えますか？",
    answer: "はい、iPhone・Androidどちらのスマートフォンからも利用可能です。ブラウザだけで使えるので、アプリのインストールは不要です。外出先で急に白黒変換が必要になった時にも便利です。",
  },
  {
    question: "ファイルはサーバーにアップロードされますか？",
    answer: "いいえ、本ツールはすべてブラウザ内で処理（クライアントサイド処理）されます。画像ファイルがサーバーに送信されることは一切なく、機密性の高い社内資料や個人写真も安心して白黒化できます。",
  },
  {
    question: "対応画像形式は？無料ですか？",
    answer: "JPG、PNG、WebP、BMP、GIF形式に対応。完全無料・登録不要・回数制限なしでご利用いただけます。日本国内サーバーで処理され、機密性の高い画像も安心です。",
  },
];

const seoContent = {
  intro: "カラー画像を白黒（モノクロ・グレースケール）に変換する無料ツールです。スライダーで色の残し具合を調整でき、完全な白黒からうっすら色が残る状態まで自由にコントロールできます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "モノクロ変換【無料】画像を白黒・グレースケールに変換｜PNG・JPG対応｜登録不要",
  tool,
  longDescription:
    "画像の白黒変換を瞬時に。写真・PNG・JPGをモノクロ・グレースケールに無料で変換。強度調整で色味の残し具合も設定可能。アップロード不要・ブラウザ処理で機密画像も安全。登録不要・完全無料。",
  keywords: [
    "白黒変換",
    "白黒 変換",
    "画像 白黒 変換",
    "写真 白黒 変換",
    "モノクロ変換",
    "モノクロ変換 無料",
    "PNG 白黒変換",
    "JPG 白黒変換",
    "グレースケール変換",
    "白黒画像 作成",
    "画像 モノクロ",
    "写真 白黒 加工",
    "モノクロ フィルター",
    "白黒写真 加工",
    "画像 グレースケール",
  ],
});

export default function Page() {
  const jsonLd = generateToolJsonLd(tool, faq);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MonochromeClient faq={faq} seoContent={seoContent} />

      {/* Educational Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-kon dark:text-blue-300 mb-6">画像の白黒変換をブラウザで瞬時に</h2>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            「写真を白黒にしたい」「カラー画像をモノクロに変換したい」「印刷コスト削減のため資料を白黒化したい」——そんな時に便利なのが本ツールです。画像をドラッグ＆ドロップするだけで、PNG・JPG・WebPなどあらゆる画像をモノクロ（グレースケール）に瞬時変換できます。<strong>すべてブラウザ内で処理</strong>されるため、機密性の高いデザインデータや社内資料も外部に送信されることなく安全に白黒変換できます。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">白黒変換の3ステップ</h3>
          <ol className="text-gray-700 dark:text-gray-300 space-y-3 mb-4 list-decimal list-inside">
            <li className="leading-relaxed"><strong>画像をアップロード</strong>：JPG・PNG・WebP・BMP・GIFをドラッグ＆ドロップ、またはファイル選択ボタンから指定します。</li>
            <li className="leading-relaxed"><strong>強度を調整</strong>：スライダーで0%（カラーのまま）〜100%（完全白黒）まで自由に調整。リアルタイムでプレビューが更新されます。</li>
            <li className="leading-relaxed"><strong>ダウンロード</strong>：仕上がりに満足したら、変換後の画像をダウンロード。元の画像はそのまま残ります。</li>
          </ol>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">白黒変換が役立つシーン</h3>
          <ul className="text-gray-700 dark:text-gray-300 space-y-2 mb-4">
            <li className="flex items-start gap-2"><span className="text-kon dark:text-blue-300 font-bold">・</span><strong>印刷コスト削減</strong>：カラー印刷より安価な白黒印刷用に画像を変換</li>
            <li className="flex items-start gap-2"><span className="text-kon dark:text-blue-300 font-bold">・</span><strong>資料の統一感</strong>：プレゼン資料・報告書を白黒で統一して読みやすく</li>
            <li className="flex items-start gap-2"><span className="text-kon dark:text-blue-300 font-bold">・</span><strong>レトロ・ヴィンテージ加工</strong>：写真をモノクロにして雰囲気のある仕上がりに</li>
            <li className="flex items-start gap-2"><span className="text-kon dark:text-blue-300 font-bold">・</span><strong>新聞・雑誌風デザイン</strong>：白黒写真でクラシックな印象を演出</li>
            <li className="flex items-start gap-2"><span className="text-kon dark:text-blue-300 font-bold">・</span><strong>FAX送信用</strong>：白黒FAXで送る画像の事前確認</li>
            <li className="flex items-start gap-2"><span className="text-kon dark:text-blue-300 font-bold">・</span><strong>アクセシビリティ確認</strong>：色覚多様性対応のため白黒でデザインチェック</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">完全白黒・グレースケール・セピア風の違い</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            <strong>完全白黒（モノクロ）</strong>はスライダー100%、最も明暗のはっきりしたモダンな仕上がり。<strong>グレースケール</strong>もほぼ同義で、色情報を完全に失った状態を指します。<strong>セピア風</strong>は本ツールでは70-80%程度に設定し、わずかに茶色みを残すと再現できます。<strong>レトロ風</strong>は40-60%でうっすらカラーを残すと懐かしい雰囲気に。用途によって強度を変えると表現の幅が広がります。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">白黒画像の活用事例</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            白黒変換した画像は、<a href="/pdf/image-to-pdf" className="text-kon dark:text-blue-300 hover:text-ai underline">複数の画像をPDFにまとめるツール</a>と組み合わせれば、白黒のPDF資料を作成できます。また、<a href="/image/compress" className="text-kon dark:text-blue-300 hover:text-ai underline">画像圧縮ツール</a>と併用すると、白黒化＋ファイルサイズ削減で更に軽量化が可能です。プレゼン資料の差し替え、社内文書のモノクロ化、印刷物の事前確認など、ビジネスシーンでも幅広く活用できます。
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
