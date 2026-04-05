"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { pdfTools, documentTools, convertTools, imageTools, generatorTools, financeTools, insuranceTools, taxTools, careerTools, realestateTools, businessTools, healthTools, educationTools, debtTools, utilityTools } from "@/config/tools";

const toolsMenu = {
  title: "ツール",
  sections: [
    {
      name: "PDF",
      icon: "📄",
      href: "/pdf",
      tools: [
        { name: "PDF結合", href: "/pdf/merge" },
        { name: "PDF分割", href: "/pdf/split" },
        { name: "PDF圧縮", href: "/pdf/compress" },
        { name: "PDFに文字入力", href: "/pdf/text-input" },
        { name: "PDF回転", href: "/pdf/rotate" },
      ],
      moreLink: "/pdf",
    },
    {
      name: "画像",
      icon: "🖼️",
      href: "/image",
      tools: [
        { name: "画像圧縮", href: "/image/compress" },
        { name: "画像リサイズ", href: "/image/resize" },
        { name: "QRコード作成", href: "/image/qr-code" },
        { name: "画像反転", href: "/image/flip" },
        { name: "モザイク加工", href: "/image/mosaic" },
      ],
      moreLink: "/image",
    },
    {
      name: "書類作成",
      icon: "📝",
      href: "/document",
      tools: [
        { name: "請求書", href: "/document/invoice" },
        { name: "見積書", href: "/document/quotation" },
        { name: "領収書", href: "/document/receipt" },
        { name: "履歴書", href: "/document/resume" },
        { name: "封筒印刷", href: "/generator/envelope-print" },
      ],
      moreLink: "/document",
    },
    {
      name: "変換",
      icon: "🔄",
      href: "/convert",
      tools: [
        { name: "全銀フォーマット", href: "/convert/bank-format" },
        { name: "ふりがな変換", href: "/convert/furigana" },
        { name: "和暦・西暦変換", href: "/convert/wareki-seireki" },
        { name: "全角・半角変換", href: "/convert/zenkaku-hankaku" },
        { name: "縦書き変換", href: "/document/vertical-text" },
      ],
      moreLink: "/convert",
    },
  ],
};

