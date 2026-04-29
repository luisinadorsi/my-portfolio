import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import FadeIn from '@/components/FadeIn';
import Tag from '@/components/Tag';
import PrevNext from '@/components/PrevNext';
import { SectionLabel } from '@/components/ui/section-label';
import { getAdjacent } from '@/lib/projects';
import { FocusRail } from '@/components/ui/focus-rail';

export const metadata: Metadata = {
  title: 'MoodMaps — Luisina Dorsi',
  description: 'What if your map knew how you felt?',
};

const ACCENT  = '#a8c9de';
const TEAL    = '#2d6b5a';
const TERRA   = '#d4643a';

const TAGS = ['EMOTION', 'GIS', 'NAVIGATION', 'UX RESEARCH'];

const MVP_STEPS = [
  {
    n: '01',
    heading: 'Emotional Onboarding',
    body: 'Users select their current state. Relevant GIS layers activate automatically.',
  },
  {
    n: '02',
    heading: 'GIS Map Interface',
    body: 'Environmental data becomes visible — noise, density, green space, lighting.',
  },
  {
    n: '03',
    heading: 'Place Recommendations',
    body: 'Nearby spaces surface based on emotional need, not just proximity.',
  },
  {
    n: '04',
    heading: 'Adaptive Routes',
    body: 'Walking routes prioritise experiential quality over speed.',
  },
];

/* ── Screen gallery card ──────────────────────────────────────── */
function ScreenCard({ bg, ratio, src, alt }: { bg: string; ratio: string; src: string; alt: string }) {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden relative"
      style={{
        aspectRatio: ratio,
        backgroundColor: bg,
        border: '1px solid #a8c9de4d',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        padding: '24px',
      }}
    >
      <Image src={src} alt={alt} fill unoptimized className="object-contain" />
    </div>
  );
}

