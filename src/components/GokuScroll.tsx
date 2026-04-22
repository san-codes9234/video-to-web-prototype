import { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';

const TOTAL_FRAMES = 240;
const FRAME_BASE = '/frames/ezgif-frame-';

function padNum(n: number): string {
  return String(n).padStart(3, '0');
}

function getFrameUrl(index: number): string {
  return `${FRAME_BASE}${padNum(index + 1)}.jpg`;
}

// DBZ Story sections mapped to Goku's transformations
const STORY_SECTIONS = [
  {
    id: 'base',
    startProgress: 0,
    endProgress: 0.20,
    position: 'center' as const,
    label: 'Earth\'s Greatest Defender',
    title: 'Goku.',
    subtitle: 'Born of a warrior race, raised as a guardian of humanity. His legend begins here.',
    cta: null,
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.15)',
  },
  {
    id: 'ssj',
    startProgress: 0.25,
    endProgress: 0.45,
    position: 'left' as const,
    label: 'Super Saiyan',
    title: 'Awaken\nthe Legend.',
    subtitle: 'Fueled by rage and grief, the legendary golden transformation ignites — a power that shook the universe.',
    cta: null,
    accentColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.2)',
  },
  {
    id: 'ssb',
    startProgress: 0.52,
    endProgress: 0.72,
    position: 'right' as const,
    label: 'Super Saiyan Blue',
    title: 'The Realm\nof Gods.',
    subtitle: 'Perfect ki control merged with Super Saiyan mastery. Blue. Divine. Unstoppable.',
    cta: null,
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.2)',
  },
  {
    id: 'ui',
    startProgress: 0.80,
    endProgress: 1.0,
    position: 'center' as const,
    label: 'Ultra Instinct',
    title: 'Mastery of\nSelf-Movement.',
    subtitle: 'The pinnacle of martial arts. The power of the angels. Goku transcends all limits.',
    cta: 'Witness the Power',
    accentColor: '#e0e7ff',
    glowColor: 'rgba(224, 231, 255, 0.18)',
  },
];

// Returns active section + fractional progress within it
function getActiveSectionData(v: number) {
  for (const s of STORY_SECTIONS) {
    if (v >= s.startProgress && v <= s.endProgress) {
      return s;
    }
  }
  return null;
}

