import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import FlipClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("flip")!;

const faq = [
  { question: "水平反転と垂直反転の違いは？", answer: "水平反転は左右を入れ替え（鏡像）、垂直反転は上下を入れ替えます。" },
  { question: "両方同時にできますか？", answer: "はい、水平・垂直の両方を適用できます。両方オンにすると180度回転と同じ効果になります。" },
  { question: "自撮り写真の反転に使えますか？", answer: "はい、スマホの自撮りで左右反転してしまった写真を正しい向きに戻せます。" },
  { question: "画質は劣化しますか？", answer: "いいえ、ピクセル単位で反転するだけなので画質の劣化はありません。" },
  { question: "スマホでも使えますか？", answer: "はい、iPhone・Androidどちらからもご利用いただけます。" },
  { question: "PNGとJPEGどちらで保存すべきですか？", answer: "透明背景が必要な場合はPNG、写真など圧縮を優先する場合はJPEGがおすすめです。" },
  { question: "反転した画像の画質は劣化しますか？", answer: "PNG形式で保存すれば画質は劣化しません。JPEGは圧縮による若干の劣化が生じます。" },
  { question: "GIFアニメーションは反転できますか？", answer: "GIFの静止フレームのみ対応しています。アニメーションGIFは最初のフレームのみ処理されます。" },
];

const seoContent = {
  intro: "画像を水平反転（左右ミラー）・垂直反転（上下）する無料ツールです。自撮り写真の鏡像修正や、デザイン素材の反転に最適。ブラウザ内処理で安全です。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】画像反転（左右・上下）｜写真ミラー・鏡像反転｜ブラウザ処理",
  tool,
  longDescription: "画像を水平反転・垂直反転する無料ツール。自撮り写真の鏡像修正やデザイン素材の反転に。ブラウザ処理で安全・登録不要。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ["画像 反転", "左右反転", "上下反転", "写真 ミラー", "鏡像 反転", "画像 フリップ"],
});

export default function Page() {
  const jsonLd = generateToolJsonLd(tool, faq);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FlipClient faq={faq} seoContent={seoContent} />

      {/* Use Cases Section */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-kon dark:text-gray-100 mb-6">こんな場面で使われています</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "EC商品撮影", desc: "左右反転した商品写真を正しい向きに修正" },
              { title: "SNS投稿", desc: "自撮りの鏡像を自然な向きに整えてから投稿" },
              { title: "デザイン制作", desc: "名刺・チラシのデザイン素材を反転配置" },
              { title: "証明写真確認", desc: "自撮りをミラーから実際の見え方に変換" },
              { title: "教育素材", desc: "鏡文字の作成や左右対称の教材作りに" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <div className="font-bold text-gray-800 dark:text-gray-100 mb-1">{item.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Section */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-kon dark:text-gray-100 mb-6">画像反転についての解説</h2>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-4 mb-3">水平反転（左右反転）の使いどころ</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            スマートフォンのインカメラで撮影した自撮り写真は、カメラの仕様により鏡像（左右反転）で保存されることがあります。名刺のロゴや文字が左右逆になっている場合、水平反転で正しい向きに戻せます。デザイン素材を左右対称に配置したい場合にも活用できます。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">垂直反転（上下反転）の使いどころ</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            スキャナーで取り込んだ文書が上下逆になっている場合、垂直反転で正しい向きに修正できます。水上写真の映り込み効果や、グラフィックデザインでの反転テクスチャ作成にも利用されます。水平・垂直の両方を同時に適用すると、画像を180度回転させたのと同じ効果になります。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">画質を保ったまま反転する仕組み</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            本ツールはブラウザ内のCanvas APIを使用してピクセル単位の並べ替えを行うため、再エンコードが発生しません。PNG形式で保存すれば元画像と完全に同じ画質を保てます。透過PNG（アルファチャンネル）にも対応しており、透過情報を保持したまま反転できます。
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