/* ── Shared editorial two-column section ──────────────────────── */
function EditorialSection({
  labelText,
  heading,
  subtitle,
  children,
  right,
  bordered = true,
}: {
  labelText: string;
  heading: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  right?: React.ReactNode;
  bordered?: boolean;
}) {
  return (
    <section className={`py-32 ${bordered ? 'border-b border-[var(--color-text)]/8' : ''}`}>
      <div className="container max-w-6xl">
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {/* Left col */}
            <div>
              <SectionLabel text={labelText} className="mb-6" />
              <h2
                className="text-4xl md:text-5xl leading-[1.1] text-[var(--color-heading)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {heading}
              </h2>
              {subtitle && (
                <p className="mt-6 text-lg text-[var(--color-text)]/70 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Right col */}
            {children && (
              <div className="flex flex-col gap-6">
                {children}
              </div>
            )}
          </div>

          {right && <div className="mt-12">{right}</div>}
        </FadeIn>
      </div>
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function MoodMapsPage() {
  const { prev, next } = getAdjacent('moodmaps');

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
            MoodMaps
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
            What if your map knew how you felt?
          </p>

          {/* Meta strip — 4-col bordered */}
          <dl
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-14 border-b border-[var(--color-text)]/8"
            style={{ animation: 'heroFadeIn 0.8s 0.26s var(--ease-organic) both' }}
          >
            {[
              { label: 'Role',     value: 'UX Researcher & Designer' },
              { label: 'Timeline', value: '10 weeks'                  },
              { label: 'Tools',    value: 'Figma, ArcGIS, Miro'       },
              { label: 'Team',     value: 'Solo project'              },
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

      {/* ── Key Features ──────────────────────────────────────────── */}
      <section className="bg-[#2d6b5a]" style={{ paddingTop: 64, paddingBottom: 80 }}>
        <div className="container max-w-6xl">
          <FadeIn>
            <SectionLabel text="05 Key Features" color="#f5f0e8" lineColor="#f5f0e8" className="mb-8" />
            <FocusRail
              items={[
                {
                  id: 1,
                  title: 'Emotional Onboarding',
                  description: 'Select your current state — GIS layers activate automatically.',
                  meta: 'FEATURE 01',
                  imageSrc: '/moodmaps/Emotional Onboarding.png',
                },
                {
                  id: 2,
                  title: 'GIS Map Interface',
                  description: 'Environmental layers show noise, density, green space in real time.',
                  meta: 'FEATURE 02',
                  imageSrc: '/moodmaps/GIS Map Interface.png',
                },
                {
                  id: 3,
                  title: 'Place Recommendations',
                  description: 'Nearby spaces surface based on how you feel, not just where you are.',
                  meta: 'FEATURE 03',
                  imageSrc: '/moodmaps/Place recomendations.png',
                },
                {
                  id: 4,
                  title: 'Adaptive Routes',
                  description: 'Routes that prioritise your wellbeing over speed.',
                  meta: 'FEATURE 04',
                  imageSrc: '/moodmaps/Adatpive Routes.png',
                },
                {
                  id: 5,
                  title: 'Hybrid Control',
                  description: 'System intelligence meets user agency — always in control.',
                  meta: 'FEATURE 05',
                  imageSrc: '/moodmaps/Hybrid Control.png',
                },
              ]}
              autoPlay={false}
              loop={true}
            />
          </FadeIn>
        </div>
      </section>

      {/* ── The Brief ─────────────────────────────────────────── */}
      <section className="py-32 border-b border-[var(--color-text)]/8">
        <div className="container max-w-6xl">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
              {/* Left col */}
              <div>
                <SectionLabel text="The brief" className="mb-6" />
                <h2
                  className="leading-[1.05] text-[var(--color-heading)]"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 56 }}
                >
                  Designing navigation that responds to how people feel, not just where they go.
                </h2>
              </div>

              {/* Right col */}
              <div className="flex flex-col gap-10">
                {/* Challenge */}
                <div>
                  <SectionLabel text="Challenge" className="mb-4" />
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 18, color: 'oklab(0.265625 0.00656099 0.00965214 / 0.7)', lineHeight: 1.7 }}>
                    Urban navigation optimises for speed. MoodMaps explores what happens when it
                    optimises for emotional wellbeing instead.
                  </p>
                </div>

                {/* What I did */}
                <div>
                  <SectionLabel text="What I did" className="mb-4" />
                  <ul className="space-y-2">
                    {[
                      'UX Research & Strategy',
                      'Information Architecture',
                      'Interaction Design',
                      'GIS Data Integration',
                      'Prototype & Testing',
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3"
                        style={{ fontFamily: 'var(--font-sans)', fontSize: 18, color: 'oklab(0.265625 0.00656099 0.00965214 / 0.7)', lineHeight: 1.6 }}
                      >
                        <span style={{ color: TERRA, fontWeight: 700, lineHeight: 1 }}>·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Pull Quote ────────────────────────────────────────── */}
      <FadeIn>
        <section
          className="py-24 md:py-32"
          style={{ backgroundColor: TEAL }}
        >
          <div className="container max-w-4xl">
            <blockquote>
              <p
                className="text-3xl md:text-4xl lg:text-5xl text-white leading-[1.2]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  letterSpacing: '-0.01em',
                }}
              >
                &ldquo;How might urban navigation adapt not only to where users need to go,
                but to how they feel while getting there?&rdquo;
              </p>
            </blockquote>
          </div>
        </section>
      </FadeIn>

      {/* ── The Problem ───────────────────────────────────────── */}
      <EditorialSection
        labelText="01  The problem"
        heading={
          <>
            Infrastructure without<br />
            emotional context
          </>
        }
        subtitle="Navigation optimises for speed. But the fastest route isn't always the one that helps you decompress, focus, or recover. Urban space is never emotionally neutral — design rarely acknowledges that."
      />

      {/* ── The Opportunity ───────────────────────────────────── */}
      <EditorialSection
        labelText="02  The opportunity"
        heading={
          <>
            Translating GIS<br />
            into lived experience
          </>
        }
        subtitle="Cities already generate the data — noise maps, pedestrian density, green space indices, lighting conditions. The design opportunity isn't collection. It's translation. MoodMaps explores how that infrastructure can inform real-time spatial recommendations tailored to how you actually feel."
        right={
          <FadeIn delay={120}>
            <div
              className="w-full rounded-2xl overflow-hidden relative"
              style={{
                aspectRatio: '3/2',
                backgroundColor: '#F0B89A',
                border: '1px solid #a8c9de4d',
              }}
            >
              <Image
                src="/moodmaps/the-opportunity.png"
                alt="GIS Environmental Layers"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </FadeIn>
        }
      />

      {/* ── MVP Scope ─────────────────────────────────────────── */}
      <section className="py-32 border-b border-[var(--color-text)]/8">
        <div className="container max-w-6xl">
          <FadeIn>
            <SectionLabel text="03  MVP scope" className="mb-6" />
            <h2
              className="text-4xl md:text-5xl text-[var(--color-heading)] mb-16 leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Four features, one emotional layer
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MVP_STEPS.map((step, i) => (
              <FadeIn key={step.n} delay={i * 70}>
                <div
                  className="rounded-2xl p-8 h-full"
                  style={{
                    backgroundColor: 'var(--color-card)',
                    border: `1px solid ${ACCENT}4d`,
                  }}
                >
                  {/* Large Cormorant number */}
                  <span
                    className="block leading-none mb-6"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 80,
                      fontWeight: 300,
                      color: TEAL,
                      opacity: 0.18,
                      lineHeight: 1,
                    }}
                  >
                    {step.n}
                  </span>
                  <h3
                    className="text-xl text-[var(--color-heading)] mb-3 leading-snug"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {step.heading}
                  </h3>
                  <p className="text-base text-[var(--color-text)]/65 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Full-width feature image */}
          <FadeIn delay={280}>
            <div
              className="rounded-2xl overflow-hidden relative w-full"
              style={{
                aspectRatio: '16/9',
                marginTop: 24,
                backgroundColor: '#fdf8f5',
                border: `1px solid ${ACCENT}4d`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <Image
                src="/moodmaps/four-features.png"
                alt="Four features, one emotional layer"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Interaction Model ─────────────────────────────────── */}
      <section className="py-32 border-b border-[var(--color-text)]/8">
        <div className="container max-w-6xl">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16 items-start">

              {/* Left — text (40%) */}
              <div className="md:col-span-2 flex flex-col gap-6">
                <SectionLabel text="04  Interaction model" className="mb-0" />
                <h2
                  className="text-4xl md:text-5xl leading-[1.1] text-[var(--color-heading)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Balancing intelligence<br />
                  with user agency
                </h2>
                <p
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 18, color: 'var(--color-text)', lineHeight: 1.7, opacity: 0.75 }}
                >
                  Environmental layers activate automatically based on emotional input, but users
                  retain full manual control. This isn't a system that decides for you — it's one
                  that starts the conversation.
                </p>
                <p
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 18, color: 'var(--color-text)', lineHeight: 1.7, opacity: 0.75, marginTop: 16 }}
                >
                  Every layer can be adjusted, turned off, or overridden. The sliders aren't
                  decorative — they're the system acknowledging that no algorithm knows your city
                  better than you do.
                </p>
              </div>

              {/* Right — single full-width image (60%) */}
              <div className="md:col-span-3">
                <div
                  className="w-full rounded-2xl overflow-hidden relative"
                  style={{ aspectRatio: '4/3', backgroundColor: ACCENT, border: '1px solid #a8c9de4d', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                >
                  <Image
                    src="/moodmaps/user-agency.png"
                    alt="User agency"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Screen Gallery ────────────────────────────────────── */}
      <section className="py-32 border-b border-[var(--color-text)]/8">
        <div className="container max-w-6xl">

          <FadeIn>
            <SectionLabel text="04  Screens" className="mb-12" />
          </FadeIn>

          <div className="flex flex-col gap-5">

            {/* Row 1 — full width */}
            <FadeIn delay={60}>
              <ScreenCard bg="#FDF8F5" ratio="16/7" src="/moodmaps/onboarding.png" alt="MoodMaps Onboarding" />
            </FadeIn>

            {/* Row 2 — full width */}
            <FadeIn delay={120}>
              <ScreenCard bg="#8FC4A0" ratio="16/7" src="/moodmaps/emotional-onboarding.png" alt="MoodMaps Emotional Onboarding" />
            </FadeIn>

            {/* Row 3 — 2 col */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FadeIn delay={180}>
                <ScreenCard bg="#FDF8F5" ratio="4/3" src="/moodmaps/home.png" alt="MoodMaps Home" />
              </FadeIn>
              <FadeIn delay={210}>
                <ScreenCard bg="#F0B89A" ratio="4/3" src="/moodmaps/experince-detail.png" alt="Serenity Garden Mindful Route" />
              </FadeIn>
            </div>

            {/* Row 4 — 2 col */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FadeIn delay={240}>
                <ScreenCard bg="#A8C9DE" ratio="4/3" src="/moodmaps/navigation.png" alt="Start Serenity Garden Mindful Route" />
              </FadeIn>
              <FadeIn delay={270}>
                <ScreenCard bg="#A8C9DE" ratio="4/3" src="/moodmaps/profile.png" alt="User Profile" />
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* ── Ethics & Reflection ───────────────────────────────── */}
      <section className="py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <SectionLabel text="05  Reflection" className="mb-8 justify-center" />
              <h2
                className="text-4xl md:text-5xl text-[var(--color-heading)] mb-8 leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Wellbeing as an integral<br />
                layer of navigation
              </h2>
              <p className="text-lg text-[var(--color-text)]/70 leading-relaxed mb-10">
                Emotional input is treated as contextual, not diagnostic. The system uses
                momentary self-reported data only — avoiding pathologisation of everyday
                emotional states. MoodMaps reflects my belief that UX has a critical role in
                translating environmental infrastructure into experiences that actively support
                human wellbeing.
              </p>
              <a
                href="https://medium.com/@luisina.dorsi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[var(--color-heading)] border-b border-[var(--color-heading)]/40 hover:border-[var(--color-heading)] transition-colors pb-0.5"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Read the full article on Medium ↗
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Prev / Next ───────────────────────────────────────── */}
      <PrevNext prev={prev} next={next} />
    </>
  );
}
