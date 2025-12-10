import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "よくある質問（FAQ） | 山田ツール",
  description: "山田ツールに関するよくある質問と回答をまとめました。料金、セキュリティ、使い方などについてご確認いただけます。",
};

const faqs = [
  {
    category: "料金・サービス内容について",
    questions: [
      {
        q: "本当に無料で使えますか？",
        a: "はい、現在はベータ版として完全無料でご利用いただけます。会員登録も不要で、すべての機能を制限なくお使いいただけます。",
      },
      {
        q: "利用回数に制限はありますか？",
        a: "通常のご利用であれば制限はございません。ただし、サーバー保護のため、短時間での大量アクセス（1時間に50ファイル以上、または1日200ファイル以上）は自動的に制限される場合があります。一般的な個人利用や業務利用であれば、この制限に達することはほとんどありません。詳しくは「適正利用ガイドライン」をご確認ください。",
      },
      {
        q: "ファイルサイズの上限はありますか？",
        a: "PDFツールは1ファイルあたり最大50MB、画像ツールは最大20MBまで対応しています。より大きなファイルの処理が必要な場合は、ファイルを分割してご利用ください。",
      },
      {
        q: "会員登録は必要ですか？",
        a: "いいえ、会員登録は一切不要です。ウェブサイトにアクセスするだけで、すぐに全てのツールをご利用いただけます。",
      },
    ],
  },
  {
    category: "セキュリティ・プライバシーについて",
    questions: [
      {
        q: "アップロードしたファイルは安全ですか？",
        a: "はい、お客様のファイルは完全に保護されます。当社は日本国内のサーバーを使用しており、すべての通信はSSL/TLS暗号化で保護されています。ファイルは処理完了後、即座にサーバーから完全に削除されます（最大60分以内）。",
      },
      {
        q: "ファイルの内容を見られることはありませんか？",
        a: "ございません。当社のスタッフがお客様のファイル内容を閲覧することは技術的に不可能な仕組みになっています。",
      },
      {
        q: "ファイルはいつ削除されますか？",
        a: "ファイルは処理完了と同時にサーバーから削除されます。万が一処理が中断された場合でも、アップロードから60分以内にシステムが自動的に完全削除します。",
      },
      {
        q: "第三者にファイルが共有されることはありますか？",
        a: "絶対にありません。お客様のファイルを第三者と共有することは一切ございません。",
      },
      {
        q: "海外のサーバーに送信されますか？",
        a: "いいえ。すべてのファイル処理は日本国内のサーバーで完結します。お客様のファイルが海外に送信されることは一切ありません。",
      },
    ],
  },
  {
    category: "使い方・機能について",
    questions: [
      {
        q: "スマートフォンでも使えますか？",
        a: "はい、スマートフォン・タブレットでもご利用いただけます。iPhoneでもAndroidでも快適にお使いいただけます。",
      },
      {
        q: "処理に失敗したらどうすればいいですか？",
        a: "ページを更新して再度お試しください。問題が続く場合は、画面右下のフィードバックボタンからお知らせください。",
      },
      {
        q: "複数のファイルを一度に処理できますか？",
        a: "PDF結合などの一部ツールでは、複数ファイルの同時処理が可能です。ただし、適正利用のため、1回の処理で大量のファイル（10ファイル以上）を処理する場合は、複数回に分けていただくことをお勧めします。",
      },
    ],
  },
  {
    category: "適正利用について",
    questions: [
      {
        q: "どのような使い方が「大量アクセス」とみなされますか？",
        a: "1時間に50ファイル以上、または1日200ファイル以上の処理を行った場合、サーバー保護のため自動的に一時制限がかかります。一般的な個人利用や業務利用（例：1日20-30枚の請求書作成、資料のPDF変換など）であれば、この制限に達することはほとんどありません。",
      },
      {
        q: "制限がかかった場合はどうなりますか？",
        a: "一時的に「しばらくお待ちください」というメッセージが表示されます。1時間後（時間制限の場合）または翌日（日次制限の場合）に自動的に解除されます。緊急の場合は、support@yamada-tools.jpまでご連絡ください。",
      },
      {
        q: "自動化ツールやボットでの利用は可能ですか？",
        a: "申し訳ございませんが、自動化ツール、ボット、スクレイピングツールなどを使用した大量アクセスはご遠慮ください。このような利用が検知された場合、IPアドレスレベルでのアクセス制限を行う場合があります。",
      },
    ],
  },
  {
    category: "トラブルシューティング",
    questions: [
      {
        q: "ファイルがアップロードできません",
        a: "インターネット接続が安定しているか、ファイルサイズが上限を超えていないかをご確認ください。ブラウザのキャッシュをクリアして再度お試しください。",
      },
      {
        q: "処理が終わりません",
        a: "ファイルサイズが大きい場合は処理に時間がかかることがあります。5分以上待っても変化がない場合は、ページを更新して再度お試しください。",
      },
    ],
  },
  {
    category: "ツールの精度について",
    questions: [
      {
        q: "請求書番号の検証結果は正確ですか？",
        a: "当ツールの検証結果は参考情報としてご利用ください。正式な確認は必ず国税庁の公式サイトで行ってください。",
      },
      {
        q: "税金計算ツールの結果は信頼できますか？",
        a: "税金計算ツールは一般的な計算方法に基づいていますが、個別の状況により異なる場合があります。正式な税務処理は、必ず税理士や会計士にご相談ください。",
      },
    ],
  },
  {
    category: "その他",
    questions: [
      {
        q: "バグを見つけました。どこに報告すればいいですか？",
        a: "画面右下の「フィードバック」ボタンからご報告ください。バグ報告は大歓迎です！",
      },
      {
        q: "新しいツールのリクエストはできますか？",
        a: "はい、フィードバックボタンからご要望をお寄せください。",
      },
      {
        q: "商用利用は可能ですか？",
        a: "はい、商用利用も可能です。ただし、適正利用ガイドラインの範囲内でご利用ください。",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-kon mb-4 text-center">
            よくある質問（FAQ）
          </h1>
          <p className="text-center text-gray-600 mb-8">
            山田ツールに関するよくある質問をまとめました
          </p>

          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <section key={categoryIndex} className="border-b border-gray-200 pb-8 last:border-b-0">
                <h2 className="text-2xl font-bold text-kon mb-6 flex items-center gap-2">
                  <span className="text-ai">📌</span>
                  {category.category}
                </h2>
                <div className="space-y-6">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-start gap-2">
                        <span className="text-kon flex-shrink-0 mt-1">Q.</span>
                        <span>{faq.q}</span>
                      </h3>
                      <div className="ml-6 text-gray-700 leading-relaxed flex items-start gap-2">
                        <span className="text-green-600 font-bold flex-shrink-0 mt-1">A.</span>
                        <p className="whitespace-pre-line">{faq.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-kon/10 to-ai/10 rounded-xl p-6 border border-kon/20">
            <h3 className="text-xl font-bold text-kon mb-3">解決しませんでしたか？</h3>
            <p className="text-gray-700 mb-4">
              上記で解決しない場合は、お気軽にお問い合わせください。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:support@yamada-tools.jp"
                className="bg-kon text-white px-6 py-3 rounded-lg hover:bg-kon/90 transition-colors font-medium text-center"
              >
                メールで問い合わせ
              </a>
              <Link
                href="/about/fair-usage"
                className="bg-white text-kon px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium border-2 border-kon text-center"
              >
                適正利用ガイドライン
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-kon hover:underline"
            >
              ← ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
