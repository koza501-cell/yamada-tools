import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ConcentrationLinesClient from "./client";

const tool = getToolById("concentration-lines")!;

const faq = [
  { question: "集中線とは何ですか？", answer: "漫画でよく使われる、中心に向かって放射状に伸びる線のことです。驚き・衝撃・注目を表現するために使われ、SNSのネタ画像やサムネイルにも人気の加工です。" },
  { question: "集中線の位置は変えられますか？", answer: "はい、画像をクリック（タップ）するだけで中心点を自由に移動できます。人物の顔や強調したい部分に合わせてください。" },
  { question: "線の太さや本数は調整できますか？", answer: "はい、線の本数・太さ・長さ・色・透明度をスライダーで細かく調整できます。プリセットも用意しています。" },
  { question: "透明な部分は残りますか？", answer: "集中線の間の部分は元画像がそのまま表示されます。中心付近は線が入らない「抜き」エリアとして残ります。" },
  { question: "スマホでも使えますか？", answer: "はい、スマホ・タブレットでもタップで中心を指定できます。" },
  { question: "画像はサーバーに送信されますか？", answer: "いいえ、すべてブラウザ内で処理されます。画像がサーバーに送信されることはありません。" },
];

const seoContent = {
  intro: "画像に漫画風の集中線を追加するツールです。中心点をクリックで指定し、線の本数・太さ・色を自由にカスタマイズ。SNSのネタ画像やYouTubeサムネイルの作成に最適です。",
  useCases: [
    { title: "😱 驚き・衝撃の演出", desc: "人物の表情に集中線を追加してインパクトを演出" },
    { title: "📺 YouTubeサムネイル", desc: "目を引くサムネイルを集中線で作成" },
    { title: "😂 SNSネタ画像", desc: "面白い画像に集中線を追加してバズらせよう" },
    { title: "📢 広告・チラシ", desc: "注目ポイントに集中線を追加して訴求力アップ" },
  ],
  tips: "集中線の中心は、人物の顔や強調したいポイントに合わせるのがコツです。「漫画風」プリセットがおすすめ！",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】集中線加工｜漫画風の集中線を画像に追加",
  tool,
  longDescription: "画像に漫画風の集中線エフェクトを追加。中心点・太さ・本数をカスタマイズ。ブラウザ処理で安全。",
  keywords: ["集中線 画像 無料", "集中線 加工", "漫画 集中線", "集中線 ジェネレーター", "画像 エフェクト"],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ConcentrationLinesClient faq={faq} seoContent={seoContent} />
    </>
  );
}
