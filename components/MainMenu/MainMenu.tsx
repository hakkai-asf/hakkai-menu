'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, Section } from '@/lib/contexts/GameContext';
import { useAudio } from '@/lib/contexts/AudioContext';
import Image from 'next/image';

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: 'projects',  label: 'PROJECTS' },
  { id: 'profile',   label: 'DEVELOPER PROFILE' },
  { id: 'skills',    label: 'SKILLS' },
  { id: 'contact',   label: 'CONTACT' },
  { id: 'archive',   label: 'PORTFOLIO ARCHIVE' },
  { id: 'settings',  label: 'SETTINGS' },
];

/* ── Chrome Hearts rune emblem — black & silver ── */
function RuneEmblem() {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
    >
      <circle cx="200" cy="200" r="170" stroke="url(#rg1)" strokeWidth="0.8" opacity="0.5" />
      <circle cx="200" cy="200" r="155" stroke="url(#rg1)" strokeWidth="0.4" opacity="0.3" />
      <circle cx="200" cy="200" r="110" stroke="url(#rg1)" strokeWidth="1"   opacity="0.6" />
      <line x1="200" y1="30"  x2="200" y2="370" stroke="url(#rg1)" strokeWidth="0.8" opacity="0.5" />
      <line x1="30"  y1="200" x2="370" y2="200" stroke="url(#rg1)" strokeWidth="0.8" opacity="0.5" />
      <line x1="80"  y1="80"  x2="320" y2="320" stroke="url(#rg1)" strokeWidth="0.4" opacity="0.25" />
      <line x1="320" y1="80"  x2="80"  y2="320" stroke="url(#rg1)" strokeWidth="0.4" opacity="0.25" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <line
          key={angle}
          x1="200" y1="200"
          x2={200 + 170 * Math.cos((angle * Math.PI) / 180)}
          y2={200 + 170 * Math.sin((angle * Math.PI) / 180)}
          stroke="url(#rg1)" strokeWidth="0.3" opacity="0.2"
        />
      ))}
      <circle cx="200" cy="200" r="18" fill="url(#innerGlow)" opacity="0.9" />
      <circle cx="200" cy="200" r="8"  fill="#A8A8B0" opacity="0.8" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 200 + 160 * Math.cos(rad);
        const y1 = 200 + 160 * Math.sin(rad);
        const x2 = 200 + 173 * Math.cos(rad);
        const y2 = 200 + 173 * Math.sin(rad);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#A8A8B0" strokeWidth="1.5" opacity="0.7" />;
      })}
      <defs>
        <radialGradient id="rg1" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#D4D4DC" />
          <stop offset="100%" stopColor="#4A4A52" />
        </radialGradient>
        <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#E0E0E8" stopOpacity="1" />
          <stop offset="100%" stopColor="#A8A8B0" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function MainMenu() {
  const { currentSection, navigateTo, isTitleScreen, setIsTitleScreen } = useGame();
  const { playHover, playSelect, playTransition, playBGM, playStartGame } = useAudio();
  const [hoveredItem, setHoveredItem] = useState<string | Section | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTitleMenuSelect = (id: Section) => {
    setIsTitleScreen(false);
    playStartGame().then(() => {
      playBGM('cinematic');
    });
    setTimeout(() => {
      navigateTo(id);
    }, 80);
  };

  const handleSelect = (id: Section) => {
    if (isMobile) setMobileMenuOpen(false);
    if (id === currentSection) {
      playSelect();
      navigateTo('menu');
    } else {
      playSelect();
      playTransition();
      navigateTo(id);
    }
  };

  const TITLE_MENU_ITEMS: { id: Section; label: string }[] = [
    { id: 'projects', label: 'CONTINUE' },
    { id: 'projects', label: 'NEW GAME' },
    { id: 'archive',  label: 'LOAD GAME' },
    { id: 'settings', label: 'SYSTEM' },
  ];

  /* ════════════════════════════════════════════
     TITLE SCREEN
     ════════════════════════════════════════════ */
  if (isTitleScreen) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center pointer-events-auto"
        style={{ background: '#050505', zIndex: 99999, overflow: 'hidden' }}
      >
        {/* Rune emblem background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 3.5, ease: 'easeOut' }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(70vw, 880px)', height: 'min(70vw, 880px)',
            pointerEvents: 'none',
          }}
        >
          <RuneEmblem />
        </motion.div>

        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70vw', height: '70vw', borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(180,180,192,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* ── SINGLE CENTERED COLUMN: Logo + Title + Divider + Menu ── */}
        <motion.div
          className="relative z-10 flex flex-col items-center w-full px-8"
          style={{ maxWidth: '100vw', textAlign: 'center' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.4, ease: 'easeOut', delay: 0.4 }}
        >
          {/* Hakkai Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut', delay: 0.6 }}
            style={{ marginBottom: '1rem', position: 'relative' }}
          >
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '140%', height: '140%',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(212,212,220,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <Image
              src="/Hakkai-Logo.png"
              alt="Hakkai Logo"
              width={140}
              height={140}
              style={{
                width: 'clamp(72px, 10vw, 120px)',
                height: 'auto',
                filter: 'drop-shadow(0 0 18px rgba(212,212,220,0.35)) drop-shadow(0 0 40px rgba(168,168,176,0.15))',
                position: 'relative',
                zIndex: 1,
              }}
              priority
            />
          </motion.div>

          {/* Portfolio title */}
          <h1 style={{
            fontFamily: '"Cinzel Decorative", "Cinzel", "Rajdhani", serif',
            fontSize: 'clamp(1.6rem, 5vw, 4.5rem)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#D4D4DC',
            textTransform: 'uppercase',
            textShadow: '0 0 40px rgba(212,212,220,0.2), 0 0 100px rgba(160,160,172,0.08)',
            lineHeight: 1.2,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            maxWidth: '90vw',
            margin: 0,
          }}>
            Harry&apos;s Portfolio
          </h1>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.2, ease: 'easeOut' }}
            style={{
              marginTop: '1rem',
              marginBottom: '0',
              height: '1px',
              width: 'clamp(140px, 35vw, 440px)',
              background: 'linear-gradient(90deg, transparent, #A8A8B0 30%, #A8A8B0 70%, transparent)',
            }}
          />

          {/* Menu items — directly below divider, no absolute positioning */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 1.0, ease: 'easeOut' }}
            style={{ marginTop: 'clamp(1.6rem, 4vh, 3rem)' }}
          >
            <ul className="flex flex-col items-center gap-2 select-none" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
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
                        padding: '5px 20px',
                        fontFamily: '"Cinzel", "Georgia", serif',
                        fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)',
                        fontWeight: isItemHovered ? 400 : 300,
                        letterSpacing: '0.22em',
                        color: isItemHovered ? '#E0E0E8' : '#A8A8B0',
                        textTransform: 'uppercase',
                        transition: 'color 0.18s ease, font-weight 0.18s ease',
                        textShadow: isItemHovered ? '0 0 15px rgba(220,220,228,0.5)' : 'none',
                        position: 'relative',
                      }}
                    >
                      <span style={{
                        position: 'absolute', left: '-24px',
                        color: '#D4D4DC', fontSize: '0.75rem',
                        opacity: isItemHovered ? 1 : 0,
                        transition: 'opacity 0.18s ease, transform 0.18s ease',
                        transform: isItemHovered ? 'scale(1)' : 'scale(0.5)',
                        textShadow: '0 0 10px rgba(212,212,220,0.7)',
                      }}>◈</span>
                      {item.label}
                      <span style={{
                        position: 'absolute', right: '-24px',
                        color: '#D4D4DC', fontSize: '0.75rem',
                        opacity: isItemHovered ? 1 : 0,
                        transition: 'opacity 0.18s ease, transform 0.18s ease',
                        transform: isItemHovered ? 'scale(1)' : 'scale(0.5)',
                        textShadow: '0 0 10px rgba(212,212,220,0.7)',
                      }}>◈</span>
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>

        {/* Copyright — always pinned to bottom */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ duration: 1.5, delay: 2.2 }}
          style={{
            position: 'absolute',
            bottom: 'clamp(12px, 3vh, 28px)',
            left: 0, right: 0,
            textAlign: 'center',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.5rem',
            letterSpacing: '0.18em',
            color: '#A8A8B0',
            textTransform: 'uppercase',
          }}
        >
          © 2026 Harry Nielsen M. Lagto — Metro Manila, PH
        </motion.p>
      </div>
    );
  }

  /* ════════════════════════════════════════════
     MOBILE HAMBURGER BUTTON
     ════════════════════════════════════════════ */
  if (isMobile && !mobileMenuOpen) {
    return (
      <>
        {currentSection === 'menu' && (
          <motion.div
            className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            aria-hidden="true"
          >
            <div
              style={{
                position: 'relative',
                width: 'clamp(132px, 52vw, 190px)',
                height: 'clamp(132px, 52vw, 190px)',
                transform: 'translateY(-3vh)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: '-20%',
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse at center, rgba(212,212,220,0.14) 0%, rgba(168,168,176,0.05) 42%, transparent 70%)',
                  filter: 'blur(2px)',
                }}
              />
              <Image
                src="/Hakkai-Logo.png"
                alt="Hakkai Logo"
                fill
                sizes="(max-width: 767px) 52vw"
                style={{
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 18px rgba(212,212,220,0.42)) drop-shadow(0 0 42px rgba(168,168,176,0.18))',
                }}
                priority
              />
            </div>
          </motion.div>
        )}

        <div className="fixed top-5 right-5 z-[99999]">
          <button
            onClick={() => { playSelect(); setMobileMenuOpen(true); }}
            className="flex flex-col gap-1.5 justify-center items-center"
            style={{
              width: 48, height: 48,
              background: 'rgba(6,6,8,0.88)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(168,168,176,0.35)',
              clipPath: 'polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px)',
            }}
            aria-label="Open menu"
          >
            <span style={{ display: 'block', width: 22, height: 1.5, background: '#D4D4DC' }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: '#D4D4DC' }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: '#D4D4DC' }} />
          </button>
        </div>
      </>
    );
  }

  /* ════════════════════════════════════════════
     MOBILE FULL-SCREEN OVERLAY MENU
     ════════════════════════════════════════════ */
  if (isMobile && mobileMenuOpen) {
    return (
      <AnimatePresence>
        <motion.div
          key="mobile-overlay"
          className="fixed inset-0 z-[99999] flex flex-col pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ background: 'rgba(6,6,8,0.97)', backdropFilter: 'blur(18px)' }}
        >
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80vw', height: '80vw',
            pointerEvents: 'none', opacity: 0.06,
          }}>
            <RuneEmblem />
          </div>

          <div className="flex justify-end p-5">
            <button
              onClick={() => { playSelect(); setMobileMenuOpen(false); }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(168,168,176,0.3)',
                color: '#A8A8B0',
                fontFamily: 'Cinzel, Georgia, serif',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                padding: '8px 16px',
                cursor: 'pointer',
                clipPath: 'polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)',
              }}
            >
              ✕ CLOSE
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-10 pb-16">
            <p style={{
              fontFamily: 'Cinzel, Georgia, serif',
              fontSize: '0.6rem',
              fontWeight: 400,
              letterSpacing: '0.3em',
              color: '#6E6E78',
              textTransform: 'uppercase',
              marginBottom: '2.5rem',
            }}>
              MAIN MENU
            </p>

            <div style={{
              width: '100%', maxWidth: 280, height: 1, marginBottom: '2rem',
              background: 'linear-gradient(90deg, transparent, #A8A8B0 40%, #A8A8B0 60%, transparent)',
            }} />

            <ul className="flex flex-col items-center gap-1 w-full" style={{ listStyle: 'none', padding: 0, maxWidth: 320 }}>
              {NAV_ITEMS.map((item, i) => {
                const isActive  = currentSection === item.id;
                const isHovered = hoveredItem === item.id;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.055 }}
                    style={{ width: '100%' }}
                  >
                    <button
                      onClick={() => handleSelect(item.id)}
                      onTouchStart={() => setHoveredItem(item.id)}
                      onTouchEnd={() => setHoveredItem(null)}
                      onMouseEnter={() => { setHoveredItem(item.id); playHover(); }}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        padding: '14px 0',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(168,168,176,0.07)',
                        cursor: 'pointer',
                        fontFamily: 'Cinzel, Georgia, serif',
                        fontSize: isActive ? '1.2rem' : '1.05rem',
                        fontWeight: isActive ? 400 : 300,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: isActive ? '#D4D4DC' : (isHovered ? '#C0C0C8' : '#8A8A94'),
                        textShadow: isActive ? '0 0 14px rgba(212,212,220,0.45)' : 'none',
                        transition: 'color 0.18s ease, font-size 0.18s ease',
                      }}
                    >
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                        background: isActive ? '#D4D4DC' : 'transparent',
                        boxShadow: isActive ? '0 0 8px rgba(212,212,220,0.6)' : 'none',
                        border: isActive ? 'none' : '1px solid rgba(168,168,176,0.25)',
                        transition: 'all 0.18s ease',
                      }} />
                      {item.label}
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            <div style={{
              width: '100%', maxWidth: 280, height: 1, marginTop: '2rem',
              background: 'linear-gradient(90deg, transparent, #A8A8B0 40%, #A8A8B0 60%, transparent)',
            }} />

            <p style={{
              marginTop: '1.5rem',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.45rem',
              letterSpacing: '0.15em',
              color: '#3A3A42',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}>
              © 2026 Harry Nielsen M. Lagto
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  /* ════════════════════════════════════════════
     DESKTOP NAV RAIL
     ════════════════════════════════════════════ */
  return (
    <div className="fixed inset-0 pointer-events-none flex" style={{ zIndex: 99999 }}>
      <motion.div
        className="absolute pointer-events-none hidden md:block"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
        aria-hidden="true"
        style={{
          left: 'clamp(52px, 7vw, 92px)',
          top: 'clamp(34px, 7vh, 72px)',
          width: 'clamp(190px, 18vw, 270px)',
          height: 'clamp(190px, 18vw, 270px)',
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-18%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(212,212,220,0.12) 0%, rgba(168,168,176,0.04) 45%, transparent 72%)',
            filter: 'blur(2px)',
          }}
        />
        <Image
          src="/Hakkai-Logo.png"
          alt="Hakkai Logo"
          fill
          sizes="(min-width: 768px) 18vw"
          style={{
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 20px rgba(212,212,220,0.36)) drop-shadow(0 0 48px rgba(168,168,176,0.16))',
          }}
          priority
        />
      </motion.div>

      <motion.div
        className="absolute pointer-events-auto flex flex-col"
        initial={false}
        animate={{ left: '48px', top: 'auto', bottom: '60px', x: '0%', y: '0%' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: 'clamp(260px, 28vw, 380px)', zIndex: 99999, opacity: 1 }}
      >
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
              color: '#A8A8B0',
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
                    <span style={{
                      display: 'block',
                      fontSize: isActive ? '1.55rem' : '1.35rem',
                      fontWeight: isActive ? 400 : 300,
                      color: isActive ? '#D4D4DC' : '#ffffff',
                      opacity: 1,
                      textShadow: isActive ? '0 0 12px rgba(212,212,220,0.55)' : 'none',
                      transition: 'font-size 0.2s ease, color 0.2s ease, font-weight 0.2s ease',
                    }}>
                      {item.label}
                    </span>
                    <AnimatePresence>
                      {(isHovered || isActive) && (
                        <motion.span
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{
                            display: 'block',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.55rem',
                            letterSpacing: '0.1em',
                            color: '#A8A8B0',
                            textTransform: 'uppercase',
                            paddingBottom: 2,
                          }}
                        />
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