const fs = require('fs');
let content = fs.readFileSync('./src/components/layout/Header.tsx', 'utf-8');

const oldLogo = `<img
              src="/logo-icon.png"
              alt="山田ツール"
              className="w-8 h-8"
            />`;

const newLogo = `<img
              src="/logo-icon.png"
              alt="山田ツール"
              className="w-10 h-10 rounded-lg bg-white/10 p-1.5 border border-white/20"
            />`;

content = content.replace(oldLogo, newLogo);
content = content.replace(
  'className="font-bold text-lg">山田ツール',
  'className="font-bold text-xl">山田ツール'
);

fs.writeFileSync('./src/components/layout/Header.tsx', content);
console.log('✅ Header fixed');
