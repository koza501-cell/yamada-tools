import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ImageCropClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("crop-image")!;

const faq = [
  { question: "決まった比率で切り抜けますか？", answer: "はい、1:1、16:9、4:3などプリセットから選択できます。" },
  { question: "丸く切り抜けますか？", answer: "四角形での切り抜きのみ対応しています。" },
  { question: "切り抜き位置は調整できますか？", answer: "はい、ドラッグで自由に位置を調整できます。" },
];

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】画像切り抜き｜トリミング・範囲指定",
  tool,
  longDescription: "画像の必要な部分だけを切り抜き。SNSのプロフィール画像や、バナー作成に便利です。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。",
  keywords: ['画像 切り抜き', '画像 トリミング', '写真 切り抜き', '画像 crop'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ImageCropClient faq={faq} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
