import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import CombiniPrintClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("combini-print")!;

const faq = [
  {
    question: "コンビニで印刷すると端が切れるのはなぜ？",
    answer: "コンビニのマルチコピー機は、用紙の端から約3〜5mmの範囲を印刷できません（非印刷領域）。この範囲にページ番号やヘッダーがあると、切れてしまいます。本ツールでPDFを少し縮小し、白い余白を追加することで、端が切れずにきれいに印刷できます。",
  },
  {
    question: "どのコンビニのコピー機に対応していますか？",
    answer: "セブンイレブン（netprint）、ローソン・ファミリーマート（ネットワークプリント）、ミニストップなど、国内の主要コンビニのマルチコピー機すべてに対応しています。どのメーカーのコピー機でも余白の問題を解決できます。",
  },
  {
    question: "縮小率はどのくらいがおすすめですか？",
    answer: "デフォルトの95%がほとんどのケースで最適です。文字が小さいPDFの場合は97%、端ギリギリまでコンテンツがある場合は93%に調整してみてください。プレビューで確認してからダウンロードできます。",
  },
  {
    question: "縮小すると文字が読みにくくなりませんか？",
    answer: "95%の縮小では、肉眼でほとんど違いがわかりません。A4用紙の場合、上下左右にそれぞれ約7mmの余白が追加されるだけです。文字の鮮明さやレイアウトはそのまま保たれます。",
  },
  {
    question: "A4以外の用紙サイズにも対応していますか？",
    answer: "はい。PDFの元のページサイズをそのまま維持して縮小します。A4、B5、A3など、どんなサイズのPDFでも正しく処理されます。コンビニで印刷する際は、出力用紙サイズをPDFと同じに設定してください。",
  },
  {
    question: "複数ページのPDFも一括で処理できますか？",
    answer: "はい、すべてのページを一括で処理します。100ページ以上のPDFでも問題ありません。各ページごとに同じ縮小率が適用され、白い余白が追加されます。",
  },
  {
    question: "処理したPDFのファイルサイズは大きくなりますか？",
    answer: "ほとんど変わりません。元のPDFのコンテンツをそのまま埋め込んで縮小・配置するだけなので、ファイルサイズの増加はごくわずかです。",
  },
  {
    question: "アップロードしたファイルは安全ですか？",
    answer: "はい、完全に安全です。ファイルはサーバーに送信されず、すべてお使いのブラウザ内で処理されます。機密書類や個人情報を含むPDFでも安心してご利用いただけます。",
  },
  {
    question: "「ふちなし印刷」設定でも切れるのですか？",
    answer: "コンビニのマルチコピー機には「ふちなし印刷」機能がありません。家庭用プリンターと違い、必ず非印刷領域が存在します。そのため、事前にこのツールで余白を追加しておくことが重要です。",
  },
  {
    question: "スマホからでも使えますか？",
    answer: "はい、iPhone・Androidどちらからもご利用いただけます。コンビニに行く前にスマホで処理し、そのままネットプリントにアップロードする使い方が便利です。",
  },
];

const seoContent = {
  intro:
    "コンビニのマルチコピー機でPDFを印刷すると、用紙の端が切れてしまう問題を解決するツールです。PDFの内容を少し縮小して白い余白を追加するだけで、セブンイレブンやローソンのコピー機でもきれいに印刷できます。10円を無駄にする前に、このツールで余白を調整しましょう。",
  useCases: [
    { title: "📄 レポート・資料の印刷", desc: "ページ番号やヘッダーが切れずにきれいに印刷" },
    { title: "📋 履歴書・申請書の印刷", desc: "枠線や記入欄が端まで正しく印刷される" },
    { title: "🎫 チケット・バーコードの印刷", desc: "QRコードやバーコードが切れずに読み取り可能" },
    { title: "📊 プレゼン資料の印刷", desc: "スライドの端のグラフや図表もしっかり印刷" },
  ],
  tips: "コンビニで印刷する際は、コピー機の設定で「用紙に合わせて拡大縮小」をオフにし、「実際のサイズ」で印刷してください。本ツールですでに最適なサイズに調整済みです。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "コンビニ印刷で端が切れる問題を解決【無料】セブン・ローソン・ファミマ対応",
  tool,
  longDescription: "PDFの余白を自動追加してコンビニ印刷の端切れを解決。セブン・ローソン・ファミマ全対応。登録不要・完全無料。スマホからもOK。",
  keywords: [
    "コンビニ印刷 端が切れる",
    "PDF 余白を追加",
    "セブンイレブン 印刷 切れる",
    "ローソン 印刷 余白",
    "ネットプリント 縮小",
    "PDF 印刷 見切れる",
    "楽譜 コンビニ印刷",
    "PDF 余白設定",
    "コンビニ PDF 余白",
    "PDF 余白追加",
    "コンビニ コピー機 余白",
    "マルチコピー機 印刷 切れる",
    "PDF 縮小 余白",
    "ネットプリント 余白",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function CombiniPrintPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CombiniPrintClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
