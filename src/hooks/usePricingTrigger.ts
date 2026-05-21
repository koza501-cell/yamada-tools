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

const LS_DISMISSED = 'yamada_soft_modal_dismissed';
const SS_SHOWN = 'yamada_pricing_popup_shown';

export function usePricingTrigger(): PricingTriggerState {
  const [showPopup, setShowPopup] = useState<PopupType>('none');
  const [sessionSuccessCount, setSessionSuccessCount] = useState(0);
  const [remainingUses, setRemainingUses] = useState(5);

  // Soft-modal: show after 15s or 30% scroll depth, whichever comes first
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(LS_DISMISSED)) return;
    if (sessionStorage.getItem(SS_SHOWN)) return;

    let triggered = false;

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setShowPopup('soft-modal');
      sessionStorage.setItem(SS_SHOWN, 'true');
    };

    const timer = setTimeout(trigger, 15000);

    const handleScroll = () => {
      const scrollPct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrollPct >= 0.3) trigger();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Track success and trigger popups
  const triggerSuccess = useCallback((toolId: string) => {
    const newCount = sessionSuccessCount + 1;
    setSessionSuccessCount(newCount);

    const popupShownThisSession = sessionStorage.getItem(SS_SHOWN);
    if (popupShownThisSession) return;

    // Trigger: 3rd success in session
    if (newCount === 3) {
      setTimeout(() => {
        setShowPopup('soft-modal');
        sessionStorage.setItem(SS_SHOWN, 'true');
      }, 1500);
      return;
    }

    if (HIGH_VALUE_TOOLS.includes(toolId) && newCount >= 1) {
      // handled by Mascot.tsx upgrade_hint
    }
  }, [sessionSuccessCount]);

  // Watch remaining uses for banner/limit trigger
  useEffect(() => {
    if (remainingUses === 2) {
      setShowPopup('banner');
    } else if (remainingUses === 0) {
      setShowPopup('limit-modal');
    }
  }, [remainingUses]);

  const dismissPopup = useCallback(() => {
    if (showPopup === 'soft-modal') {
      localStorage.setItem(LS_DISMISSED, '1');
    }
    setShowPopup('none');
  }, [showPopup]);

  return {
    showPopup,
    dismissPopup,
    triggerSuccess,
    remainingUses,
    setRemainingUses,
  };
}
