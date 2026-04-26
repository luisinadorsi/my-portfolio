'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import type { Accent } from '@/content/projects';

// Hues tuned to the Organic Editorial palette
const glowColorMap: Record<Accent, { base: number; spread: number }> = {
  rose:  { base: 345, spread: 180 },
  sage:  { base: 140, spread: 160 },
  blue:  { base: 205, spread: 180 },
  peach: { base:  25, spread: 160 },
  terra: { base:  15, spread: 180 },
};

type GlowCardProps = {
  children: ReactNode;
  className?: string;
  glowColor?: Accent;
  customSize?: boolean;
};

export function GlowCard({
  children,
  className = '',
  glowColor = 'rose',
  customSize = false,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const { base, spread } = glowColorMap[glowColor];

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const syncPointer = (e: PointerEvent) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = cardRef.current;
        if (!el) return;
        el.style.setProperty('--x', e.clientX.toFixed(2));
        el.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
        el.style.setProperty('--y', e.clientY.toFixed(2));
        el.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));
      });
    };

    document.addEventListener('pointermove', syncPointer);
    return () => {
      document.removeEventListener('pointermove', syncPointer);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      data-glow
      className={`relative rounded-2xl shadow-[0_1rem_2rem_-1rem_rgba(42,36,32,0.3)] p-5 backdrop-blur-sm ${!customSize ? 'aspect-[3/4]' : ''} ${className}`}
      style={{
        '--base': base,
        '--spread': spread,
        '--radius': '16',
        '--border': '2',
        '--backdrop': 'var(--color-card)',
        '--backup-border': 'rgba(42,36,32,0.08)',
        '--size': '220',
        '--outer': '1',
        '--border-size': 'calc(var(--border, 2) * 1px)',
        '--spotlight-size': 'calc(var(--size, 150) * 1px)',
        '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
        backgroundImage: `radial-gradient(
          var(--spotlight-size) var(--spotlight-size) at
          calc(var(--x, 0) * 1px)
          calc(var(--y, 0) * 1px),
          hsl(
            var(--hue, 210)
            calc(var(--saturation, 80) * 1%)
            calc(var(--lightness, 70) * 1%) /
            var(--bg-spot-opacity, 0.08)
          ),
          transparent
        )`,
        backgroundColor: 'var(--backdrop, transparent)',
        backgroundSize:
          'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
        backgroundPosition: '50% 50%',
        backgroundAttachment: 'fixed',
        border: 'var(--border-size) solid var(--backup-border)',
        touchAction: 'none',
      } as React.CSSProperties}
    >
      <div data-glow aria-hidden="true" />
      {children}
    </div>
  );
}
