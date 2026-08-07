export enum SessionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  QUIZ_PENDING = 'QUIZ_PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ERROR = 'ERROR'
}

export interface SimulationState {
  history: any[];
  isMotorRunning: boolean;
  startTime: number;
  status: SessionStatus;
  currentNodeId: string;
  xp: number;
  score: number;
  error?: string | null;
  components: any[];
  case?: any; // Single Source of Truth reference
  quiz?: {
    currentQuestion: any;
    isCorrect: boolean | null;
  };
  report?: any;
}

