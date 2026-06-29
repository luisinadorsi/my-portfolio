'use client';

import { useEffect, useRef } from 'react';

// ── Shared config (fallback path only) ───────────────────────────────────────
const CELL       = 3;
const PEAK_N     = 8;
const LEVEL_N    = 55;
const NODE_N     = 38;
const FILL_EVERY = 3;
const CUR_R      = 120;
const CUR_D      = -0.55;
const CONN       = 110;

const FILL_RGB: ReadonlyArray<readonly [number, number, number]> = [
  [0x2d, 0x5a, 0x3d], [0x8a, 0xb5, 0xa0], [0x5a, 0x6e, 0x60],
  [0xb5, 0xa0, 0x90], [0xc4, 0x60, 0x3a],
];
const LINE_C = ['#d4845a', '#8ab5a0', '#b5a090', '#5a6e60', '#2d5a3d'] as const;
const NODE_C = ['#2d5a3d', '#8ab5a0', '#5a6e60', '#b5a090', '#c4603a', '#d4845a'] as const;

interface Peak {
  bx: number; by: number; amp: number; s2: number;
  dax: number; dsx: number; dpx: number;
  day: number; dsy: number; dpy: number;
}
interface PNode {
  bx: number; by: number;
  oax: number; osx: number; opx: number;
  oay: number; osy: number; opy: number;
  r: number; ba: number; bs: number; bp: number;
  col: string; op: number;
}
type V2 = [number, number];

