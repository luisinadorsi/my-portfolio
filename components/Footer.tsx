'use client';

import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/* ── Circle config ─────────────────────────────────────────────── */
const CIRCLES = [
  { color: '#8fc4a0', size: 220, opacity: 0.40, top: '10%',  left: '8%'  },
  { color: '#e8869a', size: 180, opacity: 0.35, top: '20%',  left: '72%' },
  { color: '#a8c9de', size: 130, opacity: 0.30, top: '-10%', left: '45%' },
  { color: '#d4643a', size: 110, opacity: 0.25, top: '40%',  left: '28%' },
  { color: '#f0b89a', size:  80, opacity: 0.35, top: '15%',  left: '88%' },
  { color: '#2d6b5a', size:  70, opacity: 0.20, top: '50%',  left: '58%' },
];

/* ── Repel circle ─────────────────────────────────────────────── */
function RepelCircle({
  color, size, opacity, top, left, mouseX, mouseY, containerRef,
}: (typeof CIRCLES)[0] & {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const selfRef = useRef<HTMLDivElement>(null);

  const x = useSpring(useMotionValue(0), { stiffness: 80, damping: 18, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 80, damping: 18, mass: 0.6 });

  useEffect(() => {
    const MAX = 30;
    const RADIUS = size * 1.8; // influence radius

    const unsubX = mouseX.on('change', (mx) => {
      const el = selfRef.current;
      const container = containerRef.current;
      if (!el || !container) return;

      const rect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const cx = elRect.left + elRect.width / 2 - rect.left;
      const cy = elRect.top  + elRect.height / 2 - rect.top;
      const my = mouseY.get();

      const dx = cx - mx;
      const dy = cy - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS && dist > 0) {
        const force = Math.max(0, 1 - dist / RADIUS);
        x.set((-dx / dist) * force * MAX);
        y.set((-dy / dist) * force * MAX);
      } else {
        x.set(0);
        y.set(0);
      }
    });

    const unsubY = mouseY.on('change', () => {
      // Y changes trigger the same logic via X's handler on next X change;
      // fire it manually by pinging X with its current value.
      mouseX.set(mouseX.get());
    });

    return () => { unsubX(); unsubY(); };
  }, [mouseX, mouseY, size, x, y, containerRef]);

  return (
    <motion.div
      ref={selfRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        opacity,
        translateX: x,
        translateY: y,
        pointerEvents: 'none',
        transform: `translate(-50%, -50%)`,
        willChange: 'transform',
      }}
    />
  );
}

/* ── Footer ───────────────────────────────────────────────────── */
export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-9999);
    mouseY.set(-9999);
  };

  return (
    <footer
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        height: 300,
        backgroundColor: 'var(--color-bg)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Repelling circles */}
      {CIRCLES.map((c, i) => (
        <RepelCircle
          key={i}
          {...c}
          mouseX={mouseX}
          mouseY={mouseY}
          containerRef={containerRef}
        />
      ))}

      {/* Footer text */}
      <p
        className="absolute bottom-6 inset-x-0 text-center text-xs"
        style={{
          fontFamily: 'var(--font-sans)',
          color: 'rgba(42,36,32,0.50)',
          letterSpacing: '0.02em',
          zIndex: 1,
        }}
      >
        Designed &amp; built with care by Luisina Dorsi
      </p>
    </footer>
  );
}
