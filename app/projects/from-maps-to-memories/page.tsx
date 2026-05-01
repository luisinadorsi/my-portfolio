import type { Metadata } from 'next';
import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import Tag from '@/components/Tag';
import PrevNext from '@/components/PrevNext';
import { getAdjacent } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'From Maps to Memories — Luisina Dorsi',
  description: 'A personal migration story told through cartography, storytelling, and design.',
};

const TERRA = '#d4643a';

const TAGS = ['STORYTELLING', 'ARCGIS', 'DATA VISUALIZATION'];

export default function FromMapsToMemoriesPage() {
  const { prev, next } = getAdjacent('from-maps-to-memories');

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <header className="pt-32 pb-0 bg-[var(--color-bg)]">
        <div className="container max-w-6xl">
          {/* Back link */}
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-text)]/50 hover:text-[var(--color-heading)] transition-colors mb-12"
          >
            ← All projects
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {TAGS.map((tag) => (
              <Tag key={tag} variant="outline">{tag}</Tag>
            ))}
          </div>

          {/* Title */}
          <h1
            className="text-[clamp(4rem,10vw,8rem)] leading-[0.95] text-[var(--color-heading)] mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              animation: 'heroFadeIn 0.8s 0.05s var(--ease-organic) both',
            }}
          >
            From Maps to Memories
          </h1>

          {/* Tagline */}
          <p
            className="text-xl md:text-2xl text-[var(--color-text)]/60 max-w-md leading-relaxed mb-12"
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              animation: 'heroFadeIn 0.8s 0.18s var(--ease-organic) both',
            }}
          >
            A personal migration story told through cartography, storytelling, and design
          </p>

          {/* Meta strip — 4-col bordered */}
          <dl
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-14 border-b border-[var(--color-text)]/8"
            style={{ animation: 'heroFadeIn 0.8s 0.26s var(--ease-organic) both' }}
          >
            {[
              { label: 'Role',     value: 'UX Designer & Storyteller'  },
              { label: 'Timeline', value: '—'                           },
              { label: 'Tools',    value: 'ArcGIS • MidJourney'        },
              { label: 'Team',     value: 'Solo project'               },
            ].map(({ label, value }) => (
              <div key={label} className="pl-4" style={{ borderLeft: `2px solid ${TERRA}` }}>
                <dt
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: TERRA,
                  }}
                >
                  {label}
                </dt>
                <dd
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 18,
                    color: 'oklab(0.265625 0.00656099 0.00965214 / 0.7)',
                    lineHeight: 1.4,
                  }}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ── StoryMap Embed ────────────────────────────────────── */}
      <FadeIn>
        <iframe
          src="https://storymaps.arcgis.com/stories/05ee6bc4ebb94d85863780b8ede0e839"
          width="100%"
          height="100vh"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-pointer-lock allow-forms allow-popups allow-popups-to-escape-sandbox"
          style={{ display: 'block', minHeight: '100vh', border: 'none' }}
        />
      </FadeIn>

      {/* ── Prev / Next ───────────────────────────────────────── */}
      <PrevNext prev={prev} next={next} />
    </>
  );
}
