import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'Contigo — Luisina Dorsi',
  description: 'A calm companion for moments of panic.',
};

export default function ContigoPage() {
  return (
    <ComingSoon
      projectTitle="Contigo"
      behanceUrl="https://www.behance.net/gallery/93631509/Contigo-App-Case-Study"
    />
  );
}
