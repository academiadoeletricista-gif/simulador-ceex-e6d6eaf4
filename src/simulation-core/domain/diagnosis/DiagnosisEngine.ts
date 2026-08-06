import { CircuitSolver } from '../solver/CircuitSolver';
import { SimulationState, SessionStatus } from '../sessions/SimulationSession';
import { ElectricalComponent, SwitchComponent, ContactorComponent } from '../components/ElectricalComponent';
import { CircuitBreakerComponent, ThermalRelayComponent } from '../components/IndustrialComponents';

export type FaultType = 
  | 'OPEN_FUSE' 
  | 'BROKEN_COIL' 
  | 'SHORTED_COIL' 
  | 'OPEN_START_BUTTON' 
  | 'OPEN_STOP_BUTTON' 
  | 'BROKEN_AUX_CONTACT' 
  | 'WELDED_AUX_CONTACT' 
  | 'TRIPPED_RELAY' 
  | 'BROKEN_WIRE' 
  | 'LOOSE_TERMINAL' 
  | 'MISSING_VOLTAGE' 
  | 'MECHANICAL_FAILURE';

export class DiagnosisEngine {
  private solver: CircuitSolver;
  private components: Map<string, ElectricalComponent> = new Map();
  private history: any[] = [];
  private startTime: number = Date.now();
  private status: SessionStatus = SessionStatus.IN_PROGRESS;
  private activeFault: FaultType | null = null;

  constructor() {
    this.solver = new CircuitSolver();
  }

  loadCircuit(setupFn: (solver: CircuitSolver) => void) {
    setupFn(this.solver);
    this.solver.getComponents().forEach(c => {
      this.components.set(c.id, c);
      c.updateState();
    });
    this.solver.solve();
  }

  injectFault(type: FaultType) {
    this.activeFault = type;
    
    switch (type) {
      case 'OPEN_FUSE':
        const fuse = this.components.get('F1');
        if (fuse) fuse.failureStatus = 'OPEN';
        break;
      case 'BROKEN_COIL':
        const k1 = this.components.get('K1');
        if (k1) k1.failureStatus = 'BURNT_COIL';
        break;
      case 'SHORTED_COIL':
        const k1_short = this.components.get('K1');
        if (k1_short) k1_short.failureStatus = 'SHORTED_COIL';
        break;
      case 'OPEN_START_BUTTON':
        const s2 = this.components.get('S2');
        if (s2) s2.failureStatus = 'STUCK_OPEN';
        break;
      case 'OPEN_STOP_BUTTON':
        const s1 = this.components.get('S1');
        if (s1) s1.failureStatus = 'STUCK_OPEN';
        break;
      case 'BROKEN_AUX_CONTACT':
        const k1_aux = this.components.get('K1');
        if (k1_aux) k1_aux.failureStatus = 'BROKEN_AUX';
        break;
      case 'TRIPPED_RELAY':
        const f2 = this.components.get('F2') as ThermalRelayComponent;
        if (f2) f2.isTripped = true;
        break;
      case 'MECHANICAL_FAILURE':
        const k1_mech = this.components.get('K1');
        if (k1_mech) k1_mech.failureStatus = 'MECHANICAL_STUCK';
        break;
    }
    
    this.components.forEach(c => c.updateState());
    this.solver.solve();
  }

  performAction(action: string, params: any = {}) {
    if (this.status === SessionStatus.COMPLETED) return;

    let observation = "Ação executada.";

    if (action === 'PRESS_START') {
      const start = this.components.get('S2') as SwitchComponent;
      if (start) {
        start.isPressed = true;
        observation = "Botão START pressionado.";
      }
    } else if (action === 'RELEASE_START') {
      const start = this.components.get('S2') as SwitchComponent;
      if (start) {
        start.isPressed = false;
        observation = "Botão START solto.";
      }
    } else if (action === 'TOGGLE_BREAKER') {
      const breaker = this.components.get(params.id) as CircuitBreakerComponent;
      if (breaker) {
        breaker.toggle();
        observation = `Disjuntor ${params.id} ${breaker.isClosed ? 'ligado' : 'desligado'}.`;
      }
    } else if (action === 'RESET_RELAY') {
      const relay = this.components.get('F2') as ThermalRelayComponent;
      if (relay) {
        relay.reset();
        observation = "Relé térmico resetado.";
      }
    } else if (action === 'REPLACE_COMPONENT') {
      const comp = this.components.get(params.id);
      if (comp) {
        comp.failureStatus = null;
        if (comp instanceof ThermalRelayComponent) comp.isTripped = false;
        observation = `Componente ${params.id} substituído por um novo.`;
      }
    }
    
    this.components.forEach(c => c.updateState());
    this.solver.solve();
    
    this.history.push({ 
      action, 
      params, 
      observation,
      timestamp: Date.now() 
    });
    
    // Check success: Is the contactor energized AND staying energized (seal)?
    const k1 = this.components.get('K1') as ContactorComponent;
    if (k1?.isEnergized) {
      // In a real DOL, if we release start and it stays on, it's a success
      // For now, simple energized check
      this.status = SessionStatus.COMPLETED;
    }
  }

  measureVoltage(nodeId1: string, nodeId2: string): number {
    return this.solver.getVoltageBetween(nodeId1, nodeId2);
  }

  getState(): SimulationState {
    const k1 = this.components.get('K1') as ContactorComponent;
    return {
      history: this.history,
      isMotorRunning: k1?.isEnergized || false,
      startTime: this.startTime,
      status: this.status,
      currentNodeId: 'sim',
      xp: 0,
      score: 100,
      components: Array.from(this.components.values()).map(c => ({
        id: c.id,
        type: c.type,
        state: c.state,
        failure: c.failureStatus,
        isEnergized: (c as any).isEnergized || false,
        isClosed: (c as any).isClosed ?? null,
      }))
    };
  }
}
