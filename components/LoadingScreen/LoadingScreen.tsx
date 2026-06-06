'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/contexts/GameContext';

const STATUS_MESSAGES = [
  'Traversing the Fog...',
  'Awakening the Tarnished Developer...',
  'Seeking the Guidance of Grace...',
  'Summoning Legendary Armaments...',
  'Reconstituting the Elden Ring...',
  'Entering the Lands Between...',
];

// ── shared clip paths (verbatim from ProjectsSection) ──────────────────────
const clip4 = 'polygon(4px 0%,100% 0%,100% calc(100% - 4px),calc(100% - 4px) 100%,0% 100%,0% 4px)';
const clip6 = 'polygon(6px 0%,calc(100% - 6px) 0%,100% 6px,100% calc(100% - 6px),calc(100% - 6px) 100%,6px 100%,0% calc(100% - 6px),0% 6px)';

const LOADING_ITEMS = [
  {
    name: "GREATSWORD OF TYPESCRIPT",
    type: "Armament (Colossal Sword)",
    lore: "A heavy colossal sword forged from pure type-safety. Inflicts severe compile-time checks upon bugs and syntax deviations.\n\nRequired to slash through large-scale codebases, this weapon demands high discipline and intellect. Its strict typing shields the wielder from unexpected failure in critical encounters.",
    svg: (
      <svg viewBox="0 0 64 64" style={{ width: 72, height: 72, stroke: '#C8C8D0', fill: 'none', strokeWidth: 1 }}>
        <path d="M32 4 L34 8 L34 44 L38 46 L32 52 L26 46 L30 44 L30 8 Z" />
        <path d="M22 44 L42 44" strokeWidth="1.5" />
        <path d="M32 52 L32 60" strokeWidth="1.5" />
        <circle cx="32" cy="60" r="1.5" fill="#C8C8D0" />
      </svg>
    )
  },
  {
    name: "FLASK OF REACT",
    type: "Consumable (Elixir of State)",
    lore: "A crystalline flask containing a boiling liquid that shifts form dynamically. Restores structural interface integrity when consumed.\n\nGradually updates the layout in response to environmental stimuli. Tarnished developers rely on this flask to survive intense front-end encounters.",
    svg: (
      <svg viewBox="0 0 64 64" style={{ width: 72, height: 72, stroke: '#C8C8D0', fill: 'none', strokeWidth: 1 }}>
        <path d="M26 8 L38 8 M28 8 L28 16 L16 36 A18 18 0 1 0 48 36 L36 16 L36 8" />
        <path d="M20 38 Q32 32 44 38" strokeDasharray="2 2" />
        <circle cx="32" cy="38" r="3" />
      </svg>
    )
  },
  {
    name: "RUNE OF NEXT.JS",
    type: "Great Rune (Server Realm)",
    lore: "A shard of the shattered Elden Ring, representing the supreme law of server-side routing and pre-rendering.\n\nEnables seamless transition between server and client realms, accelerating page load speeds. Those who seek the throne of Web Development must brandish this rune of optimization.",
    svg: (
      <svg viewBox="0 0 64 64" style={{ width: 72, height: 72, stroke: '#C8C8D0', fill: 'none', strokeWidth: 1 }}>
        <circle cx="32" cy="32" r="24" strokeDasharray="4 2" />
        <circle cx="32" cy="32" r="18" />
        <path d="M22 42 L32 20 L42 42" strokeWidth="1.5" />
        <path d="M29 32 L35 32" />
      </svg>
    )
  },
  {
    name: "WHIP OF TAILWIND CSS",
    type: "Armament (Flexible Whip)",
    lore: "A flexible, fast-striking whip woven from utility classes. Allows for instantaneous styling of markup without leaving the main document.\n\nThough disdained by purists of raw stylesheet writing, its agility in responsive design is undeniable. Perfect for rapid prototyping in the lands of layout.",
    svg: (
      <svg viewBox="0 0 64 64" style={{ width: 72, height: 72, stroke: '#C8C8D0', fill: 'none', strokeWidth: 1 }}>
        <path d="M16 16 Q32 8 48 16 T32 32 T16 48" />
        <path d="M48 16 L48 24 Q32 32 48 48" strokeDasharray="2 2" />
        <circle cx="48" cy="48" r="2" fill="#C8C8D0" />
      </svg>
    )
  },
  {
    name: "TALISMAN OF DEVTOOLS",
    type: "Talisman (Debugging Catalyst)",
    lore: "A talisman depicting a bug trapped in a web of breakpoints. Increases search efficiency for logic errors and console anomalies.\n\nElden developers keep this talisman equipped in their active slot to pierce the shroud of runtime failures and trace call stacks.",
    svg: (
      <svg viewBox="0 0 64 64" style={{ width: 72, height: 72, stroke: '#C8C8D0', fill: 'none', strokeWidth: 1 }}>
        <circle cx="32" cy="32" r="20" />
        <path d="M32 12 L32 52 M12 32 L52 32" />
        <path d="M20 20 L44 44 M20 44 L44 20" />
        <circle cx="32" cy="32" r="4" fill="#C8C8D0" />
      </svg>
    )
  }
];

