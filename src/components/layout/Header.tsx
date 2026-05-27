"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/common/ThemeToggle";
import { buttonCls } from "@/components/ui/Button";
import { pdfTools, documentTools, convertTools, imageTools, generatorTools, financeTools, insuranceTools, taxTools, careerTools, realestateTools, businessTools, healthTools, educationTools, debtTools, utilityTools } from "@/config/tools";
import { searchTools } from "@/lib/searchUtils";
import { getTotals } from "@/lib/value-tracker";

const toolsMenu = {
  title: "ツール",
  sections: [
    { name: "PDF", icon: "📄", href: "/pdf", tools: [{ name: "PDF結合", href: "/pdf/merge" },{ name: "PDF分割", href: "/pdf/split" },{ name: "PDF圧縮", href: "/pdf/compress" },{ name: "PDFに文字入力", href: "/pdf/text-input" },{ name: "PDF回転", href: "/pdf/rotate" }], moreLink: "/pdf" },
    { name: "画像", icon: "🖼️", href: "/image", tools: [{ name: "画像圧縮", href: "/image/compress" },{ name: "画像リサイズ", href: "/image/resize" },{ name: "QRコード作成", href: "/image/qr-code" },{ name: "画像反転", href: "/image/flip" },{ name: "モザイク加工", href: "/image/mosaic" }], moreLink: "/image" },
    { name: "書類作成", icon: "📝", href: "/document", tools: [{ name: "請求書", href: "/document/invoice" },{ name: "見積書", href: "/document/quotation" },{ name: "領収書", href: "/document/receipt" },{ name: "履歴書", href: "/document/resume" },{ name: "封筒印刷", href: "/generator/envelope-print" }], moreLink: "/document" },
    { name: "変換", icon: "🔄", href: "/convert", tools: [{ name: "全銀フォーマット", href: "/convert/bank-format" },{ name: "ふりがな変換", href: "/convert/furigana" },{ name: "和暦・西暦変換", href: "/convert/date-converter" },{ name: "全角・半角変換", href: "/convert/zenkaku-hankaku" },{ name: "縦書き変換", href: "/document/vertical-text" }], moreLink: "/convert" },
    { name: "計算・生成", icon: "⚡", href: "/generator", tools: [{ name: "パスワード生成", href: "/generator/password" },{ name: "文字数カウント", href: "/generator/character-count" },{ name: "消費税計算", href: "/generator/tax-calculator" },{ name: "電子ハンコ作成", href: "/generator/hanko" },{ name: "QRコード読取", href: "/generator/qr-reader" }], moreLink: "/generator" },
  ],
};

const calcMenu = {
  title: "計算・シミュレーター",
  sections: [
    { name: "金融・投資", icon: "💰", href: "/finance", tools: [{ name: "住宅ローン計算", href: "/finance/jutaku-loan" },{ name: "NISA計算機", href: "/finance/nisa-simulator" },{ name: "為替計算", href: "/finance/fx-calculator" }], moreLink: "/finance" },
    { name: "税金・保険", icon: "🧾", href: "/tax", tools: [{ name: "所得税計算", href: "/tax/income-tax-calculator" },{ name: "ふるさと納税", href: "/tax/furusato-nozei-calculator" },{ name: "相続税計算", href: "/tax/inheritance-tax-calculator" }], moreLink: "/tax" },
    { name: "キャリア・転職", icon: "💼", href: "/career", tools: [{ name: "転職シミュレーター", href: "/career/job-change-simulator" },{ name: "残業代計算", href: "/career/overtime-calculator" },{ name: "失業保険計算", href: "/career/unemployment-calculator" }], moreLink: "/career" },
    { name: "不動産・ビジネス", icon: "🏢", href: "/realestate", tools: [{ name: "賃貸vs購入", href: "/realestate/rent-vs-buy" },{ name: "法人化シミュレーター", href: "/business/incorporation-simulator" },{ name: "法人検索", href: "/business/houjin-search" }], moreLink: "/business" },
    { name: "健康・生活", icon: "🏥", href: "/health", tools: [{ name: "BMI計算", href: "/health/bmi-calculator" },{ name: "カロリー計算", href: "/health/calorie-calculator" },{ name: "借金返済", href: "/debt/repayment-simulator" }], moreLink: "/health" },
    { name: "教育・子育て", icon: "🎓", href: "/education", tools: [{ name: "教育費シミュレーター", href: "/education/education-cost-simulator" },{ name: "塾代計算機", href: "/education/cram-school-calculator" },{ name: "保育料計算", href: "/health/hoikuryo-calculator" }], moreLink: "/education" },
  ],
};

