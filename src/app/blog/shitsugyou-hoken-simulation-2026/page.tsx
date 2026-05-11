import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "【2026年最新】失業保険はいくらもらえる？受給額・期間シミュレーション完全ガイド";
const description = "失業保険（雇用保険）の受給額を徹底解説。月給30万円なら日額約6,000円、総額約100万円が目安。自己都合・会社都合の違い、受給期間、手続き方法まで網羅。yamada-tools.jpの無料ツールで実際にシミュレーション・計算が可能。中小企業・個人事業主・フリーランスの実務に役立つ情報を提供。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("失業保険はいくらもらえる？")}&type=blog&category=${encodeURIComponent("転職・キャリア")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["失業保険", "雇用保険", "シミュレーション", "受給額", "いくら", "計算"],
  openGraph: { title, description, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function ShitsugyouHokenSimulation2026Blog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】失業保険はいくらもらえる？受給額・期間シミュレーション完全ガイド",
            "description": "失業保険（雇用保険）の受給額を徹底解説。月給30万円なら日額約6,000円、総額約100万円が目安。自己都合・会社都合の違い、受給期間、手続き方法まで網羅。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Organization", "name": "山田ツール編集部"},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/shitsugyou-hoken-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"失業保険と年金は同時にもらえる？","acceptedAnswer":{"@type":"Answer","text":"65歳未満は基本的にどちらか一方です。失業保険を受給中は年金が停止されます。65歳以上は「高年齢求職者給付金」として一時金が支給されます。"}},{"@type":"Question","name":"アルバイトしながらもらえる？","acceptedAnswer":{"@type":"Answer","text":"週20時間未満なら可能ですが、働いた日は減額されます。週20時間以上働くと「就職」とみなされ、給付が停止します。"}},{"@type":"Question","name":"再就職したらどうなる？","acceptedAnswer":{"@type":"Answer","text":"「再就職手当」がもらえる可能性があります。残りの給付日数の60〜70%が一時金として支給されます。早く再就職するほどお得です。"}},{"@type":"Question","name":"転職先が決まってから退職したら？","acceptedAnswer":{"@type":"Answer","text":"失業保険はもらえません。失業状態ではないためです。ただし、入社日までに期間が空く場合は受給できることも。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sakura">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-sakura">ブログ</Link>
        <span className="mx-2">/</span>
        <span>失業保険シミュレーション2026</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src="/api/og?title=失業保険はいくらもらえる？&type=blog&category=転職・キャリア" alt="失業保険シミュレーション" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">【2026年最新】失業保険はいくらもらえる？受給額・期間シミュレーション完全ガイド</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-sky-50 border-l-4 border-sky-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 失業保険の受給額の計算方法</li>
          <li>✓ 月給別の受給額シミュレーション</li>
          <li>✓ 自己都合・会社都合の違い</li>
          <li>✓ 受給期間と給付制限</li>
          <li>✓ ハローワークでの手続き方法</li>
        </ul>
      </div>

      <section className="mb-10">
      <StaticAdSlot />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">失業保険（雇用保険）とは？</h2>
        <p className="text-gray-700 mb-4">
          失業保険は、仕事を失った人が次の仕事を見つけるまでの生活を支援する制度です。
          正式名称は<strong className="text-sky-600">「雇用保険の基本手当」</strong>といいます。
        </p>
        
        <div className="bg-white border-2 border-sky-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-sky-800 text-xl mb-3">受給の条件</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-sky-500 font-bold">✓</span>
              <span>離職前2年間に<strong>12ヶ月以上</strong>雇用保険に加入していた（会社都合は6ヶ月）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-500 font-bold">✓</span>
              <span><strong>働く意思と能力</strong>がある（求職活動を行う）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-500 font-bold">✓</span>
              <span>ハローワークで<strong>求職の申し込み</strong>をしている</span>
            </li>
          </ul>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【月給別】失業保険の受給額シミュレーション</h2>
        <p className="text-gray-700 mb-4">失業保険の日額は、退職前6ヶ月の給与をもとに計算されます。</p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-sky-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">退職前の月給</th>
              <th className="px-4 py-3 text-left border-b font-semibold">基本手当日額</th>
              <th className="px-4 py-3 text-left border-b font-semibold">月額換算（22日）</th>
              <th className="px-4 py-3 text-left border-b font-semibold">90日間の総額</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b">20万円</td><td className="px-4 py-3 border-b font-bold text-sky-600">約4,800円</td><td className="px-4 py-3 border-b">約10.6万円</td><td className="px-4 py-3 border-b">約43万円</td></tr>
            <tr><td className="px-4 py-3 border-b">25万円</td><td className="px-4 py-3 border-b font-bold text-sky-600">約5,500円</td><td className="px-4 py-3 border-b">約12.1万円</td><td className="px-4 py-3 border-b">約50万円</td></tr>
            <tr><td className="px-4 py-3 border-b">30万円</td><td className="px-4 py-3 border-b font-bold text-sky-600">約6,000円</td><td className="px-4 py-3 border-b">約13.2万円</td><td className="px-4 py-3 border-b">約54万円</td></tr>
            <tr><td className="px-4 py-3 border-b">35万円</td><td className="px-4 py-3 border-b font-bold text-sky-600">約6,400円</td><td className="px-4 py-3 border-b">約14.1万円</td><td className="px-4 py-3 border-b">約58万円</td></tr>
            <tr><td className="px-4 py-3 border-b">40万円</td><td className="px-4 py-3 border-b font-bold text-sky-600">約6,800円</td><td className="px-4 py-3 border-b">約15.0万円</td><td className="px-4 py-3 border-b">約61万円</td></tr>
            <tr><td className="px-4 py-3 border-b">50万円</td><td className="px-4 py-3 border-b font-bold text-sky-600">約7,200円</td><td className="px-4 py-3 border-b">約15.8万円</td><td className="px-4 py-3 border-b">約65万円</td></tr>
          </tbody>
        </table>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 給付率は50〜80%</p>
          <p className="text-gray-700">
            賃金が低いほど給付率が高くなります。月給20万円なら約80%、月給40万円以上は約50%が目安。
            また、<strong>年齢によって上限額</strong>が異なります（45〜59歳が最も高い）。
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-kon mb-2">🔧 あなたの失業保険を計算！</p>
          <p className="text-gray-700 mb-4">月給・年齢・勤続年数を入力して、受給額と期間を計算しましょう。</p>
          <Link href="/career/unemployment-calculator" className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition">
            → 失業保険シミュレーターを使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">自己都合 vs 会社都合：受給期間の違い</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h3 className="font-bold text-kon text-lg mb-3">自己都合退職</h3>
            <ul className="space-y-2 text-gray-700">
              <li>・給付制限：<strong className="text-danger">2ヶ月</strong>（待機7日後）</li>
              <li>・受給期間：90〜150日</li>
              <li>・すぐにはもらえない</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="font-bold text-green-800 text-lg mb-3">会社都合退職</h3>
            <ul className="space-y-2 text-gray-700">
              <li>・給付制限：<strong className="text-green-600">なし</strong>（待機7日後すぐ）</li>
              <li>・受給期間：90〜330日</li>
              <li>・早くもらえて長く続く</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-3">受給期間の詳細（会社都合の場合）</h3>
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left border-b font-semibold">年齢＼勤続年数</th>
              <th className="px-3 py-2 text-center border-b font-semibold">1年未満</th>
              <th className="px-3 py-2 text-center border-b font-semibold">1〜5年</th>
              <th className="px-3 py-2 text-center border-b font-semibold">5〜10年</th>
              <th className="px-3 py-2 text-center border-b font-semibold">10〜20年</th>
              <th className="px-3 py-2 text-center border-b font-semibold">20年以上</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-3 py-2 border-b font-bold">30歳未満</td><td className="px-3 py-2 border-b text-center">90日</td><td className="px-3 py-2 border-b text-center">90日</td><td className="px-3 py-2 border-b text-center">120日</td><td className="px-3 py-2 border-b text-center">180日</td><td className="px-3 py-2 border-b text-center">-</td></tr>
            <tr><td className="px-3 py-2 border-b font-bold">30〜35歳</td><td className="px-3 py-2 border-b text-center">90日</td><td className="px-3 py-2 border-b text-center">120日</td><td className="px-3 py-2 border-b text-center">180日</td><td className="px-3 py-2 border-b text-center">210日</td><td className="px-3 py-2 border-b text-center">240日</td></tr>
            <tr><td className="px-3 py-2 border-b font-bold">35〜45歳</td><td className="px-3 py-2 border-b text-center">90日</td><td className="px-3 py-2 border-b text-center">150日</td><td className="px-3 py-2 border-b text-center">180日</td><td className="px-3 py-2 border-b text-center">240日</td><td className="px-3 py-2 border-b text-center">270日</td></tr>
            <tr><td className="px-3 py-2 border-b font-bold">45〜60歳</td><td className="px-3 py-2 border-b text-center">90日</td><td className="px-3 py-2 border-b text-center">180日</td><td className="px-3 py-2 border-b text-center">240日</td><td className="px-3 py-2 border-b text-center">270日</td><td className="px-3 py-2 border-b text-center font-bold text-sky-600">330日</td></tr>
          </tbody>
        </table>

        <div className="bg-gray-50 border-l-4 border-danger p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">⚠️ 自己都合でも「正当な理由」があれば給付制限なし</p>
          <p className="text-gray-700">
            パワハラ、セクハラ、長時間労働（月80時間以上の残業）、給与未払いなどは「特定理由離職者」として
            会社都合と同等の扱いになる場合があります。
          </p>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">失業保険の手続き方法</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <span className="bg-sky-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">1</span>
            <div>
              <h3 className="font-bold text-gray-800">退職後、離職票を受け取る</h3>
              <p className="text-gray-700">会社から「離職票-1」と「離職票-2」が届きます（通常2週間以内）。届かない場合は会社に催促を。</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="bg-sky-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">2</span>
            <div>
              <h3 className="font-bold text-gray-800">ハローワークで求職申し込み</h3>
              <p className="text-gray-700">住所地のハローワークで「求職申込書」を提出。離職票、身分証明書、写真、印鑑、通帳が必要。</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="bg-sky-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">3</span>
            <div>
              <h3 className="font-bold text-gray-800">7日間の待機期間</h3>
              <p className="text-gray-700">申し込み後7日間は「待機期間」で、この間は給付されません。</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="bg-sky-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">4</span>
            <div>
              <h3 className="font-bold text-gray-800">雇用保険説明会に参加</h3>
              <p className="text-gray-700">待機期間後に開催される説明会に参加。受給資格者証と失業認定申告書をもらいます。</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="bg-sky-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">5</span>
            <div>
              <h3 className="font-bold text-gray-800">4週間ごとに失業認定</h3>
              <p className="text-gray-700">指定日にハローワークで失業認定を受けます。求職活動実績（2回以上）が必要。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 失業保険と年金は同時にもらえる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>65歳未満は基本的にどちらか一方</strong>です。失業保険を受給中は年金が停止されます。65歳以上は「高年齢求職者給付金」として一時金が支給されます。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. アルバイトしながらもらえる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>週20時間未満なら可能</strong>ですが、働いた日は減額されます。週20時間以上働くと「就職」とみなされ、給付が停止します。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 再就職したらどうなる？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>「再就職手当」がもらえる可能性</strong>があります。残りの給付日数の60〜70%が一時金として支給されます。早く再就職するほどお得です。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 転職先が決まってから退職したら？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>失業保険はもらえません</strong>。失業状態ではないためです。ただし、入社日までに期間が空く場合は受給できることも。</p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：失業保険は「もらえる権利」</h2>
        <p className="text-gray-700 mb-4">
          失業保険は、雇用保険料を払ってきた人の正当な権利です。
          自己都合でも会社都合でも、条件を満たせば受給できます。
        </p>
        <p className="text-gray-700 mb-6">
          退職前に自分がいくらもらえるか、いつからもらえるかを把握しておくことで、
          安心して次のキャリアを考えられます。
        </p>
        
        <div className="bg-gradient-to-r from-sky-500 to-kon text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">あなたの失業保険をシミュレーション</p>
          <Link href="/career/unemployment-calculator" className="inline-block bg-white text-sky-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 失業保険シミュレーターを使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 あわせて使えるツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/career/unemployment-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-sky-300 transition">
            <span className="font-bold text-gray-800">失業保険シミュレーター</span>
            <p className="text-sm text-gray-600">受給額と期間を計算</p>
          </Link>
          <Link href="/career/retirement-bonus-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-sky-300 transition">
            <span className="font-bold text-gray-800">退職金計算機</span>
            <p className="text-sm text-gray-600">退職金の見込み額を試算</p>
          </Link>
          <Link href="/career/job-change-simulator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-sky-300 transition">
            <span className="font-bold text-gray-800">転職年収シミュレーター</span>
            <p className="text-sm text-gray-600">転職後の年収を試算</p>
          </Link>
          <Link href="/career/social-insurance-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-sky-300 transition">
            <span className="font-bold text-gray-800">社会保険料計算機</span>
            <p className="text-sm text-gray-600">給与から天引き額を計算</p>
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      <p className="text-sm text-gray-500 mt-8">この記事は2026年4月時点の情報に基づいています。最新情報はハローワークでご確認ください。</p>
    
      <ShareButtons url="https://yamada-tools.jp/blog/shitsugyou-hoken-simulation-2026" title="shitsugyou-hoken-simulation-2026" />
</article>
  );
}