export default function GokuScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [loadProgress, setLoadProgress] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>('base');
  const [currentAccent, setCurrentAccent] = useState('#f59e0b');
  const [currentGlow, setCurrentGlow] = useState('rgba(245, 158, 11, 0.15)');

  const { scrollYProgress } = useScroll({ target: containerRef });

  // Preload all frames
  useEffect(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        loaded++;
        setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
        if (loaded === TOTAL_FRAMES) setAllLoaded(true);
      };
      img.onerror = () => {
        loaded++;
        setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
        if (loaded === TOTAL_FRAMES) setAllLoaded(true);
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  // Draw frame to canvas
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img || !img.complete || !img.naturalWidth) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = W / H;

    let drawW: number, drawH: number;
    if (imgAspect > canvasAspect) {
      drawW = W;
      drawH = W / imgAspect;
    } else {
      drawH = H;
      drawW = H * imgAspect;
    }
    const drawX = (W - drawW) / 2;
    const drawY = (H - drawH) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, drawX * dpr, drawY * dpr, drawW * dpr, drawH * dpr);
  }, []);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      drawFrame(currentFrameRef.current);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [drawFrame]);

  // Subscribe to scroll progress → update canvas + active section
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      const frameIndex = Math.min(
        Math.floor(v * (TOTAL_FRAMES - 1)),
        TOTAL_FRAMES - 1
      );

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
      }

      const section = getActiveSectionData(v);
      setActiveSection(section?.id ?? null);
      if (section) {
        setCurrentAccent(section.accentColor);
        setCurrentGlow(section.glowColor);
      }
    });

    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollYProgress, drawFrame]);

  // Draw frame 0 once loaded
  useEffect(() => {
    if (allLoaded) drawFrame(0);
  }, [allLoaded, drawFrame]);

  return (
    <div ref={containerRef} className="relative" style={{ height: '400vh' }}>
      {/* Sticky canvas wrapper */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0" style={{ background: '#050505' }} />

        {/* Dynamic aura glow — follows active transformation */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[5]"
          animate={{ background: currentGlow ? `radial-gradient(ellipse 60% 80% at 50% 100%, ${currentGlow}, transparent 70%)` : 'none' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10"
          style={{
            opacity: allLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Power aura particles (decorative SVG rings that animate per form) */}
        <AnimatePresence>
          {allLoaded && activeSection && (
            <motion.div
              key={activeSection + '-aura'}
              className="absolute inset-0 z-[8] pointer-events-none flex items-end justify-center pb-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <AuraRings accent={currentAccent} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading overlay */}
        <AnimatePresence>
          {!allLoaded && (
            <motion.div
              className="absolute inset-0 z-50 flex flex-col items-center justify-center"
              style={{ background: '#050505' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full border border-amber-500/10 absolute inset-0" />
                {/* Spinning dragon ball aura ring */}
                <svg className="w-24 h-24 animate-spin" viewBox="0 0 96 96" fill="none">
                  <circle cx="48" cy="48" r="43" stroke="url(#dbgrad)" strokeWidth="2" strokeLinecap="round" strokeDasharray="68 200" />
                  <defs>
                    <linearGradient id="dbgrad" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#f59e0b" />
                      <stop offset="0.5" stopColor="#fbbf24" />
                      <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Inner counter-spinning ring */}
                <svg className="w-14 h-14 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} viewBox="0 0 56 56" fill="none">
                  <circle cx="28" cy="28" r="24" stroke="url(#dbgrad2)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="28 120" />
                  <defs>
                    <linearGradient id="dbgrad2" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#fbbf24" />
                      <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Percentage */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-amber-400/70 text-sm font-mono tabular-nums font-light">{loadProgress}%</span>
                </div>
              </div>

              {/* Dragon Ball star */}
              <div className="mb-5">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="12" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
                  <circle cx="14" cy="14" r="5" fill="rgba(245,158,11,0.6)" />
                  <circle cx="11" cy="11" r="1.5" fill="rgba(245,158,11,0.9)" />
                </svg>
              </div>

              <p className="text-amber-400/50 text-xs tracking-[0.4em] uppercase font-light mb-4">
                Power Level Rising
              </p>
              <div className="w-56 h-px bg-white/5 overflow-hidden rounded-full">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                    width: `${loadProgress}%`,
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Story text overlays */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center">
          <AnimatePresence mode="wait">
            {STORY_SECTIONS.map((section) =>
              activeSection === section.id ? (
                <StorySection key={section.id} section={section} />
              ) : null
            )}
          </AnimatePresence>
        </div>

        {/* Scroll hint */}
        <ScrollHint visible={allLoaded} scrollProgress={scrollYProgress} />

        {/* Form indicator (top right) */}
        <FormIndicator activeSection={activeSection} allLoaded={allLoaded} />
      </div>
    </div>
  );
}

// ─── Aura Rings ─────────────────────────────────────────────────────────────────
function AuraRings({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-64 flex items-end justify-center overflow-hidden">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            width: `${200 + i * 120}px`,
            height: `${40 + i * 20}px`,
            border: `1px solid ${accent}`,
            opacity: 0.06 / i,
            transform: `scaleX(${1 + i * 0.2})`,
          }}
          animate={{
            scaleY: [1, 1.3, 1],
            opacity: [0.06 / i, 0.1 / i, 0.06 / i],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}

// ─── Form Indicator ────────────────────────────────────────────────────────────
const FORMS = [
  { id: 'base', label: 'Base', color: '#f59e0b' },
  { id: 'ssj', label: 'SSJ', color: '#fbbf24' },
  { id: 'ssb', label: 'SSB', color: '#38bdf8' },
  { id: 'ui', label: 'UI', color: '#e0e7ff' },
];

function FormIndicator({ activeSection, allLoaded }: { activeSection: string | null; allLoaded: boolean }) {
  if (!allLoaded) return null;
  return (
    <motion.div
      className="absolute top-1/2 right-6 md:right-10 -translate-y-1/2 z-30 flex flex-col gap-3 items-end"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
    >
      {FORMS.map((form) => {
        const isActive = activeSection === form.id;
        return (
          <div key={form.id} className="flex items-center gap-2">
            {isActive && (
              <motion.span
                className="text-[10px] tracking-[0.2em] uppercase font-light"
                style={{ color: form.color }}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                layoutId="form-label"
              >
                {form.label}
              </motion.span>
            )}
            <motion.div
              className="rounded-full"
              style={{
                width: isActive ? '8px' : '4px',
                height: isActive ? '8px' : '4px',
                background: isActive ? form.color : 'rgba(255,255,255,0.2)',
                boxShadow: isActive ? `0 0 8px 2px ${form.color}` : 'none',
              }}
              animate={{
                width: isActive ? '8px' : '4px',
                height: isActive ? '8px' : '4px',
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        );
      })}
    </motion.div>
  );
}

// ─── Story Section ────────────────────────────────────────────────────────────

interface Section {
  id: string;
  position: 'left' | 'right' | 'center';
  label: string;
  title: string;
  subtitle: string;
  cta: string | null;
  accentColor: string;
  glowColor: string;
}

function StorySection({ section }: { section: Section }) {
  const isCenter = section.position === 'center';
  const isLeft = section.position === 'left';

  const containerClass = isCenter
    ? 'w-full flex flex-col items-center text-center px-6'
    : isLeft
    ? 'w-full flex flex-col items-start text-left px-8 md:px-16 lg:pl-24 max-w-xl'
    : 'w-full flex flex-col items-end text-right px-8 md:px-16 lg:pr-24 max-w-xl ml-auto';

  return (
    <motion.div
      className="absolute inset-0 flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className={containerClass} style={{ pointerEvents: section.cta ? 'auto' : 'none' }}>

        {/* Power label with animated underline */}
        <motion.div
          className="flex items-center gap-2 mb-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <motion.div
            className="h-px w-8"
            style={{ background: section.accentColor }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
          <p
            className="text-xs tracking-[0.35em] uppercase font-medium"
            style={{ color: section.accentColor }}
          >
            {section.label}
          </p>
          <motion.div
            className="h-px w-8"
            style={{ background: section.accentColor }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
        </motion.div>

        {/* Title */}
        <motion.h2
          className="font-black tracking-tighter leading-none mb-5"
          style={{
            fontSize: 'clamp(3rem, 7vw, 7rem)',
            color: 'rgba(255,255,255,0.95)',
            whiteSpace: 'pre-line',
            textShadow: `0 0 60px ${section.accentColor}40, 0 0 120px ${section.accentColor}20`,
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {section.title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="font-light leading-relaxed max-w-sm"
          style={{
            fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
            color: 'rgba(255,255,255,0.5)',
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          {section.subtitle}
        </motion.p>

        {/* CTA Button */}
        {section.cta && (
          <motion.button
            id="witness-power-btn"
            className="mt-8 px-9 py-4 rounded-full text-sm font-semibold tracking-widest uppercase transition-all"
            style={{
              background: `linear-gradient(135deg, ${section.accentColor}20 0%, ${section.accentColor}10 100%)`,
              border: `1px solid ${section.accentColor}50`,
              color: section.accentColor,
              pointerEvents: 'auto',
              backdropFilter: 'blur(12px)',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 0 30px ${section.accentColor}30`,
            }}
            whileTap={{ scale: 0.97 }}
          >
            {section.cta}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Scroll Hint ───────────────────────────────────────────────────────────────
function ScrollHint({ visible, scrollProgress }: { visible: boolean; scrollProgress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const opacity = useTransform(scrollProgress, [0, 0.06], [1, 0]);
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      style={{ opacity: visible ? opacity : 0 }}
    >
      <span className="text-white/25 text-[10px] tracking-[0.35em] uppercase font-light">Scroll</span>
      <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
        <rect x="1" y="1" width="18" height="30" rx="9" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <motion.rect
          x="8.5" y="6" width="3" height="6" rx="1.5"
          fill="rgba(245,158,11,0.5)"
          animate={{ y: [6, 14, 6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </motion.div>
  );
}
