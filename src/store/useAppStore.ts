import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'Diagnóstico' | 'Velocidade' | 'Precisão' | 'Persistência' | 'Comunidade' | 'Especialidade';
  rarity: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante' | 'Lendária';
  xpReward: number;
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

export interface StreakData {
  current: number;
  best: number;
  lastActivity: string | null;
  history: string[]; 
}

export interface SkillNode {
  id: string;
  name: string;
  category: 'Motores' | 'Contatores' | 'CLP' | 'Proteções' | 'Sensores' | 'Temporizadores' | 'Soft Starter' | 'Inversores';
  level: number;
  maxLevel: number;
  xp: number;
  nextLevelXp: number;
  unlocked: boolean;
  dependencies: string[];
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  xpReward: number;
  completed: boolean;
}

export interface Organization {
  id: string;
  name: string;
  departments: string[];
  teams: { id: string; name: string; memberCount: number }[];
  subscription: {
    plan: 'Free' | 'Starter' | 'Professional' | 'Enterprise';
    status: 'active' | 'past_due' | 'canceled';
    renewDate: string;
  };
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

export interface Case {
  id: string;
  title: string;
  category: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Especialista';
  xp: number;
  timeEstimate: string;
  description: string;
  symptoms: string[];
  checklist: string[];
  image: string;
  diagram?: string;
}

export interface CaseSession {
  caseId: string;
  currentStep: number;
  status: 'available' | 'in_progress' | 'completed';
  answers: Record<string, any>;
  startTime?: string;
}

interface AppState {
  // User Data
  userName: string;
  userAvatar: string;
  userPhone: string;
  userBio: string;
  userCity: string;
  userState: string;
  userCompany: string;
  xp: number;
  level: number;
  levelTitle: UserLevel;
  nextLevelXp: number;
  
  // Settings
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  
  // B2B & Billing
  organization: Organization | null;
  marketplace: Product[];
  cart: string[];
  
  // Stats
  streak: StreakData;
  accuracy: number;
  totalDiagnoses: number;
  avgTime: number; 
  
  // Progression
  badges: Badge[];
  userBadges: string[];
  achievements: Achievement[];
  dailyChallenges: DailyChallenge[];
  skillTree: SkillNode[];
  
  // Core Game State
  sessions: Record<string, CaseSession>;
  
  // Actions
  addXp: (amount: number) => void;
  completeChallenge: (id: string) => void;
  unlockBadge: (id: string) => void;
  recordActivity: () => void;
  updateSkill: (id: string, xpAmount: number) => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  
  // Profile Actions
  updateProfile: (data: Partial<{
    userName: string;
    userAvatar: string;
    userPhone: string;
    userBio: string;
    userCity: string;
    userState: string;
    userCompany: string;
  }>) => void;
  
  // Settings Actions
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: string) => void;
  toggleNotifications: () => void;
  
  // Case Actions
  startCase: (caseId: string) => void;
  completeCase: (caseId: string, success: boolean, timeTaken: number) => void;
}

const INITIAL_SKILLS: SkillNode[] = [
  { id: 'mot-1', name: 'Motores de Indução', category: 'Motores', level: 1, maxLevel: 10, xp: 120, nextLevelXp: 500, unlocked: true, dependencies: [] },
  { id: 'con-1', name: 'Dimensionamento de Contatores', category: 'Contatores', level: 2, maxLevel: 10, xp: 450, nextLevelXp: 800, unlocked: true, dependencies: [] },
  { id: 'clp-1', name: 'Lógica Ladder Básica', category: 'CLP', level: 0, maxLevel: 10, xp: 0, nextLevelXp: 300, unlocked: false, dependencies: ['con-1'] },
  { id: 'prot-1', name: 'Relés de Sobrecarga', category: 'Proteções', level: 3, maxLevel: 10, xp: 200, nextLevelXp: 1200, unlocked: true, dependencies: [] },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'Primeiro Diagnóstico', description: 'Complete seu primeiro caso com sucesso.', progress: 1, maxProgress: 1, completed: true, xpReward: 100 },
  { id: '2', title: 'Mestre da Velocidade', description: 'Resolva 5 casos em menos de 3 minutos cada.', progress: 2, maxProgress: 5, completed: false, xpReward: 500 },
  { id: '3', title: 'Perfeccionista', description: 'Alcance 100% de precisão em 10 casos seguidos.', progress: 4, maxProgress: 10, completed: false, xpReward: 1000 },
];

