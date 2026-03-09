import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
  rank: string;
  created_at: string;
  taf_quiz_done: boolean;
  exam_date: string | null;
  bio: string | null;
  current_status: string | null;
  target_role: string | null;
  organization: string | null;
  state: string | null;
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      // Tenta buscar o perfil
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code === 'PGRST116') {
        // Perfil não existe, vamos criar um novo
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            { 
              email, 
              full_name: email.split('@')[0], // Nome padrão baseado no email
              xp: 0,
              level: 1,
              rank: 'Recruta',
              taf_quiz_done: false,
              exam_date: null,
              bio: '',
              current_status: '',
              target_role: '',
              organization: '',
              state: ''
            }
          ])
          .select()
          .single();

        if (insertError) throw insertError;
        profile = newProfile;
      } else if (error) {
        throw error;
      }

      set({ profile, isLoading: false });
    } catch (error: any) {
      console.error('Erro ao buscar/criar perfil:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const { profile } = get();
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;
      set({ profile: data });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  }
}));
