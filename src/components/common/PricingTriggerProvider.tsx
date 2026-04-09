'use client';

import { createContext, useContext, ReactNode } from 'react';
import { usePricingTrigger } from '@/hooks/usePricingTrigger';
import { PricingPopup } from './PricingPopup';
import { PricingBanner } from './PricingBanner';

interface PricingContextType {
  triggerSuccess: (toolId: string) => void;
  setRemainingUses: (n: number) => void;
}

const PricingContext = createContext<PricingContextType | null>(null);

export function usePricingContext() {
  const context = useContext(PricingContext);
  if (!context) {
    // Return no-op functions if not wrapped in provider
    return { triggerSuccess: () => {}, setRemainingUses: () => {} };
  }
  return context;
}

export function PricingTriggerProvider({ children }: { children: ReactNode }) {
  const { showPopup, dismissPopup, triggerSuccess, remainingUses, setRemainingUses } = usePricingTrigger();

  return (
    <PricingContext.Provider value={{ triggerSuccess, setRemainingUses }}>
      {children}
      
      {/* Popups */}
      <PricingPopup 
        type={showPopup === 'soft-modal' || showPopup === 'limit-modal' ? showPopup : 'none'} 
        onClose={dismissPopup}
        remainingUses={remainingUses}
      />
      
      {/* Banner */}
      {showPopup === 'banner' && (
        <PricingBanner remainingUses={remainingUses} onClose={dismissPopup} />
      )}
    </PricingContext.Provider>
  );
}
