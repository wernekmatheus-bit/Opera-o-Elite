'use client';

import { Target, BookOpen, Activity, Crosshair, Award, Zap, CheckCircle2, ChevronRight, Shield, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';
import { supabase } from '../lib/supabase';
import { PWAInstallPrompt } from '../components/PWAInstallPrompt';

export default function QGPage() {
  const [showTafQuiz, setShowTafQuiz] = useState(false);
  const [showCartilha, setShowCartilha] = useState(false);
  const [gender, setGender] = useState<'M' | 'F'>('M');
  
  const { profile, isLoading, fetchProfile, updateProfile } = useUserStore();
  
  const [tafTasks, setTafTasks] = useState([
    { id: 1, title: 'Aquecimento Articular', desc: '10 minutos', completed: false },
    { id: 2, title: 'Corrida Contínua', desc: '5km - Ritmo 5:30/km', completed: false },
    { id: 3, title: 'Barra Fixa (Isometria)', desc: '3 séries de 15 segundos', completed: false },
    { id: 4, title: 'Abdominal Remador', desc: '3 séries de 30 repetições', completed: false },
  ]);

  useEffect(() => {
    const email = localStorage.getItem('pmpr_user_email');
    if (email && !profile) {
      fetchProfile(email);
    }
  }, [profile, fetchProfile]);

  useEffect(() => {
    if (profile && profile.taf_quiz_done === false) {
      setShowTafQuiz(true);
    }
  }, [profile]);

  const handleSaveTafQuiz = async () => {
    setShowTafQuiz(false);
    if (profile) {
      await updateProfile({ taf_quiz_done: true });
    }
  };

  const toggleTask = async (id: number) => {
    const updatedTasks = tafTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTafTasks(updatedTasks);

    if (profile) {
      const allCompleted = updatedTasks.every(t => t.completed);
      try {
        const today = new Date().toISOString().split('T')[0];
        await supabase
          .from('user_progress')
          .upsert({
            user_id: profile.id,
            date: today,
            physical_prep_done: allCompleted
          }, { onConflict: 'user_id,date' });
      } catch (error) {
        console.error('Erro ao salvar progresso TAF:', error);
      }
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-tactical-yellow animate-spin" />
        <p className="text-tactical-gray font-bold uppercase tracking-widest text-sm">Carregando Perfil...</p>
      </div>
    );
  }

  // Calcula o progresso para o próximo nível (cada nível = 1000 XP)
  const currentXP = profile?.xp || 0;
  const nextLevelXP = (profile?.level || 1) * 1000;
  const progressPercent = Math.min(100, Math.round((currentXP / nextLevelXP) * 100));

  return (
    <div className="space-y-8 pb-20">
      <PWAInstallPrompt />
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <Target className="w-8 h-8 text-tactical-yellow" />
            Quartel General
          </h1>
          <p className="text-tactical-gray mt-1 text-lg">Bem-vindo de volta, {profile?.full_name || 'Combatente'}. A missão continua.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-tactical-panel border border-white/5 rounded-xl px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-tactical-yellow/20 flex items-center justify-center border border-tactical-yellow/30">
            <Award className="w-5 h-5 text-tactical-yellow" />
          </div>
          <div>
            <p className="text-xs font-bold text-tactical-gray uppercase tracking-widest">Patente Atual (Nível {profile?.level || 1})</p>
            <p className="text-sm font-black text-white">{profile?.rank || 'Recruta'}</p>
          </div>
        </div>
      </header>
      
      {/* Progress Bar */}
      <div className="bg-tactical-panel p-6 rounded-2xl border border-white/5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-tactical-yellow/5 blur-[50px] rounded-full pointer-events-none" />
        
        <div className="flex justify-between items-end mb-3 relative z-10">
          <div>
            <p className="text-xs font-bold text-tactical-gray uppercase tracking-widest">Progresso para Promoção</p>
            <p className="text-2xl font-black text-white">{progressPercent}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-tactical-gray uppercase tracking-widest">XP Atual</p>
            <p className="text-sm font-black text-tactical-yellow">{currentXP} / {nextLevelXP} XP</p>
          </div>
        </div>
        <div className="h-3 bg-tactical-bg rounded-full overflow-hidden border border-white/5 relative z-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-full bg-gradient-to-r from-tactical-yellow/50 to-tactical-yellow relative"
          />
        </div>
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/academia" className="group relative bg-tactical-panel border border-white/5 hover:border-tactical-yellow/50 rounded-2xl p-6 transition-all overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-tactical-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-tactical-yellow/20 transition-colors">
                <BookOpen className="w-6 h-6 text-tactical-gray group-hover:text-tactical-yellow transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-tactical-yellow transition-colors">Iniciar Estudos</h3>
                <p className="text-sm text-tactical-gray">Direito Penal Militar - Módulo 01</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-tactical-gray group-hover:text-tactical-yellow transition-colors group-hover:translate-x-1" />
          </div>
        </Link>

        <Link href="/estande" className="group relative bg-tactical-panel border border-white/5 hover:border-tactical-yellow/50 rounded-2xl p-6 transition-all overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-tactical-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-tactical-yellow/20 transition-colors">
                <Crosshair className="w-6 h-6 text-tactical-gray group-hover:text-tactical-yellow transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-tactical-yellow transition-colors">Estande de Tiro</h3>
                <p className="text-sm text-tactical-gray">Meta diária: 15 questões</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-tactical-gray group-hover:text-tactical-yellow transition-colors group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* TAF Section */}
      <div className="bg-tactical-panel border border-white/5 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-green-500" />
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Preparação TAF</h2>
              <p className="text-tactical-gray text-sm">Condicionamento Físico Diário</p>
            </div>
          </div>
          <button 
            onClick={() => setShowTafQuiz(true)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border border-white/10"
          >
            Refazer Quiz TAF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-tactical-bg border border-white/5 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg uppercase tracking-tight text-white">Treino de Hoje (Dia 1)</h3>
                <span className="px-3 py-1 bg-green-500/20 text-green-500 text-xs font-bold uppercase tracking-widest rounded-full">Foco: Resistência</span>
              </div>
              
              <ul className="space-y-3">
                {tafTasks.map((task) => (
                  <li 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-colors ${
                      task.completed 
                        ? 'bg-tactical-yellow/10 border-tactical-yellow/30' 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      task.completed ? 'bg-tactical-yellow/20' : 'border-2 border-tactical-gray/30'
                    }`}>
                      {task.completed && <CheckCircle2 className="w-5 h-5 text-tactical-yellow" />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${task.completed ? 'text-white line-through opacity-70' : 'text-white'}`}>
                        {task.title}
                      </p>
                      <p className={`text-xs ${task.completed ? 'text-tactical-gray line-through opacity-70' : 'text-tactical-gray'}`}>
                        {task.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-tactical-bg border border-white/5 rounded-xl p-5 flex flex-col justify-center items-center text-center">
            <Shield className="w-12 h-12 text-tactical-gray mb-4 opacity-50" />
            <h3 className="font-bold text-lg uppercase tracking-tight text-white mb-2">Cartilha de Treinos</h3>
            <p className="text-xs text-tactical-gray mb-6">Acesse o manual completo de execução dos exercícios do edital.</p>
            <button 
              onClick={() => setShowCartilha(true)}
              className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors border border-white/10"
            >
              Abrir Cartilha
            </button>
          </div>
        </div>
      </div>

      {/* TAF Quiz Modal */}
      {showTafQuiz && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-tactical-panel border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Avaliação Física</h2>
            <p className="text-tactical-gray text-sm mb-6">Ajuste seu nível atual para recalcularmos sua planilha de treinos.</p>
            
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-xs font-bold text-tactical-gray uppercase tracking-widest mb-2">Gênero (Tabela do Edital)</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setGender('M')}
                    className={`flex-1 py-2 rounded-lg border text-sm font-bold uppercase tracking-widest transition-colors ${gender === 'M' ? 'bg-tactical-yellow/20 border-tactical-yellow text-tactical-yellow' : 'bg-tactical-bg border-white/10 text-tactical-gray'}`}
                  >
                    Masculino
                  </button>
                  <button 
                    onClick={() => setGender('F')}
                    className={`flex-1 py-2 rounded-lg border text-sm font-bold uppercase tracking-widest transition-colors ${gender === 'F' ? 'bg-tactical-yellow/20 border-tactical-yellow text-tactical-yellow' : 'bg-tactical-bg border-white/10 text-tactical-gray'}`}
                  >
                    Feminino
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-tactical-gray uppercase tracking-widest mb-2">
                  {gender === 'M' ? 'Barra Fixa (Repetições)' : 'Barra Fixa (Isometria em Segundos)'}
                </label>
                <select className="w-full bg-tactical-bg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-tactical-yellow">
                  {gender === 'M' ? (
                    <>
                      <option>Nenhuma (0)</option>
                      <option>1 a 2 barras</option>
                      <option>3 a 5 barras (Mínimo)</option>
                      <option>Mais de 6 barras</option>
                    </>
                  ) : (
                    <>
                      <option>Menos de 5 segundos</option>
                      <option>5 a 9 segundos</option>
                      <option>10 a 15 segundos (Mínimo)</option>
                      <option>Mais de 15 segundos</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-tactical-gray uppercase tracking-widest mb-2">Abdominal Remador (1 minuto)</label>
                <select className="w-full bg-tactical-bg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-tactical-yellow">
                  <option>Menos de 20 repetições</option>
                  <option>20 a 30 repetições</option>
                  <option>30 a 40 repetições</option>
                  <option>Mais de 40 repetições</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-tactical-gray uppercase tracking-widest mb-2">Tiro de 50m (Velocidade)</label>
                <select className="w-full bg-tactical-bg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-tactical-yellow">
                  <option>Mais de 10 segundos</option>
                  <option>Entre 8 e 10 segundos</option>
                  <option>Entre 7 e 8 segundos</option>
                  <option>Menos de 7 segundos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-tactical-gray uppercase tracking-widest mb-2">Corrida 2.400m (Resistência)</label>
                <select className="w-full bg-tactical-bg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-tactical-yellow">
                  <option>Não consigo correr 2.400m</option>
                  <option>Mais de 15 minutos</option>
                  <option>Entre 12 e 15 minutos</option>
                  <option>Menos de 12 minutos</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowTafQuiz(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold uppercase tracking-widest transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveTafQuiz}
                className="flex-1 py-3 bg-tactical-yellow text-tactical-bg hover:bg-tactical-yellow/90 rounded-xl font-bold uppercase tracking-widest transition-colors"
              >
                Salvar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cartilha Modal */}
      {showCartilha && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-tactical-panel border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Cartilha de Execução</h2>
                <p className="text-tactical-gray text-sm">Padrão exigido pela banca examinadora.</p>
              </div>
              <button onClick={() => setShowCartilha(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
                <Shield className="w-5 h-5 text-tactical-gray" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-tactical-bg border border-white/5 rounded-xl p-5">
                <h3 className="font-bold text-lg text-white mb-2">1. Barra Fixa (Masculino)</h3>
                <p className="text-sm text-tactical-gray mb-4">Pegada em pronação (dorso da mão voltado para o candidato). O queixo deve ultrapassar a barra na subida, e os braços devem estender totalmente na descida. Não é permitido pedalar ou usar impulso do corpo.</p>
                <div className="aspect-video bg-tactical-panel rounded-lg flex items-center justify-center border border-white/10 overflow-hidden relative">
                  {/* SVG Mockup: Barra Fixa */}
                  <svg viewBox="0 0 200 100" className="w-full h-full opacity-80">
                    <line x1="40" y1="20" x2="160" y2="20" stroke="#39FF14" strokeWidth="4" strokeLinecap="round" />
                    {/* Figure */}
                    <circle cx="100" cy="35" r="10" fill="none" stroke="white" strokeWidth="3" />
                    <line x1="100" y1="45" x2="100" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    {/* Arms */}
                    <path d="M 70 20 L 85 40 L 100 45" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 130 20 L 115 40 L 100 45" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Legs */}
                    <line x1="100" y1="75" x2="90" y2="95" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    <line x1="100" y1="75" x2="110" y2="95" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-[10px] font-bold text-tactical-yellow uppercase">
                    Posição Correta
                  </div>
                </div>
              </div>
              
              <div className="bg-tactical-bg border border-white/5 rounded-xl p-5">
                <h3 className="font-bold text-lg text-white mb-2">2. Abdominal Remador</h3>
                <p className="text-sm text-tactical-gray mb-4">Posição inicial deitado, braços estendidos atrás da cabeça. Na flexão, o candidato deve sentar, flexionar os joelhos e abraçar as pernas, passando os cotovelos da linha dos joelhos.</p>
                <div className="aspect-video bg-tactical-panel rounded-lg flex items-center justify-center border border-white/10 overflow-hidden relative">
                  {/* SVG Mockup: Abdominal */}
                  <svg viewBox="0 0 200 100" className="w-full h-full opacity-80">
                    <line x1="20" y1="80" x2="180" y2="80" stroke="#39FF14" strokeWidth="2" strokeDasharray="4 4" />
                    {/* Figure Sitting */}
                    <circle cx="80" cy="40" r="10" fill="none" stroke="white" strokeWidth="3" />
                    <path d="M 80 50 Q 70 65 80 80" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    {/* Legs bent */}
                    <path d="M 80 80 L 110 50 L 130 80" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Arms reaching forward */}
                    <path d="M 75 55 L 115 55" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-[10px] font-bold text-tactical-yellow uppercase">
                    Fase de Contração
                  </div>
                </div>
              </div>

              <div className="bg-tactical-bg border border-white/5 rounded-xl p-5">
                <h3 className="font-bold text-lg text-white mb-2">3. Corrida 2.400m</h3>
                <p className="text-sm text-tactical-gray mb-4">Pista de atletismo aferida. O candidato deve percorrer a distância no menor tempo possível. É permitido andar, mas não parar ou sair da pista.</p>
                <div className="aspect-video bg-tactical-panel rounded-lg flex items-center justify-center border border-white/10 overflow-hidden relative">
                  {/* SVG Mockup: Corrida */}
                  <svg viewBox="0 0 200 100" className="w-full h-full opacity-80">
                    <path d="M 0 80 Q 100 70 200 90" fill="none" stroke="#39FF14" strokeWidth="2" strokeDasharray="4 4" />
                    {/* Figure Running */}
                    <circle cx="100" cy="30" r="10" fill="none" stroke="white" strokeWidth="3" />
                    <line x1="100" y1="40" x2="110" y2="65" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    {/* Arms */}
                    <path d="M 105 45 L 85 55 L 95 40" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 105 45 L 125 50 L 115 35" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Legs */}
                    <path d="M 110 65 L 90 70 L 80 85" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 110 65 L 130 80 L 120 95" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-[10px] font-bold text-tactical-yellow uppercase">
                    Postura
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowCartilha(false)}
              className="w-full mt-6 py-4 bg-tactical-yellow text-tactical-bg hover:bg-tactical-yellow/90 rounded-xl font-bold uppercase tracking-widest transition-colors"
            >
              Entendido, Voltar ao QG
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
