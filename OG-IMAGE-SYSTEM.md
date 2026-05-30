# OG Image System — yamada-tools.jp

## Endpoint
/api/og — Next.js ImageResponse route, generates 1200x630 PNG on demand.

## Usage
https://yamada-tools.jp/api/og?title=TITLE&type=TYPE&category=CATEGORY

## Parameters
- title: post title (URL-encoded, truncated to 60 chars)
- type: blog or ai-recipe (controls layout/theme)
- category: category string (controls accent color)

## Designs

### Blog (type=blog)
- White background #FFFFFF
- Left 12px accent color bar
- Right 200px subtle tinted panel (7% opacity)
- Top: badge (filled) + category badge (outlined)
- Center: large title, left-aligned, 2 lines max
- Bottom: logo + site name + 3 trust pills
- Font: NotoSansJP-Bold.otf from public/fonts/

### AI Recipe (type=ai-recipe)
- Dark background #0F172A
- Top 6px accent color stripe + Right 8px accent bar
- Left glow blob (accent color, 8% opacity)
- Top: AIrecipe badge + category badge + copyOK pill
- Center: large title in light color #F1F5F9
- Bottom: logo + site name + ChatGPT/Claude/Gemini pills

## Accent Colors by Category
- PDF: #E53E3E (red)
- Business: #2B6CB0 (blue)
- Tax/Finance: #276749 (green)
- Real estate: #B7791F (amber)
- HR/Career: #553C9A (purple)
- Care/Education: #B83280 (pink)
- Inheritance: #744210 (brown)
- Image/Tools: #0987A0 (teal)
- ai-tools/prompt: #6B46C1 (violet)
- google: #C53030 (dark red)
- Default: #1A365D (navy)

## How to apply to new posts (Python)
import urllib.parse

def og_url(title, type_, category):
    params = urllib.parse.urlencode({"title": title[:60], "type": type_, "category": category})
    return f"https://yamada-tools.jp/api/og?{params}"

# Blog post example
og_url("new blog title", "blog", "PDF")

# AI recipe example
og_url("new recipe title", "ai-recipe", "ai-tools")

## Source file
src/app/api/og/route.tsx (both frontend/ and frontend-staging/)

## Font requirement
public/fonts/NotoSansJP-Bold.otf must exist in both prod and staging.

## Notes
- All 110 blogs and 44 AI recipes use this system as of 2026-05-30
- No R2 images or emoji gradients — 100% dynamic via this endpoint
- Adding new category: add to CAT_COLOR dict in route.tsx