const ROLES = [
  { slug: "keieisha", name: "中小企業の経営者" },
  { slug: "freelance", name: "個人事業主・フリーランス" },
  { slug: "clinic", name: "クリニック・士業" },
  { slug: "fudousan", name: "不動産・建設" },
  { slug: "inshoku", name: "飲食店経営者" },
  { slug: "kazoku", name: "家族・将来設計" },
];

function ToolsDropdown() {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const hide = () => { timer.current = setTimeout(() => setOpen(false), 300); };

  return (
    <>
      <div className="self-stretch flex items-center" onMouseEnter={show} onMouseLeave={hide}>
        <button
          className="flex items-center gap-1 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium min-h-[44px]"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <span>ツール</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {open && (
        <div
          className="fixed top-14 left-0 w-full bg-white dark:bg-gray-800 shadow-xl border-t border-gray-100 dark:border-gray-700 z-[1000]"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <div className="max-w-7xl mx-auto px-6 py-5">

            {/* 業種別 */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">業種別</p>
              <div className="flex flex-wrap gap-2">
                {ROLES.map(r => (
                  <Link
                    key={r.slug}
                    href={`/for/${r.slug}`}
                    className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded-full text-kon dark:text-gray-200 hover:border-ai hover:text-ai dark:hover:border-ai dark:hover:text-ai transition-colors"
                  >
                    {r.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 my-4" />

            {/* 機能別 */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">機能別</p>
              <div className="grid grid-cols-5 gap-5">
                {toolsMenu.sections.map(section => (
                  <div key={section.name}>
                    <Link
                      href={section.href}
                      className="flex items-center gap-1.5 text-sm font-semibold text-kon dark:text-gray-200 mb-2 hover:text-sakura dark:hover:text-sakura transition-colors"
                    >
                      <span>{section.icon}</span>
                      <span>{section.name}</span>
                    </Link>
                    <ul className="space-y-1.5">
                      {section.tools.slice(0, 4).map(tool => (
                        <li key={tool.href}>
                          <Link href={tool.href} className="text-xs text-gray-600 dark:text-gray-400 hover:text-sakura dark:hover:text-sakura transition-colors block">
                            {tool.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href={section.moreLink} className="text-xs text-sakura hover:underline inline-flex items-center gap-0.5 pt-0.5">
                          すべて見る →
                        </Link>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 my-4" />

            {/* 計算・シミュレーター */}
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">計算・シミュレーター</p>
              <div className="grid grid-cols-6 gap-4">
                {calcMenu.sections.map(section => (
                  <div key={section.name}>
                    <Link
                      href={section.href}
                      className="flex items-center gap-1.5 text-sm font-semibold text-kon dark:text-gray-200 mb-2 hover:text-sakura dark:hover:text-sakura transition-colors"
                    >
                      <span>{section.icon}</span>
                      <span className="text-xs leading-tight">{section.name}</span>
                    </Link>
                    <ul className="space-y-1.5">
                      {section.tools.map(tool => (
                        <li key={tool.href}>
                          <Link href={tool.href} className="text-xs text-gray-600 dark:text-gray-400 hover:text-sakura dark:hover:text-sakura transition-colors block">
                            {tool.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href={section.moreLink} className="text-xs text-sakura hover:underline inline-flex items-center gap-0.5 pt-0.5">
                          すべて見る →
                        </Link>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasDashboard, setHasDashboard] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userBtnRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

  const allToolsForSearch = [...pdfTools, ...documentTools, ...convertTools, ...imageTools, ...generatorTools, ...financeTools, ...insuranceTools, ...taxTools, ...careerTools, ...realestateTools, ...businessTools, ...healthTools, ...educationTools, ...debtTools, ...utilityTools].filter(t => t.available);
  const searchResults = searchTools(searchQuery, allToolsForSearch);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    setHasDashboard(getTotals().totalUsages > 0);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setIsSearchOpen(true); }
      if (e.key === "Escape") { setIsSearchOpen(false); setShowUserMenu(false); setIsMenuOpen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => { if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus(); }, [isSearchOpen]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (userBtnRef.current && !userBtnRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) { document.addEventListener("click", close); return () => document.removeEventListener("click", close); }
  }, [showUserMenu]);

  const openUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showUserMenu && userBtnRef.current) {
      const rect = userBtnRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
    setShowUserMenu(!showUserMenu);
  };

  return (
    <>
      <header className="bg-kon text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img src="/logo-icon.webp" alt="山田ツール" width="32" height="32" className="w-8 h-8" />
              <span className="font-bold text-lg hidden sm:inline">山田ツール</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <ToolsDropdown />
              <Link href="/blog" className="hidden xl:flex px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium min-h-[44px] items-center">ブログ</Link>
              {hasDashboard && (
                <Link href="/dashboard" className="hidden xl:flex px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium min-h-[44px] items-center">ダッシュボード</Link>
              )}
              <Link href="/ai" className="hidden xl:flex px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium min-h-[44px] items-center">AI活用</Link>
              <Link href="/pricing" className="px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium min-h-[44px] flex items-center">料金</Link>
            </nav>

            {/* Right-side actions */}
            <div className="flex items-center gap-2">

              {/* Search icon button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                aria-label="ツールを検索 (⌘K)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Theme toggle — circular icon button (styled in ThemeToggle) */}
              <ThemeToggle />

              {/* Login / user menu */}
              {!loading && (user ? (
                <div className="relative">
                  <button
                    ref={userBtnRef}
                    onClick={openUserMenu}
                    className="flex items-center gap-2 px-3 py-1.5 bg-sakura hover:bg-sakura/80 rounded-lg transition-colors min-w-[44px] min-h-[44px] text-[#223A70]"
                  >
                    <span>👤</span>
                    <span className="text-sm max-w-[80px] truncate hidden sm:inline">{user.email.split("@")[0]}</span>
                  </button>
                </div>
              ) : (
                <Link href="/auth/login" className={buttonCls('primary', 'sm')}>
                  ログイン
                </Link>
              ))}

              {/* Hamburger */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                aria-label="メニュー"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* User menu portal */}
      {mounted && showUserMenu && user && createPortal(
        <div
          className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 text-gray-800 dark:text-gray-200 z-[1000] w-48"
          style={{ top: dropdownPos.top, right: dropdownPos.right }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-2 border-b dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
          <div className="px-4 py-2 text-sm">
            <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded text-xs">
              {user.effective_plan === "team" ? "TEAM" : user.effective_plan === "pro" ? "PRO" : user.effective_plan === "pro_trial" ? "PRO (試用)" : "FREE"}
            </span>
          </div>
          <Link href="/account" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm" onClick={() => setShowUserMenu(false)}>⚙️ アカウント管理</Link>
          {user.effective_plan === "team" ? null : user.effective_plan === "pro" ? (
            <Link href="/pricing" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setShowUserMenu(false)}>⭐ TEAMにアップグレード</Link>
          ) : (
            <Link href="/pricing" className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setShowUserMenu(false)}>⭐ PROにアップグレード</Link>
          )}
          <button onClick={async () => { await logout(); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-danger">ログアウト</button>
        </div>,
        document.body
      )}

      {/* Mobile drawer */}
      {mounted && isMenuOpen && createPortal(
        <div className="fixed inset-0 z-[900] flex" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative ml-auto w-72 max-w-[85vw] h-full bg-kon text-white overflow-y-auto flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <span className="font-bold text-lg">メニュー</span>
              <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full" aria-label="閉じる">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 py-4">
              <div className="mb-4">
                <div className="px-4 py-2 text-xs text-white/60 uppercase tracking-wide">業種別</div>
                {[
                  { slug: "keieisha", name: "中小企業の経営者向け", icon: "🏢" },
                  { slug: "freelance", name: "フリーランス向け", icon: "💼" },
                  { slug: "clinic", name: "クリニック・士業向け", icon: "🏥" },
                  { slug: "fudousan", name: "不動産・建設向け", icon: "🏠" },
                  { slug: "inshoku", name: "飲食店向け", icon: "🍜" },
                  { slug: "kazoku", name: "家族向け", icon: "👨‍👩‍👧" },
                ].map((r) => (
                  <Link key={r.slug} href={`/for/${r.slug}`} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                    <span className="text-xl">{r.icon}</span><span className="font-medium">{r.name}</span>
                  </Link>
                ))}
              </div>
              <div className="mb-4">
                <div className="px-4 py-2 text-xs text-white/60 uppercase tracking-wide">機能別</div>
                {toolsMenu.sections.map((s) => (
                  <Link key={s.href} href={s.href} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                    <span className="text-xl">{s.icon}</span><span className="font-medium">{s.name}</span>
                  </Link>
                ))}
              </div>
              <div className="mb-4">
                <div className="px-4 py-2 text-xs text-white/60 uppercase tracking-wide">計算・シミュレーター</div>
                {calcMenu.sections.map((s) => (
                  <Link key={s.href} href={s.href} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                    <span className="text-xl">{s.icon}</span><span className="font-medium">{s.name}</span>
                  </Link>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4">
                {hasDashboard && (
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"><span className="text-xl">📊</span><span className="font-medium">節約ダッシュボード</span></Link>
                )}
                <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"><span className="text-xl">📝</span><span className="font-medium">ブログ</span></Link>
                <Link href="/ai" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"><span className="text-xl">🤖</span><span className="font-medium">AI活用</span></Link>
                <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"><span className="text-xl">💳</span><span className="font-medium">料金プラン</span></Link>
              </div>
              {user && (
                <div className="border-t border-white/10 pt-4 mt-2">
                  <Link href="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"><span className="text-xl">⚙️</span><span className="font-medium">アカウント管理</span></Link>
                  <Link href="/pricing" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"><span className="text-xl">⭐</span><span className="font-medium">料金・アップグレード</span></Link>
                </div>
              )}
            </nav>
          </div>
        </div>,
        document.body
      )}

      {/* ⌘K search modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/50 flex items-start justify-center pt-20" onClick={() => setIsSearchOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xl mx-4 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b dark:border-gray-700 pb-4">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ツールを検索..."
                className="flex-1 text-lg text-gray-900 dark:text-gray-100 dark:bg-transparent outline-none"
              />
              <kbd className="text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-400 px-2 py-1 rounded text-gray-500">ESC</kbd>
            </div>
            {searchResults.length > 0 ? (
              <div className="pt-4 max-h-80 overflow-y-auto">
                {searchResults.map((tool) => (
                  <Link key={tool.id} href={tool.path} onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <span className="text-2xl">{tool.icon}</span>
                    <div className="flex-1"><p className="font-bold text-gray-900 dark:text-gray-100">{tool.nameJa}</p><p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{tool.description}</p></div>
                    <span className="text-gray-400">→</span>
                  </Link>
                ))}
              </div>
            ) : searchQuery.length >= 2 ? (
              <div className="pt-4 text-sm text-gray-500 dark:text-gray-400 text-center">該当するツールが見つかりませんでした</div>
            ) : (
              <div className="pt-4 text-sm text-gray-500 dark:text-gray-400 text-center">キーワードを入力してツールを検索</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
