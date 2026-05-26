"use client";

import Link from "next/link";
import { niches, Niche } from "@/config/niches";
import Badge from "@/components/ui/Badge";
import { cardCls } from "@/components/ui/Card";
import Emoji from "@/components/ui/Emoji";

// Map niche id or SVG iconName → emoji symbol
const SPECIAL_EMOJI: Record<string, string> = {
  food:       "🍽️",
  life:       "🏡",
  clinic:     "🏥",
  care:       "🏥",
  tax:        "💴",
  realestate: "🏘️",
  health:     "💪",
};

const ICON_EMOJI: Record<string, string> = {
  briefcase: "💼",
  building:  "🏢",
  document:  "📄",
  scroll:    "📜",
  chart:     "📊",
  receipt:   "🧾",
  home:      "🏠",
  heart:     "💪",
  care:      "🏥",
  book:      "📚",
  users:     "👥",
  car:       "🚗",
};

function getEmoji(niche: Niche): string {
  return SPECIAL_EMOJI[niche.id] ?? ICON_EMOJI[niche.iconName] ?? "🔧";
}

export default function NicheBentoSection() {
  const activeNiches = niches.filter((n) => !n.comingSoon);
  const comingSoonNiches = niches.filter((n) => n.comingSoon);
  const featured = activeNiches.find((n) => n.featured);
  const regulars = activeNiches.filter((n) => !n.featured);

  return (
    <section className="py-section bg-stone-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">

        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 tracking-widest uppercase mb-1">
              Categories
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              目的から選ぶ
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured && (
            <FeaturedCard niche={featured} className="col-span-2 md:col-span-2" />
          )}
          {regulars.map((niche) => (
            <DefaultCard key={niche.id} niche={niche} />
          ))}
        </div>

        {comingSoonNiches.length > 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/40 dark:bg-gray-800/40 px-5 py-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                近日公開予定
              </span>
              <div className="flex flex-wrap gap-2">
                {comingSoonNiches.map((niche) => (
                  <Badge key={niche.id} variant="neutral">
                    <Emoji symbol={getEmoji(niche)} size="sm" label={niche.shortName ?? niche.name} />
                    {" "}{niche.shortName ?? niche.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedCard({ niche, className = "" }: { niche: Niche; className?: string }) {
  return (
    <Link
      href={niche.url}
      className={`${cardCls("featured")} block p-6 relative ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <Emoji symbol={getEmoji(niche)} size="lg" label={niche.name} />
        {niche.popularBadge && (
          <Badge variant="popular">{niche.popularBadge}</Badge>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{niche.name}</h3>
        <Badge variant="neutral">{niche.toolCount} ツール</Badge>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{niche.description}</p>

      {niche.featuredLinks && niche.featuredLinks.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {niche.featuredLinks.map((link) => (
            <span
              key={link.url}
              className="text-xs px-2.5 py-1.5 rounded-md font-medium bg-primary-900/10 text-primary-900 dark:bg-primary-700/20 dark:text-primary-100"
            >
              → {link.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

function DefaultCard({ niche }: { niche: Niche }) {
  return (
    <Link
      href={niche.url}
      className={`${cardCls("default")} block p-5 relative`}
    >
      <div className="flex items-start justify-between mb-3">
        <Emoji symbol={getEmoji(niche)} size="lg" label={niche.name} />
        {niche.isNew && <Badge variant="new">NEW</Badge>}
      </div>

      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{niche.name}</h3>
        <Badge variant="neutral">{niche.toolCount} ツール</Badge>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{niche.description}</p>
    </Link>
  );
}
