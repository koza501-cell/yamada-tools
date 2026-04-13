import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import InvoiceClient from "./client";
import { toolSchemas } from "@/data/toolSchemas";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("invoice")!;

const faq = [
  {
    question: "インボイス制度（適格請求書）に対応していますか？",
    answer: "はい、2023年10月開始のインボイス制度に完全対応しています。登録番号、税率ごとの消費税額など、必要な項目をすべて記載できます。",
  },
  {
    question: "消費税の計算は自動ですか？",
    answer: "はい、金額を入力すると消費税（10%・8%）が自動計算されます。軽減税率にも対応しており、税率ごとの内訳も自動で表示されます。",
  },
  {
    question: "作成した請求書はどこに保存されますか？",
    answer: "請求書データはお使いのブラウザに一時保存されます。サーバーには保存されないため、個人情報や取引情報が漏れる心配はありません。",
  },
  {
    question: "PDFでダウンロードできますか？",
    answer: "はい、作成した請求書はPDF形式でダウンロードできます。そのままメール添付や印刷してご利用いただけます。",
  },
  {
    question: "会社の印鑑（角印）は入れられますか？",
    answer: "はい、印鑑画像をアップロードして請求書に配置できます。電子印鑑を作成したい場合は「電子印鑑作成」ツールもご利用ください。",
  },
  {
    question: "過去に作った請求書を再利用できますか？",
    answer: "ブラウザのローカルストレージに保存された情報は次回アクセス時に復元されます。会社情報や振込先などは自動入力されるので、入力の手間が省けます。",
  },
  {
    question: "源泉徴収の計算はできますか？",
    answer: "はい、源泉徴収税の自動計算に対応しています。フリーランスや個人事業主の方の請求書作成にも便利です。",
  },
  {
    question: "無料で何枚でも作成できますか？",
    answer: "はい、完全無料で枚数制限もありません。会員登録も不要です。必要な時にいつでもお使いください。",
  },
];

const seoContent = {
  intro: "請求書の作成、毎回面倒ではありませんか？山田ツールの請求書作成は、必要事項を入力するだけでインボイス制度対応の請求書が完成。消費税の自動計算、源泉徴収対応、PDF出力まで——すべて無料でご利用いただけます。",
  useCases: [
    { title: "👨‍💼 フリーランス", desc: "クライアントへの請求書を簡単作成" },
    { title: "🏢 中小企業", desc: "インボイス制度対応の適格請求書" },
    { title: "🛒 副業・個人事業", desc: "源泉徴収対応の請求書作成" },
    { title: "📱 外出先でも", desc: "スマホから急ぎの請求書を発行" },
  ],
  tips: "会社情報や振込先はブラウザに保存されるので、2回目以降は入力不要。毎月の請求書作成がグッと楽になります。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】請求書作成｜PDF出力｜インボイス対応",
  tool,
  longDescription: "インボイス制度対応の請求書を無料作成。消費税自動計算、源泉徴収対応、PDF出力。登録不要で今すぐ使える請求書作成ツール。",
  keywords: ["請求書 作成", "請求書 無料", "インボイス 請求書", "適格請求書 作成", "請求書 テンプレート", "フリーランス 請求書"],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function InvoicePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <InvoiceClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
