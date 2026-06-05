'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/lib/contexts/AudioContext';

const CATEGORIES = [
  {
    id: 'frontend',
    label: 'Frontend Development',
    color: '#C8A96E',
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
    color: '#C8A96E',
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
    color: '#C8A96E',
    skills: [
      { name: 'Android Dev (Java)' },
      { name: 'Android Studio' },
      { name: 'React Native' },
    ],
  },
  {
    id: 'uiux',
    label: 'UI/UX Design',
    color: '#C8A96E',
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
    color: '#C8A96E',
    skills: [
      { name: 'PostgreSQL' },
      { name: 'Supabase DB' },
      { name: 'SQL' },
    ],
  },
  {
    id: 'system',
    label: 'System Design',
    color: '#C8A96E',
    skills: [
      { name: 'Architecture' },
      { name: 'Version Control' },
      { name: 'GitHub' },
    ],
  },
  {
    id: 'problem',
    label: 'Problem Solving',
    color: '#C8A96E',
    skills: [
      { name: 'Algorithms' },
      { name: 'Debugging' },
      { name: 'System Thinking' },
    ],
  },
];

export default function SkillsSection() {
  const { playHover, playToggle } = useAudio();
  const [activeCategory, setActiveCategory] = useState('frontend');

  const cat = CATEGORIES.find(c => c.id === activeCategory)!;

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col md:flex-row overflow-hidden bg-[#0a0a0c] text-[#E8E0D4] max-md:!pl-0 md:pl-[clamp(280px,30vw,400px)] pt-16 md:pt-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Category selector */}
      <motion.div
        className="flex flex-col py-8 px-4 md:pl-8 md:pr-3 flex-shrink-0 w-full md:w-[clamp(220px,26vw,300px)]"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-5">
          <p className="section-label mb-1">CHARACTER BUILD</p>
          <div className="rule-gold-left" style={{ width: 80 }} />
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', color: '#C8A96E', marginTop: 6, letterSpacing: '0.05em' }}>
            SELECT ATTRIBUTE
          </p>
        </div>

        <div className="flex flex-col gap-1">
          {CATEGORIES.map((c, i) => (
            <motion.button
              key={c.id}
              id={`skill-cat-${c.id}`}
              className={`text-left bg-transparent border-0 cursor-pointer py-3 px-3 group transition-all`}
              style={{
                borderLeft: `2px solid ${activeCategory === c.id ? c.color : 'transparent'}`,
                background: activeCategory === c.id ? `${c.color}08` : 'transparent',
                transition: 'all 0.15s',
              }}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              onClick={() => { setActiveCategory(c.id); playToggle(); }}
              onMouseEnter={() => playHover()}
            >
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: 'Cinzel, Georgia, serif', fontWeight: 400, fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: activeCategory === c.id ? '#E8C98E' : 'rgba(232,224,212,0.5)', transition: 'color 0.15s' }}>
                  {c.label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Skills panel */}
      <motion.div
        className="flex-1 py-8 px-4 md:pr-8 md:pl-6 overflow-y-auto scrollable"
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <motion.div key={activeCategory} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Category header */}
          <div className="panel clip-corner-tr mb-5" style={{
            padding: '18px 24px',
            borderColor: 'rgba(200, 169, 110, 0.2)',
            clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
          }}>
            <div>
              <p className="section-label mb-1">ATTRIBUTE MODULE</p>
              <h2 style={{ fontFamily: 'Cinzel, Georgia, serif', fontWeight: 400, fontSize: '1.5rem', color: '#E8C98E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {cat.label}
              </h2>
            </div>
          </div>

          {/* Skill List */}
          <div className="flex flex-col gap-3">
            {cat.skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                className="flex items-center justify-between py-3 border-b border-[#C8A96E]/10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                onMouseEnter={() => playHover()}
              >
                <span style={{
                  fontFamily: 'Cinzel, Georgia, serif',
                  fontWeight: 400,
                  fontSize: '0.95rem',
                  color: '#E8C98E',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}>
                  {skill.name}
                </span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  color: '#C8A96E',
                  letterSpacing: '0.05em'
                }}>
                  ACTIVE
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
