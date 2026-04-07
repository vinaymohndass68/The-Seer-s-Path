
import React, { useState, useCallback } from 'react';
import { UserInput, NumerologyResult, PredictionData, CalculationStep } from './types';
import { calculateNumerology } from './services/numerologyUtils';
import { generatePrediction, generatePastLifeImage, generateArtifactImage, generateMoreNameSuggestions } from './services/geminiService';
import { InputForm } from './components/InputForm';
import { ResultView } from './components/ResultView';

const App: React.FC = () => {
  const [step, setStep] = useState<CalculationStep>(CalculationStep.INPUT);
  const [numerologyData, setNumerologyData] = useState<NumerologyResult | null>(null);
  const [prediction, setPrediction] = useState<PredictionData>({
    text: '',
    loading: false,
    imageLoading: false,
    artifactsLoading: false,
    suggestionsLoading: false,
    error: null,
  });

  const handleFormSubmit = useCallback(async (input: UserInput) => {
    const result = calculateNumerology(input);
    setNumerologyData(result);
    setStep(CalculationStep.RESULT);
    setPrediction({ 
        text: '', 
        loading: true, 
        imageLoading: input.mode === 'PAST_LIFE', 
        artifactsLoading: input.mode === 'PAST_LIFE',
        suggestionsLoading: false,
        error: null 
    });
    
    try {
      const predictionResult = await generatePrediction(result);
      
      setPrediction(prev => ({ 
        ...prev,
        ...predictionResult,
        text: predictionResult.text || '', 
        loading: false, 
      }));

      // If it's a past life reading, generate the environment image and artifact images
      if (input.mode === 'PAST_LIFE') {
          const envImagePromise = generatePastLifeImage(predictionResult);
          
          let artifactImagesPromise: Promise<(string | undefined)[]> = Promise.resolve([]);
          if (predictionResult.pastLifeArtifacts) {
              artifactImagesPromise = Promise.all(
                  predictionResult.pastLifeArtifacts.map(art => generateArtifactImage(art, predictionResult))
              );
          }

          const [imageUrl, artifactImages] = await Promise.all([envImagePromise, artifactImagesPromise]);

          setPrediction(prev => ({
              ...prev,
              pastLifeImageUrl: imageUrl,
              pastLifeArtifactImages: artifactImages.filter(img => !!img) as string[],
              imageLoading: false,
              artifactsLoading: false
          }));
      }

    } catch (err) {
      setPrediction({ 
        text: '', 
        loading: false, 
        imageLoading: false,
        artifactsLoading: false,
        suggestionsLoading: false,
        error: "Failed to communicate with the Oracle. Please try again." 
      });
    }
  }, []);

  const handleRequestMoreNames = useCallback(async () => {
    if (!numerologyData) return;
    setPrediction(prev => ({ ...prev, suggestionsLoading: true }));
    
    try {
      const existingNames = prediction.personalNameSuggestions?.map(s => s.name) || [];
      const newNames = await generateMoreNameSuggestions(numerologyData, existingNames);
      
      setPrediction(prev => ({
        ...prev,
        suggestionsLoading: false,
        personalNameSuggestions: [...(prev.personalNameSuggestions || []), ...newNames]
      }));
    } catch (err) {
      setPrediction(prev => ({ ...prev, suggestionsLoading: false }));
    }
  }, [numerologyData, prediction.personalNameSuggestions]);

  const handleReset = () => {
    setStep(CalculationStep.INPUT);
    setNumerologyData(null);
    setPrediction({ text: '', loading: false, imageLoading: false, artifactsLoading: false, suggestionsLoading: false, error: null });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] selection:bg-amber-500/30">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center p-6 md:p-12">
        <header className="mb-12 text-center animate-float">
          <div className="inline-block p-4 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4 backdrop-blur-sm shadow-[0_0_30px_rgba(245,158,11,0.1)]">
             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                <path d="M2 12h20"></path>
             </svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-display text-white mb-2 tracking-tighter">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Seer's Path</span>
          </h1>
          <p className="text-indigo-200 max-w-lg mx-auto font-light text-sm uppercase tracking-[0.4em] opacity-80">
            Cheiro's Chaldean Mysteries
          </p>
        </header>

        <main className="w-full flex-grow flex flex-col items-center">
          {step === CalculationStep.INPUT && (
            <InputForm onSubmit={handleFormSubmit} isLoading={prediction.loading} />
          )}

          {step === CalculationStep.RESULT && numerologyData && (
            <ResultView 
              data={numerologyData} 
              prediction={prediction} 
              onReset={handleReset} 
              onRequestMoreNames={handleRequestMoreNames}
            />
          )}
        </main>
        
        <footer className="mt-16 text-slate-500 text-[10px] font-light uppercase tracking-widest pb-8">
          <p>© The Seer's Path — Based on Count Louis Hamon</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
