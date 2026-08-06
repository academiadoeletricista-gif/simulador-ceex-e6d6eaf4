import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Laboratory } from '@/types/laboratory';


export type UserLevel = 
  | 'Aprendiz' 
  | 'Auxiliar' 
  | 'Técnico Júnior' 
  | 'Técnico Pleno' 
  | 'Técnico Sênior' 
  | 'Especialista' 
  | 'Engenheiro de Campo' 
  | 'Mestre em Diagnóstico' 
  | 'Lenda Industrial';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  phone: string;
  bio: string;
  city: string;
  state: string;
  company: string;
  role: string;
  language: string;
  theme: 'light' | 'dark';
  xp: number;
  level: number;
  accuracy: number;
  total_diagnoses: number;
  avg_time: number;
  streak_current: number;
  streak_best: number;
  last_activity: string | null;
  notifications?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  xpReward: number;
}

export interface Case {
  id: string;
  slug: string;
  title: string;
  category: string;
  level: string;
  xp_reward: number;
  time_estimate: string;
  description: string;
  symptoms: string[];
  checklist: string[];
  image_url: string;
  diagram_url: string | null;
  content?: any;
}

export interface CaseSession {
  case_id: string;
  status: 'in_progress' | 'completed';
  current_step: number;
  answers: Record<string, any>;
  start_time: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  type: 'Curso' | 'Biblioteca' | 'Simulador' | 'Mentoria' | 'Plano' | 'Certificação';
  rating: number;
  image?: string;
  description?: string;
}

interface AppState {
  profile: Profile | null;
  cases: Case[];
  laboratories: Laboratory[];
  sessions: Record<string, CaseSession>;

  achievements: Achievement[];
  marketplace: Product[];
  cart: string[];
  isLoading: boolean;
  
  // Actions
  fetchInitialData: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  startCase: (caseId: string) => Promise<void>;
  completeCase: (caseId: string, success: boolean, timeTaken: number) => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  signOut: () => Promise<void>;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
  setLanguage: (lang: string) => Promise<void>;
  toggleNotifications: () => Promise<void>;
}

const LEVEL_TITLES: UserLevel[] = [
  'Aprendiz', 'Auxiliar', 'Técnico Júnior', 'Técnico Pleno', 'Técnico Sênior', 
  'Especialista', 'Engenheiro de Campo', 'Mestre em Diagnóstico', 'Lenda Industrial'
];

export const getLevelTitle = (level: number): UserLevel => {
  const titleIndex = Math.min(Math.floor(level / 5), LEVEL_TITLES.length - 1);
  return LEVEL_TITLES[titleIndex] || 'Aprendiz';
};

