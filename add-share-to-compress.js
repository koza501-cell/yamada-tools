const fs = require('fs');
let content = fs.readFileSync('./src/app/pdf/compress/page.tsx', 'utf-8');

// Add import at top
if (!content.includes('ShareButtons')) {
  content = content.replace(
    'import { Metadata',
    'import ShareButtons from "@/components/ShareButtons";\nimport { Metadata'
  );
  
  // Add ShareButtons before closing main div
  content = content.replace(
    '</div>\n    </div>\n  );\n}',
    '</div>\n        <ShareButtons toolName="PDF圧縮ツール" />\n      </div>\n    </div>\n  );\n}'
  );
  
  fs.writeFileSync('./src/app/pdf/compress/page.tsx', content);
  console.log('✅ ShareButtons added to PDF compress page');
} else {
  console.log('⚠️  ShareButtons already exists');
}
