// ============================================================
// YAMADA TOOLS — NICHE CONFIGURATION
// ============================================================
// Single source of truth for all niches.
// Add new niches here and the homepage updates automatically.
// All URLs point to EXISTING routes — no SEO impact.
// ============================================================

export type NicheTheme =
  | "blue"
  | "coral"
  | "green"
  | "amber"
  | "navy"
  | "pink"
  | "red"
  | "olive"
  | "purple";

export interface Niche {
  id: string;
  iconName: string;          // Reference to icon in NicheIcons.tsx
  name: string;
  shortName?: string;
  description: string;
  toolCount: number;
  theme: NicheTheme;
  featured?: boolean;
  isNew?: boolean;
  comingSoon?: boolean;
  popularBadge?: string;
  topTools?: string[];
  featuredLinks?: { name: string; url: string }[];
  url: string;
}

// ============================================================
// NICHE LIST
// All URLs already exist on staging.yamada-tools.jp
// ============================================================

export const niches: Niche[] = [
  {
    id: "business",
    iconName: "briefcase",
    name: "ビジネス書類",
    shortName: "ビジネス",
    description: "請求書・封筒印刷・全銀フォーマット・電子印鑑",
    toolCount: 25,
    theme: "blue",
    featured: true,
    popularBadge: "人気 №1",
    topTools: ["請求書", "封筒印刷", "全銀", "電子印鑑"],
    featuredLinks: [
      { name: "請求書作成", url: "/document/invoice" },
      { name: "封筒印刷", url: "/generator/envelope-print" },
      { name: "全銀フォーマット", url: "/convert/bank-format" },
      { name: "電子印鑑", url: "/generator/hanko" },
    ],
    url: "/document",
  },
  {
    id: "pdf",
    iconName: "document",
    name: "PDF・ファイル",
    shortName: "PDF",
    description: "編集・圧縮・変換",
    toolCount: 35,
    theme: "coral",
    url: "/pdf",
  },
  {
    id: "souzoku",
    iconName: "scroll",
    name: "相続・登記",
    shortName: "相続",
    description: "最大15万円節約",
    toolCount: 6,
    theme: "navy",
    isNew: true,
    url: "/souzoku-touki",
  },
  {
    id: "finance",
    iconName: "chart",
    name: "金融・資産運用",
    shortName: "金融",
    description: "NISA・住宅ローン",
    toolCount: 5,
    theme: "green",
    url: "/finance",
  },
  {
    id: "tax",
    iconName: "receipt",
    name: "税金・確定申告",
    shortName: "税金",
    description: "年末調整・ふるさと納税",
    toolCount: 6,
    theme: "amber",
    url: "/tax",
  },
  {
    id: "lifestyle",
    iconName: "home",
    name: "暮らし・便利",
    shortName: "暮らし",
    description: "和暦・QR・印鑑",
    toolCount: 15,
    theme: "pink",
    url: "/generator",
  },

  // Future niches (coming soon)
  {
    id: "health",
    iconName: "heart",
    name: "健康・医療",
    shortName: "健康",
    description: "BMI・カロリー計算",
    toolCount: 0,
    theme: "red",
    comingSoon: true,
    url: "/health",
  },
  {
    id: "education",
    iconName: "book",
    name: "学習・教育",
    shortName: "学習",
    description: "学習計画・記憶術",
    toolCount: 0,
    theme: "olive",
    comingSoon: true,
    url: "/education",
  },
  {
    id: "parenting",
    iconName: "users",
    name: "子育て・家族",
    shortName: "子育て",
    description: "成長記録",
    toolCount: 0,
    theme: "purple",
    comingSoon: true,
    url: "/parenting",
  },
  {
    id: "auto",
    iconName: "car",
    name: "自動車・交通",
    shortName: "自動車",
    description: "車検・燃費計算",
    toolCount: 0,
    theme: "purple",
    comingSoon: true,
    url: "/auto",
  },
];

// ============================================================
// HELPERS
// ============================================================

export function getActiveNiches(): Niche[] {
  return niches.filter((n) => !n.comingSoon);
}

export function getComingSoonNiches(): Niche[] {
  return niches.filter((n) => n.comingSoon);
}

export function getFeaturedNiche(): Niche | undefined {
  return niches.find((n) => n.featured && !n.comingSoon);
}

// ============================================================
// THEME COLORS — uses Tailwind-compatible hex values
// ============================================================

export const themeColors: Record<NicheTheme, {
  bg: string;
  bgDark: string;
  text: string;
  textDark: string;
  textMuted: string;
  border: string;
  iconBg: string;
  iconColor: string;
  accent: string;
}> = {
  blue: {
    bg: "#EFF6FF",
    bgDark: "#1E3A8A",
    text: "#1E3A8A",
    textDark: "#FFFFFF",
    textMuted: "#3B82F6",
    border: "#DBEAFE",
    iconBg: "#DBEAFE",
    iconColor: "#1E40AF",
    accent: "#1E40AF",
  },
  coral: {
    bg: "#FFF7ED",
    bgDark: "#7C2D12",
    text: "#7C2D12",
    textDark: "#FFFFFF",
    textMuted: "#EA580C",
    border: "#FFEDD5",
    iconBg: "#FFEDD5",
    iconColor: "#C2410C",
    accent: "#C2410C",
  },
  green: {
    bg: "#F0FDF4",
    bgDark: "#064E3B",
    text: "#064E3B",
    textDark: "#FFFFFF",
    textMuted: "#10B981",
    border: "#DCFCE7",
    iconBg: "#DCFCE7",
    iconColor: "#047857",
    accent: "#047857",
  },
  amber: {
    bg: "#FEFCE8",
    bgDark: "#713F12",
    text: "#713F12",
    textDark: "#FFFFFF",
    textMuted: "#CA8A04",
    border: "#FEF08A",
    iconBg: "#FEF08A",
    iconColor: "#A16207",
    accent: "#A16207",
  },
  navy: {
    bg: "#EEF2FF",
    bgDark: "#1E1B4B",
    text: "#1E1B4B",
    textDark: "#FFFFFF",
    textMuted: "#6366F1",
    border: "#E0E7FF",
    iconBg: "#E0E7FF",
    iconColor: "#3730A3",
    accent: "#3730A3",
  },
  pink: {
    bg: "#FDF2F8",
    bgDark: "#831843",
    text: "#831843",
    textDark: "#FFFFFF",
    textMuted: "#DB2777",
    border: "#FCE7F3",
    iconBg: "#FCE7F3",
    iconColor: "#BE185D",
    accent: "#BE185D",
  },
  red: {
    bg: "#FEF2F2",
    bgDark: "#7F1D1D",
    text: "#7F1D1D",
    textDark: "#FFFFFF",
    textMuted: "#DC2626",
    border: "#FEE2E2",
    iconBg: "#FEE2E2",
    iconColor: "#B91C1C",
    accent: "#B91C1C",
  },
  olive: {
    bg: "#F7FEE7",
    bgDark: "#365314",
    text: "#365314",
    textDark: "#FFFFFF",
    textMuted: "#65A30D",
    border: "#ECFCCB",
    iconBg: "#ECFCCB",
    iconColor: "#4D7C0F",
    accent: "#4D7C0F",
  },
  purple: {
    bg: "#FAF5FF",
    bgDark: "#581C87",
    text: "#581C87",
    textDark: "#FFFFFF",
    textMuted: "#9333EA",
    border: "#F3E8FF",
    iconBg: "#F3E8FF",
    iconColor: "#7E22CE",
    accent: "#7E22CE",
  },
};
