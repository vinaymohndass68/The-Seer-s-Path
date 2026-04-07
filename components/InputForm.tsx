import React, { useState } from 'react';
import { UserInput, AnalysisMode } from '../types';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [mode, setMode] = useState<AnalysisMode>('PERSONAL');
  
  // Primary User / Owner
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  
  // Partner (for compatibility)
  const [partnerName, setPartnerName] = useState('');
  const [partnerDate, setPartnerDate] = useState('');

  // Company (for business)
  const [companyName, setCompanyName] = useState('');
  const [natureOfWork, setNatureOfWork] = useState('');

  // Default target date to today
  const today = new Date();
  const defaultTarget = `${String(today.getDate()).padStart(2, '0')}:${String(today.getMonth() + 1).padStart(2, '0')}:${today.getFullYear()}`;
  const [targetDateStr, setTargetDateStr] = useState(defaultTarget);

  const [error, setError] = useState<string | null>(null);

  const parseDate = (dateString: string): string | null => {
     // Regex for DD:MM:YYYY, allowing : / or - as separators
    const datePattern = /^(\d{1,2})[:/\-](\d{1,2})[:/\-](\d{4})$/;
    const match = dateString.match(datePattern);

    if (!match) return null;

    const day = match[1].padStart(2, '0');
    const month = match[2].padStart(2, '0');
    const year = match[3];
    
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    
    if (d < 1 || d > 31 || m < 1 || m > 12) return null;

    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const formattedBirthDate = parseDate(date);
    if (!formattedBirthDate) {
      setError("Please enter a valid Birth Date (DD:MM:YYYY)");
      return;
    }

    const formattedTargetDate = parseDate(targetDateStr);
    if (!formattedTargetDate) {
      setError("Please enter a valid Date (DD:MM:YYYY)");
      return;
    }

    let formattedPartnerBirthDate = undefined;
    if (mode === 'COMPATIBILITY') {
        if (!partnerName) {
            setError("Please enter Partner's Name");
            return;
        }
        formattedPartnerBirthDate = parseDate(partnerDate);
        if (!formattedPartnerBirthDate) {
            setError("Please enter Partner's Birth Date (DD:MM:YYYY)");
            return;
        }
    }

    if (mode === 'COMPANY') {
        if (!companyName) {
            setError("Please enter the Company Name");
            return;
        }
        if (!natureOfWork) {
            setError("Please describe the Nature of Work");
            return;
        }
    }
    
    if (name) {
      onSubmit({ 
        fullName: name, 
        birthDate: formattedBirthDate,
        targetDate: formattedTargetDate,
        mode,
        partnerName: mode === 'COMPATIBILITY' ? partnerName : undefined,
        partnerBirthDate: formattedPartnerBirthDate,
        companyName: mode === 'COMPANY' ? companyName : undefined,
        natureOfWork: mode === 'COMPANY' ? natureOfWork : undefined
      });
    }
  };

  const getSubmitButtonStyles = () => {
    if (isLoading) return 'opacity-70 cursor-not-allowed bg-slate-600';
    
    switch (mode) {
      case 'COMPATIBILITY':
        return 'bg-gradient-to-r from-indigo-300 to-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]';
      case 'COMPANY':
        return 'bg-gradient-to-r from-emerald-300 to-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]';
      case 'PAST_LIFE':
        return 'bg-gradient-to-r from-purple-300 to-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]';
      default: // PERSONAL
        return 'bg-gradient-to-r from-amber-200 to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]';
    }
  };

  const getSubmitButtonText = () => {
    if (isLoading) return 'DIVINING...';
    switch (mode) {
      case 'COMPATIBILITY': return 'ANALYZE AFFINITY';
      case 'COMPANY': return 'EVALUATE BUSINESS';
      case 'PAST_LIFE': return 'UNCOVER PAST';
      default: return 'REVEAL DESTINY';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Mode Toggle */}
        <div className="flex p-1 bg-slate-800/80 rounded-lg mb-8 border border-slate-700 relative overflow-x-auto">
            <button
                type="button"
                onClick={() => setMode('PERSONAL')}
                className={`flex-1 py-2 px-2 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-md transition-all whitespace-nowrap z-10 ${mode === 'PERSONAL' ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                Personal
            </button>
            <button
                type="button"
                onClick={() => setMode('COMPATIBILITY')}
                className={`flex-1 py-2 px-2 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-md transition-all whitespace-nowrap z-10 ${mode === 'COMPATIBILITY' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                Synastry
            </button>
            <button
                type="button"
                onClick={() => setMode('COMPANY')}
                className={`flex-1 py-2 px-2 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-md transition-all whitespace-nowrap z-10 ${mode === 'COMPANY' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                Business
            </button>
            <button
                type="button"
                onClick={() => setMode('PAST_LIFE')}
                className={`flex-1 py-2 px-2 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-md transition-all whitespace-nowrap z-10 ${mode === 'PAST_LIFE' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                Past Life
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Primary Person Section */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="h-px bg-slate-700 flex-grow"></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {mode === 'COMPATIBILITY' ? 'Your Details' : mode === 'COMPANY' ? 'Owner Details' : 'Subject Details'}
                </span>
                <div className="h-px bg-slate-700 flex-grow"></div>
            </div>

            <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-semibold tracking-wide text-indigo-200 uppercase">
                {mode === 'COMPANY' ? 'Owner Full Name' : 'Full Name'}
                </label>
                <input
                id="fullName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Count Louis Hamon"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-slate-400 outline-none transition-all"
                required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="birthDate" className="block text-sm font-semibold tracking-wide text-indigo-200 uppercase">
                {mode === 'COMPANY' ? 'Owner Date of Birth' : 'Date of Birth'}
                </label>
                <input
                id="birthDate"
                type="text"
                value={date}
                onChange={(e) => {
                    setDate(e.target.value);
                    setError(null);
                }}
                placeholder="DD:MM:YYYY"
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-slate-400 outline-none transition-all ${error && !parseDate(date) ? 'border-red-500/50' : 'border-slate-600'}`}
                required
                />
            </div>
        </div>

        {/* Partner Section (Conditional) */}
        {mode === 'COMPATIBILITY' && (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-2 mb-2 pt-2">
                    <div className="h-px bg-slate-700 flex-grow"></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Partner Details
                    </span>
                    <div className="h-px bg-slate-700 flex-grow"></div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="partnerName" className="block text-sm font-semibold tracking-wide text-indigo-200 uppercase">
                    Partner Name
                    </label>
                    <input
                    id="partnerName"
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="e.g. Oscar Wilde"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400 outline-none transition-all"
                    required={mode === 'COMPATIBILITY'}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="partnerDate" className="block text-sm font-semibold tracking-wide text-indigo-200 uppercase">
                    Partner Birth Date
                    </label>
                    <input
                    id="partnerDate"
                    type="text"
                    value={partnerDate}
                    onChange={(e) => {
                        setPartnerDate(e.target.value);
                        setError(null);
                    }}
                    placeholder="DD:MM:YYYY"
                    className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400 outline-none transition-all ${error && !parseDate(partnerDate) ? 'border-red-500/50' : 'border-slate-600'}`}
                    required={mode === 'COMPATIBILITY'}
                    />
                </div>
             </div>
        )}

        {/* Company Section (Conditional) */}
        {mode === 'COMPANY' && (
             <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-2 mb-2 pt-2">
                    <div className="h-px bg-slate-700 flex-grow"></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Company Details
                    </span>
                    <div className="h-px bg-slate-700 flex-grow"></div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="companyName" className="block text-sm font-semibold tracking-wide text-indigo-200 uppercase">
                    Company Name
                    </label>
                    <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Innovations"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400 outline-none transition-all"
                    required={mode === 'COMPANY'}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="natureOfWork" className="block text-sm font-semibold tracking-wide text-indigo-200 uppercase">
                    Nature of Work
                    </label>
                    <textarea
                    id="natureOfWork"
                    value={natureOfWork}
                    onChange={(e) => setNatureOfWork(e.target.value)}
                    placeholder="e.g. Software development, Real Estate, Creative Arts..."
                    rows={2}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400 outline-none transition-all resize-none"
                    required={mode === 'COMPANY'}
                    />
                </div>
             </div>
        )}

        {/* Footer Section */}
        <div className="pt-4 border-t border-slate-700/50">
             <div className="space-y-2">
                <label htmlFor="targetDate" className="block text-sm font-semibold tracking-wide text-indigo-200 uppercase">
                 {mode === 'COMPATIBILITY' || mode === 'PAST_LIFE' ? 'Analysis Date' : 'Prediction Date'}
                </label>
                <input
                id="targetDate"
                type="text"
                value={targetDateStr}
                onChange={(e) => {
                    setTargetDateStr(e.target.value);
                    setError(null);
                }}
                placeholder="DD:MM:YYYY"
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-slate-400 outline-none transition-all ${error && !parseDate(targetDateStr) ? 'border-red-500/50' : 'border-slate-600'}`}
                required
                />
            </div>
        </div>
        
        {error && (
            <p className="text-xs text-red-400 animate-pulse text-center">{error}</p>
        )}

        <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 mt-6 font-display font-bold text-lg tracking-widest text-slate-900 rounded-lg shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 ${getSubmitButtonStyles()}`}
        >
            {getSubmitButtonText()}
        </button>
        </form>
    </div>
  );
};