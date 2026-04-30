import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import HankoClient from "./client";
import AdFreeZone from "@/components/AdFreeZone";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("hanko")!;

const faq = [
  { question: "PDFに電子印鑑を押せますか？", answer: "はい、本ツールで作成した電子印鑑（透過PNG）はPDFに直接押印できます。山田ツールの「PDFに文字を直接入力」または「PDF押印ツール」を使えば、印刷不要でPDFファイルに電子印鑑を配置・保存できます。完全無料・登録不要です。" },
  { question: "電子印鑑をPDFに無料で押す方法は？", answer: "①本ツールで電子印鑑を作成 ②透過PNGとしてダウンロード ③「PDFに文字を直接入力」ツールでPDFを開き、電子印鑑画像を任意の位置に配置 ④PDFとして保存。すべての工程が完全無料、ソフトのインストールも不要でブラウザ上で完結します。" },
  { question: "認印・角印・日付印の違いは何ですか？", answer: "認印は丸型で個人の苗字を彫刻、社内文書や荷物受け取りに使用。角印は四角型で会社名を彫刻、請求書や見積書の社印として使用。日付印は受領日や承認日を記録するための印鑑で「2026.04.30 確認 山田」のように日付を含めて作成できます。本ツールはこの3種類すべてに対応しています。" },
  { question: "電子印鑑は法的に有効ですか？", answer: "本ツールで作成する印影は「印影画像」であり、社内稟議書、見積書、請求書、納品書、領収書など日常業務には広く使われ実用的です。ただし、不動産登記や公正証書のように実印が必要な法的手続きには使用できません。取引先によっては事前確認が必要な場合もあります。" },
  { question: "Word・Excel・PDFに貼り付けられますか？", answer: "はい、透過PNG形式で出力されるため、Word・Excel・PDFすべてに簡単に貼り付けられます。Wordでは「挿入」→「画像」で配置し、「文字列の折り返し」を「前面」に設定すると署名欄に重ねられます。PDFに直接押したい場合は山田ツールのPDF押印ツールが便利です。" },
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。回数制限もないため、必要な時にいつでも何度でも電子印鑑を作成できます。日本国内サーバーで処理されるので、機密性の高い書類用の印鑑作成にも安心です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからもブラウザだけで利用可能です。アプリのインストールは不要、外出先でも電子印鑑をすぐに作成できます。作成した印影はそのままスマホに保存され、メールやチャットで送信することも可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、入力情報や生成された印影画像は60分後に自動削除されます。海外サーバーに送信されることは一切なく、機密書類用の印鑑作成にも安心してご利用いただけます。" },
];

