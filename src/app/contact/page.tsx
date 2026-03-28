import Link from 'next/link';
import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: '山田ツールへのお問い合わせ。ご質問・ご要望・不具合のご報告はこちらからお願いいたします。',
  alternates: {
    canonical: 'https://yamada-tools.jp/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm" aria-label="パンくずリスト">
          <ol className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li className="text-kon dark:text-blue-400 font-medium">お問い合わせ</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-kon to-kon/90 text-white rounded-2xl p-10 mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">📩 お問い合わせ</h1>
          <p className="text-xl text-gray-200">ご質問・ご要望をお聞かせください</p>
        </div>

        {/* Contact Form */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-kon dark:text-blue-400 mb-6 flex items-center gap-2">
            <span>✉️</span>
            <span>お問い合わせフォーム</span>
          </h2>
          <ContactForm />
        </section>

        {/* Other Contact Methods */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-kon dark:text-blue-400 mb-6 flex items-center gap-2">
            <span>📬</span>
            <span>その他のお問い合わせ方法</span>
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="font-medium">メールでのお問い合わせ</p>
                <a href="mailto:support@yamada-tools.jp" className="text-sakura hover:underline">
                  support@yamada-tools.jp
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏰</span>
              <div>
                <p className="font-medium">返信目安</p>
                <p className="text-gray-500 dark:text-gray-400">通常1〜2営業日以内にご返信いたします</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-medium">新しいツールのリクエスト</p>
                <p className="text-gray-500 dark:text-gray-400">
                  新しいツールのリクエストは
                  <a href="https://forms.gle/2mmoGqLif1Cqe5vL6" target="_blank" rel="noopener noreferrer" className="text-sakura hover:underline ml-1">
                    💡 ツールをリクエスト
                  </a>
                  からもお送りいただけます
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Info */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-kon dark:text-blue-400 mb-6 flex items-center gap-2">
            <span>🏢</span>
            <span>運営会社</span>
          </h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-2">
            <p className="font-medium text-lg">合同会社山田トレード</p>
            <p>〒283-0811 千葉県東金市台方937番地13</p>
            <p className="mt-4">
              <Link href="/about/company" className="text-sakura hover:underline">
                会社概要を見る →
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
