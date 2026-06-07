'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/lib/contexts/AudioContext';

const clip4 = 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)';
const clip6 = 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)';

const FONT_CINZEL = '"Cinzel", "Georgia", serif';
const FONT_MONO   = '"JetBrains Mono", "Courier New", monospace';

/* ── SVG icons — monochrome paths, rendered at 20×20 ── */
const ICONS: Record<string, React.ReactNode> = {
  email: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M2 7l10 7 10-7"/>
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  ),
};

const LINKS = [
  { id: 'email',    label: 'EMAIL',    value: 'Gmail',    sub: 'Direct Channel',      href: 'mailto:harrylagto@gmail.com' },
  { id: 'github',   label: 'GITHUB',   value: 'GitHub',   sub: 'Source Repository',   href: 'https://github.com/hakkai-asf' },
  { id: 'linkedin', label: 'LINKEDIN', value: 'LinkedIn', sub: 'Professional Network', href: 'https://www.linkedin.com/in/harry-nielsen-lagto-5a6776307/' },
  { id: 'facebook', label: 'FACEBOOK', value: 'Facebook', sub: 'Social Channel',       href: 'https://facebook.com/harry.lagto' },
];

const TERMINAL_LINES = [
  '> INITIALIZING COMMS TERMINAL...',
  '> OPERATOR: Harry Nielsen M. Lagto',
  '> STATUS: AVAILABLE FOR WORK',
  '> LOCATION: Marikina City, Metro Manila, Philippines',
  '> ROLE: Aspiring Fullstack Developer',
  '> CLEARANCE: Open Contact',
  '> AWAITING TRANSMISSION...',
];

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

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily:    FONT_MONO,
      fontSize:      '0.78rem',
      fontWeight:    700,
      letterSpacing: '0.18em',
      color:         '#B8B8C4',
      textTransform: 'uppercase',
      marginBottom:  '0.5rem',
      paddingBottom: '0.375rem',
      borderBottom:  '1px solid rgba(168,168,176,0.12)',
    }}>
      {children}
    </p>
  );
}

function Panel({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div className={className} style={{
      background: 'rgba(6,6,8,0.92)',
      border:     '1px solid rgba(168,168,176,0.12)',
      clipPath:   clip6,
      ...style,
    }}>
      {children}
    </div>
  );
}

function LinkCard({ link, delay, onMouseEnter, onClick }: {
  link: typeof LINKS[0]; delay: number; onMouseEnter: () => void; onClick: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.a
      href={link.href}
      target={link.id !== 'email' ? '_blank' : undefined}
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      onMouseEnter={() => { setHovered(true); onMouseEnter(); }}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display:        'flex',
        alignItems:     'center',
        gap:            '1rem',
        padding:        '16px 20px',
        textDecoration: 'none',
        background:     hovered ? 'rgba(212,212,220,0.06)' : 'rgba(6,6,8,0.92)',
        border:         `1px solid ${hovered ? 'rgba(212,212,220,0.30)' : 'rgba(168,168,176,0.15)'}`,
        clipPath:       clip6,
        transition:     'all 0.18s',
        boxShadow:      hovered ? '0 0 14px rgba(212,212,220,0.08)' : 'none',
      }}
    >
      {/* Icon — uses actual SVG logo, themed silver/white */}
      <div style={{
        width:          44,
        height:         44,
        flexShrink:     0,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        position:       'relative',
      }}>
        {/* Hex/octagon frame */}
        <svg viewBox="0 0 44 44" width="44" height="44" style={{ position: 'absolute', inset: 0 }}>
          <polygon
            points="22,2 40,11 40,33 22,42 4,33 4,11"
            fill={hovered ? 'rgba(212,212,220,0.10)' : 'rgba(30,30,36,0.85)'}
            stroke={hovered ? 'rgba(212,212,220,0.40)' : 'rgba(168,168,176,0.22)'}
            strokeWidth="1"
            style={{ transition: 'all 0.18s' }}
          />
          {/* Corner tick marks — ornate detail */}
          <line x1="2" y1="10" x2="6" y2="12"  stroke={hovered ? 'rgba(212,212,220,0.5)' : 'rgba(168,168,176,0.3)'} strokeWidth="0.8"/>
          <line x1="2" y1="34" x2="6" y2="32"  stroke={hovered ? 'rgba(212,212,220,0.5)' : 'rgba(168,168,176,0.3)'} strokeWidth="0.8"/>
          <line x1="42" y1="10" x2="38" y2="12" stroke={hovered ? 'rgba(212,212,220,0.5)' : 'rgba(168,168,176,0.3)'} strokeWidth="0.8"/>
          <line x1="42" y1="34" x2="38" y2="32" stroke={hovered ? 'rgba(212,212,220,0.5)' : 'rgba(168,168,176,0.3)'} strokeWidth="0.8"/>
        </svg>
        {/* Actual social icon */}
        <span style={{
          position:   'relative',
          zIndex:     1,
          color:      hovered ? '#FFFFFF' : '#9A9AA4',
          transition: 'color 0.18s',
          display:    'flex',
          alignItems: 'center',
          filter:     hovered ? 'drop-shadow(0 0 6px rgba(255,255,255,0.35))' : 'none',
        }}>
          {ICONS[link.id]}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
          <span style={{
            fontFamily:    FONT_MONO,
            fontSize:      '0.68rem',
            fontWeight:    700,
            letterSpacing: '0.18em',
            color:         '#B8B8C4',
            textTransform: 'uppercase',
          }}>
            {link.label}
          </span>
          <span style={{
            fontFamily:    FONT_MONO,
            fontSize:      '0.62rem',
            fontWeight:    600,
            color:         '#9A9AA4',
            letterSpacing: '0.08em',
          }}>
            — {link.sub}
          </span>
        </div>
        <p style={{
          fontFamily:    FONT_CINZEL,
          fontWeight:    700,
          fontSize:      'clamp(1rem, 2vw, 1.15rem)',
          color:         '#FFFFFF',
          letterSpacing: '0.06em',
          transition:    'all 0.18s',
          textShadow:    hovered ? '0 0 18px rgba(255,255,255,0.35)' : 'none',
        }}>
          {link.value}
        </p>
      </div>

      <span style={{
        fontFamily: FONT_MONO,
        fontSize:   '1rem',
        fontWeight: 700,
        color:      hovered ? '#FFFFFF' : '#9A9AA4',
        flexShrink: 0,
        transition: 'all 0.18s',
        transform:  hovered ? 'translate(2px,-2px)' : 'none',
        display:    'inline-block',
      }}>
        ↗
      </span>
    </motion.a>
  );
}

