import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '無料オンラインツール一覧【130+】PDF・画像・計算・ビジネス | 山田ツール',
  description: '130以上の無料オンラインツールを完全網羅。PDF編集、画像処理、文書作成、計算機、コンバーターなど、登録不要・ブラウザ完結でご利用いただけます。',
  keywords: ['無料ツール', 'オンラインツール', 'ツール一覧', 'PDF ツール', '画像 ツール', '計算機'],
  alternates: { canonical: 'https://yamada-tools.jp/tools' },
  openGraph: {
    title: '無料オンラインツール一覧【130+】PDF・画像・計算・ビジネス | 山田ツール',
    description: '130以上の無料オンラインツールを完全網羅。登録不要・ブラウザ完結。',
    url: 'https://yamada-tools.jp/tools',
    siteName: '山田ツール',
    locale: 'ja_JP',
    type: 'website',
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
