'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/contexts/GameContext';
import { useAudio } from '@/lib/contexts/AudioContext';

const LANGUAGES = [
  { id: 'english',  label: 'English'  },
  { id: 'tagalog',  label: 'Tagalog'  },
  { id: 'spanish',  label: 'Spanish'  },
  { id: 'japanese', label: 'Japanese' },
];

const TRACKS = [
  { id: 'cinematic',    label: 'Cinematic'    },
  { id: 'dark fantasy', label: 'Dark Fantasy' },
];

const clip4 = 'polygon(4px 0%,100% 0%,100% calc(100% - 4px),calc(100% - 4px) 100%,0% 100%,0% 4px)';
const clip6 = 'polygon(6px 0%,calc(100% - 6px) 0%,100% 6px,100% calc(100% - 6px),calc(100% - 6px) 100%,6px 100%,0% calc(100% - 6px),0% 6px)';

function OrnateDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(168,168,176,0.35))' }} />
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{ color: '#A8A8B4', fontSize: '0.6rem' }}
      >◈</motion.span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(168,168,176,0.35),transparent)' }} />
    </div>
  );
}

function SettingRow({
  label, sub, children, stacked = false,
}: {
  label: string; sub?: string; children: React.ReactNode; stacked?: boolean;
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: stacked ? 'column' : 'row',
      alignItems: stacked ? 'flex-start' : 'center',
      justifyContent: stacked ? 'flex-start' : 'space-between',
      gap: stacked ? 10 : 0,
      padding: '12px 0',
      borderBottom: '1px solid rgba(168,168,176,0.07)',
    }}>
      <div>
        <p style={{
          fontFamily: 'Cinzel, Georgia, serif',
          fontWeight: 800, fontSize: '1rem',
          color: '#D4D4DC', textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>{label}</p>
        {sub && (
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.68rem', color: '#7A7A84', marginTop: 2, letterSpacing: '0.05em',
          }}>{sub}</p>
        )}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: stacked ? 'flex-start' : 'flex-end',
        minWidth: stacked ? 0 : 160,
        width: stacked ? '100%' : 'auto',
      }}>
        {children}
      </div>
    </div>
  );
}

function VolumeSlider({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const { playHover } = useAudio();
  // Use raw float (0–100) for pixel-accurate positioning — no rounding
  const pct = value * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', maxWidth: 220 }}>
      {/* Numeric readout — round only for display */}
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.78rem', fontWeight: 700, color: '#C8C8D0',
        width: 32, textAlign: 'right', flexShrink: 0,
      }}>
        {Math.round(pct)}
      </span>

      {/* Custom track + thumb container */}
      <div style={{ flex: 1, position: 'relative', height: 24, display: 'flex', alignItems: 'center', minWidth: 0 }}>
        {/* Track background */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: 'rgba(168,168,176,0.20)',
          borderRadius: 1,
        }} />
        {/* Track fill — no transition so it follows pointer instantly */}
        <div style={{
          position: 'absolute', left: 0, height: 2,
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #6E6E82, #D4D4DC)',
          borderRadius: 1,
          boxShadow: '0 0 6px rgba(200,200,255,0.3)',
        }} />
        {/* Diamond thumb — no transition */}
        <div style={{
          position: 'absolute',
          left: `calc(${pct}% - 6px)`,
          width: 12, height: 12,
          background: '#D4D4DC',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          boxShadow: '0 0 8px rgba(212,212,220,0.55)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />
        {/* Native range — invisible, handles all interaction */}
        <input
          type="range" min={0} max={1} step={0.001}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          onMouseEnter={() => playHover()}
          aria-label={label}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            opacity: 0, cursor: 'pointer',
            margin: 0, padding: 0, zIndex: 2,
            WebkitAppearance: 'none',
          }}
        />
      </div>
    </div>
  );
}

