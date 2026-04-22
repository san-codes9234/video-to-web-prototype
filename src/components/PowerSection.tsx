import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const FORMS = [
  {
    id: 'base',
    name: 'Base Form',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.06)',
    borderColor: 'rgba(245,158,11,0.15)',
    powerLevel: '~3,000,000',
    multiplier: '×1',
    description: 'The foundation of all Saiyan power. Deceptively immense strength, honed through relentless training.',
    traits: ['Endurance', 'Speed', 'Control'],
  },
  {
    id: 'ssj',
    name: 'Super Saiyan',
    color: '#fbbf24',
    bgColor: 'rgba(251,191,36,0.06)',
    borderColor: 'rgba(251,191,36,0.18)',
    powerLevel: '~150,000,000',
    multiplier: '×50',
    description: 'The legendary golden transformation. Golden hair, teal eyes — a power that reshaped the cosmos.',
    traits: ['Rage Amplification', 'Ki Surge', 'Lightning Reflexes'],
  },
  {
    id: 'ssb',
    name: 'Super Saiyan Blue',
    color: '#38bdf8',
    bgColor: 'rgba(56,189,248,0.06)',
    borderColor: 'rgba(56,189,248,0.18)',
    powerLevel: '~7,500,000,000',
    multiplier: '×50,000',
    description: 'God ki merged with Super Saiyan mastery. The divine form — calm, controlled, and catastrophically powerful.',
    traits: ['Divine Ki', 'Perfect Control', 'God-tier Speed'],
  },
  {
    id: 'ui',
    name: 'Ultra Instinct',
    color: '#e0e7ff',
    bgColor: 'rgba(224,231,255,0.05)',
    borderColor: 'rgba(224,231,255,0.2)',
    powerLevel: '∞ (Immeasurable)',
    multiplier: '×∞',
    description: 'The pinnacle of all martial arts. The body acts independently of thought — perfect offense and defense simultaneously.',
    traits: ['Auto-Dodge', 'Autonomous Combat', 'Angelic Speed'],
  },
];

const STATS = [
  { label: 'Total Forms', value: '4', unit: 'Shown' },
  { label: 'Frames', value: '240', unit: 'Animated' },
  { label: 'Scroll Length', value: '400', unit: 'vh' },
  { label: 'Peak Power', value: '∞', unit: 'Level' },
];

export default function PowerSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });

  return (
    <section
      ref={ref}
      className="relative py-36 px-6 overflow-hidden"
      style={{ background: '#050505' }}
    >
      {/* Radial grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 40% at 50% 0%, rgba(245,158,11,0.05) 0%, transparent 60%),
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: 'auto, 60px 60px, 60px 60px',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4 font-light"
            style={{ color: 'rgba(245,158,11,0.7)' }}
          >
            The Legendary Journey
          </p>
          <h2
            className="font-black tracking-tighter mb-5"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', color: 'rgba(255,255,255,0.95)' }}
          >
            The Forms of Goku
          </h2>
          <p
            className="font-light max-w-lg mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}
          >
            Each transformation represents a threshold that most warriors cannot cross — a convergence of willpower, ki, and destiny.
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center text-center p-5 rounded-2xl"
              style={{
                background: 'rgba(245,158,11,0.04)',
                border: '1px solid rgba(245,158,11,0.1)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
            >
              <span
                className="font-black tabular-nums leading-none mb-1"
                style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'rgba(245,158,11,0.9)' }}
              >
                {stat.value}
              </span>
              <span className="text-xs font-medium mb-1" style={{ color: 'rgba(245,158,11,0.5)' }}>
                {stat.unit}
              </span>
              <span className="text-xs font-light" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Form cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FORMS.map((form, i) => (
            <motion.div
              key={form.id}
              className="relative p-7 rounded-2xl group overflow-hidden cursor-default"
              style={{
                background: form.bgColor,
                border: `1px solid ${form.borderColor}`,
              }}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.1 }}
              whileHover={{
                borderColor: `${form.color}40`,
                background: form.bgColor.replace('0.06', '0.1').replace('0.05', '0.08'),
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{
                  background: `radial-gradient(ellipse 60% 60% at 50% 100%, ${form.color}08, transparent)`,
                }}
              />

              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p
                    className="text-[10px] tracking-[0.3em] uppercase font-medium mb-1"
                    style={{ color: `${form.color}80` }}
                  >
                    Form {i + 1}
                  </p>
                  <h3
                    className="font-black text-xl tracking-tight"
                    style={{ color: form.color }}
                  >
                    {form.name}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-xs font-light mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Multiplier
                  </p>
                  <p
                    className="font-black text-lg tabular-nums"
                    style={{ color: form.color }}
                  >
                    {form.multiplier}
                  </p>
                </div>
              </div>

              {/* Power level bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] tracking-widest uppercase font-light" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Power Level
                  </span>
                  <span className="text-xs font-mono" style={{ color: form.color }}>
                    {form.powerLevel}
                  </span>
                </div>
                <div className="h-px w-full bg-white/5 overflow-hidden rounded-full">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${form.color}40, ${form.color})` }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${25 * (i + 1)}%` } : { width: 0 }}
                    transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Description */}
              <p
                className="text-sm font-light leading-relaxed mb-5"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                {form.description}
              </p>

              {/* Trait tags */}
              <div className="flex flex-wrap gap-2">
                {form.traits.map((trait) => (
                  <span
                    key={trait}
                    className="text-[10px] tracking-widest uppercase font-medium px-3 py-1 rounded-full"
                    style={{
                      background: `${form.color}10`,
                      border: `1px solid ${form.color}25`,
                      color: `${form.color}90`,
                    }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
