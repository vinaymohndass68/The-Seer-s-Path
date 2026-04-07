
import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { NumerologyResult, PredictionData } from '../types';
import { NumberCard } from './NumberCard';

// Icons
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const DestinyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4 4 4 4-4Z"/></svg>
);
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/></svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const HourglassIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>
);
const CompassIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
);
const MapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
);
const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
);
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);
const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

interface ScoreBarProps {
  label: string;
  score?: number;
  colorTheme?: 'default' | 'emerald' | 'purple' | 'indigo';
}

const ScoreBar: React.FC<ScoreBarProps> = ({ label, score = 0, colorTheme = 'default' }) => {
    const clampedScore = Math.min(Math.max(score, 0), 10);
    const getColor = (s: number) => {
        if (colorTheme === 'purple') return s >= 8 ? "bg-purple-400" : s >= 5 ? "bg-fuchsia-400" : "bg-slate-600";
        if (colorTheme === 'emerald') return s >= 8 ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" : s >= 5 ? "bg-teal-400" : "bg-slate-500";
        if (colorTheme === 'indigo') return s >= 8 ? "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.4)]" : s >= 5 ? "bg-violet-400" : "bg-slate-500";
        return s >= 8 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : s >= 5 ? "bg-amber-500" : "bg-rose-500";
    };
    return (
        <div className="group break-inside-avoid">
            <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{label}</span>
                <span className="text-[10px] font-bold text-white">{clampedScore}/10</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <div 
                    className={`h-full transition-all duration-1000 ease-out ${getColor(clampedScore)}`} 
                    style={{ width: `${clampedScore * 10}%` }}
                ></div>
            </div>
        </div>
    );
};

