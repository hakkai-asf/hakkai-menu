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

const LOADING_ITEMS = [
  {
    name: "GREATSWORD OF TYPESCRIPT",
    type: "Armament (Colossal Sword)",
    lore: "A heavy colossal sword forged from pure type-safety. Inflicts severe compile-time checks upon bugs and syntax deviations.\n\nRequired to slash through large-scale codebases, this weapon demands high discipline and intellect. Its strict typing shields the wielder from unexpected failure in critical encounters.",
    svg: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 sm:w-20 sm:h-20 stroke-[#C8A96E] fill-none" strokeWidth="1">
        <path d="M32 4 L34 8 L34 44 L38 46 L32 52 L26 46 L30 44 L30 8 Z" />
        <path d="M22 44 L42 44" strokeWidth="1.5" />
        <path d="M32 52 L32 60" strokeWidth="1.5" />
        <circle cx="32" cy="60" r="1.5" fill="#C8A96E" />
      </svg>
    )
  },
  {
    name: "FLASK OF REACT",
    type: "Consumable (Elixir of State)",
    lore: "A crystalline flask containing a boiling golden liquid that shifts form dynamically. Restores structural interface integrity when consumed.\n\nGradually updates the layout in response to environmental stimuli. Tarnished developers rely on this flask to survive intense front-end encounters.",
    svg: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 sm:w-20 sm:h-20 stroke-[#C8A96E] fill-none" strokeWidth="1">
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
      <svg viewBox="0 0 64 64" className="w-16 h-16 sm:w-20 sm:h-20 stroke-[#C8A96E] fill-none" strokeWidth="1">
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
      <svg viewBox="0 0 64 64" className="w-16 h-16 sm:w-20 sm:h-20 stroke-[#C8A96E] fill-none" strokeWidth="1">
        <path d="M16 16 Q32 8 48 16 T32 32 T16 48" />
        <path d="M48 16 L48 24 Q32 32 48 48" strokeDasharray="2 2" />
        <circle cx="48" cy="48" r="2" fill="#C8A96E" />
      </svg>
    )
  },
  {
    name: "TALISMAN OF DEVTOOLS",
    type: "Talisman (Debugging Catalyst)",
    lore: "A copper talisman depicting a bug trapped in a web of breakpoints. Increases search efficiency for logic errors and console anomalies.\n\nElden developers keep this talisman equipped in their active slot to pierce the shroud of runtime failures and trace call stacks.",
    svg: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 sm:w-20 sm:h-20 stroke-[#C8A96E] fill-none" strokeWidth="1">
        <circle cx="32" cy="32" r="20" />
        <path d="M32 12 L32 52 M12 32 L52 32" />
        <path d="M20 20 L44 44 M20 44 L44 20" />
        <circle cx="32" cy="32" r="4" fill="#C8A96E" />
      </svg>
    )
  }
];

function EldenSymbol() {
  return (
    <svg viewBox="0 0 100 120" className="stroke-[#C8A96E] fill-none" strokeWidth="0.8">
      {/* Overlapping rings */}
      <circle cx="50" cy="35" r="20" />
      <circle cx="50" cy="55" r="22" />
      <circle cx="50" cy="75" r="24" />
      {/* Upper small ring */}
      <circle cx="50" cy="22" r="10" />
      {/* Vertical spine */}
      <line x1="50" y1="5" x2="50" y2="115" />
      {/* Horizontal crossbar (curved arcs) */}
      <path d="M15 65 Q50 95 85 65" />
      <path d="M25 80 Q50 105 75 80" />
      {/* Small decorative marks */}
      <circle cx="50" cy="35" r="2" fill="#C8A96E" />
      <circle cx="50" cy="55" r="2.5" fill="#C8A96E" />
      <circle cx="50" cy="75" r="3" fill="#C8A96E" />
    </svg>
  );
}

