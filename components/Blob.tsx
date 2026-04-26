import type { Accent } from '@/content/projects';

type BlobProps = {
  variant?: Accent;
  className?: string;
  size?: number;
  breathe?: boolean;
  delay?: number;
};

const colorMap: Record<Accent, string> = {
  rose:  'var(--color-rose)',
  sage:  'var(--color-sage)',
  blue:  'var(--color-blue)',
  peach: 'var(--color-peach)',
  terra: 'var(--color-terra)',
};

export default function Blob({
  variant = 'sage',
  className = '',
  size = 500,
  breathe = false,
  delay = 0,
}: BlobProps) {
  // Correct CSS animation shorthand: name duration timing-function delay count
  const animation = breathe
    ? `blobBreathe 5s ease-in-out ${delay}ms infinite`
    : `blobDrift 30s ease-in-out ${delay}ms infinite`;

  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: colorMap[variant],
        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
        filter: 'blur(80px)',
        opacity: 0.28,
        animation,
      }}
    />
  );
}
