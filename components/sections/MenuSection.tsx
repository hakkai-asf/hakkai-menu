'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/contexts/GameContext';
import { useAudio } from '@/lib/contexts/AudioContext';

const MENU_ITEMS = [
  { id: 'projects',  label: 'PROJECTS',          sub: 'Mission Select — View deployed work',       icon: '◈' },
  { id: 'profile',   label: 'DEVELOPER PROFILE', sub: 'Operator Card — Who is Harry Lagto',        icon: '◉' },
  { id: 'skills',    label: 'SKILLS',             sub: 'Character Build — Tech stack & mastery',    icon: '◌' },
  { id: 'contact',   label: 'CONTACT',            sub: 'Comms Terminal — Reach out directly',       icon: '◎' },
  { id: 'archive',   label: 'PORTFOLIO ARCHIVE',  sub: 'Classified DB — Full portfolio access',     icon: '⬡' },
  { id: 'settings',  label: 'SETTINGS',           sub: 'System Config — Audio, graphics & more',   icon: '⚙' },
];

export default function MenuSection() {
  const { navigateTo } = useGame();
  const { playHover, playSelect, playTransition } = useAudio();

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-end pointer-events-none"
      style={{ paddingRight: '8vw' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="pointer-events-auto flex flex-col"
        style={{ maxWidth: 480, width: '100%' }}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-2">SELECT OPERATION</p>
          <div className="rule-gold-left" style={{ width: 120 }} />
        </div>

        {/* Mission cards */}
        <div className="flex flex-col gap-2">
          {MENU_ITEMS.map((item, i) => (
            <motion.button
              key={item.id}
              id={`menu-card-${item.id}`}
              className="mission-card clip-corner-br text-left bg-transparent border-0 cursor-pointer"
              style={{ padding: '16px 20px' }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
              onClick={() => { navigateTo(item.id as any); playSelect(); playTransition(); }}
              onMouseEnter={() => playHover()}
            >
              <div className="flex items-center gap-4">
                <span style={{ color: '#C8A96E', fontSize: '1.1rem', width: 24, textAlign: 'center', flexShrink: 0, opacity: 0.8 }}>
                  {item.icon}
                </span>
                <div>
                  <p style={{ fontFamily: 'Cinzel, Georgia, serif', fontWeight: 400, fontSize: '1rem', letterSpacing: '0.1em', color: '#E8C98E', textTransform: 'uppercase' }}>
                    {item.label}
                  </p>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: '#E8E0D4', letterSpacing: '0.04em', marginTop: 2 }}>
                    {item.sub}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.p
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', color: '#C8A96E', letterSpacing: '0.1em', textTransform: 'uppercase' }}
        >
          BS Information Technology · National University · Metro Manila, PH
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
