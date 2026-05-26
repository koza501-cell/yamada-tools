# Emoji Vocabulary

Approved emoji set for yamada-tools.jp homepage. All rendered via `<Emoji symbol size label>`.

## Rules

- Emoji in H1, nav menu items, button labels, tab bar items: **removed**.
- All remaining emoji rendered through `<Emoji symbol size label>` component.
- Decorative (no semantic meaning): omit `label` → `role="presentation" aria-hidden`.
- Semantic (conveys meaning, no adjacent text): provide `label` → `role="img" aria-label`.
- Font stack: `"Noto Color Emoji", "Twemoji Mozilla", "Apple Color Emoji", "Segoe UI Emoji", sans-serif`

## Approved Mappings

| Symbol | Concept | Size | Location |
|--------|---------|------|----------|
| 🛠️ | ツール / category section heading | lg | TabbedToolsSection h2 |
| 🕐 | 最近使ったツール / recency | lg | RecentTools heading |
| 🚀 | PROプラン / upgrade CTA | lg | FooterCta heading |
| ✏️ | 入力ステップ / step 1 | xl | HeroAnimation |
| ⚡ | 処理ステップ / step 2 | xl | HeroAnimation |
| ✅ | 完了ステップ / step 3 | xl | HeroAnimation |
| 🇯🇵 | 国内サーバー / Japan flag | sm | HeroAnimation sub-label |
| 📄 | PDF tools | lg | TabbedToolsSection, page chips |
| 📝 | 書類 / document tools | lg | TabbedToolsSection, blog section h2 |
| 🔄 | 変換 / convert tools | lg | TabbedToolsSection |
| 🖼️ | 画像 / image tools | lg | TabbedToolsSection |
| 💰 | 金融 / finance | lg | TabbedToolsSection |
| 💼 | キャリア / career | lg | TabbedToolsSection |
| 💴 | 税金 / tax | lg | TabbedToolsSection |
| 🏘️ | 不動産 / realestate | lg | TabbedToolsSection |
| 🏢 | 法人 / business | lg | TabbedToolsSection, B2B section |
| 💪 | 健康 / health | lg | TabbedToolsSection |
| 🍽️ | 飲食 / food | lg | TabbedToolsSection |
| 🏠 | 生活 / life | lg | TabbedToolsSection |
| 🏥 | クリニック / clinic | lg | TabbedToolsSection |
| 📰 | メディア掲載 / press | lg | page media section h2 |
| 📅 | 運営年数 / years operated | sm | page trust strip |
| 🏢 | 会社情報 / company | sm | page trust strip |
| 🔲 | QR code | — | tool icon (dynamic) |

## Size Reference

| Size | px | Use case |
|------|----|---------|
| sm | 16px | Inline labels, sub-text |
| md | 20px | Body-level icons |
| lg | 24px | Section headings, card icons |
| xl | 32px | Hero / large display |
