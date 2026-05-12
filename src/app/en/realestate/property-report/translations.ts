export function translateBuildingType(jp: string | null): string | null {
  if (!jp) return jp;
  const map: Record<string, string> = {
    "中古マンション等": "Used condominium",
    "宅地(土地と建物)": "Land + building",
    "宅地(土地)": "Land only",
    "戸建て": "Detached house",
    "新築マンション等": "New condominium",
    "農地": "Agricultural land",
    "山林": "Forest / woodland",
    "その他": "Other",
    "土地": "Land only",
    "住宅地": "Residential land",
    "商業地": "Commercial land",
    "工業地": "Industrial land",
  };
  return map[jp] ?? jp;
}

export function translateStructure(jp: string | null): string | null {
  if (!jp) return jp;
  const map: Record<string, string> = {
    "ＲＣ": "RC (reinforced concrete)",
    "ＳＲＣ": "SRC (steel-reinforced concrete)",
    "Ｗ": "Wood",
    "Ｓ": "Steel",
    "ＣＢ": "Concrete block",
    "ＡＬＣ": "ALC (lightweight concrete)",
    "軽量鉄骨": "Light steel frame",
    "鉄骨造": "Steel frame",
    "不明": "Unknown",
  };
  return map[jp] ?? jp;
}

export function translateFloorPlan(jp: string | null): string | null {
  if (!jp) return jp;
  // Convert full-width digits and letters to half-width ASCII
  return jp.replace(/[０-９Ａ-Ｚａ-ｚ]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0xfee0)
  );
}

export function translateQuarter(jp: string | null): string | null {
  if (!jp) return jp;
  return jp.replace(/(\d+)年第(\d+)四半期/g, (_, year, q) => `${year} Q${q}`);
}

export function translateTerrain(jp: string | null): string | null {
  if (!jp) return jp;
  const map: Record<string, string> = {
    "ローム台地": "Loam plateau",
    "砂礫質台地": "Sandy gravel plateau",
    "砂礫質": "Sandy gravel",
    "谷底低地": "Valley bottom lowland",
    "沖積低地": "Alluvial lowland",
    "台地": "Upland plateau",
    "段丘": "River terrace",
    "低地": "Lowland",
    "干拓地": "Reclaimed land",
    "旧河道": "Former riverbed",
    "砂丘": "Sand dune",
    "三角州": "River delta",
    "埋立地": "Landfill",
    "盛土": "Filled ground",
    "切土": "Cut ground",
    "自然堤防": "Natural levee",
    "後背湿地": "Back marsh",
    "扇状地": "Alluvial fan",
  };
  // Sort keys longest-first to avoid partial replacements
  const sorted = Object.keys(map).sort((a, b) => b.length - a.length);
  let result = jp;
  for (const key of sorted) {
    result = result.replaceAll(key, map[key]);
  }
  return result;
}

export function translateYear(jp: string | null): string | null {
  if (!jp) return jp;
  return jp.replace(/年$/, "");
}

