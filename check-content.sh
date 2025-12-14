#!/bin/bash
echo "=== CONTENT QUALITY AUDIT ==="

# 1. Check for common Japanese typos
echo "1. Checking for common typos..."
grep -r "ファイル削除" ./src --include="*.tsx" --include="*.ts" | wc -l
echo "   (Should say ファイル削除 for file deletion)"

# 2. Check privacy policy mentions 60分削除
echo "2. Checking privacy policy has 60-minute deletion..."
grep -r "60分" ./src/app/legal/privacy/page.tsx || echo "   ⚠️  Missing!"

# 3. Check company name consistency
echo "3. Checking company name..."
grep -r "山田トレード" ./src/app/about --include="*.tsx" | head -2

# 4. Check all blog links are fixed
echo "4. Checking blog tool links..."
grep "yamada-tools.jp/tools/" ./src/data/dynamicBlogs.json && echo "   ❌ Still has /tools/ prefix!" || echo "   ✅ Links fixed"

# 5. Check homepage load time
echo "5. Testing homepage performance..."
time curl -s https://yamada-tools.jp > /dev/null

echo ""
echo "=== DONE ==="
