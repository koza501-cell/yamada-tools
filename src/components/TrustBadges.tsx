import certifications from "@/config/certifications";

export default function TrustBadges() {
  const active = certifications.filter((c) => c.enabled);
  if (active.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {active.map((cert) => {
        const badge = (
          <div
            key={cert.id}
            className="flex flex-col items-center gap-1 bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm text-center"
          >
            <span className="text-2xl">{cert.icon}</span>
            <span className="text-xs font-bold text-gray-800 leading-tight">
              {cert.label}
            </span>
            <span className="text-xs text-gray-500">{cert.description}</span>
          </div>
        );

        if (cert.href) {
          return (
            <a
              key={cert.id}
              href={cert.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {badge}
            </a>
          );
        }
        return badge;
      })}
    </div>
  );
}
