export enum SessionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface SimulationState {
  history: any[];
  isMotorRunning: boolean;
  startTime: number;
  components: any[];
  status: SessionStatus;
  currentNodeId: string;
  xp: number;
  score: number;
}
