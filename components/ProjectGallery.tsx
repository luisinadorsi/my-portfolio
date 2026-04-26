'use client';

import { useRef } from 'react';
import Placeholder from '@/components/Placeholder';

type GalleryItem = {
  src?: string;
  alt: string;
  aspect?: '16/9' | '4/3' | '1/1';
};

type ProjectGalleryProps = {
  items: GalleryItem[];
};

export default function ProjectGallery({ items }: ProjectGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-16" aria-label="Project gallery">
      <div className="container mb-6">
        <h2
          className="text-3xl text-[var(--color-heading)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Gallery
        </h2>
      </div>

      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pl-[calc((100vw-min(100%,1400px))/2+2rem)] pr-8 pb-6 scrollbar-hide"
        style={{ scrollPaddingLeft: 'calc((100vw - min(100%, 1400px)) / 2 + 2rem)' }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="flex-none snap-start w-[min(85vw,520px)]"
          >
            <Placeholder aspect={item.aspect ?? '4/3'} label={item.alt} />
          </div>
        ))}
      </div>

      {/* Scroll hint dots */}
      <div className="container mt-4 flex gap-1.5" aria-hidden="true">
        {items.map((_, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--color-heading)]/20"
          />
        ))}
      </div>
    </section>
  );
}
