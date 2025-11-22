import React, { useState, useEffect } from 'react';
import * as farcaster from '@farcaster/frame-sdk';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { WriteView } from './components/WriteView';
import { VaultView } from './components/VaultView';
import { StatsView } from './components/StatsView';
import { SettingsView } from './components/SettingsView';
import { DeployView } from './components/DeployView';
import { AppView } from './types';
import { getUserSettings, saveUserSettings } from './services/storageService';
import { Providers } from './components/Providers';

// Handle potential default export or named export differences
const sdk = farcaster.default || farcaster;

const AppContent = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.WRITE);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [draftText, setDraftText] = useState('');
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  // Initialize theme and Frame SDK
  useEffect(() => {
    const load = async () => {
      const settings = getUserSettings();
      setTheme(settings.theme);
      
      // Signal to Farcaster that the frame is ready
      // The manifest logic ensures the context is loaded
      try {
        if (sdk && sdk.actions) {
           await sdk.actions.ready();
        }
      } catch (e) {
        console.log("Not running in Farcaster frame context or SDK ready failed");
      }
      setIsSDKLoaded(true);
    };
    load();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    const settings = getUserSettings();
    saveUserSettings({ ...settings, theme: newTheme });
  };

  // Pass contextual data to views if needed via context, 
  // but currently we use local storage and direct hooks.

  return (
    <div className={theme}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-violet-500/30 transition-colors duration-300">
        <Header 
          charCount={draftText.length} 
          showCharCount={currentView === AppView.WRITE} 
        />
        
        <main className="h-screen overflow-hidden">
          {currentView === AppView.WRITE && (
            <WriteView 
              setView={setCurrentView} 
              text={draftText} 
              setText={setDraftText} 
            />
          )}
          {currentView === AppView.VAULT && (
            <VaultView />
          )}
          {currentView === AppView.DEPLOY && (
            <DeployView />
          )}
          {currentView === AppView.STATS && (
            <StatsView />
          )}
          {currentView === AppView.SYSTEM && (
            <SettingsView toggleTheme={toggleTheme} currentTheme={theme} />
          )}
        </main>

        <Navigation currentView={currentView} setView={setCurrentView} />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
};

export default App;