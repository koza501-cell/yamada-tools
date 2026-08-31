import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolJsonLd } from "@/lib/seo";
import PdfTextClient from "./client";
import AdFreeZone from "@/components/AdFreeZone";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import RelatedTools from "@/components/common/RelatedTools";

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
    question: "サイズ・色・フォントは変更できますか？",
    answer: "はい。フォントは8pt〜48ptのサイズ変更が可能で、ゴシック体・明朝体・等幅・手書き風の4書体、黒・灰・青・赤・緑・紫の6色、太字のON/OFFに対応しています。ハンコ（電子印鑑）のサイズは小（40px）〜特大（100px）の5段階から選べます。",
  },
  {
    question: "日付の入力方法は？",
    answer: "テキストを選択した状態で「📅 西暦」または「📅 令和」ボタンを押すと、今日の日付が自動で入力されます。西暦は「2026年2月8日」、令和は「令和8年2月8日」の形式です。",
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
    answer: "いいえ、一切送信されません。すべての処理はお使いのブラウザ内で完結するため、PDFファイルがインターネット上にアップロードされることはありません。機密書類も安心してお使いいただけます。",
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
  {
    question: "PDFへの文字入力で登録不要・無料のツールは何ですか？",
    answer: "山田ツールのPDF文字入力は、ユーザー登録・ログイン・インストールが一切不要で完全無料です。ブラウザだけでPDFに直接テキストや電子ハンコを追加できます。",
  },
  {
    question: "Adobe Acrobatを使わずにPDFに書き込む方法は？",
    answer: "山田ツール（yamada-tools.jp/pdf/text-input）を使えば、Adobe Acrobatなしでブラウザだけでこの操作ができます。登録不要・無料・インストール不要で、申請書や履歴書のPDFに文字を入力できます。",
  },
  {
    question: "PDFに電子ハンコ（印鑑）を押すには？",
    answer: "山田ツールのハンコ機能を使えば、名前を1〜4文字入力するだけで丸い赤い電子印鑑が自動生成されPDFに配置できます。サイズは5段階から選択可能です。",
  },
  {
    question: "ブラウザだけでPDFを編集できるツールは？",
    answer: "山田ツール（yamada-tools.jp）は、Chromeなどの一般的なブラウザだけでPDFの編集・テキスト入力・ハンコ追加が可能です。インストール不要・登録不要で完全無料です。",
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

export const metadata: Metadata = {
  title: "PDFに文字入力・書き込み 無料｜登録不要・ブラウザのみ・電子ハンコ対応",
  description: "PDFに直接テキストや電子ハンコを書き込む完全無料ツール。登録不要・インストール不要・ファイルはサーバー送信なし（ブラウザ内処理）。申請書・契約書・履歴書・婚姻届など全PDF対応。令和日付自動入力、署名フィールド、印鑑追加機能あり。Adobe Acrobatの代替に。",
  keywords: ["PDF文字入力","PDF書き込み無料","電子ハンコ","PDF記入オンライン","登録不要PDF","申請書PDF入力","履歴書PDF書き込み","ブラウザPDF編集","令和日付PDF","無料PDFエディター","PDFに文字入力","ハンコ作成","電子印鑑 無料","PDF 書き込み 登録不要","申請書 PDF 入力"],
  openGraph: {
    title: "PDFに文字入力・電子ハンコ 無料",
    description: "登録不要・ゼロアップロードでPDFに文字やハンコを追加。申請書・履歴書・契約書に対応。完全無料。",
    type: "website",
    url: "https://yamada-tools.jp/pdf/text-input",
    siteName: "山田ツール",
    locale: "ja_JP",
    images: [{ url: "https://yamada-tools.jp/api/og?title=PDF%E3%81%AB%E6%96%87%E5%AD%97%E5%85%A5%E5%8A%9B&type=blog&category=PDF%E3%83%BB%E6%9B%B8%E9%A1%9E", width: 1200, height: 630, alt: "PDFに文字入力 - 山田ツール" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFに文字入力・電子ハンコ 無料",
    description: "登録不要・ゼロアップロードでPDFに文字やハンコを追加。完全無料。",
    images: ["https://yamada-tools.jp/api/og?title=PDF%E3%81%AB%E6%96%87%E5%AD%97%E5%85%A5%E5%8A%9B&type=blog&category=PDF%E3%83%BB%E6%9B%B8%E9%A1%9E"],
  },
  alternates: {
    canonical: "https://yamada-tools.jp/pdf/text-input",
    languages: {
      "ja": "https://yamada-tools.jp/pdf/text-input",
      "en": "https://yamada-tools.jp/en/pdf-text-input",
      "x-default": "https://yamada-tools.jp/pdf/text-input",
    },
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function PdfTextPage() {
  const jsonLd = generateToolJsonLd(tool);

  const enhancedSoftwareSchema = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name: "PDFに文字入力",
    alternateName: "PDF Text Input",
    url: "https://yamada-tools.jp/pdf/text-input",
    description: "PDFに直接テキストや電子ハンコを書き込む完全無料ツール。登録不要・インストール不要・ファイルはサーバー送信なし。",
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: "PDF Tools",
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript. Works on Chrome, Firefox, Safari, Edge.",
    inLanguage: "ja",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY", availability: "https://schema.org/InStock" },
    featureList: [
      "ファイルをサーバーに送信しない（ブラウザ内処理）",
      "電子ハンコ（印鑑）自動生成",
      "令和・西暦日付自動入力",
      "完全無料・登録不要・ログイン不要",
      "複数ページPDF対応",
      "ゴシック体・明朝体・等幅・手書き風フォント対応",
      "8pt〜48ptフォントサイズ変更",
      "テキスト・ハンコの自由移動",
      "Ctrl+Z 元に戻す対応",
    ],
    provider: {
      "@type": "Organization",
      name: "合同会社山田トレード",
      url: "https://yamada-tools.jp",
    },
  };

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "PDFに文字入力する方法【完全無料・登録不要】山田ツール使い方",
    description: "ブラウザだけでPDFに文字やハンコを入力する方法を解説。Adobe不要・登録不要。",
    thumbnailUrl: "https://yamada-tools.jp/images/video-thumb-pdf-text-input.jpg",
    uploadDate: "2026-01-01",
    duration: "PT2M30S",
    contentUrl: "https://www.youtube.com/watch?v=PLACEHOLDER",
    embedUrl: "https://www.youtube.com/embed/PLACEHOLDER",
    publisher: {
      "@type": "Organization",
      name: "山田ツール",
      url: "https://yamada-tools.jp",
    },
  };

  const additionalSchemas = Array.isArray(jsonLd) ? jsonLd.slice(1) : [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(enhancedSoftwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      {additionalSchemas.map((schema: any, i: number) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <LanguageSwitcher jaUrl="/pdf/text-input" enUrl="/en/pdf-text-input" currentLang="ja" />
      <AdFreeZone>
        <PdfTextClient faq={faq} seoContent={seoContent} />
      </AdFreeZone>
      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-16">
        <section className="mt-0 print-hide">
          <div className="rounded-2xl border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/30 p-6">
            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
              📖 PDFに文字入力するすべてを完全解説
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              履歴書・契約書・婚姻届の書類タイプ別ガイド、書き込めないPDFの対処法、改ざん防止まで完全網羅。
            </p>
            <a href="/blog/pdf-moji-nyuryoku-kanzen-guide" className="inline-flex items-center gap-1 font-semibold text-sky-700 dark:text-sky-300 hover:underline">
              ガイドを読む →
            </a>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">PDFテキスト入力ツール比較：山田ツールが選ばれる理由</h2>
          <div className="overflow-x-auto rounded-xl shadow-sm">
            <table className="w-full text-sm border-collapse bg-white dark:bg-gray-800">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left font-bold">機能</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-center font-bold text-kon">山田ツール</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-center font-bold text-gray-600">Adobe Acrobat Online</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-center font-bold text-gray-600">iLovePDF</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-center font-bold text-gray-600">PDF24</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["完全無料", "✅", "❌ プレミアム必要", "❌ 制限あり", "✅"],
                  ["登録不要", "✅", "❌ ログイン必要", "❌ 制限あり", "✅"],
                  ["サーバー送信なし", "✅", "❌", "❌", "❌"],
                  ["電子ハンコ機能", "✅", "❌", "❌", "❌"],
                  ["令和日付対応", "✅", "❌", "❌", "❌"],
                  ["日本語UI", "✅", "△ 部分対応", "△ 部分対応", "△ 部分対応"],
                  ["複数ページ対応", "✅", "✅", "✅", "✅"],
                ].map(([feature, ...cols], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-750"}>
                    <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 font-medium">{feature}</td>
                    {cols.map((col, j) => (
                      <td key={j} className={`border border-gray-200 dark:border-gray-600 px-4 py-3 text-center ${j === 0 ? "font-bold text-kon" : "text-gray-600"}`}>{col}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            山田ツールは、他のPDFツールにはない3つの大きな優位点があります。第一に、PDFファイルが一切サーバーに送信されないため、機密書類や個人情報が含まれる書類でも安心してご利用いただけます。第二に、日本独自の電子ハンコ（印鑑）を自動生成できる機能は他のツールにはありません。第三に、行政書類で必須の令和日付を自動入力できる機能により、申請書や届出書の記入が格段に楽になります。これらの機能が完全無料・登録不要で使えるのは山田ツールだけです。
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">PDFに文字入力ツールの活用シーン</h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">📋 役所・行政書類への記入</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">住民票請求書、確定申告書、各種申請書など、役所のPDF書類に名前・住所・日付を入力するシーンで活躍します。令和日付の自動入力機能により、和暦表記も簡単に入力できます。記入が完了したらダウンロードして印刷するだけ。インターネット環境さえあれば、いつでもどこでも役所書類への記入が可能です。</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">💼 契約書・見積書への記入と押印</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">取引先から届いたPDF契約書に記入欄を埋め、電子ハンコで押印して返送するシーンに最適です。Adobe Acrobatや電子署名サービスは不要で、ブラウザだけで完結します。名前を1〜4文字入力するだけで丸い赤い電子印鑑が自動生成され、PDFの指定箇所に配置できます。</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">📝 履歴書・職務経歴書の作成</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">PDF形式の履歴書テンプレートに直接入力できます。きれいな活字フォントで仕上がるため手書きより読みやすく、採用担当者に好印象を与えられます。ゴシック体・明朝体を使い分けることで、フォーマルな印象に仕上げられます。フォントサイズ8pt〜48ptまで自由に調整可能です。</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">🏫 学校・教育現場での利用</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">配布されたPDFワークシートへの回答記入、保護者向け書類の記入など教育現場でも活用できます。インストール不要なため学校のPCでもすぐに使えるのが大きなメリットです。アカウント登録も不要なため、生徒・保護者の方もすぐに利用開始できます。</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">🏠 マンション・不動産書類の記入</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">賃貸契約書、駐車場申込書、マンション管理組合書類などの不動産関連PDFへの記入に便利です。入居者情報や緊急連絡先の入力、更新契約書への署名など、不動産取引で発生する各種書類への対応が可能です。ファイルはサーバーに送信されないため、個人情報の漏洩リスクがありません。</p>
            </div>
          </div>
        </section>
        <section className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">🔒 セキュリティとプライバシーについて</h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>山田ツールのPDF文字入力は、<strong className="text-gray-800 dark:text-white">全ての処理をお使いのブラウザ内で完結</strong>させています。オープンソースのPDF処理ライブラリ「PDF.js」を使用してPDFを読み込み、描画・編集もすべてクライアントサイドで行われます。</p>
            <p><strong className="text-gray-800 dark:text-white">PDFファイルはサーバーに一切アップロードされません。</strong>インターネット接続が切れた状態でも、既に読み込んだPDFの編集を続けることができます。</p>
            <p>企業の機密契約書、個人のマイナンバーが含まれる書類、医療・健康に関する書類なども、安心してご利用いただけます。編集後にダウンロードしたPDFデータは、ブラウザを閉じると完全に消去されます。</p>
            <p>サイト自体はSSL/HTTPS通信で保護されており、通信経路上でのデータ傍受リスクも排除しています。</p>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🛡️", label: "ゼロアップロード", desc: "ファイル送信なし" },
              { icon: "🔐", label: "SSL暗号化", desc: "HTTPS通信" },
              { icon: "🧹", label: "自動消去", desc: "ブラウザを閉じると消える" },
              { icon: "🆓", label: "完全無料", desc: "登録・課金なし" },
            ].map((item) => (
              <div key={item.label} className="bg-white dark:bg-gray-700 rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-bold text-sm text-gray-800 dark:text-white">{item.label}</div>
                <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">関連ツール</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { href: "/pdf/compress", icon: "🗜️", name: "PDF圧縮", desc: "PDFのファイルサイズを小さく" },
              { href: "/pdf/merge", icon: "📎", name: "PDF結合", desc: "複数PDFを1つに結合" },
              { href: "/pdf/split", icon: "✂️", name: "PDF分割", desc: "PDFをページごとに分割" },
              { href: "/pdf/rotate", icon: "🔄", name: "PDF回転", desc: "PDFのページを回転" },
              { href: "/pdf/protect", icon: "🔒", name: "PDFパスワード", desc: "PDFにパスワードを設定" },
              { href: "/pdf/watermark", icon: "💧", name: "PDF透かし", desc: "PDFに透かし文字を追加" },
              { href: "/pdf/page-numbers", icon: "🔢", name: "ページ番号追加", desc: "PDFにページ番号を付ける" },
              { href: "/pdf/sign", icon: "✍️", name: "PDF署名", desc: "PDFに電子署名を追加" },
            ].map((tool) => (
              <a key={tool.href} href={tool.href} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100 dark:border-gray-700 block">
                <div className="text-3xl mb-2">{tool.icon}</div>
                <div className="font-bold text-sm text-gray-800 dark:text-white">{tool.name}</div>
                <div className="text-xs text-gray-500 mt-1">{tool.desc}</div>
              </a>
            ))}
          </div>
        </section>
        <RelatedTools currentTool={tool} maxItems={6} />
        <div className="tool-summary" style={{ fontSize: "0.85em", color: "#666", padding: "1rem", background: "#f9f9f9", borderLeft: "3px solid #e0e0e0", borderRadius: "4px" }}>
          <p><strong>ツール概要:</strong> 山田ツールのPDF文字入力（yamada-tools.jp/pdf/text-input）は、ブラウザだけでPDFに直接テキスト・電子ハンコ・日付を追加できる完全無料のWebアプリです。登録不要・ログイン不要・インストール不要。全処理はクライアントサイドで完結し、PDFファイルはサーバーに送信されません。開発元：合同会社山田トレード。</p>
        </div>
      </div>
    </>
  );
}
