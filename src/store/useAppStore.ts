import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

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
  diagram_url?: string;
  content?: any;
}

export interface CaseSession {
  case_id: string;
  status: 'in_progress' | 'completed';
  current_step: number;
  answers: Record<string, any>;
  start_time: string;
}

interface AppState {
  profile: Profile | null;
  cases: Case[];
  sessions: Record<string, CaseSession>;
  isLoading: boolean;
  
  // Actions
  fetchInitialData: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  startCase: (caseId: string) => Promise<void>;
  completeCase: (caseId: string, success: boolean, timeTaken: number) => Promise<void>;
  signOut: () => Promise<void>;
}

const LEVEL_TITLES: UserLevel[] = [
  'Aprendiz', 'Auxiliar', 'Técnico Júnior', 'Técnico Pleno', 'Técnico Sênior', 
  'Especialista', 'Engenheiro de Campo', 'Mestre em Diagnóstico', 'Lenda Industrial'
];

export const getLevelTitle = (level: number): UserLevel => {
  const titleIndex = Math.min(Math.floor(level / 5), LEVEL_TITLES.length - 1);
  return LEVEL_TITLES[titleIndex];
};

export const useAppStore = create<AppState>((set, get) => ({
  profile: null,
  cases: [],
  sessions: {},
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

      // Fetch Cases
      const { data: cases } = await supabase
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
          current_step: s.current_step,
          answers: s.answers as any,
          start_time: s.start_time
        };
      });

      set({ 
        profile: profile as any, 
        cases: cases || [], 
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

    // Check if session already exists
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

    const newTotalDiagnoses = profile.total_diagnoses + 1;
    const currentAccuracy = Number(profile.accuracy) || 0;
    const newAccuracy = success 
      ? (currentAccuracy * profile.total_diagnoses + 100) / newTotalDiagnoses 
      : (currentAccuracy * profile.total_diagnoses) / newTotalDiagnoses;
    
    const newAvgTime = (profile.avg_time * profile.total_diagnoses + timeTaken) / newTotalDiagnoses;
    
    // XP Logic
    const caseObj = get().cases.find(c => c.id === caseId);
    const xpReward = caseObj?.xp_reward || 0;
    const newXp = profile.xp + xpReward;
    
    // Simple level logic: every 1000 XP is a level
    const newLevel = Math.floor(newXp / 1000) + 1;

    const profileUpdate = {
      total_diagnoses: newTotalDiagnoses,
      accuracy: Number(newAccuracy.toFixed(1)),
      avg_time: Math.floor(newAvgTime),
      xp: newXp,
      level: newLevel,
      last_activity: new Date().toISOString()
    };

    // Update Session
    const { error: sessionError } = await supabase
      .from('case_sessions')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('user_id', profile.id)
      .eq('case_id', caseId);

    if (sessionError) return;

    // Update Profile
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

  signOut: async () => {
    await supabase.auth.signOut();
    set({ profile: null, sessions: {}, cases: [] });
  }
}));
