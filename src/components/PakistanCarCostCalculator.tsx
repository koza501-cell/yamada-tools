import React, { useState, useMemo } from 'react';
import ShareButtons from './common/ShareButtons';

// Official fixed duty amounts for OLD/USED Asian-make vehicles under
// Transfer of Residence / Gift / Personal Baggage schemes, per SRO
// 577(I)/2005 as published in FBR's Import of Vehicles brochure
// (fbr.gov.pk). Subsequent Finance Acts can add Regulatory Duty or
// other levies on top of these base figures — always confirm the
// current total at fbr.gov.pk or with FBR's Special Facilitation
// Desk for Overseas Pakistanis before purchasing.
const DUTY_BRACKETS = [
  { label: 'Up to 800cc', maxCc: 800, baseDutyUsd: 4800 },
  { label: '801cc – 1000cc', maxCc: 1000, baseDutyUsd: 6000 },
  { label: '1001cc – 1300cc', maxCc: 1300, baseDutyUsd: 13200 },
  { label: '1301cc – 1500cc', maxCc: 1500, baseDutyUsd: 18590 },
  { label: '1501cc – 1600cc', maxCc: 1600, baseDutyUsd: 22550 },
  { label: '1601cc – 1800cc (excl. jeeps)', maxCc: 1800, baseDutyUsd: 27940 },
];
// Above 1800cc: SRO 577(I)/2005's fixed-amount schedule does not apply.
// These fall to the percentage-based "normal regime" (customs duty on
// assessed value + sales tax + income tax + FED) — genuinely more complex
// and not something this simple calculator should estimate with a single number.

const USD_TO_PKR = 280; // approximate — update to current rate before publishing

