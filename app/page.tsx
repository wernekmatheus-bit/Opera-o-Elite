'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Target, Shield, Crosshair, BookOpen, Users, CheckCircle2, ChevronDown, ChevronRight, Activity, Zap, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { useState } from 'react';

// --- MOCK DATA ---
const FAQS = [
  {
    q: 'A plataforma tem videoaulas?',
    a: 'Não. Nosso método é focado em Estudo Ativo de Alta Retenção. Substituímos horas de vídeos passivos por textos diretos ao ponto e resolução exaustiva de questões. É assim que a Elite estuda.'
  },
  {
    q: 'Serve para a PM do meu estado?',
    a: 'Sim. O núcleo base (Direito Penal, Constitucional, Português, RLM) serve para todas as polícias. Além disso, temos módulos específicos para os editais das maiores corporações (SP, MG, PR, RJ, etc).'
  },
  {
    q: 'E se eu não gostar?',
    a: 'Oferecemos uma garantia incondicional de 7 dias. Se você achar que o Operação Elite não está acelerando sua aprovação, devolvemos 100% do seu dinheiro, sem burocracia.'
  }
];

const TESTIMONIALS = [
  {
    name: 'Sd. Oliveira',
    state: 'PM-SP',
    rating: 4.9,
    text: 'Achei que nunca ia passar por causa de matemática. O método direto ao ponto me salvou. Hoje patrulho as ruas de SP com orgulho.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDCrVDa60hvUpmgS-WLuwsefO8Mez5ziDUnjlphi3GyA&s=10'
  },
  {
    name: 'Cb. Santos',
    state: 'PM-MG',
    rating: 4.8,
    text: 'O cronograma integrado com o TAF foi o diferencial. Vi muito candidato bom rodar na barra, mas eu estava preparado.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI9Rl0ngHhkMvbxSk0wToIczlnlZg7Wne1ca0muxhGFw&s=10'
  },
  {
    name: 'Sd. Ferreira',
    state: 'PM-PR',
    rating: 4.9,
    text: 'Esqueça horas de videoaula. O estande de tiro com as justificativas da banca é a melhor ferramenta que já usei.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQv5QtKZtAfMPbzeLUDvjvqfTXlg9JTt8sw3lFJEgNOA&s=10'
  },
  {
    name: 'Sd. Costa',
    state: 'PM-RJ',
    rating: 4.7,
    text: 'Fui do zero à aprovação em 4 meses. O sistema te força a ter constância, não tem como fugir do checklist diário.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuXBTPYtxK_ghJDYaNPVCHNtV5tCK9K6JEcb1R0AVOQg&s=10'
  },
  {
    name: 'Sd. Lima',
    state: 'PM-SC',
    rating: 4.8,
    text: 'A comunidade é sensacional. Ver o relato de outros recrutas e tirar dúvidas na hora me manteve motivado até o fim.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZlZfv9YV5QZIhhxtKQlPipJO19UcBdy2NZnMda5ssZA&s=10'
  },
  {
    name: 'Sd. Almeida',
    state: 'PM-BA',
    rating: 4.9,
    text: 'O material de Direito Penal Militar é absurdo de bom. Fui pra prova sabendo exatamente o que ia cair.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQELKggX_GdJOEhgZffzkwXKndx1e1H23xPFK49kzicvg&s=10'
  },
  {
    name: 'Sd. Ribeiro',
    state: 'PM-GO',
    rating: 4.6,
    text: 'A plataforma é rápida, não trava e o modo noturno ajuda demais quem estuda de madrugada depois do trabalho.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9Zp8pRCDLyqr2RAjnRZX4DirC27WWkvh5S0ZicuGjiw&s=10'
  },
  {
    name: 'Sd. Martins',
    state: 'PM-RS',
    rating: 4.9,
    text: 'Melhor investimento que fiz. O valor é ridículo perto do salário e da estabilidade que a farda me trouxe.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyGcC8zXryYKbD5F-2HAmXuiksZhTUQGY1ZiptIIEndg&s=10'
  }
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-tactical-bg text-white selection:bg-tactical-yellow/30 selection:text-tactical-yellow">
      
      {/* UTMIFY PIXEL */}
      <Script
        id="utmify-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.googlePixelId = "69b02cee389367212836cd1e";
            var a = document.createElement("script");
            a.setAttribute("async", "");
            a.setAttribute("defer", "");
            a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel-google.js");
            document.head.appendChild(a);
          `
        }}
      />

      {/* HEADER / NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-tactical-bg/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-tactical-yellow" />
            <span className="font-black uppercase tracking-tighter text-xl">
              Operação <span className="text-tactical-yellow">Elite</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold uppercase tracking-widest text-tactical-gray hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="#planos" className="hidden md:flex items-center justify-center px-5 py-2.5 bg-tactical-yellow text-tactical-bg text-sm font-black uppercase tracking-widest rounded-lg hover:bg-tactical-yellow/90 transition-colors">
              Assinar Agora
            </Link>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-tactical-yellow/20 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tactical-panel border border-white/10 text-xs font-bold uppercase tracking-widest text-tactical-gray mb-8">
              <Shield className="w-4 h-4 text-tactical-yellow" />
              A Plataforma Definitiva
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              Pare de estudar como um civil.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-tactical-gray">
                Prepare-se como a <span className="text-tactical-yellow">Elite</span>.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-tactical-gray max-w-2xl mx-auto mb-10 leading-relaxed">
              A única plataforma completa que une estudo focado em texto, banco de questões e cronograma de treino físico até o dia da sua aprovação.
            </p>

            <div className="flex flex-col items-center gap-3">
              <Link href="/onboarding">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group bg-tactical-yellow text-tactical-bg px-8 py-5 rounded-xl font-black uppercase tracking-widest text-lg md:text-xl overflow-hidden"
                >
                  {/* Pulse Effect */}
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center gap-2">
                    Iniciar Treinamento
                    <ChevronRight className="w-6 h-6" />
                  </span>
                </motion.button>
              </Link>
              <p className="text-xs text-tactical-gray font-medium">
                Garantia incondicional de 7 dias.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. BARRA DE AUTORIDADE */}
      <section className="border-y border-white/5 bg-tactical-panel/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-tactical-gray mb-6">
            Preparação focada nos editais das maiores corporações do Brasil
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
            {/* Placeholders for Logos */}
            <div className="flex items-center gap-2 font-black text-xl"><Shield className="w-8 h-8" /> PM-SP</div>
            <div className="flex items-center gap-2 font-black text-xl"><Shield className="w-8 h-8" /> PM-MG</div>
            <div className="flex items-center gap-2 font-black text-xl"><Target className="w-8 h-8" /> BOPE</div>
            <div className="flex items-center gap-2 font-black text-xl"><Shield className="w-8 h-8" /> PM-PR</div>
            <div className="flex items-center gap-2 font-black text-xl"><Shield className="w-8 h-8" /> PM-RJ</div>
          </div>
        </div>
      </section>

      {/* 3. AGITAÇÃO DO PROBLEMA */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
            O sistema tradicional reprova <span className="text-tactical-red">95%</span> dos candidatos.
          </h2>
          <p className="text-tactical-gray text-lg">Por que você continua fazendo o que não funciona?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-tactical-panel p-8 rounded-2xl border border-white/5"
          >
            <div className="w-12 h-12 bg-tactical-red/10 rounded-xl flex items-center justify-center mb-6">
              <Activity className="w-6 h-6 text-tactical-red" />
            </div>
            <h3 className="text-xl font-bold mb-3">Estudo Passivo</h3>
            <p className="text-tactical-gray">Horas perdidas assistindo videoaulas intermináveis que te dão a falsa sensação de aprendizado, mas somem da memória na hora da prova.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-tactical-panel p-8 rounded-2xl border border-white/5"
          >
            <div className="w-12 h-12 bg-tactical-red/10 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-tactical-red" />
            </div>
            <h3 className="text-xl font-bold mb-3">Falta de Constância</h3>
            <p className="text-tactical-gray">Sem um mapa claro do que fazer a cada dia, a motivação acaba no segundo mês e você desiste antes mesmo do edital abrir.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-tactical-panel p-8 rounded-2xl border border-white/5"
          >
            <div className="w-12 h-12 bg-tactical-red/10 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-tactical-red" />
            </div>
            <h3 className="text-xl font-bold mb-3">O TAF Esquecido</h3>
            <p className="text-tactical-gray">Passar na prova escrita e reprovar no físico por não ter treinado junto com os estudos. O erro mais amador e doloroso que existe.</p>
          </motion.div>
        </div>
      </section>

      {/* 4. APRESENTAÇÃO DO ARSENAL */}
      <section className="py-24 px-4 bg-tactical-panel/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
              Seu novo Quartel General
            </h2>
            <p className="text-tactical-gray text-lg">Tudo que você precisa em um só lugar.</p>
          </div>

          <div className="space-y-24">
            {/* Feature 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 md:order-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-tactical-yellow/10 rounded-lg"><Crosshair className="w-6 h-6 text-tactical-yellow" /></div>
                  <h3 className="text-2xl font-bold uppercase tracking-wide">Estande de Tiro</h3>
                </div>
                <p className="text-tactical-gray text-lg leading-relaxed mb-6">
                  Banco de questões focado. Treine com milhares de questões atualizadas da sua banca, com estatísticas de desempenho e justificativas detalhadas para cada erro.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5 text-tactical-yellow" /> Filtros avançados por banca e assunto</li>
                  <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5 text-tactical-yellow" /> Justificativa em 100% das questões</li>
                </ul>
              </motion.div>
              <div className="order-1 md:order-2 relative w-full max-w-[320px] mx-auto aspect-[9/19] bg-tactical-panel border-4 border-tactical-gray/20 rounded-[2rem] overflow-hidden shadow-2xl">
                <Image src="https://picsum.photos/seed/target/600/1200" alt="Estande de Tiro" fill sizes="(max-width: 768px) 100vw, 320px" className="object-cover opacity-40" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-b from-tactical-bg/80 via-transparent to-tactical-bg/90" />
                
                {/* Fake UI Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <div className="w-8 h-8 rounded-full bg-tactical-yellow/20 flex items-center justify-center"><Crosshair className="w-4 h-4 text-tactical-yellow" /></div>
                    <div className="text-xs font-bold text-tactical-yellow">Q. 142</div>
                  </div>
                  <div className="bg-tactical-bg/80 backdrop-blur-sm p-4 rounded-xl border border-white/10 mb-auto">
                    <p className="text-sm font-medium text-white/90">No crime de motim, a pena é agravada se os agentes usarem armas?</p>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="h-12 rounded-lg bg-green-500/20 border border-green-500/50 flex items-center px-4">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-tactical-bg flex items-center justify-center text-xs font-bold mr-3">A</div>
                      <span className="text-sm text-white">Sim, é causa de aumento.</span>
                    </div>
                    <div className="h-12 rounded-lg bg-white/5 border border-white/10 flex items-center px-4">
                      <div className="w-6 h-6 rounded-full bg-tactical-gray/30 text-white flex items-center justify-center text-xs font-bold mr-3">B</div>
                      <span className="text-sm text-tactical-gray">Não, é qualificadora.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative w-full max-w-[320px] mx-auto aspect-[9/19] bg-tactical-panel border-4 border-tactical-gray/20 rounded-[2rem] overflow-hidden shadow-2xl">
                <Image src="https://picsum.photos/seed/military/600/1200" alt="Operação Personalizada" fill sizes="(max-width: 768px) 100vw, 320px" className="object-cover opacity-30" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-tactical-bg via-tactical-bg/60 to-tactical-bg/90" />
                
                {/* Fake UI Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col">
                  <div className="text-center mb-6 mt-4">
                    <div className="inline-block px-3 py-1 bg-tactical-yellow/20 text-tactical-yellow text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">Dia 14</div>
                    <h4 className="font-black text-xl uppercase">Missão Diária</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-tactical-bg/90 backdrop-blur-md p-4 rounded-xl border border-tactical-yellow/30 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-tactical-yellow" />
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-tactical-gray uppercase">Estudo</span>
                        <CheckCircle2 className="w-4 h-4 text-tactical-yellow" />
                      </div>
                      <p className="text-sm font-bold text-white">Direito Penal Militar</p>
                      <p className="text-xs text-tactical-gray mt-1">Ler resumo e 30 questões</p>
                    </div>
                    
                    <div className="bg-tactical-bg/90 backdrop-blur-md p-4 rounded-xl border border-white/10 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-tactical-gray/30" />
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-tactical-gray uppercase">Físico</span>
                        <div className="w-4 h-4 rounded-full border border-tactical-gray/50" />
                      </div>
                      <p className="text-sm font-bold text-white">Corrida 5km</p>
                      <p className="text-xs text-tactical-gray mt-1">Ritmo: 5:30/km</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-tactical-yellow w-[50%]" />
                    </div>
                    <p className="text-center text-xs font-bold text-tactical-gray uppercase tracking-wider">Progresso: 50%</p>
                  </div>
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-tactical-yellow/10 rounded-lg"><Target className="w-6 h-6 text-tactical-yellow" /></div>
                  <h3 className="text-2xl font-bold uppercase tracking-wide">Operação Personalizada</h3>
                </div>
                <p className="text-tactical-gray text-lg leading-relaxed mb-6">
                  O único curso com um mapa de progressão diário. Cumpra missões de estudo e de treino físico, ganhe pontos, suba de patente e mantenha a motivação alta até a prova.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5 text-tactical-yellow" /> Cronograma inteligente baseado no seu tempo</li>
                  <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5 text-tactical-yellow" /> Sistema de patentes e recompensas</li>
                </ul>
              </motion.div>
            </div>

            {/* Feature 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 md:order-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-tactical-yellow/10 rounded-lg"><BookOpen className="w-6 h-6 text-tactical-yellow" /></div>
                  <h3 className="text-2xl font-bold uppercase tracking-wide">Academia Tática</h3>
                </div>
                <p className="text-tactical-gray text-lg leading-relaxed mb-6">
                  Textos de alto rendimento focados no edital. Direto ao ponto, sem enrolação. Aprenda em 15 minutos de leitura ativa o que demoraria 2 horas em uma videoaula.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5 text-tactical-yellow" /> Leitura otimizada para retenção</li>
                  <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5 text-tactical-yellow" /> Bizus táticos destacados</li>
                </ul>
              </motion.div>
              <div className="order-1 md:order-2 relative w-full max-w-[320px] mx-auto aspect-[9/19] bg-tactical-panel border-4 border-tactical-gray/20 rounded-[2rem] overflow-hidden shadow-2xl">
                <Image src="https://picsum.photos/seed/study/600/1200" alt="Academia Tática" fill sizes="(max-width: 768px) 100vw, 320px" className="object-cover opacity-20" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-tactical-bg/80 backdrop-blur-sm" />
                
                {/* Fake UI Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col">
                  <div className="mb-6 mt-2">
                    <span className="text-[10px] font-bold text-tactical-yellow uppercase tracking-widest">Módulo 01</span>
                    <h4 className="font-black text-lg leading-tight mt-1">Direito Constitucional</h4>
                  </div>
                  
                  <div className="flex-1 bg-tactical-panel/80 rounded-xl border border-white/5 p-4 overflow-hidden relative">
                    <div className="w-full h-3 bg-white/10 rounded-full mb-3" />
                    <div className="w-5/6 h-3 bg-white/10 rounded-full mb-6" />
                    
                    <div className="p-3 bg-tactical-yellow/10 border-l-2 border-tactical-yellow rounded-r-lg mb-6">
                      <p className="text-xs font-bold text-tactical-yellow mb-1">BIZU TÁTICO</p>
                      <div className="w-full h-2 bg-tactical-yellow/30 rounded-full mb-2" />
                      <div className="w-4/5 h-2 bg-tactical-yellow/30 rounded-full" />
                    </div>
                    
                    <div className="w-full h-3 bg-white/10 rounded-full mb-3" />
                    <div className="w-full h-3 bg-white/10 rounded-full mb-3" />
                    <div className="w-3/4 h-3 bg-white/10 rounded-full" />
                    
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-tactical-panel/80 to-transparent" />
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><ChevronDown className="w-4 h-4 text-tactical-gray rotate-90" /></div>
                    <div className="px-4 py-2 bg-tactical-yellow text-tactical-bg text-xs font-bold uppercase rounded-lg">Concluir</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GAMIFICAÇÃO & TAF */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-tactical-yellow/5" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
            A farda exige corpo e mente forjados.<br />
            <span className="text-tactical-yellow">Nós cuidamos dos dois.</span>
          </h2>
          <p className="text-tactical-gray text-lg mb-12 max-w-2xl mx-auto">
            Não adianta gabaritar a prova e reprovar na barra. O Operação Elite integra seu treino físico diário diretamente no seu checklist de estudos.
          </p>

          <div className="bg-tactical-panel border border-white/10 rounded-2xl p-6 md:p-8 max-w-md mx-auto text-left shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold uppercase tracking-wider">Missões de Hoje</h4>
              <span className="text-tactical-yellow font-bold">2/2</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-tactical-yellow/10 border border-tactical-yellow/30 p-4 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-tactical-yellow shrink-0" />
                <div>
                  <p className="font-bold text-white line-through opacity-70">Direito Penal: Motim</p>
                  <p className="text-xs text-tactical-gray uppercase font-bold mt-1">Estudo Teórico</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-tactical-yellow/10 border border-tactical-yellow/30 p-4 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-tactical-yellow shrink-0" />
                <div>
                  <p className="font-bold text-white line-through opacity-70">TAF: 3 Séries de Barra Fixa</p>
                  <p className="text-xs text-tactical-gray uppercase font-bold mt-1">Treino Físico</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 PROVAS SOCIAIS (TESTIMONIALS) */}
      <section className="py-24 px-4 bg-tactical-panel/50 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tactical-bg border border-white/10 text-xs font-bold uppercase tracking-widest text-tactical-yellow mb-4">
              <Star className="w-4 h-4 fill-tactical-yellow" />
              Aprovados Comprovam
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
              Eles usaram o método.<br />
              <span className="text-tactical-gray">Hoje vestem a farda.</span>
            </h2>
          </div>

          {/* Carousel Container */}
          <div className="relative w-full overflow-hidden">
            {/* Gradient Masks for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-tactical-panel/50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-tactical-panel/50 to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {TESTIMONIALS.map((testimonial, idx) => (
                <div 
                  key={idx} 
                  className="snap-center shrink-0 w-[300px] md:w-[350px] bg-tactical-bg border border-white/5 rounded-2xl p-6 relative"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-tactical-yellow/50 grayscale contrast-125">
                      <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" unoptimized />
                      <div className="absolute inset-0 bg-tactical-yellow/10 mix-blend-overlay" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wide">{testimonial.name}</h4>
                      <p className="text-xs font-bold text-tactical-gray uppercase tracking-widest">{testimonial.state}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(testimonial.rating) ? 'fill-tactical-yellow text-tactical-yellow' : 'fill-tactical-yellow/20 text-tactical-yellow/20'}`} />
                    ))}
                    <span className="ml-2 text-xs font-bold text-tactical-yellow">{testimonial.rating}</span>
                  </div>
                  
                  <p className="text-sm text-gray-300 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. A OFERTA (Pricing) */}
      <section id="planos" className="py-24 px-4 bg-tactical-bg">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
              O preço de uma pizza para mudar sua vida.
            </h2>
            <p className="text-tactical-gray text-lg">Invista na sua farda. O risco é todo nosso.</p>
          </div>

          <div className="max-w-md mx-auto bg-tactical-panel border-2 border-tactical-yellow rounded-3xl p-8 relative shadow-[0_0_50px_rgba(255,204,0,0.1)]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-tactical-yellow text-tactical-bg px-4 py-1 rounded-full font-black uppercase tracking-widest text-sm">
              Plano Elite
            </div>
            
            <div className="text-center mb-8 pt-4">
              <p className="text-tactical-gray line-through mb-1">De R$ 297,00/mês</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold">R$</span>
                <span className="text-6xl font-black">97</span>
                <span className="text-tactical-gray">/mês</span>
              </div>
              <p className="text-sm text-tactical-yellow font-bold mt-2">Menos de R$ 3,25 por dia</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'Acesso total à Academia Tática (Teoria)',
                'Estande de Tiro ilimitado (+10k questões)',
                'Operação Personalizada (Cronograma Inteligente)',
                'Acesso à Comunidade Exclusiva',
                'Simulados Inéditos Mensais',
                'Garantia Incondicional de 7 dias'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-tactical-yellow shrink-0 mt-0.5" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/onboarding" className="block">
              <button className="w-full bg-tactical-yellow text-tactical-bg py-4 rounded-xl font-black uppercase tracking-widest hover:bg-tactical-yellow/90 transition-colors">
                Assinar Agora
              </button>
            </Link>
            <p className="text-center text-xs text-tactical-gray mt-4">
              Cancele a qualquer momento. Faturamento anual de R$ 1.164,00.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-24 px-4 bg-tactical-panel/30 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tight">Perguntas Frequentes</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                className="bg-tactical-panel border border-white/10 rounded-xl overflow-hidden"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-bold text-lg">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-tactical-gray transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-tactical-gray leading-relaxed border-t border-white/5 mt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-tactical-bg border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-tactical-yellow" />
            <span className="font-black uppercase tracking-tighter text-xl">
              Operação <span className="text-tactical-yellow">Elite</span>
            </span>
          </div>
          
          <div className="flex gap-6 text-sm font-medium text-tactical-gray">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Contato</a>
          </div>
          
          <div className="text-xs text-tactical-gray/50">
            © {new Date().getFullYear()} Operação Elite. CNPJ: 00.000.000/0001-00
          </div>
        </div>
      </footer>

    </div>
  );
}
