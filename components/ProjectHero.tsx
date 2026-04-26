import type { Project } from '@/content/projects';
import Blob from '@/components/Blob';
import Tag from '@/components/Tag';

type ProjectHeroProps = {
  project: Project;
};

export default function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <header className="relative overflow-hidden bg-[var(--color-bg)] pt-28 pb-20 section-diagonal">
      {/* Decorative blobs */}
      <Blob variant={project.accent} className="-top-20 -right-20" size={420} />
      <Blob variant="sage" className="bottom-0 -left-20" size={300} />

      <div className="container relative z-10">
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <Tag key={tag} variant="outline">{tag}</Tag>
          ))}
        </div>
        <h1
          className="text-5xl sm:text-6xl md:text-7xl leading-[1.05] text-[var(--color-heading)] max-w-3xl"
          style={{ fontFamily: 'var(--font-display)', animation: 'heroFadeIn 0.8s var(--ease-organic) both' }}
        >
          {project.title}
        </h1>
        <p
          className="mt-5 text-xl md:text-2xl text-[var(--color-text)]/70 max-w-xl leading-relaxed"
          style={{ animation: 'heroFadeIn 0.8s 0.15s var(--ease-organic) both' }}
        >
          {project.tagline}
        </p>
      </div>
    </header>
  );
}
