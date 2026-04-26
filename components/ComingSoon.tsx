import Link from 'next/link';

interface ComingSoonProps {
  projectTitle: string;
  behanceUrl: string;
}

const TERRA = '#d4643a';

/*
  Path: M0 60 C40,60 60,20 120,20 S200,80 240,60 S340,20 380,40 S440,80 480,60
  ViewBox: 480 × 120

  Stamp X positions: every 60 SVG units → 12.5% steps, starting at x=60.
  pathY: approximate bezier Y at each X (sampled analytically).

  Left  foot: toes-up, rotate -20deg, placed 8 SVG units ABOVE centerline
              → top = (pathY - 8) / 120 × 100%
  Right foot: toes-up, rotate +20deg, placed 8 SVG units BELOW centerline
              → top = (pathY + 8) / 120 × 100%
*/
const STAMPS: { left: string; pathY: number; isLeft: boolean }[] = [
  { left: '12.5%', pathY: 20, isLeft: true  },  // x=60
  { left: '25.0%', pathY: 20, isLeft: false },   // x=120
  { left: '37.5%', pathY: 60, isLeft: true  },   // x=180
  { left: '50.0%', pathY: 60, isLeft: false },   // x=240
  { left: '62.5%', pathY: 40, isLeft: true  },   // x=300
  { left: '75.0%', pathY: 40, isLeft: false },   // x=360
];

// Period = 6 stamps × 0.6s stagger = 3.6s → each stamp's cycle is 3.6s long.
// Each unique @keyframes-N encodes that stamp's exact appear/hold/fade window
// within the shared 3.6s loop so they never accidentally sync or overlap.
// Appear at:  i×0.6/3.6 = i×16.67%
// Peak:       appearAt + 4%
// Fade start: peak    + 22%
// Fade end:   peak    + 30%   (last stamp fades at 54+30 = 84% → 3.0s, clean before 3.6s)
const KEYFRAMES = STAMPS.map((_, i) => {
  const appear    = +(i * 16.667).toFixed(1);
  const peak      = +(appear + 4).toFixed(1);
  const fadeStart = +(peak   + 22).toFixed(1);
  const fadeEnd   = +(peak   + 30).toFixed(1);
  return `
    @keyframes stamp-${i} {
      0%          { opacity: 0; }
      ${appear}%  { opacity: 0; }
      ${peak}%    { opacity: 1; }
      ${fadeStart}% { opacity: 1; }
      ${fadeEnd}% { opacity: 0; }
      100%        { opacity: 0; }
    }`;
}).join('\n');

// Left foot:  big toe on RIGHT side (cx=10)
// Right foot: big toe on LEFT  side (cx=2)
// Both point toes upward; rotation ±20deg tilts them into walking angle.
function FootSVG({ isLeft }: { isLeft: boolean }) {
  const toes = isLeft
    ? [ // big toe on right → left foot anatomy
        { cx: 10.0, cy: 4.0, r: 2.0 },
        { cx: 7.5,  cy: 2.5, r: 1.8 },
        { cx: 5.0,  cy: 2.0, r: 1.7 },
        { cx: 2.5,  cy: 3.0, r: 1.5 },
        { cx: 1.0,  cy: 4.5, r: 1.2 },
      ]
    : [ // big toe on left → right foot anatomy
        { cx: 2.0,  cy: 4.0, r: 2.0 },
        { cx: 4.5,  cy: 2.5, r: 1.8 },
        { cx: 7.0,  cy: 2.0, r: 1.7 },
        { cx: 9.5,  cy: 3.0, r: 1.5 },
        { cx: 11.0, cy: 4.5, r: 1.2 },
      ];

  return (
    <svg viewBox="0 0 12 18" width="16" height="24" fill={TERRA} aria-hidden="true">
      <ellipse cx="6" cy="15.5" rx="3.5" ry="2.5" />
      <ellipse cx="6" cy="11.0" rx="3.0" ry="4.0" />
      <ellipse cx="6" cy="7.5"  rx="4.0" ry="3.0" />
      {toes.map((t, i) => <circle key={i} cx={t.cx} cy={t.cy} r={t.r} />)}
    </svg>
  );
}

export default function ComingSoon({ projectTitle, behanceUrl }: ComingSoonProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 text-center">

      {/* Route animation */}
      <div
        className="w-full max-w-lg mb-12"
        style={{ position: 'relative', overflow: 'hidden' }}
        aria-hidden="true"
      >
        {/* Wavy dashed path */}
        <svg viewBox="0 0 480 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 60 C40 60, 60 20, 120 20 S200 80, 240 60 S340 20, 380 40 S440 80, 480 60"
            stroke={TERRA}
            strokeWidth="2"
            strokeDasharray="8 6"
            strokeLinecap="round"
            style={{ strokeDashoffset: 700, animation: 'routeDraw 12s linear infinite' }}
          />
        </svg>

        {/* Footprints — each stamp fires once per 3.6s loop at its baked-in time slot */}
        {STAMPS.map((s, i) => {
          const offsetY = s.isLeft ? -6 : 6;
          const topPct  = ((s.pathY + offsetY) / 120 * 100).toFixed(1);
          const rotate  = s.isLeft ? -20 : 20;
          return (
            <span
              key={i}
              style={{
                position:        'absolute',
                left:            s.left,
                top:             `calc(${topPct}% - 12px)`,
                marginLeft:      '-8px',
                display:         'block',
                opacity:         0,
                transform:       `rotate(${rotate}deg)`,
                transformOrigin: 'center',
                animationName:      `stamp-${i}`,
                animationDuration:  '3.6s',
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
              }}
            >
              <FootSVG isLeft={s.isLeft} />
            </span>
          );
        })}
      </div>

      {/* Headline */}
      <h1
        className="text-[clamp(2.2rem,6vw,4.5rem)] leading-[1.05] text-[var(--color-heading)] mb-6 max-w-2xl"
        style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', letterSpacing: '-0.01em' }}
      >
        This case study is still finding its route.
      </h1>

      <p
        className="text-lg text-[var(--color-text)]/60 mb-12 max-w-sm leading-relaxed"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        Good things take time — and the right path.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <a
          href={behanceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all"
          style={{ fontFamily: 'var(--font-sans)', backgroundColor: '#d4643a', color: '#fff', letterSpacing: '0.04em' }}
        >
          View on Behance ↗
        </a>
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium tracking-wide border transition-all"
          style={{ fontFamily: 'var(--font-sans)', borderColor: 'var(--color-text)', color: 'var(--color-text)', opacity: 0.6, letterSpacing: '0.04em' }}
        >
          ← Back to work
        </Link>
      </div>

      <p
        className="mt-16 text-xs uppercase tracking-widest text-[var(--color-text)]/30"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {projectTitle}
      </p>

      <style>{`
        @keyframes routeDraw {
          from { stroke-dashoffset:  700; }
          to   { stroke-dashoffset: -700; }
        }
        ${KEYFRAMES}
      `}</style>
    </div>
  );
}
