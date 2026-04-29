import Link from 'next/link';

interface ComingSoonProps {
  projectTitle: string;
  behanceUrl: string;
}

export default function ComingSoon({ projectTitle, behanceUrl }: ComingSoonProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 text-center">

      {/* Route animation */}
      <div className="w-full max-w-lg mb-12" aria-hidden="true">
        <svg viewBox="0 0 480 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 80 C40 80, 60 40, 120 40 S200 100, 240 80 S340 40, 380 60 S440 100, 480 80"
            stroke="#d4643a" strokeWidth="2" strokeDasharray="8 6" strokeLinecap="round"
            style={{ strokeDashoffset: 700, animation: 'routeDraw 12s linear infinite' }}
          />
          <g style={{ offsetPath: "path('M0 80 C40 80, 60 40, 120 40 S200 100, 240 80 S340 40, 380 60 S440 100, 480 80')", offsetRotate: 'auto', animation: 'walk 6s linear infinite' }}>
            <circle cx="0" cy="-22" r="5" fill="#d4643a"/>
            <rect x="-4" y="-16" width="8" height="10" rx="2" fill="#d4643a"/>
            <line x1="-4" y1="-6" x2="-6" y2="2" stroke="#d4643a" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="4" y1="-6" x2="6" y2="2" stroke="#d4643a" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="-2" y1="-6" x2="-4" y2="4" stroke="#d4643a" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="2" y1="-6" x2="4" y2="4" stroke="#d4643a" strokeWidth="2.5" strokeLinecap="round"/>
          </g>
        </svg>
      </div>

      {/* Headline */}
      <h1
        className="text-[clamp(2.2rem,6vw,4.5rem)] leading-[1.05] text-[var(--color-heading)] mb-6 max-w-2xl"
        style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', letterSpacing: '-0.01em' }}
      >
        This case study is still finding its route.
      </h1>

      <p
        className="text-lg mb-12 max-w-sm leading-relaxed"
        style={{ fontFamily: 'var(--font-sans)', color: 'oklab(0.265625 0.00656099 0.00965214 / 0.7)' }}
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
          style={{ fontFamily: 'var(--font-sans)', borderColor: 'oklab(0.265625 0.00656099 0.00965214 / 0.7)', color: 'oklab(0.265625 0.00656099 0.00965214 / 0.7)', letterSpacing: '0.04em' }}
        >
          ← Back to work
        </Link>
      </div>

      <p
        className="mt-16 uppercase"
        style={{ fontFamily: 'var(--font-sans)', color: '#d4643a', letterSpacing: '0.15em', fontSize: '11px', fontWeight: 500 }}
      >
        {projectTitle}
      </p>

      <style>{`
        @keyframes routeDraw { from{stroke-dashoffset:700} to{stroke-dashoffset:-700} }
        @keyframes walk { from{offset-distance:0%} to{offset-distance:100%} }
      `}</style>
    </div>
  );
}
