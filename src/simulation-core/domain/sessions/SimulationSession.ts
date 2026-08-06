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
  components: any[];
  quiz?: {
    currentQuestion: any;
    isCorrect: boolean | null;
  };
  report?: any;
}
