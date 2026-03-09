'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Share, PlusSquare, Smartphone } from 'lucide-react';

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // Check if already dismissed or installed
    const isDismissed = localStorage.getItem('pwa_prompt_dismissed');
    
    // Check if running as standalone (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true;

    if (isDismissed || isStandalone) {
      return;
    }

    // Detect device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIOS) {
      setDeviceType('ios');
      // Delay prompt slightly so it doesn't interrupt immediate login flow
      setTimeout(() => setShowPrompt(true), 3000);
    } else if (isAndroid) {
      setDeviceType('android');
      setTimeout(() => setShowPrompt(true), 3000);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('pwa_prompt_dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-tactical-panel border border-tactical-yellow/30 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[100] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-tactical-yellow/5 to-transparent pointer-events-none" />
        
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 text-tactical-gray hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-tactical-bg border border-tactical-yellow/20 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6 text-tactical-yellow" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-1">
              Instale o Aplicativo
            </h3>
            <p className="text-xs text-gray-300 mb-4 leading-relaxed">
              Tenha acesso rápido ao seu Quartel General direto da tela inicial do seu celular.
            </p>

            {deviceType === 'ios' && (
              <div className="bg-tactical-bg/50 rounded-lg p-3 border border-white/5 text-xs text-gray-300 space-y-2">
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-white shrink-0">1</span>
                  Toque em <Share className="w-4 h-4 inline mx-1 text-blue-400" /> Compartilhar
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-white shrink-0">2</span>
                  Selecione <PlusSquare className="w-4 h-4 inline mx-1 text-white" /> Adicionar à Tela de Início
                </p>
              </div>
            )}

            {deviceType === 'android' && (
              <div className="bg-tactical-bg/50 rounded-lg p-3 border border-white/5 text-xs text-gray-300 space-y-2">
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-white shrink-0">1</span>
                  Toque no menu <span className="font-bold text-white tracking-widest">⋮</span> do navegador
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-white shrink-0">2</span>
                  Selecione <Download className="w-4 h-4 inline mx-1 text-white" /> Instalar Aplicativo
                </p>
              </div>
            )}

            <button 
              onClick={handleDismiss}
              className="w-full mt-4 py-2 bg-tactical-yellow/10 text-tactical-yellow border border-tactical-yellow/20 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-tactical-yellow hover:text-tactical-bg transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
