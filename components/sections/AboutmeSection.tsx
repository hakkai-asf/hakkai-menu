'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/lib/contexts/AudioContext';

const clip4 = 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)';
const clip6 = 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)';
const clip8 = 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0% calc(100% - 8px), 0% 8px)';

const FONT_CINZEL = '"Cinzel", "Georgia", serif';
const FONT_MONO   = '"JetBrains Mono", "Courier New", monospace';
const FONT_RAJ    = '"Rajdhani", "Georgia", sans-serif';

const HOBBIES = [
  { id: 'photography',  title: 'Photography',       desc: 'Capturing moments, framing unique perspectives, and telling stories through still images.' },
  { id: 'filmmaking',   title: 'Film Making',        desc: 'Bringing concepts to life through motion, sound, and visual storytelling.' },
  { id: 'baseball',     title: 'Baseball',           desc: 'Baseball taught patience, teamwork, and the art of reading the game.' },
  { id: 'gaming',       title: 'Gaming',             desc: 'Exploring interactive worlds, testing strategies, and unwinding through digital adventures.' },
  { id: 'coffee',       title: 'Coffee',             desc: 'Appreciating the craft of the brew and the quiet focus a good cup brings.' },
  { id: 'videoediting', title: 'Video Editing',      desc: 'Cutting footage, building narratives, and making content that communicates beyond words.' },
  { id: 'design',       title: 'Digital Design',     desc: 'From Photoshop banners to web mockups — designing visuals that are clean, intentional, and memorable.' },
  { id: 'fashion',      title: 'Fashion & Modeling', desc: 'Streetwear culture runs deep — curating fits, exploring style, and expressing identity through clothing.' },
  { id: 'exploring',    title: 'Exploring',          desc: 'Discovering new places, foods, and cultures around the Philippines — perspective builds creativity.' },
];

const CREDENTIALS = [
  { code: 'EDU-01', label: 'Current Institution', value: 'National University — Manila' },
  { code: 'EDU-02', label: 'Year Level',           value: '3rd Year' },
  { code: 'EDU-03', label: 'Program',              value: 'BS Information Technology' },
  { code: 'EDU-04', label: 'Specialization',       value: 'Full-Stack Development' },
  { code: 'EDU-05', label: 'Senior High School',   value: 'AMA Computer College' },
  { code: 'EDU-06', label: 'Graduation Rank',      value: '1st / 400 — Valedictorian' },
  { code: 'EDU-07', label: 'Scholar',              value: 'SM Foundation Scholar' },
  { code: 'EDU-08', label: 'Location',             value: 'Metro Manila, Philippines' },
];

