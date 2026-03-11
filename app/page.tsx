'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Target, Shield, Crosshair, BookOpen, CheckCircle2, ChevronDown, ChevronRight, Activity, Zap, Star, BadgeCheck, AlertTriangle, Award, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { useState } from 'react';

// --- MOCK DATA ---
const FAQS = [
  {
    q: 'Serve para qual concurso policial?',
    a: 'Nossa plataforma é modular. Temos o núcleo base perfeito para Polícia Federal (PF), Polícia Rodoviária Federal (PRF), Polícias Civis (PC), Polícias Militares (PM) e Polícia Penal. Você seleciona o seu foco e o sistema adapta o cronograma e as questões.'
  },
  {
    q: 'Quem elabora os materiais e questões?',
    a: '100% do nosso conteúdo é curado, escrito e revisado por policiais da ativa e especialistas em bancas examinadoras (CEBRASPE, FGV, VUNESP, etc). Você estuda com quem já passou pelo que você está passando e hoje veste a farda.'
  },
  {
    q: 'A plataforma tem videoaulas longas?',
    a: 'Não. Nosso método é focado em Estudo Ativo de Alta Retenção. Substituímos horas de vídeos passivos (que te dão sono e falsa sensação de aprendizado) por materiais em texto direto ao ponto, esquematizados por especialistas, e resolução exaustiva de questões.'
  },
  {
    q: 'E se eu não me adaptar ao método?',
    a: 'A reprovação custa anos da sua vida; nosso teste não custa nada. Oferecemos uma garantia incondicional de 7 dias. Se você entrar, acessar o material dos nossos especialistas e achar que não é o melhor sistema do mercado, devolvemos 100% do seu dinheiro com um clique.'
  }
];

