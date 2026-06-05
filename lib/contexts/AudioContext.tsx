'use client';
import React, { createContext, useContext, useRef, useCallback, useEffect, useState } from 'react';
import { useGame } from './GameContext';

interface AudioContextType {
  playBGM: (track: string) => void;
  stopBGM: () => void;
  fadeBGM: (track: string) => void;
  playHover: () => void;
  playSelect: () => void;
  playConfirm: () => void;
  playBack: () => void;
  playTransition: () => void;
  playToggle: () => void;
  isPlaying: boolean;
  currentTrackName: string;
}

const AudioCtx = createContext<AudioContextType | null>(null);

function createSFX(audioCtx: AudioContext) {
  return {
    hover: () => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.type = 'sine';
      osc.start(); osc.stop(audioCtx.currentTime + 0.08);
    },
    select: () => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.type = 'square';
      osc.start(); osc.stop(audioCtx.currentTime + 0.15);
    },
    confirm: () => {
      [0, 0.1, 0.2].forEach((t, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        const freqs = [440, 554, 659];
        osc.frequency.setValueAtTime(freqs[i], audioCtx.currentTime + t);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + t + 0.12);
        osc.type = 'sine';
        osc.start(audioCtx.currentTime + t);
        osc.stop(audioCtx.currentTime + t + 0.15);
      });
    },
    back: () => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.type = 'triangle';
      osc.start(); osc.stop(audioCtx.currentTime + 0.15);
    },
    transition: () => {
      const bufferSize = audioCtx.sampleRate * 0.3;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.3;
      }
      const source = audioCtx.createBufferSource();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2000, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(500, audioCtx.currentTime + 0.3);
      source.buffer = buffer;
      source.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      source.start();
    },
    toggle: () => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(700, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      osc.type = 'sine';
      osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    },
  };
}

const TRACKS: Record<string, string> = {
  'cinematic': '/bgm/cinematic.mp3',
  'dark fantasy': '/bgm/dark fantasy.mp3',
};

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useGame();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sfxRef = useRef<ReturnType<typeof createSFX> | null>(null);
  const audioElemRef = useRef<HTMLAudioElement | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackName, setCurrentTrackName] = useState('cinematic');
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const ensureAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      sfxRef.current = createSFX(audioCtxRef.current);
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playBGM = useCallback((track: string) => {
    const ctx = ensureAudioCtx();
    const src = TRACKS[track] || TRACKS['cinematic'];

    if (!audioElemRef.current) {
      const audio = new Audio(src);
      audio.loop = true;
      audio.crossOrigin = 'anonymous';
      audioElemRef.current = audio;
      const source = ctx.createMediaElementSource(audio);
      const gainNode = ctx.createGain();
      gainNode.gain.value = settings.musicVolume * settings.masterVolume;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      gainNodeRef.current = gainNode;
    } else {
      audioElemRef.current.src = src;
    }

    audioElemRef.current.play().then(() => {
      setIsPlaying(true);
      setCurrentTrackName(track);
    }).catch(() => {});
  }, [ensureAudioCtx, settings.musicVolume, settings.masterVolume]);

  const stopBGM = useCallback(() => {
    if (audioElemRef.current) {
      audioElemRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const fadeBGM = useCallback((track: string) => {
    if (!gainNodeRef.current || !audioElemRef.current) {
      playBGM(track);
      return;
    }
    const gain = gainNodeRef.current;
    const targetVol = settings.musicVolume * settings.masterVolume;
    const steps = 20;
    let step = 0;
    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    fadeTimerRef.current = setInterval(() => {
      step++;
      gain.gain.value = targetVol * (1 - step / steps);
      if (step >= steps) {
        clearInterval(fadeTimerRef.current!);
        if (audioElemRef.current) {
          audioElemRef.current.src = TRACKS[track] || TRACKS['cinematic'];
          audioElemRef.current.play().then(() => {
            setCurrentTrackName(track);
            let s2 = 0;
            fadeTimerRef.current = setInterval(() => {
              s2++;
              gain.gain.value = targetVol * (s2 / steps);
              if (s2 >= steps) clearInterval(fadeTimerRef.current!);
            }, 30);
          }).catch(() => {});
        }
      }
    }, 30);
  }, [playBGM, settings.musicVolume, settings.masterVolume]);

  // Update gain when volume settings change
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = settings.musicVolume * settings.masterVolume;
    }
  }, [settings.musicVolume, settings.masterVolume]);

  const playHover = useCallback(() => { sfxRef.current?.hover(); }, []);
  const playSelect = useCallback(() => { sfxRef.current?.select(); }, []);
  const playConfirm = useCallback(() => { sfxRef.current?.confirm(); }, []);
  const playBack = useCallback(() => { sfxRef.current?.back(); }, []);
  const playTransition = useCallback(() => { sfxRef.current?.transition(); }, []);
  const playToggle = useCallback(() => { sfxRef.current?.toggle(); }, []);

  // Ensure audio context exists for SFX after game start
  useEffect(() => {
    const handleInteract = () => ensureAudioCtx();
    window.addEventListener('click', handleInteract, { once: true });
    return () => window.removeEventListener('click', handleInteract);
  }, [ensureAudioCtx]);

  return (
    <AudioCtx.Provider value={{
      playBGM, stopBGM, fadeBGM,
      playHover, playSelect, playConfirm, playBack, playTransition, playToggle,
      isPlaying, currentTrackName,
    }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
