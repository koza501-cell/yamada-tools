"use client";

import dynamic from "next/dynamic";

// Below-the-fold widgets: not part of the initial paint, so skip SSR and
// defer their JS until after hydration to shrink the critical bundle.
const FloatingActions = dynamic(() => import("./FloatingActions"), { ssr: false });
const FavoritePrompt = dynamic(() => import("./FavoritePrompt"), { ssr: false });
const PWAInstallPrompt = dynamic(() => import("./PWAInstallPrompt"), { ssr: false });
const SupportChatbot = dynamic(() => import("@/components/SupportChatbot"), { ssr: false });
const GlobalSearchModal = dynamic(() => import("./GlobalSearchModal"), { ssr: false });
const GlobalToolTracker = dynamic(() => import("./GlobalToolTracker"), { ssr: false });

export default function DeferredWidgets() {
  return (
    <>
      <FloatingActions />
      <FavoritePrompt />
      <PWAInstallPrompt />
      <SupportChatbot />
      <GlobalSearchModal />
      <GlobalToolTracker />
    </>
  );
}
