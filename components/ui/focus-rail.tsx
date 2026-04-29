'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

export interface FocusRailItem {
  id: number;
  title: string;
  description: string;
  meta: string;
  imageSrc: string;
}

interface FocusRailProps {
  items: FocusRailItem[];
  autoPlay?: boolean;
  loop?: boolean;
}

const INTERVAL_MS = 3500;
const CARD_W      = 320;  // centering math base
const X_GAP       = 370;

const BASE_SPRING = { type: 'spring', stiffness: 300, damping: 30, mass: 1 } as const;
const TAP_SPRING  = { type: 'spring', stiffness: 450, damping: 18, mass: 1 } as const;

export function FocusRail({ items, autoPlay = true, loop = true }: FocusRailProps) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = items.length;

  const stop = () => { if (timerRef.current) clearInterval(timerRef.current); };

  const start = () => {
    stop();
    if (!autoPlay) return;
    timerRef.current = setInterval(() => {
      setActive(prev => {
        const next = prev + 1;
        return next >= total ? (loop ? 0 : prev) : next;
      });
    }, INTERVAL_MS);
  };

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, loop, total]);

  const goNext = () => {
    setActive(prev => {
      const next = prev + 1;
      return next >= total ? (loop ? 0 : prev) : next;
    });
    start();
  };

  const goPrev = () => {
    setActive(prev => {
      const next = prev - 1;
      return next < 0 ? (loop ? total - 1 : prev) : next;
    });
    start();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const DRAG_THRESHOLD = 80;

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -DRAG_THRESHOLD) goNext();
    else if (info.offset.x > DRAG_THRESHOLD) goPrev();
  };

  const current = items[active];

  return (
    <div className="relative rounded-3xl overflow-hidden bg-[#1e4d40] select-none" style={{ height: 680 }}>

      {/* ── Ambient blurred background ─────────────────────────────── */}
      <AnimatePresence>
        <motion.div
          key={`bg-${current.id}`}
          className="absolute inset-0 blur-3xl saturate-200"
          style={{ zIndex: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={current.imageSrc}
            alt=""
            fill
            unoptimized
            className="object-cover scale-125"
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom gradient ────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '45%',
          zIndex: 5,
          background: 'linear-gradient(to top, #0a0a0a 0%, transparent 100%)',
        }}
      />

      {/* ── 3-D card rail ─────────────────────────────────────────── */}
      <div
        className="relative flex justify-center"
        style={{ height: 480, perspective: '1200px', zIndex: 10 }}
      >
        {/* Transparent drag capture layer — sits above cards */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className="absolute inset-0"
          style={{ zIndex: 30, cursor: 'grab' }}
          whileTap={{ cursor: 'grabbing' }}
        />

        {items.map((item, i) => {
          let dist = i - active;
          if (loop) {
            if (dist >  total / 2) dist -= total;
            if (dist < -total / 2) dist += total;
          }
          const absD = Math.abs(dist);
          if (absD > 2) return null;

          const isActive   = dist === 0;
          const blur       = isActive ? 0 : absD * 6;
          const brightness = isActive ? 1 : 0.5;

          return (
            <motion.div
              key={item.id}
              style={{
                position:        'absolute',
                top:             '50%',
                left:            `calc(50% - ${CARD_W / 2}px)`,
                transformStyle:  'preserve-3d',
                transformOrigin: 'center center',
                zIndex:          isActive ? 20 : 10,
                cursor:          isActive ? 'default' : 'pointer',
              }}
              animate={{
                x:        dist * X_GAP,
                y:        '-50%',
                rotateY:  dist * -20,
                scale:    isActive ? 1 : 0.85,
                filter:   `blur(${blur}px) brightness(${brightness})`,
              }}
              transition={{ scale: TAP_SPRING, default: BASE_SPRING }}
              onClick={() => !isActive && setActive(i)}
            >
              <div className="w-[300px] md:w-[360px] aspect-[3/4] rounded-2xl overflow-hidden relative">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover"
                  priority={isActive}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Info + controls bar ───────────────────────────────────── */}
      <div
        className="relative flex items-end justify-between px-8 pb-8 pt-0"
        style={{ zIndex: 20 }}
      >
        {/* Left: meta + title + description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-1 max-w-xs"
          >
            <span
              style={{
                fontFamily:    'var(--font-sans)',
                fontSize:       10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color:         'rgba(255,255,255,0.45)',
              }}
            >
              {current.meta}
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize:    28,
                color:       '#fdf8f5',
                lineHeight:  1.1,
                margin:      '4px 0',
              }}
            >
              {current.title}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize:    13,
                color:       'rgba(255,255,255,0.55)',
                lineHeight:  1.6,
              }}
            >
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Right: counter + prev/next buttons */}
        <div className="flex flex-col items-end gap-3 shrink-0 ml-6">
          <span
            style={{
              fontFamily:    'var(--font-sans)',
              fontSize:       12,
              color:         'rgba(255,255,255,0.5)',
              letterSpacing: '0.06em',
            }}
          >
            {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <div className="flex gap-2">
            {([['←', goPrev, 'Previous'], ['→', goNext, 'Next']] as const).map(([label, fn, aria]) => (
              <button
                key={aria}
                onClick={fn}
                aria-label={aria}
                style={{
                  width:           36,
                  height:          36,
                  borderRadius:   '50%',
                  backgroundColor: '#2d6b5a',
                  border:         '1px solid rgba(255,255,255,0.2)',
                  color:          '#fdf8f5',
                  cursor:         'pointer',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontSize:        14,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
