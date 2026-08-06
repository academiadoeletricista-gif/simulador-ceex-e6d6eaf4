import { DiagnosisEngine, FaultType } from '../domain/diagnosis/DiagnosisEngine';
import { SimulationState } from '../domain/sessions/SimulationSession';
import { DOLCircuit } from '../domain/circuits/library/DOLCircuit';

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
    this.engine = new DiagnosisEngine(); // Fresh engine for new session
    this.engine.loadCircuit((solver) => DOLCircuit.setup(solver));
    
    // Inject fault based on caseData or random if not specified
    const faults: FaultType[] = ['OPEN_FUSE', 'BROKEN_COIL', 'OPEN_START_BUTTON', 'TRIPPED_RELAY'];
    const randomFault = faults[Math.floor(Math.random() * faults.length)] as FaultType;
    this.engine.injectFault(randomFault);
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

  public async saveSession(sessionId: string, userId: string) {
    console.log(`Saving session ${sessionId} for user ${userId}`);
  }
}
