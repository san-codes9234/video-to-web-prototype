import { motion, useScroll, useTransform } from 'framer-motion';
import { useState } from 'react';

export default function NavBar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  const links = ['Forms', 'Power Levels', 'Legacy', 'Universe'];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
    >
      {/* Frosted glass background on scroll */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: bgOpacity,
          background: 'rgba(5,5,5,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(245,158,11,0.08)',
        }}
      />

      {/* Logo */}
      <div className="relative flex items-center gap-3">
        {/* Dragon Ball icon */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            {/* Outer glow ring */}
            <circle cx="16" cy="16" r="14" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.25)" strokeWidth="1" />
            {/* Dragon ball sphere */}
            <circle cx="16" cy="16" r="9" fill="url(#ballGrad)" />
            {/* Star dot */}
            <circle cx="14" cy="14" r="2.5" fill="rgba(220,38,38,0.9)" />
            <defs>
              <radialGradient id="ballGrad" cx="35%" cy="30%" r="70%">
                <stop stopColor="#fbbf24" />
                <stop offset="1" stopColor="#b45309" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        <div>
          <span className="text-white/90 font-bold tracking-tight text-sm leading-none block">Dragon Ball Z</span>
          <span style={{ color: 'rgba(245,158,11,0.6)' }} className="text-[10px] tracking-[0.2em] uppercase font-light">
            Power Awakened
          </span>
        </div>
      </div>

      {/* Nav links */}
      <div className="relative hidden md:flex items-center gap-8">
        {links.map((item) => (
          <a
            key={item}
            href="#"
            className="relative text-[11px] tracking-widest uppercase transition-colors duration-300"
            style={{ color: hovered === item ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)' }}
            onMouseEnter={() => setHovered(item)}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => e.preventDefault()}
          >
            {item}
            {hovered === item && (
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-px"
                style={{ background: '#f59e0b' }}
                layoutId="nav-underline"
                transition={{ duration: 0.2 }}
              />
            )}
          </a>
        ))}
      </div>

      {/* CTA */}
      <motion.button
        id="nav-power-btn"
        className="relative text-[11px] font-semibold tracking-widest uppercase px-5 py-2 rounded-full"
        style={{
          border: '1px solid rgba(245,158,11,0.25)',
          color: 'rgba(245,158,11,0.8)',
          background: 'rgba(245,158,11,0.06)',
        }}
        whileHover={{
          borderColor: 'rgba(245,158,11,0.6)',
          color: 'rgba(245,158,11,1)',
          boxShadow: '0 0 20px rgba(245,158,11,0.2)',
        }}
        transition={{ duration: 0.2 }}
      >
        Over 9000
      </motion.button>
    </motion.nav>
  );
}
