import { Metadata } from 'next';
import { MethodologyClient } from './MethodologyClient';

export const metadata: Metadata = {
  title: '節約金額の計算方法 | 山田ツール',
  description: '山田ツールの節約時間・節約金額の計算根拠を公開しています。ツールごとの手作業時間・ツール使用時間・節約金額の一覧表です。',
  alternates: { canonical: 'https://yamada-tools.jp/about/methodology' },
};

export default function MethodologyPage() {
  return <MethodologyClient />;
}
