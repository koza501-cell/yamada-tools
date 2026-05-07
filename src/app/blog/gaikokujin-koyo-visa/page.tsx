import { Metadata } from "next";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import Link from "next/link";
import ShareButtons from "@/components/blog/ShareButtons";

const title = "外国人採用の費用・ビザ手続き完全ガイド【技術・人文・国際業務ビザ vs 特定技能】";
const description = "外国人を採用するためのビザ費用を徹底解説。技術・人文・国際業務ビザと特定技能の違い、必要書類、行政書士費用まで。無料計算ツールで総費用を今すぐ試算。";
const ogImage = `https://yamada-tools.jp/api/og?title=${encodeURIComponent("外国人採用の費用・ビザ手続き完全ガイド")}&type=blog&category=${encodeURIComponent("人事・外国人雇用")}`;

export const metadata: Metadata = {
  title, description,
  keywords: ["外国人採用 費用", "就労ビザ 費用", "技術人文国際業務 ビザ 費用", "外国人 採用 手続き 流れ", "在留資格 取得 費用", "外国人 採用 行政書士 費用", "特定技能 技術人文 違い", "外国人 採用 必要書類"],
  alternates: { canonical: "https://yamada-tools.jp/blog/gaikokujin-koyo-visa" },
  openGraph: { title, description, type: "article", publishedTime: "2025-05-08", images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function GaikokujinKoyoVisaBlog() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": description,
            "datePublished": "2025-05-08",
            "dateModified": "2025-05-08",
            "author": { "@type": "Organization", "name": "山田ツール編集部" },
            "publisher": { "@type": "Organization", "name": "合同会社山田トレード", "logo": { "@type": "ImageObject", "url": "https://yamada-tools.jp/logo-icon.webp" } },
            "mainEntityOfPage": { "@type": "WebPage", "@id": "https://yamada-tools.jp/blog/gaikokujin-koyo-visa" }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "外国人を採用するのに費用はいくらかかりますか？", "acceptedAnswer": { "@type": "Answer", "text": "海外から招へいする場合の初期費用は1人あたり30〜95万円程度（行政書士費用・渡航費・住居初期費用・求人広告費含む）。国内在留者の在留資格変更であれば5〜15万円程度で済みます。年間更新費用は1人あたり3〜8万円程度です。" } },
              { "@type": "Question", "name": "技術・人文・国際業務ビザと特定技能はどちらが向いていますか？", "acceptedAnswer": { "@type": "Answer", "text": "IT・事務・営業・通訳・デザインなど知識・技術系の職種には「技術・人文・国際業務ビザ」が向いています。更新制限がなく家族帯同も可能です。製造・農業・飲食・介護など14特定産業分野には「特定技能」が向いています。ただし特定技能1号は家族帯同不可・通算5年の在留制限があります。" } },
              { "@type": "Question", "name": "外国人採用で行政書士に依頼する費用は？", "acceptedAnswer": { "@type": "Answer", "text": "海外からの招へい（在留資格認定証明書申請）の場合は8〜20万円程度。国内在留者の在留資格変更申請は5〜15万円程度。更新申請（変更なし）は3〜8万円程度が目安です。" } },
              { "@type": "Question", "name": "ベトナムからの採用費用はいくらかかりますか？", "acceptedAnswer": { "@type": "Answer", "text": "ベトナムからの採用は、海外求人広告費5〜30万円、面接渡航費10〜30万円、行政書士費用8〜20万円、渡航費5〜15万円、住居初期費用10〜30万円で合計38〜125万円程度が目安です。政府証明書費用（認証費用）は国籍によって異なります。" } }
            ]
          })
        }}
      />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-500">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-blue-500">ブログ</Link>
        <span className="mx-2">/</span>
        <span>外国人採用ビザ費用完全ガイド</span>
      </nav>

      <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
        <img src={`/api/og?title=${encodeURIComponent("外国人採用の費用・ビザ手続き完全ガイド")}&type=blog&category=${encodeURIComponent("人事・外国人雇用")}`} alt="外国人採用ビザ費用完全ガイド" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-500 text-sm mb-8">最終更新: 2025年5月 ｜ 読了時間: 約9分</p>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
        <p className="font-bold text-gray-800 mb-2">この記事でわかること</p>
        <ul className="text-gray-700 space-y-1 text-sm">
          <li>✓ 就労可能な在留資格（ビザ）の種類と特徴</li>
          <li>✓ 技術・人文知識・国際業務ビザの採用費用内訳（海外・国内在留者別）</li>
          <li>✓ 特定技能との違い・どちらが向いているか</li>
          <li>✓ 申請に必要な書類と審査期間</li>
          <li>✓ 外国人採用の法的義務と注意点</li>
          <li>✓ 無料ツールで総費用を今すぐ試算</li>
        </ul>
      </div>

      <section className="mb-10">
        <StaticAdSlot />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">外国人採用できるビザの種類（就労可能な在留資格）</h2>
        <p className="text-gray-700 mb-4">
          外国人を採用する際は、本人が<strong className="text-blue-600">就労可能な在留資格（ビザ）</strong>を持っているか、または新たに取得する必要があります。主な就労ビザは以下の4種類です。
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-3 text-left">在留資格</th>
                <th className="p-3 text-left">対象職種</th>
                <th className="p-3 text-center">家族帯同</th>
                <th className="p-3 text-left">特徴</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["技術・人文・国際業務", "IT・経理・営業・通訳・デザイン等", "可", "最も一般的。更新制限なし"],
                ["特定技能（1号）", "製造・農業・飲食・介護など14分野", "不可", "通算5年の在留制限あり"],
                ["特定技能（2号）", "建設・造船など一部分野のみ", "可", "在留制限なし・無制限更新"],
                ["高度専門職", "研究者・教授・経営者等", "可", "ポイント制。優遇多数"],
              ].map(([visa, job, family, feature], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 border border-gray-200 font-medium text-blue-700">{visa}</td>
                  <td className="p-3 border border-gray-200">{job}</td>
                  <td className="p-3 border border-gray-200 text-center">{family}</td>
                  <td className="p-3 border border-gray-200 text-gray-600 text-xs">{feature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
          <p className="font-bold text-yellow-800 mb-2">⚠️ 技能実習制度について</p>
          <p className="text-gray-700 text-sm">
            技能実習制度は<strong>2027年廃止予定</strong>で、後継の「育成就労制度」へ移行します。現在新規で技能実習の採用を検討している場合は、特定技能または技術・人文・国際業務ビザへの切り替えを検討してください。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">技術・人文知識・国際業務ビザとは？</h2>
        <p className="text-gray-700 mb-4">
          日本で最も多く活用される就労ビザです。ITエンジニア・経理・営業・通訳・デザイナーなど幅広い職種で活用でき、<strong className="text-blue-600">更新回数に制限がない</strong>ため長期雇用に向いています。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-5">
            <h3 className="font-bold text-blue-800 mb-3">対象職種・要件</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>・ITエンジニア・システム開発・SE</li>
              <li>・経理・財務・人事・総務</li>
              <li>・営業・マーケティング・貿易</li>
              <li>・通訳・翻訳・語学講師</li>
              <li>・デザイナー・クリエイター</li>
              <li className="text-blue-700 font-semibold mt-2">要件：大卒以上 or 実務経験10年以上</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-5">
            <h3 className="font-bold text-green-800 mb-3">ビザの特徴</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>・在留期間：1年/3年/5年（更新制限なし）</li>
              <li>・転職：同種業務なら資格変更なしで可</li>
              <li>・家族帯同：配偶者・子は「家族滞在」で来日可</li>
              <li>・副業：原則不可（資格外活動許可が必要）</li>
              <li className="text-green-700 font-semibold mt-2">長期雇用・安定採用に最適</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">技術・人文ビザの採用費用内訳</h2>
        <p className="text-gray-700 mb-4">
          採用費用は<strong className="text-blue-600">海外から招へいする場合</strong>と<strong className="text-blue-600">国内在留者の在留資格変更</strong>で大きく異なります。
        </p>

        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3">海外から招へいする場合（1人あたり）</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 text-left">費用項目</th>
                  <th className="p-3 text-center">最小</th>
                  <th className="p-3 text-center">最大</th>
                  <th className="p-3 text-left">備考</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["海外求人広告費", "50,000円", "300,000円", "SNS・人材紹介サイト等"],
                  ["面接・選考費用", "100,000円", "300,000円", "現地面接渡航費等"],
                  ["行政書士費用（認定申請）", "80,000円", "200,000円", "在留資格認定証明書申請"],
                  ["政府証明書・認証費用", "3,000円", "6,000円", "国籍により異なる"],
                  ["渡航費（来日）", "50,000円", "150,000円", "航空券・荷物輸送"],
                  ["住居初期費用", "100,000円", "300,000円", "敷金・礼金・家具等"],
                  ["日本語研修費", "50,000円", "200,000円", "3ヶ月コース目安"],
                ].map(([item, min, max, note], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 border border-gray-200 font-medium">{item}</td>
                    <td className="p-3 border border-gray-200 text-center">{min}</td>
                    <td className="p-3 border border-gray-200 text-center">{max}</td>
                    <td className="p-3 border border-gray-200 text-gray-600 text-xs">{note}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-bold">
                  <td className="p-3 border border-gray-200">合計初期費用目安</td>
                  <td className="p-3 border border-gray-200 text-center text-blue-700">約433,000円</td>
                  <td className="p-3 border border-gray-200 text-center text-blue-700">約1,456,000円</td>
                  <td className="p-3 border border-gray-200 text-gray-600 text-xs">研修費含む/1人あたり</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-5">
            <h3 className="font-bold text-green-800 mb-3">国内在留者の資格変更（留学生等）</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-green-100 pb-2">
                <span>行政書士費用</span>
                <span className="font-bold">50,000〜150,000円</span>
              </div>
              <div className="flex justify-between border-b border-green-100 pb-2">
                <span>在留資格変更申請料</span>
                <span className="font-bold">4,000円</span>
              </div>
              <div className="flex justify-between bg-green-100 rounded p-2 mt-2">
                <span className="font-bold">合計目安</span>
                <span className="font-bold text-green-700">54,000〜154,000円</span>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 rounded-xl p-5">
            <h3 className="font-bold text-orange-800 mb-3">年間更新費用（1人あたり）</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-orange-100 pb-2">
                <span>行政書士費用</span>
                <span className="font-bold">30,000〜80,000円</span>
              </div>
              <div className="flex justify-between border-b border-orange-100 pb-2">
                <span>更新申請料</span>
                <span className="font-bold">4,000円</span>
              </div>
              <div className="flex justify-between bg-orange-100 rounded p-2 mt-2">
                <span className="font-bold">年間合計目安</span>
                <span className="font-bold text-orange-700">34,000〜84,000円</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">特定技能との違いは？どちらが向いているか</h2>
        <p className="text-gray-700 mb-4">
          同じ就労ビザでも、技術・人文・国際業務ビザと特定技能では対象職種・在留条件・費用が大きく異なります。自社の採用ニーズに合ったビザを選択しましょう。
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-3 text-left">比較項目</th>
                <th className="p-3 text-center">技術・人文・国際業務</th>
                <th className="p-3 text-center">特定技能1号</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["対象職種", "知識・技術系（IT・経理・営業等）", "14特定産業分野（製造・農業・飲食等）"],
                ["要件", "大卒以上 or 実務経験10年以上", "技能試験＋日本語試験合格"],
                ["在留期間", "1〜5年（更新制限なし）", "通算5年まで（2号は無制限）"],
                ["家族帯同", "配偶者・子は可（家族滞在）", "不可（1号）"],
                ["転職", "同種業務なら可", "同一分野なら可"],
                ["初期費用目安", "30〜145万円/人", "50〜130万円/人"],
              ].map(([item, tech, tokutei], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3 border border-gray-200 font-medium">{item}</td>
                  <td className="p-3 border border-gray-200 text-center text-blue-700">{tech}</td>
                  <td className="p-3 border border-gray-200 text-center text-green-700">{tokutei}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-xl p-5">
            <h3 className="font-bold text-blue-800 mb-3">技術・人文・国際業務が向いているケース</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✅ ITエンジニア・プログラマーを採用したい</li>
              <li>✅ 事務・経理・人事スタッフが必要</li>
              <li>✅ 通訳・翻訳・多言語対応スタッフが欲しい</li>
              <li>✅ 長期的に定住・定着させたい</li>
              <li>✅ 家族も一緒に来日させたい</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-5">
            <h3 className="font-bold text-green-800 mb-3">特定技能が向いているケース</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✅ 製造ライン・工場作業員が必要</li>
              <li>✅ 農業・酪農・食品加工の人手不足</li>
              <li>✅ 飲食店・ホテル・介護施設のスタッフ</li>
              <li>✅ 建設・溶接などの技能職</li>
              <li>✅ 外国人支援機関（登録支援機関）を活用したい</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">申請に必要な主な書類</h2>
        <p className="text-gray-700 mb-4">
          在留資格の申請には、会社側と本人側の両方から書類を準備する必要があります。学歴証明書の認証など、時間がかかるものがあるため<strong className="text-blue-600">2〜3ヶ月前から準備</strong>を始めましょう。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-blue-200 rounded-xl p-5">
            <h3 className="font-bold text-blue-800 mb-3">会社（雇用主）側の書類</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex gap-2"><span className="text-blue-500">📄</span> 登記簿謄本（3ヶ月以内）</li>
              <li className="flex gap-2"><span className="text-blue-500">📄</span> 直近2期分の決算書・税務申告書</li>
              <li className="flex gap-2"><span className="text-blue-500">📄</span> 雇用契約書（労働条件通知書）</li>
              <li className="flex gap-2"><span className="text-blue-500">📄</span> 会社概要・事業内容説明書</li>
              <li className="flex gap-2"><span className="text-blue-500">📄</span> 採用理由説明書</li>
            </ul>
          </div>
          <div className="bg-white border border-green-200 rounded-xl p-5">
            <h3 className="font-bold text-green-800 mb-3">本人（外国人）側の書類</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex gap-2"><span className="text-green-500">📄</span> パスポートコピー</li>
              <li className="flex gap-2"><span className="text-green-500">📄</span> 学歴証明書・卒業証明書（公証・認証必要）</li>
              <li className="flex gap-2"><span className="text-green-500">📄</span> 職歴証明書（実務経験10年の場合）</li>
              <li className="flex gap-2"><span className="text-green-500">📄</span> 証明写真（規格指定）</li>
              <li className="flex gap-2"><span className="text-green-500">📄</span> 在留カード（国内在留者の場合）</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <p className="font-bold text-yellow-800 mb-2">⏰ 審査期間の目安</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-white rounded p-3 text-center">
              <p className="font-bold text-gray-700">在留資格認定証明書</p>
              <p className="text-orange-600 font-bold">2〜3ヶ月</p>
              <p className="text-gray-500 text-xs">海外からの招へい</p>
            </div>
            <div className="bg-white rounded p-3 text-center">
              <p className="font-bold text-gray-700">在留資格変更許可</p>
              <p className="text-blue-600 font-bold">1〜2ヶ月</p>
              <p className="text-gray-500 text-xs">国内在留者の変更</p>
            </div>
            <div className="bg-white rounded p-3 text-center">
              <p className="font-bold text-gray-700">在留期間更新</p>
              <p className="text-green-600 font-bold">2週間〜1ヶ月</p>
              <p className="text-gray-500 text-xs">更新のみ</p>
            </div>
          </div>
        </div>
      </section>

      <BlogAdUnit />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">外国人採用の注意点</h2>

        <div className="space-y-4 mb-6">
          {[
            {
              icon: "⚠️",
              title: "ハローワーク届出義務（外国人雇用状況の届出）",
              content: "外国人を雇用した際・退職した際は、ハローワークへの届出が義務です（雇用保険被保険者の場合は雇用保険手続きで兼ねる）。届出を怠ると30万円以下の罰金が科される場合があります。"
            },
            {
              icon: "⚠️",
              title: "不法就労の確認責任は雇用主にある",
              content: "在留資格の確認を怠り、就労不可の外国人を雇用した場合、雇用主も不法就労助長罪に問われます。採用時に必ず在留カードの原本確認と、就労資格証明書または在留カード裏面の資格外活動許可スタンプを確認してください。"
            },
            {
              icon: "📋",
              title: "在留カードの確認方法",
              content: "在留カードの「就労制限の有無」欄を確認してください。「就労不可」は原則就労できません（資格外活動許可があれば一部可）。「在留資格に基づく就労活動のみ可」の場合は、在留資格に対応した業務のみ許可されます。"
            },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-2">{item.icon} {item.title}</h3>
              <p className="text-gray-700 text-sm">{item.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">無料ツールで総費用を今すぐ試算</h2>
        <p className="text-gray-700 mb-6">
          採用人数・招へい方法・行政書士依頼の有無・日本語研修の有無などを入力するだけで、初期費用・年間更新費用・N年間総費用の目安を計算できます。
        </p>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 mb-6 text-center">
          <p className="text-lg font-bold mb-2">外国人採用 ビザ費用計算機</p>
          <p className="text-sm opacity-90 mb-4">採用人数・国籍・採用方法・行政書士依頼・日本語研修の有無から初期費用〜N年間総費用を試算。</p>
          <Link href="/business/gaikokujin-visa-calculator" className="inline-block bg-white text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
            今すぐ費用を試算する →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">特定技能 費用計算機</p>
            <p className="text-sm text-gray-600 mb-3">特定技能1号・2号の採用費用（登録支援機関費用含む）を計算。技術・人文・国際業務ビザとの比較も。</p>
            <Link href="/business/tokutei-gino-calculator" className="text-blue-600 text-sm font-medium hover:underline">試してみる →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-gray-800 mb-2">給与・社会保険料計算機</p>
            <p className="text-sm text-gray-600 mb-3">外国人スタッフの給与から社会保険料・雇用保険料の会社負担分を計算。採用コストの総額把握に。</p>
            <Link href="/business" className="text-blue-600 text-sm font-medium hover:underline">ビジネスツール一覧 →</Link>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">まとめ：外国人採用の重要ポイント</h2>
        <div className="bg-blue-50 rounded-xl p-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-2"><span className="text-blue-600 font-bold">①</span> IT・事務・営業職には「技術・人文・国際業務ビザ」が最適。更新制限なし・家族帯同可</li>
            <li className="flex gap-2"><span className="text-blue-600 font-bold">②</span> 製造・農業・飲食には「特定技能」が向いているが、家族帯同不可・通算5年の制限あり</li>
            <li className="flex gap-2"><span className="text-blue-600 font-bold">③</span> 海外招へいの初期費用は43〜146万円/人。国内在留者変更なら5〜15万円程度</li>
            <li className="flex gap-2"><span className="text-blue-600 font-bold">④</span> 在留資格認定証明書の取得まで2〜3ヶ月かかる。入社日から逆算して早めに準備</li>
            <li className="flex gap-2"><span className="text-blue-600 font-bold">⑤</span> 採用時の在留カード確認と、雇用・退職時のハローワーク届出は法定義務</li>
            <li className="flex gap-2"><span className="text-blue-600 font-bold">⑥</span> 行政書士への依頼を推奨。審査落ちリスクを下げ、書類準備の工数を削減できる</li>
          </ul>
        </div>
      </section>

      <ShareButtons url="https://yamada-tools.jp/blog/gaikokujin-koyo-visa" title={title} />
    </article>
  );
}
