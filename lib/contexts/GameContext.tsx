'use client';
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export type Section = 'menu' | 'profile' | 'projects' | 'skills' | 'contact' | 'archive'  | 'settings' | 'about';

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  currentTrack: string;
  performanceMode: boolean;
  particles: boolean;
  theme: 'dark' | 'dark-teal';
  hudVisible: boolean;
  language: 'english' | 'tagalog' | 'spanish' | 'japanese';
  fpsCounter: boolean;
  uiScale: number;
}

interface GameContextType {
  currentSection: Section;
  prevSection: Section | null;
  navigateTo: (section: Section) => void;
  settings: GameSettings;
  updateSetting: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  isGameStarted: boolean;
  setIsGameStarted: (v: boolean) => void;
  isTitleScreen: boolean;
  setIsTitleScreen: (v: boolean) => void;
  isRecruiterMode: boolean;
  setIsRecruiterMode: (v: boolean) => void;
}

const defaultSettings: GameSettings = {
  masterVolume: 0.8,
  musicVolume: 0.6,
  sfxVolume: 0.8,
  currentTrack: 'cinematic',
  performanceMode: false,
  particles: true,
  theme: 'dark',
  hudVisible: true,
  language: 'english',
  fpsCounter: false,
  uiScale: 1,
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [currentSection, setCurrentSection] = useState<Section>('menu');
  const [prevSection, setPrevSection] = useState<Section | null>(null);
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isTitleScreen, setIsTitleScreen] = useState(true);
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);

  const navigateTo = useCallback((section: Section) => {
    setPrevSection(currentSection);
    setCurrentSection(section);
  }, [currentSection]);

  const updateSetting = useCallback(<K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <GameContext.Provider value={{
      currentSection, prevSection, navigateTo,
      settings, updateSetting,
      isLoading, setIsLoading,
      isGameStarted, setIsGameStarted,
      isTitleScreen, setIsTitleScreen,
      isRecruiterMode, setIsRecruiterMode,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
