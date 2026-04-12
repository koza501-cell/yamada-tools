import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import CompressClient from "./client";
import { toolSchemas } from "@/data/toolSchemas";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("compress")!;

const faq = [
  {
    question: "PDFが大きすぎてメールで送れません。どうすれば？",
    answer: "よくあるお悩みです。多くのメールサービスは添付ファイルを10〜25MBに制限しています。本ツールで圧縮すれば、ほとんどの場合メール添付可能なサイズまで小さくできます。特に画像を含むPDFは効果が高く、半分以下になることも珍しくありません。",
  },
  {
    question: "圧縮すると文字がぼやけたりしませんか？",
    answer: "テキスト部分は圧縮の影響を受けません。影響があるのは画像部分のみです。「高品質」モードを選べば、見た目の違いはほぼわからないレベルで圧縮できます。契約書や請求書など、文字が中心の書類は安心してお使いください。",
  },
  {
    question: "会社の機密資料でも使って大丈夫？",
    answer: "はい、安心してご利用ください。ファイルは日本国内のサーバーのみで処理され、海外に送信されることは一切ありません。処理後60分で自動削除され、当社でもファイルの内容を確認することはできません。多くの企業様にご利用いただいています。",
  },
  {
    question: "スキャンしたPDF（画像PDF）も圧縮できますか？",
    answer: "はい、スキャンで作成したPDFこそ圧縮効果が高いです。スキャン画像は解像度が高く、1ページで数MBになることも。本ツールで圧縮すれば、画質を保ちながら大幅にサイズを削減できます。",
  },
  {
    question: "何MBまでのファイルに対応していますか？",
    answer: "最大50MBまでのPDFファイルに対応しています。それ以上のファイルは、まず分割してから個別に圧縮することをおすすめします。",
  },
  {
    question: "圧縮したPDFをさらに圧縮できますか？",
    answer: "技術的には可能ですが、すでに圧縮済みのファイルは追加の効果が限定的です。画質だけが劣化する可能性もあるため、おすすめしません。圧縮は1回で十分です。",
  },
  {
    question: "スマホからでも使えますか？",
    answer: "iPhone・Android、どちらのスマホからもご利用いただけます。アプリのインストールは不要で、ブラウザからそのままお使いいただけます。外出先で急いでいる時にも便利です。",
  },
  {
    question: "パスワード付きPDFは圧縮できますか？",
    answer: "パスワードで保護されたPDFは、そのままでは圧縮できません。先に「PDFロック解除」ツールでパスワードを解除してから、圧縮をお試しください。",
  },
  {
    question: "無料で何回でも使えますか？",
    answer: "はい、完全無料で回数制限もありません。会員登録やメールアドレスの入力も不要です。必要な時にいつでもお使いください。",
  },
  {
    question: "圧縮にどのくらい時間がかかりますか？",
    answer: "ファイルサイズによりますが、通常は数秒〜30秒程度です。10MB程度のPDFなら10秒以内で完了することがほとんどです。",
  },
];

const seoContent = {
  intro: "「PDFが重すぎてメールで送れない」「クラウドの容量を圧迫している」——そんな経験はありませんか？山田ツールのPDF圧縮は、画質を保ちながらファイルサイズを最大70%カット。日本国内サーバーで処理されるから、ビジネス文書も安心です。",
  useCases: [
    { title: "📧 メール添付", desc: "添付制限を超えるPDFを送信可能なサイズに" },
    { title: "💾 ストレージ節約", desc: "Google DriveやOneDriveの容量を有効活用" },
    { title: "🌐 Web掲載", desc: "ホームページの読み込み速度を改善" },
    { title: "📤 社内システム", desc: "アップロード制限のある社内システム対応" },
  ],
  tips: "カタログやパンフレットなど、画像が多いPDFほど圧縮効果が高くなります。テキスト中心の書類は元々軽いため、効果は控えめです。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】PDF圧縮｜25MB→3MBに一瞬で縮小｜メール添付OK",
  tool,
  longDescription:
    "PDFファイルを無料で圧縮。メールで送れない大きなPDFも最大70%サイズダウン。日本国内サーバーで安全処理、登録不要。",
  keywords: [
    "PDF圧縮",
    "PDF サイズ縮小",
    "PDF 軽くする",
    "PDF 小さくする",
    "PDF メール 送れない",
    "PDF ファイルサイズ 削減",
    "無料 PDF圧縮",
    "オンライン PDF圧縮",
    "PDF 圧縮 安全",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function CompressPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CompressClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
