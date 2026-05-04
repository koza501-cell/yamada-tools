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
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(pdf|image|convert|generator|document)/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' },
        ],
      },
      {
        source: '/(account|auth|admin)/:path*',
        headers: [
          { key: 'Cache-Control', value: 'private, no-cache, no-store' },
        ],
      },
    ]
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
      { source: '/blog/pdf----149867', destination: '/blog', permanent: true },
      { source: '/nisa-simulator', destination: '/finance/nisa-simulator', permanent: true },
      { source: '/jutaku-loan', destination: '/finance/jutaku-loan', permanent: true },
      { source: '/fx-calculator', destination: '/finance/fx-calculator', permanent: true },
      { source: '/retirement-simulator', destination: '/finance/retirement-simulator', permanent: true },
      { source: '/tools/ideco-nisa-comparison', destination: '/finance/ideco-nisa-comparison', permanent: true },
      { source: '/tools/nisa-simulator', destination: '/finance/nisa-simulator', permanent: true },
      { source: '/ideco-nisa-comparison', destination: '/finance/ideco-nisa-comparison', permanent: true },
      { source: '/insurance', destination: '/', permanent: true },
      { source: '/debt', destination: '/', permanent: true },
      { source: '/education', destination: '/', permanent: true },
      { source: '/utility', destination: '/', permanent: true },
      { source: '/souzoku-touki/guide/gikaku-and-bassoku', destination: '/souzoku-touki/guide/gimuka-and-bassoku', permanent: true },
      { source: '/reference', destination: '/', permanent: true },
    ]
  }
}
export default nextConfig
