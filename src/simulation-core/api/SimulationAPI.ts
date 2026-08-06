import { DiagnosisEngine } from '../domain/diagnosis/DiagnosisEngine';
import { SimulationState } from '../domain/sessions/SimulationSession';
import { CircuitSolver } from '../domain/solver/CircuitSolver';
import { SwitchComponent, ContactorComponent, ComponentType } from '../domain/components/ElectricalComponent';

// This is the public API that the UI will consume
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

  // Session Management
  public createSession(caseData: any) {
    // Logic to initialize the engine with specific case data
    // For now, we manually setup the Partida Direta as a proof of concept
    this.engine.loadCircuit((solver) => {
      const nodes = [
        { id: 'L1', voltage: 220, connections: [] },
        { id: 'N', voltage: 0, connections: [] },
        { id: 'n1', voltage: 0, connections: [] },
        { id: 'n2', voltage: 0, connections: [] },
        { id: 'n3', voltage: 0, connections: [] },
        { id: 'n4', voltage: 0, connections: [] },
      ];
      nodes.forEach(n => solver.addNode(n));

      const fuse = new SwitchComponent('F1', ComponentType.FUSE, false);
      fuse.terminals = {
        '1': { id: 't1', name: '1', voltage: 0, nodeId: 'L1' },
        '2': { id: 't2', name: '2', voltage: 0, nodeId: 'n1' }
      };
      solver.addComponent(fuse);

      const emergency = new SwitchComponent('S0', ComponentType.EMERGENCY_STOP, false);
      emergency.terminals = {
        '1': { id: 't1', name: '1', voltage: 0, nodeId: 'n1' },
        '2': { id: 't2', name: '2', voltage: 0, nodeId: 'n2' }
      };
      solver.addComponent(emergency);

      const stop = new SwitchComponent('S1', ComponentType.PUSHBUTTON_STOP, false);
      stop.terminals = {
        '1': { id: 't1', name: '1', voltage: 0, nodeId: 'n2' },
        '2': { id: 't2', name: '2', voltage: 0, nodeId: 'n3' }
      };
      solver.addComponent(stop);

      const start = new SwitchComponent('S2', ComponentType.PUSHBUTTON_START, true);
      start.terminals = {
        '3': { id: 't3', name: '3', voltage: 0, nodeId: 'n3' },
        '4': { id: 't4', name: '4', voltage: 0, nodeId: 'n4' }
      };
      solver.addComponent(start);

      const contactor = new ContactorComponent('K1', ComponentType.CONTACTOR);
      contactor.terminals = {
        'A1': { id: 'tA1', name: 'A1', voltage: 0, nodeId: 'n4' },
        'A2': { id: 'tA2', name: 'A2', voltage: 0, nodeId: 'N' },
        '13': { id: 't13', name: '13', voltage: 0, nodeId: 'n3' },
        '14': { id: 't14', name: '14', voltage: 0, nodeId: 'n4' }
      };
      solver.addComponent(contactor);

      // Inject default fault if needed
      fuse.failureStatus = 'OPEN';
      fuse.updateState();
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

  // Repository bridge (Persistence)
  public async saveSession(sessionId: string, userId: string) {
    // This will eventually call the SessionRepository inside the Core
    console.log(`Saving session ${sessionId} for user ${userId}`);
  }
}
