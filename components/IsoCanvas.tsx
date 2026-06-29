'use client';

import { useEffect, useRef } from 'react';

// ── Constants ───────────────────────────────────────────────────────────────
const PALETTE = ['#2d5a3d', '#c4603a', '#8ab5a0', '#b5a090', '#5a6e60'] as const;
const COLS        = 80;   // sample columns
const ROWS        = 60;   // sample rows
const LEVEL_COUNT = 32;   // iso-contour lines
const DOT_COUNT   = 22;   // breathing people-dots
const WAVE_COUNT  = 7;    // sine waves composing the height field
const BG          = '#fdf8f5';

// ── Types ───────────────────────────────────────────────────────────────────
interface Wave {
  fx: number; fy: number;   // spatial freq in normalised [0,1]² space
  speed: number;            // phase increment per frame (0.00006–0.00018)
  amp: number;              // amplitude (0.09–0.14)
  phase: number;            // initial phase
}
interface Dot {
  x: number; y: number;     // normalised position [0,1]
  vx: number; vy: number;
  color: string;
  baseR: number;
  bAmp: number;             // breathe amplitude
  bSpeed: number;           // breathe phase per frame
  bPhase: number;
  a: number;                // opacity
}
type V2 = [number, number];

// ── Marching Squares ────────────────────────────────────────────────────────
function itp(v1: number, v2: number, t: number) {
  const d = v2 - v1;
  return Math.abs(d) < 1e-9 ? 0.5 : Math.min(1, Math.max(0, (t - v1) / d));
}

function march(
  grid: Float32Array,
  threshold: number,
  cw: number,
  ch: number,
  ctx: CanvasRenderingContext2D,
) {
  ctx.beginPath();
  for (let r = 0; r < ROWS - 1; r++) {
    for (let c = 0; c < COLS - 1; c++) {
      const tl = grid[r * COLS + c],        tr = grid[r * COLS + c + 1];
      const br = grid[(r + 1) * COLS + c + 1], bl = grid[(r + 1) * COLS + c];
      const idx =
        (tl > threshold ? 8 : 0) | (tr > threshold ? 4 : 0) |
        (br > threshold ? 2 : 0) | (bl > threshold ? 1 : 0);
      if (idx === 0 || idx === 15) continue;

      const x = c * cw, y = r * ch;
      const top:    V2 = [x + itp(tl, tr, threshold) * cw, y];
      const right:  V2 = [x + cw, y + itp(tr, br, threshold) * ch];
      const bottom: V2 = [x + itp(bl, br, threshold) * cw, y + ch];
      const left:   V2 = [x, y + itp(tl, bl, threshold) * ch];

      const seg = (a: V2, b: V2) => { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); };
      switch (idx) {
        case  1: case 14: seg(left, bottom);  break;
        case  2: case 13: seg(bottom, right); break;
        case  3: case 12: seg(left, right);   break;
        case  4: case 11: seg(top, right);    break;
        case  6: case  9: seg(top, bottom);   break;
        case  7: case  8: seg(top, left);     break;
        case  5: seg(top, right);  seg(left, bottom);  break; // saddle
        case 10: seg(top, left);   seg(right, bottom); break; // saddle
      }
    }
  }
  ctx.stroke();
}

// ── Component ───────────────────────────────────────────────────────────────
export default function IsoCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Random waves — irrational frequency ratios give organic, non-repeating patterns
    const waves: Wave[] = Array.from({ length: WAVE_COUNT }, () => ({
      fx: (1.5 + Math.random() * 5.5) * Math.PI,
      fy: (1.5 + Math.random() * 5.5) * Math.PI,
      speed: 0.00006 + Math.random() * 0.00012,
      amp: 0.09 + Math.random() * 0.05,
      phase: Math.random() * Math.PI * 2,
    }));

    // 32 evenly-spaced thresholds — extremes have fewer contours, centre is denser
    const thresholds = Array.from({ length: LEVEL_COUNT }, (_, i) =>
      -0.68 + (i / (LEVEL_COUNT - 1)) * 1.36,
    );
    const styles = thresholds.map((_, i) => ({
      color:   PALETTE[i % PALETTE.length],
      opacity: 0.13 + Math.random() * 0.09,
      lw:      0.6  + Math.random() * 0.5,
    }));

    // Breathing dots
    const dots: Dot[] = Array.from({ length: DOT_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.00004;
      return {
        x: Math.random(), y: Math.random(),
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        color:   PALETTE[Math.floor(Math.random() * PALETTE.length)],
        baseR:   1.5 + Math.random() * 2.5,
        bAmp:    0.7 + Math.random() * 0.9,
        bSpeed:  0.010 + Math.random() * 0.018,
        bPhase:  Math.random() * Math.PI * 2,
        a:       0.25 + Math.random() * 0.30,
      };
    });

    const grid = new Float32Array(COLS * ROWS);
    let w = 0, h = 0, cw = 0, ch = 0;
    let t = 0, raf = 0;

    // ── resize ──────────────────────────────────────────────────
    const resize = () => {
      const dpr  = window.devicePixelRatio || 1;
      const rect = (canvas.parentElement ?? canvas).getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cw = w / (COLS - 1);
      ch = h / (ROWS - 1);
    };

    // ── sample sine-wave field into grid ─────────────────────────
    const fillGrid = () => {
      // Pre-compute y+time contribution per wave to save multiplications
      const yBase = waves.map(wv => wv.phase + t * wv.speed);
      for (let r = 0; r < ROWS; r++) {
        const ny = r / (ROWS - 1);
        const rowContrib = waves.map((wv, wi) => wv.fy * ny + yBase[wi]);
        for (let c = 0; c < COLS; c++) {
          const nx = c / (COLS - 1);
          let v = 0;
          for (let wi = 0; wi < WAVE_COUNT; wi++) {
            v += waves[wi].amp * Math.sin(waves[wi].fx * nx + rowContrib[wi]);
          }
          grid[r * COLS + c] = v;
        }
      }
    };

    // ── render one frame ─────────────────────────────────────────
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);

      ctx.lineCap = 'round';
      for (let i = 0; i < LEVEL_COUNT; i++) {
        const s = styles[i];
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = s.opacity;
        ctx.lineWidth   = s.lw;
        march(grid, thresholds[i], cw, ch, ctx);
      }

      ctx.globalAlpha = 1;
      for (const d of dots) {
        const r = Math.max(0.4, d.baseR + d.bAmp * Math.sin(t * d.bSpeed + d.bPhase));
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, r, 0, Math.PI * 2);
        ctx.fillStyle  = d.color;
        ctx.globalAlpha = d.a;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    // ── animation tick ───────────────────────────────────────────
    const tick = () => {
      t++;
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) { d.x = 0; d.vx *= -1; }
        if (d.x > 1) { d.x = 1; d.vx *= -1; }
        if (d.y < 0) { d.y = 0; d.vy *= -1; }
        if (d.y > 1) { d.y = 1; d.vy *= -1; }
      }
      fillGrid();
      render();
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);

    if (reduced) {
      fillGrid();
      render();
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
