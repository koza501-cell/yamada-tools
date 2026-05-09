import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import PasswordClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("password-generator")!;

const faq = [
  {
    question: "生成されたパスワードは安全ですか？",
    answer: "はい、暗号学的に安全な乱数生成を使用しています。パターンや推測可能な要素を含まない、真にランダムなパスワードが生成されます。",
  },
  {
    question: "パスワードはどこかに保存されますか？",
    answer: "いいえ、サーバーには一切保存されません。パスワードはお使いのブラウザ内で生成され、外部に送信されることはありません。",
  },
  {
    question: "何文字のパスワードが安全ですか？",
    answer: "最低でも12文字以上を推奨します。重要なアカウント（銀行、メールなど）には16文字以上がより安全です。本ツールでは最大128文字まで生成可能です。",
  },
  {
    question: "記号を含めるべきですか？",
    answer: "可能であれば含めることをおすすめします。大文字、小文字、数字、記号を組み合わせることで、パスワードの強度が大幅に向上します。",
  },
  {
    question: "覚えやすいパスワードは作れますか？",
    answer: "セキュリティ上、ランダムなパスワードを推奨しますが、パスワードマネージャーを使えば覚える必要がありません。本ツールで生成したパスワードを安全に管理しましょう。",
  },
  {
    question: "同じパスワードを複数のサイトで使っても大丈夫？",
    answer: "絶対に避けてください。1つのサイトで情報漏洩が起きると、他のすべてのアカウントが危険にさらされます。サイトごとに異なるパスワードを使いましょう。",
  },
  {
    question: "パスワードはどのくらいの頻度で変更すべき？",
    answer: "以前は定期的な変更が推奨されていましたが、現在は「十分に強力なパスワードを使い、漏洩が疑われた時に変更する」が推奨されています。",
  },
  {
    question: "スマホからでも使えますか？",
    answer: "はい、iPhone・Androidどちらからもブラウザで直接ご利用いただけます。生成したパスワードはコピーボタンで簡単にコピーできます。",
  },
];

const seoContent = {
  intro: "「123456」「password」「生年月日」——こんなパスワードを使っていませんか？パスワード生成ツールなら、ハッカーに推測されない強力なパスワードをワンクリックで作成。大文字、小文字、数字、記号を組み合わせた、真にランダムなパスワードが生成されます。",
  useCases: [
    { title: "🔐 新規アカウント", desc: "新しいサービス登録時に強力なパスワードを" },
    { title: "🔄 パスワード変更", desc: "定期的なパスワード更新に" },
    { title: "💼 業務用アカウント", desc: "会社のシステム用に安全なパスワードを" },
    { title: "🏦 金融サービス", desc: "銀行やクレジットカード用に最強のパスワードを" },
  ],
  tips: "生成したパスワードは、パスワードマネージャー（1Password、Bitwardenなど）で管理することを強くおすすめします。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】パスワード生成｜安全な強力パスワード作成",
  tool,
  longDescription: "強力なパスワードを無料生成。文字数、記号の有無を選択可能。安全なランダムパスワードを作成。中小企業・個人事業主・フリーランスのビジネス文書作成に最適。日本国内サーバーで安全処理、SSL暗号化対応、登録不要・完全無料・60分自動削除。",
  keywords: ["パスワード生成", "パスワード 作成", "ランダムパスワード", "強力なパスワード", "パスワード ジェネレーター", "安全 パスワード"],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function PasswordPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PasswordClient faq={faq} seoContent={seoContent} />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
