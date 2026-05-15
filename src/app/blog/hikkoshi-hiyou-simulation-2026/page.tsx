import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "引越し費用の相場 2026｜単身・2人・家族の距離別早見表＋見積もりシミュ";
const description = "単身近距離4万円、家族長距離20万円が目安。距離×荷物量×時期で変わる料金を表で整理し、初期費用込みの総額を無料シミュレーターで瞬時に算出。閑散期・繁忙期の差も解説。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("引越し費用の相場")}&type=blog&category=${encodeURIComponent("不動産・引越し")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["引越し費用", "相場", "単身", "家族", "初期費用", "シミュレーション"],
  openGraph: { title, description, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function HikkoshiHiyouSimulation2026Blog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "【2026年最新】引越し費用の相場と計算方法｜単身・家族別シミュレーション",
            "description": "引越し費用の相場を徹底解説。単身・2人・家族の距離別料金表、初期費用の内訳、安く抑えるコツ。引越し費用シミュレーターで今すぐ計算。",
            "datePublished": "2026-04-14",
            "dateModified": "2026-04-14",
            "author": {"@type": "Organization", "name": "山田ツール編集部"},
            "publisher": {"@type": "Organization", "name": "合同会社山田トレード", "logo": {"@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp"}},
            "mainEntityOfPage": {"@type": "WebPage", "@id": "https://yamada-tools.jp/blog/hikkoshi-hiyou-simulation-2026"}
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type":"Question","name":"一番安い時期はいつ？","acceptedAnswer":{"@type":"Answer","text":"11月〜1月が最安です。需要が少なく、業者も予約が取りやすいため値引き交渉もしやすくなります。逆に3〜4月は繁忙期で1.5〜2倍になることも。"}},{"@type":"Question","name":"見積もりは何社取るべき？","acceptedAnswer":{"@type":"Answer","text":"最低3社、できれば5社程度から見積もりを取りましょう。相場を把握でき、価格交渉の材料にもなります。一括見積もりサイトが便利です。"}},{"@type":"Question","name":"自力引越しはどれくらい安い？","acceptedAnswer":{"@type":"Answer","text":"レンタカー代と高速代程度で済むので1〜3万円に抑えられます。ただし大型家具や家電の運搬は難しく、時間と体力も必要。単身で荷物少なめなら検討の価値あり。"}},{"@type":"Question","name":"不用品の処分費用は？","acceptedAnswer":{"@type":"Answer","text":"自治体の粗大ゴミは数百〜数千円/個。業者に依頼すると軽トラ1台分で1〜3万円。リサイクルショップやフリマアプリで売れば逆にお金になることも。"}}]
          })
        }}
      />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-sakura">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-sakura">ブログ</Link>
        <span className="mx-2">/</span>
        <span>引越し費用2026</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src="/api/og?title=引越し費用の相場&type=blog&category=不動産・引越し" alt="引越し費用シミュレーション" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">【2026年最新】引越し費用の相場と計算方法｜単身・家族別シミュレーション</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2026年4月</p>

      <div className="bg-gray-50 border-l-4 border-gray-200 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1">
          <li>✓ 引越し費用の相場（単身・家族別）</li>
          <li>✓ 距離別の料金目安</li>
          <li>✓ 初期費用（敷金・礼金など）の内訳</li>
          <li>✓ 引越し費用を安く抑えるコツ</li>
          <li>✓ 繁忙期と閑散期の料金差</li>
        </ul>
      </div>

      <section className="mb-10">
      <StaticAdSlot />

        <h2 className="text-2xl font-bold text-gray-800 mb-4">引越しにかかる総費用の内訳</h2>
        <p className="text-gray-700 mb-4">
          引越しには<strong>①引越し業者への支払い</strong>と<strong>②新居の初期費用</strong>の2つが必要です。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h3 className="font-bold text-kon mb-3">① 引越し業者への費用</h3>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>・基本運賃（距離・荷物量）</li>
              <li>・人件費（作業員数）</li>
              <li>・梱包資材費</li>
              <li>・オプション（エアコン取付など）</li>
            </ul>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h3 className="font-bold text-kon mb-3">② 新居の初期費用</h3>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>・敷金（家賃1〜2ヶ月分）</li>
              <li>・礼金（家賃0〜2ヶ月分）</li>
              <li>・仲介手数料（家賃1ヶ月分）</li>
              <li>・前家賃・火災保険など</li>
            </ul>
          </div>
        </div>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【単身】引越し費用の相場</h2>
        <p className="text-gray-700 mb-4">荷物少なめ（1R〜1K）の単身引越しの場合</p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left border-b font-semibold">距離</th>
              <th className="px-3 py-3 text-right border-b font-semibold">通常期<br/><span className="text-xs font-normal">（5〜2月）</span></th>
              <th className="px-3 py-3 text-right border-b font-semibold">繁忙期<br/><span className="text-xs font-normal">（3〜4月）</span></th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-3 py-3 border-b font-bold">同一市内（〜15km）</td><td className="px-3 py-3 border-b text-right">2.5〜4万円</td><td className="px-3 py-3 border-b text-right text-danger">4〜6万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">同一県内（〜50km）</td><td className="px-3 py-3 border-b text-right">3〜5万円</td><td className="px-3 py-3 border-b text-right text-danger">5〜8万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">近距離（〜200km）</td><td className="px-3 py-3 border-b text-right">4〜7万円</td><td className="px-3 py-3 border-b text-right text-danger">7〜12万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">長距離（〜500km）</td><td className="px-3 py-3 border-b text-right">5〜10万円</td><td className="px-3 py-3 border-b text-right text-danger">10〜18万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">遠距離（500km超）</td><td className="px-3 py-3 border-b text-right">7〜15万円</td><td className="px-3 py-3 border-b text-right text-danger">15〜25万円</td></tr>
          </tbody>
        </table>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">💡 単身パックがお得</p>
          <p className="text-gray-700">
            荷物が少なければ「単身パック」で<strong>1.5〜3万円</strong>程度に抑えられることも。
            ボックスに入る量に制限があるので要確認。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【2人暮らし】引越し費用の相場</h2>
        <p className="text-gray-700 mb-4">1LDK〜2LDKの荷物量の場合</p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left border-b font-semibold">距離</th>
              <th className="px-3 py-3 text-right border-b font-semibold">通常期</th>
              <th className="px-3 py-3 text-right border-b font-semibold">繁忙期</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-3 py-3 border-b font-bold">同一市内（〜15km）</td><td className="px-3 py-3 border-b text-right">5〜8万円</td><td className="px-3 py-3 border-b text-right text-danger">8〜12万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">同一県内（〜50km）</td><td className="px-3 py-3 border-b text-right">6〜10万円</td><td className="px-3 py-3 border-b text-right text-danger">10〜15万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">近距離（〜200km）</td><td className="px-3 py-3 border-b text-right">8〜13万円</td><td className="px-3 py-3 border-b text-right text-danger">13〜20万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">長距離（〜500km）</td><td className="px-3 py-3 border-b text-right">12〜20万円</td><td className="px-3 py-3 border-b text-right text-danger">20〜30万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">遠距離（500km超）</td><td className="px-3 py-3 border-b text-right">15〜25万円</td><td className="px-3 py-3 border-b text-right text-danger">25〜40万円</td></tr>
          </tbody>
        </table>
      </section>
      <BlogAdUnit />


      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">【家族（3〜4人）】引越し費用の相場</h2>
        <p className="text-gray-700 mb-4">3LDK以上の荷物量の場合</p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left border-b font-semibold">距離</th>
              <th className="px-3 py-3 text-right border-b font-semibold">通常期</th>
              <th className="px-3 py-3 text-right border-b font-semibold">繁忙期</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-3 py-3 border-b font-bold">同一市内（〜15km）</td><td className="px-3 py-3 border-b text-right">8〜12万円</td><td className="px-3 py-3 border-b text-right text-danger">12〜18万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">同一県内（〜50km）</td><td className="px-3 py-3 border-b text-right">10〜15万円</td><td className="px-3 py-3 border-b text-right text-danger">15〜22万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">近距離（〜200km）</td><td className="px-3 py-3 border-b text-right">12〜20万円</td><td className="px-3 py-3 border-b text-right text-danger">20〜30万円</td></tr>
            <tr className="bg-yellow-50"><td className="px-3 py-3 border-b font-bold">長距離（〜500km）</td><td className="px-3 py-3 border-b text-right font-bold">18〜30万円</td><td className="px-3 py-3 border-b text-right text-danger font-bold">30〜50万円</td></tr>
            <tr><td className="px-3 py-3 border-b font-bold">遠距離（500km超）</td><td className="px-3 py-3 border-b text-right">25〜40万円</td><td className="px-3 py-3 border-b text-right text-danger">40〜70万円</td></tr>
          </tbody>
        </table>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-bold text-kon mb-2">🔧 あなたの引越し費用を計算！</p>
          <p className="text-gray-700 mb-4">人数・距離・時期を入力して、引越し費用の目安をシミュレーションしましょう。</p>
          <Link href="/realestate/moving-cost-calculator" className="inline-block bg-kon hover:bg-ai text-white font-bold py-3 px-6 rounded-lg transition">
            → 引越し費用計算機を使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">新居の初期費用の内訳</h2>
        <p className="text-gray-700 mb-4">
          賃貸物件に入居する際の初期費用は<strong>家賃の4〜6ヶ月分</strong>が目安です。
        </p>
        
        <table className="min-w-full border border-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left border-b font-semibold">項目</th>
              <th className="px-4 py-3 text-right border-b font-semibold">目安</th>
              <th className="px-4 py-3 text-left border-b font-semibold">備考</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-3 border-b font-bold">敷金</td><td className="px-4 py-3 border-b text-right">家賃1〜2ヶ月分</td><td className="px-4 py-3 border-b text-sm">退去時に一部返還</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">礼金</td><td className="px-4 py-3 border-b text-right">家賃0〜2ヶ月分</td><td className="px-4 py-3 border-b text-sm">返還なし（交渉可能な場合あり）</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">仲介手数料</td><td className="px-4 py-3 border-b text-right">家賃1ヶ月分+税</td><td className="px-4 py-3 border-b text-sm">法律上の上限</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">前家賃</td><td className="px-4 py-3 border-b text-right">家賃1〜2ヶ月分</td><td className="px-4 py-3 border-b text-sm">入居月+翌月分</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">火災保険</td><td className="px-4 py-3 border-b text-right">1〜2万円</td><td className="px-4 py-3 border-b text-sm">2年契約が一般的</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">保証会社</td><td className="px-4 py-3 border-b text-right">家賃0.5〜1ヶ月分</td><td className="px-4 py-3 border-b text-sm">連帯保証人不要の場合</td></tr>
            <tr><td className="px-4 py-3 border-b font-bold">鍵交換</td><td className="px-4 py-3 border-b text-right">1〜3万円</td><td className="px-4 py-3 border-b text-sm">セキュリティ上推奨</td></tr>
          </tbody>
        </table>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="font-bold text-gray-800 mb-2">📊 家賃8万円の場合の初期費用例</p>
          <p className="text-gray-700">
            敷金8万＋礼金8万＋仲介手数料8.8万＋前家賃16万＋火災保険1.5万＋保証会社4万＋鍵交換2万＝<strong className="text-kon">約48万円</strong>
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">引越し費用を安く抑える10のコツ</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="font-bold text-kon mb-1">1. 繁忙期を避ける</p>
            <p className="text-gray-700 text-sm">3〜4月を避けると30〜50%安くなることも</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="font-bold text-kon mb-1">2. 複数社で見積もり</p>
            <p className="text-gray-700 text-sm">最低3社から見積もりを取って比較</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="font-bold text-kon mb-1">3. 平日・時間フリー</p>
            <p className="text-gray-700 text-sm">土日祝や時間指定を避けると割安</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="font-bold text-kon mb-1">4. 荷物を減らす</p>
            <p className="text-gray-700 text-sm">不用品は引越し前に処分・売却</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="font-bold text-kon mb-1">5. 自分で梱包</p>
            <p className="text-gray-700 text-sm">梱包サービスを使わず自力で</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="font-bold text-kon mb-1">6. 混載便を利用</p>
            <p className="text-gray-700 text-sm">他の荷物と一緒に運ぶと割安</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="font-bold text-kon mb-1">7. 敷金礼金ゼロ物件</p>
            <p className="text-gray-700 text-sm">初期費用を大幅に削減</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="font-bold text-kon mb-1">8. フリーレント物件</p>
            <p className="text-gray-700 text-sm">1〜2ヶ月家賃無料の物件も</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="font-bold text-kon mb-1">9. 仲介手数料の交渉</p>
            <p className="text-gray-700 text-sm">無料や半額の不動産会社も</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="font-bold text-kon mb-1">10. クレカ払いでポイント</p>
            <p className="text-gray-700 text-sm">初期費用をカード払いで還元</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">よくある質問（FAQ）</h2>
        <div className="space-y-4">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 一番安い時期はいつ？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>11月〜1月が最安</strong>です。需要が少なく、業者も予約が取りやすいため値引き交渉もしやすくなります。逆に3〜4月は繁忙期で1.5〜2倍になることも。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 見積もりは何社取るべき？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3"><strong>最低3社、できれば5社</strong>程度から見積もりを取りましょう。相場を把握でき、価格交渉の材料にもなります。一括見積もりサイトが便利です。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 自力引越しはどれくらい安い？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">レンタカー代と高速代程度で済むので<strong>1〜3万円</strong>に抑えられます。ただし大型家具や家電の運搬は難しく、時間と体力も必要。単身で荷物少なめなら検討の価値あり。</p>
          </details>
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-bold text-gray-800 cursor-pointer">Q. 不用品の処分費用は？</summary>
            <p className="mt-3 text-gray-700 border-t pt-3">自治体の粗大ゴミは<strong>数百〜数千円/個</strong>。業者に依頼すると軽トラ1台分で1〜3万円。リサイクルショップやフリマアプリで売れば逆にお金になることも。</p>
          </details>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：早めの準備で賢く引越し</h2>
        <p className="text-gray-700 mb-4">
          引越し費用は時期・距離・荷物量で大きく変わります。
          <strong>繁忙期を避け、複数社比較</strong>することで費用を大幅に抑えられます。
        </p>
        
        <div className="bg-gradient-to-r from-slate-900 to-kon text-white rounded-lg p-6 text-center">
          <p className="text-lg font-bold mb-4">あなたの引越し費用をシミュレーション</p>
          <Link href="/realestate/moving-cost-calculator" className="inline-block bg-white text-kon font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition">
            → 引越し費用計算機を使う
          </Link>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 あわせて使えるツール</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/realestate/moving-cost-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-ai transition">
            <span className="font-bold text-gray-800">引越し費用計算機</span>
            <p className="text-sm text-gray-600">引越し費用の目安を計算</p>
          </Link>
          <Link href="/realestate/rent-vs-buy" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-ai transition">
            <span className="font-bold text-gray-800">賃貸vs購入シミュレーター</span>
            <p className="text-sm text-gray-600">賃貸と持ち家を比較</p>
          </Link>
          <Link href="/realestate/rental-cost-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-ai transition">
            <span className="font-bold text-gray-800">家賃計算機</span>
            <p className="text-sm text-gray-600">適正家賃を計算</p>
          </Link>
          <Link href="/realestate/property-tax-calculator" className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-ai transition">
            <span className="font-bold text-gray-800">固定資産税計算機</span>
            <p className="text-sm text-gray-600">固定資産税を計算</p>
          </Link>
        </div>
      </section>

      <BlogAdUnit />

      <p className="text-sm text-gray-500 mt-8">この記事は2026年4月時点の相場に基づいています。</p>
    
      <ShareButtons url="https://yamada-tools.jp/blog/hikkoshi-hiyou-simulation-2026" title="hikkoshi-hiyou-simulation-2026" />
</article>
  );
}
