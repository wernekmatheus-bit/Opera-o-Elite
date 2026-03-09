'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, Edit2, Shield, Target, Users, MapPin, Award, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useUserStore } from '../store/useUserStore';
import { supabase } from '../lib/supabase';

export default function PerfilPage() {
  const { profile, updateProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [state, setState] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [topPercentile, setTopPercentile] = useState<number | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '');
      setBio(profile.bio || '');
      setCurrentStatus(profile.current_status || '');
      setTargetRole(profile.target_role || '');
      setOrganization(profile.organization || '');
      setState(profile.state || '');
      setAvatarUrl(profile.avatar_url || '');
      fetchFollowStats();
      fetchPercentile();
    }
  }, [profile]);

  const fetchPercentile = async () => {
    if (!profile) return;
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get users with MORE XP than current user
      const { count: usersAbove } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt('xp', profile.xp);

      if (totalUsers && totalUsers > 0) {
        // Calculate percentage of people above you
        // If 0 people above you, you are top 1%
        let percent = Math.ceil(((usersAbove || 0) / totalUsers) * 100);
        if (percent === 0) percent = 1;
        setTopPercentile(percent);
      }
    } catch (error) {
      console.error('Erro ao calcular percentil:', error);
    }
  };

  const fetchFollowStats = async () => {
    if (!profile) return;

    try {
      // Seguidores (pessoas que me seguem)
      const { count: followers } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', profile.id);

      // Seguindo (pessoas que eu sigo)
      const { count: following } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', profile.id);

      setFollowersCount(followers || 0);
      setFollowingCount(following || 0);
    } catch (error) {
      console.error('Erro ao buscar stats de seguidores:', error);
    }
  };

  const handleSave = async () => {
    if (isEditing && profile) {
      await updateProfile({ 
        full_name: name,
        bio,
        current_status: currentStatus,
        target_role: targetRole,
        organization,
        state,
        avatar_url: avatarUrl
      });
    }
    setIsEditing(!isEditing);
  };

  const currentXP = profile?.xp || 0;
  const nextLevelXP = (profile?.level || 1) * 1000;
  const progressPercent = Math.min(100, Math.round((currentXP / nextLevelXP) * 100));
  const xpNeeded = nextLevelXP - currentXP;

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Perfil</h1>
          <p className="text-tactical-gray mt-1">Sua identidade tática.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors"
        >
          {isEditing ? 'Salvar' : <><Edit2 className="w-4 h-4" /> Editar</>}
        </button>
      </header>

      {/* Header Profile */}
      <div className="bg-tactical-panel border border-white/5 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-tactical-bg to-tactical-panel border-b border-white/5" />
        
        <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 mt-12">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-tactical-panel bg-tactical-bg overflow-hidden relative flex items-center justify-center">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-4xl font-bold text-tactical-gray">{name ? name.substring(0, 2).toUpperCase() : '??'}</span>
              )}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu Nome"
                  className="bg-tactical-bg border border-white/10 rounded-lg px-3 py-2 text-2xl font-bold text-white w-full max-w-xs focus:border-tactical-yellow focus:outline-none"
                />
                <input 
                  type="text" 
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="URL da sua foto (opcional)"
                  className="bg-tactical-bg border border-white/10 rounded-lg px-3 py-2 text-sm text-white w-full max-w-xs focus:border-tactical-yellow focus:outline-none block"
                />
              </div>
            ) : (
              <h2 className="text-3xl font-black uppercase tracking-tight">{name}</h2>
            )}
            
            {isEditing ? (
              <input 
                type="text" 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-tactical-bg border border-white/10 rounded-lg px-3 py-2 text-sm text-tactical-gray w-full mt-2 focus:border-tactical-yellow focus:outline-none"
              />
            ) : (
              <p className="text-tactical-gray mt-1">{bio}</p>
            )}
          </div>

          <div className="flex gap-6 mt-6 md:mt-0">
            <div className="text-center">
              <p className="text-2xl font-black text-white">{followersCount}</p>
              <p className="text-xs font-bold text-tactical-gray uppercase tracking-widest">Seguidores</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">{followingCount}</p>
              <p className="text-xs font-bold text-tactical-gray uppercase tracking-widest">Seguindo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Crachá / Objetivo */}
      <div className="bg-tactical-panel border border-tactical-yellow/30 rounded-2xl p-1 relative overflow-hidden shadow-[0_0_30px_rgba(255,204,0,0.05)]">
        <div className="absolute inset-0 bg-gradient-to-br from-tactical-yellow/5 to-transparent pointer-events-none" />
        
        <div className="bg-tactical-bg rounded-xl p-6 relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-tactical-yellow" />
              <h3 className="text-lg font-black uppercase tracking-widest">Identidade Tática</h3>
            </div>
            {topPercentile !== null && (
              <div className="px-3 py-1 bg-tactical-yellow/10 border border-tactical-yellow/30 rounded-full">
                <span className="text-xs font-bold text-tactical-yellow uppercase tracking-widest">Top {topPercentile}% Preparado</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-tactical-gray uppercase tracking-widest mb-1">Status Atual</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                    placeholder="Ex: Civil (Buscando a 1ª Farda)"
                    className="bg-tactical-bg border border-white/10 rounded-lg px-3 py-2 text-white w-full focus:border-tactical-yellow focus:outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-white bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="font-medium">{currentStatus || 'Não informado'}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-tactical-gray uppercase tracking-widest mb-1">Objetivo Principal</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Ex: Soldado PM"
                    className="bg-tactical-bg border border-white/10 rounded-lg px-3 py-2 text-white w-full focus:border-tactical-yellow focus:outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-white bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                    <Target className="w-4 h-4 text-tactical-yellow" />
                    <span className="font-medium">{targetRole || 'Não informado'}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-tactical-gray uppercase tracking-widest mb-1">Organização</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Ex: Polícia Militar (PMPR)"
                    className="bg-tactical-bg border border-white/10 rounded-lg px-3 py-2 text-white w-full focus:border-tactical-yellow focus:outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-white bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                    <Award className="w-4 h-4 text-tactical-yellow" />
                    <span className="font-medium">{organization || 'Não informado'}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-tactical-gray uppercase tracking-widest mb-1">Estado</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Ex: Paraná (PR)"
                    className="bg-tactical-bg border border-white/10 rounded-lg px-3 py-2 text-white w-full focus:border-tactical-yellow focus:outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-white bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                    <MapPin className="w-4 h-4 text-tactical-yellow" />
                    <span className="font-medium">{state || 'Não informado'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-xs font-bold text-tactical-gray uppercase tracking-widest">Patente Atual</p>
                <p className="text-lg font-black text-white">{profile?.rank || 'Recruta'} (Nível {profile?.level || 1})</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-tactical-gray uppercase tracking-widest">Próxima Patente</p>
                <p className="text-lg font-black text-tactical-yellow">Nível {(profile?.level || 1) + 1}</p>
              </div>
            </div>
            <div className="h-3 bg-tactical-panel rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-tactical-yellow/50 to-tactical-yellow relative"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
              </motion.div>
            </div>
            <p className="text-center text-xs text-tactical-gray mt-2">Faltam {xpNeeded} XP para a promoção</p>
          </div>
        </div>
      </div>
    </div>
  );
}
