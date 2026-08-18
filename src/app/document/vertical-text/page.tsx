import { Metadata } from "next";
import { LazyFAQ } from "@/components/common/LazyFAQ";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import VerticalTextClient from "./client";
import AdFreeZone from "@/components/AdFreeZone";
import RelatedTools from "@/components/common/RelatedTools";
import { AdUnit } from "@/components/common/AdUnit";

const tool = getToolById("vertical-text")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
  { question: "縦書きのPDFを作成できますか？", answer: "はい、作成した縦書き文書をPDF形式でダウンロードできます。" },
  { question: "ルビ（ふりがな）は付けられますか？", answer: "現在ルビ機能は対応しておりません。ふりがな変換ツールと併用してください。" },
  { question: "原稿用紙形式にできますか？", answer: "縦書きで原稿用紙風のレイアウトに対応しています。" },
  { question: "縦書きPDFはスマホで開けますか？", answer: "はい、スマートフォンのPDFビューアで問題なく開けます。iPhoneのSafariやAndroidのChromeでも正常に表示されます。" },
  { question: "フォントを変更できますか？", answer: "はい、明朝体・ゴシック体など複数フォントから選択できます。フォントはフォーマットツールバーのドロップダウンから変更できます。" },
];

const seoContent = {
  intro: "横書きのテキストを縦書きに変換。小説、詩、手紙、挨拶状、式辞など、縦書きが必要な文書作成に便利です。",
  useCases: [
    { title: "📚 小説執筆", desc: "縦書き形式の原稿作成" },
    { title: "✉️ 手紙・挨拶状", desc: "正式な縦書きの手紙を作成" },
    { title: "📜 詩・俳句・短歌", desc: "縦書きの詩や俳句" },
    { title: "🎌 式辞・祝辞", desc: "冠婚葬祭の縦書き文書" },
  ],
  tips: "ルビ（ふりがな）を付ける場合は、ふりがな変換ツールと併用してください。",
};

// Target keywords:
// - 縦書き変換 (76 imp, pos 6.9)
// - 縦書き 変換 (77 imp, pos 7.0)
// - 縦書き サイト (29 imp)

