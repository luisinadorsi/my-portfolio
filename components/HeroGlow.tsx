'use client';

import { useEffect, useRef } from 'react';

export default function HeroGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const parent = el.parentElement;
    if (!parent) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.background = `
        radial-gradient(
          640px circle at ${x}px ${y}px,
          rgba(232, 134, 154, 0.15),
          rgba(143, 196, 160, 0.10) 45%,
          transparent 70%
        )
      `;
    };

    parent.addEventListener('mousemove', handleMouseMove);
    return () => parent.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-[1]"
    />
  );
}
