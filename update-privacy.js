const fs = require('fs');
let content = fs.readFileSync('./src/app/legal/privacy/page.tsx', 'utf-8');

// Replace "処理完了後、自動的にサーバーから完全に削除されます" with more specific wording
content = content.replace(
  'ファイルは処理完了後、自動的にサーバーから完全に削除されます',
  'ファイルは処理完了後60分以内に、サーバーから完全に削除されます'
);

content = content.replace(
  'アップロードされたファイルは処理後、即座に削除されます',
  'アップロードされたファイルは処理後60分以内に自動削除されます'
);

fs.writeFileSync('./src/app/legal/privacy/page.tsx', content);
console.log('✅ Privacy policy updated with 60-minute deletion timeframe');
