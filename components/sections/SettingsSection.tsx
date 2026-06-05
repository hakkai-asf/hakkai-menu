'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/contexts/GameContext';
import { useAudio } from '@/lib/contexts/AudioContext';

const LANGUAGES = [
  { id: 'english', label: 'English' },
  { id: 'tagalog', label: 'Tagalog' },
  { id: 'spanish', label: 'Spanish' },
  { id: 'japanese', label: 'Japanese' },
];

const THEMES = [
  { id: 'dark',      label: 'DARK MODE',       desc: 'Default tactical theme' },
  { id: 'dark-teal', label: 'TEAL OPS',         desc: 'Teal accent variant' },
];

const TRACKS = [
  { id: 'cinematic',    label: 'Cinematic' },
  { id: 'dark fantasy', label: 'Dark Fantasy' },
];

function SettingRow({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(200,169,110,0.08)' }}>
      <div>
        <p style={{ fontFamily: 'Cinzel, Georgia, serif', fontWeight: 600, fontSize: '0.88rem', color: '#E8C98E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
        {sub && <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.5rem', color: '#C8A96E', marginTop: 1, letterSpacing: '0.05em' }}>{sub}</p>}
      </div>
      <div style={{ minWidth: 160, display: 'flex', justifyContent: 'flex-end' }}>
        {children}
      </div>
    </div>
  );
}

function VolumeSlider({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const { playHover } = useAudio();
  return (
    <div className="flex items-center gap-3">
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#C8A96E', width: 28, textAlign: 'right' }}>
        {Math.round(value * 100)}
      </span>
      <input
        type="range" min={0} max={1} step={0.01}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        onMouseEnter={() => playHover()}
        aria-label={label}
        style={{ width: 120 }}
      />
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const { playToggle } = useAudio();
  return (
    <button
      onClick={() => { onChange(!value); playToggle(); }}
      style={{
        width: 44, height: 22, borderRadius: 11,
        background: value ? 'rgba(200,169,110,0.35)' : 'rgba(10,10,12,0.6)',
        border: `1px solid ${value ? '#C8A96E' : 'rgba(200,169,110,0.2)'}`,
        position: 'relative', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
      }}
      aria-checked={value}
      role="switch"
    >
      <div style={{
        position: 'absolute', top: 3, left: value ? 24 : 4,
        width: 14, height: 14, borderRadius: '50%',
        background: value ? '#E8C98E' : 'rgba(200,169,110,0.3)',
        boxShadow: value ? '0 0 10px rgba(232, 201, 142, 0.5)' : 'none',
        transition: 'all 0.2s',
      }} />
    </button>
  );
}

export default function SettingsSection() {
  const { settings, updateSetting } = useGame();
  const { playHover, playToggle, fadeBGM } = useAudio();

  return (
    <motion.div
      className="fixed inset-0 z-10 flex overflow-hidden bg-[#0a0a0c] text-[#E8E0D4]"
      style={{ paddingLeft: 'clamp(280px, 30vw, 400px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-1 py-8 px-8 gap-6 overflow-y-auto scrollable">
        <div className="flex flex-col gap-5 w-full max-w-2xl">

          <div>
            <p className="section-label mb-1">SYSTEM CONFIGURATION</p>
            <div className="rule-gold-left" style={{ width: 100 }} />
          </div>

          {/* AUDIO */}
          <motion.div
            className="panel"
            style={{
              padding: '18px 24px',
              borderColor: 'rgba(200, 169, 110, 0.2)',
              clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="section-label mb-1" style={{ color: '#C8A96E' }}>AUDIO</p>
            <div className="rule-gold mb-2" />

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
              <div className="flex gap-2">
                {TRACKS.map(t => (
                  <button
                    key={t.id}
                    id={`track-${t.id}`}
                    onClick={() => { updateSetting('currentTrack', t.id); fadeBGM(t.id); playToggle(); }}
                    onMouseEnter={() => playHover()}
                    style={{
                      fontFamily: 'Cinzel, Georgia, serif', fontWeight: 400, fontSize: '0.7rem',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      padding: '5px 12px', cursor: 'pointer', border: 'none',
                      background: settings.currentTrack === t.id ? 'rgba(200,169,110,0.2)' : 'rgba(25,25,30,0.4)',
                      color: settings.currentTrack === t.id ? '#C8A96E' : 'rgba(232,224,212,0.4)',
                      borderLeft: `2px solid ${settings.currentTrack === t.id ? '#C8A96E' : 'transparent'}`,
                      clipPath: 'polygon(3px 0%, 100% 0%, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0% 100%, 0% 3px)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </SettingRow>
          </motion.div>

          {/* GRAPHICS */}
          <motion.div
            className="panel"
            style={{
              padding: '18px 24px',
              borderColor: 'rgba(200, 169, 110, 0.2)',
              clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="section-label mb-1" style={{ color: '#4ECDC4' }}>GRAPHICS</p>
            <div className="rule-teal mb-2" />

            <SettingRow label="Performance Mode" sub="Reduces visual effects for better FPS">
              <Toggle value={settings.performanceMode} onChange={v => updateSetting('performanceMode', v)} />
            </SettingRow>
            <SettingRow label="Particle Effects" sub="Ambient environment particles">
              <Toggle value={settings.particles} onChange={v => updateSetting('particles', v)} />
            </SettingRow>
          </motion.div>

          {/* INTERFACE */}
          <motion.div
            className="panel"
            style={{
              padding: '18px 24px',
              borderColor: 'rgba(200, 169, 110, 0.2)',
              clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="section-label mb-1" style={{ color: '#A78BFA' }}>INTERFACE</p>
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #A78BFA, transparent)', marginBottom: 8 }} />

            <SettingRow label="HUD Visible" sub="Show/hide the status overlay">
              <Toggle value={settings.hudVisible} onChange={v => updateSetting('hudVisible', v)} />
            </SettingRow>
            <SettingRow label="FPS Counter" sub="Display frames per second">
              <Toggle value={settings.fpsCounter} onChange={v => updateSetting('fpsCounter', v)} />
            </SettingRow>
            <SettingRow label="Theme" sub="Color accent variant">
              <div className="flex gap-2">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    id={`theme-${t.id}`}
                    onClick={() => { updateSetting('theme', t.id as any); playToggle(); }}
                    onMouseEnter={() => playHover()}
                    style={{
                      fontFamily: 'Cinzel, Georgia, serif', fontWeight: 400, fontSize: '0.65rem',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      padding: '5px 10px', cursor: 'pointer', border: 'none',
                      background: settings.theme === t.id ? 'rgba(167,139,250,0.2)' : 'rgba(25,25,30,0.4)',
                      color: settings.theme === t.id ? '#A78BFA' : 'rgba(232,224,212,0.4)',
                      borderLeft: `2px solid ${settings.theme === t.id ? '#A78BFA' : 'transparent'}`,
                      clipPath: 'polygon(3px 0%, 100% 0%, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0% 100%, 0% 3px)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </SettingRow>
          </motion.div>

          {/* LANGUAGE */}
          <motion.div
            className="panel"
            style={{
              padding: '18px 24px',
              borderColor: 'rgba(200, 169, 110, 0.2)',
              clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="section-label mb-1" style={{ color: '#FCD34D' }}>LANGUAGE</p>
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #FCD34D, transparent)', marginBottom: 8 }} />
            <div className="flex gap-2 flex-wrap mt-2">
              {LANGUAGES.map(l => (
                <button
                  key={l.id}
                  id={`lang-${l.id}`}
                  onClick={() => { updateSetting('language', l.id as any); playToggle(); }}
                  onMouseEnter={() => playHover()}
                  style={{
                    fontFamily: 'Cinzel, Georgia, serif', fontWeight: 400, fontSize: '0.85rem',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '8px 18px', cursor: 'pointer', border: 'none',
                    background: settings.language === l.id ? 'rgba(252,211,77,0.15)' : 'rgba(25,25,30,0.04)',
                    color: settings.language === l.id ? '#FCD34D' : 'rgba(232,224,212,0.4)',
                    clipPath: 'polygon(6px 0%,100% 0%,100% calc(100% - 6px),calc(100% - 6px) 100%,0% 100%,0% 6px)',
                    transition: 'all 0.15s',
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Developer Info */}
          <motion.div
            className="panel"
            style={{
              padding: '18px 24px',
              borderColor: 'rgba(200, 169, 110, 0.2)',
              clipPath: 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="section-label mb-2">◆ DEVELOPER INFORMATION</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['BUILD VERSION', 'v1.0.0'],
                ['DEVELOPER', 'Harry Nielsen M. Lagto'],
                ['FRAMEWORK', 'Next.js 14 + Three.js'],
                ['RENDERER', 'WebGL 2.0'],
                ['AUDIO ENGINE', 'Web Audio API'],
                ['LOCATION', 'Metro Manila, Philippines'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="hud-label">{k}</p>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#E8E0D4', marginTop: 2 }}>{v}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
