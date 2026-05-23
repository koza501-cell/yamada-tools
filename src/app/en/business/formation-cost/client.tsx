'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const Icons = {
  Calculator: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>),
  ArrowRight: () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>),
  AlertTriangle: () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>),
  Check: () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
};

type CompanyType = 'kk' | 'gk';

interface CostResult {
  companyType: CompanyType;
  label: string;
  notarization: number;
  stampDuty: number;
  registrationTax: number;
  legalSubtotal: number;
  seals: number;
  certificates: number;
  sealCerts: number;
  transferFee: number;
  professionalFee: number;
  miscSubtotal: number;
  initialTotal: number;
  usdTotal: number;
}

function formatJPY(n: number): string { return '\u00a5' + n.toLocaleString(); }
function formatUSD(n: number): string { return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }

const USD_RATE = 155; // approximate

export default function FormationCostClient() {
  const [mounted, setMounted] = useState(false);
  const [companyType, setCompanyType] = useState<CompanyType>('gk');
  const [capital, setCapital] = useState<string>('1000000');
  const [eTeikan, setETeikan] = useState(true);
  const [usePro, setUsePro] = useState(false);
  const [result, setResult] = useState<CostResult | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleCalculate = () => {
    const capNum = Number(capital) || 0;
    let notarization = 0;
    if (companyType === 'kk') {
      if (capNum <= 1000000) notarization = 30000;
      else if (capNum <= 3000000) notarization = 40000;
      else notarization = 50000;
    }
    const stampDuty = eTeikan ? 0 : 40000;
    let registrationTax = 0;
    if (companyType === 'kk') {
      registrationTax = Math.max(Math.floor(capNum * 0.007), 150000);
    } else {
      registrationTax = Math.max(Math.floor(capNum * 0.007), 60000);
    }
    const legalSubtotal = notarization + stampDuty + registrationTax;
    const seals = 8000;
    const certificates = 1800;
    const sealCerts = 900;
    const transferFee = 440;
    const professionalFee = usePro ? (companyType === 'kk' ? 50000 : 30000) : 0;
    const miscSubtotal = seals + certificates + sealCerts + transferFee + professionalFee;
    const initialTotal = legalSubtotal + miscSubtotal;

    setResult({
      companyType, label: companyType === 'kk' ? 'KK (Kabushiki Kaisha)' : 'GK (Godo Kaisha)',
      notarization, stampDuty, registrationTax, legalSubtotal,
      seals, certificates, sealCerts, transferFee, professionalFee, miscSubtotal,
      initialTotal, usdTotal: Math.round(initialTotal / USD_RATE),
    });
  };

  if (!mounted) return <div className="min-h-screen py-12 flex items-center justify-center text-gray-500 dark:text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          <Link href="/en" className="hover:text-pink-500 transition-colors">Home</Link>
          <span className="mx-2">{'>'}</span>
          <Link href="/en/business" className="hover:text-pink-500 transition-colors">Business</Link>
          <span className="mx-2">{'>'}</span>
          <span className="text-gray-900 dark:text-gray-100">Formation Cost Calculator</span>
        </nav>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Japan Company Formation Cost Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          Calculate the <strong>total cost</strong> to form a company in Japan. Covers government fees, stamps, certificates,
          and professional fees — the costs most English guides don't mention.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Company Type</label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { v: 'kk' as CompanyType, l: 'KK (Kabushiki Kaisha)', s: 'Stock company — higher credibility' },
                { v: 'gk' as CompanyType, l: 'GK (Godo Kaisha)', s: 'LLC — lower cost, simpler setup' },
              ]).map((opt) => (
                <button key={opt.v} type="button" onClick={() => setCompanyType(opt.v)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${companyType === opt.v ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600'}`}>
                  <span className="font-bold text-gray-900 dark:text-gray-100 text-sm block">{opt.l}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{opt.s}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Capital Amount (JPY)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{'\u00a5'}</span>
              <input type="number" value={capital} onChange={(e) => setCapital(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none" />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[{ l: '¥1M', v: '1000000' }, { l: '¥3M', v: '3000000' }, { l: '¥5M', v: '5000000' }, { l: '¥10M', v: '10000000' }, { l: '¥30M', v: '30000000' }].map((p) => (
                <button key={p.v} type="button" onClick={() => setCapital(p.v)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${capital === p.v ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' : 'border-gray-200 dark:border-gray-600 text-gray-500'}`}>{p.l}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Articles of Incorporation</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setETeikan(true)} className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${eTeikan ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>Electronic (saves ¥40k)</button>
                <button type="button" onClick={() => setETeikan(false)} className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${!eTeikan ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>Paper (+¥40,000)</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Professional Help</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setUsePro(false)} className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${!usePro ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>DIY</button>
                <button type="button" onClick={() => setUsePro(true)} className={`flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all ${usePro ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>Hire Professional</button>
              </div>
            </div>
          </div>

          <button type="button" onClick={handleCalculate} className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
            <Icons.Calculator /> Calculate Formation Cost
          </button>
        </div>

        {result && (
          <div className="space-y-6 mb-12">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-xl text-center">
              <p className="text-sm text-slate-300 mb-1">Total Formation Cost — {result.label}</p>
              <p className="text-4xl md:text-5xl font-black tracking-tight">{formatJPY(result.initialTotal)}</p>
              <p className="text-lg text-slate-400 mt-1">≈ {formatUSD(result.usdTotal)} USD</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 border-b border-blue-100 dark:border-blue-800">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 text-sm">Government Fees (Mandatory)</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  { l: 'Notarization Fee (Teikan Ninsho)', v: result.notarization, n: companyType === 'gk' ? 'Not required for GK' : 'Required for KK only' },
                  { l: 'Revenue Stamp (Inshi)', v: result.stampDuty, n: eTeikan ? 'Waived for electronic articles' : 'Required for paper articles' },
                  { l: 'Registration Tax (Touroku Menkyozei)', v: result.registrationTax, n: companyType === 'kk' ? 'Capital × 0.7% (min ¥150,000)' : 'Capital × 0.7% (min ¥60,000)' },
                ].map((row, i) => (
                  <div key={i} className="px-6 py-3 flex items-center justify-between">
                    <div><span className="text-sm text-gray-700 dark:text-gray-300">{row.l}</span><span className="block text-xs text-gray-400">{row.n}</span></div>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{row.v === 0 ? '—' : formatJPY(row.v)}</span>
                  </div>
                ))}
                <div className="px-6 py-3 flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/5">
                  <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{formatJPY(result.legalSubtotal)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="bg-amber-50 dark:bg-amber-900/20 px-6 py-3 border-b border-amber-100 dark:border-amber-800">
                <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-1.5"><Icons.AlertTriangle /> Hidden Costs (Often Overlooked)</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  { l: 'Company Seals (3-piece set)', v: result.seals, n: 'Representative seal + bank seal + company stamp' },
                  { l: 'Registry Certificates (3 copies)', v: result.certificates, n: 'Needed for bank account, filings' },
                  { l: 'Seal Certificates (3 copies)', v: result.sealCerts, n: '' },
                  { l: 'Bank Transfer Fee', v: result.transferFee, n: 'Capital deposit verification' },
                  ...(usePro ? [{ l: 'Professional Fee (Shiho-shoshi)', v: result.professionalFee, n: 'Judicial scrivener for registration' }] : []),
                ].map((row, i) => (
                  <div key={i} className="px-6 py-3 flex items-center justify-between">
                    <div><span className="text-sm text-gray-700 dark:text-gray-300">{row.l}</span>{row.n && <span className="block text-xs text-gray-400">{row.n}</span>}</div>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatJPY(row.v)}</span>
                  </div>
                ))}
                <div className="px-6 py-3 flex items-center justify-between bg-amber-50/50 dark:bg-amber-900/5">
                  <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{formatJPY(result.miscSubtotal)}</span>
                </div>
              </div>
            </div>

            {/* Quick comparison */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-sm">KK vs GK — Quick Comparison</h3>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm">
                  <thead><tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-2 text-gray-500 dark:text-gray-400 text-xs font-semibold" /><th className="text-center py-2 px-2 text-blue-600 dark:text-blue-400 font-bold text-xs">KK</th><th className="text-center py-2 px-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">GK</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {[
                      { l: 'Setup Cost (e-articles, DIY)', kk: '~¥191,000', gk: '~¥71,000' },
                      { l: 'Notarization', kk: 'Required', gk: 'Not required' },
                      { l: 'Min Registration Tax', kk: '¥150,000', gk: '¥60,000' },
                      { l: 'Credibility', kk: 'Highest', gk: 'Moderate' },
                      { l: 'VC Fundraising', kk: 'Possible (shares)', gk: 'Not possible' },
                      { l: 'Setup Time', kk: '2-3 weeks', gk: '1-2 weeks' },
                      { l: 'Examples', kk: 'Most Japanese companies', gk: 'Apple Japan, Amazon Japan' },
                    ].map((r, i) => (
                      <tr key={i}><td className="py-2 px-2 text-gray-700 dark:text-gray-300">{r.l}</td><td className="py-2 px-2 text-center text-gray-600 dark:text-gray-400">{r.kk}</td><td className="py-2 px-2 text-center text-gray-600 dark:text-gray-400">{r.gk}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <li>• Costs are based on 2026 rates. USD conversion is approximate (¥{USD_RATE}/USD).</li>
                <li>• Capital ≥ ¥10M triggers consumption tax from year 1 and higher municipal taxes.</li>
                <li>• This calculator covers initial setup only. Annual maintenance costs (social insurance, tax accountant, etc.) are additional.</li>
                <li>• For professional advice, consult a licensed Shiho-shoshi (judicial scrivener) or tax accountant.</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Related Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { href: '/en/business/visa-checker', label: 'Business Manager Visa Checker', desc: 'Check eligibility under 2025 rules' },
                  { href: '/en/business/company-search', label: 'Japan Company Search', desc: 'Search registered Japanese companies' },
                  { href: '/business/setsuritsu-hiyo', label: '設立費用シミュレーター (JP)', desc: 'Detailed Japanese version with maintenance costs' },
                ].map((tool) => (
                  <Link key={tool.href} href={tool.href} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all group">
                    <div><p className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{tool.label}</p><p className="text-xs text-gray-400 dark:text-gray-500">{tool.desc}</p></div>
                    <span className="text-gray-300 dark:text-gray-600 group-hover:text-pink-400 transition-colors"><Icons.ArrowRight /></span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">FAQ</h2>
          <div className="space-y-6">
            {[
              { q: 'Which is cheaper — KK or GK?', a: 'GK is significantly cheaper. With electronic articles and DIY, a GK costs about ¥71,000 vs ¥191,000 for a KK. The main saving is no notarization (¥30-50k) and lower registration tax (¥60k vs ¥150k minimum).' },
              { q: 'Can a foreigner set up a company in Japan?', a: 'Yes. Non-residents can own and establish a Japanese company. However, to manage the company from Japan, you need a Business Manager visa. You can also appoint a resident representative and manage remotely.' },
              { q: 'Is ¥1 capital actually viable?', a: 'Legally yes, but practically no. Banks may refuse to open a corporate account, and business partners may question your seriousness. ¥1M+ is recommended for credibility. The registration tax minimum applies regardless.' },
              { q: 'What ongoing costs should I expect?', a: 'At minimum: ¥70,000/year municipal tax (even if unprofitable), social insurance (~15% of salary), and accounting software (~¥3,000/month). Tax accountant fees add ¥15-50k/month depending on revenue.' },
            ].map((faq, i) => (
              <div key={i}>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2">Q. {faq.q}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-4 border-l-2 border-pink-200 dark:border-pink-800">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
