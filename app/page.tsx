import FadeIn from '@/components/FadeIn';
import BentoCard from '@/components/BentoCard';
import ProjectImage from '@/components/ProjectImage';
import TopoCanvas from '@/components/TopoCanvas';
import HeroCursor from '@/components/HeroCursor';
import { PhotoGallery, StatsRow } from '@/components/ui/gallery';
import { ContactSocialStrip } from '@/components/ui/contact-social-strip';
import { SectionLabel } from '@/components/ui/section-label';
import { getAllProjects } from '@/lib/projects';

export default function HomePage() {
  const projects = getAllProjects();

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center section-diagonal pt-32 pb-16 [@media(hover:hover)]:cursor-none" style={{ backgroundColor: '#fdf8f5' }}>
        <TopoCanvas />
        <HeroCursor />

        <div className="container relative z-10 flex flex-col items-center text-center max-w-4xl">
          <h1
            className="text-[clamp(3.5rem,9vw,6.5rem)] leading-[1.15] text-[var(--color-heading)] overflow-visible"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              animation: 'heroFadeIn 0.8s 0.1s var(--ease-organic) both',
            }}
          >
            Where data meets
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--color-terra)' }}>emotion.</em>
            <br />
            I design the space between.
          </h1>
          <p
            className="mt-8 text-base md:text-lg text-[var(--color-text)]/65 max-w-lg leading-[1.7]"
            style={{ animation: 'heroFadeIn 0.8s 0.2s var(--ease-organic) both' }}
          >
            I&rsquo;m Luisina — a UX/UI designer with a background in GIS and Architecture.
            I work at the intersection of data, space and human experience.
          </p>
          <div
            className="mt-10 flex flex-wrap justify-center gap-4"
            style={{ animation: 'heroFadeIn 0.8s 0.3s var(--ease-organic) both' }}
          >
            <a
              href="mailto:hello@luisinadorsi.com"
              data-cursor-grow
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--color-terra)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Say hello →
            </a>
          </div>

        </div>

      </section>

      {/* ── Work ──────────────────────────────────────────────────── */}
      <section id="work" className="py-24 relative overflow-hidden section-diagonal-top bg-[var(--color-bg)]">
        <div className="container px-20 md:px-24 xl:px-28 max-w-6xl mx-auto">
          <FadeIn>
            <h2
              className="text-4xl md:text-5xl text-[var(--color-heading)] mb-14 mt-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Work
            </h2>
          </FadeIn>

          {/* Bento project grid — editorial, clip-path reveal on hover */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ gridAutoRows: 'minmax(320px, auto)' }}>

            {/* MoodMaps — featured editorial (2 cols × 1 row) */}
            <FadeIn className="md:col-span-2" delay={0}>
              <BentoCard project={projects[0]}>
                <article style={{ position: 'relative', height: '100%' }}>
                  <ProjectImage src="/projects/moodmaps.png" alt="MoodMaps" fallbackBg="#fdf8f5" />
                  <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
                    <div style={{ position: 'absolute', top: 34, left: 34, width: 31, height: 31, borderRadius: '50%', backgroundColor: '#8fc4a0' }} />
                    <div className="transition-opacity duration-150 group-hover:opacity-0" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 32px 32px' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 54, color: '#2d6b5a', lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0 }}>{projects[0].title}</h3>
                    </div>
                  </div>
                </article>
              </BentoCard>
            </FadeIn>

            {/* Contigo — tall portrait (1 col × 2 rows) */}
            <FadeIn className="md:row-span-2" delay={80}>
              <BentoCard project={projects[1]}>
                <article style={{ position: 'relative', height: '100%' }}>
                  <ProjectImage src="/projects/contigo.png" alt="Contigo" fallbackBg="#c5dde8" />
                  <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
                    <div style={{ position: 'absolute', top: 34, left: 34, width: 31, height: 31, borderRadius: '50%', backgroundColor: '#a8c9de' }} />
                    <div className="transition-opacity duration-150 group-hover:opacity-0" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 32px 32px' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 54, color: '#2d6b5a', lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0 }}>{projects[1].title}</h3>
                    </div>
                  </div>
                </article>
              </BentoCard>
            </FadeIn>

            {/* DoctorD+ — text card (1 col × 1 row) */}
            <FadeIn delay={160}>
              <BentoCard project={projects[3]}>
                <article style={{ position: 'relative', height: '100%' }}>
                  <ProjectImage src="/projects/doctord-plus.png" alt="DoctorD+" fallbackBg="#fdf8f5" />
                  <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
                    <div style={{ position: 'absolute', top: 34, left: 34, width: 31, height: 31, borderRadius: '50%', backgroundColor: '#e8869a' }} />
                    <div className="transition-opacity duration-150 group-hover:opacity-0" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 32px 32px' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 54, color: '#2d6b5a', lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0 }}>{projects[3].title}</h3>
                    </div>
                  </div>
                </article>
              </BentoCard>
            </FadeIn>

            {/* EcoGenie — accent card (1 col × 1 row) */}
            <FadeIn delay={220}>
              <BentoCard project={projects[2]} overlayTitleColor="#2d6b5a" overlayTaglineColor="rgba(45,107,90,0.7)">
                <article style={{ position: 'relative', height: '100%' }}>
                  <ProjectImage src="/projects/ecogenie.png" alt="EcoGenie" fallbackBg="#d4643a" />
                  <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
                    <div style={{ position: 'absolute', top: 34, left: 34, width: 31, height: 31, borderRadius: '50%', backgroundColor: '#f0b89a' }} />
                    <div className="transition-opacity duration-150 group-hover:opacity-0" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 32px 32px' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 54, color: '#fdf8f5', lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0 }}>{projects[2].title}</h3>
                    </div>
                  </div>
                </article>
              </BentoCard>
            </FadeIn>

            {/* From Maps to Memories — wide editorial (3 cols × 1 row) */}
            <FadeIn className="md:col-span-3" delay={280}>
              <BentoCard project={projects[4]} overlayTitleColor="#2d6b5a" overlayTaglineColor="rgba(45,107,90,0.7)">
                <article style={{ position: 'relative', height: '100%' }}>
                  <ProjectImage src="/projects/from-maps-to-memories.png" alt="From Maps to Memories" fallbackBg="#2d6b5a" />
                  <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
                    <div style={{ position: 'absolute', top: 34, left: 34, width: 31, height: 31, borderRadius: '50%', backgroundColor: '#8fc4a0' }} />
                    <div className="transition-opacity duration-150 group-hover:opacity-0" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 32px 32px' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 54, color: '#fdf8f5', lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0 }}>{projects[4].title}</h3>
                    </div>
                  </div>
                </article>
              </BentoCard>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────────── */}
      <section id="about" className="py-24 relative overflow-hidden" style={{ backgroundColor: '#fdf8f5' }}>

        <div className="container relative z-10 px-20 md:px-24 xl:px-28 max-w-6xl mx-auto">

          <FadeIn>
            <SectionLabel text="About" className="mb-8" />
          </FadeIn>

          {/* Two-column: text left, gallery right */}
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 items-center">

              {/* Left — headline + bio */}
              <div className="flex flex-col gap-8">
                <h2
                  className="text-4xl md:text-5xl text-[var(--color-heading)] leading-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Designing the{' '}
                  <em className="not-italic text-[var(--color-terra)]">emotional layer</em>
                  <br />
                  of systems.
                </h2>
                <div className="space-y-4 text-[var(--color-text)]/70 leading-relaxed text-base">
                  <p>
                    I&rsquo;m Luisina — a UX/UI designer who believes every system has a feeling.
                    With a background in GIS and Architecture, I work at the intersection of data,
                    space, and human experience.
                  </p>
                  <p>
                    By day I design enterprise products. By passion I design systems that make
                    people feel something.
                  </p>
                </div>
              </div>

              {/* Right — photo gallery */}
              <PhotoGallery />

            </div>
          </FadeIn>

          {/* Stats row */}
          <FadeIn delay={120}>
            <StatsRow />
          </FadeIn>

        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────────── */}
      <section
        id="contact"
        className="py-32 md:py-40"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <div className="container flex justify-center">

          {/* Card + rose strip stacked */}
          <FadeIn className="w-full flex justify-center">
            <div className="flex flex-col w-full" style={{ maxWidth: 700 }}>

              {/* Terracotta card — square bottom corners so strip attaches flush */}
              <div
                className="relative flex flex-col items-center text-center"
                style={{
                  backgroundColor: 'var(--color-terra)',
                  borderRadius: '28px 28px 0 0',
                  padding: '60px 60px 80px',
                  overflow: 'visible',
                }}
              >
                {/* Symbol */}
                <span className="text-xl mb-4" style={{ color: 'rgba(253,248,245,0.6)' }}>
                  ✦
                </span>

                {/* Subtext */}
                <p
                  className="text-sm font-medium mb-6 leading-relaxed"
                  style={{ color: 'rgba(253,248,245,0.72)', letterSpacing: '0.01em' }}
                >
                  Drop a pin. Draw a line. Let&rsquo;s start a chat!
                </p>

                {/* Oversized headline — bleeds out of card bottom */}
                <h2
                  className="leading-[0.88]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(80px, 12vw, 160px)',
                    color: '#fdf8f5',
                    letterSpacing: '-0.03em',
                    position: 'relative',
                    bottom: '-0.22em',
                  }}
                >
                  <a
                    href="mailto:hello@luisinadorsi.com"
                    className="transition-opacity hover:opacity-80"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    Say hello.
                  </a>
                </h2>
              </div>

              {/* Rose strip — attaches to card bottom */}
              <ContactSocialStrip />

            </div>
          </FadeIn>

        </div>
      </section>
    </>
  );
}
