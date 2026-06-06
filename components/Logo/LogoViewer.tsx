'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface LogoViewerProps {
  variant?: 'desktop' | 'mobile';
}

export default function LogoViewer({ variant = 'desktop' }: LogoViewerProps) {
  if (variant === 'mobile') {
    return (
      <motion.div
        className="fixed inset-0 z-5 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'relative',
            width: 'clamp(200px, 70vw, 400px)',
            height: 'clamp(200px, 70vw, 400px)',
          }}
        >
          {/* Subtle glow behind logo */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '140%',
              height: '140%',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(212,212,220,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <Image
            src="/Hakkai-Logo.png"
            alt="Hakkai Logo"
            fill
            style={{
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 24px rgba(212,212,220,0.4)) drop-shadow(0 0 50px rgba(168,168,176,0.2))',
            }}
            priority
          />
        </motion.div>
      </motion.div>
    );
  }

  // Desktop variant
  return (
    <motion.div
      className="
        w-full
        md:w-[clamp(300px,35vw,440px)]
        flex-shrink-0
        flex flex-col items-center
        justify-start md:justify-center
        pt-4 md:pt-0
        pb-2 md:pb-10
      "
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="w-full flex items-center justify-center">
        <div className="h-[280px] md:h-[480px] w-full relative flex items-center justify-center">
          {/* Subtle glow behind logo */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120%',
              height: '120%',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(212,212,220,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              position: 'relative',
              width: 'clamp(180px, 45%, 320px)',
              height: 'clamp(180px, 45%, 320px)',
            }}
          >
            <Image
              src="/Hakkai-Logo.png"
              alt="Hakkai Logo"
              fill
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 20px rgba(212,212,220,0.35)) drop-shadow(0 0 45px rgba(168,168,176,0.15))',
              }}
              priority
            />
          </motion.div>
        </div>
      </div>

      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.72rem',
          fontWeight: 500,
          color: '#A8A8B0',
          letterSpacing: '0.12em',
          marginTop: 8,
        }}
      >
        WELCOME TO HAKKAI
      </p>
    </motion.div>
  );
}
