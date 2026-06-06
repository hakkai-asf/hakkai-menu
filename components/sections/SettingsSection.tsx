'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/contexts/GameContext';
import { useAudio } from '@/lib/contexts/AudioContext';

const LANGUAGES = [
  { id: 'english',  label: 'English'  },
  { id: 'tagalog',  label: 'Tagalog'  },
  { id: 'spanish',  label: 'Spanish'  },
  { id: 'japanese', label: 'Japanese' },
];

const THEMES = [
  { id: 'dark',      label: 'DARK MODE', desc: 'Default tactical theme' },
  { id: 'dark-teal', label: 'TEAL OPS',  desc: 'Teal accent variant'   },
];

const TRACKS = [
  { id: 'cinematic',    label: 'Cinematic'    },
  { id: 'dark fantasy', label: 'Dark Fantasy' },
];

// ── shared clip paths (verbatim from ProjectsSection) ──────────────────────
const clip4 = 'polygon(4px 0%,100% 0%,100% calc(100% - 4px),calc(100% - 4px) 100%,0% 100%,0% 4px)';
const clip6 = 'polygon(6px 0%,calc(100% - 6px) 0%,100% 6px,100% calc(100% - 6px),calc(100% - 6px) 100%,6px 100%,0% calc(100% - 6px),0% 6px)';

// ── OrnateDivider (verbatim from ProjectsSection) ──────────────────────────
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

// ── SettingRow ─────────────────────────────────────────────────────────────
function SettingRow({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid rgba(168,168,176,0.07)',
      }}
    >
      <div>
        <p style={{
          fontFamily: 'Cinzel, Georgia, serif',
          fontWeight: 800,
          fontSize: '1rem',
          color: '#D4D4DC',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>{label}</p>
        {sub && (
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.68rem',
            color: '#7A7A84',
            marginTop: 2,
            letterSpacing: '0.05em',
          }}>{sub}</p>
        )}
      </div>
      <div style={{ minWidth: 160, display: 'flex', justifyContent: 'flex-end' }}>
        {children}
      </div>
    </div>
  );
}