export const useAppStore = create<AppState>((set, get) => ({
  profile: null,
  cases: [],
  laboratories: [],
  sessions: {},

  achievements: [],
  marketplace: [],
  cart: [],
  isLoading: false,

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ profile: null, sessions: {}, isLoading: false });
        return;
      }

      // Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch Laboratories
      const { data: labsData } = await supabase
        .from('laboratories')
        .select('*')
        .eq('published', true);

      // Fetch Cases
      const { data: casesData } = await supabase
        .from('cases')
        .select('*')
        .eq('published', true);


      // Fetch Sessions
      const { data: sessionsData } = await supabase
        .from('case_sessions')
        .select('*')
        .eq('user_id', user.id);

      const sessionsMap: Record<string, CaseSession> = {};
      sessionsData?.forEach(s => {
        sessionsMap[s.case_id] = {
          case_id: s.case_id,
          status: s.status as any,
          current_step: s.current_step || 0,
          answers: (s.answers as any) || {},
          start_time: s.start_time || new Date().toISOString()
        };
      });

      const formattedCases: Case[] = (casesData || []).map(c => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        category: c.category,
        level: c.level,
        xp_reward: c.xp_reward,
        time_estimate: c.time_estimate,
        description: c.description || '',
        symptoms: c.symptoms || [],
        checklist: c.checklist || [],
        image_url: c.image_url || '',
        diagram_url: c.diagram_url as string | null,
        content: c.content
      }));

      const formattedLabs: Laboratory[] = (labsData || []).map(l => ({
        id: l.id,
        code: l.code,
        name: l.name,
        description: l.description || '',
        learningObjectives: l.learning_objectives || [],
        prerequisites: l.prerequisites || [],
        level: l.level as any,
        estimatedTime: l.estimated_time || '',
        totalXp: l.total_xp || 0,
        defectCount: (casesData || []).filter(c => c.laboratory_id === l.id).length,
        progress: 0, // Calculate later
        averageAccuracy: 0,
        bestStreak: 0,
        achievements: [],
        baseCircuit: l.base_circuit_data || {},
        panel: l.panel_data || {},
        components: l.components || [],
        measurementMap: l.measurements || []
      }));

      set({ 
        profile: profile as any, 
        laboratories: formattedLabs,
        cases: formattedCases, 
        sessions: sessionsMap,
        isLoading: false 
      });

    } catch (error) {
      console.error('Error fetching initial data:', error);
      set({ isLoading: false });
    }
  },

  updateProfile: async (data) => {
    const { profile } = get();
    if (!profile) return;

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', profile.id);

    if (!error) {
      set({ profile: { ...profile, ...data } });
    }
  },

  startCase: async (caseId) => {
    const { profile, sessions } = get();
    if (!profile) return;

    if (sessions[caseId]) return;

    const newSession = {
      user_id: profile.id,
      case_id: caseId,
      status: 'in_progress',
      current_step: 0,
      answers: {},
      start_time: new Date().toISOString()
    };

    const { error } = await supabase
      .from('case_sessions')
      .upsert(newSession, { onConflict: 'user_id,case_id' });

    if (!error) {
      set({
        sessions: {
          ...sessions,
          [caseId]: {
            case_id: caseId,
            status: 'in_progress',
            current_step: 0,
            answers: {},
            start_time: newSession.start_time
          }
        }
      });
    }
  },

  completeCase: async (caseId, success, timeTaken) => {
    const { profile, sessions } = get();
    if (!profile || !sessions[caseId]) return;

    const newTotalDiagnoses = (profile.total_diagnoses || 0) + 1;
    const currentAccuracy = Number(profile.accuracy) || 0;
    const newAccuracy = success 
      ? (currentAccuracy * (profile.total_diagnoses || 0) + 100) / newTotalDiagnoses 
      : (currentAccuracy * (profile.total_diagnoses || 0)) / newTotalDiagnoses;
    
    const newAvgTime = ((profile.avg_time || 0) * (profile.total_diagnoses || 0) + timeTaken) / newTotalDiagnoses;
    
    const caseObj = get().cases.find(c => c.id === caseId);
    const xpReward = caseObj?.xp_reward || 0;
    const newXp = (profile.xp || 0) + xpReward;
    const newLevel = Math.floor(newXp / 1000) + 1;

    const profileUpdate = {
      total_diagnoses: newTotalDiagnoses,
      accuracy: Number(newAccuracy.toFixed(1)),
      avg_time: Math.floor(newAvgTime),
      xp: newXp,
      level: newLevel,
      last_activity: new Date().toISOString()
    };

    const { error: sessionError } = await supabase
      .from('case_sessions')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('user_id', profile.id)
      .eq('case_id', caseId);

    if (sessionError) return;

    const { error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdate)
      .eq('id', profile.id);

    if (!profileError) {
      set({
        profile: { ...profile, ...profileUpdate },
        sessions: {
          ...sessions,
          [caseId]: {
            ...sessions[caseId],
            status: 'completed'
          }
        }
      });
    }
  },

  addXp: async (amount) => {
    const { profile } = get();
    if (!profile) return;

    const newXp = (profile.xp || 0) + amount;
    const newLevel = Math.floor(newXp / 1000) + 1;

    const { error } = await supabase
      .from('profiles')
      .update({ xp: newXp, level: newLevel })
      .eq('id', profile.id);

    if (!error) {
      set({ profile: { ...profile, xp: newXp, level: newLevel } });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ profile: null, sessions: {}, cases: [] });
  },

  addToCart: (id) => set((state) => ({
    cart: state.cart.includes(id) ? state.cart : [...state.cart, id]
  })),

  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter(itemId => itemId !== id)
  })),

  setTheme: async (theme) => {
    const { profile } = get();
    if (profile) {
      await supabase.from('profiles').update({ theme }).eq('id', profile.id);
      set({ profile: { ...profile, theme } });
    }
  },

  setLanguage: async (language) => {
    const { profile } = get();
    if (profile) {
      await supabase.from('profiles').update({ language }).eq('id', profile.id);
      set({ profile: { ...profile, language } });
    }
  },

  toggleNotifications: async () => {
    const { profile } = get();
    if (profile) {
      const notifications = !profile.notifications;
      // Note: notifications is a virtual property in UI for now, 
      // or we can add it to profiles table if needed.
      set({ profile: { ...profile, notifications } });
    }
  }
}));
