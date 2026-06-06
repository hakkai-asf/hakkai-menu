'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/lib/contexts/AudioContext';
import CharacterViewer from '@/components/Character/CharacterViewer';

const ACHIEVEMENTS = [
  { title: "Dean's Lister",           desc: 'Academic excellence recognition' },
  { title: 'Batch Valedictorian',     desc: 'Top graduate of the batch' },
  { title: 'Best in System',          desc: 'Outstanding system development' },
  { title: 'Best Research Presenter', desc: 'Research presentation excellence' },
  { title: 'SM Foundation Scholar',   desc: 'Scholarship program passer' },
];

const STACK = [
  { name: 'Next.js',      category: 'Framework' },
  { name: 'React',        category: 'Library' },
  { name: 'TypeScript',   category: 'Language' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Supabase',     category: 'Backend' },
  { name: 'Java',         category: 'Language' },
  { name: 'Android Dev',  category: 'Platform' },
];

const SETUP = [
  { name: 'Visual Studio Code' },
  { name: 'Android Studio' },
  { name: 'GitHub' },
  { name: 'Photoshop' },
];

const LANGUAGES = [
  { lang: 'Filipino', level: 'Native' },
  { lang: 'English',  level: 'Fluent' },
];

function OrnateDivider() {
  return (
    <div className="flex items-center justify-center my-3 w-full opacity-70">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#A8A8B0] to-transparent" />
      <span className="mx-2 text-[#A8A8B0] text-[10px] transform rotate-45 border border-[#A8A8B0]/50 p-[2px] leading-none flex items-center justify-center">◈</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#A8A8B0] to-transparent" />
    </div>
  );
}

export default function ProfileSection() {
  const { playHover, playToggle } = useAudio();
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom]         = useState(1);

  const rotate  = (dir: number) => { setRotation(r => r + dir * 30); playToggle(); };
  const zoomIn  = () => { setZoom(z => Math.min(1.4, z + 0.1)); playToggle(); };
  const zoomOut = () => { setZoom(z => Math.max(0.7, z - 0.1)); playToggle(); };
  const reset   = () => { setRotation(0); setZoom(1); playToggle(); };

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col md:flex-row bg-[#0a0a0c] text-[#E8E0D4] max-md:!pl-0 md:pl-[clamp(280px,30vw,400px)] pt-16 md:pt-0 overflow-y-auto md:overflow-hidden scrollable"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >

      {/* ── Character viewer column ── */}
      <motion.div
        className="
          w-full
          md:w-[clamp(300px,35vw,440px)]
          flex-shrink-0
          flex flex-col items-center
          justify-start md:justify-center
          pt-4 md:pt-0
          pb-2 md:pb-10
        "
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0,   opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Character canvas */}
        <div className="w-full">
          <div className="h-[280px] md:h-[480px] w-full relative">
            <CharacterViewer
              mode="profile"
              rotation={rotation}
              zoom={zoom}
              onRotate={d => setRotation(r => r + d)}
            />
          </div>
        </div>

        {/* Viewer controls */}
        <div className="flex items-center gap-2 md:gap-3 mt-3">
          {[
            { label: '↺', action: () => rotate(-1), tip: 'Rotate Left'  },
            { label: '↻', action: () => rotate(1),  tip: 'Rotate Right' },
            { label: '+', action: zoomIn,            tip: 'Zoom In'      },
            { label: '−', action: zoomOut,           tip: 'Zoom Out'     },
            { label: '⊙', action: reset,             tip: 'Reset'        },
          ].map(({ label, action, tip }) => (
            <button
              key={tip}
              onClick={action}
              onMouseEnter={() => playHover()}
              title={tip}
              className="btn-ghost"
              style={{ padding: '7px 12px', fontSize: '1rem', minWidth: 36 }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* "DRAG TO ROTATE" hint — bumped up from 0.5rem */}
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.72rem',
          fontWeight: 500,
          color: '#A8A8B0',
          letterSpacing: '0.12em',
          marginTop: 8,
        }}>
          DRAG TO ROTATE
        </p>
      </motion.div>

      {/* ── Data panel column ── */}
      <motion.div
        className="
          flex-1 min-w-0
          overflow-visible md:overflow-y-auto scrollable
          py-4 md:py-8
          px-4 md:pr-6 md:pl-8
          flex flex-col gap-5 md:gap-6
          pb-16 md:pb-8
        "
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0,  opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >

        {/* ── Operator header ── */}
        <div
          className="panel"
          style={{
            padding: '20px 22px',
            borderColor: 'rgba(168,168,176,0.2)',
            clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
          }}
        >
          {/* Section label — bumped from 0.65rem (via .section-label) — override inline */}
          <p style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#A8A8B0',
            marginBottom: 4,
          }}>
            OPERATOR FILE
          </p>

          <OrnateDivider />

          {/* Name */}
          <h1 style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: 'clamp(1.4rem, 4vw, 2rem)',
            fontWeight: 600,
            color: '#D4D4DC',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            lineHeight: 1.1,
          }}>
            Harry Nielsen M. Lagto
          </h1>

          {/* Role */}
          <p style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: '0.95rem',
            fontWeight: 400,
            color: '#A8A8B0',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: 6,
          }}>
            Aspiring Fullstack Developer
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-x-5 gap-y-4 mt-5">
            {[
              ['LOCATION',    'Metro Manila, Philippines'],
              ['STATUS',      null],
              ['EDUCATION',   'BS Information Technology'],
              ['INSTITUTION', 'National University'],
            ].map(([label, value]) => (
              <div key={label as string}>
                {/* hud-label override — bigger & bolder */}
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#A8A8B0',
                  marginBottom: 3,
                }}>
                  {label}
                </div>
                {label === 'STATUS'
                  ? <div className="status-available" style={{ fontSize: '0.8rem', fontWeight: 600 }}>AVAILABLE FOR WORK</div>
                  : <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', fontWeight: 500, color: '#E8E0D4', marginTop: 2 }}>{value}</div>
                }
              </div>
            ))}
          </div>
        </div>

        {/* ── Achievements ── */}
        <div>
          {/* Section header */}
          <p style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#A8A8B0',
            marginBottom: 12,
          }}>
            ACHIEVEMENTS UNLOCKED
          </p>

          <div className="grid grid-cols-1 gap-2">
            {ACHIEVEMENTS.map((ach, i) => (
              <motion.div
                key={ach.title}
                className="achievement-badge flex items-center gap-4"
                style={{
                  clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
                  borderColor: 'rgba(168,168,176,0.2)',
                  background: 'rgba(10,10,12,0.6)',
                  padding: '12px 16px',
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.07 }}
                onMouseEnter={() => playHover()}
              >
                <div className="min-w-0 flex-1">
                  {/* Achievement title — bumped from 0.82rem */}
                  <p style={{
                    fontFamily: 'Cinzel, Georgia, serif',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: '#D4D4DC',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>
                    {ach.title}
                  </p>
                  {/* Achievement desc — bumped from 0.55rem */}
                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    color: '#C0C0C8',
                    marginTop: 3,
                    letterSpacing: '0.03em',
                  }}>
                    {ach.desc}
                  </p>
                </div>
                {/* "UNLOCKED" badge — bumped from 0.5rem */}
                <span
                  className="ml-auto flex-shrink-0"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: '#A8A8B0',
                    letterSpacing: '0.12em',
                    opacity: 0.7,
                  }}
                >
                  UNLOCKED
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Equipped Technologies ── */}
        <div>
          <p style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#A8A8B0',
            marginBottom: 12,
          }}>
            EQUIPPED TECHNOLOGIES
          </p>

          <div className="flex flex-wrap gap-2">
            {STACK.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: 0.4 + i * 0.05 }}
                className="flex flex-col"
                style={{
                  background: 'rgba(168,168,176,0.06)',
                  border: '1px solid rgba(168,168,176,0.2)',
                  padding: '10px 14px',
                  clipPath: 'polygon(6px 0%,100% 0%,100% calc(100% - 6px),calc(100% - 6px) 100%,0% 100%,0% 6px)',
                }}
                onMouseEnter={() => playHover()}
              >
                {/* Tech name — bumped from 0.78rem */}
                <span style={{
                  fontFamily: 'Cinzel, Georgia, serif',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#D4D4DC',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  {tech.name}
                </span>
                {/* Category — bumped from 0.5rem */}
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.68rem',
                  fontWeight: 500,
                  color: '#8A8A94',
                  letterSpacing: '0.06em',
                  marginTop: 2,
                }}>
                  {tech.category}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Development Gear ── */}
        <div>
          <p style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#A8A8B0',
            marginBottom: 12,
          }}>
            DEVELOPMENT GEAR
          </p>

          <div className="grid grid-cols-2 gap-2">
            {SETUP.map((tool, i) => (
              <motion.div
                key={tool.name}
                className="flex items-center gap-3 panel"
                style={{
                  padding: '12px 14px',
                  borderColor: 'rgba(168,168,176,0.2)',
                  clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
                onMouseEnter={() => playHover()}
              >
                {/* Tool name — bumped from 0.75rem */}
                <span style={{
                  fontFamily: 'Cinzel, Georgia, serif',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: '#D4D4DC',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  {tool.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Language Proficiency ── */}
        <div className="pb-4 md:pb-8">
          <p style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#A8A8B0',
            marginBottom: 12,
          }}>
            LANGUAGE PROFICIENCY
          </p>

          <div className="flex flex-col gap-1">
            {LANGUAGES.map((lang, i) => (
              <motion.div
                key={lang.lang}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <div className="flex justify-between items-center py-3 border-b border-[#A8A8B0]/10">
                  {/* Language name — bumped from 0.85rem */}
                  <span style={{
                    fontFamily: 'Cinzel, Georgia, serif',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: '#D4D4DC',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>
                    {lang.lang}
                  </span>
                  {/* Level — bumped from 0.75rem */}
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#A8A8B0',
                    letterSpacing: '0.08em',
                  }}>
                    {lang.level}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}