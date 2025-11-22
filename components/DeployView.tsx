import React, { useState } from 'react';
import { useClanker } from '../hooks/useClanker';

export const DeployView: React.FC = () => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [supply, setSupply] = useState('1000000');
  
  const { 
    deploy, 
    rotateSalt, 
    salt, 
    predictedAddress, 
    isPending, 
    isConfirming, 
    isConfirmed, 
    hash,
    error 
  } = useClanker(name, symbol);

  return (
    <div className="flex flex-col h-full pt-20 pb-24 px-4 max-w-lg mx-auto scrollbar-hide overflow-y-auto">
      
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 mb-6 relative overflow-hidden transition-colors duration-300">
        <div className="relative z-10 flex flex-col items-start">
          <div className="text-violet-600 dark:text-violet-500 font-mono text-xs uppercase tracking-widest mb-1 transition-colors duration-300">PROTOCOL INTERFACE</div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 font-mono uppercase tracking-tighter transition-colors duration-300">CLANKER NEXUS</h2>
          <p className="text-[10px] text-slate-500 font-mono uppercase">Base L2 • Autonomous Asset Factory</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Token Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.G. VOID ECHO"
            className="w-full bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm p-3 outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Ticker</label>
            <input 
              type="text" 
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="$VOID"
              className="w-full bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm p-3 outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Supply</label>
            <input 
              type="number" 
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              className="w-full bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm p-3 outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* Prediction Engine */}
        <div className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-2">
           <div className="flex justify-between items-center">
             <span className="text-[10px] font-mono text-violet-600 dark:text-violet-500 uppercase">Target Contract</span>
             <button onClick={rotateSalt} className="text-[10px] font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline">REROLL SALT</button>
           </div>
           <div className="font-mono text-xs text-slate-600 dark:text-slate-400 break-all">
             {name && symbol ? (predictedAddress || "CALCULATING...") : "ENTER DETAILS TO PREDICT"}
           </div>
           <div className="font-mono text-[8px] text-slate-400 break-all">
             SALT: {salt}
           </div>
        </div>

        {/* Actions */}
        <button 
          onClick={() => deploy(name, symbol, supply)}
          disabled={!name || !symbol || isPending || isConfirming}
          className={`
            w-full py-4 font-mono text-sm uppercase tracking-widest shadow-lg transition-all
            ${isPending || isConfirming 
              ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-wait' 
              : 'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] active:scale-95'}
          `}
        >
          {isPending ? "CONFIRMING WALLET..." : isConfirming ? "DEPLOYING FACTORY..." : "INITIATE DEPLOYMENT"}
        </button>
        
        {error && (
          <div className="p-3 border border-red-500/20 bg-red-500/10 text-red-500 font-mono text-[10px]">
            ERROR: {error.message.slice(0, 100)}...
          </div>
        )}

        {isConfirmed && (
          <div className="p-3 border border-green-500/20 bg-green-500/10 text-green-500 font-mono text-[10px] break-all">
            SUCCESS. HASH: {hash}
          </div>
        )}
      </div>
    </div>
  );
};