export default function PakistanCarCostCalculator() {
  const [fobUsd, setFobUsd] = useState(4500);
  const [engineCc, setEngineCc] = useState(1300);
  const [ageMonths, setAgeMonths] = useState(24);
  const [isHybrid, setIsHybrid] = useState(false);
  const [shippingUsd, setShippingUsd] = useState(1200);

  const bracket = useMemo(
    () => DUTY_BRACKETS.find((b) => engineCc <= b.maxCc) ?? null,
    [engineCc]
  );
  const overSchedule = engineCc > 1800;

  const result = useMemo(() => {
    const insuranceUsd = Math.round(fobUsd * 0.015);
    const cifUsd = fobUsd + shippingUsd + insuranceUsd;

    if (overSchedule || !bracket) {
      return { insuranceUsd, cifUsd, dutyUsd: null, portChargesUsd: 250, clearingAgentUsd: 300, totalUsd: null, totalPkr: null };
    }

    const depreciationPct = Math.min(ageMonths * 1, 60) / 100;
    let dutyUsd = bracket.baseDutyUsd * (1 - depreciationPct);

    if (isHybrid) {
      const exemptionPct = engineCc <= 1800 ? 0.5 : 0.25;
      dutyUsd = dutyUsd * (1 - exemptionPct);
    }
    dutyUsd = Math.round(dutyUsd);

    const portChargesUsd = 250;
    const clearingAgentUsd = 300;

    const totalUsd = cifUsd + dutyUsd + portChargesUsd + clearingAgentUsd;
    const totalPkr = Math.round(totalUsd * USD_TO_PKR);

    return { insuranceUsd, cifUsd, dutyUsd, portChargesUsd, clearingAgentUsd, totalUsd, totalPkr };
  }, [fobUsd, shippingUsd, ageMonths, bracket, isHybrid, engineCc, overSchedule]);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div
        style={{
          background: '#001F3F',
          color: '#fff',
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Landed cost calculator</h2>
        <p style={{ margin: '4px 0 0', fontSize: 14, opacity: 0.85 }}>
          Estimate the total cost to bring one car from Japan to Pakistan under the Gift or Transfer of Residence scheme.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 16, marginBottom: 20 }}>
        <label style={{ fontSize: 14, fontWeight: 500 }}>
          Auction price (FOB, USD)
          <input
            type="number"
            value={fobUsd}
            onChange={(e) => setFobUsd(Number(e.target.value))}
            style={inputStyle}
          />
        </label>

        <label style={{ fontSize: 14, fontWeight: 500 }}>
          Engine size (cc)
          <input
            type="number"
            value={engineCc}
            onChange={(e) => setEngineCc(Number(e.target.value))}
            style={inputStyle}
          />
          <span style={{ fontSize: 12, color: '#666' }}>
            {bracket ? `Bracket: ${bracket.label} (SRO 577(I)/2005 fixed schedule)` : 'Above 1800cc — outside the fixed schedule, see note below'}
          </span>
        </label>

        <label style={{ fontSize: 14, fontWeight: 500 }}>
          Car age (months since manufacture) — max 36 allowed
          <input
            type="range"
            min={0}
            max={36}
            step={1}
            value={ageMonths}
            onChange={(e) => setAgeMonths(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <span style={{ fontSize: 12, color: '#666' }}>{ageMonths} months</span>
        </label>

        <label style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={isHybrid} onChange={(e) => setIsHybrid(e.target.checked)} />
          Hybrid vehicle (HEV duty exemption)
        </label>

        <label style={{ fontSize: 14, fontWeight: 500 }}>
          Estimated shipping to Karachi (USD)
          <input
            type="number"
            value={shippingUsd}
            onChange={(e) => setShippingUsd(Number(e.target.value))}
            style={inputStyle}
          />
        </label>
      </div>

      <div style={{ background: '#FFF9E6', border: '1px solid #FFBF00', borderRadius: 12, padding: 20 }}>
        <Row label="FOB price" value={`$${fobUsd.toLocaleString()}`} />
        <Row label="Shipping" value={`$${shippingUsd.toLocaleString()}`} />
        <Row label="Marine insurance (1.5%)" value={`$${result.insuranceUsd.toLocaleString()}`} />
        <Row label="CIF value" value={`$${result.cifUsd.toLocaleString()}`} bold />
        {result.dutyUsd !== null ? (
          <>
            <Row label="Duty & taxes (fixed, per SRO 577(I)/2005)" value={`$${result.dutyUsd.toLocaleString()}`} />
            <Row label="Port charges (est.)" value={`$${result.portChargesUsd.toLocaleString()}`} />
            <Row label="Clearing agent fee (est.)" value={`$${result.clearingAgentUsd.toLocaleString()}`} />
            <div style={{ borderTop: '2px solid #001F3F', marginTop: 12, paddingTop: 12 }}>
              <Row label="Total landed cost" value={`$${result.totalUsd!.toLocaleString()}`} bold large />
              <Row label="Approx. in PKR" value={`₨${result.totalPkr!.toLocaleString()}`} bold />
            </div>
          </>
        ) : (
          <div style={{ padding: '12px 0', fontSize: 14, color: '#001F3F' }}>
            Engine sizes above 1800cc are not covered by the fixed-amount schedule (SRO 577(I)/2005).
            These are assessed under the percentage-based "normal regime" — customs duty on assessed value
            plus sales tax, income tax, and Federal Excise Duty. This calculator doesn't estimate that
            structure reliably; get an assessment directly from FBR or a licensed clearing agent.
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: '#888', marginTop: 16 }}>
        Duty figures above are the official fixed amounts for old/used Asian-make vehicles under SRO
        577(I)/2005, as published in FBR's Import of Vehicles brochure (fbr.gov.pk). Subsequent Finance
        Acts can add Regulatory Duty or other levies on top of these base figures, and exchange rates and
        port charges change — always confirm the current total with FBR or a licensed clearing agent before
        purchasing. This tool assumes the vehicle qualifies under Pakistan's Gift or Transfer of Residence
        scheme (age ≤ 3 years from manufacture, PSI certificate obtained).
      </p>

      <ShareButtons />
    </div>
  );
}

function Row({ label, value, bold = false, large = false }: { label: string; value: string; bold?: boolean; large?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
      <span style={{ fontSize: large ? 16 : 14, color: '#001F3F', fontWeight: bold ? 700 : 400 }}>{label}</span>
      <span style={{ fontSize: large ? 20 : 14, color: '#001F3F', fontWeight: bold ? 700 : 400 }}>{value}</span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: 4,
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #ccc',
  fontSize: 14,
};
