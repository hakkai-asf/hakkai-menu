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
  playStartGame: () => Promise<void>;
  isPlaying: boolean;
  currentTrackName: string;
}

const AudioCtx = createContext<AudioContextType | null>(null);

function createSFX(audioCtx: AudioContext) {
  return {
    hover: () => {
      try {
        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.type = 'sine';
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } catch {}
    },
  };
}

const TRACKS: Record<string, string> = {
  'cinematic':    '/bgm/cinematic.mp3',
  'dark fantasy': '/bgm/dark fantasy.mp3',
};

const bufferCache = new Map<string, AudioBuffer>();

async function loadBuffer(audioCtx: AudioContext, src: string): Promise<AudioBuffer | null> {
  console.log(`[Audio] loadBuffer called: ${src}, cached: ${bufferCache.has(src)}`);
  if (bufferCache.has(src)) return bufferCache.get(src)!;
  try {
    console.log(`[Audio] fetching ${src}...`);
    const res = await fetch(src);
    console.log(`[Audio] fetch response for ${src}: status=${res.status}, ok=${res.ok}`);
    if (!res.ok) {
      console.error(`[Audio] HTTP error fetching ${src}: ${res.status}`);
      return null;
    }
    const array  = await res.arrayBuffer();
    console.log(`[Audio] arrayBuffer size for ${src}: ${array.byteLength}`);
    const buffer = await audioCtx.decodeAudioData(array);
    console.log(`[Audio] decoded ${src}: duration=${buffer.duration.toFixed(2)}s`);
    bufferCache.set(src, buffer);
    return buffer;
  } catch (e) {
    console.error(`[Audio] FAILED to load SFX: ${src}`, e);
    return null;
  }
}

