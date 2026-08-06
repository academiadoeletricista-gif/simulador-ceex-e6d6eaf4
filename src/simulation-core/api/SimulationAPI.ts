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
    this.engine = new DiagnosisEngine(); // Fresh engine for new session
    const circuitType = caseData?.type || 'DOL';
    
    this.engine.loadCircuit((solver) => {
      if (circuitType === 'STAR_DELTA') {
        StarDeltaCircuit.setup(solver);
      } else if (circuitType === 'REVERSING') {
        ReversingCircuit.setup(solver);
      } else {
        DOLCircuit.setup(solver);
      }
    });
    
    // Inject fault based on caseData or random if not specified
    const faults = [FaultType.OPEN_FUSE, FaultType.BROKEN_COIL, FaultType.OPEN_START_BUTTON, FaultType.TRIPPED_RELAY];
    const randomFault = caseData?.faultType || faults[Math.floor(Math.random() * faults.length)];
    const targetComp = caseData?.faultComponent || (randomFault === FaultType.OPEN_FUSE ? 'F1' : 'K1');
    
    this.engine.injectFault(randomFault as FaultType, targetComp);
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
