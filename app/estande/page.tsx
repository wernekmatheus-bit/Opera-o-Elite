'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crosshair, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Target, ShieldAlert } from 'lucide-react';

// --- MOCK DATA ---
const QUESTION = {
  id: 'q1',
  banca: 'VUNESP',
  disciplina: 'Direito Penal Militar',
  assunto: 'Crimes contra a Autoridade',
  enunciado: 'Segundo o Código Penal Militar (CPM), a diferença essencial entre os crimes de motim e revolta reside no fato de que:',
  options: [
    { id: 'A', text: 'O motim é praticado exclusivamente por oficiais, e a revolta por praças.' },
    { id: 'B', text: 'A revolta exige que os agentes estejam armados, enquanto o motim ocorre com agentes desarmados.' },
    { id: 'C', text: 'O motim ocorre apenas em tempo de guerra, e a revolta em tempo de paz.' },
    { id: 'D', text: 'A revolta dispensa a pluralidade de agentes, podendo ser cometida por um único militar.' },
    { id: 'E', text: 'Não há diferença prática, sendo ambos sinônimos no texto legal do CPM.' }
  ],
  correctOption: 'B',
  justificativa: 'Exato! Conforme o Art. 149, parágrafo único do CPM, a revolta é uma qualificadora do motim, caracterizada quando os agentes estão armados. A pluralidade de agentes (concurso de pessoas) é exigida em ambos os casos.'
};

export default function EstandePage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleFire = () => {
    if (!selectedOption) return;
    setHasAnswered(true);
  };

  const handleNext = () => {
    // Reset state for next question (mock behavior)
    setSelectedOption(null);
    setHasAnswered(false);
  };

  const isCorrect = selectedOption === QUESTION.correctOption;

  return (
    <div className="min-h-screen pb-24 max-w-3xl mx-auto flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-tactical-bg/90 backdrop-blur-md pt-4 pb-4 border-b border-white/5 px-4 md:px-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
              <Crosshair className="w-6 h-6 text-tactical-yellow" />
              Estande de Tiro
            </h1>
            <p className="text-tactical-gray text-sm">Resolução Tática de Questões</p>
          </div>
          <div className="bg-tactical-panel px-3 py-1 rounded-md border border-white/10 text-xs font-bold uppercase tracking-wider text-tactical-gray">
            Questão 1/15
          </div>
        </div>
      </header>

      {/* Question Engine */}
      <main className="flex-1 px-4 md:px-0 py-8 flex flex-col">
        
        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="bg-white/10 text-white px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider">
            {QUESTION.banca}
          </span>
          <span className="bg-tactical-panel border border-white/10 text-tactical-gray px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider">
            {QUESTION.disciplina}
          </span>
          <span className="bg-tactical-panel border border-white/10 text-tactical-gray px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider">
            {QUESTION.assunto}
          </span>
        </div>

        {/* Enunciado */}
        <div className="mb-8">
          <p className="text-lg md:text-xl text-white leading-relaxed font-medium">
            {QUESTION.enunciado}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {QUESTION.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const isCorrectOption = option.id === QUESTION.correctOption;
            
            // Determine styles based on state
            let optionStyles = "bg-tactical-panel border-white/10 hover:border-white/30 text-white"; // Default
            let letterStyles = "bg-tactical-bg text-tactical-gray border-white/10";
            
            if (!hasAnswered) {
              if (isSelected) {
                optionStyles = "bg-tactical-yellow/10 border-tactical-yellow text-white";
                letterStyles = "bg-tactical-yellow text-tactical-bg border-tactical-yellow";
              }
            } else {
              // Answered State
              if (isCorrectOption) {
                // Always highlight correct option in green
                optionStyles = "bg-tactical-yellow/20 border-tactical-yellow text-white";
                letterStyles = "bg-tactical-yellow text-tactical-bg border-tactical-yellow";
              } else if (isSelected && !isCorrectOption) {
                // Highlight wrong selected option in red
                optionStyles = "bg-tactical-red/20 border-tactical-red text-white";
                letterStyles = "bg-tactical-red text-white border-tactical-red";
              } else {
                // Dim other options
                optionStyles = "bg-tactical-panel border-white/5 text-tactical-gray opacity-50";
                letterStyles = "bg-tactical-bg text-tactical-gray/50 border-white/5";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => !hasAnswered && setSelectedOption(option.id)}
                disabled={hasAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${optionStyles}`}
              >
                <div className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-sm transition-colors mt-0.5 ${letterStyles}`}>
                  {option.id}
                </div>
                <div className="flex-1 pt-1 leading-relaxed">
                  {option.text}
                </div>
                
                {/* Icons for Answered State */}
                {hasAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-6 h-6 text-tactical-yellow shrink-0 mt-1" />
                )}
                {hasAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="w-6 h-6 text-tactical-red shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Justification Block (Shows only after answering) */}
        <AnimatePresence>
          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className={`p-6 rounded-xl border ${isCorrect ? 'bg-tactical-yellow/5 border-tactical-yellow/20' : 'bg-tactical-red/5 border-tactical-red/20'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert className={`w-5 h-5 ${isCorrect ? 'text-tactical-yellow' : 'text-tactical-red'}`} />
                  <h3 className={`font-bold uppercase tracking-wider ${isCorrect ? 'text-tactical-yellow' : 'text-tactical-red'}`}>
                    Justificativa da Banca
                  </h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {QUESTION.justificativa}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <div className="mt-auto pt-4">
          {!hasAnswered ? (
            <button
              onClick={handleFire}
              disabled={!selectedOption}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${
                selectedOption 
                  ? 'bg-tactical-yellow text-tactical-bg hover:bg-tactical-yellow/90 shadow-[0_0_20px_rgba(255,204,0,0.3)]' 
                  : 'bg-tactical-panel text-tactical-gray border border-white/10 cursor-not-allowed'
              }`}
            >
              <Target className="w-5 h-5" />
              Atirar / Responder
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 bg-white text-tactical-bg py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
            >
              Próximo Alvo
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

      </main>
    </div>
  );
}
