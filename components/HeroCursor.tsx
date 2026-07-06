'use client';

import { useEffect, useRef } from 'react';

export default function HeroCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return;

    const container = containerRef.current!;
    const ring      = ringRef.current!;
    const hero      = container.parentElement!;

    let x = -100, y = -100;
    let grown = false;
    let raf = 0;

    const frame = () => {
      container.style.transform = `translate(${x}px, ${y}px)`;
    };

    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      container.style.opacity = '1';
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    };

    const onLeave = () => {
      container.style.opacity = '0';
    };

    const onOver = (e: MouseEvent) => {
      if (!grown && (e.target as Element).closest('[data-cursor-grow]')) {
        grown = true;
        ring.style.transform   = 'translate(-50%, -50%) scale(1.8)';
        ring.style.borderColor = 'rgba(196, 96, 58, 0.3)';
      }
    };

    const onOut = (e: MouseEvent) => {
      if (grown && (e.target as Element).closest('[data-cursor-grow]')) {
        grown = false;
        ring.style.transform   = 'translate(-50%, -50%) scale(1)';
        ring.style.borderColor = 'rgba(196, 96, 58, 0.6)';
      }
    };

    hero.addEventListener('mousemove',  onMove);
    hero.addEventListener('mouseleave', onLeave);
    hero.addEventListener('mouseover',  onOver);
    hero.addEventListener('mouseout',   onOut);

    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener('mousemove',  onMove);
      hero.removeEventListener('mouseleave', onLeave);
      hero.removeEventListener('mouseover',  onOver);
      hero.removeEventListener('mouseout',   onOut);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position:      'absolute',
        top:           0,
        left:          0,
        pointerEvents: 'none',
        zIndex:        50,
        opacity:       0,
        willChange:    'transform',
      }}
    >
      {/* Ring — scale via CSS transition, position driven by container rAF */}
      <div
        ref={ringRef}
        style={{
          width:           20,
          height:          20,
          borderRadius:    '50%',
          border:          '1px solid rgba(196, 96, 58, 0.6)',
          backgroundColor: 'transparent',
          transform:       'translate(-50%, -50%) scale(1)',
          transition:      'transform 0.2s ease, border-color 0.15s ease',
        }}
      />
      {/* Center dot — no transition needed */}
      <div
        style={{
          position:        'absolute',
          top:             0,
          left:            0,
          width:           4,
          height:          4,
          borderRadius:    '50%',
          backgroundColor: '#c4603a',
          transform:       'translate(-50%, -50%)',
          pointerEvents:   'none',
        }}
      />
    </div>
  );
}
