import { DiagnosisEngine } from '../domain/diagnosis/DiagnosisEngine';
import { SimulationState } from '../domain/sessions/SimulationSession';
import { DiagnosticCase } from '@/types/diagnosis';

export class SimulationAPI {
  private static instance: SimulationAPI;
  private engine: DiagnosisEngine;

  private constructor() {
    this.engine = new DiagnosisEngine();
  }

  public static getInstance(): SimulationAPI {
    if (!SimulationAPI.instance) {
      SimulationAPI.instance = new SimulationAPI();
    }
    return SimulationAPI.instance;
  }

  public createSession(caseData: DiagnosticCase) {
    try {
      console.log(`[SimulationAPI] Creating new scenario session for case: ${caseData?.id}`);
      this.engine = new DiagnosisEngine();
      this.engine.loadCase(caseData);
    } catch (error) {
      console.error(`[SimulationAPI] Error creating session:`, error);
    }
  }

  public getSessionState(): SimulationState {
    return this.engine.getState();
  }

  public executeAction(actionId: string, params: any = {}) {
    this.engine.performAction(actionId, params);
  }

  public collectEvidence(evidenceId: string) {
    this.engine.collectEvidence(evidenceId);
  }

  // Backwards compatibility or future use
  public measure(nodeId1: string, nodeId2: string): number {
    return 0; 
  }

  public answerQuiz(optionIndex: number) {
    // Handled by decision nodes in new engine
  }

  public async saveSession(sessionId: string, userId: string) {
    console.log(`Saving session ${sessionId} for user ${userId}`);
  }
}

