import { Metadata } from 'next';
import FormationCostClient from './client';

export const metadata: Metadata = {
  title: 'Japan Company Formation Cost Calculator [Free] | KK vs GK Setup Costs 2026',
  description: 'Calculate the total cost to form a company in Japan. Compare KK (Kabushiki Kaisha) vs GK (Godo Kaisha) setup costs including registration tax, notarization fees, and hidden costs. Free, no registration required.',
  keywords: ['Japan company formation cost', 'KK vs GK cost', 'start company Japan cost', 'Kabushiki Kaisha formation', 'Godo Kaisha setup', 'Japan business registration fee', 'Japan company setup calculator'],
  openGraph: {
    title: 'Japan Company Formation Cost Calculator [Free] | Yamada Tools',
    description: 'Calculate KK vs GK setup costs in Japan. Registration tax, notarization, stamps, and hidden costs — all in one free calculator.',
    type: 'website', url: 'https://yamada-tools.jp/en/business/formation-cost',
  },
  alternates: { canonical: 'https://yamada-tools.jp/en/business/formation-cost' },
};

const jsonLd = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Japan Company Formation Cost Calculator', description: 'Free tool to calculate the total cost of forming a KK or GK company in Japan, including all fees and hidden costs.', url: 'https://yamada-tools.jp/en/business/formation-cost', applicationCategory: 'BusinessApplication', operatingSystem: 'All', offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' }, provider: { '@type': 'Organization', name: 'Yamada Tools', url: 'https://yamada-tools.jp' } };

const faqJsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: 'How much does it cost to start a company in Japan?', acceptedAnswer: { '@type': 'Answer', text: 'A KK (Kabushiki Kaisha/stock company) costs approximately ¥200,000-250,000 in government fees. A GK (Godo Kaisha/LLC) costs approximately ¥60,000-100,000. These are mandatory fees — actual total costs including stamps, certificates, and professional fees are higher.' } },
  { '@type': 'Question', name: 'What is the difference between KK and GK in Japan?', acceptedAnswer: { '@type': 'Answer', text: 'KK (Kabushiki Kaisha) is a stock company similar to a corporation, offering higher credibility and the ability to issue shares. GK (Godo Kaisha) is similar to an LLC, with lower setup costs, simpler management, and no notarization requirement. Many foreign companies (Apple Japan, Amazon Japan, Google) operate as GK.' } },
  { '@type': 'Question', name: 'Can I start a company in Japan with ¥1?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, the minimum capital is ¥1 for both KK and GK. However, the registration tax has a minimum floor (¥150,000 for KK, ¥60,000 for GK) regardless of capital amount. Practically, ¥1M+ capital is recommended for credibility with banks and business partners.' } },
  { '@type': 'Question', name: 'Do I need a visa to start a company in Japan?', acceptedAnswer: { '@type': 'Answer', text: 'Non-residents can own a Japanese company, but to manage it from Japan you need a Business Manager visa. Since October 2025, requirements include ¥30M+ capital (up from ¥5M), at least one full-time Japanese/PR employee, and business management experience.' } },
] };

const breadcrumbJsonLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://yamada-tools.jp/en' },
  { '@type': 'ListItem', position: 2, name: 'Business Tools', item: 'https://yamada-tools.jp/en/business' },
  { '@type': 'ListItem', position: 3, name: 'Formation Cost Calculator', item: 'https://yamada-tools.jp/en/business/formation-cost' },
] };

export default function FormationCostPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <FormationCostClient />
    </>
  );
}