const calcMenu = {
  title: "計算・シミュレーター",
  sections: [
    {
      name: "金融・投資",
      icon: "💰",
      href: "/finance",
      tools: [
        { name: "住宅ローン計算", href: "/finance/jutaku-loan" },
        { name: "NISA計算機", href: "/finance/nisa-simulator" },
        { name: "老後資金計算", href: "/finance/retirement-simulator" },
        { name: "為替計算", href: "/finance/fx-calculator" },
      ],
      moreLink: "/finance",
    },
    {
      name: "税金・保険",
      icon: "🧾",
      href: "/tax",
      tools: [
        { name: "所得税計算", href: "/tax/income-tax-calculator" },
        { name: "ふるさと納税", href: "/tax/furusato-nozei-calculator" },
        { name: "相続税計算", href: "/tax/inheritance-tax-calculator" },
        { name: "生命保険必要額", href: "/insurance/life-insurance-calculator" },
      ],
      moreLink: "/tax",
    },
    {
      name: "キャリア・転職",
      icon: "💼",
      href: "/career",
      tools: [
        { name: "転職シミュレーター", href: "/career/job-change-simulator" },
        { name: "残業代計算", href: "/career/overtime-calculator" },
        { name: "失業保険計算", href: "/career/unemployment-calculator" },
        { name: "年収交渉ツール", href: "/career/salary-negotiation" },
      ],
      moreLink: "/career",
    },
    {
      name: "不動産・ビジネス",
      icon: "🏢",
      href: "/realestate",
      tools: [
        { name: "賃貸vs購入", href: "/realestate/rent-vs-buy" },
        { name: "引越し費用", href: "/realestate/moving-cost-calculator" },
        { name: "法人化シミュレーター", href: "/business/incorporation-simulator" },
        { name: "役員報酬最適化", href: "/business/director-salary-optimizer" },
      ],
      moreLink: "/business",
    },
  ],
};

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Search functionality for global modal
  const allToolsForSearch = [...pdfTools, ...documentTools, ...convertTools, ...imageTools, ...generatorTools, ...financeTools, ...insuranceTools, ...taxTools, ...careerTools, ...realestateTools, ...businessTools, ...healthTools, ...educationTools, ...debtTools, ...utilityTools].filter(tool => tool.available);
  const searchResults = searchQuery.trim().length >= 2 ? allToolsForSearch.filter(tool => tool.nameJa.toLowerCase().includes(searchQuery.toLowerCase()) || tool.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || tool.description.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8) : [];
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setShowUserMenu(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClick = () => setShowUserMenu(false);
    if (showUserMenu) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [showUserMenu]);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const MegaDropdown = ({ menu }: { menu: typeof toolsMenu }) => (
    <div 
      className="fixed top-14 left-0 w-full bg-white shadow-xl border-t border-gray-100 z-50"
      onMouseEnter={() => handleMouseEnter(menu.title)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-4 gap-8">
          {menu.sections.map((section) => (
            <div key={section.name}>
              <Link href={section.href} className="flex items-center gap-2 text-kon font-semibold mb-3 hover:text-sakura transition-colors">
                <span>{section.icon}</span>
                <span>{section.name}</span>
              </Link>
              <ul className="space-y-2">
                {section.tools.map((tool) => (
                  <li key={tool.href}>
                    <Link href={tool.href} className="text-sm text-gray-600 hover:text-sakura transition-colors block py-1">{tool.name}</Link>
                  </li>
                ))}
                <li>
                  <Link href={section.moreLink} className="text-sm text-sakura hover:underline inline-flex items-center gap-1 pt-1">すべて見る →</Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="bg-kon text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img src="/logo-icon.webp" alt="山田ツール" className="w-8 h-8" />
              <span className="font-bold text-lg hidden sm:inline">山田ツール</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              <div className="relative" onMouseEnter={() => handleMouseEnter("tools")} onMouseLeave={handleMouseLeave}>
                <button className="flex items-center gap-1 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium">
                  <span>ツール</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {activeDropdown === "tools" && <MegaDropdown menu={toolsMenu} />}
              </div>

              <div className="relative" onMouseEnter={() => handleMouseEnter("calc")} onMouseLeave={handleMouseLeave}>
                <button className="flex items-center gap-1 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium">
                  <span>計算・シミュレーター</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {activeDropdown === "calc" && <MegaDropdown menu={calcMenu} />}
              </div>

              <Link href="/blog" className="px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium">ブログ</Link>
              <Link href="/pricing" className="px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium">料金</Link>
            </nav>

            <div className="flex items-center gap-2">
              <button onClick={() => setIsSearchOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" aria-label="検索">
                <span>🔍</span>
                <span className="text-sm hidden md:inline">検索</span>
                <kbd className="hidden xl:inline-block text-xs bg-white/20 px-1.5 py-0.5 rounded">⌘K</kbd>
              </button>

              {!loading && (
                user ? (
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }} className="flex items-center gap-2 px-3 py-1.5 bg-sakura hover:bg-sakura/80 rounded-lg transition-colors">
                      <span>👤</span>
                      <span className="text-sm max-w-[80px] truncate hidden sm:inline">{user.email.split('@')[0]}</span>
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-gray-800 z-50">
                        <div className="px-4 py-2 border-b text-sm text-gray-500 truncate">{user.email}</div>
                        <div className="px-4 py-2 text-sm"><span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs">{user.plan === 'free' ? 'FREE' : 'PRO'}</span></div>
                        <Link href="/pricing" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setShowUserMenu(false)}>⭐ PROにアップグレード</Link>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600">ログアウト</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/auth/login" className="flex items-center gap-2 px-3 py-1.5 bg-sakura hover:bg-sakura/80 rounded-lg transition-colors text-sm font-medium">
                    <span className="hidden sm:inline">ログイン</span>
                    <span className="sm:hidden">👤</span>
                  </Link>
                )
              )}

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="メニュー">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <nav className="lg:hidden py-4 border-t border-white/10">
              <div className="mb-4">
                <div className="px-4 py-2 text-xs text-white/60 uppercase tracking-wide">ツール</div>
                {toolsMenu.sections.map((section) => (
                  <Link key={section.href} href={section.href} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                    <span className="text-xl">{section.icon}</span>
                    <span className="font-medium">{section.name}</span>
                  </Link>
                ))}
              </div>
              <div className="mb-4">
                <div className="px-4 py-2 text-xs text-white/60 uppercase tracking-wide">計算・シミュレーター</div>
                {calcMenu.sections.map((section) => (
                  <Link key={section.href} href={section.href} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                    <span className="text-xl">{section.icon}</span>
                    <span className="font-medium">{section.name}</span>
                  </Link>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4">
                <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                  <span className="text-xl">📝</span>
                  <span className="font-medium">ブログ</span>
                </Link>
                <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                  <span className="text-xl">💳</span>
                  <span className="font-medium">料金プラン</span>
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-start justify-center pt-20" onClick={() => setIsSearchOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b pb-4">
              <span className="text-2xl">🔍</span>
              <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ツールを検索..." className="flex-1 text-lg text-gray-900 outline-none" />
              <kbd className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">ESC</kbd>
            </div>
            {searchResults.length > 0 ? (
              <div className="pt-4 max-h-80 overflow-y-auto">
                {searchResults.map((tool) => (
                  <Link key={tool.id} href={tool.path} onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="text-2xl">{tool.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{tool.nameJa}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{tool.description}</p>
                    </div>
                    <span className="text-gray-400">→</span>
                  </Link>
                ))}
              </div>
            ) : searchQuery.length >= 2 ? (
              <div className="pt-4 text-sm text-gray-500 text-center">該当するツールが見つかりませんでした</div>
            ) : (
              <div className="pt-4 text-sm text-gray-500 text-center">キーワードを入力してツールを検索</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
