'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export interface NavItem {
  label: string;
  href: string;
}

interface NavHeaderProps {
  items: NavItem[];
}

export function NavHeader({ items }: NavHeaderProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav
      aria-label="Site navigation"
      className="hidden md:flex items-center"
      style={{
        border: '1.5px solid #2d6b5a',
        borderRadius: '9999px',
        padding: '4px',
        isolation: 'isolate',
      }}
      onMouseLeave={() => setHovered(null)}
    >
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="relative px-5 py-1.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#2d6b5a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7ede8]"
          onMouseEnter={() => setHovered(item.label)}
        >
          {hovered === item.label && (
            <motion.span
              layoutId="nav-pill"
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: '#2d6b5a' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
          )}

          {/* Default state: oklab(0.265625 0.00656099 0.00965214 / 0.7) on #f7ede8 — contrast ~5.4:1 ✓ WCAG AA
              Hovered state: #f7ede8 on #2d6b5a  — contrast  5.2:1 ✓ WCAG AA  */}
          <span
            className="relative text-sm font-medium select-none transition-colors duration-150"
            style={{
              color: hovered === item.label ? '#f7ede8' : 'oklab(0.265625 0.00656099 0.00965214 / 0.7)',
              zIndex: 1,
            }}
          >
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  );
}
