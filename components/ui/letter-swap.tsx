'use client';

import { motion, useAnimation } from 'framer-motion';
import { useCallback } from 'react';

type StaggerFrom = 'first' | 'last' | 'center' | number;

interface LetterSwapPingPongProps {
  label: string;
  staggerFrom?: StaggerFrom;
  staggerDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

function getDelay(
  index: number,
  total: number,
  staggerFrom: StaggerFrom,
  staggerDuration: number,
): number {
  if (staggerFrom === 'first') return index * staggerDuration;
  if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration;
  if (staggerFrom === 'center') {
    const center = (total - 1) / 2;
    return Math.abs(index - center) * staggerDuration;
  }
  return Math.abs(index - (staggerFrom as number)) * staggerDuration;
}

export function LetterSwapPingPong({
  label,
  staggerFrom = 'first',
  staggerDuration = 0.04,
  className,
  style,
}: LetterSwapPingPongProps) {
  const topControls = useAnimation();
  const bottomControls = useAnimation();

  const handleHoverStart = useCallback(() => {
    const total = label.length;
    topControls.start((i) => ({
      y: '-100%',
      transition: {
        delay: getDelay(i, total, staggerFrom, staggerDuration),
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
      },
    }));
    bottomControls.start((i) => ({
      y: '0%',
      transition: {
        delay: getDelay(i, total, staggerFrom, staggerDuration),
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
      },
    }));
  }, [topControls, bottomControls, label, staggerFrom, staggerDuration]);

  const handleHoverEnd = useCallback(() => {
    const total = label.length;
    topControls.start((i) => ({
      y: '0%',
      transition: {
        delay: getDelay(i, total, staggerFrom, staggerDuration),
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
      },
    }));
    bottomControls.start((i) => ({
      y: '100%',
      transition: {
        delay: getDelay(i, total, staggerFrom, staggerDuration),
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
      },
    }));
  }, [topControls, bottomControls, label, staggerFrom, staggerDuration]);

  return (
    <span
      className={`inline-flex overflow-hidden${className ? ' ' + className : ''}`}
      style={style}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {label.split('').map((char, i) => (
        <span
          key={i}
          className="relative inline-block"
          style={{ lineHeight: 'inherit' }}
        >
          <motion.span
            custom={i}
            animate={topControls}
            initial={{ y: '0%' }}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
          <motion.span
            custom={i}
            animate={bottomControls}
            initial={{ y: '100%' }}
            className="absolute inset-0 inline-block"
            aria-hidden="true"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
