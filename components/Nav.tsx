'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { NavHeader } from '@/components/ui/nav-header';

const NAV_ITEMS = [
  { label: 'Home',    href: '/'         },
  { label: 'Work',    href: '/#work'    },
  { label: 'About',   href: '/#about'   },
  { label: 'Contact', href: '/#contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden]   = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Only trigger hide/show after scrolling past the nav height (64 px)
      if (y > 64) {
        setHidden(y > lastY.current);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-[transform,background-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled ? 'bg-[var(--color-bg)]/90 backdrop-blur-md' : 'bg-transparent'
      }`}
      style={{ transform: hidden ? 'translateY(-100%)' : 'translateY(0)' }}
    >
      <div className="container flex items-center justify-center h-16 relative">
        {/* Desktop pill nav — centered */}
        <NavHeader items={NAV_ITEMS} />

        {/* Mobile hamburger — absolute right so it doesn't shift centering */}
        <div className="absolute right-0">
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 text-[var(--color-text)] outline-none focus-visible:ring-2 focus-visible:ring-[#2d6b5a] rounded"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--color-bg)]/95 backdrop-blur-md border-t border-[var(--color-text)]/10">
          <nav aria-label="Mobile navigation" className="container flex flex-col py-6 gap-5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-lg font-medium text-[var(--color-text)] hover:text-[var(--color-heading)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#2d6b5a] rounded px-1"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
