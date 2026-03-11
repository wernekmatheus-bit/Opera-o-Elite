'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, ChevronRight, ArrowLeft, Crosshair, Shield, 
  FileText, Clock, Search, Filter, PlayCircle, CheckCircle2, 
  Dumbbell, Flame, Target, BookMarked, Lock, Plus, Trash2,
  Video, ListChecks
} from 'lucide-react';
import Link from 'next/link';

// --- MOCK DATA ---
const SUBJECTS = [
  { id: 'penal-militar', name: 'Direito Penal Militar', progress: 45, total: 24, completed: 11, icon: Shield, color: 'text-tactical-yellow', bg: 'bg-tactical-yellow/10', border: 'border-tactical-yellow/20' },
  { id: 'constitucional', name: 'Direito Constitucional', progress: 80, total: 15, completed: 12, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'portugues', name: 'Língua Portuguesa', progress: 20, total: 40, completed: 8, icon: BookMarked, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  { id: 'taf', name: 'Preparação Física', progress: 100, total: 10, completed: 10, icon: Dumbbell, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
];

const MODULES = [
  {
    id: 'm1',
    subjectId: 'penal-militar',
    title: 'Crimes Militares em Tempo de Paz',
    description: 'Compreenda a estrutura dos crimes militares, motim, revolta e deserção.',
    progress: 30,
    lessons: [
      { id: 'l1', title: '1. Introdução ao CPM e Aplicação da Lei', duration: '15 min', read: true, type: 'video', xp: 50 },
      { id: 'l2', title: '2. Crimes contra a Autoridade ou Disciplina', duration: '25 min', read: false, type: 'text', xp: 80 },
      { id: 'l3', title: '3. Crimes contra o Serviço e Fuga', duration: '20 min', read: false, type: 'text', xp: 60 },
      { id: 'l4', title: '4. Insubordinação e Desrespeito', duration: '30 min', read: false, locked: true, type: 'text', xp: 100 },
    ]
  },
  {
    id: 'm2',
    subjectId: 'constitucional',
    title: 'Defesa do Estado e das Instituições',
    description: 'Art. 144 e o papel das Polícias Militares na segurança pública.',
    progress: 0,
    lessons: [
      { id: 'l5', title: '1. Segurança Pública (Art. 144)', duration: '20 min', read: false, type: 'text', xp: 70 },
      { id: 'l6', title: '2. Forças Armadas e GLO', duration: '25 min', read: false, locked: true, type: 'video', xp: 90 },
    ]
  }
];

const LESSON_CONTENT = `
# Crimes contra a Autoridade ou Disciplina Militar

O Código Penal Militar (CPM) tutela rigorosamente a hierarquia e a disciplina, pilares inegociáveis das instituições militares.

## Motim (Art. 149)
Reunirem-se militares ou assemelhados:
I - agindo contra a ordem recebida de superior, ou negando-se a cumpri-la;
II - recusando obediência a superior, quando estejam agindo sem ordem ou praticando violência;
III - assentindo em recusa conjunta de obediência, ou em resistência ou violência, em comum, contra superior;
IV - ocupando quartel, fortaleza, arsenal, fábrica ou estabelecimento militar, ou dependência de qualquer deles, navio, aeronave, viatura ou acampamento militar, ou nele se introduzindo clandestina ou tumultuosamente, com o fim de amotinar-se.

**Pena:** reclusão, de quatro a oito anos, com aumento de um terço para os cabeças.

## Revolta (Art. 149, Parágrafo único)
Se os agentes estavam armados.

**Pena:** reclusão, de oito a vinte anos, com aumento de um terço para os cabeças.

---

### Bizu Tático 🎯
A diferença fundamental entre Motim e Revolta é o **uso de armamento**. 
- **Motim:** Desarmado.
- **Revolta:** Armado.

Ambos exigem **pluralidade de agentes** (concurso de pessoas é obrigatório). Um militar sozinho não comete motim, comete desobediência ou insubordinação.

> "A disciplina é a alma de um exército; torna grandes os pequenos contingentes, proporciona sucesso aos fracos, e estima a todos." - George Washington
`;

export default function AcademiaPage() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'trilhas' | 'plano'>('trilhas');
  const [todayPlan, setTodayPlan] = useState<string[]>(['l2']); // Pre-filled with one lesson
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const toggleFromPlan = (lessonId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (todayPlan.includes(lessonId)) {
      setTodayPlan(todayPlan.filter(id => id !== lessonId));
    } else {
      setTodayPlan([...todayPlan, lessonId]);
    }
  };

  const filteredModules = MODULES.filter(m => 
    (!selectedSubject || m.subjectId === selectedSubject) &&
    (m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     m.lessons.some(l => l.title.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Calculate total time and XP for today's plan
  const planLessons = MODULES.flatMap(m => m.lessons).filter(l => todayPlan.includes(l.id));
  const totalPlanMinutes = planLessons.reduce((acc, curr) => acc + parseInt(curr.duration), 0);
  const totalPlanXP = planLessons.reduce((acc, curr) => acc + curr.xp, 0);

  if (selectedLesson) {
    const lesson = MODULES.flatMap(m => m.lessons).find(l => l.id === selectedLesson);
    const module = MODULES.find(m => m.lessons.some(l => l.id === selectedLesson));
    
    return (
      <div className="min-h-screen pb-24 max-w-3xl mx-auto">
        {/* Lesson Header */}
        <header className="sticky top-0 z-10 bg-tactical-bg/95 backdrop-blur-md pt-4 pb-4 border-b border-white/5 px-4 md:px-0">
          <button 
            onClick={() => setSelectedLesson(null)}
            className="flex items-center gap-2 text-tactical-gray hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Voltar para Academia</span>
          </button>
          <h1 className="text-2xl font-bold text-white leading-tight">{lesson?.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-tactical-gray">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {lesson?.duration}</span>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> {module?.title}</span>
            <span className="flex items-center gap-1 text-tactical-yellow"><Flame className="w-4 h-4" /> +{lesson?.xp} XP</span>
          </div>
        </header>

        {/* Lesson Content (Typography) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 md:px-0 py-8"
        >
          <div 
            className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-bold prose-a:text-tactical-yellow prose-blockquote:border-l-tactical-yellow prose-blockquote:bg-tactical-panel prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-strong:text-white prose-hr:border-white/10"
            dangerouslySetInnerHTML={{ __html: LESSON_CONTENT.replace(/\n/g, '<br/>').replace(/# (.*?)<br\/>/g, '<h1>$1</h1>').replace(/## (.*?)<br\/>/g, '<h2>$1</h2>').replace(/### (.*?)<br\/>/g, '<h3>$1</h3>').replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>').replace(/> (.*?)<br\/>/g, '<blockquote>$1</blockquote>') }}
          />
          
          {/* Action Footer */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col items-center">
            <p className="text-tactical-gray mb-6 text-center">Missão dada é missão cumprida. Teste seu conhecimento no campo de batalha.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button 
                onClick={() => setSelectedLesson(null)}
                className="flex items-center gap-2 bg-tactical-panel border border-white/10 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-white/5 transition-all justify-center"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Marcar Concluída
              </button>
              <Link 
                href="/estande"
                className="flex items-center gap-2 bg-tactical-yellow text-tactical-bg px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-tactical-yellow/90 transition-all hover:scale-105 active:scale-95 justify-center"
              >
                <Crosshair className="w-5 h-5" />
                Ir para Questões
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 max-w-5xl mx-auto px-4 md:px-0">
      {/* Header & Search */}
      <header className="pt-6 pb-6 border-b border-white/5 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <Target className="w-8 h-8 text-tactical-yellow" />
              Academia Tática
            </h1>
            <p className="text-tactical-gray mt-1">Forje seu conhecimento. Escolha suas batalhas de hoje.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tactical-gray" />
            <input 
              type="text" 
              placeholder="Buscar aulas, módulos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-tactical-panel border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-tactical-gray focus:outline-none focus:border-tactical-yellow focus:ring-1 focus:ring-tactical-yellow transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 bg-tactical-panel p-1 rounded-xl border border-white/5 w-full md:w-fit">
          <button
            onClick={() => setActiveTab('trilhas')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'trilhas' ? 'bg-tactical-bg text-white shadow-sm border border-white/10' : 'text-tactical-gray hover:text-white'}`}
          >
            <BookOpen className="w-4 h-4" />
            Acervo Completo
          </button>
          <button
            onClick={() => setActiveTab('plano')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'plano' ? 'bg-tactical-yellow text-tactical-bg shadow-sm' : 'text-tactical-gray hover:text-white'}`}
          >
            <ListChecks className="w-4 h-4" />
            Plano de Hoje
            {todayPlan.length > 0 && (
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeTab === 'plano' ? 'bg-tactical-bg text-tactical-yellow' : 'bg-tactical-yellow text-tactical-bg'}`}>
                {todayPlan.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'trilhas' ? (
          <motion.div 
            key="trilhas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Subjects Horizontal Scroll */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide">Disciplinas</h2>
                {selectedSubject && (
                  <button 
                    onClick={() => setSelectedSubject(null)}
                    className="text-xs font-bold text-tactical-yellow hover:underline"
                  >
                    Limpar Filtro
                  </button>
                )}
              </div>
              <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 gap-4 snap-x hide-scrollbar">
                {SUBJECTS.map((subject) => {
                  const Icon = subject.icon;
                  const isSelected = selectedSubject === subject.id;
                  return (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubject(isSelected ? null : subject.id)}
                      className={`snap-start shrink-0 w-64 p-4 rounded-2xl border transition-all text-left ${isSelected ? 'bg-tactical-panel border-tactical-yellow ring-1 ring-tactical-yellow' : 'bg-tactical-panel border-white/5 hover:border-white/20'}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${subject.bg} ${subject.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-white text-sm leading-tight">{subject.name}</h3>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-tactical-gray">
                          <span>Progresso</span>
                          <span className="font-bold text-white">{subject.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-tactical-bg rounded-full overflow-hidden">
                          <div className={`h-full ${subject.bg.replace('/10', '')}`} style={{ width: `${subject.progress}%` }} />
                        </div>
                        <p className="text-[10px] text-tactical-gray text-right mt-1">{subject.completed}/{subject.total} aulas</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modules List */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <Filter className="w-5 h-5 text-tactical-yellow" />
                Módulos Disponíveis
              </h2>
              
              {filteredModules.length === 0 ? (
                <div className="text-center py-12 bg-tactical-panel rounded-2xl border border-white/5">
                  <Search className="w-12 h-12 text-tactical-gray mx-auto mb-4 opacity-50" />
                  <p className="text-tactical-gray font-medium">Nenhum módulo encontrado para sua busca.</p>
                </div>
              ) : (
                filteredModules.map((module) => (
                  <div key={module.id} className="bg-tactical-panel rounded-2xl border border-white/5 overflow-hidden">
                    {/* Module Header */}
                    <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold px-2 py-1 rounded bg-tactical-bg text-tactical-gray border border-white/10 uppercase tracking-wider">
                              {SUBJECTS.find(s => s.id === module.subjectId)?.name}
                            </span>
                          </div>
                          <h2 className="text-xl font-bold text-white mb-1">{module.title}</h2>
                          <p className="text-sm text-tactical-gray">{module.description}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-tactical-bg px-4 py-2 rounded-xl border border-white/5">
                          <div className="w-12 h-12 rounded-full border-2 border-tactical-yellow/30 flex items-center justify-center relative">
                            <span className="text-xs font-bold text-tactical-yellow">{module.progress}%</span>
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-tactical-yellow"
                                strokeDasharray={`${module.progress}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lessons List */}
                    <div className="divide-y divide-white/5">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 transition-colors group ${lesson.locked ? 'opacity-50 bg-black/20' : 'hover:bg-white/5'}`}
                        >
                          <div className="flex items-start sm:items-center gap-4 mb-4 sm:mb-0">
                            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${
                              lesson.read 
                                ? 'bg-tactical-yellow/20 border-tactical-yellow/50 text-tactical-yellow' 
                                : lesson.locked
                                ? 'bg-tactical-bg border-white/5 text-tactical-gray'
                                : 'bg-tactical-bg border-white/10 text-white'
                            }`}>
                              {lesson.locked ? <Lock className="w-4 h-4" /> : lesson.type === 'video' ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                            </div>
                            <div>
                              <h3 className={`font-bold ${lesson.read ? 'text-tactical-gray' : 'text-white'}`}>
                                {lesson.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-xs text-tactical-gray flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {lesson.duration}
                                </p>
                                <p className="text-xs text-tactical-yellow flex items-center gap-1">
                                  <Flame className="w-3 h-3" /> {lesson.xp} XP
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 sm:ml-4">
                            {!lesson.locked && (
                              <>
                                <button
                                  onClick={(e) => toggleFromPlan(lesson.id, e)}
                                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    todayPlan.includes(lesson.id)
                                      ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20'
                                      : 'bg-tactical-bg text-tactical-gray hover:text-white border border-white/10 hover:border-white/30'
                                  }`}
                                >
                                  {todayPlan.includes(lesson.id) ? (
                                    <><Trash2 className="w-4 h-4" /> Remover</>
                                  ) : (
                                    <><Plus className="w-4 h-4" /> Plano de Hoje</>
                                  )}
                                </button>
                                <button
                                  onClick={() => setSelectedLesson(lesson.id)}
                                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-tactical-yellow text-tactical-bg rounded-lg text-sm font-bold hover:bg-tactical-yellow/90 transition-all"
                                >
                                  <PlayCircle className="w-4 h-4" />
                                  Estudar
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="plano"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-tactical-panel border border-tactical-yellow/20 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-tactical-yellow/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Seu Plano de Batalha</h2>
                  <p className="text-tactical-gray">Defina suas missões diárias e mantenha a constância. A aprovação é construída um dia de cada vez.</p>
                </div>
                
                <div className="flex items-center gap-4 bg-tactical-bg p-4 rounded-xl border border-white/5 shrink-0">
                  <div className="text-center px-4 border-r border-white/10">
                    <p className="text-xs text-tactical-gray uppercase font-bold mb-1">Tempo Est.</p>
                    <p className="text-xl font-black text-white">{totalPlanMinutes} <span className="text-sm font-medium text-tactical-gray">min</span></p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-xs text-tactical-gray uppercase font-bold mb-1">Recompensa</p>
                    <p className="text-xl font-black text-tactical-yellow">+{totalPlanXP} <span className="text-sm font-medium">XP</span></p>
                  </div>
                </div>
              </div>
            </div>

            {todayPlan.length === 0 ? (
              <div className="text-center py-16 bg-tactical-panel rounded-2xl border border-white/5 border-dashed">
                <Target className="w-16 h-16 text-tactical-gray mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-bold text-white mb-2">Plano Vazio</h3>
                <p className="text-tactical-gray mb-6 max-w-md mx-auto">Você ainda não definiu suas missões para hoje. Volte ao Acervo Completo e adicione aulas ao seu plano.</p>
                <button 
                  onClick={() => setActiveTab('trilhas')}
                  className="bg-tactical-bg border border-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/5 transition-colors"
                >
                  Explorar Acervo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {planLessons.map((lesson, index) => {
                  const module = MODULES.find(m => m.lessons.some(l => l.id === lesson.id));
                  const subject = SUBJECTS.find(s => s.id === module?.subjectId);
                  const Icon = subject?.icon || FileText;

                  return (
                    <div key={lesson.id} className="bg-tactical-panel border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-white/20 transition-colors">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-tactical-bg border border-white/10 text-tactical-gray font-bold text-sm shrink-0">
                        {index + 1}
                      </div>
                      
                      <div className={`p-3 rounded-xl shrink-0 ${subject?.bg} ${subject?.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-tactical-gray bg-tactical-bg px-2 py-0.5 rounded border border-white/5">
                            {subject?.name}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-lg">{lesson.title}</h3>
                        <p className="text-sm text-tactical-gray">{module?.title}</p>
                      </div>

                      <div className="flex items-center gap-3 sm:ml-auto w-full sm:w-auto">
                        <button
                          onClick={(e) => toggleFromPlan(lesson.id, e)}
                          className="p-3 text-tactical-gray hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Remover do plano"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setSelectedLesson(lesson.id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-tactical-yellow text-tactical-bg rounded-lg font-bold hover:bg-tactical-yellow/90 transition-all"
                        >
                          <PlayCircle className="w-5 h-5" />
                          Iniciar
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-6 flex justify-end">
                  <button 
                    onClick={() => setSelectedLesson(planLessons[0]?.id)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-tactical-yellow text-tactical-bg px-8 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-tactical-yellow/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                  >
                    <Target className="w-5 h-5" />
                    Iniciar Batalha de Hoje
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
