import React, { useEffect, useState } from 'react';
import { getEntries } from '../services/storageService';
import { DiaryEntry } from '../types';

export const VaultView: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    setEntries(getEntries());
  }, []);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center pt-20 pb-24 px-6 text-center transition-colors duration-300">
        <div className="text-8xl font-mono font-bold text-slate-200 dark:text-slate-900 select-none mb-4 transition-colors duration-300">0</div>
        <h3 className="text-slate-400 dark:text-slate-400 font-mono text-xs uppercase tracking-widest mb-2">VAULT EMPTY</h3>
        <p className="text-slate-500 dark:text-slate-600 text-xs font-mono max-w-xs">
          NO SEALED RECORDS FOUND.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full pt-20 pb-24 px-4 overflow-y-auto max-w-lg mx-auto scrollbar-hide">
      <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-slate-900 pb-2 transition-colors duration-300">
        <h2 className="text-slate-500 font-mono text-xs uppercase tracking-widest">
          RECORDS
        </h2>
        <span className="text-slate-500 font-mono text-xs">
          [{entries.length}]
        </span>
      </div>

      <div className="space-y-8">
        {entries.map((entry) => (
          <div 
            key={entry.id}
            className="group"
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[10px] font-mono text-violet-600 dark:text-violet-500 uppercase transition-colors duration-300">
                {new Date(entry.timestamp).toLocaleDateString()} <span className="text-slate-400 dark:text-slate-600">|</span> {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
              <span className={`text-[10px] font-mono uppercase tracking-wider transition-colors duration-300 ${
                entry.sentiment === 'Raw' ? 'text-slate-500 dark:text-slate-600' : 'text-violet-500 dark:text-violet-400'
              }`}>
                [{entry.sentiment}]
              </span>
            </div>

            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-3 font-mono whitespace-pre-wrap border-l border-slate-200 dark:border-slate-800 pl-4 py-1 group-hover:border-violet-400 dark:group-hover:border-violet-800 transition-colors duration-300">
              {entry.content}
            </p>

            {entry.aiReflection && (
              <div className="mb-3 pl-4">
                <p className="text-xs text-slate-500 dark:text-slate-500 font-mono transition-colors duration-300">
                  {">"} {entry.aiReflection}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 dark:text-slate-700 transition-colors duration-300">
                <span>HASH:</span>
                <span className="truncate w-24 bg-slate-100 dark:bg-slate-900 px-1 transition-colors duration-300">{entry.hash}</span>
              </div>
              
              <button className="text-[10px] font-mono text-slate-500 dark:text-slate-600 hover:text-violet-600 dark:hover:text-violet-400 uppercase tracking-wider transition-colors">
                SHARE ENTRY
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-12 mb-4 border-t border-slate-200 dark:border-slate-900 pt-4 transition-colors duration-300">
         <p className="text-[10px] text-slate-400 dark:text-slate-800 font-mono uppercase">
           Immutable Local Storage
         </p>
      </div>
    </div>
  );
};