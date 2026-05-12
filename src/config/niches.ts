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
    description: "請求書・全銀・電子印鑑・【新】法人検索",
    toolCount: 18,
    theme: "blue",
    featured: true,
    popularBadge: "人気 №1",
    topTools: ["請求書", "封筒印刷", "全銀", "【新】法人検索"],
    featuredLinks: [
      { name: "請求書作成", url: "/document/invoice" },
      { name: "全銀フォーマット", url: "/convert/bank-format" },
      { name: "【新】 法人検索", url: "/business/houjin-search" },
      { name: "【新】 補助金検索", url: "/business/hojokin-active" },
    ],
    url: "/document",
  },
  {
    id: "pdf",
    iconName: "document",
    name: "PDF・ファイル",
    shortName: "PDF",
    description: "編集・圧縮・変換",
    toolCount: 23,
    theme: "coral",
    url: "/pdf",
  },
  {
    id: "souzoku",
    iconName: "scroll",
    name: "相続・登記",
    shortName: "相続",
    description: "最大15万円節約",
    toolCount: 8,
    theme: "navy",
    isNew: true,
    url: "/souzoku-touki",
  },
  {
    id: "finance",
    iconName: "chart",
    name: "金融・データ",
    shortName: "金融",
    description: "NISA・住宅ローン・残業代・減価償却・給与手取り",
    toolCount: 12,
    theme: "green",
    isNew: true,
    featuredLinks: [
      { name: "残業代計算機", url: "/finance/overtime-calculator" },
      { name: "給与手取り計算機", url: "/finance/net-salary-calculator" },
      { name: "減価償却計算機", url: "/finance/depreciation-calculator" },
      { name: "住宅ローン計算機", url: "/finance/loan-calculator" },
    ],
    url: "/finance",
  },
  {
    id: "tax",
    iconName: "receipt",
    name: "税金・確定申告",
    shortName: "税金",
    description: "年末調整・ふるさと納税",
    toolCount: 5,
    theme: "amber",
    url: "/tax",
  },
  {
    id: "lifestyle",
    iconName: "home",
    name: "暮らし・便利",
    shortName: "暮らし",
    description: "和暦・QR・印鑑",
    toolCount: 34,
    theme: "pink",
    url: "/generator",
  },

  {
    id: "food",
    iconName: "receipt",
    name: "飲食・食品",
    shortName: "飲食",
    description: "原価率・栄養成分・フードロス",
    toolCount: 3,
    theme: "amber",
    isNew: true,
    featuredLinks: [
      { name: "飲食店 原価率計算機", url: "/food/genka-calculator" },
      { name: "栄養成分表示 計算機", url: "/food/nutrition-label-calculator" },
      { name: "フードロス コスト計算機", url: "/food/foodloss-calculator" },
    ],
    url: "/food",
  },
  {
    id: "life",
    iconName: "home",
    name: "生活・家計",
    shortName: "生活",
    description: "家計簿・引越し・葬儀費用",
    toolCount: 4,
    theme: "green",
    isNew: true,
    featuredLinks: [
      { name: "家計簿 貯蓄シミュレーター", url: "/life/kakeibo-simulator" },
      { name: "引越し費用 計算機", url: "/life/hikkoshi-hiyou-calculator" },
      { name: "葬儀費用 見積もり", url: "/life/sougi-calculator" },
    ],
    url: "/life",
  },
  {
    id: 'care',
    iconName: 'heart',
    name: '介護・保育 事業者向け',
    shortName: '介護・保育',
    description: '介護施設・保育園の事務作業を効率化するツール',
    toolCount: 1,
    theme: 'blue',
    isNew: true,
    featuredLinks: [
      { name: '介護報酬 単位計算機', url: '/business/kaigo-hoshu-calc' },
    ],
    url: '/business',
  },
  // Future niches (coming soon)
  {
    id: "realestate",
    iconName: "building",
    name: "不動産情報",
    shortName: "不動産",
    description: "用途地域・ハザード・地価・取引価格・学区・人口推計",
    toolCount: 11,
    theme: "olive",
    isNew: true,
    featuredLinks: [
      { name: "用途地域チェック", url: "/realestate/yoto-chiiki-checker" },
      { name: "ハザードマップ", url: "/realestate/hazard-checker" },
      { name: "地価チェック", url: "/realestate/land-price" },
      { name: "学区チェック", url: "/realestate/school-district" },
    ],
    url: "/realestate",
  },
  {
    id: "health",
    iconName: "heart",
    name: "健康・データ",
    shortName: "健康",
    description: "BMI・カロリー・【新】統計",
    toolCount: 7,
    theme: "red",
    isNew: true,
    url: "/health",
  },
  {
    id: "clinic",
    iconName: "heart",
    name: "クリニック経営",
    shortName: "クリニック",
    description: "損益分岐点・人件費率・給与計算など、院長と医療事務向けの経営支援ツール",
    toolCount: 3,
    theme: "blue",
    isNew: true,
    featuredLinks: [],
    url: "/clinic",
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
    bg: "var(--niche-blue-bg)",
    bgDark: "var(--niche-blue-bg-dark)",
    text: "var(--niche-blue-text)",
    textDark: "var(--niche-blue-text-dark)",
    textMuted: "var(--niche-blue-text-muted)",
    border: "var(--niche-blue-border)",
    iconBg: "var(--niche-blue-icon-bg)",
    iconColor: "var(--niche-blue-icon-color)",
    accent: "var(--niche-blue-accent)",
  },
  coral: {
    bg: "var(--niche-coral-bg)",
    bgDark: "var(--niche-coral-bg-dark)",
    text: "var(--niche-coral-text)",
    textDark: "var(--niche-coral-text-dark)",
    textMuted: "var(--niche-coral-text-muted)",
    border: "var(--niche-coral-border)",
    iconBg: "var(--niche-coral-icon-bg)",
    iconColor: "var(--niche-coral-icon-color)",
    accent: "var(--niche-coral-accent)",
  },
  green: {
    bg: "var(--niche-green-bg)",
    bgDark: "var(--niche-green-bg-dark)",
    text: "var(--niche-green-text)",
    textDark: "var(--niche-green-text-dark)",
    textMuted: "var(--niche-green-text-muted)",
    border: "var(--niche-green-border)",
    iconBg: "var(--niche-green-icon-bg)",
    iconColor: "var(--niche-green-icon-color)",
    accent: "var(--niche-green-accent)",
  },
  amber: {
    bg: "var(--niche-amber-bg)",
    bgDark: "var(--niche-amber-bg-dark)",
    text: "var(--niche-amber-text)",
    textDark: "var(--niche-amber-text-dark)",
    textMuted: "var(--niche-amber-text-muted)",
    border: "var(--niche-amber-border)",
    iconBg: "var(--niche-amber-icon-bg)",
    iconColor: "var(--niche-amber-icon-color)",
    accent: "var(--niche-amber-accent)",
  },
  navy: {
    bg: "var(--niche-navy-bg)",
    bgDark: "var(--niche-navy-bg-dark)",
    text: "var(--niche-navy-text)",
    textDark: "var(--niche-navy-text-dark)",
    textMuted: "var(--niche-navy-text-muted)",
    border: "var(--niche-navy-border)",
    iconBg: "var(--niche-navy-icon-bg)",
    iconColor: "var(--niche-navy-icon-color)",
    accent: "var(--niche-navy-accent)",
  },
  pink: {
    bg: "var(--niche-pink-bg)",
    bgDark: "var(--niche-pink-bg-dark)",
    text: "var(--niche-pink-text)",
    textDark: "var(--niche-pink-text-dark)",
    textMuted: "var(--niche-pink-text-muted)",
    border: "var(--niche-pink-border)",
    iconBg: "var(--niche-pink-icon-bg)",
    iconColor: "var(--niche-pink-icon-color)",
    accent: "var(--niche-pink-accent)",
  },
  red: {
    bg: "var(--niche-red-bg)",
    bgDark: "var(--niche-red-bg-dark)",
    text: "var(--niche-red-text)",
    textDark: "var(--niche-red-text-dark)",
    textMuted: "var(--niche-red-text-muted)",
    border: "var(--niche-red-border)",
    iconBg: "var(--niche-red-icon-bg)",
    iconColor: "var(--niche-red-icon-color)",
    accent: "var(--niche-red-accent)",
  },
  olive: {
    bg: "var(--niche-olive-bg)",
    bgDark: "var(--niche-olive-bg-dark)",
    text: "var(--niche-olive-text)",
    textDark: "var(--niche-olive-text-dark)",
    textMuted: "var(--niche-olive-text-muted)",
    border: "var(--niche-olive-border)",
    iconBg: "var(--niche-olive-icon-bg)",
    iconColor: "var(--niche-olive-icon-color)",
    accent: "var(--niche-olive-accent)",
  },
  purple: {
    bg: "var(--niche-purple-bg)",
    bgDark: "var(--niche-purple-bg-dark)",
    text: "var(--niche-purple-text)",
    textDark: "var(--niche-purple-text-dark)",
    textMuted: "var(--niche-purple-text-muted)",
    border: "var(--niche-purple-border)",
    iconBg: "var(--niche-purple-icon-bg)",
    iconColor: "var(--niche-purple-icon-color)",
    accent: "var(--niche-purple-accent)",
  },
};
