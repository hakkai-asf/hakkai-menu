'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, Section } from '@/lib/contexts/GameContext';
import { useAudio } from '@/lib/contexts/AudioContext';

const SHORTCUTS: { id: Section; label: string; icon: string }[] = [
  { id: 'projects',  label: 'Projects',         icon: '◈' },
  { id: 'skills',    label: 'Skills',            icon: '◉' },
  { id: 'contact',   label: 'Contact',           icon: '◎' },
  { id: 'archive',   label: 'Portfolio Archive', icon: '⬡' },
];

export default function RecruiterMode() {
  const { navigateTo } = useGame();
  const { playHover, playSelect } = useAudio();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed z-30 pointer-events-auto" style={{ bottom: 24, left: 24 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="panel clip-corner-tr mb-3"
            style={{ padding: '14px 16px', minWidth: 220 }}
          >
            <p className="section-label mb-3">RECRUITER ACCESS</p>
            <div className="flex flex-col gap-1">
              {SHORTCUTS.map(s => (
                <button
                  key={s.id}
                  id={`recruiter-${s.id}`}
                  className="flex items-center gap-3 bg-transparent border-0 cursor-pointer group text-left py-2 px-2"
                  style={{ transition: 'background 0.15s' }}
                  onClick={() => { navigateTo(s.id); playSelect(); setOpen(false); }}
                  onMouseEnter={() => playHover()}
                >
                  <span style={{ color: '#C8A96E', fontSize: '0.75rem', width: 16, textAlign: 'center', flexShrink: 0 }}>{s.icon}</span>
                  <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', color: '#E8E0D4', textTransform: 'uppercase', transition: 'color 0.15s' }}
                    className="group-hover:text-gold">
                    {s.label}
                  </span>
                </button>
              ))}
              <div className="rule-gold my-2" />
              <a
                href="/cv/HARRY LAGTO ATS CV.pdf"
                download
                id="recruiter-resume"
                className="flex items-center gap-3 group py-2 px-2 no-underline"
                onMouseEnter={() => playHover()}
                onClick={() => playSelect()}
                style={{ textDecoration: 'none' }}
              >
                <span style={{ color: '#4ECDC4', fontSize: '0.75rem', width: 16, textAlign: 'center' }}>↓</span>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', color: '#4ECDC4', textTransform: 'uppercase' }}>
                  Download Resume
                </span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        id="recruiter-mode-toggle"
        className="btn-ghost flex items-center gap-2"
        onClick={() => { setOpen(o => !o); playHover(); }}
        onMouseEnter={() => playHover()}
        aria-label="Toggle recruiter mode"
        aria-expanded={open}
      >
        <span style={{ fontSize: '0.7rem' }}>{open ? '✕' : '⚡'}</span>
        <span>RECRUITER MODE</span>
      </button>
    </div>
  );
}
