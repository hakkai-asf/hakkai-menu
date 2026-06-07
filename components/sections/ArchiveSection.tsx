'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/lib/contexts/AudioContext';

const clip4 = 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)';
const clip6 = 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)';
const FONT_CINZEL = '"Cinzel", "Georgia", serif';
const FONT_MONO   = '"JetBrains Mono", "Courier New", monospace';

const BOOT_LINES = [
  '> ACCESSING CLASSIFIED DATABASE...',
  '> SECURITY LEVEL: OPEN',
  '> OPERATOR: Harry Nielsen M. Lagto',
  '> FILE TYPE: Portfolio Archive',
  '> ENCRYPTION: NONE',
  '> STATUS: ACCESSIBLE',
  '> LOADING RECORDS...',
  '> ACCESS GRANTED.',
];

const LOCAL_CV_PATH = '/cv/HARRY%20LAGTO%20ATS%20CV.pdf';
const DEFAULT_GOOGLE_DRIVE_CV_URL = 'https://drive.google.com/file/d/1s4r34OIo3y64V-QTmQbxQdbcfw8NxC8Z/view?usp=sharing';
const GOOGLE_DRIVE_CV_URL = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CV_URL?.trim() || DEFAULT_GOOGLE_DRIVE_CV_URL;

function getGoogleDriveFileId(url: string) {
  return url.match(/\/file\/d\/([^/]+)/)?.[1] || url.match(/[?&]id=([^&]+)/)?.[1] || '';
}
function getGoogleDrivePreviewUrl(url: string) {
  const id = getGoogleDriveFileId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : url;
}
function getGoogleDriveDownloadUrl(url: string) {
  const id = getGoogleDriveFileId(url);
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : LOCAL_CV_PATH;
}

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

function GhostBtn({ href, download, target, rel, onClick, onMouseEnter, children, style }: {
  href?: string; download?: boolean; target?: string; rel?: string;
  onClick?: () => void; onMouseEnter?: () => void;
  children: React.ReactNode; style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = {
    fontFamily:     FONT_MONO,
    fontSize:       '0.75rem',
    fontWeight:     700,
    letterSpacing:  '0.14em',
    textTransform:  'uppercase',
    color:          '#FFFFFF',
    background:     'rgba(6,6,8,0.85)',
    border:         '1px solid rgba(168,168,176,0.28)',
    padding:        '8px 18px',
    clipPath:       clip4,
    cursor:         'pointer',
    textDecoration: 'none',
    display:        'inline-block',
    textAlign:      'center',
    transition:     'all 0.15s',
    ...style,
  };

  const over = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,212,220,0.5)';
    (e.currentTarget as HTMLElement).style.color       = '#FFFFFF';
    (e.currentTarget as HTMLElement).style.boxShadow  = '0 0 12px rgba(212,212,220,0.12)';
  };
  const out = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,168,176,0.28)';
    (e.currentTarget as HTMLElement).style.color       = '#FFFFFF';
    (e.currentTarget as HTMLElement).style.boxShadow  = 'none';
  };

  if (href) return <a href={href} download={download} target={target} rel={rel} style={base} onClick={onClick} onMouseEnter={onMouseEnter} onMouseOver={over} onMouseOut={out}>{children}</a>;
  return <button style={base} onClick={onClick} onMouseEnter={onMouseEnter} onMouseOver={over} onMouseOut={out}>{children}</button>;
}

