import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllSlugs, getProject, getAdjacent } from '@/lib/projects';
import FadeIn from '@/components/FadeIn';
import ProjectHero from '@/components/ProjectHero';
import ProjectMeta from '@/components/ProjectMeta';
import ProjectGallery from '@/components/ProjectGallery';
import PrevNext from '@/components/PrevNext';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Luisina Dorsi`,
    description: project.tagline,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacent(slug);

  return (
    <>
      <ProjectHero project={project} />

      <ProjectMeta meta={project.meta} />

      {/* Overview */}
      <section className="py-16 border-b border-[var(--color-text)]/10">
        <div className="container max-w-3xl">
          <FadeIn>
            <h2
              className="text-3xl md:text-4xl text-[var(--color-heading)] mb-8"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Overview
            </h2>
            <div className="space-y-5 text-[var(--color-text)]/80 leading-relaxed text-lg">
              {project.overview.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 border-b border-[var(--color-text)]/10">
        <div className="container">
          <FadeIn>
            <h2
              className="text-3xl md:text-4xl text-[var(--color-heading)] mb-12"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Process
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl">
            {project.process.map((step, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="bg-[var(--color-card)] rounded-2xl p-8 shadow-sm border border-[var(--color-text)]/5">
                  <span className="text-xs uppercase tracking-widest text-[var(--color-heading)]/50 block mb-3">
                    0{i + 1}
                  </span>
                  <h3
                    className="text-xl text-[var(--color-heading)] mb-4"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {step.heading}
                  </h3>
                  <p className="text-sm text-[var(--color-text)]/75 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <ProjectGallery items={project.gallery} />

      <PrevNext prev={prev} next={next} />
    </>
  );
}
