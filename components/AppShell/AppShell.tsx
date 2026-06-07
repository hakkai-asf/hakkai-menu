'use client';
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/contexts/GameContext';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';
import GameWorld from '@/components/GameWorld/GameWorld';
import MainMenu from '@/components/MainMenu/MainMenu';
import RecruiterMode from '@/components/RecruiterMode/RecruiterMode';
import LogoViewer from '@/components/Logo/LogoViewer';

// Section panels
import ProfileSection from '@/components/sections/ProfileSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ContactSection from '@/components/sections/ContactSection';
import ArchiveSection from '@/components/sections/ArchiveSection';
import SettingsSection from '@/components/sections/SettingsSection';
import AboutmeSection from '@/components/sections/AboutmeSection';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoading, isGameStarted, currentSection, settings } = useGame();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg-primary">
      {/* Persistent ambient overlays */}
      <div className="noise-overlay" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      {/* Persistent 3D Game World */}
      {isGameStarted && <GameWorld />}

      {/* Loading Screen — sits on top until dismissed */}
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {/* Main game UI — only shows after loading */}
      {isGameStarted && (
        <>
          {/* Persistent Main Menu (left rail) */}
          <MainMenu />

          {/* Section content panel (right area) */}
          <AnimatePresence mode="wait">
            {currentSection === 'profile' && <ProfileSection key="profile" />}
            {currentSection === 'projects' && <ProjectsSection key="projects" />}
            {currentSection === 'skills' && <SkillsSection key="skills" />}
            {currentSection === 'contact' && <ContactSection key="contact" />}
            {currentSection === 'archive' && <ArchiveSection key="archive" />}
            {currentSection === 'settings' && <SettingsSection key="settings" />}
            {currentSection === 'about' && <AboutmeSection key="about" />}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}