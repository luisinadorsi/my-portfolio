import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'EcoGenie — Luisina Dorsi',
  description: 'Your AI guide to a greener home.',
};

export default function EcoGeniePage() {
  return (
    <ComingSoon
      projectTitle="EcoGenie"
      behanceUrl="https://www.behance.net/gallery/222551799/EcoGenie-AI-Powered-Smart-Energy-Assistant"
    />
  );
}
