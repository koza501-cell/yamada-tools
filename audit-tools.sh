#!/bin/bash
echo "=== PDF TOOLS AUDIT ==="
echo ""

tools=(
  "pdf/compress"
  "pdf/merge" 
  "pdf/split"
  "pdf/rotate"
  "pdf/protect"
  "pdf/unlock"
  "pdf/watermark"
  "pdf/sign"
  "pdf/ocr"
  "pdf/delete-pages"
  "pdf/reorder"
  "pdf/page-numbers"
  "pdf/word-to-pdf"
  "pdf/excel-to-pdf"
  "pdf/ppt-to-pdf"
  "pdf/pdf-to-word"
  "pdf/pdf-to-excel"
  "pdf/pdf-to-ppt"
  "pdf/image-to-pdf"
  "pdf/pdf-to-image"
)

for tool in "${tools[@]}"; do
  echo -n "Testing /$tool ... "
  status=$(curl -s -o /dev/null -w "%{http_code}" https://yamada-tools.jp/$tool)
  if [ "$status" = "200" ]; then
    echo "✅ OK"
  else
    echo "❌ FAILED ($status)"
  fi
done
