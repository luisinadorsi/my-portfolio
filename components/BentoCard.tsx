'use client';

import { useRef, type ReactNode } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import type { Project } from '@/content/projects';

const accentHexMap: Record<string, string> = {
  rose: '#e8869a',
  sage: '#8fc4a0',
  blue: '#a8c9de',
  peach: '#f0b89a',
  terra: '#d4643a',
};

/** Tag color per card in default (non-hover) state */
const tagColorMap: Record<string, string> = {
  'moodmaps':              '#2d6b5a',
  'contigo':               '#377BA7',
  'doctord-plus':          '#E8869A',
  'ecogenie':              '#ffffff',
  'from-maps-to-memories': '#ffffff',
};

type Props = {
  project: Project;
  /** Base layer content shown before hover */
  children: ReactNode;
  /** Override the overlay title color (defaults to warm white) */
  overlayTitleColor?: string;
  /** Override the overlay tagline color (defaults to warm white/80) */
  overlayTaglineColor?: string;
};

export default function BentoCard({ project, children, overlayTitleColor = '#fdf8f5', overlayTaglineColor = 'rgba(253,248,245,0.8)' }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const accentColor = accentHexMap[project.accent];
  const tagColor = tagColorMap[project.slug] ?? accentColor;

  const handleMouseEnter = () => {
    gsap.to(overlayRef.current, {
      clipPath: 'circle(160% at 50px 50px)',
      duration: 0.8,
      ease: 'expo.inOut',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(overlayRef.current, {
      clipPath: 'circle(42px at 50px 50px)',
      duration: 0.8,
      ease: 'expo.inOut',
    });
  };

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-[var(--color-heading)] focus-visible:outline-offset-4 rounded-2xl"
      aria-label={`View ${project.title} case study`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* overflow-hidden clips both base content and overlay to card bounds */}
      <div className="relative h-full rounded-2xl overflow-hidden">

        {/* Base card — always visible */}
        <div className="h-full">{children}</div>

        {/* Tags — always visible, inline with blob circle */}
        <div
          className="absolute top-0 left-0 right-0 flex flex-row flex-wrap items-start gap-2"
          style={{ height: 92, paddingLeft: 120, paddingRight: 16, paddingTop: 28 }}
        >
          {project.tags.map(t => (
            <span
              key={t}
              className="inline-block text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full"
              style={{
                backgroundColor: 'transparent',
                color:           tagColor,
                border:          `1px solid ${tagColor}66`,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Reveal overlay — expands on hover via clip-path animation */}
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="absolute inset-0 flex flex-col justify-between pointer-events-none"
          style={{
            clipPath: 'circle(42px at 50px 50px)',
            backgroundColor: accentColor,
          }}
        >
          {/* Overlay tags — top, same position as default tags */}
          <div
            className="flex flex-row flex-wrap items-start gap-2 flex-shrink-0"
            style={{ height: 92, paddingLeft: 120, paddingRight: 16, paddingTop: 28 }}
          >
            {project.tags.map(t => (
              <span
                key={t}
                className="inline-block text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full"
                style={{
                  backgroundColor: 'transparent',
                  color:           '#ffffff',
                  border:          '1px solid rgba(255,255,255,0.4)',
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Title + tagline — bottom */}
          <div className="p-8 pt-0">
            <h3
              className="text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] mb-3"
              style={{
                fontFamily: 'var(--font-display)',
                color: overlayTitleColor,
                letterSpacing: '-0.02em',
              }}
            >
              {project.title}
            </h3>
            <p
              className="text-base leading-relaxed"
              style={{ color: overlayTaglineColor, fontFamily: 'var(--font-sans)' }}
            >
              {project.tagline}
            </p>
          </div>
        </div>

      </div>
    </Link>
  );
}
