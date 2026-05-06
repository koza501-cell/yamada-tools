import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import CompressClient from "./client";
import { AdUnit } from "@/components/common/AdUnit";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("compress-image")!;

const faq = [
  {
    question: "どのくらい圧縮できますか？",
    answer: "画像の内容によりますが、一般的に50-80%のファイルサイズ削減が可能です。写真は特に効果が高く、1MBの画像が200-300KB程度になることも珍しくありません。",
  },
  {
    question: "圧縮すると画質は落ちますか？",
    answer: "品質レベルを選択できます。「高品質」モードなら見た目の違いはほぼわかりません。Web掲載用なら「標準」モードで十分きれいです。",
  },
  {
    question: "PNG画像も圧縮できますか？",
    answer: "はい、JPG、PNG、WebPなど主要な画像形式に対応しています。PNGは透過を保持したまま圧縮できます。",
  },
  {
    question: "複数の画像を一度に圧縮できますか？",
    answer: "はい、最大20枚まで一括で圧縮できます。まとめてドラッグ＆ドロップするだけで処理できます。",
  },
  {
    question: "スマホで撮った写真も圧縮できますか？",
    answer: "はい、スマホ写真は特に効果的です。最近のスマホは高画質なため1枚5MB以上になることも。本ツールで圧縮すれば、LINEやメールで送りやすいサイズになります。",
  },
  {
    question: "圧縮した画像はどこに保存されますか？",
    answer: "処理後すぐにダウンロードされます。サーバーには保存されず、60分以内に自動削除されます。",
  },
  {
    question: "Webサイトの表示速度改善に使えますか？",
    answer: "はい、まさにそのための機能です。画像を圧縮するとページ読み込みが速くなり、SEO評価も向上します。ECサイトやブログ運営者に人気のツールです。",
  },
  {
    question: "無料で何枚でも圧縮できますか？",
    answer: "はい、完全無料で枚数制限もありません。会員登録も不要です。",
  },
  {
    question: "他の無料圧縮ツールとの違いは？",
    answer: "山田ツールは日本国内サーバーで処理するため、機密性の高い画像も安心してご利用いただけます。海外サービスと違い、データが国外に出ることはありません。",
  },
  {
    question: "圧縮後も印刷に使えますか？",
    answer: "「高品質」モードで圧縮すれば、印刷にも十分使えます。ただし、大判ポスターなど高解像度が必要な用途では、元画像の使用をお勧めします。",
  },
];

const seoContent = {
  intro: "スマホ写真が大きすぎてメールで送れない、Webサイトの画像が重くて表示が遅い——そんな悩みを解決します。画像圧縮ツールなら、見た目の品質を保ちながらファイルサイズを最大80%削減。JPG・PNG・WebPに対応、最大20枚まで一括処理できます。日本国内サーバーで安全に処理されるので、企業の機密画像も安心です。",
  useCases: [
    { title: "📧 メール添付", desc: "大きな写真を送信可能なサイズに。5MBの写真も1MB以下に圧縮してスムーズに送信" },
    { title: "🌐 Webサイト高速化", desc: "ページ表示速度を改善してSEO向上。Core Web Vitalsのスコア改善にも効果的" },
    { title: "📱 SNS・LINE投稿", desc: "アップロード制限をクリア。画質を保ちながら容量を軽く" },
    { title: "💾 ストレージ節約", desc: "クラウドやスマホの容量を有効活用。同じ枚数でも使用容量を大幅削減" },
    { title: "🏢 企業利用", desc: "日本国内サーバー処理で機密画像も安心。社内資料や製品画像の圧縮に最適" },
  ],
  tips: "Webサイト用なら「標準」品質で十分きれいです。印刷用途やポートフォリオには「高品質」を選んでください。PNG透過画像も透過を保ったまま圧縮できます。",
};

// Target keywords (from Search Console):
// - 画像圧縮 (176 imp)
// - 画像 圧縮 (144 imp)
// - 画像 サイズ 圧縮 (78 imp)
// Total: 400+ impressions at position 43-85

export const metadata: Metadata = generateToolMetadata({
  customTitle: "画像圧縮【無料・安全】写真を軽くする｜JPG・PNG対応｜日本国内サーバー処理・登録不要",
  tool,
  longDescription: "画像をドラッグするだけで瞬時に圧縮。JPG・PNG・WebP対応、最大20枚一括処理。画質はそのまま、ファイルサイズ最大80%削減。メール添付・LINE送信・Webサイト高速化に。インストール不要・完全無料・国内サーバー処理。",
  keywords: [
    "画像圧縮",
    "画像 圧縮",
    "写真 圧縮",
    "画像 サイズ 圧縮",
    "JPEG圧縮",
    "PNG圧縮",
    "画像 軽くする",
    "無料 画像圧縮",
    "写真 軽量化",
    "画像 容量 減らす",
    "画像圧縮 オンライン",
    "画像圧縮 無料 一括"
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function ImageCompressPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CompressClient faq={faq} seoContent={seoContent} />
      <AdUnit slot="5612038947" format="horizontal" />

      {/* Educational Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-kon mb-6">画像圧縮の詳しい解説</h2>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">なぜ画像圧縮が必要なのか</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            最近のスマートフォンで撮影した写真は1枚あたり3〜8MBにもなります。メール添付の上限は多くのサービスで25MB、LINEでは送信時に自動圧縮されて画質が落ちます。Webサイトでは画像の重さがページ読み込み速度に直結し、Googleの調査ではページ表示が3秒を超えると53%のユーザーが離脱するとされています。適切に圧縮すれば、画質を保ちながらファイルサイズを大幅に削減できます。
          </p>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">非可逆圧縮と可逆圧縮の違い</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            非可逆圧縮（ロッシー）は人間の目では気づかない情報を削除してサイズを大幅に縮小する方式で、JPEGが代表的です。圧縮率が高い反面、繰り返し圧縮すると徐々に劣化します。可逆圧縮（ロスレス）はデータを完全に復元できる方式で、PNGが代表的です。圧縮率は低めですが、透過情報の保持や図表・スクリーンショットに向いています。用途に応じて使い分けることが重要です。
          </p>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">Web向け画像フォーマットの選び方</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            写真やグラデーションが多い画像にはJPEG（またはWebP）が最適です。ロゴ・アイコン・透過が必要な画像にはPNGを使います。WebPはJPEGより約25〜30%小さくなる次世代フォーマットで、主要ブラウザすべてが対応しています。ECサイトの商品画像やブログのアイキャッチは、WebP変換と圧縮を組み合わせるとページ速度が大きく改善します。画像フォーマットの変換には<a href="/image/format-convert" className="text-kon hover:text-ai underline">画像フォーマット変換ツール</a>もご活用ください。
          </p>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">画質を落とさない圧縮の目安</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            JPEG画像の場合、品質80%程度まで圧縮しても見た目の劣化はほぼわかりません。品質60%前後でもWeb閲覧には十分です。50%を下回ると、拡大時にブロックノイズが目立ち始めます。本ツールでは品質レベルを選べるので、まず「標準」で試し、結果を確認してから調整するのがおすすめです。<a href="/pdf/compress" className="text-kon hover:text-ai underline">PDF圧縮</a>と合わせて活用すると、文書全体の軽量化に効果的です。
          </p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
