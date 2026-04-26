import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = {
  title: 'DoctorD+ — Luisina Dorsi',
  description: 'Redesigning how patients access healthcare.',
};

export default function DoctorDPlusPage() {
  return (
    <ComingSoon
      projectTitle="DoctorD+"
      behanceUrl="https://www.behance.net/gallery/134337215/DoctorD-UXUI-Design-Case-Study"
    />
  );
}
