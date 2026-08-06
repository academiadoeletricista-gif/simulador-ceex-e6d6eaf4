export interface TechnicalReport {
  sessionId: string;
  laboratoryName: string;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  injectedFault: string;
  inspectedComponents: string[];
  measurementsCount: number;
  quizScore: number;
  totalXP: number;
  performanceGrade: 'S' | 'A' | 'B' | 'C' | 'D';
  recommendations: string[];
}
