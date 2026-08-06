import { create } from 'zustand';

interface AppState {
  xp: number;
  level: number;
  streak: number;
  addXp: (amount: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  xp: 2450,
  level: 12,
  streak: 7,
  addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
}));
