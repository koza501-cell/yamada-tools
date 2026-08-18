import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import DpiCheckerClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("dpi-checker")!;

const faq = [
  { question: "画像のDPIをチェックする方法は？", answer: "本ツールに画像をドラッグ＆ドロップするだけで、DPI（解像度）を即座に確認できます。アップロード不要・ブラウザ内で処理されるため、機密性の高い画像でも安心です。JPG・PNG・WebP・BMP・GIFすべての形式に対応しています。" },
  { question: "PNGのDPIを確認できますか？", answer: "はい、PNG画像のDPI確認に完全対応しています。PNGファイルをドロップするだけで、横方向DPI・縦方向DPI・ピクセルサイズ・ファイルサイズを一覧表示します。デザイナーや印刷業者の方の事前確認に多くご利用いただいています。" },
  { question: "DPIとは何ですか？", answer: "DPI（Dots Per Inch）は1インチあたりのドット数で、画像の印刷解像度を表します。数値が高いほど精細な印刷が可能です。一般的にWeb表示は72DPI、印刷物は300DPI、写真集など高品質印刷は600DPIが目安となります。" },
  { question: "印刷に最適なDPIはいくつですか？", answer: "用途別の目安：①一般的なカラー印刷は300DPI、②ポスターなど大判印刷は150〜200DPI（離れて見るため低めでOK）、③名刺・パンフレットは350DPI以上、④Web表示は72〜96DPI、⑤新聞印刷は150〜200DPI。DPIから推奨印刷サイズも自動計算できます。" },
  { question: "DPIが低い画像はどうすればよいですか？", answer: "DPIが低い画像（72DPIなど）でも、ピクセル数が多ければ印刷可能なケースがあります。本ツールは「推奨印刷サイズ」を自動計算するので、現在のピクセル数でどのサイズまで綺麗に印刷できるかを即確認できます。サイズが足りない場合は、より高解像度で再撮影・再スキャンする必要があります。" },
  { question: "スマホで撮った写真のDPIは？", answer: "スマートフォンで撮影した写真は、メタデータ上のDPIは72が一般的ですが、ピクセル数が4000×3000以上と非常に多いため、実質的にA4以上のサイズで300DPI印刷が可能です。本ツールで推奨印刷サイズを確認してから印刷に進むと失敗を防げます。" },
  { question: "DPIと解像度は同じ意味ですか？", answer: "厳密には異なります。「解像度」はピクセル数（例：1920×1080）を指す場合と、DPI（印刷密度）を指す場合があります。Web上の画像はピクセル数のみが意味を持ち、印刷ではDPIが重要です。本ツールは両方の数値を同時に表示するので、用途に応じてどちらの数値を見るべきか判断できます。" },
  { question: "対応している画像形式は？", answer: "JPG（JPEG）、PNG、WebP、BMP、GIF形式に対応しています。HEIC（iPhone標準形式）の場合は事前にJPGまたはPNGへ変換してからお試しください。" },
  { question: "ファイルはサーバーにアップロードされますか？", answer: "いいえ、本ツールはすべてブラウザ内で処理（クライアントサイド処理）されます。画像ファイルがサーバーに送信されることは一切なく、機密性の高いデザインデータや個人写真も安心してDPI確認できます。" },
  { question: "無料で使えますか？", answer: "はい、完全無料・登録不要・回数制限なしでご利用いただけます。スマホ・PC両方から使えるので、外出先での急な確認にも便利です。" },
];

const seoContent = {
  intro: "画像のDPI（解像度）を確認する無料ツールです。印刷前にDPIをチェックして、高品質な印刷ができるか事前に確認できます。推奨印刷サイズの計算も自動で行います。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "DPI確認【無料】画像の解像度・印刷サイズを計算｜PNG・JPG対応｜登録不要",
  tool,
  longDescription:
    "画像のdpiを瞬時にチェック・確認できる無料ツール。PNG・JPG・WebPに対応、印刷推奨サイズも自動計算。アップロード不要・ブラウザ処理で機密画像も安全。登録不要・完全無料。",
  keywords: [
    "dpi チェック",
    "DPI チェック",
    "dpi 確認",
    "DPI 確認",
    "png dpi 確認",
    "png dpi チェック",
    "jpg dpi 確認",
    "画像 dpi 調べる",
    "画像 解像度 チェック",
    "画像 dpi 確認",
    "DPI チェッカー",
    "印刷 解像度",
    "写真 解像度 確認",
    "解像度 確認 ツール",
    "画像解像度",
  ],
});

