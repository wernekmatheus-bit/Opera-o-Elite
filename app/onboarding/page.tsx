'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Shield, Brain, Activity, Dumbbell, Zap, Clock, Hourglass, Calendar, CheckCircle2, Loader2 } from 'lucide-react';

type OnboardingData = {
  meta: string;
  preparo: string;
  tempo: string;
};

const steps = [
  {
    id: 'meta',
    title: 'Qual sua meta principal?',
    subtitle: 'Defina seu objetivo na corporação para ajustarmos sua rota.',
    options: [
      { id: 'pm-rua', label: 'PM-Rua', description: 'Patrulhamento Ostensivo e Rádio Patrulha', icon: Shield },
      { id: 'bope', label: 'Operações Especiais', description: 'BOPE, CHOQUE e Missões de Alto Risco', icon: Target },
      { id: 'inteligencia', label: 'Inteligência', description: 'Investigação, Estratégia e P2', icon: Brain },
    ],
  },
  {
    id: 'preparo',
    title: 'Como está seu preparo físico?',
    subtitle: 'Seja honesto. O TAF (Teste de Aptidão Física) reprova 40% dos candidatos.',
    options: [
      { id: 'sedentario', label: 'Sedentário', description: 'Preciso começar do zero', icon: Activity },
      { id: 'ocasional', label: 'Treino Ocasional', description: 'Faço atividades às vezes', icon: Dumbbell },
      { id: 'preparado', label: 'Preparado', description: 'Treino regularmente', icon: Zap },
    ],
  },
  {
    id: 'tempo',
    title: 'Quanto tempo livre você tem por dia?',
    subtitle: 'Vamos otimizar seu cronograma de estudos e treinos.',
    options: [
      { id: 'menos-2h', label: 'Menos de 2h', description: 'Rotina apertada, foco no essencial', icon: Hourglass },
      { id: '2-4h', label: '2 a 4h', description: 'Tempo moderado para teoria e questões', icon: Clock },
      { id: 'mais-4h', label: 'Mais de 4h', description: 'Dedicação exclusiva ao concurso', icon: Calendar },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    meta: '',
    preparo: '',
    tempo: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleSelect = (stepId: keyof OnboardingData, optionId: string) => {
    setData((prev) => ({ ...prev, [stepId]: optionId }));
    
    // Auto-advance after a short delay for better UX
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        finishOnboarding();
      }
    }, 400);
  };

  const finishOnboarding = () => {
    setIsGenerating(true);
    
    // Simulate API call and route generation
    setTimeout(() => {
      // Here you would typically save `data` to your backend (Supabase)
      console.log('Onboarding data saved:', data);
      localStorage.setItem('pmpr_onboarding_completed', 'true');
      setIsReady(true);
    }, 3000);
  };

  const handleCheckout = () => {
    const checkoutUrl = process.env.NEXT_PUBLIC_KIRVANO_CHECKOUT_URL || 'https://pay.kirvano.com/cffb487b-a78a-453c-8bfe-6e71e2e17f4b';
    if (checkoutUrl) {
      // Open in new tab to avoid iframe restrictions
      window.open(checkoutUrl, '_blank');
      // Redirect the current window to login page
      router.push('/login');
    } else {
      router.push('/login');
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-tactical-bg flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-24 h-24 mb-8">
            <motion.div 
              className="absolute inset-0 border-4 border-tactical-panel rounded-full"
            />
            {!isReady && (
              <motion.div 
                className="absolute inset-0 border-4 border-tactical-yellow rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              {isReady ? (
                <CheckCircle2 className="w-10 h-10 text-tactical-yellow" />
              ) : (
                <Target className="w-8 h-8 text-tactical-yellow" />
              )}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">
            {isReady ? 'Rota Tática Concluída!' : 'Criando sua Rota Tática...'}
          </h2>
          <p className="text-tactical-gray max-w-xs mb-8">
            {isReady 
              ? 'Seu cronograma personalizado está pronto. Finalize a matrícula para acessar.'
              : 'Analisando seu perfil e estruturando seu cronograma de estudos e treinos físicos.'}
          </p>
          
          {!isReady ? (
            <div className="space-y-3 w-full max-w-xs text-left">
              <LoadingStep text="Calibrando simulados..." delay={0.5} />
              <LoadingStep text="Montando treinos do TAF..." delay={1.2} />
              <LoadingStep text="Ajustando metas diárias..." delay={2.0} />
            </div>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleCheckout}
              className="w-full max-w-xs bg-tactical-yellow text-tactical-bg py-4 rounded-xl font-black uppercase tracking-widest hover:bg-tactical-yellow/90 transition-colors shadow-[0_0_30px_rgba(255,204,0,0.3)]"
            >
              Finalizar Matrícula
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-tactical-bg flex flex-col px-4 py-8 md:py-12 max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="w-full mb-12">
        <div className="flex justify-between mb-2">
          <span className="text-xs font-bold text-tactical-gray uppercase tracking-wider">
            Fase {currentStep + 1} de {steps.length}
          </span>
          <span className="text-xs font-bold text-tactical-yellow uppercase tracking-wider">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-tactical-panel rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-tactical-yellow"
            initial={{ width: `${(currentStep / steps.length) * 100}%` }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-3">
              {step.title}
            </h1>
            <p className="text-tactical-gray text-lg mb-10">
              {step.subtitle}
            </p>

            <div className="space-y-4">
              {step.options.map((option) => {
                const Icon = option.icon;
                const isSelected = data[step.id as keyof OnboardingData] === option.id;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(step.id as keyof OnboardingData, option.id)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center gap-5 group ${
                      isSelected 
                        ? 'bg-tactical-yellow/10 border-tactical-yellow' 
                        : 'bg-tactical-panel border-white/5 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className={`p-3 rounded-lg transition-colors ${
                      isSelected ? 'bg-tactical-yellow text-tactical-bg' : 'bg-white/5 text-tactical-gray group-hover:text-white'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-tactical-yellow' : 'text-white'}`}>
                        {option.label}
                      </h3>
                      <p className={`text-sm ${isSelected ? 'text-tactical-yellow/80' : 'text-tactical-gray'}`}>
                        {option.description}
                      </p>
                    </div>
                    
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-tactical-yellow bg-tactical-yellow' : 'border-tactical-gray/30'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-tactical-bg" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Back Button (only show if not on first step) */}
      <div className="mt-8 h-12">
        {currentStep > 0 && (
          <button 
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="text-tactical-gray hover:text-white text-sm font-medium uppercase tracking-wider transition-colors px-4 py-2"
          >
            ← Voltar
          </button>
        )}
      </div>
    </div>
  );
}

function LoadingStep({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3 text-sm font-medium text-tactical-gray"
    >
      <Loader2 className="w-4 h-4 animate-spin text-tactical-yellow" />
      {text}
    </motion.div>
  );
}
