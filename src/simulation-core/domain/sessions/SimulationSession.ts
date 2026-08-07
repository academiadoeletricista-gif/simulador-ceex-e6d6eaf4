import { DiagnosticCase } from '@/types/diagnosis';

export enum SessionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ERROR = 'ERROR'
}

export interface SimulationState {
  status: SessionStatus;
  startTime: number;
  endTime?: number;
  xp: number;
  score: number;
  error?: string | null;
  history: Array<{
    type: string;
    description: string;
    timestamp: number;
    points?: number;
  }>;
  case: DiagnosticCase;
  
  // Scenario Engine state
  currentNodeId: string;
  currentHypotheses: Array<{
    id: string;
    label: string;
    confidence: number;
  }>;
  collectedEvidence: Array<{
    id: string;
    type: 'visual' | 'measurement' | 'inspection' | 'document';
    label: string;
    value: string;
  }>;
  unlockedTools: string[];
  activeHints: string[];
  timer: number;
}