function lp(v1: number, v2: number, t: number): number {
  const d = v2 - v1;
  return Math.abs(d) < 1e-9 ? 0.5 : Math.min(1, Math.max(0, (t - v1) / d));
}
function march(
  g: Float32Array, thr: number,
  gw: number, gh: number, cw: number, ch: number,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.beginPath();
  for (let r = 0; r < gh - 1; r++) {
    for (let c = 0; c < gw - 1; c++) {
      const tl = g[r * gw + c],        tr = g[r * gw + c + 1];
      const br = g[(r + 1) * gw + c + 1], bl = g[(r + 1) * gw + c];
      const idx =
        (tl > thr ? 8 : 0) | (tr > thr ? 4 : 0) |
        (br > thr ? 2 : 0) | (bl > thr ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const x = c * cw, y = r * ch;
      const T: V2 = [x + lp(tl, tr, thr) * cw, y];
      const R: V2 = [x + cw, y + lp(tr, br, thr) * ch];
      const B: V2 = [x + lp(bl, br, thr) * cw, y + ch];
      const L: V2 = [x, y + lp(tl, bl, thr) * ch];
      const s = (a: V2, b: V2) => { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); };
      switch (idx) {
        case  1: case 14: s(L, B); break;
        case  2: case 13: s(B, R); break;
        case  3: case 12: s(L, R); break;
        case  4: case 11: s(T, R); break;
        case  6: case  9: s(T, B); break;
        case  7: case  8: s(T, L); break;
        case  5: s(T, R); s(L, B); break;
        case 10: s(T, L); s(R, B); break;
      }
    }
  }
  ctx.stroke();
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TopoCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const parent = (canvas.parentElement ?? canvas) as HTMLElement;

    // ── Worker path ────────────────────────────────────────────────────────
    if (typeof (canvas as HTMLCanvasElement & { transferControlToOffscreen?: () => OffscreenCanvas }).transferControlToOffscreen === 'function') {
      const offscreen = canvas.transferControlToOffscreen();
      const worker = new Worker(new URL('./topoWorker.js', import.meta.url));

      const sendInit = () => {
        const rect = (canvas.parentElement ?? canvas).getBoundingClientRect();
        worker.postMessage(
          { type: 'init', canvas: offscreen, width: rect.width, height: rect.height, dpr: window.devicePixelRatio || 1 },
          [offscreen],
        );
      };
      sendInit();

      const onMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        worker.postMessage({ type: 'mouse', x: e.clientX - rect.left, y: e.clientY - rect.top });
      };
      const onLeave = () => worker.postMessage({ type: 'mouse', x: -9999, y: -9999 });
      const onTouch = (e: TouchEvent) => {
        const rect  = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        worker.postMessage({ type: 'mouse', x: touch.clientX - rect.left, y: touch.clientY - rect.top });
      };
      const onTouchEnd = () => worker.postMessage({ type: 'mouse', x: -9999, y: -9999 });
      const onResize = () => {
        const rect = (canvas.parentElement ?? canvas).getBoundingClientRect();
        worker.postMessage({ type: 'resize', width: rect.width, height: rect.height, dpr: window.devicePixelRatio || 1 });
      };

      parent.addEventListener('mousemove', onMove);
      parent.addEventListener('mouseleave', onLeave);
      parent.addEventListener('touchmove', onTouch, { passive: true });
      parent.addEventListener('touchend', onTouchEnd);
      window.addEventListener('resize', onResize);

      return () => {
        worker.terminate();
        parent.removeEventListener('mousemove', onMove);
        parent.removeEventListener('mouseleave', onLeave);
        parent.removeEventListener('touchmove', onTouch);
        parent.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('resize', onResize);
      };
    }

    // ── Fallback: main-thread rendering (old Safari / no OffscreenCanvas) ──
    const ctx = canvas.getContext('2d')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0, gw = 0, gh = 0, cw = 0, ch = 0, t = 0, raf = 0;
    let baseGrid = new Float32Array(0);
    let drawGrid = new Float32Array(0);

    const fillC = document.createElement('canvas');
    const fillX = fillC.getContext('2d')!;
    let fillImg = fillX.createImageData(1, 1);

    const grainC = document.createElement('canvas');
    grainC.width = grainC.height = 256;
    (() => {
      const gx = grainC.getContext('2d')!;
      const d = gx.createImageData(256, 256);
      for (let i = 0; i < 256 * 256; i++) {
        d.data[i * 4] = d.data[i * 4 + 1] = d.data[i * 4 + 2] = 0;
        d.data[i * 4 + 3] = Math.round(Math.random()) * Math.floor(10 + Math.random() * 35);
      }
      gx.putImageData(d, 0, 0);
    })();
    const grainPtn = ctx.createPattern(grainC, 'repeat')!;

    const cursor = { x: -9999, y: -9999 };
    let peaks: Peak[] = [];
    let nodes: PNode[] = [];
    const thresholds = Array.from({ length: LEVEL_N }, (_, i) => 0.04 + (i / (LEVEL_N - 1)) * 0.90);

    const initPeaks = () => {
      peaks = Array.from({ length: PEAK_N }, () => ({
        bx: 0.08 + Math.random() * 0.84, by: 0.08 + Math.random() * 0.84,
        amp: 0.45 + Math.random() * 0.45,
        s2:  2 * (0.10 + Math.random() * 0.10) ** 2,
        dax: 0.012 + Math.random() * 0.025, dsx: 0.0002 + Math.random() * 0.0004, dpx: Math.random() * Math.PI * 2,
        day: 0.012 + Math.random() * 0.025, dsy: 0.0002 + Math.random() * 0.0004, dpy: Math.random() * Math.PI * 2,
      }));
    };
    const initNodes = () => {
      nodes = Array.from({ length: NODE_N }, () => ({
        bx: 0.05 + Math.random() * 0.90, by: 0.05 + Math.random() * 0.90,
        oax: 0.03 + Math.random() * 0.05, osx: 0.0002 + Math.random() * 0.0003, opx: Math.random() * Math.PI * 2,
        oay: 0.02 + Math.random() * 0.04, osy: 0.0002 + Math.random() * 0.0003, opy: Math.random() * Math.PI * 2,
        r: 1.8 + Math.random() * 3.2,
        ba: 0.5 + Math.random() * 0.9, bs: 0.007 + Math.random() * 0.013, bp: Math.random() * Math.PI * 2,
        col: NODE_C[Math.floor(Math.random() * NODE_C.length)], op: 0.45 + Math.random() * 0.40,
      }));
    };

    const resize = () => {
      const dpr  = window.devicePixelRatio || 1;
      const rect = (canvas.parentElement ?? canvas).getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gw = Math.ceil(w / CELL) + 1; gh = Math.ceil(h / CELL) + 1;
      cw = w / (gw - 1); ch = h / (gh - 1);
      baseGrid = new Float32Array(gw * gh);
      drawGrid = new Float32Array(gw * gh);
      fillC.width = gw; fillC.height = gh;
      fillImg = fillX.createImageData(gw, gh);
    };

    const computeBase = () => {
      for (let r = 0; r < gh; r++) {
        const ny = r / (gh - 1);
        for (let c = 0; c < gw; c++) {
          const nx = c / (gw - 1);
          let v = 0;
          for (const p of peaks) {
            const px = p.bx + p.dax * Math.sin(t * p.dsx + p.dpx);
            const py = p.by + p.day * Math.sin(t * p.dsy + p.dpy);
            const dx = nx - px, dy = ny - py;
            v += p.amp * Math.exp(-(dx * dx + dy * dy) / p.s2);
          }
          baseGrid[r * gw + c] = v;
        }
      }
    };
    const buildFill = () => {
      for (let i = 0; i < gw * gh; i++) {
        const v  = Math.min(1, baseGrid[i] / 0.85);
        const ci = Math.min(FILL_RGB.length - 1, Math.floor(v * FILL_RGB.length));
        const [rv, gv, bv] = FILL_RGB[ci];
        fillImg.data[i * 4] = rv; fillImg.data[i * 4 + 1] = gv;
        fillImg.data[i * 4 + 2] = bv; fillImg.data[i * 4 + 3] = 18;
      }
      fillX.putImageData(fillImg, 0, 0);
    };
    const buildDraw = () => {
      drawGrid.set(baseGrid);
      if (cursor.x > 0 && cursor.y > 0) {
        const r2 = CUR_R * CUR_R * 0.5;
        for (let r = 0; r < gh; r++) {
          const py = (r / (gh - 1)) * h;
          const dy = py - cursor.y, dy2 = dy * dy;
          for (let c = 0; c < gw; c++) {
            const d2 = ((c / (gw - 1)) * w - cursor.x) ** 2 + dy2;
            if (d2 < CUR_R * CUR_R * 4)
              drawGrid[r * gw + c] += CUR_D * Math.exp(-d2 / r2);
          }
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#fdf8f5'; ctx.fillRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = false; ctx.globalAlpha = 1;
      ctx.drawImage(fillC, 0, 0, w, h);
      ctx.lineCap = 'round';
      for (let i = 0; i < LEVEL_N; i++) {
        const isIdx = i % 5 === 0;
        ctx.globalAlpha = isIdx ? 0.22 : 0.08;
        ctx.lineWidth   = isIdx ? 0.9  : 0.4;
        ctx.strokeStyle = LINE_C[i % LINE_C.length];
        march(drawGrid, thresholds[i], gw, gh, cw, ch, ctx);
      }
      const np: [number, number][] = nodes.map(n => [
        (n.bx + n.oax * Math.sin(t * n.osx + n.opx)) * w,
        (n.by + n.oay * Math.cos(t * n.osy + n.opy)) * h,
      ]);
      ctx.strokeStyle = '#d4845a'; ctx.lineWidth = 0.8;
      for (let i = 0; i < NODE_N; i++) {
        for (let j = i + 1; j < NODE_N; j++) {
          const dx = np[i][0] - np[j][0], dy = np[i][1] - np[j][1];
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < CONN) {
            ctx.globalAlpha = (1 - d / CONN) * 0.30;
            ctx.beginPath(); ctx.moveTo(np[i][0], np[i][1]); ctx.lineTo(np[j][0], np[j][1]); ctx.stroke();
          }
        }
      }
      for (let i = 0; i < NODE_N; i++) {
        const n = nodes[i];
        const r = Math.max(0.5, n.r + n.ba * Math.sin(t * n.bs + n.bp));
        ctx.globalAlpha = n.op; ctx.fillStyle = n.col;
        ctx.beginPath(); ctx.arc(np[i][0], np[i][1], r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 0.12; ctx.fillStyle = grainPtn; ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      t++;
      if (t % FILL_EVERY === 0) { computeBase(); buildFill(); }
      buildDraw(); render();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursor.x = e.clientX - rect.left; cursor.y = e.clientY - rect.top;
    };
    const onLeave = () => { cursor.x = -9999; cursor.y = -9999; };
    const onTouch = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      cursor.x = touch.clientX - rect.left; cursor.y = touch.clientY - rect.top;
    };
    const onTouchEnd = () => { cursor.x = -9999; cursor.y = -9999; };

    initPeaks(); initNodes(); resize(); computeBase(); buildFill(); buildDraw();
    window.addEventListener('resize', resize);
    parent.addEventListener('mousemove', onMove);
    parent.addEventListener('mouseleave', onLeave);
    parent.addEventListener('touchmove', onTouch, { passive: true });
    parent.addEventListener('touchend', onTouchEnd);

    if (reduced) { render(); } else { raf = requestAnimationFrame(tick); }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      parent.removeEventListener('mousemove', onMove);
      parent.removeEventListener('mouseleave', onLeave);
      parent.removeEventListener('touchmove', onTouch);
      parent.removeEventListener('touchend', onTouchEnd);
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
