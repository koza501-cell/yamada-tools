import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import PdfTextClient from "./client";

const tool = getToolById("pdf-text-input")!;

const faq = [
  {
    question: "PDFに文字入力とは何ですか？",
    answer: "PDFファイルの好きな場所をクリックして、直接テキストを入力できるツールです。申請書・契約書・注文書など、記入欄があるPDFに文字を書き込めます。インストール不要でブラウザだけで使えます。",
  },
  {
    question: "使い方を教えてください",
    answer: "3ステップで簡単です。①「PDFを選択」でファイルをアップロード → ②「テキスト追加」ボタンを押してPDFの好きな場所をクリック → テキストを入力 → ③「ダウンロード」で完成。文字はドラッグで移動もできます。",
  },
  {
    question: "ハンコ（電子印鑑）の押し方は？",
    answer: "「🔴 ハンコ追加」ボタンを押すと入力欄が表示されます。名前を入力（1〜4文字）→ サイズを選択 →「PDFに配置」ボタン → PDFの押印したい場所をクリック。丸い赤い印鑑が自動で生成されます。名前は縦書きで表示されます。",
  },
  {
    question: "ハンコのサイズは変更できますか？",
    answer: "はい、小（40px）・中小（50px）・中（60px）・大（80px）・特大（100px）の5段階から選べます。一般的な認印サイズには「中」がおすすめです。",
  },
  {
    question: "日付の入力方法は？",
    answer: "テキストを選択した状態で「📅 西暦」または「📅 令和」ボタンを押すと、今日の日付が自動で入力されます。西暦は「2026年2月8日」、令和は「令和8年2月8日」の形式です。",
  },
  {
    question: "フォントのサイズや色は変更できますか？",
    answer: "はい。テキストをクリックして選択すると、書式バーが表示されます。8pt〜48ptのサイズ変更、ゴシック体・明朝体・等幅・手書き風の4書体、黒・灰・青・赤・緑・紫の6色、太字のON/OFFが可能です。",
  },
  {
    question: "入力した文字は移動できますか？",
    answer: "はい。入力済みの文字やハンコはドラッグで自由に移動できます。また、テキストをクリックすれば内容の編集や削除もいつでも可能です。",
  },
  {
    question: "複数ページのPDFに対応していますか？",
    answer: "はい。ページ切り替えボタンで各ページに移動し、それぞれのページに文字やハンコを追加できます。すべてのページの入力内容が1つのPDFにまとめてダウンロードされます。",
  },
  {
    question: "PDFファイルはサーバーに送信されますか？",
    answer: "いいえ、一切送信されません。すべての処理はお使いのブラウザ内で完結します。PDFファイルがインターネット上にアップロードされることはないため、機密書類も安心してご利用いただけます。",
  },
  {
    question: "会員登録やログインは必要ですか？",
    answer: "不要です。完全無料・登録不要・ログイン不要でご利用いただけます。Adobe Acrobatのようなアカウント作成は一切必要ありません。",
  },
  {
    question: "どんなPDFに書き込めますか？",
    answer: "あらゆるPDFに対応しています。申請書、契約書、見積書、請求書、履歴書、注文書、届出書、保険書類、学校の配布プリントなど、記入が必要なPDF書類に文字を入力できます。",
  },
  {
    question: "スマートフォンでも使えますか？",
    answer: "はい、スマートフォンやタブレットでも操作可能です。ただし、PDF上の細かい位置をクリックする必要があるため、画面の大きなPCでの利用をおすすめします。",
  },
  {
    question: "対応ブラウザは？",
    answer: "Microsoft Edge、Google Chrome、Firefox、Safari など主要ブラウザに対応しています。最新バージョンのブラウザをご利用ください。特にMicrosoft Edgeでの動作を最適化しています。",
  },
  {
    question: "一度に複数のテキストやハンコを追加できますか？",
    answer: "はい。テキストもハンコも、何個でも追加できます。追加した項目は画面下部の一覧に表示され、クリックで選択・編集・削除が可能です。",
  },
  {
    question: "元に戻す（取り消し）はできますか？",
    answer: "はい。「↩ 戻す」ボタンまたはCtrl+Zで直前の操作を取り消せます。「🗑 リセット」で全ての入力を一括削除することもできます。",
  },
];

const seoContent = {
  intro:
    "PDFファイルの好きな場所をクリックするだけで、簡単にテキストやハンコを追加できるツールです。申請書や契約書、履歴書などの記入が必要なPDF書類に、インストール不要・登録不要で直接文字を書き込めます。すべてブラウザ内で処理されるため、機密書類も安心です。電子印鑑（ハンコ）機能も搭載し、名前を入力するだけで丸い赤い印鑑を自動生成してPDFに配置できます。",
  useCases: [
    { title: "📋 申請書・届出書", desc: "役所や会社の申請書PDFに名前・住所・日付を入力。令和日付の自動挿入にも対応" },
    { title: "💼 契約書・見積書", desc: "取引先から届いたPDF書類に記入して返送。電子ハンコで押印も可能" },
    { title: "📝 履歴書・職務経歴書", desc: "PDF形式の履歴書テンプレートに直接入力。きれいな活字で仕上がる" },
    { title: "🏫 学校・教育", desc: "配布されたPDFワークシートに回答を記入。保護者向け書類の記入にも" },
  ],
  tips: "💡 ヒント：文字のサイズや色を変えて、見やすく仕上げましょう。ハンコは「🔴 ハンコ追加」ボタンから名前を入力するだけで簡単に作成できます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle:
    "【無料・登録不要】PDFに文字入力｜ブラウザだけで書き込み｜アップロード不要で安全",
  tool,
  longDescription:
    "PDFファイルに直接文字を入力できる無料ツール。クリックした場所にテキストを書き込み。電子ハンコ（印鑑）機能搭載。申請書・契約書・履歴書などの記入に最適。ブラウザ処理で安全・登録不要。令和日付の自動入力にも対応。",
  keywords: [
    "PDF 文字入力 無料",
    "PDF 書き込み 無料",
    "PDF 書き込み 登録不要",
    "PDF 直接入力",
    "PDF 文字入れ",
    "PDF テキスト追加 無料",
    "PDF 編集 登録不要",
    "PDF 記入 ブラウザ",
    "PDF フォーム入力 無料",
    "申請書 PDF 入力",
    "PDF 文字入力 アップロード不要",
    "PDF 編集 インストール不要",
    "PDF 文字入力 日本製",
    "履歴書 PDF 書き込み",
    "PDF ハンコ 無料",
    "PDF 電子印鑑",
    "PDF 押印 ブラウザ",
  ],
});

export default function PdfTextPage() {
  const jsonLd = generateToolJsonLd(tool);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />
      <PdfTextClient faq={faq} seoContent={seoContent} />
    </>
  );
}
