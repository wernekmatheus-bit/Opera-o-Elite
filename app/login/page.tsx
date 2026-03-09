'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Target, ArrowRight, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMsg('');
    
    try {
      const cleanEmail = email.toLowerCase().trim();
      
      // Check if email is in whitelist and paid is true
      const { data, error: fetchError } = await supabase
        .from('whitelist')
        .select('paid')
        .eq('email', cleanEmail)
        .single();

      if (fetchError || !data) {
        setErrorMsg('E-mail não encontrado. Verifique se você digitou corretamente ou finalize sua matrícula.');
        setStatus('error');
        return;
      }

      if (!data.paid) {
        setErrorMsg('Pagamento pendente. Finalize sua matrícula para acessar a plataforma.');
        setStatus('error');
        return;
      }

      // Success! Save session
      localStorage.setItem('pmpr_user_email', cleanEmail);
      localStorage.setItem('pmpr_authenticated', 'true');
      
      // Set cookies for middleware
      document.cookie = `pmpr_authenticated=true; path=/; max-age=2592000; SameSite=Lax`;
      document.cookie = `pmpr_user_email=${cleanEmail}; path=/; max-age=2592000; SameSite=Lax`;
      
      setStatus('success');
      
      // Redirect to QG after a short delay
      setTimeout(() => {
        router.push('/qg');
      }, 1000);
      
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Erro ao conectar com o servidor. Tente novamente.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-tactical-bg flex flex-col items-center justify-center p-4 selection:bg-tactical-yellow/30 selection:text-tactical-yellow">
      
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-tactical-gray hover:text-white transition-colors">
        <Target className="w-6 h-6 text-tactical-yellow" />
        <span className="font-black uppercase tracking-tighter text-xl hidden sm:block">
          Operação <span className="text-tactical-yellow">Elite</span>
        </span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-tactical-panel border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-tactical-yellow/5 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-tactical-yellow/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-tactical-yellow/20">
              <Target className="w-8 h-8 text-tactical-yellow" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Acesso Restrito</h1>
            <p className="text-tactical-gray text-sm">Insira o e-mail utilizado na compra para acessar a Academia Tática.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-tactical-gray uppercase tracking-widest mb-2">
                E-mail de Cadastro
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidato@email.com"
                required
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-tactical-bg border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-tactical-gray/50 focus:outline-none focus:border-tactical-yellow focus:ring-1 focus:ring-tactical-yellow transition-all disabled:opacity-50"
              />
            </div>

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-tactical-red/10 border border-tactical-red/20 rounded-lg p-3 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-tactical-red shrink-0 mt-0.5" />
                <p className="text-sm text-tactical-red/90">{errorMsg}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success' || !email}
              className="w-full bg-tactical-yellow text-tactical-bg py-4 rounded-xl font-black uppercase tracking-widest hover:bg-tactical-yellow/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : status === 'success' ? (
                'Acesso Liberado!'
              ) : (
                <>
                  Entrar na Base
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center flex items-center justify-center gap-2 text-tactical-gray text-xs">
          <ShieldAlert className="w-4 h-4" />
          Acesso exclusivo para assinantes ativos.
        </div>
      </motion.div>
    </div>
  );
}
