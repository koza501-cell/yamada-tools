import type { Metadata } from "next";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const metadata: Metadata = {
  title: "Add Text to PDF Free Online | No Registration, No Upload | Yamada Tools",
  description: "Free browser-based PDF text editor. Add text, stamps & dates to any PDF. No registration, no file upload to server, no installation needed. Works on Chrome, Firefox, Safari, Edge.",
  keywords: ["add text to PDF online free","fill PDF form online no registration","PDF editor browser only no upload","type on PDF free no sign up","electronic stamp PDF Japan","free Adobe Acrobat alternative"],
  openGraph: {
    title: "Add Text to PDF Free Online | Yamada Tools",
    description: "Free browser-based PDF editor. Add text, electronic stamps & auto-dates. No sign-up, no file upload. Works in any browser.",
    type: "website",
    url: "https://yamada-tools.jp/en/pdf-text-input",
    siteName: "Yamada Tools",
    locale: "en_US",
    images: [{ url: "https://yamada-tools.jp/api/og?title=Add%20Text%20to%20PDF%20Free%20Online&type=blog&category=PDF%20Tools", width: 1200, height: 630, alt: "Add Text to PDF - Yamada Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Add Text to PDF Free Online | Yamada Tools",
    description: "Free browser-based PDF editor. No sign-up, no file upload.",
    images: ["https://yamada-tools.jp/api/og?title=Add%20Text%20to%20PDF%20Free%20Online&type=blog&category=PDF%20Tools"],
  },
  alternates: {
    canonical: "https://yamada-tools.jp/en/pdf-text-input",
    languages: {
      "ja": "https://yamada-tools.jp/pdf/text-input",
      "en": "https://yamada-tools.jp/en/pdf-text-input",
      "x-default": "https://yamada-tools.jp/pdf/text-input",
    },
  },
  robots: { index: true, follow: true },
};

export default function EnglishPdfTextPage() {
  const faqEn = [
    { q: "Is this PDF editor completely free?", a: "Yes. Yamada Tools PDF text input is 100% free with no hidden costs, no premium tier, and no registration required." },
    { q: "Do I need to create an account?", a: "No. You can use the tool immediately without signing up, logging in, or installing anything. Just open the page in your browser." },
    { q: "Is my PDF file uploaded to a server?", a: "No. All processing happens entirely in your browser using PDF.js. Your file never leaves your device. This makes it safe for confidential documents." },
    { q: "What browsers are supported?", a: "Google Chrome, Microsoft Edge, Firefox, and Safari (latest versions). Chrome and Edge provide the best experience." },
    { q: "Can I add an electronic stamp (hanko) to my PDF?", a: "Yes. The hanko feature generates a circular red Japanese-style seal from 1-4 characters you enter. You can choose from 5 sizes and place it anywhere on the PDF." },
    { q: "Can I use Japanese era dates (Reiwa)?", a: "Yes. The date auto-insert button can insert today's date in either Western format (e.g., 2026年3月25日) or Japanese Reiwa era format (e.g., 令和8年3月25日)." },
    { q: "Does it support multi-page PDFs?", a: "Yes. You can navigate between pages and add text, stamps, or highlights to each page individually. All pages are saved in one PDF on download." },
    { q: "Can I undo mistakes?", a: "Yes. Use Ctrl+Z (or the undo button) to undo the last action. Up to 50 steps of undo history are supported." },
    { q: "What types of PDFs can I edit?", a: "Any PDF document — application forms, contracts, invoices, resumes, worksheets, insurance documents, and more. Both scanned and text PDFs are supported." },
    { q: "Is this a free alternative to Adobe Acrobat?", a: "For basic text entry, stamp placement, and date insertion tasks, yes. Yamada Tools handles these common use cases entirely free in your browser, without Adobe Acrobat's subscription cost or login requirement." },
  ];

  const softwareSchemaEn = {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebApplication"],
    name: "Yamada Tools - Add Text to PDF",
    url: "https://yamada-tools.jp/pdf/text-input",
    description: "Free browser-based PDF text editor. Add text, stamps and dates to any PDF without uploading files to a server.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    inLanguage: ["ja", "en"],
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: ["Zero file upload - browser only", "Electronic stamp (hanko) generation", "Reiwa/Western date auto-insert", "Free, no registration", "Multi-page PDF support", "Undo/redo support"],
    provider: { "@type": "Organization", name: "Yamada Trade LLC", url: "https://yamada-tools.jp" },
  };

  const faqSchemaEn = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEn.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchemaEn) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaEn) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://yamada-tools.jp" },
          { "@type": "ListItem", position: 2, name: "PDF Tools", item: "https://yamada-tools.jp/pdf" },
          { "@type": "ListItem", position: 3, name: "Add Text to PDF", item: "https://yamada-tools.jp/en/pdf-text-input" },
        ],
      }) }} />

      <LanguageSwitcher jaUrl="/pdf/text-input" enUrl="/en/pdf-text-input" currentLang="en" />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-ai">Home</Link></li>
            <li>/</li>
            <li><Link href="/pdf" className="hover:text-ai">PDF Tools</Link></li>
            <li>/</li>
            <li className="text-kon">Add Text to PDF</li>
          </ol>
        </nav>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">✏️</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Add Text to PDF Free Online</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">No registration. No file upload. No installation.</p>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Type on any PDF directly in your browser. Add text, electronic Japanese stamps, and auto-fill dates.
            Fill in application forms, contracts, and resumes — completely free with zero server upload.
          </p>
          <Link href="/pdf/text-input" className="inline-block bg-kon hover:bg-ai text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg">
            Open PDF Editor (Free) →
          </Link>
          <p className="text-xs text-gray-400 mt-3">Japanese UI • Tool opens in Japanese — functionality is the same</p>
        </div>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Why Choose Yamada Tools?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "🛡️", title: "Your File Never Leaves Your Browser", desc: "All PDF processing happens 100% client-side using PDF.js. No server upload means zero privacy risk — safe for confidential contracts, tax documents, and personal records." },
              { icon: "🔴", title: "Electronic Stamp (Hanko) Generator", desc: "Generate a circular Japanese-style red seal from any 1-4 character name. Unique to Yamada Tools — no other free PDF tool offers this. Perfect for Japanese business documents." },
              { icon: "📅", title: "Reiwa Era Date Auto-Insert", desc: "One click inserts today's date in Japanese Reiwa era format (令和8年3月25日) or Western format. Essential for Japanese government applications and administrative forms." },
              { icon: "🆓", title: "Completely Free — No Strings Attached", desc: "No registration. No login. No premium tier. No file size limits for basic use. Unlike Adobe Acrobat Online or iLovePDF, Yamada Tools requires no account creation whatsoever." },
              { icon: "🌐", title: "Browser-Only — No Installation", desc: "Works in Chrome, Firefox, Safari, and Edge. No app download, no plugin, no extension required. Open the page and start editing immediately." },
              { icon: "↩️", title: "Undo/Redo & Multi-Page Support", desc: "50-step undo history (Ctrl+Z). Multi-page PDF navigation. Drag to reposition any text or stamp. Copy/paste elements. Full editing workflow in the browser." },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-3xl flex-shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How To */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">How to Add Text to PDF — 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Open Your PDF", desc: "Click 'Select PDF' or drag and drop your PDF file. No upload — the file stays in your browser." },
              { step: "2", title: "Click & Type", desc: "Click the 'Add Text' button, then click anywhere on the PDF. Type your text, adjust font size and color." },
              { step: "3", title: "Download", desc: "Click the 'Download' button. Your edited PDF is generated locally and saved directly to your device." },
            ].map((s) => (
              <div key={s.step} className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="w-12 h-12 bg-kon text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{s.step}</div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pdf/text-input" className="inline-block bg-kon hover:bg-ai text-white font-bold px-8 py-3 rounded-xl transition-colors">
              Start Editing PDF Now — Free →
            </Link>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Free Adobe Acrobat Alternative — Feature Comparison</h2>
          <div className="overflow-x-auto rounded-xl shadow-sm">
            <table className="w-full text-sm border-collapse bg-white dark:bg-gray-800">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left font-bold">Feature</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-center font-bold text-kon">Yamada Tools</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-center text-gray-600 font-bold">Adobe Acrobat Online</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-center text-gray-600 font-bold">iLovePDF</th>
                  <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-center text-gray-600 font-bold">PDF24</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Completely free", "✅", "❌ Premium required", "❌ Limited", "✅"],
                  ["No registration", "✅", "❌ Login required", "❌ Limited", "✅"],
                  ["No server upload", "✅", "❌", "❌", "❌"],
                  ["Electronic stamp", "✅", "❌", "❌", "❌"],
                  ["Japanese era dates", "✅", "❌", "❌", "❌"],
                  ["Multi-page support", "✅", "✅", "✅", "✅"],
                ].map(([f, ...cols], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-750"}>
                    <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 font-medium">{f}</td>
                    {cols.map((c, j) => (
                      <td key={j} className={`border border-gray-200 dark:border-gray-600 px-4 py-3 text-center ${j === 0 ? "font-bold text-kon" : "text-gray-600"}`}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Security */}
        <section className="mb-16 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">🔒 Privacy & Security — Your File Never Leaves Your Browser</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            All PDF processing in Yamada Tools runs entirely client-side using <strong>PDF.js (Mozilla)</strong> and <strong>pdf-lib</strong> — two trusted open-source libraries. Your PDF file is loaded directly into browser memory. No data is transmitted to any server at any point.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            This means you can safely use this tool for: confidential business contracts, tax return documents, medical forms, personal identification documents, and any other sensitive materials.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            When you close the browser tab, all data in memory is gone. The site uses HTTPS encryption for the connection itself. No cookies are set by the PDF tool.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqEn.map((f, i) => (
              <details key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                <summary className="font-bold text-gray-800 dark:text-white cursor-pointer">{f.q}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gray-50 dark:bg-gray-800 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Ready to Fill in Your PDF?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Free. No sign-up. Your file stays in your browser.</p>
          <Link href="/pdf/text-input" className="inline-block bg-kon hover:bg-ai text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg">
            Open Free PDF Editor →
          </Link>
          <p className="text-xs text-gray-400 mt-4">Note: The PDF editor interface is in Japanese. All features work the same regardless of language.</p>
        </section>
      </div>
    </>
  );
}
