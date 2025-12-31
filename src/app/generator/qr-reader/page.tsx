import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("qr-reader")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、データは保存されません。" },
];

const seoContent = {
  intro: "カメラや画像からQRコードを読み取り。スマホがなくてもパソコンで読み取れます。",
  useCases: [
    { title: "📷 画像から読取", desc: "保存したQR画像を読取" },
    { title: "💻 PC作業", desc: "スマホなしでQR確認" },
    { title: "🔗 URL抽出", desc: "QRからリンクを取得" },
    { title: "📝 テキスト抽出", desc: "QRの内容をコピー" },
  ],
  tips: "画像をドラッグ&ドロップするだけで読み取れます。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "カメラや画像からQRコードを読み取り。スマホがなくてもパソコンで読み取れます。",
  keywords: ['QRコード 読み取り', 'QR 読取 PC', 'QRコード デコード', 'QR リーダー'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolPage tool={tool} faq={faq} seoContent={seoContent} />
    </>
  );
}
