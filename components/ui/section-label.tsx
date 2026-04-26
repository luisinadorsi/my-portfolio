interface SectionLabelProps {
  text: string;
  color?: string;
  lineColor?: string;
  lineOpacity?: number;
  className?: string;
}

export function SectionLabel({
  text,
  color = '#d4643a',
  lineColor = '#d4643a',
  lineOpacity = 0.4,
  className = '',
}: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
      <span
        aria-hidden="true"
        style={{
          display: 'block',
          width: 80,
          flexShrink: 0,
          height: 1,
          backgroundColor: lineColor,
          opacity: lineOpacity,
        }}
      />
    </div>
  );
}
