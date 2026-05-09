import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "リファレンス情報【無料】銀行コード一覧・日本の祝日カレンダー",
  description: "全国の銀行コード・支店コード一覧、日本の祝日カレンダー（年間・月別・カスタムAPI対応）を無料で確認。経理担当者・システム開発者・スケジュール管理に。データは公式情報源から取得し常に最新。登録不要・完全無料。",
  keywords: ["銀行コード 一覧", "支店コード", "日本 祝日", "祝日 カレンダー", "祝日 API"],
  alternates: { canonical: "https://yamada-tools.jp/reference" },
  openGraph: {
    title: "リファレンス情報【無料】銀行コード一覧・日本の祝日カレンダー",
    description: "全国の銀行コード・支店コード一覧、日本の祝日カレンダー（年間・月別・カスタムAPI対応）を無料で確認。経理担当者・システム開発者・スケジュール管理に。データは公式情報源から取得し常に最新。登録不要・完全無料。",
    url: "https://yamada-tools.jp/reference",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
    { "@type": "ListItem", position: 2, name: "リファレンス情報", item: "https://yamada-tools.jp/reference" },
  ],
};

const referenceTools = [
  { name: "銀行コード一覧", url: "/reference/bank-codes", description: "全国の金融機関コード・支店コードを検索。振込・口座登録時の確認に", icon: "🏦" },
  { name: "日本の祝日カレンダー", url: "/reference/holidays", description: "年間の祝日一覧を表示。カスタム祝日API対応で営業日計算にも活用可能", icon: "📆" },
];

export default function ReferencePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd]) }} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <section className="bg-gradient-to-br from-kon to-ai text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">リファレンス情報</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              銀行コード・祝日カレンダーなど業務で必要な公式データ集。<br className="hidden md:block" />
              登録不要、完全無料。
            </p>
          </div>
        </section>
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">無料で使えるリファレンス情報一覧</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              経理・人事・システム開発・スケジュール管理に。公式情報源から取得した常に最新のデータ。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {referenceTools.map((tool) => (
                <Link
                  key={tool.url}
                  href={tool.url}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-ai transition-colors mb-2">{tool.name}</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
                        <div className="mt-4">
                          <span className="text-sm text-ai font-medium group-hover:translate-x-1 transition-transform inline-block">ツールを使う →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
