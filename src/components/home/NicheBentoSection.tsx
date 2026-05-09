"use client";

import Link from "next/link";
import {
  niches,
  themeColors,
  Niche,
} from "@/config/niches";
import { NicheIcon } from "./NicheIcons";

// ============================================================
// NICHE BENTO GRID SECTION
// ============================================================
// Self-contained section. Drop into homepage with:
//   import NicheBentoSection from "@/components/home/NicheBentoSection";
//   <NicheBentoSection />
// ============================================================

export default function NicheBentoSection() {
  const activeNiches = niches.filter((n) => !n.comingSoon);
  const comingSoonNiches = niches.filter((n) => n.comingSoon);
  const featured = activeNiches.find((n) => n.featured);
  const regulars = activeNiches.filter((n) => !n.featured);

  return (
    <section className="py-12 md:py-16 bg-stone-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-end mb-6 md:mb-8">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 tracking-widest uppercase mb-1">
              Categories
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              目的から選ぶ
            </h2>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {/* Featured niche (2x size on desktop) */}
          {featured && (
            <FeaturedCard niche={featured} className="col-span-2 md:col-span-2" />
          )}

          {/* Regular niches */}
          {regulars.map((niche) => {
            // Pick which niches to render as "dark premium" cards
            const isDark = niche.id === "souzoku" || niche.id === "finance";
            return isDark ? (
              <DarkCard key={niche.id} niche={niche} />
            ) : (
              <StandardCard key={niche.id} niche={niche} />
            );
          })}
        </div>

        {/* Coming soon row */}
        {comingSoonNiches.length > 0 && (
          <div className="mt-4 md:mt-5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/40 dark:bg-gray-800/40 px-4 py-3 md:px-5 md:py-4">
            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  近日公開予定
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {comingSoonNiches.map((niche) => {
                  const colors = themeColors[niche.theme];
                  return (
                    <span
                      key={niche.id}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: colors.iconBg,
                        color: colors.iconColor,
                      }}
                    >
                      <NicheIcon name={niche.iconName} size={14} />
                      {niche.shortName}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// CARD VARIANTS
// ============================================================

function FeaturedCard({ niche, className = "" }: { niche: Niche; className?: string }) {
  const colors = themeColors[niche.theme];

  return (
    <Link
      href={niche.url}
      className={`group relative block rounded-2xl p-6 md:p-7 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden ${className}`}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        minHeight: "220px",
      }}
    >
      {/* Top row: icon + badge */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.7)", color: colors.iconColor }}
        >
          <NicheIcon name={niche.iconName} size={26} />
        </div>
        {niche.popularBadge && (
          <span
            className="text-[11px] md:text-xs font-bold px-3 py-1 rounded-full shadow-md"
            style={{ background: "#DC2626", color: "white" }}
          >
            🔥 {niche.popularBadge}
          </span>
        )}
      </div>

      {/* Name */}
      <h3
        className="text-lg md:text-xl font-bold mb-1.5"
        style={{ color: colors.text }}
      >
        {niche.name}
      </h3>

      {/* Description */}
      <p
        className="text-xs md:text-sm leading-relaxed mb-4"
        style={{ color: colors.textMuted }}
      >
        {niche.description}
      </p>

      {/* Featured tool quick-links (fills empty space) */}
      {/* Pills use iconBg (light tinted) in light mode, semi-transparent dark in dark mode */}
      {niche.featuredLinks && niche.featuredLinks.length > 0 && (
        <div className="grid grid-cols-2 gap-1.5 mt-1">
          {niche.featuredLinks.map((link) => (
            <span
              key={link.url}
              className="text-[11px] md:text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors"
              style={{
                background: colors.iconBg,
                color: colors.iconColor,
              }}
            >
              → {link.name}
            </span>
          ))}
        </div>
      )}
      <div
        className="text-[11px] md:text-xs font-bold mt-2"
        style={{ color: colors.accent }}
      >
        +{Math.max(0, niche.toolCount - (niche.featuredLinks?.length || 0))} ツールをすべて見る →
      </div>
    </Link>
  );
}

function DarkCard({ niche }: { niche: Niche }) {
  const colors = themeColors[niche.theme];

  return (
    <Link
      href={niche.url}
      className="group relative block rounded-2xl p-5 md:p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
      style={{
        background: colors.bgDark,
        color: colors.textDark,
        minHeight: "180px",
      }}
    >
      {/* New badge */}
      {niche.isNew && (
        <span
          className="absolute top-3 right-3 text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: "rgba(251, 191, 36, 0.9)", color: "#1E1B4B" }}
        >
          NEW
        </span>
      )}

      {/* Icon */}
      <div
        className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
      >
        <NicheIcon name={niche.iconName} size={22} />
      </div>

      {/* Name */}
      <h3 className="text-base md:text-lg font-bold mb-1.5">{niche.name}</h3>

      {/* Description */}
      <p className="text-xs md:text-sm leading-relaxed opacity-80">
        {niche.description}
      </p>

      {/* Tool count at bottom */}
      <div className="absolute bottom-4 right-4 md:bottom-5 md:right-5 text-xs font-medium opacity-60">
        {niche.toolCount} ツール
      </div>
    </Link>
  );
}

function StandardCard({ niche }: { niche: Niche }) {
  const colors = themeColors[niche.theme];

  return (
    <Link
      href={niche.url}
      className="group relative block rounded-2xl p-5 md:p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 bg-white dark:bg-gray-800 overflow-hidden"
      style={{
        border: `1px solid ${colors.border}`,
        minHeight: "180px",
      }}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: colors.iconBg, color: colors.iconColor }}
      >
        <NicheIcon name={niche.iconName} size={22} />
      </div>

      {/* Name */}
      <h3
        className="text-base md:text-lg font-bold mb-1.5"
        style={{ color: colors.text }}
      >
        {niche.name}
      </h3>

      {/* Description */}
      <p
        className="text-xs md:text-sm leading-relaxed"
        style={{ color: colors.textMuted }}
      >
        {niche.description}
      </p>

      {/* Tool count at bottom */}
      <div
        className="absolute bottom-4 right-4 md:bottom-5 md:right-5 text-xs font-medium"
        style={{ color: colors.textMuted, opacity: 0.7 }}
      >
        {niche.toolCount} ツール
      </div>
    </Link>
  );
}
