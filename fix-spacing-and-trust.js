const fs = require('fs');
let content = fs.readFileSync('./src/app/page.tsx', 'utf-8');

// 1. Increase tool card spacing (currently gap-6, make it gap-8)
content = content.replace(/grid md:grid-cols-2 lg:grid-cols-5 gap-6/g, 
                         'grid md:grid-cols-2 lg:grid-cols-5 gap-8');

// 2. Add trust badges section before footer
const footerSearch = `今すぐ無料で試してみる`;

const trustSection = `今すぐ無料で試してみる
      </div>

      {/* Trust Badges Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">SSL暗号化通信</h3>
              <p className="text-sm text-gray-600">全ての通信を暗号化</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">日本国内サーバー</h3>
              <p className="text-sm text-gray-600">データは国内で完結</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">60分以内に削除</h3>
              <p className="text-sm text-gray-600">アップロードファイル自動削除</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4"`;

content = content.replace(footerSearch, trustSection);

fs.writeFileSync('./src/app/page.tsx', content);
console.log('✅ Fixed: Spacing increased, Trust badges added');