function SegBtn({ active, onClick, onHover, children }: {
  active: boolean; onClick: () => void; onHover: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      style={{
        fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700, fontSize: '0.8rem',
        letterSpacing: '0.06em', textTransform: 'uppercase',
        padding: '7px 16px', cursor: 'pointer', border: 'none',
        clipPath: clip4,
        background: active ? 'rgba(168,168,176,0.18)' : 'rgba(25,25,30,0.4)',
        color: active ? '#D4D4DC' : '#5A5A6E',
        borderLeft: `2px solid ${active ? '#A8A8B8' : 'transparent'}`,
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

function PanelCard({ children, delay = 0, heading }: {
  children: React.ReactNode; delay?: number; heading: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: 'rgba(6,6,8,0.92)',
        border: '1px solid rgba(168,168,176,0.15)',
        clipPath: clip6,
        padding: '18px 24px',
      }}
    >
      <p style={{
        fontFamily: 'Cinzel, Georgia, serif', fontWeight: 900, fontSize: '0.88rem',
        color: '#C8C8D0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2,
      }}>◈ {heading}</p>
      <OrnateDivider />
      {children}
    </motion.div>
  );
}

export default function SettingsSection() {
  const { settings, updateSetting } = useGame();
  const { playHover, playToggle, fadeBGM } = useAudio();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-10 flex overflow-hidden max-md:!pl-0 md:pl-[clamp(280px,30vw,400px)] pt-16 md:pt-0"
      style={{ background: '#050505', color: '#D4D4DC' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(168,168,176,0.04) 0%, transparent 70%)',
      }} />

      <div
        className="flex flex-1 py-8 px-8 gap-6 overflow-y-auto scrollable"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="flex flex-col gap-5 w-full max-w-2xl">

          {/* page heading */}
          <div>
            <p style={{
              fontFamily: 'Cinzel, Georgia, serif', fontWeight: 900,
              fontSize: '0.72rem', color: '#7A7A84',
              letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4,
            }}>SYSTEM CONFIGURATION</p>
            <div style={{ width: 100, height: 1, background: 'linear-gradient(90deg, #A8A8B0, transparent)' }} />
          </div>

          {/* ── AUDIO ── */}
          <PanelCard heading="Audio" delay={0.1}>
            <SettingRow label="Master Volume" sub="Controls all audio output" stacked={isMobile}>
              <VolumeSlider label="Master Volume" value={settings.masterVolume} onChange={v => updateSetting('masterVolume', v)} />
            </SettingRow>
            <SettingRow label="Music Volume" sub="Background music level" stacked={isMobile}>
              <VolumeSlider label="Music Volume" value={settings.musicVolume} onChange={v => updateSetting('musicVolume', v)} />
            </SettingRow>
            <SettingRow label="Effects Volume" sub="UI interaction sounds" stacked={isMobile}>
              <VolumeSlider label="Effects Volume" value={settings.sfxVolume} onChange={v => updateSetting('sfxVolume', v)} />
            </SettingRow>
            <SettingRow label="BGM Track" sub="Select background music" stacked>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {TRACKS.map(t => (
                  <SegBtn
                    key={t.id}
                    active={settings.currentTrack === t.id}
                    onClick={() => { updateSetting('currentTrack', t.id); fadeBGM(t.id); playToggle(); }}
                    onHover={playHover}
                  >
                    {t.label}
                  </SegBtn>
                ))}
              </div>
            </SettingRow>
          </PanelCard>

          {/* ── LANGUAGE ── */}
          <PanelCard heading="Language" delay={0.2}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              {LANGUAGES.map(l => (
                <button
                  key={l.id}
                  onClick={() => { updateSetting('language', l.id as any); playToggle(); }}
                  onMouseEnter={playHover}
                  style={{
                    fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700, fontSize: '0.95rem',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '8px 20px', cursor: 'pointer', border: 'none',
                    clipPath: clip6,
                    background: settings.language === l.id ? 'rgba(168,168,176,0.18)' : 'rgba(25,25,30,0.4)',
                    color: settings.language === l.id ? '#D4D4DC' : '#5A5A6E',
                    outline: settings.language === l.id ? '1px solid rgba(168,168,176,0.35)' : '1px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </PanelCard>

          {/* ── DEVELOPER INFO ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(6,6,8,0.92)',
              border: '1px solid rgba(168,168,176,0.15)',
              clipPath: clip6,
              overflow: 'hidden',
            }}
          >
            <div style={{
              borderTop: '2px solid #A8A8B0',
              padding: '14px 24px 10px',
              background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(168,168,176,0.07) 0%, transparent 70%)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: isMobile ? 'flex-start' : 'center',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                gap: isMobile ? 8 : 0,
                marginBottom: 6,
              }}>
                <p style={{
                  fontFamily: 'Cinzel, Georgia, serif', fontWeight: 900, fontSize: '0.88rem',
                  color: '#D4D4DC', textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>◈ Developer Information</p>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', fontWeight: 700,
                    color: '#9A9AA4', border: '1px solid rgba(168,168,176,0.25)',
                    clipPath: clip4, padding: '2px 7px', letterSpacing: '0.08em',
                  }}>BUILD v1.0.0</span>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', fontWeight: 700,
                    color: '#6DC87A', border: '1px solid rgba(109,200,122,0.3)',
                    clipPath: clip4, padding: '2px 7px', letterSpacing: '0.08em',
                  }}>ACTIVE</span>
                </div>
              </div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
                color: '#7A7A84', letterSpacing: '0.05em',
              }}>PORTFOLIO · SYSTEM METADATA</p>
            </div>

            <OrnateDivider />

            <div style={{
              padding: '6px 24px 18px',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '14px 24px',
            }}>
              {[
                ['DEVELOPER',     'Harry Nielsen M. Lagto'],
                ['FRAMEWORK',     'Next.js 14 + Three.js'],
                ['RENDERER',      'WebGL 2.0'],
                ['AUDIO ENGINE',  'Web Audio API'],
                ['LOCATION',      'Metro Manila, Philippines'],
                ['BUILD VERSION', 'v1.0.0'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', fontWeight: 700,
                    color: '#7A7A84', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3,
                  }}>{k}</p>
                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem',
                    fontWeight: 600, color: '#C8C8D0',
                  }}>{v}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}