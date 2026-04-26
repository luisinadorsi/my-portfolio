'use client';

import { useState } from 'react';

const SLIDES = [
  { bg: '#a8c9de', label: 'Onboarding'       },
  { bg: '#8fc4a0', label: 'Map View'          },
  { bg: '#e8869a', label: 'Recommendations'   },
  { bg: '#f0b89a', label: 'Route Detail'      },
  { bg: '#a8c9de', label: 'Settings'          },
];

/* Duplicate for seamless infinite loop */
const ALL = [...SLIDES, ...SLIDES];

export function HeroCarousel() {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="overflow-hidden w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)' }}
    >
      <style>{`
        @keyframes carousel-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          gap: 16,
          width: 'max-content',
          animation: 'carousel-scroll 24s linear infinite',
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {ALL.map((slide, i) => (
          <div
            key={i}
            style={{
              width: 'min(60vw, 680px)',
              aspectRatio: '16/9',
              backgroundColor: slide.bg,
              borderRadius: 16,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'flex-end',
              padding: 24,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
              }}
            >
              {slide.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
