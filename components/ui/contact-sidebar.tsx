'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/luisinadorsi' },
  { label: 'Medium',   href: 'https://medium.com/@luisina.dorsi'   },
  { label: 'Behance',  href: 'https://behance.net/luisinadorsi'    },
];

function SideLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline-flex items-baseline gap-1.5 pb-0.5 outline-none focus-visible:ring-2 focus-visible:ring-[#2d6b5a] rounded"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="leading-[1.2]"
        style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#2a2420' }}
      >
        {label}
      </span>
      <span style={{ fontSize: 14, color: 'rgba(42,36,32,0.45)', lineHeight: 1 }}>↗</span>

      {/* Slide-in underline */}
      <motion.span
        className="absolute bottom-0 left-0 h-px bg-[#2a2420]"
        style={{ width: '100%', transformOrigin: 'left' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
    </a>
  );
}

export function ContactSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative flex items-center self-stretch"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Default state: vertical line + rotated label */}
      <motion.div
        className="flex flex-col items-center gap-4 cursor-default select-none px-2"
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.18 }}
        aria-hidden={open}
      >
        {/* Thin vertical line */}
        <div
          style={{
            width: 1,
            height: 56,
            backgroundColor: '#2d6b5a',
            opacity: 0.45,
          }}
        />
        {/* "FIND ME HERE" rotated */}
        <p
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            letterSpacing: '0.2em',
            color: '#2d6b5a',
            textTransform: 'uppercase',
          }}
        >
          Find me here
        </p>
      </motion.div>

      {/* Slide-out panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-full top-1/2 -translate-y-1/2 z-20"
            style={{ marginLeft: 20 }}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                backgroundColor: '#fdf8f5',
                borderRadius: 20,
                padding: '36px 44px',
                boxShadow: '0 20px 56px rgba(42,36,32,0.13)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {LINKS.map(({ label, href }) => (
                <SideLink key={label} label={label} href={href} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
