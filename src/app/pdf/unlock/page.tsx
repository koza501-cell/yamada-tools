import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("unlock")!;

const faq = [
  { question: "パスワードがわからなくても解除できますか？", answer: "いいえ、パスワードの入力が必要です。パスワード不明のPDFは解除できません。" },
  { question: "解除後のPDFはどうなりますか？", answer: "パスワードなしで開ける通常のPDFになります。" },
  { question: "違法ではないですか？", answer: "ご自身がパスワードを知っているPDFを解除することは問題ありません。" },
];

const seoContent = {
  intro: "パスワードがわかっているPDFのロックを解除。パスワード入力の手間を省きたい時や、他のPDFツールで編集したい時に便利です。",
  useCases: [
    { title: "🔓 パスワード解除", desc: "毎回の入力を省略" },
    { title: "📝 編集準備", desc: "他ツールで編集するため解除" },
    { title: "📄 結合準備", desc: "PDF結合前にロック解除" },
    { title: "🖨️ 印刷制限解除", desc: "印刷禁止を解除" },
  ],
  tips: "パスワードがわからないPDFのロック解除はできません。パスワードを入力してロックを外す機能です。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】PDFロック解除｜パスワード解除ツール",
  tool,
  longDescription: "パスワードがわかっているPDFのロックを解除。パスワード入力の手間を省きたい時や、他のPDFツールで編集したい時に便利です。",
  keywords: ['PDF ロック解除', 'PDF パスワード解除', 'PDF 保護解除', 'PDF アンロック'],
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
