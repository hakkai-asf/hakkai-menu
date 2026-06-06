'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/lib/contexts/AudioContext';

interface Stat {
  label: string;
  value: number;
}

interface Project {
  id: string;
  num: string;
  code: string;
  name: string;
  category: string;
  type: string;
  status: string;
  rarity: 'LEGENDARY' | 'RARE' | 'UNCOMMON';
  rarityColor: string;
  weight: string;
  utility: string;
  lore: string;
  tech: string[];
  demo: string;
  features: string[];
  scaling: { attr: string; grade: string }[];
  reqs: { attr: string; value: number }[];
  stats: Stat[];
}

const PROJECTS: Project[] = [
  {
    id: 'lumostudy',
    num: 'Ⅰ',
    code: 'SPELL-LUMO',
    name: 'LumoStudy',
    category: 'Full Stack Focus Catalyst',
    type: 'Sorcery',
    status: 'ACTIVE',
    rarity: 'LEGENDARY',
    rarityColor: '#D4D4DC',
    weight: '7.5',
    utility: 'Imbues the scholar with a productivity barrier, monitoring focus thresholds and distraction anomalies.',
    lore: 'A legendary incantation discovered in the digital archive of Supabase. It projects a focus field that compiles session analytics directly into the caster\'s interface. Scholars of old used this tool to ward off the distracting whispers of the void. Requires high cognitive intelligence to maintain.',
    tech: ['Next.js', 'React', 'Tailwind', 'Supabase'],
    demo: 'https://lumostudy-pro.vercel.app',
    features: [
      'Productivity pulse (Real-time session tracking)',
      'Aegis ward (Monitors distraction thresholds)',
      'Cognitive report (Visual analytics dashboard)',
      'Performance insight (Custom data insights)',
    ],
    scaling: [
      { attr: 'STR (HTML/CSS)', grade: 'B' },
      { attr: 'DEX (NextJS)', grade: 'S' },
      { attr: 'INT (React)', grade: 'A' },
      { attr: 'FAI (Backend)', grade: 'A' },
      { attr: 'ARC (Scaling)', grade: 'B' },
    ],
    reqs: [
      { attr: 'STR', value: 12 },
      { attr: 'DEX', value: 24 },
      { attr: 'INT', value: 20 },
      { attr: 'FAI', value: 18 },
    ],
    stats: [
      { label: 'Phys (Frontend)', value: 92 },
      { label: 'Mag (Backend)', value: 78 },
      { label: 'Fire (Design)', value: 85 },
      { label: 'Lght (Scale)', value: 70 },
    ],
  },
  {
    id: 'primeblue',
    num: 'Ⅱ',
    code: 'SHIELD-PRIME',
    name: 'Prime Blue',
    category: 'Marketing Canvas Aegis',
    type: 'Greatshield',
    status: 'ACTIVE',
    rarity: 'RARE',
    rarityColor: '#A8A8B0',
    weight: '5.2',
    utility: 'Casts a vibrant visual field to attract prospective merchants and showcase rare developer artifacts.',
    lore: 'A shield forged of light TypeScript alloys and refined Tailwind fibers. Its surface shimmer reacts dynamically to cursor hover actions, casting an allure upon all observers. Primarily used by traveling merchants looking to display their digital wares across the golden web.',
    tech: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    demo: 'https://prime-blue-one.vercel.app',
    features: [
      'Glow-shimmer surface (Premium visual assets)',
      'Fluid resize (Fully responsive layouts)',
      'Patron allure (Interactive marketing features)',
      'High frame rate (Component-driven architecture)',
    ],
    scaling: [
      { attr: 'STR (HTML/CSS)', grade: 'A' },
      { attr: 'DEX (NextJS)', grade: 'A' },
      { attr: 'INT (React)', grade: 'B' },
      { attr: 'FAI (Backend)', grade: 'D' },
      { attr: 'ARC (Scaling)', grade: 'C' },
    ],
    reqs: [
      { attr: 'STR', value: 18 },
      { attr: 'DEX', value: 15 },
      { attr: 'INT', value: 10 },
      { attr: 'ARC', value: 12 },
    ],
    stats: [
      { label: 'Phys (Frontend)', value: 95 },
      { label: 'Mag (Backend)', value: 40 },
      { label: 'Fire (Design)', value: 90 },
      { label: 'Lght (Scale)', value: 60 },
    ],
  },
  {
    id: 'wpcorg',
    num: 'Ⅲ',
    code: 'SCROLL-WPC',
    name: 'WPC Org',
    category: 'Trade Directory Registry',
    type: 'Key Item',
    status: 'ACTIVE',
    rarity: 'UNCOMMON',
    rarityColor: '#6E6E78',
    weight: '3.0',
    utility: 'Enables quick filter queries and index retrieval across voluminous trade databases.',
    lore: 'A registry scroll constructed of robust NextJS frameworks. It maps a trade portal directly to remote servers, allowing buyers to sort and query cataloged goods with high precision. While utilitarian in style, its structure is remarkably resilient under heavy trade traffic.',
    tech: ['Next.js', 'React', 'JS', 'Supabase'],
    demo: 'https://wpc-website-pro.vercel.app',
    features: [
      'Catalog registry (Database management)',
      'Swift index (Advanced search & filtering)',
      'Trade ledger (Browsing system)',
      'Vessel stability (Cloud hosting infrastructure)',
    ],
    scaling: [
      { attr: 'STR (HTML/CSS)', grade: 'C' },
      { attr: 'DEX (NextJS)', grade: 'B' },
      { attr: 'INT (React)', grade: 'A' },
      { attr: 'FAI (Backend)', grade: 'A' },
      { attr: 'ARC (Scaling)', grade: 'B' },
    ],
    reqs: [
      { attr: 'DEX', value: 14 },
      { attr: 'INT', value: 16 },
      { attr: 'FAI', value: 15 },
    ],
    stats: [
      { label: 'Phys (Frontend)', value: 88 },
      { label: 'Mag (Backend)', value: 82 },
      { label: 'Fire (Design)', value: 75 },
      { label: 'Lght (Scale)', value: 80 },
    ],
  },
];

