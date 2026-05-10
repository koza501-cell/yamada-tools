import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "数字で見るyamada-tools.jp｜利用状況・データ出典・運営会社情報",
  description:
    "yamada-tools.jpの利用状況・データ出典・運営会社情報を公開しています。月間4,600名以上の利用者、200種類以上のツール、すべて公的データに基づく信頼性の高いサービスです。",
  alternates: { canonical: "https://yamada-tools.jp/about/numbers" },
  openGraph: {
    title: "数字で見るyamada-tools.jp",
    description:
      "月間4,600名以上の利用者・200種類以上のツール・有料広告なしで運営。データはすべて公的機関の情報を活用しています。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "合同会社山田トレード",
  alternateName: "Yamada Trade LLC",
  url: "https://yamada-tools.jp",
  address: {
    "@type": "PostalAddress",
    postalCode: "283-0811",
    addressRegion: "千葉県",
    addressLocality: "東金市",
    streetAddress: "台方937番地13",
    addressCountry: "JP",
  },
  identifier: {
    "@type": "PropertyValue",
    propertyID: "法人番号",
    value: "5040003024822",
  },
  foundingDate: "2024",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "info@yamadatrade.jp",
      availableLanguage: ["Japanese"],
    },
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@yamadatrade.jp",
      availableLanguage: ["Japanese"],
    },
  ],
};

export default function NumbersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-kon py-12 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-sm text-white/70 mb-2">
            ホーム / 運営情報 / 数字で見るyamada-tools.jp
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            数字で見るyamada-tools.jp
          </h1>
          <p className="text-white/80 text-base">
            yamada-tools.jpの利用状況、データの出典、運営体制について公開しています。
            すべて事実に基づく数字です。
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-12">
        {/* 利用状況 */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            利用状況
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="text-sm text-gin mb-2">月間アクティブユーザー</div>
              <div className="text-3xl font-bold text-kon">4,600+</div>
              <div className="text-xs text-gin mt-2">2026年5月時点</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="text-sm text-gin mb-2">提供ツール数</div>
              <div className="text-3xl font-bold text-kon">200+</div>
              <div className="text-xs text-gin mt-2">継続的に追加中</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="text-sm text-gin mb-2">主要利用地域</div>
              <div className="text-3xl font-bold text-kon">日本国内</div>
              <div className="text-xs text-gin mt-2">国内ユーザー中心</div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-sumi leading-relaxed">
              <strong className="text-kon">広告ゼロ・自然検索のみで運営</strong>
              しています。2026年1月から5月までの累計で、
              <strong>13,000名以上のユーザー</strong>に
              <strong>30,000回以上</strong>ご利用いただきました。
              すべて自然検索および口コミによるアクセスです。
            </p>
          </div>
        </section>

        {/* データ出典 */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            データ出典
          </h2>
          <p className="text-sm text-gin mb-6">
            yamada-tools.jpのツールは、すべて公的機関が公開しているデータを使用しています。
          </p>

          <ul className="space-y-3">
            {[
              { name: "経済産業省 gBizINFO", desc: "法人検索・財務情報・入札情報・認定情報" },
              { name: "国税庁 法人番号公表サイト", desc: "法人番号の照会・確認" },
              { name: "経済産業省 Jグランツ", desc: "補助金・助成金情報" },
              { name: "国土交通省 不動産情報ライブラリ", desc: "用途地域・ハザードマップ・地価・取引価格・学区・人口推計" },
              { name: "国土地理院", desc: "住所・地理情報・ジオコーディング" },
            ].map((src) => (
              <li
                key={src.name}
                className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="mt-1 w-2 h-2 rounded-full bg-kon flex-shrink-0" />
                <div>
                  <div className="font-semibold text-kon">{src.name}</div>
                  <div className="text-sm text-sumi mt-1">{src.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* セキュリティ・プライバシー */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            セキュリティ・プライバシーへの取り組み
          </h2>
          <ul className="space-y-2 text-sumi">
            <li className="flex items-start gap-2">
              <span className="text-kon font-bold mt-0.5">・</span>
              <span>
                入力されたデータは
                <strong className="text-kon">60分後に自動削除</strong>
                されます
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-kon font-bold mt-0.5">・</span>
              <span>個人を特定する情報は保存していません</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-kon font-bold mt-0.5">・</span>
              <span>登録不要・ログイン不要でご利用いただけます</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-kon font-bold mt-0.5">・</span>
              <span>すべてのページはHTTPSで暗号化通信されています</span>
            </li>
          </ul>
        </section>

        {/* 運営会社情報 */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            運営会社情報
          </h2>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-200">
                {[
                  ["会社名", "合同会社山田トレード（Yamada Trade LLC）"],
                  ["設立", "2024年"],
                  ["出資金", "500万円"],
                  ["所在地", "〒283-0811 千葉県東金市台方937番地13"],
                  [
                    "法人番号",
                    <Link
                      key="hb"
                      href="/business/houjin-bangou-lookup?bangou=5040003024822"
                      className="text-kon hover:text-ai underline underline-offset-2"
                    >
                      5040003024822
                    </Link>,
                  ],
                  ["事業内容", "オンラインツールサービスの開発・運営"],
                  ["代表者", "山田フェサル"],
                ].map(([label, value]) => (
                  <tr key={String(label)}>
                    <th className="text-left bg-gray-50 px-4 py-3 w-32 text-gin font-semibold align-top">
                      {label}
                    </th>
                    <td className="px-4 py-3 text-sumi">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gin mt-3">
            法人番号をクリックすると、当サイトの法人番号検索ツールで運営会社の登録情報をご確認いただけます。
          </p>
        </section>

        {/* お問い合わせ */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            お問い合わせ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-sm text-gin mb-1">法人のお客様</div>
              <a
                href="mailto:info@yamadatrade.jp"
                className="text-kon hover:text-ai font-semibold underline underline-offset-2"
              >
                info@yamadatrade.jp
              </a>
              <p className="text-xs text-gin mt-3">
                導入のご相談・パートナーシップなど
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-sm text-gin mb-1">サポート</div>
              <a
                href="mailto:support@yamadatrade.jp"
                className="text-kon hover:text-ai font-semibold underline underline-offset-2"
              >
                support@yamadatrade.jp
              </a>
              <p className="text-xs text-gin mt-3">ツールの不具合・ご質問など</p>
            </div>
          </div>

          <p className="text-xs text-gin mt-4">
            営業時間: 平日10:00〜17:00（土日祝休）
            ／ ご返信に2〜3営業日いただく場合があります
          </p>
        </section>

        {/* お客様の声 - 募集中 */}
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            お客様の声を募集しています
          </h2>
          <p className="text-sm text-sumi leading-relaxed">
            yamada-tools.jpを実際にご利用いただいている方の感想を募集中です。
            ご利用いただいた感想を
            <a
              href="mailto:support@yamadatrade.jp"
              className="text-kon hover:text-ai underline underline-offset-2 mx-1"
            >
              support@yamadatrade.jp
            </a>
            までお寄せいただけますと幸いです。
          </p>
        </section>

        {/* 数字の更新について */}
        <section className="text-xs text-gin border-t border-gray-200 pt-6">
          <p>
            ※ 利用者数は Google Analytics 4 の実数です。四半期ごとに更新しています。
            最終更新: 2026年5月
          </p>
        </section>
      </main>
    </>
  );
}
