import { Metadata } from "next";

const PREF_DATA: Record<string, { name: string; unemp: number; kujin: number | null }> = {
  hokkaido:  { name: "北海道",   unemp: 4.2, kujin: 0.99 },
  aomori:    { name: "青森県",   unemp: 4.6, kujin: 1.10 },
  iwate:     { name: "岩手県",   unemp: 3.8, kujin: 1.19 },
  miyagi:    { name: "宮城県",   unemp: 4.3, kujin: 1.23 },
  akita:     { name: "秋田県",   unemp: 4.1, kujin: 1.26 },
  yamagata:  { name: "山形県",   unemp: 3.4, kujin: 1.34 },
  fukushima: { name: "福島県",   unemp: 4.1, kujin: 1.26 },
  ibaraki:   { name: "茨城県",   unemp: 3.9, kujin: 1.32 },
  tochigi:   { name: "栃木県",   unemp: 4.1, kujin: 1.16 },
  gunma:     { name: "群馬県",   unemp: 3.8, kujin: 1.33 },
  saitama:   { name: "埼玉県",   unemp: 4.0, kujin: 1.04 },
  chiba:     { name: "千葉県",   unemp: 3.8, kujin: 0.99 },
  tokyo:     { name: "東京都",   unemp: 3.6, kujin: 1.76 },
  kanagawa:  { name: "神奈川県", unemp: 3.7, kujin: 0.91 },
  niigata:   { name: "新潟県",   unemp: 3.6, kujin: 1.46 },
  toyama:    { name: "富山県",   unemp: 3.1, kujin: 1.39 },
  ishikawa:  { name: "石川県",   unemp: 3.4, kujin: 1.53 },
  fukui:     { name: "福井県",   unemp: 2.9, kujin: 1.73 },
  yamanashi: { name: "山梨県",   unemp: 3.9, kujin: 1.28 },
  nagano:    { name: "長野県",   unemp: 3.3, kujin: 1.31 },
  gifu:      { name: "岐阜県",   unemp: 3.3, kujin: 1.52 },
  shizuoka:  { name: "静岡県",   unemp: 3.8, kujin: 1.11 },
  aichi:     { name: "愛知県",   unemp: 3.3, kujin: 1.28 },
  mie:       { name: "三重県",   unemp: 3.1, kujin: 1.16 },
  shiga:     { name: "滋賀県",   unemp: 3.4, kujin: 1.01 },
  kyoto:     { name: "京都府",   unemp: 4.1, kujin: 1.23 },
  osaka:     { name: "大阪府",   unemp: 4.5, kujin: 1.21 },
  hyogo:     { name: "兵庫県",   unemp: 4.0, kujin: 1.00 },
  nara:      { name: "奈良県",   unemp: 4.1, kujin: 1.15 },
  wakayama:  { name: "和歌山県", unemp: 3.9, kujin: 1.13 },
  tottori:   { name: "鳥取県",   unemp: 3.5, kujin: 1.29 },
  shimane:   { name: "島根県",   unemp: 2.7, kujin: 1.42 },
  okayama:   { name: "岡山県",   unemp: 3.6, kujin: 1.44 },
  hiroshima: { name: "広島県",   unemp: 3.4, kujin: 1.43 },
  yamaguchi: { name: "山口県",   unemp: 3.5, kujin: 1.45 },
  tokushima: { name: "徳島県",   unemp: 4.2, kujin: 1.14 },
  kagawa:    { name: "香川県",   unemp: 3.5, kujin: 1.46 },
  ehime:     { name: "愛媛県",   unemp: 3.7, kujin: 1.36 },
  kochi:     { name: "高知県",   unemp: 4.1, kujin: 1.10 },
  fukuoka:   { name: "福岡県",   unemp: 4.6, kujin: 1.18 },
  saga:      { name: "佐賀県",   unemp: 3.6, kujin: 1.29 },
  nagasaki:  { name: "長崎県",   unemp: 3.8, kujin: 1.18 },
  kumamoto:  { name: "熊本県",   unemp: 3.9, kujin: 1.22 },
  oita:      { name: "大分県",   unemp: 4.2, kujin: 1.35 },
  miyazaki:  { name: "宮崎県",   unemp: 4.0, kujin: 1.29 },
  kagoshima: { name: "鹿児島県", unemp: 4.0, kujin: 1.13 },
  okinawa:   { name: "沖縄県",   unemp: 5.5, kujin: 0.98 },
};

export async function generateStaticParams() {
  return Object.keys(PREF_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pref = PREF_DATA[slug];
  if (!pref) return {};

  return {
    title: `${pref.name}の失業率【2020年最新データ】完全失業率${pref.unemp}%・有効求人倍率 | 山田ツール`,
    description: `${pref.name}の完全失業率は${pref.unemp}%（2020年国勢調査）、有効求人倍率は${pref.kujin ?? "―"}倍（2024年）。全国47都道府県内の順位・推移・全国平均との比較。`,
    alternates: {
      canonical: `https://yamada-tools.jp/career/shitsugyo-ritsu/${slug}`,
    },
    openGraph: {
      title: `${pref.name}の失業率【2020年最新データ】完全失業率${pref.unemp}%`,
      description: `${pref.name}の完全失業率・有効求人倍率・全国ランキング。総務省データ準拠。`,
      url: `https://yamada-tools.jp/career/shitsugyo-ritsu/${slug}`,
      siteName: "山田ツール",
      locale: "ja_JP",
      type: "website",
    },
  };
}

export default function PrefectureLayout({ children }: { children: React.ReactNode }) {
  return children;
}
