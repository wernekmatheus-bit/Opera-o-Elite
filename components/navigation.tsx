'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Target, BookOpen, Crosshair, Users } from 'lucide-react';
import { motion } from 'motion/react';

const navItems = [
  { name: 'QG', href: '/qg', icon: Home },
  { name: 'Operação', href: '/operacao', icon: Target },
  { name: 'Academia', href: '/academia', icon: BookOpen },
  { name: 'Estande', href: '/estande', icon: Crosshair },
  { name: 'Comunidade', href: '/comunidade', icon: Users },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-tactical-panel border-b border-white/5 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-tactical-yellow" />
          <span className="font-black uppercase tracking-tighter text-lg">
            Operação <span className="text-tactical-yellow">Elite</span>
          </span>
        </div>
        <Link href="/perfil" className="w-8 h-8 rounded-full bg-tactical-gray/30 flex items-center justify-center border border-white/10">
          <span className="text-xs font-bold text-white">AL</span>
        </Link>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-tactical-panel border-t border-white/5 pb-safe z-50">
        <ul className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name} className="relative flex-1 h-full">
                <Link 
                  href={item.href}
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                    isActive ? 'text-tactical-yellow' : 'text-tactical-gray hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium tracking-wider uppercase">{item.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="mobile-active"
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-tactical-yellow rounded-b-md"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 fixed top-0 left-0 bottom-0 bg-tactical-panel border-r border-white/5 z-50">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tighter uppercase text-white flex items-center gap-2">
            <Target className="w-8 h-8 text-tactical-yellow" />
            Operação <span className="text-tactical-yellow">Elite</span>
          </h1>
        </div>
        
        <ul className="flex-1 px-4 space-y-2 mt-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name} className="relative">
                <Link 
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'text-tactical-yellow bg-tactical-yellow/10' 
                      : 'text-tactical-gray hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium tracking-wide uppercase text-sm">{item.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="desktop-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-tactical-yellow rounded-r-md"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        
        <div className="p-4 border-t border-white/5">
          <Link href="/perfil" className="flex items-center gap-3 px-4 py-3 rounded-md bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 rounded-full bg-tactical-gray/30 flex items-center justify-center">
              <span className="text-xs font-bold text-white">AL</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Aluno 01</p>
              <p className="text-xs text-tactical-gold truncate">Soldado 2ª Classe</p>
            </div>
          </Link>
        </div>
      </nav>
    </>
  );
}
