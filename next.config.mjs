/** @type {import('next').NextConfig} */
const nextConfig = {
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
      { source: '/blog/pdf---149867', destination: '/blog', permanent: true },
      { source: '/tools', destination: '/', permanent: true },
      { source: '/sitemap', destination: '/sitemap.xml', permanent: true },
      { source: '/contact', destination: '/about', permanent: true },
      { source: '/help', destination: '/about/faq', permanent: true },
      { source: '/faq', destination: '/about/faq', permanent: true },
      { source: '/pdf/edit', destination: '/pdf', permanent: true },
      { source: '/image/filter', destination: '/image', permanent: true },
      { source: '/document/contract', destination: '/document', permanent: true },
      { source: '/generator/qr', destination: '/generator/qrcode', permanent: true },
      { source: '/convert/pdf', destination: '/pdf', permanent: true },
    ]
  }
}
export default nextConfig