// ── VolumeSlider ───────────────────────────────────────────────────────────
function VolumeSlider({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const { playHover } = useAudio();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.78rem',
        fontWeight: 700,
        color: '#C8C8D0',
        width: 32,
        textAlign: 'right',
      }}>
        {Math.round(value * 100)}
      </span>
      <input
        type="range" min={0} max={1} step={0.01}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        onMouseEnter={() => playHover()}
        aria-label={label}
        style={{
          width: 120,
          accentColor: '#A8A8B8',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const { playToggle } = useAudio();
  return (
    <button
      onClick={() => { onChange(!value); playToggle(); }}
      role="switch"
      aria-checked={value}
      style={{
        width: 44, height: 22, borderRadius: 11,
        background: value ? 'rgba(168,168,176,0.25)' : 'rgba(10,10,12,0.6)',
        border: `1px solid ${value ? '#A8A8B8' : 'rgba(168,168,176,0.2)'}`,
        position: 'relative', cursor: 'pointer',
        transition: 'all 0.2s', flexShrink: 0,
        boxShadow: value ? '0 0 8px rgba(200,200,255,0.15)' : 'none',
      }}
    >
      <div style={{
        position: 'absolute', top: 3,
        left: value ? 24 : 4,
        width: 14, height: 14, borderRadius: '50%',
        background: value
          ? 'linear-gradient(135deg, #F0F0FF, #C0C0D8)'
          : 'rgba(168,168,176,0.3)',
        boxShadow: value ? '0 0 8px rgba(200,200,255,0.55)' : 'none',
        transition: 'all 0.2s',
      }} />
    </button>
  );
}

// ── PanelCard (matches ProjectsSection panel style) ────────────────────────
function PanelCard({
  children,
  delay = 0,
  accent = '#A8A8B4',
  heading,
}: {
  children: React.ReactNode;
  delay?: number;
  accent?: string;
  heading: string;
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
      {/* panel heading */}
      <p style={{
        fontFamily: 'Cinzel, Georgia, serif',
        fontWeight: 900,
        fontSize: '0.88rem',
        color: accent,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 2,
      }}>◈ {heading}</p>
      <OrnateDivider />
      {children}
    </motion.div>
  );
}

// ── SegmentButton (track / theme) ──────────────────────────────────────────
function SegBtn({
  active, onClick, onHover, children,
}: {
  active: boolean;
  onClick: () => void;
  onHover: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      style={{
        fontFamily: 'Cinzel, Georgia, serif',
        fontWeight: 700,
        fontSize: '0.8rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '5px 14px',
        cursor: 'pointer',
        border: 'none',
        clipPath: clip4,
        background: active ? 'rgba(168,168,176,0.18)' : 'rgba(25,25,30,0.4)',
        color: active ? '#D4D4DC' : '#5A5A6E',
        borderLeft: `2px solid ${active ? '#A8A8B8' : 'transparent'}`,
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function SettingsSection() {
  const { settings, updateSetting } = useGame();
  const { playHover, playToggle, fadeBGM } = useAudio();

  return (
    <motion.div
      className="fixed inset-0 z-10 flex overflow-hidden max-md:!pl-0 md:pl-[clamp(280px,30vw,400px)] pt-16 md:pt-0"
      style={{ background: '#050505', color: '#D4D4DC' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ambient radial glow — same as ProjectsSection */}
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
              fontFamily: 'Cinzel, Georgia, serif',
              fontWeight: 900,
              fontSize: '0.72rem',
              color: '#7A7A84',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}>SYSTEM CONFIGURATION</p>
            <div style={{
              width: 100, height: 1,
              background: 'linear-gradient(90deg, #A8A8B0, transparent)',
            }} />
          </div>

          {/* ── AUDIO ── */}
          <PanelCard heading="Audio" delay={0.1} accent="#C8C8D0">
            <SettingRow label="Master Volume" sub="Controls all audio output">
              <VolumeSlider label="Master Volume" value={settings.masterVolume} onChange={v => updateSetting('masterVolume', v)} />
            </SettingRow>
            <SettingRow label="Music Volume" sub="Background music level">
              <VolumeSlider label="Music Volume" value={settings.musicVolume} onChange={v => updateSetting('musicVolume', v)} />
            </SettingRow>
            <SettingRow label="Effects Volume" sub="UI interaction sounds">
              <VolumeSlider label="Effects Volume" value={settings.sfxVolume} onChange={v => updateSetting('sfxVolume', v)} />
            </SettingRow>
            <SettingRow label="BGM Track" sub="Select background music">
              <div style={{ display: 'flex', gap: 6 }}>
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

          {/* ── GRAPHICS ── */}
          <PanelCard heading="Graphics" delay={0.2} accent="#C8C8D0">
            <SettingRow label="Performance Mode" sub="Reduces visual effects for better FPS">
              <Toggle value={settings.performanceMode} onChange={v => updateSetting('performanceMode', v)} />
            </SettingRow>
            <SettingRow label="Particle Effects" sub="Ambient environment particles">
              <Toggle value={settings.particles} onChange={v => updateSetting('particles', v)} />
            </SettingRow>
          </PanelCard>

          {/* ── INTERFACE ── */}
          <PanelCard heading="Interface" delay={0.3} accent="#C8C8D0">
            <SettingRow label="HUD Visible" sub="Show/hide the status overlay">
              <Toggle value={settings.hudVisible} onChange={v => updateSetting('hudVisible', v)} />
            </SettingRow>
            <SettingRow label="FPS Counter" sub="Display frames per second">
              <Toggle value={settings.fpsCounter} onChange={v => updateSetting('fpsCounter', v)} />
            </SettingRow>
            <SettingRow label="Theme" sub="Color accent variant">
              <div style={{ display: 'flex', gap: 6 }}>
                {THEMES.map(t => (
                  <SegBtn
                    key={t.id}
                    active={settings.theme === t.id}
                    onClick={() => { updateSetting('theme', t.id as any); playToggle(); }}
                    onHover={playHover}
                  >
                    {t.label}
                  </SegBtn>
                ))}
              </div>
            </SettingRow>
          </PanelCard>

          {/* ── LANGUAGE ── */}
          <PanelCard heading="Language" delay={0.4} accent="#C8C8D0">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              {LANGUAGES.map(l => (
                <button
                  key={l.id}
                  onClick={() => { updateSetting('language', l.id as any); playToggle(); }}
                  onMouseEnter={playHover}
                  style={{
                    fontFamily: 'Cinzel, Georgia, serif',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '8px 20px',
                    cursor: 'pointer',
                    border: 'none',
                    clipPath: clip6,
                    background: settings.language === l.id
                      ? 'rgba(168,168,176,0.18)'
                      : 'rgba(25,25,30,0.4)',
                    color: settings.language === l.id ? '#D4D4DC' : '#5A5A6E',
                    outline: settings.language === l.id
                      ? '1px solid rgba(168,168,176,0.35)'
                      : '1px solid transparent',
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
            transition={{ delay: 0.5 }}
            style={{
              background: 'rgba(6,6,8,0.92)',
              border: '1px solid rgba(168,168,176,0.15)',
              clipPath: clip6,
              overflow: 'hidden',
            }}
          >
            {/* header card — mirrors DetailPanel header from ProjectsSection */}
            <div style={{
              borderTop: '2px solid #A8A8B0',
              padding: '14px 24px 10px',
              background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(168,168,176,0.07) 0%, transparent 70%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <p style={{
                  fontFamily: 'Cinzel, Georgia, serif',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  color: '#D4D4DC',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>◈ Developer Information</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {/* rarity badge */}
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    color: '#9A9AA4',
                    border: '1px solid rgba(168,168,176,0.25)',
                    clipPath: clip4,
                    padding: '2px 7px',
                    letterSpacing: '0.08em',
                  }}>BUILD v1.0.0</span>
                  {/* status badge */}
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    color: '#6DC87A',
                    border: '1px solid rgba(109,200,122,0.3)',
                    clipPath: clip4,
                    padding: '2px 7px',
                    letterSpacing: '0.08em',
                  }}>ACTIVE</span>
                </div>
              </div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.65rem',
                color: '#7A7A84',
                letterSpacing: '0.05em',
              }}>PORTFOLIO · SYSTEM METADATA</p>
            </div>

            <OrnateDivider />

            {/* data grid */}
            <div style={{ padding: '6px 24px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
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
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    color: '#7A7A84',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: 3,
                  }}>{k}</p>
                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#C8C8D0',
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