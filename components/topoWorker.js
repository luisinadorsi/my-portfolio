// Runs entirely off main thread — receives an OffscreenCanvas via postMessage.

// ── Config (let — overridden at init for mobile) ──────────────────────────────
let CELL     = 5;   // 3→5 = ~2.7x fewer marching-squares cells
let PEAK_N   = 8;
let LEVEL_N  = 55;
let NODE_N   = 38;
const CUR_R    = 120;
const CUR_D    = -0.55;
const CONN     = 110;
const K_NEAR   = 5;   // nearest neighbours per node
const FILL_MS  = 90;  // ms between fill-layer redraws
const NBR_EVERY = 30; // frames between neighbour recomputes
let fillDisabled = false;

// ── Palettes ──────────────────────────────────────────────────────────────────
const FILL_RGB = [
  [0x2d, 0x5a, 0x3d],
  [0x8a, 0xb5, 0xa0],
  [0x5a, 0x6e, 0x60],
  [0xb5, 0xa0, 0x90],
  [0xc4, 0x60, 0x3a],
];
const LINE_C = ['#d4845a', '#8ab5a0', '#b5a090', '#5a6e60', '#2d5a3d'];
const NODE_C = ['#2d5a3d', '#8ab5a0', '#5a6e60', '#b5a090', '#c4603a', '#d4845a'];

let thresholds = [];

function buildThresholds() {
  thresholds = Array.from({ length: LEVEL_N }, (_, i) =>
    0.04 + (i / (LEVEL_N - 1)) * 0.90,
  );
}

// ── State ────────────────────────────────────────────────────────────────────
let canvas, ctx;
let w = 0, h = 0, gw = 0, gh = 0, cw = 0, ch = 0;
let t = 0, rafId = 0;
let baseGrid, drawGrid;
let fillC, fillX, fillImg;
let grainPtn = null;
let peaks = [], nodes = [];
let nbPairs = []; // [[i, j], …] — K nearest within CONN
let lastNbrT = -100;
let lastFillMs = 0;
const cursor = { x: -9999, y: -9999 };

// ── rAF abstraction (workers may not have it) ─────────────────────────────────
function scheduleFrame(cb) {
  return typeof self.requestAnimationFrame === 'function'
    ? self.requestAnimationFrame(cb)
    : setTimeout(() => cb(performance.now()), 1000 / 60);
}
function cancelFrame(id) {
  typeof self.cancelAnimationFrame === 'function'
    ? self.cancelAnimationFrame(id)
    : clearTimeout(id);
}

// ── Marching squares ──────────────────────────────────────────────────────────
function lp(v1, v2, thr) {
  const d = v2 - v1;
  return Math.abs(d) < 1e-9 ? 0.5 : Math.min(1, Math.max(0, (thr - v1) / d));
}

function march(g, thr) {
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
      const T = [x + lp(tl, tr, thr) * cw, y];
      const R = [x + cw, y + lp(tr, br, thr) * ch];
      const B = [x + lp(bl, br, thr) * cw, y + ch];
      const L = [x, y + lp(tl, bl, thr) * ch];
      const s = (a, b) => { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); };
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

// ── Peaks & nodes ─────────────────────────────────────────────────────────────
function initPeaks() {
  peaks = Array.from({ length: PEAK_N }, () => ({
    bx: 0.08 + Math.random() * 0.84, by: 0.08 + Math.random() * 0.84,
    amp: 0.45 + Math.random() * 0.45,
    s2:  2 * (0.10 + Math.random() * 0.10) ** 2,
    dax: 0.012 + Math.random() * 0.025, dsx: 0.0002 + Math.random() * 0.0004, dpx: Math.random() * Math.PI * 2,
    day: 0.012 + Math.random() * 0.025, dsy: 0.0002 + Math.random() * 0.0004, dpy: Math.random() * Math.PI * 2,
  }));
}

