import { Tool } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface ToolSchemaProps {
  tool: Pick<Tool, "nameJa" | "description" | "path">;
  faq?: FAQ[];
}

export default function ToolSchema({ tool, faq }: ToolSchemaProps) {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.nameJa,
    "description": tool.description,
    "url": `https://yamada-tools.jp${tool.path}`,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "inLanguage": "ja-JP",
    "isAccessibleForFree": true,
    "provider": {
      "@type": "Organization",
      "@id": "https://yamada-tools.jp/#organization",
      "name": "合同会社山田トレード"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    }
  };

  const faqSchema = faq && faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
