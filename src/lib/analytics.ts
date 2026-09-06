// GA4 Event Tracking

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

// Track when user starts checkout/trial
export const trackBeginCheckout = (plan: 'pro_monthly' | 'pro_annual' | 'pro_yearly' | 'trial' | 'team_monthly' | 'team_annual' | 'pro_30day' | 'pro_90day') => {
  const valueMap: Record<string, number> = {
    pro_monthly: 980,
    pro_annual: 7980,
    pro_yearly: 9800,
    trial: 0,
    team_monthly: 1480,
    team_annual: 11760,
    pro_30day: 980,
    pro_90day: 2480,
  };
  const nameMap: Record<string, string> = {
    pro_monthly: 'PRO 月額',
    pro_annual: 'PRO 年額',
    pro_yearly: 'PRO 年額',
    trial: '10日間無料トライアル',
    team_monthly: 'TEAM 月額',
    team_annual: 'TEAM 年額',
    pro_30day: 'PROパス（30日）',
    pro_90day: 'PROパス（90日）',
  };
  const value = valueMap[plan] ?? 0;
  trackEvent('begin_checkout', {
    currency: 'JPY',
    value,
    items: [{
      item_id: plan,
      item_name: nameMap[plan] ?? plan,
      price: value,
      quantity: 1,
    }],
  });
};

// Track completed purchase
export const trackPurchase = (plan: string, transactionId: string) => {
  const valueMap: Record<string, number> = {
    pro_monthly: 980,
    pro_annual: 7980,
    team_monthly: 1480,
    team_annual: 11760,
    pro_30day: 980,
    pro_90day: 2480,
  };
  const value = valueMap[plan] ?? 980;
  trackEvent('purchase', {
    transaction_id: transactionId,
    currency: 'JPY',
    value,
    items: [{
      item_id: plan,
      item_name: plan,
      price: value,
      quantity: 1,
    }],
  });
};

// Track trial start
export const trackTrialStart = () => {
  trackEvent('sign_up', { method: 'trial' });
};
