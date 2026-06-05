'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/lib/contexts/AudioContext';

const LINKS = [
  {
    id: 'email',
    label: 'EMAIL',
    value: 'Gmail',
    sub: 'Direct Channel',
    color: '#C8A96E',
    href: 'mailto:harrylagto@gmail.com',
  },
  {
    id: 'github',
    label: 'GITHUB',
    value: 'GitHub',
    sub: 'Source Repository',
    color: '#E8C98E',
    href: 'https://github.com/hakkai-asf',
  },
  {
    id: 'linkedin',
    label: 'LINKEDIN',
    value: 'LinkedIn',
    sub: 'Professional Network',
    color: '#4ECDC4',
    href: 'https://www.linkedin.com/in/harry-nielsen-lagto-5a6776307/',
  },
  {
    id: 'facebook',
    label: 'FACEBOOK',
    value: 'Facebook',
    sub: 'Social Channel',
    color: '#A78BFA',
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

export default function ContactSection() {
  const { playHover, playSelect, playConfirm } = useAudio();
  const [visibleLines, setVisibleLines] = useState(0);
  const [copied, setCopied] = useState(false);

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
    navigator.clipboard.writeText('harrylagto@gmail.com').catch(() => { });
    setCopied(true);
    playConfirm();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col md:flex-row overflow-hidden bg-[#0a0a0c] text-[#E8E0D4] max-md:!pl-0 md:pl-[clamp(280px,30vw,400px)] pt-16 md:pt-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row flex-1 py-8 px-4 md:px-8 gap-6 overflow-auto md:overflow-hidden">

        {/* Terminal panel */}
        <motion.div
          className="flex flex-col flex-shrink-0 w-full md:w-[clamp(240px,28vw,340px)]"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label mb-3">COMMS TERMINAL</p>
          <div className="panel flex-1" style={{
            padding: '20px',
            minHeight: 300,
            borderColor: 'rgba(200, 169, 110, 0.2)',
            clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
          }}>
            {/* Terminal header */}
            <div className="flex items-center gap-2 mb-4">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E63946' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8A96E' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ECC71' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.5rem', color: '#C8A96E', marginLeft: 8, letterSpacing: '0.1em' }}>
                TERMINAL v1.0
              </span>
            </div>
            <div className="rule-gold mb-4" />

            {/* Lines */}
            <div className="flex flex-col gap-1">
              {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="terminal-line"
                  style={{
                    color: i === 0 ? '#4ECDC4'
                      : i === 2 ? '#2ECC71'
                        : i >= TERMINAL_LINES.length - 1 ? 'rgba(200,169,110,0.6)'
                          : 'rgba(78,205,196,0.7)',
                  }}
                >
                  {line}
                </motion.p>
              ))}

              {/* Blinking cursor */}
              {visibleLines >= TERMINAL_LINES.length && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#C8A96E' }}
                >
                  _
                </motion.span>
              )}
            </div>
          </div>

          {/* Status indicator */}
          <div className="panel mt-3" style={{
            padding: '12px 16px',
            borderColor: 'rgba(200, 169, 110, 0.2)',
            clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
          }}>
            <div className="flex justify-between items-center">
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', color: '#C8A96E', letterSpacing: '0.08em' }}>OPERATOR STATUS</span>
              <div className="status-available" style={{ fontSize: '0.65rem' }}>AVAILABLE FOR WORK</div>
            </div>
          </div>
        </motion.div>

        {/* Contact links */}
        <motion.div
          className="flex-1 flex flex-col gap-4 overflow-y-auto scrollable"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="mb-2">
            <p className="section-label mb-1">DIRECT CHANNELS</p>
            <div className="rule-gold-left" style={{ width: 80 }} />
          </div>

          {LINKS.map((link, i) => (
            <motion.a
              key={link.id}
              id={`contact-${link.id}`}
              href={link.href}
              target={link.id !== 'email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="mission-card flex items-center gap-4"
              style={{
                padding: '18px 22px',
                textDecoration: 'none',
                borderColor: 'rgba(200, 169, 110, 0.2)',
                clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2 + i * 0.08 }}
              onMouseEnter={() => playHover()}
              onClick={() => playSelect()}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.5rem', color: `${link.color}80`, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{link.label}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.45rem', color: '#E8E0D4', letterSpacing: '0.08em' }}>— {link.sub}</span>
                </div>
                <p style={{ fontFamily: 'Cinzel, Georgia, serif', fontWeight: 400, fontSize: '0.9rem', color: '#E8C98E', letterSpacing: '0.04em' }}>
                  {link.value}
                </p>
              </div>
              <span style={{ color: link.color, fontSize: '0.8rem', opacity: 0.6 }}>↗</span>
            </motion.a>
          ))}

          {/* Resume download */}
          <motion.div
            className="panel mt-2"
            style={{
              padding: '18px 22px',
              borderColor: 'rgba(200, 169, 110, 0.2)',
              clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <p className="section-label mb-3">CLASSIFIED DOCUMENTS</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p style={{ fontFamily: 'Cinzel, Georgia, serif', fontWeight: 400, fontSize: '0.95rem', color: '#E8C98E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Curriculum Vitae
                </p>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', color: '#E8E0D4', marginTop: 2 }}>
                  ATS-Optimized · PDF Format
                </p>
              </div>
              <a
                href="/cv/HARRY LAGTO ATS CV.pdf"
                download
                id="download-cv"
                className="btn-primary"
                style={{ textDecoration: 'none', display: 'inline-block', fontSize: '0.75rem' }}
                onMouseEnter={() => playHover()}
                onClick={() => playConfirm()}
              >
                ↓ DOWNLOAD
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
