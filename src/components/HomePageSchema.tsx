export default function HomePageSchema() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Yamada Tools",
    "alternateName": "山田ツール",
    "url": "https://yamada-tools.jp/",
    "description": "日本国内サーバー完結の無料オンラインツール。登録不要でPDF結合、画像リサイズ、請求書作成などが可能です。",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    },
    "featureList": [
      "日本国内サーバー",
      "自動データ削除",
      "登録不要",
      "SSL暗号化通信",
      "60分以内完全削除"
    ],
    "author": {
      "@type": "Organization",
      "name": "合同会社山田トレード",
      "url": "https://yamada-tools.jp"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "山田ツール",
    "alternateName": "Yamada Tools",
    "url": "https://yamada-tools.jp",
    "logo": "https://yamada-tools.jp/icon-512x512.png",
    "description": "日本最大級の無料オンラインツール集",
    "email": "support@yamada-tools.jp",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "support@yamada-tools.jp",
      "availableLanguage": "Japanese"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "JP"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
