'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const LINKS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/luisinadorsi' },
  { label: 'Medium',   href: 'https://medium.com/@luisina.dorsi'   },
  { label: 'Behance',  href: 'https://behance.net/luisinadorsi'    },
];

function SocialLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative pb-0.5 outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="leading-[1.2]"
        style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'white' }}
      >
        {label}{' '}
        <span style={{ fontSize: 16, opacity: 0.7 }}>↗</span>
      </span>

      {/* Per-link underline */}
      <motion.span
        className="absolute bottom-0 left-0 h-px bg-white"
        style={{ width: '100%', transformOrigin: 'left' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      />
    </a>
  );
}

export function ContactSocialStrip() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{ backgroundColor: '#e8869a', borderRadius: '0 0 16px 16px' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger row — always visible */}
      <div className="flex items-center justify-center gap-3 px-6 py-4">
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'white',
            whiteSpace: 'nowrap',
          }}
        >
          Find me here
        </span>

        {/* Horizontal rule */}
        <span
          aria-hidden="true"
          style={{
            display: 'block',
            width: 80,
            flexShrink: 0,
            height: 1,
            backgroundColor: 'white',
            opacity: 0.5,
          }}
        />

        {/* Rotating chevron */}
        <motion.span
          style={{ color: 'white', fontSize: 11, display: 'inline-block', lineHeight: 1, opacity: 0.8, flexShrink: 0 }}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          ↓
        </motion.span>
      </div>

      {/* Expandable links */}
      <motion.div
        style={{ overflow: 'hidden' }}
        initial={{ maxHeight: 0, opacity: 0 }}
        animate={{
          maxHeight: open ? 80 : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-center gap-10 pb-5 pt-1">
          {LINKS.map(({ label, href }) => (
            <SocialLink key={label} label={label} href={href} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
