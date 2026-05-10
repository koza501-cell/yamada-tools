import Link from "next/link";
import { themeColors, NicheTheme } from "@/config/niches";
import { NicheIcon } from "@/components/home/NicheIcons";

// ============================================================
// SHARED HUB LAYOUT
// Used by all 5 niche hubs for consistent design.
// Each hub provides its own data via props.
// ============================================================

export interface HubTool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;       // emoji from tools.ts (legacy, still readable)
  popular?: boolean;
  isNew?: boolean;
}

export interface HubSection {
  title: string;
  subtitle?: string;
  badge?: string;     // e.g. "基本", "変換", "保護"
  tools: HubTool[];
  cols?: 3 | 4 | 5;   // grid columns on desktop
}

export interface HubLayoutProps {
  niche: {
    iconName: string;
    name: string;
    eyebrow: string;          // small label above headline e.g. "BUSINESS DOCUMENTS"
    headline: string;         // main H1
    tagline: string;          // subtitle
    description: string;      // paragraph below tagline
    theme: NicheTheme;
    primaryCta?: { label: string; url: string };
    secondaryCta?: { label: string; url: string };
  };
  sections: HubSection[];
  children?: React.ReactNode;  // optional extra content (FAQs, intro text, etc.)
  beforeSections?: React.ReactNode;  // optional content before tool sections
}

export default function HubLayout({
  niche,
  sections,
  children,
  beforeSections,
}: HubLayoutProps) {
  const colors = themeColors[niche.theme];

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-gray-900">
      {/* ============ Hero ============ */}
      <section
        className="relative border-b-4"
        style={{
          background: colors.bg,
          borderColor: colors.accent,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Icon block */}
            <div
              className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.7)", color: colors.iconColor }}
            >
              <NicheIcon name={niche.iconName} size={32} />
            </div>

            {/* Text block */}
            <div className="flex-1 min-w-0">
              <p
                className="text-[11px] tracking-widest uppercase font-medium mb-2"
                style={{ color: colors.textMuted }}
              >
                {niche.eyebrow}
              </p>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3"
                style={{ color: colors.text }}
              >
                {niche.headline}
              </h1>
              <p
                className="text-base sm:text-lg mb-4"
                style={{ color: colors.textMuted }}
              >
                {niche.tagline}
              </p>
              <p className="text-sm text-stone-700 dark:text-gray-300 leading-relaxed mb-6 max-w-2xl">
                {niche.description}
              </p>

              {(niche.primaryCta || niche.secondaryCta) && (
                <div className="flex flex-col sm:flex-row gap-3">
                  {niche.primaryCta && (
                    <Link
                      href={niche.primaryCta.url}
                      className="inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                      style={{ background: colors.accent }}
                    >
                      {niche.primaryCta.label} →
                    </Link>
                  )}
                  {niche.secondaryCta && (
                    <Link
                      href={niche.secondaryCta.url}
                      className="inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border transition-colors hover:bg-stone-50 dark:hover:bg-gray-700"
                      style={{ borderColor: colors.accent, color: colors.accent }}
                    >
                      {niche.secondaryCta.label}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Optional content placed before the tool sections */}
      {beforeSections}

      {/* ============ Tool Sections ============ */}
      {sections.map((section, idx) => (
        <section
          key={idx}
          className={
            idx % 2 === 0
              ? "bg-white dark:bg-gray-800 border-b border-stone-100 dark:border-gray-700"
              : "bg-stone-50 dark:bg-gray-900 border-b border-stone-100 dark:border-gray-700"
          }
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
            {/* Section header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                {section.badge && (
                  <span
                    className="text-[11px] font-medium px-2.5 py-1 rounded"
                    style={{
                      background: colors.iconBg,
                      color: colors.iconColor,
                    }}
                  >
                    {section.badge}
                  </span>
                )}
                <h2
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: colors.text }}
                >
                  {section.title}
                </h2>
              </div>
              {section.subtitle && (
                <p className="text-sm text-stone-600 dark:text-gray-400">
                  {section.subtitle}
                </p>
              )}
            </div>

            {/* Tools grid */}
            <div
              className={`grid grid-cols-2 ${
                section.cols === 5
                  ? "md:grid-cols-3 lg:grid-cols-5"
                  : section.cols === 4
                  ? "md:grid-cols-3 lg:grid-cols-4"
                  : "md:grid-cols-3"
              } gap-3 md:gap-4`}
            >
              {section.tools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.url}
                  className="group relative block bg-white dark:bg-gray-800 rounded-xl p-4 md:p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  style={{ border: `1px solid ${colors.border}` }}
                >
                  {/* Badges */}
                  {tool.popular && (
                    <span
                      className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "#EF4444", color: "white" }}
                    >
                      人気
                    </span>
                  )}
                  {tool.isNew && !tool.popular && (
                    <span
                      className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "#10B981", color: "white" }}
                    >
                      NEW
                    </span>
                  )}

                  {/* Icon */}
                  <div className="text-3xl mb-2">{tool.icon}</div>

                  {/* Name */}
                  <h3
                    className="text-sm md:text-base font-bold mb-1 leading-tight"
                    style={{ color: colors.text }}
                  >
                    {tool.name}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-[11px] md:text-xs leading-relaxed line-clamp-2"
                    style={{ color: colors.textMuted }}
                  >
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Optional extra content (intro paragraphs, FAQ, etc.) */}
      {children}

      {/* ============ Trust strip ============ */}
      <section
        className="border-t"
        style={{ background: colors.bg, borderColor: colors.border }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div
            className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs"
            style={{ color: colors.textMuted }}
          >
            <span>🇯🇵 日本国内サーバー</span>
            <span>🔒 SSL暗号化通信</span>
            <span>🗑️ 60分で自動削除</span>
            <span>完全無料・登録不要</span>
            <span>📱 スマホ対応</span>
          </div>
        </div>
      </section>
    </main>
  );
}
