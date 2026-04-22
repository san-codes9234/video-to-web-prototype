/**
 * CursorAura.tsx
 *
 * A high-performance cursor-reactive aura that changes color based on
 * scroll progress to match the Goku transformation theme:
 *   0%  → Yellow  (Base / Super Saiyan)
 *   50% → Blue    (Super Saiyan Blue)
 *   90% → White   (Ultra Instinct)
 *
 * Uses:
 *  - useMotionValue + useSpring  → ultra-smooth cursor tracking (zero jitter)
 *  - useScroll + useTransform    → scroll-linked color
 *  - pointer-events: none        → never blocks UI
 *  - z-index: 40                 → above canvas (z-10) and story text (z-20)
 */

'use client'; // safe to include even in Vite/React projects

import { useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
} from 'framer-motion';

// ─── Color stops keyed to scroll progress ────────────────────────────────────
// progress: 0.00 → amber/yellow  (Base + SSJ)
// progress: 0.50 → sky blue      (SSB)
// progress: 0.90 → near-white    (UI)

const AURA_COLORS = {
  // inner glow (bright core)
  inner: [
    [0.00, 'rgba(251, 191,  36, 0.55)'],   // amber-400
    [0.25, 'rgba(253, 224,  71, 0.55)'],   // yellow-300
    [0.50, 'rgba( 56, 189, 248, 0.55)'],   // sky-400
    [0.90, 'rgba(224, 231, 255, 0.60)'],   // indigo-100 (UI white)
    [1.00, 'rgba(255, 255, 255, 0.65)'],   // pure white
  ] as [number, string][],

  // outer halo (diffused bloom)
  outer: [
    [0.00, 'rgba(245, 158,  11, 0.18)'],
    [0.25, 'rgba(250, 204,  21, 0.18)'],
    [0.50, 'rgba( 14, 165, 233, 0.18)'],
    [0.90, 'rgba(199, 210, 254, 0.20)'],
    [1.00, 'rgba(255, 255, 255, 0.22)'],
  ] as [number, string][],
};

/** Linear interpolate between two RGBA strings at a given ratio [0,1]. */
function lerpColor(a: string, b: string, t: number): string {
  const parse = (s: string) =>
    s.match(/[\d.]+/g)!.map(Number) as [number, number, number, number];
  const [ar, ag, ab, aa] = parse(a);
  const [br, bg, bb, ba] = parse(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const b_ = Math.round(ab + (bb - ab) * t);
  const al = +(aa + (ba - aa) * t).toFixed(3);
  return `rgba(${r}, ${g}, ${b_}, ${al})`;
}

/** Sample the color table at a given scroll progress value. */
function sampleColorTable(
  table: [number, string][],
  progress: number,
): string {
  if (progress <= table[0][0]) return table[0][1];
  if (progress >= table[table.length - 1][0]) return table[table.length - 1][1];
  for (let i = 0; i < table.length - 1; i++) {
    const [p0, c0] = table[i];
    const [p1, c1] = table[i + 1];
    if (progress >= p0 && progress <= p1) {
      const t = (progress - p0) / (p1 - p0);
      return lerpColor(c0, c1, t);
    }
  }
  return table[table.length - 1][1];
}

// ─── Spring config — fast enough to feel live, slow enough to look silky ─────
const SPRING_CONFIG = { stiffness: 260, damping: 28, mass: 0.6 };

// ─── Aura sizes ───────────────────────────────────────────────────────────────
const OUTER_SIZE = 340; // px  — large diffused bloom
const INNER_SIZE = 110; // px  — bright core

// ─── Component ────────────────────────────────────────────────────────────────
export default function CursorAura() {
  // Raw mouse position
  const rawX = useMotionValue(-1000);
  const rawY = useMotionValue(-1000);

  // Spring-smoothed position (cursor-centered via CSS translate trick)
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  // Track scroll progress for color adaptation
  const { scrollYProgress } = useScroll();

  // Refs to the DOM elements so we can imperatively update styles
  // without triggering React re-renders on every mouse move
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // ── Mouse tracking ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    // Hide aura when mouse leaves viewport
    const onLeave = () => {
      rawX.set(-1000);
      rawY.set(-1000);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [rawX, rawY]);

  // ── Scroll-reactive color — throttled via rAF ──────────────────────────────
  useEffect(() => {
    let rafId: number;

    const update = () => {
      const progress = scrollYProgress.get();
      const innerColor = sampleColorTable(AURA_COLORS.inner, progress);
      const outerColor = sampleColorTable(AURA_COLORS.outer, progress);

      if (outerRef.current) {
        outerRef.current.style.background =
          `radial-gradient(circle, ${outerColor} 0%, transparent 70%)`;
      }
      if (innerRef.current) {
        innerRef.current.style.background =
          `radial-gradient(circle, ${innerColor} 0%, transparent 65%)`;
        innerRef.current.style.boxShadow =
          `0 0 32px 8px ${innerColor}`;
      }

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [scrollYProgress]);

  return (
    <>
      {/* ── Outer bloom ───────────────────────────────────────────────────── */}
      <motion.div
        ref={outerRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: OUTER_SIZE,
          height: OUTER_SIZE,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 40,
          // Center on cursor
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          // Base fill — overridden imperatively in rAF loop above
          background: 'radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)',
          // GPU compositing hint
          willChange: 'transform',
          filter: 'blur(18px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* ── Inner bright core ─────────────────────────────────────────────── */}
      <motion.div
        ref={innerRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: INNER_SIZE,
          height: INNER_SIZE,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 41,
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(251,191,36,0.55) 0%, transparent 65%)',
          willChange: 'transform',
          filter: 'blur(6px)',
          mixBlendMode: 'screen',
        }}
      />
    </>
  );
}
