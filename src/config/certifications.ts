export type Certification = {
  id: string;
  enabled: boolean;
  label: string;
  icon: string;
  description: string;
  href?: string;
};

const certifications: Certification[] = [
  {
    id: "ssl",
    enabled: true,
    label: "SSL/TLS暗号化",
    icon: "🔒",
    description: "TLS 1.3 対応",
  },
  {
    id: "jp-server",
    enabled: true,
    label: "国内サーバー",
    icon: "🇯🇵",
    description: "日本国内完結",
  },
  {
    id: "pmark",
    enabled: false,
    label: "Pマーク",
    icon: "🔏",
    description: "プライバシーマーク",
    href: "https://privacymark.jp/",
  },
  {
    id: "iso27001",
    enabled: false,
    label: "ISO 27001",
    icon: "📋",
    description: "情報セキュリティ国際規格",
  },
  {
    id: "isms",
    enabled: false,
    label: "ISMS",
    icon: "🛡️",
    description: "情報セキュリティマネジメント",
  },
];

export default certifications;