export default function Page() {
  const jsonLd = generateToolJsonLd(tool, faq);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DpiCheckerClient faq={faq} seoContent={seoContent} />

      {/* Educational Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-kon dark:text-gray-300 mb-6">画像DPIをブラウザで瞬時にチェック</h2>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            「印刷したら画像がぼやけた」「PNGのDPIを確認したい」「デザインの素材データが印刷に耐えられるかチェックしたい」——そんな時に便利なのが本ツールです。画像をドラッグ＆ドロップするだけで、DPI（dots per inch）・ピクセルサイズ・推奨印刷サイズを瞬時に確認できます。<strong>すべてブラウザ内で処理</strong>されるため、機密性の高いデザインデータや個人写真も外部に送信されることなく安全にチェックできます。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">DPIチェックの3ステップ</h3>
          <ol className="text-gray-700 dark:text-gray-300 space-y-3 mb-4 list-decimal list-inside">
            <li className="leading-relaxed"><strong>画像をアップロード</strong>：JPG・PNG・WebP・BMP・GIFをドラッグ＆ドロップ、またはファイル選択ボタンから指定します。</li>
            <li className="leading-relaxed"><strong>結果を確認</strong>：横方向DPI・縦方向DPI・ピクセルサイズ・ファイルサイズが瞬時に表示されます。</li>
            <li className="leading-relaxed"><strong>推奨印刷サイズを確認</strong>：現在のピクセル数とDPIから、A4・B5・はがきなど用途別の推奨印刷サイズを自動計算。印刷前の事前確認に最適です。</li>
          </ol>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">用途別のDPI目安</h3>
          <ul className="text-gray-700 dark:text-gray-300 space-y-2 mb-4">
            <li className="flex items-start gap-2"><span className="text-kon dark:text-gray-300 font-bold">・</span><strong>Web表示</strong>：72〜96DPI（モニター表示が前提）</li>
            <li className="flex items-start gap-2"><span className="text-kon dark:text-gray-300 font-bold">・</span><strong>一般カラー印刷</strong>：300DPI（雑誌・パンフレット・チラシ）</li>
            <li className="flex items-start gap-2"><span className="text-kon dark:text-gray-300 font-bold">・</span><strong>名刺・カード類</strong>：350DPI以上（細かい文字を鮮明に）</li>
            <li className="flex items-start gap-2"><span className="text-kon dark:text-gray-300 font-bold">・</span><strong>ポスター・大判印刷</strong>：150〜200DPI（離れて見るため低めでOK）</li>
            <li className="flex items-start gap-2"><span className="text-kon dark:text-gray-300 font-bold">・</span><strong>新聞・冊子印刷</strong>：150〜200DPI</li>
            <li className="flex items-start gap-2"><span className="text-kon dark:text-gray-300 font-bold">・</span><strong>写真集・高品質印刷</strong>：600DPI以上</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">PNG・JPGそれぞれのDPI確認のポイント</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            <strong>PNG</strong>はpHYsチャンクと呼ばれるメタデータにDPI情報を保持しています。Webからダウンロードした画像は72DPIで保存されていることが多く、印刷用途には<a href="/image/compress" className="text-kon dark:text-gray-300 hover:text-ai underline">画像圧縮</a>や<a href="/image/resize" className="text-kon dark:text-gray-300 hover:text-ai underline">画像サイズ変更</a>と組み合わせて確認するのが便利です。
            <strong>JPG</strong>はEXIF情報にDPIを保持しており、デジタルカメラやスマホで撮影した写真は通常72DPIで記録されますが、ピクセル数が多ければ印刷時に300DPI相当の品質が出せます。本ツールでは推奨印刷サイズも同時に表示するため、ピクセル数とDPIの関係を直感的に理解できます。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">DPIが低い画像でも印刷できる？</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            DPI数値が低くても、ピクセル数が十分にあれば印刷可能です。例えば72DPIの画像でも、4000×3000ピクセルあればA4サイズ（300DPI換算）として印刷できます。逆にDPIが300でもピクセル数が少なければ、小さなサイズしか印刷できません。重要なのは「DPI × ピクセル数 = 印刷可能サイズ」の関係です。本ツールが推奨印刷サイズを自動計算するので、迷わず適切な判断ができます。
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