export const metadata: Metadata = generateToolMetadata({
  customTitle: "電子印鑑PDF作成【無料】認印・角印を10秒で作成→PDF押印対応",
  tool,
  longDescription:
    "PDFに押せる電子印鑑を無料で即作成。認印・角印・日付印に対応、透過PNG出力でPDF・Word・Excelに貼り付け可能。登録不要・完全無料、日本国内サーバーで安全処理。",
  keywords: [
    'PDF 電子印鑑',
    '電子印鑑 PDF',
    '電子印鑑 無料 PDF',
    '印鑑 PDF',
    '電子印鑑',
    'デジタル印鑑',
    'はんこ 作成',
    '印鑑 無料',
    '電子印鑑 作成',
    '電子印鑑 透過',
    '認印 作成',
    '角印 作成',
    '日付印 作成',
    'ハンコ PNG',
    'デジタルはんこ',
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AdFreeZone><HankoClient /></AdFreeZone>

      {/* Educational Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-kon dark:text-blue-300 mb-6">PDFに押せる電子印鑑を10秒で作成</h2>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            「PDFに電子印鑑を押したい」「無料で電子印鑑を作ってPDFに貼り付けたい」——そんな時に便利なのが本ツールです。名前を入力するだけで認印・角印・日付印を10秒で作成し、透過PNG形式で即ダウンロード。<a href="/pdf/text-input" className="text-kon dark:text-blue-300 hover:text-ai underline">PDFに文字を直接入力ツール</a>と組み合わせれば、PDFファイルに電子印鑑を直接押印・保存できます。在宅ワーク、テレワーク、ペーパーレス化を進めている企業様に多くご利用いただいています。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">PDFに電子印鑑を押す3ステップ</h3>
          <ol className="text-gray-700 dark:text-gray-300 space-y-3 mb-4 list-decimal list-inside">
            <li className="leading-relaxed"><strong>本ツールで電子印鑑を作成</strong>：苗字または会社名を入力し、丸型（認印）または角型（角印）を選択。色やフォントもカスタマイズできます。</li>
            <li className="leading-relaxed"><strong>透過PNGをダウンロード</strong>：背景透過のPNGなので、PDFやWord文書のどこに配置しても自然に馴染みます。</li>
            <li className="leading-relaxed"><strong>PDFに配置・保存</strong>：山田ツールの<a href="/pdf/text-input" className="text-kon dark:text-blue-300 hover:text-ai underline">PDF文字入力ツール</a>でPDFを開き、印影画像を任意の位置にドラッグ＆ドロップ。サイズ調整後、PDFとして保存すれば完了です。</li>
          </ol>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            印刷→押印→スキャンの煩わしい作業が不要になり、在宅ワークでもスマホ・PCだけで業務が完結します。すべての工程が完全無料・登録不要・日本国内サーバー処理です。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">電子印鑑の法的位置づけ</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            2001年施行の電子署名法により、一定の条件を満たす電子署名には法的効力が認められています。ただし、本ツールで作成する印影画像は「電子署名」ではなく「印影の画像データ」です。社内の稟議書、見積書、納品書、領収書など日常業務の文書には広く使われていますが、不動産登記や公正証書のように実印が必要な場面では使用できません。社内決裁や取引先とのやり取りには十分実用的です。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">認印・実印・角印・日付印の違い</h3>
          <ul className="text-gray-700 dark:text-gray-300 space-y-2 mb-4">
            <li className="flex items-start gap-2"><span className="text-kon dark:text-blue-300 font-bold">・</span><strong>認印（みとめいん）</strong>：日常的に使う個人の丸印。苗字を彫刻。社内文書の確認や荷物の受け取りに使用</li>
            <li className="flex items-start gap-2"><span className="text-kon dark:text-blue-300 font-bold">・</span><strong>実印（じついん）</strong>：市区町村に登録した印鑑。不動産契約や法人設立など重要な法的手続きに必要。電子印鑑での代用は不可</li>
            <li className="flex items-start gap-2"><span className="text-kon dark:text-blue-300 font-bold">・</span><strong>角印（かくいん）</strong>：会社名が刻まれた四角い印鑑。請求書や見積書の社印として使用。本ツールで角印も作成可能</li>
            <li className="flex items-start gap-2"><span className="text-kon dark:text-blue-300 font-bold">・</span><strong>日付印</strong>：受領日や承認日を記録する印鑑。「2026.04.30 確認 山田」のように日付入りで作成可能</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">電子印鑑が使える場面・使えない場面</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            <strong>使える場面</strong>：社内稟議書、見積書、請求書、納品書、領収書、契約書（双方合意の場合）、確認印、検収書、PDF文書への押印。<strong>使えない場面</strong>：不動産登記、銀行届出印、公正証書、婚姻届など行政手続き。取引先によっては電子印鑑を受け入れない場合もあるため、事前に確認するとスムーズです。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">Word・Excel・PDFへの貼り付け方</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            本ツールで作成した印影は透過PNG形式でダウンロードされます。<strong>Word</strong>の場合は「挿入」→「画像」で配置し、「文字列の折り返し」を「前面」に設定すると署名欄の上に重ねられます。<strong>Excel</strong>も同様に画像挿入で配置可能です。<strong>PDF</strong>に直接押印したい場合は、山田ツールの<a href="/pdf/text-input" className="text-kon dark:text-blue-300 hover:text-ai underline">PDF文字入力ツール</a>または<a href="/pdf/stamp" className="text-kon dark:text-blue-300 hover:text-ai underline">PDF押印ツール</a>と組み合わせると、印刷不要でデジタル完結できます。
          </p>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">よくある質問</h3>
          <div className="space-y-4 mt-4">
            {faq.map((item, i) => (
              <details key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <summary className="font-bold text-gray-800 dark:text-gray-100 cursor-pointer">{item.question}</summary>
                <p className="text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">{item.answer}</p>
              </details>
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
