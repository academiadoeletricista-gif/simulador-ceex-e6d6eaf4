import { DiagnosisEngine, FaultType } from '../domain/diagnosis/DiagnosisEngine';
import { SimulationState } from '../domain/sessions/SimulationSession';
import { DOLCircuit } from '../domain/circuits/library/DOLCircuit';
import { StarDeltaCircuit } from '../domain/circuits/library/StarDeltaCircuit';
import { ReversingCircuit } from '../domain/circuits/library/ReversingCircuit';

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

  public createSession(caseData: any) {
    this.engine = new DiagnosisEngine();
    
    // circuitId determines which topology to load
    const circuitId = caseData?.circuitId || 'DOL';
    
    this.engine.loadCase(caseData, (solver) => {
      if (circuitId === 'STAR_DELTA') {
        StarDeltaCircuit.setup(solver);
      } else if (circuitId === 'REVERSING') {
        ReversingCircuit.setup(solver);
      } else {
        DOLCircuit.setup(solver);
      }
    });
  }

  public getSessionState(): SimulationState {
    return this.engine.getState();
  }

  public executeAction(action: string, params: any = {}) {
    this.engine.performAction(action, params);
  }

  public measure(nodeId1: string, nodeId2: string): number {
    return this.engine.measureVoltage(nodeId1, nodeId2);
  }

  public answerQuiz(optionIndex: number) {
    this.engine.answerQuiz(optionIndex);
  }


  public async saveSession(sessionId: string, userId: string) {
    console.log(`Saving session ${sessionId} for user ${userId}`);
  }
}
