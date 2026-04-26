'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';
import SimpleFooter from './SimpleFooter';

export default function FooterSelector() {
  const pathname = usePathname();
  return pathname === '/' ? <Footer /> : <SimpleFooter />;
}
