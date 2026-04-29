// ============================================================
// NICHE SVG ICONS — Custom line icons
// ============================================================
// Professional line icons inspired by Lucide / Heroicons style.
// Each icon is 24x24, 1.5 stroke, currentColor (inherits text color).
// Standard size: 24px. Adjust via className.
// ============================================================

interface IconProps {
  className?: string;
  size?: number;
}

function IconWrapper({ children, className = "", size = 24 }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// ============================================================
// NICHE ICONS
// ============================================================

export function BriefcaseIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </IconWrapper>
  );
}

export function DocumentIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </IconWrapper>
  );
}

export function ScrollIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
    </IconWrapper>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 5-5" />
    </IconWrapper>
  );
}

export function ReceiptIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2V2z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </IconWrapper>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </IconWrapper>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </IconWrapper>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </IconWrapper>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </IconWrapper>
  );
}

export function CarIcon(props: IconProps) {
  return (
    <IconWrapper {...props}>
      <path d="M5 17h14M5 17v-5l2-5h10l2 5v5M5 17v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2M19 17v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2" />
      <circle cx="7.5" cy="14.5" r="1" />
      <circle cx="16.5" cy="14.5" r="1" />
    </IconWrapper>
  );
}

// ============================================================
// ICON RESOLVER
// ============================================================
// Maps iconName string from niches.ts to actual component.
// ============================================================

export const iconMap: Record<string, (props: IconProps) => React.ReactElement> = {
  briefcase: BriefcaseIcon,
  document: DocumentIcon,
  scroll: ScrollIcon,
  chart: ChartIcon,
  receipt: ReceiptIcon,
  home: HomeIcon,
  heart: HeartIcon,
  book: BookIcon,
  users: UsersIcon,
  car: CarIcon,
};

export function NicheIcon({ name, ...props }: IconProps & { name: string }) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}
