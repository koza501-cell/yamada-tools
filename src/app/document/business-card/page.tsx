import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import BusinessCardClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("business-card")!;

const faq = [
  { question: "QRコードは入れられますか？", answer: "はい、WebサイトやSNSへのQRコードを追加できます。" },
  { question: "印刷はどうすればいい？", answer: "PDFをダウンロードして、名刺用紙に印刷できます。" },
  { question: "両面印刷に対応していますか？", answer: "表面のみの作成となります。" },
];

const seoContent = {
  intro: "シンプルで美しい名刺を無料作成。会社名、名前、連絡先を入力するだけ。QRコード付きの名刺も作れます。",
  useCases: [
    { title: "新規作成", desc: "起業・独立時の名刺作成" },
    { title: "🔄 デザイン変更", desc: "名刺デザインのリニューアル" },
    { title: "📱 QRコード付き", desc: "WebサイトへのQRコード入り" },
    { title: "🖨️ 印刷用", desc: "印刷して即使える品質" },
  ],
  tips: "名刺サイズは91mm×55mmが日本の標準です。印刷時は用紙設定を確認しましょう。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】名刺作成｜印刷用データ作成",
  tool,
  longDescription: "シンプルで美しい名刺を無料作成。会社名、名前、連絡先を入力するだけ。QRコード付きの名刺も作れます。",
  keywords: ['名刺 作成', '名刺 無料', '名刺 テンプレート', '名刺 デザイン', '名刺 印刷'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BusinessCardClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
