import React, { useState, useEffect } from 'react';
import { getUserSettings, saveUserSettings, clearAllData } from '../services/storageService';
import { UserSettings } from '../types';

interface SettingsViewProps {
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark';
}

export const SettingsView: React.FC<SettingsViewProps> = ({ toggleTheme, currentTheme }) => {
  const [settings, setSettings] = useState<UserSettings>({
    theme: currentTheme,
    username: '',
    walletAddress: null
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const loaded = getUserSettings();
    setSettings({ ...loaded, theme: currentTheme });
    setNewName(loaded.username);
  }, [currentTheme]);

  const handleSaveName = () => {
    const updated = { ...settings, username: newName || 'ANONYMOUS' };
    setSettings(updated);
    saveUserSettings(updated);
    setIsEditingName(false);
  };

  const handleWalletConnect = () => {
    if (settings.walletAddress) {
      // Disconnect
      const updated = { ...settings, walletAddress: null };
      setSettings(updated);
      saveUserSettings(updated);
    } else {
      // Simulate Connect
      // Generate random hex string
      const randomAddr = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
      const updated = { ...settings, walletAddress: randomAddr };
      setSettings(updated);
      saveUserSettings(updated);
    }
  };

  const handleClearData = () => {
    if (window.confirm('WARNING: This will permanently erase all your diary entries and stats. Are you sure?')) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-full pt-20 pb-24 px-4 max-w-lg mx-auto scrollbar-hide overflow-y-auto">
      
      <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-slate-900 pb-2 transition-colors duration-300">
        <h2 className="text-slate-500 font-mono text-xs uppercase tracking-widest">
          SYSTEM CONFIG
        </h2>
      </div>

      {/* Visual Interface */}
      <section className="mb-8">
        <h3 className="text-[10px] font-mono text-violet-600 dark:text-violet-500 uppercase tracking-widest mb-4">Interface</h3>
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between transition-colors duration-300">
          <span className="font-mono text-sm text-slate-700 dark:text-slate-300">VISUAL_MODE</span>
          <button 
            onClick={toggleTheme}
            className="bg-slate-200 dark:bg-slate-900 px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-violet-500 transition-colors duration-300"
          >
            {currentTheme === 'dark' ? 'SWITCH TO LIGHT' : 'SWITCH TO DARK'}
          </button>
        </div>
      </section>

      {/* Identity */}
      <section className="mb-8">
        <h3 className="text-[10px] font-mono text-violet-600 dark:text-violet-500 uppercase tracking-widest mb-4">Identity</h3>
        
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 mb-4 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-slate-500 uppercase">CALLSIGN</span>
            {!isEditingName && (
              <button onClick={() => setIsEditingName(true)} className="text-[10px] font-mono text-violet-500 hover:text-violet-400">EDIT</button>
            )}
          </div>
          
          {isEditingName ? (
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value.toUpperCase())}
                className="flex-grow bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm p-2 outline-none focus:border-violet-500"
                placeholder="ENTER ALIAS"
              />
              <button onClick={handleSaveName} className="bg-violet-600 text-white font-mono text-xs px-3 hover:bg-violet-500">SAVE</button>
            </div>
          ) : (
            <div className="font-mono text-lg text-slate-800 dark:text-slate-200">{settings.username}</div>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 transition-colors duration-300">
           <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-slate-500 uppercase">WALLET CONNECTION</span>
            <span className={`w-2 h-2 rounded-full ${settings.walletAddress ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-700'}`}></span>
          </div>
          
          {settings.walletAddress ? (
            <div className="flex flex-col gap-3">
              <div className="font-mono text-xs text-slate-600 dark:text-slate-400 break-all bg-slate-100 dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-800">
                {settings.walletAddress}
              </div>
              <button 
                onClick={handleWalletConnect}
                className="w-full py-2 border border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-950/10 font-mono text-[10px] uppercase tracking-wider transition-colors"
              >
                DISCONNECT WALLET
              </button>
            </div>
          ) : (
            <button 
              onClick={handleWalletConnect}
              className="w-full py-3 bg-slate-200 dark:bg-slate-900 hover:bg-violet-500/10 border border-slate-300 dark:border-slate-700 hover:border-violet-500 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 font-mono text-xs uppercase tracking-widest transition-all"
            >
              [ LINK BASE WALLET ]
            </button>
          )}
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <h3 className="text-[10px] font-mono text-red-500 dark:text-red-500 uppercase tracking-widest mb-4">Danger Zone</h3>
        <div className="border border-red-900/20 bg-red-50/50 dark:bg-red-950/10 p-4 transition-colors duration-300">
          <p className="font-mono text-[10px] text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            This action cannot be undone. All entries, stats, and reflection history will be permanently deleted from local storage.
          </p>
          <button 
            onClick={handleClearData}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-widest shadow-lg"
          >
            PURGE LOCAL DATA
          </button>
        </div>
      </section>

    </div>
  );
};