/* ── Silver ornate divider matching MainMenu style ── */
function OrnateDivider() {
  return (
    <div className="flex items-center justify-center my-3 w-full" style={{ opacity: 0.6 }}>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #A8A8B0, transparent)' }} />
      <span className="mx-2 text-[8px] border p-[2px] leading-none flex items-center justify-center transform rotate-45"
        style={{ color: '#A8A8B0', borderColor: 'rgba(168,168,176,0.4)' }}>◈</span>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #A8A8B0, transparent)' }} />
    </div>
  );
}

/* ── Clip path shorthand ── */
const clip4 = 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)';
const clip6 = 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)';

interface TabItem {
  id: 'all' | 'spells' | 'shields' | 'keys';
  label: string;
  icon: React.ReactNode;
}

export default function ProjectsSection() {
  const { playHover, playSelect, playConfirm } = useAudio();
  const [activeTab, setActiveTab] = useState<'all' | 'spells' | 'shields' | 'keys'>('all');
  const [selected, setSelected] = useState<string>('lumostudy');
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(p => {
      if (activeTab === 'all') return true;
      if (activeTab === 'spells') return p.type === 'Sorcery';
      if (activeTab === 'shields') return p.type === 'Greatshield';
      if (activeTab === 'keys') return p.type === 'Key Item';
      return true;
    });
  }, [activeTab]);

  const currentProject = useMemo(() => PROJECTS.find(p => p.id === selected) || null, [selected]);

  const handleTabChange = (tabId: 'all' | 'spells' | 'shields' | 'keys') => {
    setActiveTab(tabId);
    playSelect();
    const filtered = PROJECTS.filter(p => {
      if (tabId === 'all') return true;
      if (tabId === 'spells') return p.type === 'Sorcery';
      if (tabId === 'shields') return p.type === 'Greatshield';
      if (tabId === 'keys') return p.type === 'Key Item';
      return true;
    });
    if (filtered.length > 0) setSelected(filtered[0].id);
    else setSelected('empty');
  };

  const handleProjectSelect = (id: string) => {
    setSelected(id);
    playSelect();
    setMobileView('detail');
  };

  const tabs: TabItem[] = [
    {
      id: 'all',
      label: 'All Items',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current" strokeWidth="1.2">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" strokeDasharray="2 1" />
          <path d="M12 2v20M2 12h20" />
        </svg>
      )
    },
    {
      id: 'spells',
      label: 'Sorceries',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current" strokeWidth="1.2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    },
    {
      id: 'shields',
      label: 'Armaments',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current" strokeWidth="1.2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    },
    {
      id: 'keys',
      label: 'Key Items',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current" strokeWidth="1.2">
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l1.5 1.5M15.5 7.5L14 6" />
        </svg>
      )
    }
  ];

  /* ── Shared detail panel content ── */
  const DetailPanel = ({ proj }: { proj: Project }) => (
    <motion.div
      key={proj.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4"
    >
      {/* Header card */}
      <div
        className="relative p-4"
        style={{
          background: 'rgba(6,6,8,0.92)',
          border: '1px solid rgba(168,168,176,0.2)',
          borderTop: `2px solid ${proj.rarityColor}`,
          clipPath: clip6,
        }}
      >
        {/* Subtle radial glow behind title */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at top left, rgba(168,168,176,0.05) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div className="flex justify-between items-start gap-3 relative">
          <div className="min-w-0">
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: '#9A9AA4',
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}>
              {proj.type} &bull; {proj.code} &bull; WT {proj.weight}
            </p>
            <h1 style={{
              fontFamily: '"Cinzel", "Georgia", serif',
              fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
              fontWeight: 400,
              color: '#D4D4DC',
              letterSpacing: '0.06em',
              lineHeight: 1.15,
              textShadow: '0 0 20px rgba(212,212,220,0.15)',
            }}>
              {proj.name}
            </h1>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.95rem',
              color: '#9A9AA4',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: '0.25rem',
            }}>
              {proj.category}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.72rem',
              letterSpacing: '0.15em',
              border: `1px solid ${proj.rarityColor}`,
              color: proj.rarityColor,
              padding: '2px 8px',
              textTransform: 'uppercase',
            }}>
              {proj.rarity}
            </span>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.72rem',
              letterSpacing: '0.15em',
              border: '1px solid rgba(100,200,120,0.3)',
              color: '#6DC87A',
              background: 'rgba(100,200,120,0.05)',
              padding: '2px 8px',
            }}>
              {proj.status}
            </span>
          </div>
        </div>

        <OrnateDivider />

        <div className="flex flex-col gap-2 relative">
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '1.05rem',
            color: '#D8D8E0',
            lineHeight: 1.65,
          }}>
            <span style={{ color: '#A8A8B0' }}>Effect: </span>
            {proj.utility}
          </p>
          <p style={{
            fontFamily: '"Cinzel", Georgia, serif',
            fontSize: '0.82rem',
            color: '#AEAEB8',
            fontStyle: 'italic',
            lineHeight: 1.75,
            paddingLeft: '0.75rem',
            borderLeft: '2px solid rgba(168,168,176,0.25)',
          }}>
            &ldquo;{proj.lore}&rdquo;
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Attribute bars */}
        <div style={{
          background: 'rgba(6,6,8,0.85)',
          border: '1px solid rgba(168,168,176,0.12)',
          padding: '0.875rem',
          clipPath: clip6,
        }}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.82rem',
            letterSpacing: '0.18em',
            color: '#C0C0CA',
            textTransform: 'uppercase',
            marginBottom: '0.625rem',
            paddingBottom: '0.375rem',
            borderBottom: '1px solid rgba(168,168,176,0.08)',
          }}>
            Armament Attribute Scale
          </p>
          <div className="flex flex-col gap-2">
            {proj.stats.map(stat => (
              <div key={stat.label} className="flex items-center justify-between" style={{ fontSize: '0.85rem' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#B4B4BC', width: '8.5rem', flexShrink: 0 }}>
                  {stat.label}
                </span>
                <div className="flex items-center gap-2 flex-1 mx-3">
                  <div style={{
                    height: '2px',
                    background: 'rgba(168,168,176,0.18)',
                    border: '1px solid rgba(168,168,176,0.06)',
                    flex: 1,
                    position: 'relative',
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #4A4A52, #D4D4DC)',
                        boxShadow: '0 0 6px rgba(212,212,220,0.2)',
                      }}
                    />
                  </div>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#D4D4DC', width: '1.5rem', textAlign: 'right' }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scaling + Requirements */}
        <div className="flex flex-col gap-3">
          <div style={{
            background: 'rgba(6,6,8,0.85)',
            border: '1px solid rgba(168,168,176,0.12)',
            padding: '0.875rem',
            clipPath: clip6,
          }}>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.82rem',
            letterSpacing: '0.18em',
              color: '#9A9AA4',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
              paddingBottom: '0.375rem',
              borderBottom: '1px solid rgba(168,168,176,0.08)',
            }}>
              Attribute Scaling
            </p>
            <div className="grid grid-cols-3 gap-y-1.5 gap-x-2" style={{ fontSize: '0.85rem', fontFamily: 'JetBrains Mono, monospace' }}>
              {proj.scaling.map(s => (
                <div key={s.attr} className="flex justify-between pr-2">
                  <span style={{ color: '#9A9AA4' }}>{s.attr.split(' ')[0]}</span>
                  <span style={{ color: s.grade === 'S' ? '#D4D4DC' : '#A8A8B0' }}>{s.grade}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: 'rgba(6,6,8,0.85)',
            border: '1px solid rgba(168,168,176,0.12)',
            padding: '0.875rem',
            clipPath: clip6,
          }}>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.82rem',
            letterSpacing: '0.18em',
              color: '#9A9AA4',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
              paddingBottom: '0.375rem',
              borderBottom: '1px solid rgba(168,168,176,0.08)',
            }}>
              Required Attributes
            </p>
            <div className="grid grid-cols-5 gap-1 text-center" style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>
              {['STR', 'DEX', 'INT', 'FAI', 'ARC'].map(attrName => {
                const req = proj.reqs.find(r => r.attr === attrName);
                return (
                  <div key={attrName} className="flex flex-col items-center py-1" style={{
                    border: '1px solid rgba(168,168,176,0.08)',
                    background: 'rgba(4,4,6,0.6)',
                  }}>
                    <span style={{ color: '#7A7A84', fontSize: '0.7rem' }}>{attrName}</span>
                    <span style={{ color: req ? '#D4D4DC' : '#4A4A58' }}>{req ? req.value : '—'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Passive effects */}
      <div style={{
        background: 'rgba(6,6,8,0.85)',
        border: '1px solid rgba(168,168,176,0.12)',
        padding: '0.875rem',
        clipPath: clip6,
      }}>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.82rem',
            letterSpacing: '0.18em',
          color: '#9A9AA4',
          textTransform: 'uppercase',
          marginBottom: '0.625rem',
          paddingBottom: '0.375rem',
          borderBottom: '1px solid rgba(168,168,176,0.08)',
        }}>
          Passive Effects & Skill Descriptions
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {proj.features.map((feat, i) => (
            <div key={i} className="flex items-start gap-2">
              <span style={{ color: '#7A7A84', fontSize: '0.72rem', marginTop: '2px', flexShrink: 0 }}>◈</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', color: '#C8C8D0', lineHeight: 1.6 }}>
                {feat}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5">
        {proj.tech.map(t => (
          <span key={t} style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            color: '#A8A8B4',
            border: '1px solid rgba(168,168,176,0.22)',
            padding: '4px 10px',
            clipPath: clip4,
            textTransform: 'uppercase',
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-end mt-1">
        <a
          href={proj.demo}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playConfirm()}
          onMouseEnter={() => playHover()}
          style={{
            fontFamily: '"Cinzel", Georgia, serif',
            fontSize: '1.05rem',
            letterSpacing: '0.22em',
            color: '#050505',
            background: '#D4D4DC',
            padding: '10px 28px',
            clipPath: clip6,
            textDecoration: 'none',
            textTransform: 'uppercase',
            display: 'inline-block',
            transition: 'background 0.18s ease, box-shadow 0.18s ease',
            boxShadow: '0 0 0px rgba(212,212,220,0)',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(212,212,220,0.3)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#D4D4DC';
            e.currentTarget.style.boxShadow = '0 0 0px rgba(212,212,220,0)';
          }}
        >
          Launch Demo
        </a>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col md:flex-row overflow-hidden max-md:!pl-0 md:pl-[clamp(280px,30vw,400px)] pt-16 md:pt-0"
      style={{ background: '#050505', color: '#D4D4DC' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Subtle ambient radial glow */}
      <div style={{
        position: 'fixed', top: '40%', left: '55%',
        width: '60vw', height: '60vw', borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(168,168,176,0.03) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ═══════════════════════════════════
          MOBILE: two-pane switcher
          ═══════════════════════════════════ */}
      <div className="flex flex-col flex-1 overflow-hidden md:hidden relative z-10">
        <AnimatePresence mode="wait">

          {/* Mobile list view */}
          {mobileView === 'list' && (
            <motion.div
              key="mobile-list"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col flex-1 overflow-hidden px-4 pt-4 pb-4 gap-3"
            >
              {/* Header */}
              <div>
                <h2 style={{
                  fontFamily: '"Cinzel", Georgia, serif',
                  fontWeight: 400,
                  fontSize: '1.05rem',
                  letterSpacing: '0.18em',
                  color: '#D4D4DC',
                  textTransform: 'uppercase',
                  textShadow: '0 0 20px rgba(212,212,220,0.15)',
                }}>
                  PROJECTS
                </h2>
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  color: '#9A9AA4',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                }}>
                  Select project to inspect attributes
                </p>
                <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(168,168,176,0.4), transparent)', marginTop: '8px' }} />
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2">
                {tabs.map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      onMouseEnter={() => playHover()}
                      title={tab.label}
                      className="flex items-center justify-center flex-1 transition-all duration-200"
                      style={{
                        height: '38px',
                        background: isActive ? 'rgba(212,212,220,0.08)' : 'rgba(6,6,8,0.7)',
                        border: `1px solid ${isActive ? 'rgba(212,212,220,0.4)' : 'rgba(168,168,176,0.1)'}`,
                        color: isActive ? '#D4D4DC' : '#7A7A84',
                        clipPath: clip4,
                        boxShadow: isActive ? '0 0 12px rgba(212,212,220,0.1)' : 'none',
                      }}
                    >
                      {tab.icon}
                    </button>
                  );
                })}
              </div>

              {/* Project list */}
              <div
                className="flex-1 overflow-y-auto scrollable flex flex-col gap-2"
                style={{
                  background: 'rgba(6,6,8,0.6)',
                  border: '1px solid rgba(168,168,176,0.1)',
                  padding: '0.75rem',
                  clipPath: clip6,
                }}
              >
                {filteredProjects.length > 0 ? filteredProjects.map(proj => {
                  const isSel = selected === proj.id;
                  return (
                    <button
                      key={proj.id}
                      onClick={() => handleProjectSelect(proj.id)}
                      onMouseEnter={() => playHover()}
                      className="flex items-center gap-3 p-3 text-left w-full transition-all duration-200"
                      style={{
                        background: isSel ? 'rgba(212,212,220,0.06)' : 'rgba(4,4,6,0.7)',
                        border: `1px solid ${isSel ? 'rgba(212,212,220,0.25)' : 'rgba(168,168,176,0.18)'}`,
                        clipPath: clip4,
                        boxShadow: isSel ? '0 0 12px rgba(212,212,220,0.08)' : 'none',
                      }}
                    >
                      <div className="w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: `${proj.rarityColor}30` }}>
                        <span style={{ fontFamily: '"Cinzel", serif', color: proj.rarityColor, fontSize: '1.05rem', fontWeight: 400 }}>
                          {proj.num}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="truncate block" style={{
                          fontFamily: '"Cinzel", Georgia, serif',
                          fontSize: '1.05rem',
                          color: isSel ? '#D4D4DC' : '#8A8A94',
                          letterSpacing: '0.06em',
                          fontWeight: 400,
                        }}>
                          {proj.name}
                        </span>
                        <p style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.72rem',
                          color: '#7A7A84',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          marginTop: '2px',
                        }} className="truncate">
                          {proj.type} &bull; {proj.category}
                        </p>
                      </div>
                      <span style={{ color: '#7A7A84', fontSize: '0.75rem', flexShrink: 0 }}>›</span>
                    </button>
                  );
                }) : (
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#7A7A84', textAlign: 'center', padding: '2rem 0' }}>
                    No items in this category
                  </div>
                )}
              </div>

              {/* Help text */}
              <div style={{
                background: 'rgba(4,4,6,0.6)',
                border: '1px solid rgba(168,168,176,0.06)',
                padding: '0.6rem 0.75rem',
              }}>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#7A7A84', lineHeight: 1.6 }}>
                  * Tap an item to inspect its attributes, scaling grades, and active skill details.
                </p>
              </div>
            </motion.div>
          )}

          {/* Mobile detail view */}
          {mobileView === 'detail' && (
            <motion.div
              key="mobile-detail"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="flex-shrink-0 px-4 pt-3 pb-2">
                <button
                  onClick={() => { setMobileView('list'); playSelect(); }}
                  className="flex items-center gap-2 transition-all duration-200"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    color: '#A8A8B0',
                    border: '1px solid rgba(168,168,176,0.2)',
                    background: 'rgba(6,6,8,0.8)',
                    padding: '6px 12px',
                    textTransform: 'uppercase',
                    clipPath: clip4,
                  }}
                >
                  <span style={{ fontSize: '0.75rem' }}>‹</span>
                  Back to List
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollable px-4 pb-6">
                <AnimatePresence mode="wait">
                  {currentProject && <DetailPanel proj={currentProject} />}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════
          DESKTOP: side-by-side layout
          ═══════════════════════════════════ */}
      <div className="hidden md:flex flex-row flex-1 py-8 px-6 gap-6 overflow-hidden relative z-10">

        {/* Left panel — inventory list */}
        <motion.div
          className="flex flex-col flex-shrink-0 select-none"
          style={{ width: '300px' }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{
              fontFamily: '"Cinzel", Georgia, serif',
              fontWeight: 400,
              fontSize: '1.3rem',
              letterSpacing: '0.18em',
              color: '#D4D4DC',
              textTransform: 'uppercase',
              textShadow: '0 0 20px rgba(212,212,220,0.15)',
            }}>
              PROJECTS
            </h2>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              color: '#9A9AA4',
              textTransform: 'uppercase',
              marginTop: '4px',
            }}>
              Select project to inspect attributes
            </p>
            <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(168,168,176,0.4), transparent)', marginTop: '10px' }} />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1.5" style={{ marginBottom: '1rem' }}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  onMouseEnter={() => playHover()}
                  title={tab.label}
                  className="flex items-center justify-center transition-all duration-200"
                  style={{
                    width: '42px', height: '42px',
                    background: isActive ? 'rgba(212,212,220,0.08)' : 'rgba(6,6,8,0.7)',
                    border: `1px solid ${isActive ? 'rgba(212,212,220,0.35)' : 'rgba(168,168,176,0.1)'}`,
                    color: isActive ? '#D4D4DC' : '#7A7A84',
                    clipPath: clip4,
                    boxShadow: isActive ? '0 0 12px rgba(212,212,220,0.1)' : 'none',
                  }}
                >
                  {tab.icon}
                </button>
              );
            })}
          </div>

          {/* Project list */}
          <div
            className="flex-1 overflow-y-auto scrollable flex flex-col justify-between"
            style={{
              background: 'rgba(6,6,8,0.6)',
              border: '1px solid rgba(168,168,176,0.1)',
              padding: '0.75rem',
              clipPath: clip6,
              maxHeight: '380px',
            }}
          >
            <div className="flex flex-col gap-2">
              {filteredProjects.length > 0 ? filteredProjects.map(proj => {
                const isSel = selected === proj.id;
                return (
                  <button
                    key={proj.id}
                    onClick={() => { setSelected(proj.id); playSelect(); }}
                    onMouseEnter={() => playHover()}
                    className="flex items-center gap-3 p-2.5 text-left w-full transition-all duration-200"
                    style={{
                      background: isSel ? 'rgba(212,212,220,0.06)' : 'rgba(4,4,6,0.7)',
                      border: `1px solid ${isSel ? 'rgba(212,212,220,0.2)' : 'rgba(168,168,176,0.18)'}`,
                      clipPath: clip4,
                      boxShadow: isSel ? '0 0 12px rgba(212,212,220,0.07)' : 'none',
                    }}
                  >
                    <div className="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: `${proj.rarityColor}25` }}>
                      <span style={{ fontFamily: '"Cinzel", serif', color: proj.rarityColor, fontSize: '0.95rem', fontWeight: 400 }}>
                        {proj.num}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="truncate block" style={{
                        fontFamily: '"Cinzel", Georgia, serif',
                        fontSize: '0.95rem',
                        color: isSel ? '#D4D4DC' : '#8A8A94',
                        letterSpacing: '0.06em',
                        fontWeight: 400,
                      }}>
                        {proj.name}
                      </span>
                      <p style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.7rem',
                        color: '#7A7A84',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginTop: '2px',
                      }}>
                        {proj.type}
                      </p>
                    </div>
                    {isSel && (
                      <span style={{ color: '#A8A8B0', fontSize: '1.05rem', flexShrink: 0 }}>◈</span>
                    )}
                  </button>
                );
              }) : (
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#7A7A84', textAlign: 'center', padding: '2rem 0' }}>
                  No items in this category
                </div>
              )}
            </div>

            {/* Selected item footer */}
            <div style={{ borderTop: '1px solid rgba(168,168,176,0.08)', paddingTop: '0.5rem', marginTop: '0.5rem', textAlign: 'center' }}>
              <p style={{
                fontFamily: '"Cinzel", Georgia, serif',
                fontSize: '1.05rem',
                color: currentProject?.rarityColor || '#7A7A84',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 400,
              }}>
                {currentProject ? currentProject.name : '— Select Armament —'}
              </p>
            </div>
          </div>

          {/* Help text */}
          <div style={{
            marginTop: '0.75rem',
            background: 'rgba(4,4,6,0.6)',
            border: '1px solid rgba(168,168,176,0.06)',
            padding: '0.6rem 0.75rem',
          }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7A7A84', lineHeight: 1.65 }}>
              * Click items to view descriptions, attribute scaling grades, and active skill details. Equipped armaments grant passive capability bonuses.
            </p>
          </div>
        </motion.div>

        {/* Right panel — detail inspect */}
        <motion.div
          className="flex-1 overflow-y-auto scrollable pr-2 flex flex-col"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {currentProject ? (
              <DetailPanel proj={currentProject} />
            ) : (
              <motion.div
                key="empty-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center"
                style={{
                  border: '1px dashed rgba(168,168,176,0.1)',
                  background: 'rgba(4,4,6,0.4)',
                  clipPath: clip6,
                  minHeight: '320px',
                }}
              >
                <div style={{
                  width: '3.5rem', height: '3.5rem',
                  border: '1px solid rgba(168,168,176,0.1)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0.3, marginBottom: '0.75rem',
                }}>
                  <span style={{ color: '#A8A8B0', fontSize: '1.5rem', fontFamily: 'serif' }}>◈</span>
                </div>
                <h3 style={{
                  fontFamily: '"Cinzel", Georgia, serif',
                  fontSize: '1.05rem',
                  color: '#D4D4DC',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                  fontWeight: 400,
                  opacity: 0.4,
                }}>
                  No Project Selected
                </h3>
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.72rem',
                  color: '#7A7A84',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  maxWidth: '16rem',
                }}>
                  Select a project from the list to inspect.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </motion.div>
  );
}