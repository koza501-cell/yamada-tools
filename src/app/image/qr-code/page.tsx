import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import QRCodeClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("qr-code")!;

const faq = [
  {
    question: "作成したQRコードは商用利用できますか？",
    answer: "はい、無料で商用利用可能です。チラシ、名刺、ポスター、商品パッケージなど、どこでも自由にお使いいただけます。",
  },
  {
    question: "QRコードの有効期限はありますか？",
    answer: "ありません。一度作成したQRコードは永久に使用できます。ただし、リンク先のURLが変わると読み取れなくなるのでご注意ください。",
  },
  {
    question: "どんな情報をQRコードにできますか？",
    answer: "URL、テキスト、メールアドレス、電話番号、WiFi接続情報など、様々な情報をQRコード化できます。最も一般的なのはWebサイトのURLです。",
  },
  {
    question: "印刷に適したサイズはどれくらい？",
    answer: "名刺なら2cm×2cm以上、ポスターなら5cm×5cm以上を推奨します。小さすぎると読み取りにくくなります。本ツールでは高解像度でダウンロードできるので、拡大印刷しても鮮明です。",
  },
  {
    question: "QRコードの色は変えられますか？",
    answer: "はい、前景色と背景色を自由にカスタマイズできます。ただし、読み取り精度を保つため、コントラストの高い配色をおすすめします。",
  },
  {
    question: "スマホからでも作成できますか？",
    answer: "はい、iPhone・Androidどちらからもブラウザで直接作成できます。アプリのインストールは不要です。",
  },
  {
    question: "作成したQRコードはどこに保存されますか？",
    answer: "サーバーには保存されません。作成後すぐにダウンロードして、ご自身のデバイスに保存してください。",
  },
  {
    question: "日本語のテキストもQRコードにできますか？",
    answer: "はい、日本語を含むテキストもQRコード化できます。ただし、長い文章は読み取りに時間がかかるため、URLやシンプルな情報がおすすめです。",
  },
];

const seoContent = {
  intro: "WebサイトのURL、連絡先、WiFi情報——様々な情報を瞬時にQRコード化。名刺やチラシ、店頭POP、商品パッケージまで、ビジネスシーンで幅広く活用されています。高解像度で出力できるので、大きく印刷しても鮮明です。",
  useCases: [
    { title: "🏢 名刺・チラシ", desc: "会社サイトやSNSへ簡単アクセス" },
    { title: "🏪 店舗・飲食店", desc: "メニューや予約ページへの誘導" },
    { title: "📦 商品パッケージ", desc: "取扱説明書やサポートページへ" },
    { title: "📋 イベント", desc: "申込フォームやアンケートへの誘導" },
  ],
  tips: "名刺に載せるなら、URLは短縮サービスで短くしてからQRコード化すると、より小さく鮮明に印刷できます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】QRコード作成｜URL・テキストをQR化",
  tool,
  longDescription: "QRコードを無料作成。URL、テキスト、連絡先をQRコード化。高解像度で名刺・チラシ印刷にも対応。商用利用OK。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。",
  keywords: ["QRコード 作成", "QRコード 無料", "QRコード ジェネレーター", "QRコード 印刷", "URL QRコード", "名刺 QRコード"],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function QRCodePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <QRCodeClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
