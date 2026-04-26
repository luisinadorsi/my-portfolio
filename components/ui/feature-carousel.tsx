'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Heart, Navigation, Settings, Layers } from 'lucide-react';
import Image from 'next/image';

/* ── Types ──────────────────────────────────────────────────────── */
export interface FeatureItem {
  id: string;
  label: string;
  description: string;
  placeholderBg: string;
  image?: string;
  icon: React.ReactNode;
}

interface FeatureCarouselProps {
  features: FeatureItem[];
  autoPlayMs?: number;
  leftBg?: string;
  /** @deprecated — tray bg is now fixed at #f0ece8 */
  rightBg?: string;
  activeChipBg?: string;
}

/* Shortest-path offset around a circular array */
function circularOffset(i: number, active: number, len: number): number {
  const raw = i - active;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

/* ── Component ──────────────────────────────────────────────────── */
export function FeatureCarousel({
  features,
  autoPlayMs = 3000,
  leftBg = '#2d6b5a',
}: FeatureCarouselProps) {
  const [active,   setActive]   = useState(0);
  const [hovered,  setHovered]  = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Auto-play ─────────────────────────────────────────────────── */
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % features.length);
    }, autoPlayMs);
  };

  useEffect(() => {
    if (hovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered, features.length, autoPlayMs]);

  const select = (i: number) => {
    setActive(i);
    startTimer();
  };

  const current = features[active];

  return (
    <div>
      {/* ── Tray ─────────────────────────────────────────────────── */}
      <div
        className="rounded-3xl"
        style={{ backgroundColor: '#f0ece8', padding: 32 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex flex-col md:flex-row gap-6 items-stretch">

          {/* ── Left nav panel — hidden on mobile ──────────────────── */}
          <div
            className="hidden md:flex flex-col justify-center gap-1 p-5 rounded-2xl flex-shrink-0"
            style={{ backgroundColor: leftBg, width: 200 }}
          >
            {features.map((f, i) => {
              const isActive = i === active;
              return (
                <button
                  key={f.id}
                  onClick={() => select(i)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left"
                  style={{
                    backgroundColor: isActive ? 'white' : 'transparent',
                    color:            isActive ? leftBg  : 'rgba(255,255,255,0.55)',
                    cursor:           'pointer',
                    border:           'none',
                    outline:          'none',
                    transition:       'background-color 0.2s, color 0.2s',
                  }}
                >
                  <span style={{ opacity: isActive ? 1 : 0.6, flexShrink: 0 }}>
                    {f.icon}
                  </span>
                  <span
                    style={{
                      fontFamily:    'var(--font-sans)',
                      fontSize:       12,
                      fontWeight:     isActive ? 600 : 400,
                      letterSpacing: '0.04em',
                      lineHeight:     1.3,
                    }}
                  >
                    {f.label}
                  </span>
                </button>
              );
            })}

            {/* Progress dots */}
            <div className="flex gap-1.5 mt-4 px-3">
              {features.map((_, i) => (
                <motion.div
                  key={i}
                  onClick={() => select(i)}
                  style={{
                    height:          4,
                    borderRadius:    2,
                    backgroundColor: i === active ? 'white' : 'rgba(255,255,255,0.25)',
                    cursor:          'pointer',
                  }}
                  animate={{ width: i === active ? 20 : 6 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </div>
          </div>

          {/* ── Right content ──────────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-5 min-w-0">

            {/* Portrait card carousel — active centered, prev/next peek from sides */}
            {/*
              Desktop: cards 60% wide, x ±110% → ~10% of adjacent card peeks in
              Mobile:  cards 80% wide, x ±105% → ~5% of adjacent card peeks in
            */}
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{ aspectRatio: '4/3', maxHeight: 480 }}
            >
              {features.map((f, i) => {
                const pos      = circularOffset(i, active, features.length);
                const isActive = pos === 0;
                if (Math.abs(pos) > 1) return null;

                const cardW  = isMobile ? '80%' : '60%';
                const cardML = isMobile ? '-40%' : '-30%';
                const xPct   = isMobile ? pos * 105 : pos * 110;

                return (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0 }}
                    animate={{
                      x:       `${xPct}%`,
                      opacity:  isActive ? 1 : 0.4,
                      scale:    isActive ? 1 : 0.9,
                    }}
                    transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                    onClick={() => !isActive && select(i)}
                    style={{
                      position:        'absolute',
                      top:              0,
                      bottom:           0,
                      left:            '50%',
                      width:            cardW,
                      marginLeft:       cardML,
                      borderRadius:     16,
                      backgroundColor:  f.placeholderBg,
                      overflow:        'hidden',
                      cursor:           isActive ? 'default' : 'pointer',
                      zIndex:           isActive ? 2 : 1,
                    }}
                  >
                    {f.image && (
                      <Image
                        src={f.image}
                        alt={f.label}
                        fill
                        className="object-cover rounded-2xl"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Label + description — below the card, outside */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id + '-text'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{    opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3
                  className="mb-1.5 text-[var(--color-heading)]"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1.2 }}
                >
                  {current.label}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize:    15,
                    color:       'var(--color-text)',
                    opacity:     0.65,
                    lineHeight:  1.65,
                  }}
                >
                  {current.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Mobile dot navigation — hidden on desktop (desktop uses left panel dots) */}
            <div className="flex md:hidden gap-2 justify-center mt-1">
              {features.map((_, i) => (
                <motion.div
                  key={i}
                  onClick={() => select(i)}
                  style={{
                    height:          6,
                    borderRadius:    3,
                    backgroundColor: i === active ? leftBg : `${leftBg}40`,
                    cursor:          'pointer',
                  }}
                  animate={{ width: i === active ? 24 : 8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MoodMaps feature data ───────────────────────────────────────── */
export const MOODMAPS_FEATURES: FeatureItem[] = [
  {
    id:           'onboarding',
    label:        'Emotional Onboarding',
    description:  'Select your current state — the system activates relevant GIS layers automatically.',
    placeholderBg: '#a8c9de',
    image:        '/moodmaps/Emotional Onboarding.png',
    icon:         <MapPin size={16} />,
  },
  {
    id:           'map',
    label:        'GIS Map Interface',
    description:  'Environmental layers show noise, density, green space and lighting in real time.',
    placeholderBg: '#8fc4a0',
    image:        '/moodmaps/GIS Map Interface.png',
    icon:         <Layers size={16} />,
  },
  {
    id:           'recommendations',
    label:        'Place Recommendations',
    description:  'Nearby spaces surface based on how you feel, not just where you are.',
    placeholderBg: '#e8869a',
    image:        '/moodmaps/Place recomendations.png',
    icon:         <Heart size={16} />,
  },
  {
    id:           'routes',
    label:        'Adaptive Routes',
    description:  'Routes that prioritise your wellbeing over speed.',
    placeholderBg: '#f0b89a',
    image:        '/moodmaps/Adatpive Routes.png',
    icon:         <Navigation size={16} />,
  },
  {
    id:           'hybrid',
    label:        'Hybrid Control',
    description:  'System intelligence meets user agency — always in control.',
    placeholderBg: '#2d6b5a',
    image:        '/moodmaps/Hybrid Control.png',
    icon:         <Settings size={16} />,
  },
];