export default function ContactSection() {
  const { playHover, playSelect, playConfirm } = useAudio();
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= TERMINAL_LINES.length) clearInterval(t);
    }, 180);
    return () => clearInterval(t);
  }, []);

  const lineColor = (i: number) => {
    if (i === 0) return '#FFFFFF';
    if (i === 2) return '#7EE89A';
    if (i >= TERMINAL_LINES.length - 1) return '#9A9AA4';
    return '#E0E0E8';
  };

  const TerminalBody = ({ fontSize = '0.72rem' }: { fontSize?: string }) => (
    <>
      <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4A4A52' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6E6E7A' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#9A9AA4' }} />
        <span style={{ fontFamily: FONT_MONO, fontSize: '0.52rem', fontWeight: 700, color: '#9A9AA4', marginLeft: 8, letterSpacing: '0.1em' }}>
          TERMINAL v1.0
        </span>
      </div>
      <OrnateDivider />
      <div className="flex flex-col gap-1">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            style={{ fontFamily: FONT_MONO, fontSize, fontWeight: 700, letterSpacing: '0.04em', color: lineColor(i), lineHeight: 1.6 }}
          >
            {line}
          </motion.p>
        ))}
        {visibleLines >= TERMINAL_LINES.length && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ fontFamily: FONT_MONO, fontSize: '0.88rem', fontWeight: 700, color: '#B8B8C4' }}
          >_</motion.span>
        )}
      </div>
    </>
  );

  const CVDownload = () => (
    <div className="flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <p style={{ fontFamily: FONT_CINZEL, fontWeight: 700, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Curriculum Vitae
        </p>
        <p style={{ fontFamily: FONT_MONO, fontSize: '0.65rem', fontWeight: 700, color: '#9A9AA4', marginTop: 3, letterSpacing: '0.05em' }}>
          ATS-Optimized · PDF Format
        </p>
      </div>
      <a
        href="/cv/HARRY LAGTO ATS CV.pdf"
        download
        onMouseEnter={playHover}
        onClick={playConfirm}
        style={{
          fontFamily: FONT_CINZEL, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em',
          color: '#050505', background: '#FFFFFF', padding: '8px 20px', clipPath: clip6,
          textDecoration: 'none', textTransform: 'uppercase', display: 'inline-block',
          transition: 'background 0.18s, box-shadow 0.18s', flexShrink: 0,
        }}
        onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = '#D4D4DC'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 22px rgba(255,255,255,0.35)'; }}
        onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = '#FFFFFF'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
      >
        Download
      </a>
    </div>
  );

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col md:flex-row overflow-hidden max-md:!pl-0 md:pl-[clamp(280px,30vw,400px)] pt-16 md:pt-0"
      style={{ background: '#050505', color: '#FFFFFF' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ position: 'fixed', top: '40%', left: '55%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(168,168,176,0.03) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── MOBILE ── */}
      <div className="flex flex-col flex-1 overflow-y-auto scrollable md:hidden px-4 pt-4 pb-20 gap-4 relative z-10">
        <Panel style={{ padding: '10px 14px' }}>
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: FONT_MONO, fontSize: '0.65rem', fontWeight: 700, color: '#B8B8C4', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Operator Status</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', border: '1px solid rgba(126,232,154,0.4)', color: '#7EE89A', background: 'rgba(126,232,154,0.06)', padding: '2px 8px', textTransform: 'uppercase', clipPath: clip4 }}>
              Available for Work
            </span>
          </div>
        </Panel>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
            <span style={{ color: '#9A9AA4', fontSize: '0.75rem' }}>◈</span>
            <p style={{ fontFamily: FONT_CINZEL, fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.16em', color: '#FFFFFF', textTransform: 'uppercase' }}>Comms Terminal</p>
          </div>
          <Panel style={{ padding: '14px 16px' }}><TerminalBody fontSize="0.68rem" /></Panel>
        </motion.div>

        <div style={{ marginTop: 4 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
            <span style={{ color: '#9A9AA4', fontSize: '0.75rem' }}>◈</span>
            <p style={{ fontFamily: FONT_CINZEL, fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.16em', color: '#FFFFFF', textTransform: 'uppercase' }}>Direct Channels</p>
          </div>
          <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(168,168,176,0.5), transparent)' }} />
        </div>

        {LINKS.map((link, i) => (
          <LinkCard key={link.id} link={link} delay={0.1 + i * 0.07} onMouseEnter={playHover} onClick={playSelect} />
        ))}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.55 }}>
          <Panel style={{ padding: '16px 18px' }}>
            <PanelLabel>Classified Documents</PanelLabel>
            <CVDownload />
          </Panel>
        </motion.div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex flex-row flex-1 py-8 px-8 gap-6 overflow-hidden relative z-10">
        <motion.div className="flex flex-col flex-shrink-0" style={{ width: 'clamp(240px, 28vw, 320px)' }} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <h2 style={{ fontFamily: FONT_CINZEL, fontWeight: 700, fontSize: '1.45rem', letterSpacing: '0.18em', color: '#FFFFFF', textTransform: 'uppercase', textShadow: '0 0 24px rgba(255,255,255,0.18)', marginBottom: 4 }}>Contact</h2>
          <p style={{ fontFamily: FONT_MONO, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', color: '#B8B8C4', textTransform: 'uppercase', marginBottom: 10 }}>Establish a transmission</p>
          <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(168,168,176,0.5), transparent)', marginBottom: 16 }} />
          <Panel style={{ padding: '18px', flex: 1, minHeight: 280 }}><TerminalBody fontSize="0.75rem" /></Panel>
          <Panel style={{ padding: '12px 16px', marginTop: 12 }}>
            <div className="flex justify-between items-center">
              <span style={{ fontFamily: FONT_MONO, fontSize: '0.65rem', fontWeight: 700, color: '#B8B8C4', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Operator Status</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', border: '1px solid rgba(126,232,154,0.4)', color: '#7EE89A', background: 'rgba(126,232,154,0.06)', padding: '2px 8px', textTransform: 'uppercase', clipPath: clip4 }}>
                Available for Work
              </span>
            </div>
          </Panel>
        </motion.div>

        <motion.div className="flex-1 flex flex-col gap-4 overflow-y-auto scrollable" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.15 }}>
          <div style={{ marginBottom: 4 }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
              <span style={{ color: '#9A9AA4', fontSize: '0.82rem' }}>◈</span>
              <p style={{ fontFamily: FONT_CINZEL, fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.18em', color: '#FFFFFF', textTransform: 'uppercase' }}>Direct Channels</p>
            </div>
            <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(168,168,176,0.5), transparent)' }} />
          </div>

          {LINKS.map((link, i) => (
            <LinkCard key={link.id} link={link} delay={0.2 + i * 0.08} onMouseEnter={playHover} onClick={playSelect} />
          ))}

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }} style={{ marginTop: 8 }}>
            <div style={{ position: 'relative', background: 'rgba(4,4,6,0.7)', border: '1px solid rgba(168,168,176,0.15)', borderTop: '2px solid #C8C8D0', clipPath: clip6, padding: '14px 18px' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top left, rgba(168,168,176,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
              <p style={{ fontFamily: FONT_MONO, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.2em', color: '#B8B8C4', textTransform: 'uppercase', marginBottom: 6 }}>
                KEY-ITEM &bull; DOCUMENT &bull; CLASSIFIED
              </p>
              <CVDownload />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}