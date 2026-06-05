'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/lib/contexts/AudioContext';
import CharacterViewer from '@/components/Character/CharacterViewer';

const ACHIEVEMENTS = [
  { title: "Dean's Lister", desc: 'Academic excellence recognition' },
  { title: 'Batch Valedictorian', desc: 'Top graduate of the batch' },
  { title: 'Best in System', desc: 'Outstanding system development' },
  { title: 'Best Research Presenter', desc: 'Research presentation excellence' },
  { title: 'SM Foundation Scholar', desc: 'Scholarship program passer' },
];

const STACK = [
  { name: 'Next.js', category: 'Framework' },
  { name: 'React', category: 'Library' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Supabase', category: 'Backend' },
  { name: 'Java', category: 'Language' },
  { name: 'Android Dev', category: 'Platform' },
];

const SETUP = [
  { name: 'Visual Studio Code' },
  { name: 'Android Studio' },
  { name: 'GitHub' },
  { name: 'Photoshop' },
];

const LANGUAGES = [
  { lang: 'Filipino', level: 'Native' },
  { lang: 'English', level: 'Fluent' },
];

function OrnateDivider() {
  return (
    <div className="flex items-center justify-center my-3 w-full opacity-70">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C8A96E] to-transparent" />
      <span className="mx-2 text-[#C8A96E] text-[8px] transform rotate-45 border border-[#C8A96E]/50 p-[2px] leading-none flex items-center justify-center">◈</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C8A96E] to-transparent" />
    </div>
  );
}

