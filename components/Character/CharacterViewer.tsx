'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface CharacterViewerProps {
  mode: 'hero' | 'profile';
  rotation?: number;
  zoom?: number;
  onRotate?: (delta: number) => void;
}

export default function CharacterViewer({ mode, rotation = 0, zoom = 1, onRotate }: CharacterViewerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localRotation, setLocalRotation] = useState(rotation);
  const [smoothRotation, setSmoothRotation] = useState(rotation);
  const dragStartX = useRef(0);
  const rafRef = useRef<number>(0);
  const targetRot = useRef(rotation);

  // Smooth interpolation
  useEffect(() => {
    const animate = () => {
      setSmoothRotation(prev => {
        const delta = targetRot.current - prev;
        if (Math.abs(delta) < 0.01) return targetRot.current;
        return prev + delta * 0.1;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => { targetRot.current = rotation; }, [rotation]);
  useEffect(() => { targetRot.current = localRotation; }, [localRotation]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (mode !== 'profile') return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
  }, [mode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = (e.clientX - dragStartX.current) * 0.5;
    dragStartX.current = e.clientX;
    setLocalRotation(r => r + delta);
    onRotate?.(delta);
  }, [isDragging, onRotate]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const t = smoothRotation;
  const skewX = Math.sin(t * Math.PI / 180) * 3;
  const scaleX = 1 - Math.abs(Math.sin(t * Math.PI / 180)) * 0.08;

  const size = mode === 'hero' ? { w: 320, h: 520 } : { w: 380, h: 580 };

  return (
    <div
      style={{ width: size.w, height: size.h, position: 'relative', cursor: mode === 'profile' ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Ground glow */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: 40,
        background: 'radial-gradient(ellipse, rgba(200,169,110,0.25) 0%, transparent 70%)',
        filter: 'blur(8px)',
      }} />

      {/* Character SVG */}
      <motion.div
        style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          transform: `scaleX(${scaleX * zoom}) skewX(${skewX}deg)`,
          transformOrigin: 'bottom center',
        }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
      >
        <svg
          viewBox="0 0 200 480"
          style={{ width: '100%', height: '100%' }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Drop shadow filter */}
          <defs>
            <filter id="char-shadow" x="-20%" y="-5%" width="140%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#C8A96E" floodOpacity="0.3" />
            </filter>
            <filter id="char-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="body-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a2a3a" />
              <stop offset="50%" stopColor="#1a1a28" />
              <stop offset="100%" stopColor="#0d0d18" />
            </linearGradient>
            <linearGradient id="armor-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C8A96E" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#A87940" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="face-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c49a78" />
              <stop offset="100%" stopColor="#a07858" />
            </linearGradient>
            <radialGradient id="eye-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4ECDC4" />
              <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* === LEGS === */}
          {/* Left leg */}
          <rect x="70" y="340" width="28" height="100" rx="4" fill="url(#body-grad)" />
          <rect x="70" y="340" width="28" height="12" fill="url(#armor-grad)" opacity="0.8" />
          {/* Left boot */}
          <rect x="66" y="430" width="34" height="24" rx="3" fill="#111118" />
          <rect x="66" y="430" width="34" height="4" fill="url(#armor-grad)" opacity="0.6" />

          {/* Right leg */}
          <rect x="102" y="340" width="28" height="100" rx="4" fill="url(#body-grad)" />
          <rect x="102" y="340" width="28" height="12" fill="url(#armor-grad)" opacity="0.8" />
          {/* Right boot */}
          <rect x="100" y="430" width="34" height="24" rx="3" fill="#111118" />
          <rect x="100" y="430" width="34" height="4" fill="url(#armor-grad)" opacity="0.6" />

          {/* === TORSO === */}
          <motion.g
            animate={{ scaleY: [1, 1.015, 1], translateY: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
            style={{ transformOrigin: 'center' }}
          >
            {/* Core body */}
            <rect x="62" y="200" width="76" height="145" rx="6" fill="url(#body-grad)" />

            {/* Chest armor plate */}
            <path d="M72 215 L128 215 L132 260 L68 260 Z" fill="#1e1e2e" stroke="rgba(200,169,110,0.4)" strokeWidth="0.5" />
            {/* Armor details */}
            <line x1="100" y1="220" x2="100" y2="255" stroke="rgba(200,169,110,0.3)" strokeWidth="0.5" />
            <line x1="80" y1="235" x2="120" y2="235" stroke="rgba(200,169,110,0.2)" strokeWidth="0.5" />
            {/* Shoulder plates */}
            <path d="M50 210 L72 200 L72 240 L55 250 Z" fill="url(#armor-grad)" opacity="0.85" />
            <path d="M150 210 L128 200 L128 240 L145 250 Z" fill="url(#armor-grad)" opacity="0.85" />
            {/* Side armor strips */}
            <rect x="62" y="265" width="6" height="60" rx="2" fill="url(#armor-grad)" opacity="0.5" />
            <rect x="132" y="265" width="6" height="60" rx="2" fill="url(#armor-grad)" opacity="0.5" />
            {/* Belt */}
            <rect x="62" y="330" width="76" height="14" rx="2" fill="#111118" />
            <rect x="88" y="332" width="24" height="10" rx="1" fill="url(#armor-grad)" opacity="0.8" />
            {/* Tactical vest pockets */}
            <rect x="68" y="275" width="20" height="18" rx="2" fill="rgba(200,169,110,0.08)" stroke="rgba(200,169,110,0.2)" strokeWidth="0.5" />
            <rect x="112" y="275" width="20" height="18" rx="2" fill="rgba(200,169,110,0.08)" stroke="rgba(200,169,110,0.2)" strokeWidth="0.5" />
            {/* Teal tech accent glow */}
            <rect x="93" y="248" width="14" height="3" rx="1" fill="#4ECDC4" opacity="0.7" filter="url(#char-glow)" />
          </motion.g>

          {/* === ARMS === */}
          {/* Left arm */}
          <motion.g
            animate={{ rotate: [0, 1.5, -1, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
            style={{ transformOrigin: '55px 215px' }}
          >
            <rect x="36" y="210" width="22" height="80" rx="5" fill="url(#body-grad)" />
            <rect x="34" y="210" width="26" height="10" rx="3" fill="url(#armor-grad)" opacity="0.7" />
            {/* Glove */}
            <rect x="34" y="282" width="26" height="30" rx="4" fill="#0d0d18" />
            <rect x="34" y="282" width="26" height="5" fill="url(#armor-grad)" opacity="0.6" />
          </motion.g>

          {/* Right arm */}
          <motion.g
            animate={{ rotate: [0, -1.5, 1, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop', delay: 0.5 }}
            style={{ transformOrigin: '145px 215px' }}
          >
            <rect x="142" y="210" width="22" height="80" rx="5" fill="url(#body-grad)" />
            <rect x="140" y="210" width="26" height="10" rx="3" fill="url(#armor-grad)" opacity="0.7" />
            {/* Glove */}
            <rect x="140" y="282" width="26" height="30" rx="4" fill="#0d0d18" />
            <rect x="140" y="282" width="26" height="5" fill="url(#armor-grad)" opacity="0.6" />
          </motion.g>

          {/* === NECK === */}
          <rect x="88" y="185" width="24" height="22" rx="3" fill="#b08060" />

          {/* === HEAD === */}
          <motion.g
            animate={{ rotate: [0, 1, -0.5, 0.3, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
            style={{ transformOrigin: '100px 150px' }}
          >
            {/* Head base */}
            <rect x="74" y="120" width="52" height="70" rx="12" fill="url(#face-grad)" />

            {/* Hair / top */}
            <path d="M74 135 Q74 115 100 112 Q126 115 126 135 L126 130 Q126 105 100 104 Q74 105 74 130 Z"
              fill="#1a1218" />

            {/* Ear left */}
            <ellipse cx="74" cy="155" rx="5" ry="7" fill="#b07858" />
            {/* Ear right */}
            <ellipse cx="126" cy="155" rx="5" ry="7" fill="#b07858" />

            {/* Eyes */}
            <motion.g
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: 'loop', times: [0, 0.45, 0.48, 0.51, 1] }}
              style={{ transformOrigin: '100px 148px' }}
            >
              <ellipse cx="89" cy="148" rx="7" ry="5" fill="#1a1218" />
              <ellipse cx="111" cy="148" rx="7" ry="5" fill="#1a1218" />
              {/* Iris */}
              <ellipse cx="89" cy="148" rx="4" ry="4" fill="#2a4060" />
              <ellipse cx="111" cy="148" rx="4" ry="4" fill="#2a4060" />
              {/* Pupil */}
              <ellipse cx="89" cy="148" rx="2" ry="2.5" fill="#050810" />
              <ellipse cx="111" cy="148" rx="2" ry="2.5" fill="#050810" />
              {/* Catchlight */}
              <ellipse cx="91" cy="146" rx="1.5" ry="1.5" fill="white" opacity="0.6" />
              <ellipse cx="113" cy="146" rx="1.5" ry="1.5" fill="white" opacity="0.6" />
            </motion.g>

            {/* Eyebrows */}
            <path d="M82 140 Q89 136 96 139" stroke="#1a1218" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M104 139 Q111 136 118 140" stroke="#1a1218" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Nose */}
            <path d="M97 155 Q100 162 103 155" stroke="#8a6040" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Mouth */}
            <motion.path
              d="M90 168 Q100 173 110 168"
              stroke="#7a4030"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              animate={{ d: ['M90 168 Q100 173 110 168', 'M91 169 Q100 171 109 169', 'M90 168 Q100 173 110 168'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Tactical earpiece */}
            <circle cx="126" cy="152" r="4" fill="#111118" stroke="rgba(200,169,110,0.6)" strokeWidth="0.5" />
            <circle cx="126" cy="152" r="1.5" fill="#4ECDC4" opacity="0.8" />
          </motion.g>

          {/* === GROUND SHADOW === */}
          <ellipse cx="100" cy="470" rx="45" ry="8" fill="rgba(0,0,0,0.5)" />
        </svg>
      </motion.div>

      {/* Gold rim light effect */}
      <div style={{
        position: 'absolute', right: 0, top: '15%', width: 3, height: '60%',
        background: 'linear-gradient(to bottom, transparent, rgba(200,169,110,0.6), transparent)',
        filter: 'blur(2px)',
      }} />
      <div style={{
        position: 'absolute', left: 0, top: '25%', width: 2, height: '40%',
        background: 'linear-gradient(to bottom, transparent, rgba(78,205,196,0.3), transparent)',
        filter: 'blur(2px)',
      }} />
    </div>
  );
}
