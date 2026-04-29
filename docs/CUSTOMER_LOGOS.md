# Customer Logos

The `CompanyLogosWall` component displays logos of companies that have
given explicit written approval to be listed on yamada-tools.jp.

## Current status

The array in `src/config/customer-logos.ts` is **empty by default**.
The component renders a placeholder card until real logos are added.

## How to add a logo

### Requirements before adding

1. Written approval from the company (email or signed consent form)
2. Logo file in SVG or PNG format, ideally with transparent background
3. File dimensions: at most 240×120px (logos are displayed at 120×60 CSS px)

### Steps

1. Place the approved logo file in `public/logos/` using the naming convention:
   ```
   public/logos/<company-slug>.svg   (preferred)
   public/logos/<company-slug>.png   (fallback)
   ```
   Example: `public/logos/yamada-trade.svg`

2. Add an entry to `src/config/customer-logos.ts`:
   ```ts
   { name: "合同会社山田トレード", logoSrc: "/logos/yamada-trade.svg", href: "https://yamadatrade.jp/" }
   ```

3. Commit with the approval reference number in the commit message:
   ```
   feat(logos): add XYZ Co. logo (approval ref: 2026-001)
   ```

### Display rules

| Count | Layout |
|-------|--------|
| 0 | Placeholder card "掲載企業募集中" |
| 1–5 | Centered row |
| 6+ | Responsive grid (max 18 visible) |

Logos are displayed in grayscale and gain color on hover.
