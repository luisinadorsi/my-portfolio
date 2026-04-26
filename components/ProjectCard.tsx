import Link from 'next/link';
import type { Accent, Project } from '@/content/projects';
import { GlowCard } from '@/components/ui/spotlight-card';
import Placeholder from '@/components/Placeholder';
import Tag from '@/components/Tag';

type ProjectCardProps = {
  project: Project;
  className?: string;
};

const accentColorMap: Record<Accent, string> = {
  rose:  'var(--color-rose)',
  sage:  'var(--color-sage)',
  blue:  'var(--color-blue)',
  peach: 'var(--color-peach)',
  terra: 'var(--color-terra)',
};

export default function ProjectCard({ project, className = '' }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`block group focus-visible:outline-2 focus-visible:outline-[var(--color-heading)] focus-visible:outline-offset-4 rounded-2xl ${className}`}
      aria-label={`View ${project.title} case study`}
    >
      <GlowCard glowColor={project.accent} customSize className="h-full w-full flex flex-col gap-4">
        <Placeholder
          aspect="4/3"
          label={`${project.title} cover`}
          accentBg={accentColorMap[project.accent]}
        />
        <div className="flex flex-col gap-3 flex-1">
          <h3
            className="text-2xl leading-tight text-[var(--color-heading)] group-hover:opacity-80 transition-opacity"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {project.title}
          </h3>
          <p className="text-sm text-[var(--color-text)]/70 leading-relaxed">
            {project.tagline}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto pt-1">
            {project.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
      </GlowCard>
    </Link>
  );
}
