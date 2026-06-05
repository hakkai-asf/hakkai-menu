'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/lib/contexts/AudioContext';

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

const CV_PATH = '/cv/HARRY LAGTO ATS CV.pdf';

export default function ArchiveSection() {
  const { playHover, playConfirm, playToggle } = useAudio();
  const [lines, setLines] = useState(0);
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(1.0);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setLines(i);
      if (i >= BOOT_LINES.length) {
        clearInterval(t);
        setTimeout(() => setReady(true), 400);
      }
    }, 200);
    return () => clearInterval(t);
  }, []);

  const zoomIn = () => { setZoom(z => Math.min(2.5, parseFloat((z + 0.25).toFixed(2)))); playToggle(); };
  const zoomOut = () => { setZoom(z => Math.max(0.5, parseFloat((z - 0.25).toFixed(2)))); playToggle(); };
  const resetZoom = () => { setZoom(1.0); playToggle(); };

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col sm:flex-row overflow-auto bg-[#0a0a0c] text-[#E8E0D4] max-md:!pl-0 md:pl-[clamp(280px,30vw,400px)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Outer scrollable column */}
      <div
        className="scrollable flex flex-col gap-5 w-full sm:max-w-2xl px-4 py-6 sm:px-8 sm:py-8"
        style={{ overflowY: 'auto', overflowX: 'hidden' }}
      >

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="section-label mb-1">CLASSIFIED DATABASE</p>
          <div className="rule-gold-left" style={{ width: 100 }} />
          <h2 style={{ fontFamily: 'Cinzel, Georgia, serif', fontWeight: 400, fontSize: '1.8rem', color: '#E8C98E', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>
            PORTFOLIO ARCHIVE
          </h2>
        </motion.div>

        {/* Terminal boot */}
        <motion.div
          className="panel"
          style={{
            padding: '20px 24px',
            borderColor: 'rgba(200, 169, 110, 0.2)',
            clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E63946' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8A96E' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ECC71' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.5rem', color: '#C8A96E', marginLeft: 8 }}>
              ARCHIVE SYSTEM v1.0 — SECURE ACCESS
            </span>
          </div>
          <div className="rule-gold mb-3" />
          <div className="flex flex-col gap-0.5">
            {BOOT_LINES.slice(0, lines).map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.65rem',
                  lineHeight: 1.8,
                  letterSpacing: '0.04em',
                  color: line.includes('GRANTED') ? '#2ECC71'
                    : line.includes('ACCESSING') ? '#4ECDC4'
                      : 'rgba(200,169,110,0.7)',
                }}
              >
                {line}
              </motion.p>
            ))}
            {lines < BOOT_LINES.length && (
              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }}
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#C8A96E' }}>_</motion.span>
            )}
          </div>
        </motion.div>

        {/* Archive record + PDF viewer */}
        {ready && (
          <motion.div
            className="panel-gold panel"
            style={{
              padding: '24px 28px',
              borderColor: '#C8A96E',
              boxShadow: '0 0 20px rgba(200, 169, 110, 0.15)',
              clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* File header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.5rem', color: '#C8A96E', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  RECORD ID: ARC-HNL-2024-001
                </p>
                <h3 style={{ fontFamily: 'Cinzel, Georgia, serif', fontWeight: 400, fontSize: '1.3rem', color: '#E8C98E', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
                  Developer Portfolio
                </h3>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: '#C8A96E', marginTop: 2 }}>
                  Harry Nielsen M. Lagto · Aspiring Fullstack Developer
                </p>
              </div>
              <div style={{ background: 'rgba(46,204,113,0.1)', border: '1px solid rgba(46,204,113,0.3)', padding: '4px 12px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.5rem', color: '#2ECC71', letterSpacing: '0.1em' }}>
                  ● ACCESSIBLE
                </span>
              </div>
            </div>

            <div className="rule-gold mb-4" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              {[
                ['FILED BY', 'Harry Nielsen Lagto'],
                ['CLASSIFICATION', 'Open Access'],
                ['FORMAT', 'PDF Document'],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="hud-label">{label}</p>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: '#E8E0D4', marginTop: 2 }}>{val}</p>
                </div>
              ))}
            </div>

            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#E8E0D4', lineHeight: 1.6, marginBottom: 20 }}>
              Curriculum vitae — complete professional record including projects, technical skills, and work history.
            </p>

            {/* Action buttons */}
            <div className="flex gap-3 mb-5 flex-wrap">
              <a
                href={CV_PATH}
                download
                id="archive-cv"
                className="btn-ghost"
                style={{ textDecoration: 'none', display: 'inline-block' }}
                onMouseEnter={() => playHover()}
                onClick={() => playConfirm()}
              >
                ↓ DOWNLOAD CV
              </a>
              <a
                href={CV_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                style={{ textDecoration: 'none', display: 'inline-block' }}
                onMouseEnter={() => playHover()}
                onClick={() => playConfirm()}
              >
                ↗ OPEN IN NEW TAB
              </a>
            </div>

            {/* ── PDF VIEWER ── */}
            <div>
              {/* Viewer toolbar */}
              <div
                className="flex items-center justify-between"
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(200,169,110,0.25)',
                  borderBottom: 'none',
                  padding: '8px 14px',
                  clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% 100%, 0% 100%, 0% 4px)',
                }}
              >
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.52rem', color: '#C8A96E', letterSpacing: '0.12em' }}>
                  CV — SECURE VIEW
                </span>
                <div className="flex items-center gap-2">
                  <button
                    className="btn-ghost"
                    style={{ padding: '3px 10px', fontSize: '0.9rem', lineHeight: 1 }}
                    onClick={zoomOut}
                    onMouseEnter={() => playHover()}
                    title="Zoom Out"
                  >−</button>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#E8C98E', minWidth: 40, textAlign: 'center' }}>
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    className="btn-ghost"
                    style={{ padding: '3px 10px', fontSize: '0.9rem', lineHeight: 1 }}
                    onClick={zoomIn}
                    onMouseEnter={() => playHover()}
                    title="Zoom In"
                  >+</button>
                  <button
                    className="btn-ghost"
                    style={{ padding: '3px 10px', fontSize: '0.6rem' }}
                    onClick={resetZoom}
                    onMouseEnter={() => playHover()}
                    title="Reset Zoom"
                  >⊙ RESET</button>
                </div>
              </div>

              {/* iframe container */}
              <div
                style={{
                  width: '100%',
                  height: '70vh',
                  overflow: 'auto',
                  background: 'rgba(5,5,8,0.95)',
                  border: '1px solid rgba(200,169,110,0.35)',
                  position: 'relative',
                }}
              >
                <iframe
                  src={`${CV_PATH}#zoom=${Math.round(zoom * 100)}`}
                  title="CV Document"
                  style={{
                    width: `${Math.round(zoom * 100)}%`,
                    height: `${Math.max(100, Math.round(zoom * 100))}%`,
                    border: 'none',
                    display: 'block',
                    minHeight: '100%',
                    transformOrigin: 'top left',
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom spacer */}
        <div style={{ height: 40 }} />
      </div>
    </motion.div>
  );
}
