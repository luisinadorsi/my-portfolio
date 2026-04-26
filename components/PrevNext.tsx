import Link from 'next/link';
import type { Project } from '@/content/projects';

type PrevNextProps = {
  prev: Project;
  next: Project;
};

export default function PrevNext({ prev, next }: PrevNextProps) {
  return (
    <nav
      aria-label="Project navigation"
      className="border-t border-[var(--color-text)]/10 py-16"
    >
      <div className="container flex items-center justify-between gap-8">
        <Link
          href={`/projects/${prev.slug}`}
          className="group flex items-center gap-4 max-w-xs"
        >
          <span className="flex-none w-12 h-12 rounded-full border border-[var(--color-heading)]/30 flex items-center justify-center text-[var(--color-heading)] group-hover:bg-[var(--color-heading)] group-hover:text-white transition-all duration-300">
            ←
          </span>
          <div>
            <p className="text-xs text-[var(--color-text)]/50 uppercase tracking-widest mb-1">
              Previous
            </p>
            <p
              className="text-lg text-[var(--color-heading)] leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {prev.title}
            </p>
          </div>
        </Link>

        <Link
          href={`/projects/${next.slug}`}
          className="group flex items-center gap-4 max-w-xs text-right"
        >
          <div>
            <p className="text-xs text-[var(--color-text)]/50 uppercase tracking-widest mb-1">
              Next
            </p>
            <p
              className="text-lg text-[var(--color-heading)] leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {next.title}
            </p>
          </div>
          <span className="flex-none w-12 h-12 rounded-full border border-[var(--color-heading)]/30 flex items-center justify-center text-[var(--color-heading)] group-hover:bg-[var(--color-heading)] group-hover:text-white transition-all duration-300">
            →
          </span>
        </Link>
      </div>
    </nav>
  );
}