interface ResultViewProps {
  data: NumerologyResult;
  prediction: PredictionData;
  onReset: () => void;
  onRequestMoreNames?: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ data, prediction, onReset, onRequestMoreNames }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).toLocaleDateString('default', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    setIsDownloading(true);
    
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0f172a',
        logging: false,
        onclone: (clonedDoc) => {
          const transparentElements = clonedDoc.querySelectorAll('.text-transparent');
          transparentElements.forEach(el => {
            const htmlEl = el as HTMLElement;
            htmlEl.classList.remove('text-transparent', 'bg-clip-text');
            if (htmlEl.tagName === 'SPAN' && htmlEl.classList.contains('font-display')) {
                htmlEl.style.color = '#fbbf24'; 
            } else {
                htmlEl.style.color = '#ffffff';
            }
          });
          const actions = clonedDoc.querySelectorAll('[data-html2canvas-ignore]');
          actions.forEach(a => (a as HTMLElement).style.display = 'none');
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const finalImgHeight = imgHeight * ratio;
      
      let heightLeft = finalImgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, finalImgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = position - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, finalImgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`The_Seers_Path_${data.mode}_${data.targetDate}.pdf`);
      setIsDownloading(false);
    } catch (err) { 
      console.error('PDF generation failed:', err); 
      alert("The cosmic connection was interrupted. Please try downloading again.");
      setIsDownloading(false);
    }
  };

  const handleDownloadImage = (url?: string, name?: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name || 'Mystical_Vision'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- PAST LIFE RENDER ---
  if (data.mode === 'PAST_LIFE') {
    return (
      <div className="w-full max-w-5xl mx-auto pb-12">
        <div ref={contentRef} className="p-4 md:p-8 bg-[#0f172a] rounded-xl text-slate-200 border border-purple-500/10 overflow-hidden shadow-2xl">
          <div className="text-center mb-10 border-b border-purple-500/10 pb-8 break-inside-avoid">
             <div className="inline-block p-4 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                <CompassIcon />
             </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-400 to-purple-300 mb-2 tracking-tight">
              Karmic Resonance
            </h1>
            <p className="text-purple-300/80 font-light tracking-[0.3em] uppercase text-xs italic">
              Chronicles of the Soul: {data.fullName}
            </p>
          </div>
          <div className="mb-6 relative group break-inside-avoid">
             <div className="w-full aspect-[16/9] bg-slate-900 rounded-2xl overflow-hidden border border-purple-500/20 relative shadow-[0_0_50px_rgba(168,85,247,0.15)]">
                {prediction.imageLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm z-20">
                         <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                         <p className="text-purple-300 font-display text-sm tracking-widest animate-pulse">Visualizing the Aether...</p>
                    </div>
                ) : prediction.pastLifeImageUrl ? (
                    <>
                        <img src={prediction.pastLifeImageUrl} alt="Past Life Vision" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-40"></div>
                        <button data-html2canvas-ignore onClick={(e) => { e.stopPropagation(); handleDownloadImage(prediction.pastLifeImageUrl, `PastLife_Vision_${data.fullName}`); }} className="absolute bottom-4 right-4 bg-purple-600/80 hover:bg-purple-500 text-white p-2 rounded-full shadow-lg backdrop-blur-md transition-all z-30 opacity-0 group-hover:opacity-100"><DownloadIcon /></button>
                    </>
                ) : <div className="absolute inset-0 flex items-center justify-center text-slate-600 bg-slate-900/40"><div className="text-center"><ImageIcon /><p className="text-[10px] mt-2 uppercase tracking-widest opacity-50">Vision not yet manifest</p></div></div>}
             </div>
          </div>
          <div className="mb-12 flex justify-center break-inside-avoid">
            <div className="w-[90%] md:w-[80%] bg-slate-900/90 p-6 rounded-2xl border border-purple-500/30 text-center shadow-2xl relative z-10 -mt-12 backdrop-blur-xl">
                <h2 className="text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-1">Soul Identity</h2>
                <div className="font-display text-2xl md:text-4xl text-white mb-2 italic">"{prediction.pastLifeArchetype}"</div>
                <div className="flex flex-wrap justify-center gap-4 text-[10px] md:text-xs text-slate-300">
                    <span className="flex items-center gap-1 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20"><HourglassIcon /><span className="text-purple-200">{prediction.pastLifePeriod}</span></span>
                    <span className="flex items-center gap-1 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20"><MapIcon /><span className="text-indigo-200">{prediction.pastLifePlace}, {prediction.pastLifeCountry}</span></span>
                </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
             <div className="bg-white/5 p-6 rounded-xl border border-white/5 hover:border-purple-500/20 transition-all break-inside-avoid">
                <h3 className="text-xs font-bold text-purple-400 uppercase mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-400"></div> Environment</h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">"{prediction.pastLifeEnvironment}"</p>
             </div>
             <div className="bg-white/5 p-6 rounded-xl border border-white/5 hover:border-amber-500/20 transition-all break-inside-avoid">
                <h3 className="text-xs font-bold text-amber-400 uppercase mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400"></div> Societal Norms</h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">"{prediction.pastLifeSocietalNorms}"</p>
             </div>
             <div className="bg-white/5 p-6 rounded-xl border border-white/5 hover:border-emerald-500/20 transition-all break-inside-avoid">
                <h3 className="text-xs font-bold text-emerald-400 uppercase mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Cultural Pulse</h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">"{prediction.pastLifeCulture}"</p>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
             <div className="space-y-6">
                <div className="p-6 border-l-2 border-purple-500 bg-purple-500/5 rounded-r-xl break-inside-avoid">
                   <h3 className="text-xs font-bold text-purple-300 uppercase mb-2">Life Role & Standing</h3>
                   <p className="text-white font-medium mb-1">{prediction.pastLifeRole}</p>
                   <p className="text-sm text-slate-400 italic">{prediction.pastLifeFamily}</p>
                </div>
                <div className="p-6 bg-slate-800/20 rounded-xl border border-white/5 break-inside-avoid">
                   <h3 className="text-xs font-bold text-amber-300 uppercase mb-4 flex items-center gap-2"><SparklesIcon /> Soul Artifacts</h3>
                   <div className="grid grid-cols-3 gap-3">
                      {prediction.pastLifeArtifacts?.map((art, idx) => {
                        const img = prediction.pastLifeArtifactImages?.[idx];
                        return (
                          <div key={idx} className="flex flex-col gap-2 group cursor-help">
                             <div className="aspect-square bg-slate-900 rounded-lg overflow-hidden border border-white/10 relative shadow-lg">
                                {prediction.artifactsLoading ? <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs"><div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div> : img ? <><img src={img} alt={art} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /><div data-html2canvas-ignore className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2"><button onClick={() => handleDownloadImage(img, `Artifact_${art}`)} className="text-[8px] bg-amber-600/80 text-white px-2 py-0.5 rounded">SAVE</button></div></> : <div className="absolute inset-0 flex items-center justify-center opacity-20"><SparklesIcon /></div>}
                             </div>
                             <span className="text-[9px] text-center text-amber-200/80 font-medium leading-tight line-clamp-2">{art}</span>
                          </div>
                        );
                      })}
                   </div>
                </div>
             </div>
             <div className="bg-slate-800/20 p-6 rounded-xl border border-white/10 flex flex-col justify-between break-inside-avoid">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-6 text-center">Karmic Equilibrium</h3>
                <div className="space-y-6">
                   <ScoreBar label="Karmic Intensity" score={prediction.scores?.karmicIntensity} colorTheme="purple" />
                   <ScoreBar label="Soul Maturity" score={prediction.scores?.soulMaturity} colorTheme="purple" />
                   <ScoreBar label="Spiritual Potential" score={prediction.scores?.spiritualPotential} colorTheme="purple" />
                </div>
             </div>
          </div>
          <div className="p-8 rounded-xl border border-purple-500/20 mb-8 bg-gradient-to-b from-transparent to-purple-500/5">
            <h2 className="font-display text-2xl text-center mb-6 text-purple-100 break-inside-avoid">The Oracle's Transcribed Vision</h2>
            {prediction.loading ? <div className="flex flex-col items-center justify-center py-12"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div> : <div className="prose prose-invert prose-purple max-w-none text-slate-200 leading-relaxed text-center break-inside-auto"><ReactMarkdown>{prediction.text}</ReactMarkdown></div>}
          </div>
          <div className="text-center py-6 border-t border-white/5 italic text-purple-300/60 text-sm break-inside-avoid">Karmic Mantra: "{prediction.yearlySummary}"</div>
        </div>
        <div className="mt-8 flex justify-center gap-4" data-html2canvas-ignore>
            <button onClick={onReset} className="px-6 py-2 rounded-full border border-purple-500 text-purple-300 uppercase text-xs tracking-widest hover:bg-purple-500/10 transition-all">Recall Another Soul</button>
            <button onClick={handleDownloadPDF} disabled={isDownloading} className={`flex items-center gap-2 px-6 py-2 rounded-full bg-purple-600 text-white uppercase text-xs tracking-widest font-bold shadow-lg shadow-purple-900/50 hover:bg-purple-500 transition-all ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}><DownloadIcon /> {isDownloading ? 'Divining Document...' : 'Save Scroll'}</button>
        </div>
      </div>
    );
  }

  // --- BUSINESS / COMPANY RENDER ---
  if (data.mode === 'COMPANY' && data.company) {
    return (
        <div className="w-full max-w-5xl mx-auto pb-12">
            <div ref={contentRef} className="p-4 md:p-8 bg-[#0f172a] rounded-xl text-slate-200 border border-emerald-500/10 overflow-hidden shadow-2xl">
                <div className="text-center mb-10 border-b border-emerald-500/10 pb-8 break-inside-avoid">
                    <div className="inline-block p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <BriefcaseIcon />
                    </div>
                    <h1 className="font-display text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-400 to-emerald-300 mb-2 tracking-tight">
                        {data.company.name}
                    </h1>
                    <p className="text-emerald-300/80 font-light tracking-[0.2em] uppercase text-xs italic">
                        Commercial Destiny: {data.company.natureOfWork}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="break-inside-avoid">
                        <NumberCard 
                            title="Company Number" 
                            value={data.company.nameNumber} 
                            compoundValue={data.company.nameCompound} 
                            description="The external vibrational output of the brand and its success potential." 
                            icon={<StarIcon />} 
                            score={prediction.scores?.brandPower} 
                        />
                    </div>
                    <div className="bg-slate-800/20 p-6 rounded-xl border border-white/10 flex flex-col justify-between break-inside-avoid">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-6 text-center tracking-widest">Business Vitality</h3>
                        <div className="space-y-6">
                            <ScoreBar label="Success Potential" score={prediction.scores?.businessSuccess} colorTheme="emerald" />
                            <ScoreBar label="Brand Magnetism" score={prediction.scores?.brandPower} colorTheme="emerald" />
                            <ScoreBar label="Owner Alignment" score={prediction.scores?.ownerCompatibility} colorTheme="emerald" />
                        </div>
                    </div>
                </div>

                {prediction.suggestedNames && prediction.suggestedNames.length > 0 && (
                    <div className="mb-12 break-inside-avoid">
                        <div className="flex items-center gap-3 mb-6">
                            <SparklesIcon />
                            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-widest">Prosperity Alternatives</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {prediction.suggestedNames.map((item, idx) => (
                                <div key={idx} className="bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/20">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-emerald-100">{item.name}</span>
                                        <span className="text-xs bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded">#{item.numerology}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-relaxed italic">"{item.rationale}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="p-8 rounded-xl border border-emerald-500/20 mb-8 bg-slate-900/40">
                    <h2 className="font-display text-2xl text-center mb-6 text-emerald-100 break-inside-avoid">Business Oracle Reading</h2>
                    {prediction.loading ? <div className="flex flex-col items-center justify-center py-12"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div> : <div className="prose prose-invert prose-emerald max-w-none text-slate-200 leading-relaxed break-inside-auto"><ReactMarkdown>{prediction.text}</ReactMarkdown></div>}
                </div>

                <div className="text-center py-6 border-t border-white/5 italic text-emerald-300/60 text-sm break-inside-avoid">Market Mantra: "{prediction.yearlySummary}"</div>
            </div>
            <div className="mt-8 flex justify-center gap-4" data-html2canvas-ignore>
                <button onClick={onReset} className="px-6 py-2 rounded-full border border-emerald-500 text-emerald-300 uppercase text-xs tracking-widest hover:bg-emerald-500/10 transition-all">New Consultation</button>
                <button onClick={handleDownloadPDF} disabled={isDownloading} className={`flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-600 text-white uppercase text-xs tracking-widest font-bold shadow-lg shadow-emerald-900/50 hover:bg-emerald-500 transition-all ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}><DownloadIcon /> {isDownloading ? 'Finalizing Scroll...' : 'Save Audit'}</button>
            </div>
        </div>
    );
  }

  // --- SYNASTRY / COMPATIBILITY RENDER ---
  if (data.mode === 'COMPATIBILITY' && data.partner) {
    return (
        <div className="w-full max-w-5xl mx-auto pb-12">
            <div ref={contentRef} className="p-4 md:p-8 bg-[#0f172a] rounded-xl text-slate-200 border border-indigo-500/10 overflow-hidden shadow-2xl">
                <div className="text-center mb-10 border-b border-indigo-500/10 pb-8 break-inside-avoid">
                    <div className="inline-block p-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                        <HeartIcon />
                    </div>
                    <h1 className="font-display text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-400 to-indigo-300 mb-2 tracking-tight">
                        Synastry Report
                    </h1>
                    <p className="text-indigo-300/80 font-light tracking-[0.2em] uppercase text-xs italic">
                        {data.fullName} & {data.partner.fullName}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/20 break-inside-avoid">
                            <h3 className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-3">Subject A: {data.fullName}</h3>
                            <div className="flex gap-4">
                                <div className="flex-1 text-center"><div className="text-xs text-slate-500 uppercase">Birth</div><div className="text-2xl font-display text-white">{data.birthNumber}</div></div>
                                <div className="flex-1 text-center"><div className="text-xs text-slate-500 uppercase">Destiny</div><div className="text-2xl font-display text-white">{data.destinyNumber}</div></div>
                                <div className="flex-1 text-center"><div className="text-xs text-slate-500 uppercase">Name</div><div className="text-2xl font-display text-white">{data.nameNumber}</div></div>
                            </div>
                        </div>
                        <div className="p-4 bg-violet-500/5 rounded-xl border border-violet-500/20 break-inside-avoid">
                            <h3 className="text-[10px] font-bold text-violet-300 uppercase tracking-widest mb-3">Subject B: {data.partner.fullName}</h3>
                            <div className="flex gap-4">
                                <div className="flex-1 text-center"><div className="text-xs text-slate-500 uppercase">Birth</div><div className="text-2xl font-display text-white">{data.partner.birthNumber}</div></div>
                                <div className="flex-1 text-center"><div className="text-xs text-slate-500 uppercase">Destiny</div><div className="text-2xl font-display text-white">{data.partner.destinyNumber}</div></div>
                                <div className="flex-1 text-center"><div className="text-xs text-slate-500 uppercase">Name</div><div className="text-2xl font-display text-white">{data.partner.nameNumber}</div></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-800/20 p-6 rounded-xl border border-white/10 flex flex-col justify-between break-inside-avoid">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-6 text-center tracking-widest">Affinity Equilibrium</h3>
                        <div className="space-y-6">
                            <ScoreBar label="Soul Harmony" score={prediction.scores?.harmony} colorTheme="indigo" />
                            <ScoreBar label="Communication" score={prediction.scores?.communication} colorTheme="indigo" />
                            <ScoreBar label="Longevity" score={prediction.scores?.longevity} colorTheme="indigo" />
                        </div>
                    </div>
                </div>

                <div className="p-8 rounded-xl border border-indigo-500/20 mb-8 bg-slate-900/40">
                    <h2 className="font-display text-2xl text-center mb-6 text-indigo-100 break-inside-avoid">Synastry Disclosure</h2>
                    {prediction.loading ? <div className="flex flex-col items-center justify-center py-12"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div> : <div className="prose prose-invert prose-indigo max-w-none text-slate-200 leading-relaxed text-center break-inside-auto"><ReactMarkdown>{prediction.text}</ReactMarkdown></div>}
                </div>

                <div className="text-center py-6 border-t border-white/5 italic text-indigo-300/60 text-sm break-inside-avoid">Vibrational Union: "{prediction.yearlySummary}"</div>
            </div>
            <div className="mt-8 flex justify-center gap-4" data-html2canvas-ignore>
                <button onClick={onReset} className="px-6 py-2 rounded-full border border-indigo-500 text-indigo-300 uppercase text-xs tracking-widest hover:bg-indigo-500/10 transition-all">Seek Another Link</button>
                <button onClick={handleDownloadPDF} disabled={isDownloading} className={`flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-600 text-white uppercase text-xs tracking-widest font-bold shadow-lg shadow-indigo-900/50 hover:bg-indigo-500 transition-all ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}><DownloadIcon /> {isDownloading ? 'Merging Fates...' : 'Save Synastry'}</button>
            </div>
        </div>
    );
  }

  // --- PERSONAL RENDER ---
  if (data.mode === 'PERSONAL') {
    return (
      <div className="w-full max-w-5xl mx-auto pb-12">
        <div ref={contentRef} className="p-4 md:p-8 bg-[#0f172a] rounded-xl text-slate-200 overflow-hidden shadow-2xl">
          <div className="text-center mb-10 border-b border-white/10 pb-8 break-inside-avoid">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 mb-3 tracking-tight">
              {data.fullName}
            </h1>
            <p className="text-indigo-300 font-light tracking-widest uppercase text-sm">Born: {formatDate(data.birthDate)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
            <div className="break-inside-avoid">
                <NumberCard title="Birth Number" value={data.birthNumber} compoundValue={data.birthCompound} description="Your unchangeable inner essence and natural vibration." icon={<StarIcon />} score={prediction.scores?.birth} />
            </div>
            <div className="break-inside-avoid">
                <NumberCard title="Destiny Number" value={data.destinyNumber} compoundValue={data.destinyCompound} description="Your fadic path and life's inevitable destination." icon={<DestinyIcon />} score={prediction.scores?.destiny} />
            </div>
            <div className="break-inside-avoid">
                <NumberCard title="Name Number" value={data.nameNumber} compoundValue={data.nameCompound} description="Your public identity and worldly potential." icon={<UserIcon />} score={prediction.scores?.name} />
            </div>
          </div>

          {prediction.personalNameSuggestions && prediction.personalNameSuggestions.length > 0 && (
            <div className="p-6 md:p-8 rounded-xl mb-12 border border-indigo-500/20 bg-indigo-500/5 break-inside-avoid">
                <div className="text-center mb-6">
                    <div className="inline-block p-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-3">
                        <SparklesIcon />
                    </div>
                    <h3 className="font-display text-xl text-indigo-200">Vibrational Harmonization</h3>
                    <p className="text-xs text-slate-400 mt-1 italic">Suggested name alterations to reach peak luck potential.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {prediction.personalNameSuggestions.map((item, idx) => (
                        <div key={idx} className="bg-slate-800/50 p-4 rounded-lg border border-indigo-500/20 hover:border-indigo-400/50 transition-all group break-inside-avoid">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-indigo-100">{item.name}</span>
                                <span className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">#{item.numerology}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed italic group-hover:text-slate-300 transition-colors">"{item.rationale}"</p>
                        </div>
                    ))}
                </div>
                {onRequestMoreNames && (
                  <div className="flex justify-center" data-html2canvas-ignore>
                    <button onClick={onRequestMoreNames} disabled={prediction.suggestionsLoading} className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-full text-[10px] font-bold text-indigo-300 uppercase tracking-widest transition-all disabled:opacity-50">
                      {prediction.suggestionsLoading ? <><div className="w-3 h-3 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin"></div>Consulting Aether...</> : <><PlusIcon /> Request More Suggestions</>}
                    </button>
                  </div>
                )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ScoreBar label="Year Cycle" score={prediction.scores?.year} />
            <ScoreBar label="Month Focus" score={prediction.scores?.month} />
            <ScoreBar label="Day Vibration" score={prediction.scores?.day} />
          </div>

          <div className="p-8 rounded-xl border border-amber-500/20 mb-8 bg-slate-900/40">
            <h2 className="font-display text-2xl text-center mb-6 text-amber-100 break-inside-avoid">The Seer's Scroll</h2>
            {prediction.loading ? <div className="flex flex-col items-center justify-center py-12"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div> : <div className="prose prose-invert prose-amber max-w-none text-slate-200 leading-relaxed break-inside-auto"><ReactMarkdown>{prediction.text}</ReactMarkdown></div>}
          </div>

          {prediction.turningPoints && prediction.turningPoints.length > 0 && (
                <div className="p-8 rounded-xl border border-white/10 bg-slate-900/30">
                    <div className="text-center mb-8 break-inside-avoid">
                        <HourglassIcon />
                        <h3 className="font-display text-xl text-amber-300 mt-2">Timeline of Destiny</h3>
                    </div>
                    <div className="space-y-6">
                        {prediction.turningPoints.map((p, idx) => (
                            <div key={idx} className="flex gap-4 items-center break-inside-avoid">
                                <div className="text-amber-400 font-bold w-24">Age {p.age}</div>
                                <div className="w-px h-10 bg-slate-700"></div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white">{p.type}</h4>
                                    <p className="text-xs text-slate-400">{p.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
          )}
        </div>
        <div className="mt-8 flex justify-center gap-4" data-html2canvas-ignore>
            <button onClick={onReset} className="px-6 py-2 rounded-full border border-indigo-500 text-indigo-300 uppercase text-xs tracking-widest hover:bg-indigo-500/10 transition-all">Return</button>
            <button onClick={handleDownloadPDF} disabled={isDownloading} className={`flex items-center gap-2 px-6 py-2 rounded-full bg-amber-500 text-slate-900 uppercase text-xs tracking-widest font-bold shadow-lg shadow-amber-900/50 hover:bg-amber-500 transition-all ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}><DownloadIcon /> {isDownloading ? 'Drafting...' : 'Save PDF'}</button>
        </div>
      </div>
    );
  }

  // Fallback / Other modes
  return (
    <div className="text-center py-20 bg-slate-900 rounded-xl max-w-3xl mx-auto border border-white/5">
      <h2 className="text-2xl font-display mb-4">Reading Finalized</h2>
      <p className="mb-8 text-slate-400">Analysis for {data.mode} has been prepared.</p>
      <button onClick={onReset} className="px-8 py-3 bg-indigo-600 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all">Return to Entrance</button>
    </div>
  );
};
