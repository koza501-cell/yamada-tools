const fs = require('fs');
let content = fs.readFileSync('tailwind.config.ts', 'utf-8');

// Change sakura from hot pink (#FF69B4) to professional gold (#D4AF37)
content = content.replace("sakura: '#FF69B4'", "sakura: '#D4AF37'");

fs.writeFileSync('tailwind.config.ts', content);
console.log('✅ Changed sakura: #FF69B4 (hot pink) → #D4AF37 (professional gold)');