export default function AboutmeSection() {
  const { playHover, playSelect } = useAudio();
  const [hoveredHobby, setHoveredHobby] = useState<string | null>(null);

  return (
    <motion.div
      className="fixed inset-0 z-10 overflow-y-auto scrollable max-md:!pl-0 md:pl-[clamp(280px,30vw,400px)]"
      style={{ background: '#050508', color: '#FFFFFF' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Subtle ambient */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse at 60% 20%, rgba(168,168,176,0.03) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div className="relative z-10 flex flex-col items-center px-4 md:px-10 pt-8 pb-20 md:pt-10">

        {/* ── TOP LABEL ── */}
        <motion.div
          className="w-full max-w-3xl flex items-center gap-3 mb-8"
          style={{ fontFamily: FONT_MONO }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ width: 24, height: 1, background: '#FFFFFF' }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.24em', color: '#FFFFFF', fontWeight: 700 }}>
            SUBJECT FILE — PERSONAL DOSSIER
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
          <span style={{ fontSize: '0.58rem', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
            CLEARANCE: OPEN
          </span>
        </motion.div>

        {/* ── PHOTO CENTERED ── */}
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {/* Chrome frame */}
          <div style={{
            position: 'relative',
            width: 'clamp(140px, 22vw, 200px)',
          }}>
            <div style={{
              clipPath: clip8,
              background: 'linear-gradient(140deg, #D4D4DC 0%, #686870 45%, #C8C8D0 100%)',
              padding: 2,
            }}>
              <div style={{ clipPath: clip8, background: '#0A0A0E', padding: 3 }}>
                <img
                  src="/about me/HARRY 2X2.jpg"
                  alt="Harry Nielsen M. Lagto"
                  style={{
                    clipPath: clip8,
                    width: '100%',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    display: 'block',
                    filter: 'contrast(1.08) saturate(0.9)',
                  }}
                />
              </div>
            </div>

            {/* Scan lines */}
            <div style={{
              position: 'absolute', inset: 0, clipPath: clip8,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)',
              pointerEvents: 'none',
            }} />

            {/* Corner brackets */}
            {[
              { top: -5, left: -5, borderTop: '2px solid #FFFFFF', borderLeft: '2px solid #FFFFFF' },
              { top: -5, right: -5, borderTop: '2px solid #FFFFFF', borderRight: '2px solid #FFFFFF' },
              { bottom: -5, left: -5, borderBottom: '2px solid #FFFFFF', borderLeft: '2px solid #FFFFFF' },
              { bottom: -5, right: -5, borderBottom: '2px solid #FFFFFF', borderRight: '2px solid #FFFFFF' },
            ].map((s, i) => (
              <div key={i} style={{ position: 'absolute', width: 14, height: 14, ...s }} />
            ))}

            {/* ID strip */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              clipPath: clip8,
              background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%)',
              padding: '16px 10px 7px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: '0.5rem', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>SUBJECT ID</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: '0.5rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)' }}>HNL-001</span>
            </div>
          </div>

          {/* Status pill */}
          <div style={{
            marginTop: 10,
            clipPath: clip4,
            background: 'rgba(126,232,154,0.08)',
            border: '1px solid rgba(126,232,154,0.45)',
            padding: '6px 16px',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7EE89A', boxShadow: '0 0 8px #7EE89A' }} />
            <span style={{ fontFamily: FONT_MONO, fontSize: '0.6rem', letterSpacing: '0.18em', color: '#7EE89A', fontWeight: 700 }}>AVAILABLE FOR WORK</span>
          </div>
        </motion.div>

        {/* ── NAME & ROLE centered ── */}
        <motion.div
          className="flex flex-col items-center text-center mb-6 w-full max-w-3xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 style={{
            fontFamily: FONT_CINZEL,
            fontSize: 'clamp(2rem, 6vw, 3.8rem)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            lineHeight: 1.05,
            color: '#FFFFFF',
            marginBottom: '0.2em',
            textShadow: '0 0 40px rgba(255,255,255,0.12)',
          }}>
            Harry Nielsen M. Lagto
          </h1>

          <p style={{
            fontFamily: FONT_MONO,
            fontSize: 'clamp(0.65rem, 1.4vw, 0.82rem)',
            fontWeight: 700,
            letterSpacing: '0.3em',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            marginBottom: '1.4em',
            opacity: 0.75,
          }}>
            Aspiring Full-Stack Developer
          </p>

          {/* Divider */}
          <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', marginBottom: '1.5em' }} />

          {/* Bio */}
          <p style={{
            fontFamily: FONT_RAJ,
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            fontWeight: 700,
            lineHeight: 1.8,
            color: '#FFFFFF',
            maxWidth: 680,
          }}>
            I am Harry Nielsen M. Lagto, an aspiring full-stack developer and a current 3rd Year student at National University - Manila. I graduated as the valedictorian of my senior high school batch, ranking 1st out of 400 students at AMA Computer College, and I am proud to be an SM Foundation Scholar, which has made my college journey possible. I balance my technical pursuits with a variety of creative passions that shape how I approach problem-solving and design.
          </p>
        </motion.div>

        {/* ── CREDENTIALS GRID ── */}
        <motion.div
          className="w-full max-w-3xl mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Section label */}
          <div className="flex items-center gap-3 mb-4" style={{ fontFamily: FONT_MONO }}>
            <div style={{ width: 24, height: 1, background: '#FFFFFF' }} />
            <span style={{ fontSize: '0.62rem', letterSpacing: '0.24em', color: '#FFFFFF', fontWeight: 700 }}>CREDENTIALS</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
            gap: 1,
            background: 'rgba(255,255,255,0.08)',
            clipPath: clip6,
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            {CREDENTIALS.map((c, i) => (
              <motion.div
                key={i}
                style={{ background: '#07070B', padding: '12px 16px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 + i * 0.04 }}
              >
                <div style={{
                  fontFamily: FONT_MONO, fontSize: '0.55rem', letterSpacing: '0.2em',
                  color: 'rgba(255,255,255,0.45)', fontWeight: 700, marginBottom: 4,
                  textTransform: 'uppercase',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.25)', marginRight: 6 }}>{c.code}</span>
                  {c.label}
                </div>
                <div style={{
                  fontFamily: FONT_RAJ, fontSize: '1rem', fontWeight: 800,
                  color: '#FFFFFF', letterSpacing: '0.02em',
                }}>
                  {c.value}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── INTERESTS & HOBBIES ── */}
        <motion.div
          className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          {/* Section label */}
          <div className="flex items-center gap-3 mb-6" style={{ fontFamily: FONT_MONO }}>
            <div style={{ width: 24, height: 1, background: '#FFFFFF' }} />
            <span style={{ fontSize: '0.62rem', letterSpacing: '0.24em', color: '#FFFFFF', fontWeight: 700 }}>INTERESTS & HOBBIES</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: 8,
          }}>
            {HOBBIES.map((hobby, i) => {
              const isHovered = hoveredHobby === hobby.id;
              return (
                <motion.div
                  key={hobby.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
                  onMouseEnter={() => { setHoveredHobby(hobby.id); playHover(); }}
                  onMouseLeave={() => setHoveredHobby(null)}
                  onClick={() => playSelect()}
                  style={{
                    clipPath: clip4,
                    background: isHovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isHovered ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)'}`,
                    padding: '14px 16px 14px 20px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.18s ease',
                    cursor: 'default',
                  }}
                >
                  {/* Left accent bar */}
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: isHovered ? 3 : 1,
                    background: isHovered
                      ? 'linear-gradient(180deg, #FFFFFF, rgba(255,255,255,0.5))'
                      : 'rgba(255,255,255,0.18)',
                    transition: 'all 0.18s ease',
                  }} />

                  {/* Index */}
                  <div style={{
                    position: 'absolute', top: 10, right: 12,
                    fontFamily: FONT_MONO, fontSize: '0.58rem', fontWeight: 700,
                    color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  <h3 style={{
                    fontFamily: FONT_CINZEL,
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    letterSpacing: '0.07em',
                    color: '#FFFFFF',
                    marginBottom: 5,
                    textTransform: 'uppercase',
                  }}>
                    {hobby.title}
                  </h3>
                  <p style={{
                    fontFamily: FONT_RAJ,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    lineHeight: 1.55,
                    color: isHovered ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
                    margin: 0,
                    transition: 'color 0.18s ease',
                  }}>
                    {hobby.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="h-10" />
      </div>
    </motion.div>
  );
}