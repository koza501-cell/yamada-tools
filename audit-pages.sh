#!/bin/bash

echo "=== CORE PAGES ==="
for page in "" "about/us" "about/company" "about/faq" "about/transparency" "about/fair-usage" "legal/privacy" "legal/terms" "legal/tokushoho" "blog"; do
  echo -n "Testing /$page ... "
  status=$(curl -s -o /dev/null -w "%{http_code}" https://yamada-tools.jp/$page)
  [ "$status" = "200" ] && echo "✅ OK" || echo "❌ FAILED ($status)"
done

echo ""
echo "=== CATEGORY PAGES ==="
for cat in pdf image document convert generator; do
  echo -n "Testing /$cat ... "
  status=$(curl -s -o /dev/null -w "%{http_code}" https://yamada-tools.jp/$cat)
  [ "$status" = "200" ] && echo "✅ OK" || echo "❌ FAILED ($status)"
done

echo ""
echo "=== SEO & TECHNICAL ==="
echo -n "Sitemap.xml ... "
status=$(curl -s -o /dev/null -w "%{http_code}" https://yamada-tools.jp/sitemap.xml)
[ "$status" = "200" ] && echo "✅ OK" || echo "❌ FAILED ($status)"

echo -n "Robots.txt ... "
status=$(curl -s -o /dev/null -w "%{http_code}" https://yamada-tools.jp/robots.txt)
[ "$status" = "200" ] && echo "✅ OK" || echo "❌ FAILED ($status)"

echo -n "Favicon ... "
status=$(curl -s -o /dev/null -w "%{http_code}" https://yamada-tools.jp/favicon.ico)
[ "$status" = "200" ] && echo "✅ OK" || echo "❌ FAILED ($status)"
