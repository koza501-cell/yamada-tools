#!/bin/bash

echo "=== IMAGE TOOLS ==="
for tool in compress crop format-convert qr-code resize rotate; do
  echo -n "Testing /image/$tool ... "
  status=$(curl -s -o /dev/null -w "%{http_code}" https://yamada-tools.jp/image/$tool)
  [ "$status" = "200" ] && echo "✅ OK" || echo "❌ FAILED ($status)"
done

echo ""
echo "=== DOCUMENT TOOLS ==="
for tool in invoice quotation receipt delivery-slip business-card resume cover-letter fax-cover business-email vertical-text; do
  echo -n "Testing /document/$tool ... "
  status=$(curl -s -o /dev/null -w "%{http_code}" https://yamada-tools.jp/document/$tool)
  [ "$status" = "200" ] && echo "✅ OK" || echo "❌ FAILED ($status)"
done

echo ""
echo "=== CONVERSION TOOLS ==="
for tool in wareki-seireki zenkaku-hankaku base64 url-encode unit date-converter phone-formatter postcode bank-format furigana; do
  echo -n "Testing /convert/$tool ... "
  status=$(curl -s -o /dev/null -w "%{http_code}" https://yamada-tools.jp/convert/$tool)
  [ "$status" = "200" ] && echo "✅ OK" || echo "❌ FAILED ($status)"
done

echo ""
echo "=== GENERATOR TOOLS ==="
for tool in hanko password qr-reader hash character-count text-diff tax-calculator salary-calc t-number holiday-checker age-calc nenmatsu-calc; do
  echo -n "Testing /generator/$tool ... "
  status=$(curl -s -o /dev/null -w "%{http_code}" https://yamada-tools.jp/generator/$tool)
  [ "$status" = "200" ] && echo "✅ OK" || echo "❌ FAILED ($status)"
done
