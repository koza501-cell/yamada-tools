"use client";

import Link from "next/link";
import {
  niches,
  themeColors,
  Niche,
} from "@/config/niches";
import { NicheIcon } from "./NicheIcons";
import Badge from "@/components/ui/Badge";

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
          {featured && (
            <FeaturedCard niche={featured} className="col-span-2 md:col-span-2" />
          )}
          {regulars.map((niche) => {
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
                    <Badge
                      key={niche.id}
                      variant="neutral"
                      className="gap-1.5"
                      style={{
                        background: colors.iconBg,
                        color: colors.iconColor,
                      }}
                    >
                      <NicheIcon name={niche.iconName} size={14} />
                      {niche.shortName}
                    </Badge>
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

function FeaturedCard({ niche, className = "" }: { niche: Niche; className?: string }) {
  const colors = themeColors[niche.theme];

  return (
    <Link
      href={niche.url}
      className={`group relative block rounded-2xl p-6 md:p-7 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 overflow-hidden ${className}`}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        minHeight: "220px",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.7)", color: colors.iconColor }}
        >
          <NicheIcon name={niche.iconName} size={26} />
        </div>
        {niche.popularBadge && (
          <Badge variant="popular">{niche.popularBadge}</Badge>
        )}
      </div>

      <h3
        className="text-lg md:text-xl font-bold mb-1.5"
        style={{ color: colors.text }}
      >
        {niche.name}
      </h3>

      <p
        className="text-xs md:text-sm leading-relaxed mb-4"
        style={{ color: colors.textMuted }}
      >
        {niche.description}
      </p>

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
      className="group relative block rounded-2xl p-5 md:p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
      style={{
        background: colors.bgDark,
        color: colors.textDark,
        minHeight: "180px",
      }}
    >
      {niche.isNew && (
        <Badge variant="new" className="absolute top-3 right-3">NEW</Badge>
      )}

      <div
        className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
      >
        <NicheIcon name={niche.iconName} size={22} />
      </div>

      <h3 className="text-base md:text-lg font-bold mb-1.5">{niche.name}</h3>

      <p className="text-xs md:text-sm leading-relaxed opacity-80">
        {niche.description}
      </p>

      <div className="absolute bottom-4 right-4 md:bottom-5 md:right-5 text-sm font-semibold opacity-90">
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
      className="group relative block rounded-2xl p-5 md:p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-gray-800 overflow-hidden"
      style={{
        border: `1px solid ${colors.border}`,
        minHeight: "180px",
      }}
    >
      <div
        className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: colors.iconBg, color: colors.iconColor }}
      >
        <NicheIcon name={niche.iconName} size={22} />
      </div>

      <h3
        className="text-base md:text-lg font-bold mb-1.5"
        style={{ color: colors.text }}
      >
        {niche.name}
      </h3>

      <p
        className="text-xs md:text-sm leading-relaxed"
        style={{ color: colors.textMuted }}
      >
        {niche.description}
      </p>

      <div className="absolute bottom-4 right-4 md:bottom-5 md:right-5 text-sm font-semibold text-gray-700 dark:text-gray-300">
        {niche.toolCount} ツール
      </div>
    </Link>
  );
}
