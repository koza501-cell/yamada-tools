/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-a1dbb3c658b341fabe5015e209050298.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'yamada-tools.jp',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  async redirects() {
    return [
      { source: '/legal', destination: '/legal/terms', permanent: true },
      { source: '/api/pdf/pdf-to-excel', destination: '/pdf/pdf-to-excel', permanent: true },
      { source: '/api/pdf/pdf-to-word', destination: '/pdf/pdf-to-word', permanent: true },
      { source: '/api/convert/furigana', destination: '/convert/furigana', permanent: true },
      { source: '/api/pdf/excel-to-pdf', destination: '/pdf/excel-to-pdf', permanent: true },
      { source: '/api/pdf/rotate', destination: '/pdf/rotate', permanent: true },
      { source: '/api/pdf/reorder', destination: '/pdf/reorder', permanent: true },
      { source: '/&', destination: '/', permanent: true },
      { source: '/$', destination: '/', permanent: true },
      { source: '/blog/image-resize-sns-perfect-size', destination: '/blog', permanent: true },
      { source: '/blog/kakutei-shinkoku-receipt-pdf-2025', destination: '/blog', permanent: true },
      { source: '/about/business', destination: '/about', permanent: true },
      { source: '/convert/tsubo-converter', destination: '/convert', permanent: true },
      { source: '/blog/pdf----149867', destination: '/blog', permanent: true },
      { source: '/nisa-simulator', destination: '/finance/nisa-simulator', permanent: true },
      { source: '/jutaku-loan', destination: '/finance/jutaku-loan', permanent: true },
      { source: '/fx-calculator', destination: '/finance/fx-calculator', permanent: true },
      { source: '/retirement-simulator', destination: '/finance/retirement-simulator', permanent: true },
      { source: '/tools/ideco-nisa-comparison', destination: '/finance/ideco-nisa-comparison', permanent: true },
      { source: '/tools/nisa-simulator', destination: '/finance/nisa-simulator', permanent: true },
      { source: '/ideco-nisa-comparison', destination: '/finance/ideco-nisa-comparison', permanent: true },
      { source: '/convert/wareki-seireki', destination: '/convert/date-converter', permanent: true },
      { source: '/generator/char-count', destination: '/generator/character-count', permanent: true },
      { source: '/generator/password-gen', destination: '/generator/password', permanent: true },
    ]
  }
}
export default nextConfig
