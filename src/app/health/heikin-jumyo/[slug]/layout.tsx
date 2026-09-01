import { Metadata } from "next";
import { notFound } from "next/navigation";

const PREF_DATA: Record<string, { name: string; nameKana: string }> = {
  hokkaido:  { name: "北海道", nameKana: "ほっかいどう" },
  aomori:    { name: "青森県", nameKana: "あおもりけん" },
  iwate:     { name: "岩手県", nameKana: "いわてけん" },
  miyagi:    { name: "宮城県", nameKana: "みやぎけん" },
  akita:     { name: "秋田県", nameKana: "あきたけん" },
  yamagata:  { name: "山形県", nameKana: "やまがたけん" },
  fukushima: { name: "福島県", nameKana: "ふくしまけん" },
  ibaraki:   { name: "茨城県", nameKana: "いばらきけん" },
  tochigi:   { name: "栃木県", nameKana: "とちぎけん" },
  gunma:     { name: "群馬県", nameKana: "ぐんまけん" },
  saitama:   { name: "埼玉県", nameKana: "さいたまけん" },
  chiba:     { name: "千葉県", nameKana: "ちばけん" },
  tokyo:     { name: "東京都", nameKana: "とうきょうと" },
  kanagawa:  { name: "神奈川県", nameKana: "かながわけん" },
  niigata:   { name: "新潟県", nameKana: "にいがたけん" },
  toyama:    { name: "富山県", nameKana: "とやまけん" },
  ishikawa:  { name: "石川県", nameKana: "いしかわけん" },
  fukui:     { name: "福井県", nameKana: "ふくいけん" },
  yamanashi: { name: "山梨県", nameKana: "やまなしけん" },
  nagano:    { name: "長野県", nameKana: "ながのけん" },
  gifu:      { name: "岐阜県", nameKana: "ぎふけん" },
  shizuoka:  { name: "静岡県", nameKana: "しずおかけん" },
  aichi:     { name: "愛知県", nameKana: "あいちけん" },
  mie:       { name: "三重県", nameKana: "みえけん" },
  shiga:     { name: "滋賀県", nameKana: "しがけん" },
  kyoto:     { name: "京都府", nameKana: "きょうとふ" },
  osaka:     { name: "大阪府", nameKana: "おおさかふ" },
  hyogo:     { name: "兵庫県", nameKana: "ひょうごけん" },
  nara:      { name: "奈良県", nameKana: "ならけん" },
  wakayama:  { name: "和歌山県", nameKana: "わかやまけん" },
  tottori:   { name: "鳥取県", nameKana: "とっとりけん" },
  shimane:   { name: "島根県", nameKana: "しまねけん" },
  okayama:   { name: "岡山県", nameKana: "おかやまけん" },
  hiroshima: { name: "広島県", nameKana: "ひろしまけん" },
  yamaguchi: { name: "山口県", nameKana: "やまぐちけん" },
  tokushima: { name: "徳島県", nameKana: "とくしまけん" },
  kagawa:    { name: "香川県", nameKana: "かがわけん" },
  ehime:     { name: "愛媛県", nameKana: "えひめけん" },
  kochi:     { name: "高知県", nameKana: "こうちけん" },
  fukuoka:   { name: "福岡県", nameKana: "ふくおかけん" },
  saga:      { name: "佐賀県", nameKana: "さがけん" },
  nagasaki:  { name: "長崎県", nameKana: "ながさきけん" },
  kumamoto:  { name: "熊本県", nameKana: "くまもとけん" },
  oita:      { name: "大分県", nameKana: "おおいたけん" },
  miyazaki:  { name: "宮崎県", nameKana: "みやざきけん" },
  kagoshima: { name: "鹿児島県", nameKana: "かごしまけん" },
  okinawa:   { name: "沖縄県", nameKana: "おきなわけん" },
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
    title: `${pref.name}の平均寿命【男女別・2020年最新データ】全国順位は？`,
    description: ((`${pref.name}の平均寿命を男女別に掲載。全国47都道府県内の順位・全国平均との差・余命計算も。厚生労働省 令和2年都道府県別生命表データ。`)||"").length>150?((`${pref.name}の平均寿命を男女別に掲載。全国47都道府県内の順位・全国平均との差・余命計算も。厚生労働省 令和2年都道府県別生命表データ。`)||"").slice(0,150)+"…":((`${pref.name}の平均寿命を男女別に掲載。全国47都道府県内の順位・全国平均との差・余命計算も。厚生労働省 令和2年都道府県別生命表データ。`)||""),
    alternates: {
      canonical: `https://yamada-tools.jp/health/heikin-jumyo/${slug}`,
    },
    openGraph: {
      title: `${pref.name}の平均寿命【男女別・2020年最新データ】`,
      description: ((`${pref.name}の男女別平均寿命・全国ランキング・余命計算。厚生労働省データ準拠。`)||"").length>150?((`${pref.name}の男女別平均寿命・全国ランキング・余命計算。厚生労働省データ準拠。`)||"").slice(0,150)+"…":((`${pref.name}の男女別平均寿命・全国ランキング・余命計算。厚生労働省データ準拠。`)||""),
      url: `https://yamada-tools.jp/health/heikin-jumyo/${slug}`,
      siteName: "山田ツール",
      locale: "ja_JP",
      type: "website",
    },
  };
}

export default function PrefectureLayout({ children }: { children: React.ReactNode }) {
  return children;
}
