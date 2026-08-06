import { CircuitSolver } from '../solver/CircuitSolver';
import { SimulationState, SessionStatus } from '../sessions/SimulationSession';
import { ElectricalComponent, SwitchComponent, ContactorComponent } from '../components/ElectricalComponent';

export class DiagnosisEngine {
  private solver: CircuitSolver;
  private components: Map<string, ElectricalComponent> = new Map();
  private history: any[] = [];
  private startTime: number = Date.now();
  private status: SessionStatus = SessionStatus.IN_PROGRESS;
  private currentNodeId: string = 'initial';

  constructor() {
    this.solver = new CircuitSolver();
  }

  loadCircuit(setupFn: (solver: CircuitSolver) => void) {
    setupFn(this.solver);
    this.solver.getComponents().forEach(c => this.components.set(c.id, c));
    this.solver.solve();
  }

  performAction(action: string, params: any = {}) {
    if (this.status === SessionStatus.COMPLETED) return;

    if (action === 'PRESS_START') {
      const start = this.components.get('S2') as SwitchComponent;
      if (start) {
        start.isPressed = true;
        start.updateState();
      }
    } else if (action === 'RELEASE_START') {
      const start = this.components.get('S2') as SwitchComponent;
      if (start) {
        start.isPressed = false;
        start.updateState();
      }
    } else if (action === 'REPLACE_COMPONENT') {
      const comp = this.components.get(params.id);
      if (comp) {
        comp.failureStatus = null;
        comp.updateState();
      }
    }
    
    this.solver.solve();
    this.history.push({ action, params, timestamp: Date.now() });
    
    // Success condition check (abstraction of industrial logic)
    const contactor = this.components.get('K1') as ContactorComponent;
    if (contactor?.isEnergized) {
      this.status = SessionStatus.COMPLETED;
    }
  }

  measureVoltage(nodeId1: string, nodeId2: string): number {
    return this.solver.getVoltageBetween(nodeId1, nodeId2);
  }

  getState(): SimulationState {
    const contactor = this.components.get('K1') as ContactorComponent;
    return {
      history: this.history,
      isMotorRunning: contactor?.isEnergized || false,
      startTime: this.startTime,
      status: this.status,
      currentNodeId: this.currentNodeId,
      xp: 0,
      score: 100,
      components: Array.from(this.components.values()).map(c => ({
        id: c.id,
        type: c.type,
        state: c.state,
        failure: c.failureStatus
      }))
    };
  }
}
