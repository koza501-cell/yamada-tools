'use client';

import { useState, useEffect, useCallback } from 'react';

type PopupType = 'none' | 'soft-modal' | 'banner' | 'limit-modal';

interface PricingTriggerState {
  showPopup: PopupType;
  dismissPopup: () => void;
  triggerSuccess: (toolId: string) => void;
  remainingUses: number;
  setRemainingUses: (n: number) => void;
}

const HIGH_VALUE_TOOLS = [
  'bank-format', 'invoice', 'quotation', 'nenmatsu-calc',
  'envelope-print', 'tax-calculator', 'loan-simulator',
  'retirement-calc', 'corporate-tax', 'insurance-calc'
];

export function usePricingTrigger(): PricingTriggerState {
  const [showPopup, setShowPopup] = useState<PopupType>('none');
  const [sessionSuccessCount, setSessionSuccessCount] = useState(0);
  const [remainingUses, setRemainingUses] = useState(5);
  const [hasShownReturnPopup, setHasShownReturnPopup] = useState(false);

  // Check return visit on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const lastVisit = localStorage.getItem('yamada_last_visit');
    const today = new Date().toDateString();
    const visitCount = parseInt(localStorage.getItem('yamada_visit_count') || '0');
    
    // Update visit tracking
    if (lastVisit !== today) {
      localStorage.setItem('yamada_last_visit', today);
      localStorage.setItem('yamada_visit_count', String(visitCount + 1));
    }
    
    // Show return popup on 2nd+ day visit (once per session)
    const isReturnVisit = visitCount >= 1 && lastVisit !== today;
    const alreadyShownThisSession = sessionStorage.getItem('yamada_return_popup_shown');
    
    if (isReturnVisit && !alreadyShownThisSession && !hasShownReturnPopup) {
      setTimeout(() => {
        setShowPopup('soft-modal');
        setHasShownReturnPopup(true);
        sessionStorage.setItem('yamada_return_popup_shown', 'true');
      }, 3000); // Show after 3 seconds
    }
  }, [hasShownReturnPopup]);

  // Track success and trigger popups
  const triggerSuccess = useCallback((toolId: string) => {
    const newCount = sessionSuccessCount + 1;
    setSessionSuccessCount(newCount);
    
    // Already shown popup this session? Don't spam
    const popupShownThisSession = sessionStorage.getItem('yamada_pricing_popup_shown');
    if (popupShownThisSession) return;
    
    // Trigger 1: 3rd success in session
    if (newCount === 3) {
      setTimeout(() => {
        setShowPopup('soft-modal');
        sessionStorage.setItem('yamada_pricing_popup_shown', 'true');
      }, 1500); // Delay after success animation
      return;
    }
    
    // Trigger 2: High-value tool completion (after 1st use)
    if (HIGH_VALUE_TOOLS.includes(toolId) && newCount >= 1) {
      // Don't show popup, let アイちゃん handle this via mascot message
      // This is handled in Mascot.tsx upgrade_hint
    }
  }, [sessionSuccessCount]);

  // Watch remaining uses for banner trigger
  useEffect(() => {
    if (remainingUses === 2) {
      setShowPopup('banner');
    } else if (remainingUses === 0) {
      setShowPopup('limit-modal');
    }
  }, [remainingUses]);

  const dismissPopup = useCallback(() => {
    setShowPopup('none');
  }, []);

  return {
    showPopup,
    dismissPopup,
    triggerSuccess,
    remainingUses,
    setRemainingUses
  };
}
