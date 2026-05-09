import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import NoiseReductionClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("noise-reduction")!;

const faq = [
  { question: "ノイズ除去とは何ですか？", answer: "画像に含まれるザラザラしたノイズ（粒状感）を滑らかにする処理です。暗い場所で撮影した写真や、高ISO感度で撮影した画像の改善に効果的です。" },
  { question: "どんな画像に効果がありますか？", answer: "暗所撮影の写真、スマホのナイトモード写真、スキャンした書類、古い写真のデジタル化など、ノイズが目立つ画像に効果があります。" },
  { question: "強度は調整できますか？", answer: "はい、ノイズ除去の強度を弱・中・強の3段階またはスライダーで細かく調整できます。強くするほどノイズが減りますが、やりすぎると細部がぼやけます。" },
  { question: "処理時間はどのくらいですか？", answer: "画像サイズにもよりますが、通常は数秒以内で完了します。大きな画像の場合はやや時間がかかることがあります。" },
  { question: "スマホでも使えますか？", answer: "はい、スマホ・タブレットでも問題なく使えます。" },
  { question: "画像はサーバーに送信されますか？", answer: "いいえ、すべてブラウザ内で処理されます。画像がサーバーに送信されることはありません。" },
];

const seoContent = {
  intro: "画像のノイズ（ザラつき）を除去して滑らかにするツールです。暗所撮影の写真やスキャン画像の改善に最適。ノイズ除去の強度を自由に調整でき、元画像との比較も簡単にできます。",
  useCases: [
    { title: "📸 暗所写真の改善", desc: "夜景や室内で撮った写真のザラつきを除去" },
    { title: "📄 スキャン画像の補正", desc: "スキャンした書類のノイズを除去してくっきり" },
    { title: "🖼️ 古い写真の修復", desc: "デジタル化した古い写真をきれいに" },
    { title: "📱 スマホ写真の改善", desc: "高ISO感度で撮影した写真を滑らかに" },
  ],
  tips: "ノイズ除去は強すぎるとディテールが失われます。まずは「中」で試して、足りなければ少しずつ強くするのがおすすめです。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】ノイズ除去｜写真のザラつきを滑らかに補正",
  tool,
  longDescription: "画像のノイズを除去して滑らかにするツール。強度調整・元画像比較対応。ブラウザ処理で安全。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ["ノイズ除去 無料", "画像 ノイズ 除去", "写真 ザラつき 補正", "ノイズリダクション", "画像 滑らか"],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NoiseReductionClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
