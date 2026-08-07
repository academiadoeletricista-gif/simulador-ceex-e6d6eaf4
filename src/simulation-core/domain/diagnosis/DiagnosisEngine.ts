import { SimulationState, SessionStatus } from '../sessions/SimulationSession';
import { DiagnosticCase } from '@/types/diagnosis';
import { ScenarioRuntime } from '../scenario/ScenarioRuntime';
import { ScenarioState, ScenarioStatus } from '../scenario/ScenarioState';


export class DiagnosisEngine {
  private runtime: ScenarioRuntime | null = null;
  private currentCase: DiagnosticCase | null = null;
  private status: SessionStatus = SessionStatus.IN_PROGRESS;
  private errorMessage: string | null = null;

  constructor() {}
 
  loadCase(caseData: DiagnosticCase) {
    try {
      console.log(`[DiagnosisEngine] Loading Scenario with ScenarioRuntime: ${caseData.code}`);
      this.currentCase = caseData;
      // Note: In a real app, sessionId would come from persistence
      this.runtime = new ScenarioRuntime(crypto.randomUUID(), caseData.id);
      this.runtime.loadCase(caseData);
      this.status = SessionStatus.IN_PROGRESS;
      this.errorMessage = null;
    } catch (error: any) {
      console.error(`[DiagnosisEngine] CRITICAL ERROR during case loading:`, error);
      this.status = SessionStatus.ERROR;
      this.errorMessage = error.message;
      throw error; 
    }
  }
 
  selectHypothesis(hypothesisId: string) {
    if (this.status === SessionStatus.COMPLETED || !this.runtime) return;
    this.runtime.selectHypothesis(hypothesisId);
  }
 
  performAction(actionId: string, params: any = {}) {
    if (this.status === SessionStatus.COMPLETED || !this.runtime) return;

    console.log(`[DiagnosisEngine] Executing Action via Runtime: ${actionId}`, params);
    this.runtime.performAction(actionId, params);
    
    const state = this.runtime.getState();
    if (state.status === 'COMPLETED') {
      this.status = SessionStatus.COMPLETED;
    } else if (state.status === 'ERROR') {
      this.status = SessionStatus.ERROR;
      this.errorMessage = state.error || 'Unknown runtime error';
    }
  }

  useHint() {
    // Legacy mapping or runtime implementation
    console.log("[DiagnosisEngine] useHint called (pending runtime implementation)");
  }

  collectEvidence(evidenceId: string) {
    if (!this.runtime) return;
    // Current runtime handles evidence through actions like INSPECT
    this.runtime.performAction('inspect_visual', { target: evidenceId });
  }

  getState(): SimulationState | null {
    if (!this.currentCase || !this.runtime) {
      return this.status === SessionStatus.ERROR ? {
        status: SessionStatus.ERROR,
        error: this.errorMessage,
        startTime: Date.now(),
        xp: 0,
        score: 0,
        history: [],
        case: {} as any,
        currentNodeId: 'error',
        currentHypotheses: [],
        collectedEvidence: [],
        unlockedTools: [],
        activeHints: [],
        measurementPoints: [],
        timer: 0
      } : null;
    }

    const scenario = this.runtime.getState();

    // Map ScenarioState to legacy SimulationState for UI compatibility
    return {
      status: this.mapStatus(scenario.status),
      startTime: new Date(scenario.startedAt).getTime(),
      xp: scenario.xp,
      score: scenario.score,
      error: scenario.error || this.errorMessage,
      history: scenario.actions.map(a => ({
        type: a.type,
        description: a.label,
        timestamp: new Date(a.timestamp).getTime(),
        points: a.xpReward
      })),
      case: this.currentCase,
      currentNodeId: scenario.currentStepId || 'start',
      selectedHypothesisId: scenario.hypotheses.find(h => h.status === 'PENDING')?.id || null, 
      confirmedRootCause: scenario.hypotheses.some(h => h.isRootCause && h.status === 'CONFIRMED'),
      currentHypotheses: scenario.hypotheses.map(h => ({
        id: h.id,
        label: h.title,
        confidence: (h as any).confidence || (h.status === 'CONFIRMED' ? 100 : (h.status === 'DISCARDED' ? 0 : 50)),
        description: h.description,
        status: h.status.toLowerCase() as any
      })),
      collectedEvidence: scenario.evidence.map(e => ({
        id: e.id,
        type: e.type,
        label: e.label,
        value: e.value
      })),
      unlockedTools: scenario.availableTools.map(t => t.label),
      activeHints: [],
      measurementPoints: this.getMeasurementPoints(this.currentCase),
      timer: Math.floor((Date.now() - new Date(scenario.startedAt).getTime()) / 1000)
    };
  }

  private getMeasurementPoints(caseData: DiagnosticCase): string[] {
    if (caseData.code === 'PD-001') {
      return ['L1-N', 'F1_in-F1_out', '95-96', 'Start-A1', 'K1_A1-K1_A2'];
    }
    
    if (caseData.topology === 'Reversing') {
       return ['L1-L2', 'L2-L3', 'L1-L3', 'F1_in-F1_out', 'K1_1-K1_2', 'K2_1-K2_2', 'Motor_U-Motor_V'];
    }
    
    return ['L1-N', 'F1_in-F1_out', '95-96', 'Start-A1', 'K1_A1-K1_A2'];
  }

  private mapStatus(status: ScenarioStatus): SessionStatus {
    switch (status) {
      case 'COMPLETED': return SessionStatus.COMPLETED;
      case 'ERROR': return SessionStatus.ERROR;
      default: return SessionStatus.IN_PROGRESS;
    }
  }
}