function initNodes() {
  nodes = Array.from({ length: NODE_N }, () => ({
    bx: 0.05 + Math.random() * 0.90, by: 0.05 + Math.random() * 0.90,
    oax: 0.03 + Math.random() * 0.05, osx: 0.0002 + Math.random() * 0.0003, opx: Math.random() * Math.PI * 2,
    oay: 0.02 + Math.random() * 0.04, osy: 0.0002 + Math.random() * 0.0003, opy: Math.random() * Math.PI * 2,
    r:  1.8 + Math.random() * 3.2,
    ba: 0.5 + Math.random() * 0.9, bs: 0.007 + Math.random() * 0.013, bp: Math.random() * Math.PI * 2,
    col: NODE_C[Math.floor(Math.random() * NODE_C.length)],
    op:  0.45 + Math.random() * 0.40,
  }));
}

// ── Height field ──────────────────────────────────────────────────────────────
function computeBase() {
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
}

function buildFill() {
  for (let i = 0; i < gw * gh; i++) {
    const v  = Math.min(1, baseGrid[i] / 0.85);
    const ci = Math.min(FILL_RGB.length - 1, Math.floor(v * FILL_RGB.length));
    const [rv, gv, bv] = FILL_RGB[ci];
    fillImg.data[i * 4]     = rv;
    fillImg.data[i * 4 + 1] = gv;
    fillImg.data[i * 4 + 2] = bv;
    fillImg.data[i * 4 + 3] = 18;
  }
  fillX.putImageData(fillImg, 0, 0);
}

function buildDraw() {
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
}

// ── K-nearest neighbours ──────────────────────────────────────────────────────
function computeNeighbors(np) {
  const seen = new Set();
  nbPairs = [];
  for (let i = 0; i < NODE_N; i++) {
    // squared distances (avoids sqrt during sort)
    const dists = [];
    for (let j = 0; j < NODE_N; j++) {
      if (j === i) continue;
      const dx = np[i][0] - np[j][0], dy = np[i][1] - np[j][1];
      const d2 = dx * dx + dy * dy;
      if (d2 < CONN * CONN) dists.push([j, d2]);
    }
    dists.sort((a, b) => a[1] - b[1]);
    for (let k = 0; k < Math.min(K_NEAR, dists.length); k++) {
      const j = dists[k][0];
      const key = i < j ? i * 1000 + j : j * 1000 + i; // unique per pair
      if (!seen.has(key)) { seen.add(key); nbPairs.push([i, j]); }
    }
  }
}