export default function LoadingScreen() {
  const { setIsLoading, setIsGameStarted } = useGame();
  const [phase, setPhase] = useState<'loading' | 'done'>('loading');
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [selectedItem, setSelectedItem] = useState<(typeof LOADING_ITEMS)[0] | null>(null);

  useEffect(() => {
    // Select a random lore item on mount
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
      if (newIdx !== msgIdx) {
        msgIdx = newIdx;
        setStatusIdx(msgIdx);
      }

      if (p >= 100) {
        clearInterval(interval);
        setStatusIdx(STATUS_MESSAGES.length - 1);
        setTimeout(() => {
          setPhase('done');
          setTimeout(() => {
            setIsLoading(false);
            setIsGameStarted(true);
          }, 800);
        }, 600);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [setIsLoading, setIsGameStarted]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col justify-between"
      style={{
        background: 'radial-gradient(circle at 75% 75%, rgba(200, 169, 110, 0.06) 0%, #050505 70%, #030303 100%)',
        padding: '8vh 8vw'
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* ── TOP HEADER ── */}
      <motion.div
        className="flex justify-between items-start w-full border-b border-[rgba(200,169,110,0.15)] pb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div>
          <h2 style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '0.65rem', letterSpacing: '0.35em', color: '#C8A96E', textTransform: 'uppercase' }}>
            Harry Nielsen M. Lagto
          </h2>
          <p style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '0.55rem', letterSpacing: '0.2em', color: '#e3d7c4', opacity: 0.5, marginTop: 2 }}>
            LANDS BETWEEN WEB DEVELOPMENT
          </p>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', color: '#C8A96E', letterSpacing: '0.1em', opacity: 0.6 }}>
          BUILD v1.0.0
        </div>
      </motion.div>

      {/* ── MIDDLE CONTENT: ITEM LORE CARD ── */}
      <div className="flex-1 flex items-center justify-center my-6">
        <AnimatePresence mode="wait">
          {selectedItem && (
            <motion.div
              className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 max-w-3xl w-full"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            >
              {/* Item SVG Frame */}
              <div
                className="flex items-center justify-center border border-[rgba(200,169,110,0.2)] bg-[rgba(10,10,12,0.6)] p-6 clip-corner-sm"
                style={{ width: '130px', height: '130px', flexShrink: 0, boxShadow: 'inset 0 0 15px rgba(200,169,110,0.05)' }}
              >
                {selectedItem.svg}
              </div>

              {/* Item Lore Info */}
              <div className="flex-1 text-center md:text-left">
                <h3 style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '1.35rem', letterSpacing: '0.15em', color: '#C8A96E', textTransform: 'uppercase' }}>
                  {selectedItem.name}
                </h3>
                <p style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '0.7rem', color: '#e3d7c4', opacity: 0.6, fontStyle: 'italic', marginTop: 2, letterSpacing: '0.05em' }}>
                  {selectedItem.type}
                </p>
                
                {/* Thin divider line */}
                <div className="h-px w-24 my-4 mx-auto md:mx-0" style={{ background: 'linear-gradient(90deg, #C8A96E, transparent)' }} />
                
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.85rem', color: '#d3c7b4', lineHeight: '1.6', letterSpacing: '0.01em', whiteSpace: 'pre-line', opacity: 0.85 }}>
                  {selectedItem.lore}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── BOTTOM AREA: LOADING BAR & SPINNING EMBLEM ── */}
      <motion.div
        className="w-full flex flex-col gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.4 }}
      >
        {/* Loading bar line */}
        <div className="loading-bar-track w-full">
          <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex justify-between items-end">
          {/* Status Message (left) */}
          <div className="flex flex-col gap-1">
            <span style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '0.55rem', color: '#C8A96E', letterSpacing: '0.25em', opacity: 0.5 }}>
              STATUS LOG
            </span>
            <AnimatePresence mode="wait">
              <motion.p
                key={statusIdx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '0.8rem', color: '#e3d7c4', letterSpacing: '0.08em' }}
              >
                {STATUS_MESSAGES[statusIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Glowing Emblem & % indicator (right) */}
          <div className="flex items-center gap-6">
            <div className="text-right flex flex-col justify-end">
              <span style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '0.55rem', color: '#C8A96E', letterSpacing: '0.25em', opacity: 0.5 }}>
                RUNE POWER
              </span>
              <span style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '1.2rem', color: '#C8A96E', fontWeight: 500, letterSpacing: '0.05em' }}>
                {Math.floor(progress)}%
              </span>
            </div>

            {/* Rotating Elden Symbol */}
            <motion.div
              className="w-14 h-14"
              animate={{
                rotate: 360,
                opacity: [0.7, 1.0, 0.7]
              }}
              transition={{
                rotate: { duration: 15, ease: 'linear', repeat: Infinity },
                opacity: { duration: 2.5, ease: 'easeInOut', repeat: Infinity }
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
