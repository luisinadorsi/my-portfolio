'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import Image from 'next/image';

/* ── Photo data ─────────────────────────────────────────────── */
const PHOTOS = [
  {
    src: '/about/150A9924-626E-46F4-9D7F-6B8715DBA634_1_102_o.jpeg',
    alt: 'Luisina at Fushimi Inari torii gates, Kyoto',
  },
  {
    src: '/about/793A1717-363D-4378-8F2F-E123C9C69BC0_1_102_a.jpeg',
    alt: 'Luisina hiking in Patagonia with turquoise lake',
  },
  {
    src: '/about/9E6DCB2C-F745-4BA1-9DEC-AA6B74DA6AB6_1_102_a.jpeg',
    alt: 'Parasailing against a blue sky',
  },
  {
    src: '/about/9529D66C-90CA-4BC8-B8F1-9098CA1F43CA_1_201_a.jpeg',
    alt: 'Luisina on a coastal hike, windy day',
  },
  {
    src: '/about/D16C8541-69BC-46DE-A211-F74BAD7E89CB_1_102_a.jpeg',
    alt: 'Yellow tram in Lisbon street',
  },
];

/* Stacked rest state — slight spread so you can see all cards */
const STACK = [
  { rotate: -7, y: -6,  x: -8,  zIndex: 1 },
  { rotate: -3, y: -3,  x: -4,  zIndex: 2 },
  { rotate:  0, y:  0,  x:  0,  zIndex: 3 },
  { rotate:  3, y: -3,  x:  4,  zIndex: 2 },
  { rotate:  7, y: -6,  x:  8,  zIndex: 1 },
];

/* Fanned hover state */
const FAN = [
  { rotate: -20, y: 30,  x: -120, zIndex: 1 },
  { rotate: -10, y: 10,  x: -60,  zIndex: 2 },
  { rotate:   0, y:  0,  x:   0,  zIndex: 5 },
  { rotate:  10, y: 10,  x:  60,  zIndex: 2 },
  { rotate:  20, y: 30,  x: 120,  zIndex: 1 },
];

/* ── Count-up number ────────────────────────────────────────── */
function CountUp({ to, suffix = '' }: { to: number | null; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView || to === null) return;
    const node = ref.current;
    if (!node) return;
    const controls = animate(0, to, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate(v) {
        node.textContent = Math.round(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix]);

  return (
    <span ref={ref}>
      {to === null ? '∞' : `0${suffix}`}
    </span>
  );
}

/* ── PhotoGallery ────────────────────────────────────────────── */
export function PhotoGallery() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[380px]">
      {PHOTOS.map((photo, i) => {
        const rest = STACK[i];
        const fan  = FAN[i];
        return (
          <motion.div
            key={photo.src}
            className="absolute w-52 h-64 rounded-xl overflow-hidden shadow-lg cursor-pointer"
            style={{
              zIndex: hovered ? fan.zIndex : rest.zIndex,
              transformOrigin: 'bottom center',
              willChange: 'transform',
            }}
            animate={{
              rotate: hovered ? fan.rotate : rest.rotate,
              x:      hovered ? fan.x      : rest.x,
              y:      hovered ? fan.y      : rest.y,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 28, delay: i * 0.03 }}
            whileHover={{ scale: hovered ? 1.06 : 1 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
          >
            {/* White Polaroid border */}
            <div className="absolute inset-0 rounded-xl ring-4 ring-white/80 pointer-events-none z-10" />
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="208px"
              className="object-cover"
              priority
            />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Stats row ──────────────────────────────────────────────── */
export interface StatItem {
  value: number | null;
  suffix?: string;
  label: string;
}

const DEFAULT_STATS: StatItem[] = [
  { value: 6,    suffix: '+',  label: 'years designing systems that feel human'  },
  { value: 3,    suffix: '',   label: 'disciplines — GIS, Architecture & UX'      },
  { value: null, suffix: '',   label: 'curiosity for what makes people feel alive' },
];

export function StatsRow({ stats = DEFAULT_STATS }: { stats?: StatItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {stats.map((s, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 pl-5"
          style={{ borderLeft: '2px solid var(--color-terra)' }}
        >
          <p
            className="text-5xl font-light leading-none text-[var(--color-heading)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <CountUp to={s.value} suffix={s.suffix ?? ''} />
          </p>
          <p
            className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text)]/50 leading-tight"
          >
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}
