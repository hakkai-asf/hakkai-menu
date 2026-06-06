'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/lib/contexts/AudioContext';

// ─── Exact silver palette from ProjectsSection ────────────────────────────────
// bg:           #050505
// panel bg:     rgba(6,6,8,0.92)
// border dim:   rgba(168,168,176,0.12)
// border mid:   rgba(168,168,176,0.2)
// text bright:  #D4D4DC
// text mid:     #C8C8D0  /  #B4B4BC
// text muted:   #9A9AA4  /  #7A7A84
// active green: #6DC87A
// chrome glow:  linear-gradient(135deg, #F0F0FF, #C0C0D8)
// ─────────────────────────────────────────────────────────────────────────────

const clip4 = 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)';
const clip6 = 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)';

const FONT_CINZEL = '"Cinzel", "Georgia", serif';
const FONT_MONO   = '"JetBrains Mono", "Courier New", monospace';

const LINKS = [
  {
    id: 'email',
    label: 'EMAIL',
    value: 'Gmail',
    sub: 'Direct Channel',
    href: 'mailto:harrylagto@gmail.com',
  },
  {
    id: 'github',
    label: 'GITHUB',
    value: 'GitHub',
    sub: 'Source Repository',
    href: 'https://github.com/hakkai-asf',
  },
  {
    id: 'linkedin',
    label: 'LINKEDIN',
    value: 'LinkedIn',
    sub: 'Professional Network',
    href: 'https://www.linkedin.com/in/harry-nielsen-lagto-5a6776307/',
  },
  {
    id: 'facebook',
    label: 'FACEBOOK',
    value: 'Facebook',
    sub: 'Social Channel',
    href: 'https://facebook.com/harry.lagto',
  },
];

const TERMINAL_LINES = [
  '> INITIALIZING COMMS TERMINAL...',
  '> OPERATOR: Harry Nielsen M. Lagto',
  '> STATUS: AVAILABLE FOR WORK',
  '> LOCATION: Metro Manila, Philippines',
  '> ROLE: Aspiring Fullstack Developer',
  '> CLEARANCE: Open Contact',
  '> AWAITING TRANSMISSION...',
];

/* ── Ornate divider — identical to ProjectsSection ── */
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

/* ── Panel label (matches "Armament Attribute Scale" style) ── */
function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily:    FONT_MONO,
      fontSize:      '0.72rem',
      letterSpacing: '0.18em',
      color:         '#9A9AA4',
      textTransform: 'uppercase',
      marginBottom:  '0.5rem',
      paddingBottom: '0.375rem',
      borderBottom:  '1px solid rgba(168,168,176,0.08)',
    }}>
      {children}
    </p>
  );
}

