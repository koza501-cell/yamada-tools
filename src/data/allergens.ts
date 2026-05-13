// 食物アレルギー 28品目 + 代替表記辞書
// 義務9品目 + 推奨20品目
// 令和8年4月1日 改正対応 (カシューナッツ義務化・ピスタチオ追加)
// Source: 消費者庁「アレルゲンを含む食品に関する表示について」

export type AllergenSeverity = 'gimu' | 'suishou'; // 義務 / 推奨

export interface Allergen {
  id: string;
  mainLabel: string;
  severity: AllergenSeverity;
  aliases: string[];
  hiddenIn?: string;
  note?: string;
}

export const ALLERGENS: Allergen[] = [
  // ───── 義務表示 9品目 ─────
  {
    id: 'shrimp',
    mainLabel: 'えび',
    severity: 'gimu',
    aliases: ['えび', 'エビ', '海老', '蝦', 'あまえび', '甘エビ', '甘えび', 'shrimp', 'prawn', '車海老', '伊勢海老', 'ロブスター'],
    hiddenIn: 'シーフード加工品、エビ風味の練り物',
  },
  {
    id: 'crab',
    mainLabel: 'かに',
    severity: 'gimu',
    aliases: ['かに', 'カニ', '蟹', 'たらばがに', 'タラバガニ', 'ずわいがに', 'ズワイガニ', 'crab'],
    hiddenIn: 'カニカマ、シーフード加工品',
  },
  {
    id: 'walnut',
    mainLabel: 'くるみ',
    severity: 'gimu',
    aliases: ['くるみ', 'クルミ', '胡桃', 'walnut', 'ウォルナット'],
    hiddenIn: 'パン、お菓子、サラダドレッシング',
    note: '令和5年3月 義務化',
  },
  {
    id: 'cashew',
    mainLabel: 'カシューナッツ',
    severity: 'gimu',
    aliases: ['カシューナッツ', 'カシュー', 'cashew'],
    hiddenIn: 'ペスト、グラノーラ、エスニック料理、ナッツミックス',
    note: '令和8年4月1日 義務化',
  },
  {
    id: 'wheat',
    mainLabel: '小麦',
    severity: 'gimu',
    aliases: ['小麦', 'こむぎ', 'コムギ', '小麦粉', 'wheat', '強力粉', '薄力粉', 'パン粉', '麩', 'グルテン', 'gluten', '麺', 'うどん', 'パスタ', 'ラーメン', '醤油', 'しょうゆ', '味噌', 'みそ', '麦茶'],
    hiddenIn: '醤油、味噌、麺類、パン粉、麩',
  },
  {
    id: 'soba',
    mainLabel: 'そば',
    severity: 'gimu',
    aliases: ['そば', 'ソバ', '蕎麦', '蕎麦粉', 'buckwheat'],
    hiddenIn: 'そば製品、ガレット',
  },
  {
    id: 'egg',
    mainLabel: '卵',
    severity: 'gimu',
    aliases: ['卵', 'たまご', '玉子', 'タマゴ', 'エッグ', 'egg', 'マヨネーズ', 'mayonnaise', '卵黄', '卵白', '全卵', '凍結卵', 'ハム', 'かまぼこ', '練り物', 'カスタード', 'メレンゲ', 'プリン'],
    hiddenIn: 'マヨネーズ、ハム、かまぼこ、洋菓子、麺類',
  },
  {
    id: 'milk',
    mainLabel: '乳',
    severity: 'gimu',
    aliases: ['乳', '牛乳', 'ぎゅうにゅう', 'milk', 'チーズ', 'cheese', 'バター', 'butter', 'ヨーグルト', 'yogurt', '生クリーム', 'クリーム', 'cream', 'ホエイ', 'whey', 'カゼイン', 'casein', '練乳', '脱脂粉乳', '全粉乳', 'スキムミルク', 'ラクトース', '乳糖', 'カルシウム強化', '乳化剤', '乳成分', '乳由来', 'ホットケーキミックス'],
    hiddenIn: 'バター、チーズ、生クリーム、洋菓子、パン、カレールー',
  },
  {
    id: 'peanut',
    mainLabel: '落花生',
    severity: 'gimu',
    aliases: ['落花生', 'らっかせい', 'ラッカセイ', 'ピーナッツ', 'ピーナツ', 'peanut', 'ピーナッツバター', 'ピーナッツオイル', '南京豆'],
    hiddenIn: 'ピーナッツバター、中華料理、菓子類',
  },

  // ───── 推奨表示 20品目 ─────
  {
    id: 'almond',
    mainLabel: 'アーモンド',
    severity: 'suishou',
    aliases: ['アーモンド', 'almond', '杏仁'],
    hiddenIn: 'お菓子、グラノーラ',
  },
  {
    id: 'abalone',
    mainLabel: 'あわび',
    severity: 'suishou',
    aliases: ['あわび', 'アワビ', '鮑', 'abalone'],
  },
  {
    id: 'squid',
    mainLabel: 'いか',
    severity: 'suishou',
    aliases: ['いか', 'イカ', '烏賊', 'squid', 'するめ', 'スルメ', 'イカ墨'],
  },
  {
    id: 'salmonroe',
    mainLabel: 'いくら',
    severity: 'suishou',
    aliases: ['いくら', 'イクラ', 'salmonroe', '筋子'],
  },
  {
    id: 'orange',
    mainLabel: 'オレンジ',
    severity: 'suishou',
    aliases: ['オレンジ', 'orange', 'ネーブル'],
    hiddenIn: 'ジュース、マーマレード、お菓子',
  },
  {
    id: 'kiwi',
    mainLabel: 'キウイフルーツ',
    severity: 'suishou',
    aliases: ['キウイ', 'キーウィ', 'kiwi'],
    hiddenIn: 'ジュース、ジャム、果物盛り合わせ',
  },
  {
    id: 'beef',
    mainLabel: '牛肉',
    severity: 'suishou',
    aliases: ['牛肉', 'ぎゅうにく', 'ビーフ', 'beef', 'ステーキ', 'ハンバーグ', 'コンビーフ', 'ビーフエキス'],
  },
  {
    id: 'sesame',
    mainLabel: 'ごま',
    severity: 'suishou',
    aliases: ['ごま', 'ゴマ', '胡麻', 'sesame', 'ごま油', 'ねりごま', 'すりごま', 'ごまだれ', 'タヒニ'],
    hiddenIn: 'ごま油、ドレッシング、和え物、シリアル',
  },
  {
    id: 'salmon',
    mainLabel: 'さけ',
    severity: 'suishou',
    aliases: ['さけ', 'サケ', '鮭', 'サーモン', 'salmon', 'スモークサーモン', '塩鮭'],
  },
  {
    id: 'mackerel',
    mainLabel: 'さば',
    severity: 'suishou',
    aliases: ['さば', 'サバ', '鯖', 'mackerel', 'シメサバ', 'さば節'],
    hiddenIn: 'だし、煮干し、缶詰',
  },
  {
    id: 'soy',
    mainLabel: '大豆',
    severity: 'suishou',
    aliases: ['大豆', 'だいず', 'ダイズ', 'soy', 'soybean', '醤油', 'しょうゆ', '味噌', 'みそ', '豆腐', 'とうふ', 'きなこ', '油揚げ', '厚揚げ', '納豆', '豆乳', '湯葉', 'おから', '大豆油', 'レシチン', '大豆たんぱく', 'TVP'],
    hiddenIn: '醤油、味噌、豆腐、油揚げ、調味料',
  },
  {
    id: 'chicken',
    mainLabel: '鶏肉',
    severity: 'suishou',
    aliases: ['鶏肉', 'とり肉', 'とりにく', 'チキン', 'chicken', '鶏もも', 'ささみ', '鶏むね', 'ナゲット', 'チキンエキス'],
  },
  {
    id: 'banana',
    mainLabel: 'バナナ',
    severity: 'suishou',
    aliases: ['バナナ', 'banana'],
  },
  {
    id: 'pork',
    mainLabel: '豚肉',
    severity: 'suishou',
    aliases: ['豚肉', 'ぶたにく', 'ポーク', 'pork', 'ロース', 'バラ肉', 'ベーコン', 'ハム', 'ソーセージ', 'ラード'],
    hiddenIn: 'ベーコン、ハム、ソーセージ',
  },
  {
    id: 'macadamia',
    mainLabel: 'マカダミアナッツ',
    severity: 'suishou',
    aliases: ['マカダミア', 'マカダミアナッツ', 'macadamia'],
    note: '令和6年3月 追加',
  },
  {
    id: 'pistachio',
    mainLabel: 'ピスタチオ',
    severity: 'suishou',
    aliases: ['ピスタチオ', 'pistachio'],
    hiddenIn: 'お菓子、アイスクリーム、ヌガー、トルコ料理',
    note: '令和8年4月1日 追加',
  },
  {
    id: 'peach',
    mainLabel: 'もも',
    severity: 'suishou',
    aliases: ['もも', 'モモ', '桃', 'ピーチ', 'peach', '白桃', '黄桃'],
    hiddenIn: 'ジュース、ジャム、缶詰',
  },
  {
    id: 'yamaimo',
    mainLabel: 'やまいも',
    severity: 'suishou',
    aliases: ['やまいも', 'ヤマイモ', '山芋', '長芋', 'ながいも', '大和芋', 'やまといも', 'とろろ'],
  },
  {
    id: 'apple',
    mainLabel: 'りんご',
    severity: 'suishou',
    aliases: ['りんご', 'リンゴ', '林檎', 'アップル', 'apple', 'アップルジュース', 'アップルパイ', 'ふじ'],
    hiddenIn: 'ジュース、ジャム、お菓子',
  },
  {
    id: 'gelatin',
    mainLabel: 'ゼラチン',
    severity: 'suishou',
    aliases: ['ゼラチン', 'gelatin', 'gelatine'],
    hiddenIn: 'ゼリー、グミ、マシュマロ、プリン',
  },
];

// ───── Checker function ─────

export interface AllergenHit {
  allergen: Allergen;
  matches: string[];
}

export function checkAllergens(text: string): AllergenHit[] {
  if (!text) return [];
  const lowerText = text.toLowerCase();
  const hits: AllergenHit[] = [];

  for (const allergen of ALLERGENS) {
    const seen = new Set<string>();
    const matches: string[] = [];
    for (const alias of allergen.aliases) {
      if (lowerText.includes(alias.toLowerCase()) && !seen.has(alias.toLowerCase())) {
        seen.add(alias.toLowerCase());
        matches.push(alias);
      }
    }
    if (matches.length > 0) {
      hits.push({ allergen, matches });
    }
  }
  return hits;
}

// ───── Nut group for cross-contamination warning ─────
export const NUT_IDS = ['walnut', 'peanut', 'almond', 'cashew', 'macadamia', 'pistachio'];

export function hasNuts(hits: AllergenHit[]): boolean {
  return hits.some(h => NUT_IDS.includes(h.allergen.id));
}
