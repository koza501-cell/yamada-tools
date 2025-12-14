const fs = require('fs');
let content = fs.readFileSync('./src/app/page.tsx', 'utf-8');

// 1. Change orange text to gold
content = content.replace(/text-orange-400/g, 'text-yellow-600');
content = content.replace(/text-orange-500/g, 'text-yellow-700');

// 2. Add user count (社会的証明 - social proof)
const heroSection = `海外サーバーを使わない
          <span className="text-yellow-600">日本国内完結</span>のツール。`;

const heroSectionWithProof = `海外サーバーを使わない
          <span className="text-yellow-600">日本国内完結</span>のツール。
          <div className="mt-4 text-sm text-gray-400">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
              10,000人以上が利用中
            </span>
          </div>`;

content = content.replace(heroSection, heroSectionWithProof);

fs.writeFileSync('./src/app/page.tsx', content);
console.log('✅ Fixed: Orange → Gold, Added user count');
