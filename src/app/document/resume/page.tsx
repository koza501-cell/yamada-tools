import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ResumeClient from "./client";

const tool = getToolById("resume")!;

const faq = [
  {
    question: "JIS規格の履歴書に対応していますか？",
    answer: "はい、JIS規格（日本工業規格）に準拠したフォーマットで作成できます。就職活動や転職活動で安心してお使いいただけます。",
  },
  {
    question: "写真は貼り付けられますか？",
    answer: "はい、証明写真をアップロードして履歴書に配置できます。3cm×4cmの一般的なサイズに自動調整されます。",
  },
  {
    question: "作成した履歴書はどこに保存されますか？",
    answer: "入力データはブラウザに一時保存されます。サーバーには保存されないため、個人情報が漏れる心配はありません。PDFでダウンロードして保管してください。",
  },
  {
    question: "職歴や学歴は何件まで入力できますか？",
    answer: "十分な件数を入力できます。転職回数が多い方や、複数の学校を卒業された方も安心してご利用ください。",
  },
  {
    question: "PDFでダウンロードできますか？",
    answer: "はい、作成した履歴書はPDF形式でダウンロードできます。そのままメール添付や印刷してご利用いただけます。",
  },
  {
    question: "スマホからでも作成できますか？",
    answer: "はい、iPhone・Androidどちらからも作成可能です。ただし、入力項目が多いためパソコンでの作成をおすすめします。",
  },
  {
    question: "英語の履歴書（Resume/CV）は作れますか？",
    answer: "現在は日本語の履歴書のみ対応しています。英語版は今後のアップデートで追加予定です。",
  },
  {
    question: "無料で何枚でも作成できますか？",
    answer: "はい、完全無料で枚数制限もありません。会員登録も不要です。",
  },
];

const seoContent = {
  intro: "就職活動や転職活動に必要な履歴書を、オンラインで簡単作成。JIS規格に準拠したフォーマットで、手書きの手間なく美しい履歴書が完成します。入力データはブラウザに保存されるので、途中で中断しても続きから作成できます。",
  useCases: [
    { title: "🎓 新卒就活", desc: "就職活動用の履歴書を手軽に作成" },
    { title: "💼 転職活動", desc: "複数企業への応募も効率的に" },
    { title: "📝 アルバイト", desc: "パート・アルバイト応募用にも" },
    { title: "🖨️ 印刷用", desc: "PDF出力で美しく印刷" },
  ],
  tips: "志望動機や自己PRは、応募先企業に合わせて毎回書き換えることをおすすめします。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】履歴書作成｜PDF出力対応｜テンプレート付き",
  tool,
  longDescription: "JIS規格の履歴書を無料作成。写真貼り付け、PDF出力対応。就活・転職に。登録不要・完全無料。",
  keywords: ["履歴書 作成", "履歴書 無料", "JIS 履歴書", "履歴書 テンプレート", "履歴書 PDF", "履歴書 オンライン", "就活 履歴書"],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function ResumePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ResumeClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4 pb-8"><p className="text-sm text-gray-600 bg-orange-50 rounded-xl px-4 py-3">💡 PDFへのテキスト入力も必要な場合は <a href="/pdf/text-input" className="text-orange-600 hover:underline font-medium">無料PDFテキスト入力ツール</a> もご利用ください。</p></div>
    </>
  );
}