export default function ProfileSection() {
  const { playHover, playToggle } = useAudio();
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const rotate = (dir: number) => { setRotation(r => r + dir * 30); playToggle(); };
  const zoomIn = () => { setZoom(z => Math.min(1.4, z + 0.1)); playToggle(); };
  const zoomOut = () => { setZoom(z => Math.max(0.7, z - 0.1)); playToggle(); };
  const reset = () => { setRotation(0); setZoom(1); playToggle(); };

  return (
    <motion.div
      className={`fixed inset-0 z-10 flex flex-col md:flex-row bg-[#0a0a0c] text-[#E8E0D4] max-md:!pl-0 md:pl-[clamp(280px,30vw,400px)] pt-20 md:pt-0 ${
        isMobile ? 'overflow-y-auto scrollable' : 'overflow-hidden'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Character viewer column */}
      <motion.div
        className="flex flex-col items-center justify-center flex-shrink-0 relative"
        style={{ width: isMobile ? '100%' : 'clamp(300px, 35vw, 440px)', paddingBottom: isMobile ? 20 : 40 }}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Character — fixed-height box so the WebGL canvas has dimensions */}
        <div style={{ width: '100%', height: isMobile ? 330 : 480, position: 'relative' }}>
          <CharacterViewer mode="profile" rotation={rotation} zoom={zoom} onRotate={d => setRotation(r => r + d)} />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-4">
          {[
            { label: '↺', action: () => rotate(-1), tip: 'Rotate Left' },
            { label: '↻', action: () => rotate(1), tip: 'Rotate Right' },
            { label: '+', action: zoomIn, tip: 'Zoom In' },
            { label: '−', action: zoomOut, tip: 'Zoom Out' },
            { label: '⊙', action: reset, tip: 'Reset' },
          ].map(({ label, action, tip }) => (
            <button
              key={tip}
              onClick={action}
              onMouseEnter={() => playHover()}
              title={tip}
              className="btn-ghost"
              style={{ padding: '6px 12px', fontSize: '0.85rem', minWidth: 36 }}
            >
              {label}
            </button>
          ))}
        </div>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.5rem', color: '#C8A96E', letterSpacing: '0.1em', marginTop: 8 }}>
          DRAG TO ROTATE
        </p>
      </motion.div>

      {/* Data panel column */}
      <motion.div
        className={isMobile ? "flex-grow px-4 pb-16 flex flex-col gap-6" : "flex-1 overflow-y-auto scrollable py-8 pr-6 flex flex-col gap-6"}
        style={{ paddingLeft: isMobile ? 16 : 32 }}
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Operator header */}
        <div className="panel clip-corner-br" style={{
          padding: '20px 24px',
          borderColor: 'rgba(200, 169, 110, 0.2)',
          clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
        }}>
          <p className="section-label mb-1">OPERATOR FILE</p>
          <OrnateDivider />
          <h1 style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '1.75rem', fontWeight: 400, color: '#E8C98E', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.1 }}>
            Harry Nielsen M. Lagto
          </h1>
          <p style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '0.88rem', color: '#C8A96E', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>
            Aspiring Fullstack Developer
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            {[
              ['LOCATION', 'Metro Manila, Philippines'],
              ['STATUS', null],
              ['EDUCATION', 'BS Information Technology'],
              ['INSTITUTION', 'National University'],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="hud-label">{label}</div>
                {label === 'STATUS'
                  ? <div className="status-available mt-1" style={{ fontSize: '0.68rem' }}>AVAILABLE FOR WORK</div>
                  : <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#E8E0D4', marginTop: 2 }}>{value}</div>
                }
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <p className="section-label mb-3">ACHIEVEMENTS UNLOCKED</p>
          <div className="grid grid-cols-1 gap-2">
            {ACHIEVEMENTS.map((ach, i) => (
              <motion.div
                key={ach.title}
                className="achievement-badge flex items-center gap-4"
                style={{
                  clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
                  borderColor: 'rgba(200, 169, 110, 0.2)',
                  background: 'rgba(10, 10, 12, 0.6)',
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.07 }}
                onMouseEnter={() => playHover()}
              >
                <div>
                  <p style={{ fontFamily: 'Cinzel, Georgia, serif', fontWeight: 400, fontSize: '0.85rem', color: '#E8C98E', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {ach.title}
                  </p>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', color: '#E8E0D4', marginTop: 1 }}>
                    {ach.desc}
                  </p>
                </div>
                <span className="ml-auto" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.5rem', color: '#C8A96E', opacity: 0.5 }}>UNLOCKED</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Favorite Stack */}
        <div>
          <p className="section-label mb-3">EQUIPPED TECHNOLOGIES</p>
          <div className="flex flex-wrap gap-2">
            {STACK.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: 0.4 + i * 0.05 }}
                className="flex flex-col"
                style={{
                  background: 'rgba(200,169,110,0.06)',
                  border: '1px solid rgba(200,169,110,0.2)',
                  padding: '8px 12px',
                  clipPath: 'polygon(6px 0%,100% 0%,100% calc(100% - 6px),calc(100% - 6px) 100%,0% 100%,0% 6px)'
                }}
                onMouseEnter={() => playHover()}
              >
                <span style={{ fontFamily: 'Cinzel, Georgia, serif', fontWeight: 400, fontSize: '0.8rem', color: '#C8A96E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{tech.name}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.5rem', color: '#E8E0D4', letterSpacing: '0.05em' }}>{tech.category}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dev Setup */}
        <div>
          <p className="section-label mb-3">DEVELOPMENT GEAR</p>
          <div className="grid grid-cols-2 gap-2">
            {SETUP.map((tool, i) => (
              <motion.div
                key={tool.name}
                className="flex items-center gap-3 panel"
                style={{
                  padding: '10px 14px',
                  borderColor: 'rgba(200, 169, 110, 0.2)',
                  clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
                onMouseEnter={() => playHover()}
              >
                <span style={{ fontFamily: 'Cinzel, Georgia, serif', fontWeight: 400, fontSize: '0.8rem', color: '#E8E0D4', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="pb-8">
          <p className="section-label mb-3">LANGUAGE PROFICIENCY</p>
          <div className="flex flex-col gap-3">
            {LANGUAGES.map((lang, i) => (
              <motion.div key={lang.lang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.1 }}>
                <div className="flex justify-between items-center py-2 border-b border-[#C8A96E]/10">
                  <span style={{ fontFamily: 'Cinzel, Georgia, serif', fontWeight: 400, fontSize: '0.85rem', color: '#E8C98E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{lang.lang}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#C8A96E' }}>{lang.level}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
