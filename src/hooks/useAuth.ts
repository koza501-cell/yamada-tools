// TODO: Replace with real auth/subscription check when Stripe is connected
type Plan = 'free' | 'pro' | 'team' | 'enterprise';

export function useAuth() {
  const plan = 'free' as Plan;

  return {
    user: null,
    plan,
    isProUser: false,
    isTeamUser: false,
    isEnterpriseUser: false,
    isPaidUser: false,
    loading: false,
  };
}
