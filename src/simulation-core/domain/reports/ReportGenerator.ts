import { TechnicalReport } from './ReportTypes';
import { SimulationState } from '../sessions/SimulationSession';

export class ReportGenerator {
  static generate(state: SimulationState, laboratoryName: string): TechnicalReport {
    const duration = Math.floor((Date.now() - state.startTime) / 1000);
    
    const measurementsCount = state.history.filter(h => h.type === 'MEASUREMENT').length;
    const inspected = state.collectedEvidence.map(e => e.label);
    
    // Logic for grade based on time and efficiency
    let grade: TechnicalReport['performanceGrade'] = 'B';
    if (duration < 300 && measurementsCount < 10) grade = 'S';
    else if (duration < 600) grade = 'A';
    
    return {
      sessionId: 'sess_' + Math.random().toString(36).substr(2, 9),
      laboratoryName,
      startTime: state.startTime,
      endTime: Date.now(),
      durationSeconds: duration,
      injectedFault: state.currentNodeId,
      inspectedComponents: inspected,
      measurementsCount,
      quizScore: state.score,
      totalXP: state.xp,
      performanceGrade: grade,
      recommendations: this.getRecommendations(state)
    };
  }

  private static getRecommendations(state: SimulationState): string[] {
    const recs = [];
    if (state.score < 70) recs.push('Revise a teoria de componentes antes da próxima prática.');
    if (state.history.length > 20) recs.push('Tente ser mais assertivo nas decisões para reduzir o tempo de diagnóstico.');
    return recs;
  }
}