// ── EldenSymbol — strokes converted to silver ──────────────────────────────
function EldenSymbol() {
  return (
    <svg viewBox="0 0 100 120" style={{ stroke: '#A8A8B8', fill: 'none', strokeWidth: 0.8, width: '100%', height: '100%' }}>
      <circle cx="50" cy="35" r="20" />
      <circle cx="50" cy="55" r="22" />
      <circle cx="50" cy="75" r="24" />
      <circle cx="50" cy="22" r="10" />
      <line x1="50" y1="5" x2="50" y2="115" />
      <path d="M15 65 Q50 95 85 65" />
      <path d="M25 80 Q50 105 75 80" />
      <circle cx="50" cy="35" r="2"   fill="#C8C8D0" />
      <circle cx="50" cy="55" r="2.5" fill="#C8C8D0" />
      <circle cx="50" cy="75" r="3"   fill="#C8C8D0" />
    </svg>
  );
}

// ── OrnateDivider (verbatim from ProjectsSection) ──────────────────────────
function OrnateDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(168,168,176,0.35))' }} />
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{ color: '#A8A8B4', fontSize: '0.6rem' }}
      >◈</motion.span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(168,168,176,0.35),transparent)' }} />
    </div>
  );
}

export default function LoadingScreen() {
  const { setIsLoading, setIsGameStarted } = useGame();
  const [phase, setPhase]               = useState<'loading' | 'done'>('loading');
  const [progress, setProgress]         = useState(0);
  const [statusIdx, setStatusIdx]       = useState(0);
  const [selectedItem, setSelectedItem] = useState<(typeof LOADING_ITEMS)[0] | null>(null);

  useEffect(() => {
    const idx = Math.floor(Math.random() * LOADING_ITEMS.length);
    setSelectedItem(LOADING_ITEMS[idx]);
  }, []);

  useEffect(() => {
    let p = 0;
    let msgIdx = 0;
    const interval = setInterval(() => {
      const increment = Math.random() * 15 + 5;
      p = Math.min(100, p + increment);
      setProgress(p);

      const newIdx = Math.floor((p / 100) * (STATUS_MESSAGES.length - 1));
      if (newIdx !== msgIdx) { msgIdx = newIdx; setStatusIdx(msgIdx); }

      if (p >= 100) {
        clearInterval(interval);
        setStatusIdx(STATUS_MESSAGES.length - 1);
        setTimeout(() => {
          setPhase('done');
          setTimeout(() => { setIsLoading(false); setIsGameStarted(true); }, 800);
        }, 600);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [setIsLoading, setIsGameStarted]);

  return (
    <motion.div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        background: 'radial-gradient(circle at 75% 75%, rgba(168,168,176,0.05) 0%, #050505 70%, #030303 100%)',
        padding: '8vh 8vw',
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* ambient radial glow */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(168,168,176,0.04) 0%, transparent 70%)',
      }} />

      {/* ── TOP HEADER ── */}
      <motion.div
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          width: '100%',
          borderBottom: '1px solid rgba(168,168,176,0.15)',
          paddingBottom: 16,
          position: 'relative', zIndex: 1,
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div>
          <h2 style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            color: '#D4D4DC',
            textTransform: 'uppercase',
          }}>Harry Nielsen M. Lagto</h2>
          <p style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: '0.55rem',
            letterSpacing: '0.2em',
            color: '#7A7A84',
            marginTop: 2,
          }}>LANDS BETWEEN WEB DEVELOPMENT</p>
        </div>

        {/* BUILD badge — same style as ProjectsSection rarity chip */}
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.6rem',
          fontWeight: 700,
          color: '#9A9AA4',
          border: '1px solid rgba(168,168,176,0.25)',
          clipPath: clip4,
          padding: '3px 10px',
          letterSpacing: '0.08em',
        }}>BUILD v1.0.0</span>
      </motion.div>

      {/* ── MIDDLE: ITEM LORE CARD ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0', position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {selectedItem && (
            <motion.div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 48,
                maxWidth: 720,
                width: '100%',
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            >
              {/* Item SVG Frame — matches ProjectsSection panel style */}
              <div style={{
                width: 130, height: 130, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(6,6,8,0.92)',
                border: '1px solid rgba(168,168,176,0.18)',
                clipPath: clip6,
                boxShadow: 'inset 0 0 18px rgba(168,168,176,0.04)',
              }}>
                {selectedItem.svg}
              </div>

              {/* Item Lore Info */}
              <div style={{ flex: 1 }}>
                {/* name */}
                <h3 style={{
                  fontFamily: 'Cinzel, Georgia, serif',
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  letterSpacing: '0.15em',
                  color: '#D4D4DC',
                  textTransform: 'uppercase',
                }}>{selectedItem.name}</h3>

                {/* type — italic sub-label matching ProjectsSection lore quote style */}
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.7rem',
                  color: '#7A7A84',
                  fontStyle: 'italic',
                  marginTop: 4,
                  letterSpacing: '0.05em',
                }}>{selectedItem.type}</p>

                <OrnateDivider />

                {/* lore — borderLeft like ProjectsSection's lore quote */}
                <p style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '0.85rem',
                  color: '#C8C8D0',
                  lineHeight: 1.7,
                  letterSpacing: '0.01em',
                  whiteSpace: 'pre-line',
                  borderLeft: '2px solid rgba(168,168,176,0.25)',
                  paddingLeft: 14,
                  opacity: 0.9,
                }}>{selectedItem.lore}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── BOTTOM: LOADING BAR + EMBLEM ── */}
      <motion.div
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', zIndex: 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.4 }}
      >
        {/* progress bar track — silver */}
        <div style={{
          width: '100%', height: 2,
          background: 'rgba(168,168,176,0.12)',
          position: 'relative', overflow: 'hidden',
        }}>
          <motion.div
            style={{
              position: 'absolute', left: 0, top: 0, height: '100%',
              background: 'linear-gradient(90deg, #6E6E82, #D4D4DC)',
              boxShadow: '0 0 8px rgba(200,200,255,0.3)',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'linear', duration: 0.25 }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          {/* Status message */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{
              fontFamily: 'Cinzel, Georgia, serif',
              fontSize: '0.55rem',
              color: '#7A7A84',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}>STATUS LOG</span>
            <AnimatePresence mode="wait">
              <motion.p
                key={statusIdx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  fontFamily: 'Cinzel, Georgia, serif',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#C8C8D0',
                  letterSpacing: '0.08em',
                }}
              >{STATUS_MESSAGES[statusIdx]}</motion.p>
            </AnimatePresence>
          </div>

          {/* % + spinning emblem */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <span style={{
                fontFamily: 'Cinzel, Georgia, serif',
                fontSize: '0.55rem',
                color: '#7A7A84',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}>RUNE POWER</span>
              <span style={{
                fontFamily: 'Cinzel, Georgia, serif',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#D4D4DC',
                letterSpacing: '0.05em',
              }}>{Math.floor(progress)}%</span>
            </div>

            <motion.div
              style={{ width: 56, height: 56 }}
              animate={{ rotate: 360, opacity: [0.7, 1.0, 0.7] }}
              transition={{
                rotate:  { duration: 15, ease: 'linear', repeat: Infinity },
                opacity: { duration: 2.5, ease: 'easeInOut', repeat: Infinity },
              }}
            >
              <EldenSymbol />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}