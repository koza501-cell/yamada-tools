import type { Metadata } from 'next';
import DashboardClient from './client';

export const metadata: Metadata = {
  title: '節約ダッシュボード',
  description: '山田ツールの活用状況を確認。累計節約時間・金額・よく使うツールをチェックできます。',
};

export default function DashboardPage() {
  return <DashboardClient />;
}
