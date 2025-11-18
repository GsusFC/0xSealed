import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { WriteView } from './components/WriteView';
import { VaultView } from './components/VaultView';
import { StatsView } from './components/StatsView';
import { SettingsView } from './components/SettingsView';
import { AppView } from './types';
import { getUserSettings, saveUserSettings } from './services/storageService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.WRITE);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [draftText, setDraftText] = useState('');

  // Initialize theme on load
  useEffect(() => {
    const settings = getUserSettings();
    setTheme(settings.theme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    const settings = getUserSettings();
    saveUserSettings({ ...settings, theme: newTheme });
  };

  return (
    // We apply the 'dark' class conditionally to the outer wrapper if the theme is dark.
    // Tailwind's `darkMode: 'class'` strategy will then trigger children dark: styles.
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

export default App;