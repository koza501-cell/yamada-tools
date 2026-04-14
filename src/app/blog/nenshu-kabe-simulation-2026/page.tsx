import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import Link from "next/link";

const title = "【2026年最新】年収の壁とは？103万・106万・130万・150万の壁を完全解説";
const description = "パート・アルバイトの年収の壁を徹底解説。103万円の壁で所得税、106万円・130万円の壁で社会保険、150万円の壁で配偶者特別控除に影響。損しない働き方を紹介。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("年収の壁 103万・130万・150万")}&type=blog&category=${encodeURIComponent("税金・社会保険")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["年収の壁", "103万", "106万", "130万", "150万", "扶養", "社会保険"],
  openGraph: { title, description, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function NenshuKabeSimulation2026Blog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】年収の壁とは？103万・106万・130万・150万の壁を完全解説",
            "description": "パート・アルバイトの年収の壁を徹底解説。103万円の壁で所得税、106万円・130万円の壁で社会保険、150万円の壁で配偶者特別控除に影響。損しない働き方を紹介。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Organization", "name": "山田ツール編集部"},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/nenshu-kabe-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"年収の壁は月収で考える？年収で考える？","acceptedAnswer":{"@type":"Answer","text":"基本は年収ベースです。ただし130万円の壁は「今後1年間の見込み収入」で判断されるため、月収が約10.8万円を継続的に超えると扶養から外れる可能性があります。"}},{"@type":"Question","name":"交通費は年収に含まれる？","acceptedAnswer":{"@type":"Answer","text":"所得税は非課税、社会保険は含まれることが多いです。130万円の壁を意識する場合は、交通費込みで計算しましょう。"}},{"@type":"Question","name":"社会保険に入るメリットは？","acceptedAnswer":{"@type":"Answer","text":"将来の年金が増える、傷病手当金・出産手当金がもらえるなどのメリットがあります。長期的に見れば損ではない場合も多いです。"}},{"@type":"Question","name":"ダブルワークの場合は？","acceptedAnswer":{"@type":"Answer","text":"全ての収入を合算して判断します。複数の勤務先の給与を合計して年収の壁を確認してください。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-500">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-pink-500">ブログ</Link>
        <span className="mx-2">/</span>
        <span>年収の壁シミュレーション2026</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src="/api/og?title=年収の壁 103万・130万・150万&type=blog&category=税金・社会保険" alt="年収の壁シミュレーション" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">【2026年最新】年収の壁とは？103万・106万・130万・150万の壁を完全解説</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-rose-50 border-l-4 border-rose-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 年収の壁の種類と影響</li>
          <li>✓ 103万・106万・130万・150万円の違い</li>
          <li>✓ 壁を超えると手取りはどうなる？</li>
          <li>✓ 2024年〜2026年の制度変更</li>
          <li>✓ 損しない働き方のポイント</li>
        </ul>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">年収の壁とは？</h2>
        <p className="text-gray-700 mb-4">
          「年収の壁」とは、パートやアルバイトの年収が一定額を超えると、<strong className="text-rose-600">税金や社会保険料の負担が増えたり、扶養から外れる</strong>ことで手取りが減ってしまう収入のボーダーラインのことです。
        </p>
        
        <div className="bg-white border-2 border-rose-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-rose-800 text-xl mb-4">4つの年収の壁</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <span className="font-bold text-yellow-700 text-xl">103万円</span>
              <span className="text-gray-700">所得税がかかり始める・配偶者の扶養控除に影響</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <span className="font-bold text-orange-700 text-xl">106万円</span>
              <span className="text-gray-700">社会保険加入（大企業の場合）</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <span className="font-bold text-red-700 text-xl">130万円</span>
              <span className="text-gray-700">社会保険の扶養から外れる（全員対象）</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <span className="font-bold text-purple-700 text-xl">150万円</span>
              <span className="text-gray-700">配偶者特別控除が減り始める</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【年収別】手取りシミュレーション</h2>
        <p className="text-gray-700 mb-4">配偶者の扶養に入っているパート主婦（夫）の場合の手取り額の目安です。</p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-rose-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">年収</th>
              <th className="px-4 py-3 text-left border-b font-semibold">所得税</th>
              <th className="px-4 py-3 text-left border-b font-semibold">住民税</th>
              <th className="px-4 py-3 text-left border-b font-semibold">社会保険料</th>
              <th className="px-4 py-3 text-left border-b font-semibold">手取り目安</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-green-50"><td className="px-4 py-3 border-b font-bold">100万円</td><td className="px-4 py-3 border-b text-green-600">0円</td><td className="px-4 py-3 border-b text-green-600">0円</td><td className="px-4 py-3 border-b text-green-600">0円</td><td className="px-4 py-3 border-b font-bold text-green-600">約100万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">103万円</td><td className="px-4 py-3 border-b text-green-600">0円</td><td className="px-4 py-3 border-b">約5千円</td><td className="px-4 py-3 border-b text-green-600">0円</td><td className="px-4 py-3 border-b font-bold">約102.5万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">110万円</td><td className="px-4 py-3 border-b">約3千円</td><td className="px-4 py-3 border-b">約1万円</td><td className="px-4 py-3 border-b text-green-600">0円</td><td className="px-4 py-3 border-b font-bold">約108.7万円</td></tr>
            <tr className="bg-yellow-50"><td className="px-4 py-3 border-b font-bold">130万円</td><td className="px-4 py-3 border-b">約1.4万円</td><td className="px-4 py-3 border-b">約2万円</td><td className="px-4 py-3 border-b text-green-600">0円</td><td className="px-4 py-3 border-b font-bold">約126.6万円</td></tr>
            <tr className="bg-red-50"><td className="px-4 py-3 border-b font-bold">131万円</td><td className="px-4 py-3 border-b">約1.4万円</td><td className="px-4 py-3 border-b">約2万円</td><td className="px-4 py-3 border-b text-red-600 font-bold">約20万円</td><td className="px-4 py-3 border-b font-bold text-red-600">約107.6万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">150万円</td><td className="px-4 py-3 border-b">約2.4万円</td><td className="px-4 py-3 border-b">約3万円</td><td className="px-4 py-3 border-b">約22万円</td><td className="px-4 py-3 border-b font-bold">約122.6万円</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">180万円</td><td className="px-4 py-3 border-b">約3.9万円</td><td className="px-4 py-3 border-b">約5万円</td><td className="px-4 py-3 border-b">約27万円</td><td className="px-4 py-3 border-b font-bold">約144.1万円</td></tr>
            <tr className="bg-green-50"><td className="px-4 py-3 border-b font-bold">200万円</td><td className="px-4 py-3 border-b">約5万円</td><td className="px-4 py-3 border-b">約6万円</td><td className="px-4 py-3 border-b">約30万円</td><td className="px-4 py-3 border-b font-bold text-green-600">約159万円</td></tr>
          </tbody>
        </table>

        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">⚠️ 130万円の壁が最も影響大！</p>
          <p className="text-gray-700">
            130万円を1万円超えただけで社会保険料が約20万円かかり、<strong>手取りが約19万円も減る</strong>ことに。
            働き損を防ぐには、<strong>129万円で止めるか、160万円以上を目指す</strong>のがポイント。
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-blue-800 mb-2">🔧 あなたの手取りを計算！</p>
          <p className="text-gray-700 mb-4">年収を入力して、税金・社会保険料・手取り額をシミュレーションしましょう。</p>
          <Link href="/career/income-wall-checker" className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg transition">
            → 年収の壁シミュレーターを使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">各年収の壁を詳しく解説</h2>
        
        <div className="space-y-6">
          <div className="bg-white border border-yellow-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-yellow-800 text-lg mb-3 flex items-center gap-2">
              <span className="bg-yellow-500 text-white rounded px-2 py-1 text-sm">103万円</span>
              所得税の壁
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>・年収103万円を超えると<strong>所得税</strong>がかかり始める</li>
              <li>・ただし、税額は少額（年収110万円でも約3,000円程度）</li>
              <li>・配偶者控除には影響なし（150万円まで満額適用）</li>
              <li>・2024年以降、103万円→123万円に引き上げ検討中</li>
            </ul>
          </div>

          <div className="bg-white border border-orange-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-orange-800 text-lg mb-3 flex items-center gap-2">
              <span className="bg-orange-500 text-white rounded px-2 py-1 text-sm">106万円</span>
              社会保険の壁（大企業）
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>・従業員51人以上の企業で、週20時間以上働く場合</li>
              <li>・<strong>厚生年金・健康保険に加入</strong>が必要</li>
              <li>・社会保険料は年収の約15%（年収106万円なら約16万円）</li>
              <li>・将来の年金が増えるメリットもあり</li>
            </ul>
          </div>

          <div className="bg-white border border-red-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-red-800 text-lg mb-3 flex items-center gap-2">
              <span className="bg-red-500 text-white rounded px-2 py-1 text-sm">130万円</span>
              社会保険の扶養の壁
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>・<strong>全員に適用</strong>される最も重要な壁</li>
              <li>・配偶者の社会保険の扶養から外れる</li>
              <li>・自分で国民健康保険・国民年金に加入が必要</li>
              <li>・保険料負担が約20万円発生 → 手取りが大幅減少</li>
            </ul>
          </div>

          <div className="bg-white border border-purple-200 rounded-lg p-5 shadow-sm">
            <h3 className="font-bold text-purple-800 text-lg mb-3 flex items-center gap-2">
              <span className="bg-purple-500 text-white rounded px-2 py-1 text-sm">150万円</span>
              配偶者特別控除の壁
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>・150万円を超えると配偶者特別控除が段階的に減少</li>
              <li>・201万円で配偶者特別控除がゼロに</li>
              <li>・配偶者の税負担が増える（世帯全体での影響）</li>
              <li>・本人の社会保険料も既にかかっている状態</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">損しない働き方のポイント</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="font-bold text-green-800 mb-3">✅ おすすめの年収ライン</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>〜100万円</strong>：税金・保険料ゼロ</li>
              <li><strong>〜129万円</strong>：社会保険の扶養内で最大化</li>
              <li><strong>160万円以上</strong>：社会保険料を払っても手取り増</li>
              <li><strong>200万円以上</strong>：しっかり稼ぐなら目指したい</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <h3 className="font-bold text-red-800 mb-3">❌ 避けたい年収ライン</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>131〜155万円</strong>：社会保険料で手取り減</li>
              <li><strong>ギリギリ130万円</strong>：超えるリスクあり</li>
              <li><strong>中途半端な160万円</strong>：200万円目指す方が得</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 2024年〜2025年の「年収の壁対策」</p>
          <p className="text-gray-700">
            政府の「年収の壁・支援強化パッケージ」により、一時的に130万円を超えても
            <strong>2年間は扶養に残れる措置</strong>が実施中（2025年末まで）。
            また、企業向けに社会保険料の補助制度もあります。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 年収の壁は月収で考える？年収で考える？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>基本は年収ベース</strong>です。ただし130万円の壁は「今後1年間の見込み収入」で判断されるため、月収が約10.8万円を継続的に超えると扶養から外れる可能性があります。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 交通費は年収に含まれる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>所得税は非課税、社会保険は含まれる</strong>ことが多いです。130万円の壁を意識する場合は、交通費込みで計算しましょう。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 社会保険に入るメリットは？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>将来の年金が増える、傷病手当金・出産手当金がもらえる</strong>などのメリットがあります。長期的に見れば損ではない場合も多いです。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. ダブルワークの場合は？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>全ての収入を合算</strong>して判断します。複数の勤務先の給与を合計して年収の壁を確認してください。</p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：自分に合った働き方を選ぼう</h2>
        <p className="text-gray-700 mb-4">
          年収の壁は複雑ですが、<strong>130万円を意識するかどうか</strong>が最も重要なポイントです。
          扶養内で効率よく稼ぐなら129万円以下、しっかり稼ぐなら160万円以上を目指しましょう。
        </p>
        <p className="text-gray-700 mb-6">
          シミュレーターで自分の場合の手取りを計算し、最適な働き方を見つけてください。
        </p>
        
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">あなたの年収の壁をチェック</p>
          <Link href="/career/income-wall-checker" className="inline-block bg-white text-rose-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 年収の壁シミュレーターを使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">関連ツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/career/income-wall-checker" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-rose-300 transition">
            <span className="font-bold text-gray-800">年収の壁チェッカー</span>
            <p className="text-sm text-gray-600">手取り額と壁の影響を計算</p>
          </Link>
          <Link href="/career/social-insurance-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-rose-300 transition">
            <span className="font-bold text-gray-800">社会保険料計算機</span>
            <p className="text-sm text-gray-600">保険料の詳細を計算</p>
          </Link>
          <Link href="/tax/income-tax-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-rose-300 transition">
            <span className="font-bold text-gray-800">所得税計算機</span>
            <p className="text-sm text-gray-600">年収から所得税を計算</p>
          </Link>
          <Link href="/career/side-income-tax-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-rose-300 transition">
            <span className="font-bold text-gray-800">副業税金計算機</span>
            <p className="text-sm text-gray-600">副業収入の税金を試算</p>
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      <p className="text-sm text-gray-500 mt-8">この記事は2026年4月時点の情報に基づいています。制度は変更される可能性があるため、最新情報をご確認ください。</p>
    </article>
  );
}
