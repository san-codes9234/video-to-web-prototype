import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });

  const links = [
    { heading: 'Universe', links: ['Dragon Ball Z', 'Dragon Ball Super', 'GT', 'Heroes'] },
    { heading: 'Characters', links: ['Goku', 'Vegeta', 'Gohan', 'Piccolo'] },
    { heading: 'Transformations', links: ['Super Saiyan', 'SSB', 'Ultra Instinct', 'MUI'] },
  ];

  return (
    <footer
      ref={ref}
      className="relative py-20 px-8 overflow-hidden"
      style={{ background: '#050505', borderTop: '1px solid rgba(245,158,11,0.08)' }}
    >
      {/* Subtle bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.05), transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.25)" strokeWidth="1" />
                <circle cx="16" cy="16" r="9" fill="url(#footerBallGrad)" />
                <circle cx="14" cy="14" r="2.5" fill="rgba(220,38,38,0.9)" />
                <defs>
                  <radialGradient id="footerBallGrad" cx="35%" cy="30%" r="70%">
                    <stop stopColor="#fbbf24" />
                    <stop offset="1" stopColor="#b45309" />
                  </radialGradient>
                </defs>
              </svg>
              <div>
                <span className="text-white/90 font-bold tracking-tight text-sm leading-none block">Dragon Ball Z</span>
                <span style={{ color: 'rgba(245,158,11,0.5)' }} className="text-[10px] tracking-[0.2em] uppercase font-light">
                  Power Awakened
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.25)' }}>
              A tribute to the greatest warrior in all the universes. His power knows no limit.
            </p>
          </motion.div>

          {/* Links */}
          {links.map((col, i) => (
            <motion.div
              key={col.heading}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
            >
              <h4
                className="text-[10px] tracking-widest uppercase font-medium mb-5"
                style={{ color: 'rgba(245,158,11,0.5)' }}
              >
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200"
                      style={{ color: 'rgba(255,255,255,0.25)' }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'rgba(245,158,11,0.8)')}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.25)')}
                      onClick={(e) => e.preventDefault()}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <p className="text-xs mb-4 md:mb-0" style={{ color: 'rgba(255,255,255,0.18)' }}>
            © 2025 Dragon Ball Z · Fan Tribute. All Dragon Ball content belongs to Toei Animation.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Fan Art'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs transition-colors duration-200"
                style={{ color: 'rgba(255,255,255,0.18)' }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'rgba(245,158,11,0.6)')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.18)')}
                onClick={(e) => e.preventDefault()}
              >
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
