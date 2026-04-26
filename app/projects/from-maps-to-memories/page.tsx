import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'From Maps to Memories — Luisina Dorsi',
  description: 'Where cartography meets personal narrative.',
};

export default function FromMapsToMemoriesPage() {
  return (
    <ComingSoon
      projectTitle="From Maps to Memories"
      behanceUrl="https://www.behance.net/gallery/232140353/From-maps-to-memories-A-journey-across-borders"
    />
  );
}
