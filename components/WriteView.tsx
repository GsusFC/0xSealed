import React, { useState, useCallback } from 'react';
import { getEntryReflection } from '../services/geminiService';
import { saveEntry } from '../services/storageService';
import { AppView } from '../types';

interface WriteViewProps {
  setView: (view: AppView) => void;
  text: string;
  setText: (text: string) => void;
}

export const WriteView: React.FC<WriteViewProps> = ({ setView, text, setText }) => {
  const [isReflecting, setIsReflecting] = useState(false);
  const [isSealing, setIsSealing] = useState(false);
  const [reflection, setReflection] = useState<{text: string, sentiment: string} | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!text.trim() || isReflecting) return;
    
    setIsReflecting(true);
    try {
      const result = await getEntryReflection(text);
      setReflection({
        text: result.reflection,
        sentiment: result.sentiment
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsReflecting(false);
    }
  }, [text, isReflecting]);

  const handleSeal = useCallback(async () => {
    if (!text.trim()) return;

    setIsSealing(true);
    
    // Simulate network delay for blockchain effect
    await new Promise(resolve => setTimeout(resolve, 2000));

    const finalSentiment = reflection?.sentiment || 'Raw';
    const finalReflection = reflection?.text || 'Sealed without reflection.';
    
    await saveEntry(text, finalSentiment, finalReflection);
    
    setText('');
    setReflection(null);
    setIsSealing(false);
    setView(AppView.VAULT);
  }, [text, reflection, setView, setText]);

  return (
    <div className="flex flex-col h-full pt-20 pb-24 px-4 max-w-lg mx-auto">
      
      {/* Editor */}
      <div className="flex-grow relative group mt-2">
        <textarea
          className="w-full h-full bg-transparent text-slate-800 dark:text-slate-200 text-lg leading-relaxed font-mono resize-none focus:outline-none placeholder-slate-400 dark:placeholder-slate-800 p-0 transition-colors duration-300"
          placeholder="INITIATE ENTRY..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isSealing}
        />
        
        {/* Reflection Overlay */}
        {reflection && (
          <div className="absolute bottom-0 left-0 right-0 bg-slate-50 dark:bg-slate-950 border-t border-violet-300 dark:border-violet-900/50 p-4 animate-fade-in shadow-lg dark:shadow-none transition-colors duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-violet-600 dark:text-violet-500 uppercase">
                :: VOID_RESPONSE
              </span>
              <span className="text-[10px] font-mono border border-slate-300 dark:border-slate-800 px-2 py-0.5 text-slate-500 dark:text-slate-400 uppercase">
                MOOD: {reflection.sentiment}
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
              {">"} {reflection.text}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3">
        {!reflection ? (
          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || isReflecting}
            className={`
              w-full py-4 border font-mono text-sm uppercase tracking-widest transition-all duration-300
              ${!text.trim() 
                ? 'border-slate-200 dark:border-slate-900 text-slate-400 dark:text-slate-700 cursor-not-allowed bg-slate-100 dark:bg-slate-950' 
                : 'border-slate-300 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-500 text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 bg-slate-50 dark:bg-slate-900'}
            `}
          >
            {isReflecting ? "[ ... ACCESSING VOID ... ]" : "[ REFLECT ]"}
          </button>
        ) : (
          <button
            onClick={handleSeal}
            disabled={isSealing}
            className="w-full py-4 bg-violet-600 hover:bg-violet-500 border border-violet-500 text-white font-mono text-sm uppercase tracking-widest shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all active:scale-95"
          >
            {isSealing ? "[ ... SEALING DATA ... ]" : "[ PERMANENTLY SEAL ]"}
          </button>
        )}
        
        {/* Skip Reflection Option */}
        {!reflection && text.trim().length > 0 && (
           <button 
             onClick={handleSeal}
             disabled={isSealing}
             className="text-[10px] font-mono text-slate-500 dark:text-slate-600 hover:text-slate-800 dark:hover:text-slate-400 text-center py-2 uppercase tracking-wider transition-colors duration-300"
           >
             {">"} SKIP REFLECTION_
           </button>
        )}
      </div>
    </div>
  );
};