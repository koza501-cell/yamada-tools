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
];

const seoContent = {
  intro: "経理担当者の強い味方——全銀フォーマット変換ツール。ExcelやCSVの振込リストを、銀行指定のフォーマットに一括変換。給与振込、取引先への支払い、経費精算など、毎月の振込業務を大幅に効率化します。",
  useCases: [
    { title: "💰 給与振込", desc: "従業員の給与データを一括変換" },
    { title: "🏢 取引先支払い", desc: "仕入先・外注先への振込データ作成" },
    { title: "💳 経費精算", desc: "従業員への経費払い戻しデータ" },
    { title: "📊 一括振込", desc: "大量の振込先を効率的に処理" },
  ],
  tips: "銀行によってフォーマットの細かい仕様が異なる場合があります。初回は少額でテスト振込することをおすすめします。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】全銀フォーマット変換｜振込データ作成",
  tool,
  longDescription: "ExcelやCSVを全銀フォーマットに変換。給与振込、総合振込に対応。日本国内サーバーで安全処理、登録不要・完全無料。",
  keywords: ["全銀フォーマット", "全銀フォーマット変換", "振込データ作成", "給与振込", "総合振込", "FB変換", "ファームバンキング"],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function BankFormatPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BankFormatClient faq={faq} seoContent={seoContent} />
    </>
  );
}
