'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Signed offset with shortest-path loop wrapping ────────────── */
function signedOffset(i: number, active: number, len: number, loop: boolean) {
  if (!loop || len <= 1) return i - active;
  const raw = i - active;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) <= Math.abs(raw) ? alt : raw;
}

/* ── Types ──────────────────────────────────────────────────────── */
export interface CardItem {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
}

interface CardStackProps {
  items: CardItem[];
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;
  showDots?: boolean;
  cardWidth?: number;
  cardHeight?: number;
  /** How many cards are visible in the fan simultaneously */
  maxVisible?: number;
  /** Total angular spread of the fan in degrees (e.g. 48 → ±24° from center) */
  spreadDeg?: number;
  /** translateZ depth step (px) per position away from center card */
  depthPx?: number;
  /** rotateX tilt added per position away from center */
  tiltXDeg?: number;
  /** Kept for API compatibility; controls opacity falloff (0–1) */
  overlap?: number;
  placeholderColors?: string[];
}

/* ── Component ──────────────────────────────────────────────────── */
export function CardStack({
  items,
  autoAdvance    = true,
  intervalMs     = 2500,
  pauseOnHover   = true,
  showDots       = true,
  cardWidth      = 480,
  cardHeight     = 300,
  maxVisible     = 7,
  spreadDeg      = 48,
  depthPx        = 80,
  tiltXDeg       = 8,
  overlap        = 0.35,  // controls opacity falloff: front=1 → edge=1-overlap
  placeholderColors = [],
}: CardStackProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered,     setHovered]     = useState(false);
  const [isDragging,  setIsDragging]  = useState(false);
  const [direction,   setDirection]   = useState<1 | -1>(1);

  /* ── Geometry ─────────────────────────────────────────────────── */
  const count     = Math.min(maxVisible, items.length);
  const half      = Math.floor(count / 2);
  // Angle between adjacent cards
  const angleStep = count > 1 ? spreadDeg / Math.max(count - 1, 1) : 0;
  // tilt per step (total across half the fan)
  const tiltStep  = half > 0 ? tiltXDeg / half : 0;
  // opacity drop per step (total = overlap from center → edge)
  const opacStep  = half > 0 ? overlap / half : 0;

  /* ── Horizontal spacing between cards ───────────────────────── */
  const cardSpacing = cardWidth * 0.75;

  /* ── Per-position transform values ───────────────────────────── */
  const posDepth = (pos: number) => {
    const a = Math.abs(pos);
    return {
      x:       pos * cardSpacing,
      rotateZ: pos * angleStep,
      rotateX: a * tiltStep,
      z:       -depthPx * a,
      opacity: Math.max(0.35, 1 - opacStep * a),
      // Unique zIndex per position: center highest, ties broken so +pos > -pos
      zIndex:  (count + 1 - a) * 10 + (pos >= 0 ? 5 : 0),
    };
  };

  /* ── Off-screen enter / exit values (just beyond the fan edge) ── */
  const edgeAngle   = (half + 1) * angleStep;
  const edgeTiltX   = (half + 1) * tiltStep;
  const edgeZ       = -depthPx   * (half + 1);
  const edgeX       = (half + 1) * cardSpacing;

  /* ── Visible cards centered on activeIndex ────────────────────── */
  const visible = items
    .map((item, i) => ({ item, originalIndex: i, pos: signedOffset(i, activeIndex, items.length, true) }))
    .filter(({ pos }) => Math.abs(pos) <= half)
    .sort((a, b) => a.pos - b.pos);

  /* ── Auto-advance ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!autoAdvance)               return;
    if (pauseOnHover && hovered)    return;
    if (isDragging)                 return;

    const t = setInterval(() => {
      setDirection(1);
      setActiveIndex((i) => (i + 1) % items.length);
    }, intervalMs);

    return () => clearInterval(t);
  }, [autoAdvance, pauseOnHover, hovered, isDragging, intervalMs, items.length]);

  const advance = () => {
    setDirection(1);
    setActiveIndex((i) => (i + 1) % items.length);
  };
  const goBack = () => {
    setDirection(-1);
    setActiveIndex((i) => (i - 1 + items.length) % items.length);
  };

  /* ── Stage must be wide enough to contain the full fan ──────── */
  const stageWidth = cardWidth + 2 * half * cardSpacing + cardWidth;

  return (
    <div
      className="flex flex-col items-center"
      style={{ gap: 28 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Fan stage ─────────────────────────────────────────────
          Explicit pixel width covers the full fan spread so no card
          is clipped by a parent overflow. Centered with auto margins.
          perspective + perspectiveOrigin:bottom for 3D tilt.        */}
      <div
        style={{
          width:             stageWidth,
          maxWidth:          '100vw',
          minHeight:          cardHeight + 140,
          position:          'relative',
          overflow:          'visible',
          perspective:       '1400px',
          perspectiveOrigin: '50% 100%',
          margin:            '0 auto',
        }}
      >
        <AnimatePresence mode="sync" initial={false}>
          {visible.map(({ item, originalIndex, pos }) => {
            const d      = posDepth(pos);
            const isFront = pos === 0;
            const bgColor = placeholderColors[originalIndex] ?? 'var(--color-card)';

            return (
              <motion.div
                key={item.id}
                style={{
                  position:        'absolute',
                  bottom:           0,
                  left:            '50%',
                  marginLeft:      -(cardWidth / 2),
                  width:            cardWidth,
                  height:           cardHeight,
                  borderRadius:     20,
                  overflow:        'hidden',
                  /* All cards share the same bottom-center pivot —
                     this is what makes them fan out like a hand of cards */
                  transformOrigin: 'bottom center',
                  cursor:           isFront ? 'grab' : 'pointer',
                  zIndex:           d.zIndex,
                  boxShadow:        isFront
                    ? '0 24px 64px rgba(42,36,32,0.18)'
                    : '0 6px 20px rgba(42,36,32,0.08)',
                }}
                /* Enter from the leading edge of the fan */
                initial={{
                  x:        direction * edgeX,
                  rotateZ:  direction * edgeAngle,
                  rotateX:  edgeTiltX,
                  z:         edgeZ,
                  opacity:   0,
                }}
                animate={{
                  x:        d.x,
                  rotateZ:  d.rotateZ,
                  rotateX:  d.rotateX,
                  z:         d.z,
                  opacity:   d.opacity,
                }}
                /* Exit toward the trailing edge */
                exit={{
                  x:        -direction * edgeX,
                  rotateZ:  -direction * edgeAngle,
                  rotateX:   edgeTiltX,
                  z:          edgeZ,
                  opacity:    0,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}

                /* Drag only on the front card */
                drag={isFront ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.22}
                whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(_, info) => {
                  setIsDragging(false);
                  if      (info.offset.x < -55) advance();
                  else if (info.offset.x >  55) goBack();
                }}

                onClick={() => !isFront && setActiveIndex(originalIndex)}
              >
                {/* Placeholder content — swap inner div for <Image> later */}
                <div
                  style={{
                    width:           '100%',
                    height:          '100%',
                    backgroundColor:  bgColor,
                    display:         'flex',
                    flexDirection:   'column',
                    alignItems:      'center',
                    justifyContent:  'center',
                    gap:              8,
                    padding:          24,
                    userSelect:      'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize:    22,
                      color:       'rgba(255,255,255,0.92)',
                      textAlign:   'center',
                      lineHeight:   1.2,
                    }}
                  >
                    {item.title}
                  </span>
                  <span
                    style={{
                      fontFamily:    'var(--font-sans)',
                      fontSize:       12,
                      letterSpacing: '0.06em',
                      color:         'rgba(255,255,255,0.60)',
                      textAlign:     'center',
                    }}
                  >
                    {item.description}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Dot navigation ────────────────────────────────────────── */}
      {showDots && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => {
                setDirection(i > activeIndex ? 1 : -1);
                setActiveIndex(i);
              }}
              aria-label={`Go to ${item.title}`}
              style={{
                width:           i === activeIndex ? 22 : 8,
                height:          8,
                borderRadius:    4,
                backgroundColor: i === activeIndex
                  ? 'var(--color-heading)'
                  : 'rgba(42,36,32,0.18)',
                border:     'none',
                padding:    0,
                cursor:     'pointer',
                transition: 'width 0.3s cubic-bezier(0.22,1,0.36,1), background-color 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
