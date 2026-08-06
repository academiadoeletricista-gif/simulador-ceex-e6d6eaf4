export * from './laboratory';
export * from './enterprise';
export * from './assets';

export interface Case {
  id: string;
  title: string;
  category: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Especialista';
  xp: number;
  timeEstimate: string;
  image: string;
  description: string;
  symptoms: string[];
  checklist: string[];
}

export interface UserProfile {
  name: string;
  avatar: string;
  xp: number;
  level: number;
  rank: number;
  accuracy: number;
  avgTime: string;
  medals: number;
}

