import { Metadata } from 'next';
import VisaCheckerClient from './client';

export const metadata: Metadata = {
  title: 'Japan Business Manager Visa Checker [Free] | 2026 Eligibility Requirements',
  description: 'Check your eligibility for Japan\'s Business Manager visa under the October 2025 updated rules. New ¥30M capital requirement, JLPT N2, and employee requirements. Free instant assessment.',
  keywords: ['business manager visa Japan', 'Japan business visa 2026', 'keiei kanri visa', 'Japan visa capital requirement', 'business manager visa 30 million yen', 'Japan startup visa', 'Japan investor visa'],
  openGraph: {
    title: 'Japan Business Manager Visa Checker [Free] | 2026 Rules | Yamada Tools',
    description: 'Check eligibility for Japan Business Manager visa under updated 2025 rules. ¥30M capital, JLPT N2, employee requirements.',
    type: 'website', url: 'https://yamada-tools.jp/en/business/visa-checker',
  },
  alternates: { canonical: 'https://yamada-tools.jp/en/business/visa-checker' },
};

const jsonLd = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Japan Business Manager Visa Eligibility Checker', description: 'Free tool to check eligibility for Japan Business Manager visa under the October 2025 updated requirements.', url: 'https://yamada-tools.jp/en/business/visa-checker', applicationCategory: 'BusinessApplication', operatingSystem: 'All', offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' }, provider: { '@type': 'Organization', name: 'Yamada Tools', url: 'https://yamada-tools.jp' } };

const faqJsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: 'What changed in the Business Manager visa in October 2025?', acceptedAnswer: { '@type': 'Answer', text: 'The minimum capital investment was raised from ¥5 million to ¥30 million. Additionally, JLPT N2 (or equivalent) Japanese proficiency is now required for the applicant or a full-time employee, and at least one full-time Japanese national or permanent resident employee must be hired.' } },
  { '@type': 'Question', name: 'What is the Startup visa alternative?', acceptedAnswer: { '@type': 'Answer', text: 'The Startup visa provides a 2-year runway with more flexible capital and employee requirements. You need endorsement from a participating local government or incubator. Available nationwide since recent expansions.' } },
  { '@type': 'Question', name: 'Can I own a company without a Business Manager visa?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Non-residents can own shares in a Japanese company. You can appoint a resident as representative director and manage the company remotely. However, you cannot work in Japan or manage day-to-day operations without an appropriate visa.' } },
  { '@type': 'Question', name: 'Is ¥30M the absolute minimum for capital?', acceptedAnswer: { '@type': 'Answer', text: 'For a new Business Manager visa application, yes. Renewals of existing visas may be evaluated under different criteria. The ¥30M can include both cash capital and demonstrable business assets.' } },
] };

const breadcrumbJsonLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://yamada-tools.jp/en' },
  { '@type': 'ListItem', position: 2, name: 'Business Tools', item: 'https://yamada-tools.jp/en/business' },
  { '@type': 'ListItem', position: 3, name: 'Visa Checker', item: 'https://yamada-tools.jp/en/business/visa-checker' },
] };

export default function VisaCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <VisaCheckerClient />
    </>
  );
}
