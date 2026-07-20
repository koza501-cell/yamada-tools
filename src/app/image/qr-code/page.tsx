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
    answer: "URL、テキスト（日本語も対応）、メールアドレス、電話番号、WiFi接続情報など、様々な情報をQRコード化できます。最も一般的なのはWebサイトのURLです。日本語テキストは文字数が増えると読み取りに時間がかかるため、短めが理想的です。",
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
    question: "ロゴ入りQRコードを作る場合の注意点は？",
    answer: "ロゴを中央に配置するとQRの一部が隠れます。誤り訂正レベルをH（最高）に設定し、ロゴサイズはQR面積の15〜20%以内に収めてください。位置検出パターン（3隅の四角）は絶対に隠さないことが重要です。",
  },
  {
    question: "印刷したQRコードが読み取れない場合の原因は？",
    answer: "サイズが小さすぎる（最低2cm）、色のコントラスト不足（黒×白推奨）、印刷品質（300DPI以上推奨）、QRの一部が隠れている、リンク先のURLが無効 — の5つが主な原因です。この順番で確認してください。",
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
  customTitle: "【無料】QRコードを作成する — URL・vCard・WiFi対応・商用利用OK",
  tool,
  longDescription: "QRコードを無料作成。URL、テキスト、連絡先をQRコード化。高解像度で名刺・チラシ印刷にも対応。商用利用OK。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。freee・マネーフォワード等の会計ソフトとも連携可能。",
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
