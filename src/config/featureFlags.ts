/**
 * Feature flags for envelope-print v2 upgrade.
 * All flags default OFF in production, ON in staging/dev.
 */

export type EnvelopeFeature =
  | "BULK_MAIL_MERGE"      // Feature A: True bulk mail-merge engine
  | "ADDRESS_BOOK_V2"      // Feature B: IndexedDB address book + team sync
  | "CALIBRATION_WIZARD"   // Feature C: Printer calibration
  | "BRAND_COMPLIANCE"     // Feature D: Brand compliance layer
  | "WORKFLOW_INTEGRATIONS" // Feature E: freee, MoneyForward, kintone, etc.
  | "AUDIT_LOG"            // Feature F: PIPA-compliant audit trail
  | "FULFILLMENT"          // Feature G: On-demand print+mail fulfillment
  ;

const STAGING_DEFAULTS: Record<EnvelopeFeature, boolean> = {
  BULK_MAIL_MERGE: true,
  ADDRESS_BOOK_V2: true,
  CALIBRATION_WIZARD: true,
  BRAND_COMPLIANCE: true,
  WORKFLOW_INTEGRATIONS: true,
  AUDIT_LOG: true,
  FULFILLMENT: true,
};

const PRODUCTION_DEFAULTS: Record<EnvelopeFeature, boolean> = {
  BULK_MAIL_MERGE: false,
  ADDRESS_BOOK_V2: false,
  CALIBRATION_WIZARD: false,
  BRAND_COMPLIANCE: false,
  WORKFLOW_INTEGRATIONS: false,
  AUDIT_LOG: false,
  FULFILLMENT: false,
};

function isStaging(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host.includes("staging") || host === "localhost" || host === "127.0.0.1";
}

const overrides: Partial<Record<EnvelopeFeature, boolean>> = {};

// Allow URL-based override: ?feature_BULK_MAIL_MERGE=true
if (typeof window !== "undefined") {
  const params = new URLSearchParams(window.location.search);
  for (const key of Object.keys(STAGING_DEFAULTS) as EnvelopeFeature[]) {
    const paramKey = "feature_" + key;
    const param = params.get(paramKey);
    if (param === "true") overrides[key] = true;
    else if (param === "false") overrides[key] = false;
  }
}

const defaults = isStaging() ? STAGING_DEFAULTS : PRODUCTION_DEFAULTS;

export function isFeatureEnabled(feature: EnvelopeFeature): boolean {
  return overrides[feature] ?? defaults[feature];
}

/** List all feature flags with their current state (for debug UI). */
export function getAllFeatureFlags(): Record<EnvelopeFeature, boolean> {
  const result = {} as Record<EnvelopeFeature, boolean>;
  for (const key of Object.keys(STAGING_DEFAULTS) as EnvelopeFeature[]) {
    result[key] = isFeatureEnabled(key);
  }
  return result;
}
