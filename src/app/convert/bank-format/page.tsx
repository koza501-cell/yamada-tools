import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import BankFormatClient from "./client";
import AdFreeZone from "@/components/AdFreeZone";
import { JsonLdDedup } from "./json-ld-dedup";
import RelatedTools from "@/components/common/RelatedTools";
import { AdUnit } from "@/components/common/AdUnit";

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
  {
    question: "全銀データはどのソフトで作成できますか？",
    answer: "会計ソフト（弥生・freee等）やExcelマクロで作成できます。本ツールはブラウザだけで作成可能です。",
  },
  {
    question: "振込手数料はどうなりますか？",
    answer: "振込手数料は各銀行の規定に従います。全銀データ自体に手数料情報は含まれません。",
  },
  {
    question: "テスト送信はできますか？",
    answer: "多くの銀行のインターネットバンキングにはテストモードがあります。本番送信前に必ずテスト確認を推奨します。",
  },
  {
    question: "文字コードはSJISとUTF-8どちらですか？",
    answer: "全銀フォーマットの標準はShift-JIS（SJIS）です。本ツールはSJIS形式で出力します。",
  },
];

// Target keywords (from Search Console):
// - 全銀フォーマット 作り方 (39 imp, 8 clicks)
// - 全銀フォーマット変換ツール (30 imp, 7 clicks)
// - 全銀データ作成ツール
// - 全銀フォーマット 変換

