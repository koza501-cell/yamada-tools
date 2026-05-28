type CategoryStyle = { gradient: string; emoji: string };

const STYLES: [string, CategoryStyle][] = [
  ['PDF',           { gradient: 'from-orange-400 to-red-500',     emoji: '📄' }],
  ['ビジネス',      { gradient: 'from-blue-500 to-indigo-600',    emoji: '🏢' }],
  ['Japan Business',{ gradient: 'from-blue-500 to-indigo-600',    emoji: '🏢' }],
  ['税金',          { gradient: 'from-green-500 to-emerald-600',  emoji: '💰' }],
  ['確定申告',      { gradient: 'from-green-500 to-emerald-600',  emoji: '💰' }],
  ['節税',          { gradient: 'from-green-500 to-emerald-600',  emoji: '💰' }],
  ['経理',          { gradient: 'from-green-500 to-emerald-600',  emoji: '💰' }],
  ['副業',          { gradient: 'from-green-500 to-emerald-600',  emoji: '💰' }],
  ['不動産',        { gradient: 'from-amber-400 to-yellow-500',   emoji: '🏠' }],
  ['住宅',          { gradient: 'from-amber-400 to-yellow-500',   emoji: '🏠' }],
  ['生活・住まい',  { gradient: 'from-amber-400 to-yellow-500',   emoji: '🏠' }],
  ['相続',          { gradient: 'from-purple-500 to-violet-600',  emoji: '📜' }],
  ['介護',          { gradient: 'from-pink-400 to-rose-500',      emoji: '🏥' }],
  ['クリニック',    { gradient: 'from-pink-400 to-rose-500',      emoji: '🏥' }],
  ['画像',          { gradient: 'from-cyan-400 to-blue-500',      emoji: '🖼️' }],
  ['変換',          { gradient: 'from-cyan-400 to-blue-500',      emoji: '🖼️' }],
  ['Image tools',   { gradient: 'from-cyan-400 to-blue-500',      emoji: '🖼️' }],
  ['Conversion tools',{ gradient: 'from-cyan-400 to-blue-500',    emoji: '🖼️' }],
  ['キャリア',      { gradient: 'from-teal-400 to-green-600',     emoji: '👔' }],
  ['転職',          { gradient: 'from-teal-400 to-green-600',     emoji: '👔' }],
  ['給与',          { gradient: 'from-teal-400 to-green-600',     emoji: '👔' }],
  ['人事',          { gradient: 'from-teal-400 to-green-600',     emoji: '👔' }],
  ['年金',          { gradient: 'from-violet-400 to-purple-600',  emoji: '🏦' }],
  ['保険',          { gradient: 'from-violet-400 to-purple-600',  emoji: '🏦' }],
  ['老後',          { gradient: 'from-violet-400 to-purple-600',  emoji: '🏦' }],
  ['資産',          { gradient: 'from-violet-400 to-purple-600',  emoji: '🏦' }],
  ['教育',          { gradient: 'from-yellow-400 to-lime-500',    emoji: '📚' }],
  ['書類',          { gradient: 'from-slate-400 to-gray-600',     emoji: '🏛️' }],
  ['ガイド',        { gradient: 'from-slate-400 to-gray-600',     emoji: '📋' }],
  ['業務',          { gradient: 'from-slate-400 to-gray-600',     emoji: '⚙️' }],
  ['Security',      { gradient: 'from-red-500 to-orange-600',     emoji: '🔒' }],
  ['ジェネレーター',{ gradient: 'from-indigo-400 to-violet-600',  emoji: '⚡' }],
  ['Generator',     { gradient: 'from-indigo-400 to-violet-600',  emoji: '⚡' }],
  ['抽選',          { gradient: 'from-yellow-300 to-amber-500',   emoji: '🎲' }],
  ['飲食',          { gradient: 'from-orange-400 to-amber-500',   emoji: '🍽️' }],
  ['農業',          { gradient: 'from-green-400 to-lime-500',     emoji: '🌱' }],
  ['借金',          { gradient: 'from-red-400 to-gray-600',       emoji: '💳' }],
];

const DEFAULT_STYLE: CategoryStyle = { gradient: 'from-gray-400 to-slate-600', emoji: '📝' };

export function getCategoryStyle(category: string): CategoryStyle {
  for (const [prefix, style] of STYLES) {
    if (category.startsWith(prefix)) return style;
  }
  return DEFAULT_STYLE;
}
