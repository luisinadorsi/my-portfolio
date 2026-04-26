'use client';

import {
  useEffect, useRef,
  Children, isValidElement,
  type ReactNode, type ReactElement,
  type CSSProperties,
} from 'react';
import Matter from 'matter-js';

/* ─── MatterBody ──────────────────────────────────────────────────
   Marker component only — Gravity reads its props and renders
   the real DOM nodes itself. MatterBody itself returns null.
──────────────────────────────────────────────────────────────── */
export type MatterBodyProps = {
  children: ReactNode;
  /** Initial X: px number or percent string e.g. '30%' */
  x?: number | string;
  /** Initial Y: negative = above container top (falls in on load) */
  y?: number | string;
  angle?: number;
  matterBodyOptions?: Matter.IBodyDefinition;
  className?: string;
  style?: CSSProperties;
};

export function MatterBody(_props: MatterBodyProps): null {
  return null;
}

/* ─── Gravity ─────────────────────────────────────────────────────
   Physics container: creates a headless Matter.js world and drives
   each child's position via requestAnimationFrame + DOM transforms.
──────────────────────────────────────────────────────────────── */
type GravityProps = {
  children: ReactNode;
  /** Matter.js gravity vector. Defaults to natural downward gravity. */
  gravity?: { x?: number; y?: number };
  className?: string;
};

export function Gravity({
  children,
  gravity = { x: 0, y: 1 },
  className = '',
}: GravityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs    = useRef<(HTMLDivElement | null)[]>([]);

  const childArray = Children.toArray(children).filter(
    (c): c is ReactElement<MatterBodyProps> => isValidElement(c),
  );
  nodeRefs.current.length = childArray.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Reduced-motion: skip physics, show pills inline ──────────
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodeRefs.current.forEach((el) => {
        if (!el) return;
        el.style.position = 'relative';
        el.style.opacity  = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const { width, height } = container.getBoundingClientRect();

    // ── Engine ───────────────────────────────────────────────────
    const engine = Matter.Engine.create({
      gravity: { x: gravity.x ?? 0, y: gravity.y ?? 1, scale: 0.001 },
    });

    // ── Walls (invisible static bodies) ─────────────────────────
    const wall = (x: number, y: number, w: number, h: number) =>
      Matter.Bodies.rectangle(x, y, w, h, {
        isStatic: true, friction: 0.4, restitution: 0.4,
        render: { visible: false },
      });

    Matter.Composite.add(engine.world, [
      wall(width / 2, height + 25, width + 100, 50),   // floor
      wall(-25,        height / 2, 50, height * 4),    // left wall
      wall(width + 25, height / 2, 50, height * 4),    // right wall
    ]);

    // ── Dynamic bodies — one per MatterBody child ────────────────
    const bodies: Matter.Body[] = [];

    childArray.forEach((child, i) => {
      const el = nodeRefs.current[i];
      if (!el) return;

      const w = el.offsetWidth  || 80;
      const h = el.offsetHeight || 36;
      const p = child.props;

      // Default: stagger above container so pills cascade down
      const ix = resolveValue(p.x ?? `${8 + i * 14}%`, width);
      const iy = resolveValue(p.y ?? -(h + i * (h + 12) + 20), height);

      // Build options as a plain record to avoid @types/matter-js
      // chamfer type conflict (IChamfer | null vs IChamfer | undefined)
      const bodyOpts: Record<string, unknown> = {
        restitution: 0.3,
        friction:    0.15,
        frictionAir: 0.018,
        density:     0.002,
        chamfer:     { radius: h / 2 }, // pill-shaped physics body
        angle:       p.angle ?? 0,
        ...(p.matterBodyOptions ?? {}),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = Matter.Bodies.rectangle(ix, iy, w, h, bodyOpts as any);

      bodies.push(body);
    });

    Matter.Composite.add(engine.world, bodies);

    // ── Mouse / touch drag constraint ────────────────────────────
    const mouse = Matter.Mouse.create(container);
    mouse.pixelRatio = window.devicePixelRatio || 1;

    const mc = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, damping: 0.1, render: { visible: false } },
    });
    Matter.Composite.add(engine.world, mc);

    // Matter.js attaches a mousewheel listener that calls preventDefault() on
    // every scroll event — this hijacks page scrolling even when no pill is
    // being dragged. Remove it so the wheel event reaches the page normally.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mouse as any).element.removeEventListener('mousewheel',     (mouse as any).mousewheel);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mouse as any).element.removeEventListener('DOMMouseScroll', (mouse as any).mousewheel);

    // Block touch scroll ONLY while a pill is actively being dragged;
    // otherwise let the touchmove reach the native scroll handler.
    const stopScroll = (e: Event) => {
      if (mc.body) e.preventDefault();
    };
    container.addEventListener('touchmove', stopScroll, { passive: false });

    // ── RAF loop: step engine → sync DOM positions ───────────────
    let rafId: number;
    let prev = performance.now();

    const loop = (now: number) => {
      const delta = Math.min(now - prev, 50); // cap at 50ms (20 fps min)
      prev = now;

      Matter.Engine.update(engine, delta);

      bodies.forEach((body, i) => {
        const el = nodeRefs.current[i];
        if (!el) return;

        const { x, y } = body.position;
        const hw = el.offsetWidth  / 2;
        const hh = el.offsetHeight / 2;

        el.style.transform = [
          `translate(${(x - hw).toFixed(2)}px, ${(y - hh).toFixed(2)}px)`,
          `rotate(${body.angle.toFixed(4)}rad)`,
        ].join(' ');

        // Reveal pill once the physics position is live
        // (overflow:hidden keeps it invisible above y=0 anyway,
        //  but opacity-0 prevents a flash at (0,0) before first tick)
        if (el.style.opacity !== '1') el.style.opacity = '1';
      });

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    // ── Cleanup ──────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('touchmove', stopScroll);
      Matter.Engine.clear(engine);
      Matter.Composite.clear(engine.world, false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      {childArray.map((child, i) => (
        <div
          key={i}
          ref={(node) => { nodeRefs.current[i] = node; }}
          className={`absolute top-0 left-0 select-none cursor-grab active:cursor-grabbing touch-none ${child.props.className ?? ''}`}
          style={{ opacity: 0, willChange: 'transform', ...child.props.style }}
          draggable={false}
        >
          {child.props.children}
        </div>
      ))}
    </div>
  );
}

/* ─── Helper ────────────────────────────────────────────────────── */
function resolveValue(v: number | string, containerSize: number): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.endsWith('%'))
    return (parseFloat(v) / 100) * containerSize;
  return parseFloat(v as string);
}