function playBuffer(
  audioCtx: AudioContext,
  destination: AudioNode,
  buffer: AudioBuffer,
  volume = 1,
) {
  console.log(`[Audio] playBuffer: duration=${buffer.duration.toFixed(2)}s, volume=${volume}, ctxState=${audioCtx.state}`);
  const source   = audioCtx.createBufferSource();
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = volume;
  source.buffer = buffer;
  source.connect(gainNode);
  gainNode.connect(destination);
  source.start();
  console.log(`[Audio] source.start() called — sound should be playing now`);
  source.onended = () => {
    console.log(`[Audio] playback ended for buffer duration=${buffer.duration.toFixed(2)}s`);
    source.disconnect();
    gainNode.disconnect();
  };
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useGame();

  const audioCtxRef         = useRef<AudioContext | null>(null);
  const sfxRef              = useRef<ReturnType<typeof createSFX> | null>(null);
  const masterGainRef       = useRef<GainNode | null>(null);
  const audioElemRef        = useRef<HTMLAudioElement | null>(null);
  const bgmGainRef          = useRef<GainNode | null>(null);
  const bgmSourceRef        = useRef<MediaElementAudioSourceNode | null>(null);
  const [isPlaying, setIsPlaying]               = useState(false);
  const [currentTrackName, setCurrentTrackName] = useState('cinematic');
  const fadeTimerRef        = useRef<NodeJS.Timeout | null>(null);
  const prewarmedRef        = useRef(false);

  const getCtx = useCallback(async (): Promise<AudioContext> => {
    console.log(`[Audio] getCtx called, existing ctx state: ${audioCtxRef.current?.state ?? 'none'}`);

    if (!audioCtxRef.current) {
      console.log(`[Audio] creating new AudioContext`);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      sfxRef.current      = createSFX(ctx);

      const mg = ctx.createGain();
      mg.gain.value     = settings.sfxVolume * settings.masterVolume;
      mg.connect(ctx.destination);
      masterGainRef.current = mg;
      console.log(`[Audio] AudioContext created, state=${ctx.state}, masterGain=${mg.gain.value}`);
    }

    const ctx = audioCtxRef.current;

    if (ctx.state === 'suspended') {
      console.log(`[Audio] context suspended — calling resume()...`);
      await ctx.resume();
      console.log(`[Audio] resume() resolved, new state=${ctx.state}`);
    }

    if (!prewarmedRef.current) {
      prewarmedRef.current = true;
      console.log(`[Audio] pre-warming buffers...`);
      loadBuffer(ctx, '/bgm/uiclick.mp3');
      loadBuffer(ctx, '/bgm/gamestart.mp3');
    }

    return ctx;
  }, [settings.sfxVolume, settings.masterVolume]);

  const getCtxSync = useCallback((): AudioContext | null => {
    if (!audioCtxRef.current) return null;
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = settings.sfxVolume * settings.masterVolume;
    }
  }, [settings.sfxVolume, settings.masterVolume]);

  const playBGM = useCallback((track: string) => {
    console.log(`[Audio] playBGM called: ${track}, ctx=${audioCtxRef.current?.state ?? 'none'}`);
    const ctx = audioCtxRef.current;
    if (!ctx) {
      console.warn(`[Audio] playBGM: no AudioContext yet, skipping`);
      return;
    }

    const src = TRACKS[track] || TRACKS['cinematic'];

    if (!audioElemRef.current) {
      const audio          = new Audio(src);
      audio.loop           = true;
      audio.crossOrigin    = 'anonymous';
      audioElemRef.current = audio;

      const source            = ctx.createMediaElementSource(audio);
      bgmSourceRef.current    = source;
      const gainNode          = ctx.createGain();
      gainNode.gain.value     = settings.musicVolume * settings.masterVolume;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      bgmGainRef.current = gainNode;
    } else {
      audioElemRef.current.src = src;
    }

    audioElemRef.current.play().then(() => {
      setIsPlaying(true);
      setCurrentTrackName(track);
      console.log(`[Audio] BGM playing: ${track}`);
    }).catch((e) => {
      console.error(`[Audio] BGM play failed:`, e);
    });
  }, [settings.musicVolume, settings.masterVolume]);

  const stopBGM = useCallback(() => {
    if (audioElemRef.current) {
      audioElemRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const fadeBGM = useCallback((track: string) => {
    if (!bgmGainRef.current || !audioElemRef.current) {
      playBGM(track);
      return;
    }
    const gain      = bgmGainRef.current;
    const targetVol = settings.musicVolume * settings.masterVolume;
    const steps     = 20;
    let step        = 0;
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

  useEffect(() => {
    if (bgmGainRef.current) {
      bgmGainRef.current.gain.value = settings.musicVolume * settings.masterVolume;
    }
  }, [settings.musicVolume, settings.masterVolume]);

  const playHover = useCallback(() => {
    try {
      const ctx = getCtxSync();
      if (ctx) sfxRef.current?.hover();
    } catch {}
  }, [getCtxSync]);

  const playBufferedSFX = useCallback(async (src: string, volume = 1) => {
    console.log(`[Audio] playBufferedSFX called: ${src}, volume=${volume}`);
    const ctx = await getCtx();
    console.log(`[Audio] got ctx, state=${ctx.state}, masterGain=${masterGainRef.current?.gain.value ?? 'null'}`);
    if (!masterGainRef.current) {
      console.error(`[Audio] masterGainRef is null — cannot play`);
      return;
    }
    const buffer = await loadBuffer(ctx, src);
    if (!buffer) {
      console.error(`[Audio] buffer is null for ${src} — cannot play`);
      return;
    }
    playBuffer(ctx, masterGainRef.current, buffer, volume);
  }, [getCtx]);

  const playUIClick    = useCallback(() => playBufferedSFX('/bgm/uiclick.mp3', 0.5),  [playBufferedSFX]);
  const playSelect     = useCallback(() => playUIClick(),   [playUIClick]);
  const playConfirm    = useCallback(() => playUIClick(),   [playUIClick]);
  const playToggle     = useCallback(() => playUIClick(),   [playUIClick]);
  const playTransition = useCallback(() => playUIClick(),   [playUIClick]);
  const playBack       = useCallback(() => playUIClick(),   [playUIClick]);

  const playStartGame = useCallback(async (): Promise<void> => {
    console.log(`[Audio] playStartGame called`);
    await playBufferedSFX('/bgm/gamestart.mp3', 1.0);
    console.log(`[Audio] playStartGame done`);
  }, [playBufferedSFX]);

  useEffect(() => {
    let bootstrapped = false;
    const handleInteract = async () => {
      if (bootstrapped) return;
      bootstrapped = true;
      console.log(`[Audio] bootstrap: first interaction detected`);
      await getCtx();
      console.log(`[Audio] bootstrap: context ready`);
    };
    window.addEventListener('click',      handleInteract);
    window.addEventListener('touchstart', handleInteract);
    return () => {
      window.removeEventListener('click',      handleInteract);
      window.removeEventListener('touchstart', handleInteract);
    };
  }, [getCtx]);

  return (
    <AudioCtx.Provider value={{
      playBGM, stopBGM, fadeBGM,
      playHover, playSelect, playConfirm, playBack, playTransition, playToggle,
      playStartGame,
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