const LEVEL_TITLES: UserLevel[] = [
  'Aprendiz', 'Auxiliar', 'Técnico Júnior', 'Técnico Pleno', 'Técnico Sênior', 
  'Especialista', 'Engenheiro de Campo', 'Mestre em Diagnóstico', 'Lenda Industrial'
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userName: 'Eng. Carlos Alberto',
      userAvatar: '',
      userPhone: '(11) 98765-4321',
      userBio: 'Especialista em comandos elétricos e automação industrial.',
      userCity: 'São Paulo',
      userState: 'SP',
      userCompany: 'Industrial Tech',
      xp: 2450,
      level: 12,
      levelTitle: 'Técnico Pleno',
      nextLevelXp: 3000,
      
      theme: 'dark',
      language: 'pt-br',
      notifications: true,
      
      organization: {
        id: 'org-1',
        name: 'Indústrias Metalúrgicas S.A.',
        departments: ['Manutenção Elétrica', 'Automação', 'Engenharia de Campo'],
        teams: [
          { id: 't1', name: 'Turno A', memberCount: 12 },
          { id: 't2', name: 'Turno B', memberCount: 15 },
          { id: 't3', name: 'Especialistas', memberCount: 5 },
        ],
        subscription: {
          plan: 'Professional',
          status: 'active',
          renewDate: '2026-09-15',
        }
      },
      marketplace: [
        { id: '1', title: 'Curso Avançado CLP', price: 2500, type: 'Curso', rating: 4.8 },
        { id: '2', title: 'Biblioteca de Simbologia', price: 500, type: 'Biblioteca', rating: 4.5 },
        { id: '3', title: 'Simulador de Falhas 3D', price: 5000, type: 'Simulador', rating: 4.9 },
        { id: '4', title: 'Mentoria Técnica Individual', price: 10000, type: 'Mentoria', rating: 5.0 },
      ],
      cart: [],
      
      streak: {
        current: 7,
        best: 15,
        lastActivity: new Date().toISOString(),
        history: [],
      },
      accuracy: 98,
      totalDiagnoses: 42,
      avgTime: 252, 
      
      badges: [], 
      userBadges: ['badge-1', 'badge-3'],
      achievements: INITIAL_ACHIEVEMENTS,
      dailyChallenges: [
        { id: 'd1', title: 'Curto-Circuito em Bobina', description: 'Identifique a bobina queimada no contator K1.', difficulty: 'Médio', xpReward: 250, completed: false },
        { id: 'd2', title: 'Leitura de Diagrama', description: 'Responda 5 perguntas sobre o diagrama trifásico.', difficulty: 'Fácil', xpReward: 100, completed: true },
      ],
      skillTree: INITIAL_SKILLS,
      sessions: {},
      
      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        let newLevel = state.level;
        let newNextXp = state.nextLevelXp;
        
        while (newXp >= newNextXp) {
          newLevel += 1;
          newNextXp = Math.floor(newNextXp * 1.2);
        }
        
        const titleIndex = Math.min(Math.floor(newLevel / 5), LEVEL_TITLES.length - 1);
        const levelTitle = LEVEL_TITLES[titleIndex] as UserLevel;
        
        return { 
          xp: newXp, 
          level: newLevel, 
          nextLevelXp: newNextXp,
          levelTitle
        };
      }),
      
      completeChallenge: (id) => set((state) => ({
        dailyChallenges: state.dailyChallenges.map(c => 
          c.id === id ? { ...c, completed: true } : c
        )
      })),
      
      unlockBadge: (id) => set((state) => ({
        userBadges: [...state.userBadges, id]
      })),
      
      recordActivity: () => set((state) => {
        const now = new Date();
        const last = state.streak.lastActivity ? new Date(state.streak.lastActivity) : null;
        
        let newCurrent = state.streak.current;
        if (last) {
          const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 3600 * 24));
          if (diffDays === 1) newCurrent += 1;
          else if (diffDays > 1) newCurrent = 1;
        } else {
          newCurrent = 1;
        }
        
        return {
          streak: {
            ...state.streak,
            current: newCurrent,
            best: Math.max(newCurrent, state.streak.best),
            lastActivity: now.toISOString()
          }
        };
      }),

      updateSkill: (id, xpAmount) => set((state) => ({
        skillTree: state.skillTree.map(node => {
          if (node.id === id) {
            const newXp = node.xp + xpAmount;
            let newLevel = node.level;
            let newNext = node.nextLevelXp;
            if (newXp >= node.nextLevelXp) {
              newLevel = Math.min(newLevel + 1, node.maxLevel);
              newNext = Math.floor(node.nextLevelXp * 1.5);
            }
            return { ...node, xp: newXp, level: newLevel, nextLevelXp: newNext };
          }
          return node;
        })
      })),

      addToCart: (id) => set((state) => ({
        cart: state.cart.includes(id) ? state.cart : [...state.cart, id]
      })),

      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(itemId => itemId !== id)
      })),

      updateProfile: (data) => set((state) => ({ ...state, ...data })),
      
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),

      startCase: (caseId) => set((state) => ({
        sessions: {
          ...state.sessions,
          [caseId]: {
            caseId,
            currentStep: 0,
            status: 'in_progress',
            answers: {},
            startTime: new Date().toISOString()
          }
        }
      })),

      completeCase: (caseId, success, timeTaken) => set((state) => {
        const session = state.sessions[caseId];
        if (!session) return state;

        const newTotalDiagnoses = state.totalDiagnoses + 1;
        const newAccuracy = success ? (state.accuracy * state.totalDiagnoses + 100) / newTotalDiagnoses : (state.accuracy * state.totalDiagnoses) / newTotalDiagnoses;
        const newAvgTime = (state.avgTime * state.totalDiagnoses + timeTaken) / newTotalDiagnoses;

        return {
          totalDiagnoses: newTotalDiagnoses,
          accuracy: Number(newAccuracy.toFixed(1)),
          avgTime: Math.floor(newAvgTime),
          sessions: {
            ...state.sessions,
            [caseId]: {
              ...session,
              status: 'completed'
            }
          }
        };
      })
    }),
    {
      name: 'industrial-lab-storage',
    }
  )
);
