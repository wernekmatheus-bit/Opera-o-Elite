'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Star, CheckCircle2, Circle, Trophy, X, BookOpen, Activity, Droplets, Target, Calendar, Users, Shield, FileText, Crosshair, ShieldAlert, HeartPulse, Swords, Brain, Map } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUserStore } from '../store/useUserStore';

// --- MOCK DATA ---
const BIOMES_INFO = {
  preparacao: { 
    title: 'Mundo 1', subtitle: 'O Edital', 
    border: 'border-blue-500', text: 'text-blue-500', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]', bg: 'from-blue-900/20 to-transparent',
    nodeCompleted: 'bg-blue-900 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
    image: 'https://picsum.photos/seed/study/800/1200'
  },
  academia: { 
    title: 'Mundo 2', subtitle: 'Academia', 
    border: 'border-green-500', text: 'text-green-500', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]', bg: 'from-green-900/20 to-transparent',
    nodeCompleted: 'bg-green-900 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]',
    image: 'https://picsum.photos/seed/training/800/1200'
  },
  patrulha: { 
    title: 'Mundo 3', subtitle: 'Rádio Patrulha', 
    border: 'border-yellow-500', text: 'text-yellow-500', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]', bg: 'from-yellow-900/20 to-transparent',
    nodeCompleted: 'bg-yellow-900 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]',
    image: 'https://picsum.photos/seed/policecar/800/1200'
  },
  bope: { 
    title: 'Mundo 4', subtitle: 'Operações Especiais', 
    border: 'border-red-500', text: 'text-red-500', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]', bg: 'from-red-900/20 to-transparent',
    nodeCompleted: 'bg-red-900 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]',
    image: 'https://picsum.photos/seed/swat/800/1200'
  },
};

type JourneyNode = {
  id: string;
  day: number;
  title: string;
  type: string;
  status: 'completed' | 'current' | 'locked';
  biome: string;
  icon: React.ElementType;
};

const DAILY_TASKS = [
  { id: 't1', type: 'in-app', title: 'Direito Penal Militar', description: 'Ler Módulo 1: Crimes contra a autoridade', icon: BookOpen, completed: false },
  { id: 't2', type: 'in-app', title: 'Estande de Tiro', description: 'Resolver 15 questões da banca VUNESP', icon: Target, completed: false },
  { id: 't3', type: 'out-app', title: 'TAF: Corrida', description: 'Correr 2.400m em menos de 12 minutos', icon: Activity, completed: false },
  { id: 't4', type: 'out-app', title: 'Hidratação Tática', description: 'Beber 3 litros de água ao longo do dia', icon: Droplets, completed: false },
];

