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
      clipPath: 'circle(36px at 50px 50px)',
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
          style={{ height: 92, paddingLeft: 110, paddingRight: 16, paddingTop: 28 }}
        >
          {project.tags.map(t => (
            <span
              key={t}
              className="inline-block font-medium tracking-widest uppercase px-2 py-0.5 rounded-full"
              style={{
                fontSize:        10,
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
          className="absolute inset-0 flex flex-col justify-end pointer-events-none"
          style={{
            clipPath: 'circle(36px at 50px 50px)',
            backgroundColor: accentColor,
          }}
        >
          {/* Tagline above title — bottom */}
          <div className="p-8 pt-0">
            <p
              className="leading-relaxed"
              style={{ color: overlayTaglineColor, fontFamily: 'var(--font-sans)', fontSize: 16, marginBottom: 6 }}
            >
              {project.tagline}
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 54,
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                color: overlayTitleColor,
                margin: 0,
              }}
            >
              {project.title}
            </h3>
          </div>
        </div>

      </div>
    </Link>
  );
}
