import { Metadata } from "next";
import PasswordClient from "./client";
import ToolSchema from '@/components/ToolSchema';
import { toolSchemas } from '@/data/toolSchemas';

const faq = [
  {
    question: "生成されたパスワードは安全ですか？",
    answer: "はい。暗号学的に安全な乱数生成器を使用しています。また、すべての処理はブラウザ内で行われ、サーバーにパスワードが送信されることはありません。",
  },
  {
    question: "パスワードの長さはどのくらいが良いですか？",
    answer: "一般的に12文字以上が推奨されます。重要なアカウントには16文字以上をお勧めします。",
  },
  {
    question: "記号を含めるべきですか？",
    answer: "セキュリティを高めるため、記号を含めることを推奨します。ただし、サービスによっては使用できない記号があるため、その場合は記号をオフにしてください。",
  },
  {
    question: "生成したパスワードは保存されますか？",
    answer: "いいえ。パスワードはブラウザ内でのみ生成され、どこにも保存・送信されません。ページを閉じると消えます。",
  },
];

export const metadata: Metadata = {
  title: "パスワード生成 | 山田ツール - 無料オンラインパスワード作成",
  description: "安全なランダムパスワードを無料で生成。長さ・文字種をカスタマイズ可能。ブラウザ内処理で安全。登録不要。",
  keywords: ["パスワード生成", "パスワード作成", "ランダムパスワード", "無料", "安全", "オンライン"],
  openGraph: {
    title: "パスワード生成 | 山田ツール",
    description: "安全なランダムパスワードを無料で生成。完全無料。",
    url: "https://yamada-tools.jp/generator/password",
  },
};

const schema = toolSchemas['password-generator'];

export default function PasswordPage() {
  return (
    <>
      <ToolSchema {...schema} />
      <PasswordClient faq={faq} />
    </>
  );
}
