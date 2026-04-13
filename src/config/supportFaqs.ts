export interface FAQ {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
  category: string;
}

export const SUPPORT_FAQS: FAQ[] = [
  {
    id: 'account-1',
    keywords: ['パスワード', '変更', 'password', 'リセット'],
    question: 'パスワードを変更したい',
    answer: 'パスワードの変更は「アカウント管理」→「プロフィール」から行えます。「パスワードをリセット」ボタンをクリックすると、登録メールアドレスにリセットリンクが送信されます。',
    category: 'アカウント',
  },
  {
    id: 'account-2',
    keywords: ['メール', 'アドレス', '変更', 'email'],
    question: 'メールアドレスを変更したい',
    answer: '現在、メールアドレスの変更は直接サポートにお問い合わせください。セキュリティ確認の上、変更いたします。support@yamada-tools.jp までご連絡ください。',
    category: 'アカウント',
  },
  {
    id: 'account-3',
    keywords: ['退会', '解約', 'アカウント削除', '削除'],
    question: 'アカウントを削除したい',
    answer: 'アカウントの削除をご希望の場合は、support@yamada-tools.jp までご連絡ください。なお、有料プランをご契約中の場合は、先にサブスクリプションのキャンセルが必要です。',
    category: 'アカウント',
  },
  {
    id: 'plan-1',
    keywords: ['料金', 'プラン', '価格', '費用', 'いくら'],
    question: '料金プランについて教えてください',
    answer: '山田ツールには4つのプランがあります。\n・FREE: 無料（1日5回まで）\n・PRO: ¥980/月（無制限利用）\n・TEAM: ¥1,480/月（チーム機能付き）\n・ENTERPRISE: お問い合わせください\n\n詳細は料金ページをご確認ください。',
    category: '料金',
  },
  {
    id: 'plan-2',
    keywords: ['アップグレード', 'プラン変更', '変更', 'PRO', 'TEAM'],
    question: 'プランをアップグレードしたい',
    answer: '「アカウント管理」→「サブスクリプション」ページから、いつでもプランをアップグレードできます。アップグレードは即時反映され、差額は日割り計算されます。',
    category: '料金',
  },
  {
    id: 'plan-3',
    keywords: ['キャンセル', '解約', '退会', 'サブスクリプション'],
    question: 'サブスクリプションをキャンセルしたい',
    answer: '「アカウント管理」→「サブスクリプション」→「支払い方法・解約の管理」から解約できます。解約後も、現在の請求期間が終了するまでPRO/TEAM機能をご利用いただけます。',
    category: '料金',
  },
  {
    id: 'plan-4',
    keywords: ['請求書', '領収書', 'インボイス', 'invoice', 'receipt'],
    question: '請求書・領収書が欲しい',
    answer: '「アカウント管理」→「請求履歴」から、過去のすべての請求書・領収書をPDFでダウンロードできます。インボイス制度対応の適格請求書も発行可能です。',
    category: '料金',
  },
  {
    id: 'tool-1',
    keywords: ['PDF', '結合', 'merge', '合体'],
    question: 'PDFを結合したい',
    answer: '「ツール」→「PDF」→「PDF結合」をご利用ください。複数のPDFファイルをドラッグ&ドロップで追加し、順番を並び替えて結合できます。FREE: 最大10MB、PRO/TEAM: 最大200MBまで対応しています。',
    category: 'ツール',
  },
  {
    id: 'tool-2',
    keywords: ['PDF', '圧縮', 'compress', '軽く', 'サイズ'],
    question: 'PDFのサイズを小さくしたい',
    answer: '「ツール」→「PDF」→「PDF圧縮」をご利用ください。画質を維持しながらファイルサイズを最大80%削減できます。圧縮レベルは3段階から選択可能です。',
    category: 'ツール',
  },
  {
    id: 'tool-3',
    keywords: ['画像', '圧縮', 'compress', '軽く', 'サイズ'],
    question: '画像を圧縮したい',
    answer: '「ツール」→「画像」→「画像圧縮」をご利用ください。JPEG/PNG/WebP形式に対応し、品質を保ちながらファイルサイズを削減します。一括で20枚まで処理可能です。',
    category: 'ツール',
  },
  {
    id: 'tool-4',
    keywords: ['封筒', '印刷', 'envelope', '宛名'],
    question: '封筒印刷の使い方を教えてください',
    answer: '「ツール」→「ジェネレーター」→「封筒印刷」をご利用ください。\n\n1. 封筒サイズを選択\n2. 差出人・宛先を入力\n3. プレビューで確認\n4. 印刷ボタンをクリック\n\nPRO以上ではバーコード/QRコード、TEAMではラベルシート印刷も利用可能です。',
    category: 'ツール',
  },
  {
    id: 'tool-5',
    keywords: ['CSV', 'インポート', '一括', 'アップロード'],
    question: 'CSVで一括インポートしたい',
    answer: '封筒印刷ツールでCSV一括インポートが利用可能です。\n・FREE: 5件まで\n・PRO: 50件まで\n・TEAM: 500件まで\n\nCSVは「名前,郵便番号,住所」の形式でご用意ください。',
    category: 'ツール',
  },
  {
    id: 'file-1',
    keywords: ['ファイル', 'サイズ', '上限', '制限', 'MB'],
    question: 'アップロードできるファイルサイズの上限は？',
    answer: 'ファイルサイズの上限はプランによって異なります。\n・FREE: 10MB\n・PRO/TEAM: 200MB\n\nより大きなファイルを処理したい場合は、PROプランへのアップグレードをご検討ください。',
    category: 'ファイル',
  },
  {
    id: 'file-2',
    keywords: ['利用回数', '制限', '1日', '回数'],
    question: '1日の利用回数制限は？',
    answer: 'FREEプランは1日5回までの制限があります。PRO/TEAMプランは無制限でご利用いただけます。利用回数は毎日0時（日本時間）にリセットされます。',
    category: 'ファイル',
  },
  {
    id: 'team-1',
    keywords: ['チーム', '招待', 'メンバー', 'invite'],
    question: 'チームメンバーを招待したい',
    answer: 'TEAMプランをご契約の場合、「アカウント管理」→「チーム管理」からメンバーを招待できます。招待したいメールアドレスを入力すると、招待リンクが送信されます。最大5名まで追加可能です。',
    category: 'チーム',
  },
  {
    id: 'team-2',
    keywords: ['チーム', '共有', 'アドレス帳', 'share'],
    question: 'チームでアドレス帳を共有したい',
    answer: 'TEAMプランでは、アドレス帳がクラウドで共有されます。封筒印刷ツールで登録した住所は、同じチームの全メンバーが利用できます。最大2,000件まで保存可能です。',
    category: 'チーム',
  },
  {
    id: 'security-1',
    keywords: ['セキュリティ', '安全', 'データ', 'プライバシー'],
    question: 'アップロードしたファイルは安全ですか？',
    answer: 'はい、安全です。アップロードされたファイルは処理完了後、自動的にサーバーから削除されます。すべての通信はSSL/TLSで暗号化されており、日本国内のサーバーで処理されます。',
    category: 'セキュリティ',
  },
  {
    id: 'contact-1',
    keywords: ['問い合わせ', 'サポート', '連絡', 'メール', 'contact'],
    question: 'サポートに問い合わせたい',
    answer: 'メールでのお問い合わせ: support@yamada-tools.jp\n\n・FREE/PRO: メールサポート（2営業日以内に返信）\n・TEAM: 優先メールサポート（1営業日以内に返信）\n・ENTERPRISE: 専任サポート担当',
    category: 'サポート',
  },
];

export function findMatchingFAQs(query: string): FAQ[] {
  const normalizedQuery = query.toLowerCase();

  return SUPPORT_FAQS
    .map(faq => {
      const matchCount = faq.keywords.filter(keyword =>
        normalizedQuery.includes(keyword.toLowerCase())
      ).length;
      return { faq, matchCount };
    })
    .filter(item => item.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 3)
    .map(item => item.faq);
}
