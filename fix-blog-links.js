const fs = require('fs');
let content = fs.readFileSync('./src/data/dynamicBlogs.json', 'utf-8');

// Fix all tool links: remove "/tools/" 
content = content.replace(/https:\/\/yamada-tools\.jp\/tools\//g, 'https://yamada-tools.jp/');

fs.writeFileSync('./src/data/dynamicBlogs.json', content);
console.log('✅ Blog links fixed!');
