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
  history: string[]; // dates of activity
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

interface AppState {
  // User Progression
  userName: string;
  xp: number;
  level: number;
  levelTitle: UserLevel;
  nextLevelXp: number;
  
  // B2B & Billing
  organization: Organization | null;
  marketplace: Product[];
  cart: string[]; // product ids
  
  // Stats
  streak: StreakData;
  accuracy: number;
  totalDiagnoses: number;
  avgTime: number; // in seconds
  
  // Gamification
  badges: Badge[];
  userBadges: string[]; // badge ids
  achievements: Achievement[];
  dailyChallenges: DailyChallenge[];
  skillTree: SkillNode[];
  
  // Actions
  addXp: (amount: number) => void;
  completeChallenge: (id: string) => void;
  unlockBadge: (id: string) => void;
  recordActivity: () => void;
  updateSkill: (id: string, xpAmount: number) => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
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
      xp: 2450,
      level: 12,
      levelTitle: 'Técnico Pleno',
      nextLevelXp: 3000,
      
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
      avgTime: 252, // 4.2 min
      
      badges: [], // Would be populated with master list
      userBadges: ['badge-1', 'badge-3'],
      achievements: INITIAL_ACHIEVEMENTS,
      dailyChallenges: [
        { id: 'd1', title: 'Curto-Circuito em Bobina', description: 'Identifique a bobina queimada no contator K1.', difficulty: 'Médio', xpReward: 250, completed: false },
        { id: 'd2', title: 'Leitura de Diagrama', description: 'Responda 5 perguntas sobre o diagrama trifásico.', difficulty: 'Fácil', xpReward: 100, completed: true },
      ],
      skillTree: INITIAL_SKILLS,
      
      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        let newLevel = state.level;
        let newNextXp = state.nextLevelXp;
        
        if (newXp >= state.nextLevelXp) {
          newLevel += 1;
          newNextXp = Math.floor(state.nextLevelXp * 1.2);
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
      }))
    }),
    {
      name: 'industrial-lab-storage',
    }
  )
);
