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
    rarityColor: '#C8A96E',
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
    rarityColor: '#4ECDC4',
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
    rarityColor: '#98C379',
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

/* ── Elden Ring ornate divider ── */
function OrnateDivider() {
  return (
    <div className="flex items-center justify-center my-3 w-full opacity-70">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C8A96E] to-transparent" />
      <span className="mx-2 text-[#C8A96E] text-[8px] transform rotate-45 border border-[#C8A96E]/50 p-[2px] leading-none flex items-center justify-center">◈</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C8A96E] to-transparent" />
    </div>
  );
}

/* ── Elden Ring Tab Filter Icons ── */
interface TabItem {
  id: 'all' | 'spells' | 'shields' | 'keys';
  label: string;
  icon: React.ReactNode;
}

export default function ProjectsSection() {
  const { playHover, playSelect, playConfirm } = useAudio();
  const [activeTab, setActiveTab] = useState<'all' | 'spells' | 'shields' | 'keys'>('all');
  const [selected, setSelected] = useState<string>('lumostudy');

  // Filter projects by active tab
  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(p => {
      if (activeTab === 'all') return true;
      if (activeTab === 'spells') return p.type === 'Sorcery';
      if (activeTab === 'shields') return p.type === 'Greatshield';
      if (activeTab === 'keys') return p.type === 'Key Item';
      return true;
    });
  }, [activeTab]);

  // Selected project object
  const currentProject = useMemo(() => {
    return PROJECTS.find(p => p.id === selected) || null;
  }, [selected]);

  // Handle Tab Click
  const handleTabChange = (tabId: 'all' | 'spells' | 'shields' | 'keys') => {
    setActiveTab(tabId);
    playSelect();
    // Auto-select first item in filtered list if available
    const filtered = PROJECTS.filter(p => {
      if (tabId === 'all') return true;
      if (tabId === 'spells') return p.type === 'Sorcery';
      if (tabId === 'shields') return p.type === 'Greatshield';
      if (tabId === 'keys') return p.type === 'Key Item';
      return true;
    });
    if (filtered.length > 0) {
      setSelected(filtered[0].id);
    } else {
      setSelected('empty');
    }
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

  return (
    <motion.div
      className="fixed inset-0 z-10 flex overflow-hidden bg-[#0a0a0c] text-[#E8E0D4]"
      style={{ paddingLeft: 'clamp(280px, 30vw, 400px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-1 py-8 px-6 gap-6 overflow-hidden">
        
        {/* ══════════════════════ LEFT PANEL: INVENTORY LIST ══════════════════════ */}
        <motion.div
          className="flex flex-col flex-shrink-0 select-none"
          style={{ width: '310px' }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-4">
            <h2 style={{
              fontFamily: 'Cinzel, Georgia, serif',
              fontWeight: 400,
              fontSize: '1.25rem',
              letterSpacing: '0.12em',
              color: '#E8C98E',
              textTransform: 'uppercase',
            }}>
              PROJECTS
            </h2>
            <p className="text-[10px] text-[#C8A96E]/60 tracking-wider font-mono uppercase mt-1">
              Select project to inspect attributes
            </p>
            <div className="h-px bg-gradient-to-r from-[#C8A96E]/50 to-transparent mt-2" />
          </div>

          {/* Category Tabs (Elden Ring Equipment Icons) */}
          <div className="flex items-center gap-1.5 mb-4">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  onMouseEnter={() => playHover()}
                  title={tab.label}
                  className="flex items-center justify-center border transition-all duration-200"
                  style={{
                    width: '42px',
                    height: '42px',
                    background: isActive ? 'rgba(200, 169, 110, 0.15)' : 'rgba(10, 10, 12, 0.6)',
                    borderColor: isActive ? '#E8C98E' : 'rgba(200, 169, 110, 0.25)',
                    color: isActive ? '#E8C98E' : '#BFB49A',
                    boxShadow: isActive ? '0 0 10px rgba(232, 201, 142, 0.15)' : 'none',
                    clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)',
                  }}
                >
                  {tab.icon}
                </button>
              );
            })}
          </div>

          {/* Direct Project List */}
          <div
            className="flex-1 bg-[#09090b]/80 border border-[#C8A96E]/20 p-3 flex flex-col justify-between overflow-y-auto scrollable"
            style={{
              clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
              maxHeight: '360px',
            }}
          >
            <div className="flex flex-col gap-2.5">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((proj) => {
                  const isSelected = selected === proj.id;
                  return (
                    <button
                      key={proj.id}
                      onClick={() => { setSelected(proj.id); playSelect(); }}
                      onMouseEnter={() => playHover()}
                      className="flex items-center gap-3 p-2.5 relative border transition-all duration-200 text-left w-full"
                      style={{
                        background: isSelected 
                          ? 'radial-gradient(circle, rgba(200,169,110,0.12) 0%, rgba(10,10,12,0.85) 100%)'
                          : 'radial-gradient(circle, rgba(20,20,25,0.4) 0%, rgba(8,8,10,0.95) 100%)',
                        borderColor: isSelected ? '#E8C98E' : 'rgba(200, 169, 110, 0.15)',
                        boxShadow: isSelected ? '0 0 12px rgba(232, 201, 142, 0.2)' : 'none',
                        clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)',
                      }}
                    >
                      <div 
                        className="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: `${proj.rarityColor}40` }}
                      >
                        <span style={{
                          fontFamily: 'Cinzel, Georgia, serif',
                          color: proj.rarityColor,
                          fontWeight: 400,
                          fontSize: '0.85rem'
                        }}>
                          {proj.num}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span style={{
                          fontFamily: 'Cinzel, Georgia, serif',
                          fontWeight: 400,
                          fontSize: '0.85rem',
                          color: isSelected ? '#E8C98E' : '#BFB49A',
                          letterSpacing: '0.05em'
                        }} className="truncate block">
                          {proj.name}
                        </span>
                        <p className="text-[8px] text-[#BFB49A]/50 font-mono uppercase mt-0.5 truncate">
                          {proj.type}
                        </p>
                      </div>
                      {isSelected && <span className="text-[#E8C98E] text-[10px] flex-shrink-0">⚔</span>}
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-[#BFB49A]/40 font-mono text-[10px]">
                  No items in this category
                </div>
              )}
            </div>

            {/* Selected Item Brief Footer Name */}
            <div className="border-t border-[#C8A96E]/15 pt-2 mt-2">
              <p style={{
                fontFamily: 'Cinzel, Georgia, serif',
                fontSize: '0.75rem',
                color: currentProject?.rarityColor || '#E8C98E',
                letterSpacing: '0.08em',
                textAlign: 'center',
                textTransform: 'uppercase',
                fontWeight: 400,
              }}>
                {currentProject ? currentProject.name : '— Select Armament —'}
              </p>
            </div>
          </div>

          {/* Help description text */}
          <div className="mt-3 bg-[#08080a]/60 border border-[#C8A96E]/10 p-2.5">
            <p className="text-[9px] text-[#BFB49A] font-mono leading-relaxed">
              * Click items to view descriptions, attribute scaling grades, and active skill details. Equipped armaments grant passive capability bonuses.
            </p>
          </div>
        </motion.div>

        {/* ══════════════════════ RIGHT PANEL: ITEM DETAIL INSPECT ══════════════════════ */}
        <motion.div
          className="flex-1 overflow-y-auto scrollable pr-2 flex flex-col"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {currentProject ? (
              <motion.div
                key={currentProject.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                {/* Header (Title, Subtitle, Rarity) */}
                <div 
                  className="bg-[#09090b]/95 border border-[#C8A96E]/20 p-4 relative"
                  style={{
                    borderTop: `3px solid ${currentProject.rarityColor}`,
                    clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
                  }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-[9px] font-mono tracking-[0.2em] text-[#C8A96E] uppercase mb-1">
                        {currentProject.type} &bull; {currentProject.code} &bull; WT {currentProject.weight}
                      </p>
                      <h1 style={{
                        fontFamily: 'Cinzel, Georgia, serif',
                        fontSize: '1.75rem',
                        fontWeight: 400,
                        color: '#E8C98E',
                        letterSpacing: '0.04em',
                        lineHeight: 1.1,
                      }}>
                        {currentProject.name}
                      </h1>
                      <p className="text-[10px] text-[#BFB49A]/80 font-mono mt-0.5">
                        {currentProject.category}
                      </p>
                    </div>

                    {/* Rarity and status badges */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className="text-[8px] font-mono border px-2 py-0.5" style={{ borderColor: currentProject.rarityColor, color: currentProject.rarityColor }}>
                        {currentProject.rarity}
                      </span>
                      <span className="text-[8px] font-mono border border-green-500/30 text-green-400 bg-green-500/5 px-2 py-0.5">
                        {currentProject.status}
                      </span>
                    </div>
                  </div>

                  <OrnateDivider />

                  {/* Utility summary & narrative lore */}
                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] text-[#E8E0D4] leading-relaxed">
                      <span className="text-[#C8A96E] font-normal">Effect:</span> {currentProject.utility}
                    </p>
                    <p className="text-[10.5px] text-[#BFB49A] italic leading-relaxed pl-2.5 border-l border-[#C8A96E]/30 bg-white/2 bg-opacity-[0.02]">
                      &ldquo;{currentProject.lore}&rdquo;
                    </p>
                  </div>
                </div>

                {/* RPG Attributes, Requirements and scaling in a side-by-side or stacked grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left stats: Attack Power (Project Attribute values) */}
                  <div className="bg-[#09090b]/85 border border-[#C8A96E]/15 p-3.5">
                    <p className="text-[10px] font-mono text-[#C8A96E] uppercase tracking-wider mb-2 border-b border-[#C8A96E]/10 pb-1">
                      Armament Attribute Scale
                    </p>
                    <div className="flex flex-col gap-2">
                      {currentProject.stats.map(stat => (
                        <div key={stat.label} className="flex items-center justify-between text-[11px]">
                          <span className="text-[#BFB49A] font-mono">{stat.label}</span>
                          <div className="flex items-center gap-2 flex-1 mx-4">
                            <div className="h-1 bg-black/60 border border-[#C8A96E]/10 flex-1 relative">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stat.value}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-[#A87940] to-[#E8C98E]"
                              />
                            </div>
                          </div>
                          <span className="font-mono text-[#E8C98E] w-6 text-right">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right stats: Attribute Scaling & Requirements */}
                  <div className="bg-[#09090b]/85 border border-[#C8A96E]/15 p-3.5 flex flex-col gap-3">
                    {/* Scaling Section */}
                    <div>
                      <p className="text-[10px] font-mono text-[#C8A96E] uppercase tracking-wider mb-1.5 border-b border-[#C8A96E]/10 pb-1">
                        Attribute Scaling
                      </p>
                      <div className="grid grid-cols-3 gap-y-1 gap-x-2 text-[10px] font-mono">
                        {currentProject.scaling.map(s => (
                          <div key={s.attr} className="flex justify-between pr-2">
                            <span className="text-[#BFB49A]/80">{s.attr.split(' ')[0]}</span>
                            <span className="text-[#E8C98E] font-normal">{s.grade}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements Section */}
                    <div>
                      <p className="text-[10px] font-mono text-[#C8A96E] uppercase tracking-wider mb-1.5 border-b border-[#C8A96E]/10 pb-1">
                        Required Attributes
                      </p>
                      <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono">
                        {['STR', 'DEX', 'INT', 'FAI', 'ARC'].map(attrName => {
                          const req = currentProject.reqs.find(r => r.attr === attrName);
                          return (
                            <div key={attrName} className="flex flex-col items-center border border-[#C8A96E]/10 bg-[#050508] py-0.5">
                              <span className="text-[8px] text-[#BFB49A]/60">{attrName}</span>
                              <span className={req ? 'text-[#E8C98E] font-normal' : 'text-[#BFB49A]/20'}>
                                {req ? req.value : '—'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passive Effects (Project Key Features) */}
                <div className="bg-[#09090b]/85 border border-[#C8A96E]/15 p-3.5">
                  <p className="text-[10px] font-mono text-[#C8A96E] uppercase tracking-wider mb-2 border-b border-[#C8A96E]/10 pb-1">
                    Passive Effects & Skill Descriptions
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10.5px]">
                    {currentProject.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-[#C8A96E] text-[8px] mt-1 flex-shrink-0">◈</span>
                        <span className="text-[#BFB49A] leading-tight font-light">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Row: Link Launch */}
                <div className="flex justify-end gap-3 mt-1">
                  <a
                    href={currentProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playConfirm()}
                    onMouseEnter={() => playHover()}
                    className="relative flex items-center justify-center text-black font-normal tracking-widest text-[11px] uppercase transition-all duration-200"
                    style={{
                      background: '#C8A96E',
                      borderColor: '#E8C98E',
                      padding: '8px 24px',
                      clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
                      textDecoration: 'none'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = '#E8C98E';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(232, 201, 142, 0.4)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = '#C8A96E';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Use Item (Launch Demo)
                  </a>
                </div>
              </motion.div>
            ) : (
              // Empty inspect screen panel
              <motion.div
                key="empty-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center border border-dashed border-[#C8A96E]/20 bg-[#08080a]/40"
                style={{
                  clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
                  minHeight: '320px',
                }}
              >
                <div className="w-14 h-14 border border-[#C8A96E]/15 rounded-full flex items-center justify-center opacity-40 mb-3">
                  <span className="text-[#C8A96E] text-2xl font-serif">◈</span>
                </div>
                <h3 style={{
                  fontFamily: 'Cinzel, Georgia, serif',
                  fontSize: '1rem',
                  color: '#E8C98E',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                  fontWeight: 400,
                }}>
                  No Project Selected
                </h3>
                <p className="text-[10px] text-[#BFB49A]/80 font-mono tracking-wider uppercase text-center max-w-xs px-6">
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
