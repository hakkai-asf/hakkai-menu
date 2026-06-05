'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, Section } from '@/lib/contexts/GameContext';
import { useAudio } from '@/lib/contexts/AudioContext';

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: 'projects',  label: 'PROJECTS' },
  { id: 'profile',   label: 'DEVELOPER PROFILE' },
  { id: 'skills',    label: 'SKILLS' },
  { id: 'contact',   label: 'CONTACT' },
  { id: 'archive',   label: 'PORTFOLIO ARCHIVE' },
  { id: 'settings',  label: 'SETTINGS' },
];

/* ── Elden-Ring-style rune SVG emblem ── */
function RuneEmblem() {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Outer glowing ring */}
      <circle cx="200" cy="200" r="170" stroke="url(#rg1)" strokeWidth="0.8" opacity="0.5" />
      <circle cx="200" cy="200" r="155" stroke="url(#rg1)" strokeWidth="0.4" opacity="0.3" />
      <circle cx="200" cy="200" r="110" stroke="url(#rg1)" strokeWidth="1" opacity="0.6" />

      {/* Cross arms */}
      <line x1="200" y1="30"  x2="200" y2="370" stroke="url(#rg1)" strokeWidth="0.8" opacity="0.5" />
      <line x1="30"  y1="200" x2="370" y2="200" stroke="url(#rg1)" strokeWidth="0.8" opacity="0.5" />

      {/* Diagonal arms (smaller) */}
      <line x1="80"  y1="80"  x2="320" y2="320" stroke="url(#rg1)" strokeWidth="0.4" opacity="0.25" />
      <line x1="320" y1="80"  x2="80"  y2="320" stroke="url(#rg1)" strokeWidth="0.4" opacity="0.25" />

      {/* Inner ornamental web lines */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <line
          key={angle}
          x1="200"
          y1="200"
          x2={200 + 170 * Math.cos((angle * Math.PI) / 180)}
          y2={200 + 170 * Math.sin((angle * Math.PI) / 180)}
          stroke="url(#rg1)"
          strokeWidth="0.3"
          opacity="0.2"
        />
      ))}

      {/* Inner starburst */}
      <circle cx="200" cy="200" r="18" fill="url(#innerGlow)" opacity="0.9" />
      <circle cx="200" cy="200" r="8"  fill="#C8A96E" opacity="0.8" />

      {/* Ornamental tick marks on outer ring */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 200 + 160 * Math.cos(rad);
        const y1 = 200 + 160 * Math.sin(rad);
        const x2 = 200 + 173 * Math.cos(rad);
        const y2 = 200 + 173 * Math.sin(rad);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C8A96E" strokeWidth="1.5" opacity="0.7" />;
      })}

      <defs>
        <radialGradient id="rg1" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#E8C98E" />
          <stop offset="100%" stopColor="#7A5C2A" />
        </radialGradient>
        <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#F0D890" stopOpacity="1" />
          <stop offset="100%" stopColor="#C8A96E" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function MainMenu() {
  const { currentSection, navigateTo, isTitleScreen, setIsTitleScreen } = useGame();
  const { playHover, playSelect, playTransition, playBGM, playConfirm } = useAudio();
  const [hoveredItem, setHoveredItem] = useState<string | Section | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showMenu = !isMobile || currentSection === 'menu' || mobileMenuOpen;

  /* ── Title-screen nav: select item and enter directly ── */
  const handleTitleMenuSelect = (id: Section) => {
    playBGM('cinematic');
    playConfirm();
    setIsTitleScreen(false);
    setTimeout(() => {
      playSelect();
      navigateTo(id);
    }, 80);
  };

  /* ── Inner-menu nav ── */
  const handleSelect = (id: Section) => {
    if (isMobile) setMobileMenuOpen(false);
    if (id === currentSection) {
      // Clicking the active item again → close/unselect, return to menu home
      playSelect();
      navigateTo('menu');
    } else {
      playSelect();
      playTransition();
      navigateTo(id);
    }
  };

  const isMenuHome = currentSection === 'menu';

  const TITLE_MENU_ITEMS: { id: Section; label: string }[] = [
    { id: 'projects', label: 'CONTINUE' },
    { id: 'projects', label: 'NEW GAME' },
    { id: 'archive',  label: 'LOAD GAME' },
    { id: 'settings', label: 'SYSTEM' },
  ];

  /* ════════════════════════════════════════════
     ELDEN RING TITLE SCREEN
     ════════════════════════════════════════════ */
  if (isTitleScreen) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-between pointer-events-auto"
        style={{ background: '#050505', padding: '15vh 0 10vh', zIndex: 99999, opacity: 1 }}
      >
        {/* ── Emblem (dead center, behind everything) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 3.5, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(70vw, 880px)',
            height: 'min(70vw, 880px)',
            pointerEvents: 'none',
          }}
        >
          <RuneEmblem />
        </motion.div>

        {/* Ambient radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70vw',
            height: '70vw',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(200,169,110,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── TITLE (top section, fully centered) ── */}
        <motion.div
          className="relative z-10 flex flex-col items-center w-full px-8"
          style={{ maxWidth: '100vw', textAlign: 'center' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.4, ease: 'easeOut', delay: 0.4 }}
        >
          <h1
            style={{
              fontFamily: '"Cinzel Decorative", "Cinzel", "Rajdhani", serif',
              fontSize: 'clamp(1.8rem, 5vw, 4.5rem)',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#E8C98E',
              textTransform: 'uppercase',
              textShadow: '0 0 40px rgba(232,201,142,0.25), 0 0 100px rgba(200,130,30,0.1)',
              lineHeight: 1.2,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              maxWidth: '90vw',
            }}
          >
            Harry&apos;s Portfolio
          </h1>

          {/* ornamental divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.2, ease: 'easeOut' }}
            style={{
              marginTop: '1.2rem',
              height: '1px',
              width: 'clamp(160px, 35vw, 440px)',
              background: 'linear-gradient(90deg, transparent, #C8A96E 30%, #C8A96E 70%, transparent)',
            }}
          />
        </motion.div>

        {/* ── BOTTOM: TITLE MENU (Elden Ring style) ── */}
        <motion.div
          className="absolute flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 1.0, ease: 'easeOut' }}
          style={{ bottom: '8vh' }}
        >
          <ul className="flex flex-col items-center gap-3 select-none" style={{ listStyle: 'none', padding: 0 }}>
            {TITLE_MENU_ITEMS.map((item, index) => {
              const isItemHovered = hoveredItem === `title-${index}`;
              return (
                <li key={index} style={{ position: 'relative' }}>
                  <motion.button
                    className="bg-transparent border-0 outline-none cursor-pointer flex items-center justify-center gap-3"
                    onClick={() => handleTitleMenuSelect(item.id)}
                    onMouseEnter={() => { setHoveredItem(`title-${index}`); playHover(); }}
                    onMouseLeave={() => setHoveredItem(null)}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      padding: '6px 20px',
                      fontFamily: '"Cinzel", "Georgia", serif',
                      fontSize: '1.05rem',
                      fontWeight: isItemHovered ? 400 : 300,
                      letterSpacing: '0.22em',
                      color: isItemHovered ? '#F0D890' : '#C8A96E',
                      textTransform: 'uppercase',
                      transition: 'color 0.18s ease, font-weight 0.18s ease',
                      textShadow: isItemHovered ? '0 0 15px rgba(240,216,144,0.55)' : 'none',
                    }}
                  >
                    {/* Diamond selector indicator */}
                    <span
                      style={{
                        position: 'absolute',
                        left: '-24px',
                        color: '#F0D890',
                        fontSize: '0.75rem',
                        opacity: isItemHovered ? 1 : 0,
                        transition: 'opacity 0.18s ease, transform 0.18s ease',
                        transform: isItemHovered ? 'scale(1)' : 'scale(0.5)',
                        textShadow: '0 0 10px rgba(240,216,144,0.7)',
                      }}
                    >
                      ◈
                    </span>
                    {item.label}
                    <span
                      style={{
                        position: 'absolute',
                        right: '-24px',
                        color: '#F0D890',
                        fontSize: '0.75rem',
                        opacity: isItemHovered ? 1 : 0,
                        transition: 'opacity 0.18s ease, transform 0.18s ease',
                        transform: isItemHovered ? 'scale(1)' : 'scale(0.5)',
                        textShadow: '0 0 10px rgba(240,216,144,0.7)',
                      }}
                    >
                      ◈
                    </span>
                  </motion.button>
                </li>
              );
            })}
          </ul>

          {/* bottom copyright line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 1.5, delay: 2.2 }}
            style={{
              marginTop: '1.5rem',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.5rem',
              letterSpacing: '0.18em',
              color: '#C8A96E',
              textTransform: 'uppercase',
            }}
          >
            © 2024 Harry Nielsen M. Lagto — Metro Manila, PH
          </motion.p>
        </motion.div>
      </div>
    );
  }

  /* ════════════════════════════════════════════
     INNER MAIN MENU (compact nav rail)
     ════════════════════════════════════════════ */
  if (!showMenu) {
    return (
      <div className="fixed top-6 right-6 z-[99999]">
        <button 
          onClick={() => { playSelect(); setMobileMenuOpen(true); }}
          className="bg-[#0a0a0c]/80 backdrop-blur-md border border-[#C8A96E]/50 rounded-md flex flex-col gap-1.5 justify-center items-center"
          style={{ width: '48px', height: '48px' }}
        >
          <span className="block w-6 h-0.5 bg-[#E8C98E]"></span>
          <span className="block w-6 h-0.5 bg-[#E8C98E]"></span>
          <span className="block w-6 h-0.5 bg-[#E8C98E]"></span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none flex" style={{ zIndex: 99999, backgroundColor: isMobile && currentSection !== 'menu' ? 'rgba(5,5,5,0.95)' : 'transparent' }}>
      <motion.div
        className="absolute pointer-events-auto flex flex-col"
        initial={false}
        animate={isMobile ? {
          left: '24px',
          top: 'auto',
          bottom: '24px',
          x: '0%',
          y: '0%',
        } : {
          left: '48px',
          top: 'auto',
          bottom: '60px',
          x: '0%',
          y: '0%',
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: isMobile ? 'calc(100vw - 48px)' : 'clamp(260px, 28vw, 380px)', zIndex: 99999, opacity: 1 }}
      >
        {isMobile && currentSection !== 'menu' && (
          <button 
             className="absolute -top-16 right-0 text-[#E8C98E] font-['Cinzel'] tracking-widest text-sm bg-transparent border border-[#E8C98E]/50 px-4 py-2 rounded"
             onClick={() => { playSelect(); setMobileMenuOpen(false); }}
          >
            ✕ CLOSE
          </button>
        )}
        <motion.nav
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ zIndex: 99999, opacity: 1 }}
        >
          <p
            className="section-label mb-4"
            style={{
              fontFamily: 'Cinzel, Georgia, serif',
              fontSize: '0.65rem',
              fontWeight: 400,
              letterSpacing: '0.25em',
              color: '#E8C98E',
              opacity: 1,
            }}
          >
            MAIN MENU
          </p>

          <ul className="flex flex-col gap-1" role="menubar">
            {NAV_ITEMS.map((item, i) => {
              const isActive  = currentSection === item.id;
              const isHovered = hoveredItem === item.id;
              return (
                <motion.li
                  key={item.id}
                  role="menuitem"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.07 }}
                >
                  <button
                    id={`nav-${item.id}`}
                    className={`menu-item block text-left bg-transparent border-0 ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelect(item.id)}
                    onMouseEnter={() => { setHoveredItem(item.id); playHover(); }}
                    onMouseLeave={() => setHoveredItem(null)}
                    aria-current={isActive ? 'page' : undefined}
                    style={{ width: '100%' }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: isActive ? (isMobile ? '1.25rem' : '1.55rem') : (isMobile ? '1.05rem' : '1.35rem'),
                        fontWeight: isActive ? 400 : 300,
                        color: isActive ? '#E8C98E' : '#ffffff',
                        opacity: 1,
                        textShadow: isActive ? '0 0 12px rgba(232, 201, 142, 0.6)' : 'none',
                        transition: 'font-size 0.2s ease, color 0.2s ease, font-weight 0.2s ease',
                      }}
                    >
                      {item.label}
                    </span>
                    <AnimatePresence>
                      {(isHovered || isActive) && (
                        <motion.span
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.1em', color: '#C8A96E', textTransform: 'uppercase', paddingBottom: 2 }}
                        >
                          {/* sub-label removed per user request */}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </motion.nav>
      </motion.div>
    </div>
  );
}
