'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronRight, ArrowLeft, Crosshair, Shield, FileText, Clock } from 'lucide-react';
import Link from 'next/link';

// --- MOCK DATA ---
const MODULES = [
  {
    id: 'm1',
    title: 'Direito Penal Militar',
    description: 'Crimes contra a autoridade, motim, revolta e deserção.',
    icon: Shield,
    progress: 0,
    lessons: [
      { id: 'l1', title: '1. Introdução ao CPM e Aplicação da Lei', duration: '15 min', read: false },
      { id: 'l2', title: '2. Crimes contra a Autoridade ou Disciplina', duration: '25 min', read: false },
      { id: 'l3', title: '3. Crimes contra o Serviço e Fuga', duration: '20 min', read: false },
    ]
  },
  {
    id: 'm2',
    title: 'Direito Constitucional',
    description: 'Art. 5º, Direitos e Garantias Fundamentais, Defesa do Estado.',
    icon: BookOpen,
    progress: 0,
    lessons: [
      { id: 'l4', title: '1. Direitos e Deveres Individuais e Coletivos', duration: '30 min', read: false },
      { id: 'l5', title: '2. Segurança Pública (Art. 144)', duration: '20 min', read: false },
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

  if (selectedLesson) {
    return (
      <div className="min-h-screen pb-24 max-w-3xl mx-auto">
        {/* Lesson Header */}
        <header className="sticky top-0 z-10 bg-tactical-bg/95 backdrop-blur-md pt-4 pb-4 border-b border-white/5 px-4 md:px-0">
          <button 
            onClick={() => setSelectedLesson(null)}
            className="flex items-center gap-2 text-tactical-gray hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Voltar para Módulos</span>
          </button>
          <h1 className="text-2xl font-bold text-white leading-tight">2. Crimes contra a Autoridade ou Disciplina</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-tactical-gray">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 25 min de leitura</span>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Direito Penal Militar</span>
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
            dangerouslySetInnerHTML={{ __html: LESSON_CONTENT.replace(/\n/g, '<br/>').replace(/# (.*?)<br\/>/g, '<h1>$1</h1>').replace(/## (.*?)<br\/>/g, '<h2>$1</h2>').replace(/### (.*?)<br\/>/g, '<h3>$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/> (.*?)<br\/>/g, '<blockquote>$1</blockquote>') }}
          />
          
          {/* Action Footer */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col items-center">
            <p className="text-tactical-gray mb-6 text-center">Leitura concluída. Hora de testar seu conhecimento no campo de batalha.</p>
            <Link 
              href="/estande"
              className="flex items-center gap-2 bg-tactical-yellow text-tactical-bg px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-tactical-yellow/90 transition-all hover:scale-105 active:scale-95 w-full md:w-auto justify-center"
            >
              <Crosshair className="w-5 h-5" />
              Ir para Questões de Fixação
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-tactical-bg/90 backdrop-blur-md pt-4 pb-4 border-b border-white/5 px-4 md:px-0">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Academia</h1>
          <p className="text-tactical-gray text-sm">Acervo Teórico de Alta Retenção</p>
        </div>
      </header>

      {/* Modules List */}
      <div className="mt-8 space-y-8 px-4 md:px-0">
        {MODULES.map((module) => {
          const Icon = module.icon;
          return (
            <div key={module.id} className="bg-tactical-panel rounded-2xl border border-white/5 overflow-hidden">
              {/* Module Header */}
              <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-tactical-bg rounded-xl border border-white/10">
                    <Icon className="w-8 h-8 text-tactical-yellow" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-1">{module.title}</h2>
                    <p className="text-sm text-tactical-gray mb-4">{module.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-tactical-bg rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-tactical-yellow" 
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-tactical-yellow">{module.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lessons List */}
              <div className="divide-y divide-white/5">
                {module.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                        lesson.read 
                          ? 'bg-tactical-yellow/20 border-tactical-yellow/50 text-tactical-yellow' 
                          : 'bg-tactical-bg border-white/10 text-tactical-gray'
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className={`font-medium ${lesson.read ? 'text-tactical-gray' : 'text-white group-hover:text-tactical-yellow transition-colors'}`}>
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-tactical-gray mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {lesson.duration}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-tactical-gray group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
