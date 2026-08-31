'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ExpertSupervision from '@/components/ExpertSupervision';

const Icons = {
  Check: () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  X: () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>),
  AlertTriangle: () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>),
  ArrowRight: () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>),
  Shield: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>),
};

interface CheckResult {
  capitalOk: boolean;
  capitalAmount: number;
  employeeOk: boolean;
  japaneseOk: boolean;
  experienceOk: boolean;
  officeOk: boolean;
  passCount: number;
  totalChecks: number;
  eligible: boolean;
  issues: string[];
  alternatives: { title: string; desc: string }[];
}

export default function VisaCheckerClient() {
  const [mounted, setMounted] = useState(false);
  const [capital, setCapital] = useState<string>('30000000');
  const [hasEmployee, setHasEmployee] = useState<string>('yes');
  const [japaneseLevel, setJapaneseLevel] = useState<string>('n2');
  const [experience, setExperience] = useState<string>('3plus');
  const [hasOffice, setHasOffice] = useState<string>('yes');
  const [result, setResult] = useState<CheckResult | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleCheck = () => {
    const capNum = Number(capital) || 0;
    const capitalOk = capNum >= 30000000;
    const employeeOk = hasEmployee === 'yes';
    const japaneseOk = japaneseLevel === 'n2' || japaneseLevel === 'n1' || japaneseLevel === 'native';
    const experienceOk = experience === '3plus' || experience === '5plus';
    const officeOk = hasOffice === 'yes';

    const checks = [capitalOk, employeeOk, japaneseOk, experienceOk, officeOk];
    const passCount = checks.filter(Boolean).length;
    const eligible = checks.every(Boolean);

    const issues: string[] = [];
    if (!capitalOk) issues.push(`Capital: ¥${capNum.toLocaleString()} is below the ¥30,000,000 minimum (shortfall: ¥${(30000000 - capNum).toLocaleString()})`);
    if (!employeeOk) issues.push('Employee: At least one full-time Japanese national or permanent resident employee is required');
    if (!japaneseOk) issues.push('Japanese: JLPT N2 or higher is required (you or your full-time employee)');
    if (!experienceOk) issues.push('Experience: At least 3 years of business management experience is required');
    if (!officeOk) issues.push('Office: A physical office space in Japan is required (not a virtual office)');

    const alternatives: { title: string; desc: string }[] = [];
    if (!eligible) {
      alternatives.push({ title: 'Startup Visa', desc: '2-year runway with more flexible requirements. Available in many prefectures. Requires endorsement from a local government or incubator.' });
      alternatives.push({ title: 'Partner with a Japanese Resident', desc: 'Appoint a Japanese national or PR holder as co-founder/representative director. They can manage the company while you prepare your visa.' });
      if (!japaneseOk) {
        alternatives.push({ title: 'Hire a Bilingual Employee', desc: 'Hire a full-time employee with JLPT N2+ to satisfy the Japanese language requirement on behalf of the company.' });
      }
      alternatives.push({ title: 'Start on Another Visa', desc: 'If you have a spouse visa, work visa, or student visa, you may be able to start a business and transition to Business Manager later.' });
    }

    setResult({ capitalOk, capitalAmount: capNum, employeeOk, japaneseOk, experienceOk, officeOk, passCount, totalChecks: 5, eligible, issues, alternatives });
  };

  if (!mounted) return <div className="min-h-screen py-12 flex items-center justify-center text-gray-500 dark:text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          <Link href="/en" className="hover:text-pink-500 transition-colors">Home</Link>
          <span className="mx-2">{'>'}</span>
          <Link href="/en/business/company-search" className="hover:text-pink-500 transition-colors">Business</Link>
          <span className="mx-2">{'>'}</span>
          <span className="text-gray-900 dark:text-gray-100">Visa Checker</span>
        </nav>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Business Manager Visa Checker</h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          Check your eligibility for Japan's <strong>Business Manager (経営管理) visa</strong> under the
          <strong> October 2025 updated rules</strong>. The requirements were significantly tightened — use this tool to see if you qualify.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* Important notice */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-6">
          <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <span className="mt-0.5 shrink-0"><Icons.AlertTriangle /></span>
            <span><strong>October 2025 Rule Change:</strong> Minimum capital raised from ¥5M to ¥30M. JLPT N2+ Japanese proficiency now required. Full-time Japanese/PR employee mandatory. These are the most significant changes in over a decade.</span>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8 shadow-sm space-y-6">
          {/* Capital */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Available Capital Investment (JPY)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{'\u00a5'}</span>
              <input type="number" value={capital} onChange={(e) => setCapital(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none" />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[{ l: '¥5M', v: '5000000' }, { l: '¥10M', v: '10000000' }, { l: '¥30M', v: '30000000' }, { l: '¥50M', v: '50000000' }].map((p) => (
                <button key={p.v} type="button" onClick={() => setCapital(p.v)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${capital === p.v ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' : 'border-gray-200 dark:border-gray-600 text-gray-500'}`}>{p.l}</button>
              ))}
            </div>
          </div>

          {/* Employee */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full-time Japanese/PR Employee</label>
            <div className="flex gap-3">
              {[{ v: 'yes', l: 'Yes, I will hire one' }, { v: 'no', l: 'No' }].map((o) => (
                <button key={o.v} type="button" onClick={() => setHasEmployee(o.v)} className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${hasEmployee === o.v ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>{o.l}</button>
              ))}
            </div>
          </div>

          {/* Japanese */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Japanese Proficiency (yours or employee's)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[{ v: 'native', l: 'Native' }, { v: 'n1', l: 'JLPT N1' }, { v: 'n2', l: 'JLPT N2' }, { v: 'n3', l: 'N3 or below' }].map((o) => (
                <button key={o.v} type="button" onClick={() => setJapaneseLevel(o.v)} className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${japaneseLevel === o.v ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>{o.l}</button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Business Management Experience</label>
            <div className="grid grid-cols-3 gap-2">
              {[{ v: '5plus', l: '5+ years' }, { v: '3plus', l: '3-4 years' }, { v: 'under3', l: 'Under 3 years' }].map((o) => (
                <button key={o.v} type="button" onClick={() => setExperience(o.v)} className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${experience === o.v ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>{o.l}</button>
              ))}
            </div>
          </div>

          {/* Office */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Physical Office in Japan</label>
            <div className="flex gap-3">
              {[{ v: 'yes', l: 'Yes / Will secure one' }, { v: 'no', l: 'Not yet / Virtual only' }].map((o) => (
                <button key={o.v} type="button" onClick={() => setHasOffice(o.v)} className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${hasOffice === o.v ? 'border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-500' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>{o.l}</button>
              ))}
            </div>
          </div>

          <button type="button" onClick={handleCheck} className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
            <Icons.Shield /> Check Eligibility
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 mb-12">
            {/* Verdict */}
            <div className={`rounded-2xl p-6 md:p-8 shadow-xl text-white text-center ${result.eligible ? 'bg-gradient-to-br from-emerald-600 to-emerald-700' : 'bg-gradient-to-br from-red-600 to-red-700'}`}>
              <div className="inline-flex items-center gap-3 mb-2">
                {result.eligible ? <Icons.Check /> : <Icons.X />}
                <span className="text-2xl md:text-3xl font-black">{result.eligible ? 'LIKELY ELIGIBLE' : 'NOT ELIGIBLE'}</span>
              </div>
              <p className="text-sm opacity-80 mt-2">{result.passCount}/{result.totalChecks} requirements met</p>
            </div>

            {/* Checklist */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Requirements Checklist</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  { ok: result.capitalOk, label: 'Capital Investment ≥ ¥30,000,000', detail: `Your amount: ¥${result.capitalAmount.toLocaleString()}` },
                  { ok: result.employeeOk, label: 'Full-time Japanese/PR Employee', detail: result.employeeOk ? 'Will hire or have one' : 'Required since Oct 2025' },
                  { ok: result.japaneseOk, label: 'Japanese Proficiency (JLPT N2+)', detail: result.japaneseOk ? 'Requirement met' : 'You or your employee needs N2+' },
                  { ok: result.experienceOk, label: 'Management Experience (3+ years)', detail: result.experienceOk ? 'Requirement met' : 'At least 3 years needed' },
                  { ok: result.officeOk, label: 'Physical Office Space in Japan', detail: result.officeOk ? 'Available or will secure' : 'Virtual offices are not accepted' },
                ].map((item, i) => (
                  <div key={i} className={`px-6 py-4 flex items-center gap-3 ${item.ok ? 'bg-emerald-50/30 dark:bg-emerald-900/5' : ''}`}>
                    <span className={item.ok ? 'text-emerald-500' : 'text-red-500'}>{item.ok ? <Icons.Check /> : <Icons.X />}</span>
                    <div>
                      <span className={`text-sm font-medium ${item.ok ? 'text-gray-900 dark:text-gray-100' : 'text-red-700 dark:text-red-400'}`}>{item.label}</span>
                      <span className="block text-xs text-gray-400 dark:text-gray-500">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Issues */}
            {result.issues.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <h4 className="font-bold text-red-800 dark:text-red-300 text-sm mb-3">Issues to Address</h4>
                <ul className="space-y-2">
                  {result.issues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-900/80 dark:text-red-200/80">
                      <span className="text-red-500 mt-0.5 shrink-0"><Icons.X /></span>{issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Alternatives */}
            {result.alternatives.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-3">Alternative Paths</h4>
                <div className="space-y-3">
                  {result.alternatives.map((alt, i) => (
                    <div key={i} className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-200">{alt.title}</p>
                      <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mt-0.5">{alt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <li>• This tool provides a preliminary assessment only. Visa decisions are made by the Immigration Services Agency of Japan.</li>
                <li>• Requirements may vary by local immigration office and individual circumstances.</li>
                <li>• The October 2025 rule changes are based on publicly available information. Consult an immigration lawyer for definitive guidance.</li>
                <li>• This tool does not constitute legal advice.</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Related Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { href: '/en/business/formation-cost', label: 'Japan Formation Cost Calculator', desc: 'Calculate KK vs GK setup costs' },
                  { href: '/en/business/company-search', label: 'Japan Company Search', desc: 'Search registered Japanese companies' },
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
        {/* Trust signals */}
        <div className="max-w-4xl mx-auto px-4 mb-8" style={{maxWidth: '100%'}}>
          <ExpertSupervision
            sources={[{ name: 'Immigration Services Agency of Japan', url: 'https://www.moj.go.jp/isa/' }, { name: 'JETRO — Starting a Business in Japan', url: 'https://www.jetro.go.jp/en/invest/setting_up/' }]}
            lastUpdated="May 2026"
            trustNote="This tool provides estimates only. Consult a licensed tax accountant (税理士) or judicial scrivener (司法書士) for definitive guidance."
          />
        </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">FAQ</h2>
          <div className="space-y-6">
            {[
              { q: 'What changed in October 2025?', a: 'The minimum capital was raised from ¥5M to ¥30M. JLPT N2+ Japanese proficiency became mandatory (for you or an employee). Hiring at least one full-time Japanese/PR employee is now required. These are the most significant tightening in the visa\'s history.' },
              { q: 'What is the Startup visa alternative?', a: 'The Startup visa provides a 2-year runway with more flexible capital and employee requirements. You need endorsement from a participating local government or incubator. Available nationwide since recent expansions.' },
              { q: 'Can I own a company without a Business Manager visa?', a: 'Yes. Non-residents can own shares in a Japanese company. You can appoint a resident as representative director and manage the company remotely. However, you cannot work in Japan or manage day-to-day operations without an appropriate visa.' },
              { q: 'Is ¥30M the absolute minimum for capital?', a: 'For a new Business Manager visa application, yes. Renewals of existing visas may be evaluated under different criteria. The ¥30M can include both cash capital and demonstrable business assets.' },
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
