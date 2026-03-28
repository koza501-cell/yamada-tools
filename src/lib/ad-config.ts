export type AdPolicy = 'no-ads' | 'minimal' | 'default';

export const adPolicies: Record<string, AdPolicy> = {
  '/about/business': 'no-ads',
  '/generator/envelope-print': 'minimal',
  '/convert/bank-format': 'minimal',
  '/document/vertical-text': 'minimal',
  '/pdf/text-input': 'minimal',
  '/generator/random-picker': 'minimal',
  '/convert/postcode': 'minimal',
  '/generator/hanko': 'minimal',
};

/** Returns the ad policy for a given pathname, defaulting to 'default'. */
export function getAdPolicy(pathname: string): AdPolicy {
  return adPolicies[pathname] ?? 'default';
}
