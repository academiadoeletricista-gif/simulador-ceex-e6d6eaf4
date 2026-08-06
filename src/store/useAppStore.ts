import { create } from 'zustand';

export interface UIState {
  theme: 'light' | 'dark';
  language: string;
  isSidebarOpen: boolean;
  isLoading: boolean;
  activeModals: Record<string, boolean>;
  cart: string[]; // Product IDs
}

interface AppState extends UIState {
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: string) => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  language: 'pt-BR',
  isSidebarOpen: true,
  isLoading: false,
  activeModals: {},
  cart: [],

  setTheme: (theme) => {
    set({ theme });
    // Persistent theme logic could be added here or in a hook
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  },

  setLanguage: (language) => set({ language }),
  
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  openModal: (modalId) => set((state) => ({
    activeModals: { ...state.activeModals, [modalId]: true }
  })),
  
  closeModal: (modalId) => set((state) => ({
    activeModals: { ...state.activeModals, [modalId]: false }
  })),
  
  toggleModal: (modalId) => set((state) => ({
    activeModals: { 
      ...state.activeModals, 
      [modalId]: !state.activeModals[modalId] 
    }
  })),

  addToCart: (productId) => set((state) => ({
    cart: [...state.cart, productId]
  })),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((id) => id !== productId)
  })),

  clearCart: () => set({ cart: [] }),
}));

// Export legacy types if needed by components during transition, 
// but they should be moved to proper type files
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

const LEVEL_TITLES: UserLevel[] = [
  'Aprendiz', 'Auxiliar', 'Técnico Júnior', 'Técnico Pleno', 'Técnico Sênior', 
  'Especialista', 'Engenheiro de Campo', 'Mestre em Diagnóstico', 'Lenda Industrial'
];

export const getLevelTitle = (level: number): UserLevel => {
  const titleIndex = Math.min(Math.floor(level / 5), LEVEL_TITLES.length - 1);
  return LEVEL_TITLES[titleIndex] || 'Aprendiz';
};
