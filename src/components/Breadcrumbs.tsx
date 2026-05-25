'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Breadcrumbs() {
  const pathname = usePathname();
  // FIX 6: track page title to show article title instead of raw slug
  const [pageTitle, setPageTitle] = useState<string>('');

  useEffect(() => {
    // document.title format: "記事タイトル | 山田ツール" → strip the suffix
    const title = document.title.replace(/ \| 山田ツール$/, '').trim();
    setPageTitle(title);
  }, [pathname]);

  // Don't show breadcrumbs on homepage
  if (pathname === '/') return null;

  // Parse pathname into breadcrumb segments
  const segments = pathname.split('/').filter(Boolean);

  // Category name mapping
  const categoryNames: { [key: string]: string } = {
    'pdf': 'PDF・ファイル',
    'image': '画像ツール',
    'document': 'ビジネス書類',
    'convert': '変換ツール',
    'generator': '暮らし・便利',
    'legal': '法的情報',
    'about': '会社情報',
    'pricing': '料金プラン',
    'finance': '金融・資産運用',
    'tax': '税金・確定申告',
    'souzoku-touki': '相続・登記',
    'blog': 'ブログ',
    'office': 'オフィスツール',
    'health': '健康・医療',
    'career': 'キャリア・収入',
    'realestate': '不動産・住まい',
    'insurance': '保険',
    'education': '学習・教育',
    'business': 'ビジネス・法人',
    'en': 'English',
    'debt': '借金・返済',
    'utility': 'ユーティリティ',
    'auto': '自動車',
    'parenting': '子育て・家族',
    'tools': 'ツール一覧',
  };

  // Tool name mapping (you can expand this)
  const toolNames: { [key: string]: string } = {
    // PDF Tools
    'merge': 'PDF結合',
    'compress': 'PDF圧縮',
    'split': 'PDF分割',
    'rotate': 'PDF回転',
    'pdf-to-word': 'PDF→Word変換',
    'pdf-to-excel': 'PDF→Excel変換',
    'pdf-to-ppt': 'PDF→PowerPoint変換',
    'pdf-to-image': 'PDF→画像変換',
    'word-to-pdf': 'Word→PDF変換',
    'excel-to-pdf': 'Excel→PDF変換',
    'ppt-to-pdf': 'PowerPoint→PDF変換',
    'image-to-pdf': '画像→PDF変換',
    'ocr': 'PDF OCR',
    'watermark': 'PDF透かし',
    'protect': 'PDFパスワード保護',
    'unlock': 'PDFロック解除',
    'page-numbers': 'PDFページ番号',
    'reorder': 'PDFページ並替',
    'delete-pages': 'PDFページ削除',
    'sign': 'PDF電子署名',

    // Image Tools
    'resize': '画像リサイズ',
    'crop': '画像切り抜き',
    'format-convert': '画像形式変換',
    'qr-code': 'QRコード生成',

    // Document Tools
    'invoice': '請求書作成',
    'quotation': '見積書作成',
    'receipt': '領収書作成',
    'delivery-slip': '納品書作成',
    'resume': '履歴書作成',
    'cover-letter': '送付状作成',
    'business-card': '名刺作成',
    'fax-cover': 'FAX送付状',
    'business-email': 'ビジネスメール',
    'vertical-text': '縦書き文書',

    // Conversion Tools
    'wareki-seireki': '和暦西暦変換',
    'zenkaku-hankaku': '全角半角変換',
    'phone-formatter': '電話番号整形',
    'postcode': '郵便番号検索',
    'date-converter': '日付変換',
    'unit': '単位変換',
    'base64': 'Base64変換',
    'url-encode': 'URLエンコード',
    'furigana': 'ふりがな生成',
    'bank-format': '全銀フォーマット変換',

    // Generator Tools
    'password': 'パスワード生成',
    'qr-reader': 'QRコード読取',
    't-number': 'インボイス番号検証',
    'tax-calculator': '税金計算',
    'salary-calc': '給与計算',
    'nenmatsu-calc': '年末調整計算',
    'age-calc': '年齢計算',
    'holiday-checker': '祝日チェック',
    'hanko': 'デジタル判子',
    'envelope-print': '封筒印刷',
    'lorem-ipsum': 'ダミーテキスト',
    'character-count': '文字数カウント',
    'text-case': '大文字小文字変換',
    'text-diff': 'テキスト差分比較',
    'regex-test': '正規表現テスト',
    'json-format': 'JSON整形',
    'hash': 'ハッシュ生成',
    'color-convert': 'カラーコード変換',
    'random-picker': 'ランダム選択',
    'nenkai':    '忘年会・新年会 抽選ツール',
    'christmas': 'クリスマス プレゼント交換抽選ツール',
    'seat':      '席替えランダム決めツール',
    'password-gen': 'パスワード生成器',
    'password-zip': 'ZIPパスワード生成',

    // Legal/About Pages
    'terms': '利用規約',
    'privacy': 'プライバシーポリシー',
    'tokushoho': '特定商取引法',
    'faq': 'よくある質問',
    'fair-usage': '適正利用ガイドライン',
    'transparency': '運営方針',
    'company': '会社概要',
    'business': 'Business',
    'story': '開発者ストーリー',

    // Additional PDF slugs
    'text-input': 'PDFに文字入力',
    'combini-print': 'コンビニ印刷用余白追加',

    // Additional image slugs
    'compress-img': '画像圧縮',
    'mosaic': '画像モザイク',

    // Company Formation Tools (会社設立ツール)
    'setsuritsu-hiyo': '会社設立費用シミュレーター',
    'kaisha-shindan': '会社形態診断ツール',
    'kesanki-sim': '決算期シミュレーター',
    'houjin-iji-hiyo': '法人維持費シミュレーター',
    'micro-houjin': 'マイクロ法人シミュレーター',
    'setsuritsu-todoke': '設立後届出ナビゲーター',
    'jigyou-mokuteki': '事業目的ジェネレーター',
    'shihonkin-guide': '資本金決定ガイド',
    'setsuritsu-schedule': '設立スケジュールシミュレーター',
    'kyoninka-checker': '許認可チェッカー',
    // EN tools
    'formation-cost': 'Formation Cost Calculator',
    'visa-checker': 'Business Manager Visa Checker',
    'company-search': 'Company Search',
  };

  // Build breadcrumb path
  const breadcrumbs = [
    { name: 'ホーム', href: '/' },
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    let name = segment;

    // First level: Category
    if (index === 0) {
      name = categoryNames[segment] || segment;
    }
    // Second level: Tool/Page name
    // FIX 6: for last segment, fall back to document.title-derived pageTitle
    else {
      name = toolNames[segment] || (isLast && pageTitle) || segment;
    }

    breadcrumbs.push({
      name,
      href: isLast ? '' : currentPath,
    });
  });

  return (
    <nav aria-label="Breadcrumb" className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href || index} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-gray-400 dark:text-gray-500">›</span>
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-kon dark:text-gray-300 hover:text-sakura transition-colors hover:underline"
                >
                  {crumb.name}
                </Link>
              ) : (
                <span className="text-gray-600 dark:text-gray-300 font-medium line-clamp-1">
                  {crumb.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
