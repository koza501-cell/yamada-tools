import type { Metadata } from 'next';
import ComponentsPreviewClient from './client';

export const metadata: Metadata = {
  title: 'コンポーネントプレビュー (Staging)',
  robots: { index: false, follow: false },
};

export default function ComponentsPreviewPage() {
  return <ComponentsPreviewClient />;
}