export const metadata: Metadata = generateToolMetadata({
  customTitle: "縦書き変換ツール【無料】横書き→縦書きに一瞬変換｜PDF出力対応",
  tool,
  longDescription: "横書きテキストを縦書きに無料変換。挨拶状・式辞・祝辞に最適。PDF出力対応、登録不要で今すぐ使えます。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
  keywords: ['縦書き変換', '縦書き 変換', '横書き 縦書き 変換', '縦書き ツール', '縦書き エディタ', '縦書き サイト', '縦書き PDF', '小説 縦書き'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <link rel="preload" as="font" crossOrigin="anonymous" href="https://fonts.gstatic.com/s/notoserifjp/v30/xn77YHs72GKoTvER4Gn3b5eMZBaPRkgfU8fEwb0.woff2" />
      <AdFreeZone><VerticalTextClient /></AdFreeZone>
      <AdUnit slot="2847591036" format="horizontal" />

      {/* Educational Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-kon mb-6">縦書きについての詳しい解説</h2>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">日本文化における縦書きの役割</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            日本語の縦書き（たてがき）は、中国から伝わった書字方向で、1,000年以上の歴史があります。現代でも小説・新聞・公文書・冠婚葬祭の文書では縦書きが標準です。特にビジネスシーンでは、式辞・祝辞・弔辞などの格式ある文書には縦書きが求められます。横書きしかできないWordやGoogleドキュメントでは対応しにくい場面で、縦書き変換ツールが力を発揮します。
          </p>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">縦書きが使われる文書の種類</h3>
          <ul className="text-gray-700 space-y-2 mb-4">
            <li className="flex items-start gap-2"><span className="text-kon font-bold">・</span><strong>式辞・祝辞・弔辞</strong>：入学式、卒業式、結婚式、葬儀で読み上げる文書。巻紙やA4縦書きで用意する</li>
            <li className="flex items-start gap-2"><span className="text-kon font-bold">・</span><strong>挨拶状・礼状</strong>：転勤、就任、退職の挨拶、お中元・お歳暮のお礼状。ビジネスマナーとして縦書きが基本</li>
            <li className="flex items-start gap-2"><span className="text-kon font-bold">・</span><strong>年賀状・暑中見舞い</strong>：季節の挨拶は縦書きが伝統的。印刷業者への入稿データにも</li>
            <li className="flex items-start gap-2"><span className="text-kon font-bold">・</span><strong>小説・詩・短歌</strong>：文学作品は縦書きで読むのが自然。同人誌や文芸誌への寄稿にも</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3">式辞・祝辞を書くときのポイント</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            式辞や祝辞を作成する際は、まず横書きで文章を完成させてから縦書きに変換するのが効率的です。文字数の目安は3分間のスピーチで約900〜1,000字、5分間で約1,500〜1,700字です。句読点の代わりに一文字分の空白を入れる伝統的な書式もあります。本ツールでは変換後にPDF出力できるため、印刷してそのまま読み上げ用の原稿としてお使いいただけます。漢字の読み方を確認したい場合は<a href="/convert/furigana" className="text-kon hover:text-ai underline">ふりがな変換ツール</a>、作成した文書に印鑑を押す場合は<a href="/generator/hanko" className="text-kon hover:text-ai underline">電子印鑑作成ツール</a>をあわせてご利用ください。
          </p>
        </div>
      </section>

      {/* Section A: 使い方 */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-kon mb-6">縦書きの使い方</h2>
          <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-0">
            {/* Step 1 */}
            <div className="flex-1 bg-gray-50 rounded-xl p-5 text-center">
              <div className="text-4xl font-bold text-gray-200 mb-2 leading-none">01</div>
              <div className="text-3xl mb-2">✏️</div>
              <h3 className="font-bold text-gray-800 mb-1">テキスト入力</h3>
              <p className="text-sm text-gray-600">タイトル・差出人・本文を入力します</p>
            </div>
            {/* Arrow */}
            <div className="hidden sm:flex items-center justify-center px-3 text-2xl text-gray-300 self-center">→</div>
            {/* Step 2 */}
            <div className="flex-1 bg-gray-50 rounded-xl p-5 text-center">
              <div className="text-4xl font-bold text-gray-200 mb-2 leading-none">02</div>
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="font-bold text-gray-800 mb-1">スタイル設定</h3>
              <p className="text-sm text-gray-600">フォント・サイズ・行間を調整します</p>
            </div>
            {/* Arrow */}
            <div className="hidden sm:flex items-center justify-center px-3 text-2xl text-gray-300 self-center">→</div>
            {/* Step 3 */}
            <div className="flex-1 bg-gray-50 rounded-xl p-5 text-center">
              <div className="text-4xl font-bold text-gray-200 mb-2 leading-none">03</div>
              <div className="text-3xl mb-2">💾</div>
              <h3 className="font-bold text-gray-800 mb-1">エクスポート</h3>
              <p className="text-sm text-gray-600">印刷・PNG・PDF形式でダウンロード</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: 使用シーン */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-kon mb-6">縦書きが使われるシーン</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl mb-1">📜</div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">式辞・祝辞</h3>
              <p className="text-xs text-gray-600">卒業式・入学式などの式典スピーチ原稿</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl mb-1">🙏</div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">弔辞・挨拶文</h3>
              <p className="text-xs text-gray-600">葬儀・法要でのお別れの言葉</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl mb-1">✉️</div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">手紙・はがき</h3>
              <p className="text-xs text-gray-600">縦書きの格式ある手紙やはがき文</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl mb-1">🌸</div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">俳句・短歌</h3>
              <p className="text-xs text-gray-600">季語を活かした俳句・和歌の縦組み</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl mb-1">📋</div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">卒業証書・賞状</h3>
              <p className="text-xs text-gray-600">縦書きフォーマットの証書・表彰状</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl mb-1">💼</div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">ビジネス文書</h3>
              <p className="text-xs text-gray-600">稟議書・社内通達など格式ある文書</p>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-kon mb-6">よくある質問</h2>
          <LazyFAQ faq={faq} />
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
