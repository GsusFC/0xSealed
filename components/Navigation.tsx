import React from 'react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  return (
    <nav className="fixed bottom-6 left-4 right-4 h-12 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur border border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 z-50 max-w-lg mx-auto shadow-xl dark:shadow-none transition-colors duration-300">
      <button
        onClick={() => setView(AppView.WRITE)}
        className={`flex-1 h-full flex items-center justify-center transition-colors duration-300 ${
          currentView === AppView.WRITE ? 'bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
      >
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">WRITE</span>
      </button>

      <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 transition-colors duration-300"></div>

      <button
        onClick={() => setView(AppView.VAULT)}
        className={`flex-1 h-full flex items-center justify-center transition-colors duration-300 ${
          currentView === AppView.VAULT ? 'bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
      >
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">VAULT</span>
      </button>

      <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 transition-colors duration-300"></div>

      <button
        onClick={() => setView(AppView.DEPLOY)}
        className={`flex-1 h-full flex items-center justify-center transition-colors duration-300 ${
          currentView === AppView.DEPLOY ? 'bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
      >
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">CLANK</span>
      </button>

      <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 transition-colors duration-300"></div>

      <button
        onClick={() => setView(AppView.STATS)}
        className={`flex-1 h-full flex items-center justify-center transition-colors duration-300 ${
          currentView === AppView.STATS ? 'bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
      >
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">STATS</span>
      </button>

      <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 transition-colors duration-300"></div>

      <button
        onClick={() => setView(AppView.SYSTEM)}
        className={`flex-1 h-full flex items-center justify-center transition-colors duration-300 ${
          currentView === AppView.SYSTEM ? 'bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
      >
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">SYS</span>
      </button>
    </nav>
  );
};