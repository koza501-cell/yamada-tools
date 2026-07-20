import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import FuriganaClient from "./client";
import { AdUnit } from "@/components/common/AdUnit";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("furigana")!;

const faq = [
  { question: "人名も正確に変換できますか？", answer: "一般的な読み方は対応していますが、珍しい読み方は異なる場合があります。" },
  { question: "カタカナやローマ字でフリガナを振れますか？", answer: "はい、出力形式でひらがな・カタカナ・ローマ字のいずれかを選択できます。カタカナを選ぶとフリガナがすべてカタカナで表示されます。" },
  { question: "文章全体を一括変換できますか？", answer: "はい、長文でも一括でふりがなを振れます。" },
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、入力テキストは保存されません。" },
  { question: "ひらがなツールとして使えますか？", answer: "はい、漢字をひらがなに変換するツールとしてご利用いただけます。" },
];

// Target keywords (from Search Console data):
// - ふりがなツール (1,241 imp)
// - フリガナツール (302 imp)
// - ふりがなフリツール (110 imp)
// - ひらがなツール (94 imp)
// - ふりがなつーる (92 imp)
// - ふりがな 変換 (89 imp)
// Total: ~5,000+ impressions

export const metadata: Metadata = generateToolMetadata({
  customTitle: "ふりがな変換【無料】漢字→ひらがな・カタカナ・ローマ字を瞬時に変換",
  tool,
  longDescription: "漢字テキストをひらがな・カタカナ・ローマ字に即変換。登録不要・コピペするだけ。請求書・名簿・Excelデータのふりがな付けに対応。",
  keywords: [
    'ふりがなツール',
    'フリガナツール', 
    'ふりがな変換',
    'ひらがなツール',
    'ふりがな 変換',
    '漢字 読み方',
    'ルビ 振る',
    '漢字 ふりがな',
    '読み仮名',
    'ふりがな 自動',
    'ルビ 自動付与',
    'カタカナ変換',
    '漢字 ひらがな 変換',
    '漢字読み方',
    'ひらがな変換'
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);


const furiganaUseCases = [
  {
    title: "クリニックの問診票・案内文",
    desc: "高齢患者向けの問診票や院内案内文にふりがなを付けて、読みやすさと安心感を向上。漢字が苦手な方や視力の弱い方への配慮として効果的。"
  },
  {
    title: "学校のお知らせ・配布物",
    desc: "小学生・低学年向けのプリント、保護者向けの多言語サポート資料、特別支援教育の教材作成にふりがなを一括付与。手作業の数十倍の速さで完成。"
  },
  {
    title: "外国人向けの日本語学習教材",
    desc: "日本語学校・企業の外国人研修・観光案内のテキストに、漢字の読みを補足。学習者の理解度と継続率を向上させる定番手法。"
  },
  {
    title: "高齢者施設・自治体の広報",
    desc: "介護施設の入居案内、地域包括支援センターの案内文、自治体の防災マニュアル。読み手の年齢層が幅広い場合に必須の配慮。"
  },
  {
    title: "出版・編集業務の下作業",
    desc: "児童書、絵本、教科書、振り仮名つき小説の編集前の下書き作成。手動で全文に振る作業を本ツールで自動化し、編集者は読みの確認に集中できる。"
  },
  {
    title: "プレゼン資料・社内研修",
    desc: "新人研修の専門用語解説、業界用語の多い資料、医療・法律・技術系のドキュメント。読み方の不明な漢字でつまずく時間を削減。"
  }
];
export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FuriganaClient />
      <AdUnit slot="5612038947" format="horizontal" />

      <section className="my-12 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">こんな場面で使われています</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {furiganaUseCases.map((uc) => (
            <div key={uc.title} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
              <h3 className="font-semibold mb-2">{uc.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Educational Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-kon mb-6">ふりがな変換の詳しい解説</h2>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">ふりがなが必要になる場面</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            ふりがな（ルビ）は、教育現場での教材作成、子ども向けの案内文、外国人居住者向けの行政文書など、幅広い場面で求められます。企業の顧客名簿で読みがなを一括付与したいケースや、Webサイトのアクセシビリティ向上のためにルビを振るケースも増えています。手作業で一文字ずつ調べるのは膨大な時間がかかりますが、自動変換ツールなら数秒で完了します。
          </p>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">ひらがな・カタカナ・ローマ字の使い分け</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            ひらがな出力は小学校低学年向け教材や絵本のルビに適しています。カタカナ出力は住所録や金融機関への届出書類で使われることが多く、<a href="/convert/bank-format" className="text-kon hover:text-ai underline">全銀フォーマット変換ツール</a>の受取人名作成にも活用できます。ローマ字出力は外国人向けの案内や、パスポート・在留カードの氏名表記の確認に便利です。用途に応じて出力形式を切り替えてください。
          </p>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">外国人居住者・日本語学習者への活用</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            日本に住む外国人にとって、漢字の読み方は大きなハードルです。役所からの通知や学校の配布物にふりがなが振られていないと内容を理解できないことがあります。本ツールを使えば、日本語の文章にワンクリックでふりがなを付与でき、多文化共生の支援に役立ちます。日本語能力試験（JLPT）の学習にも活用されています。縦書きの教材を作りたい場合は、<a href="/document/vertical-text" className="text-kon hover:text-ai underline">縦書き変換ツール</a>と併用すると便利です。
          </p>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">珍しい漢字の読みへの対処法</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            自動変換は辞書データに基づいて処理するため、人名の特殊な読み（例：「一」を「にのまえ」と読む苗字）や地名の難読（例：「喜連瓜破」＝きれうりわり）は正しく変換されない場合があります。変換結果は必ず目視で確認し、必要に応じて手動修正してください。固有名詞が多い文書は、最初に少量のテキストでテスト変換すると効率的です。
          </p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
