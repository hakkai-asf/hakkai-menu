'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/lib/contexts/AudioContext';

// ─── Silver palette (ProjectsSection exact) ───────────────────────────────────
const clip4 = 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)';
const clip6 = 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)';
const FONT_CINZEL = '"Cinzel", "Georgia", serif';
const FONT_MONO   = '"JetBrains Mono", "Courier New", monospace';
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'frontend',
    label: 'Frontend Development',
    shortLabel: 'Frontend',
    code: 'ATTR-FE',
    skills: [
      { name: 'React / Next.js' },
      { name: 'TypeScript' },
      { name: 'Tailwind CSS' },
      { name: 'HTML / CSS' },
      { name: 'JavaScript' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend Development',
    shortLabel: 'Backend',
    code: 'ATTR-BE',
    skills: [
      { name: 'Supabase' },
      { name: 'REST APIs' },
      { name: 'Node.js' },
      { name: 'Database Design' },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile Development',
    shortLabel: 'Mobile',
    code: 'ATTR-MOB',
    skills: [
      { name: 'Android Dev (Java)' },
      { name: 'Android Studio' },
      { name: 'React Native' },
    ],
  },
  {
    id: 'uiux',
    label: 'UI/UX Design',
    shortLabel: 'UI/UX',
    code: 'ATTR-UX',
    skills: [
      { name: 'UI Design' },
      { name: 'Responsive Design' },
      { name: 'Photoshop' },
      { name: 'User Research' },
    ],
  },
  {
    id: 'db',
    label: 'Database Management',
    shortLabel: 'Database',
    code: 'ATTR-DB',
    skills: [
      { name: 'PostgreSQL' },
      { name: 'Supabase DB' },
      { name: 'SQL' },
    ],
  },
  {
    id: 'system',
    label: 'System Design',
    shortLabel: 'System',
    code: 'ATTR-SYS',
    skills: [
      { name: 'Architecture' },
      { name: 'Version Control' },
      { name: 'GitHub' },
    ],
  },
  {
    id: 'problem',
    label: 'Problem Solving',
    shortLabel: 'Problem',
    code: 'ATTR-PS',
    skills: [
      { name: 'Algorithms' },
      { name: 'Debugging' },
      { name: 'System Thinking' },
    ],
  },
];

/* ── Ornate divider — verbatim from ProjectsSection ── */
function OrnateDivider() {
  return (
    <div className="flex items-center justify-center my-3 w-full" style={{ opacity: 0.6 }}>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #A8A8B0, transparent)' }} />
      <span
        className="mx-2 text-[8px] border p-[2px] leading-none flex items-center justify-center transform rotate-45"
        style={{ color: '#A8A8B0', borderColor: 'rgba(168,168,176,0.4)' }}
      >◈</span>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #A8A8B0, transparent)' }} />
    </div>
  );
}

export default function SkillsSection() {
  const { playHover, playToggle } = useAudio();
  const [activeCategory, setActiveCategory] = useState('frontend');

  const cat = CATEGORIES.find(c => c.id === activeCategory)!;

  const handleSelect = (id: string) => {
    setActiveCategory(id);
    playToggle();
  };

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col md:flex-row overflow-hidden max-md:!pl-0 md:pl-[clamp(280px,30vw,400px)] pt-16 md:pt-0"
      style={{ background: '#050505', color: '#D4D4DC' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Ambient radial glow */}
      <div style={{
        position: 'fixed', top: '40%', left: '55%',
        width: '60vw', height: '60vw', borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(168,168,176,0.03) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ══════════════════════════════════════════
          MOBILE LAYOUT
      ══════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 overflow-hidden md:hidden relative z-10">

        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-4 pb-2">
          <h2 style={{
            fontFamily:    FONT_CINZEL,
            fontWeight:    400,
            fontSize:      '1.05rem',
            letterSpacing: '0.18em',
            color:         '#D4D4DC',
            textTransform: 'uppercase',
            textShadow:    '0 0 20px rgba(212,212,220,0.15)',
            marginBottom:  4,
          }}>
            Character Build
          </h2>
          <p style={{
            fontFamily:    FONT_MONO,
            fontSize:      '0.62rem',
            letterSpacing: '0.14em',
            color:         '#9A9AA4',
            textTransform: 'uppercase',
          }}>
            Select Attribute
          </p>
          <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(168,168,176,0.4), transparent)', marginTop: 8 }} />
        </div>

        {/* Horizontal scrolling tabs — silver underline style */}
        <div
          className="flex-shrink-0 flex items-stretch overflow-x-auto px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map(c => {
            const isActive = activeCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                onMouseEnter={() => playHover()}
                className="flex-shrink-0 transition-all duration-150 px-3 py-2.5"
                style={{
                  fontFamily:      FONT_CINZEL,
                  fontWeight:      400,
                  fontSize:        '0.65rem',
                  letterSpacing:   '0.07em',
                  textTransform:   'uppercase',
                  color:           isActive ? '#D4D4DC' : '#5A5A6E',
                  borderBottom:    `2px solid ${isActive ? '#A8A8B0' : 'transparent'}`,
                  background:      isActive ? 'rgba(212,212,220,0.05)' : 'transparent',
                  border:          'none',
                  whiteSpace:      'nowrap',
                  cursor:          'pointer',
                  transition:      'all 0.15s',
                }}
              >
                {c.shortLabel}
              </button>
            );
          })}
        </div>

        {/* Silver rule under tabs */}
        <div className="flex-shrink-0 mx-4" style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(168,168,176,0.2), transparent)' }} />

        {/* Skills panel */}
        <div className="flex-1 overflow-y-auto scrollable px-4 pt-4 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              {/* Category header card — mirrors DetailPanel header */}
              <div
                style={{
                  position:     'relative',
                  background:   'rgba(4,4,6,0.7)',
                  border:       '1px solid rgba(168,168,176,0.2)',
                  borderTop:    '2px solid #A8A8B0',
                  clipPath:     clip6,
                  padding:      '14px 16px',
                  marginBottom: 12,
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse at top left, rgba(168,168,176,0.05) 0%, transparent 60%)',
                  pointerEvents: 'none',
                }} />
                <p style={{
                  fontFamily:    FONT_MONO,
                  fontSize:      '0.62rem',
                  letterSpacing: '0.2em',
                  color:         '#9A9AA4',
                  textTransform: 'uppercase',
                  marginBottom:  5,
                }}>
                  {cat.code} &bull; ATTRIBUTE MODULE
                </p>
                <h2 style={{
                  fontFamily:    FONT_CINZEL,
                  fontWeight:    400,
                  fontSize:      'clamp(1.1rem, 4vw, 1.35rem)',
                  color:         '#D4D4DC',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  textShadow:    '0 0 16px rgba(212,212,220,0.15)',
                }}>
                  {cat.label}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span style={{
                    fontFamily:    FONT_MONO,
                    fontSize:      '0.62rem',
                    letterSpacing: '0.15em',
                    border:        '1px solid rgba(109,200,122,0.3)',
                    color:         '#6DC87A',
                    background:    'rgba(109,200,122,0.05)',
                    padding:       '2px 8px',
                    textTransform: 'uppercase',
                    clipPath:      clip4,
                  }}>
                    EQUIPPED
                  </span>
                  <span style={{
                    fontFamily:    FONT_MONO,
                    fontSize:      '0.62rem',
                    letterSpacing: '0.15em',
                    border:        '1px solid rgba(168,168,176,0.25)',
                    color:         '#9A9AA4',
                    padding:       '2px 8px',
                    textTransform: 'uppercase',
                    clipPath:      clip4,
                  }}>
                    {cat.skills.length} SKILLS
                  </span>
                </div>
              </div>

              {/* Skill rows — styled like attribute bar rows in ProjectsSection */}
              <div
                style={{
                  background: 'rgba(6,6,8,0.85)',
                  border:     '1px solid rgba(168,168,176,0.12)',
                  padding:    '12px 14px',
                  clipPath:   clip6,
                }}
              >
                {cat.skills.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    className="flex items-center justify-between"
                    style={{
                      padding:      '10px 0',
                      borderBottom: i < cat.skills.length - 1
                        ? '1px solid rgba(168,168,176,0.07)'
                        : 'none',
                    }}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.06 }}
                    onMouseEnter={() => playHover()}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#7A7A84', fontSize: '0.7rem', flexShrink: 0 }}>◈</span>
                      <span style={{
                        fontFamily:    FONT_CINZEL,
                        fontWeight:    400,
                        fontSize:      '0.92rem',
                        color:         '#D4D4DC',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}>
                        {skill.name}
                      </span>
                    </div>
                    <span style={{
                      fontFamily:    FONT_MONO,
                      fontSize:      '0.62rem',
                      letterSpacing: '0.15em',
                      border:        '1px solid rgba(109,200,122,0.3)',
                      color:         '#6DC87A',
                      background:    'rgba(109,200,122,0.05)',
                      padding:       '2px 7px',
                      textTransform: 'uppercase',
                      clipPath:      clip4,
                      flexShrink:    0,
                    }}>
                      ACTIVE
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP LAYOUT
      ══════════════════════════════════════════ */}
      <div className="hidden md:flex flex-row flex-1 overflow-hidden relative z-10">

        {/* ── Left: Category sidebar — matches project list panel ── */}
        <motion.div
          className="flex flex-col py-8 pl-8 pr-4 flex-shrink-0"
          style={{ width: 'clamp(220px, 26vw, 300px)' }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Heading */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{
              fontFamily:    FONT_CINZEL,
              fontWeight:    400,
              fontSize:      '1.3rem',
              letterSpacing: '0.18em',
              color:         '#D4D4DC',
              textTransform: 'uppercase',
              textShadow:    '0 0 20px rgba(212,212,220,0.15)',
              marginBottom:  4,
            }}>
              Character Build
            </h2>
            <p style={{
              fontFamily:    FONT_MONO,
              fontSize:      '0.72rem',
              letterSpacing: '0.14em',
              color:         '#9A9AA4',
              textTransform: 'uppercase',
              marginBottom:  10,
            }}>
              Select Attribute
            </p>
            <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(168,168,176,0.4), transparent)' }} />
          </div>

          {/* Category list — matches project list item buttons */}
          <div
            className="flex flex-col gap-1.5 flex-1 overflow-y-auto scrollable"
            style={{
              background: 'rgba(6,6,8,0.6)',
              border:     '1px solid rgba(168,168,176,0.1)',
              padding:    '0.75rem',
              clipPath:   clip6,
            }}
          >
            {CATEGORIES.map((c, i) => {
              const isActive = activeCategory === c.id;
              return (
                <motion.button
                  key={c.id}
                  className="flex items-center gap-3 p-2.5 text-left w-full transition-all duration-200"
                  style={{
                    background: isActive ? 'rgba(212,212,220,0.06)' : 'rgba(4,4,6,0.7)',
                    border:     `1px solid ${isActive ? 'rgba(212,212,220,0.2)' : 'rgba(168,168,176,0.18)'}`,
                    clipPath:   clip4,
                    boxShadow:  isActive ? '0 0 12px rgba(212,212,220,0.07)' : 'none',
                    cursor:     'pointer',
                  }}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                  onClick={() => handleSelect(c.id)}
                  onMouseEnter={() => playHover()}
                >
                  {/* Numeral circle — mirrors project list */}
                  <div style={{
                    width:          30, height: 30,
                    borderRadius:   '50%',
                    border:         `1px solid ${isActive ? 'rgba(212,212,220,0.3)' : 'rgba(168,168,176,0.12)'}`,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    flexShrink:     0,
                    background:     isActive ? 'rgba(212,212,220,0.06)' : 'rgba(4,4,6,0.7)',
                    transition:     'all 0.15s',
                  }}>
                    <span style={{
                      fontFamily: FONT_MONO,
                      fontSize:   '0.55rem',
                      color:      isActive ? '#D4D4DC' : '#5A5A6E',
                      letterSpacing: '0.05em',
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="truncate block" style={{
                      fontFamily:    FONT_CINZEL,
                      fontSize:      '0.82rem',
                      color:         isActive ? '#D4D4DC' : '#5A5A6E',
                      letterSpacing: '0.06em',
                      fontWeight:    400,
                      transition:    'color 0.15s',
                    }}>
                      {c.label}
                    </span>
                    <p style={{
                      fontFamily:    FONT_MONO,
                      fontSize:      '0.58rem',
                      color:         '#7A7A84',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginTop:     2,
                    }}>
                      {c.code} &bull; {c.skills.length} skills
                    </p>
                  </div>

                  {isActive && (
                    <span style={{ color: '#A8A8B0', fontSize: '1rem', flexShrink: 0 }}>◈</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Right: Skills detail panel ── */}
        <motion.div
          className="flex-1 py-8 pr-8 pl-4 overflow-y-auto scrollable"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              {/* Header card — exact DetailPanel header pattern */}
              <div
                style={{
                  position:  'relative',
                  background: 'rgba(4,4,6,0.7)',
                  border:     '1px solid rgba(168,168,176,0.2)',
                  borderTop:  '2px solid #A8A8B0',
                  clipPath:   clip6,
                  padding:    '18px 20px',
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse at top left, rgba(168,168,176,0.05) 0%, transparent 60%)',
                  pointerEvents: 'none',
                }} />

                <div className="flex justify-between items-start gap-3 relative">
                  <div className="min-w-0">
                    <p style={{
                      fontFamily:    FONT_MONO,
                      fontSize:      '0.72rem',
                      letterSpacing: '0.2em',
                      color:         '#9A9AA4',
                      textTransform: 'uppercase',
                      marginBottom:  '0.4rem',
                    }}>
                      {cat.code} &bull; ATTRIBUTE MODULE &bull; {cat.skills.length} SKILLS
                    </p>
                    <h2 style={{
                      fontFamily:    FONT_CINZEL,
                      fontWeight:    400,
                      fontSize:      'clamp(1.6rem, 3vw, 2.1rem)',
                      color:         '#D4D4DC',
                      letterSpacing: '0.06em',
                      lineHeight:    1.15,
                      textShadow:    '0 0 20px rgba(212,212,220,0.15)',
                    }}>
                      {cat.label}
                    </h2>
                  </div>

                  {/* Badges — rarity + status */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span style={{
                      fontFamily:    FONT_MONO,
                      fontSize:      '0.65rem',
                      letterSpacing: '0.15em',
                      border:        '1px solid rgba(168,168,176,0.3)',
                      color:         '#A8A8B0',
                      padding:       '2px 8px',
                      textTransform: 'uppercase',
                      clipPath:      clip4,
                    }}>
                      PASSIVE
                    </span>
                    <span style={{
                      fontFamily:    FONT_MONO,
                      fontSize:      '0.65rem',
                      letterSpacing: '0.15em',
                      border:        '1px solid rgba(109,200,122,0.3)',
                      color:         '#6DC87A',
                      background:    'rgba(109,200,122,0.05)',
                      padding:       '2px 8px',
                      textTransform: 'uppercase',
                      clipPath:      clip4,
                    }}>
                      EQUIPPED
                    </span>
                  </div>
                </div>

                <OrnateDivider />

                {/* Lore-style description */}
                <p style={{
                  fontFamily: FONT_CINZEL,
                  fontSize:   '0.82rem',
                  color:      '#AEAEB8',
                  fontStyle:  'italic',
                  lineHeight: 1.75,
                  paddingLeft: '0.75rem',
                  borderLeft: '2px solid rgba(168,168,176,0.25)',
                }}>
                  &ldquo;A cluster of {cat.skills.length} active capabilities under the {cat.label} discipline. Each skill grants passive bonuses to project quality and execution speed.&rdquo;
                </p>
              </div>

              {/* Skill list — styled as "Passive Effects" card from ProjectsSection */}
              <div style={{
                background: 'rgba(6,6,8,0.85)',
                border:     '1px solid rgba(168,168,176,0.12)',
                padding:    '14px 16px',
                clipPath:   clip6,
              }}>
                <p style={{
                  fontFamily:    FONT_MONO,
                  fontSize:      '0.72rem',
                  letterSpacing: '0.18em',
                  color:         '#9A9AA4',
                  textTransform: 'uppercase',
                  marginBottom:  '0.625rem',
                  paddingBottom: '0.375rem',
                  borderBottom:  '1px solid rgba(168,168,176,0.08)',
                }}>
                  Passive Skill Loadout
                </p>

                <div className="flex flex-col">
                  {cat.skills.map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      className="flex items-center justify-between"
                      style={{
                        padding:      '11px 0',
                        borderBottom: i < cat.skills.length - 1
                          ? '1px solid rgba(168,168,176,0.07)'
                          : 'none',
                      }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.07 }}
                      onMouseEnter={() => playHover()}
                    >
                      <div className="flex items-center gap-3">
                        <span style={{ color: '#7A7A84', fontSize: '0.72rem', flexShrink: 0 }}>◈</span>
                        <span style={{
                          fontFamily:    FONT_CINZEL,
                          fontWeight:    400,
                          fontSize:      '0.95rem',
                          color:         '#C8C8D0',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          lineHeight:    1.6,
                        }}>
                          {skill.name}
                        </span>
                      </div>

                      <span style={{
                        fontFamily:    FONT_MONO,
                        fontSize:      '0.65rem',
                        letterSpacing: '0.15em',
                        border:        '1px solid rgba(109,200,122,0.3)',
                        color:         '#6DC87A',
                        background:    'rgba(109,200,122,0.05)',
                        padding:       '2px 8px',
                        textTransform: 'uppercase',
                        clipPath:      clip4,
                        flexShrink:    0,
                      }}>
                        ACTIVE
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tech tag chips — one per skill, same style as ProjectsSection */}
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map(s => (
                  <span key={s.name} style={{
                    fontFamily:    FONT_MONO,
                    fontSize:      '0.68rem',
                    letterSpacing: '0.12em',
                    color:         '#A8A8B4',
                    border:        '1px solid rgba(168,168,176,0.22)',
                    padding:       '4px 10px',
                    clipPath:      clip4,
                    textTransform: 'uppercase',
                  }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}