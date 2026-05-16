// Server component — no "use client" directive
// Ad slot HTML is in the initial HTML payload; AdSense JS activates it on client

export default function StaticAdSlot({ className = '' }: { className?: string }) {
  return (
    <div className={`ad-container my-6 ${className}`} style={{ minHeight: '280px' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '280px' }}
        data-ad-client="ca-pub-2272972805493752"
        data-ad-slot="5612038947"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
