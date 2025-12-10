'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on homepage
  if (pathname === '/') return null;

  // Parse pathname into breadcrumb segments
  const segments = pathname.split('/').filter(Boolean);
  
  // Category name mapping
  const categoryNames: { [key: string]: string } = {
    'pdf': 'PDFツール',
    'image': '画像ツール',
    'document': '文書作成',
    'convert': '変換ツール',
    'generator': '生成・計算',
    'legal': '法的情報',
    'about': '会社情報',
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
    'bank-format': '銀行フォーマット変換',
    
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
    else if (index === 1) {
      name = toolNames[segment] || segment;
    }

    breadcrumbs.push({
      name,
      href: isLast ? '' : currentPath, // Last item not clickable
    });
  });

  return (
    <nav aria-label="Breadcrumb" className="bg-gray-50 border-b">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href || index} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-gray-400">›</span>
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-kon hover:text-sakura transition-colors hover:underline"
                >
                  {crumb.name}
                </Link>
              ) : (
                <span className="text-gray-600 font-medium">
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
