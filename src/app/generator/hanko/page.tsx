import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import HankoClient from "./client";
import AdFreeZone from "@/components/AdFreeZone";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("hanko")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "電子印鑑（デジタルはんこ）を無料作成。認印、角印、日付印など、様々なスタイルの印鑑を作成できます。",
  useCases: [
    { title: "📄 電子文書", desc: "PDF文書への押印" },
    { title: "🏢 社内書類", desc: "稟議書や申請書に" },
    { title: "📝 請求書", desc: "請求書への角印" },
    { title: "✅ 承認印", desc: "確認済みの印鑑" },
  ],
  tips: "認印は丸型、会社印は角型が一般的です。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "電子印鑑作成【無料】ハンコ画像を10秒で作成｜透過PNG対応",
  tool,
  longDescription: "ビジネス用電子印鑑を無料で即作成。認印・角印・日付印に対応。透過PNG出力でWord・Excel・PDFに貼り付け可能。",
  keywords: ['電子印鑑', 'デジタル印鑑', 'はんこ 作成', '印鑑 無料'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AdFreeZone><HankoClient /></AdFreeZone>

      {/* Educational Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-kon mb-6">電子印鑑の詳しい解説</h2>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">電子印鑑の法的位置づけ</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            2001年施行の電子署名法により、一定の条件を満たす電子署名には法的効力が認められています。ただし、本ツールで作成する印影画像は「電子署名」ではなく「印影の画像データ」です。社内の稟議書、見積書、納品書、領収書など日常業務の文書には広く使われていますが、不動産登記や公正証書のように実印が必要な場面では使用できません。社内決裁や取引先とのやり取りには十分実用的です。
          </p>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">認印・実印・角印の違い</h3>
          <ul className="text-gray-700 space-y-2 mb-4">
            <li className="flex items-start gap-2"><span className="text-kon font-bold">・</span><strong>認印（みとめいん）</strong>：日常的に使う個人の丸印。苗字を彫刻。社内文書の確認や荷物の受け取りに使用</li>
            <li className="flex items-start gap-2"><span className="text-kon font-bold">・</span><strong>実印（じついん）</strong>：市区町村に登録した印鑑。不動産契約や法人設立など重要な法的手続きに必要。電子印鑑での代用は不可</li>
            <li className="flex items-start gap-2"><span className="text-kon font-bold">・</span><strong>角印（かくいん）</strong>：会社名が刻まれた四角い印鑑。請求書や見積書の社印として使用。本ツールで角印も作成可能</li>
            <li className="flex items-start gap-2"><span className="text-kon font-bold">・</span><strong>日付印</strong>：受領日や承認日を記録する印鑑。「2026.03.18 確認 山田」のように日付入りで作成可能</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">電子印鑑が使える場面・使えない場面</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            使える場面：社内稟議書、見積書、請求書、納品書、領収書、契約書（双方合意の場合）、確認印、検収書。使えない場面：不動産登記、銀行届出印、公正証書、婚姻届など行政手続き。取引先によっては電子印鑑を受け入れない場合もあるため、事前に確認するとスムーズです。
          </p>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">Word・Excel・PDFへの貼り付け方</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            本ツールで作成した印影は透過PNG形式でダウンロードされます。Wordの場合は「挿入」→「画像」で配置し、「文字列の折り返し」を「前面」に設定すると署名欄の上に重ねられます。Excelも同様に画像挿入で配置可能です。PDFに直接押印したい場合は、山田ツールの<a href="/pdf/stamp" className="text-kon hover:text-ai underline">PDF押印ツール</a>と組み合わせると、印刷不要でデジタル完結できます。
          </p>
          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">PDFに電子ハンコを直接追加する</h3>
          <p className="text-gray-700 leading-relaxed mb-4">作成した電子印鑑をPDFに直接配置したい場合は<a href="/pdf/text-input" className="text-orange-600 hover:underline font-medium">電子ハンコをPDFに追加</a>をご利用ください。名前入力だけで認印を自動生成し、PDF上の任意の位置に配置できます。テキスト入力・電子ハンコ・令和日付の挿入がひとつのツールで完結します。登録不要・完全無料です。</p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
