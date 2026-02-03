import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import BankFormatClient from "./client";

const tool = getToolById("bank-format")!;

const faq = [
  {
    question: "全銀フォーマットとは何ですか？",
    answer: "全国銀行協会が定めた振込データの標準形式です。企業が銀行に振込依頼をする際に使用され、給与振込や取引先への支払いなどで広く利用されています。",
  },
  {
    question: "全銀フォーマットの作り方を教えてください",
    answer: "本ツールでExcelやCSVファイルをアップロードし、列を指定するだけで全銀フォーマット（.txt）ファイルを自動生成できます。手作業でのデータ作成は不要です。",
  },
  {
    question: "どの銀行でも使えますか？",
    answer: "はい、全銀フォーマットは日本国内のほぼすべての銀行で対応しています。メガバンク、地方銀行、信用金庫、ゆうちょ銀行など幅広く利用可能です。",
  },
  {
    question: "ExcelやCSVから変換できますか？",
    answer: "はい、ExcelやCSVファイルをアップロードして全銀フォーマットに変換できます。列の並び順を指定するだけで簡単に変換可能です。",
  },
  {
    question: "振込手数料の区分は設定できますか？",
    answer: "はい、先方負担・当方負担の設定が可能です。振込先ごとに個別に設定することもできます。",
  },
  {
    question: "給与振込に使えますか？",
    answer: "はい、給与振込データの作成に最適です。従業員の口座情報をまとめて全銀フォーマットに変換し、銀行のインターネットバンキングにアップロードできます。",
  },
  {
    question: "データは安全に処理されますか？",
    answer: "はい、ファイルは日本国内のサーバーのみで処理され、60分後に自動削除されます。振込先の口座情報が漏れる心配はありません。",
  },
  {
    question: "文字コードは何に対応していますか？",
    answer: "Shift-JIS（SJIS）とUTF-8に対応しています。多くの銀行システムはShift-JISを要求するため、デフォルトはShift-JISです。",
  },
  {
    question: "総合振込と給与振込の違いは？",
    answer: "総合振込は取引先への支払い用、給与振込は従業員への給与支払い用です。データ形式は同じですが、銀行への依頼方法が異なる場合があります。",
  },
  {
    question: "全銀データ作成ツールは無料ですか？",
    answer: "はい、完全無料でご利用いただけます。会員登録も不要です。",
  },
];

// Target keywords (from Search Console):
// - 全銀フォーマット 作り方 (39 imp, 8 clicks)
// - 全銀フォーマット変換ツール (30 imp, 7 clicks)
// - 全銀データ作成ツール
// - 全銀フォーマット 変換

export const metadata: Metadata = generateToolMetadata({
  customTitle: "全銀フォーマット変換・作成ツール【無料】全銀データの作り方",
  tool,
  longDescription: "全銀フォーマットの作り方がわからない方へ。ExcelやCSVから全銀フォーマット（全銀データ）を無料で簡単作成。給与振込・総合振込に対応。日本国内サーバーで口座情報も安全処理。登録不要・完全無料の全銀フォーマット変換ツール。",
  keywords: [
    '全銀フォーマット 作り方',
    '全銀フォーマット変換ツール',
    '全銀データ作成ツール',
    '全銀フォーマット 変換',
    '全銀フォーマット Excel',
    '全銀フォーマット CSV',
    '給与振込 データ作成',
    '振込データ 作成',
    '全銀協フォーマット',
    '銀行振込 一括',
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BankFormatClient />
    </>
  );
}
