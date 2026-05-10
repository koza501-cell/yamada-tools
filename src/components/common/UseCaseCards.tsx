"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const USE_CASES = [
  {
    icon: '📄', title: '請求書・見積書・納品書',
    desc: '請求書・見積書・納品書をPDFで作成',
    moreHref: '/document',
    links: [{ label: '請求書作成', href: '/document/invoice' }, { label: '見積書', href: '/document/quotation' }, { label: '納品書', href: '/document/delivery-slip' }, { label: '送付状', href: '/document/cover-letter' }, { label: '領収書', href: '/document/receipt' }],
  },
  {
    icon: '✉️', title: '封筒印刷・宛名書き',
    desc: '封筒の宛名印刷・名刺・はがき',
    moreHref: '/generator/envelope-print',
    links: [{ label: '封筒印刷', href: '/generator/envelope-print' }, { label: '名刺作成', href: '/document/business-card' }, { label: 'QRコード', href: '/image/qr-code' }, { label: 'FAX送付状', href: '/document/fax-cover' }],
  },
  {
    icon: '📊', title: 'PDFを編集',
    desc: '圧縮・結合・分割・回転',
    moreHref: '/pdf',
    links: [{ label: 'PDF圧縮', href: '/pdf/compress' }, { label: 'PDF結合', href: '/pdf/merge' }, { label: 'PDF分割', href: '/pdf/split' }, { label: 'PDF回転', href: '/pdf/rotate' }, { label: 'PDF文字入力', href: '/pdf/text-input' }],
  },
  {
    icon: '🏦', title: '全銀フォーマット・インボイス',
    desc: '全銀フォーマット・請求書・インボイス対応',
    moreHref: '/convert/bank-format',
    links: [{ label: '全銀変換', href: '/convert/bank-format' }, { label: 'インボイス番号確認', href: '/generator/t-number' }, { label: '電子印鑑', href: '/generator/hanko' }, { label: '年末調整', href: '/generator/nenmatsu-calc' }],
  },
  {
    icon: '🖼️', title: '画像加工',
    desc: '圧縮・変換・リサイズ',
    moreHref: '/image',
    links: [{ label: '画像圧縮', href: '/image/compress' }, { label: 'リサイズ', href: '/image/resize' }, { label: 'フォーマット変換', href: '/image/format-convert' }, { label: 'モザイク', href: '/image/mosaic' }],
  },
  {
    icon: '🔢', title: '税金計算・年末調整',
    desc: '税金・ローン・年金計算',
    moreHref: '/finance',
    links: [{ label: '住宅ローン', href: '/finance/jutaku-loan' }, { label: 'NISA計算', href: '/finance/nisa-simulator' }, { label: '消費税計算', href: '/generator/tax-calculator' }, { label: 'ふるさと納税', href: '/tax/furusato-nozei-calculator' }],
  },
];

export default function UseCaseCards() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {USE_CASES.map((uc) => (
        <div
          key={uc.title}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 cursor-pointer"
          onClick={() => router.push(uc.moreHref)}
        >
          <div className="text-3xl mb-2">{uc.icon}</div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{uc.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{uc.desc}</p>
          <div className="flex flex-wrap gap-2">
            {uc.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-kon dark:text-gray-300 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
