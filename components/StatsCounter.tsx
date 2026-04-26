'use client';

import { useEffect, useRef } from 'react';

type Stat =
  | { kind: 'number'; value: number; suffix?: string; label: string }
  | { kind: 'symbol'; symbol: string; label: string };

const STATS: Stat[] = [
  { kind: 'number', value: 6, suffix: '+', label: 'Years designing' },
  { kind: 'number', value: 3,              label: 'Disciplines converged' },
  { kind: 'symbol', symbol: '∞',           label: 'Curiosity' },
];

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = `${value}${suffix}`;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          observer.unobserve(el);

          const duration = 1800;
          const startTime = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
            el.textContent = `${Math.round(eased * value)}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, suffix]);

  return (
    <span ref={ref} aria-label={`${value}${suffix}`}>
      0{suffix}
    </span>
  );
}

export default function StatsCounter() {
  return (
    <div className="flex flex-col gap-8">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="border-l-2 border-[var(--color-heading)]/15 pl-6"
        >
          <p
            className="text-5xl tabular-nums leading-none text-[var(--color-heading)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {stat.kind === 'number' ? (
              <CountUp value={stat.value} suffix={stat.suffix} />
            ) : (
              <span aria-label={stat.label}>{stat.symbol}</span>
            )}
          </p>
          <p className="text-[10px] mt-2 uppercase tracking-[0.22em] text-[var(--color-text)]/45">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