export default function OperacaoPage() {
  const { profile, updateProfile } = useUserStore();
  const [examDate, setExamDate] = useState('2026-06-06');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (profile) {
      if (!profile.exam_date) {
        setShowDatePicker(true);
      } else {
        setExamDate(profile.exam_date);
      }
    }
  }, [profile]);

  const handleSaveExamDate = async () => {
    setShowDatePicker(false);
    if (profile) {
      await updateProfile({ exam_date: examDate });
    }
  };

  const currentDay = useMemo(() => {
    if (!profile) return 1;
    const start = new Date(profile.created_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [profile]);

  const startDate = profile?.created_at || new Date().toISOString();

  const journeyNodes = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(examDate);
    let diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    if (diffDays < 10) diffDays = 10;
    
    const biomeSize = Math.ceil(diffDays / 4);
    
    return Array.from({ length: diffDays }).map((_, i) => {
      const day = i + 1;
      let biome = 'preparacao';
      let iconList = [FileText, BookOpen, Target];
      
      if (day > biomeSize) { biome = 'academia'; iconList = [Activity, ShieldAlert, Crosshair]; }
      if (day > biomeSize * 2) { biome = 'patrulha'; iconList = [Users, Map, HeartPulse]; }
      if (day > biomeSize * 3) { biome = 'bope'; iconList = [Swords, Brain, Trophy]; }
      
      let status: 'completed' | 'current' | 'locked' = 'locked';
      if (day < currentDay) status = 'completed';
      if (day === currentDay) status = 'current';
      
      const isBoss = day === diffDays;
      const icon = isBoss ? Trophy : iconList[i % iconList.length];
      
      return {
        id: `node-${day}`,
        day,
        title: isBoss ? 'A Prova Final' : `Missão ${day}`,
        type: isBoss ? 'boss' : 'normal',
        status,
        biome,
        icon,
      } as JourneyNode;
    });
  }, [startDate, examDate, currentDay]);

  const [selectedNode, setSelectedNode] = useState<JourneyNode | null>(null);
  const [tasks, setTasks] = useState(DAILY_TASKS);
  const [showReward, setShowReward] = useState(false);

  // Calculate curve position for the path
  const getOffsetPercent = (index: number) => {
    return Math.sin(index * 0.8) * 25;
  };

  const handleTaskToggle = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const allCompleted = tasks.every(t => t.completed);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFCC00', '#FFD700', '#FFFFFF']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFCC00', '#FFD700', '#FFFFFF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  useEffect(() => {
    if (allCompleted && selectedNode && !showReward) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowReward(true);
      triggerConfetti();
    }
  }, [allCompleted, selectedNode, showReward]);

  const closeBottomSheet = () => {
    setSelectedNode(null);
    setShowReward(false);
    // Reset tasks for demo purposes
    setTasks(DAILY_TASKS.map(t => ({ ...t, completed: false })));
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-x-hidden">
      <header className="sticky top-0 z-10 bg-tactical-bg/90 backdrop-blur-md pt-4 pb-4 border-b border-white/5">
        <div className="flex flex-col gap-4 px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tight">Operação</h1>
              <p className="text-tactical-gray text-sm">Jornada de Formação</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 bg-tactical-panel px-3 py-1.5 rounded-full border border-white/10">
                <Star className="w-4 h-4 text-tactical-gold fill-tactical-gold" />
                <span className="font-bold text-sm">1.250 XP</span>
              </div>
              <div 
                onClick={() => setShowDatePicker(true)}
                className="flex items-center gap-2 text-xs font-bold text-tactical-gray uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
              >
                <Calendar className="w-3 h-3 text-tactical-yellow" />
                <span>Prova: {new Date(examDate).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
          
          {/* Global Progress vs Others */}
          <div className="bg-tactical-panel border border-white/5 rounded-xl p-3">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-tactical-yellow" />
                <span className="text-xs font-bold text-tactical-gray uppercase tracking-widest">Você vs Concorrentes</span>
              </div>
              <span className="text-sm font-black text-tactical-yellow">Top 5%</span>
            </div>
            <div className="h-2 bg-tactical-bg rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '95%' }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-tactical-yellow/50 to-tactical-yellow"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <div className="relative w-full max-w-2xl mx-auto mt-12 mb-24" style={{ height: `${journeyNodes.length * 160 + 100}px` }}>
        {/* Global SVG Path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0">
          <path 
            d={`M ${50 + getOffsetPercent(0)}% 100 ${journeyNodes.map((_, i) => {
              if (i === 0) return '';
              return 'L ' + (50 + getOffsetPercent(i)) + '% ' + (i * 160 + 100);
            }).join(' ')}`}
            stroke="white" strokeWidth="4" strokeDasharray="8 8" fill="none"
          />
        </svg>

        {/* Render Nodes and Biome Headers */}
        {journeyNodes.map((node, i) => {
          const isFirstInBiome = i === 0 || journeyNodes[i - 1].biome !== node.biome;
          const info = BIOMES_INFO[node.biome as keyof typeof BIOMES_INFO];
          
          const isCompleted = node.status === 'completed';
          const isCurrent = node.status === 'current';
          const isLocked = node.status === 'locked';
          const isBoss = node.type === 'boss';

          let nodeClasses = "flex items-center justify-center border-4 transition-all duration-300 relative ";
          
          if (isBoss) {
            nodeClasses += "w-20 h-20 rounded-xl rotate-45 ";
          } else {
            nodeClasses += "w-16 h-16 rounded-full ";
          }

          if (isCompleted) nodeClasses += info.nodeCompleted;
          else if (isCurrent) nodeClasses += `bg-tactical-panel border-tactical-yellow shadow-[0_0_25px_rgba(255,204,0,0.6)] scale-110 animate-pulse`;
          else nodeClasses += "bg-tactical-bg border-tactical-gray/30 opacity-60 grayscale";

          const Icon = node.icon;

          return (
            <React.Fragment key={node.id}>
              {isFirstInBiome && (
                <div 
                  className="absolute w-full flex justify-center z-0 pointer-events-none"
                  style={{ top: `${i * 160 + 10}px` }}
                >
                  {/* Biome Background Glow */}
                  <div className={`absolute top-0 w-[200%] h-[600px] bg-gradient-to-b ${info.bg} blur-3xl -z-10`} />
                  
                  {/* Biome Header */}
                  <div className={`bg-tactical-panel border-2 ${info.border} px-8 py-2 rounded-2xl ${info.glow} flex flex-col items-center pointer-events-auto`}>
                    <h2 className="text-xl font-black uppercase tracking-widest text-white">{info.title}</h2>
                    <p className={`${info.text} text-xs font-bold uppercase tracking-widest`}>{info.subtitle}</p>
                  </div>
                </div>
              )}

              {/* Node */}
              <div 
                className="absolute flex flex-col items-center cursor-pointer group z-10"
                style={{ 
                  top: `${i * 160 + 100}px`, 
                  left: `${50 + getOffsetPercent(i)}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedNode(node)}
              >
                <div className={nodeClasses}>
                  <div className={isBoss ? "-rotate-45" : ""}>
                    <Icon className={`w-8 h-8 ${isCompleted ? 'text-white' : isCurrent ? 'text-tactical-yellow' : 'text-tactical-gray'}`} />
                  </div>
                  
                  {/* Completion Star */}
                  {isCompleted && (
                    <div className="absolute -bottom-2 -right-2 bg-tactical-bg rounded-full p-1 border border-white/20">
                      <Star className="w-4 h-4 text-tactical-yellow fill-tactical-yellow" />
                    </div>
                  )}
                  {isLocked && (
                    <div className="absolute -bottom-2 -right-2 bg-tactical-bg rounded-full p-1 border border-white/20">
                      <Lock className="w-4 h-4 text-tactical-gray" />
                    </div>
                  )}
                </div>

                {/* Node Label */}
                <div className="absolute top-full mt-3 w-48 text-center pointer-events-none">
                  <p className={`text-xs font-bold uppercase tracking-widest ${isCurrent ? 'text-tactical-yellow' : 'text-white'}`}>
                    {node.title}
                  </p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Bottom Sheet Modal for Daily Checklist */}
      <AnimatePresence>
        {selectedNode && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeBottomSheet}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-tactical-panel rounded-t-3xl border-t border-white/10 z-50 max-h-[85vh] flex flex-col"
            >
              {/* Drag Handle */}
              <div className="w-full flex justify-center pt-3 pb-2" onClick={closeBottomSheet}>
                <div className="w-12 h-1.5 bg-white/20 rounded-full" />
              </div>

              <div className="px-6 pb-6 overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tight">Missão Diária</h2>
                    <p className="text-tactical-gray">Dia {selectedNode.day} • {selectedNode.biome.toUpperCase()}</p>
                  </div>
                  <button onClick={closeBottomSheet} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
                    <X className="w-5 h-5 text-tactical-gray" />
                  </button>
                </div>

                {/* Reward Animation State */}
                {showReward ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-12 flex flex-col items-center text-center"
                  >
                    <div className="w-24 h-24 bg-tactical-gold/20 rounded-full flex items-center justify-center mb-6 relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-dashed border-tactical-gold rounded-full"
                      />
                      <Trophy className="w-12 h-12 text-tactical-gold" />
                    </div>
                    <h3 className="text-2xl font-bold text-tactical-yellow uppercase mb-2">Missão Cumprida!</h3>
                    <p className="text-tactical-gray mb-6">Você completou todas as tarefas do Dia {selectedNode.day}.</p>
                    <div className="bg-white/5 px-6 py-3 rounded-xl border border-tactical-gold/30">
                      <span className="text-tactical-gold font-bold text-xl">+150 XP</span>
                    </div>
                    <button 
                      onClick={closeBottomSheet}
                      className="mt-8 w-full bg-tactical-yellow text-tactical-bg font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-tactical-yellow/90 transition-colors"
                    >
                      Continuar Jornada
                    </button>
                  </motion.div>
                ) : (
                  /* Task List */
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-tactical-gray uppercase">Progresso</span>
                        <span className="text-tactical-yellow">
                          {tasks.filter(t => t.completed).length} / {tasks.length}
                        </span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-tactical-yellow"
                          initial={{ width: 0 }}
                          animate={{ width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {tasks.map((task) => {
                      const Icon = task.icon;
                      return (
                        <motion.button
                          key={task.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleTaskToggle(task.id)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${
                            task.completed 
                              ? 'bg-tactical-yellow/10 border-tactical-yellow/50' 
                              : 'bg-white/5 border-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="mt-1">
                            {task.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-tactical-yellow" />
                            ) : (
                              <Circle className="w-6 h-6 text-tactical-gray" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${
                                task.type === 'in-app' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'
                              }`}>
                                {task.type === 'in-app' ? 'Estudo' : 'Físico'}
                              </span>
                            </div>
                            <h4 className={`font-bold ${task.completed ? 'text-white line-through opacity-70' : 'text-white'}`}>
                              {task.title}
                            </h4>
                            <p className={`text-sm mt-1 ${task.completed ? 'text-tactical-gray line-through opacity-70' : 'text-tactical-gray'}`}>
                              {task.description}
                            </p>
                          </div>
                          <div className={`p-2 rounded-lg ${task.completed ? 'bg-tactical-yellow/20 text-tactical-yellow' : 'bg-white/5 text-tactical-gray'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-tactical-panel border border-white/10 rounded-2xl p-6 max-w-sm w-full"
          >
            <h2 className="text-xl font-black uppercase tracking-tight mb-2">Data da Prova</h2>
            <p className="text-tactical-gray text-sm mb-6">Defina a data do seu concurso para ajustarmos o cronograma.</p>
            
            <input 
              type="date" 
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full bg-tactical-bg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-tactical-yellow mb-6"
            />

            <div className="flex gap-3">
              <button 
                onClick={() => setShowDatePicker(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold uppercase tracking-widest transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveExamDate}
                className="flex-1 py-3 bg-tactical-yellow text-tactical-bg hover:bg-tactical-yellow/90 rounded-xl font-bold uppercase tracking-widest transition-colors"
              >
                Salvar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
