const fs = require('fs');
let content = fs.readFileSync('./src/data/dynamicBlogs.json', 'utf-8');

// Map of wrong links to correct links
const fixes = {
  'yamada-tools.jp/pdf-compress': 'yamada-tools.jp/pdf/compress',
  'yamada-tools.jp/pdf-merge': 'yamada-tools.jp/pdf/merge',
  'yamada-tools.jp/pdf-split': 'yamada-tools.jp/pdf/split',
  'yamada-tools.jp/pdf-password': 'yamada-tools.jp/pdf/protect',
  'yamada-tools.jp/image-resize': 'yamada-tools.jp/image/resize',
  'yamada-tools.jp/excel-to-pdf': 'yamada-tools.jp/pdf/excel-to-pdf',
  'yamada-tools.jp/invoice-generator': 'yamada-tools.jp/document/invoice',
  'yamada-tools.jp/hanko-generator': 'yamada-tools.jp/generator/hanko',
  'yamada-tools.jp/wareki-seireki': 'yamada-tools.jp/convert/wareki-seireki'
};

Object.keys(fixes).forEach(wrong => {
  const right = fixes[wrong];
  content = content.replace(new RegExp(wrong, 'g'), right);
});

fs.writeFileSync('./src/data/dynamicBlogs.json', content);
console.log('✅ All blog links fixed to correct tool paths!');
