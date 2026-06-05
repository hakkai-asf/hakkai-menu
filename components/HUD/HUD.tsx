'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/contexts/GameContext';
import { useAudio } from '@/lib/contexts/AudioContext';

export default function HUD() {
  const { settings, currentSection } = useGame();
  const { currentTrackName, isPlaying } = useAudio();
  const [fps, setFps] = useState(60);
  const [time, setTime] = useState('');

  // FPS counter
  useEffect(() => {
    if (!settings.fpsCounter) return;
    let frames = 0;
    let last = performance.now();
    let rafId: number;
    const tick = () => {
      frames++;
      const now = performance.now();
      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [settings.fpsCounter]);

  // Clock
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const sectionLabels: Record<string, string> = {
    menu: 'MAIN MENU', profile: 'OPERATOR PROFILE', projects: 'PROJECTS',
    skills: 'SKILLS', contact: 'CONTACT', archive: 'PORTFOLIO ARCHIVE', settings: 'SETTINGS',
  };

  return (
    <motion.div
      className="fixed z-20 pointer-events-none select-none"
      style={{ bottom: 24, right: 24 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="panel clip-corner-tl" style={{ padding: '12px 16px', minWidth: 200 }}>
        {/* Top rule */}
        <div className="rule-gold-left mb-3" style={{ width: '100%' }} />

        <div className="hud-container flex flex-col gap-2">
          {/* Current section */}
          <div>
            <div className="hud-label">CURRENT AREA</div>
            <div className="hud-value" style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '0.75rem', fontWeight: 400, color: '#C8A96E', letterSpacing: '0.08em' }}>
              {sectionLabels[currentSection] || 'MAIN MENU'}
            </div>
          </div>

          {/* Status */}
          <div>
            <div className="hud-label">STATUS</div>
            <div className="status-available" style={{ fontSize: '0.58rem' }}>AVAILABLE FOR WORK</div>
          </div>

          {/* Music track */}
          <div>
            <div className="hud-label">NOW PLAYING</div>
            <div className="hud-value flex items-center gap-1">
              {isPlaying ? (
                <>
                  <span style={{ color: '#4ECDC4', fontSize: '0.5rem' }}>♪</span>
                  <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.58rem' }}>
                    {currentTrackName}
                  </span>
                </>
              ) : (
                <span style={{ color: '#E8E0D4', fontSize: '0.58rem' }}>— NO AUDIO —</span>
              )}
            </div>
          </div>

          {/* Version + FPS */}
          <div className="flex justify-between items-center mt-1">
            <span className="hud-label" style={{ fontSize: '0.48rem' }}>v1.0.0</span>
            {settings.fpsCounter && (
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', color: fps >= 55 ? '#2ECC71' : fps >= 30 ? '#C8A96E' : '#E63946' }}>
                {fps} FPS
              </span>
            )}
            <span className="hud-label" style={{ fontSize: '0.48rem' }}>{time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