export default function ArchiveSection() {
  const { playHover, playConfirm, playToggle } = useAudio();
  const [lines, setLines] = useState(0);
  const [ready, setReady] = useState(false);
  const [zoom,  setZoom]  = useState(1.0);

  const cvDownloadUrl = useMemo(() => getGoogleDriveDownloadUrl(GOOGLE_DRIVE_CV_URL), []);
  const cvPreviewUrl  = useMemo(() => getGoogleDrivePreviewUrl(GOOGLE_DRIVE_CV_URL),  []);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setLines(i);
      if (i >= BOOT_LINES.length) { clearInterval(t); setTimeout(() => setReady(true), 400); }
    }, 200);
    return () => clearInterval(t);
  }, []);

  const zoomIn    = () => { setZoom(z => Math.min(2.5, parseFloat((z + 0.25).toFixed(2)))); playToggle(); };
  const zoomOut   = () => { setZoom(z => Math.max(0.5, parseFloat((z - 0.25).toFixed(2)))); playToggle(); };
  const resetZoom = () => { setZoom(1.0); playToggle(); };

  const lineColor = (line: string, i: number) => {
    if (line.includes('GRANTED'))   return '#7EE89A';
    if (line.includes('ACCESSING')) return '#FFFFFF';
    if (i >= BOOT_LINES.length - 1) return '#9A9AA4';
    return '#E0E0E8';
  };

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col max-md:!pl-0 md:pl-[clamp(280px,30vw,400px)] overflow-y-auto scrollable"
      style={{ background: '#050505', color: '#FFFFFF' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{
        position: 'fixed', top: '40%', left: '55%',
        width: '60vw', height: '60vw', borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(168,168,176,0.03) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div className="flex flex-col gap-4 md:gap-5 w-full max-w-2xl px-4 pt-16 pb-10 md:px-8 md:py-8 md:pt-8 relative z-10">

        {/* ── Page header ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 style={{
            fontFamily:    FONT_CINZEL,
            fontWeight:    700,
            fontSize:      'clamp(1.15rem, 2.5vw, 1.5rem)',
            letterSpacing: '0.18em',
            color:         '#FFFFFF',
            textTransform: 'uppercase',
            textShadow:    '0 0 24px rgba(255,255,255,0.18)',
            marginBottom:  4,
          }}>
            Portfolio Archive
          </h2>
          <p style={{
            fontFamily:    FONT_MONO,
            fontSize:      '0.78rem',
            fontWeight:    700,
            letterSpacing: '0.14em',
            color:         '#B8B8C4',
            textTransform: 'uppercase',
          }}>
            Classified database — open access
          </p>
          <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(168,168,176,0.5), transparent)', marginTop: 10 }} />
        </motion.div>

        {/* ── Terminal boot sequence ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            background: 'rgba(6,6,8,0.92)',
            border:     '1px solid rgba(168,168,176,0.12)',
            padding:    '16px 18px',
            clipPath:   clip6,
          }}
        >
          <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4A4A52' }} />
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#6E6E7A' }} />
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#9A9AA4' }} />
            <span style={{ fontFamily: FONT_MONO, fontSize: '0.52rem', fontWeight: 700, color: '#9A9AA4', marginLeft: 6, letterSpacing: '0.1em' }}>
              ARCHIVE SYSTEM v1.0 — SECURE ACCESS
            </span>
          </div>
          <OrnateDivider />

          <div className="flex flex-col gap-0.5">
            {BOOT_LINES.slice(0, lines).map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                style={{ fontFamily: FONT_MONO, fontSize: '0.68rem', fontWeight: 700, lineHeight: 1.8, letterSpacing: '0.04em', color: lineColor(line, i) }}
              >
                {line}
              </motion.p>
            ))}
            {lines < BOOT_LINES.length && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                style={{ fontFamily: FONT_MONO, fontSize: '0.72rem', fontWeight: 700, color: '#B8B8C4' }}
              >_</motion.span>
            )}
          </div>
        </motion.div>

        {/* ── Archive record + PDF viewer ── */}
        {ready && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

            {/* Header card */}
            <div style={{
              position:     'relative',
              background:   'rgba(4,4,6,0.7)',
              border:       '1px solid rgba(168,168,176,0.22)',
              borderTop:    '2px solid #C8C8D0',
              clipPath:     clip6,
              padding:      '16px 18px',
              marginBottom: 0,
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top left, rgba(168,168,176,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

              <div className="flex flex-col xs:flex-row justify-between items-start gap-3 relative">
                <div className="min-w-0">
                  <p style={{ fontFamily: FONT_MONO, fontSize: '0.68rem', fontWeight: 700, color: '#B8B8C4', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
                    RECORD-ID &bull; ARC-HNL-2024-001 &bull; PORTFOLIO
                  </p>
                  <h3 style={{
                    fontFamily:    FONT_CINZEL,
                    fontWeight:    700,
                    fontSize:      'clamp(1.35rem, 3vw, 2rem)',
                    color:         '#FFFFFF',
                    letterSpacing: '0.06em',
                    lineHeight:    1.15,
                    textShadow:    '0 0 24px rgba(255,255,255,0.18)',
                  }}>
                    Developer Portfolio
                  </h3>
                  <p style={{ fontFamily: FONT_MONO, fontSize: '0.75rem', fontWeight: 700, color: '#B8B8C4', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>
                    Harry Nielsen M. Lagto · Aspiring Fullstack Developer
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span style={{ fontFamily: FONT_MONO, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', border: '1px solid rgba(168,168,176,0.35)', color: '#FFFFFF', padding: '2px 8px', textTransform: 'uppercase', clipPath: clip4 }}>
                    RARE
                  </span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', border: '1px solid rgba(126,232,154,0.4)', color: '#7EE89A', background: 'rgba(126,232,154,0.06)', padding: '2px 8px', textTransform: 'uppercase', clipPath: clip4 }}>
                    ACCESSIBLE
                  </span>
                </div>
              </div>

              <OrnateDivider />

              <p style={{ fontFamily: FONT_CINZEL, fontSize: '0.85rem', fontWeight: 700, color: '#D0D0DC', fontStyle: 'italic', lineHeight: 1.75, paddingLeft: '0.75rem', borderLeft: '2px solid rgba(168,168,176,0.3)' }}>
                &ldquo;Curriculum vitae — complete professional record including projects, technical skills, and work history.&rdquo;
              </p>
            </div>

            {/* Metadata + actions card */}
            <div style={{ background: 'rgba(6,6,8,0.92)', border: '1px solid rgba(168,168,176,0.12)', borderTop: 'none', padding: '16px 18px', clipPath: clip6, marginBottom: 0 }}>
              <PanelLabel>File Details</PanelLabel>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {([
                  ['FILED BY',       'Harry Nielsen Lagto'],
                  ['CLASSIFICATION', 'Open Access'],
                  ['FORMAT',         'PDF Document'],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k}>
                    <p style={{ fontFamily: FONT_MONO, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', color: '#9A9AA4', textTransform: 'uppercase', marginBottom: 3 }}>{k}</p>
                    <p style={{ fontFamily: FONT_MONO, fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>{v}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <a
                  href={cvDownloadUrl}
                  download
                  onMouseEnter={playHover}
                  onClick={playConfirm}
                  style={{
                    fontFamily: FONT_CINZEL, fontSize: '0.82rem', fontWeight: 700,
                    letterSpacing: '0.18em', color: '#050505', background: '#FFFFFF',
                    padding: '10px 24px', clipPath: clip6, textDecoration: 'none',
                    display: 'block', textAlign: 'center', textTransform: 'uppercase',
                    transition: 'background 0.18s, box-shadow 0.18s', flex: 1,
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = '#D4D4DC'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 22px rgba(255,255,255,0.35)'; }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = '#FFFFFF'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  ↓ Download CV
                </a>
                <GhostBtn href={cvPreviewUrl} target="_blank" rel="noopener noreferrer" onMouseEnter={playHover} onClick={playConfirm} style={{ flex: 1, padding: '10px 24px' }}>
                  ↗ Open in New Tab
                </GhostBtn>
              </div>
            </div>

            {/* PDF Viewer */}
            <div style={{ marginTop: 16 }}>
              <div
                className="flex flex-wrap items-center justify-between gap-2"
                style={{
                  background:   'rgba(4,4,6,0.85)',
                  border:       '1px solid rgba(168,168,176,0.2)',
                  borderBottom: 'none',
                  padding:      '8px 14px',
                  clipPath:     'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% 100%, 0% 100%, 0% 4px)',
                }}
              >
                <span style={{ fontFamily: FONT_MONO, fontSize: '0.62rem', fontWeight: 700, color: '#B8B8C4', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  CV — SECURE VIEW
                </span>
                <div className="flex items-center gap-1.5">
                  <GhostBtn onClick={zoomOut}   onMouseEnter={playHover} style={{ padding: '3px 10px', fontSize: '0.95rem', lineHeight: '1' }}>−</GhostBtn>
                  <span style={{ fontFamily: FONT_MONO, fontSize: '0.65rem', fontWeight: 700, color: '#FFFFFF', minWidth: 36, textAlign: 'center' }}>
                    {Math.round(zoom * 100)}%
                  </span>
                  <GhostBtn onClick={zoomIn}    onMouseEnter={playHover} style={{ padding: '3px 10px', fontSize: '0.95rem', lineHeight: '1' }}>+</GhostBtn>
                  <GhostBtn onClick={resetZoom} onMouseEnter={playHover} style={{ padding: '3px 10px', fontSize: '0.58rem' }}>⊙ RESET</GhostBtn>
                </div>
              </div>

              <div style={{ width: '100%', height: 'clamp(340px, 55vh, 100vh)', overflow: 'auto', background: 'rgba(4,4,6,0.95)', border: '1px solid rgba(168,168,176,0.22)', position: 'relative' }}>
                <iframe
                  src={cvPreviewUrl}
                  title="CV Document"
                  style={{ width: `${Math.round(zoom * 100)}%`, height: `${Math.max(100, Math.round(zoom * 100))}%`, border: 'none', display: 'block', minHeight: '100%', transformOrigin: 'top left' }}
                />
              </div>

              <p className="block sm:hidden text-center mt-2" style={{ fontFamily: FONT_MONO, fontSize: '0.52rem', fontWeight: 700, color: '#9A9AA4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Pinch to zoom · Use ↗ to open full screen
              </p>
            </div>
          </motion.div>
        )}

        <div style={{ height: 24 }} />
      </div>
    </motion.div>
  );
}