/* ── Shared panel wrapper ── */
function Panel({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: 'rgba(6,6,8,0.92)',
        border:     '1px solid rgba(168,168,176,0.12)',
        clipPath:   clip6,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Contact link card ── */
function LinkCard({
  link,
  delay,
  onMouseEnter,
  onClick,
}: {
  link: typeof LINKS[0];
  delay: number;
  onMouseEnter: () => void;
  onClick: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.a
      key={link.id}
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
        border:         `1px solid ${hovered ? 'rgba(212,212,220,0.25)' : 'rgba(168,168,176,0.12)'}`,
        clipPath:       clip6,
        transition:     'all 0.18s',
        boxShadow:      hovered ? '0 0 14px rgba(212,212,220,0.08)' : 'none',
      }}
    >
      {/* Icon placeholder — ◈ with rarity-style border */}
      <div style={{
        width:        40,
        height:       40,
        borderRadius: '50%',
        border:       `1px solid ${hovered ? 'rgba(212,212,220,0.3)' : 'rgba(168,168,176,0.12)'}`,
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
        flexShrink:   0,
        background:   hovered ? 'rgba(212,212,220,0.06)' : 'rgba(4,4,6,0.7)',
        transition:   'all 0.18s',
      }}>
        <span style={{
          fontFamily: FONT_CINZEL,
          fontSize:   '1rem',
          color:      hovered ? '#D4D4DC' : '#7A7A84',
          transition: 'all 0.18s',
        }}>◈</span>
      </div>

      <div className="flex-1 min-w-0">
        {/* Label + sub */}
        <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
          <span style={{
            fontFamily:    FONT_MONO,
            fontSize:      '0.62rem',
            letterSpacing: '0.18em',
            color:         '#9A9AA4',
            textTransform: 'uppercase',
          }}>
            {link.label}
          </span>
          <span style={{
            fontFamily:    FONT_MONO,
            fontSize:      '0.58rem',
            color:         '#7A7A84',
            letterSpacing: '0.08em',
          }}>
            — {link.sub}
          </span>
        </div>
        {/* Value (Cinzel, bright silver) */}
        <p style={{
          fontFamily:    FONT_CINZEL,
          fontWeight:    400,
          fontSize:      'clamp(0.9rem, 2vw, 1.05rem)',
          color:         hovered ? '#F0F0FF' : '#D4D4DC',
          letterSpacing: '0.06em',
          transition:    'all 0.18s',
          textShadow:    hovered ? '0 0 14px rgba(212,212,220,0.3)' : 'none',
        }}>
          {link.value}
        </p>
      </div>

      {/* Arrow */}
      <span style={{
        fontFamily: FONT_MONO,
        fontSize:   '1rem',
        color:      hovered ? '#D4D4DC' : '#7A7A84',
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

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function ContactSection() {
  const { playHover, playSelect, playConfirm } = useAudio();
  const [visibleLines, setVisibleLines] = useState(0);
  const [copied, setCopied]             = useState(false);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= TERMINAL_LINES.length) clearInterval(t);
    }, 180);
    return () => clearInterval(t);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText('harrylagto@gmail.com').catch(() => {});
    setCopied(true);
    playConfirm();
    setTimeout(() => setCopied(false), 2000);
  };

  /* Terminal line colour — silver palette */
  const lineColor = (i: number) => {
    if (i === 0) return '#C8C8D0';                     // first line: bright silver
    if (i === 2) return '#6DC87A';                     // STATUS: green
    if (i >= TERMINAL_LINES.length - 1) return '#7A7A84'; // last line: muted
    return '#9A9AA4';                                  // rest: mid silver
  };

  /* ── Shared terminal body ── */
  const TerminalBody = ({ fontSize = '0.72rem' }: { fontSize?: string }) => (
    <>
      {/* chrome dots */}
      <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4A4A52' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6E6E7A' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#9A9AA4' }} />
        <span style={{
          fontFamily:    FONT_MONO,
          fontSize:      '0.5rem',
          color:         '#7A7A84',
          marginLeft:    8,
          letterSpacing: '0.1em',
        }}>
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
            style={{
              fontFamily:    FONT_MONO,
              fontSize,
              letterSpacing: '0.04em',
              color:         lineColor(i),
              lineHeight:    1.6,
            }}
          >
            {line}
          </motion.p>
        ))}
        {visibleLines >= TERMINAL_LINES.length && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ fontFamily: FONT_MONO, fontSize: '0.82rem', color: '#9A9AA4' }}
          >_</motion.span>
        )}
      </div>
    </>
  );

  /* ── CV download row ── */
  const CVDownload = () => (
    <div className="flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <p style={{
          fontFamily:    FONT_CINZEL,
          fontWeight:    400,
          fontSize:      'clamp(0.88rem, 2vw, 1rem)',
          color:         '#D4D4DC',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          Curriculum Vitae
        </p>
        <p style={{
          fontFamily:    FONT_MONO,
          fontSize:      '0.62rem',
          color:         '#7A7A84',
          marginTop:     3,
          letterSpacing: '0.05em',
        }}>
          ATS-Optimized · PDF Format
        </p>
      </div>
      {/* CTA — matches ProjectsSection "Use Item — Launch Demo" button */}
      <a
        href="/cv/HARRY LAGTO ATS CV.pdf"
        download
        onMouseEnter={playHover}
        onClick={playConfirm}
        style={{
          fontFamily:     FONT_CINZEL,
          fontSize:       '0.75rem',
          letterSpacing:  '0.18em',
          color:          '#050505',
          background:     '#D4D4DC',
          padding:        '8px 20px',
          clipPath:       clip6,
          textDecoration: 'none',
          textTransform:  'uppercase',
          display:        'inline-block',
          transition:     'background 0.18s, box-shadow 0.18s',
          flexShrink:     0,
        }}
        onMouseOver={e => {
          (e.currentTarget as HTMLElement).style.background  = '#ffffff';
          (e.currentTarget as HTMLElement).style.boxShadow  = '0 0 18px rgba(212,212,220,0.3)';
        }}
        onMouseOut={e => {
          (e.currentTarget as HTMLElement).style.background  = '#D4D4DC';
          (e.currentTarget as HTMLElement).style.boxShadow  = 'none';
        }}
      >
        Download
      </a>
    </div>
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
      <div className="flex flex-col flex-1 overflow-y-auto scrollable md:hidden px-4 pt-4 pb-20 gap-4 relative z-10">

        {/* Status pill */}
        <Panel style={{ padding: '10px 14px' }}>
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: FONT_MONO, fontSize: '0.6rem', color: '#9A9AA4', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Operator Status
            </span>
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
              Available for Work
            </span>
          </div>
        </Panel>

        {/* Terminal */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
            <span style={{ color: '#7A7A84', fontSize: '0.75rem' }}>◈</span>
            <p style={{ fontFamily: FONT_CINZEL, fontSize: '0.88rem', letterSpacing: '0.16em', color: '#D4D4DC', textTransform: 'uppercase', fontWeight: 400 }}>
              Comms Terminal
            </p>
          </div>
          <Panel style={{ padding: '14px 16px' }}>
            <TerminalBody fontSize="0.65rem" />
          </Panel>
        </motion.div>

        {/* Channels header */}
        <div style={{ marginTop: 4 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
            <span style={{ color: '#7A7A84', fontSize: '0.75rem' }}>◈</span>
            <p style={{ fontFamily: FONT_CINZEL, fontSize: '0.88rem', letterSpacing: '0.16em', color: '#D4D4DC', textTransform: 'uppercase', fontWeight: 400 }}>
              Direct Channels
            </p>
          </div>
          <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(168,168,176,0.4), transparent)' }} />
        </div>

        {/* Link cards */}
        {LINKS.map((link, i) => (
          <LinkCard
            key={link.id}
            link={link}
            delay={0.1 + i * 0.07}
            onMouseEnter={playHover}
            onClick={playSelect}
          />
        ))}

        {/* CV download */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
        >
          <Panel style={{ padding: '16px 18px' }}>
            <PanelLabel>Classified Documents</PanelLabel>
            <CVDownload />
          </Panel>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP LAYOUT
      ══════════════════════════════════════════ */}
      <div className="hidden md:flex flex-row flex-1 py-8 px-8 gap-6 overflow-hidden relative z-10">

        {/* ── Left: Terminal panel ── */}
        <motion.div
          className="flex flex-col flex-shrink-0"
          style={{ width: 'clamp(240px, 28vw, 320px)' }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Section heading — matches ProjectsSection "PROJECTS" */}
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
            Contact
          </h2>
          <p style={{
            fontFamily:    FONT_MONO,
            fontSize:      '0.72rem',
            letterSpacing: '0.14em',
            color:         '#9A9AA4',
            textTransform: 'uppercase',
            marginBottom:  10,
          }}>
            Establish a transmission
          </p>
          <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(168,168,176,0.4), transparent)', marginBottom: 16 }} />

          {/* Terminal card */}
          <Panel style={{ padding: '18px', flex: 1, minHeight: 280 }}>
            <TerminalBody fontSize="0.72rem" />
          </Panel>

          {/* Status card */}
          <Panel style={{ padding: '12px 16px', marginTop: 12 }}>
            <div className="flex justify-between items-center">
              <span style={{ fontFamily: FONT_MONO, fontSize: '0.6rem', color: '#9A9AA4', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Operator Status
              </span>
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
                Available for Work
              </span>
            </div>
          </Panel>
        </motion.div>

        {/* ── Right: Links + CV ── */}
        <motion.div
          className="flex-1 flex flex-col gap-4 overflow-y-auto scrollable"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Channels heading */}
          <div style={{ marginBottom: 4 }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
              <span style={{ color: '#7A7A84', fontSize: '0.82rem' }}>◈</span>
              <p style={{
                fontFamily:    FONT_CINZEL,
                fontWeight:    400,
                fontSize:      '0.95rem',
                letterSpacing: '0.18em',
                color:         '#D4D4DC',
                textTransform: 'uppercase',
              }}>
                Direct Channels
              </p>
            </div>
            <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(168,168,176,0.4), transparent)' }} />
          </div>

          {LINKS.map((link, i) => (
            <LinkCard
              key={link.id}
              link={link}
              delay={0.2 + i * 0.08}
              onMouseEnter={playHover}
              onClick={playSelect}
            />
          ))}

          {/* CV download */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            style={{ marginTop: 8 }}
          >
            {/* Header card — mirrors DetailPanel top card from ProjectsSection */}
            <div
              style={{
                position:     'relative',
                background:   'rgba(4,4,6,0.7)',
                border:       '1px solid rgba(168,168,176,0.1)',
                borderTop:    '2px solid #A8A8B0',
                clipPath:     clip6,
                padding:      '14px 18px',
                marginBottom: 0,
              }}
            >
              <div style={{
                position:    'absolute', inset: 0,
                background:  'radial-gradient(ellipse at top left, rgba(168,168,176,0.05) 0%, transparent 60%)',
                pointerEvents: 'none',
              }} />
              <p style={{
                fontFamily:    FONT_MONO,
                fontSize:      '0.68rem',
                letterSpacing: '0.2em',
                color:         '#9A9AA4',
                textTransform: 'uppercase',
                marginBottom:  6,
              }}>
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