export const metadata: Metadata = generateToolMetadata({
  customTitle: "全銀フォーマット変換【無料】Excel・CSV対応｜給与振込・総合振込データ作成",
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

const bankFormatHowToSteps = [
  { name: "委託者情報を入力", text: "振込依頼元の委託者コード、委託者名（カナ）、振込指定日、仕向銀行・支店・口座番号を入力します。" },
  { name: "振込先データを入力", text: "手動入力またはCSVアップロードで振込先の銀行コード・支店コード・口座番号・受取人名・金額を入力します。" },
  { name: "全銀フォーマットに変換", text: "「全銀フォーマットに変換」ボタンをクリックすると、120バイト固定長の全銀形式テキストファイルが自動生成されます。" },
  { name: "ダウンロードしてアップロード", text: "生成された.txtファイルをダウンロードし、銀行のインターネットバンキングの振込データアップロード画面にそのままアップロードします。" },
];

const bankFormatSeoContent = {
  intro: "全銀フォーマットは給与振込・取引先支払い・返金処理など、さまざまな場面で活用されています。",
  useCases: [
    { title: "毎月の給与振込（中小企業）", desc: "従業員20〜50名の給与振込で、毎月Excelの一覧から全銀フォーマットを作成。手書きや手入力のミスがなくなり、月末作業が10分で完了。" },
    { title: "取引先への一括支払い（経理担当）", desc: "月末締めの支払いで、複数取引先への振込データを1つの全銀ファイルに集約。銀行窓口に持ち込まずATMやネットバンキングで一括処理。" },
    { title: "イベント参加費の返金処理", desc: "セミナーや講演会の中止に伴う参加費返金。参加者100名以上の振込先データを全銀フォーマットで作成し、1日で全件処理。" },
    { title: "クリニック・士業の顧問料支払い", desc: "毎月発生する顧問税理士・社労士・弁護士への報酬支払いを全銀化。複数の顧問先がある場合の手間を大幅削減。" },
    { title: "建設業の協力会社支払い", desc: "下請け・協力会社への月次支払いを全銀ファイルで一括処理。請求書チェック後そのままExcelからフォーマット変換可能。" },
    { title: "副業フリーランスへの報酬振込", desc: "業務委託契約者・副業ワーカーへの月次報酬を全銀ファイルで一括振込。個別振込の手数料・手間を大幅圧縮。" },
  ],
};

const jsonLd = generateToolJsonLd(tool, faq, bankFormatHowToSteps);

export default function Page() {
  return (
    <>
      <script
        id="bank-format-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AdFreeZone><BankFormatClient faq={faq} seoContent={bankFormatSeoContent} /></AdFreeZone>
      <JsonLdDedup scriptId="bank-format-jsonld" />
      <AdUnit slot="6291847305" format="horizontal" />

      {/* Educational Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-kon dark:text-gray-300 mb-6">全銀フォーマットについて</h2>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">全銀フォーマットとは？</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            全銀フォーマット（全国銀行協会制定フォーマット）は、企業が銀行へ振込データを電子的に送信する際の標準形式です。1983年に全国銀行協会が策定し、現在も日本国内のほぼすべての金融機関で採用されています。給与振込や仕入先への支払いなど、企業の日常的な資金移動に欠かせないデータ形式です。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">手作業で作成する際のよくある問題</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            全銀フォーマットは固定長120バイトのテキストファイルで、ヘッダー・データ・トレーラー・エンドの4種類のレコードで構成されています。Excelで手作業作成すると、文字コードの不一致（UTF-8とShift-JIS）、フィールド長の超過、半角カナへの変換漏れなどが原因でエラーになりがちです。本ツールを使えば、これらの形式上のミスを自動的に防げます。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">総合振込と給与振込の違い</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            総合振込は取引先や仕入先への支払いに使う形式で、種別コードは「21」です。一方、給与振込は従業員への給与支払い用で種別コードは「11」となります。データのレイアウトは基本的に同じですが、銀行のインターネットバンキングでアップロードする際のメニューが異なります。どちらの形式も本ツールで作成可能です。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">エラーを防ぐためのポイント</h3>
          <ul className="text-gray-700 dark:text-gray-300 space-y-2 mb-4">
            <li className="flex items-start gap-2"><span className="text-kon font-bold">・</span>受取人名は必ず半角カナで入力（全角は銀行側でエラーになる場合あり）</li>
            <li className="flex items-start gap-2"><span className="text-kon font-bold">・</span>口座番号は右詰め、不足分はゼロ埋め（例：123→0000123）。受取人名のカタカナ変換には<a href="/convert/furigana" className="text-kon hover:text-ai underline">ふりがな変換ツール</a>が便利です</li>
            <li className="flex items-start gap-2"><span className="text-kon font-bold">・</span>金額フィールドは整数のみ（小数点・カンマは使用不可）</li>
            <li className="flex items-start gap-2"><span className="text-kon font-bold">・</span>銀行コード・支店コードは最新のものを使用（統廃合で変更されている場合あり）。作成した振込データに対応する<a href="/document/invoice" className="text-kon hover:text-ai underline">請求書の作成</a>も本サイトで可能です</li>
          </ul>
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">全銀データの構造</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-kon/20">
                    <th className="px-4 py-2 text-left border border-gray-200 dark:border-gray-600">レコード種別</th>
                    <th className="px-4 py-2 text-left border border-gray-200 dark:border-gray-600">レコード長</th>
                    <th className="px-4 py-2 text-left border border-gray-200 dark:border-gray-600">内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="px-4 py-2 font-medium">ヘッダーレコード</td>
                    <td className="px-4 py-2">120桁固定長</td>
                    <td className="px-4 py-2">銀行コード・科目・日付などのヘッダー情報</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <td className="px-4 py-2 font-medium">データレコード</td>
                    <td className="px-4 py-2">120桁固定長</td>
                    <td className="px-4 py-2">振込先口座情報・金額など</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="px-4 py-2 font-medium">トレーラーレコード</td>
                    <td className="px-4 py-2">120桁固定長</td>
                    <td className="px-4 py-2">合計金額・件数</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">エンドレコード</td>
                    <td className="px-4 py-2">120桁固定長</td>
                    <td className="px-4 py-2">ファイル終端マーカー</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">よくあるエラーと対処法</h3>
            <div className="space-y-3">
              {[
                { title: "文字コードエラー", desc: "SJIS以外の文字コードを使用している場合。UTF-8で入力しSJIS変換して保存。" },
                { title: "桁数オーバー", desc: "項目ごとに桁数制限があります。入力値が桁数制限内に収まっているか確認。" },
                { title: "必須項目未入力", desc: "銀行コード・支店コード・口座番号は必須。空白のまま送信するとエラーになります。" },
                { title: "金額フォーマットエラー", desc: "金額は半角数字のみ。「,」や「¥」記号は不可。数字のみ入力してください。" },
                { title: "銀行コード不正", desc: "4桁の正しい銀行コードが必要。銀行名ではなくコード番号で入力してください。" },
              ].map((item, i) => (
                <div key={i} className="border-l-4 border-gray-200 bg-gray-50 dark:bg-kon/20 rounded-r-lg p-4">
                  <p className="font-bold text-kon dark:text-amber-300 mb-1">{item.title}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Cornerstone Blog Callout */}
      <section className="max-w-4xl mx-auto px-4 pb-6">
        <div className="bg-gray-50 dark:bg-kon/20 border border-gray-200 dark:border-kon rounded-xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">📖</span>
            <div className="flex-1">
              <h3 className="font-bold text-kon dark:text-gray-300 mb-1">全銀フォーマットの作り方を体験談で詳しく</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">経理1年目で初めて全銀データ作成を任された担当者の実体験。専門用語ゼロで、つまずきやすいポイントを30分で解決した方法を解説しています。</p>
              <a href="/blog/zengin-format-how-to-create" className="inline-flex items-center gap-1 text-sm font-medium text-kon dark:text-gray-300 hover:text-ai">
                記事を読む →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-kon dark:text-gray-300 mb-4">対応銀行の例</h2>
          <div className="flex flex-wrap gap-2">
            {["三菱UFJ銀行", "三井住友銀行", "みずほ銀行", "りそな銀行", "ゆうちょ銀行", "楽天銀行", "PayPay銀行", "住信SBIネット銀行", "auじぶん銀行", "GMOあおぞらネット銀行", "UI銀行", "信用金庫・地方銀行"].map((bank, i) => (
              <span key={i} className="px-3 py-1 bg-gray-50 dark:bg-kon/20 text-kon dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-kon">{bank}</span>
            ))}
          </div>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