const TESTIMONIALS = [
  {
    name: 'Lucas V.',
    state: 'Aprovado PF',
    rating: 5.0,
    text: 'Eu tinha pavor de reprovar de novo. O material de Direito Penal da Michele mudou meu jogo. Fui pra prova do CEBRASPE com sangue nos olhos e gabaritei a específica.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDCrVDa60hvUpmgS-WLuwsefO8Mez5ziDUnjlphi3GyA&s=10'
  },
  {
    name: 'Mariana S.',
    state: 'Aprovada PC-SP',
    rating: 5.0,
    text: 'Estudar com material feito por quem é da Polícia Civil faz toda a diferença. O Delegado Carlos sabe exatamente as pegadinhas da Vunesp. Sem palavras.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI9Rl0ngHhkMvbxSk0wToIczlnlZg7Wne1ca0muxhGFw&s=10'
  },
  {
    name: 'Cb. Oliveira',
    state: 'Aprovado PM-MG',
    rating: 4.9,
    text: 'Quase rodei no TAF no concurso passado. O cronograma do Capitão Marcos integrou minha corrida com os estudos. Cheguei voando na prova física.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQv5QtKZtAfMPbzeLUDvjvqfTXlg9JTt8sw3lFJEgNOA&s=10'
  },
  {
    name: 'Rafael M.',
    state: 'Aprovado PRF',
    rating: 5.0,
    text: 'O nível das questões no Estande de Tiro é absurdo. Muito superior aos cursinhos famosos. É uma plataforma tática de verdade, não tem enrolação.',
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-tactical-bg/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-tactical-yellow" />
            <span className="font-black uppercase tracking-tighter text-xl">
              Operação <span className="text-tactical-yellow">Elite</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold uppercase tracking-widest text-tactical-gray hover:text-white transition-colors">
              Acesso Alunos
            </Link>
            <Link href="#planos" className="hidden md:flex items-center justify-center px-5 py-2.5 bg-tactical-yellow text-tactical-bg text-sm font-black uppercase tracking-widest rounded-lg hover:bg-tactical-yellow/90 transition-colors shadow-[0_0_15px_rgba(255,204,0,0.3)]">
              Garantir Minha Vaga
            </Link>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION - FOCADO NA DOR E AUTORIDADE */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-tactical-yellow/20 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-bold uppercase tracking-widest text-red-400 mb-8">
              <AlertTriangle className="w-4 h-4" />
              O medo de reprovar acaba aqui
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              A única plataforma de alto nível desenvolvida por <span className="text-tactical-yellow">Policiais da Ativa</span>.
            </h1>
            
            <p className="text-lg md:text-xl text-tactical-gray max-w-3xl mx-auto mb-10 leading-relaxed">
              Você não tem tempo para testar métodos que não funcionam. A reprovação custa caro. Prepare-se para PF, PRF, PC e PM com materiais e questões elaborados exclusivamente por especialistas que já venceram as bancas.
            </p>

            <div className="flex flex-col items-center gap-4">
              <Link href="#planos">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group bg-tactical-yellow text-tactical-bg px-10 py-5 rounded-xl font-black uppercase tracking-widest text-lg md:text-xl overflow-hidden shadow-[0_0_30px_rgba(255,204,0,0.4)]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center gap-2">
                    Quero Vestir a Farda
                    <ChevronRight className="w-6 h-6" />
                  </span>
                </motion.button>
              </Link>
              <div className="flex items-center gap-2 text-xs text-tactical-gray font-medium">
                <Shield className="w-4 h-4 text-tactical-yellow" />
                Risco Zero: Garantia incondicional de 7 dias.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. BARRA DE AUTORIDADE */}
      <section className="border-y border-white/5 bg-tactical-panel/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-tactical-gray mb-6">
            Preparação de Alto Padrão para as Maiores Forças do Brasil
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
            <div className="flex items-center gap-2 font-black text-xl"><Shield className="w-8 h-8" /> POLÍCIA FEDERAL</div>
            <div className="flex items-center gap-2 font-black text-xl"><Target className="w-8 h-8" /> PRF</div>
            <div className="flex items-center gap-2 font-black text-xl"><Shield className="w-8 h-8" /> POLÍCIA CIVIL</div>
            <div className="flex items-center gap-2 font-black text-xl"><Shield className="w-8 h-8" /> POLÍCIA MILITAR</div>
            <div className="flex items-center gap-2 font-black text-xl"><Shield className="w-8 h-8" /> POLÍCIA PENAL</div>
          </div>
        </div>
      </section>

      {/* 3. AGITAÇÃO DO PROBLEMA */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
            O sistema tradicional reprova <span className="text-tactical-red">95%</span> dos candidatos.
          </h2>
          <p className="text-tactical-gray text-lg">
            Ver seu nome fora do Diário Oficial significa mais um ano no seu emprego atual, mais um ano de cursinho e mais um ano longe do seu sonho. Por que você continua estudando errado?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-tactical-panel p-8 rounded-2xl border border-white/5 hover:border-tactical-red/30 transition-colors"
          >
            <div className="w-12 h-12 bg-tactical-red/10 rounded-xl flex items-center justify-center mb-6">
              <Activity className="w-6 h-6 text-tactical-red" />
            </div>
            <h3 className="text-xl font-bold mb-3">Materiais Genéricos</h3>
            <p className="text-tactical-gray">Apostilas copiadas e coladas da internet, feitas por professores que nunca pisaram numa delegacia ou viatura. Você estuda o que não cai.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-tactical-panel p-8 rounded-2xl border border-white/5 hover:border-tactical-red/30 transition-colors"
          >
            <div className="w-12 h-12 bg-tactical-red/10 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-tactical-red" />
            </div>
            <h3 className="text-xl font-bold mb-3">Estudo Passivo (Videoaulas)</h3>
            <p className="text-tactical-gray">Horas perdidas assistindo vídeos intermináveis que te dão a falsa sensação de aprendizado, mas somem da memória na hora da prova.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-tactical-panel p-8 rounded-2xl border border-white/5 hover:border-tactical-red/30 transition-colors"
          >
            <div className="w-12 h-12 bg-tactical-red/10 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-tactical-red" />
            </div>
            <h3 className="text-xl font-bold mb-3">O TAF Esquecido</h3>
            <p className="text-tactical-gray">Passar na prova escrita e reprovar no físico por não ter treinado junto com os estudos. O erro mais amador e doloroso que existe.</p>
          </motion.div>
        </div>
      </section>

      {/* 4. APRESENTAÇÃO DO ARSENAL (COM AUTORIDADE) */}
      <section className="py-24 px-4 bg-tactical-panel/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
              A Solução Definitiva
            </h2>
            <p className="text-tactical-gray text-lg">Conheça a plataforma definitiva desenhada por quem entende do assunto.</p>
          </div>

          <div className="space-y-32">
            
            {/* Feature 1: Academia Tática (Teoria) */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 md:order-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-tactical-yellow/10 rounded-lg"><BookOpen className="w-6 h-6 text-tactical-yellow" /></div>
                  <h3 className="text-2xl font-bold uppercase tracking-wide">Academia Tática (Teoria)</h3>
                </div>
                <p className="text-tactical-gray text-lg leading-relaxed mb-6">
                  Chega de PDFs de 200 páginas que você nunca vai ler. Nosso material didático é cirúrgico, esquematizado e focado 100% no que as bancas policiais cobram. Aprenda em 15 minutos de leitura ativa o que demoraria 2 horas em uma videoaula.
                </p>
                
                {/* Authority Badge */}
                <div className="mb-8 p-4 bg-tactical-bg border border-white/10 rounded-xl flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-tactical-yellow/50">
                    <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&grayscale" alt="Michele Roffman" fill className="object-cover" unoptimized referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-1">
                      Material elaborado por Michele Roffman <BadgeCheck className="w-4 h-4 text-tactical-yellow" />
                    </p>
                    <p className="text-xs text-tactical-gray mt-0.5">Agente Penitenciária • Formada em Direito • Especialista em Código Penal</p>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5 text-tactical-yellow" /> Leitura otimizada para altíssima retenção</li>
                  <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5 text-tactical-yellow" /> Bizus táticos e mnemônicos destacados</li>
                </ul>
              </motion.div>
              
              <div className="order-1 md:order-2 relative w-full max-w-[320px] mx-auto aspect-[9/19] bg-[#121212] border-4 border-[#1E1E1E] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
                {/* App Header */}
                <div className="bg-[#1E1E1E] p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-tactical-yellow" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Direito Penal</span>
                  </div>
                  <span className="text-[10px] text-tactical-gray">15%</span>
                </div>
                {/* Content */}
                <div className="p-5 flex-1 overflow-hidden relative">
                  <h4 className="font-black text-lg text-white mb-2">Crimes Contra a Vida</h4>
                  <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                    Art. 121. Matar alguém:<br/>
                    Pena - reclusão, de seis a vinte anos.
                  </p>
                  <div className="bg-tactical-yellow/10 border-l-2 border-tactical-yellow p-3 rounded-r-lg mb-4">
                    <div className="flex items-center gap-1 mb-1">
                      <Zap className="w-3 h-3 text-tactical-yellow" />
                      <span className="text-[10px] font-bold text-tactical-yellow uppercase">Bizu Tático</span>
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed">
                      Homicídio privilegiado (violenta emoção) reduz a pena de 1/6 a 1/3. Não confunda com qualificadora!
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    § 2° Se o homicídio é cometido:<br/>
                    I - mediante paga ou promessa de recompensa...
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#121212] to-transparent" />
                </div>
              </div>
            </div>

            {/* Feature 2: Estande de Tiro (Questões) */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative w-full max-w-[320px] mx-auto aspect-[9/19] bg-[#121212] border-4 border-[#1E1E1E] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
                {/* App Header */}
                <div className="bg-[#1E1E1E] p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-tactical-yellow" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Q. 142 • CEBRASPE</span>
                  </div>
                  <BadgeCheck className="w-4 h-4 text-green-500" />
                </div>
                {/* Content */}
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <p className="text-sm text-white/90 leading-relaxed mb-2">
                    A respeito dos direitos e garantias fundamentais, julgue o item: A casa é asilo inviolável do indivíduo...
                  </p>
                  
                  {/* Options */}
                  <div className="bg-[#1E1E1E] border border-white/5 p-3 rounded-xl flex items-center gap-3 opacity-50">
                    <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-white/50">A</div>
                    <span className="text-xs text-white/70">Errado, pois a polícia pode entrar a qualquer hora.</span>
                  </div>
                  
                  <div className="bg-green-500/10 border border-green-500/50 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] font-bold text-[#121212]">B</div>
                    <span className="text-xs text-green-400 font-medium">Certo, salvo em flagrante delito ou desastre.</span>
                  </div>

                  {/* Comment */}
                  <div className="mt-auto bg-[#1E1E1E] p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-4 h-4 text-tactical-yellow" />
                      <span className="text-[10px] font-bold text-tactical-yellow uppercase">Comentário do Delegado</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Exato! Art. 5º, XI, CF. A exceção ocorre em caso de flagrante delito, desastre, para prestar socorro ou, durante o dia, por determinação judicial.
                    </p>
                  </div>
                </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-tactical-yellow/10 rounded-lg"><Crosshair className="w-6 h-6 text-tactical-yellow" /></div>
                  <h3 className="text-2xl font-bold uppercase tracking-wide">Estande de Tiro (Questões)</h3>
                </div>
                <p className="text-tactical-gray text-lg leading-relaxed mb-6">
                  O campo de provas. Treine com milhares de questões atualizadas das principais bancas do país. Cada erro é uma aula, com justificativas detalhadas que te ensinam a pensar como o examinador.
                </p>

                {/* Authority Badge */}
                <div className="mb-8 p-4 bg-tactical-bg border border-white/10 rounded-xl flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-tactical-yellow/50">
                    <Image src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&grayscale" alt="Delegado Carlos Mendes" fill className="object-cover" unoptimized referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-1">
                      Questões comentadas por Carlos Mendes <BadgeCheck className="w-4 h-4 text-tactical-yellow" />
                    </p>
                    <p className="text-xs text-tactical-gray mt-0.5">Delegado de Polícia Civil • 15 anos de experiência em bancas</p>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5 text-tactical-yellow" /> Filtros avançados por banca (CEBRASPE, FGV, etc)</li>
                  <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5 text-tactical-yellow" /> Comentários em texto direto ao ponto</li>
                </ul>
              </motion.div>
            </div>

            {/* Feature 3: Operação Personalizada & TAF */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 md:order-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-tactical-yellow/10 rounded-lg"><Target className="w-6 h-6 text-tactical-yellow" /></div>
                  <h3 className="text-2xl font-bold uppercase tracking-wide">Cronograma & TAF</h3>
                </div>
                <p className="text-tactical-gray text-lg leading-relaxed mb-6">
                  O único sistema que integra seu estudo teórico com a preparação física. Cumpra missões diárias, ganhe pontos, suba de patente e chegue no dia da prova voando tanto na caneta quanto na barra.
                </p>

                {/* Authority Badge */}
                <div className="mb-8 p-4 bg-tactical-bg border border-white/10 rounded-xl flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-tactical-yellow/50 bg-[#121212]">
                    <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&grayscale" alt="Capitão Marcos Silva" fill className="object-cover" unoptimized referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-1">
                      Periodização por Capitão Marcos Silva <BadgeCheck className="w-4 h-4 text-tactical-yellow" />
                    </p>
                    <p className="text-xs text-tactical-gray mt-0.5">Oficial BOPE • Especialista em Preparação Física Militar</p>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5 text-tactical-yellow" /> Metas diárias de estudo e treino físico</li>
                  <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5 text-tactical-yellow" /> Sistema de progressão anti-desistência</li>
                </ul>
              </motion.div>
              
              <div className="order-1 md:order-2 relative w-full max-w-[320px] mx-auto aspect-[9/19] bg-[#121212] border-4 border-[#1E1E1E] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
                {/* App Header */}
                <div className="bg-[#1E1E1E] p-5 border-b border-white/5">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-tactical-yellow uppercase tracking-widest">Dia 14</span>
                      <h4 className="font-black text-lg text-white uppercase mt-1">Missões de Hoje</h4>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-tactical-yellow flex items-center justify-center">
                      <span className="text-xs font-bold text-tactical-yellow">2/3</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-tactical-yellow rounded-full" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4 flex-1 flex flex-col gap-3 bg-[#121212]">
                  {/* Task 1 - Done */}
                  <div className="bg-[#1E1E1E] p-4 rounded-xl border border-white/5 flex items-center gap-4 opacity-60">
                    <div className="w-5 h-5 rounded-full bg-tactical-yellow flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-[#121212]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white line-through">Direito Administrativo</p>
                      <p className="text-[10px] text-tactical-gray">Ler PDF + 30 Questões</p>
                    </div>
                  </div>

                  {/* Task 2 - Done */}
                  <div className="bg-[#1E1E1E] p-4 rounded-xl border border-white/5 flex items-center gap-4 opacity-60">
                    <div className="w-5 h-5 rounded-full bg-tactical-yellow flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-[#121212]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white line-through">Revisão: Penal</p>
                      <p className="text-[10px] text-tactical-gray">Caderno de Erros</p>
                    </div>
                  </div>

                  {/* Task 3 - Pending (TAF) */}
                  <div className="bg-tactical-yellow/10 p-4 rounded-xl border border-tactical-yellow/30 flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-tactical-yellow" />
                    <div className="w-5 h-5 rounded-full border-2 border-tactical-yellow shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-tactical-yellow">TAF - Físico</p>
                      <p className="text-[10px] text-white/70">Corrida 5km (Pace 5:00) + 5 Barras</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PROVAS SOCIAIS (TESTIMONIALS) */}
      <section className="py-24 px-4 bg-tactical-panel/50 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tactical-bg border border-white/10 text-xs font-bold uppercase tracking-widest text-tactical-yellow mb-4">
              <Star className="w-4 h-4 fill-tactical-yellow" />
              Aprovados Comprovam
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
              Eles confiaram na Elite.<br />
              <span className="text-tactical-gray">Hoje vestem a farda.</span>
            </h2>
          </div>

          <div className="relative w-full overflow-hidden">
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
                      <p className="text-xs font-bold text-tactical-yellow uppercase tracking-widest">{testimonial.state}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(testimonial.rating) ? 'fill-tactical-yellow text-tactical-yellow' : 'fill-tactical-yellow/20 text-tactical-yellow/20'}`} />
                    ))}
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
              O investimento na sua aprovação.
            </h2>
            <p className="text-tactical-gray text-lg">Acesso completo ao quartel general de estudos. O risco é todo nosso.</p>
          </div>

          <div className="max-w-md mx-auto bg-tactical-panel border-2 border-tactical-yellow rounded-3xl p-8 relative shadow-[0_0_50px_rgba(255,204,0,0.15)]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-tactical-yellow text-tactical-bg px-6 py-1.5 rounded-full font-black uppercase tracking-widest text-sm flex items-center gap-2">
              <Award className="w-4 h-4" />
              Acesso Total
            </div>
            
            <div className="text-center mb-8 pt-4">
              <p className="text-tactical-gray line-through mb-1">De R$ 297,00/mês</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold">R$</span>
                <span className="text-6xl font-black">97</span>
                <span className="text-tactical-gray">/mês</span>
              </div>
              <p className="text-sm text-tactical-yellow font-bold mt-2">Menos de R$ 3,25 por dia para mudar de vida</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'Material Teórico Tático (Especialistas)',
                'Estande de Tiro (+10k questões comentadas)',
                'Cronograma Inteligente + Treino TAF',
                'Focado em PF, PRF, PC e PM',
                'Acesso à Comunidade Exclusiva',
                'Garantia Incondicional de 7 dias'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-tactical-yellow shrink-0 mt-0.5" />
                  <span className="font-medium text-white/90">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/onboarding" className="block">
              <button className="w-full bg-tactical-yellow text-tactical-bg py-4 rounded-xl font-black uppercase tracking-widest hover:bg-tactical-yellow/90 transition-colors shadow-lg">
                Garantir Minha Vaga Agora
              </button>
            </Link>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-tactical-gray">
              <ShieldCheck className="w-4 h-4" />
              Pagamento 100% Seguro e Criptografado
            </div>
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
            © {new Date().getFullYear()} Operação Elite. Todos os direitos reservados.
          </div>
        </div>
      </footer>

    </div>
  );
}
