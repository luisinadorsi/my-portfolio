type PlaceholderProps = {
  aspect?: '16/9' | '4/3' | '1/1' | '3/4';
  className?: string;
  label?: string;
  accentBg?: string; // CSS color value, e.g. 'var(--color-sage)'
};

const aspectMap = {
  '16/9': 'aspect-video',
  '4/3':  'aspect-[4/3]',
  '1/1':  'aspect-square',
  '3/4':  'aspect-[3/4]',
};

export default function Placeholder({ aspect = '4/3', className = '', label, accentBg }: PlaceholderProps) {
  return (
    <div
      className={`w-full ${aspectMap[aspect]} max-h-[280px] rounded-2xl overflow-hidden flex items-center justify-center ${className}`}
      style={{
        backgroundColor: accentBg
          ? `color-mix(in srgb, ${accentBg} 22%, var(--color-card))`
          : 'color-mix(in srgb, var(--color-heading) 10%, var(--color-card))',
      }}
      role="img"
      aria-label={label ?? 'Image placeholder — coming soon'}
    >
      <span className="text-[var(--color-heading)]/30 text-sm select-none">
        {label ?? 'Image coming soon'}
      </span>
    </div>
  );
}
