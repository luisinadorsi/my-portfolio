'use client';

import { useEffect, useRef } from 'react';

// ── Constants ───────────────────────────────────────────────────────────────
const NODE_COUNT  = 55;
const SPRING_K    = 0.04;
const DAMPING     = 0.82;
const REPEL_R     = 110;   // px
const REPEL_F     = 2.2;
const LINE_DIST   = 110;   // px — max distance for connection lines
const BG          = '#2d5a3d';
const CURSOR_COLOR = '#e8a07a';

// Warm colours that read on dark green
const PALETTE = [
  '#8ab5a0', '#e8a07a', '#c4b5a0', '#c4603a',
  '#a8ccb8', '#f0d0b0', '#5a8f70',
] as const;

// ── Types ───────────────────────────────────────────────────────────────────
interface Node {
  ox: number; oy: number;   // home position
  x:  number; y:  number;   // current position
  vx: number; vy: number;   // velocity
  r:     number;
  bAmp:  number;            // breathe amplitude
  bSpeed: number;           // breathe phase per frame
  bPhase: number;
  dPhase: number;           // drift oscillation phase
  dAmp:  number;            // drift force amplitude (px/frame²)
  color:   string;
  opacity: number;
}

// ── Component ───────────────────────────────────────────────────────────────
export default function Footer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const cursor    = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const footer = footerRef.current!;
    const ctx    = canvas.getContext('2d')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0, nodes: Node[] = [], t = 0, raf = 0;

    const initNodes = () => {
      nodes = Array.from({ length: NODE_COUNT }, () => {
        const ox = 40 + Math.random() * (w - 80);
        const oy = 20 + Math.random() * (h - 40);
        return {
          ox, oy, x: ox, y: oy, vx: 0, vy: 0,
          r:      2.5 + Math.random() * 4.5,
          bAmp:   0.8 + Math.random() * 1.4,
          bSpeed: 0.007 + Math.random() * 0.013,
          bPhase: Math.random() * Math.PI * 2,
          dPhase: Math.random() * Math.PI * 2,
          dAmp:   0.30 + Math.random() * 0.45,
          color:   PALETTE[Math.floor(Math.random() * PALETTE.length)],
          opacity: 0.55 + Math.random() * 0.40,
        };
      });
    };

    // ── resize ──────────────────────────────────────────────────
    const resize = () => {
      const dpr  = window.devicePixelRatio || 1;
      const rect = footer.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
    };

    // ── render one frame ─────────────────────────────────────────
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);

      // Connection lines — opacity proportional to proximity
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= LINE_DIST) continue;
          ctx.globalAlpha = (1 - dist / LINE_DIST) * 0.28;
          ctx.strokeStyle = 'rgba(200,210,200,1)';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Nodes
      for (const n of nodes) {
        const r = Math.max(0.5, n.r + n.bAmp * Math.sin(t * n.bSpeed + n.bPhase));
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle  = n.color;
        ctx.globalAlpha = n.opacity;
        ctx.fill();
      }

      // Custom cursor — only when inside footer
      const cx = cursor.current.x, cy = cursor.current.y;
      if (cx > 0 && cy > 0 && cx < w && cy < h) {
        ctx.globalAlpha = 0.92;
        ctx.beginPath();
        ctx.arc(cx, cy, 7, 0, Math.PI * 2);
        ctx.fillStyle = CURSOR_COLOR;
        ctx.fill();

        ctx.globalAlpha = 0.40;
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, Math.PI * 2);
        ctx.strokeStyle = CURSOR_COLOR;
        ctx.lineWidth   = 1;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    // ── physics tick ─────────────────────────────────────────────
    const tick = () => {
      t++;
      const cx = cursor.current.x, cy = cursor.current.y;
      const hasPointer = cx > 0 && cy > 0;

      for (const n of nodes) {
        // Spring back to home
        const sx = -(n.x - n.ox) * SPRING_K;
        const sy = -(n.y - n.oy) * SPRING_K;

        // Slow sinusoidal drift (period ≈ 35 s)
        const dfx = n.dAmp * Math.sin(t * 0.003 + n.dPhase);
        const dfy = n.dAmp * Math.cos(t * 0.003 + n.dPhase + 1.3);

        // Cursor/touch repulsion
        let rx = 0, ry = 0;
        if (hasPointer) {
          const dx = n.x - cx, dy = n.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPEL_R && dist > 0) {
            const force = REPEL_F * (1 - dist / REPEL_R) / dist;
            rx = dx * force;
            ry = dy * force;
          }
        }

        n.vx = (n.vx + sx + dfx + rx) * DAMPING;
        n.vy = (n.vy + sy + dfy + ry) * DAMPING;
        n.x += n.vx;
        n.y += n.vy;
      }

      render();
      raf = requestAnimationFrame(tick);
    };

    // ── pointer events (mouse + touch) ───────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursor.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { cursor.current = { x: -9999, y: -9999 }; };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      cursor.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    };
    const onTouchEnd = () => { cursor.current = { x: -9999, y: -9999 }; };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    if (reduced) {
      render();
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden"
      style={{ height: 360, cursor: 'none', backgroundColor: BG }}
    >
      {/* Canvas fills entire footer — receives all pointer events */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          display: 'block',
        }}
      />

      {/* Editorial footer headline */}
      <div
        className="relative z-10 flex flex-col items-center justify-center h-full gap-4"
        style={{ pointerEvents: 'none' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
            color: 'rgba(253,248,245,0.88)',
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          Let&rsquo;s design something that feels.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            color: 'rgba(253,248,245,0.38)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Designed &amp; built with care by Luisina Dorsi
        </p>
      </div>
    </footer>
  );
}