// ── Render ────────────────────────────────────────────────────────────────────
function render(np) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#fdf8f5';
  ctx.fillRect(0, 0, w, h);

  // Layer 1 — pixelated fill (skipped on mobile)
  if (!fillDisabled) {
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 1;
    ctx.drawImage(fillC, 0, 0, w, h);
  }

  // Layer 2 — contour lines
  ctx.lineCap = 'round';
  for (let i = 0; i < LEVEL_N; i++) {
    const isIdx = i % 5 === 0;
    ctx.globalAlpha = isIdx ? 0.22 : 0.08;
    ctx.lineWidth   = isIdx ? 0.9  : 0.4;
    ctx.strokeStyle = LINE_C[i % LINE_C.length];
    march(drawGrid, thresholds[i]);
  }

  // Layer 3a — connections (K nearest only)
  ctx.strokeStyle = '#d4845a';
  ctx.lineWidth   = 0.8;
  for (const [i, j] of nbPairs) {
    const dx = np[i][0] - np[j][0], dy = np[i][1] - np[j][1];
    const d  = Math.sqrt(dx * dx + dy * dy);
    if (d < CONN) {
      ctx.globalAlpha = (1 - d / CONN) * 0.30;
      ctx.beginPath();
      ctx.moveTo(np[i][0], np[i][1]);
      ctx.lineTo(np[j][0], np[j][1]);
      ctx.stroke();
    }
  }

  // Layer 3b — node dots
  for (let i = 0; i < NODE_N; i++) {
    const n = nodes[i];
    const r = Math.max(0.5, n.r + n.ba * Math.sin(t * n.bs + n.bp));
    ctx.globalAlpha = n.op;
    ctx.fillStyle   = n.col;
    ctx.beginPath();
    ctx.arc(np[i][0], np[i][1], r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Grain overlay
  if (grainPtn) {
    ctx.globalAlpha = 0.12;
    ctx.fillStyle   = grainPtn;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.globalAlpha = 1;
}

// ── Tick ──────────────────────────────────────────────────────────────────────
function tick() {
  t++;
  const now = performance.now();
  if (!fillDisabled && now - lastFillMs > FILL_MS) {
    computeBase();
    buildFill();
    lastFillMs = now;
  }
  buildDraw();

  const np = nodes.map(n => [
    (n.bx + n.oax * Math.sin(t * n.osx + n.opx)) * w,
    (n.by + n.oay * Math.cos(t * n.osy + n.opy)) * h,
  ]);

  if (t - lastNbrT >= NBR_EVERY) {
    computeNeighbors(np);
    lastNbrT = t;
  }

  render(np);
  rafId = scheduleFrame(tick);
}

// ── Resize ────────────────────────────────────────────────────────────────────
function handleResize(cssW, cssH, dpr) {
  w = cssW; h = cssH;
  canvas.width  = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  gw = Math.ceil(w / CELL) + 1;
  gh = Math.ceil(h / CELL) + 1;
  cw = w / (gw - 1);
  ch = h / (gh - 1);
  baseGrid = new Float32Array(gw * gh);
  drawGrid = new Float32Array(gw * gh);
  fillC = new OffscreenCanvas(gw, gh);
  fillX = fillC.getContext('2d');
  fillImg = fillX.createImageData(gw, gh);
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
function init(offscreen, cssW, cssH, dpr, mobile) {
  if (mobile) {
    CELL = 8;
    LEVEL_N = 30;
    NODE_N = 18;
    fillDisabled = true;
  }
  buildThresholds();

  canvas = offscreen;
  ctx    = canvas.getContext('2d');

  handleResize(cssW, cssH, dpr);

  const grainC = new OffscreenCanvas(256, 256);
  const gx = grainC.getContext('2d');
  const d  = gx.createImageData(256, 256);
  for (let i = 0; i < 256 * 256; i++) {
    d.data[i * 4] = d.data[i * 4 + 1] = d.data[i * 4 + 2] = 0;
    d.data[i * 4 + 3] = Math.round(Math.random()) * Math.floor(10 + Math.random() * 35);
  }
  gx.putImageData(d, 0, 0);
  grainPtn = ctx.createPattern(grainC, 'repeat');

  initPeaks();
  initNodes();
  computeBase();
  if (!fillDisabled) buildFill();
  buildDraw();
  lastFillMs = performance.now();
  rafId = scheduleFrame(tick);
}

// ── Message handler ───────────────────────────────────────────────────────────
self.onmessage = (e) => {
  const { type } = e.data;
  if (type === 'init') {
    init(e.data.canvas, e.data.width, e.data.height, e.data.dpr, e.data.mobile);
  } else if (type === 'mouse') {
    cursor.x = e.data.x;
    cursor.y = e.data.y;
  } else if (type === 'capture') {
    canvas.convertToBlob({ type: 'image/png' })
      .then(blob => { self.postMessage({ type: 'capture', blob }); })
      .catch(err => { console.error('[topoWorker] convertToBlob failed:', err); });
  } else if (type === 'resize') {
    cancelFrame(rafId);
    handleResize(e.data.width, e.data.height, e.data.dpr);
    computeBase();
    if (!fillDisabled) buildFill();
    buildDraw();
    rafId = scheduleFrame(tick);
  }
};
