import React from 'react';

interface NumberCardProps {
  title: string;
  value: number;
  compoundValue: number;
  description: string;
  icon?: React.ReactNode;
  delay?: string;
  score?: number; // 1-10
}

export const NumberCard: React.FC<NumberCardProps> = ({ title, value, compoundValue, description, icon, delay = "0ms", score }) => {
  
  const getScoreColor = (s: number) => {
    if (s >= 8) return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
    if (s >= 5) return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
    return "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]";
  };

  const getScoreLabel = (s: number) => {
    if (s >= 8) return "Highly Auspicious";
    if (s >= 5) return "Moderate Influence";
    return "Challenging Vibration";
  };

  return (
    <div 
      className="glass-panel p-6 rounded-xl border-t border-indigo-500/30 shadow-lg flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700 fill-mode-both"
      style={{ animationDelay: delay }}
    >
      <div className="mb-3 text-amber-400 opacity-80">
        {icon}
      </div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-2">{title}</h3>
      <div className="relative mb-4">
        <span className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-indigo-200 filter drop-shadow-lg">
          {value}
        </span>
        {compoundValue !== value && (
          <span className="absolute -top-2 -right-6 text-sm font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            /{compoundValue}
          </span>
        )}
      </div>
      
      {/* Score Indicator */}
      {score !== undefined && (
        <div className="w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-1000">
          <div className="flex justify-between items-end mb-1 px-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Favorability</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${score >= 8 ? 'text-emerald-400' : score >= 5 ? 'text-amber-400' : 'text-rose-400'}`}>
              {getScoreLabel(score)}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${getScoreColor(score)}`}
              style={{ width: `${score * 10}%` }}
            ></div>
          </div>
          <div className="text-right mt-1">
             <span className="text-[10px] text-slate-500">{score}/10</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-sm text-slate-300 leading-relaxed">
          {description}
        </p>
        
        {compoundValue !== value && (
           <p className="text-xs text-indigo-300/80 italic border-t border-indigo-500/20 pt-2 mt-2">
             The compound number ({compoundValue}) represents deeper, underlying vibrations that can offer additional insights beyond the single digit.
           </p>
        )}
      </div>
    </div>
  );
};