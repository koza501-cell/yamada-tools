// Server component — no "use client" directive
// Ad slot HTML is in the initial HTML payload; AdSense JS activates it on client

export default function StaticAdSlot({ className = '' }: { className?: string }) {
  return (
    <div
      className={`ad-container my-6 ${className}`}
      style={{
        minHeight: '280px',
        width: '100%',
        maxWidth: '728px',
        margin: '1.5rem auto',
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
        data-ad-client="ca-pub-2272972805493752"
        data-ad-slot="5612038947"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