const ROMAJI_MAP: Record<string, string> = {
  // Tokyo 23 wards
  "千代田": "Chiyoda", "中央": "Chuo", "港": "Minato", "新宿": "Shinjuku",
  "文京": "Bunkyo", "台東": "Taito", "墨田": "Sumida", "江東": "Koto",
  "品川": "Shinagawa", "目黒": "Meguro", "大田": "Ota", "世田谷": "Setagaya",
  "渋谷": "Shibuya", "中野": "Nakano", "杉並": "Suginami", "豊島": "Toshima",
  "北": "Kita", "荒川": "Arakawa", "板橋": "Itabashi", "練馬": "Nerima",
  "足立": "Adachi", "葛飾": "Katsushika", "江戸川": "Edogawa",
  // Kanagawa / Saitama / Chiba cities
  "横浜": "Yokohama", "川崎": "Kawasaki", "相模原": "Sagamihara",
  "横須賀": "Yokosuka", "藤沢": "Fujisawa", "茅ヶ崎": "Chigasaki",
  "平塚": "Hiratsuka", "小田原": "Odawara", "秦野": "Hadano",
  "厚木": "Atsugi", "大和": "Yamato", "鎌倉": "Kamakura",
  "さいたま": "Saitama", "川口": "Kawaguchi", "所沢": "Tokorozawa",
  "越谷": "Koshigaya", "草加": "Soka", "春日部": "Kasukabe",
  "千葉": "Chiba", "船橋": "Funabashi", "松戸": "Matsudo",
  "市川": "Ichikawa", "柏": "Kashiwa", "我孫子": "Abiko",
  "浦安": "Urayasu", "習志野": "Narashino",
  // Tokyo multi cities
  "八王子": "Hachioji", "町田": "Machida", "府中": "Fuchu",
  "調布": "Chofu", "立川": "Tachikawa", "武蔵野": "Musashino",
  "三鷹": "Mitaka", "西東京": "Nishitokyo", "東久留米": "Higashikurume",
  "小金井": "Koganei", "国分寺": "Kokubunji", "国立": "Kunitachi",
  "稲城": "Inagi", "多摩": "Tama", "日野": "Hino",
  // Kansai
  "京都": "Kyoto", "大阪": "Osaka", "堺": "Sakai", "神戸": "Kobe",
  "姫路": "Himeji", "尼崎": "Amagasaki", "西宮": "Nishinomiya",
  "芦屋": "Ashiya", "宝塚": "Takarazuka", "明石": "Akashi",
  "奈良": "Nara", "大津": "Otsu", "和歌山": "Wakayama",
  "高槻": "Takatsuki", "東大阪": "Higashiosaka", "枚方": "Hirakata",
  // Chubu
  "名古屋": "Nagoya", "静岡": "Shizuoka", "浜松": "Hamamatsu",
  "沼津": "Numazu", "三島": "Mishima", "富士": "Fuji",
  "岐阜": "Gifu", "豊田": "Toyota", "岡崎": "Okazaki",
  "一宮": "Ichinomiya", "春日井": "Kasugai",
  // Kanto / other large
  "つくば": "Tsukuba", "水戸": "Mito", "宇都宮": "Utsunomiya",
  "前橋": "Maebashi", "高崎": "Takasaki", "川越": "Kawagoe",
  "長野": "Nagano", "松本": "Matsumoto", "金沢": "Kanazawa",
  "富山": "Toyama", "新潟": "Niigata", "福井": "Fukui",
  // Tohoku / Hokkaido
  "仙台": "Sendai", "札幌": "Sapporo", "青森": "Aomori",
  "盛岡": "Morioka", "秋田": "Akita", "山形": "Yamagata",
  "福島": "Fukushima",
  // Chugoku / Shikoku
  "広島": "Hiroshima", "岡山": "Okayama", "鳥取": "Tottori",
  "松江": "Matsue", "山口": "Yamaguchi", "下関": "Shimonoseki",
  "松山": "Matsuyama", "高松": "Takamatsu", "高知": "Kochi",
  "徳島": "Tokushima",
  // Kyushu / Okinawa
  "福岡": "Fukuoka", "北九州": "Kitakyushu", "久留米": "Kurume",
  "長崎": "Nagasaki", "佐世保": "Sasebo", "大分": "Oita",
  "別府": "Beppu", "宮崎": "Miyazaki", "熊本": "Kumamoto",
  "鹿児島": "Kagoshima", "那覇": "Naha",
};

export function translateOperator(jp: string | null): string | null {
  if (!jp) return jp;

  // Standalone non-geographic suffixes
  const standalone: Record<string, string> = {
    "私立": "Private",
    "国立": "National",
    "都立": "Tokyo Metropolitan",
    "府立": "Prefectural",
    "県立": "Prefectural",
    "道立": "Prefectural",
  };
  if (standalone[jp]) return standalone[jp];

  // Suffix → [municipality type label, English label suffix]
  const suffixRules: Array<[string, string, string]> = [
    ["区組合立", "区", "Ward Cooperative"],
    ["市組合立", "市", "City Cooperative"],
    ["組合立",   "",  "Cooperative"],
    ["区立",     "区", "Ward Public"],
    ["市立",     "市", "City Public"],
    ["町立",     "町", "Town Public"],
    ["村立",     "村", "Village Public"],
    ["区",       "区", "Ward"],
    ["市",       "市", "City"],
    ["町",       "町", "Town"],
    ["村",       "村", "Village"],
  ];

  for (const [suffix, muniChar, label] of suffixRules) {
    if (!jp.endsWith(suffix)) continue;
    // prefix is everything before the suffix
    const prefix = jp.slice(0, -suffix.length);
    // if muniChar is non-empty the prefix may itself end with it (e.g. "千代田区立" → prefix "千代田区")
    const nameKanji = muniChar ? prefix.replace(new RegExp(muniChar + "$"), "") : prefix;
    const romaji = ROMAJI_MAP[nameKanji];
    if (romaji) return `${romaji} ${label}`;
    // fallback: keep kanji name + label
    return nameKanji ? `${nameKanji} ${label}` : label;
  }

  return jp;
}
